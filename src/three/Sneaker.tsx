"use client";
import { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { colorwayById, type Colorway } from "@/lib/colorways";
import {
  GUM_H,
  SOLE_H,
  buildCollar,
  buildHeelTab,
  buildSoleGroove,
  buildSoleSlab,
  buildStar,
  buildTongue,
  buildUpper,
  laceLayout,
  surfaceFrame,
} from "./shoeGeometry";
import { shoeTextures, type ShoeTextures } from "./textures";

/** Geometry is identical for every colourway and every scene: build it once. */
let shared: ReturnType<typeof buildShared> | null = null;
function buildShared() {
  const laces = laceLayout(6);
  const laceGeos = laces.map(({ a, b, mid }) => {
    const curve = new THREE.CatmullRomCurve3([a, a.clone().lerp(mid, 0.5).setY(mid.y - 0.01), mid, b.clone().lerp(mid, 0.5).setY(mid.y - 0.01), b]);
    return new THREE.TubeGeometry(curve, 40, 0.017, 8, false);
  });
  // a simple bow and two tails on the top row
  const top = laces[0];
  const bow: THREE.TubeGeometry[] = [];
  for (const side of [1, -1]) {
    const m = top.mid;
    const loop = new THREE.CatmullRomCurve3([
      m.clone(),
      m.clone().add(new THREE.Vector3(-0.05, 0.05, side * 0.08)),
      m.clone().add(new THREE.Vector3(0.03, 0.07, side * 0.14)),
      m.clone().add(new THREE.Vector3(0.06, 0.02, side * 0.07)),
      m.clone(),
    ]);
    bow.push(new THREE.TubeGeometry(loop, 40, 0.016, 8, false));
    const tail = new THREE.CatmullRomCurve3([
      m.clone(),
      m.clone().add(new THREE.Vector3(0.06, 0.0, side * 0.08)),
      m.clone().add(new THREE.Vector3(0.12, -0.06, side * 0.2)),
      m.clone().add(new THREE.Vector3(0.16, -0.2, side * 0.3)),
    ]);
    bow.push(new THREE.TubeGeometry(tail, 40, 0.016, 8, false));
  }
  const eyelets = laces.flatMap(({ a, b, na, nb }) => [
    { p: a, n: na },
    { p: b, n: nb },
  ]);
  return {
    upper: buildUpper(),
    heel: buildHeelTab(),
    tongue: buildTongue(),
    collar: buildCollar(),
    midsole: buildSoleSlab(GUM_H - 0.005, SOLE_H + 0.012, 1.06, 0.03),
    outsole: buildSoleSlab(0, GUM_H, 1.075, 0.014),
    groove: buildSoleGroove(GUM_H + 0.07, 1.06 + 0.032),
    laces: [...laceGeos, ...bow],
    eyelets,
    eyeletGeo: new THREE.TorusGeometry(0.02, 0.0065, 8, 18),
  };
}
export function getShared() {
  return (shared ??= buildShared());
}

/** Loads (and caches) a colourway's canvas textures; keeps the previous set while the next one builds. */
export function useShoeTextures(cw: Colorway) {
  const [tex, setTex] = useState<{ id: string; t: ShoeTextures } | null>(null);
  useEffect(() => {
    let alive = true;
    shoeTextures(cw).then((t) => alive && setTex({ id: cw.id, t }));
    return () => {
      alive = false;
    };
  }, [cw]);
  return tex?.t ?? null;
}

const Z = new THREE.Vector3(0, 0, 1);

export function Sneaker({ colorway, onReady }: { colorway: Colorway["id"]; onReady?: () => void }) {
  const cw = colorwayById(colorway);
  const g = getShared();
  const tex = useShoeTextures(cw);

  useEffect(() => {
    if (tex) onReady?.();
  }, [tex, onReady]);

  const mats = useMemo(() => {
    const c = cw.colors;
    return {
      upper: new THREE.MeshStandardMaterial({
        color: tex ? "#ffffff" : c.canvas,
        map: tex?.upper ?? null,
        bumpMap: tex?.upperBump ?? null,
        bumpScale: 0.6,
        roughness: 0.88,
      }),
      lining: new THREE.MeshStandardMaterial({ color: c.lining, roughness: 0.95, side: THREE.BackSide }),
      heel: new THREE.MeshStandardMaterial({ color: tex ? "#ffffff" : c.heel, map: tex?.heel ?? null, roughness: 1 }),
      tongue: new THREE.MeshStandardMaterial({ color: tex ? "#ffffff" : c.collar, map: tex?.tongue ?? null, roughness: 0.9, side: THREE.DoubleSide }),
      collar: new THREE.MeshStandardMaterial({ color: c.collar, roughness: 0.9 }),
      star: new THREE.MeshStandardMaterial({ color: c.star, roughness: 1 }),
      laces: new THREE.MeshStandardMaterial({ color: c.laces, roughness: 0.85 }),
      eyelet: new THREE.MeshStandardMaterial({ color: "#2a2724", roughness: 0.45, metalness: 0.6 }),
      midsole: new THREE.MeshStandardMaterial({ color: c.midsole, roughness: 0.7 }),
      groove: new THREE.MeshStandardMaterial({ color: "#a89c86", roughness: 0.9 }),
      outsole: new THREE.MeshStandardMaterial({ color: tex ? "#ffffff" : c.outsole, map: tex?.outsole ?? null, roughness: 0.75 }),
      medallion: new THREE.MeshStandardMaterial({ map: tex?.medallion ?? null, color: tex ? "#ffffff" : c.outsole, transparent: true, roughness: 0.8 }),
    };
  }, [cw, tex]);

  useEffect(() => () => Object.values(mats).forEach((m) => m.dispose()), [mats]);

  const stars = useMemo(() => {
    const list = tex?.stars ?? [
      { u: 0.47, s: 0.6, size: 0.5 },
      { u: 0.47, s: -0.6, size: 0.5 },
    ];
    return list.map((st) => ({ ...surfaceFrame(st.u, st.s, 0.012), geo: buildStar(st.size) }));
  }, [tex]);

  const eyelets = useMemo(
    () => g.eyelets.map(({ p, n }) => ({ p, q: new THREE.Quaternion().setFromUnitVectors(Z, n) })),
    [g],
  );

  return (
    <group position={[0, -0.5, 0]}>
      <mesh geometry={g.upper} material={mats.upper} castShadow receiveShadow />
      <mesh geometry={g.upper} material={mats.lining} />
      <mesh geometry={g.heel} material={mats.heel} castShadow />
      <mesh geometry={g.tongue} material={mats.tongue} castShadow />
      <mesh geometry={g.collar} material={mats.collar} castShadow />
      {stars.map((s, i) => (
        <mesh key={i} geometry={s.geo} material={mats.star} position={s.position} quaternion={s.quaternion} castShadow />
      ))}
      {g.laces.map((lg, i) => (
        <mesh key={i} geometry={lg} material={mats.laces} castShadow />
      ))}
      {eyelets.map((e, i) => (
        <mesh key={i} geometry={g.eyeletGeo} material={mats.eyelet} position={e.p} quaternion={e.q} />
      ))}
      <mesh geometry={g.midsole} material={mats.midsole} castShadow receiveShadow />
      <mesh geometry={g.groove} material={mats.groove} />
      <mesh geometry={g.outsole} material={mats.outsole} castShadow />
      <mesh position={[0.55, -0.002, 0]} rotation={[Math.PI / 2, 0, -Math.PI / 2]} material={mats.medallion}>
        <circleGeometry args={[0.2, 40]} />
      </mesh>
    </group>
  );
}
