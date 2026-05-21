# Paper Portal Omni Storyboard

## Working Principle

Build this as short Flow / Omni Flash clips, one after another. Each clip should
end on a frame that is useful as the next clip's seed. The door is the main
continuity device and the place where style changes can be hidden.

## Current First-Half Lead-In

- Source edit:
  `projects/paper-portal/drafts/paper-portal-first-half-v01-clean-seed-handoff.mp4`
- Clean seed frame:
  `projects/paper-portal/drafts/paper-portal-option-a-final-seed-imagegen-clean-v01-16x9.png`

The live drawing hook ends on the cleaned pencil-sketch world: stick figure on
the left, door on the right, ground line across the page.

## Clip 01 - Figure Walks To Door

Goal: prove that the sketch can come alive.

- Start frame: clean seed image.
- End frame target: figure is at the door, touching or holding the handle.
- Duration: 6s or 8s.
- Camera: locked/static.
- Style: simple pencil sketch, old cartoon / flipbook motion.
- Action: stick figure walks toward the door, reaches the handle.
- Avoid: color, new scenery, extra characters, realistic human anatomy, camera
  motion.

Prompt:

```text
Use the first image as the starting frame. Animate this clean pencil sketch as
one continuous locked-off shot. The stick figure takes simple readable
old-cartoon steps toward the door and reaches one hand to the handle. Preserve
the plain white paper background, pencil line art, simple stick-figure design,
ground line, and door placement. Keep the motion charming and minimal, like a
hand-drawn flipbook with subtle line boil. End with the stick figure standing at
the door, hand on the handle.

Avoid: extra characters, extra limbs, realistic human body, colored background,
text, clutter, camera movement
```

Best end-frame strategy:

- **Safer:** figure holding the door handle. This gives Flow a clear endpoint
  and makes the next clip easy.
- **Riskier:** figure fully enters the door in the same clip. This asks for too
  much in one generation and may drift.

## Clip 02 - Door Opens / Threshold

Goal: turn the door into the transition device.

- Start frame: best final frame from Clip 01, or a generated end frame where the
  figure is holding the handle.
- End frame target: door partly open, bright blank/portal interior visible.
- Duration: 4s or 6s.
- Camera: locked, or very slight push only if Flow handles it.
- Action: figure pulls door open and steps toward the opening.

Prompt:

```text
Continue from this pencil sketch frame. The stick figure pulls the door open
slowly, revealing a bright blank doorway. Keep the same simple pencil line art,
white paper background, and locked camera. The figure begins stepping through
the doorway but remains a simple stick figure. End with the door open and the
doorway filling the viewer's attention, ready for the next scene.

Avoid: extra characters, realistic body, colored scenery, text, clutter,
complex camera movement
```

## Clip 03 - Style Change Through Door

Goal: hide the first visual-style transformation inside the doorway.

- Start frame: door open from Clip 02.
- End frame target: a new version of the world in the next style.
- Duration: 4s or 6s.
- Camera: threshold crossing or hard cut/match cut.
- Style candidates: old cartoon, ink comic, claymation, pixel art, 3D toy.

Prompt shape:

```text
The camera/view passes through the open doorway. Inside the doorway, the pencil
sketch world transforms into [NEXT STYLE]. The transition is smooth and playful.
Keep the stick figure's silhouette recognizable and simple. End in the new
style with the figure still moving forward.
```

## Clip 04+ - Repeatable Door Chain

Repeat the unit:

1. Character runs/walks in current style.
2. Character finds another door.
3. Door opens.
4. Door hides the style/world change.
5. New style begins.

## Recommendation For Right Now

Use first+last frame control if Flow exposes it for the selected model. For
Clip 01, make the end frame **figure holding the door handle**, not fully
entered. It is the cleanest controllable endpoint.

If Flow cannot use an end frame for Omni Flash, run the Clip 01 prompt with only
the clean seed image and generate several canaries. Pick the one that best ends
near the door.
