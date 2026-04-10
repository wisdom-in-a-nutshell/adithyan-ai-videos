# Effect Library Consolidation

## Goal
Establish a reusable, repo-native library of video effect blocks and house-style patterns so future projects can be assembled from shared code instead of copying old project compositions.

## Closeout Summary

This project is complete and ready to archive.

Scoped outcome:
- the shared effect layer exists in `src/effects/`
- the active narrative project (`object-segmentation`) uses the extracted
  blocks
- `EffectsLab` exists as a dedicated preview surface for shared blocks
- the `creating-video` skill and repo docs now point cold agents to the shared
  layer instead of old narrative comps
- the remaining optional polish is also complete:
  - phrase-to-frame setup helper added
  - extraction criteria documented

Validation evidence:
- `npm run doctor`
- `npm run render -- --comp EffectsLab --from 0 --to 4 --no-open`
- `npm run render -- --comp ObjectSegmentation --from 150 --to 160 --no-open`
- `node scripts/find_phrase_frames.mjs --words src/projects/c0040/transcript_words.json --phrase "everything that you are" --fps 30 --after 3`

## Why / Impact
This repo is becoming a repeatable video system, not a one-off playground. Right now the visual language is strong, but much of the reusable knowledge is trapped inside project comps like `text-effects` and `object-segmentation`. If we do not consolidate it, agents will keep re-discovering patterns, style will drift, and reuse will depend on chat memory instead of code.

## Scope / Non-Goals
### In Scope
- Inventory the repeatable effect patterns already proven in `text-effects`, `object-segmentation`, and `src/overlay_kit/`.
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
- Reusable higher-level beats currently live inside project comps, especially `src/projects/text-effects/TextEffectsComp.js` and `src/projects/object-segmentation/ObjectSegmentationComp.js`.
- The user wants the system to be self-documenting and mostly code-first, with thin docs that help agents resume cold.
- External `remotion-best-practices` should remain the generic domain standard; repo-specific style/workflow should remain local to this repo.
- Keep the house visual language consistent: top-left status/callout stack, sketch-flavored overlays, strong foreground/background compositing, and recognizable layout/timing patterns.
- The image generation style canon already exists in `/Users/dobby/.agents/skills-source/owned/imagegen/styles/minimal-monochrome-webcomic-agent.md` and is referenced by `projects/object-segmentation/storyboard-assets/sketch/worklog.md`.
- There is already precedent for transcript-derived phrase timing in `src/components/HeroStamp.js`, but the repo does not yet have a small shared utility for one-time phrase-to-frame derivation during project setup.
- There is not yet a proven shared chroma-key implementation in-repo; the reusable cutout/compositing primitive that exists today is transparent alpha-video playback plus outline/filter treatment.

## Done When
- [x] A shared effect/block layer exists in code with a clear boundary from `src/overlay_kit/`.
- [x] The first wave of reusable patterns is extracted and used by at least one real project composition.
- [x] A thin repo reference documents the effect catalog, block responsibilities, and when to use each block.
- [x] The `creating-video` workflow and repo docs point agents to the new shared effect layer instead of relying on project-specific memory.
- [x] The user has reviewed the proposed structure and confirmed it fits the intended long-term workflow.

## Milestones
- [x] Milestone 1 — Inventory and design the shared effect system. Acceptance: repo has a reviewed file map, block taxonomy, and first-wave extraction order grounded in the current codebase. Validate: tracker + proposed file map are internally consistent and match the current reusable surfaces.
- [x] Milestone 2 — Create the shared effect layer and extract the first wave of reusable blocks. Acceptance: shared code exists and one reference project renders through the extracted blocks without visual regression. Validate: `npm run doctor` and a short local render on the migrated project.
- [x] Milestone 3 — Add the effect catalog and self-documenting usage examples. Acceptance: agents can discover available blocks and their intended use from repo docs plus code exports. Validate: doc review + one showcase/reference render.
- [x] Milestone 4 — Normalize the workflow around the shared layer. Acceptance: `creating-video` and repo references point to the new pattern, and at least one additional project can reuse the extracted blocks with low friction. Validate: `npm run doctor` and one project-specific verification render.

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
- The shared effect layer is a companion to `remotion-best-practices`, not a local replacement for it. Keep generic Remotion guidance external; codify only this repo's reusable house style, block library, and workflow-specific conventions.
- The shared higher-level block folder should be `src/effects/`. `src/overlay_kit/` remains the home for low-level UI primitives and rough/sketch helpers.
- The target shape is:
  - `src/overlay_kit/` for low-level primitives
  - `src/effects/` for reusable editorial beats and compositing-level blocks
  - `src/projects/<id>/` for project-specific assembly, timing, and assets
