# C0040

## Goal
Bring `C0040.MP4` into the repo as a usable Remotion project and turn it into an editable video composition.

## Why / Impact
The clip is the correct latest source file for the next video. If the repo does not have a clean baseline project around it, every later edit pass starts with avoidable setup work and cold-start confusion.

## Scope / Non-Goals
### In Scope
- Import the correct source clip into local runtime storage.
- Scaffold and wire a `c0040` project into the Remotion registry.
- Keep a durable tracker for the upcoming edit work.

### Out of Scope
- Transcript extraction.
- Beat-by-beat editorial decisions.
- Final overlays, captions, or effects.

## Context / Constraints
- Date started: 2026-04-06
- Source clip selected by the user: `/Users/dobby/Desktop/C0040.MP4`
- Imported runtime source path: `public/imports/c0040/source.mp4`
- Source metadata from `ffprobe`: 3840x2160, 25 fps, 178.56s, ~1.23 GB
- `public/` and `*.mp4` are gitignored in this repo, so local media can be used without pushing binaries.
- The active project is `src/projects/c0040/` with notes in `projects/c0040/`.

## Done When
- [ ] `C0040` is selectable in Studio and renders the imported source clip.
- [ ] The project notes/tracker capture the source file and the next editing step.
- [ ] We have reviewed the footage enough to replace the placeholder storyboard with real edit beats.

## Milestones
- [ ] Milestone 1 — Baseline source import and project wiring. Acceptance: `C0040` is registered, points at the imported clip, and repo checks pass. Validate: `npm run doctor` and `npx remotion compositions src/index.js`.
- [ ] Milestone 2 — First editorial pass. Acceptance: storyboard beats reflect the actual footage and the composition begins to diverge from raw source playback. Validate: `npm run render -- --comp C0040 --from <start> --to <end>`.

## Execution Rules
- Keep work scoped to the current milestone unless the tracker explicitly expands scope.
- Run validation after each milestone or risky batch and fix failures before advancing.
- Continue working until the scoped project is done or a true blocker requires human input; do not stop after one completed task if more actionable work remains.
- When `Done When` is satisfied and validation is acceptable, archive the project directly; ask only if completion is materially uncertain.
- Unless repo guidance says otherwise, archiving means moving the tracker to `docs/projects/archive/<project>/tasks.md`; create the archive folders if missing.
- Update this tracker whenever the plan changes materially or before ending the run.
- If project-critical ambiguity would stall progress later, ask targeted follow-up questions now and record the answers here.
- Use `Current Batch` as the live execution board and primary resume point.

## Decisions
- Use `c0040` as the project id so the repo matches the source clip name.
- Keep the large source clip in `public/imports/c0040/source.mp4` because that path is local-runtime-only and ignored by git.
- Start with a raw source playback composition so the next edit pass can happen in Studio immediately.

## Open Questions / Blockers
- What is the intended story or output cut for this clip?
- Do we want to keep the full 178.56s source as the composition duration, or should the first edit pass shorten it immediately?

## Current Batch
| Status | Work Item | Role | Resource |
| --- | --- | --- | --- |
| in_progress | Finish baseline wiring for `C0040` and verify the composition loads correctly. | parent |  |
| todo | Review the source clip and replace the placeholder storyboard with real beats. | parent |  |

## Backlog / Remaining Work
- [ ] Run repo validation for the new project wiring.
- [ ] Review the footage and capture concrete story beats in `projects/c0040/storyboard.md`.
- [ ] Decide the target output duration and structure.
- [ ] Implement the first real editorial/overlay pass.
- [ ] Render a short `C0040` slice for review.
- [ ] Close out and archive this tracker when the scoped edit work is done.

## Validation / Test Plan
- `npm run doctor`
- `npx remotion compositions src/index.js`
- `npm run render -- --comp C0040 --from 0 --to 6 --no-open`

## Progress Log
- 2026-04-06: [IN-PROGRESS] Created `c0040` project tracker and imported the correct source clip into local runtime storage.
