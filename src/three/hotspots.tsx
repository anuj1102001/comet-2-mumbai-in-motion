"use client";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import { colorwayById } from "@/lib/colorways";
import { anchorFor, detailsFor, type Anchor } from "@/lib/details";
import { store, useStore } from "@/lib/store";
import { sForHeight, upperNormal, upperPoint } from "./shoeGeometry";

/**
 * Hotspots are plain DOM buttons laid over the canvas (accessible, focusable,
 * no portals into the WebGL tree). A projector inside the canvas moves them
 * every frame and hides any that face away from the camera.
 */

export type HotspotEls = Record<string, HTMLDivElement | null>;

function anchorPosition(a: Anchor) {
  if (a.kind === "point") {
    return { p: new THREE.Vector3(...a.pos), n: new THREE.Vector3(...a.normal).normalize() };
  }
  const s = sForHeight(a.u, a.h, a.side);
  const p = upperPoint(a.u, s, new THREE.Vector3());
  const n = upperNormal(a.u, s, new THREE.Vector3());
  return { p: p.addScaledVector(n, 0.03), n };
}

function useItems() {
  const colorway = useStore((s) => s.colorway);
  const cw = colorwayById(colorway);
  return useMemo(
    () =>
      detailsFor(cw).map((d, i) => {
        const { p, n } = anchorPosition(anchorFor(d, cw.id));
        return { d, p, n, i };
      }),
    [cw],
  );
}

/** Lives inside the shoe's group so it inherits the shoe's rotation. */
export function HotspotProjector({ els, chapters }: { els: RefObject<HotspotEls>; chapters?: number[] }) {
  const items = useItems();
  const group = useRef<THREE.Group>(null);
  const v = useMemo(() => ({ wp: new THREE.Vector3(), wn: new THREE.Vector3(), to: new THREE.Vector3(), q: new THREE.Quaternion(), ndc: new THREE.Vector3() }), []);

  useFrame(({ camera, size }) => {
    const g = group.current;
    if (!g) return;
    g.getWorldQuaternion(v.q);
    const chapter = store.get().chapter;
    for (const it of items) {
      const el = els.current?.[it.d.id];
      if (!el) continue;
      const active = chapters ? chapters.includes(it.d.chapter) : it.d.chapter === chapter;
      v.wp.copy(it.p);
      g.localToWorld(v.wp);
      v.wn.copy(it.n).applyQuaternion(v.q);
      const facing = v.wn.dot(v.to.copy(camera.position).sub(v.wp).normalize());
      v.ndc.copy(v.wp).project(camera);
      const x = (v.ndc.x * 0.5 + 0.5) * size.width;
      const y = (-v.ndc.y * 0.5 + 0.5) * size.height;
      const show = active && facing > 0.1 && v.ndc.z < 1;
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${show ? 1 : 0.6})`;
      el.style.opacity = show ? "1" : "0";
      el.style.pointerEvents = show ? "auto" : "none";
      const btn = el.firstElementChild as HTMLButtonElement | null;
      if (btn) btn.tabIndex = show ? 0 : -1;
    }
  });

  return <group ref={group} position={[0, -0.5, 0]} />;
}

/** The DOM half: one button per design detail of the current colourway. */
export function HotspotLayer({ els }: { els: RefObject<HotspotEls> }) {
  const items = useItems();
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {items.map((it, i) => (
        <div
          key={it.d.id}
          ref={(el) => {
            if (els.current) els.current[it.d.id] = el;
          }}
          className="absolute left-0 top-0"
          style={{ opacity: 0, transition: "opacity .35s, scale .35s" }}
        >
          <button
            type="button"
            tabIndex={-1}
            className="hotspot group"
            aria-label={`Design detail: ${it.d.title}`}
            onClick={() => store.set({ detail: it.d.id })}
          >
            {String(i + 1).padStart(2, "0")}
            <span className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap rounded-full bg-ink px-3 py-1.5 font-sans text-[11px] font-semibold tracking-wide text-paper opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              {it.d.title}
            </span>
          </button>
        </div>
      ))}
    </div>
  );
}
