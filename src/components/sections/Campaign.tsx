"use client";
import { useReduced } from "../motion/useReduced";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { MOTION } from "@/lib/media";
import { getLenis } from "@/lib/scroll";
import { CometLogo } from "../brand/Logo";
import { Reveal } from "../ui";

type Frame = { id: string; src: string; srcSet?: string; alt: string; caption: string; pos?: string };

const frame = (name: string, w: number) => ({
  src: `/img/look/${name}.webp`,
  srcSet: w > 1000 ? `/img/look/${name}-900.webp 900w, /img/look/${name}.webp ${Math.min(w, 2000)}w` : undefined,
});

/** Every campaign frame, in reading order (also the full-screen viewer's order). */
export const FRAMES = {
  platformWide: { id: "platform-wide", src: "/img/look/platform-wide.webp", srcSet: "/img/look/platform-wide-1400.webp 1400w, /img/look/platform-wide.webp 2400w", alt: "A commuter sits in the open door of a red-and-yellow local train under the CSMT platform shed, in COMET 2.0 sneakers", caption: "Platform shed · CSMT", pos: "45% 60%" },
  platform: { id: "platform", ...frame("platform", 1493), alt: "Portrait frame of a commuter in a local train doorway at CSMT, sneakers in the foreground", caption: "Doorway · portrait cut", pos: "50% 62%" },
  platformDetail: { id: "platform-detail", src: "/img/look/platform-detail.webp", alt: "Low-angle close-up of COMET 2.0 Platform Local sneakers on a worn platform floor", caption: "Detail · at platform level", pos: "40% 50%" },
  vadapav: { id: "vadapav", ...frame("vadapav", 2000), alt: "A man eats a vada pav on the kerb outside a snack stall, wearing COMET 2.0 sneakers", caption: "Vada pav, between trains", pos: "50% 60%" },
  gateway: { id: "gateway", ...frame("gateway", 633), alt: "A young man sits on the sea wall at the Gateway of India in COMET 2.0 sneakers", caption: "Gateway of India · golden hour", pos: "50% 70%" },
  box: { id: "box", ...frame("box-street", 512), alt: "The COMET 2.0 Mumbai poster box on the street", caption: "The poster box, on the street", pos: "50% 50%" },
  walk: { id: "walk", ...frame("studio-walk", 2000), alt: "A model in a cream shirt walks across a vermilion set in COMET 2.0 sneakers", caption: "In stride", pos: "50% 50%" },
  seated: { id: "seated", ...frame("studio-seated", 1493), alt: "A model in black sits on a cream plinth against vermilion, wearing COMET 2.0 sneakers", caption: "Seated · cream plinth", pos: "50% 55%" },
  step: { id: "step", ...frame("studio-step", 2000), alt: "Close crop of a COMET 2.0 Platform Local sneaker mid-step on a glossy red floor", caption: "Lateral, mid-step", pos: "50% 55%" },
  pair: { id: "pair", ...frame("studio-pair", 2000), alt: "A pair of COMET 2.0 sneakers on a glossy red floor", caption: "The pair · hero object", pos: "50% 55%" },
  billboard: { id: "billboard", src: "/img/ads/billboard.webp", alt: "Station hoarding: COMET 2.0 sneakers on the CSMT platform with the line From the platform to the street", caption: "Station hoarding · 3:1", pos: "50% 50%" },
  post: { id: "post", src: "/img/ads/post.webp", alt: "Feed post on vermilion: From the city to the spotlight", caption: "Feed post · 4:5", pos: "50% 50%" },
  story: { id: "story", src: "/img/ads/story.webp", alt: "Story: a man eats a vada pav, with the line Same city. Different stories.", caption: "Story · 9:16", pos: "50% 50%" },
  suit: { id: "suit", ...frame("studio-suit", 1493), alt: "A model in a charcoal suit and COMET 2.0 sneakers on the vermilion set", caption: "Tailored", pos: "50% 45%" },
} satisfies Record<string, Frame>;

