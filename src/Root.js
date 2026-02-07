import React from 'react';
import {Composition, staticFile} from 'remotion';
import {MainVideo} from './MainVideo.js';
import {ForegroundMatteComposite} from './components/ForegroundMatteComposite.js';
import storyboard from './data/timeline_storyboard_v1.json';
import cropTimeline from './data/crop_timeline_1x1.json';

const FPS = 30;
const OCCLUSION_FPS = 24;
const maxEnd = Math.max(...storyboard.sections.map((section) => section.end));
const durationInFrames = Math.ceil(maxEnd * FPS);

const DEFAULT_PROPS = {
  videoUrl: staticFile('source.mp4'),
  storyboard,
  cropTimeline,
};

const OCCLUSION_DEFAULT_PROPS = {
  videoUrl: 'https://storage.aipodcast.ing/cache/3f076bc7-93f4-4f7b-9af1-15e35d72d092.mp4',
  alphaUrl:
    'https://storage.aipodcast.ing/cache/matanyone/alpha/c8c8a19d-3913-42e2-bedf-53e653cff4c6.webm',
  backgroundBlur: 0,
  backgroundDim: 0,
  // For this alpha.webm, feathering the RGB can amplify edge spill.
  // Prefer a small shrink to hide the colored fringe.
  featherPx: 0,
  shrinkPx: 2,
  heroStamp: true,
};

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
        id="OcclusionDemo"
        component={ForegroundMatteComposite}
        durationInFrames={OCCLUSION_FPS * 5}
        fps={OCCLUSION_FPS}
        // Keep the comp size aligned with the source + alpha assets while iterating.
        // Upscaling (e.g. 720p -> 1080p) makes small edge artifacts + text aliasing more obvious.
        width={1280}
        height={720}
        defaultProps={OCCLUSION_DEFAULT_PROPS}
      />
      <Composition
        id="TextEffects"
        component={ForegroundMatteComposite}
        // Give Studio enough timeline to scrub through longer source videos.
        durationInFrames={OCCLUSION_FPS * 300}
        fps={OCCLUSION_FPS}
        width={1280}
        height={720}
        defaultProps={OCCLUSION_DEFAULT_PROPS}
      />
    </>
  );
};
