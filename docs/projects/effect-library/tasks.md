# Effect Library Consolidation

## Goal
Establish a reusable, repo-native library of video effect blocks and house-style patterns so future projects can be assembled from shared code instead of copying old project compositions.

## Why / Impact
This repo is becoming a repeatable video system, not a one-off playground. Right now the visual language is strong, but much of the reusable knowledge is trapped inside project comps like `text-effects` and `c0046`. If we do not consolidate it, agents will keep re-discovering patterns, style will drift, and reuse will depend on chat memory instead of code.

## Scope / Non-Goals
### In Scope
- Inventory the repeatable effect patterns already proven in `text-effects`, `c0046`, and `src/overlay_kit/`.
- Define a clean boundary between low-level overlay primitives and higher-level reusable scene/effect blocks.
- Propose and implement a shared code location for reusable video blocks.
- Keep the reusable system self-documenting in code first, with thin repo docs that index what exists and how to use it.
- Add one durable reference for the effect catalog and block usage.
- Migrate the first wave of proven patterns into the shared layer without changing the overall repo docs contract.

### Out of Scope
- Rewriting all existing projects at once.
- Turning the repo into a generic public framework.
- Copying external Remotion best practices into local repo docs verbatim.
- Adding heavy process, centralized policy layers, or branch-heavy workflow.

## Context / Constraints
- Date started: 2026-04-10
- Root routing/docs structure is already good: `AGENTS.md`, `docs/architecture/video-project-model.md`, `docs/references/project-contract.md`, and `docs/references/repo-operations.md`.
- Reusable low-level primitives already exist in `src/overlay_kit/`.
- Reusable higher-level beats currently live inside project comps, especially `src/projects/text-effects/TextEffectsComp.js` and `src/projects/c0046/C0046Comp.js`.
- The user wants the system to be self-documenting and mostly code-first, with thin docs that help agents resume cold.
- External `remotion-best-practices` should remain the generic domain standard; repo-specific style/workflow should remain local to this repo.
- Keep the house visual language consistent: top-left status/callout stack, sketch-flavored overlays, strong foreground/background compositing, and recognizable layout/timing patterns.
- The image generation style canon already exists in `/Users/dobby/.agents/skills-source/owned/imagegen/styles/minimal-monochrome-webcomic-agent.md` and is referenced by `projects/c0046/storyboard-assets/sketch/worklog.md`.
- There is already precedent for transcript-derived phrase timing in `src/components/HeroStamp.js`, but the repo does not yet have a small shared utility for one-time phrase-to-frame derivation during project setup.

## Done When
- [ ] A shared effect/block layer exists in code with a clear boundary from `src/overlay_kit/`.
- [ ] The first wave of reusable patterns is extracted and used by at least one real project composition.
- [ ] A thin repo reference documents the effect catalog, block responsibilities, and when to use each block.
- [ ] The `creating-video` workflow and repo docs point agents to the new shared effect layer instead of relying on project-specific memory.
- [ ] The user has reviewed the proposed structure and confirmed it fits the intended long-term workflow.

## Milestones
- [ ] Milestone 1 — Inventory and design the shared effect system. Acceptance: repo has a reviewed file map, block taxonomy, and first-wave extraction order grounded in the current codebase. Validate: tracker + proposed file map are internally consistent and match the current reusable surfaces.
- [ ] Milestone 2 — Create the shared effect layer and extract the first wave of reusable blocks. Acceptance: shared code exists and one reference project renders through the extracted blocks without visual regression. Validate: `npm run doctor` and a short local render on the migrated project.
- [ ] Milestone 3 — Add the effect catalog and self-documenting usage examples. Acceptance: agents can discover available blocks and their intended use from repo docs plus code exports. Validate: doc review + one showcase/reference render.
- [ ] Milestone 4 — Normalize the workflow around the shared layer. Acceptance: `creating-video` and repo references point to the new pattern, and at least one additional project can reuse the extracted blocks with low friction. Validate: `npm run doctor` and one project-specific verification render.

## Execution Rules
- Keep work scoped to the current milestone unless the tracker explicitly expands scope.
- Run validation after each milestone or risky batch and fix failures before advancing.
- Continue working until the scoped project is done or a true blocker requires human input; do not stop after one completed task if more actionable work remains.
- When `Done When` is satisfied and validation is acceptable, archive the project directly; ask only if completion is materially uncertain.
- Unless repo guidance says otherwise, archiving means moving the tracker to `docs/projects/archive/<project>/tasks.md`; create the archive folders if missing.
- Update this tracker whenever the plan changes materially or before ending the run.
- Keep the external `remotion-best-practices` skill generic; do not fork it into repo-local policy.
- Prefer self-documenting code plus thin references over verbose prose-only guidance.
- Do not extract “shared blocks” prematurely from unproven one-off scenes; only consolidate patterns that already repeat or clearly will repeat.

