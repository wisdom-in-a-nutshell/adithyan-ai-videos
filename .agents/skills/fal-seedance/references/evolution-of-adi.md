# Evolution of Adi Seedance Reference Calls

Use this reference when the user asks for Seedance motion tests for `projects/evolution-of-adi/`.

## Current Intent

This is still visual/storyboard exploration, not the final Remotion build. The working loop is:

1. Generate/select consistent storyboard portraits.
2. Use Seedance Ref2V to test short motion clips.
3. Keep the usable clips and receipts under `projects/evolution-of-adi/seedance/`.
4. Stitch later only after the visual language is accepted.

Do not generate clips unless the user explicitly asks. Prefer `--dry-run` when handing off a call or checking setup.

## Reference Sets

Use `stylized/final/` first if the file exists:

- `projects/evolution-of-adi/stylized/final/01_child.png`
- `projects/evolution-of-adi/stylized/final/02_teen_early.png`
- `projects/evolution-of-adi/stylized/final/04_mid_20s.png`
- `projects/evolution-of-adi/stylized/final/05_early_30s.png`
- `projects/evolution-of-adi/stylized/final/06_present_day.png`

If the user is comparing a newer style lane, use that lane consistently instead of mixing style folders.

## Call Pattern A: Single Portrait Motion

Use this when the storyboard frame is already accepted and only needs subtle life.

```bash
node scripts/fal_seedance_ref2v.mjs run \
  --project evolution-of-adi \
  --name 05-early-30s-single-motion \
  --ref projects/evolution-of-adi/stylized/final/05_early_30s.png \
  --prompt "Animate @Image1 as a calm studio portrait. Gentle smile, subtle breathing, one natural blink, tiny head turn, soft key light, locked camera, no age change, no outfit change, no face reshaping." \
  --duration 4 \
  --aspect-ratio 1:1 \
  --dry-run
```

## Call Pattern B: Identity Anchors

Use this when the target portrait should stay close to one frame, but extra references can help Seedance understand same-person continuity. `@Image1` is always the primary frame to animate; later images are anchors only.

```bash
node scripts/fal_seedance_ref2v.mjs run \
  --project evolution-of-adi \
  --name 05-early-30s-anchored-motion \
  --ref projects/evolution-of-adi/stylized/final/05_early_30s.png \
  --ref projects/evolution-of-adi/stylized/final/04_mid_20s.png \
  --ref projects/evolution-of-adi/stylized/final/06_present_day.png \
  --prompt "Animate @Image1 as the primary portrait. Use @Image2 and @Image3 only as identity and style anchors for the same person. Gentle smile, subtle breathing, one natural blink, tiny head turn, soft studio light, locked camera, no age change, no outfit change, no face reshaping." \
  --duration 4 \
  --aspect-ratio 1:1 \
  --dry-run
```

## Call Pattern C: Age Transition Test

Use this only after single-portrait motion is acceptable. This tests whether Seedance can do a story transition before Remotion stitching.

```bash
node scripts/fal_seedance_ref2v.mjs run \
  --project evolution-of-adi \
  --name 04-to-05-age-transition-test \
  --ref projects/evolution-of-adi/stylized/final/04_mid_20s.png \
  --ref projects/evolution-of-adi/stylized/final/05_early_30s.png \
  --prompt "Create a gentle portrait time-lapse from @Image1 toward @Image2. Same person, same visual style, centered studio portrait, soft light, minimal camera push-in, calm expression, no dramatic morph distortion, no extra people, no text." \
  --duration 5 \
  --aspect-ratio 1:1 \
  --dry-run
```

## Prompt Defaults

- Keep `generate_audio` off unless the user asks for audio.
- Use `duration 4` for canaries; use `duration 5` only for transition tests.
- Use `aspect-ratio 1:1` for this project unless the user changes the video format.
- Mention "locked camera" for portrait holds.
- Mention "no age change" for single-frame animation.
- Mention "no dramatic morph distortion" for age transitions.

## Hand-Off Rule

When giving another agent the call, include:

- the command,
- which reference is primary,
- what success means,
- where the MP4 and receipt will be written.

The CLI output paths are deterministic from `--project` and `--name`:

- MP4: `projects/evolution-of-adi/seedance/renders/<name>.mp4`
- receipt: `projects/evolution-of-adi/seedance/receipts/<name>.json`
