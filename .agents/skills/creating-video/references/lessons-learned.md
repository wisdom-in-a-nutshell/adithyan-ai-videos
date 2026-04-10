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
- **VP9 + alpha matte webms have SOFT alpha that bleeds the background through the body.** Even with `transparent` set correctly, a webm encoded as `pix_fmt=yuv420p` + `alpha_mode=1` (the standard VP9 alpha encoding) typically has alpha values in the 0.85–0.95 range across the subject's body, not strict 0/1. Result: at full HQ render, the background colour blends through Adi's skin and the face looks washed out vs the arms/edges. Symptom doesn't show in `--preview` (downscaling averages it out) but is obvious in HQ + cloud renders. Fixes ranked: (1) re-encode the matte with a hard alpha threshold; (2) **chroma-key the original source video in real time with an SVG `<feColorMatrix>` filter** — eliminates the matte file entirely, the source URL is already in the cloud, and the alpha is pixel-sharp; (3) compensate visually with a `saturate(1.18) contrast(1.06)` CSS filter on the matte (works but is a workaround). If you go with option 2, the filter looks like:
  ```jsx
  <svg style={{position:'absolute', width:0, height:0}} aria-hidden>
    <defs>
      <filter id="chroma-key" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  1 -2 1 0 1" />
        <feComponentTransfer>
          <feFuncA type="table" tableValues="0 0 1 1" />
        </feComponentTransfer>
      </filter>
    </defs>
  </svg>
  // ...then apply to a second OffthreadVideo of the same source:
  <OffthreadVideo src={SOURCE_URL} startFrom={sequenceFromFrame} muted
    style={{filter: 'url(#chroma-key)', /* ...inset/objectFit */}} />
  ```
  Watch out: rendering the source video twice means TWO `OffthreadVideo` instances. Mute the second one, and **use unique `startFrom` per consumer** so each instance plays the right slice — a stale prop name (e.g. forgetting to rename a call site after changing the prop) will silently default to `startFrom=0` and the chroma-keyed layer will show Adi from second 0 of the recording while the audio stays in sync, which is very confusing.
- **Background crossfades smooth out otherwise-flicker-feeling transitions.** When two adjacent beats use different solid-colour or solid-image backdrops (e.g. warm studio bg → flat white at the end of an explainer cut), the abrupt swap can read as a "white flash" even though no frame is actually missing. Cheap fix: extend the outgoing background sequence by ~8 frames so it overlaps with the incoming one, and have the incoming backdrop fade in via `interpolate(useCurrentFrame(), [0, 8], [0, 1])`. The two backdrops then crossfade instead of popping. Same trick for any "matte source switch" — if you can keep ONE matte source rendering across the boundary while the bg fades, the subject stays continuously visible.
- **Separate "visual end" from "callout end" when underlying tracking drifts.** For tracked-object effects (e.g. an apple compositied onto a hand-tracked ball), the visual overlay should stop on a specific anchor word the moment the underlying track gets unreliable, even though the status pill + callout for that beat may want to keep running. Pattern: add a dedicated `*VisualEnd` constant in `TIMING` next to the regular `*ReactionEnd`, and gate the FX overlay on `timeInSeconds <= TIMING.fooVisualEnd` while the pill/callout sequences still use `TIMING.fooReactionEnd`. That way the visual cleanly cuts at the right beat while the spoken commentary continues.
- Reuse `src/overlay_kit/overlays.js` for low-level pills/callouts and prefer `src/effects/` once a higher-level beat has repeated enough to deserve extraction.
- If a pill/box suddenly stretches too wide: use `display: inline-flex`, `width: fit-content`, `maxWidth`, and `textOverflow: ellipsis`.
- If you render any extra `Video` layers for effects, always set `muted` and align time with `startFrom={SequenceFromFrame}` to avoid audio doubling + restart.
- If you render the same `Video` source twice at different timeline offsets (e.g. alpha matte as a foreground layer and again as an outline), you must align the offset with `startFrom` (and usually `endAt`) or it will look like duplicated/unsynced footage.
- If a layer "goes behind" the subject unexpectedly, it's almost always `zIndex` or ordering relative to the foreground alpha layer.
- For this repo specifically, prefer `npm run render` / `npm run render:cloud` over raw `npx remotion ...` commands whenever possible. The repo wrappers know about the asset cache, the active project set, and the cloud invocation path; raw Remotion commands bypass those guardrails.
- If you need stills for review, prefer extracting them from an already-rendered short clip when the direct `remotion still` path is heavy or bypasses the repo cache. That keeps inspection cheap and uses the exact frames you already validated in the clip.
- Multi-agent parallelism works fine if you avoid collisions:
  - Assign ownership by folder (one agent per `src/projects/<id>/`), and only coordinate on shared `src/overlay_kit/` primitives.
  - Keep per-beat overlays in separate files and mount them as named `<Sequence name="...">` blocks (clean diffs, easy to review).
