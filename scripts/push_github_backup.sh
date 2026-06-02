#!/usr/bin/env bash
set -euo pipefail

# Push the Trajectory site repo to GitHub after authentication.
# Usage:
#   gh auth login
#   ./scripts/push_github_backup.sh [owner-or-org] [repo-name]
# Defaults:
#   owner: authenticated GitHub user
#   repo: trajectory-site

cd "$(dirname "$0")/.."

if ! command -v gh >/dev/null 2>&1; then
  echo "ERROR: gh CLI is not installed." >&2
  exit 1
fi

if ! gh auth status >/dev/null 2>&1; then
  echo "ERROR: gh is not authenticated. Run: gh auth login" >&2
  exit 1
fi

owner="${1:-$(gh api user --jq .login)}"
repo="${2:-trajectory-site}"
remote="https://github.com/${owner}/${repo}.git"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: not inside a git repo" >&2
  exit 1
fi

if ! gh repo view "${owner}/${repo}" >/dev/null 2>&1; then
  gh repo create "${owner}/${repo}" --private --description "Trajectory longevity site backup" --source . --remote origin --push
else
  if git remote get-url origin >/dev/null 2>&1; then
    git remote set-url origin "$remote"
  else
    git remote add origin "$remote"
  fi
  git push -u origin HEAD
  git push origin --tags
fi

echo "GitHub backup pushed to ${remote}"
