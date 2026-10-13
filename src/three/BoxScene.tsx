"use client";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { colorwayById } from "@/lib/colorways";
import { BOX_DETAILS } from "@/lib/packaging";
import { store, useStore } from "@/lib/store";
import { boxTextures, type BoxTextures } from "./boxTextures";
import { Sneaker } from "./Sneaker";
import { Stage } from "./Stage";

const W = 3.4;
const H = 1.25;
const D = 2.0;
const T = 0.03;
const LID_H = 0.32;
const M = 0.04; // lid overlap margin

const damp = (cur: number, to: number, k: number, dt: number) => cur + (to - cur) * (1 - Math.exp(-k * dt));

/** Hotspot anchors on the box: local normal, and when (by lid progress) each is reachable. */
const SPOTS = [
  { id: "cover", normal: new THREE.Vector3(0, 1, 0), when: (o: number) => o < 0.15 },
  { id: "side", normal: new THREE.Vector3(0, 0, 1), when: () => true },
  { id: "tissue", normal: new THREE.Vector3(0, 1, 0), when: (o: number) => o > 0.85 },
  { id: "insert", normal: new THREE.Vector3(0, -1, 0), when: (o: number) => o > 0.6 },
  { id: "bag", normal: new THREE.Vector3(0, 0, 1), when: (o: number) => o > 0.85 },
];
type Els = Record<string, HTMLDivElement | null>;

function useBoxTextures(id: Parameters<typeof colorwayById>[0]) {
  const [t, setT] = useState<BoxTextures | null>(null);
  useEffect(() => {
    let alive = true;
    boxTextures(colorwayById(id)).then((x) => alive && setT(x));
    return () => {
      alive = false;
    };
  }, [id]);
  return t;
}

