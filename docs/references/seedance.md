# Seedance (ByteDance) — Reference

Generative video model from ByteDance. Useful for adding motion to stylized stills, generating short clips from prompts, and morphing between reference frames. This file is a generic reference — project-specific prompt locks and shot lists belong in the project's own `brief.md` / `storyboard.md`.

## Variants (snapshot — verify before locking a project on these)

| Variant | Max res | Duration | Notes |
|---|---|---|---|
| Seedance 2.0 | 1080p | flexible (`duration=-1` auto) | Native synchronized audio. Multimodal refs (up to 9 images + 3 video + 3 audio per call). |
| Seedance 2.0 Fast | 720p | flexible | Cheaper / lower-latency. Use for iteration; switch to full 2.0 for finals. |
| Seedance 1.5 Pro | (per Volcengine docs) | — | Intermediate release; positioning between 1.0 Pro and 2.0. |
| Seedance 1.0 Pro | 1080p | 2–12s (default 5s) | I2V supports start-frame + optional end-frame. Has `fix-camera` flag. |
| Seedance 1.0 Lite | 720p | 2–12s | Cheapest tier. |

Aspect ratios across the lineup: 16:9, 4:3, 1:1, 3:4, 9:16, 21:9.

**Seedance 2.0 (full endpoint on fal) supports 1080p** as of April 2026. The Fast variant still caps at 720p — use it for cheap iteration only.

## Modes

- **Text-to-video (T2V)** — prompt only.
- **Image-to-video (I2V)** — input image + prompt. 1.0 Pro additionally supports an optional end-frame for explicit start→end interpolation.
- **Reference-to-video (Ref2V)** — 2.0 only. Up to 9 reference images per call. The right tool for "same character across multiple separate generations" — re-pass the same reference set into each call.
- **Video edit / extend** — 2.0 only. Continue or modify an existing clip.

## Prompting patterns

Official guidance (Replicate readme): "be specific — describe camera movements, lighting, mood, and specific actions."

- **Camera moves the model knows**: push-in, pull-out, dolly, pan, orbit, handheld. Naming a move explicitly works better than implying it.
- **Subtle subject motion** (blink, breath, slight head turn, micro-expression) is reliable.
- **Full-body environment interaction** is the harder edge — reduce ambition or break into multiple clips.
- **Dialogue** (2.0): put spoken lines in quotes inside the prompt.
- **Reference handles** (fal 2.0 Ref2V): address inputs as `@Image1`, `@Video1`, `@Audio1` in the prompt body.
- **Multi-shot inside one generation** is supported (1.0 paper: "native multi-shot narrative coherence"). Useful for morph/transition shots without stitching in post.

## Style preservation

- I2V claims to preserve input style. Documented examples cover photoreal, illustration, cyberpunk, felt-texture, etc. — stylized 3D / Pixar-like inputs sit comfortably in that range.
- Likeness drift on stylized faces across separate generations is an **anecdotal** risk, not benchmarked. Mitigate by using Ref2V mode and re-passing the same anchor image(s) every call.

## Access

- **Volcengine Ark** (official, China-first) — `volcengine.com/docs/82379`. Full lineup including 1.5 Pro.
- **Replicate** — `bytedance/seedance-2.0`, `seedance-2.0-fast`, `seedance-1-pro`, `seedance-1-lite`.
- **fal.ai** — full 2.0 lineup (T2V / I2V / Ref2V) plus Fast tier; 1.0 Pro / 1.0 Lite also available.

Local fal Ref2V runs use the self-contained `fal-seedance` skill. See `.claude/skills/fal-seedance/references/client.md` for the full machine contract.

```bash
python3 .claude/skills/fal-seedance/scripts/fal_seedance_ref2v.py run \
  --project <project-id> \
  --ref projects/<project-id>/storyboard/frame-01.png \
  --prompt "Animate @Image1 as the primary frame. Subtle breathing, one natural blink, tiny head turn, locked camera." \
  --duration 4 \
  --aspect-ratio 1:1 \
  --dry-run
```

The client reads `~/.secrets/fal/env`, uploads local refs during real runs, downloads the generated MP4, and writes a JSON receipt under `projects/<id>/seedance/`.

Use `python3 .claude/skills/fal-seedance/scripts/fal_seedance_ref2v.py doctor --remote` to verify fal auth/connectivity without submitting a video generation.

Indicative pricing (verify before billing decisions): 1.0 Pro ≈ $0.74 / 5s 1080p on fal; 1.0 Lite ≈ $0.18 / 5s 720p. 2.0 priced per-second; check provider pages.

## Gotchas

- **Fast variant still caps at 720p** — switch to the full `bytedance/seedance-2.0/reference-to-video` endpoint for 1080p.
- **Cross-call consistency is best-effort, not guaranteed** — even with Ref2V, expect some drift. Plan a regeneration budget per shot.
- **Subtle ≠ free** — "subtle" prompts can still produce too much motion (extra blinks, jaw movement, head sway) that breaks a still-portrait feel. Iterate on the negative space of the prompt as much as the positive.
- **fps default is undocumented** in fetched provider pages; 1.0 Pro's token formula `(h*w*fps*duration)/1024` implies it's a parameter — set it explicitly when the provider exposes it.

## Cookbooks / galleries

- Replicate model pages → `/examples` tab — concrete prompt+output pairs.
- `seed.bytedance.com/seedance` — curated showcase reels.
- Volcengine has a Chinese-language Seedance-1.5-pro prompting guide.
- arXiv `2506.09113` — Seedance 1.0 technical report (architecture context, not a prompting cookbook).

## Suggested first-use sanity check

Before locking a project around Seedance, spend a few dollars on a 3-call test:

1. **Likeness / style test** — one stylized still → 2.0 Fast I2V with a "subtle blink, slow breath, slight head turn, slow push-in" prompt. Does the source style survive? Does the face stay on-model?
2. **Cross-call consistency test** — same still → 2.0 Ref2V with a different shot prompt. Compare against test 1: does the same character read across two separate calls?
3. **Multi-shot / morph test** — two stills (e.g., character at age A and age B) → ask 2.0 for a morph between them in one clip. If usable, it can collapse Remotion crossfades into a single richer clip.

These three answer the questions that actually drive shot-list design: style survival, character consistency, and whether morphs can move from post into generation.

## Sources

- replicate.com/bytedance and per-model pages (`seedance-2.0`, `seedance-2.0-fast`, `seedance-1-pro`, `seedance-1-lite`)
- fal.ai Seedance 2.0 (T2V / I2V / Ref2V + Fast) and `bytedance/seedance/v1/pro/image-to-video`
- seed.bytedance.com/seedance
- volcengine.com/docs/82379 (Ark API index)
- arXiv 2506.09113 (Seedance 1.0 technical report)
