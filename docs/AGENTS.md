# Remotion Docs Router

## Purpose
- Route agents to stable docs before project task files.

## Read Order
1. `../AGENTS.md`
2. `architecture/video-project-model.md`
3. `references/project-contract.md`
4. `references/verification-loop.md`
5. `setup/cloud-render-modal.md` (only when cloud render is relevant)
6. `projects/<project>/tasks.md`

## Placement
- `architecture/`: system shape and boundaries.
- `references/`: durable implementation constraints.
- `setup/`: one-time or environment setup guides.
- `projects/`: active execution state and next actions.

## Portfolio Docs Contract (Enforced)
<!-- PORTFOLIO_DOCS_CONTRACT_V1 -->

- `docs/architecture/`: quick human overview first, then details. Prefer visual-first Markdown (Mermaid) with short helper text in plain English.
- `docs/references/`: durable implementation facts, command snippets, and operational lookup material for humans and agents.

### Portfolio Docs Rules (Enforced)

- Keep wording plain and non-jargony so a solo human can understand quickly on first read.
- For visual/system flows, prefer Mermaid in Markdown with short helper text.
- Default Mermaid orientation is top-down (`flowchart TD`) unless horizontal layout is materially clearer.
