import React from 'react';
import {ForegroundMatteComposite} from '../../components/ForegroundMatteComposite.js';
import transcriptWords from './transcript_words.json';
import {TEXT_EFFECTS_ALPHA_URL, TEXT_EFFECTS_VIDEO_URL} from './assets.js';

const normalizeWord = (value) => {
  if (typeof value !== 'string') {
    return '';
  }
  return value.trim().toLowerCase().replace(/[^\w%]+/g, '');
};

const findLetMeShowYouHowEndSeconds = (words) => {
  if (!Array.isArray(words)) {
    return null;
  }
  const onlyWords = words.filter((w) => w?.type === 'word' && typeof w?.text === 'string');
  if (onlyWords.length === 0) {
    return null;
  }

  // Find "let me show you how" and return the end time of "how".
  for (let i = 0; i < onlyWords.length - 4; i++) {
    const w0 = normalizeWord(onlyWords[i].text);
    const w1 = normalizeWord(onlyWords[i + 1].text);
    const w2 = normalizeWord(onlyWords[i + 2].text);
    const w3 = normalizeWord(onlyWords[i + 3].text);
    const w4 = normalizeWord(onlyWords[i + 4].text);
    if (w0 === 'let' && w1 === 'me' && w2 === 'show' && w3 === 'you' && w4 === 'how') {
      const end = Number(onlyWords[i + 4].end);
      return Number.isFinite(end) ? end : null;
    }
  }

  return null;
};

// Project-specific composition wrapper for `text-effects`.
// Keep the cut short while iterating; extend later when we implement storyboard-driven beats.
export const TextEffectsComp = (props) => {
  const holdUntilSeconds = findLetMeShowYouHowEndSeconds(transcriptWords);
  return (
    <ForegroundMatteComposite
      {...props}
      videoUrl={TEXT_EFFECTS_VIDEO_URL}
      alphaUrl={TEXT_EFFECTS_ALPHA_URL}
      transcriptWords={transcriptWords}
      backgroundBlur={0}
      backgroundDim={0}
      featherPx={0}
      shrinkPx={0}
      heroStamp
      heroStampHoldUntilSeconds={holdUntilSeconds}
    />
  );
};