- First-wave blocks stable enough to extract now:
  - a `StatusBeat` / `CalloutBeat` helper for the repeated top-left status + callout sequence pattern
  - `SketchPanel`
  - a transparent-video cutout helper for alpha matte playback with optional outline/filter treatment
  - a simple fade-in backdrop helper
  - a tracked-object overlay helper driven by track data + treatment config
- `S05DepthText`-style bespoke typography is not first-wave shared code yet; wait until a second project needs the same depth-text pattern.
- Add an `effects-lab` reference composition once the first-wave blocks exist so agents can preview shared blocks without opening historical projects.
- Older projects with stale runtime assets, such as `text-effects`, are useful as pattern references but should not block the effect-library rollout. Validate shared blocks against `object-segmentation` and `effects-lab` or another active project instead of rehabilitating archival asset URLs unless there is a direct product need.
- `EffectsLab` is sufficient as the second shared-block consumer for this
  closeout because the real goal is cold-agent discoverability and safe reuse,
  not proving a second narrative project immediately.
- Milestone 1 file map should be:
  - `src/lib/resolveAssetSrc.js` for shared runtime asset resolution
  - `src/effects/EditorialBeat.js` for `StatusBeat`, `CalloutBeat`, and the shared beat UI defaults
  - `src/effects/SketchPanel.js`
  - `src/effects/TransparentVideoOverlay.js`
  - `src/effects/FadeInBackdrop.js`
  - `src/effects/TrackedObjectOverlay.js`
  - `src/effects/index.js`
  - `docs/references/effect-library.md` as the thin lookup reference
  - `src/projects/effects-lab/` as the optional later showcase composition, not required for the first extraction batch

## Open Questions / Blockers

None for this scoped closeout.

Future considerations only:
- if another narrative project starts reusing the same blocks, keep validating
  the `src/effects/` boundary against real project pressure
- if the shared layer grows significantly, consider a slightly richer
  extraction-criteria reference or a grouped export surface
- keep the imagegen/webcomic style anchor as a cross-reference unless a real
  shared block starts depending on it

## Current Batch
| Status | Work Item | Role | Resource |
| --- | --- | --- | --- |
| done | Review and refine the proposed effect-library project shape with the user before extracting shared code. | parent | `docs/projects/effect-library/tasks.md` |
| done | Freeze the Milestone 1 file map for `src/effects/`, the first-wave blocks, and the supporting docs/reference surface. | parent | `docs/projects/effect-library/tasks.md` |
| done | Inventory the reusable patterns already present in `text-effects`, `object-segmentation`, and `src/overlay_kit/` against the agreed first-wave list. | parent | `src/projects/object-segmentation/ObjectSegmentationComp.js`, `src/projects/text-effects/TextEffectsComp.js`, `src/overlay_kit/overlays.js` |
| done | Extract the first shared files into `src/effects/` and migrate `object-segmentation` to use them. | parent | `src/effects/`, `src/projects/object-segmentation/ObjectSegmentationComp.js` |
| done | Add the thin effect-catalog reference and align repo docs to the new `src/effects/` boundary. | parent | `docs/references/effect-library.md`, `docs/architecture/video-project-model.md`, `.agents/skills/creating-video/SKILL.md` |
| done | Rename the active `c0046` project to the descriptive `object-segmentation` slug and finish converting the remaining direct beat stack duplication onto the shared helpers. | parent | `src/projects/object-segmentation/`, `projects/object-segmentation/`, `src/projects/registry.js` |
| done | Add the `effects-lab` reference composition so shared blocks have a dedicated preview surface independent of archival projects. | parent | `src/projects/effects-lab/`, `src/projects/registry.js` |
| done | Add the setup-time phrase-to-frame helper and document the extraction rule for when code should move into `src/effects/`. | parent | `scripts/find_phrase_frames.mjs`, `src/lib/findPhraseFrames.js`, `.agents/skills/creating-video/references/effect-extraction.md` |
| done | Close and archive the finished effect-library project. | parent | `docs/projects/archive/effect-library/` |

