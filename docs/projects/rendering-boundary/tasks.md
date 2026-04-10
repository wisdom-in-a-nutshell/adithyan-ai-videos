# Rendering Boundary

## Goal
Define and implement a render workflow that keeps local editing fast, makes cloud renders reproducible, and removes agent confusion about which assets and commands are valid in each mode.

## Why / Impact
The current repository structure is broadly good, but the rendering boundary is not explicit enough. Local editing works because runtime assets can live in ignored local `public/` paths, while cloud render works by cloning a git SHA in a clean remote environment. Those two assumptions conflict. If we do not fix this cleanly, agents will keep making the same mistake: a composition renders locally, then fails in cloud because required media only exists on the current machine. The result is wasted render time, unclear failure modes, and growing workflow drift.

This matters because the repository is meant to be agent-first and repeatable. Rendering is the final delivery path for every video project. If the render contract is ambiguous, the repo will keep accumulating ad hoc fixes and explanations, and agents will need too much chat context to operate safely.

## Scope / Non-Goals
### In Scope
- Document the rendering problem clearly in repo-native durable memory.
- Define the long-term render workflow for local iteration versus cloud checkpoints.
- Define the runtime asset contract for cloud-safe versus local-only assets.
- Define the desired repo-local render client boundary and the commands it should expose.
- Identify the highest-leverage implementation steps that preserve the current repo layout.
- Make sure the proposed design remains compatible with the current Modal cloud render backend and possible future Azure-based execution.

### Out of Scope
- Replatforming cloud render to Azure right now.
- Rewriting the entire project layout or moving away from `src/projects/<id>/` and `projects/<id>/`.
- Implementing the full render client in this tracker entry.
- Solving all `ObjectSegmentation` creative/editing tasks.

## Context / Constraints
- Date started: 2026-04-09
- Repo guidance says active execution state belongs in `docs/projects/<project>/tasks.md`.
- The current repo uses:
  - local render wrapper: `scripts/render.mjs`
  - cloud render wrapper: `scripts/render_cloud.mjs`
  - Modal backend: `../modal_functions/src/functions/video/render_remotion_cloud/__init__.py`
- Current cloud render behavior is SHA-based:
  - it clones `wisdom-in-a-nutshell/adithyan-ai-videos`
  - fetches the requested git SHA
  - checks out the commit in a clean remote environment
  - runs the repo render command there
- Current local render behavior is local-first and succeeds even when runtime assets only exist on this machine.
- `.gitignore` currently ignores `public/`, `*.mp4`, and `*.webm`, which means many runtime assets are intentionally not committed.
- `src/projects/object-segmentation/assets.js` currently points at local `public/...` runtime assets such as:
  - `public/imports/object-segmentation/source.mp4`
  - `public/imports/object-segmentation/apple.svg`
  - `public/imports/object-segmentation/bg-studio-warm.png`
- A real cloud render test against committed `HEAD` failed because the cloned repo could not find `public/imports/object-segmentation/source.mp4`.
- A real local benchmark on the current Mac mini showed:
  - hardware: Apple M4 Mac mini, 10 CPU cores, 16 GB RAM
  - 10-second HQ render slices of `ObjectSegmentation` took about 110.5 seconds wall-clock
  - the major fixed cost is not pure frame render time; it is the repeated copy/merge of the `public/` tree
- `scripts/asset_cache.mjs` currently prepares a merged public dir and ends up copying about 4.6 GB of `public/` on each render for this project.
- There is already a shared uploader that provides content-hash-stable public URLs:
  - `../scripts/bin/upload-media`
  - `../scripts/media/upload_media.py`
  - `../scripts/docs/references/media-upload.md`
- The user wants to preserve the current repo layout and avoid “fucking up” the repository just to fix cloud render.

## Done When
- [ ] The tracker clearly explains the current rendering problem, why it happens, and why it is recurring.
- [ ] The tracker clearly records the recommended long-term solution in a form a new agent can resume cold.
- [ ] The tracker records the recommended split between local editing renders and cloud checkpoint/final renders.
- [ ] The tracker records a concrete proposed asset contract and render-client boundary.
- [ ] The tracker records the next implementation steps without requiring chat memory.

