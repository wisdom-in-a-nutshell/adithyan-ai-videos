# Overlay Components (Repo-Specific)

This is a catalog of overlay components and where to tweak them. Use this to reuse parts quickly without re-reading the entire file.

## Primary Components

- `LabelOverlay` (RAW RECORDING pill)
  - File: `~/GitHub/adithyan-ai-videos/src/overlay_kit/overlays.js`
  - Knobs: `pillHeight`, `labelFontSize`, padding, background, blink dot.

- `CodexCallout` (CODEX badge)
  - File: `~/GitHub/adithyan-ai-videos/src/overlay_kit/overlays.js`
  - Knobs: `pillHeight`, font size, background, shadow, icon size.

- `DisclaimerOverlay` (bottom pill)
  - File: `~/GitHub/adithyan-ai-videos/src/overlay_kit/overlays.js`
  - Knobs: font size, padding, `maxWidth`, background color.
  - Readability: prefer solid black background when footage is bright.

- `ToolFlowOverlay` (multi-item tool list)
  - File: `~/GitHub/adithyan-ai-videos/src/overlay_kit/overlays.js`
  - Uses icon components and per-item timing.

- `StatusLeftOverlay` (status list on the left)
  - File: `~/GitHub/adithyan-ai-videos/src/overlay_kit/overlays.js`

- `EndpointsOverlay`, `BoxOverlay`, `DrawBoxOverlay`
  - File: `~/GitHub/adithyan-ai-videos/src/overlay_kit/overlays.js`
  - Used for active speaker detection + tracking.

- `CanvasSketchFrame`
  - File: `~/GitHub/adithyan-ai-videos/src/overlay_kit/overlays.js`
  - Sketch frame around whiteboard/canvas sections.

## Style Layer

- `SketchLayer`, `SketchDefs`
  - File: `~/GitHub/adithyan-ai-videos/src/styles/sketch.js`

## Composition Assembly

- `MainVideo` (composition + layout)
  - File: `~/GitHub/adithyan-ai-videos/src/MainVideo.js`

## Convenience Exports

- `overlay_kit/index.js` re-exports overlays + rough helpers for clean imports.
  - Centralizes pencil grain + sketch font.

## Reuse Tips

- Keep raw footage clean; apply sketch to overlays only.
- If a sketch border looks messy, prefer a clean border with a subtle shadow.
- Tweak one component at a time and preview.
