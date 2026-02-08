#!/usr/bin/env node
import {spawnSync} from 'node:child_process';

const stripAnsi = (input) =>
  String(input).replace(
    // eslint-disable-next-line no-control-regex
    /\u001b\[[0-9;]*m/g,
    ''
  );

const toNumber = (v) => {
  if (v === null || v === undefined || v === '') {
    return null;
  }
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const getArg = (name) => {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return null;
  const next = process.argv[idx + 1];
  if (!next || next.startsWith('--')) return '';
  return next;
};

const hasFlag = (name) => process.argv.includes(name);

const printHelp = () => {
  // Keep this short and operational.
  // Examples assume macOS; output auto-opens unless you pass --no-open.
  // eslint-disable-next-line no-console
  console.log(`
Usage:
  npm run render -- [--comp <Name>] [--preview] [--from <sec>] [--to <sec>]
                 [--scale <n>] [--crf <n>] [--out <path>] [--no-open]

Defaults:
  --comp     TextEffects
  --out      /tmp/<comp>.mp4 (or /tmp/<comp>-preview.mp4 if --preview)

Preview preset:
  --preview  sets --scale 0.25 and --crf 28 (override with explicit --scale/--crf)

Render only a time slice (seconds -> frames based on composition fps):
  --from 0 --to 5

Examples:
  npm run render
  npm run render -- --preview
  npm run render -- --preview --from 0 --to 6
  npm run render -- --comp OcclusionDemo --from 0 --to 3
  npm run render -- --comp ActiveSpeakerDetection --preview --from 10 --to 20
`.trim());
};

const entry = 'src/index.js';
const comp = getArg('--comp') || 'TextEffects';
const isPreview = hasFlag('--preview');
const noOpen = hasFlag('--no-open');
const fromSeconds = toNumber(getArg('--from'));
const toSeconds = toNumber(getArg('--to'));

const scale = toNumber(getArg('--scale')) ?? (isPreview ? 0.25 : null);
const crf = toNumber(getArg('--crf')) ?? (isPreview ? 28 : null);

const out =
  getArg('--out') ||
  (isPreview ? `/tmp/${comp}-preview.mp4` : `/tmp/${comp}.mp4`);

if (hasFlag('--help') || hasFlag('-h')) {
  printHelp();
  process.exit(0);
}

const listRes = spawnSync(
  'npx',
  ['remotion', 'compositions', entry],
  {encoding: 'utf8'}
);
if (listRes.status !== 0) {
  process.stderr.write(listRes.stderr || '');
  process.exit(listRes.status ?? 1);
}

const compositionsText = stripAnsi(listRes.stdout || '');
const compLines = compositionsText
  .split('\n')
  .map((l) => l.trimEnd())
  .filter((l) => l && !l.startsWith('Bundling') && !l.startsWith('Bundled'));

const comps = [];
for (const line of compLines) {
  // Example:
  // TextEffects               24      1280x720       1397 (58.21 sec)
  const m = line.match(/^(\S+)\s+(\d+)\s+(\d+)x(\d+)\s+(\d+)\s+\(/);
  if (!m) continue;
  comps.push({
    id: m[1],
    fps: Number(m[2]),
    width: Number(m[3]),
    height: Number(m[4]),
    durationInFrames: Number(m[5]),
  });
}

const meta = comps.find((c) => c.id === comp);
if (!meta) {
  process.stderr.write(`Unknown composition: ${comp}\n\nAvailable:\n`);
  for (const c of comps) {
    process.stderr.write(`- ${c.id}\n`);
  }
  process.exit(1);
}

const renderArgs = ['remotion', 'render', entry, comp, out, '--overwrite'];
if (scale !== null) renderArgs.push('--scale', String(scale));
if (crf !== null) renderArgs.push('--crf', String(crf));

if (fromSeconds !== null || toSeconds !== null) {
  const from = Math.max(0, fromSeconds ?? 0);
  const to = Math.max(from, toSeconds ?? from + 5);
  const fromFrame = Math.floor(from * meta.fps);
  const toFrame = Math.max(fromFrame, Math.ceil(to * meta.fps) - 1);
  renderArgs.push('--frames', `${fromFrame}-${toFrame}`);
}

const renderRes = spawnSync('npx', renderArgs, {stdio: 'inherit'});
if (renderRes.status !== 0) {
  process.exit(renderRes.status ?? 1);
}

if (!noOpen && process.platform === 'darwin') {
  spawnSync('open', [out], {stdio: 'ignore'});
}
