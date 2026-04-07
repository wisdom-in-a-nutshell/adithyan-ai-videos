export const PROJECT_ID = 'c0040';
export const PROJECT_TITLE = 'C0040';

export const SOURCE_VIDEO_URL = 'imports/c0040/source.mp4';
export const VIDEO_URL = 'imports/c0040/working-v2.mp4';
export const EDIT_START_SECONDS = 20.98;
export const EDIT_END_SECONDS = 177.68;

export const FPS = 25;
export const WIDTH = 1920;
export const HEIGHT = 1080;
export const SOURCE_WIDTH = 1920;
export const SOURCE_HEIGHT = 1080;
export const DURATION_SECONDS = EDIT_END_SECONDS - EDIT_START_SECONDS;
export const DURATION_FRAMES = Math.ceil(DURATION_SECONDS * FPS);

// Replace these anchors once we review the trimmed clip and define the edit beats.
export const TIMING = {
  introStart: 3.04,
  introEnd: 11.28,
};