## Decisions
- Reusable knowledge should live primarily in shared code, with docs acting as an index and lookup layer rather than the sole source of truth.
- Keep root `AGENTS.md` as a router; do not add nested `AGENTS.md` files for this work unless a subtree truly develops unique boundary rules.
- Preserve the current docs contract: `docs/architecture/` for system shape, `docs/references/` for exact facts, `docs/projects/*/tasks.md` for active work.
- The shared higher-level block folder should be `src/effects/`. `src/overlay_kit/` remains the home for low-level UI primitives and rough/sketch helpers.
- The target shape is:
  - `src/overlay_kit/` for low-level primitives
  - `src/effects/` for reusable editorial beats and compositing-level blocks
  - `src/projects/<id>/` for project-specific assembly, timing, and assets
- First-wave blocks stable enough to extract now:
  - a `Beat`-style wrapper for the repeated status + callout sequence pattern
  - `SketchPanel`
  - a chroma-key/filter helper for green-screen based cutout work
  - a simple fade-in backdrop helper
  - a tracked-object overlay helper driven by track data + treatment config
- `S05DepthText`-style bespoke typography is not first-wave shared code yet; wait until a second project needs the same depth-text pattern.
- Add an `effects-lab` reference composition once the first-wave blocks exist so agents can preview shared blocks without opening historical projects.

## Open Questions / Blockers
- What exact file map should Milestone 1 freeze for `src/effects/`, the effect catalog doc, and the optional `effects-lab` composition?
- Should the word-locked timestamp helper live in `src/effects/`, `src/lib/`, or another shared utility path?
- How tightly should the imagegen/webcomic style anchor be linked into the effect-library docs versus left as a cross-reference only?

## Current Batch
| Status | Work Item | Role | Resource |
| --- | --- | --- | --- |
| in_progress | Review and refine the proposed effect-library project shape with the user before extracting shared code. | parent | `docs/projects/effect-library/tasks.md` |
| todo | Freeze the Milestone 1 file map for `src/effects/`, the first-wave blocks, and the supporting docs/reference surface. | parent | `docs/projects/effect-library/tasks.md` |
| todo | Inventory the reusable patterns already present in `text-effects`, `c0046`, and `src/overlay_kit/` against the agreed first-wave list. | parent |  |

## Backlog / Remaining Work
- [ ] Create a concrete extraction map from existing code into shared blocks.
- [ ] Extract the first wave of stable blocks from `text-effects` / `c0046`.
- [ ] Create a thin effect catalog doc under `docs/references/`.
- [ ] Add an `effects-lab` composition for block previews and shared-block validation.
- [ ] Update `creating-video` references to point to the shared effect layer once it exists.
- [ ] Add a small shared helper for deriving word-locked phrase/frame anchors from transcript timing data during setup time, then keep the final timestamps hardcoded in project `assets.js`.
- [ ] Decide how to surface the webcomic/imagegen style canon inside the shared effect docs so storyboard-panel generation stays consistent with the house brand.
- [ ] Review `AGENTS.md` and repo references after the extraction to ensure routing still points to the right durable docs.
- [ ] Add a closeout learnings task that reviews whether the new shared layer materially reduced agent drift.
- [ ] Archive this tracker when the shared effect system is in place and documented.

## Validation / Test Plan
- Planning stage: verify the proposed file map and block taxonomy against the current repo structure.
- Extraction stage: `npm run doctor`
- Extraction stage: short local render(s) for any migrated project composition using the new shared blocks.
- If a showcase/effects-lab comp is added, render one short slice to confirm the reference surface stays healthy.

## Progress Log
- 2026-04-10: [IN-PROGRESS] Created project tracker for consolidating a shared effect/block library from the existing house style and proven project patterns.
- 2026-04-10: [IN-PROGRESS] Refined the initial plan using reviewer feedback: locked the shared folder to `src/effects/`, identified the first-wave extraction set, agreed that an `effects-lab` composition is worth adding, and added follow-up tasks for transcript phrase helpers and the imagegen style anchor.
