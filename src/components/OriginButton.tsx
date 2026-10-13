"use client";
import { useReduced } from "./motion/useReduced";
import { motion } from "motion/react";
import Link from "next/link";
import { forwardRef, useCallback, useRef, useState, type KeyboardEvent, type MouseEventHandler, type PointerEvent, type ReactNode } from "react";

/**
 * Origin button — adapted from "Origin Button" by @lyanchouss on 21st.dev.
 * A fill grows out of the exact point where the pointer enters (or from the
 * centre on keyboard focus) until it covers the whole button, and the label
 * inverts. Retuned to the COMET palette and made to work as a link, a button
 * or a tab.
 */

type Variant = "primary" | "secondary";
type Tone = "light" | "dark";

// base = surface at rest, text = label at rest, fill = the growing circle, on = label once filled
const SKIN: Record<Tone, Record<Variant, { base: string; text: string; fill: string; on: string }>> = {
  light: {
    primary: { base: "border-ink bg-ink", text: "text-paper", fill: "bg-terracotta", on: "text-paper" },
    secondary: { base: "border-ink/25 bg-transparent", text: "text-ink", fill: "bg-ink", on: "text-paper" },
  },
  dark: {
    primary: { base: "border-paper bg-paper", text: "text-ink", fill: "bg-terracotta", on: "text-paper" },
    secondary: { base: "border-white/25 bg-char/40", text: "text-paper", fill: "bg-paper", on: "text-ink" },
  },
};

const SIZE = {
  md: "h-12 px-6 text-[14px] rounded-full",
  sm: "h-9 px-4 text-[12.5px] rounded-full",
  xs: "h-8 px-3 text-[12px] rounded-full",
};

/** Diameter that covers every corner of a w×h box from point (x, y). */
const cover = (w: number, h: number, x: number, y: number) => Math.ceil(2 * Math.max(Math.hypot(x, y), Math.hypot(w - x, y), Math.hypot(x, h - y), Math.hypot(w - x, h - y)));

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  variant?: Variant;
  tone?: Tone;
  size?: keyof typeof SIZE;
  /** keep the fill on (selected tab / pressed toggle) */
  active?: boolean;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  role?: string;
  "aria-label"?: string;
  "aria-selected"?: boolean;
  "aria-pressed"?: boolean;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
};

export const OriginButton = forwardRef<HTMLElement, Props>(function OriginButton(
  { children, href, onClick, variant = "primary", tone = "light", size = "md", active = false, className = "", disabled, type = "button", ...aria },
  ref,
) {
  const el = useRef<HTMLElement | null>(null);
  const reduce = useReduced();
  const [hover, setHover] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [d, setD] = useState(0);
  const filled = !disabled && (hover || active);
  const growing = !disabled && hover && !active;
  const skin = SKIN[tone][variant];

  const place = useCallback((x: number, y: number) => {
    const n = el.current;
    if (!n) return;
    const r = n.getBoundingClientRect();
    setOrigin({ x, y });
    setD(cover(r.width, r.height, x, y));
  }, []);
  const fromPointer = (e: PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    place(e.clientX - r.left, e.clientY - r.top);
  };
  const fromCentre = useCallback(() => {
    const n = el.current;
    if (!n) return;
    const r = n.getBoundingClientRect();
    place(r.width / 2, r.height / 2);
  }, [place]);

  const setRef = (n: HTMLElement | null) => {
    el.current = n;
    if (typeof ref === "function") ref(n);
    else if (ref) ref.current = n;
  };

  const handlers = {
    onPointerEnter: (e: PointerEvent<HTMLElement>) => {
      if (disabled || e.pointerType === "touch") return;
      fromPointer(e);
      setHover(true);
    },
    onPointerDown: (e: PointerEvent<HTMLElement>) => {
      if (disabled || e.button !== 0) return;
      fromPointer(e);
      setHover(true);
    },
    onPointerLeave: () => setHover(false),
    onPointerCancel: () => setHover(false),
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      if (!disabled && e.currentTarget.matches(":focus-visible")) {
        fromCentre();
        setHover(true);
      }
    },
    onBlur: () => setHover(false),
    onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        fromCentre();
        setHover(true);
      }
    },
    onClick,
  };

  const cls = `relative isolate inline-flex shrink-0 select-none items-center justify-center overflow-hidden border font-semibold tracking-[-0.01em] touch-manipulation transition-[color,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:pointer-events-none disabled:opacity-50 ${SIZE[size]} ${skin.base} ${filled ? `${skin.on} !border-transparent` : skin.text} ${className}`;

  const inner = (
    <>
      {/* selected state: a settled fill, nothing to animate */}
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-0 -z-10 rounded-[inherit] transition-opacity duration-300 ${skin.fill} ${active && !disabled ? "opacity-100" : "opacity-0"}`}
      />
      {/* hover / focus / press: the fill grows out of the entry point */}
      <motion.span
        aria-hidden
        className={`pointer-events-none absolute -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full ${skin.fill}`}
        initial={false}
        animate={{ scale: growing && d > 0 ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: d, height: d, left: origin.x, top: origin.y }}
      />
      <span className="relative inline-flex items-center justify-center gap-2 whitespace-nowrap">{children}</span>
    </>
  );

  const tap = disabled || reduce ? undefined : { scale: 0.975 };

  if (href) {
    const MotionLink = href.startsWith("/") && !href.startsWith("/#") ? MLink : motion.a;
    return (
      <MotionLink ref={setRef as never} href={href} className={cls} whileTap={tap} {...handlers} {...aria}>
        {inner}
      </MotionLink>
    );
  }
  return (
    <motion.button ref={setRef as never} type={type} disabled={disabled} className={cls} whileTap={tap} {...handlers} {...aria}>
      {inner}
    </motion.button>
  );
});

const MLink = motion.create(Link);
