# Writer Handoff: "Text Effects" Video (Codex + Video Toolchain Demo)

This is not a blog post. This is a human-writer handoff: the conceptual approach we took, what we built, and the concrete inputs/outputs so someone can write a long-form post without reverse-engineering the repo.

## What We Were Trying To Make

A short explainer-style video where the on-screen overlays match the narration:

- Prove the claim fast: "this video was 100% edited by Codex", with text both in front of and behind the subject.
- Explain the idea: Codex is an agent that can use tools to produce artifacts (coding artifacts, then video artifacts).
- Introduce a 3-tool chain for video editing effects:
  - SAM3 for a static segmentation mask.
  - MatAnyone for tracking the subject across the full video to create a foreground alpha.
  - Remotion for compositing layers and adding motion/typography effects.
- Then do a short "recap" that reiterates what each tool did.

The meta-goal was also workflow-oriented: edit in a code-first way (no timeline editor), iterate quickly, and keep the structure simple enough that the next video can be built faster.

## High-Level Approach (How We Worked)

We followed a "record first, then edit in code" loop:

1. Record the video (raw MP4).
2. Generate a word-timestamp transcript (words with start/end times).
3. Draft a storyboard as beats (start/end times + intent + visual notes).
4. Implement one Remotion composition that plays:
   - The raw video as the background for the entire duration.
   - The alpha video as the foreground for the entire duration (muted).
   - A set of named sequences (beats) layered in between/above as overlays.
5. Iterate by rendering short slices and a few stills, adjust timing/placement, repeat.

Key decision for speed:
- We did NOT build a complex, generic "auto timing" system.
- Once the transcript was stable, we hardcoded a handful of important timestamps (seconds) in code so overlays hit the spoken words exactly.

## The Source Assets We Used (Inputs)

Raw recording (background layer):
- `TEXT_EFFECTS_VIDEO_URL` in `src/projects/text-effects/assets.js`
- URL:
  - https://descriptusercontent.com/published/1b6b1b12-e333-487f-a2e7-87b87d68ec26/original.mp4

Foreground alpha (for "text behind subject"):
- `TEXT_EFFECTS_ALPHA_URL` in `src/projects/text-effects/assets.js`
- URL:
  - https://storage.aipodcast.ing/cache/matanyone/alpha/88efdd42-c664-4df2-8c7d-34824323e95c.webm

Static mask PNG (SAM3 output example):
- `TEXT_EFFECTS_SAM3_STATIC_MASK_URL` in `src/projects/text-effects/assets.js`
- URL:
  - https://storage.aipodcast.ing/cache/sam3/masks/94496d1d-30e1-4c13-a632-ebbaa2d900d9.png

## The Intermediate Artifacts We Generated/Used

Project folder (human-readable artifacts and planning):
- `projects/text-effects/transcript.json`
  - Full transcript data (includes word timings).
- `projects/text-effects/words.json`, `projects/text-effects/sentences.json`
  - Thin derived artifacts for easier indexing.
- `projects/text-effects/storyboard.json`
  - Beat-based plan for the whole video (scenes S01..).
- `projects/text-effects/matting.json`
  - Reference metadata for SAM3/MatAnyone outputs (URLs).
  - Important: not used as a runtime contract; used as notes/receipts.
- `projects/text-effects/transform_720p.json`
  - Proxy/transform output (used when iteration needs a standardized size).

Code-first project folder (what Remotion consumes directly):
- `src/projects/text-effects/transcript_words.json`
  - Word-level timings used by overlays.
- `src/projects/text-effects/assets.js`
  - All URLs + cut length + the hardcoded timing anchors (seconds).

## How The Video Is Structured In Code (Conceptually)

One composition per video, with beat sequences:

- Composition: `TextEffects`
- Registered in: `src/Root.js` (composition registry)
- Implementation: `src/projects/text-effects/TextEffectsComp.js`

The composition plays:

1. Background video (raw MP4) for the full duration.
2. Foreground alpha video (VP9 WebM with alpha) for the full duration.
3. Overlays, each mounted as a named `<Sequence name="...">` so the timeline is readable in Remotion Studio.

