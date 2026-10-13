"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { colorwayById } from "@/lib/colorways";
import { BOX_DETAILS } from "@/lib/packaging";
import { DETAILS, detailsFor, imageFor, type Detail } from "@/lib/details";
import { store, useStore } from "@/lib/store";
import { SneakerSVG, zoneLabel } from "./art/SneakerSVG";

/**
 * Design breakdown: an editorial spread for one detail of the shoe or box.
 * Opens from a hotspot or list item, closes back to exactly where you were
 * (Esc, the back button, or the scrim), and focus returns to the trigger.
 */
export function DetailView() {
  const id = useStore((s) => s.detail);
  const colorway = useStore((s) => s.colorway);
  const cw = colorwayById(colorway);
  const reduce = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);
  const [zoomedId, setZoomedId] = useState<string | null>(null);
  const zoom = !!id && zoomedId === id;

  const isBox = !!id && id in BOX_DETAILS;
  const d: Detail | undefined = id ? (isBox ? BOX_DETAILS[id] : DETAILS[id]) : undefined;
  const list = useMemo(() => (isBox ? Object.keys(BOX_DETAILS) : detailsFor(cw).map((x) => x.id)), [isBox, cw]);
  const at = id ? list.indexOf(id) : -1;
  const listRef = useRef(list);
  useEffect(() => {
    listRef.current = list;
  }, [list]);

  const open = !!id;
  useEffect(() => {
    if (!open) return;
    returnTo.current = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => closeRef.current?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      const cur = store.get().detail;
      const i = cur ? listRef.current.indexOf(cur) : -1;
      const l = listRef.current;
      if (e.key === "Escape") store.set({ detail: null });
      if (e.key === "ArrowRight" && i >= 0) store.set({ detail: l[(i + 1) % l.length] });
      if (e.key === "ArrowLeft" && i >= 0) store.set({ detail: l[(i - 1 + l.length) % l.length] });
    };
    window.addEventListener("keydown", onKey);
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
    };
  }, [open]);

  useEffect(() => {
    if (open) return;
    returnTo.current?.focus?.();
  }, [open]);

  return (
    <AnimatePresence>
      {d && (
        <motion.div
          key="detail"
          className="fixed inset-0 z-[70] flex items-stretch justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
        >
          <button aria-label="Close detail" tabIndex={-1} className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={() => store.set({ detail: null })} />
          <motion.article
            role="dialog"
            aria-modal="true"
            aria-labelledby="detail-title"
            initial={reduce ? false : { x: "8%", opacity: 0, clipPath: "inset(0 0 0 100%)" }}
            animate={{ x: 0, opacity: 1, clipPath: "inset(0 0 0 0%)" }}
            exit={reduce ? { opacity: 0 } : { x: "6%", opacity: 0, clipPath: "inset(0 0 0 100%)" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-full overflow-y-auto bg-paper lg:w-[min(1100px,92vw)]"
          >
            <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-line bg-paper/90 px-4 py-3 backdrop-blur-md sm:px-8">
              <button ref={closeRef} onClick={() => store.set({ detail: null })} className="btn btn-line py-2 text-ink">
                <span aria-hidden>←</span> {isBox ? "Back to the box" : "Back to the sneaker"}
              </button>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-ink-3">
                  {String(at + 1).padStart(2, "0")} / {String(list.length).padStart(2, "0")}
                </span>
                <button className="chip" aria-label="Previous detail" onClick={() => store.set({ detail: list[(at - 1 + list.length) % list.length] })}>
                  ←
                </button>
                <button className="chip" aria-label="Next detail" onClick={() => store.set({ detail: list[(at + 1) % list.length] })}>
                  →
                </button>
              </div>
            </header>

            <AnimatePresence mode="wait">
              <motion.div
                key={d.id + colorway}
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-8 px-4 py-8 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-12 lg:py-12"
              >
                {/* visual column */}
                <div>
                  <button
                    onClick={() => setZoomedId(zoom ? null : id)}
                    aria-pressed={zoom}
                    aria-label={zoom ? "Show the whole detail" : "Magnify the detail"}
                    className="group relative block w-full overflow-hidden rounded-2xl border border-line bg-paper-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageFor(d, colorway)}
                      alt={`${d.title} — concept render`}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out"
                      style={{ transform: zoom ? "scale(1.9)" : "scale(1)" }}
                    />
                    <span className="absolute bottom-3 right-3 rounded-full bg-paper/90 px-3 py-1 text-[11px] font-semibold text-ink">{zoom ? "Zoom out" : "Magnify"}</span>
                    <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-paper">Concept render</span>
                  </button>
                  <div className="mt-4 grid grid-cols-[1.4fr_1fr] gap-4">
                    <div className="rounded-2xl border border-line p-4">
                      <p className="eyebrow text-[10px] text-ink-3">Where it lives</p>
                      {isBox ? (
                        <p className="mt-2 text-sm font-semibold text-ink">{d.location}</p>
                      ) : (
                        <>
                          <SneakerSVG colors={cw.colors} zone={d.zone} className="mt-2 w-full" />
                          <p className="mt-1 text-sm font-semibold text-ink">{zoneLabel(d.zone)}</p>
                        </>
                      )}
                    </div>
                    <div className="rounded-2xl border border-line p-4">
                      <p className="eyebrow text-[10px] text-ink-3">Palette</p>
                      <ul className="mt-3 space-y-2">
                        {(d.swatches ?? cw.palette.slice(0, 3).map((p) => p.hex)).map((h) => (
                          <li key={h} className="flex items-center gap-2 font-mono text-[11px] text-ink-2">
                            <i className="block h-5 w-5 rounded-md border border-black/10" style={{ background: h }} />
                            {h.toUpperCase()}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* editorial column */}
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold text-paper">{d.kind}</span>
                    <span className="rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-2">{isBox ? "Packaging" : `${cw.name} edition`}</span>
                  </div>
                  <h2 id="detail-title" className="h-display mt-5 text-5xl text-ink sm:text-6xl">
                    {d.title}
                  </h2>
                  {d.hindi && (
                    <p lang={d.id === "cricket" ? "mr" : "hi"} className="deva mt-2 text-2xl text-red">
                      {d.hindi}
                    </p>
                  )}
                  <dl className="mt-8 space-y-6">
                    <Block k="Inspiration" v={d.inspiration} />
                    <Block k="Design decision" v={d.decision} />
                    <Block k="What it adds" v={d.contribution} />
                  </dl>
                  <p className="mt-8 border-t border-line pt-4 text-xs leading-relaxed text-ink-3">
                    Concept imagery from the design boards. A production version would be developed with material samples and strike-offs; nothing here has been manufactured.
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Block({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
      <dt className="eyebrow pt-1 text-[10px] text-ink-3">{k}</dt>
      <dd className="text-[15px] leading-relaxed text-ink">{v}</dd>
    </div>
  );
}
