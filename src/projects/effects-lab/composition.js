import {EffectsLabComp} from './EffectsLabComp.js';
import {
  EFFECTS_LAB_DURATION_FRAMES,
  EFFECTS_LAB_FPS,
  EFFECTS_LAB_HEIGHT,
  EFFECTS_LAB_WIDTH,
} from './assets.js';

export const EFFECTS_LAB_COMPOSITION = {
  id: 'EffectsLab',
  component: EffectsLabComp,
  durationInFrames: EFFECTS_LAB_DURATION_FRAMES,
  fps: EFFECTS_LAB_FPS,
  width: EFFECTS_LAB_WIDTH,
  height: EFFECTS_LAB_HEIGHT,
  defaultProps: {},
};
