# AI Video Model Playbook

This playbook captures practical model behavior observed in repo video work.
Treat it as an operating reference, not a permanent benchmark. Update it when a
new project proves or disproves a rule.

## Cross-Model Principles

- Use the most constrained mode that can do the job.
- Prefer start/end frames when exact composition matters.
- Prefer one action per generated clip.
- Keep prompts short enough to be obeyed, but explicit about composition locks.
- Avoid exact brand or studio names when a descriptive style block is enough.
- Use canaries before high-quality generations.
- Validate outputs with frame grabs, not only playback.
- Record every useful result in the project clip ledger.

## Model Selection

| Need | First Try | Fallback |
|---|---|---|
| Simple stylized motion from stills | Seedance regular / I2V | Kling side-by-side canary |
| Exact start and final pose | Veo / Flow start+end frames | Seedance start/end if available |
| Broad style-world still | ImageGen | More constrained ImageGen edit with masks |
| Video style transfer | Omni / Flow edit | Generate new start/end keyframes and animate |
| Fast cheap motion test | Fast/lite variant | Short low-quality Veo / Flow canary |
| Final assembly polish | Local ffmpeg / Remotion | Regenerate source clip only if the issue is baked in |

## Flow / Veo

Best use:

- start/end-frame animation
- short self-contained clips
- simple locked-camera side-view actions
- style-world clips when the start and end images already define the scene

Observed risks:

- video-reference or extension modes may ignore the intended motion
- long prompts and long negative lists can reduce obedience
- brand/style words may contribute to policy or unusual-activity blocks
- misaligned start/end frames create jumps
- side characters may vanish or move unless locked
- "surprise" or "whoa" instructions can create overacting

Prompting rules:

- Say "Use the first image as the start frame and the second image as the end
  frame" when using frame pairs.
- Lock camera: "static locked side-view camera, no zoom, no pan, no crop
  change."
- Lock important background elements by name.
- Give side characters a tiny allowed motion, such as "small idle bounce" or
  "small wave", instead of "do not move" only.
- If audio is generated, specify "no background music" or "subtle synchronized
  sound effects only" when needed.

Avoid:

- asking for a large emotional reaction unless it is the only action
- using extension mode to invent the next world after a complex clip
- prompt blocks with many competing goals
- final frames where the portal, character, or side characters are close to the
  crop edge

## Omni / Flow Edit

Best use:

- restyling an existing clip when the model accepts the source cleanly
- preserving timing and composition from a strong reference video
- experimenting with world styles from one base motion

Observed risks:

- video-to-video style transfer can fail, ignore the source, or hallucinate
  unrelated content
- some uploaded videos or prompt combinations can trigger policy/unusual
  activity errors
- the model may reinterpret the story instead of only restyling it

Core lock prompt:

```text
Edit the uploaded video. Use the video as the motion, timing, framing, and composition reference.

Keep the same locked side-view camera, same path, same character count, same portal position, same ending, and same duration. Do not reframe, zoom, crop, pan, or change the camera.

Only change the visual style of the world. The hero keeps the same action and timing. Side characters stay visible in their same positions and make only tiny idle motions.

No extra characters, no text, no logos, no full-screen flash, no explosion, no disappearing side characters, no camera movement.
```

Add one style block after the core lock. Do not combine many style directions in
one request.

## Seedance

Best use:

- stylized image-to-video motion
- short walk cycles or simple character actions
- pencil, sketch, and animation-like source material
- API-driven runs where receipts and downloads are useful

Observed in Paper Portal:

- Seedance regular produced the best pencil walk-to-handle motion.
- The fast tier is useful for iteration but should not be assumed final quality.
- It can produce clean short clips when the action is simple and the frame is
  already clear.

Prompting rules:

- Describe the physical action plainly.
- Keep the camera locked when the source frame is a composition anchor.
- Use start/end frames when available and when the ending matters.
- Prefer "simple readable old-cartoon steps" over complex gait language.

See also `docs/references/seedance.md` for model variants, access, and API
details.

## Kling

Best use:

- side-by-side motion canaries
- testing whether another model handles a walk or body motion more naturally

Observed in Paper Portal:

- Kling produced cleaner walking motion in one comparison.
- Output looked blurrier than the preferred Seedance regular result.

