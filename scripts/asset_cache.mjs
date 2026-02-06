import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {pipeline} from 'node:stream/promises';
import {Readable} from 'node:stream';

const isHttpUrl = (value) => typeof value === 'string' && /^https?:\/\//i.test(value);

const safeMkdir = (dir) => fs.mkdirSync(dir, {recursive: true});

const readJsonIfExists = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

const writeJson = (filePath, value) => {
  safeMkdir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf-8');
};

const sha1 = (value) => crypto.createHash('sha1').update(value).digest('hex');

const getExtensionFromUrl = (url, fallbackExt) => {
  try {
    const parsed = new URL(url);
    const ext = path.extname(parsed.pathname);
    return ext || fallbackExt;
  } catch {
    return fallbackExt;
  }
};

const downloadToFile = async ({url, destPath}) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url} (${res.status} ${res.statusText})`);
  }
  if (!res.body) {
    throw new Error(`No response body for ${url}`);
  }

  safeMkdir(path.dirname(destPath));
  const tmpPath = `${destPath}.tmp-${process.pid}-${Date.now()}`;

  const nodeReadable = Readable.fromWeb(res.body);
  const fileStream = fs.createWriteStream(tmpPath);
  await pipeline(nodeReadable, fileStream);
  fs.renameSync(tmpPath, destPath);
};

export const getDefaultCacheBaseDir = () => {
  if (process.env.WIN_REMOTION_ASSET_CACHE) {
    return process.env.WIN_REMOTION_ASSET_CACHE;
  }
  return path.join(os.homedir(), '.cache', 'win-remotion-assets');
};

export const prepareProjectAssetCache = async ({
  projectId,
  videoUrl,
  alphaUrl,
  cacheBaseDir = getDefaultCacheBaseDir(),
  refresh = false,
}) => {
  const projectCacheDir = path.join(cacheBaseDir, projectId);
  safeMkdir(projectCacheDir);

  const manifestPath = path.join(projectCacheDir, 'manifest.json');
  const manifest = readJsonIfExists(manifestPath) ?? {version: 1, assets: {}};

  const cacheOne = async ({kind, url, fallbackExt}) => {
    if (!isHttpUrl(url)) {
      return null;
    }

    const ext = getExtensionFromUrl(url, fallbackExt);
    const filename = `${kind}-${sha1(url).slice(0, 10)}${ext}`;
    const filePath = path.join(projectCacheDir, filename);

    const last = manifest.assets?.[kind];
    const urlMatches = last?.url === url;
    const fileExists = fs.existsSync(filePath) && fs.statSync(filePath).size > 0;

    if (!refresh && urlMatches && fileExists) {
      return {filename, filePath, url};
    }

    await downloadToFile({url, destPath: filePath});
    return {filename, filePath, url};
  };

  const cachedVideo = await cacheOne({kind: 'video', url: videoUrl, fallbackExt: '.mp4'});
  const cachedAlpha = await cacheOne({kind: 'alpha', url: alphaUrl, fallbackExt: '.webm'});

  const nextManifest = {
    version: 1,
    assets: {
      ...(manifest.assets ?? {}),
      ...(cachedVideo ? {video: {url: cachedVideo.url, filename: cachedVideo.filename}} : {}),
      ...(cachedAlpha ? {alpha: {url: cachedAlpha.url, filename: cachedAlpha.filename}} : {}),
    },
  };

  writeJson(manifestPath, nextManifest);

  return {
    cacheBaseDir,
    projectCacheDir,
    manifestPath,
    cachedVideo,
    cachedAlpha,
  };
};
