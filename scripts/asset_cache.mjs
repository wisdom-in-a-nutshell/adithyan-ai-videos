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

const pickHeader = (headers, name) => {
  // Fetch Headers are case-insensitive; use get().
  const value = headers.get(name);
  if (!value) {
    return null;
  }
  return value;
};

const getRemoteSignature = async (url) => {
  // Some origins don’t support HEAD; this is best-effort only.
  try {
    const res = await fetch(url, {method: 'HEAD'});
    if (!res.ok) {
      return null;
    }

    const etag = pickHeader(res.headers, 'etag');
    const lastModified = pickHeader(res.headers, 'last-modified');
    const contentLengthRaw = pickHeader(res.headers, 'content-length');
    const contentLength = contentLengthRaw ? Number(contentLengthRaw) : null;

    return {
      etag,
      lastModified,
      contentLength: Number.isFinite(contentLength) ? contentLength : null,
    };
  } catch {
    return null;
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

  // Capture headers for cache invalidation on future runs.
  const etag = pickHeader(res.headers, 'etag');
  const lastModified = pickHeader(res.headers, 'last-modified');
  const contentLengthRaw = pickHeader(res.headers, 'content-length');
  const contentLength = contentLengthRaw ? Number(contentLengthRaw) : null;

  return {
    etag,
    lastModified,
    contentLength: Number.isFinite(contentLength) ? contentLength : null,
  };
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
  // Manifest is best-effort metadata (for debugging + cache invalidation).
  // The cache itself is file-based: filenames are derived from URLs.
  const loaded = readJsonIfExists(manifestPath);
  const manifest = loaded && loaded.version === 2 ? loaded : {version: 2, assets: {}};

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

    if (!refresh && fileExists) {
      // If the URL stays the same but the origin updates the content in-place,
      // a HEAD signature change is the least-annoying way to auto-refresh.
      // Best-effort only: if the origin blocks HEAD or omits headers, we keep cache.
      const remoteSig = await getRemoteSignature(url);
      const lastSig = urlMatches ? last?.signature ?? null : null;

      if (remoteSig && lastSig) {
        const changed =
          (remoteSig.etag && lastSig.etag && remoteSig.etag !== lastSig.etag) ||
          (remoteSig.lastModified &&
            lastSig.lastModified &&
            remoteSig.lastModified !== lastSig.lastModified) ||
          (Number.isFinite(remoteSig.contentLength) &&
            Number.isFinite(lastSig.contentLength) &&
            remoteSig.contentLength !== lastSig.contentLength);

        if (!changed) {
          // Preserve signature in the manifest (avoid dropping it on rewrites).
          return {filename, filePath, url, signature: lastSig};
        }
      } else if (remoteSig) {
        // Cache hit but no prior signature recorded (or manifest was reset).
        // Keep the file and record signature for next time.
        return {filename, filePath, url, signature: remoteSig};
      }
      // Cache hit with no HEAD signature available. Keep whatever we had.
      return {filename, filePath, url, ...(lastSig ? {signature: lastSig} : {})};
    }

    const signature = await downloadToFile({url, destPath: filePath});
    return {filename, filePath, url, signature};
  };

  const cachedVideo = await cacheOne({kind: 'video', url: videoUrl, fallbackExt: '.mp4'});
  const cachedAlpha = await cacheOne({kind: 'alpha', url: alphaUrl, fallbackExt: '.webm'});

  const nextManifest = {
    version: 2,
    assets: {
      ...(manifest.assets ?? {}),
      ...(cachedVideo
        ? {
            video: {
              url: cachedVideo.url,
              filename: cachedVideo.filename,
              ...(cachedVideo.signature ? {signature: cachedVideo.signature} : {}),
            },
          }
        : {}),
      ...(cachedAlpha
        ? {
            alpha: {
              url: cachedAlpha.url,
              filename: cachedAlpha.filename,
              ...(cachedAlpha.signature ? {signature: cachedAlpha.signature} : {}),
            },
          }
        : {}),
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
