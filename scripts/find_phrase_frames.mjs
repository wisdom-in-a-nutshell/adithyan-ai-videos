#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import {findPhraseFrames} from '../src/lib/findPhraseFrames.js';

const usage = `Usage:
  node scripts/find_phrase_frames.mjs --words <transcript_words.json> --phrase "<phrase>" [--fps <n>] [--after <seconds>]

Examples:
  node scripts/find_phrase_frames.mjs --words src/projects/object-segmentation/transcript_words.json --phrase "totally natural" --fps 30
  node scripts/find_phrase_frames.mjs --words src/projects/c0040/transcript_words.json --phrase "everything that you are" --fps 30 --after 3
`;

const die = (message) => {
  console.error(`[find-phrase-frames] ${message}`);
  process.exit(1);
};

const parseArgs = (argv) => {
  const opts = {};
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith('--')) {
      die(`Unexpected argument: ${key}\n\n${usage}`);
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

const opts = parseArgs(process.argv.slice(2));
if (!opts.words || !opts.phrase) {
  die(`--words and --phrase are required\n\n${usage}`);
}

const wordsPath = path.resolve(opts.words);
if (!fs.existsSync(wordsPath)) {
  die(`Transcript file not found: ${wordsPath}`);
}

const raw = fs.readFileSync(wordsPath, 'utf8');
let parsed = null;
try {
  parsed = JSON.parse(raw);
} catch (error) {
  die(`Invalid JSON in ${wordsPath}: ${error instanceof Error ? error.message : String(error)}`);
}

const fps = opts.fps === undefined ? null : Number(opts.fps);
if (opts.fps !== undefined && (!Number.isFinite(fps) || fps <= 0)) {
  die('--fps must be a positive number');
}

const afterSeconds = opts.after === undefined ? null : Number(opts.after);
if (opts.after !== undefined && !Number.isFinite(afterSeconds)) {
  die('--after must be a finite number');
}

const result = findPhraseFrames(parsed, opts.phrase, {fps, afterSeconds});
if (!result) {
  process.stdout.write(
    `${JSON.stringify(
      {
        found: false,
        phrase: opts.phrase,
        wordsPath,
      },
      null,
      2
    )}\n`
  );
  process.exit(2);
}

process.stdout.write(
  `${JSON.stringify(
    {
      found: true,
      ...result,
      wordsPath,
    },
    null,
    2
  )}\n`
);
