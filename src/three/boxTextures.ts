import * as THREE from "three";
import { CST_DETAIL, CST_PATH } from "@/components/art/cst";
import type { Colorway } from "@/lib/colorways";
import { display, mono, sans, yatra } from "@/lib/fonts";
import { ensureFonts, loadImage } from "./textures";

/**
 * Print artwork for the collectible box, composed on canvas from the same
 * ingredients as the shoe: the board render of the edition, the CST etching,
 * the red sun and the two-script lettering.
 */

const PAPER = "#eadfca";
const INK = "#24365f";
const RED = "#b3402d";

function grain(ctx: CanvasRenderingContext2D, w: number, h: number, amt = 14, seed = 9) {
  const img = ctx.getImageData(0, 0, w, h);
  let x = seed;
  for (let i = 0; i < img.data.length; i += 4) {
    x = (x * 1664525 + 1013904223) >>> 0;
    const n = ((x >>> 24) / 255 - 0.5) * amt;
    img.data[i] += n;
    img.data[i + 1] += n;
    img.data[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

function canvas(w: number, h: number, bg = PAPER) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  return { c, ctx };
}

function tex(c: HTMLCanvasElement) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function cst(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, color = INK, alpha = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s, s);
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.fill(new Path2D(CST_PATH));
  ctx.strokeStyle = PAPER;
  ctx.lineWidth = 2;
  ctx.stroke(new Path2D(CST_DETAIL));
  ctx.restore();
}

function star(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    const rr = i % 2 === 0 ? r : r * 0.24;
    ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function train(ctx: CanvasRenderingContext2D, x: number, y: number, len: number, h: number) {
  const car = h * 2.6;
  for (let cx = x; cx < x + len; cx += car + 6) {
    ctx.fillStyle = "#ebe1cd";
    ctx.fillRect(cx, y, car, h);
    ctx.fillStyle = RED;
    ctx.fillRect(cx, y + h * 0.62, car, h * 0.38);
    ctx.fillStyle = "#e0b33b";
    ctx.fillRect(cx, y + h * 0.58, car, h * 0.06);
    ctx.fillStyle = "#2a2a35";
    for (let wx = cx + h * 0.15; wx < cx + car - h * 0.3; wx += h * 0.42) ctx.fillRect(wx, y + h * 0.16, h * 0.26, h * 0.3);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 2;
    ctx.strokeRect(cx, y, car, h);
  }
}

function skyline(ctx: CanvasRenderingContext2D, w: number, base: number, scale: number) {
  ctx.fillStyle = INK;
  ctx.globalAlpha = 0.85;
  let x = 0;
  let i = 0;
  while (x < w) {
    const bw = (40 + ((i * 37) % 60)) * scale;
    const bh = (60 + ((i * 53) % 120)) * scale;
    ctx.fillRect(x, base - bh, bw - 4 * scale, bh);
    if (i % 5 === 2) {
      // palm
      ctx.fillRect(x + bw / 2, base - bh - 50 * scale, 3 * scale, 50 * scale);
      ctx.beginPath();
      ctx.ellipse(x + bw / 2, base - bh - 52 * scale, 22 * scale, 8 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    x += bw;
    i++;
  }
  ctx.globalAlpha = 1;
}

export type BoxTextures = Record<"lid" | "front" | "end" | "lidBand" | "inside" | "tissue" | "postcard" | "tag", THREE.CanvasTexture>;

async function build(cw: Colorway): Promise<BoxTextures> {
  await ensureFonts();
  const shoeImg = await loadImage(cw.renders[0].src);
  const stampImg = await loadImage(cw.id === "harbour" ? "/img/harbour-stamp.webp" : "/img/postcard-stamp.webp");

  /* lid poster — 3.5 × 2.1 */
  const L = canvas(1750, 1050);
  {
    const { ctx } = L;
    grain(ctx, 1750, 1050, 16);
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.arc(1330, 360, 230, 0, Math.PI * 2);
    ctx.fill();
    cst(ctx, 560, 120, 1.15, INK, 0.75);
    // shoe, multiplied into the paper like a print
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    const sw = 1300;
    const sh = (shoeImg.naturalHeight / shoeImg.naturalWidth) * sw;
    ctx.drawImage(shoeImg, 300, 1050 - sh - 70, sw, sh);
    ctx.restore();
    ctx.fillStyle = RED;
    ctx.font = `220px ${yatra.style.fontFamily}`;
    ctx.fillText("मुंबई", 80, 270);
    ctx.fillStyle = INK;
    ctx.font = `170px ${display.style.fontFamily}`;
    ctx.fillText("MUMBAI", 80, 430);
    ctx.font = `500 30px ${mono.style.fontFamily}`;
    ctx.fillStyle = "#1f1d1b";
    ctx.fillText("COMET · INDIA COLLECTION · VOL. 01", 86, 490);
    ctx.fillText(`${cw.name.toUpperCase()} EDITION`, 86, 535);
    star(ctx, 1640, 110, 46, INK);
    ctx.font = `600 34px ${sans.style.fontFamily}`;
    ctx.fillStyle = INK;
    ctx.textAlign = "right";
    ctx.fillText("SAME CITY. DIFFERENT STORIES.", 1680, 1010);
    ctx.textAlign = "left";
    ctx.strokeStyle = INK;
    ctx.lineWidth = 6;
    ctx.strokeRect(24, 24, 1702, 1002);
    ctx.lineWidth = 2;
    ctx.strokeRect(40, 40, 1670, 970);
  }

  /* long side — 3.4 × 1.25 */
  const F = canvas(1700, 625);
  {
    const { ctx } = F;
    grain(ctx, 1700, 625, 14, 4);
    skyline(ctx, 1700, 470, 1.4);
    cst(ctx, 900, 130, 0.8, INK, 1);
    ctx.fillStyle = RED;
    ctx.beginPath();
    ctx.arc(1480, 160, 80, 0, Math.PI * 2);
    ctx.fill();
    train(ctx, -40, 380, 1800, 92);
    ctx.fillStyle = "#1f1d1b";
    ctx.fillRect(0, 472, 1700, 6);
    ctx.fillStyle = INK;
    ctx.font = `120px ${yatra.style.fontFamily}`;
    ctx.fillText("मुंबई", 60, 170);
    ctx.font = `600 40px ${sans.style.fontFamily}`;
    ctx.fillText("SAME CITY. DIFFERENT STORIES.", 60, 570);
    star(ctx, 1620, 560, 26, INK);
  }

  /* end panel — 2.0 × 1.25, product information set like a ticket */
  const E = canvas(1000, 625);
  {
    const { ctx } = E;
    grain(ctx, 1000, 625, 14, 5);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, 920, 545);
    ctx.setLineDash([10, 8]);
    ctx.beginPath();
    ctx.moveTo(40, 200);
    ctx.lineTo(960, 200);
    ctx.moveTo(40, 430);
    ctx.lineTo(960, 430);
    ctx.stroke();
    ctx.setLineDash([]);
    star(ctx, 110, 120, 40, INK);
    ctx.fillStyle = INK;
    ctx.font = `64px ${display.style.fontFamily}`;
    ctx.fillText("COMET", 170, 140);
    ctx.font = `500 26px ${mono.style.fontFamily}`;
    ctx.fillText("MUMBAI IN MOTION", 600, 140);
    ctx.fillStyle = "#1f1d1b";
    const rows = [
      ["EDITION", cw.name.toUpperCase()],
      ["STYLE", "LOW-TOP COURT"],
      ["SIZE", "UK 8 · EU 42 · US 9"],
      ["ORIGIN", "19.0760° N, 72.8777° E"],
    ];
    rows.forEach(([k, v], i) => {
      ctx.fillStyle = "#7a7268";
      ctx.fillText(k, 80, 250 + i * 46);
      ctx.fillStyle = "#1f1d1b";
      ctx.fillText(v, 330, 250 + i * 46);
    });
    ctx.fillStyle = RED;
    ctx.font = `600 26px ${mono.style.fontFamily}`;
    ctx.fillText("DESIGN CONCEPT — NOT FOR SALE", 80, 500);
    ctx.fillStyle = INK;
    ctx.font = `60px ${yatra.style.fontFamily}`;
    ctx.fillText(cw.hindi, 80, 568);
  }

  /* lid band */
  const B = canvas(1400, 140, INK);
  {
    const { ctx } = B;
    ctx.fillStyle = PAPER;
    ctx.font = `600 52px ${sans.style.fontFamily}`;
    let x = 30;
    for (let i = 0; i < 8; i++) {
      ctx.fillText("COMET", x, 92);
      x += 200;
      star(ctx, x, 74, 18, PAPER);
      x += 44;
      ctx.font = `52px ${yatra.style.fontFamily}`;
      ctx.fillText("मुंबई", x, 92);
      ctx.font = `600 52px ${sans.style.fontFamily}`;
      x += 170;
    }
  }

  /* kraft interior with a skyline along the rim */
  const I = canvas(1024, 512, "#c8a676");
  {
    const { ctx } = I;
    grain(ctx, 1024, 512, 22, 6);
    ctx.save();
    ctx.translate(0, 0);
    skyline(ctx, 1024, 120, 0.8);
    ctx.restore();
  }

  /* indigo toile tissue (tileable) */
  const T = canvas(512, 512, "#f1ebde");
  {
    const { ctx } = T;
    ctx.strokeStyle = INK;
    ctx.fillStyle = INK;
    ctx.lineWidth = 2.2;
    ctx.globalAlpha = 0.75;
    const motif = (x: number, y: number, k: number) => {
      ctx.save();
      ctx.translate(x, y);
      if (k === 0) {
        // palm
        ctx.beginPath();
        ctx.moveTo(0, 40);
        ctx.quadraticCurveTo(6, 10, 0, -20);
        ctx.stroke();
        for (let a = -2.6; a < -0.4; a += 0.45) {
          ctx.beginPath();
          ctx.moveTo(0, -20);
          ctx.quadraticCurveTo(Math.cos(a) * 20, -20 + Math.sin(a) * 26, Math.cos(a) * 34, -12 + Math.sin(a) * 18);
          ctx.stroke();
        }
      } else if (k === 1) {
        // train car
        ctx.strokeRect(-40, -14, 80, 28);
        for (let i = -32; i < 32; i += 14) ctx.strokeRect(i, -8, 8, 10);
        ctx.beginPath();
        ctx.moveTo(-44, 18);
        ctx.lineTo(44, 18);
        ctx.stroke();
      } else if (k === 2) {
        ctx.scale(0.09, 0.09);
        ctx.translate(-500, -300);
        ctx.fill(new Path2D(CST_PATH));
      } else {
        // waves and a boat
        for (let i = 0; i < 3; i++) {
          ctx.beginPath();
          ctx.moveTo(-40, i * 8);
          for (let xx = -40; xx <= 40; xx += 10) ctx.quadraticCurveTo(xx + 5, i * 8 - 5, xx + 10, i * 8);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(-16, -6);
        ctx.lineTo(16, -6);
        ctx.lineTo(10, 2);
        ctx.lineTo(-10, 2);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.restore();
    };
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) motif(64 + c * 128 + (r % 2) * 64, 64 + r * 128, (r + c) % 4);
  }
  const tissue = tex(T.c);
  tissue.wrapS = tissue.wrapT = THREE.RepeatWrapping;
  tissue.repeat.set(2.5, 2.5);

  /* the postcard insert uses the board's stamp artwork */
  const P = canvas(560, 760, PAPER);
  {
    const { ctx } = P;
    ctx.drawImage(stampImg, 0, 0, 560, 760);
  }

  /* hang tag: a ticket */
  const G = canvas(320, 560, "#efe1c4");
  {
    const { ctx } = G;
    grain(ctx, 320, 560, 12, 7);
    ctx.fillStyle = "#c9b48c";
    ctx.beginPath();
    ctx.arc(160, 50, 18, 0, Math.PI * 2);
    ctx.fill();
    star(ctx, 160, 150, 40, INK);
    ctx.fillStyle = INK;
    ctx.textAlign = "center";
    ctx.font = `48px ${display.style.fontFamily}`;
    ctx.fillText("COMET", 160, 250);
    ctx.font = `500 20px ${mono.style.fontFamily}`;
    ctx.fillText("19.0760° N", 160, 300);
    ctx.fillText("72.8777° E", 160, 328);
    ctx.fillStyle = RED;
    ctx.font = `40px ${yatra.style.fontFamily}`;
    ["वड़ा पाव", "लोकल", "क्रिकेट", "मुंबई"].forEach((w, i) => ctx.fillText(w, 160, 400 + i * 42));
  }

  return {
    lid: tex(L.c),
    front: tex(F.c),
    end: tex(E.c),
    lidBand: tex(B.c),
    inside: tex(I.c),
    tissue,
    postcard: tex(P.c),
    tag: tex(G.c),
  };
}

const cache = new Map<string, Promise<BoxTextures>>();
export function boxTextures(cw: Colorway) {
  let p = cache.get(cw.id);
  if (!p) {
    p = build(cw);
    cache.set(cw.id, p);
  }
  return p;
}
