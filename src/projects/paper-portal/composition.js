import {PaperPortalCreditDrawPreviewComp} from './CreditDrawPreviewComp.js';
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

export const PAPER_PORTAL_CREDIT_DRAW_PREVIEW_COMPOSITION = {
  id: 'PaperPortalCreditDrawPreview',
  component: PaperPortalCreditDrawPreviewComp,
  durationInFrames: FPS * 4,
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  defaultProps: {},
};
