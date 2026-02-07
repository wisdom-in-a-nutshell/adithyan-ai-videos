# Adithyan AI Videos

Remotion playground for producing short marketing-style videos (occlusion demos, overlays, motion experiments).

## Quickstart

```bash
npm ci
npm run studio:project -- projects/occlusion-demo/project.json
```

Then open the Studio URL (usually `http://localhost:3000`) and pick the `OcclusionDemo` composition.

## Render (repeatable)

```bash
node scripts/render_project.mjs projects/occlusion-demo/project.json \
  --comp OcclusionDemo \
  --out /tmp/occlusion-demo.mp4 \
  --seconds 5 \
  --fps 24
```

## Inputs

- Minimal per-project config lives in `projects/<project-id>/project.json`.
  - Required: `video_url`
- Optional word-level timings:
  - `projects/<project-id>/transcript.json`

## Environment knobs

- `WIN_OCCLUSION_ALPHA_URL`: override the default alpha matte WebM URL.
- `WIN_REMOTION_ASSET_CACHE`: override local cache dir for downloaded assets.

## Rights / Footage

If you render with third-party footage, you’re responsible for having the rights to use it.
