#!/usr/bin/env node
import {spawn, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const die = (msg) => {
  // eslint-disable-next-line no-console
  console.error(msg);
  process.exit(1);
};

const getArg = (name) => {
  const idx = process.argv.indexOf(name);
  if (idx === -1) return null;
  const next = process.argv[idx + 1];
  if (!next || next.startsWith('--')) return '';
  return next;
};

const hasFlag = (name) => process.argv.includes(name);

const comp = getArg('--comp') || 'TextEffects';
const fromSeconds = getArg('--from');
const toSeconds = getArg('--to');
const preview = hasFlag('--preview');
const scale = getArg('--scale');
const crf = getArg('--crf');
const concurrency = getArg('--concurrency');
const delayRenderTimeoutMs = getArg('--delay-render-timeout-ms');
const storagePrefix = getArg('--storage-prefix') || 'share';

if (hasFlag('--help') || hasFlag('-h')) {
  // eslint-disable-next-line no-console
  console.log(`
Usage:
  npm run render:cloud -- [--comp <Name>] [--preview] [--from <sec>] [--to <sec>]
                       [--scale <n>] [--crf <n>]
                       [--concurrency <n>] [--delay-render-timeout-ms <ms>]
                       [--storage-prefix <share|cache|permanent>]

Notes:
  - Requires Modal secret 'r2-secret' for uploads.
  - Render is by git SHA: working tree must be clean and pushed.
  - This command runs Modal in detached mode so closing your terminal won't cancel the render.
`.trim());
  process.exit(0);
}

const gitClean = spawnSync('git', ['status', '--porcelain=v1'], {encoding: 'utf8'});
if (gitClean.status !== 0) {
  die(gitClean.stderr || 'Failed to check git status');
}
if ((gitClean.stdout || '').trim().length > 0) {
  die('Working tree is dirty. Commit + push before cloud rendering (render is by git SHA).');
}

const shaRes = spawnSync('git', ['rev-parse', 'HEAD'], {encoding: 'utf8'});
if (shaRes.status !== 0) {
  die(shaRes.stderr || 'Failed to get git SHA');
}
const gitSha = String(shaRes.stdout || '').trim();
if (!gitSha) die('Failed to determine git SHA');

const modalRepoDir = path.resolve('..', 'modal_functions');
const modalBinCandidate = path.join(modalRepoDir, 'venv', 'bin', 'modal');
const modalBin = fs.existsSync(modalBinCandidate) ? modalBinCandidate : 'modal';

const args = [
  'run',
  '-d',
  '--timestamps',
  '-m',
  'src.functions.video.render_remotion_cloud',
  '--git-sha',
  gitSha,
  '--composition-id',
  comp,
  '--storage-prefix',
  storagePrefix,
];

if (preview) args.push('--no-hq');
else args.push('--hq');
if (fromSeconds) args.push('--from-seconds', fromSeconds);
if (toSeconds) args.push('--to-seconds', toSeconds);
if (scale) args.push('--scale', scale);
if (crf) args.push('--crf', crf);
if (concurrency) args.push('--concurrency', concurrency);
if (delayRenderTimeoutMs) args.push('--delay-render-timeout-ms', delayRenderTimeoutMs);

let appId = null;
let foundUrl = null;
const appIdRe = /\bap-[A-Za-z0-9]+\b/;
const urlRe = /(https?:\/\/\S+?\.mp4)\b/;

const runProc = spawn(modalBin, args, {cwd: modalRepoDir, stdio: ['ignore', 'pipe', 'pipe']});

const onChunk = (chunk) => {
  const text = String(chunk || '');
  process.stdout.write(text);

  if (!appId) {
    const m = text.match(appIdRe);
    if (m && m[0]) {
      appId = m[0];
      // eslint-disable-next-line no-console
      console.log(`\nModal app: ${appId}\n`);
    }
  }

  if (!foundUrl) {
    const m = text.match(urlRe);
    if (m && m[1]) {
      foundUrl = m[1];
      // eslint-disable-next-line no-console
      console.log(`\nFINAL_URL: ${foundUrl}\n`);
    }
  }
};

runProc.stdout.on('data', onChunk);
runProc.stderr.on('data', onChunk);
runProc.on('exit', (code) => {
  if (code === 0) process.exit(0);
  die(
    `Modal render exited with code ${code ?? 'unknown'}.` +
      (appId ? ` App: ${appId}` : '')
  );
});
