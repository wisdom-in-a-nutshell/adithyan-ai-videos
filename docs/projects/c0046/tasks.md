# C0046

## Goal
Bring `C0046-hevc-1080p.mp4` into the repo as the active Remotion project and establish a clean baseline for the next edit pass.

## Why / Impact
The user wants to switch focus from `C0040` to a new source clip. A clean baseline project avoids carrying old editorial assumptions into the next video.

## Scope / Non-Goals
### In Scope
- Scaffold and wire a `c0046` project into the Remotion registry.
- Point the project at the provided remote source video.
- Capture basic source metadata and a durable tracker for next steps.

### Out of Scope
- Transcript generation.
- Storyboard authoring beyond a placeholder baseline.
- Final overlays, captions, or effects.

## Context / Constraints
- Date started: 2026-04-08
- Source clip selected by the user: `https://storage.aipodcast.ing/share/agent-media-toolkit/by-hash/3ee14ffc517bae7b3783738a670081c611c143205fe6fdda8a6d5bf6b6d725ef/C0046-hevc-1080p.mp4`
- Source metadata from `ffprobe`: 1920x1080, 25 fps, 627.36s
- `C0046` should be the active composition in Studio.
- Older projects should stay in code but not be the active focus.

## Done When
- [x] `C0046` is scaffolded and registered.
- [x] `C0046` points at the provided remote source clip.
- [x] `C0046` is the enabled active composition in the registry.
- [ ] We have reviewed or transcribed the footage enough to define the first real edit beats.

## Current Batch
| Status | Work Item | Role | Resource |
| --- | --- | --- | --- |
| done | Scaffold `c0046` and wire the source clip into the composition. | parent |  |
| todo | Review/transcribe the clip and replace the placeholder storyboard. | parent |  |

## Validation / Test Plan
- `npm run doctor`
- `npm run render -- --comp C0046 --from 0 --to 6 --no-open`

## Progress Log
- 2026-04-08: [DONE] Scaffolded `c0046`, switched the active registry entry to `C0046`, and pointed the composition at the provided remote source URL.
