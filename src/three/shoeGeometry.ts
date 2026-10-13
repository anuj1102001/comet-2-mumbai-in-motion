import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

/**
 * Parametric low-top court sneaker.
 *
 * The upper is a loft along the length of the shoe:
 *   u ∈ [0, 1]  heel → toe            (world x)
 *   s ∈ [-1, 1] medial edge → over the top → lateral edge
 * Each cross-section is a superellipse arch standing on the footprint. A
 * per-u "opening" s0(u) removes the top of the arch for the collar and lace
 * throat. Everything else (heel tab, star, laces, hotspots) is placed with
 * the same functions, so every part stays locked to the same surface.
 */

export const LENGTH = 2.8;
export const SOLE_H = 0.23;
export const GUM_H = 0.065;
/** superellipse exponent: boxy through the quarters, rounder at the toe */
export function nAt(u: number) {
  return 3.3 - 1.1 * smooth(0.55, 1, u);
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
export const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Half width of the footprint. */
export function halfWidth(u: number) {
  const t = 2 * u - 1;
  const e = t > 0 ? 2.2 : 2.6; // rounder toe, squarer heel
  const ends = Math.pow(Math.max(0, 1 - Math.pow(Math.abs(t), e)), 1 / e);
  const bulge = 0.37 + 0.1 * smooth(0.12, 0.66, u) - 0.035 * smooth(0.78, 1, u);
  return ends * bulge;
}

/** Height of the closed arch above the sole at u. */
export function archHeight(u: number) {
  const h = 0.82 - 0.3 * smooth(0.3, 0.7, u) - 0.26 * smooth(0.62, 1.05, u);
  // round the toe off like a bumper instead of ending in a vertical wall
  const t = Math.max(0, (u - 0.84) / 0.16);
  return h * Math.sqrt(Math.max(0.03, 1 - t * t));
}

/** Height of the collar edge (top line) above the sole in the open region. */
export function collarHeight(u: number) {
  return 0.77 - 0.17 * smooth(0.03, 0.2, u) + 0.05 * smooth(0.2, 0.33, u);
}

/** Half-width of the opening in s. 0 means closed (vamp / toe box). */
export function opening(u: number) {
  const H = archHeight(u);
  const r = Math.min(0.999, collarHeight(u) / H);
  const collar = Math.acos(Math.pow(r, nAt(u) / 2)) / (Math.PI / 2);
  const throat = 0.15 * (1 - smooth(0.5, 0.6, u));
  return lerp(collar, throat, smooth(0.27, 0.38, u));
}

/** Toe spring: lifts the front of the whole shoe slightly. */
export const toeSpring = (u: number) => 0.07 * Math.pow(smooth(0.72, 1.02, u), 2);

/** Height above the sole top for (u, s). */
export function heightAt(u: number, s: number) {
  const phi = (s * Math.PI) / 2;
  return archHeight(u) * Math.pow(Math.abs(Math.cos(phi)), 2 / nAt(u));
}

/** Point on the upper surface. `inset` shrinks the section (for tongue/lining). */
export function upperPoint(u: number, s: number, out = new THREE.Vector3(), inset = 0) {
  const phi = (s * Math.PI) / 2;
  const w = Math.max(0, halfWidth(u) - inset);
  const H = Math.max(0, archHeight(u) - inset);
  const N = nAt(u);
  const z = w * Math.sign(s) * Math.pow(Math.abs(Math.sin(phi)), 2 / N);
  // slight outward belly at mid height, like canvas stretched over a last
  const belly = 1 + 0.06 * Math.sin(Math.PI * clamp01(1 - Math.abs(s))) * (1 - Math.abs(s));
  const y = H * Math.pow(Math.abs(Math.cos(phi)), 2 / N);
  return out.set((u - 0.5) * LENGTH, SOLE_H + y + toeSpring(u), z * belly);
}

/** Outward unit normal on the upper (finite differences). */
export function upperNormal(u: number, s: number, out = new THREE.Vector3()) {
  const e = 0.002;
  const a = upperPoint(Math.min(1, u + e), s, new THREE.Vector3());
  const b = upperPoint(Math.max(0, u - e), s, new THREE.Vector3());
  const c = upperPoint(u, Math.min(1, s + e), new THREE.Vector3());
  const d = upperPoint(u, Math.max(-1, s - e), new THREE.Vector3());
  const du = a.sub(b);
  const ds = c.sub(d);
  out.crossVectors(du, ds).normalize();
  const p = upperPoint(u, s, new THREE.Vector3());
  const center = new THREE.Vector3(p.x, SOLE_H + 0.25, 0);
  if (out.dot(p.sub(center)) < 0) out.negate();
  return out;
}

/** Find s on one side whose height above the sole equals y (for placing things by height). */
export function sForHeight(u: number, y: number, side: 1 | -1) {
  const H = archHeight(u);
  const r = clamp01(y / H);
  return side * (Math.acos(Math.pow(r, nAt(u) / 2)) / (Math.PI / 2));
}

/**
 * Upper geometry. UV: x = u, y = (s + 1) / 2 — so a 2:1 canvas holds the
 * lateral half on top (y 0 → 512 = sole edge → top seam) and the medial half
 * below (512 → 1024 = top seam → sole edge).
 */
export function buildUpper({ segU = 180, segK = 44, inset = 0 } = {}) {
  const cols = segK * 2 + 2; // medial half (bottom→top), lateral half (top→bottom)
  const pos: number[] = [];
  const uv: number[] = [];
  const s0s: number[] = [];
  const p = new THREE.Vector3();
  for (let i = 0; i <= segU; i++) {
    const u = i / segU;
    const s0 = opening(u);
    s0s.push(s0);
    for (let j = 0; j < cols; j++) {
      let s: number;
      if (j <= segK) {
        const k = 1 - j / segK; // 1 at bottom, 0 at top edge
        s = -(s0 + (1 - s0) * k);
      } else {
        const k = (j - segK - 1) / segK;
        s = s0 + (1 - s0) * k;
      }
      upperPoint(u, s, p, inset);
      pos.push(p.x, p.y, p.z);
      uv.push(u, (s + 1) / 2);
    }
  }
  const idx: number[] = [];
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < cols - 1; j++) {
      // bridge across the top only where the shoe is closed
      if (j === segK && (s0s[i] > 1e-4 || s0s[i + 1] > 1e-4)) continue;
      const a = i * cols + j;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      idx.push(a, b, c, b, d, c);
    }
  }
  let g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g = mergeVertices(g, 1e-5);
  g.computeVertexNormals();
  return g;
}

