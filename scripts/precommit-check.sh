#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

mapfile -t staged_files < <(git diff --cached --name-only --diff-filter=ACMR)

if [ "${#staged_files[@]}" -eq 0 ]; then
  echo "[precommit] no staged files; skipping checks"
  exit 0
fi

echo "[precommit] checking for merge conflict markers"
if command -v rg >/dev/null 2>&1; then
  if rg -n --no-messages "^(<<<<<<< |=======|>>>>>>> )" -- "${staged_files[@]}"; then
    echo "[precommit] merge conflict markers detected"
    exit 1
  fi
else
  if grep -nE "^(<<<<<<< |=======|>>>>>>> )" "${staged_files[@]}"; then
    echo "[precommit] merge conflict markers detected"
    exit 1
  fi
fi

json_failed=0
for file in "${staged_files[@]}"; do
  if [[ "$file" == *.json ]] && [ -f "$file" ]; then
    node -e "JSON.parse(require('node:fs').readFileSync(process.argv[1], 'utf8'))" "$file" || json_failed=1
  fi
done

if [ "$json_failed" -ne 0 ]; then
  echo "[precommit] invalid JSON detected"
  exit 1
fi

echo "[precommit] verifying Remotion compositions compile"
npx remotion compositions src/index.js >/dev/null

echo "[precommit] checks passed"
