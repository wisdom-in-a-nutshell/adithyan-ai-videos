export const PROJECT_ID = 'c0046';
export const PROJECT_TITLE = 'C0046';

// Runtime media is remote-first so local and cloud renders use the same asset contract.
export const VIDEO_URL =
  'https://storage.aipodcast.ing/share/agent-media-toolkit/by-hash/d2751e027b5318a42691bb206ad8bcc3eeaaa6f4d8cc1f1ff61bf52c30d50395/source.mp4';
export const PERSON_MATTE_ALPHA_URL =
  'https://storage.aipodcast.ing/cache/matanyone/alpha/85deb882-444b-4304-ba4a-f73196e4dd9f.webm';
export const APPLE_IMAGE_URL =
  'https://storage.aipodcast.ing/share/agent-media-toolkit/by-hash/2273db9cd08848f71db3f2ffb3796e33d007b95b94c3ce71cb139509ca3ff679/apple.svg';
export const S05_BACKGROUND_BASE_URL =
  'https://storage.aipodcast.ing/share/agent-media-toolkit/by-hash/af16a3c3027384fc5c0c762d2e37c091ad217edb28c2dd7b0fb9c5aa4b5c54e2/bg-studio-warm.png';
export const S05_BACKGROUND_DEPTH_URL = S05_BACKGROUND_BASE_URL;
export const S05_SUBJECT_MATTE_URL =
  'https://storage.aipodcast.ing/share/agent-media-toolkit/by-hash/by-hash/bec580e02a17730d932822e084f29a159d318a2677b77542559fdc80bca8026d/subject-keyed-s05-alpha.webm';

// S06 storyboard sketches (xkcd-style hand-drawn).
// Originals: projects/c0046/storyboard-assets/sketch/
export const SKETCH_P2A_HARNESS_EMPTY_URL =
  'https://storage.aipodcast.ing/share/agent-media-toolkit/by-hash/34ed725d5044a9e6254e5f135f2b2d96a3c554ca92233bc2e99735ea3a407944/p2a-harness-empty.png';
export const SKETCH_P2B_HARNESS_TOOLS_PROMPT_URL =
  'https://storage.aipodcast.ing/share/agent-media-toolkit/by-hash/c7451b7140ac3b2d15f9213f4231b41fd726c75836454d07440d8c3aeb518c7d/p2b-harness-tools-prompt.png';
export const SKETCH_P2C_HARNESS_CODING_URL =
  'https://storage.aipodcast.ing/share/agent-media-toolkit/by-hash/30fce98e2aa4744a824cb173c2111222392fc27804d12693cac6f60be6345a61/p2c-harness-coding-full.png';
export const SKETCH_P2D_HARNESS_VIDEO_URL =
  'https://storage.aipodcast.ing/share/agent-media-toolkit/by-hash/08c861150ef6112884fc60fc3f6203e932eba3eb39f8477ea56d8dba1a49df0b/p2d-harness-video-full.png';
export const SKETCH_P5_SAM_URL =
  'https://storage.aipodcast.ing/share/agent-media-toolkit/by-hash/1bed5a30c9aa6d5dd9a14c4d3c23cafa3e0921c267b4d740f2a8c4f207b773ca/p5-sam.png';
export const SKETCH_P6_MATANYONE_URL =
  'https://storage.aipodcast.ing/share/agent-media-toolkit/by-hash/a3fcfddb049184d784b085fb7aacb0707e45870f3fc2d52771efe2b7c0641216/p6-matanyone.png';
export const SKETCH_P7_REMOTION_URL =
  'https://storage.aipodcast.ing/share/agent-media-toolkit/by-hash/064e846eff0bff6a4db4960d3fbcb08f2282cb7c698b94e9c4bab7828c8123aa/p7-remotion.png';
export const SKETCH_P8_TRANSCRIPTION_URL =
  'https://storage.aipodcast.ing/share/agent-media-toolkit/by-hash/dbc92cfe73a27adb086751f1ea171f7a22c9beaac32d94f527a25c3031de90bf/p8-transcription.png';
export const SKETCH_P9_TERMINAL_URL =
  'https://storage.aipodcast.ing/share/agent-media-toolkit/by-hash/e5cd57a67ca553e8ea9390f9ba096a5855d35c45cfd16e93ebb8e3a5f5d7ad80/p9-terminal.png';
export const SKETCH_P10_RECORD_EDIT_URL =
  'https://storage.aipodcast.ing/share/agent-media-toolkit/by-hash/7b1dd66889aa06c732fbbeaec0e70db1f1d375530b72a9e8fdfc077368ca62a7/p10-record-edit.png';
export const SKETCH_P11_OUTRO_MASCOT_URL =
  'https://storage.aipodcast.ing/share/agent-media-toolkit/by-hash/d2c3c3acd13348265b26733c03ae72b89b747e05486bd1b51f91e2c02c14836e/p11-outro-mascot.png';

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
  ballWindowStart: 12,
  ballWindowEnd: 58,
  // Trigger beats two frames after the spoken keyword ends at 25fps.
  trackStart: 15.84,
  recolorBlue: 34.32,
  recolorRed: 38.24,
  recolorYellow: 42.88,
  appleSwap: 53.88,
  // Apple visual overlay stops at "could" (in "could have been better")
  // because the underlying ball track drifts after that point.
  appleVisualEnd: 57.2,
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