/**
 * Heel counter overlay: a patch of the upper offset outward, with UVs
 * projected from behind so the heel lettering reads straight on.
 */
export function buildHeelTab({ segU = 40, segK = 30 } = {}) {
  const uMax = 0.2;
  const pos: number[] = [];
  const uv: number[] = [];
  const p = new THREE.Vector3();
  const n = new THREE.Vector3();
  const cols = segK * 2 + 2;
  for (let i = 0; i <= segU; i++) {
    const u = (i / segU) * uMax;
    const s0 = opening(u);
    // depth of the tab below the collar shrinks toward the front — a swept curve
    const t = u / uMax;
    const kMax = lerp(0.62, 0.05, Math.pow(t, 1.6));
    for (let j = 0; j < cols; j++) {
      let s: number;
      if (j <= segK) {
        const k = (1 - j / segK) * kMax;
        s = -(s0 + (1 - s0) * k);
      } else {
        const k = ((j - segK - 1) / segK) * kMax;
        s = s0 + (1 - s0) * k;
      }
      upperPoint(u, s, p);
      upperNormal(Math.max(u, 0.004), s, n);
      p.addScaledVector(n, 0.007);
      pos.push(p.x, p.y, p.z);
      uv.push(0.5 + p.z / 0.72, (p.y - SOLE_H - 0.1) / 0.72);
    }
  }
  const idx: number[] = [];
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < cols - 1; j++) {
      if (j === segK) continue;
      const a = i * cols + j;
      idx.push(a, a + 1, a + cols, a + 1, a + cols + 1, a + cols);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Tongue: a narrow arch inside the throat that rises above the collar at the top. */
export function buildTongue({ segU = 60, segS = 24 } = {}) {
  const u0 = 0.23;
  const u1 = 0.62;
  const pos: number[] = [];
  const uv: number[] = [];
  const p = new THREE.Vector3();
  for (let i = 0; i <= segU; i++) {
    const t = i / segU;
    const u = lerp(u0, u1, t);
    const lift = 0.035 * Math.pow(1 - smooth(0.0, 0.45, t), 1.4);
    const back = -0.05 * Math.pow(1 - smooth(0.0, 0.35, t), 2);
    const half = 0.3 + 0.04 * Math.sin(Math.PI * t);
    for (let j = 0; j <= segS; j++) {
      const s = lerp(-half, half, j / segS);
      upperPoint(u, s, p, 0.012);
      p.y += lift;
      p.x += back;
      pos.push(p.x, p.y, p.z);
      // flipped so the label reads correctly when seen from the toe end
      uv.push(1 - j / segS, 1 - t);
    }
  }
  const idx: number[] = [];
  for (let i = 0; i < segU; i++) {
    for (let j = 0; j < segS; j++) {
      const a = i * (segS + 1) + j;
      const c = a + segS + 1;
      idx.push(a, c, a + 1, a + 1, c, c + 1);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

/** Padded collar: a tube that runs along the collar edge round the heel. */
export function buildCollar() {
  const pts: THREE.Vector3[] = [];
  const uEnd = 0.36;
  const steps = 40;
  for (let i = steps; i >= 0; i--) {
    const u = (i / steps) * uEnd;
    pts.push(upperPoint(u, -opening(u), new THREE.Vector3()));
  }
  for (let i = 1; i <= steps; i++) {
    const u = (i / steps) * uEnd;
    pts.push(upperPoint(u, opening(u), new THREE.Vector3()));
  }
  pts.forEach((v) => {
    v.y += 0.01;
  });
  const curve = new THREE.CatmullRomCurve3(pts, false, "centripetal");
  return new THREE.TubeGeometry(curve, 160, 0.034, 12, false);
}

/** Lace eyelet positions and bar laces across the throat. */
export function laceLayout(count = 6) {
  const rows: { a: THREE.Vector3; b: THREE.Vector3; mid: THREE.Vector3; u: number; na: THREE.Vector3; nb: THREE.Vector3 }[] = [];
  for (let i = 0; i < count; i++) {
    const u = lerp(0.34, 0.57, i / (count - 1));
    const s = opening(u) + 0.075;
    const a = upperPoint(u, -s, new THREE.Vector3());
    const b = upperPoint(u, s, new THREE.Vector3());
    const na = upperNormal(u, -s, new THREE.Vector3());
    const nb = upperNormal(u, s, new THREE.Vector3());
    const mid = upperPoint(u, 0, new THREE.Vector3(), 0.012);
    mid.y += 0.022 + 0.022 * (1 - i / (count - 1));
    rows.push({ a: a.addScaledVector(na, 0.012), b: b.addScaledVector(nb, 0.012), mid, u, na, nb });
  }
  return rows;
}

/** Footprint outline for the sole (closed, counter-clockwise in x/z). */
export function soleOutline(scale = 1.09, extra = 0.05, steps = 120) {
  const pts: THREE.Vector2[] = [];
  const len = LENGTH + extra * 2;
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    pts.push(new THREE.Vector2((u - 0.5) * len, halfWidth(u) * scale + 0.004));
  }
  for (let i = steps - 1; i > 0; i--) {
    const u = i / steps;
    pts.push(new THREE.Vector2((u - 0.5) * len, -halfWidth(u) * scale - 0.004));
  }
  return pts;
}

/** Extruded, bevelled sole slab between y0 and y1. */
export function buildSoleSlab(y0: number, y1: number, scale: number, bevel: number) {
  const shape = new THREE.Shape(soleOutline(scale));
  const depth = Math.max(0.001, y1 - y0 - bevel * 2);
  const g = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: bevel > 0,
    bevelSize: bevel,
    bevelThickness: bevel,
    bevelSegments: 5,
    curveSegments: 4,
    steps: 1,
  });
  // extrusion runs along +z; turn it so it runs down from y1
  g.rotateX(Math.PI / 2);
  g.translate(0, y1 - bevel, 0);
  // bend the front up with the toe spring
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const u = x / LENGTH + 0.5;
    pos.setY(i, pos.getY(i) + toeSpring(u));
  }
  g.computeVertexNormals();
  return g;
}

