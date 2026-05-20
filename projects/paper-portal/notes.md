# Paper Portal Notes

## Purpose

This is an early sketch space for the paper-to-animation video idea. Do not over-specify yet. The current job is to preserve the concept and give future work a clean landing place.

## Reference intake

The Desktop reference clips have been sampled and summarized in
`projects/paper-portal/reference/analysis.md`. Durable stills live beside that
file so future work can resume without re-processing the source videos.

## Source and draft media

The Desktop originals are treated as read-only source captures. Current working
copy:

- original inspected file: `/Users/dobby/Desktop/Trimmed.mov`
- project-local media import:
  `public/imports/paper-portal/source/trimmed-drawing-source.mov`

`public/imports` is backed by the repo media-storage symlink, so this large
1.3GB file lives outside the Git repo while still using a repo-facing path.

Current first-half files:

- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-04-12s-ramp-audio.mp4`
- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-04-12s-ramp-audio-contact.jpg`
- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-04-12s-ramp-audio-final-frame.jpg`
- `projects/paper-portal/drafts/paper-portal-first-half-v01-clean-seed-handoff.mp4`
- `projects/paper-portal/drafts/paper-portal-first-half-v01-clean-seed-handoff-contact.jpg`
- `projects/paper-portal/drafts/paper-portal-first-half-v01-transition-frames.jpg`
- `projects/paper-portal/drafts/paper-portal-option-a-final-seed-hq.png`
- `projects/paper-portal/drafts/paper-portal-option-a-final-seed-imagegen-clean-v01.png`
- `projects/paper-portal/drafts/paper-portal-option-a-final-seed-imagegen-clean-v01-16x9.png`
- `projects/paper-portal/drafts/imagegen-worklog.md`

Older draft attempts were moved to:

- `projects/paper-portal/drafts/archive-2026-05-20/`

`paper-portal-speedup-wide-draft-04-12s-ramp-audio.mp4` is the current base
review pass. It compresses the 96.5s drawing clip into about 12.67s, starts
with about 2.6s at natural speed, ramps through multiple faster speed bands,
eases back toward natural speed near the end, keeps the frame stable, and
includes matching speed-ramped source audio. Keep this file untouched as the
liked timing baseline.

- `paper-portal-first-half-v01-clean-seed-handoff.mp4` is the current finished
  first-half handoff. It uses the liked 12s base, waits through the tap, applies
  a short blur/white flash, fades into the cleaned ImageGen seed, and holds for
  the next Omni/AI animation segment.

Clean seed image:

- `paper-portal-option-a-final-seed-imagegen-clean-v01.png` is an ImageGen edit
  of the Option A seed. It is cleaner but not a literal pixel-perfect upscale.
- `paper-portal-option-a-final-seed-imagegen-clean-v01-16x9.png` is the 1920x1080
  video-ready derivative made from that ImageGen output.

The discarded zoom attempts are archived for reference only. Do not treat them
as the current direction.

## Concept

Film a top-down drawing session: a stick figure and door on paper. Then transition from the real paper drawing into an animated SVG scene. The character walks through the door and the world becomes colorful/polished on the other side.

## Current bias

Keep the project open-ended until the exact drawing idea is chosen. The known
shape is: capture the real drawing process, take the finished drawing as the
AI animation seed, then decide whether the animated continuation should be
AI-first, Remotion-first, or a hybrid.

## Possible technical direction

- Remotion composition for video timing/export.
- SVG groups for animatable parts.
- Rigged puppet movement for the stick figure.
- Optional sprite-like jitter later for hand-drawn charm.
- Optional AI image-to-video pass using the final sketch frame once the drawing
  concept is locked.
