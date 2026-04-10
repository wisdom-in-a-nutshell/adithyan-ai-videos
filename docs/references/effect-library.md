# Effect Library

This repo keeps Remotion domain guidance external and generic. The local shared
layer exists only for this repo's house style and repeated editorial patterns.

Use the layers like this:

- `src/overlay_kit/`: low-level UI primitives such as pills, callouts, labels,
  and rough/sketch drawing helpers.
- `src/effects/`: reusable beats and compositing blocks built from those
  primitives.
- `src/projects/<id>/`: project-specific timing, copy, assets, and scene
  assembly.

## Current Shared Blocks

- `StatusBeat` and `CalloutBeat` in [EditorialBeat.js](/Users/dobby/GitHub/adithyan-ai-videos/src/effects/EditorialBeat.js)
  Use for the repeated top-left status/callout timeline pattern. Keeps the
  house layout stable while leaving timing and copy in the project comp.

- `SketchPanel` in [SketchPanel.js](/Users/dobby/GitHub/adithyan-ai-videos/src/effects/SketchPanel.js)
  Use for storyboard-panel reveals that fade and rise in with the existing
  sketch/explainer look.

- `TransparentVideoOverlay` in [TransparentVideoOverlay.js](/Users/dobby/GitHub/adithyan-ai-videos/src/effects/TransparentVideoOverlay.js)
  Use for alpha-video cutouts and outline-treated matte layers. Prefer this
  over project-local wrappers unless the scene needs very specific timing or
  frame-window semantics.

- `FadeInBackdrop` in [FadeInBackdrop.js](/Users/dobby/GitHub/adithyan-ai-videos/src/effects/FadeInBackdrop.js)
  Use for simple solid-color background handoffs.

- `TrackedObjectOverlay` and `getTrackPointForFrame` in [TrackedObjectOverlay.js](/Users/dobby/GitHub/adithyan-ai-videos/src/effects/TrackedObjectOverlay.js)
  Use for tracked circular object treatments driven by track-point data and a
  treatment config.

- `resolveAssetSrc` in [resolveAssetSrc.js](/Users/dobby/GitHub/adithyan-ai-videos/src/lib/resolveAssetSrc.js)
  Shared runtime helper for resolving remote-first assets plus local render
  cache rewrites.

## Rules

- If a pattern is generic to Remotion itself, keep it in the external
  `remotion-best-practices` skill rather than restating it here.
- If a pattern is a repeated visual move in this repo, prefer shared code in
  `src/effects/` over copying old project code.
- If a scene is still highly bespoke, keep it in the project comp until a
  second project proves the abstraction.
