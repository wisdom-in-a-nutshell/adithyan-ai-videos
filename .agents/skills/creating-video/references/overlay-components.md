# Overlay Components (Repo-Specific)

This is a catalog of overlay components and where to tweak them. Use this to reuse parts quickly without re-reading the entire file.

## Shared Beats First

- `StatusBeat`, `CalloutBeat`, `StatusCalloutBeat`
  - File: `~/GitHub/adithyan-ai-videos/src/effects/EditorialBeat.js`
  - Use for the repeated top-left status/callout pattern before dropping down to lower-level pills.

- `SketchPanel`
  - File: `~/GitHub/adithyan-ai-videos/src/effects/SketchPanel.js`
  - Use for storyboard or explainer panel reveals.

- `TransparentVideoOverlay`
  - File: `~/GitHub/adithyan-ai-videos/src/effects/TransparentVideoOverlay.js`
  - Use for alpha-video cutouts, matte outlines, and foreground subject layers.

- `FadeInBackdrop`
  - File: `~/GitHub/adithyan-ai-videos/src/effects/FadeInBackdrop.js`
  - Use for simple background handoffs.

- `TrackedObjectOverlay`
  - File: `~/GitHub/adithyan-ai-videos/src/effects/TrackedObjectOverlay.js`
  - Use for tracked circular object treatments driven by track data.

Preview surface:

- `EffectsLab`
  - Files: `~/GitHub/adithyan-ai-videos/src/projects/effects-lab/`
  - Use when you want to inspect the shared block behavior without opening a narrative project.

## Low-Level Primitives

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

## Legacy Composition Assembly

- `MainVideo` (composition + layout)
  - File: `~/GitHub/adithyan-ai-videos/src/MainVideo.js`
  - Legacy path used by active-speaker detection. Do not treat it as the default pattern for new projects.

## Convenience Exports

- `overlay_kit/index.js` re-exports overlays + rough helpers for clean imports.
  - Centralizes pencil grain + sketch font.

## Reuse Tips

- Prefer `src/effects/` first if the block already exists there.
- Keep raw footage clean; apply sketch to overlays only.
- If a sketch border looks messy, prefer a clean border with a subtle shadow.
- Tweak one component at a time and preview.
