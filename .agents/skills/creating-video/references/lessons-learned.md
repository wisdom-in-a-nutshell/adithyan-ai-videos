# Lessons Learned (Condensed)

## What Worked

- Sketch style on overlays (labels, boxes, arrows) feels strong.
- Centralizing sketch style in `SketchLayer` prevents drift.
- Solid black disclaimer pill improves readability on bright footage.
- Small, incremental adjustments + preview beats batch edits.

## What Did Not Work Well

- Sketch borders on the raw footage frame looked messy.
- RoughJS default multi-stroke lines created double outlines.
- Rough outline on the CODEX pill reduced clarity.

## Practical Rules

- Keep footage clean; sketch only the UI layer.
- Use single-stroke rough lines if sketching boxes.
- If sketching reduces clarity, revert to clean borders.
- Keep overlay copy concise and readable.
- Prefer a single per-project baseline scale constant (e.g. `TEXT_EFFECTS_UI_SCALE`) to prevent font/spacing drift across overlays. Only change the baseline when you want the whole project to shift; use small local multipliers (e.g. `* 1.1`) for one-off beats.
- If transcript timings are stable (same recording), prefer hardcoding key effect timestamps in `src/projects/<project-id>/assets.js` instead of writing code to re-find phrases on every run.
- If Studio shows errors that don’t match the current source (stale bundle), restart `npm start` and hard-refresh the browser tab.
- Reuse `src/overlay_kit/overlays.js` components for pills/callouts whenever possible (keeps fonts + sizing consistent).
- If a pill/box suddenly stretches too wide: use `display: inline-flex`, `width: fit-content`, `maxWidth`, and `textOverflow: ellipsis`.
- If you render any extra `Video` layers for effects, always set `muted` and align time with `startFrom={SequenceFromFrame}` to avoid audio doubling + restart.
- If you render the same `Video` source twice at different timeline offsets (e.g. alpha matte as a foreground layer and again as an outline), you must align the offset with `startFrom` (and usually `endAt`) or it will look like duplicated/unsynced footage.
- If a layer "goes behind" the subject unexpectedly, it's almost always `zIndex` or ordering relative to the foreground alpha layer.
- Multi-agent parallelism works fine if you avoid collisions:
  - Assign ownership by folder (one agent per `src/projects/<id>/`), and only coordinate on shared `src/overlay_kit/` primitives.
  - Keep per-beat overlays in separate files and mount them as named `<Sequence name="...">` blocks (clean diffs, easy to review).
