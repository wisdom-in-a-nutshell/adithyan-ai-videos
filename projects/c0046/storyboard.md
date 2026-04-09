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
  - Current implementation: built-in vector-style apple shape inside
    `C0046Comp.js`, sized from the tracked ball position to guarantee full
    coverage in the swap beat.
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

## S05 | 60.24–89.68 | Expand to subject editing

**Transcript (key lines)**
- 60.24 "This black ball is an object. I myself am an object too."
- 63s   "I could ask it to detect me. And then once it detects me, crop me out."
- 67s   "It could start adding interesting backgrounds behind me."
- 75s   "I could also add like a text in between me and the background."

**Exact action timings**
- `detect me` ends at `68.24s` -> subject outline enters at `68.32s`
- `crop me out` ends at `72.40s` -> matte cue enters at `72.48s`
- `backgrounds behind me` ends at `77.52s` -> background replace enters at `77.60s`
- `text in between me and the background` ends at `85.76s` -> depth text enters at `85.84s`

**Visual concept — depth compositing demo**

Layer order (bottom → top):
1. **Background replacement** — swap the green screen for the warm studio
   plate during the "interesting backgrounds" beat, then keep that same
   studio background continuously through the full `TOTALLY NATURAL` depth beat.
2. **Depth text layer** — floating label text sits BETWEEN the background and
   Adi's silhouette while the studio plate remains behind him.
3. **Person matte** (`person-matte-alpha-full.webm`) — composites Adi on top.
4. **UI overlays** on top as usual.

**Beat breakdown**
- **60.24s** "I myself am an object" → same sketch-outline circle from S02,
  but drawn around Adi's full body silhouette (body track, not ball track).
  Shows the detection moment.
