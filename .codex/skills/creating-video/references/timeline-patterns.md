# Timeline Patterns

Use named Remotion `<Sequence>` blocks for timeline structure.

## Scene Tags (Recommended)

Prefix `Sequence` names with storyboard scene IDs so you can cross-reference quickly:

- Beat overlays: `[S03] Setup: ...`
- Sub-beat overlays: `[S03A] Tools -> Artifacts`
- Long-running layers that span multiple beats: `[S01+] Background`, `[S01+] Foreground Alpha`

Rules of thumb:

- 1 composition per video.
- Background + foreground layers run full duration.
- Each major overlay/effect is its own `<Sequence name="...">` so it shows up in Studio.

## Timing Anchors

If the underlying recording + transcript are stable (you are iterating on the same source clip):

- Use `src/projects/<project-id>/assets.js` as the source of truth for effect timestamps (seconds).
- It is fine to *derive* those timestamps once from `transcript_words.json`, but don’t keep runtime code that re-finds phrases every render.
- If the source video changes, re-derive and update the hardcoded timestamps.

## Sequence Timing Gotcha (Frame Offsets)

Inside a `<Sequence from={X}>`, `useCurrentFrame()` is **sequence-local** (0 at the start of the Sequence).

If you need transcript-aligned timing (composition-global seconds), pass the Sequence's `from` as `frameOffset`
and compute absolute time explicitly:

```js
const frame = useCurrentFrame();
const {fps} = useVideoConfig();
// IMPORTANT: add the offset, never subtract it.
const absoluteFrame = frame + frameOffset; // where frameOffset === Sequence `from`
const tSeconds = absoluteFrame / fps;
```

If you only need a fade in/out *within the Sequence*, use `frame / fps` directly (local time).
