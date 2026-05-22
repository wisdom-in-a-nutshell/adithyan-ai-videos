import {PaperPortalTransitionComp} from './PaperPortalTransitionComp.js';
import {DURATION_FRAMES, FPS, HEIGHT, WIDTH} from './assets.js';

export const PAPER_PORTAL_COMPOSITION = {
  id: 'PaperPortal',
  component: PaperPortalTransitionComp,
  durationInFrames: DURATION_FRAMES,
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  defaultProps: {},
};
