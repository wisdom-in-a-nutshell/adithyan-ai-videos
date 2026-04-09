#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const errors = [];
const warnings = [];

const requiredDirs = ['docs/architecture', 'docs/references', 'docs/projects', 'src/projects', 'projects'];
for (const rel of requiredDirs) {
  const abs = path.resolve(rel);
  if (!fs.existsSync(abs) || !fs.statSync(abs).isDirectory()) {
    errors.push(`Missing required directory: ${rel}`);
  }
}

const rootPath = path.resolve('src', 'Root.js');
let rootText = '';
if (!fs.existsSync(rootPath)) {
  errors.push('Missing src/Root.js');
} else {
  rootText = fs.readFileSync(rootPath, 'utf8');
}

if (!rootText.includes('PROJECT_COMPOSITIONS')) {
  errors.push('src/Root.js should register compositions from PROJECT_COMPOSITIONS');
}

const srcProjectsDir = path.resolve('src', 'projects');
const srcProjectIds =
  fs.existsSync(srcProjectsDir)
    ? fs
        .readdirSync(srcProjectsDir, {withFileTypes: true})
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
        .sort()
    : [];

const registryPath = path.resolve('src', 'projects', 'registry.js');
let registryText = '';
if (!fs.existsSync(registryPath)) {
  errors.push('Missing src/projects/registry.js');
} else {
  registryText = fs.readFileSync(registryPath, 'utf8');
}

const registeredProjectIds = new Set();
for (const m of registryText.matchAll(/\.\/([^/]+)\/composition\.js/g)) {
  registeredProjectIds.add(m[1]);
}
if (registeredProjectIds.size === 0) {
  errors.push('No project composition imports found in src/projects/registry.js');
}

const registryImportToProjectDir = new Map();
for (const m of registryText.matchAll(/import\s+\{([^}]+)\}\s+from '\.\/([^/]+)\/composition\.js';/g)) {
  const importNames = m[1]
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
  for (const importName of importNames) {
    registryImportToProjectDir.set(importName, m[2]);
  }
}

const enabledProjectIds = new Set();
for (const m of registryText.matchAll(/\{composition:\s*([A-Za-z0-9_]+),\s*enabled:\s*(true|false)\}/g)) {
  if (m[2] !== 'true') continue;
  const projectDir = registryImportToProjectDir.get(m[1]);
  if (projectDir) {
    enabledProjectIds.add(projectDir);
  }
}

for (const id of registeredProjectIds) {
  if (!srcProjectIds.includes(id)) {
    errors.push(`Registry imports missing project directory: src/projects/${id}`);
  }
}

for (const id of srcProjectIds) {
  const projectDir = path.join(srcProjectsDir, id);
  const assetsPath = path.join(projectDir, 'assets.js');
  if (!fs.existsSync(assetsPath)) {
    errors.push(`Missing assets.js for project: src/projects/${id}`);
  }
  if (fs.existsSync(assetsPath) && enabledProjectIds.has(id)) {
    try {
      const assetsModule = await import(`${pathToFileURL(assetsPath).href}?t=${fs.statSync(assetsPath).mtimeMs}`);
      for (const [name, value] of Object.entries(assetsModule)) {
        if (typeof value !== 'string') continue;
        if (/^https?:\/\//i.test(value) || value.startsWith('data:')) continue;
        if (!/\.(mp4|webm|png|jpe?g|svg|gif|mov)$/i.test(value)) continue;
        errors.push(
          `Enabled project ${id} has non-remote runtime asset ${name}: ${value}`
        );
      }
    } catch (err) {
      errors.push(`Failed to inspect assets for enabled project ${id}: ${String(err)}`);
    }
  }

  const compositionPath = path.join(projectDir, 'composition.js');
  if (!fs.existsSync(compositionPath)) {
    errors.push(`Missing composition.js for project: src/projects/${id}`);
  }

  const compFiles = fs
    .readdirSync(projectDir, {withFileTypes: true})
    .filter((d) => d.isFile() && d.name.endsWith('Comp.js'))
    .map((d) => d.name);
  if (compFiles.length === 0) {
    warnings.push(`No *Comp.js found in src/projects/${id}`);
  }

  const transcriptWordsPath = path.join(projectDir, 'transcript_words.json');
  if (fs.existsSync(transcriptWordsPath)) {
    try {
      JSON.parse(fs.readFileSync(transcriptWordsPath, 'utf8'));
    } catch (err) {
      errors.push(`Invalid JSON in ${path.relative(process.cwd(), transcriptWordsPath)}: ${String(err)}`);
    }
  } else {
    warnings.push(`Missing transcript_words.json in src/projects/${id} (recommended, not required)`);
  }

  const artifactDir = path.resolve('projects', id);
  if (!fs.existsSync(artifactDir) || !fs.statSync(artifactDir).isDirectory()) {
    warnings.push(`Missing artifact directory projects/${id} (recommended for source notes/artifacts)`);
  }
}

for (const id of srcProjectIds) {
  if (!registeredProjectIds.has(id)) {
    errors.push(`Project missing registry import: src/projects/${id}/composition.js`);
  }
}

if (warnings.length > 0) {
  console.log('[doctor] warnings:');
  for (const w of warnings) {
    console.log(`  - ${w}`);
  }
}

if (errors.length > 0) {
  console.error('[doctor] failed:');
  for (const e of errors) {
    console.error(`  - ${e}`);
  }
  process.exit(1);
}

console.log('[doctor] checks passed');
