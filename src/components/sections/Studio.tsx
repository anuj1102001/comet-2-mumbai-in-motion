"use client";
import { useReduced } from "../motion/useReduced";
import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { COLORWAYS } from "@/lib/colorways";
import { MOTION } from "@/lib/media";
import { Reveal } from "../ui";
import { WORLDS } from "./Campaign";

const LOCAL = COLORWAYS[0];

const REFERENCES = [
  { img: "/img/local-d-train.webp", title: "The local train", note: "Red-and-yellow rakes and open doors set the campaign's first world, and the low, platform-level camera." },
  { img: "/img/local-d-cst.webp", title: "The terminus", note: "CSMT's arches and dome give the street chapter its architecture, and the shoe its one-weight etching line." },
  { img: "/img/local-d-vadapav.webp", title: "Street culture", note: "The vada pav stall: the everyday ritual a souvenir would leave out, staged as a pause between trains." },
  { img: "/img/postcard-stamp.webp", title: "Vintage postcards", note: "Hand-tinted views, borders and postmarks: framing, limited ink sets and the box's poster composition." },
  { img: "/img/local-d-sign.webp", title: "Hindi–English type", note: "Enamel station boards, Devanagari stacked over Latin capitals: the voice of the shoe, the box and this site." },
];

const PLACEMENT = [
  ["The star", "Navy, on both quarters, laid over the artwork: the one constant across editions and the root of the comet mark."],
  ["Local train", "Runs heel to toe along the lateral quarter so it reads as motion when the wearer walks; stops short of the star and below the eyestay."],
  ["CST artwork", "Medial heel quarter, drawn as an etching in one weight of indigo: the silhouette reads from a metre away, the hatching up close."],
  ["Vada pav", "The only full-colour illustration, placed low near the toe to be discovered rather than announced."],
  ["Typography", "Boxed मुंबई / MUMBAI station tiles on the quarter, MUMBAI embroidered at the heel, COMET woven on the tongue."],
  ["Materials", "Cream canvas upper, navy suede star and heel counter, chai-brown laces, gum herringbone outsole with a star medallion."],
];

const PACKAGING = [
  { img: "/img/box-closed.webp", title: "The poster box", note: "The lid is a poster: the shoe breaks the frame, CST etched behind, a red sun." },
  { img: "/img/box-open.webp", title: "Wrapping", note: "Indigo toile tissue redrawn with Mumbai scenes, closed with a star seal." },
  { img: "/img/box-inserts.webp", title: "Postcard, tag and bag", note: "A postcard to send home, a ticket-style hang tag and a navy dust bag." },
];

const PALETTE = [
  ["Platform cream", "#ece2cf"],
  ["Signal navy", "#1d2a4c"],
  ["Charcoal", "#1f1d1b"],
  ["Terracotta", "#b3533a"],
  ["Gum", "#7a4a29"],
  ["Set vermilion", "#9e2521"],
];

const DECISIONS = [
  ["Colour", "Cream is the canvas, so the illustrations read like ink on paper. Navy carries the brand (star, heel, lettering); red appears only in the train and the Devanagari. The vermilion set is the cream sneaker's strongest contrast."],
  ["Graphic placement", "Scenes live on the quarters; the vamp and eyestay stay clean. The loudest references sit where the eye lands first, the small ones low, near the toe."],
  ["Typography", "Two scripts, one hierarchy: Devanagari is the voice, hand-painted and red; Latin capitals are the label, in navy. Every Hindi word is proofread."],
  ["Materials", "Canvas because it takes print like poster paper; suede for depth in the navy; a gum sole for warmth underfoot."],
  ["Packaging", "The box extends the shoe rather than protecting it: a poster outside, the city's ephemera inside, and the campaign line on the lid."],
  ["Storytelling", "The site moves like the campaign: platform, street, detail, box, set. The product stays fixed while the world changes, and motion stays restrained so the work leads."],
];

/**
 * Chapter 9: the studio — the thinking and craft behind the concept: art
 * direction, product design, packaging, campaign direction and the decisions
 * that tie them together.
 */
