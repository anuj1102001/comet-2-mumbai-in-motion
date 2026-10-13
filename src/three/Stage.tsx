"use client";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import type { ReactNode } from "react";

/**
 * Studio lighting shared by every 3D scene: a soft key from the upper left,
 * a warm fill, a cool rim, and a lightformer environment for gentle
 * reflections. No HDR files are downloaded.
 */
export function Stage({ children, shadow = 0.5, shadowY = -0.505 }: { children: ReactNode; shadow?: number; shadowY?: number }) {
  return (
    <>
      <ambientLight intensity={0.35} color="#fff4e2" />
      <directionalLight
        position={[-3.5, 6, 4]}
        intensity={2.1}
        color="#fff1dc"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0004}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
      />
      <directionalLight position={[4, 2, -3]} intensity={0.9} color="#c9d6ff" />
      <directionalLight position={[2, 1.5, 5]} intensity={0.35} color="#ffd9a8" />
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={1.6} color="#fff6e8" position={[0, 4, 3]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#ffe2bd" position={[-5, 1, 0]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={0.7} color="#cfdcff" position={[5, 1, -2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
        <Lightformer form="ring" intensity={0.5} color="#ffffff" position={[0, -3, 0]} rotation-x={Math.PI / 2} scale={3} />
      </Environment>
      {children}
      {shadow > 0 && <ContactShadows position={[0, shadowY, 0]} opacity={shadow} scale={7} blur={2.6} far={1.6} resolution={512} color="#3a2a1a" frames={Infinity} />}
    </>
  );
}