/** A thin groove running round the midsole sidewall. */
export function buildSoleGroove(y: number, scale: number) {
  const pts = soleOutline(scale, 0.05, 90).map((p) => new THREE.Vector3(p.x, y + toeSpring(p.x / LENGTH + 0.5), p.y));
  const curve = new THREE.CatmullRomCurve3(pts, true, "centripetal");
  return new THREE.TubeGeometry(curve, 300, 0.006, 6, true);
}

/** Four-point Comet star. */
export function starShape(r = 0.5, inner = 0.17) {
  const s = new THREE.Shape();
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2 + Math.PI / 2;
    const rr = i % 2 === 0 ? r : inner;
    // pull the long horizontal arm out a touch, like the boards
    const stretch = i === 2 || i === 6 ? 1.12 : 1;
    const x = Math.cos(a) * rr * stretch;
    const y = Math.sin(a) * rr;
    if (i === 0) s.moveTo(x, y);
    else s.lineTo(x, y);
  }
  s.closePath();
  return s;
}

export function buildStar(size: number) {
  const g = new THREE.ExtrudeGeometry(starShape(size / 2, size * 0.16), {
    depth: 0.006,
    bevelEnabled: true,
    bevelSize: 0.012,
    bevelThickness: 0.01,
    bevelSegments: 3,
    curveSegments: 1,
  });
  g.center();
  return g;
}

/** Orientation matrix for something sitting on the upper at (u, s). */
export function surfaceFrame(u: number, s: number, lift = 0.01) {
  const p = upperPoint(u, s, new THREE.Vector3());
  const n = upperNormal(u, s, new THREE.Vector3());
  const t = upperPoint(Math.min(1, u + 0.01), s, new THREE.Vector3()).sub(upperPoint(Math.max(0, u - 0.01), s, new THREE.Vector3())).normalize();
  if (s < 0) t.negate(); // so the star's local +x points the same way visually on the medial side
  const b = new THREE.Vector3().crossVectors(n, t).normalize();
  const tt = new THREE.Vector3().crossVectors(b, n).normalize();
  const m = new THREE.Matrix4().makeBasis(tt, b, n);
  p.addScaledVector(n, lift);
  return { position: p, quaternion: new THREE.Quaternion().setFromRotationMatrix(m), normal: n };
}
