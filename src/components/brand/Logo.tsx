/**
 * COMET 2.0 identity. The mark is the shoe's four-point star set inside an
 * orbit — the comet's path — with a gap where the star breaks the line. The
 * wordmark is a wide grotesk; "2.0" sits as a superscript in mono.
 * Everything is vector/type: never baked into footage.
 */
export function CometMark({ className = "h-6 w-6", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="-24 -24 48 48" className={className} role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      {/* orbit, broken at upper-right where the star crosses it */}
      <path d="M 14.6 -12.4 A 21 11 -24 1 1 9.8 -15.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M0 -15 L3.1 -3.1 L15 0 L3.1 3.1 L0 15 L-3.1 3.1 L-15 0 L-3.1 -3.1 Z" fill="currentColor" />
      <circle cx="12.4" cy="-14.2" r="1.7" fill="currentColor" />
    </svg>
  );
}

export function CometLogo({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const s = {
    sm: { mark: "h-5 w-5", word: "text-[13px] tracking-[0.34em]", ver: "text-[9px]" },
    md: { mark: "h-6 w-6", word: "text-[15px] tracking-[0.36em]", ver: "text-[10px]" },
    lg: { mark: "h-10 w-10", word: "text-2xl tracking-[0.38em]", ver: "text-xs" },
    xl: { mark: "h-11 w-11 sm:h-20 sm:w-20", word: "text-[1.9rem] sm:text-6xl tracking-[0.26em] sm:tracking-[0.3em]", ver: "text-sm sm:text-base" },
  }[size];
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-label="COMET 2.0">
      <CometMark className={s.mark} />
      <span aria-hidden className="inline-flex items-start">
        <span className={`wide font-semibold leading-none ${s.word}`}>COMET</span>
        <span className={`-ml-1 font-mono font-medium leading-none ${s.ver}`}>2.0</span>
      </span>
    </span>
  );
}
