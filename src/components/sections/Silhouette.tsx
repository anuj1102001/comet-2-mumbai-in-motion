"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef } from "react";
import { colorwayById } from "@/lib/colorways";
import { MOTION } from "@/lib/media";
import { useStore } from "@/lib/store";
import { ChapterHead, ColorwayPicker, MediaTag } from "../ui";
import { useStep } from "./useStep";

/**
 * Chapter 3: the silhouette, presented as a controlled sequence of the
 * board's own product views. Scroll advances the view; the tabs jump to it.
 * These are renders, labelled as renders — not an interactive 3D model.
 */
/** Side views sit on their board background; feather those so the shoe stands on the page. */
const i0 = (label: string) => label === "Lateral" || label === "Medial";

export function Silhouette() {
  const ref = useRef<HTMLElement>(null);
  const cw = colorwayById(useStore((s) => s.colorway));
  const views = cw.views;
  const { step, goTo } = useStep(ref, views.length);
  const reduce = useReducedMotion();
  const v = views[Math.min(step, views.length - 1)];

  return (
    <section ref={ref} id="silhouette" aria-labelledby="h-silhouette" className="relative bg-paper" style={{ height: `${100 + views.length * 55}svh` }}>
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden px-4 pb-6 pt-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid w-full min-w-0 max-w-[1400px] flex-1 grid-cols-[minmax(0,1fr)] grid-rows-[auto_1fr_auto] gap-4 lg:grid-cols-[22rem_minmax(0,1fr)] lg:grid-rows-[1fr_auto] lg:gap-10">
          <div className="lg:row-span-1 lg:self-center" id="h-silhouette-wrap">
            <div id="h-silhouette">
              <ChapterHead index="03" kicker="The silhouette" title="Built to be worn.">
                <p className="hidden sm:block">
                  A low-top court shape with a cupsole and a padded collar — deliberately familiar. The proportions stay classic so the city can be the expressive part.
                </p>
              </ChapterHead>
            </div>
            <dl className="mt-6 hidden grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-4 text-[13px] lg:grid">
              {[
                ["Silhouette", "Low-top court"],
                ["Construction", "Cupsole"],
                ["Lacing", "Six eyelets"],
                ["Overlay", "Raised suede star"],
              ].map(([k, val]) => (
                <div key={k}>
                  <dt className="eyebrow text-[10px] text-ink-3">{k}</dt>
                  <dd className="mt-0.5 font-semibold text-ink">{val}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative min-h-0">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.figure
                key={cw.id + v.src}
                className="absolute inset-0 flex flex-col items-center justify-center"
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40, scale: 0.985 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -40, scale: 0.985 }}
                transition={{ duration: MOTION.base, ease: MOTION.ease }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.src} alt={`${cw.name} edition, ${v.label.toLowerCase()} view — concept render`} className={`max-h-full w-auto max-w-full object-contain mix-blend-multiply ${i0(v.label) ? "feather" : ""}`} />
              </motion.figure>
            </AnimatePresence>
            <div className="absolute left-0 top-0">
              <MediaTag>Concept render · {v.label}</MediaTag>
            </div>
          </div>

          <div className="flex flex-col gap-3 lg:col-span-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="max-w-md text-sm text-ink-2" aria-live="polite">
                <b className="text-ink">{v.label}.</b> {v.note}
              </p>
              <div className="no-scrollbar mt-3 flex gap-1.5 overflow-x-auto" role="tablist" aria-label="Product views">
                {views.map((view, i) => (
                  <button key={view.label} role="tab" aria-selected={i === step} onClick={() => goTo(i)} className="chip shrink-0">
                    <span className="font-mono text-[10px] opacity-60">{String(i + 1).padStart(2, "0")}</span> {view.label}
                  </button>
                ))}
              </div>
            </div>
            <ColorwayPicker />
          </div>
        </div>
      </div>
    </section>
  );
}
