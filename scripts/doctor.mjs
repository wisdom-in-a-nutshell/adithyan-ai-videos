#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

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

const compositionIds = [];
const compositionRe = /<Composition[^>]*\bid=["']([^"']+)["'][^>]*>/g;
for (const m of rootText.matchAll(compositionRe)) {
  compositionIds.push(m[1]);
}
if (compositionIds.length === 0) {
  errors.push('No <Composition id="..."> entries found in src/Root.js');
}
const dupIds = compositionIds.filter((id, i) => compositionIds.indexOf(id) !== i);
if (dupIds.length > 0) {
  errors.push(`Duplicate composition ids in src/Root.js: ${[...new Set(dupIds)].join(', ')}`);
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

const importProjectIds = new Set();
for (const m of rootText.matchAll(/\.\/projects\/([^/]+)\//g)) {
  importProjectIds.add(m[1]);
}

for (const id of importProjectIds) {
  if (!srcProjectIds.includes(id)) {
    errors.push(`src/Root.js imports missing project directory: src/projects/${id}`);
  }
}

for (const id of srcProjectIds) {
  const projectDir = path.join(srcProjectsDir, id);
  const assetsPath = path.join(projectDir, 'assets.js');
  if (!fs.existsSync(assetsPath)) {
    errors.push(`Missing assets.js for project: src/projects/${id}`);
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
  if (!importProjectIds.has(id)) {
    warnings.push(`Project not imported in src/Root.js: src/projects/${id}`);
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
