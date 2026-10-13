import * as THREE from "three";
import type { Colorway, SideSource } from "@/lib/colorways";
import { display, mono, yatra } from "@/lib/fonts";
import { collarHeight, heightAt, opening, sForHeight, smooth } from "./shoeGeometry";

/**
 * Canvas-generated textures. The upper's artwork is not redrawn: each board
 * photo is projected onto the parametric upper (pixel by pixel, through the
 * same height function the geometry uses), so the 3D shoe always carries the
 * exact artwork of its concept board.
 */

const imageCache = new Map<string, Promise<HTMLImageElement>>();
export function loadImage(src: string) {
  let p = imageCache.get(src);
  if (!p) {
    p = new Promise((resolve, reject) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
    imageCache.set(src, p);
  }
  return p;
}

const pixelCache = new Map<string, Promise<ImageData>>();
function loadPixels(src: string) {
  let p = pixelCache.get(src);
  if (!p) {
    p = loadImage(src).then((img) => {
      const c = document.createElement("canvas");
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      const ctx = c.getContext("2d", { willReadFrequently: true })!;
      ctx.drawImage(img, 0, 0);
      return ctx.getImageData(0, 0, c.width, c.height);
    });
    pixelCache.set(src, p);
  }
  return p;
}

let fontsReady: Promise<unknown> | null = null;
export function ensureFonts() {
  fontsReady ??= Promise.all([
    document.fonts.load(`64px ${display.style.fontFamily}`),
    document.fonts.load(`64px ${yatra.style.fontFamily}`, "मुंबई"),
    document.fonts.load(`24px ${mono.style.fontFamily}`),
  ]).catch(() => null);
  return fontsReady;
}

const hex = (h: string) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255] as const;
};