Use Kling as a comparison model when motion quality is the main uncertainty.
Normalize and review it beside the Seedance or Veo candidate before choosing.

## ImageGen

Best use:

- start frames
- end frames
- style reference stills
- cleanup of generated or hand-drawn keyframes
- small masked corrections

Observed risks:

- broad edits can move characters, redraw the whole scene, or change identities
- end frames with many small characters are fragile
- generated dimensions may not match video needs unless post-processed

Rules:

- Default video keyframes to 16:9.
- Use high quality for frames that will anchor final video generations.
- Use tight masks for small fixes such as face direction, arm pose, or removing
  a character.
- Avoid asking ImageGen to change the whole scene when only one local fix is
  needed.
- After generating a frame, check alignment against the prior keyframe before
  animating.

## Portal / World Clip Pattern

For portal-world clips, this structure was more reliable than dramatic acting:

1. Hero enters from the left.
2. Hero walks steadily right.
3. Hero looks around happily and curiously.
4. Hero gives one small wave if passing friendly characters.
5. Side characters stay near the portal with tiny idle motion.
6. Hero walks into the portal and is gone by the final frame.

Avoid:

- large "whoa" reactions
- jumping, floating, or glowing hero silhouettes
- portal explosions
- side characters chasing the hero
- side characters moving out of frame
- changing camera framing during the clip

## Side Character Lock

Use this block when small background characters must remain stable:

```text
The side characters are important fixed characters. Keep all of them visible for the entire clip. They stay in their same positions and remain inside the frame. They do not disappear, merge into the portal glow, walk away, follow the hero, or move out of frame. They only make tiny idle motions, like a small wave or slight bounce.
```

If the model still moves them too much, make a clearer end frame rather than
adding more prompt text.

## Generic Style Blocks

Prefer these descriptive names over exact brands.

### Soft 3D Storybook

Warm whimsical 3D animated storybook world, soft rounded shapes, bright colors,
gentle sunlight, cozy magical details, toy-like materials, welcoming fantasy
atmosphere.

### Pixel Fantasy

Bright colorful 16-bit inspired pixel-art fantasy world, clean tile shapes,
crisp sprite-like characters, cheerful glowing portal, readable side-view game
composition.

### Hand-Painted Japanese Fantasy

Gentle hand-painted fantasy animation, watercolor-like backgrounds, warm
natural light, lush greenery, cozy whimsical architecture, delicate linework,
calm magical atmosphere.

### Stop-Motion Clay

Handcrafted clay puppet world, miniature scenery, rounded handmade shapes, tiny
set lighting, practical shadows, tactile fingerprints, warm portal light.

### Plush Toy Diorama

Soft felt and plush toy diorama, stitched edges, yarn texture, soft stuffing,
miniature toy scenery, cozy warm lighting, portal like a nightlight.

### Neon Arcade

Glowing neon arcade world, clean dark shapes, bright cyan and magenta lines,
gold portal light, retro game energy, luminous particles, clear side-view
composition.

## Failure Taxonomy

| Symptom | Likely Cause | Fix |
|---|---|---|
| Character walks backward or wanders | action prompt is too loose | specify left-to-right path and final destination |
| Side character vanishes | not treated as a fixed character | add side-character lock or create clearer end frame |
| Portal explodes into full-screen glow | glow prompt is too dramatic | say "soft and contained inside the doorway" |
| Final frame jumps | start/end frames misaligned | fix keyframes before regenerating video |
| Model creates extra seams/doors | door/opening geometry ambiguous | simplify keyframe and specify exact hinge/opening behavior |
| Prompt rejected | brand names, long negatives, uploaded video, or policy filter | simplify prompt, remove brands, test with image-only or shorter video |
| Style transfer ignores motion | video edit mode failed to bind source | switch to start/end keyframes and regenerate the clip |
| Broad image edit changes scene | edit scope too large | use a tight mask or rebuild the frame compositionally |
| Motion is clean but blurry | model/resolution limitation | compare another model or upscale only after story lock |

## Review Checklist

Before promoting a clip:

- Is the camera locked if it should be locked?
- Does the hero follow the intended path?
- Are all important characters visible through the final frame?
- Does the final frame match the expected state?
- Did the model add text, logos, extra characters, or extra limbs?
- Did the style change break the story action?
- Is the output normalized or ready to normalize?
- Is the verdict recorded in the clip ledger?

