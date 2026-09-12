#!/usr/bin/env bash
# Take the baton: pull the latest state and print it.
# Read the output before you touch any code or spend a single token.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

git pull --rebase origin "$(git rev-parse --abbrev-ref HEAD)"

[ -d node_modules ] || npm install --no-audit --no-fund

echo
echo "════════════════════ HANDOFF STATE ════════════════════"
cat HANDOFF.md
echo "═══════════════════════════════════════════════════════"
echo
echo "Last 5 commits:"
git --no-pager log --oneline -5
echo
echo "Now: put your name in HANDOFF.md → Now → Holder, then start."