function Box({ open, els }: { open: boolean; els: RefObject<Els> }) {
  const colorway = useStore((s) => s.colorway);
  const tx = useBoxTextures(colorway);
  const lid = useRef<THREE.Group>(null);
  const flapF = useRef<THREE.Group>(null);
  const flapB = useRef<THREE.Group>(null);
  const shoe = useRef<THREE.Group>(null);
  const prog = useRef({ lid: 0, flap: 0, shoe: 0 });

  const anchors = useRef<Record<string, THREE.Object3D | null>>({});
  const anchor = (id: string) => (o: THREE.Object3D | null) => void (anchors.current[id] = o);

  const mats = useMemo(() => {
    const kraft = new THREE.MeshStandardMaterial({ color: "#c8a676", map: tx?.inside ?? null, roughness: 0.95 });
    const plainKraft = new THREE.MeshStandardMaterial({ color: "#b8956a", roughness: 0.95 });
    const paper = (map?: THREE.Texture) => new THREE.MeshStandardMaterial({ color: map ? "#ffffff" : "#eadfca", map: map ?? null, roughness: 0.8 });
    return {
      kraft,
      plainKraft,
      front: paper(tx?.front),
      end: paper(tx?.end),
      lid: paper(tx?.lid),
      band: new THREE.MeshStandardMaterial({ color: tx ? "#ffffff" : "#24365f", map: tx?.lidBand ?? null, roughness: 0.85 }),
      tissue: new THREE.MeshStandardMaterial({ color: "#ffffff", map: tx?.tissue ?? null, roughness: 0.95, side: THREE.DoubleSide, transparent: true, opacity: 0.96 }),
      postcard: paper(tx?.postcard),
      tag: new THREE.MeshStandardMaterial({ color: "#ffffff", map: tx?.tag ?? null, roughness: 0.85, side: THREE.DoubleSide }),
      seal: new THREE.MeshStandardMaterial({ color: "#1b2643", roughness: 0.6 }),
      bag: new THREE.MeshStandardMaterial({ color: "#1b2643", roughness: 1 }),
    };
  }, [tx]);

  // crumpled tissue flap
  const flapGeo = useMemo(() => {
    const g = new THREE.PlaneGeometry(W - 0.12, (D - 0.1) / 2 + 0.06, 24, 12);
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0, -((D - 0.1) / 4));
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const x = p.getX(i);
      const z = p.getZ(i);
      p.setY(i, Math.sin(x * 5.3) * 0.012 + Math.sin(z * 9 + x * 2) * 0.01 + Math.cos(x * 11 + z * 4) * 0.006);
    }
    g.computeVertexNormals();
    return g;
  }, []);

  const v = useMemo(() => ({ p: new THREE.Vector3(), n: new THREE.Vector3(), q: new THREE.Quaternion(), to: new THREE.Vector3() }), []);

  useFrame(({ camera, size }, dt) => {
    dt = Math.min(dt, 1 / 20);
    const g = prog.current;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const k = reduce ? 60 : 2.6;
    // choreography: lid first, then the tissue, then the shoe rises
    g.lid = damp(g.lid, open ? 1 : 0, k, dt);
    g.flap = damp(g.flap, open && g.lid > 0.7 ? 1 : 0, k * 1.1, dt);
    g.shoe = damp(g.shoe, open && g.flap > 0.6 ? 1 : 0, k * 0.8, dt);
    if (lid.current) lid.current.rotation.x = -g.lid * 1.95;
    // the tissue folds back and drops inside the long walls
    if (flapF.current) flapF.current.rotation.x = -g.flap * 1.48;
    if (flapB.current) flapB.current.rotation.x = g.flap * 1.48;
    if (shoe.current) {
      shoe.current.position.y = T + 0.36 + g.shoe * 0.32;
      shoe.current.rotation.z = g.shoe * 0.06;
    }

    for (const s of SPOTS) {
      const el = els.current?.[s.id];
      const o = anchors.current[s.id];
      if (!el || !o) continue;
      o.getWorldPosition(v.p);
      o.getWorldQuaternion(v.q);
      v.n.copy(s.normal).applyQuaternion(v.q);
      const facing = v.n.dot(v.to.copy(camera.position).sub(v.p).normalize());
      const show = s.when(g.lid) && facing > 0.05;
      v.p.project(camera);
      const x = (v.p.x * 0.5 + 0.5) * size.width;
      const y = (-v.p.y * 0.5 + 0.5) * size.height;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${show ? 1 : 0.6})`;
      el.style.opacity = show ? "1" : "0";
      el.style.pointerEvents = show ? "auto" : "none";
      const btn = el.firstElementChild as HTMLButtonElement | null;
      if (btn) btn.tabIndex = show ? 0 : -1;
    }
  });

  // material order for BoxGeometry faces: +x, -x, +y, -y, +z, -z
  const K = mats.plainKraft;
  return (
    <group position={[0, -0.62, 0]}>
      {/* base */}
      <mesh position={[0, T / 2, 0]} material={mats.kraft} receiveShadow>
        <boxGeometry args={[W, T, D]} />
      </mesh>
      <mesh position={[0, H / 2, D / 2 - T / 2]} material={[K, K, K, K, mats.front, mats.kraft]} castShadow receiveShadow>
        <boxGeometry args={[W, H, T]} />
      </mesh>
      <mesh position={[0, H / 2, -D / 2 + T / 2]} material={[K, K, K, K, mats.kraft, mats.front]} castShadow receiveShadow>
        <boxGeometry args={[W, H, T]} />
      </mesh>
      <mesh position={[W / 2 - T / 2, H / 2, 0]} material={[mats.end, mats.kraft, K, K, K, K]} castShadow receiveShadow>
        <boxGeometry args={[T, H, D - 2 * T]} />
      </mesh>
      <mesh position={[-W / 2 + T / 2, H / 2, 0]} material={[mats.kraft, mats.end, K, K, K, K]} castShadow receiveShadow>
        <boxGeometry args={[T, H, D - 2 * T]} />
      </mesh>
      <object3D ref={anchor("side")} position={[0.9, H * 0.58, D / 2 + 0.02]} />

      {/* contents */}
      <group ref={shoe} position={[0.05, T + 0.36, 0]} rotation={[0, 0.12, 0]} scale={0.68}>
        <Sneaker colorway={colorway} />
      </group>
      <mesh position={[-1.25, 0.36, -0.55]} rotation={[-0.2, 0.3, 0.05]} material={mats.bag} castShadow>
        <boxGeometry args={[0.7, 0.62, 0.1]} />
      </mesh>
      <object3D ref={anchor("bag")} position={[-1.25, 0.5, -0.48]} />
      <mesh position={[1.42, 0.62, 0.62]} rotation={[0, -0.5, 0.08]} material={mats.tag} castShadow>
        <planeGeometry args={[0.32, 0.56]} />
      </mesh>

      {/* tissue flaps hinged on the long walls */}
      <group ref={flapF} position={[0, H - 0.06, D / 2 - 0.07]}>
        <mesh geometry={flapGeo} material={mats.tissue} />
        <mesh position={[0, 0.02, -(D - 0.1) / 2 + 0.03]} rotation={[-Math.PI / 2, 0, 0]} material={mats.seal}>
          <circleGeometry args={[0.13, 32]} />
        </mesh>
      </group>
      <group ref={flapB} position={[0, H - 0.08, -D / 2 + 0.07]}>
        <mesh geometry={flapGeo} material={mats.tissue} scale={[1, 1, -1]} />
      </group>
      <object3D ref={anchor("tissue")} position={[-0.9, H - 0.1, 0.3]} />

      {/* lid, hinged along the back top edge */}
      <group ref={lid} position={[0, H + 0.02, -(D / 2 + M)]}>
        <group position={[0, 0, D / 2 + M]}>
          <mesh position={[0, T / 2, 0]} material={[mats.band, mats.band, mats.lid, mats.kraft, mats.band, mats.band]} castShadow receiveShadow>
            <boxGeometry args={[W + 2 * M, T, D + 2 * M]} />
          </mesh>
          <object3D ref={anchor("cover")} position={[-0.6, T + 0.01, -0.2]} />
          <mesh position={[0, -LID_H / 2, D / 2 + M - T / 2]} material={[K, K, K, K, mats.band, mats.kraft]} castShadow>
            <boxGeometry args={[W + 2 * M, LID_H, T]} />
          </mesh>
          <mesh position={[0, -LID_H / 2, -(D / 2 + M) + T / 2]} material={[K, K, K, K, mats.kraft, mats.band]} castShadow>
            <boxGeometry args={[W + 2 * M, LID_H, T]} />
          </mesh>
          <mesh position={[W / 2 + M - T / 2, -LID_H / 2, 0]} material={[mats.band, mats.kraft, K, K, K, K]} castShadow>
            <boxGeometry args={[T, LID_H, D + 2 * M - 2 * T]} />
          </mesh>
          <mesh position={[-(W / 2 + M) + T / 2, -LID_H / 2, 0]} material={[mats.kraft, mats.band, K, K, K, K]} castShadow>
            <boxGeometry args={[T, LID_H, D + 2 * M - 2 * T]} />
          </mesh>
          {/* postcard tucked under the lid */}
          <mesh position={[0.9, -0.01, 0.1]} rotation={[Math.PI / 2, 0, Math.PI]} material={mats.postcard}>
            <planeGeometry args={[0.82, 1.12]} />
          </mesh>
          <object3D ref={anchor("insert")} position={[0.9, -0.02, 0.1]} />
        </group>
      </group>
    </group>
  );
}

export default function BoxScene({ open }: { open: boolean }) {
  const els = useRef<Els>({});
  return (
    <div className="relative h-full w-full">
      <Canvas shadows dpr={[1, 1.75]} camera={{ position: [4.4, 3.1, 4.8], fov: 32 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}>
        <Stage shadow={0}>
          <Box open={open} els={els} />
        </Stage>
        <ContactShadows position={[0, -0.63, 0]} opacity={0.6} scale={10} blur={2.4} far={2} color="#000000" />
        <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.35} maxPolarAngle={1.45} target={[0, 0.1, 0]} enableDamping />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Object.values(BOX_DETAILS).map((d, i) => (
          <div key={d.id} ref={(el) => void (els.current[d.id] = el)} className="absolute left-0 top-0" style={{ opacity: 0, transition: "opacity .35s" }}>
            <button type="button" tabIndex={-1} className="hotspot group" aria-label={`Packaging detail: ${d.title}`} onClick={() => store.set({ detail: d.id })}>
              {String(i + 1).padStart(2, "0")}
              <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-paper px-3 py-1.5 font-sans text-[11px] font-semibold text-ink opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {d.title}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
