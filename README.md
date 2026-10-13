# COMET 2.0 — Mumbai in Motion

A cinematic product story for an original sneaker concept: a fictional label,
COMET 2.0, and its *Mumbai in Motion* collection. Made as a UX/product design
portfolio case study. Nothing here is for sale.

```bash
npm install
npm run dev -- -p 3300   # http://localhost:3300
npm run build
```

## How it's put together
- **Source of truth:** the three approved boards in `design/source/`. `node scripts/crop.mjs` cuts them into the views and details in `public/img/`.
- **Brand:** `src/components/brand/Logo.tsx`, a comet mark — the shoe's four-point star trailing a tapered tail plus the COMET 2.0 wordmark, all vector and HTML.
- **Smoothness:** Lenis smooths wheel input on fine pointers only (touch, keyboard and reduced motion stay native); scroll-linked visuals read a sprung progress value; no blend modes or fixed overlays. `node scripts/smoothness.mjs <url>` wheel-scrolls the page and reports frame pacing.
- **Chapters:** `src/components/sections/*`. The page scrolls natively. Long chapters split their scroll range into steps (`useStep.ts`), and only transform and opacity animate.
- **Cinematic footage:** slots in `src/lib/media.ts`. Until a shot is delivered, the opening plays a labelled storyboard animatic. The shot list is in `design/higgsfield-shot-list.md`.
- **No real-time 3D:** v1's parametric WebGL shoe was replaced with the approved renders, labelled as renders. See the case study at `/case-study`.

## QA scripts (need local Chrome)
`node scripts/shots.mjs <outDir> <w> <h> <scrollY|#id:offset,...>` and `node scripts/montage.mjs`.
