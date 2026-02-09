#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
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
const storagePrefix = getArg('--storage-prefix') || 'share';

if (hasFlag('--help') || hasFlag('-h')) {
  // eslint-disable-next-line no-console
  console.log(`
Usage:
  npm run render:cloud -- [--comp <Name>] [--preview] [--from <sec>] [--to <sec>]
                       [--scale <n>] [--crf <n>] [--storage-prefix <share|cache|permanent>]

Notes:
  - Requires Modal secret 'r2-secret' for uploads.
  - Render is by git SHA: working tree must be clean and pushed.
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
  '-q',
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

const res = spawnSync(modalBin, args, {stdio: 'inherit', cwd: modalRepoDir});
process.exit(res.status ?? 1);
