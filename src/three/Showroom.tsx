"use client";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { useStore } from "@/lib/store";
import { Sneaker } from "./Sneaker";
import { Stage } from "./Stage";

/** Pull the camera back on narrow viewports so the whole shoe fits. */
function Fit() {
  const { camera, size } = useThree();
  useEffect(() => {
    const fit = Math.max(1, 1.25 / (size.width / size.height));
    camera.position.setLength(5.7 * fit);
  }, [camera, size]);
  return null;
}

/** Product-page viewer: free orbit around the selected edition. */
export default function Showroom() {
  const colorway = useStore((s) => s.colorway);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  return (
    <Canvas shadows dpr={[1, 1.75]} camera={{ position: [3.6, 1.5, 4.2], fov: 30 }} gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}>
      <Fit />
      <Stage shadow={0.5}>
        <Sneaker colorway={colorway} />
      </Stage>
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={0.2} maxPolarAngle={Math.PI - 0.2} autoRotate={!reduce} autoRotateSpeed={0.8} enableDamping />
    </Canvas>
  );
}
