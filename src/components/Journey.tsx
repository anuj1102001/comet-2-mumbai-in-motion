"use client";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CHAPTERS } from "@/lib/chapters";
import { colorwayById } from "@/lib/colorways";
import { DETAILS, imageFor } from "@/lib/details";
import { journey, scrollRig, store, useStore } from "@/lib/store";
import { shoeTextures } from "@/three/textures";
import { Intro } from "./Intro";
import { ColorwayPicker, Magnetic } from "./ui";

const StoryScene = dynamic(() => import("@/three/StoryScene"), { ssr: false });

/**
 * The journey: opening sequence + nine-chapter sneaker story over one sticky
 * 3D stage. Copy panels scroll over the stage; the stage reads the scroll
 * position every frame. Native scrolling is never hijacked.
 */
export function Journey() {
  const chapterEls = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight * 0.5;
      let pos = 0;
      chapterEls.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top <= mid) pos = i + Math.min(1, (mid - r.top) / r.height);
      });
      pos = Math.min(CHAPTERS.length - 1, pos);
      scrollRig.position = pos;
      const ch = Math.floor(pos);
      if (ch !== store.get().chapter) store.set({ chapter: ch, flat: false });
      const first = chapterEls.current[0]?.getBoundingClientRect();
      const last = chapterEls.current[CHAPTERS.length - 1]?.getBoundingClientRect();
      const inStory = !!first && !!last && first.top < window.innerHeight * 1.2 && last.bottom > 0;
      const on = inStory || journey.intro > 0.55;
      if (journey.intro > 0.3 || inStory) setMounted(true);
      setActive(on);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="relative">
      <Stage3D mounted={mounted} active={active} />
      <div className="pointer-events-none relative z-10 -mt-[100svh]">
        <div className="pointer-events-auto">
          <Intro />
        </div>
        <div id="sneaker">
          {CHAPTERS.map((c, i) => (
            <section
              key={c.id}
              id={`chapter-${c.id}`}
              ref={(el) => void (chapterEls.current[i] = el)}
              aria-labelledby={`h-${c.id}`}
              className="relative"
            >
              <ChapterBody index={i} />
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── The sticky 3D stage ───────────────────────── */

function Stage3D({ mounted, active }: { mounted: boolean; active: boolean }) {
  const chapter = useStore((s) => s.chapter);
  const flat = useStore((s) => s.flat);
  const colorway = useStore((s) => s.colorway);
  const [ready, setReady] = useState<string | null>(null);
  const drag = useRef<{ x: number; id: number } | null>(null);

  useEffect(() => {
    if (!mounted) return;
    let alive = true;
    shoeTextures(colorwayById(colorway)).then(() => alive && setReady(colorway));
    return () => {
      alive = false;
    };
  }, [colorway, mounted]);

  return (
    <div
      className="sticky top-0 z-0 h-[100svh] w-full touch-pan-y select-none"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("button")) return;
        drag.current = { x: e.clientX, id: e.pointerId };
        scrollRig.dragging = true;
      }}
      onPointerMove={(e) => {
        if (!drag.current || drag.current.id !== e.pointerId) return;
        scrollRig.yaw += (e.clientX - drag.current.x) * 0.008;
        drag.current.x = e.clientX;
      }}
      onPointerUp={() => {
        drag.current = null;
        scrollRig.dragging = false;
      }}
      onPointerCancel={() => {
        drag.current = null;
        scrollRig.dragging = false;
      }}
      style={{ cursor: chapter > 0 ? "grab" : "default" }}
    >
      {mounted && (
        <div className="absolute inset-0" style={{ visibility: active ? "visible" : "hidden" }}>
          <StoryScene />
        </div>
      )}
      {mounted && ready !== colorway && (
        <div className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center">
          <span className="eyebrow rounded-full bg-paper/90 px-4 py-2 text-ink-2">Preparing the {colorwayById(colorway).name} edition…</span>
        </div>
      )}

      <AnimatePresence>{chapter === 5 && flat && <FlatBreakdown key="flat" />}</AnimatePresence>

      {/* chapter rail */}
      <nav aria-label="Sneaker chapters" className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 lg:block">
        <ol className="flex flex-col items-end gap-1.5">
          {CHAPTERS.map((c, i) => (
            <li key={c.id}>
              <button
                onClick={() => document.getElementById(`chapter-${c.id}`)?.scrollIntoView({ behavior: "smooth" })}
                className="group flex w-full items-center justify-end gap-2 py-0.5"
                aria-current={chapter === i ? "step" : undefined}
              >
                <span className={`eyebrow text-[10px] transition-opacity ${chapter === i ? "opacity-100" : "opacity-0 group-hover:opacity-70"}`}>{c.nav}</span>
                <span className="font-mono text-[10px] text-ink-3">{c.index}</span>
                <span className="flex w-8 justify-end"><span className={`block h-px transition-all duration-500 ${chapter === i ? "w-8 bg-red" : "w-4 bg-ink/30 group-hover:bg-ink"}`} /></span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      {/* edition switch, visible through the story */}
      <div className={`absolute bottom-5 left-1/2 z-20 -translate-x-1/2 transition-opacity duration-500 ${chapter >= 1 && chapter <= 7 ? "opacity-100" : "pointer-events-none opacity-0"}`}>
        <ColorwayPicker />
      </div>
    </div>
  );
}

/** Chapter 05: the upper laid flat — the actual texture on the 3D model. */
function FlatBreakdown() {
  const cw = colorwayById(useStore((s) => s.colorway));
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    shoeTextures(cw).then((t) => alive && setUrl(t.flatUrl));
    return () => {
      alive = false;
    };
  }, [cw]);
  return (
    <motion.div
      initial={{ opacity: 0, clipPath: "inset(50% 0% 50% 0%)" }}
      animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ opacity: 0, clipPath: "inset(50% 0% 50% 0%)" }}
      transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      className="absolute inset-0 z-10 flex items-center justify-center bg-paper px-4 pt-16 lg:justify-end lg:pr-20"
    >
      <figure className="w-full max-w-3xl">
        <div
          role="img"
          aria-label={`Flat graphic breakdown of the ${cw.name} upper: the outside (lateral) and inside (medial) pattern pieces`}
          className="grid gap-2 rounded-xl border border-line bg-paper-2 p-2 shadow-[0_30px_80px_-40px_rgba(0,0,0,.45)]"
        >
          {/* The texture stores the lateral half upside-down and the medial half mirrored
              (it wraps over the top of the shoe); each half is turned upright here. */}
          {(["lateral", "medial"] as const).map((side) => (
            <div key={side} className="relative aspect-[4/1] overflow-hidden rounded-lg bg-paper">
              {url ? (
                <div
                  className="absolute inset-0 bg-no-repeat"
                  style={{
                    backgroundImage: `url(${url})`,
                    backgroundSize: "100% 200%",
                    backgroundPosition: side === "lateral" ? "0 0" : "0 100%",
                    transform: side === "lateral" ? "scaleY(-1)" : "scaleX(-1)",
                  }}
                />
              ) : (
                <div className="absolute inset-0 animate-pulse bg-paper-3/40" />
              )}
              <span className="absolute left-2 top-2 rounded bg-ink/85 px-1.5 py-0.5 font-mono text-[10px] text-paper">
                {side === "lateral" ? "Lateral · outside — heel left, toe right" : "Medial · inside — toe left, heel right"}
              </span>
              <span className="absolute bottom-2 right-2 rounded bg-paper/90 px-1.5 py-0.5 font-mono text-[10px] text-ink-2">
                {side === "lateral" ? "sole edge ↓ · top line ↑" : "perforated toe ←"}
              </span>
            </div>
          ))}
        </div>
        <figcaption className="mt-3 grid gap-2 text-[13px] leading-snug text-ink-2 sm:grid-cols-3">
          <span>
            <b className="text-ink">The texture on the 3D model.</b> Board artwork is projected onto the upper, so this flat pattern and the shoe always match.
          </span>
          <span>The blank band along each top edge is the eyestay and vamp: stitching and perforations only, so the lacing zone stays clean.</span>
          <span className="flex flex-wrap gap-1.5">
            {cw.palette.map((p) => (
              <span key={p.hex} className="inline-flex items-center gap-1.5 rounded-full border border-line px-2 py-0.5 text-[11px]">
                <i className="block h-3 w-3 rounded-full" style={{ background: p.hex }} />
                {p.name}
              </span>
            ))}
          </span>
        </figcaption>
      </figure>
    </motion.div>
  );
}

