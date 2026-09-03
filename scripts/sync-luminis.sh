#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LUMINIS_SRC="${LUMINIS_SRC:-$ROOT/../design-system/packages/luminis}"
VENDOR="$ROOT/vendor/luminis"

if [[ ! -d "$LUMINIS_SRC" ]]; then
    echo "design-system not found at: $LUMINIS_SRC" >&2
    echo "Set LUMINIS_SRC to your local luminis package path." >&2
    exit 1
fi

echo "Building luminis at $LUMINIS_SRC ..."
(cd "$LUMINIS_SRC" && npm install && npm run build)

echo "Copying dist to $VENDOR ..."
rm -rf "$VENDOR/dist"
cp -R "$LUMINIS_SRC/dist" "$VENDOR/dist"

node -e "
const fs = require('fs');
const path = require('path');
const src = JSON.parse(fs.readFileSync(path.join('$LUMINIS_SRC', 'package.json'), 'utf8'));
const dest = path.join('$VENDOR', 'package.json');
const pkg = JSON.parse(fs.readFileSync(dest, 'utf8'));
pkg.version = src.version;
fs.writeFileSync(dest, JSON.stringify(pkg, null, 4) + '\n');
"

echo "Synced @ppt/luminis@$(node -p "require('$VENDOR/package.json').version")"
