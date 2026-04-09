import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export const DEFAULT_TEMP_CLEANUP_AGE_HOURS = 12;

const KEEP_NEWEST_PER_FAMILY = 2;
const RECENT_GRACE_HOURS = 1;
const MS_PER_HOUR = 60 * 60 * 1000;

const TEMP_DIR_PATTERNS = [
  {family: 'webpack-bundle', pattern: /^remotion-webpack-bundle-/},
  {family: 'assets', pattern: /^remotion-v[^/]*-assets/},
  {family: 'react-render', pattern: /^react-motion-render/},
  {family: 'chrome-profile', pattern: /^puppeteer_dev_chrome_profile-/},
];

export const TEMP_CLEANUP_HELP_TEXT = [
  '--no-temp-cleanup              skip pruning stale Remotion temp dirs before launch',
  `--temp-cleanup-age-hours <n>   prune stale Remotion temp dirs older than n hours (default: ${DEFAULT_TEMP_CLEANUP_AGE_HOURS})`,
].join('\n');

const toPositiveNumber = (value) => {
  const num = Number(value);
  return Number.isFinite(num) && num > 0 ? num : null;
};

const getMatchingTempFamily = (name) => {
  for (const entry of TEMP_DIR_PATTERNS) {
    if (entry.pattern.test(name)) {
      return entry.family;
    }
  }
  return null;
};

const listMatchingTempDirs = () => {
  const tmpDir = os.tmpdir();
  const matches = [];

  for (const entry of fs.readdirSync(tmpDir, {withFileTypes: true})) {
    if (!entry.isDirectory()) continue;

    const family = getMatchingTempFamily(entry.name);
    if (!family) continue;

    const fullPath = path.join(tmpDir, entry.name);
    let stat = null;
    try {
      stat = fs.statSync(fullPath);
    } catch {
      continue;
    }

    if (!stat.isDirectory()) continue;

    matches.push({
      family,
      name: entry.name,
      fullPath,
      mtimeMs: stat.mtimeMs,
    });
  }

  return matches;
};

const getProtectedPaths = (entries) => {
  const protectedPaths = new Set();
  const byFamily = new Map();

  for (const entry of entries) {
    if (!byFamily.has(entry.family)) {
      byFamily.set(entry.family, []);
    }
    byFamily.get(entry.family).push(entry);
  }

  for (const familyEntries of byFamily.values()) {
    familyEntries
      .sort((a, b) => b.mtimeMs - a.mtimeMs)
      .slice(0, KEEP_NEWEST_PER_FAMILY)
      .forEach((entry) => protectedPaths.add(entry.fullPath));
  }

  return protectedPaths;
};

const hasOpenFiles = (dirPath) => {
  const result = spawnSync('lsof', ['-t', '+D', dirPath], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });

  if (result.error) {
    return false;
  }

  return (result.stdout || '').trim().length > 0;
};

export const parseTempCleanupArgs = (rawArgs) => {
  const args = [];
  let enabled = true;
  let ageHours = DEFAULT_TEMP_CLEANUP_AGE_HOURS;

  for (let i = 0; i < rawArgs.length; i += 1) {
    const arg = rawArgs[i];
    if (arg === '--no-temp-cleanup') {
      enabled = false;
      continue;
    }
    if (arg === '--temp-cleanup-age-hours') {
      const next = rawArgs[i + 1];
      if (!next || next.startsWith('--')) {
        throw new Error('Missing value for --temp-cleanup-age-hours');
      }
      const parsed = toPositiveNumber(next);
      if (parsed === null) {
        throw new Error(`Expected positive number for --temp-cleanup-age-hours; got: ${next}`);
      }
      ageHours = parsed;
      i += 1;
      continue;
    }
    args.push(arg);
  }

  return {
    args,
    tempCleanup: {
      enabled,
      ageHours,
    },
  };
};

export const pruneRemotionTempDirs = ({
  enabled = true,
  ageHours = DEFAULT_TEMP_CLEANUP_AGE_HOURS,
} = {}) => {
  const summary = {
    enabled,
    ageHours,
    tmpDir: os.tmpdir(),
    scannedCount: 0,
    deletedCount: 0,
    skippedRecentCount: 0,
    skippedByAgeCount: 0,
    keptNewestCount: 0,
    skippedInUseCount: 0,
    failedCount: 0,
    failures: [],
  };

  if (!enabled) {
    return summary;
  }

  const entries = listMatchingTempDirs().sort((a, b) => a.mtimeMs - b.mtimeMs);
  const protectedPaths = getProtectedPaths(entries);
  const ttlMs = ageHours * MS_PER_HOUR;
  const recentGraceMs = RECENT_GRACE_HOURS * MS_PER_HOUR;
  const now = Date.now();

  summary.scannedCount = entries.length;

  for (const entry of entries) {
    const ageMs = now - entry.mtimeMs;
    if (ageMs < recentGraceMs) {
      summary.skippedRecentCount += 1;
      continue;
    }
    if (ageMs < ttlMs) {
      summary.skippedByAgeCount += 1;
      continue;
    }
    if (protectedPaths.has(entry.fullPath)) {
      summary.keptNewestCount += 1;
      continue;
    }
    if (hasOpenFiles(entry.fullPath)) {
      summary.skippedInUseCount += 1;
      continue;
    }

    try {
      fs.rmSync(entry.fullPath, {recursive: true, force: true});
      summary.deletedCount += 1;
    } catch (error) {
      summary.failedCount += 1;
      summary.failures.push({
        path: entry.fullPath,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return summary;
};

export const logTempCleanupSummary = (
  summary,
  {logger = console.log, warn = console.warn} = {}
) => {
  if (!summary.enabled || summary.scannedCount === 0) {
    return;
  }

  const parts = [];
  if (summary.deletedCount > 0) parts.push(`deleted ${summary.deletedCount}`);
  if (summary.skippedInUseCount > 0) parts.push(`kept ${summary.skippedInUseCount} in use`);
  if (summary.keptNewestCount > 0) parts.push(`kept ${summary.keptNewestCount} newest`);
  if (summary.failedCount > 0) parts.push(`failed ${summary.failedCount}`);

  if (parts.length === 0) {
    return;
  }

  const message =
    `[temp-cleanup] ${parts.join(', ')} stale Remotion temp dirs ` +
    `older than ${summary.ageHours}h in ${summary.tmpDir}`;

  if (summary.failedCount > 0) {
    warn(message);
    for (const failure of summary.failures) {
      warn(`  - ${failure.path}: ${failure.error}`);
    }
    return;
  }

  logger(message);
};
