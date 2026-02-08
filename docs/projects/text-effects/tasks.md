# Text Effects (Remotion) — `text-effects`

## Goal
Produce a repeatable, data-driven Remotion project that adds “text behind + in front of subject” effects to a source video, with a workflow that can be resumed on a fresh machine/session.

## Why / Impact
- We want fast iteration on “agent-edited” marketing videos (kinetic text + occlusion) without a manual NLE.
- The workflow should be simple: drop a video URL in `project.json`, transcribe, storyboard, matte if needed, then iterate in Remotion.
- If done wrong: timing drift (bad transcript alignment), wrong fps/size causing visual artifacts, or brittle project contracts that are hard to reuse across videos.

## Context
- Repo: `~/GitHub/adithyan-ai-videos`
- Project folder: `projects/text-effects/`
- Current “actual” source video (remote): `projects/text-effects/transform_720p.json` `input_url`
- Current working video (720p, used everywhere): `projects/text-effects/project.json` `video_url`
- Transcript artifacts:
  - Canonical: `projects/text-effects/transcript.json`
  - Derived convenience files: `projects/text-effects/words.json`, `projects/text-effects/sentences.json`
- Storyboard (beats + transcript inline): `projects/text-effects/storyboard.json`
- Matting output (needed for occlusion / text-behind-subject):
  - `projects/text-effects/matting.json` contains `alpha_url` (VP9 WebM with alpha) and `mask_url`
- Remotion entry points:
  - Compositions registered in `src/Root.js` (we added `TextEffects` as a separate composition id).
  - Cached Studio launcher: `scripts/studio_project.mjs`
  - Deterministic render + stills: `scripts/render_project.mjs`
  - Asset cache: `scripts/asset_cache.mjs` (downloads remote video/alpha once and serves via `--public-dir`).

## Decisions
- Keep `projects/<id>/project.json` minimal: only `video_url` required.
- Always ingest/transcribe/transform under channel `ADITHYAN` (WIN tooling convention).
- Use a 720p proxy for iteration speed, generated via WIN `transform.py`, and store the transform payload in `projects/<id>/transform_720p.json`.
- Keep only one “working video URL” in the project: the 720p URL in `projects/<id>/project.json` (avoid “proxy vs original” confusion during iteration).
- Keep occlusion optional and separate: matting lives in `projects/<id>/matting.json` (not in `project.json`).
- Storyboard is the source of truth for creative intent and timing; it is editable by hand.
- Storyboard beats include `transcript[]` inline for human review (derived from `sentences.json`).

## Open Questions
- None blocking right now.

## Tasks
- [ ] When the source video changes: regenerate proxy `transform_720p.json` (WIN `scripts/tools/media/transform.py`) and update `projects/text-effects/project.json` `video_url`.
- [ ] Re-run transcription (WIN `scripts/tools/media/transcribe.py`) to refresh `projects/text-effects/transcript.json`.
- [ ] Re-run `node scripts/extract_transcript_artifacts.mjs projects/text-effects` to refresh `words.json` + `sentences.json`.
- [ ] Refresh `projects/text-effects/storyboard.json`:
  - update `source.video_url` / `source.proxy_video_url`
  - recompute each beat’s `source_start/source_end` from `sentences.json`
  - regenerate each beat’s `transcript[]` from `sentences.json`
- [ ] Generate matting when occlusion is needed (WIN `scripts/tools/media/matting.py`) and write `projects/text-effects/matting.json` (captures `alpha_url`).
- [ ] Preview in Studio using cached assets:
  - `npm run studio:project -- projects/text-effects/project.json --comp TextEffects`
- [ ] Implement storyboard-driven overlays in the `TextEffects` composition **only when explicitly requested** (keep primitives reusable in `src/overlay_kit/`).
- [x] Validation: short render + stills to check occlusion edges, text readability, and timing:
  - `node scripts/render_project.mjs projects/text-effects/project.json --comp TextEffects --out /tmp/text-effects.mp4 --seconds 10 --fps 24`
- [ ] Review `AGENTS.md` guidance for any new durable workflow notes; update only if something new emerges.
- [ ] Archive: move this project doc under `docs/projects/archive/text-effects/` when the project is “done enough”.

## Validation / Test Plan
- Studio sanity:
  - Run `npm run studio:project -- projects/text-effects/project.json --comp TextEffects`
  - Confirm cached assets are used (no repeated remote fetches across restarts).
- Deterministic render:
  - `node scripts/render_project.mjs projects/text-effects/project.json --comp TextEffects --out /tmp/text-effects.mp4 --seconds 10 --fps 24`
  - Inspect `/tmp/text-effects-stills/` for occlusion halos/flicker and text readability.
  - If you see `npm error could not determine executable to run`, run `npm ci` first.
- Contract sanity:
  - `projects/text-effects/project.json` contains only `video_url`
  - `projects/text-effects/matting.json` contains `alpha_url` when occlusion is used
  - `projects/text-effects/storyboard.json` contains per-beat `transcript[]`

## Progress Log
- 2026-02-08: Generated 720p proxy for the current source video; updated `projects/text-effects/project.json` to use the proxy.
- 2026-02-08: Re-transcribed the current source and regenerated `sentences.json` + `words.json`.
- 2026-02-08: Created/updated storyboard beats and inlined per-beat transcript (`transcript[]`) for review.
- 2026-02-08: Generated MatAnyone output and wrote `projects/text-effects/matting.json` with `alpha_url` (VP9 WebM with alpha).
- 2026-02-08: [DONE] Ran deterministic render + stills for `TextEffects` (`/tmp/text-effects.mp4`, `/tmp/text-effects-stills/`).
- 2026-02-08: Increased `TextEffects` mask edge cleanup by bumping `shrinkPx` to 4 (quick green-fringe mitigation).

## Next 3 Actions
1. Open `projects/text-effects/storyboard.json` and edit beats/copy until you like the cut.
2. Run `npm run studio:project -- projects/text-effects/project.json --comp TextEffects` and verify the matte + layering look correct.
3. Once the storyboard is locked, implement the storyboard-driven overlay behavior in `TextEffects` (or tell the agent exactly which beat to build first).
