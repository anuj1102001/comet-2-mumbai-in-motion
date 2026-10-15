"use client";
import Lenis from "lenis";
import { useEffect } from "react";
import { followHashLink, setLenis } from "@/lib/scroll";

/** Wheel smoothing for fine pointers only; native scrolling everywhere else. */
export function SmoothScroll() {
  // one handler for every in-page link (header, menu, chapter rail, footer, CTAs) on every device
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      const href = a?.getAttribute("href");
      if (href && followHashLink(href)) e.preventDefault();
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return;
    const lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.9, autoRaf: true });
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
