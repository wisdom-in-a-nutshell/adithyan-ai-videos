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
- Register the composition in `src/Root.js`.
- Keep URLs, cut length, and per-video constants in code (e.g. `assets.js`).
- Avoid `projects/<id>/project.json` / `scripts/*project*.mjs` workflows unless the user explicitly asks for them.
- Wrap major overlays in named `<Sequence>` blocks so effects are visible in Studio’s timeline.
- Keep transcript timing data in a JSON file (either under `src/projects/<id>/` or `projects/<id>/`) and import it.
- For stable recordings, hardcode key effect timestamps in `src/projects/<id>/assets.js` (don’t re-find phrases at runtime). See `references/timeline-patterns.md`.

1. If the user already has a storyboard:
   - implement overlays/animations from it, then verify with short renders.
2. If the user does not have a storyboard:
   - draft a 3–7 beat storyboard, confirm it, then implement + verify.

References:

- Intake questions: `references/intake.md`
- Storyboard format: `references/storyboard.md`
- Verification loop (render/stills): `references/verification.md`
- Overlay component catalog: `references/overlay-components.md`
- Style tokens + readability rules: `references/style-tokens.md`
- Lessons learned (condensed do/don't): `references/lessons-learned.md`
- Quick checklist: `references/checklist.md`
- Commands: `references/commands.md`
- Also use `$remotion-best-practices` whenever you touch Remotion code.

## Where Things Live

- Remotion workspace repo: `wisdom-in-a-nutshell/adithyan-ai-videos` (local clone: `~/GitHub/adithyan-ai-videos`)
- Per-video code: `~/GitHub/adithyan-ai-videos/src/projects/<project-id>/`
- Composition registry: `~/GitHub/adithyan-ai-videos/src/Root.js`
- Transcript timing data (recommended): `~/GitHub/adithyan-ai-videos/src/projects/<project-id>/transcript_words.json`

## Golden Path (Code-First)

1. Create `src/projects/<project-id>/` with `assets.js`, `<Project>Comp.js`, and (optionally) `transcript_words.json`.
2. Register it in `src/Root.js` as a `<Composition id="...">`.
3. Preview: `npm start` and select the composition in Studio.
4. Render (fast preview by default, auto-opens on macOS): `npm run render`.
   - Render a time slice in seconds (recommended for iteration): `npm run render -- --from 0 --to 6`
   - Full quality: `npm run render -- --hq`

## Expected Outputs (What To Produce)

For a new video project, the “done” state is:

- `~/GitHub/adithyan-ai-videos/src/projects/<project-id>/` (composition + assets/constants + transcript data)
- `~/GitHub/adithyan-ai-videos/src/Root.js` registration
- Remotion code changes (new overlay primitives or a per-project composition wiring), as needed
- A verification render + stills under `/tmp` (see `references/verification.md`)

## Workflow (Close The Loop)

Use short renders + a few stills to validate quickly while iterating (don’t trust Studio playback alone).

See `references/verification.md` for the recommended commands and what to look for.

## Self-Improvement (Document Learnings)

When you learn something that is likely to repeat (a reliable workflow, a recurring pitfall, or a reusable contract):

- Update this skill (prefer a short addition to `references/*` rather than bloating this file).
- Update the nearest `AGENTS.md` if it is a repo-local operational rule for agents returning cold.
- Prefer turning learnings into reusable artifacts: `storyboard.json` conventions, named `<Sequence>` patterns, and `src/overlay_kit/` primitives.
