# Verification Loop (Short Render + Stills)

Goal: close the loop without relying on Studio playback.

## Preferred (Project File Based)

Render a short clip (default 5s) + 3 stills:

```bash
cd ~/GitHub/adithyan-ai-videos
node scripts/render_project.mjs projects/<project-id>/project.json \
  --comp OcclusionDemo \
  --out /tmp/<project-id>.mp4 \
  --seconds 5 \
  --fps 24
```

Outputs:

- Video: `/tmp/<project-id>.mp4`
- Stills: `/tmp/<project-id>-stills/frame-*.png`

Optional flags:

- `--open` to open outputs
- `--no-stills` to skip stills

## Direct CLI (When Debugging Quickly)

```bash
cd ~/GitHub/adithyan-ai-videos
npx remotion render src/index.js OcclusionDemo /tmp/occ-5s.mp4 --frames 0-119
npx remotion still src/index.js OcclusionDemo /tmp/occ-f0010.png --frame 10
```

## Checklist (What To Look For)

- Composite looks correct in the rendered MP4 (not just Studio).
- Source + alpha match in `fps` and resolution.
- Alpha `Video` layer is `muted` so it can’t affect audio.
- Moving text shimmer:
  - slow the movement first (`textSpeedPxPerSecond`)
  - use a pill/backdrop behind text for stability

## Common Pitfalls

- Studio playback can show temporal artifacts that disappear in render (or vice versa).
- Mismatched `fps` between source and alpha causes “double image” / ghosting.
- Upscaling 720p assets during iteration amplifies aliasing artifacts.
