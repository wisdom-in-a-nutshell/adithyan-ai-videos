# Compositing and Render Pitfalls

Render/still commands and the proof loop live in
`docs/references/verification-loop.md`. Apply these checks to affected layers.

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
- Shared block validation:
  - if a change was made under `src/effects/`, render `EffectsLab` once before trusting a single narrative project

## Common Pitfalls

- Studio playback can show temporal artifacts that disappear in render (or vice versa).
- Mismatched `fps` between source and alpha causes “double image” / ghosting.
- Upscaling 720p assets during iteration amplifies aliasing artifacts.
- "Video restarts" when a `Video` is mounted inside an effect overlay: fix with `startFrom` or avoid the extra `Video` layer.
- Green fringe/halo around subject edges:
  - usually comes from the RGBA `alpha.webm` having green-tinted RGB near partially-transparent edges
  - `feather` can amplify spill (it blurs edge colors outward)
  - prefer `shrink` (erode) first; if `shrink` has to be too large, re-run matting to get a cleaner `alpha.webm`
- Cloud render failure after local success:
  - check whether the composition still depends on local-only runtime media
  - common offender: a local frame sequence used for a cutout effect
  - best fix is usually one uploaded transparent video derived from that sequence, not teaching cloud about thousands of local files
