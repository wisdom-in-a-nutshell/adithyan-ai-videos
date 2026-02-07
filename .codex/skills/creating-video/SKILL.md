---
name: creating-video
description: "Idea → storyboard → Remotion overlays/animation → short renders + stills for fast visual iteration."
---

# Creating Video

## Overview

Use this skill to collaborate with the user from idea → storyboard → Remotion implementation, with a tight visual verification loop (short renders + stills).

## Workflow Decision

1. If the user already has a storyboard:
   - implement overlays/animations from it, then verify with short renders.
2. If the user does not have a storyboard:
   - draft a 3–7 beat storyboard, confirm it, then implement + verify.

References:

- Intake questions: `references/intake.md`
- Storyboard format: `references/storyboard.md`
- Tooling inventory (WIN CLI helpers): `references/tools.md`
- Verification loop (render/stills): `references/verification.md`
- Overlay component catalog: `references/overlay-components.md`
- Style tokens + readability rules: `references/style-tokens.md`
- Timeline patterns (types + timing): `references/timeline-patterns.md`
- Lessons learned (condensed do/don't): `references/lessons-learned.md`
- Quick checklist: `references/checklist.md`
- Commands: `references/commands.md`

## Where Things Live

- Remotion workspace repo: `wisdom-in-a-nutshell/adithyan-ai-videos` (local clone: `~/GitHub/adithyan-ai-videos`)
- Per-video inputs: `~/GitHub/adithyan-ai-videos/projects/<project-id>/project.json`
- Preferred verifier: `~/GitHub/adithyan-ai-videos/scripts/render_project.mjs`

## project.json Contract (Minimal + Stable)

Keep `project.json` small and stable. Prefer placing anything composition-specific under `props` so the top-level contract stays stable.

## Expected Outputs (What To Produce)

For a new video project, the “done” state is:

- `~/GitHub/adithyan-ai-videos/projects/<project-id>/project.json`
- `~/GitHub/adithyan-ai-videos/projects/<project-id>/storyboard.json` (optional but recommended)
- Remotion code changes (new overlay primitives or a per-project composition wiring), as needed
- A verification render + stills under `/tmp` (see `references/verification.md`)

## Workflow (Close The Loop)

Use short renders + a few stills to validate quickly while iterating (don’t trust Studio playback alone).

See `references/verification.md` for the recommended commands and what to look for.

## Self-Improvement (Document Learnings)

When you learn something that is likely to repeat (a reliable workflow, a recurring pitfall, or a reusable contract):

- Update this skill (prefer a short addition to `references/*` rather than bloating this file).
- Update the nearest `AGENTS.md` if it is a repo-local operational rule for agents returning cold.
- Prefer turning learnings into reusable artifacts: `project.json`/`storyboard.json` conventions and `src/overlay_kit/` primitives.
