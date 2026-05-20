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

Current hook drafts:

- `projects/paper-portal/drafts/paper-portal-hook-draft-01.mp4`
- `projects/paper-portal/drafts/paper-portal-hook-draft-02.mp4`
- `projects/paper-portal/drafts/paper-portal-hook-draft-02-final-frame.jpg`
- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-01.mp4`
- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-01-final-frame.jpg`
- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-02-10s-ramp.mp4`
- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-02-10s-ramp-final-frame.jpg`

`paper-portal-speedup-wide-draft-02-10s-ramp.mp4` is the current base review
pass. It compresses the 96.5s drawing clip into about 10.07s, starts with about
2s at natural speed, ramps through multiple faster speed bands, eases back
toward natural speed near the end, and keeps the frame stable. Add the
snap/punch-in zoom as a separate next pass after this timing feels right.

`paper-portal-hook-draft-02.mp4` is the earlier Ken Burns exploration with a
slow zoom and temporal blending. Keep it for comparison, but do not treat it as
the current direction.

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
