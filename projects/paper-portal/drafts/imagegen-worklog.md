# ImageGen Worklog

## Self-review - Version 1

Prompt used:
- Edit the Option A final seed as a clean AI animation seed frame. Preserve the
  same composition, stick figure on the left, ground line, door on the right,
  plain paper background, and minimal pencil drawing style. Clean noise and
  compression artifacts. Do not add objects, color, text, hands, desk, ruler, or
  watermark.

Output path:
- `projects/paper-portal/drafts/paper-portal-option-a-final-seed-imagegen-clean-v01.png`
- `projects/paper-portal/drafts/paper-portal-option-a-final-seed-imagegen-clean-v01-16x9.png`

What worked:
- The result is much cleaner than the cropped video frame.
- Pencil lines are more readable.
- Paper background is clean and simple.
- The stick figure, ground line, and door are preserved as the same story setup.

What feels off:
- The model returned a 1536x1024 image rather than native 16:9, so a 16:9
  derivative was made by deterministic crop/resize.
- The result is a recreation, not a literal upscale. The stick figure and door
  are slightly redrawn.

What should improve next:
- If exact fidelity matters, use deterministic super-resolution/denoise from the
  source frame instead of a model redraw.
- If animation seed clarity matters more, use the 16:9 ImageGen recreation as
  the cleaner handoff frame.