## Milestones
- [ ] Milestone 1 — Capture the rendering problem statement and evidence. Acceptance: tracker explains the current local/cloud contradiction with concrete file paths and observed failures. Validate: manual read-through of this tracker against the current repo.
- [ ] Milestone 2 — Define the target architecture. Acceptance: tracker specifies local-vs-cloud modes, runtime asset contract, and render-client responsibilities in plain English. Validate: proposed workflow can be followed by a cold agent without extra chat context.
- [ ] Milestone 3 — Define implementation order. Acceptance: tracker lists immediate, near-term, and later steps that preserve current repo structure while making cloud render viable. Validate: steps are actionable and ordered by leverage.

## Execution Rules
- Keep this tracker focused on the rendering boundary problem, not on unrelated creative edits.
- Preserve the current repo layout unless new evidence shows a deeper structural problem.
- Prefer mechanical guardrails and explicit contracts over more prose-only reminders.
- Treat current Modal cloud render as a valid backend implementation detail; do not assume a provider switch is the first fix.
- Record any non-obvious architectural recommendation here before implementation begins elsewhere.
- Update this tracker whenever the recommended design changes materially.
- When this project later moves into implementation, keep shared contract work sequential and avoid parallel edits against moving render/asset rules.

## Decisions
- The current repository layout is broadly sound; the highest-risk gap is the rendering and runtime asset boundary, not the overall project structure.
- Local render should remain the default editing loop.
- Cloud render should remain a checkpoint/final path, not the default editing path.
- The right long-term fix is not “switch providers first”; it is “make runtime assets cloud-safe and expose a single render contract.”
- The repository should eventually expose one repo-local render client that orchestrates local render, cloud preflight, asset promotion, and cloud submission/status.
- The current shared uploader in `~/GitHub/scripts` should be reused rather than replaced.
- For the active cloud-targeted project path, the simplest working contract is
  remote-first runtime media in `src/projects/<id>/assets.js`, with local files
  promoted via `upload-media` before they become composition inputs.
- For the current Modal backend worker shape, the tuned default is now
  `32 CPU / 64 GiB` with auto concurrency landing at `28`, because that is the
  current deployed setting. Benchmark evidence still shows `64 CPU / 64 GiB /
  28x` is faster when raw speed matters.

## Open Questions / Blockers
- What exact schema should `assets.js` use for dual local/remote runtime assets without making composition code noisy?
- Should the first implementation step be the render client contract or the local render startup optimization?
- Which runtime assets should remain committed local assets versus promoted remote assets for cloud-safe rendering?
- If Azure is adopted later, should it be a dedicated VM worker behind the same render client, or should Modal remain the only cloud backend for this repo?

## Current Batch
| Status | Work Item | Role | Resource |
| --- | --- | --- | --- |
| in_progress | Write the rendering-boundary project tracker with the current problem statement, evidence, and recommended solution. | parent | docs/projects/rendering-boundary/tasks.md |
| todo | Normalize the target asset contract into explicit local/cloud-safe rules and examples. | parent | docs/projects/rendering-boundary/tasks.md |
| todo | Turn the current recommendation into a short architecture/reference doc pair once the design is stable. | parent |  |

## Backlog / Remaining Work
- [ ] Define a runtime asset descriptor shape for cloud-relevant assets, for example `local`, `remote`, `requiredForCloud`, and `type`.
- [ ] Define the repo-local render client contract, including `preflight`, `local`, `promote-assets`, `cloud submit`, and `cloud status`.
- [ ] Document the difference between `local-scratch` and `cloud-checkpoint` render modes in repo docs.
- [ ] Add a cloud-safety preflight rule that fails fast when required remote assets are missing.
- [ ] Reuse `../scripts/bin/upload-media` as the shared asset promotion path instead of creating another uploader.
- [ ] Investigate and reduce the local render startup cost caused by copying the full `public/` tree in `scripts/asset_cache.mjs`.
- [ ] Decide which `ObjectSegmentation` runtime assets should be promoted to stable remote URLs first so the project can render in cloud.
- [ ] Add or update docs in `docs/architecture/` and `docs/references/` once the solution is agreed.
- [ ] Add a closeout learnings file under `docs/projects/rendering-boundary/learnings/README.md` before archive if implementation spans multiple sessions or cross-repo changes.
- [ ] Close out and archive this tracker once the render contract is documented and implementation is either complete or intentionally split into follow-on trackers.

