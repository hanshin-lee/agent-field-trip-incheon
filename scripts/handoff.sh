#!/usr/bin/env bash
# Pass the baton: stamp HANDOFF.md, commit everything, push.
# Run this the moment your tokens get low — not after they run out.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

WHO="${1:-$(git config user.name)}"
STAMP="$(date '+%Y-%m-%d %H:%M %Z')"

# Stamp the "Last updated" line in place.
if [[ "$(uname)" == "Darwin" ]]; then
  sed -i '' "s|^- \*\*Last updated:\*\*.*|- **Last updated:** $STAMP (by $WHO)|" HANDOFF.md
else
  sed -i "s|^- \*\*Last updated:\*\*.*|- **Last updated:** $STAMP (by $WHO)|" HANDOFF.md
fi

if git diff --quiet && git diff --cached --quiet; then
  echo "Nothing to hand off — working tree is clean."
  exit 0
fi

git add -A
git commit -m "handoff: $WHO @ $STAMP"
git push origin HEAD

echo
echo "✅ Baton passed. Tell your teammate to run:  npm run pickup"
