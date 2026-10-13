"use client";
import { useEffect, type RefObject } from "react";

/**
 * Downloads and decodes a section's images shortly before it scrolls into
 * view, so swapping between them never waits on the network or the decoder.
 */
export function usePrefetch(ref: RefObject<Element | null>, srcs: string[]) {
  const key = srcs.join("|");
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        for (const src of key.split("|")) {
          const img = new Image();
          img.src = src;
          img.decode?.().catch(() => {});
        }
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, key]);
}
