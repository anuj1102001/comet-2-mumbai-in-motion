// Studio staging for the product photographs.
// Takes Photoshop cutouts (design/photo/cut/*.png, made with Adobe's background
// removal) and places them on a seamless paper sweep with a key light, contact
// and cast shadows and a lens-like falloff. The product pixels are never
// redrawn: only the set, the light and the shadows are added here; the final
// colour grade and grain are applied in Adobe Lightroom afterwards.
// node scripts/photo.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const CUT = "design/photo/cut";
const OUT = "design/photo/staged";
mkdirSync(OUT, { recursive: true });

const W = 2400;
const H = 1600;

/** Seamless sweep: wall falling into a floor, with a soft key light from upper left. */
async function sweep({ wall, floor, horizon = 0.58, key = { x: 0.3, y: 0.18 }, keyStrength = 0.16, vignette = 0.32 }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${wall[0]}"/>
        <stop offset="${horizon - 0.08}" stop-color="${wall[1]}"/>
        <stop offset="${horizon + 0.06}" stop-color="${floor[0]}"/>
        <stop offset="1" stop-color="${floor[1]}"/>
      </linearGradient>
      <radialGradient id="k" cx="${key.x}" cy="${key.y}" r="0.75">
        <stop offset="0" stop-color="#fffaf0" stop-opacity="${keyStrength}"/>
        <stop offset="1" stop-color="#fffaf0" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="v" cx="0.5" cy="0.55" r="0.78">
        <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
        <stop offset="1" stop-color="#000" stop-opacity="${vignette}"/>
      </radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <rect width="100%" height="100%" fill="url(#k)"/>
    <rect width="100%" height="100%" fill="url(#v)"/>
  </svg>`;
  // paper fibre: low-amplitude noise, blurred so it reads as texture, not grain
  const noise = await sharp({ create: { width: W / 4, height: H / 4, channels: 3, noise: { type: "gaussian", mean: 128, sigma: 10 } } })
    .resize(W, H)
    .blur(1.2)
    .png()
    .toBuffer();
  return sharp(Buffer.from(svg))
    .composite([{ input: noise, blend: "soft-light" }])
    .png()
    .toBuffer();
}

/** Trim transparent margins so the bottom of the image is the bottom of the sole. */
async function product(name, width) {
  const trimmed = await sharp(`${CUT}/${name}.png`).trim({ threshold: 1 }).png().toBuffer();
  const img = sharp(trimmed).resize({ width });
  const buf = await img.png().toBuffer();
  const m = await sharp(buf).metadata();
  return { buf, w: m.width, h: m.height };
}

/** Lowest opaque pixel in each column: the line where the product meets the floor. */
async function bottomContour(p) {
  const { data, info } = await sharp(p.buf).extractChannel("alpha").raw().toBuffer({ resolveWithObject: true });
  const pts = [];
  for (let x = 0; x < info.width; x += 4) {
    for (let y = info.height - 1; y >= 0; y--) {
      if (data[y * info.width + x] > 140) {
        pts.push([x, y]);
        break;
      }
    }
  }
  return pts;
}

/**
 * Shadows drawn along the product's real bottom edge: a tight, dark contact
 * line where it touches the floor and a broad, soft cast shadow falling away
 * from a key light at upper left. Works for a side-on shoe and an angled box.
 */
async function stage(p, x, floorY, { cast = 1 } = {}) {
  const top = floorY - p.h;
  const pts = await bottomContour(p);
  const at = ([px, py], ox = 0, oy = 0) => `${(x + px + ox).toFixed(1)} ${(top + py + oy).toFixed(1)}`;
  const edge = pts.map((pt, i) => `${i ? "L" : "M"}${at(pt)}`).join("");
  // cast polygon: the contour, then the same contour pushed back and down-right
  const back = [...pts].reverse().map((pt) => `L${at(pt, 70 * cast, 26 * cast)}`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
    <defs>
      <filter id="soft" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="${26 * cast}"/></filter>
      <filter id="tight" x="-5%" y="-50%" width="110%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
    </defs>
    <path d="${edge}${back}Z" fill="#2a1a0e" fill-opacity="0.34" filter="url(#soft)"/>
    <path d="${edge}" fill="none" stroke="#1c120a" stroke-opacity="0.7" stroke-width="9" stroke-linecap="round" filter="url(#tight)"/>
  </svg>`;
  return [
    { input: Buffer.from(svg), left: 0, top: 0 },
    { input: p.buf, left: Math.round(x), top: Math.round(top) },
  ];
}

const CREAM = { wall: ["#d9cdb6", "#e8decb"], floor: ["#ece3d2", "#d8ccb4"] };
const NAVY = { wall: ["#141b2b", "#1f2a40"], floor: ["#26324a", "#141b2b"], keyStrength: 0.1, vignette: 0.45 };
const TERRA = { wall: ["#9a4a33", "#b3573c"], floor: ["#bb6145", "#8f4330"], keyStrength: 0.14, vignette: 0.4 };

async function shoot(name, bg, layers) {
  const base = await sweep(bg);
  await sharp(base).composite(layers.flat()).png().toFile(`${OUT}/${name}.png`);
  console.log("staged", name);
}

// 01 — hero: Platform Local, lateral, centred on cream
{
  const p = await product("local-lateral", 1500);
  await shoot("01-local-lateral-hero", CREAM, await stage(p, (W - p.w) / 2, 1215));
}
// 02 — Platform Local, medial
{
  const p = await product("local-medial", 1480);
  await shoot("02-local-medial", CREAM, await stage(p, (W - p.w) / 2, 1215));
}
// 03 — Postcard edition, lateral
{
  const p = await product("postcard-shoe", 1500);
  await shoot("03-postcard-lateral", CREAM, await stage(p, (W - p.w) / 2, 1225));
}
// 04 — Harbour on a deep navy set; the board crops the heel, so the heel runs off the right edge
{
  const p = await product("harbour-lateral", 2050);
  await shoot("04-harbour-closeup", NAVY, await stage(p, W - p.w + 60, 1260));
}
// 05 — packaging hero on terracotta
{
  const b = await product("box-closed", 1500);
  await shoot("05-box-terracotta", TERRA, await stage(b, (W - b.w) / 2, 1330));
}
// 06 — campaign: box behind, Platform Local in front
{
  const b = await product("box-closed", 1250);
  const s = await product("local-lateral", 1350);
  await shoot("06-campaign-box-and-shoe", CREAM, [...(await stage(b, 1020, 1120)), ...(await stage(s, 170, 1360))]);
}
