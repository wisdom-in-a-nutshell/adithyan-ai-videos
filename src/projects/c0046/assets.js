export const PROJECT_ID = 'c0046';
export const PROJECT_TITLE = 'C0046';

export const VIDEO_URL = 'public/imports/c0046/source.mp4';
export const BALL_SEGMENT_MASK_URL = 'public/imports/c0046/artifacts/ball-segment-mask-12-58.mp4';
export const PERSON_MATTE_MASK_URL = 'public/imports/c0046/artifacts/person-matte-mask-full.mp4';
export const PERSON_MATTE_ALPHA_URL = 'public/imports/c0046/artifacts/person-matte-alpha-full.webm';

export const FPS = 25;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const SOURCE_WIDTH = 1920;
export const SOURCE_HEIGHT = 1080;
export const DURATION_SECONDS = 267.24;
export const DURATION_FRAMES = Math.ceil(DURATION_SECONDS * FPS);

// Hardcode timing anchors once transcript is stable.
export const TIMING = {
  introStart: 0,
  introEnd: 10.24,
  heroHoldEnd: 8.72,
  ballWindowStart: 12,
  ballWindowEnd: 58,
};

export const HERO_STAMP_TIMING = {
  thisStart: 2.4,
  thisEnd: 2.52,
  videoStart: 2.52,
  videoEnd: 2.96,
  percentStart: 3.2,
  percentEnd: 3.24,
  editedStart: 3.36,
  codexEnd: 5.2,
};

export const OPENER_UI = {
  labelScale: 1.56,
  codexScale: 1.8,
  disclaimerScale: 1.56,
  disclaimerBottomPx: 176,
};

export const OVERLAY_VIEW = {
  showBallTrackingMask: true,
  showForegroundMatte: true,
};