export function Studio() {
  return (
    <section id="studio" aria-labelledby="h-studio" className="relative scroll-mt-14 bg-char pb-24 pt-28 text-paper">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
        <Reveal>
          <p className="eyebrow text-paper/60">09 · Studio</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <h2 id="h-studio" className="h-display text-[clamp(2.4rem,5.6vw,5rem)] leading-[1.02]">
              The thinking
              <br />
              <span className="italic text-saffron">behind the work.</span>
            </h2>
            <p className="max-w-md text-[15px] leading-relaxed text-paper/70">
              One idea runs through every part of COMET 2.0: Mumbai in motion. Here is how it shaped the art direction, the shoe, the box, the campaign and the decisions in between.
            </p>
          </div>
          <ol className="mt-12 flex flex-wrap gap-x-8 gap-y-2 border-t border-white/15 pt-5 font-mono text-[11px] uppercase tracking-wider text-paper/50">
            {["Art direction", "Product design", "Packaging design", "Campaign direction", "Design decisions"].map((t, i) => (
              <li key={t}>
                <span className="text-terracotta">{String(i + 1).padStart(2, "0")}</span> {t}
              </li>
            ))}
          </ol>
        </Reveal>

        <Block n="01" title="Art direction" intro="Five sources, one visual language. Each one leaves a mark on the shoe and on the campaign.">
          <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
            {REFERENCES.map((r, i) => (
              <li key={r.title} className={i === 4 ? "col-span-2 lg:col-span-1" : undefined}>
                <Reveal delay={i * 0.05}>
                  <div className="overflow-hidden rounded-2xl bg-paper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.img} alt="" loading="lazy" decoding="async" className="aspect-square w-full object-cover" />
                  </div>
                  <p className="mt-3 font-semibold">{r.title}</p>
                  <p className="mt-1 text-[13px] leading-relaxed text-paper/65">{r.note}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </Block>

        <Block n="02" title="Product design" intro="Platform Local from every side. The silhouette is a classic low-top court shoe; the city lives in where each graphic sits.">
          <ProductViewer />
        </Block>

        <Block n="03" title="Packaging design" intro="Box, wrap and inserts as one system: the same etching line, the same two scripts, the same navy and red.">
          <div className="grid gap-4 sm:grid-cols-3">
            {PACKAGING.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <figure>
                  <div className="overflow-hidden rounded-2xl bg-paper">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={`${p.title}: ${p.note}`} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                  </div>
                  <figcaption className="mt-3">
                    <b className="block">{p.title}</b>
                    <span className="mt-1 block text-[13px] leading-relaxed text-paper/65">{p.note}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Block>

        <Block n="04" title="Campaign direction" intro="Three worlds, one product. The camera language moves from observed to controlled as the campaign travels from the platform to the set.">
          <div className="grid gap-4 md:grid-cols-3">
            {WORLDS.map((w, i) => (
              <Reveal key={w.id} delay={i * 0.06}>
                <a href={`#${w.id}`} className="group block">
                  <div className="relative overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={w.cover.src}
                      srcSet={w.cover.srcSet}
                      sizes="(min-width: 768px) 33vw, 100vw"
                      alt=""
                      loading="lazy"
                      decoding="async"
                      style={{ objectPosition: w.cover.pos }}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    />
                    <span className="absolute left-4 top-4 rounded-full bg-paper/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ink">Chapter {w.n}</span>
                  </div>
                  <p className="mt-3 flex items-center justify-between font-semibold">
                    {w.title} <span aria-hidden className="text-paper/50 transition-transform duration-300 group-hover:-translate-y-0.5">↑</span>
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-paper/65">{w.line}</p>
                </a>
              </Reveal>
            ))}
          </div>
        </Block>

        <Block n="05" title="Design decisions" intro="Why it looks the way it does, and how the physical product and the digital experience share one system.">
          <ul className="mb-10 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {PALETTE.map(([name, hex]) => (
              <li key={hex}>
                <i className="block aspect-[4/3] rounded-xl border border-white/10" style={{ background: hex }} />
                <span className="mt-2 block text-[12px] font-semibold">{name}</span>
                <span className="block font-mono text-[10px] text-paper/50">{hex}</span>
              </li>
            ))}
          </ul>
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {DECISIONS.map(([k, v]) => (
              <div key={k} className="border-t border-white/15 pt-4">
                <dt className="font-semibold">{k}</dt>
                <dd className="mt-2 text-[14px] leading-relaxed text-paper/70">{v}</dd>
              </div>
            ))}
          </dl>
        </Block>
      </div>
    </section>
  );
}

function Block({ n, title, intro, children }: { n: string; title: string; intro: string; children: ReactNode }) {
  return (
    <div className="mt-20 grid gap-8 border-t border-white/15 pt-8 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12">
      <Reveal>
        <p className="font-mono text-xs text-terracotta">{n}</p>
        <h3 className="h-display mt-3 text-3xl sm:text-4xl">{title}</h3>
        <p className="mt-4 max-w-xs text-[14px] leading-relaxed text-paper/65">{intro}</p>
      </Reveal>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Six views of the approved Platform Local render, with the placement notes beside them. */
function ProductViewer() {
  const reduce = useReduced();
  const [i, setI] = useState(0);
  const v = LOCAL.views[i];
  return (
    <div className="grid gap-8 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div>
        <div className="relative overflow-hidden rounded-2xl bg-paper">
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={v.src}
              src={v.src}
              alt={`Platform Local, ${v.label.toLowerCase()} view`}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.35, ease: MOTION.ease }}
              className="feather-soft aspect-[16/10] w-full object-contain"
            />
          </AnimatePresence>
        </div>
        <div role="group" aria-label="View" className="mt-4 flex flex-wrap gap-2">
          {LOCAL.views.map((x, k) => (
            <button
              key={x.label}
              type="button"
              aria-pressed={k === i}
              onClick={() => setI(k)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors duration-300 ${k === i ? "border-paper bg-paper text-ink" : "border-white/20 text-paper/80 hover:border-paper/60"}`}
            >
              {x.label}
            </button>
          ))}
        </div>
        <p aria-live="polite" className="mt-3 text-[13px] text-paper/65">
          <b className="text-paper">{v.label}.</b> {v.note}
        </p>
      </div>
      <dl className="divide-y divide-white/10 border-y border-white/10">
        {PLACEMENT.map(([k, d]) => (
          <div key={k} className="grid gap-1 py-3.5 sm:grid-cols-[7.5rem_1fr]">
            <dt className="text-sm font-semibold">{k}</dt>
            <dd className="text-[13px] leading-relaxed text-paper/70">{d}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
