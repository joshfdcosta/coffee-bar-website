#!/usr/bin/env bash
# Regenerates the minified CSS/JS actually referenced by the HTML.
# Run this after editing css/style.css, js/main.js, or js/i18n.js.
set -e
cd "$(dirname "$0")"
npx --yes terser js/main.js -c -m --comments false -o js/main.min.js
npx --yes terser js/i18n.js -c -m --comments false -o js/i18n.min.js
npx --yes clean-css-cli -o css/style.min.css css/style.css
echo "Rebuilt js/main.min.js, js/i18n.min.js, and css/style.min.css"