## Backlog / Remaining Work

Descoped from this finished tracker and left as future follow-on ideas:
- keep pressure-testing `src/effects/` against the next real narrative project
- grow the extraction criteria only if agents still hesitate about where code
  belongs
- revisit grouped exports or naming only if the shared effect layer expands
  materially beyond the first wave

## Validation / Test Plan
- Planning stage: verify the proposed file map and block taxonomy against the current repo structure.
- Extraction stage: `npm run doctor`
- Extraction stage: short local render(s) for any migrated project composition using the new shared blocks.
- If a showcase/effects-lab comp is added, render one short slice to confirm the reference surface stays healthy.

## Closeout Validation

- `npm run doctor`
- `npm run render -- --comp EffectsLab --from 0 --to 4 --no-open`
- `npm run render -- --comp ObjectSegmentation --from 150 --to 160 --no-open`
- `node scripts/find_phrase_frames.mjs --words src/projects/c0040/transcript_words.json --phrase "everything that you are" --fps 30 --after 3`

## Delegation Retrospective

- Review agents were helpful for pressure-testing whether the shared layer was
  agent-native enough and whether another broad skill or client was justified.
- The useful outcome was confirmation, not implementation: the repo needed
  tighter docs and one small helper, not another system.
- Future heuristic: use review delegation to test workflow sufficiency, but keep
  shared-boundary edits and tracker closeout in the parent thread.

## Progress Log
- 2026-04-10: [IN-PROGRESS] Created project tracker for consolidating a shared effect/block library from the existing house style and proven project patterns.
- 2026-04-10: [IN-PROGRESS] Refined the initial plan using reviewer feedback: locked the shared folder to `src/effects/`, identified the first-wave extraction set, agreed that an `effects-lab` composition is worth adding, and added follow-up tasks for transcript phrase helpers and the imagegen style anchor.
- 2026-04-10: [IN-PROGRESS] Froze the Milestone 1 file map and tightened the first-wave list based on actual repo evidence: keep the Remotion skill external, treat `src/effects/` as a companion house-style layer, and replace the not-yet-real shared chroma-key helper with the proven transparent-video cutout primitive.
- 2026-04-10: [DONE] Created the first shared effect layer in `src/effects/` and `src/lib/resolveAssetSrc.js`, then migrated the active object-segmentation project to use `StatusBeat`, `CalloutBeat`, `SketchPanel`, `TransparentVideoOverlay`, `FadeInBackdrop`, and `TrackedObjectOverlay`.
- 2026-04-10: [DONE] Validated the first extraction batch with `npm run doctor`, a local S05 render (`68s -> 90s`), and a ball-window sanity render (`15s -> 18s`).
- 2026-04-10: [DONE] Explicitly descoped `text-effects` as a required validation target for this project because it is an older project with stale runtime assets; the shared-layer rollout will continue against `object-segmentation` and `effects-lab` instead.
- 2026-04-10: [DONE] Renamed the active `c0046` project to the descriptive `object-segmentation` slug in code, artifacts, storyboard/worklog paths, and registry wiring. Also converted the remaining S06–S09 direct `CodexCallout` / `StatusLeftOverlay` beat stacks onto the shared `CalloutBeat` / `StatusBeat` helpers.
- 2026-04-10: [DONE] Added `src/projects/effects-lab/` as the dedicated shared-block preview surface and validated it with a local render (`EffectsLab`, `0s -> 8s`).
- 2026-04-10: [DONE] Revalidated the renamed `ObjectSegmentation` composition with local renders across the early compositing window (`68s -> 90s`) and the later shared-beat window (`150s -> 206s`).
- 2026-04-10: [DONE] Added the shared phrase-to-frame setup helper in `src/lib/findPhraseFrames.js` plus `scripts/find_phrase_frames.mjs`, and documented both the helper and the extraction criteria in the `creating-video` refs.
- 2026-04-10: [DONE] Finalized Milestone 4, recorded the closeout validation evidence, and marked the effect-library project ready for archive with `EffectsLab` as the dedicated shared-block preview surface.
