# Style Tokens and Sketch Settings

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
- RoughJS defaults look messy if roughness/bowing is high.
- Prefer single-stroke for clean pencil lines.
- Keep roughness lower for readable overlays.

## Readability Rules

- Use solid black background for critical text overlays on bright footage.
- Avoid sketch effects directly on video frames.

## Copy + Label Guidance

- Short, punchy copy works best for overlays.
- If the overlay spans full width, tighten font size or apply max-width.