/* ───────────────────────── Chapter copy panels ───────────────────────── */

function Panel({ children, align = "left", className = "" }: { children: ReactNode; align?: "left" | "right" | "center"; className?: string }) {
  const side = align === "left" ? "lg:justify-start" : align === "right" ? "lg:justify-end" : "lg:justify-center";
  return (
    <div className={`flex min-h-[160svh] items-end px-4 pb-24 lg:min-h-[135svh] sm:px-8 lg:items-center lg:px-14 lg:pb-0 ${side}`}>
      <div className={`pointer-events-auto w-full max-w-[25rem] rounded-2xl bg-paper/80 p-5 backdrop-blur-md sm:p-6 lg:bg-paper/70 ${className}`}>{children}</div>
    </div>
  );
}

function Heading({ i }: { i: number }) {
  const c = CHAPTERS[i];
  return (
    <>
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs text-red">{c.index}</span>
        <span className="perf flex-1 text-ink" />
        {c.hindi && <span className="deva text-sm text-ink-2">{c.hindi}</span>}
      </div>
      <h2 id={`h-${c.id}`} className="h-display mt-4 text-[2.4rem] text-ink sm:text-5xl">
        {c.title}
      </h2>
      <p className="mt-4 text-[15px] leading-relaxed text-ink-2">{c.body}</p>
    </>
  );
}

