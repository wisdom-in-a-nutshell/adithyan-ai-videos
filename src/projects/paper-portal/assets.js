export const PROJECT_ID = 'paper-portal';
export const PROJECT_TITLE = 'Paper Portal';

export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const TRANSITION_FRAMES = 18;
export const CREDIT_DRAW_FRAMES = FPS * 4;
export const END_CARD_VIDEO_FRAMES = 285;
export const END_CARD_VIDEO_START_FROM_FRAMES = 69;
export const END_CARD_VIDEO_PLAYBACK_RATE = 2;
export const END_CARD_TRANSITION_FRAMES = 12;
export const END_CARD_FADE_OUT_FRAMES = 18;
export const END_CARD_VIDEO_DURATION_FRAMES =
  Math.ceil(
    (END_CARD_VIDEO_FRAMES - END_CARD_VIDEO_START_FROM_FRAMES) /
      END_CARD_VIDEO_PLAYBACK_RATE
  );

export const DIRECT_CUT_DURATION_FRAMES = 1517;
export const MAIN_SEQUENCE_DURATION_FRAMES =
  DIRECT_CUT_DURATION_FRAMES - TRANSITION_FRAMES * 6;
export const DURATION_FRAMES =
  MAIN_SEQUENCE_DURATION_FRAMES +
  CREDIT_DRAW_FRAMES +
  END_CARD_VIDEO_DURATION_FRAMES;
export const DURATION_SECONDS = DURATION_FRAMES / FPS;

// Hardcode timing anchors once transcript is stable.
export const TIMING = {
  introStart: 0,
  introEnd: 4,
};
