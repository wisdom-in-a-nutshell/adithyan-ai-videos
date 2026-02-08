#!/usr/bin/env node
import {spawnSync} from 'node:child_process';

const FPS = 24; // TextEffects comp uses 24fps in `src/Root.js`.

const toNumber = (v) => {
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

const fromSeconds = toNumber(getArg('--from'));
const toSeconds = toNumber(getArg('--to'));
const isPreview = hasFlag('--preview');
const noOpen = hasFlag('--no-open');

const scale = toNumber(getArg('--scale')) ?? (isPreview ? 0.25 : null);
const crf = toNumber(getArg('--crf')) ?? (isPreview ? 28 : null);

const out =
  getArg('--out') ||
  (isPreview ? '/tmp/text-effects-preview.mp4' : '/tmp/text-effects.mp4');

const args = ['remotion', 'render', 'src/index.js', 'TextEffects', out, '--overwrite'];
if (scale !== null) args.push(`--scale=${scale}`);
if (crf !== null) args.push(`--crf=${crf}`);

if (fromSeconds !== null || toSeconds !== null) {
  const from = Math.max(0, fromSeconds ?? 0);
  const to = Math.max(from, toSeconds ?? from + 5); // default 5s clip if only --from is passed
  const fromFrame = Math.floor(from * FPS);
  const toFrame = Math.max(fromFrame, Math.ceil(to * FPS) - 1); // inclusive range
  args.push(`--frames=${fromFrame}-${toFrame}`);
}

const res = spawnSync('npx', args, {stdio: 'inherit'});
if (res.status !== 0) {
  process.exit(res.status ?? 1);
}

if (!noOpen && process.platform === 'darwin') {
  spawnSync('open', [out], {stdio: 'ignore'});
}

