export const PROJECT_ID = 'paper-portal';
export const PROJECT_TITLE = 'Paper Portal';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TRANSITION_FRAMES = 18;
export const CREDIT_DRAW_FRAMES = FPS * 4;

export const DIRECT_CUT_DURATION_FRAMES = 1517;
export const MAIN_SEQUENCE_DURATION_FRAMES =
  DIRECT_CUT_DURATION_FRAMES - TRANSITION_FRAMES * 6;
export const DURATION_FRAMES = MAIN_SEQUENCE_DURATION_FRAMES + CREDIT_DRAW_FRAMES;
export const DURATION_SECONDS = DURATION_FRAMES / FPS;

// Hardcode timing anchors once transcript is stable.
export const TIMING = {
  introStart: 0,
  introEnd: 4,
};
