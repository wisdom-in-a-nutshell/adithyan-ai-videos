# Paper Portal Tasks

## Status

Project home is set up. Reference intake is captured. Creative direction is now
centered on a fast live drawing hook followed by short Flow / Veo / Omni-style
AI animation segments chained through doors.

## Resume point

Continue from the accepted first Flow animation endpoint:
`projects/paper-portal/flow-storyboard-frames/3.png`.

Next prototype: open the closed pencil door into a bright blank portal while the
stick figure stays outside. Do not enter the new world in the same clip.

## Reference files

- `projects/paper-portal/reference/analysis.md`
- `projects/paper-portal/reference/trend-contact-sheet.jpg`
- `projects/paper-portal/reference/drawing-start-frame.jpg`
- `projects/paper-portal/reference/final-sketch-crop.jpg`
- `projects/paper-portal/omni-storyboard.md`

## Media layout

- Desktop original, read-only:
  `/Users/dobby/Desktop/Trimmed.mov`
- Project-local working import:
  `public/imports/paper-portal/source/trimmed-drawing-source.mov`
- Current review draft:
  `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-04-12s-ramp-audio.mp4`
- Current first-half output:
  `projects/paper-portal/drafts/paper-portal-first-half-v01-clean-seed-handoff.mp4`
- Current combined hook + first Flow clip:
  `projects/paper-portal/drafts/paper-portal-first-half-plus-flow-walk-trim5-v01.mp4`
- Accepted first Flow segment:
  `projects/paper-portal/drafts/flow-stick-figure-walks-to-door-trim-5s-v01.mp4`
- Current next seed frame:
  `projects/paper-portal/flow-storyboard-frames/3.png`
- Clean ImageGen seed:
  `projects/paper-portal/drafts/paper-portal-option-a-final-seed-imagegen-clean-v01-16x9.png`
- Current final seed frame:
  `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-04-12s-ramp-audio-final-frame.jpg`
- Archived older draft attempts:
  `projects/paper-portal/drafts/archive-2026-05-20/`

## Next steps

- [ ] Generate Clip 02 from `flow-storyboard-frames/3.png`: handle turns, door
  opens slightly, bright blank portal appears, figure reacts but does not enter.
- [ ] Save the strongest Clip 02 output and extract its final frame as the Clip
  03 seed.
- [ ] Generate Clip 03: figure enters the bright doorway and lands in the first
  new world.
- [ ] Choose the first world style and write its continuity rules.

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
- [x] Archive older intermediate draft attempts while preserving active outputs.
- [x] Draft Omni storyboard and shot-by-shot build plan.
- [x] Upload clean seed and test first generated animation.
- [x] Trim the accepted Flow clip to the clean first 5 seconds before the model
  starts opening or distorting the door.
- [x] Append the accepted 5s Flow segment to the finished first-half handoff
  video for review.
- [x] Extract the accepted first animation final frame as
  `flow-storyboard-frames/3.png`.

## Working Assumptions

- The drawing hook should be short and sped up, not a long real-time drawing
  segment.
- Each door crossing is a useful reset point for model consistency.
- Short independent generations stitched together may be more reliable than one
  long generation.
- Keep the character simple so style changes are readable instead of becoming a
  continuity problem.
