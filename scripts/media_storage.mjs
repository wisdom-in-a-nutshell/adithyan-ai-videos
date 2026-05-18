#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');
const repoPublicDir = path.join(repoRoot, 'public');
const repoImportsPath = path.join(repoPublicDir, 'imports');
const defaultMediaRoot = '/Volumes/DobbyData/Videos/adithyan-ai-videos';
const mediaRoot = path.resolve(process.env.AI_VIDEOS_MEDIA_ROOT || defaultMediaRoot);
const externalImportsPath = path.join(mediaRoot, 'public', 'imports');

const usage = `Usage:
  node scripts/media_storage.mjs status
  node scripts/media_storage.mjs check [--require-link]
  node scripts/media_storage.mjs link [--apply]

Environment:
  AI_VIDEOS_MEDIA_ROOT  Override media root (default: ${defaultMediaRoot})

Commands:
  status       Print managed media path state and sizes.
  check        Fail if public/imports is a broken symlink or, with --require-link,
               if it is not the managed symlink.
  link         Dry-run moving public/imports to the media root and symlinking it.
  link --apply Apply the move/link operation.
`;

const die = (message) => {
  console.error(`[media-storage] ${message}`);
  process.exit(1);
};

const log = (message) => {
  console.log(`[media-storage] ${message}`);
};

const parseArgs = (argv) => {
  const command = argv[0] || 'status';
  const opts = {
    apply: false,
    requireLink: false,
  };

  for (const arg of argv.slice(1)) {
    if (arg === '--apply') {
      opts.apply = true;
    } else if (arg === '--require-link') {
      opts.requireLink = true;
    } else if (arg === '-h' || arg === '--help') {
      console.log(usage);
      process.exit(0);
    } else {
      die(`Unexpected argument: ${arg}\n\n${usage}`);
    }
  }

  if (!['status', 'check', 'link'].includes(command)) {
    die(`Unknown command: ${command}\n\n${usage}`);
  }

  return {command, opts};
};

const exists = (filePath) => {
  try {
    fs.lstatSync(filePath);
    return true;
  } catch (error) {
    if (error && error.code === 'ENOENT') return false;
    throw error;
  }
};

const realPathOrNull = (filePath) => {
  try {
    return fs.realpathSync(filePath);
  } catch {
    return null;
  }
};

const isDirectoryEmpty = (dirPath) => {
  if (!fs.existsSync(dirPath)) return true;
  return fs.readdirSync(dirPath).length === 0;
};

const pathState = (filePath) => {
  if (!exists(filePath)) {
    return {kind: 'missing'};
  }

  const stat = fs.lstatSync(filePath);
  if (stat.isSymbolicLink()) {
    const target = fs.readlinkSync(filePath);
    const resolved = path.resolve(path.dirname(filePath), target);
    return {
      kind: 'symlink',
      target,
      resolved,
      targetExists: fs.existsSync(resolved),
      realPath: realPathOrNull(filePath),
    };
  }

  if (stat.isDirectory()) {
    return {kind: 'directory', realPath: realPathOrNull(filePath)};
  }

  return {kind: 'other'};
};

const sizeOf = (filePath) => {
  if (!fs.existsSync(filePath)) return 'missing';
  try {
    return execFileSync('du', ['-sh', filePath], {encoding: 'utf8'}).trim().split(/\s+/)[0];
  } catch {
    return 'unknown';
  }
};

const describeState = (label, filePath) => {
  const state = pathState(filePath);
  if (state.kind === 'missing') {
    log(`${label}: missing (${filePath})`);
    return state;
  }
  if (state.kind === 'symlink') {
    const suffix = state.targetExists ? '' : ' [BROKEN]';
    log(`${label}: symlink -> ${state.target}${suffix}`);
    log(`${label} size: ${sizeOf(filePath)}`);
    return state;
  }
  if (state.kind === 'directory') {
    log(`${label}: directory (${filePath})`);
    log(`${label} size: ${sizeOf(filePath)}`);
    return state;
  }
  log(`${label}: unsupported path type (${filePath})`);
  return state;
};

const assertExternalVolumeReady = () => {
  if (mediaRoot.startsWith('/Volumes/DobbyData/')) {
    if (!fs.existsSync('/Volumes/DobbyData')) {
      die('/Volumes/DobbyData is not mounted');
    }
    if (!fs.existsSync('/Volumes/DobbyData/Videos')) {
      die('/Volumes/DobbyData/Videos is missing');
    }
  }
};

