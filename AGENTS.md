# Remotion Video Playground

## Scope

This repo is the Remotion workspace for building short, marketing-style videos and effects (text overlays, occlusion, motion experiments). Keep it **project-driven** (`projects/<id>/...`) and avoid expanding the config surface area unless a real use-case demands it.

## Repo Layout (What Matters)

- Compositions: `src/Root.js`
- Main overlay demo: `src/MainVideo.js` + `src/data/timeline.json`
- Occlusion demo: `src/components/ForegroundMatteComposite.js`
- Reusable overlay primitives: `src/overlay_kit/`
- Project launch + repeatable renders: `scripts/studio_project.mjs`, `scripts/render_project.mjs`
- Remote asset cache (downloads once, reuses locally): `scripts/asset_cache.mjs`
- Per-video inputs/artifacts: `projects/<project-id>/`

## Guidance

- Keep reusable overlay/animation primitives in `src/overlay_kit/` (not inside one-off comps).
- Keep timing data-driven (JSON) where possible; avoid hardcoding timings deep in components.
- Don’t add new compositions/components unless explicitly asked for the current project.

## Reuse + Documentation Discipline

- If you add a new reusable overlay/primitive, put it in `src/overlay_kit/` (not inside a one-off composition).
- If you introduce or change a reusable contract (e.g. `project.json`, `storyboard.json`, new props),
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

## Local Asset Cache (Recommended)

Remote MP4/WebM URLs are convenient, but can feel like they re-fetch on every Studio restart.
Use the project launcher which downloads assets once and serves them via `--public-dir`.

- Start Studio with cached assets:
  - `npm run studio:project -- projects/occlusion-demo/project.json --comp OcclusionDemo`
- Force re-download:
  - add `--refresh`
- Cache location:
  - defaults to `~/.cache/win-remotion-assets`
  - override with `WIN_REMOTION_ASSET_CACHE=/tmp/win-remotion-assets`
- What’s cached:
  - `video_url` from `projects/<project-id>/project.json`
  - optional `alpha_url` from `projects/<project-id>/matting.json`

## Verification Loop (Keep Iterating Until It Looks Right)

- Prefer `scripts/render_project.mjs` over raw Studio playback; it’s deterministic and uses the local cache.
- Quick occlusion checks (renders MP4 + stills under `/tmp`):
  - `node scripts/render_project.mjs projects/<project-id>/project.json --comp OcclusionDemo --out /tmp/<project-id>.mp4 --seconds 5 --fps 24`
- If you need to force asset refresh:
  - add `--refresh`

## Creating Videos (Project Files)

- Store per-video inputs under `projects/<project-id>/project.json`.
- If you have word-level timings, place them at:
  - `projects/<project-id>/transcript.json`
  - `scripts/studio_project.mjs` and `scripts/render_project.mjs` auto-load it into props as `transcriptWords`.
- Keep `project.json` minimal and stable. For this repo:
  - required: `video_url` (source video)
  - optional: `projects/<project-id>/matting.json` (contains `alpha_url` when occlusion is needed)
- Example:
  - `id`, `name`
  - `video_url` (source video)
- Close the loop with a short render + stills (preferred):
  - `node scripts/render_project.mjs projects/<project-id>/project.json --comp OcclusionDemo --out /tmp/<project-id>.mp4 --seconds 5 --fps 24`
  - Stills go to `/tmp/<project-id>-stills/`
