# Rendering Boundary Learnings

## Keep

- Keep the current repo-owned command surface:
  - `npm start`
  - `npm run render`
  - `npm run render:cloud`
- Keep local render as the default editing loop and cloud render as the
  checkpoint/final path.
- Keep runtime media remote-first in `src/projects/<id>/assets.js` when cloud
  compatibility matters.

## Avoid

- Do not add a second top-level render client unless repeated real workflow
  drift proves that the current commands plus docs are insufficient.
- Do not leave cloud-targeted compositions dependent on local frame
  directories or ignored `public/...` runtime assets.
- Do not rely on manual external polling for cloud renders when the repo
  command already owns waiting and final URL output.

## What Helped

- Converting local frame-sequence dependencies into one uploaded transparent
  runtime asset fixed the last major cloud blocker without changing the project
  structure.
- Scoping the local cache to the active composition set removed a large amount
  of avoidable startup work.
- A short cold-start workflow reference was more valuable than inventing a new
  skill or client layer.

## Future Trigger

Reopen this topic only if one of these happens:
- multiple active cloud-targeted projects expose repeated render/asset drift
- the current command surface stops being sufficient for cold agents
- provider diversity forces a real new boundary rather than a backend swap
