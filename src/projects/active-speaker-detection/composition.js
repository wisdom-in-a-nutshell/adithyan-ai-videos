import cropTimeline from '../../data/crop_timeline_1x1.json';
import storyboard from '../../data/timeline_storyboard_v1.json';
import transcriptWords from './transcript_words.json';
import {ActiveSpeakerDetectionComp} from './ActiveSpeakerDetectionComp.js';
import {ACTIVE_SPEAKER_DETECTION_VIDEO_URL} from './assets.js';

const FPS = 30;
const WIDTH = 1920;
const HEIGHT = 1080;
const maxEnd = Math.max(...storyboard.sections.map((section) => section.end));
const durationInFrames = Math.ceil(maxEnd * FPS);

export const ACTIVE_SPEAKER_DETECTION_COMPOSITION = {
  id: 'ActiveSpeakerDetection',
  component: ActiveSpeakerDetectionComp,
  durationInFrames,
  fps: FPS,
  width: WIDTH,
  height: HEIGHT,
  defaultProps: {
    videoUrl: ACTIVE_SPEAKER_DETECTION_VIDEO_URL,
    storyboard,
    cropTimeline,
    transcriptWords,
  },
};
