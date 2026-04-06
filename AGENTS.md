# Remotion Video Playground

## Scope

This root `AGENTS.md` applies repo-wide. Keep scoped detail in the linked docs
instead of adding nested `AGENTS.md` or `CLAUDE.md` files.

## Purpose

Agent-first, solo Remotion workspace for repeatable video production. Humans
provide intent; agents implement and maintain code and docs.

## Read Order

1. `docs/architecture/video-project-model.md`
2. `docs/references/project-contract.md`
3. `docs/references/repo-operations.md`
4. `docs/references/docs-contract.md`
5. `docs/references/verification-loop.md`
6. `docs/setup/cloud-render-modal.md` when cloud render is relevant
7. `docs/projects/<project>/tasks.md` for active execution state

## Repo Rules

- Keep subsystem shape, boundaries, and request/render flows in
  `docs/architecture/`.
- Keep commands, file maps, contracts, and exact implementation notes in
  `docs/references/`.
- Keep active execution state in `docs/projects/<project>/tasks.md`.
