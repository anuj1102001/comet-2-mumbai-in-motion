"use client";
import { useReduced } from "../motion/useReduced";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MOTION } from "@/lib/media";
import { getLenis } from "@/lib/scroll";
import { MediaTag, Reveal } from "../ui";

type Look = { id: string; src: string; srcSet?: string; w: number; h: number; alt: string; caption: string; pos?: string };

const img = (name: string, w: number, h: number) => ({
  src: `/img/look/${name}.webp`,
  srcSet: w > 1000 ? `/img/look/${name}-900.webp 900w, /img/look/${name}.webp ${Math.min(w, 2000)}w` : undefined,
  w,
  h,
});

/** The campaign photographs, in reading order (also the lightbox order). */
const LOOKS = {
  vadapav: { id: "vadapav", ...img("vadapav", 2000, 1493), alt: "A man eats a vada pav on the kerb outside a Mumbai snack stall, wearing COMET 2.0 sneakers", caption: "Vada pav break · street stall", pos: "50% 60%" },
  gateway: { id: "gateway", ...img("gateway", 633, 1082), alt: "A young man sits on the sea wall at the Gateway of India in COMET 2.0 sneakers", caption: "Gateway of India · golden hour", pos: "50% 70%" },
  platform: { id: "platform", ...img("platform", 1493, 2000), alt: "A commuter sits in a local train doorway at CSMT in COMET 2.0 sneakers", caption: "Local train · CSMT", pos: "50% 62%" },
  triptych: { id: "triptych", ...img("triptych", 505, 1046), alt: "Three on-foot views of COMET 2.0: side, front and heel", caption: "Side · front · heel", pos: "50% 50%" },
  box: { id: "box", ...img("box-street", 512, 326), alt: "The COMET 2.0 Mumbai poster box on a street", caption: "The poster box", pos: "50% 50%" },
  walk: { id: "walk", ...img("studio-walk", 2000, 1116), alt: "A model in a cream shirt walks across a red studio set in COMET 2.0 sneakers", caption: "Studio · in stride", pos: "50% 50%" },
  seated: { id: "seated", ...img("studio-seated", 1493, 2000), alt: "A model in black sits on a cream plinth against red, wearing COMET 2.0 sneakers", caption: "Studio · seated", pos: "50% 55%" },
  step: { id: "step", ...img("studio-step", 2000, 1493), alt: "Close crop of a COMET 2.0 Platform Local sneaker mid-step on a red studio floor", caption: "Platform Local · lateral", pos: "50% 55%" },
  pair: { id: "pair", ...img("studio-pair", 2000, 1493), alt: "A pair of COMET 2.0 sneakers on a glossy red floor", caption: "The pair · product still", pos: "50% 55%" },
  suit: { id: "suit", ...img("studio-suit", 1493, 2000), alt: "A model in a charcoal suit and COMET 2.0 sneakers in the studio", caption: "Studio · tailored", pos: "50% 45%" },
} satisfies Record<string, Look>;

const ORDER: Look[] = [LOOKS.vadapav, LOOKS.gateway, LOOKS.platform, LOOKS.triptych, LOOKS.box, LOOKS.walk, LOOKS.seated, LOOKS.step, LOOKS.pair, LOOKS.suit];

/**
 * Chapter 8: the lookbook — the shoe worn in the city, then on a red studio
 * set. Editorial rows of photographs; any frame opens full screen.
 */
export function Lookbook() {
  const [open, setOpen] = useState<number | null>(null);
  const show = (l: Look) => setOpen(ORDER.indexOf(l));

  return (
    <section id="lookbook" aria-labelledby="h-lookbook" className="relative bg-paper py-24 text-ink">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow text-ink-3">08 · Lookbook</p>
              <h2 id="h-lookbook" className="h-display mt-4 max-w-3xl text-[clamp(2.2rem,5vw,4.4rem)]">
                Worn in the city.
                <br />
                <span className="text-indigo">Shot in the studio.</span>
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-ink-2">
              The campaign: Platform Local on the street, from CSMT to the Gateway, then on a red set. AI-generated imagery, art-directed from the concept boards.
            </p>
          </div>
        </Reveal>

        {/* on the street */}
        <Label n="I" title="On the street" />
        <div className="grid gap-3 sm:gap-4 lg:h-[clamp(520px,72vh,760px)] lg:grid-cols-12">
          <Tile look={LOOKS.vadapav} onOpen={show} className="aspect-[4/3] lg:col-span-8 lg:aspect-auto" priority />
          <Tile look={LOOKS.gateway} onOpen={show} className="aspect-[4/5] lg:col-span-4 lg:aspect-auto" />
        </div>
        <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 lg:h-[clamp(480px,64vh,680px)] lg:grid-cols-12">
          <Tile look={LOOKS.platform} onOpen={show} className="aspect-[4/5] lg:col-span-5 lg:aspect-auto" />
          <Tile look={LOOKS.triptych} onOpen={show} className="hidden lg:col-span-3 lg:block" />
          <div className="grid gap-3 sm:gap-4 lg:col-span-4 lg:grid-rows-[auto_1fr]">
            <Tile look={LOOKS.box} onOpen={show} className="aspect-[512/326]" />
            <div className="flex flex-col justify-between rounded-[22px] bg-indigo p-6 text-paper sm:p-8">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">Sagar · Sapne · Sheher</p>
              <p className="h-display mt-10 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.05]">Same city.<br />Different stories.</p>
              <p className="mt-6 text-sm leading-relaxed text-paper/70">The line printed on the lid, carried through the campaign.</p>
            </div>
          </div>
        </div>

        {/* in the studio */}
        <Label n="II" title="In the studio" />
        <Tile look={LOOKS.walk} onOpen={show} className="aspect-[4/3] sm:aspect-[2000/1116]" />
        <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 lg:h-[clamp(520px,72vh,760px)] lg:grid-cols-12">
          <Tile look={LOOKS.seated} onOpen={show} className="aspect-[4/5] lg:col-span-4 lg:aspect-auto" />
          <Tile look={LOOKS.step} onOpen={show} className="aspect-[4/3] lg:col-span-8 lg:aspect-auto" />
        </div>
        <div className="mt-3 grid gap-3 sm:mt-4 sm:gap-4 lg:h-[clamp(520px,72vh,760px)] lg:grid-cols-12">
          <Tile look={LOOKS.pair} onOpen={show} className="aspect-[4/3] lg:col-span-7 lg:aspect-auto" />
          <Tile look={LOOKS.suit} onOpen={show} className="aspect-[4/5] lg:col-span-5 lg:aspect-auto" />
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-ink-3">Select any frame to view it full screen · {ORDER.length} photographs</p>
      </div>

      <Lightbox index={open} onChange={setOpen} />
    </section>
  );
}

