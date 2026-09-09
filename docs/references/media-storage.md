# Media Storage

## Purpose

Keep the Git repo usable on the internal SSD while large local video files live
on external storage when available.

The repo itself stays at:

```text
~/GitHub/adithyan-ai-videos
```

The Mac Mini heavy-media root is:

```text
/Volumes/DobbyData/Videos/adithyan-ai-videos
```

Override this path only for explicit local experiments:

```bash
AI_VIDEOS_MEDIA_ROOT=/some/other/path npm run media:status
```

## First Storage Boundary

The first managed boundary is `public/imports`.

On the Mac Mini, `public/imports` should be a symlink to:

```text
/Volumes/DobbyData/Videos/adithyan-ai-videos/public/imports
```

This preserves the normal repo-facing path:

```text
public/imports/<project-id>/...
```

Agents should keep using that repo-facing path for local runtime media. The
symlink decides where the bytes live on this machine.

## Folder Roles

- `public/imports/<project-id>/`: large local media that Remotion can serve
  during Studio or local renders. This is ignored by Git and is the safest first
  place to move off the internal SSD.
- `projects/<project-id>/`: project workbench material such as storyboards,
  prompts, receipts, review renders, originals, generated candidates, masks,
  and worklogs. Keep this folder local by default because it includes tracked
  project context.
- `src/projects/<project-id>/assets.js`: runtime source of truth. Stable cloud
  and cross-machine render inputs should prefer remote URLs here.

Do not symlink the whole `projects/` directory by default. If a project grows
too large, symlink only clearly heavy ignored subfolders such as `review/`,
`seedance/renders/`, or `artifacts/` after documenting the move.

## Commands

```bash
npm run media:status
npm run media:check
npm run media:link
npm run media:link -- --apply
npm run media:setup
```

- `media:status`: prints current size and link state.
- `media:check`: exits nonzero if the managed link is broken or points to a
  missing external disk.
- `media:link`: dry-runs the planned `public/imports` migration.
- `media:link -- --apply`: creates the external target, moves existing local
  `public/imports` contents there, and replaces `public/imports` with a symlink.
- `media:setup`: agent-friendly alias for `media:link -- --apply`.

The link command refuses to overwrite a nonempty external target unless it is
the existing managed target. If the external disk is not mounted, it fails before
moving anything.

## MacBook Behavior

The MacBook can keep `public/imports` as an ordinary local ignored folder. Do
not require `/Volumes/DobbyData` there.

When media needs to work across machines or in cloud renders, upload it through
the shared media uploader and store the resulting URL in
`src/projects/<project-id>/assets.js`.

## Public Object Storage

The shared uploader now returns native S3 URLs with the bucket in the path:
`https://storage.aipodcast.ing/assets/<object-key>`. Preserve the complete
returned URL, including `/assets/`, and encode object-key path segments. The
old root-level storage URLs are not an alias for this layout.

On 2026-09-09, all 20 unique storage URLs referenced by the older video runtime
inputs returned 404 from both native storage and the retained R2 source.
`ObjectSegmentation` and its dependent `EffectsLab` composition are disabled in
`src/projects/registry.js` with explicit missing-media reasons. `TextEffects`
was already disabled. Their required asset contracts and historical project
materials remain intact for a future restoration; do not enable these
compositions until their inputs are available and verified. The unused
`source_url` provenance field was removed from `active_speaker_frames.json`;
its frame data remains intact.

For future durable render inputs, use authorized `permanent/` or `share/`
objects instead of expiring `cache/` URLs. Promoting or restoring source media
is separate work; disabling these compositions did not copy or regenerate it.

## Recovery

If `public/imports` is a symlink and `/Volumes/DobbyData` is unavailable:

1. Remount the disk.
2. Run `npm run media:check`.
3. Continue work after the check passes.

For temporary laptop work, create a normal local `public/imports/<project-id>/`
folder instead of relying on the Mac Mini symlink.

## Agent Import Rule

Before importing large local media on the Mac Mini, run:

```bash
npm run media:status
```

If `public/imports` is a normal directory on the Mac Mini and
`/Volumes/DobbyData` is mounted, run:

```bash
npm run media:setup
```

Then place imported runtime media under:

```text
public/imports/<project-id>/
```

Do not ask the human to choose between repo-local and DobbyData paths during
normal import work. Use the repo-facing `public/imports/<project-id>/` path.