We kept overlays modular:
- Each beat/effect is its own file under `src/projects/text-effects/`.
- This helps iteration: you can tweak one beat without breaking the whole comp.

## What We Implemented (By Beat)

The storyboard lives in `projects/text-effects/storyboard.json`. The timings that actually drive the code are in `src/projects/text-effects/assets.js`.

Examples of beats/effects implemented:

- S01: "Hero stamp" text ("THIS VIDEO 100% EDITED BY CODEX")
  - Hardcoded micro-timings so each word hits the narration.
- S02/S03: "RAW RECORDING" + "ANIMATING" style status pills and the "Codex -> tools -> artifacts" explanation.
- S04/S05/S06/S07: the toolchain explanation:
  - Show the three tools.
  - Show a static mask result.
  - Show a "green screen without a green screen" preview.
  - Show basic Remotion composition examples (blur background, text front/behind/fancy).
- Recap: simplified to a clean callout that reiterates tool + what it did, plus a link card.

## The Recurring Problems We Hit (And The Fixes)

These are the things that caused the most iteration churn:

1. Green fringe / halo around the subject
   - What it is: the RGB edges in the alpha asset can be tinted (often green) near partially transparent pixels.
   - What helped:
     - Prefer a true alpha asset (`alpha.webm`) rather than a "green mask video".
     - Try "shrink" (erode the matte) before "feather" (blur), because feather can spread edge colors outward.

2. "Why does the video/audio restart when an effect starts?"
   - What it is: mounting a new `Video` component partway through the timeline can start that clip at time 0.
   - What helped:
     - Avoid introducing extra `Video` layers unless needed.
     - If you do, align it with the timeline using a start offset (`startFrom`) and keep it muted to prevent doubled audio.

3. "Something is behind the subject when it should be in front"
   - What it is: ordering and z-index issues when you have a foreground alpha layer.
   - What helped:
     - Explicit `zIndex` on overlay roots; be intentional about layer ordering.

4. Studio shows an error that doesn't match the current code
   - What it is: stale JS bundle in the browser.
   - Fix loop:
     - stop `npm start`
     - restart `npm start`
     - hard-refresh the tab (Cmd+Shift+R)

5. Timing confusion inside `<Sequence>`
   - What it is: `useCurrentFrame()` resets to 0 inside a sequence.
   - How we kept it sane:
     - Use hardcoded seconds anchors for key moments once the transcript is stable.
     - When you truly need global timing, compute it explicitly using the sequence's frame offset.

## How We Iterated (What "Fast" Looked Like)

We deliberately used short renders and still frames instead of trusting Studio playback for everything.

Commands (repo):

```bash
cd ~/GitHub/adithyan-ai-videos

# Studio (opens Remotion Studio)
npm start

# Short render slice (timestamps in seconds)
npm run render -- --comp TextEffects --from 0 --to 6

# Full quality render
npm run render -- --comp TextEffects --hq

# Stills at specific frames
npx remotion still src/index.js TextEffects /tmp/text-effects-f0048.png --frame 48 --overwrite
```

## What To Point A Writer At (If They Want Concrete "Receipts")

If you want a short "receipts" section (like the older blog post style):

- Storyboard (beats + intent): `projects/text-effects/storyboard.json`
- Transcript + word timings:
  - full: `projects/text-effects/transcript.json`
  - thin: `src/projects/text-effects/transcript_words.json`
- Matting outputs metadata: `projects/text-effects/matting.json`
- Remotion entrypoints:
  - `src/projects/text-effects/TextEffectsComp.js`
  - `src/projects/text-effects/assets.js`
- Overlay modules (each beat/effect): `src/projects/text-effects/*.js`

## The "Philosophy" In One Paragraph (Good For The Blog)

We treated video editing like software: capture a stable source recording, generate a word-level transcript, plan beats, then implement and iterate on effects in a single deterministic Remotion composition. Codex acted as the "editor" by writing and adjusting code, while we verified with short renders and stills. The result is a reproducible, inspectable edit pipeline: assets and timing live in code, and changes are reviewable like a normal codebase.