function Label({ n, title }: { n: string; title: string }) {
  return (
    <Reveal className="mb-5 mt-16 flex items-baseline gap-4 border-t border-line pt-5">
      <span className="font-mono text-xs text-ink-3">{n}</span>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
    </Reveal>
  );
}

function Tile({ look, onOpen, className = "", priority }: { look: Look; onOpen: (l: Look) => void; className?: string; priority?: boolean }) {
  const reduce = useReduced();
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(look)}
      aria-label={`View full screen: ${look.caption}`}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: MOTION.base, ease: MOTION.ease }}
      className={`group relative block w-full overflow-hidden rounded-[22px] bg-paper-2 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={look.src}
        srcSet={look.srcSet}
        sizes="(min-width: 1024px) 60vw, 100vw"
        alt={look.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{ objectPosition: look.pos }}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
      />
      <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent opacity-80" />
      <span className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-wider text-white/90 sm:bottom-5 sm:left-5">{look.caption}</span>
      <span aria-hidden className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" /></svg>
      </span>
    </motion.button>
  );
}

function Lightbox({ index, onChange }: { index: number | null; onChange: (i: number | null) => void }) {
  const reduce = useReduced();
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<Element | null>(null);
  const step = useCallback((d: number) => onChange(index === null ? null : (index + d + ORDER.length) % ORDER.length), [index, onChange]);

  useEffect(() => {
    if (index === null) return;
    opener.current ??= document.activeElement;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    getLenis()?.stop();
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prev;
      getLenis()?.start();
    };
  }, [index, onChange, step]);

  // hand focus back to the frame that opened the viewer
  useEffect(() => {
    if (index !== null) return;
    const el = opener.current as HTMLElement | null;
    opener.current = null;
    el?.focus?.({ preventScroll: true });
  }, [index]);

  const look = index === null ? null : ORDER[index];
  return (
    <AnimatePresence>
      {look && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Lookbook photo: ${look.caption}`}
          data-lenis-prevent
          className="fixed inset-0 z-[100] flex flex-col bg-[#0f0e0d]/95 text-paper backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
          onClick={(e) => e.target === e.currentTarget && onChange(null)}
        >
          <div className="flex items-center justify-between px-4 py-4 sm:px-8">
            <p className="font-mono text-[11px] uppercase tracking-wider text-paper/70">
              {String(index! + 1).padStart(2, "0")} / {String(ORDER.length).padStart(2, "0")} · {look.caption}
            </p>
            <button ref={closeRef} type="button" onClick={() => onChange(null)} className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10">
              Close <span aria-hidden>✕</span>
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-20" onClick={(e) => e.target === e.currentTarget && onChange(null)}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={look.id}
                src={look.src}
                alt={look.alt}
                className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.28, ease: MOTION.ease }}
              />
            </AnimatePresence>
            <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className="absolute left-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 hover:bg-white/10 sm:left-6 sm:grid">
              <span aria-hidden>←</span>
            </button>
            <button type="button" aria-label="Next photo" onClick={() => step(1)} className="absolute right-2 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 hover:bg-white/10 sm:right-6 sm:grid">
              <span aria-hidden>→</span>
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 px-4 pb-5 sm:px-8">
            <MediaTag tone="dark">AI-generated campaign image</MediaTag>
            <div className="flex gap-2 sm:hidden">
              <button type="button" aria-label="Previous photo" onClick={() => step(-1)} className="h-11 w-11 rounded-full border border-white/20">←</button>
              <button type="button" aria-label="Next photo" onClick={() => step(1)} className="h-11 w-11 rounded-full border border-white/20">→</button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
