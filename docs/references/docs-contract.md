# Docs Contract

## Placement

- `docs/architecture/`: subsystem shape, boundaries, responsibilities, and
  render flow. Prefer short plain-English explanations plus `flowchart TD`
  Mermaid diagrams when a diagram helps.
- `docs/references/`: commands, file maps, contracts, implementation notes, and
  other durable lookup facts.
- `docs/setup/`: environment-specific or provider-specific setup notes. Read
  these only when the relevant integration is in play.
- `docs/projects/<project>/tasks.md`: active execution state and resume point
  for scoped work.

## Writing Rules

- Keep wording plain and easy to scan.
- Use `docs/architecture/` for "How does this system work?"
- Use `docs/references/` for "What exact facts do I need?"
- Keep repo routing in the root `AGENTS.md`; do not recreate nested
  `AGENTS.md` files for docs placement.
