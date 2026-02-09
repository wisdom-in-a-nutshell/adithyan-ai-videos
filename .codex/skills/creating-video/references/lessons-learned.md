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
- If transcript timings are stable (same recording), prefer hardcoding key effect timestamps in `src/projects/<project-id>/assets.js` instead of writing code to re-find phrases on every run.
