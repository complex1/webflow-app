#!/usr/bin/env bash
# List largest tracked/source files (excludes common dependency dirs).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"
find . \
  -type f \
  \( -name '*.ts' -o -name '*.tsx' -o -name '*.vue' -o -name '*.js' -o -name '*.jsx' \) \
  ! -path '*/node_modules/*' \
  ! -path '*/dist/*' \
  ! -path '*/.git/*' \
  -print0 \
  | xargs -0 wc -l 2>/dev/null \
  | sort -n \
  | tail -40
