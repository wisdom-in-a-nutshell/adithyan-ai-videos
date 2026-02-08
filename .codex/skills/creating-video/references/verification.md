# Verification Loop (Short Render + Stills)

Goal: close the loop without relying on Studio playback.

## Preferred (Code-First)

Render a short clip (default 5s) + a few stills:

```bash
cd ~/GitHub/adithyan-ai-videos
npx remotion render src/index.js <CompositionId> /tmp/<id>.mp4 --frames 0-119
npx remotion still src/index.js <CompositionId> /tmp/<id>-f0048.png --frame 48
npx remotion still src/index.js <CompositionId> /tmp/<id>-f0055.png --frame 55
npx remotion still src/index.js <CompositionId> /tmp/<id>-f0060.png --frame 60
```

Outputs:

- Video: `/tmp/<id>.mp4`
- Stills: `/tmp/<id>-f*.png`

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
- Green fringe/halo around subject edges:
  - usually comes from the RGBA `alpha.webm` having green-tinted RGB near partially-transparent edges
  - `feather` can amplify spill (it blurs edge colors outward)
  - prefer `shrink` (erode) first; if `shrink` has to be too large, re-run matting to get a cleaner `alpha.webm`
