# Video Project Model

## Goal

Make new videos cheap to start, safe to iterate, and easy for a cold agent to resume.

## Core Shape

- Composition registry: `src/Root.js`
- Project registry source: `src/projects/registry.js`
- Per-video runtime code: `src/projects/<project-id>/`
- Per-video source artifacts: `projects/<project-id>/`
- Reusable visual primitives: `src/overlay_kit/`
- Fast local loops: `scripts/studio_cached.mjs`, `scripts/render.mjs`

## Boundaries

1. Runtime inputs for a composition live in code (`assets.js`) under `src/projects/<id>/`.
2. Scratch manifests (for example `projects/<id>/matting.json`) are reference-only, not runtime dependencies.
3. Every project exports a composition config from `src/projects/<id>/composition.js`.
4. `src/projects/registry.js` is the source-of-truth list of active compositions.
5. Reusable overlays belong in `src/overlay_kit/`; one-off scene wiring stays in project folders.
6. Each major visual beat should be wrapped in a named `<Sequence>` for Studio timeline legibility.
7. Active execution state belongs in `docs/projects/<project>/tasks.md`.

## Why This Model

- Agents can discover project intent and wiring from predictable paths.
- Project setup has low overhead and avoids metadata sprawl.
- Render iteration stays fast through URL caching and short render slices.

## Operational Invariants

- `check:fast` remains non-rendering and fast.
- New project scaffolds follow the same folder contract.
- Repo doctor validates basic shape and composition wiring before push.
