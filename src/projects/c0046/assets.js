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
  introEnd: 4,
  ballWindowStart: 12,
  ballWindowEnd: 58,
};

export const DEBUG_VIEW = {
  showBallMaskOverlay: true,
};
