#!/usr/bin/env node
/**
 * Render + verify a Remotion project.json in a repeatable way.
 *
 * Usage:
 *   node scripts/render_project.mjs projects/occlusion-demo/project.json \
 *     --comp OcclusionDemo \
 *     --out /tmp/occlusion-demo.mp4 \
 *     --seconds 5 \
 *     --fps 24 \
 *     --stills
 *
 * Notes:
 * - We pass project values via `--props` so the same composition can be reused.
 * - Prefer short renders and a few stills while iterating. Studio playback can mislead.
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

const normalizeWord = (value) => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().toLowerCase().replace(/[^\w%]+/g, '');
};

const getHeroTimingFrames = ({transcriptWords, fps}) => {
  if (!Array.isArray(transcriptWords) || transcriptWords.length === 0) {
    return [];
  }

  const onlyWords = transcriptWords.filter((w) => w?.type === 'word' && typeof w?.text === 'string');
  if (onlyWords.length === 0) {
    return [];
  }

  for (let i = 0; i < onlyWords.length - 1; i++) {
    const w0 = normalizeWord(onlyWords[i].text);
    const w1 = normalizeWord(onlyWords[i + 1].text);
    if (w0 !== 'this' || w1 !== 'video') {
      continue;
    }

    const percentIdx = onlyWords.findIndex((w, idx) => idx > i && normalizeWord(w.text) === '100%');
    const editedIdx = onlyWords.findIndex((w, idx) => idx > i && normalizeWord(w.text) === 'edited');
    const codexIdx = onlyWords.findIndex((w, idx) => idx > i && normalizeWord(w.text).startsWith('codex'));

    const seconds = [
      Number(onlyWords[i].start),
      Number(onlyWords[i + 1].start),
      percentIdx === -1 ? null : Number(onlyWords[percentIdx].start),
      editedIdx === -1 ? null : Number(onlyWords[editedIdx].start),
      codexIdx === -1 ? null : Number(onlyWords[codexIdx].start),
      codexIdx === -1 ? null : Number(onlyWords[codexIdx].end),
    ].filter((v) => Number.isFinite(v));

    return seconds.map((s) => Math.max(0, Math.round(s * fps)));
  }

  return [];
};

const args = process.argv.slice(2);
const projectPath = args[0];
if (!projectPath || projectPath.startsWith('--')) {
  die('Usage: node scripts/render_project.mjs <project.json> [--comp ...] [--out ...]');
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
const out = getArg('out', undefined);
const seconds = Number(getArg('seconds', '5'));
const fps = Number(getArg('fps', '24'));
const doStills = !hasFlag('no-stills'); // default on
const openOutputs = hasFlag('open');
const refreshCache = hasFlag('refresh');
const noCache = hasFlag('no-cache');
const prepareOnly = hasFlag('prepare-only');
const cacheBaseDir = getArg('cache-dir', getDefaultCacheBaseDir());

if (!Number.isFinite(seconds) || seconds <= 0) {
  die(`Invalid --seconds: ${seconds}`);
}
if (!Number.isFinite(fps) || fps <= 0) {
  die(`Invalid --fps: ${fps}`);
}

const raw = fs.readFileSync(projectPath, 'utf-8');
const project = JSON.parse(raw);

const id = project.id ?? path.basename(path.dirname(projectPath));
const projectDir = path.dirname(projectPath);
const outputPath = out ?? `/tmp/${id}.mp4`;

// Minimal contract: allow snake_case project.json while passing camelCase props.
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

let publicDir = null;
if (!noCache) {
  const cache = await prepareProjectAssetCache({
    projectId: id,
    videoUrl: props.videoUrl,
    alphaUrl: props.alphaUrl ?? null,
    cacheBaseDir,
    refresh: refreshCache,
  });
  publicDir = cache.projectCacheDir;

  if (cache.cachedVideo) {
    props.videoUrl = `/${cache.cachedVideo.filename}`;
  }
  if (cache.cachedAlpha) {
    props.alphaUrl = `/${cache.cachedAlpha.filename}`;
  }

  if (prepareOnly) {
    // eslint-disable-next-line no-console
    console.log(`[OK] Prepared asset cache in ${cache.projectCacheDir}`);
    process.exit(0);
  }
}

const frames = Math.max(1, Math.round(seconds * fps));
const framesArg = `0-${frames - 1}`;

const run = (cmd, cmdArgs) => {
  const res = spawnSync(cmd, cmdArgs, {stdio: 'inherit'});
  if (res.status !== 0) {
    die(`[FAIL] ${cmd} ${cmdArgs.join(' ')}`);
  }
};

const entry = 'src/index.js';
const propsJson = JSON.stringify(props);

const commonArgs = [];
if (publicDir) {
  commonArgs.push('--public-dir', publicDir);
}

run('npx', [
  'remotion',
  'render',
  entry,
  comp,
  outputPath,
  '--frames',
  framesArg,
  '--props',
  propsJson,
  ...commonArgs,
]);

if (doStills) {
  const stillDir = `/tmp/${id}-stills`;
  fs.mkdirSync(stillDir, {recursive: true});
  const stillFramesSet = new Set([
    Math.min(frames - 1, Math.round(0.25 * fps)),
    Math.min(frames - 1, Math.round(1 * fps)),
    Math.min(frames - 1, Math.round(2.5 * fps)),
    Math.min(frames - 1, Math.round(4 * fps)),
  ]);

  for (const f of getHeroTimingFrames({transcriptWords: props.transcriptWords, fps})) {
    stillFramesSet.add(Math.min(frames - 1, f));
    stillFramesSet.add(Math.min(frames - 1, Math.max(0, f - 1)));
    stillFramesSet.add(Math.min(frames - 1, f + 1));
  }

  const stillFrames = Array.from(stillFramesSet).sort((a, b) => a - b);
  for (const f of stillFrames) {
    const stillPath = path.join(stillDir, `frame-${String(f).padStart(4, '0')}.png`);
    run('npx', [
      'remotion',
      'still',
      entry,
      comp,
      stillPath,
      '--frame',
      String(f),
      '--props',
      propsJson,
      ...commonArgs,
    ]);
  }
  if (openOutputs) {
    run('open', [stillDir]);
  }
}

if (openOutputs) {
  run('open', [outputPath]);
}

// eslint-disable-next-line no-console
console.log(`[OK] Rendered ${outputPath}`);
