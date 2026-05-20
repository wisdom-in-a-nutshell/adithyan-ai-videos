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
- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-03-10s-ramp-audio.mp4`
- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-04-12s-ramp-audio.mp4`
- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-04-12s-ramp-audio-final-frame.jpg`
- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-05-12s-end-zoom.mp4`
- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-05-12s-end-zoom-final-frame.jpg`
- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-06-12s-end-zoom-door-margin.mp4`
- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-06-12s-end-zoom-door-margin-final-frame.jpg`
- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-07-12s-tap-punch-zoom.mp4`
- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-07-12s-tap-punch-zoom-final-frame.jpg`
- `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-08-tap-flash-seed.mp4`
- `projects/paper-portal/drafts/paper-portal-option-a-final-seed-imagegen-clean-v01.png`
- `projects/paper-portal/drafts/paper-portal-option-a-final-seed-imagegen-clean-v01-16x9.png`

`paper-portal-speedup-wide-draft-04-12s-ramp-audio.mp4` is the current base
review pass. It compresses the 96.5s drawing clip into about 12.67s, starts
with about 2.6s at natural speed, ramps through multiple faster speed bands,
eases back toward natural speed near the end, keeps the frame stable, and
includes matching speed-ramped source audio. Keep this file untouched as the
liked timing baseline.

Zoom options:

- Draft 05 uses the confirmed tight boundary: character on the left, door close
  to the right edge. It starts zooming too early and is superseded.
- Draft 06 gives the door slightly more breathing room on the right. It is a
  safer transition crop, but includes more paper edge/desk texture at the left.
- Draft 07 is the current zoom direction. It preserves the wide 12s timing until
  after the hand/tap gesture, then does a short punch-in to the confirmed Option
  A crop without the earlier drifting/in-out camera feel.
- Draft 08 is the current preferred transition direction. It avoids a visible
  crop pan entirely: the 12s wide video plays through the hand/tap gesture, then
  a quick paper-white flash/fade transitions into the Option A seed image and
  holds it for the AI handoff.

Clean seed image:

- `paper-portal-option-a-final-seed-imagegen-clean-v01.png` is an ImageGen edit
  of the Option A seed. It is cleaner but not a literal pixel-perfect upscale.
- `paper-portal-option-a-final-seed-imagegen-clean-v01-16x9.png` is the 1920x1080
  video-ready derivative made from that ImageGen output.

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
