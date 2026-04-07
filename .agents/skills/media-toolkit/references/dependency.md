# Media Toolkit Dependency

This repo-local skill is a thin wrapper over the canonical WIN implementation.

## Canonical Implementation

- WIN repo: `/Users/dobby/GitHub/win`
- Skill: `/Users/dobby/GitHub/win/.agents/skills/media-toolkit/`
- Entrypoint: `/Users/dobby/GitHub/win/.agents/skills/media-toolkit/scripts/media_toolkit.py`

## Why This Wrapper Exists

`adithyan-ai-videos` is not the backend/media-processing repo. It should not duplicate:
- WIN upload logic
- WIN polling logic
- WIN media API contract logic

So this repo keeps only a thin wrapper that forwards arguments to the canonical WIN toolkit.

## Operator Notes

- The wrapper expects the WIN repo checkout to exist at `/Users/dobby/GitHub/win`.
- It expects the WIN Python environment at `/Users/dobby/GitHub/win/venv/bin/python`.
- Use `--help` on the wrapper for the canonical command surface.
