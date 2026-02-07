# Remotion Agent Edits

## Scope

This folder owns the Remotion demo for agent-edited videos. Keep overlay logic reusable and timelines data-driven.

## Structure (current)

- Compositions + layout: `src/Root.js`, `src/MainVideo.js`
- Occlusion demo composite: `src/components/ForegroundMatteComposite.js`
- Reusable overlays + renderer: `src/overlay_kit/overlays.js`
- RoughJS helpers + styles: `src/overlay_kit/rough.js`
- Sketch filter + font: `src/styles/sketch.js`
- Overlay timing (main demo): `src/data/timeline.json`

## Guidance

- Keep overlays configurable via `timeline.json`; avoid hardcoding timing in components.
- Apply sketch styling to overlays only, not the raw footage.
- Prefer small, incremental visual changes and preview in Remotion.

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

## Occlusion Demo (Local)

- `OcclusionDemo` in `src/Root.js` wires `ForegroundMatteComposite` for quick previews.
- Defaults point at the sample video + alpha URL; swap via props for new tests.

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
- To try a different alpha without editing code:
  - `WIN_OCCLUSION_ALPHA_URL=<alpha.webm-url> npm run studio:project -- projects/<project-id>/project.json`

## Verification Loop (Keep Iterating Until It Looks Right)

- Use still renders to self-verify changes without relying on Studio playback.
- Recommended quick checks (pick 2–3 timestamps):
  - `npx remotion still src/index.js OcclusionDemo /tmp/occ-0_5s.png --frame 15`
  - `npx remotion still src/index.js OcclusionDemo /tmp/occ-2s.png --frame 60`
  - `npx remotion still src/index.js OcclusionDemo /tmp/occ-4s.png --frame 120`
- For audio sync concerns, render a short clip and review locally:
  - `npx remotion render src/index.js OcclusionDemo /tmp/occ-5s.mp4 --frames 0-150`

## Creating Videos (Project Files)

- Store per-video inputs under `projects/<project-id>/project.json`.
- If you have word-level timings, place them at:
  - `projects/<project-id>/transcript_words.json`
  - `scripts/*_project.mjs` will auto-load it into props as `transcriptWords`.
- Keep `project.json` minimal and stable. For the occlusion demo we only require `video_url` and
  use a default alpha matte URL in `scripts/*_project.mjs`.
- Example:
  - `id`, `name`
  - `video_url` (source video)
- If you later add support for custom mattes, consider extending the contract with `alpha_url`
  again, but keep it optional to avoid config sprawl.
- Close the loop with a short render + stills (preferred):
  - `node scripts/render_project.mjs projects/<project-id>/project.json --comp OcclusionDemo --out /tmp/<project-id>.mp4 --seconds 5 --fps 24`
  - Stills go to `/tmp/<project-id>-stills/`
