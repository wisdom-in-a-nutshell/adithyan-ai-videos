# Text Effects Video (text-effects)

## Goal

Ship a clean, readable Remotion composition that:

- Proves the claim “This video was 100% edited by Codex” with text **behind and in front** of the subject.
- Shows a “raw recording” label + “everything on-screen is rendered by Codex” disclaimer.
- Explains “Codex -> Tools -> Artifacts” with a clear animated flow (Tools/Digital artifacts, then Coding tools/Coding artifacts, then Video tools/Video artifacts).
- Avoids distracting matte artifacts (green fringing / edge shimmer).

## Why / Impact

- This is the template for fast, repeatable “marketing-style” videos: one source clip + alpha foreground + a set of overlay beats.
- We want a code-first workflow that’s easy to iterate on without a bunch of extra JSON/contracts.

## Context

- Repo is a Remotion workspace.
- Composition is `TextEffects` registered in `src/Root.js`.
- Project code lives in `src/projects/text-effects/`:
  - `src/projects/text-effects/TextEffectsComp.js`
  - `src/projects/text-effects/CodexToolsArtifactsOverlay.js`
  - `src/projects/text-effects/assets.js` (URLs + beat timings)
  - `src/projects/text-effects/ui.js` (shared UI scale)
- Source assets currently used (hardcoded in `src/projects/text-effects/assets.js`):
  - `original.mp4`: `https://descriptusercontent.com/published/1b6b1b12-e333-487f-a2e7-87b87d68ec26/original.mp4`
  - `alpha.webm` (VP9 with alpha): `https://storage.aipodcast.ing/cache/matanyone/alpha/88efdd42-c664-4df2-8c7d-34824323e95c.webm`
- Implementation is intentionally code-first:
  - Timings are hardcoded in `src/projects/text-effects/assets.js`.
  - Transcript words live at `src/projects/text-effects/transcript_words.json` (reference only, not a runtime “phrase finder” input).
- Legacy folder `projects/text-effects/` still exists, but is not required for the `TextEffects` composition anymore.

## Decisions

- **Code-first per project**: keep per-project code under `src/projects/<id>/` and hardcode URLs + key timings in `assets.js` for speed.
- **Single render entrypoint**: use `npm run render` (backed by `scripts/render.mjs`) for deterministic preview renders.
- **Studio for interactive preview**: use `npm start` (`remotion studio`) to see the timeline and named `<Sequence>` blocks.
- **Prefer `alpha.webm` over `mask_url`**:
  - `alpha.webm` contains an actual alpha channel.
  - `mask_url` (often an MP4 with a green background) requires chroma keying / mask interpretation and is more prone to edge artifacts and “green spill” if not handled carefully.
- **Edge cleanup knobs** (when using a real alpha asset):
  - `shrinkPx`: contracts the matte slightly to remove colored fringes at edges.
  - `featherPx`: blurs the matte edge slightly to reduce stair-stepping / shimmer.
  - For “I don’t mind cut-out,” start at `shrinkPx=0`, `featherPx=0` and only add cleanup if the artifacts are annoying.

## Open Questions

- Should we delete `projects/text-effects/` (legacy manifests) once we’re confident we won’t use the old `scripts/*project*.mjs` workflow?

## Tasks

- [ ] Confirm the simplest local loop is understood:
  - Start Studio: `npm start` (opens `http://localhost:3000`)
  - Render preview: `npm run render -- --comp TextEffects --from 0 --to 8`
- [ ] Add a “stills” loop that’s as easy as the render loop:
  - Either extend `scripts/render.mjs` with an optional `--still <sec>` / `--stills <sec,sec,...>` flag, or document `npx remotion still ...`.
- [ ] Matte artifact cleanup (green fringing / shimmer):
  - Identify whether the issue is from the alpha asset edges or from compositing settings.
  - If needed, add a project-scoped knob (in `src/projects/text-effects/assets.js`) to set `shrinkPx`/`featherPx` when we use `ForegroundMatteComposite` patterns elsewhere.
- [ ] Fix timing alignment for “100%” / hero stamp:
  - Verify `src/projects/text-effects/transcript_words.json` matches the current `original.mp4`.
  - Adjust the effect triggers so “100” appears when the word “100” is spoken.
- [ ] Tools/Artifacts overlay polish:
  - Ensure each “stage” (Tools/Digital artifacts, Coding tools/Coding artifacts, Video tools/Video artifacts) starts cleanly and doesn’t visually overlap the prior stage.
  - Ensure equal vertical spacing between CODEX -> tools -> artifacts.
  - Ensure the overlay stays inside frame (no horizontal overflow).
  - Keep typography consistent with the status/callout pills (font size, weight, background).
  - Prefer emoji for icons (avoid tiny unreadable vectors).
- [ ] Make the timeline readable in Studio:
  - Keep every major overlay inside a named `<Sequence name="...">` block.
  - Keep per-beat code grouped in `TextEffectsComp` so a new beat is easy to add.
- [ ] Skill/docs hygiene:
  - Review `.codex/skills/creating-video/SKILL.md` and its `references/` for anything that no longer matches the current workflow (render command, “code-first” guidance).
  - Add one short “gotcha” note if we find a repeatable cause of green fringing (premultiply, alpha edge quality, etc.).
- [ ] `AGENTS.md` check:
  - Confirm no additional repo-local operational guidance is needed for the new “code-first only + single render script” approach.
- [ ] Archive (only when explicitly agreed):
  - Move this plan to `docs/projects/archive/text-effects/` once the project is stable.

## Validation / Test Plan

- Visual:
  - Studio: scrub the `TextEffects` timeline and confirm each named `<Sequence>` appears when expected.
  - Render: `npm run render -- --comp TextEffects --from 0 --to 8` and confirm:
    - “RAW RECORDING” + disclaimer show in front.
    - “ANIMATING” + CODEX pill stays visible from first mention through the end of the cut.
    - Tools -> artifacts flow is legible, equidistant, and doesn’t overflow.
    - No obvious green edge artifacts (or they’re at an acceptable level if we intentionally keep it “cut out”).
- Timing:
  - Confirm the “100%” moment is aligned to speech using `transcript_words.json` timestamps.

## Progress Log

- 2026-02-08
  - Using MatAnyone alpha (VP9 WebM with alpha) at `.../88efdd42-c664-4df2-8c7d-34824323e95c.webm`.
  - `TextEffects` composition is code-first with URLs + beat timings in `src/projects/text-effects/assets.js`.
  - Tools/Artifacts overlay component exists at `src/projects/text-effects/CodexToolsArtifactsOverlay.js` and is wired via named `<Sequence>` blocks.
- 2026-02-09
  - Hardcoded all key timestamp triggers (no runtime phrase finding) in `src/projects/text-effects/assets.js`.
  - Added recap canvas + “check description” outro overlays.
  - Extended the composition cut to the full recording (`~258.4s`) so the entire timeline is visible in Studio.

## Next 3 Actions

1. Run `npm start` and confirm the `TextEffects` composition looks correct in Studio (timeline blocks present).
2. Run `npm run render -- --comp TextEffects --from 20 --to 55` to validate the Codex -> Tools -> Artifacts beat in a deterministic render.
3. Decide whether to implement a quick stills workflow via `scripts/render.mjs` (recommended) or via `npx remotion still`.
