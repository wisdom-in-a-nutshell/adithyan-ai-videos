# Project Contract

## File Map

- `src/projects/<id>/`: runtime composition code for one video.
- `projects/<id>/`: source artifacts, derived assets, and notes for that video.
- `src/projects/registry.js`: source-of-truth list of active compositions.
- `src/Root.js`: maps `PROJECT_COMPOSITIONS` into Remotion `<Composition>`
  entries.
- `src/overlay_kit/`: reusable overlays and drawing helpers shared across
  projects.

## Runtime Folder Contract (`src/projects/<id>/`)

Minimum expected files:

- `assets.js`: exported constants for URLs, timing anchors, and duration values.
- `<ProjectComp>.js`: composition component.
- `composition.js`: exports one composition config object for registry use.

Recommended files:

- `transcript_words.json`: thin word-level timing file for stable recordings.
- `ui.js`: project-local visual constants.

## Artifact Folder Contract (`projects/<id>/`)

Source material plus non-runtime derived artifacts and notes:

- transcript exports
- storyboard notes (default editable file: `storyboard.md`)
- optional machine export (`storyboard.json`) when automation/parsing is needed
- generated intermediate artifacts (mask outputs, upload receipts, logs, etc.)
- worklogs for thumbnails, backgrounds, sketches, and similar iteration assets

These files are useful for humans/agents but should not become runtime dependencies.

## Composition Registration Contract

Every active project composition should be registered through:

- `src/projects/registry.js` (imports + list entry)
- `src/Root.js` mapping `PROJECT_COMPOSITIONS`

Projects can stay imported in `src/projects/registry.js` with `enabled: false`
when you want to keep the code in-repo for inspiration or later reuse without
showing the composition in Studio.

Each composition config must include:

- stable `id`
- explicit `fps`
- explicit `width` and `height`
- explicit `durationInFrames`

## Runtime Rules

- Keep runtime inputs in `assets.js`; do not make runtime code depend on scratch
  manifests or derived files under `projects/<id>/`.
- Use named `<Sequence name="...">` blocks for major beats.
- Ensure key overlay layers use clear `zIndex` ordering when foreground alpha
  is present.
- Keep reusable primitives in `src/overlay_kit/`; keep one-off scene wiring in
  the project folder.

## Scaffold Notes

- `npm run new:project -- --id <project-id> ...` creates both project folders,
  seeds `notes.md` and `storyboard.md`, and updates `src/projects/registry.js`.
- `src/projects/registry.js` must preserve `// NEW_PROJECT_IMPORTS` and
  `// NEW_PROJECT_ENTRIES` because the scaffold script depends on those markers.
- New scaffolded projects should default to `enabled: true`; older projects can
  be hidden later by flipping their registry entry to `enabled: false`.
