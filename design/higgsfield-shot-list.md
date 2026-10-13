# COMET 2.0 — Mumbai in Motion · Higgsfield shot list

The website is built and waiting for these shots. Each one has a slot in
`src/lib/media.ts`; until a shot exists the site shows a labelled fallback
(storyboard animatic or concept render).

**Rules for every shot**
- Use the approved boards as references: `design/source/1.webp` (Platform Local, the main shoe), `2.webp` (packaging), `3.webp` (Harbour).
- No text, logos or lettering generated into the footage. COMET 2.0 and all copy are added by the website.
- 5–8 s per shot, 16:9, 24 fps, no audio needed. Generate and review each shot on its own.
- Reject any take where the shoe changes shape, the star moves, artwork flickers or feet deform. If the shoe never holds, keep the take only for the environment (Shots A/B), and the site will use the approved renders for the product.

| Slot | File | Mode | Prompt |
|---|---|---|---|
| A · The city | `shot-a.mp4` | text-to-video | Cinematic realistic shot of a Mumbai suburban local train — red and yellow livery — arriving at a crowded CSMT platform during the morning commute. Warm low sun through a cast-iron platform shed, commuters waiting at the yellow platform edge, some riding the open doors. Slow lateral dolly along the platform, gentle handheld feel, shallow depth of field, natural crowd behaviour. Composition ends low, near commuters' feet. No text, no signage close-ups. |
| B · The discovery | `shot-b.mp4` | image/reference-to-video (ref: board 1 lateral + medial views) | Follow a young commuter walking through the platform crowd, camera lowers smoothly to their feet: a cream canvas low-top court sneaker with a dark navy four-point star, navy heel tab, chai-brown laces, gum brown sole, a red-and-yellow train illustrated on the side. Crowd and train fall into soft focus, the sneaker stays sharp and consistent. Natural walking, no distortion. |
| C · The transition | (optional) | first/last-frame | Start frame: last frame of B. End frame: the board 1 lateral render on a cream studio sweep. Camera pushes in toward the shoe while the platform dissolves to a clean, warm studio. Keep the shoe's shape unchanged. |
| D · Hero product | `shot-d.mp4` | image-to-video (start frame: board 1 lateral view on cream) | Premium studio product film of the exact sneaker: slow, smooth 90° orbit from lateral toward the toe and back, soft warm key light, grounded shadow on a cream sweep, visible canvas weave and stitching. No camera jumps, no morphing. |
| E · Macros | `shot-e-*.mp4` | image-to-video, one per detail crop in `public/img/local-d-*.webp` | Very slow macro push-in on the provided detail (train artwork / CST illustration / मुंबई sign / vada pav / cricketer / heel tab / star / outsole), shallow focus, warm light. Do not redraw the artwork. |
| F · Packaging | `shot-f.mp4` | image-to-video (start: `public/img/box-closed.webp`) | Controlled reveal: hands lift the poster lid of the shoe box, indigo toile tissue is folded back, the postcard and hang tag are set beside it, then the sneaker is revealed. Slow, tactile, warm overhead light. |
| G · Campaign | (optional) | image-to-video | Sneaker beside the closed poster box on a cream set, slow push-in, no text. The website overlays COMET 2.0 / MUMBAI IN MOTION / A CITY THAT NEVER STOPS. |

**Dropping a shot in**
1. Export H.264 MP4, ~1080p, CRF 24–28, under ~6 MB, muted.
2. Save as `public/video/<file>` plus a poster frame `public/video/<name>.jpg`.
3. Set `ready: true` for that slot in `src/lib/media.ts`.

Or generate in Higgsfield and ask Claude to import it: the Higgsfield connector can read finished generations from your account.