## Validation / Test Plan
- Confirm the tracker matches current repo reality:
  - `scripts/render.mjs`
  - `scripts/render_cloud.mjs`
  - `src/projects/object-segmentation/assets.js`
  - `.gitignore`
  - `../modal_functions/src/functions/video/render_remotion_cloud/__init__.py`
  - `../scripts/bin/upload-media`
- Confirm the observed cloud failure is accurately represented:
  - current cloud render reaches the Remotion render step
  - cloud failure is caused by missing local-only runtime assets in the cloned repo snapshot
- Confirm the local-render benchmark summary is recorded accurately:
  - about 110.5 seconds for a 10-second HQ render slice of `ObjectSegmentation`
  - startup overhead dominated by `public/` copy/merge work

## Progress Log
- 2026-04-09: [IN-PROGRESS] Created rendering-boundary tracker to capture the current render/cloud contradiction, preserve the recommended solution, and stop this design work from living only in chat.
- 2026-04-09: [IN-PROGRESS] Recorded current evidence: local render succeeds, cloud render reaches Modal/Remotion and then fails because `public/imports/object-segmentation/source.mp4` is local-only and ignored from git.
- 2026-04-09: [IN-PROGRESS] Recorded the recommended direction: preserve current repo layout, keep local-first editing, add explicit local/cloud runtime asset descriptors, and eventually expose one repo-local render client boundary.
- 2026-04-09: [IN-PROGRESS] Replaced the `S05` local PNG frame sequence with a single uploaded transparent VP9 asset (`subject-keyed-s05-alpha.webm`) generated from those same keyed frames. Local `70s -> 90s` verification now passes against the cloud-safe asset path, removing the last known full-comp cloud blocker in `ObjectSegmentation`.
- 2026-04-09: [IN-PROGRESS] Added a doctor guardrail so an enabled project fails if `assets.js` still points at local media files instead of remote runtime URLs.
- 2026-04-09: [IN-PROGRESS] Added repo-local Remotion temp cleanup before Studio, render, and precommit compile runs so stale macOS temp bundles are pruned automatically instead of accumulating under `/var/folders/.../T`.
- 2026-04-09: [IN-PROGRESS] Raised the Modal cloud worker reservation from `64 CPU / 32 GiB` to `64 CPU / 64 GiB` and benchmarked a representative `ObjectSegmentation` slice (`72s -> 88s`) across explicit concurrency values.
- 2026-04-09: [IN-PROGRESS] Recorded benchmark results for the tuned worker: `16x=135.04s`, `20x=122.72s`, `24x=124.09s`, `28x=113.00s`, `32x=118.25s`; `28x` is the best observed default so far.
- 2026-04-09: [IN-PROGRESS] Confirmed the noisy “Detected differing memory amounts” warning comes from Remotion inside the cloud container and is not blocking renders; the benchmark jobs still completed successfully and uploaded outputs.
- 2026-04-09: [IN-PROGRESS] Ran a same-SHA CPU reservation check at `28x`: `32 CPU / 64 GiB` took about `106s`, while `64 CPU / 64 GiB` took about `97s`, so reducing CPU does hurt this project's end-to-end speed.
- 2026-04-09: [IN-PROGRESS] Switched the repo cloud wrapper away from `modal run -d` and onto the deployed `aip-processor.render_remotion_cloud` function path, matching the production invocation pattern already used in `../win`.
