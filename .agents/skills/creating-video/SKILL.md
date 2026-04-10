---
name: creating-video
description: "Idea → storyboard → Remotion overlays/animation → short renders + stills for fast visual iteration."
---

# Creating Video

## Overview

Use this skill to collaborate with the user from idea → storyboard → Remotion implementation, with a tight visual verification loop (short renders + stills).

## Workflow Decision

Use **code-first** by default:

- Put per-video code under `src/projects/<project-id>/`.
- Register the composition through `src/projects/registry.js`; `src/Root.js` should continue rendering `PROJECT_COMPOSITIONS`.
- Keep URLs, cut length, and per-video constants in code (e.g. `assets.js`).
- Prefer remote-first runtime media in `assets.js` for compositions that may need cloud render; keep local files as editable source material until they are promoted into the runtime path.
- For media-processing steps, first check `$media-toolkit` for a suitable command surface (for example transcription, transform, matting, or job status). If it fits the task, prefer it over lower-level backend-specific paths.
- We removed `projects/<id>/project.json` / `scripts/*project*.mjs` workflows. Don’t reintroduce them unless the user explicitly asks.
- Wrap major overlays in named `<Sequence>` blocks so effects are visible in Studio’s timeline.
- Keep transcript timing data as a JSON file committed with the project (prefer `src/projects/<id>/transcript_words.json` so the project is self-contained).
- For stable recordings, hardcode key effect timestamps in `src/projects/<id>/assets.js` (don’t re-find phrases at runtime). See `references/timeline-patterns.md`.
- Don’t depend on “manifest” files at runtime (e.g. `projects/<id>/matting.json`). If they exist, treat them as scratch notes only.
- For work that may span multiple sessions, keep active execution state in `docs/projects/<project-id>/tasks.md`.

1. If the user already has a storyboard:
   - implement overlays/animations from it, then verify with short renders.
2. If the user does not have a storyboard:
   - draft a 3–7 beat storyboard, confirm it, then implement + verify.

References:

- Intake questions: `references/intake.md`
- Storyboard format: `references/storyboard.md`
- Verification loop (render/stills): `references/verification.md`
- Overlay component catalog: `references/overlay-components.md`
- Shared effect blocks: `~/GitHub/adithyan-ai-videos/docs/references/effect-library.md`
- Style tokens + readability rules: `references/style-tokens.md`
- Lessons learned (condensed do/don't): `references/lessons-learned.md`
- Asset caching (default-on): `references/asset-caching.md`
- Quick checklist: `references/checklist.md`
- Commands: `references/commands.md`
- Also use `$remotion-best-practices` whenever you touch Remotion code.

## Where Things Live

- Per-video code: `<repo-root>/src/projects/<project-id>/`
- Shared effect blocks: `<repo-root>/src/effects/`
- Artifact folder: `<repo-root>/projects/<project-id>/`
- Composition registry: `<repo-root>/src/projects/registry.js`
- Transcript timing data (recommended): `<repo-root>/src/projects/<project-id>/transcript_words.json` (keep it “thin”: words + timestamps)
- Active execution state: `<repo-root>/docs/projects/<project-id>/tasks.md`

## Golden Path (Code-First)

1. Scaffold the project: `npm run new:project -- --id <project-id> --title "My Video"`.
2. Fill `src/projects/<project-id>/assets.js`, refine `<Project>Comp.js`, and keep editable source notes in `projects/<project-id>/`.
3. If the work is likely to continue across sessions, create `docs/projects/<project-id>/tasks.md` and keep the resume state there.
4. Preview: `npm start` and select the composition in Studio.
5. Render (fast preview by default, auto-opens on macOS): `npm run render`.
   - Render a time slice in seconds (recommended for iteration): `npm run render -- --from 0 --to 6`
   - Full quality: `npm run render -- --hq`
6. When the project reaches a stable checkpoint, use `npm run render:cloud` instead of ad hoc Modal commands so the repo-owned client handles submission, status, and final URL reporting.

## Expected Outputs (What To Produce)

For a new video project, the “done” state is:

- `<repo-root>/src/projects/<project-id>/` (composition + assets/constants + transcript data)
- `<repo-root>/projects/<project-id>/` (storyboard, notes, scratch artifacts)
- `<repo-root>/src/projects/registry.js` registration
- Remotion code changes (new overlay primitives or a per-project composition wiring), as needed
- `<repo-root>/docs/projects/<project-id>/tasks.md` when the work needs a durable resume point
- A verification render + stills under repo-local `tmp/` (see `references/verification.md`)

## Workflow (Close The Loop)

Use short renders + a few stills to validate quickly while iterating (don’t trust Studio playback alone).

See `references/verification.md` for the recommended commands and what to look for.

## Self-Improvement (Document Learnings)

When you learn something that is likely to repeat (a reliable workflow, a recurring pitfall, or a reusable contract):

- Update this skill (prefer a short addition to `references/*` rather than bloating this file).
- Update the nearest `AGENTS.md` if it is a repo-local operational rule for agents returning cold.
- Prefer turning learnings into reusable artifacts: `storyboard.md` conventions (plus optional `storyboard.json` export), named `<Sequence>` patterns, `src/overlay_kit/` primitives, and `src/effects/` blocks when the pattern has already repeated across scenes.
