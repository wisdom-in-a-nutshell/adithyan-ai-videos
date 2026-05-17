# Media Storage Split

## Goal

Design a safe storage model for large local video/media assets so the repo stays usable on the internal disk while heavy project data can live on external storage when appropriate.

## Why / Impact

The built-in disk on this machine is only 256 GB, so active creative repos can gradually crowd out the rest of the system if every import, render, review export, and experiment stays local forever. The goal is to keep the internal disk clean and trim without making active video work painful.

This repo is an active AI video workspace, so large files are often useful working material rather than disposable junk. The intended direction is a hot/cold storage split: keep the active working set local, and move cold or archival media to external storage such as `/Volumes/DobbyData`. A blind cleanup would be the wrong model because old media may be creative source material, render evidence, or review context.

## Scope / Non-Goals

### In Scope

- Audit how large media is currently organized.
- Decide which classes of files should stay local, move to `/Volumes/DobbyData`, or be recreated/uploaded.
- Decide whether the repo should use symlinks, an environment variable such as `AI_VIDEOS_MEDIA_ROOT`, or a small manifest-driven media contract.
- Document recovery behavior when `/Volumes/DobbyData` is unavailable.
- Update repo docs and scripts only after the storage model is chosen.

### Out of Scope

- Moving media immediately.
- Deleting project media as cleanup.
- Symlinking the whole repository.
- Rewriting active video projects only to satisfy storage layout.
- Committing generated videos or other large binary assets to Git.

## Context / Constraints

- Date started: 2026-05-17
- Current repo size is roughly `4.8G`.
- Largest observed folders:
  - `public/`: roughly `3.1G`
  - `node_modules/`: roughly `858M`
  - `projects/`: roughly `749M`
  - `.git/`: roughly `149M`
- `public/` is already ignored by Git and is the largest candidate for an external-media boundary.
- `node_modules/` is rebuildable and should remain under the existing machine-level repo artifact cleanup policy, not this project.
- Current `.gitignore` already ignores broad local media patterns such as `public/`, `*.mp4`, and `*.webm`.
- Some project media appears to be real working material, including originals, review renders, Seedance/Kling renders, masks, mattes, and other artifacts.
- A prior machine cleanup discussion concluded that this repo should not be treated as generic cache cleanup because AI video work can need old render/reference material.
- The broader machine constraint is that the local built-in disk is small for media-heavy work. The repo should eventually make it clear which data is "hot" local working data and which data is "cold" external/archive data.
- The Codex archived-session split is a useful precedent, but this repo is more performance-sensitive because active video workflows read and write large files.
- The likely model is hot/cold media:
  - keep code, scripts, docs, manifests, prompts, shot lists, and active lightweight metadata local
  - move cold or heavy media to `/Volumes/DobbyData`
  - keep paths stable through a repo-owned contract rather than ad hoc manual links

## Done When

- [ ] The repo has a documented media storage contract that explains local vs external media.
- [ ] The contract names the canonical external storage path under `/Volumes/DobbyData`.
- [ ] The chosen approach covers missing-disk behavior.
- [ ] Any moved paths are either symlinked safely or resolved through a documented environment variable.
- [ ] Active project workflows still run with clear errors when required media is unavailable.
- [ ] Validation commands pass after any script or layout changes.

## Milestones

- [ ] Milestone 1 — Audit current media layout and classify folders as hot, cold, generated, source, or cache. Acceptance: a concise folder classification exists. Validate: compare `du` output with Git ignore state.
- [ ] Milestone 2 — Choose the storage contract. Acceptance: one of symlink-first, env-var-first, or manifest-first is selected with tradeoffs recorded. Validate: review against current Remotion render/studio commands.
- [ ] Milestone 3 — Pilot one low-risk path. Acceptance: one large ignored path is moved or linked in a reversible way. Validate: `npm run doctor` and a small local preview/render path still work.
- [ ] Milestone 4 — Document and automate the final pattern. Acceptance: repo docs explain setup, recovery, and validation. Validate: `npm run check:fast`.

## Execution Rules

- Do not move or delete media until the classification and storage contract are written down.
- Prefer reversible changes for the first pilot.
- Keep the source repo on the internal disk; only move heavy ignored media or cold project assets.
- Treat active project media as hot until proven otherwise.
- Do not broaden generic cleanup scripts to delete project media.
- If using symlinks, document the exact target and failure mode when `/Volumes/DobbyData` is not mounted.
- Update this tracker before ending each future work session.

## Decisions

- Keep this as a project tracker rather than immediate implementation because the tradeoff is not just disk usage; it affects active creative workflows and render performance.
- Do not symlink the whole repo. The repo should stay a normal Git workspace on the internal disk.
- Do not use the existing `node_modules` cleanup policy as the model for media. Dependencies are rebuildable; project media may not be.

## Open Questions / Blockers

- Which projects are actively edited often enough that their media should stay local?
- Should `public/` remain the main runtime media mount, or should new work use a clearer `media/` or env-var based root?
- Should final exports and review renders move automatically after a project is completed?
- How should cloud-render assets interact with local external storage?
- What should happen on laptops or machines where `/Volumes/DobbyData` is unavailable?

## Current Batch

| Status | Work Item | Role | Resource |
| --- | --- | --- | --- |
| done | Capture context and constraints without moving files | parent | `docs/projects/media-storage-split/tasks.md` |
| todo | Audit media folders and classify hot/cold/generated/source/cache | parent |  |

## Backlog / Remaining Work

- [ ] Produce a folder classification table for `public/` and `projects/*`.
- [ ] Identify active projects that should stay fully local for now.
- [ ] Decide whether `public/` should be moved first or whether a new media root should be introduced.
- [ ] Define canonical external path under `/Volumes/DobbyData`.
- [ ] Decide symlink vs env var vs manifest-based resolution.
- [ ] Add a setup/check command if the final model needs symlinks or mounted external storage.
- [ ] Update `docs/references/repo-operations.md` after the storage model is chosen.
- [ ] Validate the final implementation with `npm run check:fast` and at least one small render/studio workflow if runtime paths changed.
- [ ] Close out and archive this tracker once the storage split is implemented and documented.

## Validation / Test Plan

- Context-only edits: inspect docs for clarity and run the repo fast check if practical.
- Implementation edits later:
  - `npm run check:fast`
  - `npm run doctor`
  - a short local preview/render for at least one project that uses moved media
  - manual missing-disk check if symlinks or external paths become required

## Progress Log

- 2026-05-17: [DONE] Captured initial context for a future media storage split. No media moved, deleted, or symlinked.
- 2026-05-17: [DONE] Added generic machine-storage framing: small built-in disk, local hot working set, external cold media.
