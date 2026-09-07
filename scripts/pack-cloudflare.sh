#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
STAGE="${TMPDIR:-/tmp}/clean-and-speak-cloudflare-pack"
OUT_DIR="${1:-$ROOT}"
NAME="clean-and-speak-cloudflare"
BUNDLE="$STAGE/$NAME"

rm -rf "$STAGE"
mkdir -p "$BUNDLE/pages-upload" "$BUNDLE/workers-project"

cp -a "$ROOT/public/." "$BUNDLE/pages-upload/"
find "$BUNDLE/pages-upload" -name '*.html' -print0 | xargs -0 sed -i 's|__ORIGIN__||g'

cat > "$BUNDLE/pages-upload/_headers" <<'EOF'
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
EOF

cp -a "$ROOT/public" "$ROOT/src" "$BUNDLE/workers-project/"
cp "$ROOT/wrangler.jsonc" "$ROOT/package.json" "$ROOT/package-lock.json" "$ROOT/tsconfig.json" "$ROOT/README.md" "$ROOT/DEPLOY.md" "$BUNDLE/workers-project/"

cp "$ROOT/DEPLOY.md" "$BUNDLE/HOW-TO-DEPLOY.md"

cat > "$BUNDLE/README.txt" <<'EOF'
Clean & Speak — Cloudflare upload pack
======================================

1) pages-upload
   Open Cloudflare Dashboard → Workers & Pages → Create → Pages → Upload assets.
   Drop THIS folder (it already contains index.html).
   Live URL: https://clean-and-speak.pages.dev

2) workers-project
   Full site with the contact-form API.
   npm install
   npx wrangler login
   npx wrangler deploy
   Live URL: https://clean-and-speak.<your-subdomain>.workers.dev

Read HOW-TO-DEPLOY.md for details.
EOF

mkdir -p "$OUT_DIR"
(
  cd "$STAGE"
  zip -r -q "$OUT_DIR/$NAME.zip" "$NAME"
)

echo "Wrote $OUT_DIR/$NAME.zip"
unzip -l "$OUT_DIR/$NAME.zip" | tail -n 20
