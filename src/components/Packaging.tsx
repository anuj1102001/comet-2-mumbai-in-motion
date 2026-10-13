"use client";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { useNear } from "@/hooks/useNear";
import { BOX_DETAILS } from "@/lib/packaging";
import { store } from "@/lib/store";
import { ColorwayPicker, Reveal } from "./ui";

const BoxScene = dynamic(() => import("@/three/BoxScene"), { ssr: false });

const RENDERS = [
  { src: "/img/box-closed.webp", label: "Closed box — poster lid and train frieze" },
  { src: "/img/box-open.webp", label: "Opened — toile tissue and star seal" },
  { src: "/img/box-inserts.webp", label: "Postcard, hang tag and dust bag" },
  { src: "/img/postcard-stamp.webp", label: "Air-mail stamp artwork" },
  { src: "/img/harbour-stamp.webp", label: "Harbour edition stamp" },
];

export function Packaging() {
  const stage = useRef<HTMLDivElement>(null);
  const near = useNear(stage, "40%");
  const [open, setOpen] = useState(false);

  return (
    <section id="packaging" aria-labelledby="h-packaging" className="relative bg-char text-paper">
      <div className="mx-auto max-w-[1400px] px-4 pb-10 pt-28 sm:px-8 lg:pt-36">
        <Reveal>
          <p className="eyebrow text-paper/60">Packaging · the collectible box</p>
        </Reveal>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <Reveal>
            <h2 id="h-packaging" className="h-display text-[clamp(2.6rem,6.4vw,5.8rem)]">
              A poster <span className="italic text-saffron">you can open.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-lg text-[15px] leading-relaxed text-paper/75">
              The box borrows from Indian travel posters and railway ephemera — the same red sun, terminus etching and two-script lettering as the shoe. The edition&apos;s board render is printed on the lid, so every box is the poster of the pair inside it.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 pb-16 sm:px-8 lg:grid-cols-[1fr_22rem]">
        <div ref={stage} className="relative h-[62svh] min-h-[420px] overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-char-2 to-char lg:h-[74svh]">
          {near && <BoxScene open={open} />}
          <div className="absolute inset-x-3 bottom-3 flex flex-wrap items-center justify-between gap-2">
            <button onClick={() => setOpen((o) => !o)} className="btn bg-paper text-ink hover:bg-saffron" aria-pressed={open}>
              {open ? "Close the box" : "Open the box"}
            </button>
            <ColorwayPicker tone="dark" />
          </div>
          <p className="pointer-events-none absolute left-4 top-4 eyebrow text-[10px] text-paper/50">Drag to rotate · tap a marker</p>
        </div>

        <aside className="flex flex-col gap-3">
          <p className="eyebrow text-[10px] text-paper/50">What&apos;s in the box</p>
          {Object.values(BOX_DETAILS).map((d, i) => (
            <button
              key={d.id}
              onClick={() => store.set({ detail: d.id })}
              className="group flex items-center gap-3 rounded-2xl border border-white/10 p-3 text-left transition-colors hover:border-paper/50 hover:bg-white/5"
            >
              <span className="font-mono text-xs text-saffron">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex-1">
                <span className="block text-sm font-semibold">{d.title}</span>
                <span className="block text-xs text-paper/55">{d.location}</span>
              </span>
              <span aria-hidden className="text-paper/40 transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </button>
          ))}
          <div className="mt-2 rounded-2xl border border-white/10 p-4 text-[13px] leading-relaxed text-paper/70">
            <p className="eyebrow mb-2 text-[10px] text-paper/50">Print finish · proposed</p>
            Uncoated paperboard printed in two spot colours, indigo and signal red, over a kraft interior. The star on the lid would be blind-debossed. Specifications are proposals for a production partner, not tested.
          </div>
        </aside>
      </div>

      <div className="mx-auto max-w-[1400px] px-4 pb-28 sm:px-8">
        <p className="eyebrow mb-4 text-[10px] text-paper/50">Concept renders</p>
        <ul className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 sm:mx-0 sm:grid sm:grid-cols-5 sm:px-0">
          {RENDERS.map((r) => (
            <li key={r.src} className="w-[68vw] shrink-0 snap-start sm:w-auto">
              <figure>
                <div className="overflow-hidden rounded-2xl bg-char-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.src} alt={r.label} loading="lazy" className="aspect-[4/5] w-full object-cover transition-transform duration-700 hover:scale-105" />
                </div>
                <figcaption className="mt-2 text-xs text-paper/60">{r.label}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
