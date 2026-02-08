import React from 'react';
import {ForegroundMatteComposite} from '../../components/ForegroundMatteComposite.js';
import transcriptWords from './transcript_words.json';
import {TEXT_EFFECTS_ALPHA_URL, TEXT_EFFECTS_VIDEO_URL} from './assets.js';

// Project-specific composition wrapper for `text-effects`.
// Keep the cut short while iterating; extend later when we implement storyboard-driven beats.
export const TextEffectsComp = (props) => {
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
    />
  );
};
