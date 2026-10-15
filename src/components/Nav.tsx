"use client";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CHAPTERS } from "@/lib/chapters";
import { CometLogo } from "./brand/Logo";
import { DesignerCredit } from "./DesignerCredit";
import { OriginButton } from "@/components/OriginButton";


/** Header links; `match` lists the chapters during which each one shows as current. */
const PRIMARY = [
  { href: "/#city", label: "Story", match: ["city", "reveal"] },
  { href: "/#silhouette", label: "Sneaker", match: ["silhouette", "postcard"] },
  { href: "/#details", label: "Design Details", match: ["details"] },
  { href: "/#packaging", label: "Packaging", match: ["packaging"] },
  { href: "/#studio", label: "Studio", match: ["studio"] },
];

const DARK = new Set(["city", "reveal", "packaging", "collection", "studio"]);

/** Which chapter sits under the middle of the viewport — one observer, no scroll handler. */
function useActiveChapter(enabled: boolean) {
  const [active, setActive] = useState("city");
  useEffect(() => {
    if (!enabled) return;
    const ids = ["city", "silhouette", "postcard", "details", "packaging", "collection", "campaign", "studio", "specs"];
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    // the reveal is the second half of the opening section
    const reveal = document.getElementById("reveal");
    const io2 = new IntersectionObserver(([e]) => setActive((a) => (a === "city" || a === "reveal" ? (e.boundingClientRect.top < window.innerHeight / 2 ? "reveal" : "city") : a)), {
      threshold: [0, 1],
    });
    if (reveal) io2.observe(reveal);
    return () => {
      io.disconnect();
      io2.disconnect();
    };
  }, [enabled]);
  return active;
}

export function Nav({ home = true }: { home?: boolean }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 32 });
  const [open, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const active = useActiveChapter(home);
  // the bar sits over dark sections without a background; elsewhere it gets a paper backing
  const overDark = home && DARK.has(active) && active !== "reveal";
  const solid = !atTop && !overDark;
  // dark chapters with content scrolling underneath (not the full-bleed opening) get a charcoal backing
  const smoke = !atTop && overDark && active !== "city";

  useEffect(() => {
    const on = () => setAtTop(window.scrollY < 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <a href="#silhouette" className="sr-only z-[90] rounded bg-ink px-3 py-2 text-paper focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to the sneaker
      </a>
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid ? "bg-paper/92" : smoke ? "bg-char/92" : "bg-transparent"}`}>
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-8 lg:px-12">
          <Link href="/" className={`transition-colors duration-500 ${overDark ? "text-paper" : "text-ink"}`} aria-label="COMET 2.0 — home">
            <CometLogo size="sm" />
          </Link>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className={`flex items-center gap-7 text-[13px] font-medium transition-colors duration-500 ${overDark ? "text-paper/80" : "text-ink-2"}`}>
              {PRIMARY.map((l) => {
                const on = home && l.match.includes(active);
                return (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      aria-current={on ? "location" : undefined}
                      className={`relative py-1 transition-colors duration-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-terracotta after:transition-transform after:duration-500 ${on ? (overDark ? "text-paper after:scale-x-100" : "text-ink after:scale-x-100") : `after:scale-x-0 ${overDark ? "hover:text-paper" : "hover:text-ink"}`}`}
                    >
                      {l.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <OriginButton href={home ? "/case-study" : "/"} size="sm" variant="secondary" tone={overDark ? "dark" : "light"} className="hidden sm:inline-flex">
              {home ? "Case study" : "The experience"}
            </OriginButton>
            <OriginButton size="sm" tone={overDark ? "dark" : "light"} className="lg:hidden" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
              {open ? "Close" : "Menu"}
            </OriginButton>
          </div>
        </div>
        <motion.div style={{ scaleX: progress }} className="h-px origin-left bg-terracotta" />
      </header>

      {home && (
        <nav aria-label="Chapters" className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 2xl:block">
          <ol className="flex flex-col items-end gap-2">
            {CHAPTERS.map((c) => {
              const on = active === c.id;
              const light = DARK.has(active) && active !== "reveal";
              return (
                <li key={c.id}>
                  <a href={`#${c.id}`} aria-current={on ? "step" : undefined} className="group flex items-center gap-2 py-0.5">
                    <span className={`eyebrow text-[10px] transition-opacity duration-300 ${on ? "opacity-100" : "opacity-0 group-hover:opacity-70"} ${light ? "text-paper" : "text-ink"}`}>{c.label}</span>
                    <span className={`font-mono text-[10px] ${light ? "text-paper/50" : "text-ink-3"}`}>{c.n}</span>
                    <span className="flex w-8 justify-end">
                      <span className={`block h-px transition-all duration-500 ${on ? "w-8 bg-terracotta" : `w-3 ${light ? "bg-paper/40" : "bg-ink/30"}`}`} />
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>
        </nav>
      )}

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu"
            aria-label="Menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-3 top-16 z-50 max-h-[80svh] overflow-y-auto rounded-3xl border border-line bg-paper p-3 shadow-xl lg:hidden"
          >
            <ul>
              {PRIMARY.map((l) => {
                const on = home && l.match.includes(active);
                return (
                  <li key={l.href}>
                    <a href={l.href} onClick={() => setOpen(false)} aria-current={on ? "location" : undefined} className={`flex items-center justify-between rounded-2xl px-4 py-3 text-lg text-ink hover:bg-paper-2 ${on ? "bg-paper-2" : ""}`}>
                      <span className="h-display">{l.label}</span>
                      <span className="font-mono text-xs text-ink-3">{CHAPTERS.find((c) => c.id === l.match[0])?.n}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
            <ul className="mt-2 grid grid-cols-2 gap-1 border-t border-line pt-3">
              {[...CHAPTERS.filter((c) => !PRIMARY.some((l) => l.match[0] === c.id)).map((c) => ({ href: `/#${c.id}`, label: c.label })), { href: "/case-study", label: "Case study →" }].map((l) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)} className="block rounded-xl px-4 py-2 text-sm text-ink-2 hover:bg-paper-2">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper-2">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-12">
        <div>
          <CometLogo size="lg" className="text-ink" />
          <p className="wide mt-4 text-xs font-semibold tracking-[0.42em] text-ink-2">MUMBAI IN MOTION</p>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-ink-2">
            COMET 2.0 is a fictional sneaker label, and Mumbai in Motion is an original concept collection made as a portfolio case study. It is not affiliated with any existing company or brand of a similar name. Nothing here is for sale, and no pair has been manufactured.
          </p>
          <DesignerCredit />
        </div>
        <div className="text-sm">
          <p className="eyebrow text-[10px] text-ink-3">Chapters</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-ink-2">
            {CHAPTERS.map((c) => (
              <li key={c.id}>
                <a className="hover:text-ink" href={`/#${c.id}`}>
                  {c.label}
                </a>
              </li>
            ))}
            <li>
              <Link className="hover:text-ink" href="/case-study">
                Case study
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm text-ink-2">
          <p className="eyebrow text-[10px] text-ink-3">Colophon</p>
          <p className="mt-3 leading-relaxed">
            Next.js and Motion. Type: Archivo, DM Serif Display, IBM Plex Mono, Yatra One and Tiro Devanagari Hindi. Product views are the approved concept renders; the campaign frames are art-directed around them.
          </p>
          <p className="mt-3 font-mono text-xs text-ink-3">19.0760° N · 72.8777° E</p>
        </div>
      </div>
    </footer>
  );
}
