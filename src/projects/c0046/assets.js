export const PROJECT_ID = 'c0046';
export const PROJECT_TITLE = 'C0046';

export const VIDEO_URL = 'public/imports/c0046/source.mp4';
export const BALL_ALPHA_URL = 'public/imports/c0046/artifacts/ball-segment-alpha-12-58.webm';
export const BALL_SEGMENT_MASK_URL = 'public/imports/c0046/artifacts/ball-segment-mask-12-58.mp4';
export const PERSON_MATTE_MASK_URL = 'public/imports/c0046/artifacts/person-matte-mask-full.mp4';
export const PERSON_MATTE_ALPHA_URL = 'public/imports/c0046/artifacts/person-matte-alpha-full.webm';
export const APPLE_IMAGE_URL = 'public/imports/c0046/apple.svg';
export const SUBJECT_KEYED_S05_URL = 'public/imports/c0046/subject-keyed-s05.webm';
export const S05_BACKGROUND_BASE_URL = 'public/imports/c0046/bg-studio-warm.png';
export const S05_BACKGROUND_DEPTH_URL = 'public/imports/c0046/bg-studio-warm.png';
export const S05_SUBJECT_FRAMES_DIR = 'public/imports/c0046/subject-keyed-s05-frames';
export const S05_BACKGROUND_COMPOSITE_URL = 'public/imports/c0046/s05-background-composite.mp4';
export const S05_DEPTH_COMPOSITE_URL = 'public/imports/c0046/s05-depth-composite.mp4';

// S06 storyboard sketches (xkcd-style hand-drawn).
// Originals: projects/c0046/storyboard-assets/sketch/
export const SKETCH_P2A_HARNESS_EMPTY_URL = 'public/imports/c0046/sketch/p2a-harness-empty.png';
export const SKETCH_P2B_HARNESS_TOOLS_PROMPT_URL = 'public/imports/c0046/sketch/p2b-harness-tools-prompt.png';
export const SKETCH_P2C_HARNESS_CODING_URL = 'public/imports/c0046/sketch/p2c-harness-coding-full.png';
export const SKETCH_P2D_HARNESS_VIDEO_URL = 'public/imports/c0046/sketch/p2d-harness-video-full.png';
export const SKETCH_P5_SAM_URL = 'public/imports/c0046/sketch/p5-sam.png';
export const SKETCH_P6_MATANYONE_URL = 'public/imports/c0046/sketch/p6-matanyone.png';
export const SKETCH_P7_REMOTION_URL = 'public/imports/c0046/sketch/p7-remotion.png';
export const SKETCH_P8_TRANSCRIPTION_URL = 'public/imports/c0046/sketch/p8-transcription.png';
export const SKETCH_P9_TERMINAL_URL = 'public/imports/c0046/sketch/p9-terminal.png';
export const SKETCH_P10_RECORD_EDIT_URL = 'public/imports/c0046/sketch/p10-record-edit.png';

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
  introEnd: 10.24,
  heroHoldEnd: 8.72,
  ballWindowStart: 12,
  ballWindowEnd: 58,
  // Trigger beats two frames after the spoken keyword ends at 25fps.
  trackStart: 15.84,
  recolorBlue: 34.32,
  recolorRed: 38.24,
  recolorYellow: 42.88,
  appleSwap: 53.88,
  appleReactionEnd: 60.16,
  foregroundMatteStart: 60.24,
  // Trigger these S05 effects just after the spoken action lands.
  // 25fps => 2 frames = 0.08s.
  selfDetectStart: 68.32,
  selfDetectEnd: 72.48,
  selfMatteStart: 72.48,
  selfMatteEnd: 77.60,
  backgroundReplaceStart: 77.60,
  backgroundReplaceFadeEnd: 78.32,
  depthTextStart: 85.84,
  depthTextEnd: 89.68,
  explainStart: 89.84,
  // S06 — "How it works" / harness explainer
  // Word-locked timestamps from transcript_words.json (see worklog).
  // Bridge between S05 ("totally natural") and the harness reveal —
  // playful "booting up Codex" beat while Adi sets up the explainer.
  s06BridgeStart: 89.84,        // right after "totally natural" / depthTextEnd
  s06HarnessEmptyStart: 111.44, // "it's a harness"
  s06HarnessToolsStart: 121.32, // "tools that are available"
  s06HarnessCodingStart: 133.6, // "coding tools"
  s06HarnessVideoStart: 137.04, // "swap"
  // S07 — "The stack" tool reveals (now 4 tools, transcription is the 4th)
  s07SamStart: 150.08,           // "SAM"
  s07MatAnyoneStart: 164.24,     // "math anyone"
  s07RemotionStart: 178.0,       // "FFM"
  s07TranscribeStart: 183.52,    // "also transcribe"
  s07End: 192.32,                // moved to where S08 starts
  // S08 — workflow reality
  s08RealtimeStart: 192.32,     // "And of course, none of this is working in real time"
  s08RecordingStart: 208.08,    // "typically just record in front of a green screen"
  s08PromptingStart: 220.48,    // "boot up my terminal"
  s08IteratingStart: 229.44,    // "back and forth"
  // S09 — close
  s09ExperimentsStart: 247.68,  // "I try a lot of these experiments"
  s09OutroStart: 264.24,        // "Hope that this is useful"
};

// S06 sketch panel placement on the left third of the frame.
// Sized so it fits comfortably without crossing into Adi on the right.
export const SKETCH_PANEL_UI = {
  leftPx: 64,
  topPx: 220,
  widthPx: 560,
  heightPx: 760,
};

export const HERO_STAMP_TIMING = {
  thisStart: 2.4,
  thisEnd: 2.52,
  videoStart: 2.52,
  videoEnd: 2.96,
  percentStart: 3.2,
  percentEnd: 3.24,
  editedStart: 3.36,
  codexEnd: 5.2,
};

export const OPENER_UI = {
  labelScale: 1.56,
  codexScale: 1.8,
  disclaimerScale: 1.95,
  disclaimerBottomPx: 188,
  leftPx: 56,
  labelTopPx: 56,
  codexTopPx: 132,
};

export const DEMO_UI = {
  statusScale: 1.56,
  calloutScale: 1.8,
  leftPx: 56,
  statusTopPx: 56,
  calloutTopPx: 132,
};

export const BALL_RECOLOR = {
  blue: '#3b82f6',
  red: '#ef4444',
  yellow: '#facc15',
};

export const OVERLAY_VIEW = {
  showBallTrackingMask: true,
  showForegroundMatte: true,
};
