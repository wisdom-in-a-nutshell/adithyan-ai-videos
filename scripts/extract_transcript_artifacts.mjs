#!/usr/bin/env node
/**
 * Extract thin transcript artifacts from a full transcript payload.
 *
 * Input (canonical): projects/<id>/transcript_words.json
 * - expected shape: { source_id, text, words, sentences }
 *
 * Output (derived, optional):
 * - projects/<id>/words.json      -> [{text,type,start,end,speaker_id,characters}]
 * - projects/<id>/sentences.json  -> [{text,start,end,speaker_id,words?}]
 *
 * Usage:
 *   node scripts/extract_transcript_artifacts.mjs projects/text-effects
 */

import fs from 'node:fs';
import path from 'node:path';

const die = (msg) => {
  // eslint-disable-next-line no-console
  console.error(msg);
  process.exit(1);
};

const normalizeWords = (raw) => {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map((entry) => {
      const text = entry?.text;
      const start = entry?.start ?? entry?.start_time;
      const end = entry?.end ?? entry?.end_time;
      if (typeof text !== 'string') {
        return null;
      }
      const startF = Number(start);
      const endF = Number(end);
      if (!Number.isFinite(startF) || !Number.isFinite(endF)) {
        return null;
      }
      return {
        text,
        type: typeof entry?.type === 'string' ? entry.type : 'word',
        start: startF,
        end: endF,
        speaker_id: entry?.speaker_id ?? null,
        characters: entry?.characters ?? null,
      };
    })
    .filter(Boolean);
};

const normalizeSentences = (raw) => {
  if (!Array.isArray(raw)) {
    return [];
  }
  return raw
    .map((entry) => {
      const text = entry?.text;
      const start = entry?.start ?? entry?.start_time;
      const end = entry?.end ?? entry?.end_time;
      if (typeof text !== 'string') {
        return null;
      }
      const startF = Number(start);
      const endF = Number(end);
      if (!Number.isFinite(startF) || !Number.isFinite(endF)) {
        return null;
      }
      return {
        text,
        start: startF,
        end: endF,
        speaker_id: entry?.speaker_id ?? null,
        // keep words if present; useful for highlighting per-sentence.
        words: Array.isArray(entry?.words) ? normalizeWords(entry.words) : undefined,
      };
    })
    .filter(Boolean);
};

const args = process.argv.slice(2);
const projectDirArg = args[0];
if (!projectDirArg) {
  die('Usage: node scripts/extract_transcript_artifacts.mjs <projects/<id>>');
}

const projectDir = path.resolve(projectDirArg);
const canonicalPath = path.join(projectDir, 'transcript_words.json');
if (!fs.existsSync(canonicalPath)) {
  die(`Missing canonical transcript file: ${canonicalPath}`);
}

const payload = JSON.parse(fs.readFileSync(canonicalPath, 'utf-8'));
if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
  die(`Expected canonical transcript payload object at ${canonicalPath}`);
}

const words = normalizeWords(payload.words);
const sentences = normalizeSentences(payload.sentences);

fs.writeFileSync(path.join(projectDir, 'words.json'), `${JSON.stringify(words, null, 2)}\n`, 'utf-8');
fs.writeFileSync(
  path.join(projectDir, 'sentences.json'),
  `${JSON.stringify(sentences, null, 2)}\n`,
  'utf-8'
);

// eslint-disable-next-line no-console
console.log(`[OK] Wrote ${path.join(projectDir, 'words.json')} (${words.length} words)`);
// eslint-disable-next-line no-console
console.log(`[OK] Wrote ${path.join(projectDir, 'sentences.json')} (${sentences.length} sentences)`);

