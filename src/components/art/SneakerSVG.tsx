import type { Colorway } from "@/lib/colorways";
import type { Detail } from "@/lib/details";

/**
 * Flat lateral profile of the Comet silhouette (toe right). Used as the
 * commuter's shoe in the opening scene and as the "where is it" locator in
 * design-breakdown views, so both match the 3D model's proportions.
 */
export const SNEAKER_UPPER =
  "M16 94 C10 78 10 52 18 32 C22 26 30 25 40 28 C52 32 62 40 76 42 C88 43 98 36 108 33 L124 30 C150 44 176 52 206 58 C236 63 262 68 280 78 C288 83 291 89 290 94 Z";
export const SNEAKER_HEEL = "M16 94 C10 78 10 52 18 32 C22 26 30 25 40 28 C46 30 50 33 54 36 C52 52 50 70 40 94 Z";
export const SNEAKER_STAR = "M128 46 L134 64 L156 68 L134 72 L128 90 L122 72 L100 68 L122 64 Z";

const ZONES: Record<Detail["zone"], { x: number; y: number; r: number; label: string }> = {
  "lateral-rear": { x: 70, y: 72, r: 22, label: "Lateral · rear quarter" },
  "lateral-mid": { x: 120, y: 60, r: 18, label: "Lateral · mid quarter" },
  "lateral-front": { x: 222, y: 76, r: 20, label: "Lateral · forefoot" },
  "medial-rear": { x: 66, y: 70, r: 22, label: "Medial · rear quarter (inside)" },
  "medial-mid": { x: 132, y: 66, r: 20, label: "Medial · mid quarter (inside)" },
  "medial-front": { x: 236, y: 80, r: 18, label: "Medial · forefoot (inside)" },
  heel: { x: 26, y: 58, r: 18, label: "Heel counter" },
  tongue: { x: 114, y: 30, r: 14, label: "Tongue" },
  laces: { x: 150, y: 44, r: 20, label: "Lace throat" },
  toe: { x: 262, y: 76, r: 18, label: "Toe box" },
  outsole: { x: 150, y: 108, r: 26, label: "Outsole" },
  star: { x: 128, y: 68, r: 24, label: "Quarter panel" },
};

export function zoneLabel(z: Detail["zone"]) {
  return ZONES[z].label;
}

export function SneakerSVG({
  colors,
  zone,
  className,
  detailed = true,
}: {
  colors: Colorway["colors"];
  zone?: Detail["zone"];
  className?: string;
  detailed?: boolean;
}) {
  const z = zone ? ZONES[zone] : null;
  const medial = zone?.startsWith("medial");
  return (
    <svg viewBox="0 0 300 120" className={className} role="img" aria-label={z ? `Shoe diagram highlighting the ${z.label}` : "Comet sneaker profile"}>
      <g transform={medial ? "translate(300 0) scale(-1 1)" : undefined}>
        {/* cupsole */}
        <path d="M8 92 H292 C296 92 297 96 296 100 L294 106 C293 110 290 112 286 112 H14 C10 112 7 110 6 106 L5 100 C4 96 5 92 8 92 Z" fill={colors.midsole} stroke="#00000022" />
        <path d="M6 104 H295 L294 107 C293 110 290 112 286 112 H14 C10 112 7 110 6 107 Z" fill={colors.outsole} />
        <path d={SNEAKER_UPPER} fill={colors.canvas} stroke="#00000030" />
        {detailed && (
          <>
            <path d="M24 88 L96 88 L96 70 L30 70 Z" fill="#b3402d" opacity=".55" />
            <path d="M24 74 L96 74" stroke="#e0b33b" strokeWidth="3" opacity=".7" />
            <path d="M206 58 C236 63 262 68 280 78" fill="none" stroke="#00000025" strokeDasharray="3 3" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1={112 + i * 14} y1={35 + i * 3.4} x2={120 + i * 14} y2={31 + i * 3.4} stroke={colors.laces} strokeWidth="3.4" strokeLinecap="round" />
            ))}
            {[0, 1, 2, 3].map((i) => (
              <circle key={i} cx={250 + (i % 2) * 8} cy={72 + Math.floor(i / 2) * 6} r="1.2" fill="#0005" />
            ))}
          </>
        )}
        <path d={SNEAKER_HEEL} fill={colors.heel} />
        <path d={SNEAKER_STAR} fill={colors.star} />
        <path d="M16 94 C10 78 10 52 18 32 C22 26 30 25 40 28 C52 32 62 40 76 42 C88 43 98 36 108 33" fill="none" stroke={colors.collar} strokeWidth="4" strokeLinecap="round" />
        {z && (
          <g>
            <circle cx={z.x} cy={z.y} r={z.r} fill="#b3402d" opacity=".18" />
            <circle cx={z.x} cy={z.y} r={z.r} fill="none" stroke="#b3402d" strokeWidth="1.6" strokeDasharray="4 3" />
            <circle cx={z.x} cy={z.y} r="3" fill="#b3402d" />
          </g>
        )}
      </g>
    </svg>
  );
}
