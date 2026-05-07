# fal Seedance Client Contract

This repo uses `scripts/fal_seedance_ref2v.mjs` as the machine-primary client for fal.ai Seedance reference-to-video runs.

## Purpose

Use the client when an agent needs to turn storyboard images or other local references into short Seedance clips through fal. The client owns:

- local reference validation,
- local file upload to fal storage,
- Seedance Ref2V request submission,
- generated MP4 download,
- JSON receipt writing,
- non-inference provider connectivity checks.

## Secret Lane

- Canonical secret: Azure Key Vault `fal--api-key`
- Mapping: `/Users/dobby/GitHub/scripts/sync/machine-secrets/fal.env.map`
- Generated local file: `~/.secrets/fal/env`
- Local env var inside that generated file: `FAL_KEY`

Refresh local credentials:

```bash
/Users/dobby/GitHub/scripts/sync/keyvault-sync-machine-secrets.sh --apply --integration fal
```

The client reads the generated file directly. Do not pass fal keys through flags or repo `.env` files.

## Commands

Local validation only:

```bash
node scripts/fal_seedance_ref2v.mjs validate
```

Provider connectivity without video inference:

```bash
node scripts/fal_seedance_ref2v.mjs doctor --remote
```

`doctor --remote` uploads a tiny text file to fal storage with immediate lifecycle expiry. It verifies the API key and provider connectivity without submitting a Seedance generation.

Dry-run a reference-to-video request:

```bash
node scripts/fal_seedance_ref2v.mjs run \
  --project <project-id> \
  --name <shot-name> \
  --ref projects/<project-id>/storyboard/frame-01.png \
  --prompt "Animate @Image1 as the primary frame. Subtle breathing, one natural blink, tiny head turn, locked camera." \
  --duration 4 \
  --aspect-ratio 1:1 \
  --dry-run
```

Run for real by removing `--dry-run`.

## Output Contract

Default stdout is one JSON object:

- `schema_version`: currently `1.0`
- `command`: canonical command name
- `status`: `ok` or `error`
- `data`: command result on success
- `error`: structured error object on failure
- `meta.request_id`: local command request id
- `meta.duration_ms`: command duration
- `meta.timestamp_utc`: completion timestamp

Progress and provider logs go to stderr only.

## Exit Codes

- `0`: success
- `1`: unexpected/provider output failure
- `2`: usage, validation, or missing local file
- `3`: missing or rejected credentials
- `4`: network/provider availability issue
- `5`: timeout or interruption

## Ref2V Schema

The client targets:

`bytedance/seedance-2.0/fast/reference-to-video`

Supported input limits from fal:

- `image_urls`: up to 9 images, JPEG/PNG/WebP, max 30 MB each
- `video_urls`: up to 3 videos, MP4/MOV, combined duration 2-15s, total under 50 MB
- `audio_urls`: up to 3 audio files, MP3/WAV, combined duration up to 15s
- total files across image/video/audio: up to 12
- `duration`: `auto` or 4-15 seconds
- `resolution`: `480p` or `720p`
- `aspect_ratio`: `auto`, `21:9`, `16:9`, `4:3`, `1:1`, `3:4`, `9:16`

## Reference Prompting Rules

- Refer to images as `@Image1`, `@Image2`, etc.
- Refer to videos as `@Video1`, `@Video2`, etc.
- Refer to audio as `@Audio1`, `@Audio2`, etc.
- Explicitly assign each reference a role: primary frame, character identity, style, outfit, environment, camera motion, action choreography, rhythm, or audio mood.
- For a storyboard frame, make `@Image1` the primary frame to animate. Use later images as anchors unless a transition or morph is intended.
- Use short canaries before batching: 4s, 720p, no generated audio unless needed.
- For 10s+ clips, write timed segments in the prompt.

## Output Files

With `--project <project-id>` and `--name <shot-name>`:

- MP4: `projects/<project-id>/seedance/renders/<shot-name>.mp4`
- receipt: `projects/<project-id>/seedance/receipts/<shot-name>.json`

Receipts include endpoint, prompt, prepared references, fal request id, provider output, local file hash, and local paths.

## Sources

- fal endpoint docs: `https://fal.ai/models/bytedance/seedance-2.0/fast/reference-to-video/api`
- fal queue docs: `https://fal.ai/docs/documentation/model-apis/inference/queue`
- fal JS client docs: `https://fal.ai/docs/api-reference/client-libraries/javascript`
- ByteDance Seedance 2.0 page: `https://seed.bytedance.com/en/seedance2_0`
- Seedance 2.0 model card: `https://arxiv.org/abs/2604.14148`
