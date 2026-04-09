#!/usr/bin/env node
/**
 * Start Remotion Studio with a local asset cache (code-first, default-on).
 *
 * By default, this scans `src/projects/<project-id>/assets.js`, downloads any exported
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
 *   --prepare-only      download + write props, don't start Studio
 */

import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {getDefaultCacheBaseDir, prepareAssetCache, prepareMergedPublicDir} from './asset_cache.mjs';
import {collectProjectAssetRefs, getProjectDirsForRender} from './project_assets.mjs';
import {
  TEMP_CLEANUP_HELP_TEXT,
  logTempCleanupSummary,
  parseTempCleanupArgs,
  pruneRemotionTempDirs,
} from './remotion_runtime.mjs';

const die = (msg) => {
  // eslint-disable-next-line no-console
  console.error(msg);
  process.exit(1);
};

const printHelp = () => {
  // eslint-disable-next-line no-console
  console.log(`
Usage:
  npm start -- [options]
  npm run studio:cached -- [options]

Flags:
  --cache-dir <dir>             default: WIN_REMOTION_ASSET_CACHE or ~/.cache/win-remotion-assets
  --refresh                     re-download even if cached
  --prepare-only                download + write props, do not start Studio
  ${TEMP_CLEANUP_HELP_TEXT.replace(/\n/g, '\n  ')}
`.trim());
};

let parsed = null;
try {
  parsed = parseTempCleanupArgs(process.argv.slice(2));
} catch (error) {
  die(error instanceof Error ? error.message : String(error));
}

const args = parsed.args;

const getArg = (name, fallback) => {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1) return fallback;
  const next = args[idx + 1];
  if (!next || next.startsWith('--')) die(`Missing value for --${name}`);
  return next;
};

const hasFlag = (name) => args.includes(`--${name}`);

if (args.includes('--help') || args.includes('-h')) {
  printHelp();
  process.exit(0);
}

const cleanupSummary = pruneRemotionTempDirs(parsed.tempCleanup);
logTempCleanupSummary(cleanupSummary);

const refresh = hasFlag('refresh');
const prepareOnly = hasFlag('prepare-only');
const cacheBaseDir = getArg('cache-dir', getDefaultCacheBaseDir());

const projectDirs = await getProjectDirsForRender();
if (projectDirs.length === 0) {
  die('No enabled project compositions found in src/projects/registry.js');
}
const assetRefs = await collectProjectAssetRefs({projectDirs});

const cache = await prepareAssetCache({
  cacheKey: 'assets',
  urls: assetRefs.remoteUrls,
  cacheBaseDir,
  refresh,
});

if (cache.failed.length > 0) {
  console.warn(`[cache] skipped ${cache.failed.length} asset download failure(s):`);
  for (const failure of cache.failed) {
    console.warn(`  - ${failure.error}`);
  }
}

const mergedPublicDir = prepareMergedPublicDir({
  projectCacheDir: cache.projectCacheDir,
  repoPublicDir: path.resolve('public'),
  localPublicPaths: assetRefs.localPublicPaths,
  cachedPublicFiles: Object.values(cache.assetMap).map((value) => value.replace(/^\//, '')),
});

const propsPath = path.join(cache.projectCacheDir, 'studio-props.json');
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

if (prepareOnly) {
  // eslint-disable-next-line no-console
  console.log(`[ok] prepared props: ${propsPath}`);
  process.exit(0);
}

// eslint-disable-next-line no-console
console.log(
  `[cache] dir=${cache.projectCacheDir} urls=${assetRefs.remoteUrls.length} local=${assetRefs.localPublicPaths.length}`
);

const entry = 'src/index.js';
const cmdArgs = [
  'remotion',
  'studio',
  entry,
  '--props',
  propsPath,
  '--public-dir',
  mergedPublicDir,
];

// eslint-disable-next-line no-console
console.log('[studio] open and pick a composition');

const res = spawnSync('npx', cmdArgs, {stdio: 'inherit'});
process.exit(res.status ?? 1);
