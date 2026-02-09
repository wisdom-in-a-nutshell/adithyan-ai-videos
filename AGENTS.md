# Remotion Video Playground

## Scope

This repo is the Remotion workspace for building short, marketing-style videos and effects (text overlays, occlusion, motion experiments). Keep it **project-driven** (`projects/<id>/...`) and avoid expanding the config surface area unless a real use-case demands it.

## Repo Layout (What Matters)

- Compositions: `src/Root.js`
- Main overlay demo: `src/MainVideo.js` + `src/data/timeline.json`
- Occlusion demo: `src/components/ForegroundMatteComposite.js`
- Reusable overlay primitives: `src/overlay_kit/`
- Per-video code (recommended for fast iteration): `src/projects/<project-id>/`
- Per-video inputs/artifacts (transcripts, matting outputs, notes): `projects/<project-id>/`

## Guidance

- Keep reusable overlay/animation primitives in `src/overlay_kit/` (not inside one-off comps).
- Keep timing data-driven (JSON) where possible; avoid hardcoding timings deep in components.
- Don’t add new compositions/components unless explicitly asked for the current project.
- For code-first iteration on a specific video, put the composition under `src/projects/<project-id>/` and register it in `src/Root.js`.
- If you want effects to be visible as timeline blocks in Remotion Studio, wrap them in named `<Sequence>` components (instead of rendering everything inline).

## Reuse + Documentation Discipline

- If you add a new reusable overlay/primitive, put it in `src/overlay_kit/` (not inside a one-off composition).
- If you introduce or change a reusable contract (e.g. `assets.js` exports, `storyboard.json`, new props),
  document it in the `$creating-video` skill references and keep the top-level contract minimal/stable.
- If you discover a durable gotcha (fps mismatch, Studio playback artifacts, audio mixing surprises),
  add a short note here so an agent returning cold doesn't relearn it.

## Alpha Compositing (Text Behind Subject)

- Use the MatAnyone `alpha.webm` as the foreground layer in Remotion.
- Background layer: original video with blur + slight dimming.
- Text layer: render normally; place between background and foreground.
- If edges look cut-out, apply a small alpha feather (1–2 px) or a 1 px shrink on the mask.
- While iterating, keep the composition `width/height/fps` aligned with the source+alpha assets
  (e.g. 1280x720 @ 24fps). Upscaling during iteration makes small edge artifacts and text aliasing
  look much worse than they really are.
- Always `muted` the `alpha.webm` `Video` layer so it can't interfere with audio mixing.
- If you see a "gray flicker/shadow" behind fast-moving text, slow the text movement down first
  (large jumps per frame at 24fps make anti-aliasing + compression artifacts much more noticeable).
- If the text still shimmers while moving, prefer adding a subtle `textBackdrop` (pill-shaped box)
  behind the text over trying to micro-tune feathering; it stabilizes edges and is easier to art-direct.

## Verification Loop (Keep Iterating Until It Looks Right)

- Prefer short renders + stills over raw Studio playback; it’s deterministic.
- Quick check (renders MP4 under `/tmp`):
  - `npm run render -- --comp <CompositionId> --preview --from 0 --to 5`
- Stills (very fast feedback):
  - `npx remotion still src/index.js <CompositionId> /tmp/<id>-f0048.png --frame 48 --overwrite`

## Creating Videos (Project Files)

- Store per-video inputs/artifacts under `projects/<project-id>/`:
  - `transcript.json`, `sentences.json`, `words.json`, storyboard notes, etc.
- Prefer keeping “what the composition uses” in code:
  - `src/projects/<project-id>/assets.js` for `VIDEO_URL`, `ALPHA_URL`, cut seconds, timing anchors.
- If you generate occlusion mattes, keep the generated URL in `projects/<project-id>/matting.json` for reference,
  but wire it into the composition explicitly (don’t depend on a “manifest contract” while iterating).
