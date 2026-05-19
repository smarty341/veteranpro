#!/usr/bin/env bash
set -euo pipefail
BASE="https://veteranpro.gov.ua"
DEST="public/assets"
mkdir -p "$DEST/fonts" "$DEST/logo" "$DEST/img" public/icons

curl -fsSL -A "Mozilla/5.0" "$BASE/fonts/e-Ukraine/e-Ukraine-Light.otf"   -o "$DEST/fonts/e-Ukraine-Light.otf"
curl -fsSL -A "Mozilla/5.0" "$BASE/fonts/e-Ukraine/e-Ukraine-Regular.otf" -o "$DEST/fonts/e-Ukraine-Regular.otf"
curl -fsSL -A "Mozilla/5.0" "$BASE/fonts/e-Ukraine/e-Ukraine-Medium.otf"  -o "$DEST/fonts/e-Ukraine-Medium.otf"
curl -fsSL -A "Mozilla/5.0" "$BASE/img/min-veteran.svg" -o "$DEST/logo/min-veteran.svg"
curl -fsSL -A "Mozilla/5.0" "$BASE/img/kmu.svg"         -o "$DEST/logo/kmu.svg"
curl -fsSL -A "Mozilla/5.0" "$BASE/img/home-hero.svg"   -o "$DEST/img/home-hero.svg"
curl -fsSL -A "Mozilla/5.0" "$BASE/favicon.ico"         -o public/favicon.ico

cp assets/logo/veteran_logo.svg "$DEST/logo/veteran_logo.svg"

# Render PWA icons from the wordmark on a brand-dark background using ImageMagick if available;
# otherwise the build still works — replace these PNGs by hand any time.
if command -v magick >/dev/null 2>&1; then
  for size in 192 512; do
    magick -size ${size}x${size} xc:'#2D2926' \
      \( "$DEST/logo/veteran_logo.svg" -resize $((size*70/100))x \) -gravity center -composite \
      public/icons/icon-${size}.png
  done
  cp public/icons/icon-512.png public/icons/apple-touch-icon.png
else
  echo "ImageMagick not found — place icon-192.png, icon-512.png, apple-touch-icon.png in public/icons/ manually."
fi
echo "OK"
