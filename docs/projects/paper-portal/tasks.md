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

Current control-frame experiment: use the vector-derived keyframes under
`projects/paper-portal/flow-storyboard-frames/5A.png` and `5B.png` when a stable
plate or re-baselined hand-on-handle pose is more useful than model-generated
stills.

Upload-ready three-frame set:
`projects/paper-portal/keyframe-upload-set-01/`.

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
- Current vector control frames:
  `projects/paper-portal/flow-storyboard-frames/5A.png` and
  `projects/paper-portal/flow-storyboard-frames/5B.png`
- Current Seedance/Kling i2v comparison renders:
  `projects/paper-portal/seedance/renders/seedance-walk-to-handle-v01.mp4` and
  `projects/paper-portal/seedance/renders/kling-o3-walk-to-handle-v01.mp4`
- Current regular Seedance 1080p comparison render:
  `projects/paper-portal/seedance/renders/seedance-regular-walk-to-handle-v02.mp4`
- Liked walk-to-handle keeper:
  `projects/paper-portal/seedance/renders/seedance-regular-walk-to-handle-v02.mp4`
- Current transition canary:
  `projects/paper-portal/seedance/renders/seedance-fast-door-transition-variant3-v01.mp4`
- Current full transition render:
  `projects/paper-portal/seedance/renders/seedance-regular-door-transition-variant3-v02-surprise.mp4`
- Current stitched AI-only review:
  `projects/paper-portal/drafts/paper-portal-seedance-walk-plus-transition-v01.mp4`
- Current stitched full review:
  `projects/paper-portal/drafts/paper-portal-first-half-plus-seedance-walk-transition-v01.mp4`
- Current cleaned AI-only review:
  `projects/paper-portal/drafts/paper-portal-seedance-walk-plus-transition-clean-v02.mp4`
- Current cleaned full review:
  `projects/paper-portal/drafts/paper-portal-full-clean-transition-v02.mp4`
- Current selected transition end frame:
  `projects/paper-portal/transition-keyframes/selected/door-pushed-in-glow-variant-3-selected.png`
- Clean ImageGen seed:
  `projects/paper-portal/drafts/paper-portal-option-a-final-seed-imagegen-clean-v01-16x9.png`
- Current final seed frame:
  `projects/paper-portal/drafts/paper-portal-speedup-wide-draft-04-12s-ramp-audio-final-frame.jpg`
- Archived older draft attempts:
  `projects/paper-portal/drafts/archive-2026-05-20/`

## Next steps

- [ ] Generate Clip 02 from `flow-storyboard-frames/3.png`: handle turns, door
  opens slightly, bright blank portal appears, figure reacts but does not enter.
- [ ] Test whether the vector control frames give more reliable keyframe
  interpolation than the model-generated door-opening stills.
- [ ] Review Seedance fast vs Kling O3 standard i2v canaries and pick the better
  base for the walk-to-handle beat.
- [ ] Review regular Seedance 1080p canary for whether slower walk prompting
  fixes the fast Seedance articulation issue.
- [ ] Extract the final frame from the liked regular Seedance walk-to-handle
  keeper as the start frame for the door-opening beat.
- [ ] Review the Variant 3 Seedance fast transition canary for whether the
  figure disappears cleanly through the glowing pushed-in door.
- [ ] Review the regular 1080p Variant 3 transition render with the small
  surprise reaction before the figure enters the glow.
- [ ] Review the stitched AI-only sequence for the cut between walk-to-handle
  and door-transition.
- [ ] Review the stitched full sequence from sketch hook through door transition.
- [ ] Review cleaned v02 sequence: hook cut at the white flash, 0.25s blend
  between walk and transition, and portal clip trimmed when the figure has
  disappeared.
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
- [x] Rebuild Quiver-derived vector keyframes with a full 16:9 paper background
  and the figure feet aligned to the ground line.
- [x] Stitch the liked Seedance walk-to-handle clip with the liked door
  transition for review.
- [x] Stitch the first-half sketch handoff with the two liked Seedance clips for
  full-sequence review.
- [x] Remove the dead still-image hold after the hook flash, blend the two
  Seedance clips, and trim the portal ending to the disappearance moment.

## Working Assumptions

- The drawing hook should be short and sped up, not a long real-time drawing
  segment.
- Each door crossing is a useful reset point for model consistency.
- Short independent generations stitched together may be more reliable than one
  long generation.
- Keep the character simple so style changes are readable instead of becoming a
  continuity problem.
