/**
 * COMET 2.0 identity. The mark is the station roundel: the shoe's four-point star
 * knocked out of a solid disc, the same seal that closes the box insert. It has no
 * tail on purpose, so it can't be mistaken for any shooting-star logo.
 * The wordmark is a wide grotesk with "2.0" as a mono superscript.
 * Everything is vector/type: never baked into footage.
 */
export const COMET_PATH =
  "M2 50 A48 48 0 1 0 98 50 A48 48 0 1 0 2 50 Z M50 13 Q53.6 46.4 75 50 Q53.6 53.6 50 87 Q46.4 53.6 25 50 Q46.4 46.4 50 13 Z";
export const COMET_VIEWBOX = "0 0 100 100";

export function CometMark({ className = "h-5 w-auto", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox={COMET_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <path d={COMET_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

export function CometLogo({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" | "xl" }) {
  const s = {
    sm: { mark: "h-[14px]", word: "text-[13px] tracking-[0.34em]", ver: "text-[9px]", gap: "gap-2.5" },
    md: { mark: "h-4", word: "text-[15px] tracking-[0.36em]", ver: "text-[10px]", gap: "gap-3" },
    lg: { mark: "h-7", word: "text-2xl tracking-[0.36em]", ver: "text-xs", gap: "gap-4" },
    xl: { mark: "h-8 sm:h-14", word: "text-[1.9rem] sm:text-6xl tracking-[0.26em] sm:tracking-[0.3em]", ver: "text-sm sm:text-base", gap: "gap-3 sm:gap-5" },
  }[size];
  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`} aria-label="COMET 2.0">
      <CometMark className={`${s.mark} w-auto shrink-0`} />
      <span aria-hidden className="inline-flex items-start">
        <span className={`wide font-semibold leading-none ${s.word}`}>COMET</span>
        <span className={`-ml-1 font-mono font-medium leading-none ${s.ver}`}>2.0</span>
      </span>
    </span>
  );
}
