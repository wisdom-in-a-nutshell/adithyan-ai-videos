import React from 'react';
import {Composition} from 'remotion';
import {MainVideo} from './MainVideo.js';
import {TextEffectsComp} from './projects/text-effects/TextEffectsComp.js';
import {TEXT_EFFECTS_CUT_SECONDS} from './projects/text-effects/assets.js';
import {ACTIVE_SPEAKER_DETECTION_VIDEO_URL} from './projects/active-speaker-detection/assets.js';
import storyboard from './data/timeline_storyboard_v1.json';
import cropTimeline from './data/crop_timeline_1x1.json';

const FPS = 30;
const OCCLUSION_FPS = 24;
const maxEnd = Math.max(...storyboard.sections.map((section) => section.end));
const durationInFrames = Math.ceil(maxEnd * FPS);

const DEFAULT_PROPS = {
  videoUrl: ACTIVE_SPEAKER_DETECTION_VIDEO_URL,
  storyboard,
  cropTimeline,
};

const TEXT_EFFECTS_DURATION = Math.ceil(TEXT_EFFECTS_CUT_SECONDS * OCCLUSION_FPS);

export const RemotionRoot = () => {
  return (
    <>
      <Composition
        id="ActiveSpeakerDetection"
        component={MainVideo}
        durationInFrames={durationInFrames}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={DEFAULT_PROPS}
      />
      <Composition
        id="TextEffects"
        component={TextEffectsComp}
        durationInFrames={TEXT_EFFECTS_DURATION}
        fps={OCCLUSION_FPS}
        width={1280}
        height={720}
        defaultProps={{}}
      />
    </>
  );
};
