#!/usr/bin/env node
/**
 * Start Remotion Studio using a project.json, with an optional local asset cache.
 *
 * Usage:
 *   node scripts/studio_project.mjs projects/occlusion-demo/project.json --comp OcclusionDemo
 *
 * Flags:
 *   --cache-dir <dir>   Cache root (default: ~/.cache/win-remotion-assets)
 *   --no-cache          Disable asset caching (use remote URLs directly)
 *   --refresh           Re-download assets even if cached
 *   --prepare-only      Only download assets + write props, don't start Studio
 */

import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {getDefaultCacheBaseDir, prepareProjectAssetCache} from './asset_cache.mjs';

const die = (msg) => {
  // eslint-disable-next-line no-console
  console.error(msg);
  process.exit(1);
};

const args = process.argv.slice(2);
const projectPath = args[0];
if (!projectPath || projectPath.startsWith('--')) {
  die('Usage: node scripts/studio_project.mjs <project.json> [--comp ...]');
}

const getArg = (name, fallback) => {
  const idx = args.indexOf(`--${name}`);
  if (idx === -1) {
    return fallback;
  }
  const value = args[idx + 1];
  if (!value || value.startsWith('--')) {
    die(`Missing value for --${name}`);
  }
  return value;
};

const hasFlag = (name) => args.includes(`--${name}`);

const comp = getArg('comp', 'OcclusionDemo');
const refreshCache = hasFlag('refresh');
const noCache = hasFlag('no-cache');
const prepareOnly = hasFlag('prepare-only');
const cacheBaseDir = getArg('cache-dir', getDefaultCacheBaseDir());

const raw = fs.readFileSync(projectPath, 'utf-8');
const project = JSON.parse(raw);
const id = project.id ?? path.basename(path.dirname(projectPath));
const projectDir = path.dirname(projectPath);

const props = {
  videoUrl: project.video_url ?? project.videoUrl,
};

if (!props.videoUrl) {
  die(`Project is missing video_url/videoUrl: ${projectPath}`);
}

const mattingPath = path.join(projectDir, 'matting.json');
if (fs.existsSync(mattingPath)) {
  try {
    const mattingPayload = JSON.parse(fs.readFileSync(mattingPath, 'utf-8'));
    const alphaUrl = mattingPayload?.alpha_url ?? mattingPayload?.alphaUrl ?? undefined;
    if (typeof alphaUrl === 'string' && alphaUrl.length > 0) {
      props.alphaUrl = alphaUrl;
    }
  } catch (err) {
    die(`Failed to parse ${mattingPath}: ${err}`);
  }
}

const transcriptPath = path.join(projectDir, 'transcript.json');
if (fs.existsSync(transcriptPath)) {
  try {
    const transcriptPayload = JSON.parse(fs.readFileSync(transcriptPath, 'utf-8'));
    if (Array.isArray(transcriptPayload)) {
      props.transcriptWords = transcriptPayload;
    } else if (transcriptPayload && typeof transcriptPayload === 'object') {
      if (Array.isArray(transcriptPayload.words)) {
        props.transcriptWords = transcriptPayload.words;
        props.transcriptSourceId = transcriptPayload.source_id ?? transcriptPayload.sourceId ?? null;
      } else {
        props.transcriptWords = transcriptPayload;
      }
    } else {
      props.transcriptWords = transcriptPayload;
    }
  } catch (err) {
    die(`Failed to parse ${transcriptPath}: ${err}`);
  }
}

const storyboardPath = path.join(projectDir, 'storyboard.json');
if (fs.existsSync(storyboardPath)) {
  try {
    const storyboardPayload = JSON.parse(fs.readFileSync(storyboardPath, 'utf-8'));
    if (storyboardPayload && typeof storyboardPayload === 'object') {
      props.storyboard = storyboardPayload;
    }
  } catch (err) {
    die(`Failed to parse ${storyboardPath}: ${err}`);
  }
}

let publicDir = null;
let propsPath = path.join(cacheBaseDir, id, 'studio-props.json');

if (!noCache) {
  const cache = await prepareProjectAssetCache({
    projectId: id,
    videoUrl: props.videoUrl,
    alphaUrl: props.alphaUrl ?? null,
    cacheBaseDir,
    refresh: refreshCache,
  });

  publicDir = cache.projectCacheDir;
  propsPath = path.join(cache.projectCacheDir, 'studio-props.json');

  if (cache.cachedVideo) {
    props.videoUrl = `/${cache.cachedVideo.filename}`;
  }
  if (cache.cachedAlpha) {
    props.alphaUrl = `/${cache.cachedAlpha.filename}`;
  }
}

fs.mkdirSync(path.dirname(propsPath), {recursive: true});
fs.writeFileSync(propsPath, `${JSON.stringify(props, null, 2)}\n`, 'utf-8');

if (prepareOnly) {
  // eslint-disable-next-line no-console
  console.log(`[OK] Prepared ${propsPath}${publicDir ? ` (public dir: ${publicDir})` : ''}`);
  process.exit(0);
}

const entry = 'src/index.js';
const cmdArgs = ['remotion', 'studio', entry, '--props', propsPath];
if (publicDir) {
  cmdArgs.push('--public-dir', publicDir);
}

// Remotion Studio itself lets you switch compositions in the UI; `--comp` is
// just a convenience so you can bookmark/share commands consistently.
if (comp) {
  // eslint-disable-next-line no-console
  console.log(`[INFO] Open Studio and pick composition: ${comp}`);
}

const res = spawnSync('npx', cmdArgs, {stdio: 'inherit'});
process.exit(res.status ?? 1);
