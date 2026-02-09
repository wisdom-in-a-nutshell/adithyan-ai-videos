#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {getDefaultCacheBaseDir, prepareAssetCache, prepareMergedPublicDir} from './asset_cache.mjs';

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
  npm run render -- [--comp <Name>] [--from <sec>] [--to <sec>]
                 [--preview|--hq] [--scale <n>] [--crf <n>]
                 [--out <path>] [--no-open] [--no-cache] [--refresh]

Defaults:
  --comp     TextEffects
  --preview  on (fast iteration)
  --out      /tmp/<comp>.mp4
  caching    on (downloads remote URLs from src/projects/*/assets.js into ~/.cache)

Preview preset:
  --preview  sets --scale 0.25 and --crf 28 (override with explicit --scale/--crf)
  --hq       disables preview defaults (full-res render)

Render only a time slice (seconds -> frames based on composition fps):
  --from 0 --to 5

Examples:
  npm run render               # preview by default
  npm run render -- --hq       # full quality
  npm run render -- --preview --from 0 --to 6
  npm run render -- --comp ActiveSpeakerDetection --preview --from 10 --to 20
  npm run render -- --no-cache # disable caching
`.trim());
};

const entry = 'src/index.js';
const comp = getArg('--comp') || 'TextEffects';
const isHQ = hasFlag('--hq') || hasFlag('--full');
const isPreview = !isHQ;
const noOpen = hasFlag('--no-open');
const useCache = !hasFlag('--no-cache');
const refreshCache = hasFlag('--refresh');
const cacheBaseDir = getArg('--cache-dir') || getDefaultCacheBaseDir();
const fromSeconds = toNumber(getArg('--from'));
const toSeconds = toNumber(getArg('--to'));

const scale = toNumber(getArg('--scale')) ?? (isPreview ? 0.25 : null);
const crf = toNumber(getArg('--crf')) ?? (isPreview ? 28 : null);

const out = getArg('--out') || `/tmp/${comp}.mp4`;

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

// Code-first caching (default-on): cache URLs from `src/projects/*/assets.js` and pass an `assetMap` prop.
if (useCache) {
  const projectsDir = path.resolve('src', 'projects');
  const urls = [];
  if (fs.existsSync(projectsDir)) {
    const projectIds = fs
      .readdirSync(projectsDir, {withFileTypes: true})
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const id of projectIds) {
      const assetsPath = path.resolve(projectsDir, id, 'assets.js');
      if (!fs.existsSync(assetsPath)) continue;
      const assets = await import(pathToFileURL(assetsPath).href);
      for (const v of Object.values(assets)) {
        if (typeof v === 'string' && /^https?:\/\//i.test(v)) {
          urls.push(v);
        }
      }
    }
  }

  const cache = await prepareAssetCache({
    cacheKey: 'assets',
    urls,
    cacheBaseDir,
    refresh: refreshCache,
  });

  const mergedPublicDir = prepareMergedPublicDir({
    projectCacheDir: cache.projectCacheDir,
    repoPublicDir: path.resolve('public'),
  });

  const propsPath = path.join(cache.projectCacheDir, 'render-props.json');
  fs.writeFileSync(
    propsPath,
    `${JSON.stringify(
      {
        assetMap: cache.assetMap,
        cachedProject: 'assets',
        cachedAt: new Date().toISOString(),
      },
      null,
      2
    )}\n`,
    'utf-8'
  );

  renderArgs.push('--props', propsPath, '--public-dir', mergedPublicDir);
}

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
