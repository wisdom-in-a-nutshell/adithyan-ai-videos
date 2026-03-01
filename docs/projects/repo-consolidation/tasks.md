# Repo Consolidation (adithyan-ai-videos)

## Goal
Align this repository to the agent-native baseline with concise AGENTS routing, consistent docs contract, and minimal drift.

## Context / Constraints
- Date started: 2026-03-01
- Operating model: human intent, agent execution.
- Keep history by moving content instead of hard deleting when practical.
- Prefer mechanical guardrails over prose-only guidance.

## Decisions
- Use `$agent-native-repo-playbook` as baseline.
- Execute repo-by-repo sequentially.
- Archive legacy project state under `docs/projects/archive/`.

## Open Questions
- None currently.

## Tasks
- [ ] Audit root and nested `AGENTS.md` against Keep/Move/Delete.
- [ ] Normalize docs contract (`docs/architecture`, `docs/references`, `docs/projects`).
- [ ] Remove stale/broken doc links and legacy references.
- [ ] Add/align fast validation guardrail entrypoint.
- [ ] Final verification scan and concise change summary.

## Progress Log
- 2026-03-01: Initialized consolidation tracker.

## Next 3 Actions
1. Audit AGENTS files and identify oversized or stale sections.
2. Apply docs structure normalization with minimal churn.
3. Run repo-local verification scan and record follow-ups.
