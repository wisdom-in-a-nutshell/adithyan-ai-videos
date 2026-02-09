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
