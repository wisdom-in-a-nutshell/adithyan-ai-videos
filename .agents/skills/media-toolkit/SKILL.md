---
name: media-toolkit
description: Use when an agent in adithyan-ai-videos needs media processing from a local file, media URL, or job_id. This skill wraps the canonical media toolkit so this repo can submit transcription, transform, matting, and job-status commands without re-implementing the client.
---

# Media Toolkit

## Overview

This repo does not own the media-processing implementation. It delegates to the canonical toolkit and API surface.

Use this skill when work in `adithyan-ai-videos` needs:
- transcription
- video transform
- foreground matting
- job status inspection

In repo workflow terms, this is the first place to look for media operations. If the toolkit covers the task, use it. If it does not, then inspect the lower-level implementation.

## Workflow

1. Run the wrapper script in this repo:

```bash
.agents/skills/media-toolkit/scripts/media_toolkit.sh ...
```

2. Pass only external inputs:
- `--file /abs/path/video.mp4`
- `--url https://...`
- `status --job-id ...`

3. Prefer `--output /path/result.json` when another step needs to read the result later.

4. Use `--help` on the top-level command or subcommands when you need exact flags:

```bash
.agents/skills/media-toolkit/scripts/media_toolkit.sh --help
.agents/skills/media-toolkit/scripts/media_toolkit.sh transcribe --help
```

## Rules

- Treat this repo-local skill as a thin bootstrap wrapper over the canonical backend implementation.
- Prefer this wrapper as the default operator surface from `adithyan-ai-videos`, but let the agent drop lower when the toolkit does not cover the needed case.
- Do not duplicate the backend media client logic here.
- Read [references/dependency.md](references/dependency.md) when you need to know where the real implementation lives.
