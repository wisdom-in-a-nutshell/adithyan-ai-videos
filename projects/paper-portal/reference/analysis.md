# Reference Analysis

## Source

- `/Users/dobby/Desktop/Trimmed.mov`
- `/Users/dobby/Desktop/Final_Video.mov`

`Trimmed.mov` appears to be the relevant reference cut. It is a 96.5 second
1920x1080 overhead desk recording at roughly 24fps.

## Captured Frames

- `trend-contact-sheet.jpg`: sampled overview of the drawing process.
- `drawing-start-frame.jpg`: early ruler/paper setup.
- `final-sketch-crop.jpg`: finished sketch crop used to understand the planned
  AI animation seed.

## Read Of The Trend

The format starts as a real overhead drawing video: paper centered on a dark
desk, hand/ruler/pencil visible, and simple line art being built in camera.
The final drawing is the key handoff point. After the drawing is complete, the
sketch should become animated while retaining the handmade paper feel.

For the current reference sketch, the likely animation beat is:

1. A stick figure stands or walks on the drawn ground line.
2. The figure approaches the drawn door.
3. The door opens, glows, or reveals another world.
4. The scene transitions from rough pencil sketch into a more alive animated
   world.

## Current Creative Contract

Do not lock the final story yet. Preserve this project as the working home for
the broader idea:

- film/draw first
- use the final drawing as the AI animation seed
- decide later whether the continuation is pure AI video, Remotion-controlled
  animation, or a hybrid

## Omni Flash Direction

The target model direction is Gemini Omni Flash / Gemini Omni, accessed through
Gemini or Google Flow unless an API becomes available later. Google describes
Omni as a video-first model that can take text, images, audio, and video inputs,
edit through natural conversation, and combine references into a single
coherent output.

This matters for the concept because the trend is not only "make my sketch
move." The more interesting version is:

1. Start with a fast live drawing hook.
2. Hold on the finished sketch as the transition point.
3. Use the finished sketch frame as the seed/reference.
4. Generate a short animated continuation where the sketched character runs.
5. End each generated beat on another door or portal.
6. Use the next door crossing to change the style: pencil sketch, ink comic,
   clay/stop-motion, 3D toy, pixel art, cinematic, etc.
7. Stitch those independent generated clips into one continuous chase.

Known risk: Google notes that complete consistency through edits and complex
motion can still be hard. For this idea, that means we should keep the character
simple, use doors as intentional reset points, and generate in short segments
instead of relying on one long continuous model output.
