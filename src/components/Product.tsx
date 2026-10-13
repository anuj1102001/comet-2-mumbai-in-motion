"use client";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRef, useState } from "react";
import { useNear } from "@/hooks/useNear";
import { colorwayById, COLORWAYS } from "@/lib/colorways";
import { DETAILS } from "@/lib/details";
import { store, useStore } from "@/lib/store";
import { Magnetic, Reveal } from "./ui";

const Showroom = dynamic(() => import("@/three/Showroom"), { ssr: false });

const SIZES = [
  { uk: 6, eu: "39", us: "7", cm: "24.5" },
  { uk: 7, eu: "40.5", us: "8", cm: "25.5" },
  { uk: 8, eu: "42", us: "9", cm: "26.5" },
  { uk: 9, eu: "43", us: "10", cm: "27.5" },
  { uk: 10, eu: "44.5", us: "11", cm: "28.5" },
  { uk: 11, eu: "46", us: "12", cm: "29.5" },
];

const MATERIALS = [
  ["Upper", "Cotton canvas, artwork printed edge-to-edge"],
  ["Overlays", "Suede star and heel counter, embroidered MUMBAI"],
  ["Collar & lining", "Padded collar, cotton twill lining"],
  ["Laces", "Flat cotton, edition-coloured"],
  ["Sole", "Rubber cupsole, herringbone outsole, star medallion"],
  ["Insole", "Printed footbed (आमची मुंबई on the Postcard edition)"],
];

