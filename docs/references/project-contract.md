# Project Contract

## Required Structure

For each project id `<id>`:

- Runtime folder: `src/projects/<id>/`
- Artifact folder: `projects/<id>/`

## Runtime Folder Contract (`src/projects/<id>/`)

Minimum expected files:

- `assets.js`: exported constants for URLs, timing anchors, and duration values.
- `<ProjectComp>.js`: composition component used by `src/Root.js`.

Recommended files:

- `transcript_words.json`: thin word-level timing file for stable recordings.
- `ui.js`: project-local visual constants.

## Artifact Folder Contract (`projects/<id>/`)

Reference-only source material and notes:

- transcript exports
- storyboard notes
- generated intermediate artifacts (mask URLs, logs, etc.)

These files are useful for humans/agents but should not become runtime dependencies.

## Composition Registration Contract

Every active project composition should be registered in `src/Root.js` with:

- stable `id`
- explicit `fps`
- explicit `width` and `height`
- explicit `durationInFrames`

## Overlay Contract

- Use named `<Sequence name="...">` blocks for major beats.
- Ensure key overlay layers use clear z-order (`zIndex`) when foreground alpha is present.
- Keep reusable primitives in `src/overlay_kit/`.
