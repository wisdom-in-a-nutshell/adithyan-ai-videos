# Quick Checklist

- [ ] Raw video URL confirmed
- [ ] Runtime media in `src/projects/<project-id>/assets.js` is cloud-safe (prefer uploaded remote URLs for real render inputs)
- [ ] Overlay timing anchors captured in `src/projects/<project-id>/assets.js`
- [ ] Any overlay that needs transcript/global timing uses `frameOffset` + absolute time (Sequence-local `useCurrentFrame()` gotcha)
- [ ] Overlays readable on light + dark footage
- [ ] Sketch style only on overlays (not footage)
- [ ] Disclaimer text short + visible
- [ ] Extra `Video` layers (if any) are `muted` and use `startFrom={SequenceFromFrame}` (no audio doubling / no restart)
- [ ] If a beat used a local frame sequence for cutout quality, decide whether that sequence stays source-only or needs to be converted into one uploaded transparent runtime asset
- [ ] Key overlays have explicit `zIndex` (especially if you have a foreground alpha layer)
- [ ] Major effects are wrapped in named `<Sequence name="...">` blocks (so you can see them in the Studio timeline)
- [ ] Preview in Remotion before render
- [ ] Stable checkpoint passes both local preview slice and cloud render path, if cloud delivery matters
