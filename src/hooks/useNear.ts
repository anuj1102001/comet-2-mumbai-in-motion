"use client";
import { useEffect, useState, type RefObject } from "react";

/** True once the element comes within `margin` of the viewport, and while it stays near. */
export function useNear(ref: RefObject<Element | null>, margin = "50%") {
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: `${margin} 0px` });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, margin]);
  return near;
}
