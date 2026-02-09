#!/usr/bin/env node
/**
 * Code-first asset caching for Remotion Studio / renders.
 *
 * This intentionally does NOT depend on `projects/<id>/project.json`.
 * Instead, callers pass the URLs they want cached (typically imported from
 * `src/projects/<id>/assets.js`).
 *
 * Cache strategy:
 * - Each URL is stored under a stable filename derived from a SHA-1 of the URL.
 * - If the URL changes, the hash changes, so we auto-download without any manual refresh.
 * - Old files remain; you can delete the cache dir if you want to reclaim space.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

const DEFAULT_CACHE_DIR = path.join(os.homedir(), '.cache', 'win-remotion-assets');

export const getDefaultCacheBaseDir = () => {
  const override = process.env.WIN_REMOTION_ASSET_CACHE;
  if (override && override.trim().length > 0) {
    return override.trim();
  }
  return DEFAULT_CACHE_DIR;
};

const sha1 = (input) => crypto.createHash('sha1').update(String(input)).digest('hex');

const safeExtFromUrl = (url) => {
  try {
    const u = new URL(url);
    const ext = path.extname(u.pathname);
    if (ext && ext.length <= 8) return ext;
  } catch {
    // ignore
  }
  return '';
};

const isHttpUrl = (s) => typeof s === 'string' && /^https?:\/\//i.test(s);

const downloadToFile = async ({url, outPath, refresh}) => {
  if (!refresh && fs.existsSync(outPath)) {
    return {downloaded: false};
  }

  fs.mkdirSync(path.dirname(outPath), {recursive: true});
  const tmp = `${outPath}.tmp-${process.pid}-${Date.now()}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText} (${url})`);
  }
  if (!res.body) {
    throw new Error(`Fetch returned no body (${url})`);
  }

  const writable = fs.createWriteStream(tmp);
  // Node 18+: res.body is a web stream
  const reader = res.body.getReader();
  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const {done, value} = await reader.read();
      if (done) break;
      if (value) writable.write(Buffer.from(value));
    }
  } finally {
    try {
      writable.end();
    } catch {
      // ignore
    }
  }

  await new Promise((resolve, reject) => {
    writable.on('finish', resolve);
    writable.on('error', reject);
  });

  fs.renameSync(tmp, outPath);
  return {downloaded: true};
};

export const prepareAssetCache = async ({
  cacheKey,
  urls,
  cacheBaseDir = getDefaultCacheBaseDir(),
  refresh = false,
}) => {
  if (!cacheKey || typeof cacheKey !== 'string') {
    throw new Error('prepareAssetCache: missing cacheKey');
  }
  if (!Array.isArray(urls)) {
    throw new Error('prepareAssetCache: urls must be an array');
  }

  const projectCacheDir = path.join(cacheBaseDir, cacheKey);
  fs.mkdirSync(projectCacheDir, {recursive: true});

  const assetMap = {};
  const downloaded = [];
  const skipped = [];

  for (const url of urls) {
    if (!isHttpUrl(url)) continue;
    const ext = safeExtFromUrl(url);
    const filename = `${sha1(url)}${ext}`;
    const outPath = path.join(projectCacheDir, filename);

    const res = await downloadToFile({url, outPath, refresh});
    if (res.downloaded) downloaded.push(filename);
    else skipped.push(filename);

    // When served via `--public-dir`, files resolve from the root as `/filename`.
    assetMap[url] = `/${filename}`;
  }

  return {
    cacheBaseDir,
    projectCacheDir,
    assetMap,
    downloaded,
    skipped,
  };
};

