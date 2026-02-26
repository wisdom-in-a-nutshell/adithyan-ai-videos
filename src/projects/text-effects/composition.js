import {TextEffectsComp} from './TextEffectsComp.js';
import {TEXT_EFFECTS_CUT_SECONDS} from './assets.js';

const FPS = 24;
const WIDTH = 1280;
const HEIGHT = 720;
const durationInFrames = Math.ceil(TEXT_EFFECTS_CUT_SECONDS * FPS);

export const TEXT_EFFECTS_COMPOSITION = {
  id: 'TextEffects',
  component: TextEffectsComp,
  durationInFrames,
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  defaultProps: {},
};
