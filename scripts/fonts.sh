#!/bin/sh
# cerogeneration.com sets everything in Effra (Dalton Maag), served from an Adobe Fonts kit (use.typekit.net/szv6fyq.css,
# weights 300/400/500 + italics). That licence is tied to their own domain and cannot be self-hosted, so this build uses
# the closest open match: Rethink Sans (SIL OFL, variable wght 400 to 800), chosen side by side against Effra 500 for
# its round, open bowls, single-storey g and similar width (README "Typography").
# Subset to Latin and converted to woff2 with fontTools (pip install fonttools brotli).
set -e
cd "$(dirname "$0")/.."
TMP=_scrape/fonts; mkdir -p "$TMP" public/fonts
GH=https://raw.githubusercontent.com/google/fonts/main/ofl/rethinksans
curl -sL "$GH/RethinkSans%5Bwght%5D.ttf" -o "$TMP/rethink.ttf"
U="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2190-2193,U+2212"
for f in rethink; do
  python3 -m fontTools.subset "$TMP/$f.ttf" --unicodes="$U" --layout-features='*' --flavor=woff2 --output-file="public/fonts/$f.woff2"
done
ls -la public/fonts
