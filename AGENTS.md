# Remotion Video Playground

## Purpose

Agent-first, solo Remotion workspace for repeatable video production.
Humans provide intent; agents implement and maintain code and docs.

## Read Order

1. `/Users/dobby/GitHub/AGENTS.md` (portfolio policy)
2. `docs/architecture/video-project-model.md`
3. `docs/references/project-contract.md`
4. `docs/references/verification-loop.md`
5. `docs/projects/<project>/tasks.md` (active execution state)

## Repo Rules

- Keep per-video runtime code in `src/projects/<project-id>/`.
- Keep per-video source artifacts and notes in `projects/<project-id>/`.
- Prefer Markdown storyboards as the editable source of truth: `projects/<project-id>/storyboard.md` (optional `storyboard.json` export only when automation needs it).
- Register compositions via `src/projects/registry.js` (consumed by `src/Root.js`).
- Keep reusable primitives in `src/overlay_kit/`.
- Wrap major effects in named `<Sequence>` blocks so timeline blocks are visible in Studio.
- Do not depend on runtime manifest files; keep runtime inputs in code (`assets.js`).

## Quality Gate

- Husky pre-commit runs `npm run check:fast`.
- `check:fast` must stay fast and non-rendering.
- Current blocking checks:
  - merge conflict markers in staged files
  - invalid staged JSON
  - repo doctor (`npm run doctor`)
  - broken Remotion composition registration (`npx remotion compositions src/index.js`)

## CI Policy (Current)

- CI is intentionally deferred for now.
- This repo is solo and local-first; rely on local guardrails (`check:fast` + `doctor`).
- Do not add CI unless one of the future triggers below happens.

## Future TODO (If Needed)

1. Add minimal CI only if "works on my machine" issues become frequent.
2. Add CI if we need consistent checks across multiple machines.
3. Add CI if we want a remote release gate before cloud render/publish.

## Commands

- Start Studio: `npm start`
- Fast render slice: `npm run render -- --comp <CompositionId> --from 0 --to 6`
- Project scaffold: `npm run new:project -- --id <project-id> --title "My Video"`
- Repo invariant check: `npm run doctor`

## References

- Alpha compositing notes: `docs/references/alpha-compositing.md`
- Cloud render setup: `docs/setup/cloud-render-modal.md`
