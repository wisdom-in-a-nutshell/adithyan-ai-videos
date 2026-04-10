import {ObjectSegmentationComp} from './ObjectSegmentationComp.js';
import {DURATION_FRAMES, FPS, HEIGHT, WIDTH} from './assets.js';

export const OBJECT_SEGMENTATION_COMPOSITION = {
  id: 'ObjectSegmentation',
  component: ObjectSegmentationComp,
  durationInFrames: DURATION_FRAMES,
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  defaultProps: {},
};
