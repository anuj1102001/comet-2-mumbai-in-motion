"use client";
import type Lenis from "lenis";

/**
 * One scroll controller for the whole site. Lenis smooths wheel input on
 * desktop; touch and keyboard keep the browser's native scrolling, and the
 * whole thing is skipped for reduced motion. Every programmatic scroll goes
 * through `scrollToY` so it never fights the smoother.
 */
let lenis: Lenis | null = null;
export const setLenis = (l: Lenis | null) => void (lenis = l);
export const getLenis = () => lenis;

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y, { duration: 1.2 });
  else window.scrollTo({ top: y, behavior: reduced() ? "auto" : "smooth" });
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  scrollToY(el.getBoundingClientRect().top + window.scrollY);
}
