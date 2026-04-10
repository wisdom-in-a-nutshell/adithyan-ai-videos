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

## Starting A New Project

When a new video prompt arrives:

1. Start with `src/projects/<id>/` for the project-specific edit.
2. Check `src/effects/` and `src/projects/effects-lab/` before copying an old
   narrative comp.
3. Reuse shared blocks for repeated house-style moves such as:
   - top-left status/callout beats
   - sketch-panel reveals
   - transparent subject overlays
   - simple backdrop handoffs
   - tracked circular object treatments
4. Keep timing, wording, asset URLs, and bespoke scene choreography inside the
   project until a second real project proves the pattern.
5. If a new shared block is extracted, add it to `EffectsLab` and index it here
   so the next cold agent can discover it quickly.

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

- Use [EffectsLab](/Users/dobby/GitHub/adithyan-ai-videos/src/projects/effects-lab/composition.js) as the shared preview surface when you want to inspect the reusable blocks without opening an older narrative project.
- Use [ObjectSegmentationComp.js](/Users/dobby/GitHub/adithyan-ai-videos/src/projects/object-segmentation/ObjectSegmentationComp.js) as the main real-project reference for how the shared blocks are assembled into a full edit.
- Keep extraction discipline:
  - move a pattern into `src/effects/` only when the visual move is stable,
    repeated, and actually simplifies project code
  - keep one-off timing, wording, and shot-specific choreography in the project
    until that abstraction is proven
- For setup-time transcript anchoring, use the shared helper in
  [findPhraseFrames.js](/Users/dobby/GitHub/adithyan-ai-videos/src/lib/findPhraseFrames.js)
  via [find_phrase_frames.mjs](/Users/dobby/GitHub/adithyan-ai-videos/scripts/find_phrase_frames.mjs),
  then hardcode the final chosen anchors in project `assets.js`

- If a pattern is generic to Remotion itself, keep it in the external
  `remotion-best-practices` skill rather than restating it here.
- If a pattern is a repeated visual move in this repo, prefer shared code in
  `src/effects/` over copying old project code.
- If a scene is still highly bespoke, keep it in the project comp until a
  second project proves the abstraction.
