# Paper Portal Workflow

## Current Inputs

Use these repo files for the first Omni/Flow experiment:

- First-half video:
  `projects/paper-portal/drafts/paper-portal-first-half-v01-clean-seed-handoff.mp4`
- Clean seed image:
  `projects/paper-portal/drafts/paper-portal-option-a-final-seed-imagegen-clean-v01-16x9.png`
- Original source copy:
  `public/imports/paper-portal/source/trimmed-drawing-source.mov`

## First Clip Goal

Generate only the first animated beat:

1. The clean pencil stick figure comes alive.
2. It walks toward the door.
3. It reaches the handle.
4. It opens the door slightly.
5. The final frame should be a good seed for the next clip.

Do not ask for the new world yet. Save that for the second clip.

## Recommended Flow Setup

- Model: Gemini Omni Flash
- Mode: Frames to Video, using the clean seed as the start frame.
- Duration: start with 6s or 8s canaries; use 10s only if the walk needs more
  breathing room.
- Aspect ratio: 16:9.
- Camera: locked/static.
- Variations: generate multiple outputs if credits allow.

If Flow exposes first+last-frame control for the selected model, test it after
one start-frame-only canary. The first canary tells whether Omni understands the
simple sketch and walk cycle. A custom end frame is useful only if the model
fails to land on a usable door-open frame.

## First Prompt Candidate

```text
Animate this clean pencil sketch as one continuous locked-off shot. The stick
figure takes simple readable old-cartoon steps toward the door, reaches one
hand to the handle, turns the handle, and pulls the door open slightly. Preserve
the plain white paper background, pencil line art, simple stick-figure design,
ground line, and door placement. Keep the motion charming and minimal, like a
hand-drawn flipbook with subtle line boil. End with the door slightly open so
the frame can continue into the next scene.

Avoid: extra characters, extra limbs, realistic human body, colored background,
text, clutter, camera movement
```

## If The Model Overdoes It

Try a stricter version:

```text
Keep the drawing exactly as a simple pencil sketch. Static camera. Only animate
the stick figure and the door. The stick figure walks slowly to the door,
touches the handle, and opens the door a small amount. Do not add scenery,
color, shadows, realistic body parts, or new objects.
```

## If The Motion Is Too Weak

Try a more directed version:

```text
Make the stick figure perform a clear four-step walk cycle toward the door. One
foot plants on each step, arms swing simply, then the right hand reaches the
door handle and pulls the door open. Keep the pencil sketch line style and
locked camera.
```
