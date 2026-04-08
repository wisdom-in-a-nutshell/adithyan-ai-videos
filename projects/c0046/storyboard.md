---
project_id: c0046
status: draft-v2
aspect: 16:9
target_duration_sec: 267.24
audio_locked: true
core_motif: hero stamp + disclaimer pill + ball mask recolor + apple swap
---

# C0046 Storyboard

## Core Message
Codex isn't just a coding tool. Give it the right media tools and it becomes
a practical video editing agent — tracking, recoloring, swapping, matting,
compositing, and timing effects to the transcript.

## Reusable assets (already in repo)
- **HeroStamp** (`src/components/HeroStamp.js`) — autodetects `this video is
  100% edited by Codex` from `transcript_words.json`. Reuse as-is.
- **DisclaimerOverlay** (`src/overlay_kit/overlays.js`) — black bottom pill.
- **Ball alpha**: SAM3.1 segmentation (with alpha), window 12.0–58.0s,
  anchor 14.0s, prompt "black ball". VP9 alpha.webm, stacks cleanly as a
  foreground layer.
  - URL: `https://storage.aipodcast.ing/cache/sam3/alpha/f1782de5-6237-4646-8dd7-b4870fa37b6b.webm`
  - Status artifact: `projects/c0046/artifacts/segment-ball-12-58-alpha-status.json`

---

## S01 | 0.08–10.24 | Hook

**Transcript**
- 0.08 "Hi, my name is Adi, and everything that you're about to see in this
  video is 100% edited by Codex, a coding agent." (ends ~5.84)
- 6.56 "And in this video, we are going to use it as a video editing agent."
  (ends ~9.84)

**Key word timings**
- "about" 1.92 | "to" 2.08 | "see" 2.16
- "this" 2.40 | "video" 2.52 | "is" 2.96
- "100%" 3.20 | "edited" 3.36 | "by" 4.48 | "Codex" 4.60–5.20
- "a coding agent" 5.40–5.84

**Visual**
- **[S01A] Disclaimer pill** — `DisclaimerOverlay` at bottom.
  - Text: "Everything you're about to see in this video was edited by Codex."
  - Fade in ~1.90s (on "about to see").
  - Fade out ~10.0s (just before S02 begins).
- **[S01B] Hero stamp** — `HeroStamp` (the zoom effect).
  - Phrase detection auto-locks onto "this video is 100% edited by Codex"
    (starts ~2.40s, peaks on "100%" 3.20s, holds through "Codex" 5.20s).
  - `holdUntilSeconds: 6.2` so it clears before the second sentence.
  - Uses c0046 `transcript_words.json` as input.

**Edit cue** — trim any pause before "And in this video..."
**Sequences** — `[S01A] Disclaimer Pill`, `[S01B] Hero Stamp`

---

## S02 | 10.72–25.99 | Tracking Setup

**Transcript**
- 10.72 "So I have a ball, a black ball in my hand, and I'm going to ask
  Codex to start tracking it now."
- 18.56 "Now that it's tracking it, I'm going to start throwing it up and
  down."

**Key word timings**
- "ball" 11.84 (first visible mention)
- "black ball" 12.40–12.80
- "Codex" 14.36 | "start" 15.04 | "tracking" 15.32 | "now" 15.84
- "tracking it" 19.04–19.68
- "throwing it up and down" 20.80–21.88

**Visual**
- **Overlay pattern for S02–S04** — reuse the existing `text-effects` language.
  - Keep the top-left system alive through the demo beats.
  - **Top-left state pill** = short process verb (`TRACKING`, `RECOLORING`, `SWAPPING`).
  - **Support callout** = one short proof line under the state pill, not a long subtitle.
  - Avoid a large top title / long bottom title system for every beat; that is not how the earlier video read.
- **[S02] Ball alpha layer** — the SAM alpha asset, mounted as a foreground
  layer over the source video.
  - **Enters at 15.84s** (just after the word "tracking" lands). Before this it is hidden.
  - **Default visual**: a sketchy tracking ring that follows the ball from
    15.84 → 34.32. It should read as "Codex is locked on" without changing
    the object yet.
  - Stays active until S04 apple swap at 53.88s.

**Edit cue** — trim the pause between "start tracking it now" and the first
throw.

**Overlay copy**
- **Top-left state pill**: `TRACKING`
- **Support callout**: `I'm starting to track the ball.`
- **Exact overlay timing**: 15.84s → 34.32s

**Sequence**
- `[S02A] Status Pill: TRACKING`
- `[S02B] Support Callout: I'm starting to track the ball.`
- `[S02C] Ball Tracking Mask` (spans 15.84 → 53.88)

---

## S03 | 26.00–46.48 | Recolor Payoff

**Transcript**
- 26.00 "And I'm going to ask it to change the color of the ball."
- 29.28 "Codex, please change the color of the ball to blue."
- 36.16 "Now, can you change it to red?"
- 41.52 "Let's do yellow, maybe."
- 44.56 "And I'm just going to move it like that."

**Key word timings**
- "change the color of the ball" 27.76–28.64 (intent, no effect yet)
- **"blue" 33.72–34.24** → mask recolors to blue
- **"red" 37.52–38.16** → mask recolors to red
- **"yellow" 42.32–42.80** → mask recolors to yellow
- "move it like that" 45.68–46.16 (yellow holds through this)

