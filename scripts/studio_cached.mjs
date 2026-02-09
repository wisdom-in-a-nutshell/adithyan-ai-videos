#!/usr/bin/env node
/**
 * Start Remotion Studio with a local asset cache (code-first).
 *
 * This reads URLs directly from `src/projects/<project>/assets.js`, downloads them
 * once, and injects an `assetMap` prop so compositions can swap remote URLs for
 * `--public-dir` local files.
 *
 * Usage:
 *   npm run studio:cached
 *   npm run studio:cached -- --project text-effects --comp TextEffects
 *
 * Flags:
 *   --project <id>      (default: text-effects)
 *   --comp <CompId>     (default: TextEffects)
 *   --cache-dir <dir>   (default: WIN_REMOTION_ASSET_CACHE or ~/.cache/win-remotion-assets)
 *   --refresh           re-download even if cached
 */

import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {getDefaultCacheBaseDir, prepareAssetCache} from './asset_cache.mjs';

const die = (msg) => {
  // eslint-disable-next-line no-console
  console.error(msg);
  process.exit(1);
};

const args = process.argv.slice(2);

const getArg = (name, fallback) => {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1) return fallback;
  const next = args[idx + 1];
  if (!next || next.startsWith('--')) die(`Missing value for --${name}`);
  return next;
};

const hasFlag = (name) => args.includes(`--${name}`);

const project = getArg('project', 'text-effects');
const comp = getArg('comp', 'TextEffects');
const refresh = hasFlag('refresh');
const cacheBaseDir = getArg('cache-dir', getDefaultCacheBaseDir());

const assetsPath = path.resolve('src', 'projects', project, 'assets.js');
if (!fs.existsSync(assetsPath)) {
  die(`Missing assets file: ${assetsPath}`);
}

const assets = await import(pathToFileURL(assetsPath).href);
const urls = Object.values(assets).filter((v) => typeof v === 'string' && /^https?:\/\//i.test(v));

const cache = await prepareAssetCache({
  cacheKey: project,
  urls,
  cacheBaseDir,
  refresh,
});

const propsPath = path.join(cache.projectCacheDir, 'studio-props.json');
fs.writeFileSync(
  propsPath,
  `${JSON.stringify(
    {
      assetMap: cache.assetMap,
      cachedProject: project,
      cachedAt: new Date().toISOString(),
    },
    null,
    2
  )}\n`,
  'utf-8'
);

// eslint-disable-next-line no-console
console.log(`[cache] project=${project} dir=${cache.projectCacheDir}`);

const entry = 'src/index.js';
const cmdArgs = [
  'remotion',
  'studio',
  entry,
  '--props',
  propsPath,
  '--public-dir',
  cache.projectCacheDir,
];

// eslint-disable-next-line no-console
console.log(`[studio] open and pick composition: ${comp}`);

const res = spawnSync('npx', cmdArgs, {stdio: 'inherit'});
process.exit(res.status ?? 1);

