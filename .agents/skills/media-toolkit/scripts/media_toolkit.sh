#!/usr/bin/env bash
set -euo pipefail

WIN_REPO_ROOT="${WIN_REPO_ROOT:-/Users/dobby/GitHub/win}"
WIN_PYTHON="${WIN_PYTHON:-$WIN_REPO_ROOT/venv/bin/python}"
WIN_TOOLKIT="${WIN_TOOLKIT:-$WIN_REPO_ROOT/.agents/skills/media-toolkit/scripts/media_toolkit.py}"

if [[ ! -x "$WIN_PYTHON" ]]; then
  printf 'media-toolkit wrapper error: WIN python not found at %s\n' "$WIN_PYTHON" >&2
  exit 4
fi

if [[ ! -f "$WIN_TOOLKIT" ]]; then
  printf 'media-toolkit wrapper error: WIN toolkit not found at %s\n' "$WIN_TOOLKIT" >&2
  exit 4
fi

exec "$WIN_PYTHON" "$WIN_TOOLKIT" "$@"
