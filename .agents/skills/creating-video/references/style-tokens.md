# Style Tokens and Sketch Settings

## House Style

- Prefer the shared top-left beat stack:
  - dark status pill
  - white rounded callout card
  - small colored activity dots only as accents
- Keep the footage itself clean. The sketch treatment belongs on overlays, outlines, panels, and helper graphics.
- Use one project-level scale constant so pills, callouts, and panel labels stay visually related across scenes.
- Favor clean editorial contrast over “maximal sketchiness”. If a rough treatment hurts readability, simplify it immediately.

## Shared Block First

- Start from `src/effects/` for the repo’s default look:
  - `EditorialBeat.js`
  - `SketchPanel.js`
  - `FadeInBackdrop.js`
  - `TrackedObjectOverlay.js`
- Drop to `src/overlay_kit/` only when the higher-level shared block does not fit.

## Central Sketch Style

- File: `~/GitHub/adithyan-ai-videos/src/styles/sketch.js`
- Key exports:
  - `SKETCH_FONT_FAMILY`
  - `SKETCH_STROKE_FILTER`
  - `SketchDefs`
  - `SketchLayer`

## RoughJS Defaults

- File: `~/GitHub/adithyan-ai-videos/src/overlay_kit/rough.js`
- `ROUGH_STYLE` (general sketch lines)
- `ROUGH_BOX_STYLE` (active speaker boxes)
- `ROUGH_PILL_STYLE` (pill outlines)

Notes:
- RoughJS defaults look messy if roughness or bowing is high.
- Prefer single-stroke for clean pencil lines.
- Keep roughness low enough that text and edges still feel intentional.

## Readability Rules

- Use solid black or very dark backgrounds for critical text on bright footage.
- Avoid sketch effects directly on video frames.
- Put moving or detailed text on a pill, card, or soft backdrop before increasing font weight forever.
- If a background replacement or alpha comp makes text harder to read, solve contrast first, not decoration first.

## Copy + Label Guidance

- Short, punchy copy works best for overlays.
- Status pill text should read like a system state.
- Callout text should read like the agent is explaining its current action.
- If the overlay spans full width, tighten font size or apply `maxWidth`.
