"use client";
import { ContactShadows } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { CHAPTERS, type Pose } from "@/lib/chapters";
import { scrollRig, useStore } from "@/lib/store";
import { HotspotLayer, HotspotProjector, type HotspotEls } from "./hotspots";
import { Sneaker } from "./Sneaker";
import { Stage } from "./Stage";

const damp = (cur: number, to: number, k: number, dt: number) => cur + (to - cur) * (1 - Math.exp(-k * dt));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function blendPose(p: number) {
  const n = CHAPTERS.length;
  const i = Math.min(n - 1, Math.max(0, Math.floor(p)));
  const f = p - i;
  const t = ease(smooth(0.42, 1, f));
  const a = CHAPTERS[i].pose;
  const b = CHAPTERS[Math.min(n - 1, i + 1)].pose;
  const l = (x: number, y: number) => x + (y - x) * t;
  const l3 = (x: number[], y: number[]) => [l(x[0], y[0]), l(x[1], y[1]), l(x[2], y[2])] as [number, number, number];
  return {
    cam: l3(a.cam, b.cam),
    target: l3(a.target, b.target),
    fov: l(a.fov, b.fov),
    rot: l3(a.rot, b.rot),
    sway: l(a.sway, b.sway),
    shadow: l(a.shadow, b.shadow),
    shift: l(a.shift, b.shift),
  } satisfies Pose;
}

/** Drives camera, framing and shoe rotation from the scroll position. */
function Rig({ shoe, shadow }: { shoe: React.RefObject<THREE.Group | null>; shadow: React.RefObject<THREE.Group | null> }) {
  const { camera, size } = useThree();
  const cur = useRef({ cam: new THREE.Vector3(0, 0.2, 6.6), target: new THREE.Vector3(), shift: 0, yaw: 0, rx: 0, ry: 0, rz: 0, shadow: 0.5 });
  const tmp = useMemo(() => new THREE.Vector3(), []);

  useFrame((state, dt) => {
    dt = Math.min(dt, 1 / 20);
    const c = cur.current;
    const pose = blendPose(scrollRig.position);
    const aspect = size.width / size.height;
    const portrait = aspect < 1;
    // fit the shoe's width on narrow screens by pulling the camera back
    const fit = Math.max(1, 1.35 / aspect);
    const target = tmp.set(...pose.target);
    if (portrait) target.y -= 0.42;
    const dir = new THREE.Vector3(...pose.cam).sub(new THREE.Vector3(...pose.target)).multiplyScalar(fit);
    const camTo = target.clone().add(dir);
    const k = 3.2;
    c.cam.set(damp(c.cam.x, camTo.x, k, dt), damp(c.cam.y, camTo.y, k, dt), damp(c.cam.z, camTo.z, k, dt));
    c.target.set(damp(c.target.x, target.x, k, dt), damp(c.target.y, target.y, k, dt), damp(c.target.z, target.z, k, dt));
    camera.position.copy(c.cam);
    camera.lookAt(c.target);

    // horizontal framing, so copy and shoe never overlap on wide screens
    c.shift = damp(c.shift, portrait ? 0 : pose.shift, 3, dt);
    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = pose.fov;
    cam.setViewOffset(size.width, size.height, -c.shift * size.width * 0.5, 0, size.width, size.height);
    cam.updateProjectionMatrix();

    // user drag eases back to the authored composition when idle
    if (!scrollRig.dragging) scrollRig.yaw = damp(scrollRig.yaw, 0, 0.6, dt);
    c.yaw = damp(c.yaw, scrollRig.yaw, 8, dt);
    const t = state.clock.elapsedTime;
    const sway = reduced() ? 0 : pose.sway;
    c.rx = damp(c.rx, pose.rot[0], k, dt);
    c.ry = damp(c.ry, pose.rot[1], k, dt);
    c.rz = damp(c.rz, pose.rot[2], k, dt);
    if (shoe.current) {
      shoe.current.rotation.set(c.rx, c.ry + c.yaw + Math.sin(t * 0.35) * 0.45 * sway, c.rz);
      shoe.current.position.y = Math.sin(t * 0.8) * 0.015 * sway;
    }
    c.shadow = damp(c.shadow, pose.shadow, 4, dt);
    shadow.current?.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (m && "opacity" in m) m.opacity = c.shadow;
    });
  });
  return null;
}

let reducedCache: boolean | null = null;
const reduced = () => (reducedCache ??= typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

export default function StoryScene() {
  const colorway = useStore((s) => s.colorway);
  const shoe = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Group>(null);
  const els = useRef<HotspotEls>({});
  return (
    <div className="relative h-full w-full">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.2, 6.6], fov: 30, near: 0.1, far: 60 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      >
        <Rig shoe={shoe} shadow={shadow} />
        <Stage shadow={0}>
          <group ref={shoe}>
            <Sneaker colorway={colorway} />
            <HotspotProjector els={els} />
          </group>
        </Stage>
        <group ref={shadow}>
          <ShadowCatcher />
        </group>
      </Canvas>
      <HotspotLayer els={els} />
    </div>
  );
}

function ShadowCatcher() {
  return <ContactShadows position={[0, -0.505, 0]} opacity={0.55} scale={7} blur={2.6} far={1.6} resolution={512} color="#3a2a1a" />;
}