**Visual**
- **[S03] Ball recolor** — a tracked color treatment follows the ball and
  fully overcovers the original black surface so no dark rim is visible.
  The current implementation uses tracked position data plus an intentionally
  oversized colored sphere, not a subtle tint blend.
  - Color changes land **just after the word**, not before it. The current
    offsets are two frames after each keyword ends at 25fps.
  - Colors (tentative): blue `#3b82f6`, red `#ef4444`, yellow `#facc15`.
    Adjust in `assets.js` after first preview.
- No prompt chips in this beat — the color change IS the proof. Keep the
  frame clean.

**Overlay copy**
- **Top-left state pill**: `RECOLORING`
- **Support callouts**
  - Blue beat: `I'm changing it to blue.`
  - Red beat: `I'm changing it to red.`
  - Yellow beat: `I'm changing it to yellow.`
- **Exact overlay timings**
  - `RECOLORING` state pill: 34.32s → 53.88s
  - `I'm changing it to blue.`: 34.32s → 38.24s
  - `I'm changing it to red.`: 38.24s → 42.88s
  - `I'm changing it to yellow.`: 42.88s → 53.88s

**Edit cue** — trim the pause between each prompt and the color change.
**Sequences**
- `[S03A] Status Pill: RECOLORING`
- `[S03B] Support Callout: I'm changing it to blue.`
- `[S03C] Recolor Blue`
- `[S03D] Support Callout: I'm changing it to red.`
- `[S03E] Recolor Red`
- `[S03F] Support Callout: I'm changing it to yellow.`
- `[S03G] Recolor Yellow`

---

## S04 | 47.28–60.16 | Object Swap (Ball → Apple)

**Transcript**
- 47.28 "Now that that's working, now I'm going to ask it to change this to
  an apple, maybe."
- 55.88 "Okay, that worked."
- 57.20 "Could have been better."
- 59.76 "Not bad."

**Key word timings**
- "change this to" 51.20–52.08 (intent)
- **"apple" 53.44–53.80** → apple swap triggers at 53.88s
- "that worked" 56.40–56.52 (reaction — keep)
- "could have been better" 57.20–57.68 (keep one reaction line)

**Visual**
- **[S04] Apple swap** — at 53.88s, the tinted ball treatment is replaced by an
  apple image composited at the alpha centroid.
  - Source image: local transparent apple asset
    (`public/imports/c0046/apple.svg`).
  - The apple follows the ball alpha's centroid from 53.88 → 58.0s. From
    58.0 → 60.16 the apple is held at its last position (or fades out),
    since the SAM window ends at 58.0.
- One reaction beat held, chatter after trimmed.

**Overlay copy**
- **Top-left state pill**: `SWAPPING`
- **Support callout**: `I'm replacing it with an apple.`
- **Exact overlay timing**: 53.88s → 60.16s

**Edit cue** — keep "okay that worked" and "could have been better", trim
"not bad" if the beat runs long.

**Sequence**
- `[S04A] Status Pill: SWAPPING`
- `[S04B] Support Callout: I'm replacing it with an apple.`
- `[S04C] Apple Swap`

**Open items (blockers)**
- Apple PNG asset — I can pull one via media-toolkit or you provide a URL.
- Extending tracking beyond 58.0s — either re-run SAM with a wider window,
  or freeze the apple at the last-known position. Easier path: freeze.

---

## S05 — S09 | To be visualized later

User will decide the visuals for the back half after seeing the S01–S04
preview render. Narration-only for now; current timestamps from v1:

- S05 60.24–89.68  Expand to subject editing
- S06 89.84–144.76 Why this works (harness)
- S07 144.88–191.68 Toolchain breakdown
- S08 192.32–247.28 Workflow reality
- S09 247.68–267.04 Close

---

## Implementation order (S01–S04 only)

1. **S01B Hero stamp** — cheapest win, component already exists, just needs
   wiring and `transcript_words.json` passed in.
2. **S01A Disclaimer pill** — trivial, uses existing component.
3. **S02 + S03 ball mask recolor** — load the SAM mask video, composite it
   tinted over the source during the window. Recolor at word timings.
4. **S04 apple swap** — swap tint for an apple image at 53.88s.

## Constants to add to `src/projects/c0046/assets.js`

```js
// SAM alpha for the black ball (VP9 alpha.webm)
export const BALL_ALPHA_URL = 'https://storage.aipodcast.ing/cache/sam3/alpha/f1782de5-6237-4646-8dd7-b4870fa37b6b.webm';
export const BALL_ALPHA_WINDOW = {start: 12.0, end: 58.0, anchor: 14.0};

// Apple image
export const APPLE_IMAGE_URL = 'public/imports/c0046/apple.svg';

// Effect anchors (seconds) — derived from transcript, hardcoded per skill guidance
export const TIMING = {
  disclaimerIn: 1.90,
  disclaimerOut: 10.00,
  heroStampPhraseStart: 2.40,   // "this video is"
  heroStampHoldUntil: 6.20,
  trackStart: 15.84,            // just after "tracking"
  recolorBlue: 34.32,
  recolorRed: 38.24,
  recolorYellow: 42.88,
  appleSwap: 53.88,
  maskWindowEnd: 58.00,
  s04End: 60.16,
};
```
