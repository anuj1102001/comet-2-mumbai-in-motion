"use client";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { ComponentProps, ReactNode } from "react";
import { COLORWAYS, type Colorway } from "@/lib/colorways";
import { store, useStore } from "@/lib/store";

/** Editorial reveal: fades and lifts content in as it enters the viewport. */
export function Reveal({ children, delay = 0, className, as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "p" | "h2" | "li" }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}

/** Button that leans slightly toward the cursor. */
export function Magnetic({ children, className, ...rest }: ComponentProps<"a">) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });
  const reduce = useReducedMotion();
  return (
    <motion.a
      {...(rest as object)}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * 0.22);
        y.set((e.clientY - r.top - r.height / 2) * 0.3);
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

/** Edition picker. `size="lg"` shows cards with the board render. */
export function ColorwayPicker({ size = "sm", tone = "light" }: { size?: "sm" | "lg"; tone?: "light" | "dark" }) {
  const current = useStore((s) => s.colorway);
  if (size === "lg") {
    return (
      <div role="radiogroup" aria-label="Edition" className="grid gap-3 sm:grid-cols-3">
        {COLORWAYS.map((c) => (
          <button
            key={c.id}
            role="radio"
            aria-checked={current === c.id}
            onClick={() => store.set({ colorway: c.id })}
            className={`group rounded-2xl border p-3 text-left transition-colors ${current === c.id ? "border-ink bg-ink text-paper" : "border-line bg-paper/80 hover:border-ink"}`}
          >
            <div className="overflow-hidden rounded-xl bg-paper-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.renders[0].src} alt="" className="aspect-[2/1] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-2 px-1">
              <span className="font-semibold">{c.name}</span>
              <span className="deva text-sm opacity-80">{c.hindi}</span>
            </div>
            <p className="mt-1 px-1 text-[13px] leading-snug opacity-75">{c.tagline}</p>
          </button>
        ))}
      </div>
    );
  }
  return (
    <div role="radiogroup" aria-label="Edition" className={`flex items-center gap-1 rounded-full border p-1 backdrop-blur-md ${tone === "dark" ? "border-white/15 bg-char/70" : "border-line bg-paper/80"}`}>
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
      className={`flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3 text-xs font-semibold transition-colors ${
        active ? (tone === "dark" ? "bg-paper text-ink" : "bg-ink text-paper") : tone === "dark" ? "text-paper/80 hover:bg-white/10" : "text-ink hover:bg-ink/5"
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
