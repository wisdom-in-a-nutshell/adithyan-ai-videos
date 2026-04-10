# Lessons Learned (Condensed)

## Visual Direction

- Keep footage clean; apply sketch treatment to overlays, not to the video frame itself.
- Prefer short, readable overlay copy and a single project-level UI scale constant.
- Use solid black or very high-contrast pills for critical text on bright footage.
- If a sketch border or rough treatment reduces clarity, revert to a cleaner border immediately.

## Runtime Asset Contract

- Treat `src/projects/<project-id>/assets.js` as the runtime contract.
- If the composition needs an asset at render time, prefer a stable remote URL there so local and cloud renders use the same source.
- Keep local files under `projects/<project-id>/` or `public/imports/<project-id>/` as source material until they are promoted into the runtime path.
- If a local frame sequence only exists because the cutout quality is better, the better end state is usually one uploaded transparent video derived from those frames.

## Timing And Layering

- If transcript timings are stable, hardcode key effect anchors in `assets.js` instead of re-finding phrases at runtime.
- Remember that `useCurrentFrame()` resets inside `<Sequence>`; use `frameOffset` or absolute time when a beat depends on global timing.
- Major visual beats should be named `<Sequence name="...">` blocks so the Studio timeline stays legible.
- If a tracked effect needs to stop before the spoken reaction ends, separate `*VisualEnd` from `*ReactionEnd`.
- If a layer suddenly appears behind the subject, it is usually a `zIndex` or ordering problem relative to the foreground alpha layer.

## Video Overlay Rules

- Extra video layers for effects should be `muted` and aligned with `startFrom={sequenceFromFrame}` so they do not restart at frame 0.
- `TransparentVideoOverlay` / `OffthreadVideo` alpha layers need `transparent` and `muted`; those props are not optional in practice.
- If the same source video is rendered twice at different offsets, every consumer needs its own correct `startFrom` and usually `endAt`.
- Soft VP9 alpha can wash background colour through the subject in HQ renders. If it is visibly wrong, prefer a cleaner alpha source or a different compositing strategy over stacking visual band-aids forever.

## Verification And Caches

- Prefer `npm run render` / `npm run render:cloud` over raw Remotion commands so the repo cache and render contract stay in play.
- Trust rendered clips over Studio playback alone; use short slices first, then cloud checkpoints later.
- If direct still rendering is heavy or bypasses repo cache behavior, extract stills from a short rendered clip instead.
- If Studio shows a new source file as a broken image, restart `npm start`; new `public/` files are not picked up live.
- If the Studio and CLI render disagree, suspect stale webpack output before suspecting the project logic.

## Reuse Rules

- Keep low-level primitives in `src/overlay_kit/`.
- Move repeated editorial beats and compositing patterns into `src/effects/` once they are proven.
- Keep one-off scene wiring inside the project until a second real use justifies extraction.
