import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const SRC_PROJECTS_DIR = path.resolve('src', 'projects');
const REGISTRY_PATH = path.resolve('src', 'projects', 'registry.js');
const LOCAL_ASSET_REF_RE = /^(?:\/?public\/|\/?imports\/|[^:\s]+\/[^:\s]+)$/i;

const importFresh = async (absPath) => {
  const stat = fs.statSync(absPath);
  return import(`${pathToFileURL(absPath).href}?t=${stat.mtimeMs}`);
};

const listProjectDirs = () =>
  fs
    .readdirSync(SRC_PROJECTS_DIR, {withFileTypes: true})
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

const getCompositionIdForProjectDir = (projectDir) => {
  const compositionPath = path.join(SRC_PROJECTS_DIR, projectDir, 'composition.js');
  if (!fs.existsSync(compositionPath)) {
    return null;
  }
  const text = fs.readFileSync(compositionPath, 'utf8');
  const match = text.match(/\bid:\s*['"]([^'"]+)['"]/);
  return match ? match[1] : null;
};

const getProjectDirByCompositionId = async (compositionId) => {
  for (const projectDir of listProjectDirs()) {
    const id = getCompositionIdForProjectDir(projectDir);
    if (id === compositionId) {
      return projectDir;
    }
  }
  return null;
};

export const getEnabledProjectDirs = async () => {
  const registryText = fs.readFileSync(REGISTRY_PATH, 'utf8');
  const importNameToProjectDir = new Map();
  for (const match of registryText.matchAll(/import\s+\{([^}]+)\}\s+from '\.\/([^/]+)\/composition\.js';/g)) {
    const importNames = match[1]
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean);
    for (const importName of importNames) {
      importNameToProjectDir.set(importName, match[2]);
    }
  }

  const enabledProjectDirs = [];
  for (const match of registryText.matchAll(/\{composition:\s*([A-Za-z0-9_]+),\s*enabled:\s*(true|false)\}/g)) {
    if (match[2] !== 'true') continue;
    const projectDir = importNameToProjectDir.get(match[1]);
    if (projectDir) {
      enabledProjectDirs.push(projectDir);
    }
  }
  return enabledProjectDirs;
};

export const getProjectDirsForRender = async ({compositionId = null} = {}) => {
  if (compositionId) {
    const projectDir = await getProjectDirByCompositionId(compositionId);
    return projectDir ? [projectDir] : [];
  }
  return getEnabledProjectDirs();
};

export const normalizeLocalAssetRef = (value) => {
  if (typeof value !== 'string') return null;
  if (/^https?:\/\//i.test(value) || value.startsWith('data:')) return null;
  if (!LOCAL_ASSET_REF_RE.test(value)) return null;

  let relative = value;
  if (relative.startsWith('/public/')) relative = relative.slice('/public/'.length);
  else if (relative.startsWith('public/')) relative = relative.slice('public/'.length);
  else if (relative.startsWith('/imports/')) relative = relative.slice(1);
  else if (relative.startsWith('/')) relative = relative.slice(1);
  return relative;
};

export const collectProjectAssetRefs = async ({projectDirs}) => {
  const remoteUrls = new Set();
  const localPublicPaths = new Set();

  for (const projectDir of projectDirs) {
    const assetsPath = path.join(SRC_PROJECTS_DIR, projectDir, 'assets.js');
    if (!fs.existsSync(assetsPath)) continue;
    const mod = await importFresh(assetsPath);
    for (const value of Object.values(mod)) {
      if (typeof value !== 'string') continue;
      if (/^https?:\/\//i.test(value)) {
        remoteUrls.add(value);
        continue;
      }
      const normalized = normalizeLocalAssetRef(value);
      if (normalized) {
        localPublicPaths.add(normalized);
      }
    }
  }

  return {
    remoteUrls: [...remoteUrls],
    localPublicPaths: [...localPublicPaths],
  };
};
