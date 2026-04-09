#!/usr/bin/env node

import {spawnSync} from 'node:child_process';
import {
  TEMP_CLEANUP_HELP_TEXT,
  logTempCleanupSummary,
  parseTempCleanupArgs,
  pruneRemotionTempDirs,
} from './remotion_runtime.mjs';

const printHelp = () => {
  // eslint-disable-next-line no-console
  console.log(`
Usage:
  node scripts/remotion_cli.mjs [cleanup flags] <remotion-subcommand> [...args]

Examples:
  node scripts/remotion_cli.mjs compositions src/index.js
  node scripts/remotion_cli.mjs render src/index.js C0046 tmp/C0046.mp4 --overwrite

Cleanup flags:
  ${TEMP_CLEANUP_HELP_TEXT.replace(/\n/g, '\n  ')}
`.trim());
};

let parsed = null;
try {
  parsed = parseTempCleanupArgs(process.argv.slice(2));
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

if (parsed.args.length === 0 || parsed.args[0] === '--help' || parsed.args[0] === '-h') {
  printHelp();
  process.exit(parsed.args.length === 0 ? 1 : 0);
}

const cleanupSummary = pruneRemotionTempDirs(parsed.tempCleanup);
logTempCleanupSummary(cleanupSummary);

const res = spawnSync('npx', ['remotion', ...parsed.args], {stdio: 'inherit'});
process.exit(res.status ?? 1);
