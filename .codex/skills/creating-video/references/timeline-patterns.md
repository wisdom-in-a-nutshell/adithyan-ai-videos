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
