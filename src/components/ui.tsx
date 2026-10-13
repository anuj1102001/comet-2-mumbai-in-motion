"use client";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { COLORWAYS, type Colorway } from "@/lib/colorways";
import { MOTION } from "@/lib/media";
import { store, useStore } from "@/lib/store";

/** Editorial reveal: fades and lifts content once as it enters the viewport. */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: MOTION.base, delay, ease: MOTION.ease }}
    >
      {children}
    </motion.div>
  );
}

/** Link that leans slightly toward a mouse cursor. */
export function Magnetic({ children, className, ...rest }: ComponentProps<"a">) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 20 });
  const sy = useSpring(y, { stiffness: 220, damping: 20 });
  const reduce = useReducedMotion();
  return (
    <motion.a
      {...(rest as object)}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.18);
        y.set((e.clientY - r.top - r.height / 2) * 0.25);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.a>
  );
}

/** Small label that marks imagery as concept renders or placeholders — never implied to be something else. */
export function MediaTag({ children, tone = "light" }: { children: ReactNode; tone?: "light" | "dark" }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider ${tone === "dark" ? "bg-paper/90 text-ink" : "bg-ink/80 text-paper"}`}>
      {children}
    </span>
  );
}

/** Edition picker. `size="lg"` shows cards with the board render. */
export function ColorwayPicker({ size = "sm", tone = "light" }: { size?: "sm" | "lg"; tone?: "light" | "dark" }) {
  const current = useStore((s) => s.colorway);
  if (size === "lg") {
    return (
      <div role="radiogroup" aria-label="Edition" className="grid gap-3 sm:grid-cols-3">
        {COLORWAYS.map((c) => {
          const on = current === c.id;
          return (
            <button
              key={c.id}
              role="radio"
              aria-checked={on}
              onClick={() => store.set({ colorway: c.id })}
              className={`group rounded-2xl border p-3 text-left transition-colors duration-300 ${
                on ? (tone === "dark" ? "border-paper bg-paper text-ink" : "border-ink bg-ink text-paper") : tone === "dark" ? "border-white/15 hover:border-paper/60" : "border-line hover:border-ink"
              }`}
            >
              <div className="overflow-hidden rounded-xl bg-paper-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.hero} alt="" loading="lazy" className="aspect-[2/1] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-2 px-1">
                <span className="font-semibold">{c.name}</span>
                <span className="deva text-sm opacity-80">{c.hindi}</span>
              </div>
              <p className="mt-1 px-1 text-[13px] leading-snug opacity-70">{c.tagline}</p>
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div role="radiogroup" aria-label="Edition" className={`inline-flex items-center gap-1 rounded-full border p-1 ${tone === "dark" ? "border-white/15 bg-char-2" : "border-line bg-paper"}`}>
      {COLORWAYS.map((c) => (
        <Swatch key={c.id} c={c} active={current === c.id} tone={tone} />
      ))}
    </div>
  );
}

function Swatch({ c, active, tone }: { c: Colorway; active: boolean; tone: "light" | "dark" }) {
  return (
    <button
      role="radio"
      aria-checked={active}
      aria-label={`${c.name} edition`}
      onClick={() => store.set({ colorway: c.id })}
      className={`flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-xs font-semibold transition-colors duration-300 ${
        active ? (tone === "dark" ? "bg-paper text-ink" : "bg-ink text-paper") : tone === "dark" ? "text-paper/75 hover:bg-white/10" : "text-ink hover:bg-ink/5"
      }`}
    >
      <span className="relative block h-5 w-5 overflow-hidden rounded-full border border-black/10" style={{ background: c.colors.canvas }}>
        <span className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: c.colors.outsole }} />
        <span className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45" style={{ background: c.colors.star }} />
      </span>
      <span className="hidden sm:inline">{c.name}</span>
    </button>
  );
}

/** Section heading used by every chapter. */
export function ChapterHead({ index, kicker, title, hindi, children, tone = "light" }: { index: string; kicker: string; title: ReactNode; hindi?: string; children?: ReactNode; tone?: "light" | "dark" }) {
  return (
    <div>
      <div className={`flex items-center gap-3 ${tone === "dark" ? "text-paper/60" : "text-ink-3"}`}>
        <span className="font-mono text-xs text-terracotta">{index}</span>
        <span className="eyebrow">{kicker}</span>
        {hindi && <span className="deva text-sm">{hindi}</span>}
      </div>
      <h2 className={`h-display mt-4 text-[clamp(2.4rem,5.2vw,4.6rem)] ${tone === "dark" ? "text-paper" : "text-ink"}`}>{title}</h2>
      {children && <div className={`mt-5 max-w-xl text-[16px] leading-relaxed ${tone === "dark" ? "text-paper/70" : "text-ink-2"}`}>{children}</div>}
    </div>
  );
}
