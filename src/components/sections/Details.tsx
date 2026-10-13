"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { colorwayById } from "@/lib/colorways";
import { detailsFor, imageFor } from "@/lib/details";
import { MOTION } from "@/lib/media";
import { useStore } from "@/lib/store";
import { SneakerSVG, zoneLabel } from "../art/SneakerSVG";
import { ChapterHead, MediaTag } from "../ui";
import { usePrefetch } from "../motion/usePrefetch";
import { useStep } from "./useStep";

/**
 * Chapter 5: the details. One sticky spread; scrolling walks through each
 * graphic, the list jumps straight to one. The close-up can be compared with
 * the full side of the shoe it sits on. Everything stays inline — no modals —
 * so the visitor never loses their place.
 */
export function Details() {
  const ref = useRef<HTMLElement>(null);
  const colorway = useStore((s) => s.colorway);
  const cw = colorwayById(colorway);
  const items = detailsFor(cw);
  const { step, goTo } = useStep(ref, items.length);
  usePrefetch(ref, [...items.map((x) => imageFor(x, colorway)), ...cw.views.slice(0, 2).map((v) => v.src)]);
  const reduce = useReducedMotion();
  const d = items[Math.min(step, items.length - 1)];
  const [compareFor, setCompareFor] = useState<string | null>(null);
  const compare = compareFor === d.id + colorway;
  const fullSide = d.zone.startsWith("medial") ? (cw.views.find((v) => v.label === "Medial") ?? cw.views[0]) : cw.views[0];

  return (
    <section ref={ref} id="details" aria-labelledby="h-details" className="relative bg-paper" style={{ height: `${100 + items.length * 50}svh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden px-4 pb-6 pt-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid h-full max-w-[1400px] grid-cols-[minmax(0,1fr)] grid-rows-[auto_auto_1fr] gap-5 lg:grid-cols-[20rem_minmax(0,1fr)] lg:grid-rows-1 lg:gap-10">
          {/* index of details */}
          <div className="flex min-h-0 min-w-0 flex-col">
            <div id="h-details">
              <ChapterHead index="05" kicker="The details" title="Read it closely." />
            </div>
            <ol className="no-scrollbar -mx-4 mt-5 flex gap-1.5 overflow-x-auto px-4 lg:mx-0 lg:mt-8 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
              {items.map((it, i) => (
                <li key={it.id} className="shrink-0">
                  <button
                    onClick={() => goTo(i)}
                    aria-current={i === step ? "true" : undefined}
                    className={`group flex w-full items-center gap-3 rounded-full border px-3 py-1.5 text-left text-sm transition-colors duration-300 lg:rounded-none lg:border-0 lg:border-b lg:border-line lg:px-0 lg:py-3 ${
                      i === step ? "border-ink bg-ink text-paper lg:bg-transparent lg:text-ink" : "border-line text-ink-2 hover:text-ink"
                    }`}
                  >
                    <span className={`hidden font-mono text-[11px] lg:inline ${i === step ? "text-terracotta" : "text-ink-3"}`}>{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 whitespace-nowrap font-medium">{it.title}</span>
                    <span aria-hidden className={`hidden h-px bg-terracotta transition-all duration-500 lg:block ${i === step ? "w-8" : "w-0"}`} />
                  </button>
                </li>
              ))}
            </ol>
          </div>

          {/* the spread */}
          <div className="grid min-h-0 min-w-0 gap-5 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-10">
            <div className="relative aspect-[4/3] max-h-[34svh] w-full overflow-hidden rounded-[22px] border border-line bg-paper-2 lg:aspect-auto lg:h-[min(62vh,560px)] lg:max-h-none">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={d.id + colorway + (compare ? "full" : "close")}
                  src={compare ? fullSide.src : imageFor(d, colorway)}
                  alt={compare ? `${cw.name}, full ${fullSide.label.toLowerCase()} side — concept render` : `${d.title} — close-up concept render`}
                  className={`absolute inset-0 h-full w-full ${compare ? "object-contain p-4" : "object-cover"}`}
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: MOTION.base, ease: MOTION.ease }}
                />
              </AnimatePresence>
              <div className="absolute left-3 top-3">
                <MediaTag>{compare ? `Full ${fullSide.label.toLowerCase()} side` : "Close-up"} · concept render</MediaTag>
              </div>
              <div className="absolute bottom-3 right-3 flex rounded-full bg-paper/90 p-1 text-xs font-semibold" role="group" aria-label="Compare">
                <button className={`rounded-full px-3 py-1.5 transition-colors ${!compare ? "bg-ink text-paper" : "text-ink"}`} aria-pressed={!compare} onClick={() => setCompareFor(null)}>
                  Close-up
                </button>
                <button className={`rounded-full px-3 py-1.5 transition-colors ${compare ? "bg-ink text-paper" : "text-ink"}`} aria-pressed={compare} onClick={() => setCompareFor(d.id + colorway)}>
                  Full shoe
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={d.id + colorway}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: MOTION.fast, ease: MOTION.ease }}
                className="min-h-0 overflow-y-auto"
                aria-live="polite"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-paper">{d.kind}</span>
                  <span className="text-xs text-ink-3">{d.location}</span>
                </div>
                <h3 className="h-display mt-3 text-4xl text-ink sm:text-5xl">{d.title}</h3>
                {d.hindi && <p className="deva mt-1 text-xl text-terracotta">{d.hindi}</p>}
                <dl className="mt-5 space-y-4 text-[15px] leading-relaxed">
                  <div>
                    <dt className="eyebrow text-[10px] text-ink-3">Inspiration</dt>
                    <dd className="mt-1 text-ink">{d.inspiration}</dd>
                  </div>
                  <div className="hidden sm:block">
                    <dt className="eyebrow text-[10px] text-ink-3">Design decision</dt>
                    <dd className="mt-1 text-ink-2">{d.decision}</dd>
                  </div>
                </dl>
                <div className="mt-5 hidden items-center gap-4 border-t border-line pt-4 sm:flex">
                  <SneakerSVG colors={cw.colors} zone={d.zone} className="w-40 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-ink">{zoneLabel(d.zone)}</p>
                    <div className="mt-2 flex gap-1.5">
                      {(d.swatches ?? []).map((h) => (
                        <i key={h} title={h} className="block h-4 w-4 rounded-full border border-black/10" style={{ background: h }} />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
