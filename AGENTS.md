# Remotion Video Playground

## Scope

This root `AGENTS.md` applies repo-wide. Keep scoped detail in the linked docs
instead of adding nested `AGENTS.md` or `CLAUDE.md` files.

## Purpose

Agent-first, solo Remotion workspace for repeatable video production. Humans
provide intent; agents implement and maintain code and docs.

## Task Routes

- New composition or project ownership: `docs/references/project-contract.md`.
- Reusable visual blocks: `docs/references/effect-library.md` and `src/projects/effects-lab/`.
- External generation: `docs/references/ai-video-generation-workflow.md`; choose a
  provider with `docs/references/ai-video-model-playbook.md` only when needed.
- Commands and rendering proof: `docs/references/repo-operations.md` and
  `docs/references/verification-loop.md`.
- Importing or retaining media: `docs/references/media-storage.md`.
- Cloud delivery: `docs/setup/cloud-render-modal.md`.
- Existing longer work: its `docs/projects/<project>/tasks.md`.

## Repo Rules

- Keep subsystem shape, boundaries, and request/render flows in
  `docs/architecture/`.
- Keep commands, file maps, contracts, and exact implementation notes in
  `docs/references/`.
- Keep active execution state in `docs/projects/<project>/tasks.md`.
