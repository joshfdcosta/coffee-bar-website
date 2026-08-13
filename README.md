# The Coffee Bar — website

Static site for The Coffee Bar by TGC&CO (Al Quoz + Dubai Marina, Dubai). Plain
HTML/CSS/JS, no build framework — mirrors the architecture of the reference
Homies site: hand-authored `css/style.css` / `js/main.js`, minified via
`build.sh` into `css/style.min.css` / `js/main.min.js`, which are what the
HTML actually loads.

## Develop

```bash
bash build.sh          # rebuild the minified CSS/JS after editing the source files
python -m http.server 4455   # serve locally
```

Then open `http://localhost:4455`.

## Structure

- `index.html` — home page
- `menu.html` — full menu (sourced from the café's real Deliveroo listing)
- `css/style.css` → `css/style.min.css`
- `js/main.js` → `js/main.min.js`
- `fonts/` — self-hosted Bagel Fat One, Figtree, Caveat (no Google Fonts CDN)
- `images/` — photos from the business's own Google Maps listing and Instagram

## Content sourcing

Menu items, prices, hours, address, and reviews are pulled from the business's
real public listings (Deliveroo, Google Maps, Instagram), not invented. Photos
are the business's own — confirm rights/permission with the owner before
using this publicly.
