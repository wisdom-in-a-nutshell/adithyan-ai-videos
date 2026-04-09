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
- Treat `src/projects/<project-id>/assets.js` as the runtime contract. If an asset is needed by the composition, prefer a stable remote URL there so local and cloud renders use the same source.
- Local files are fine as working material in `projects/<project-id>/` or `public/imports/<project-id>/`, but once they become a real runtime dependency, promote them to shared storage and point `assets.js` at the uploaded URL.
- If a beat depends on a local PNG frame sequence only because the cutout quality is better, the right end state is usually: generate one transparent `.webm`/`.mov` from those frames, upload it, and switch the comp to that single asset. Keep the frame directory as source material, not as the runtime path.
- If Studio shows errors that don’t match the current source (stale bundle), restart `npm start` and hard-refresh the browser tab.
- **Remotion Studio scans `public/` only at startup, not on every change.** Adding a new file under `public/imports/<project>/...` while the studio is running will NOT make that file visible — `<Img src="...">` for the new asset shows a broken-image box. Source code changes hot-reload fine, but new static files require a full `Ctrl+C` + `npm start`. Symptom: an existing sketch shows up but a freshly added one renders as an empty/blank container with the broken-image icon top-left. Fix: restart the studio.
- **Studio and CLI render use SEPARATE webpack caches.** `node_modules/.cache/webpack/` has two subdirs: `remotion-development-*` (Studio/`npm start`) and `remotion-production-*` (`npm run render`). Editing source files invalidates the dev cache via HMR, but the production cache can serve a stale compiled bundle on the next CLI render — the studio will look correct while `npm run render` shows the previous version. The `--no-cache` flag on `scripts/render.mjs` only clears the *asset* cache (downloaded URLs in `~/.cache`), NOT the webpack module cache. If a CLI render diverges from the studio, **trust the studio first**, then `rm -rf node_modules/.cache/webpack/remotion-production-*` and re-render.
- **`OffthreadVideo` for webm alpha REQUIRES `transparent` and `muted` props.** Without `transparent`, the alpha channel is ignored and the video renders opaque — wherever the source webm is transparent, OffthreadVideo paints the SOURCE VIDEO from the underlying timeline (not the layer below in the same Sequence parent). Symptom: a person matte that should sit on a white backdrop instead shows a green chroma background, and any sibling sequences (like the white backdrop) appear to be missing entirely. The fix is identical to how `text-effects/TextEffectsComp.js` does it:
  ```jsx
  <OffthreadVideo
    src={...}
    startFrom={sequenceStartInFrames}  // align with the seq's `from` so playback isn't offset
    endAt={sequenceEndInFrames}
    muted
    transparent
    style={{width: '100%', height: '100%', objectFit: 'cover'}}
  />
  ```
  When you copy/paste from an existing project that already does this right, **bring `muted` and `transparent` along** — they look optional but they're not.
- Reuse `src/overlay_kit/overlays.js` components for pills/callouts whenever possible (keeps fonts + sizing consistent).
- If a pill/box suddenly stretches too wide: use `display: inline-flex`, `width: fit-content`, `maxWidth`, and `textOverflow: ellipsis`.
- If you render any extra `Video` layers for effects, always set `muted` and align time with `startFrom={SequenceFromFrame}` to avoid audio doubling + restart.
- If you render the same `Video` source twice at different timeline offsets (e.g. alpha matte as a foreground layer and again as an outline), you must align the offset with `startFrom` (and usually `endAt`) or it will look like duplicated/unsynced footage.
- If a layer "goes behind" the subject unexpectedly, it's almost always `zIndex` or ordering relative to the foreground alpha layer.
- For this repo specifically, prefer `npm run render` / `npm run render:cloud` over raw `npx remotion ...` commands whenever possible. The repo wrappers know about the asset cache, the active project set, and the cloud invocation path; raw Remotion commands bypass those guardrails.
- If you need stills for review, prefer extracting them from an already-rendered short clip when the direct `remotion still` path is heavy or bypasses the repo cache. That keeps inspection cheap and uses the exact frames you already validated in the clip.
- Multi-agent parallelism works fine if you avoid collisions:
  - Assign ownership by folder (one agent per `src/projects/<id>/`), and only coordinate on shared `src/overlay_kit/` primitives.
  - Keep per-beat overlays in separate files and mount them as named `<Sequence name="...">` blocks (clean diffs, easy to review).
