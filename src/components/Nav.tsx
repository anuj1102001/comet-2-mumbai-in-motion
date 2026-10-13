"use client";
import { AnimatePresence, motion, useScroll, useSpring } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/#story", label: "The Story" },
  { href: "/#sneaker", label: "The Sneaker" },
  { href: "/#chapter-postcard", label: "Design Details" },
  { href: "/#packaging", label: "Packaging" },
  { href: "/#specs", label: "Specifications" },
];

export function Star({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="-10 -10 20 20" className={className} aria-hidden>
      <path d="M0 -10 L2.4 -2.4 L10 0 L2.4 2.4 L0 10 L-2.4 2.4 L-10 0 L-2.4 -2.4 Z" fill="currentColor" />
    </svg>
  );
}

export function Nav({ home = true }: { home?: boolean }) {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <>
      <a href="#sneaker" className="sr-only z-[90] rounded bg-ink px-3 py-2 text-paper focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Skip to the sneaker
      </a>
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solid ? "bg-paper/80 backdrop-blur-md" : "bg-transparent"}`}>
        <div className="mx-auto flex h-14 max-w-[1400px] items-center justify-between px-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-ink" aria-label="Comet — Mumbai in Motion, home">
            <Star className="h-4 w-4 text-indigo" />
            <span className="text-sm font-bold tracking-[0.32em]">COMET</span>
            <span className="deva hidden text-sm text-red sm:inline">मुंबई</span>
          </Link>
          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-7 text-[13px] font-medium text-ink-2">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="transition-colors hover:text-ink">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <Link href={home ? "/case-study" : "/"} className="btn btn-line hidden py-2 text-ink sm:inline-flex">
              {home ? "Case study" : "The experience"}
            </Link>
            <button className="btn btn-ink py-2 lg:hidden" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
        <motion.div style={{ scaleX: progress }} className="h-px origin-left bg-red" />
      </header>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu"
            aria-label="Menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="fixed inset-x-3 top-16 z-50 rounded-3xl border border-line bg-paper p-3 shadow-xl lg:hidden"
          >
            <ul>
              {[...LINKS, { href: "/case-study", label: "Case study" }].map((l, i) => (
                <li key={l.href}>
                  <a href={l.href} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-2xl px-4 py-3 text-lg text-ink hover:bg-paper-2">
                    <span className="h-display">{l.label}</span>
                    <span className="font-mono text-xs text-ink-3">{String(i + 1).padStart(2, "0")}</span>
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
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="h-display text-4xl text-ink">
            Born in Mumbai. <span className="text-indigo">Made for dreamers.</span>
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-2">
            COMET — Mumbai in Motion is an original sneaker and digital-experience concept, made as a portfolio case study. Comet is a fictional label. Nothing here is for sale, and no product has been manufactured.
          </p>
        </div>
        <div className="text-sm">
          <p className="eyebrow text-[10px] text-ink-3">Explore</p>
          <ul className="mt-3 space-y-2 text-ink-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a className="hover:text-ink" href={l.href}>
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <Link className="hover:text-ink" href="/case-study">
                Design case study
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm text-ink-2">
          <p className="eyebrow text-[10px] text-ink-3">Colophon</p>
          <p className="mt-3 leading-relaxed">
            Next.js, React Three Fiber and Motion. Type: DM Serif Display, Archivo, IBM Plex Mono, Yatra One and Tiro Devanagari Hindi. The 3D sneaker is a parametric model generated in code and textured with the concept boards&apos; own artwork.
          </p>
          <p className="mt-3 font-mono text-xs text-ink-3">19.0760° N · 72.8777° E</p>
        </div>
      </div>
    </footer>
  );
}