const F = FRAMES;
const ORDER: Frame[] = [F.platformWide, F.platform, F.platformDetail, F.vadapav, F.gateway, F.box, F.walk, F.seated, F.step, F.pair, F.suit, F.billboard, F.post, F.story];

/** The three visual worlds (also listed in the Studio chapter). */
export const WORLDS = [
  { id: "platform-local", n: "01", title: "Platform Local", line: "The movement of the city: local trains, the platform shed, commuters, natural light. Low angles keep the sneaker as the anchor.", cover: F.platformWide },
  { id: "mumbai-streets", n: "02", title: "The Streets of Mumbai", line: "From CSMT towards the Gateway: architecture, stall culture and a vada pav between trains. Observational rather than staged.", cover: F.vadapav },
  { id: "red-set", n: "03", title: "The Red Set", line: "The city falls away. A vermilion set, deliberate shadows and strong silhouettes make the sneaker the hero object.", cover: F.walk },
] as const;

/**
 * Chapter 8: the campaign — one sneaker through three visual worlds, from the
 * platform to the street to a red set, closing on the brand frame. Any frame
 * opens full screen.
 */
export function Campaign() {
  const [open, setOpen] = useState<number | null>(null);
  const show = (f: Frame) => setOpen(ORDER.indexOf(f));

  return (
    <section id="campaign" aria-labelledby="h-campaign" className="relative bg-paper pb-24 pt-28 text-ink">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
        <Reveal>
          <p className="eyebrow text-ink-3">08 · The campaign</p>
          <h2 id="h-campaign" className="h-display mt-6 max-w-5xl text-[clamp(2.1rem,5.2vw,4.8rem)] leading-[1.02]">
            From the platform to the street.
            <br />
            From CSMT to the Gateway.
            <br />
            <span className="text-indigo">From the city to the spotlight.</span>
          </h2>
          <div className="mt-10 grid gap-6 border-t border-line pt-6 md:grid-cols-[1fr_1fr_1fr]">
            {WORLDS.map((w) => (
              <a key={w.id} href={`#${w.id}`} className="group block">
                <span className="font-mono text-xs text-terracotta">{w.n}</span>
                <span className="ml-3 font-semibold group-hover:underline group-hover:underline-offset-4">{w.title}</span>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{w.line}</p>
              </a>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-2">
            The product never changes between worlds: cream canvas, navy star, gum sole and the same Mumbai artwork in every frame. Only the world around it does.
          </p>
        </Reveal>

        {/* 01 · Platform Local */}
        <World w={WORLDS[0]}>
          <Tile f={F.platformWide} onOpen={show} className="aspect-[4/3] sm:aspect-[16/9]" />
          <Row>
            <Tile f={F.platform} onOpen={show} className="aspect-[4/5] lg:col-span-4 lg:aspect-auto" />
            <Tile f={F.platformDetail} onOpen={show} className="aspect-[3/2] lg:col-span-8 lg:aspect-auto" />
          </Row>
        </World>

        {/* 02 · The Streets of Mumbai */}
        <World w={WORLDS[1]}>
          <Row>
            <Tile f={F.vadapav} onOpen={show} className="aspect-[4/3] lg:col-span-8 lg:aspect-auto" />
            <Tile f={F.gateway} onOpen={show} className="aspect-[4/5] lg:col-span-4 lg:aspect-auto" />
          </Row>
          <div className="grid overflow-hidden rounded-[22px] bg-indigo text-paper sm:grid-cols-2">
            <Tile f={F.box} onOpen={show} flush className="aspect-[512/326]" />
            <div className="flex flex-col justify-between p-6 sm:p-10">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-paper/60">Sagar · Sapne · Sheher</p>
                <p className="h-display mt-10 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.05]">
                  Same city.
                  <br />
                  Different stories.
                </p>
                <p className="mt-6 text-sm leading-relaxed text-paper/70">The line printed on the lid travels with the shoe into the street.</p>
            </div>
          </div>
        </World>

        {/* 03 · The Red Set */}
        <World w={WORLDS[2]}>
          <Tile f={F.walk} onOpen={show} className="aspect-[4/3] sm:aspect-[2000/1116]" />
          <Row>
            <Tile f={F.seated} onOpen={show} className="aspect-[4/5] lg:col-span-4 lg:aspect-auto" />
            <Tile f={F.step} onOpen={show} className="aspect-[4/3] lg:col-span-8 lg:aspect-auto" />
          </Row>
          <Row>
            <Tile f={F.pair} onOpen={show} className="aspect-[4/3] lg:col-span-7 lg:aspect-auto" />
            <Tile f={F.suit} onOpen={show} className="aspect-[4/5] lg:col-span-5 lg:aspect-auto" />
          </Row>
          <BrandFrame />
        </World>

        {/* the campaign as it would run: proposed placements */}
        <div id="campaign-assets" className="mt-20 scroll-mt-20">
          <Reveal className="mb-6 grid gap-3 border-t border-ink pt-5 sm:grid-cols-[6rem_1fr_minmax(0,24rem)] sm:items-baseline">
            <span className="font-mono text-sm text-terracotta">Assets</span>
            <h3 className="h-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-none">Out in the city</h3>
            <p className="text-sm leading-relaxed text-ink-2">Proposed placements: a station hoarding for the commute, a feed post for the reveal, a story for the street. One line per world, the same lockup on each.</p>
          </Reveal>
          <div className="grid gap-3 sm:gap-4">
            <Tile f={F.billboard} plain onOpen={show} className="aspect-[3/1]" />
            <div className="grid grid-cols-[1fr_0.703fr] items-start gap-3 sm:gap-4 lg:grid-cols-[1fr_0.703fr_1.15fr]">
              <Tile f={F.post} plain onOpen={show} className="aspect-[4/5]" />
              <Tile f={F.story} plain onOpen={show} className="aspect-[9/16]" />
              <div className="col-span-2 flex flex-col justify-end self-stretch rounded-[22px] border border-line p-6 lg:col-span-1">
                <p className="font-mono text-[11px] uppercase tracking-wider text-ink-3">Proposed rollout</p>
                <ol className="mt-4 space-y-3 text-sm leading-relaxed text-ink-2">
                  <li><b className="text-ink">Tease ·</b> the platform hoarding and the launch film, no product name.</li>
                  <li><b className="text-ink">Reveal ·</b> feed posts and the red-set frames: the shoe as hero object.</li>
                  <li><b className="text-ink">Drop ·</b> stories from the street, the poster box, the site as the destination.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 font-mono text-[11px] uppercase tracking-wider text-ink-3">Select any frame to view it full screen · {ORDER.length} frames</p>
      </div>

      <Viewer index={open} onChange={setOpen} />
    </section>
  );
}

function World({ w, children }: { w: (typeof WORLDS)[number]; children: ReactNode }) {
  return (
    <div id={w.id} className="mt-20 scroll-mt-20">
      <Reveal className="mb-6 grid gap-3 border-t border-ink pt-5 sm:grid-cols-[6rem_1fr_minmax(0,24rem)] sm:items-baseline">
        <span className="font-mono text-sm text-terracotta">Chapter {w.n}</span>
        <h3 className="h-display text-[clamp(1.8rem,3.4vw,2.8rem)] leading-none">{w.title}</h3>
        <p className="text-sm leading-relaxed text-ink-2">{w.line}</p>
      </Reveal>
      <div className="grid gap-3 sm:gap-4">{children}</div>
    </div>
  );
}

function Row({ children, short }: { children: ReactNode; short?: boolean }) {
  return <div className={`grid gap-3 sm:gap-4 lg:grid-cols-12 ${short ? "lg:h-[clamp(440px,60vh,620px)]" : "lg:h-[clamp(520px,72vh,760px)]"}`}>{children}</div>;
}

/** The campaign's last frame: the brand, set in HTML on the red of the studio. */
function BrandFrame() {
  return (
    <Reveal>
      <div className="relative grid min-h-[62svh] place-items-center overflow-hidden rounded-[22px] bg-[#9e2521] px-6 py-20 text-center text-[#f3ead8]">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(255,255,255,0.14),transparent_60%)]" />
        <div className="relative">
          <CometLogo size="xl" className="mx-auto" />
          <p className="wide mt-8 text-sm font-semibold tracking-[0.42em]">MUMBAI IN MOTION</p>
          <p className="h-display mt-6 text-[clamp(1.8rem,3.6vw,3rem)]">A city that never stops.</p>
        </div>
      </div>
    </Reveal>
  );
}

function Tile({ f, onOpen, className = "", flush, plain }: { f: Frame; onOpen: (f: Frame) => void; className?: string; flush?: boolean; plain?: boolean }) {
  const reduce = useReduced();
  return (
    <motion.button
      type="button"
      onClick={() => onOpen(f)}
      aria-label={`View full screen: ${f.caption}`}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: MOTION.base, ease: MOTION.ease }}
      className={`group relative block w-full overflow-hidden ${flush ? "" : "rounded-[22px]"} bg-paper-2 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ink ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={f.src}
        srcSet={f.srcSet}
        sizes="(min-width: 1024px) 66vw, 100vw"
        alt={f.alt}
        loading="lazy"
        decoding="async"
        style={{ objectPosition: f.pos }}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.035]"
      />
      {!plain && (
        <>
          <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
          <span className="absolute bottom-4 left-4 font-mono text-[11px] uppercase tracking-wider text-white/90 sm:bottom-5 sm:left-5">{f.caption}</span>
        </>
      )}
      <span aria-hidden className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/85 text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M9.5 2.5h4v4M6.5 13.5h-4v-4M13.5 2.5 9 7M2.5 13.5 7 9" />
        </svg>
      </span>
    </motion.button>
  );
}

function Viewer({ index, onChange }: { index: number | null; onChange: (i: number | null) => void }) {
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

  const f = index === null ? null : ORDER[index];
  const navBtn = "grid h-11 w-11 place-items-center rounded-full border border-white/20 hover:bg-white/10";
  return (
    <AnimatePresence>
      {f && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Campaign frame: ${f.caption}`}
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
              {String(index! + 1).padStart(2, "0")} / {String(ORDER.length).padStart(2, "0")} · {f.caption}
            </p>
            <button ref={closeRef} type="button" onClick={() => onChange(null)} className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10">
              Close <span aria-hidden>✕</span>
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-20" onClick={(e) => e.target === e.currentTarget && onChange(null)}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={f.id}
                src={f.src}
                alt={f.alt}
                className="max-h-full max-w-full rounded-xl object-contain shadow-2xl"
                initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={reduce ? undefined : { opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.28, ease: MOTION.ease }}
              />
            </AnimatePresence>
            <button type="button" aria-label="Previous frame" onClick={() => step(-1)} className={`absolute left-6 top-1/2 hidden -translate-y-1/2 sm:grid ${navBtn}`}>
              <span aria-hidden>←</span>
            </button>
            <button type="button" aria-label="Next frame" onClick={() => step(1)} className={`absolute right-6 top-1/2 hidden -translate-y-1/2 sm:grid ${navBtn}`}>
              <span aria-hidden>→</span>
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 px-4 pb-5 sm:px-8">
            <p className="wide text-[11px] font-semibold tracking-[0.3em] text-paper/60">COMET 2.0 · MUMBAI IN MOTION</p>
            <div className="flex gap-2 sm:hidden">
              <button type="button" aria-label="Previous frame" onClick={() => step(-1)} className={navBtn}>
                ←
              </button>
              <button type="button" aria-label="Next frame" onClick={() => step(1)} className={navBtn}>
                →
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
