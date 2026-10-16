# Sheik Shawarma Nørrebro — website

React 19 + TypeScript. Red awning, white stripes, slide-based layout, searchable menu.

## Run
```
npm install
npm run dev          # Vite dev server
npm run build        # normal Vite build
npm run build:single # one self-contained dist/index.html
```

## Where things are
- `src/menu.ts` — menu items, prices, hours, links (edit here)
- `src/styles.css` — design tokens, stripes, all color animations
- `src/MenuSlide.tsx` — search, category pills, filters, sort, detail sheet
- `src/App.tsx` — slide shell (arrows, dots, swipe, keys 1-4 and ←/→, `/` search, URL hash)

## TODO
- Add real food photos: set `image` on items in `menu.ts` (files in `public/photos/`).
- Confirm phone number (Wolt lists +45 52 78 28 15 too) and opening hours.
- Prices are in-store prices from a public listing; delivery apps differ.