- **63s** "crop me out" → the person matte border pulses / glows briefly
  (subtle outline around Adi's silhouette to show the mask edge).
- **67s** "interesting backgrounds" → background replacement kicks in (dark
  dot grid fades in behind him). Keep it minimal — one clean dark background,
  not a busy scene.
- **75s** "text in between" → a floating pill or label appears BEHIND Adi
  using depth compositing. Suggested text: `DEPTH LAYER`. This is the exact
  same technique from the text-effects project.

**Overlay copy (top-left)**
- Status pill: `DETECTING`  → 60.24s–63s
- Status pill: `MATTING`    → 63s–67s
- Status pill: `COMPOSITING`→ 67s–89.68s
- Support callouts follow transcript beats (use CodexCallout, same pattern as S02–S04)

**Implementation notes**
- Background layer: put INSIDE the z180 wrapper after the source clip, as a
  `<Sequence from={foregroundMatteStart}>`. DOM order puts it above the source
  video but below overlay pills.
- Person matte: already wired at z220 outside z180 wrapper. The matte's alpha
  channel composites Adi on top of whatever is in z180.
- Depth text: render a text div BETWEEN the background sequence and the person
  matte sequence in DOM order. The matte will naturally composite Adi in front.
- Body outline: needs a separate SAM or bounding-box track for Adi's body.
  If not available, approximate with a full-frame sketch oval drawn at the
  known person centroid. Decision deferred.

---

## S06 | 89.84–144.76 | Why this works (harness)

**Transcript (key lines)**
- ~90s  "Now I'm going to just briefly talk about how all of this works."
- ~92s  "So we use Codex to completely edit…"
- ~100s Explains the harness/toolchain

**Visual concept — flow diagram (CodexToolsArtifactsOverlay pattern)**

Reuse the `CodexToolsArtifactsOverlay` component from text-effects verbatim
or with minor copy changes. The flow reads:

```
CODEX
  ↓
  🛠  Video tools
  ↓
  ✨  Video artifacts
```

The pills drop in one by one as Adi names each part. Top-left position,
below the status pill. Same blue connector line + arrow animation.

**Overlay copy**
- Status pill: `HOW IT WORKS`
- Flow items (timed to transcript):
  - `Video tools` (emoji 🛠) → ~92s
  - `Video artifacts` (emoji ✨) → ~95s

**Exact beat breakdown**
- **89.84–93.24** `HOW IT WORKS`
  - Callout: `How all of this works.`
  - This is the transition beat out of the proof section.
- **93.24–97.68** `EDITING`
  - Callout: `Codex edits the video and brings in the effects.`
  - Keep this in the old `text-effects` pill/callout language, not a new visual system.
- **98.16–108.64** `CODING AGENT`
  - Callout: `Codex is known as a coding agent.`
  - Then update the support line on `video editing here`.
- **110.40–129.68** `HARNESS`
  - This is the key explanatory block.
  - Use the `CodexToolsArtifactsOverlay` pattern here:
    - `Model`
    - `Harness`
    - `Tools`
    - `Prompt + instructions`
  - The loop/steering explanation should feel like a structured diagram, not a raw subtitle dump.
- **130.08–144.76** `SWAPPING TOOLS`
  - Callout: `Swap coding tools for video editing tools.`
  - This is the payoff line before the tool-specific breakdown starts.

**Recommended implementation**
- Reuse the old top-left status/callout stack immediately after `S05`.
- Reuse `CodexToolsArtifactsOverlay` for the harness explanation only.
- Keep the background simple; by this point the proof is already established.

---

## S07 | 144.88–191.68 | Toolchain breakdown

**Visual concept — ThreeToolsOverlay pattern**

Reuse `ThreeToolsOverlay` from text-effects. Three numbered pills drop in
below the status pill as Adi names each tool:

1. SAM3          → segmentation / tracking
2. MatAnyone     → person matting
3. Remotion      → compositing + rendering

**Overlay copy**
- Status pill: `THE STACK`
- Numbered pills timed to when Adi mentions each tool name.

**Exact beat breakdown**
- **144.88–149.36** `THE STACK`
  - Callout: `I used two specific tools.`
- **149.36–154.96** `TOOLS`
  - `SAM 3.1`
  - `MatAnyone`
  - This can use `ThreeToolsOverlay`, but trimmed to only the tools actually named here.
- **155.04–162.56** `SAM 3.1`
  - Callout: `Tracks objects and gives a segment mask.`
  - This is a strong place to reuse the old object-tracking / segmentation explanation language.
- **163.04–169.60** `MATANYONE`
  - Callout: `Gets an object boundary around me.`
- **170.08–181.12** `COMBINING`
  - Callout: `Once you have the masks, ffmpeg can put it together.`
  - Keep this concise; the point is orchestration, not ffmpeg branding.
- **183.36–191.68** `TRANSCRIPT TIMING`
  - Callout: `The transcript tells Codex where effects should start and stop.`
  - This is the bridge from tools to workflow.

**Recommended implementation**
- Reuse `ThreeToolsOverlay`, but make it project-specific instead of verbatim.
- Keep the top-left status pill alive throughout.
- This section should feel like Codex naming the stack, not like a brand slide.

---

## S08 | 192.32–247.28 | Workflow reality

**Transcript theme** — Adi explains the practical workflow (prompting Codex,
iterating, the human-in-the-loop role).

**Visual concept — minimal callout pills**

No complex flow diagram. Just the status + support callout pattern from S02–S04:
- Status pill changes per sub-beat (`PROMPTING`, `ITERATING`, `REVIEWING`)
- One support callout per beat reinforcing the spoken word

Keep it clean — by this point the viewer has seen the technique; visual
complexity should decrease, not increase.

**Exact beat breakdown**
- **192.32–204.28** `NOT REAL TIME`
  - Callout: `This is not working in real time.`
  - Secondary line can mention trying new tools quickly.
- **204.84–213.84** `STORYBOARDING`
  - Callout: `I usually start with a rough storyboard in my head.`
- **216.08–227.84** `PROMPTING`
  - Callout: `I give Codex the tools and the intent.`
  - This is a clean place for a terminal/prompt-flavored overlay if needed.
- **228.40–230.24** `ITERATING`
  - Callout: `Then we go back and forth.`
- **230.88–247.28** `WORKFLOW`
  - Callout: `Now the whole workflow is under an hour.`
  - This is the “skills / system got better” payoff beat.

**Recommended implementation**
- This section should be mostly pills, callouts, and maybe one terminal-ish accent.
- Do not bring back heavy proof effects here.
- Let the pacing breathe more than in the first half.

---

## S09 | 247.68–267.04 | Close

**Transcript theme** — wrap-up, call to action.

**Visual concept — outro card**

Simple centred card (using `TitleOverlay` or a custom outro) with:
- "100% edited by Codex" as the headline (echoing the opener)
- Fade to black

Timing: card enters at ~250s, holds, fades to black by 267s.

**Exact beat breakdown**
- **247.68–255.68** `EXPERIMENTS`
  - Callout: `A lot of these experiments fail. Some work.`
- **255.68–256.96** `THIS ONE WORKED`
  - Callout: `If you're seeing this, this one worked.`
- **258.72–263.76** `OTHER USES`
  - Callout: `You can use Codex for more than coding.`
- **264.24–267.04** `OUTRO`
  - `Hope this is useful. Thanks. Bye.`

**Recommended implementation**
- Keep the ending simple.
- Echo the opener visually rather than inventing a new ending style.
- The cleanest close is:
  - small status/callout beat
  - then a centred `100% edited by Codex` outro card
  - fade to black

---

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

// Apple swap is currently implemented as a built-in vector-style shape in
// C0046Comp.js rather than a separate runtime asset.

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
