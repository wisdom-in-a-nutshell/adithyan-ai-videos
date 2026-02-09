# Quick Checklist

- [ ] Raw video URL confirmed
- [ ] Overlay timing anchors captured in `src/projects/<project-id>/assets.js`
- [ ] Any overlay that needs transcript/global timing uses `frameOffset` + absolute time (Sequence-local `useCurrentFrame()` gotcha)
- [ ] Overlays readable on light + dark footage
- [ ] Sketch style only on overlays (not footage)
- [ ] Disclaimer text short + visible
- [ ] Extra `Video` layers (if any) are `muted` and use `startFrom={SequenceFromFrame}` (no audio doubling / no restart)
- [ ] Key overlays have explicit `zIndex` (especially if you have a foreground alpha layer)
- [ ] Preview in Remotion before render
