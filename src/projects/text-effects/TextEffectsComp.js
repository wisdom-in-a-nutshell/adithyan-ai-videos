import React from 'react';
import {Sequence, Video, useVideoConfig} from 'remotion';
import {HeroStamp} from '../../components/HeroStamp.js';
import transcriptWords from './transcript_words.json';
import {TEXT_EFFECTS_ALPHA_URL, TEXT_EFFECTS_VIDEO_URL} from './assets.js';

const resolveAssetSrc = (src) => {
  if (!src || typeof src !== 'string') {
    return src;
  }
  return src;
};

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
  const {fps, durationInFrames} = useVideoConfig();
  const holdUntilSeconds = findLetMeShowYouHowEndSeconds(transcriptWords);
  const holdFrames =
    Number.isFinite(holdUntilSeconds) && holdUntilSeconds !== null
      ? Math.min(durationInFrames, Math.max(1, Math.ceil(holdUntilSeconds * fps)))
      : durationInFrames;

  return (
    <div style={{position: 'relative', width: '100%', height: '100%', backgroundColor: '#000'}}>
      <Sequence name="Background" from={0} durationInFrames={durationInFrames}>
        <Video
          src={resolveAssetSrc(TEXT_EFFECTS_VIDEO_URL)}
          style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </Sequence>

      <Sequence name="HeroStamp (Behind)" from={0} durationInFrames={holdFrames}>
        <HeroStamp layer="behind" transcriptWords={transcriptWords} holdUntilSeconds={holdUntilSeconds} />
      </Sequence>

      <Sequence name="Foreground Alpha" from={0} durationInFrames={durationInFrames}>
        <Video
          src={resolveAssetSrc(TEXT_EFFECTS_ALPHA_URL)}
          muted
          style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </Sequence>

      <Sequence name="HeroStamp (Front)" from={0} durationInFrames={holdFrames}>
        <HeroStamp layer="front" transcriptWords={transcriptWords} holdUntilSeconds={holdUntilSeconds} />
      </Sequence>
    </div>
  );
};