function finish(canvas: HTMLCanvasElement, srgb = true) {
  const t = new THREE.CanvasTexture(canvas);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

/** Paper/canvas fibre noise drawn straight into image data. */
function addGrain(d: Uint8ClampedArray, amount: number, seed = 7) {
  let x = seed;
  for (let i = 0; i < d.length; i += 4) {
    x = (x * 1664525 + 1013904223) >>> 0;
    const n = ((x >>> 24) / 255 - 0.5) * amount;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
}

const W = 2048;
const H = 1024;
/** canvas y for a given s on the upper texture */
const yOfS = (s: number) => (1 - s) * (H / 2);

function projectSide(out: Uint8ClampedArray, src: ImageData, side: SideSource, sideSign: 1 | -1) {
  const collar0 = collarHeight(0);
  const y0 = sideSign === 1 ? 0 : H / 2;
  const y1 = sideSign === 1 ? H / 2 : H;
  for (let y = y0; y < y1; y++) {
    const s = 1 - y / (H / 2);
    const as = Math.abs(s);
    for (let x = 0; x < W; x++) {
      const u = x / W;
      // the vamp top is seen from above, not in the side photo: fade the projection out there
      const fore = smooth(0.5, 0.75, u);
      // keep the photo's laces and eyelets off the eyestay: fade wider around the throat
      const throat = smooth(0.27, 0.36, u) * (1 - smooth(0.6, 0.7, u));
      const thr = opening(u) + 0.12 + 0.36 * throat + 0.25 * fore;
      const wTop = smooth(thr, thr + 0.22, as);
      if (wTop <= 0) continue;
      const h = heightAt(u, s);
      const px = side.heelX + u * (side.toeX - side.heelX);
      const py = side.baseY - (h / collar0) * (side.baseY - side.collarY);
      const ix = Math.round(px);
      const iy = Math.round(py);
      if (ix < 0 || iy < 0 || ix >= src.width || iy >= src.height) continue;
      const w = wTop * smooth(0, 0.025, u) * (1 - smooth(0.975, 1, u));
      const si = (iy * src.width + ix) * 4;
      const oi = (y * W + x) * 4;
      out[oi] = out[oi] * (1 - w) + src.data[si] * w;
      out[oi + 1] = out[oi + 1] * (1 - w) + src.data[si + 1] * w;
      out[oi + 2] = out[oi + 2] * (1 - w) + src.data[si + 2] * w;
    }
  }
}

/** Where the board's star sits on our model, so the 3D patch covers it. */
export function starPlacement(side: SideSource, sideSign: 1 | -1) {
  const u = (side.star.x - side.heelX) / (side.toeX - side.heelX);
  const h = ((side.baseY - side.star.y) / (side.baseY - side.collarY)) * collarHeight(0);
  const s = sForHeight(u, h, sideSign);
  const size = (side.star.w / Math.abs(side.toeX - side.heelX)) * 2.8;
  return { u, s, size };
}

async function drawDecal(ctx: CanvasRenderingContext2D, src: string, side: "lateral" | "medial", u: [number, number], yb: [number, number]) {
  const img = await loadImage(src);
  const sign = side === "lateral" ? 1 : -1;
  const um = (u[0] + u[1]) / 2;
  const sLow = sForHeight(um, yb[0], sign);
  const sHigh = sForHeight(um, yb[1], sign);
  const x0 = u[0] * W;
  const x1 = u[1] * W;
  const ya = yOfS(sLow);
  const yb2 = yOfS(sHigh);
  const top = Math.min(ya, yb2);
  const hgt = Math.abs(ya - yb2);
  const wdt = x1 - x0;

  // feathered copy of the decal
  const tmp = document.createElement("canvas");
  tmp.width = Math.max(2, Math.round(wdt));
  tmp.height = Math.max(2, Math.round(hgt));
  const t = tmp.getContext("2d")!;
  t.drawImage(img, 0, 0, tmp.width, tmp.height);
  t.globalCompositeOperation = "destination-in";
  const g = t.createRadialGradient(tmp.width / 2, tmp.height / 2, Math.min(tmp.width, tmp.height) * 0.3, tmp.width / 2, tmp.height / 2, Math.max(tmp.width, tmp.height) * 0.62);
  g.addColorStop(0, "rgba(0,0,0,1)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  t.fillStyle = g;
  t.fillRect(0, 0, tmp.width, tmp.height);

  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  if (side === "lateral") {
    // canvas-down is shoe-up on the lateral half: flip vertically
    ctx.translate(x0, top + hgt);
    ctx.scale(1, -1);
  } else {
    // the medial side is seen from -z: flip horizontally
    ctx.translate(x0 + wdt, top);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(tmp, 0, 0, wdt, hgt);
  ctx.restore();
}

function drawStitching(ctx: CanvasRenderingContext2D, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2;
  ctx.setLineDash([9, 7]);
  ctx.lineCap = "round";
  // along the sole edge, both sides
  for (const s of [0.94, 0.9, -0.94, -0.9]) {
    ctx.beginPath();
    ctx.moveTo(0, yOfS(s));
    ctx.lineTo(W, yOfS(s));
    ctx.stroke();
  }
  // eyestay: follows the lace throat edge
  for (const sign of [1, -1]) {
    for (const off of [0.15, 0.18]) {
      ctx.beginPath();
      for (let x = 0.3 * W; x <= 0.64 * W; x += 8) {
        const u = x / W;
        const s = sign * (opening(u) + off);
        if (x === 0.3 * W) ctx.moveTo(x, yOfS(s));
        else ctx.lineTo(x, yOfS(s));
      }
      ctx.stroke();
    }
  }
  // toe-cap seam: a curve across the vamp
  ctx.beginPath();
  for (let y = yOfS(0.88); y <= yOfS(-0.88); y += 6) {
    const s = 1 - y / (H / 2);
    const x = (0.79 + 0.06 * (1 - Math.abs(s))) * W;
    if (y === yOfS(0.88)) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawPerforations(ctx: CanvasRenderingContext2D) {
  ctx.save();
  ctx.fillStyle = "rgba(40, 30, 20, 0.55)";
  for (let x = 0.84 * W; x < 0.96 * W; x += 22) {
    for (let y = yOfS(0.26); y < yOfS(-0.26); y += 22) {
      const row = Math.round((y - yOfS(0.26)) / 22);
      const xx = x + (row % 2 ? 11 : 0);
      ctx.beginPath();
      ctx.ellipse(xx, y, 3.2, 3.6, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

export type ShoeTextures = {
  upper: THREE.CanvasTexture;
  upperBump: THREE.CanvasTexture;
  heel: THREE.CanvasTexture;
  tongue: THREE.CanvasTexture;
  outsole: THREE.CanvasTexture;
  medallion: THREE.CanvasTexture;
  /** star placements read off the boards */
  stars: { u: number; s: number; size: number }[];
  /** the flat upper artwork, for the chapter-05 graphic breakdown */
  flatUrl: string;
};

async function buildUpperCanvas(cw: Colorway) {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = cw.colors.canvas;
  ctx.fillRect(0, 0, W, H);
  const img = ctx.getImageData(0, 0, W, H);
  addGrain(img.data, 10);

  const sides: [SideSource | undefined, 1 | -1][] = [
    [cw.lateral, 1],
    [cw.medial, -1],
  ];
  for (const [side, sign] of sides) {
    if (!side) continue;
    const px = await loadPixels(side.board);
    projectSide(img.data, px, side, sign);
  }
  ctx.putImageData(img, 0, 0);

  for (const d of cw.decals) await drawDecal(ctx, d.img, d.side, d.u, d.y);

  // a quiet hand-lettered tag on the medial heel when that side has no board art
  if (!cw.medial) {
    ctx.save();
    ctx.translate(0.29 * W, yOfS(sForHeight(0.29, 0.6, -1)));
    ctx.scale(-1, 1);
    ctx.fillStyle = "#b3402d";
    ctx.font = `64px ${yatra.style.fontFamily}`;
    ctx.textAlign = "center";
    ctx.fillText("मुंबई लोकल", 0, 0);
    ctx.restore();
  }

  drawPerforations(ctx);
  const [r, g, b] = hex(cw.colors.canvas);
  drawStitching(ctx, `rgba(${r * 0.55}, ${g * 0.52}, ${b * 0.48}, 0.75)`);
  return c;
}

function buildBump() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, 256, 256);
  // plain-weave canvas: alternating warp/weft ridges
  for (let y = 0; y < 256; y += 4) {
    for (let x = 0; x < 256; x += 4) {
      const on = ((x >> 2) + (y >> 2)) % 2 === 0;
      ctx.fillStyle = on ? "#9a9a9a" : "#6a6a6a";
      ctx.fillRect(x, y, on ? 4 : 3, on ? 3 : 4);
    }
  }
  const img = ctx.getImageData(0, 0, 256, 256);
  addGrain(img.data, 30, 3);
  ctx.putImageData(img, 0, 0);
  const t = finish(c, false);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(70, 36);
  return t;
}

function buildHeel(cw: Colorway) {
  const c = document.createElement("canvas");
  c.width = c.height = 512;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = cw.colors.heel;
  ctx.fillRect(0, 0, 512, 512);
  const img = ctx.getImageData(0, 0, 512, 512);
  addGrain(img.data, 22, 11); // suede nap
  ctx.putImageData(img, 0, 0);
  const cream = "#ece2cc";
  ctx.fillStyle = cream;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `58px ${display.style.fontFamily}`;
  ctx.fillText(cw.heelText, 256, 182);
  // small four-point star above the word
  ctx.save();
  ctx.translate(256, 100);
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? 22 : 5;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  // embroidered outline stitch
  ctx.strokeStyle = "rgba(236, 226, 204, 0.45)";
  ctx.setLineDash([7, 6]);
  ctx.lineWidth = 2.5;
  ctx.strokeRect(14, 14, 484, 484);
  return finish(c);
}

function buildTongue(cw: Colorway) {
  const c = document.createElement("canvas");
  c.width = 256;
  c.height = 512;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = cw.colors.collar;
  ctx.fillRect(0, 0, 256, 512);
  const img = ctx.getImageData(0, 0, 256, 512);
  addGrain(img.data, 10, 5);
  ctx.putImageData(img, 0, 0);
  // woven label near the top of the tongue
  ctx.fillStyle = cw.colors.heel;
  ctx.fillRect(58, 26, 140, 92);
  ctx.strokeStyle = "rgba(236,226,204,.6)";
  ctx.setLineDash([4, 4]);
  ctx.strokeRect(64, 32, 128, 80);
  ctx.fillStyle = "#ece2cc";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `600 24px ${mono.style.fontFamily}`;
  ctx.fillText("COMET", 128, 60);
  ctx.font = `20px ${yatra.style.fontFamily}`;
  ctx.fillText("मुंबई", 128, 92);
  return finish(c);
}

function buildOutsole(cw: Colorway) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = cw.colors.outsole;
  ctx.fillRect(0, 0, 128, 128);
  // herringbone traction
  ctx.strokeStyle = "rgba(0,0,0,0.38)";
  ctx.lineWidth = 5;
  for (let y = -32; y < 160; y += 16) {
    ctx.beginPath();
    for (let x = 0; x <= 128; x += 32) {
      ctx.lineTo(x, y);
      ctx.lineTo(x + 16, y + 14);
    }
    ctx.stroke();
  }
  const t = finish(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(5, 5);
  return t;
}

function buildMedallion(cw: Colorway) {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.translate(128, 128);
  ctx.fillStyle = cw.colors.outsole;
  ctx.beginPath();
  ctx.arc(0, 0, 120, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,.35)";
  ctx.lineWidth = 6;
  ctx.stroke();
  ctx.fillStyle = "rgba(0,0,0,.3)";
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 === 0 ? 92 : 22;
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.fill();
  ctx.font = `600 22px ${mono.style.fontFamily}`;
  ctx.textAlign = "center";
  ctx.fillText("COMET · BOM", 0, 108);
  return finish(c);
}

const cache = new Map<string, Promise<ShoeTextures>>();
export function shoeTextures(cw: Colorway): Promise<ShoeTextures> {
  let p = cache.get(cw.id);
  if (!p) {
    p = (async () => {
      await ensureFonts();
      const upperCanvas = await buildUpperCanvas(cw);
      const stars = [starPlacement(cw.lateral, 1)];
      stars.push(cw.medial ? starPlacement(cw.medial, -1) : { ...stars[0], s: -stars[0].s });
      return {
        upper: finish(upperCanvas),
        upperBump: buildBump(),
        heel: buildHeel(cw),
        tongue: buildTongue(cw),
        outsole: buildOutsole(cw),
        medallion: buildMedallion(cw),
        stars,
        flatUrl: upperCanvas.toDataURL("image/webp", 0.85),
      };
    })();
    cache.set(cw.id, p);
  }
  return p;
}
