#!/usr/bin/env bash
# Fetch URW Base35 fonts (free PostScript 35 clones) from Artifex.
# License: AGPL-3.0 with font exception. See README.md.
set -euo pipefail
cd "$(dirname "$0")"

BASE="https://raw.githubusercontent.com/ArtifexSoftware/urw-base35-fonts/master/fonts"
FILES=(
  NimbusRoman-Regular.otf
  NimbusSans-Regular.otf
  NimbusSansNarrow-Regular.otf
  NimbusMonoPS-Regular.otf
  URWGothic-Book.otf
  URWBookman-Light.otf
  C059-Roman.otf
  P052-Roman.otf
  Z003-MediumItalic.otf
  StandardSymbolsPS.otf
  D050000L.otf
)

for f in "${FILES[@]}"; do
  if [[ -f "$f" ]]; then
    echo "have $f"
  else
    curl -fsSL -o "$f" "$BASE/$f" && echo "got  $f"
  fi
done