function Hint({ i }: { i: number }) {
  return (
    <p className="mt-5 flex items-center gap-2 text-xs font-semibold text-ink">
      <span aria-hidden className="grid h-6 w-6 place-items-center rounded-full border border-ink/30">
        ↔
      </span>
      {CHAPTERS[i].interaction}
    </p>
  );
}

function DetailButton({ id, sub }: { id: string; sub?: string }) {
  const cw = useStore((s) => s.colorway);
  const d = DETAILS[id];
  return (
    <button onClick={() => store.set({ detail: id })} className="group flex w-full items-center gap-3 rounded-xl border border-line bg-paper/60 p-2 text-left transition-colors hover:border-ink hover:bg-paper">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageFor(d, cw)} alt="" className="h-12 w-14 shrink-0 rounded-lg object-cover" loading="lazy" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-ink">{d.title}</span>
        <span className="block truncate text-xs text-ink-3">{sub ?? d.location}</span>
      </span>
      <span aria-hidden className="pr-2 text-ink-3 transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </button>
  );
}

function ChapterBody({ index }: { index: number }) {
  switch (CHAPTERS[index].id) {
    case "reveal":
      return <Reveal4 />;
    case "silhouette":
      return (
        <Panel align="left">
          <Heading i={index} />
          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-4 text-[13px]">
            {[
              ["Silhouette", "Low-top court"],
              ["Construction", "Cupsole"],
              ["Lacing", "6 eyelets, bar-laced"],
              ["Overlay", "Raised suede star"],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow text-[10px] text-ink-3">{k}</dt>
                <dd className="mt-0.5 font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <Hint i={index} />
        </Panel>
      );
    case "postcard":
      return <PostcardPanel i={index} />;
    case "cst":
      return <CstPanel i={index} />;
    case "local":
      return <LocalPanel i={index} />;
    case "type":
      return <TypePanel i={index} />;
    case "details":
      return <DetailsPanel i={index} />;
    case "sole":
      return <SolePanel i={index} />;
    default:
      return <Final />;
  }
}

function Reveal4() {
  const c = CHAPTERS[0];
  // the copy stays pinned above and below the shoe while the reveal plays
  return (
    <div className="relative h-[170svh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between px-4 pb-10 pt-20 sm:px-10 sm:pb-14 sm:pt-24">
        <div className="pointer-events-auto mx-auto max-w-6xl text-center">
          <p className="eyebrow text-ink-2">Scene 4 · The reveal</p>
          <h2 id={`h-${c.id}`} className="h-display mt-3 text-[clamp(2.2rem,6vw,5.6rem)] uppercase text-ink">
            Mumbai never stands still.
          </h2>
          <p className="deva mt-2 text-lg text-red sm:text-2xl">{c.hindi}</p>
        </div>
        <div className="pointer-events-auto mx-auto max-w-md text-center">
          <p className="text-lg leading-relaxed text-ink">{c.body}</p>
          <p className="mt-4 flex items-center justify-center gap-3 text-xs font-semibold text-ink-2">
            <span className="eyebrow text-[10px]">Scroll to explore</span>
            <span aria-hidden className="h-px w-8 bg-ink/40" />
            <span className="eyebrow text-[10px]">Drag to rotate</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function PostcardPanel({ i }: { i: number }) {
  const cw = colorwayById(useStore((s) => s.colorway));
  return (
    <Panel align="right">
      <Heading i={i} />
      <p className="eyebrow mt-6 text-[10px] text-ink-3">On the {cw.name} edition</p>
      <div className="mt-2 grid gap-2">
        {cw.details.map((id) => (
          <DetailButton key={id} id={id} />
        ))}
      </div>
      <Hint i={i} />
    </Panel>
  );
}

const ARCH: Record<string, { src: string; label: string; crops: { name: string; pos: string }[] }> = {
  local: {
    src: "/img/local-d-cst.webp",
    label: "CST etching, medial heel quarter",
    crops: [
      { name: "Central dome", pos: "50% 18%" },
      { name: "Pointed arches", pos: "50% 82%" },
      { name: "Flanking turrets", pos: "6% 30%" },
    ],
  },
  postcard: {
    src: "/img/postcard-hero.webp",
    label: "CST etching from the Postcard poster",
    crops: [
      { name: "Central dome", pos: "70% 8%" },
      { name: "Arcade", pos: "70% 40%" },
      { name: "Turrets", pos: "52% 10%" },
    ],
  },
  harbour: {
    src: "/img/harbour-stamp.webp",
    label: "Gateway of India stamp, heel quarter",
    crops: [
      { name: "The arch", pos: "62% 46%" },
      { name: "Taj skyline", pos: "18% 40%" },
      { name: "Ferries", pos: "50% 86%" },
    ],
  },
};

function CstPanel({ i }: { i: number }) {
  const id = useStore((s) => s.colorway);
  const a = ARCH[id];
  const [mode, setMode] = useState<"full" | number>("full");
  const reduce = useReducedMotion();
  return (
    <Panel align="left">
      <Heading i={i} />
      <div className="mt-5 overflow-hidden rounded-xl border border-line bg-paper-2">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${id}-${mode}`}
            initial={reduce ? false : { opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            role="img"
            aria-label={mode === "full" ? a.label : `${a.crops[mode].name}, detail`}
            className="aspect-[4/3] w-full bg-no-repeat"
            style={{
              backgroundImage: `url(${a.src})`,
              backgroundSize: mode === "full" ? "cover" : "320%",
              backgroundPosition: mode === "full" ? "center" : a.crops[mode].pos,
            }}
          />
        </AnimatePresence>
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Illustration view">
        <button className="chip" aria-pressed={mode === "full"} onClick={() => setMode("full")}>
          Full illustration
        </button>
        {a.crops.map((c, k) => (
          <button key={c.name} className="chip" aria-pressed={mode === k} onClick={() => setMode(k)}>
            {c.name}
          </button>
        ))}
      </div>
    </Panel>
  );
}

/** A second-class suburban ticket, drawn as a reference artefact. */
function Ticket() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg bg-[#efe1c4] p-3 font-mono text-[10px] leading-tight text-ink shadow-inner">
      <div className="flex items-center justify-between border-b border-dashed border-ink/40 pb-1.5">
        <span className="font-semibold tracking-widest">MUMBAI SUBURBAN</span>
        <span>II CLASS</span>
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div>
          <p className="text-[9px] text-ink-3">FROM</p>
          <p className="text-base font-semibold">CSMT</p>
          <p className="deva-text text-[11px]">सीएसएमटी</p>
        </div>
        <span className="pb-3 text-lg">→</span>
        <div className="text-right">
          <p className="text-[9px] text-ink-3">TO</p>
          <p className="text-base font-semibold">DADAR</p>
          <p className="deva-text text-[11px]">दादर</p>
        </div>
      </div>
      <div className="mt-2 flex justify-between border-t border-dashed border-ink/40 pt-1.5 text-[9px]">
        <span>ADULT 01</span>
        <span>06:42</span>
        <span className="text-red">ORDINARY</span>
      </div>
      <span className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-paper" />
      <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-paper" />
    </div>
  );
}

function StationBoard() {
  return (
    <div className="grid h-full w-full place-items-center rounded-lg bg-[#e0b33b] p-3 text-center text-ink">
      <div className="w-full rounded border-2 border-ink px-2 py-3">
        <p className="deva text-2xl leading-none">मुंबई</p>
        <p className="mt-1 font-sans text-sm font-bold tracking-[0.25em]">MUMBAI</p>
      </div>
    </div>
  );
}

function StallBoard() {
  return (
    <div className="grid h-full w-full place-items-center rounded-lg bg-[#b3402d] p-3 text-center text-paper">
      <div>
        <p className="deva text-3xl leading-none">वड़ा पाव</p>
        <p className="mt-2 font-mono text-[10px] tracking-widest opacity-80">GARAM · TEEKHA · TAAZA</p>
      </div>
    </div>
  );
}

function FlipCard({ front, back, label, refLabel }: { front: string; back: ReactNode; label: string; refLabel: string }) {
  const [flipped, setFlipped] = useState(false);
  const reduce = useReducedMotion();
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${label}: show ${flipped ? "the detail on the product" : "its inspiration reference"}`}
      className="group block w-full text-left [perspective:900px]"
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.75, ease: [0.65, 0, 0.35, 1] }}
        className="relative aspect-[4/3] w-full [transform-style:preserve-3d]"
      >
        <div className="absolute inset-0 overflow-hidden rounded-xl border border-line [backface-visibility:hidden]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={front} alt="" className="h-full w-full object-cover" />
          <span className="absolute left-2 top-2 rounded-full bg-paper/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider">On the product</span>
        </div>
        <div className="absolute inset-0 rounded-xl border border-line bg-paper p-2 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {back}
          <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider">Reference</span>
        </div>
      </motion.div>
      <span className="mt-2 flex items-center justify-between text-xs">
        <span className="font-semibold text-ink">{label}</span>
        <span className="text-ink-3 group-hover:text-ink">{flipped ? "← product" : `${refLabel} →`}</span>
      </span>
    </button>
  );
}

function LocalPanel({ i }: { i: number }) {
  const cw = useStore((s) => s.colorway);
  return (
    <Panel align="right" className="lg:max-w-[28rem]">
      <Heading i={i} />
      <div className="mt-5 grid grid-cols-2 gap-3">
        <FlipCard
          front={cw === "local" ? "/img/local-d-sign.webp" : cw === "postcard" ? "/img/postcard-d-train.webp" : "/img/harbour-d-toe.webp"}
          back={<StationBoard />}
          label="Platform signage"
          refLabel="Board"
        />
        <FlipCard front={cw === "harbour" ? "/img/box-inserts.webp" : imageFor(DETAILS.vadapav, cw)} back={cw === "harbour" ? <Ticket /> : <StallBoard />} label={cw === "harbour" ? "Ticket stub" : "Stall lettering"} refLabel="Source" />
      </div>
      <div className="mt-3 overflow-hidden rounded-xl border border-line">
        <div className="grid grid-cols-[1fr_auto] items-center gap-3 p-3">
          <div className="h-24">
            <Ticket />
          </div>
          <p className="max-w-[9rem] text-xs leading-snug text-ink-2">
            The ticket stub lives on the hang tag and box insert, not the shoe — kept off the upper so it stays uncluttered.
          </p>
        </div>
      </div>
      <Hint i={i} />
    </Panel>
  );
}

const PROOF = [
  ["मुंबई", "Mumbai", "Hindi & Marathi"],
  ["लोकल", "local (train)", "Hindi loanword"],
  ["वड़ा पाव", "vada pav", "Hindi, with nukta ड़"],
  ["आमची मुंबई", "our Mumbai", "Marathi"],
  ["प्लेटफ़ॉर्म", "platform", "Hindi, with nukta फ़"],
];

function TypePanel({ i }: { i: number }) {
  const flat = useStore((s) => s.flat);
  return (
    <Panel align="left" className="lg:max-w-[27rem]">
      <Heading i={i} />
      <div className="mt-5 rounded-xl border border-line bg-paper p-4">
        <div className="flex items-end justify-between gap-3">
          <p className="deva text-4xl leading-none text-red">मुंबई लोकल</p>
          <p className="h-display text-3xl text-indigo">MUMBAI</p>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-line pt-3 text-[11px] leading-snug text-ink-2">
          <p>
            <b className="block text-ink">Voice</b>Yatra One — hand-painted Devanagari
          </p>
          <p>
            <b className="block text-ink">Label</b>DM Serif — enamel-board capitals
          </p>
          <p>
            <b className="block text-ink">Data</b>
            <span className="font-mono">19.0760° N</span>
          </p>
        </div>
      </div>
      <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-paper/60 text-[13px]">
        {PROOF.map(([d, en, note]) => (
          <li key={d} className="flex items-center gap-3 px-3 py-2">
            <span aria-hidden className="text-[11px] text-red">✓</span>
            <span lang="hi" className="deva-text w-24 text-base text-ink">
              {d}
            </span>
            <span className="flex-1 text-ink-2">{en}</span>
            <span className="text-[11px] text-ink-3">{note}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex gap-1.5" role="group" aria-label="View">
        <button className="chip" aria-pressed={!flat} onClick={() => store.set({ flat: false })}>
          3D shoe
        </button>
        <button className="chip" aria-pressed={flat} onClick={() => store.set({ flat: true })}>
          Flat graphic breakdown
        </button>
      </div>
    </Panel>
  );
}

function DetailsPanel({ i }: { i: number }) {
  return (
    <Panel align="right">
      <Heading i={i} />
      <div className="mt-5 flex flex-wrap gap-1.5 text-[11px]">
        {["Functional", "Conceptual", "Decorative"].map((k) => (
          <span key={k} className="rounded-full border border-line px-2 py-0.5 text-ink-2">
            {k}
          </span>
        ))}
      </div>
      <div className="mt-3 grid gap-2">
        {["heel", "laces", "perforations", "star"].map((id) => (
          <DetailButton key={id} id={id} sub={DETAILS[id].kind} />
        ))}
      </div>
      <Hint i={i} />
    </Panel>
  );
}

function SolePanel({ i }: { i: number }) {
  const cw = colorwayById(useStore((s) => s.colorway));
  return (
    <Panel align="left">
      <Heading i={i} />
      <dl className="mt-5 divide-y divide-line border-y border-line text-[13px]">
        {[
          ["Build", "Cupsole, stitched-look sidewall"],
          ["Traction", "Herringbone, full length"],
          ["Pivot", "Star medallion under the forefoot"],
          ["Colour", cw.id === "harbour" ? "Navy outsole, cream wall" : "Gum outsole, cream wall"],
        ].map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 py-2">
            <dt className="text-ink-3">{k}</dt>
            <dd className="text-right font-semibold text-ink">{v}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3">
        <DetailButton id="outsole" sub="Open the outsole breakdown" />
      </div>
      <Hint i={i} />
    </Panel>
  );
}

function Final() {
  const c = CHAPTERS[8];
  return (
    <div className="flex min-h-[175svh] flex-col justify-between px-4 pb-16 pt-[14svh] sm:px-10">
      <div className="pointer-events-auto mx-auto max-w-5xl text-center">
        <p className="eyebrow text-ink-2">08 · The final composition</p>
        <h2 id={`h-${c.id}`} className="h-display mt-4 text-[clamp(2.4rem,7.4vw,7rem)] uppercase text-ink">
          Built from the city. <span className="text-indigo">Made to move.</span>
        </h2>
        <p className="deva mt-3 text-xl text-red">{c.hindi}</p>
      </div>
      <div className="pointer-events-auto mx-auto mt-[62svh] w-full max-w-4xl rounded-3xl bg-paper/85 p-4 backdrop-blur-md sm:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow text-[10px] text-ink-3">Three editions · one silhouette</p>
            <p className="mt-1 text-[15px] text-ink-2">{c.body}</p>
          </div>
          <div className="flex gap-2">
            <Magnetic href="#packaging" className="btn btn-ink">
              The packaging <span aria-hidden>↓</span>
            </Magnetic>
          </div>
        </div>
        <ColorwayPicker size="lg" />
      </div>
    </div>
  );
}

