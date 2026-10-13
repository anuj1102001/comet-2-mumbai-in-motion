# COMET 2.0: studio product photographs

Six campaign frames made from the approved board renders. The product pixels
are never redrawn, so the shoe and box design, artwork, colours and placements
are exactly the boards'.

| File | Frame |
|---|---|
| 01-local-lateral-hero | Platform Local, lateral, cream paper sweep |
| 02-local-medial | Platform Local, medial |
| 03-postcard-lateral | Postcard edition, lateral |
| 04-harbour-closeup | Harbour on a navy set (the board crops the heel, so it runs off frame) |
| 05-box-terracotta | Poster box on terracotta |
| 06-campaign-box-and-shoe | Box and Platform Local together |

**How they were made**
1. **Adobe Photoshop (API), Remove Background:** cut each product out of its board (`cut/`).
2. **`scripts/photo.mjs`:** builds a seamless paper sweep with a key light from upper left, paper texture and falloff. It traces each product's bottom edge for a contact shadow and a soft cast shadow, then composites at native resolution (no upscaling).
3. **Adobe Lightroom, preset "Subject: Food - FD01":** warmth plus texture and structure, which brings out the canvas weave and stitching.
4. **Adobe Photoshop, Add Grain (14):** one shared film texture across set and product.

Exports: `web/*.jpg` (2400×1600, q90) and `web/*.webp` (1600 px wide).

**Limits:** these are composites of concept renders, finished to look photographic. They are not photos of a manufactured shoe. Resolution is bounded by the boards (about 1,300–1,500 px across each product).
