"use client";
import { useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useState, type RefObject } from "react";

/**
 * Splits a tall section's scroll range into `count` steps and reports the
 * active one. React re-renders only when the step changes, never per frame.
 * `goTo` scrolls natively to a step, so clicking and scrolling stay in sync.
 */
export function useStep(ref: RefObject<HTMLElement | null>, count: number) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const s = Math.min(count - 1, Math.max(0, Math.floor(v * count * 0.9999)));
    setStep((cur) => (cur === s ? cur : s));
  });
  const goTo = useCallback(
    (i: number) => {
      const el = ref.current;
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const range = el.offsetHeight - window.innerHeight;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: top + range * ((i + 0.5) / count), behavior: reduce ? "auto" : "smooth" });
    },
    [ref, count],
  );
  return { step, goTo, progress: scrollYProgress };
}
