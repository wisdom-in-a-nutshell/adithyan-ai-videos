# Alpha Compositing Notes

## Baseline Layer Order

1. Background: original video (optionally blurred/dimmed)
2. Text/effects layer
3. Foreground: alpha subject video (`alpha.webm`, always `muted`)

## Practical Defaults

- Keep composition `fps/width/height` aligned with source assets while iterating.
- Start with minimal edge processing (`shrinkPx=0`, `featherPx=0`), then tune only if needed.
- If text shimmer appears, first reduce movement speed; then consider adding a subtle backdrop.

## Common Fixes

- Edge fringing: add tiny shrink (`1px`) and/or tiny feather (`1-2px`).
- Gray shadow/flicker on moving text: lower per-frame motion distance.
- Audio doubling: ensure extra `Video` layers are `muted`.
