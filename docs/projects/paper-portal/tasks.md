# Paper Portal Tasks

## Status

Project home is set up. Reference intake is captured. Creative direction is now
centered on a fast live drawing hook followed by Gemini Omni Flash / Gemini Omni
style-changing AI animation segments.

## Resume point

When ready, choose the exact drawing/story beat, then run the smallest
prototype that tests the handoff: real drawing process -> finished sketch frame
-> Omni Flash animated continuation -> door transition into a new style.

## Reference files

- `projects/paper-portal/reference/analysis.md`
- `projects/paper-portal/reference/trend-contact-sheet.jpg`
- `projects/paper-portal/reference/drawing-start-frame.jpg`
- `projects/paper-portal/reference/final-sketch-crop.jpg`

## Media layout

- Desktop original, read-only:
  `/Users/dobby/Desktop/Trimmed.mov`
- Project-local working import:
  `public/imports/paper-portal/source/trimmed-drawing-source.mov`
- Current review draft:
  `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-04-12s-ramp-audio.mp4`
- Zoom option A:
  `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-05-12s-end-zoom.mp4`
- Zoom option B:
  `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-06-12s-end-zoom-door-margin.mp4`
- Current zoom pass:
  `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-07-12s-tap-punch-zoom.mp4`
- Current transition pass:
  `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-08-tap-flash-seed.mp4`
- Current first-half output:
  `projects/paper-portal/drafts/paper-portal-first-half-v01-clean-seed-handoff.mp4`
- Clean ImageGen seed:
  `projects/paper-portal/drafts/paper-portal-option-a-final-seed-imagegen-clean-v01-16x9.png`
- Current final seed frame:
  `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-04-12s-ramp-audio-final-frame.jpg`

## Next steps

- [ ] Decide the exact drawing and story beat.
- [ ] Record or select the real drawing source.
- [ ] Extract a clean final drawing frame for AI animation.
- [ ] Run one Omni Flash image/video-to-video test from the final drawing frame.
- [ ] Make the generated beat end on a second door/portal.
- [ ] Test one style-change continuation segment from that door/portal frame.
- [ ] Decide whether to continue Omni-first, Remotion-first, or hybrid.
- [ ] Render a short preview and judge whether the format has magic.

## Completed

- [x] Identify the Desktop reference videos.
- [x] Sample reference frames and preserve durable stills.
- [x] Confirm `paper-portal` as the canonical project home.
- [x] Clarify the intended direction: fast drawing hook, then chained
  style-changing Omni Flash animation.
- [x] Import the current drawing source into project-local media storage without
  modifying the Desktop original.
- [x] Produce first hook draft with speed ramp, slow zoom, and final seed frame.
- [x] Produce simplified wide speed-up base draft without zoom/punch for timing
  review.
- [x] Produce 10s wide speed-up draft with longer normal opening and gradual
  speed ramp.
- [x] Restore matching source audio to the 10s ramp draft.
- [x] Produce 12s wide speed-up draft with audio and smoother pacing.
- [x] Preserve the liked 12s draft and create end-zoom options from it.
- [x] Fix zoom timing so punch-in happens after the hand/tap gesture and does
  not drift in/out.
- [x] Produce flash/fade transition into the Option A seed image to avoid the
  visible camera pan.
- [x] Generate a cleaner ImageGen recreation of the Option A final seed and make
  a 16:9 video-ready derivative.
- [x] Finish first-half handoff with blur/white flash into the cleaned seed
  image.

## Working Assumptions

- The drawing hook should be short and sped up, not a long real-time drawing
  segment.
- Each door crossing is a useful reset point for model consistency.
- Short independent generations stitched together may be more reliable than one
  long generation.
- Keep the character simple so style changes are readable instead of becoming a
  continuity problem.
