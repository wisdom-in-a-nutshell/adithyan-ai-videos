# Remotion Video Playground

## Scope

This is the only repo-local `AGENTS.md` file. Do not expect nested `AGENTS.md`
files anywhere else in this repo, and do not assume additional AGENTS files
auto-load when you touch a subtree.

## Purpose

Agent-first, solo Remotion workspace for repeatable video production. Humans
provide intent; agents implement and maintain code and docs.

## Read Order

1. `/Users/dobby/GitHub/AGENTS.md`
2. `docs/architecture/video-project-model.md`
3. `docs/references/project-contract.md`
4. `docs/references/repo-operations.md`
5. `docs/references/docs-contract.md`
6. `docs/references/verification-loop.md`
7. `docs/setup/cloud-render-modal.md` when cloud render is relevant
8. `docs/projects/<project>/tasks.md` for active execution state

## Repo Rules

- Keep subsystem shape, boundaries, and request/render flows in
  `docs/architecture/`.
- Keep commands, file maps, contracts, and exact implementation notes in
  `docs/references/`.
- Keep active execution state in `docs/projects/<project>/tasks.md`.
