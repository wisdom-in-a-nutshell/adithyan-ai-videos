# Tools Available (WIN)

This workflow relies on a few WIN CLI helpers. Don’t hardcode their flags in docs; use `--help` at runtime.

**Default channel for this workflow:** `ADITHYAN`

## Media

- Transcribe a URL → `transcript.json`
  - `~/GitHub/win/scripts/tools/media/transcribe.py`
  - Use: `--help` (always pass `--channel ADITHYAN`)

- Foreground matting (SAM3 + MatAnyone) → `matting.json` with `alpha_url` (optional)
  - `~/GitHub/win/scripts/tools/media/matting.py`
  - Use: `--help`

- Transform (trim/scale/crop) → proxy `output_url` (optional; useful for faster iteration)
  - `~/GitHub/win/scripts/tools/media/transform.py`
  - Use: `--help` (always pass `--channel ADITHYAN`)