export function Product() {
  const colorway = useStore((s) => s.colorway);
  const cw = colorwayById(colorway);
  // the selected view resets to 3D whenever the edition changes
  const [picked, setPicked] = useState<{ cw: string; v: "3d" | number }>({ cw: colorway, v: "3d" });
  const view = picked.cw === colorway ? picked.v : "3d";
  const setView = (v: "3d" | number) => setPicked({ cw: colorway, v });
  const [size, setSize] = useState(8);
  const [showSizes, setShowSizes] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const near = useNear(stage, "30%");

  return (
    <section id="specs" aria-labelledby="h-specs" className="relative bg-paper">
      <div className="mx-auto max-w-[1400px] px-4 pb-24 pt-28 sm:px-8 lg:pt-32">
        <Reveal>
          <p className="eyebrow text-ink-3">From story to product</p>
        </Reveal>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
          {/* gallery */}
          <div className="lg:sticky lg:top-20 lg:self-start">
            <div ref={stage} className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-paper-2 to-paper sm:aspect-[5/4]">
              <AnimatePresence mode="wait" initial={false}>
                {view === "3d" ? (
                  <motion.div key="3d" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                    {near && <Showroom />}
                    <p className="pointer-events-none absolute left-4 top-4 eyebrow text-[10px] text-ink-3">Interactive 3D · drag to rotate</p>
                  </motion.div>
                ) : (
                  <motion.figure key={view} initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cw.renders[view].src} alt={`${cw.name} edition, ${cw.renders[view].label} — concept render`} className="h-full w-full object-contain p-4" />
                    <figcaption className="absolute left-4 top-4 rounded-full bg-ink/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-paper">Concept render · {cw.renders[view].label}</figcaption>
                  </motion.figure>
                )}
              </AnimatePresence>
            </div>
            <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto" role="group" aria-label="Views">
              <button onClick={() => setView("3d")} aria-pressed={view === "3d"} className={`grid h-16 w-20 shrink-0 place-items-center rounded-xl border text-xs font-semibold transition-colors ${view === "3d" ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}>
                3D
              </button>
              {cw.renders.map((r, i) => (
                <button key={r.src} onClick={() => setView(i)} aria-pressed={view === i} aria-label={`Show ${r.label} render`} className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${view === i ? "border-ink" : "border-transparent hover:border-line"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.src} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          </div>

          {/* product information */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-red/40 px-3 py-1 text-[11px] font-semibold text-red">
              <i className="block h-1.5 w-1.5 rounded-full bg-red" /> Design concept · not a commercial product
            </span>
            <h2 id="h-specs" className="h-display mt-5 text-[clamp(2.4rem,5vw,4.4rem)] text-ink">
              COMET — Mumbai in Motion
            </h2>
            <p className="deva mt-2 text-xl text-red">{cw.hindi} · {cw.name} edition</p>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-ink-2">{cw.story}</p>

            <fieldset className="mt-8">
              <legend className="eyebrow text-[10px] text-ink-3">Edition</legend>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {COLORWAYS.map((c) => (
                  <label key={c.id} className={`cursor-pointer rounded-2xl border p-2 transition-colors ${colorway === c.id ? "border-ink" : "border-line hover:border-ink/50"}`}>
                    <input type="radio" name="edition" className="sr-only" checked={colorway === c.id} onChange={() => store.set({ colorway: c.id })} />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={c.renders[0].src} alt="" className="aspect-[2/1] w-full rounded-lg object-cover" />
                    <span className="mt-2 block text-xs font-semibold">{c.name}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-7">
              <div className="flex items-baseline justify-between">
                <legend className="eyebrow text-[10px] text-ink-3">Size · UK</legend>
                <button type="button" className="text-xs font-semibold text-ink underline underline-offset-4" onClick={() => setShowSizes((s) => !s)} aria-expanded={showSizes}>
                  {showSizes ? "Hide" : "Size guide"}
                </button>
              </div>
              <div className="mt-3 grid grid-cols-6 gap-2">
                {SIZES.map((s) => (
                  <label key={s.uk} className={`grid cursor-pointer place-items-center rounded-xl border py-3 text-sm font-semibold transition-colors ${size === s.uk ? "border-ink bg-ink text-paper" : "border-line hover:border-ink"}`}>
                    <input type="radio" name="size" className="sr-only" checked={size === s.uk} onChange={() => setSize(s.uk)} />
                    {s.uk}
                  </label>
                ))}
              </div>
              <p className="mt-2 text-xs text-ink-3">
                UK {size} ≈ EU {SIZES.find((s) => s.uk === size)!.eu} · US {SIZES.find((s) => s.uk === size)!.us} · foot length {SIZES.find((s) => s.uk === size)!.cm} cm. Indicative sizing for the concept; a production last would be fit-tested.
              </p>
              <AnimatePresence>
                {showSizes && (
                  <motion.table initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 w-full overflow-hidden text-left text-xs">
                    <thead className="text-ink-3">
                      <tr>
                        {["UK", "EU", "US", "Foot (cm)"].map((h) => (
                          <th key={h} className="border-b border-line py-1.5 font-semibold">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="font-mono">
                      {SIZES.map((s) => (
                        <tr key={s.uk} className={size === s.uk ? "bg-paper-2" : ""}>
                          <td className="border-b border-line py-1.5">{s.uk}</td>
                          <td className="border-b border-line py-1.5">{s.eu}</td>
                          <td className="border-b border-line py-1.5">{s.us}</td>
                          <td className="border-b border-line py-1.5">{s.cm}</td>
                        </tr>
                      ))}
                    </tbody>
                  </motion.table>
                )}
              </AnimatePresence>
            </fieldset>

            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic href="/case-study" className="btn btn-ink">
                View the design case study <span aria-hidden>→</span>
              </Magnetic>
              <Magnetic href="#story" className="btn btn-line text-ink">
                Explore the concept again
              </Magnetic>
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
                <h3 className="eyebrow text-[10px] text-ink-3">Illustrations & references</h3>
                <ul className="mt-3 divide-y divide-line border-y border-line text-[13px]">
                  {cw.details.map((id) => (
                    <li key={id}>
                      <button onClick={() => store.set({ detail: id })} className="flex w-full items-center justify-between gap-3 py-2 text-left hover:text-red">
                        <span>{DETAILS[id].title}</span>
                        <span className="text-xs text-ink-3">{DETAILS[id].location}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="eyebrow text-[10px] text-ink-3">Specification</h3>
              <dl className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line text-[13px] sm:grid-cols-3">
                {[
                  ["Model", "Comet Court Low"],
                  ["Edition", cw.name],
                  ["Collection", "India · Vol. 01"],
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
              <div className="mt-3 flex items-center gap-1.5">
                {cw.palette.map((p) => (
                  <span key={p.hex} title={p.name} className="block h-6 w-6 rounded-full border border-black/10" style={{ background: p.hex }} />
                ))}
                <span className="ml-2 text-xs text-ink-3">{cw.palette.map((p) => p.name).join(" · ")}</span>
              </div>
            </div>

            <Link href="#packaging" className="group mt-10 flex items-center gap-4 rounded-2xl border border-line p-3 hover:border-ink">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/img/box-closed.webp" alt="" className="h-20 w-28 rounded-xl object-cover" loading="lazy" />
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
