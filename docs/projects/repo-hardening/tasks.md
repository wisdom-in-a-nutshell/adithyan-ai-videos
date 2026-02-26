# Repo Hardening (Agent-Native Video Factory)

## Goal

Standardize this repo for repeated solo video creation with low setup friction and strong agent legibility.

## Success Criteria

- Router-style `AGENTS.md` with deep detail moved into `docs/`.
- Stable docs contract in place (`architecture`, `references`, `projects`).
- One-command new project scaffold.
- One-command repo doctor check.
- Registry-based composition wiring for scalable project growth.
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
- [x] Refactor composition wiring to `src/projects/registry.js` + per-project `composition.js`.
- [x] Normalize `active-speaker-detection` to project contract (`*Comp.js`, transcript file, artifact folder).
- [x] Validate scaffold with a throwaway id.
- [ ] Start next real project using `npm run new:project -- --id <id>`.

## Progress Log

- 2026-02-26: Added docs contract, router AGENTS, scaffold command, doctor command, and pre-commit integration.
- 2026-02-26: Refactored to registry-based compositions and standardized legacy project layout.

## Next 3 Actions

1. Run `npm run new:project -- --id <real-project-id> --title "<Title>"`.
2. Open Studio and verify composition appears (`npm start`).
3. Create/refresh `docs/projects/<real-project-id>/tasks.md` for execution tracking.
