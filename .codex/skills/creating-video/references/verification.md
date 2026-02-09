# Verification Loop (Short Render + Stills)

Goal: close the loop without relying on Studio playback.

## Preferred (Code-First)

Render a short clip (seconds-based) + a few stills:

```bash
cd ~/GitHub/adithyan-ai-videos

# Fast preview render (auto-opens on macOS)
npm run render -- --from 0 --to 5

# Longer debug render at half resolution (good for checking sync/artifacts)
npm run render -- --from 116.6 --to 151.0 --scale 0.5 --crf 28 --out /tmp/TextEffects-layers-half.mp4

# Stills (use composition ids and explicit frames)
npx remotion still src/index.js <CompositionId> /tmp/<id>-f0048.png --frame 48
npx remotion still src/index.js <CompositionId> /tmp/<id>-f0055.png --frame 55
npx remotion still src/index.js <CompositionId> /tmp/<id>-f0060.png --frame 60
```

Outputs:

- Video: `/tmp/<CompositionId>.mp4`
- Stills: `/tmp/<id>-f*.png`

## Checklist (What To Look For)

- Composite looks correct in the rendered MP4 (not just Studio).
- Source + alpha match in `fps` and resolution.
- Alpha `Video` layer is `muted` so it can’t affect audio.
- Any extra `Video` layers used for effects are `muted` (avoid doubled audio).
- If you mount a `Video` inside a later `<Sequence>`, set `startFrom={sequenceFromFrame}` so it doesn't restart at 0.
  - This is the classic “two people” / “ghost layer” bug when you render the same footage twice (e.g. alpha matte once as the foreground, and again for an outline effect).
  - Example:

```jsx
<Sequence from={from} durationInFrames={dur}>
  <Video
    src={...}
    muted
    startFrom={from}
    endAt={from + dur}
  />
</Sequence>
```
- If something unexpectedly appears behind/over the foreground alpha, check explicit `zIndex` on every overlay root.
- Moving text shimmer:
  - slow the movement first (`textSpeedPxPerSecond`)
  - use a pill/backdrop behind text for stability

## Common Pitfalls

- Studio playback can show temporal artifacts that disappear in render (or vice versa).
- Mismatched `fps` between source and alpha causes “double image” / ghosting.
- Upscaling 720p assets during iteration amplifies aliasing artifacts.
- "Video restarts" when a `Video` is mounted inside an effect overlay: fix with `startFrom` or avoid the extra `Video` layer.
- Green fringe/halo around subject edges:
  - usually comes from the RGBA `alpha.webm` having green-tinted RGB near partially-transparent edges
  - `feather` can amplify spill (it blurs edge colors outward)
  - prefer `shrink` (erode) first; if `shrink` has to be too large, re-run matting to get a cleaner `alpha.webm`
