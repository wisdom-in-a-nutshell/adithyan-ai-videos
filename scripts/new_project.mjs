#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const usage = `Usage:
  node scripts/new_project.mjs --id <project-id> [options]

Options:
  --title <name>       Human title (default: title-cased id)
  --comp <name>        Component name without extension (default: <Id>Comp)
  --fps <n>            Default fps (default: 30)
  --width <n>          Default width (default: 1920)
  --height <n>         Default height (default: 1080)
  --duration <sec>     Default duration seconds (default: 120)
  --force              Overwrite existing files
`;

const die = (msg) => {
  console.error(`[new-project] ${msg}`);
  process.exit(1);
};

const parseArgs = (argv) => {
  const opts = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith('--')) {
      die(`Unexpected argument: ${key}\n\n${usage}`);
    }
    if (key === '--force') {
      opts.force = true;
      continue;
    }
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) {
      die(`Missing value for ${key}\n\n${usage}`);
    }
    opts[key.slice(2)] = value;
    i += 1;
  }
  return opts;
};

const toTitleCase = (id) =>
  id
    .split('-')
    .filter(Boolean)
    .map((chunk) => chunk[0].toUpperCase() + chunk.slice(1))
    .join(' ');

const toPascalCase = (id) => toTitleCase(id).replace(/\s+/g, '');

const opts = parseArgs(process.argv.slice(2));
const projectId = opts.id;
if (!projectId) {
  die(`--id is required\n\n${usage}`);
}
if (!/^[a-z0-9][a-z0-9-]*$/.test(projectId)) {
  die('--id must match: lowercase letters, numbers, and dashes');
}

const asNumber = (raw, fallback, label) => {
  if (raw === undefined) {
    return fallback;
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) {
    die(`${label} must be a positive number`);
  }
  return n;
};

const title = opts.title ?? toTitleCase(projectId);
const compName = opts.comp ?? `${toPascalCase(projectId)}Comp`;
const compositionId = toPascalCase(projectId);
const compositionConst = `${projectId.replace(/-/g, '_').toUpperCase()}_COMPOSITION`;
const fps = asNumber(opts.fps, 30, '--fps');
const width = asNumber(opts.width, 1920, '--width');
const height = asNumber(opts.height, 1080, '--height');
const durationSeconds = asNumber(opts.duration, 120, '--duration');
const force = Boolean(opts.force);

const srcProjectDir = path.resolve('src', 'projects', projectId);
const artifactProjectDir = path.resolve('projects', projectId);

if (!force && (fs.existsSync(srcProjectDir) || fs.existsSync(artifactProjectDir))) {
  die('Project already exists. Use --force to overwrite.');
}

fs.mkdirSync(srcProjectDir, {recursive: true});
fs.mkdirSync(artifactProjectDir, {recursive: true});

const writeFile = (filePath, content) => {
  if (!force && fs.existsSync(filePath)) {
    die(`File already exists: ${filePath} (use --force to overwrite)`);
  }
  fs.writeFileSync(filePath, content, 'utf8');
};

writeFile(
  path.join(srcProjectDir, 'assets.js'),
  `export const PROJECT_ID = '${projectId}';
export const PROJECT_TITLE = '${title.replace(/'/g, "\\'")}';

export const VIDEO_URL = '';
export const ALPHA_URL = '';

export const FPS = ${fps};
export const WIDTH = ${width};
export const HEIGHT = ${height};
export const DURATION_SECONDS = ${durationSeconds};
export const DURATION_FRAMES = Math.ceil(DURATION_SECONDS * FPS);

// Hardcode timing anchors once transcript is stable.
export const TIMING = {
  introStart: 0,
  introEnd: 4,
};
`,
);

writeFile(
  path.join(srcProjectDir, `${compName}.js`),
  `import React from 'react';
import {AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PROJECT_TITLE} from './assets.js';

export const ${compName} = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = spring({fps, frame, config: {damping: 200}});

  return (
    <AbsoluteFill style={{backgroundColor: '#0c1220', color: 'white'}}>
      <Sequence name="intro" from={0}>
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 64,
            fontWeight: 700,
            opacity,
            letterSpacing: 1,
          }}
        >
          {PROJECT_TITLE}
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};
`,
);

writeFile(
  path.join(srcProjectDir, 'composition.js'),
  `import {${compName}} from './${compName}.js';
import {DURATION_FRAMES, FPS, HEIGHT, WIDTH} from './assets.js';

export const ${compositionConst} = {
  id: '${compositionId}',
  component: ${compName},
  durationInFrames: DURATION_FRAMES,
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  defaultProps: {},
};
`,
);

writeFile(path.join(srcProjectDir, 'transcript_words.json'), '[]\n');

writeFile(
  path.join(artifactProjectDir, 'notes.md'),
  `# ${title}

## Inputs

- Raw video URL:
- Alpha/matte URL:
- Transcript source:

## Notes

- Add storyboard beats here before wiring all overlays.
`,
);

const registryPath = path.resolve('src', 'projects', 'registry.js');
if (!fs.existsSync(registryPath)) {
  die(`Missing registry file: ${registryPath}`);
}
const importLine = `import {${compositionConst}} from './${projectId}/composition.js';`;
const entryLine = `  ${compositionConst},`;
const importMarker = '// NEW_PROJECT_IMPORTS';
const entryMarker = '// NEW_PROJECT_ENTRIES';
let registryText = fs.readFileSync(registryPath, 'utf8');

if (!registryText.includes(importMarker) || !registryText.includes(entryMarker)) {
  die(`Registry is missing required markers: ${importMarker} / ${entryMarker}`);
}

if (!registryText.includes(importLine)) {
  registryText = registryText.replace(importMarker, `${importLine}\n${importMarker}`);
}
if (!registryText.includes(entryLine)) {
  registryText = registryText.replace(entryMarker, `${entryLine}\n  ${entryMarker}`);
}
fs.writeFileSync(registryPath, registryText, 'utf8');

console.log(`[new-project] created src project: ${path.relative(process.cwd(), srcProjectDir)}`);
console.log(`[new-project] created artifact project: ${path.relative(process.cwd(), artifactProjectDir)}`);
console.log(`[new-project] updated registry: ${path.relative(process.cwd(), registryPath)}`);
console.log('');
console.log('Next steps:');
console.log(`1. Fill URLs and timing anchors in src/projects/${projectId}/assets.js.`);
console.log(`2. Start Studio: npm start`);
console.log(`3. Run doctor: npm run doctor`);
