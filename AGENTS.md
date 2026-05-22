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
3. `docs/references/effect-library.md` when visual reuse or house-style blocks are relevant
4. `docs/references/ai-video-generation-workflow.md` and `docs/references/ai-video-model-playbook.md` when external AI image/video generation is part of the workflow
5. `docs/references/repo-operations.md`
6. `docs/references/media-storage.md` when importing or moving large local media
7. `docs/references/docs-contract.md`
8. `docs/references/verification-loop.md`
9. `docs/setup/cloud-render-modal.md` when cloud render is relevant
10. `docs/projects/<project>/tasks.md` for active execution state

## Repo Rules

- Keep subsystem shape, boundaries, and request/render flows in
  `docs/architecture/`.
- Keep commands, file maps, contracts, and exact implementation notes in
  `docs/references/`.
- Keep active execution state in `docs/projects/<project>/tasks.md`.
