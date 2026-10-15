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

/** Scrolls to a section, honouring its scroll-margin-top (the sticky header allowance). */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) return lenis.scrollTo(el, { duration: 1.2 });
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - margin, behavior: reduced() ? "auto" : "smooth" });
}

/**
 * In-page links (`#id` or `/#id` on the home page): scroll smoothly, then put
 * the hash in the address bar so the section can be shared and Back works.
 * Returns false when the link should be left to the browser.
 */
export function followHashLink(href: string) {
  const m = /^\/?#([\w-]+)$/.exec(href);
  if (!m || window.location.pathname !== "/" || !document.getElementById(m[1])) return false;
  scrollToId(m[1]);
  if (window.location.hash !== `#${m[1]}`) history.pushState(null, "", `#${m[1]}`);
  return true;
}
