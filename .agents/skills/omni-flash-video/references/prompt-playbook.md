# Prompt Playbook

## Atomic Clip Template

```text
Mode: [Frames to Video / Ingredients to Video / Video to Video editing]
Duration: [4s / 6s / 8s / 10s]
Aspect ratio: 16:9
References:
- @Start = ...
- @End = ...
- @Character = ...
- @Style = ...

Prompt:
[One continuous shot.] [Subject] [does one clear action]. [Camera behavior].
[Style/lighting/environment]. [End condition].

Avoid:
[short noun/quality list only]
```

## Reference Role Pattern

Assign every uploaded asset a job in the prompt:

```text
Use @Start as the first frame and primary composition.
Use @Character only to preserve the character silhouette.
Use @Style only for the visual texture and line quality.
```

Do not upload references without labels. Unlabeled references can become
accidental morph targets.

## Image-To-Video From A Sketch

Use motion-first prompting. The seed image already describes the layout.

```text
Animate this clean pencil sketch as one continuous locked-off shot. The stick
figure takes simple readable steps toward the door, reaches one hand to the
handle, turns the handle, and pulls the door open slightly. Preserve the plain
white paper background, pencil line art, simple stick-figure design, ground
line, and door placement. Keep the motion charming like an old hand-drawn
cartoon, with subtle line boil and no camera movement.

Avoid: extra characters, extra limbs, realistic human body, colored background,
text, clutter, camera movement
```

## Start + End Frame Variant

Use when an end-frame image exists, such as door partly open.

```text
Use @Start as the first frame and @End as the final frame. Animate a clean
transition between the two frames: the stick figure walks to the door, reaches
for the handle, and opens it. Keep the pencil sketch style, white paper
background, ground line, and simple character design consistent. Static camera,
full-body view, one continuous shot.

Avoid: extra characters, extra limbs, colored background, text, clutter
```

## Door / Portal Transition Unit

Split style changes into three clips:

1. **Approach**: subject approaches the doorway. End with the door/portal as the
   clear destination.
2. **Threshold**: the door opens or fills the frame. Hide discontinuity here.
3. **Arrival**: start in the new style/world after the threshold.

For the first Paper Portal clip, do not overload it with the new world. The
first clip should prove that the sketch can move and open the door.

## Iteration Prompts

Use narrow conversational edits when the result is close:

```text
Keep the same composition and pencil sketch style. Make the walking slower and
more readable. Do not add new characters or color.
```

```text
Keep everything else the same. The door should open only slightly at the end,
and the final frame should be usable as the next seed.
```

Use a fresh generation when the first frame, style, or character identity is
wrong.

## Review Checklist

- First frame matches the seed.
- Figure remains a simple stick figure.
- Walk has readable steps.
- Door handle interaction is visible.
- Camera stays locked unless prompted otherwise.
- Last frame is useful for the next segment.
- No extra characters, text, or colored scenery appeared.