const runStatus = () => {
  log(`repo root: ${repoRoot}`);
  log(`media root: ${mediaRoot}`);
  describeState('repo public/imports', repoImportsPath);
  describeState('external public/imports', externalImportsPath);
};

const runCheck = ({requireLink}) => {
  const state = pathState(repoImportsPath);
  if (state.kind === 'missing') {
    if (requireLink) {
      die(`public/imports is missing: ${repoImportsPath}`);
    }
    log('public/imports is missing; create it when local media is needed');
    return;
  }

  if (state.kind !== 'symlink') {
    if (requireLink) {
      die(`public/imports is not a symlink: ${repoImportsPath}`);
    }
    log('public/imports is a local directory; this is acceptable for laptop/local work');
    return;
  }

  if (!state.targetExists) {
    die(`public/imports symlink target is missing: ${state.resolved}`);
  }

  const managedTarget = realPathOrNull(externalImportsPath);
  if (requireLink && managedTarget && state.realPath !== managedTarget) {
    die(`public/imports does not point at managed target: ${externalImportsPath}`);
  }

  log(`public/imports symlink is usable: ${state.target}`);
};

const linkTarget = () => {
  return externalImportsPath;
};

const moveDirectoryContents = ({fromDir, toDir}) => {
  fs.mkdirSync(toDir, {recursive: true});
  for (const entry of fs.readdirSync(fromDir)) {
    const fromPath = path.join(fromDir, entry);
    const toPath = path.join(toDir, entry);
    if (exists(toPath)) {
      die(`external target already contains ${entry}; refusing to overwrite ${toPath}`);
    }
    try {
      fs.renameSync(fromPath, toPath);
    } catch (error) {
      if (!error || error.code !== 'EXDEV') {
        throw error;
      }
      fs.cpSync(fromPath, toPath, {
        recursive: true,
        preserveTimestamps: true,
        errorOnExist: true,
      });
      fs.rmSync(fromPath, {recursive: true, force: false});
    }
  }
};

const runLink = ({apply}) => {
  assertExternalVolumeReady();

  const state = pathState(repoImportsPath);
  const externalState = pathState(externalImportsPath);
  const target = linkTarget();

  log(`${apply ? 'applying' : 'dry-run'} public/imports link`);
  log(`repo path: ${repoImportsPath}`);
  log(`external path: ${externalImportsPath}`);

  if (state.kind === 'symlink') {
    if (!state.targetExists) {
      die(`public/imports is already a broken symlink: ${state.target}`);
    }
    const managedTarget = realPathOrNull(externalImportsPath);
    if (managedTarget && state.realPath === managedTarget) {
      log('public/imports already points at the managed external target');
      return;
    }
    die(`public/imports is a symlink to a different target: ${state.target}`);
  }

  if (state.kind !== 'missing' && state.kind !== 'directory') {
    die(`public/imports must be a directory or missing, found: ${state.kind}`);
  }

  if (externalState.kind === 'symlink' || externalState.kind === 'other') {
    die(`external target has unsupported path type: ${externalImportsPath}`);
  }

  if (!apply) {
    if (state.kind === 'directory') {
      log(`would move contents from ${repoImportsPath} to ${externalImportsPath}`);
    } else {
      log(`would create external directory ${externalImportsPath}`);
    }
    log(`would replace ${repoImportsPath} with symlink -> ${target}`);
    return;
  }

  fs.mkdirSync(repoPublicDir, {recursive: true});
  fs.mkdirSync(path.dirname(externalImportsPath), {recursive: true});

  if (state.kind === 'directory') {
    moveDirectoryContents({fromDir: repoImportsPath, toDir: externalImportsPath});
    fs.rmdirSync(repoImportsPath);
  } else if (!fs.existsSync(externalImportsPath)) {
    fs.mkdirSync(externalImportsPath, {recursive: true});
  }

  if (!isDirectoryEmpty(externalImportsPath)) {
    log(`external target ready: ${externalImportsPath}`);
  }

  fs.symlinkSync(target, repoImportsPath, 'dir');
  log(`linked public/imports -> ${target}`);
  runCheck({requireLink: true});
};

const {command, opts} = parseArgs(process.argv.slice(2));

if (command === 'status') {
  runStatus();
} else if (command === 'check') {
  runCheck({requireLink: opts.requireLink});
} else if (command === 'link') {
  runLink({apply: opts.apply});
}
