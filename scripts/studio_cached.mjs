#!/usr/bin/env node
/**
 * Start Remotion Studio with a local asset cache (code-first, default-on).
 *
 * By default, this scans `src/projects/*/assets.js`, downloads any exported
 * remote URLs once (stable filename = sha1(url)), and injects an `assetMap` prop
 * so compositions can transparently swap remote URLs for `--public-dir` files.
 *
 * Usage:
 *   npm start
 *   npm run studio:cached
 *
 * Flags:
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

const refresh = hasFlag('refresh');
const cacheBaseDir = getArg('cache-dir', getDefaultCacheBaseDir());

const projectsDir = path.resolve('src', 'projects');
if (!fs.existsSync(projectsDir)) {
  die(`Missing projects dir: ${projectsDir}`);
}

const projectIds = fs
  .readdirSync(projectsDir, {withFileTypes: true})
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

const urls = [];
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

const cache = await prepareAssetCache({
  cacheKey: 'studio',
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
        cachedProject: 'studio',
        cachedAt: new Date().toISOString(),
      },
      null,
      2
  )}\n`,
  'utf-8'
);

// eslint-disable-next-line no-console
console.log(`[cache] dir=${cache.projectCacheDir} urls=${urls.length}`);

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
console.log('[studio] open and pick a composition');

const res = spawnSync('npx', cmdArgs, {stdio: 'inherit'});
process.exit(res.status ?? 1);
