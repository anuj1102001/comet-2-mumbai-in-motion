"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import { MOTION } from "@/lib/media";
import { BOX_DETAILS, type BoxStage } from "@/lib/packaging";
import { ChapterHead, MediaTag } from "../ui";
import { usePrefetch } from "../motion/usePrefetch";
import { useStep } from "./useStep";

const STAGES: { id: BoxStage; src: string; label: string; line: string }[] = [
  { id: "closed", src: "/img/box-closed.webp", label: "Closed", line: "The lid is a poster: the shoe breaks the frame, CST etched behind it, a red sun." },
  { id: "open", src: "/img/box-open.webp", label: "Opened", line: "Indigo toile tissue, redrawn with Mumbai scenes and closed with a star seal." },
  { id: "inserts", src: "/img/box-inserts.webp", label: "Inside", line: "A postcard to send, a ticket-style hang tag and a navy dust bag." },
];

/**
 * Chapter 6: the packaging. Scroll moves the box from closed to opened to its
 * inserts; each stage has its own markers, and a marker opens its story in
 * the side panel rather than a pop-up over the box.
 */
export function Packaging() {
  const ref = useRef<HTMLElement>(null);
  const { step, goTo } = useStep(ref, STAGES.length);
  usePrefetch(ref, STAGES.map((s) => s.src));
  const reduce = useReducedMotion();
  const stage = STAGES[step];
  const spots = Object.values(BOX_DETAILS).filter((d) => d.stage === stage.id);
  const [picked, setPicked] = useState<string | null>(null);
  const active = picked && BOX_DETAILS[picked]?.stage === stage.id ? BOX_DETAILS[picked] : spots[0];

  return (
    <section ref={ref} id="packaging" aria-labelledby="h-packaging" className="relative bg-char text-paper" style={{ height: `${100 + STAGES.length * 70}svh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden px-4 pb-6 pt-20 sm:px-8 lg:px-12">
        <div className="mx-auto grid h-full max-w-[1400px] grid-cols-[minmax(0,1fr)] grid-rows-[auto_1fr_auto] gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:grid-rows-[1fr_auto] lg:gap-12">
          <div className="relative order-2 min-h-0 lg:order-1 lg:row-span-2 lg:self-center">
            <div className="relative mx-auto aspect-[548/347] max-h-full w-full overflow-hidden rounded-[22px] bg-char-2">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={stage.id}
                  className="absolute inset-0"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: MOTION.slow, ease: MOTION.ease }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={stage.src} alt={`Packaging, ${stage.label.toLowerCase()} — concept render`} className="h-full w-full object-cover" />
                  {spots.map((s) => (
                    <button
                      key={s.id}
                      className="hotspot absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${s.spot.x}%`, top: `${s.spot.y}%` }}
                      aria-label={`Packaging detail: ${s.title}`}
                      aria-pressed={active?.id === s.id}
                      onClick={() => setPicked(s.id)}
                    >
                      {String(Object.keys(BOX_DETAILS).indexOf(s.id) + 1).padStart(2, "0")}
                    </button>
                  ))}
                </motion.div>
              </AnimatePresence>
              <div className="absolute left-3 top-3">
                <MediaTag tone="dark">Concept render · {stage.label}</MediaTag>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 lg:self-end">
            <div id="h-packaging">
              <ChapterHead index="06" kicker="The packaging" tone="dark" title={<>A poster <span className="italic text-saffron">you can open.</span></>}>
                <p className="hidden sm:block">The box extends the shoe&apos;s design system: travel-poster composition, railway ephemera, the same navy, cream and terracotta.</p>
              </ChapterHead>
            </div>
          </div>

          <div className="order-3 lg:self-start">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active?.id ?? stage.id}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: MOTION.fast, ease: MOTION.ease }}
                className="rounded-2xl border border-white/10 p-4 sm:p-5"
                aria-live="polite"
              >
                <p className="text-sm text-paper/60">{stage.line}</p>
                {active && (
                  <>
                    <p className="mt-3 font-semibold">{active.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-paper/75">{active.decision}</p>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
            <div className="mt-4 flex gap-1.5" role="tablist" aria-label="Packaging stages">
              {STAGES.map((s, i) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={i === step}
                  onClick={() => goTo(i)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-300 ${i === step ? "border-paper bg-paper text-ink" : "border-white/15 text-paper/75 hover:border-paper/60"}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
