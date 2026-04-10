# Effect Extraction Criteria

Use this when deciding whether a visual pattern should stay in
`src/projects/<project-id>/` or move into `src/effects/`.

## Keep It Project-Local

Keep the code in the project when one or more of these are true:

- the wording is tightly tied to one script or one narrator
- timing is bespoke and not reusable outside this edit
- the layout only works because of one specific shot or one specific asset
- the block still changes shape every time you touch it
- the abstraction would mostly be “pass every prop through”

## Move It Into `src/effects/`

Extract it when most of these are true:

- the same visual move has appeared in more than one scene or clearly will
  repeat in future projects
- the block has a stable purpose, not just one stable implementation
- the prop surface is small and meaningful
- the styling should stay part of the house look
- the project code would get simpler by calling the shared block

## Validation Rule

Before treating an extraction as done:

1. render `EffectsLab`
2. render one real narrative slice that uses the block
3. confirm the shared version actually reduced local project code or duplicated
   styling

If the shared version makes the project code noisier, put it back in the
project and wait for a better abstraction.
