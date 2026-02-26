# Repo Hardening (Agent-Native Video Factory)

## Goal

Standardize this repo for repeated solo video creation with low setup friction and strong agent legibility.

## Success Criteria

- Router-style `AGENTS.md` with deep detail moved into `docs/`.
- Stable docs contract in place (`architecture`, `references`, `projects`).
- One-command new project scaffold.
- One-command repo doctor check.
- Fast pre-commit gate includes doctor + Remotion composition compile check.

## Tasks

- [x] Create docs contract files:
  - `docs/architecture/video-project-model.md`
  - `docs/references/project-contract.md`
  - `docs/references/verification-loop.md`
  - `docs/references/alpha-compositing.md`
  - `docs/setup/cloud-render-modal.md`
- [x] Convert repo `AGENTS.md` to router style and link docs.
- [x] Add `scripts/new_project.mjs` scaffold.
- [x] Add `scripts/doctor.mjs` invariant checks.
- [x] Add npm scripts for `new:project` and `doctor`.
- [x] Wire doctor into `check:fast` via `scripts/precommit-check.sh`.
- [ ] Validate by creating one sample scaffold in a throwaway id (optional).
- [ ] Start next project using `npm run new:project -- --id <id>`.

## Progress Log

- 2026-02-26: Added docs contract, router AGENTS, scaffold command, doctor command, and pre-commit integration.

## Next 3 Actions

1. Run `npm run doctor`.
2. Run `npm run new:project -- --id demo-next-video --title "Demo Next Video"` and verify folder outputs.
3. Start real next video project with the same command using real project id.
