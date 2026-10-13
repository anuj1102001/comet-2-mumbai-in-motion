"use client";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import { colorwayById, COLORWAYS } from "@/lib/colorways";
import { DETAILS } from "@/lib/details";
import { MOTION } from "@/lib/media";
import { store, useStore } from "@/lib/store";
import { CometLogo } from "../brand/Logo";
import { OriginButton } from "@/components/OriginButton";
import { MediaTag } from "../ui";

const SIZES = [
  { uk: 6, eu: "39", us: "7", cm: "24.5" },
  { uk: 7, eu: "40.5", us: "8", cm: "25.5" },
  { uk: 8, eu: "42", us: "9", cm: "26.5" },
  { uk: 9, eu: "43", us: "10", cm: "27.5" },
  { uk: 10, eu: "44.5", us: "11", cm: "28.5" },
  { uk: 11, eu: "46", us: "12", cm: "29.5" },
];

const MATERIALS = [
  ["Upper", "Cotton canvas, artwork printed edge to edge"],
  ["Overlays", "Suede star and heel counter, embroidered MUMBAI"],
  ["Collar & lining", "Padded collar, cotton twill lining"],
  ["Laces", "Flat cotton, edition-coloured"],
  ["Sole", "Rubber cupsole, herringbone outsole, star medallion"],
  ["Insole", "Printed footbed"],
];

/** Chapter 8: the product page — a launch layout for a concept, with no price and no checkout. */
export function Specs() {
  const colorway = useStore((s) => s.colorway);
  const cw = colorwayById(colorway);
  const [picked, setPicked] = useState({ cw: colorway, i: 0 });
  const view = picked.cw === colorway ? picked.i : 0;
  const [size, setSize] = useState(8);
  const s = SIZES.find((x) => x.uk === size)!;

  return (
    <section id="specs" aria-labelledby="h-specs" className="relative bg-paper">
      <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-24 sm:px-8 lg:px-12 lg:pt-28">
        <p className="eyebrow text-ink-3">08 · Product specifications</p>
        <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-14">
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[22px] border border-line bg-paper-2">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.img
                  key={cw.views[view].src}
                  src={cw.views[view].src}
                  alt={`${cw.name}, ${cw.views[view].label.toLowerCase()} view — concept render`}
                  className="feather-soft absolute inset-0 h-full w-full object-contain p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: MOTION.base, ease: MOTION.ease }}
                />
              </AnimatePresence>
              <div className="absolute left-4 top-4">
                <MediaTag>Concept render · {cw.views[view].label}</MediaTag>
              </div>
            </div>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto" role="group" aria-label="Product angles">
              {cw.views.map((v, i) => (
                <button
                  key={v.src}
                  onClick={() => setPicked({ cw: colorway, i })}
                  aria-pressed={view === i}
                  aria-label={`Show ${v.label} view`}
                  className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-paper-2 transition-colors ${view === i ? "border-ink" : "border-transparent hover:border-line"}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
            <p className="mt-3 text-xs text-ink-3">Views are rendered images from the approved design boards. There is no interactive 3D model on this page.</p>
          </div>

          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-terracotta/40 px-3 py-1 text-[11px] font-semibold text-terracotta">
              <i className="block h-1.5 w-1.5 rounded-full bg-terracotta" /> Design concept · not for sale
            </span>
            <div className="mt-6">
              <CometLogo size="lg" className="text-ink" />
            </div>
            <h2 id="h-specs" className="h-display mt-5 text-[clamp(2.4rem,4.6vw,4rem)] text-ink">
              Mumbai in Motion — {cw.name}
            </h2>
            <p className="deva mt-1 text-xl text-terracotta">{cw.hindi}</p>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-2">{cw.story}</p>

            <fieldset className="mt-8">
              <legend className="eyebrow text-[10px] text-ink-3">Edition</legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {COLORWAYS.map((c) => (
                  <label key={c.id} className={`cursor-pointer rounded-2xl border p-2 transition-colors ${colorway === c.id ? "border-ink" : "border-line hover:border-ink/50"}`}>
                    <input type="radio" name="edition" className="sr-only" checked={colorway === c.id} onChange={() => store.set({ colorway: c.id })} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.hero} alt="" loading="lazy" className="aspect-[2/1] w-full rounded-lg object-cover" />
                    <span className="mt-2 block text-xs font-semibold">{c.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-7">
              <legend className="eyebrow text-[10px] text-ink-3">Size · UK (visual prototype)</legend>
              <div className="mt-3 grid grid-cols-6 gap-2">
                {SIZES.map((x) => (
                  <label key={x.uk} className={`grid cursor-pointer place-items-center rounded-xl border py-3 text-sm font-semibold transition-colors ${size === x.uk ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}>
                    <input type="radio" name="size" className="sr-only" checked={size === x.uk} onChange={() => setSize(x.uk)} />
                    {x.uk}
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-ink-3">
                UK {s.uk} ≈ EU {s.eu} · US {s.us} · foot length {s.cm} cm. Indicative sizing; a production last would be fit-tested.
              </p>
            </fieldset>

            <div className="mt-8 flex flex-wrap gap-3">
              <OriginButton href="/case-study">
                View the design case study <span aria-hidden>→</span>
              </OriginButton>
              <OriginButton href="#city" variant="secondary">
                Watch the story again
              </OriginButton>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="eyebrow text-[10px] text-ink-3">Materials & construction · proposed</h3>
                <dl className="mt-3 divide-y divide-line border-y border-line text-[13px]">
                  {MATERIALS.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 py-2">
                      <dt className="text-ink-3">{k}</dt>
                      <dd className="text-ink">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div>
                <h3 className="eyebrow text-[10px] text-ink-3">Design details & inspiration</h3>
                <ul className="mt-3 divide-y divide-line border-y border-line text-[13px]">
                  {cw.details.map((id) => (
                    <li key={id} className="flex items-center justify-between gap-3 py-2">
                      <span className="text-ink">{DETAILS[id].title}</span>
                      <span className="text-right text-xs text-ink-3">{DETAILS[id].location}</span>
                    </li>
                  ))}
                </ul>
                <a href="#details" className="mt-3 inline-block text-xs font-semibold text-ink underline underline-offset-4">
                  Read each detail&apos;s rationale ↑
                </a>
              </div>
            </div>

            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line text-[13px] sm:grid-cols-3">
              {[
                ["Brand", "COMET 2.0"],
                ["Collection", "Mumbai in Motion"],
                ["Edition", cw.name],
                ["Silhouette", "Low-top, cupsole"],
                ["Eyelets", "6, metal"],
                ["Status", "Concept — unmanufactured"],
              ].map(([k, v]) => (
                <div key={k} className="bg-paper p-3">
                  <dt className="text-[11px] text-ink-3">{k}</dt>
                  <dd className="mt-0.5 font-semibold text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            <Link href="#packaging" className="group mt-8 flex items-center gap-4 rounded-2xl border border-line p-3 hover:border-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/box-open.webp" alt="" loading="lazy" className="h-20 w-28 rounded-xl object-cover" />
              <span className="flex-1">
                <span className="block text-sm font-semibold text-ink">Ships in the poster box</span>
                <span className="block text-xs text-ink-3">Toile tissue, postcard, hang tag and dust bag</span>
              </span>
              <span aria-hidden className="pr-2 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
