# Media Toolkit Dependency

This repo-local skill is a thin wrapper over the canonical backend implementation.

## Contract

- Use the repo-local wrapper as the stable contract:
  - `.agents/skills/media-toolkit/scripts/media_toolkit.sh`
- Treat the underlying backend location as an implementation detail unless you are explicitly debugging the wrapper.

## Why This Wrapper Exists

`adithyan-ai-videos` is not the backend/media-processing repo. It should not duplicate:
- upload logic
- polling logic
- media API contract logic

So this repo keeps only a thin wrapper that forwards arguments to the canonical toolkit.

## Operator Notes

- Use `--help` on the wrapper for the canonical command surface.
- If the wrapper fails and you need deeper debugging, inspect the wrapper script and its configured backend paths directly.
