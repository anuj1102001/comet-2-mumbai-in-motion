"use client";
import Lenis from "lenis";
import { useEffect } from "react";
import { setLenis } from "@/lib/scroll";

/** Wheel smoothing for fine pointers only; native scrolling everywhere else. */
export function SmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, anchors: { offset: 0 }, autoRaf: true });
    setLenis(lenis);
    document.documentElement.classList.add("lenis");
    return () => {
      lenis.destroy();
      setLenis(null);
      document.documentElement.classList.remove("lenis");
    };
  }, []);
  return null;
}
