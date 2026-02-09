export const TEXT_EFFECTS_VIDEO_URL =
  'https://descriptusercontent.com/published/1b6b1b12-e333-487f-a2e7-87b87d68ec26/original.mp4';

export const TEXT_EFFECTS_ALPHA_URL =
  'https://storage.aipodcast.ing/cache/matanyone/alpha/88efdd42-c664-4df2-8c7d-34824323e95c.webm';

export const TEXT_EFFECTS_CODEX_LOGO_URL =
  'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/ChatGPT-Logo.svg/2560px-ChatGPT-Logo.svg.png';

// Storyboard beat: setup-what-youll-see
export const TEXT_EFFECTS_SETUP_START_SECONDS = 9.2;
export const TEXT_EFFECTS_SETUP_END_SECONDS = 22.64;

// Storyboard beat: setup-what-codex-is
export const TEXT_EFFECTS_SETUP_CODEX_START_SECONDS = 22.64;
export const TEXT_EFFECTS_SETUP_CODEX_END_SECONDS = 50.96;

// setup-what-codex-is: key phrase anchors from transcript (seconds)
export const TEXT_EFFECTS_SETUP_TOOLS_SECONDS = 28.88;
export const TEXT_EFFECTS_SETUP_DIGITAL_ARTIFACTS_SECONDS = 33.44;

export const TEXT_EFFECTS_SETUP_CODING_TOOLS_SECONDS = 39.4;
export const TEXT_EFFECTS_SETUP_CODING_ARTIFACTS_SECONDS = 42.36;

export const TEXT_EFFECTS_SETUP_VIDEO_TOOLS_SECONDS = 47.2;
export const TEXT_EFFECTS_SETUP_VIDEO_ARTIFACTS_SECONDS = 49.6;

export const TEXT_EFFECTS_THREE_TOOLS_START_SECONDS = 50.96;
export const TEXT_EFFECTS_THREE_TOOLS_END_SECONDS = 57.84;

// Storyboard beat: tool-1-sam3 (S05)
export const TEXT_EFFECTS_TOOL1_SAM3_START_SECONDS = 57.92;
export const TEXT_EFFECTS_TOOL1_SAM3_END_SECONDS = 80.0;

// tool-1-sam3: key phrase anchors from transcript (seconds)
// "Then it'll look something like this."
export const TEXT_EFFECTS_SAM3_MASK_SHOW_SECONDS = 67.68;
// "... static mask."
export const TEXT_EFFECTS_SAM3_STATIC_MASK_SECONDS = 76.96;

// Static mask PNG output from SAM3.
export const TEXT_EFFECTS_SAM3_STATIC_MASK_URL =
  'https://storage.aipodcast.ing/cache/sam3/masks/94496d1d-30e1-4c13-a632-ebbaa2d900d9.png';

// Storyboard beat: tool-2-matanyone
export const TEXT_EFFECTS_TOOL2_START_SECONDS = 80.08;
export const TEXT_EFFECTS_TOOL2_END_SECONDS = 129.52;

// tool-2-matanyone: green screen preview timing (hardcoded for this recording).
// Starts at: "So if I do that," and ends at: "... the original video."
export const TEXT_EFFECTS_TOOL2_GREEN_START_SECONDS = 95.28;
export const TEXT_EFFECTS_TOOL2_GREEN_END_SECONDS = 116.72;

// Storyboard beat: tool-3-remotion (S07)
export const TEXT_EFFECTS_TOOL3_REMOTION_START_SECONDS = 129.52;
export const TEXT_EFFECTS_TOOL3_REMOTION_END_SECONDS = 180.16;

// tool-3-remotion: demo "blur the background" timing (hardcoded for this recording).
// Start when we say "sort of blurred out" (not when we mention blur).
export const TEXT_EFFECTS_TOOL3_BLUR_BG_START_SECONDS = 150.56;
export const TEXT_EFFECTS_TOOL3_BLUR_BG_END_SECONDS = 154.96;
export const TEXT_EFFECTS_TOOL3_BLUR_BG_PX = 8;

// tool-3-remotion: demo text placement timing (hardcoded for this recording).
export const TEXT_EFFECTS_TOOL3_TEXT_FRONT_START_SECONDS = 156.72;
// Persist once it appears (we want all three labels to stay on-screen as we talk through them).
export const TEXT_EFFECTS_TOOL3_TEXT_FRONT_END_SECONDS = 166.56;
export const TEXT_EFFECTS_TOOL3_TEXT_BEHIND_START_SECONDS = 158.96;
export const TEXT_EFFECTS_TOOL3_TEXT_BEHIND_END_SECONDS = 166.56;
export const TEXT_EFFECTS_TOOL3_TEXT_FANCY_START_SECONDS = 163.36;
export const TEXT_EFFECTS_TOOL3_TEXT_FANCY_END_SECONDS = 166.56;

// Cut includes beat 1+2+3 and the toolchain walkthrough through Remotion.
export const TEXT_EFFECTS_CUT_SECONDS = 181.0;
