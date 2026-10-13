import { CST_DETAIL, CST_PATH } from "./cst";
import { SNEAKER_HEEL, SNEAKER_STAR, SNEAKER_UPPER } from "./SneakerSVG";

/**
 * Hand-built SVG layers of a CSMT suburban platform at 06:42, drawn in the
 * same indigo-etching-on-paper language as the concept boards. Each export is
 * one depth layer so the opening sequence can move them independently.
 * Scene units: 1600 × 900.
 */

const INK = "#24365f";
const CHAR = "#1f1d1b";

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SKIN = ["#8a5a3c", "#6e4630", "#a06a48", "#7b4f35", "#5d3b28"];
const SHIRTS = ["#24365f", "#e9dcc2", "#b3402d", "#3b5f8f", "#d18a2a", "#4b4640", "#efe7d6", "#2f4a3a", "#7a2f3a"];
const PANTS = ["#1f1d1b", "#2a3550", "#4b4640", "#5a4a3a", "#24365f"];

type PersonSpec = {
  x: number;
  y: number;
  s: number;
  facing: 1 | -1;
  saree: boolean;
  skin: string;
  shirt: string;
  pants: string;
  h: number;
  bag: boolean;
  bagColor: string;
};

/** One commuter: built from simple shapes so a crowd stays light. */
function Person({ x, y, s, facing, saree, skin, shirt, pants, h, bag, bagColor }: PersonSpec) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s * facing} ${s * h})`}>
      {saree ? (
        <>
          <path d="M-20 -100 C-24 -60 -30 -20 -34 0 L34 0 C30 -20 24 -60 20 -100 Z" fill={shirt} />
          <path d="M-18 -98 L20 -40 L26 -40 L-10 -100 Z" fill="#00000022" />
          <path d="M-30 -8 L32 -8" stroke="#e0b33b" strokeWidth="4" />
        </>
      ) : (
        <>
          <rect x="-15" y="-58" width="12" height="58" rx="5" fill={pants} />
          <rect x="3" y="-58" width="12" height="58" rx="5" fill={pants} />
          <path d="M-20 -110 C-24 -90 -22 -70 -19 -54 L19 -54 C22 -70 24 -90 20 -110 Z" fill={shirt} />
        </>
      )}
      <path d="M-20 -108 C-30 -92 -30 -76 -26 -62" stroke={shirt} strokeWidth="9" strokeLinecap="round" fill="none" />
      <path d="M20 -108 C28 -94 30 -80 27 -66" stroke={shirt} strokeWidth="9" strokeLinecap="round" fill="none" />
      <rect x="-5" y="-122" width="10" height="12" fill={skin} />
      <circle cx="0" cy="-134" r="14" fill={skin} />
      <path d="M-14 -136 C-14 -152 14 -152 14 -136 C10 -144 -8 -146 -14 -136 Z" fill={saree ? "#1f1d1b" : "#2a2420"} />
      {saree && <path d="M-14 -138 C-18 -120 -20 -110 -22 -100 L-16 -100 C-12 -114 -10 -126 -8 -140 Z" fill="#1f1d1b" />}
      {bag && <rect x={facing > 0 ? 16 : -36} y="-104" width="22" height="34" rx="5" fill={bagColor} />}
    </g>
  );
}

export function Crowd({ seed, count, y, scale, spread = 1700, x0 = -60, density = 1, gap }: { seed: number; count: number; y: number; scale: number; spread?: number; x0?: number; density?: number; gap?: [number, number] }) {
  // every random choice is made up front from the seed, so server and client render the same crowd
  const r = rng(seed);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const people: PersonSpec[] = Array.from({ length: count }, (_, i) => ({
    x: x0 + (i / count) * spread + (r() - 0.5) * 60 * density,
    y: y + (r() - 0.5) * 16,
    s: scale * (0.9 + r() * 0.2),
    facing: r() > 0.5 ? 1 : -1,
    saree: r() > 0.72,
    skin: pick(SKIN),
    shirt: pick(SHIRTS),
    pants: pick(PANTS),
    h: 0.9 + r() * 0.22,
    bag: r() > 0.55,
    bagColor: r() > 0.5 ? "#b3402d" : "#24365f",
  }));
  return (
    <g>
      {people.map((p, i) => (gap && p.x > gap[0] && p.x < gap[1] ? null : <Person key={i} {...p} />))}
    </g>
  );
}

export function Backdrop() {
  return (
    <g>
      <rect width="1600" height="900" fill="#eee5d3" />
      <circle cx="1190" cy="300" r="150" fill="#b3402d" opacity=".85" />
      <g transform="translate(260 175) scale(1.08)" opacity=".28">
        <path d={CST_PATH} fill={INK} />
        <path d={CST_DETAIL} fill="none" stroke="#eee5d3" strokeWidth="2" />
      </g>
      {/* birds over the terminus */}
      {[
        [860, 150],
        [890, 135],
        [930, 160],
        [1340, 120],
        [1370, 108],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} q8 -8 16 0 q8 -8 16 0`} fill="none" stroke={INK} strokeWidth="2" opacity=".6" />
      ))}
    </g>
  );
}

/** Cast-iron platform shed: beam, columns, brackets, clock and signs. */
export function Canopy() {
  const cols = [120, 420, 1180, 1480];
  return (
    <g>
      <path d="M0 0 H1600 V96 C1400 120 1200 112 800 112 C400 112 200 120 0 96 Z" fill={CHAR} />
      <path d="M0 96 C200 120 400 112 800 112 C1200 112 1400 120 1600 96" fill="none" stroke={INK} strokeWidth="5" />
      {Array.from({ length: 33 }, (_, i) => (
        <line key={i} x1={i * 50} y1="0" x2={i * 50} y2="104" stroke="#3a3632" strokeWidth="2" />
      ))}
      {cols.map((x) => (
        <g key={x}>
          <rect x={x - 9} y="104" width="18" height="560" fill={CHAR} />
          <rect x={x - 15} y="640" width="30" height="24" fill={CHAR} />
          <path d={`M${x - 120} 110 Q${x - 20} 120 ${x - 9} 220 M${x + 120} 110 Q${x + 20} 120 ${x + 9} 220`} fill="none" stroke={CHAR} strokeWidth="7" />
          <circle cx={x - 50} cy="134" r="12" fill="none" stroke={CHAR} strokeWidth="4" />
          <circle cx={x + 50} cy="134" r="12" fill="none" stroke={CHAR} strokeWidth="4" />
        </g>
      ))}
      {/* platform clock — 06:42 */}
      <g transform="translate(420 168)">
        <line x1="0" y1="-60" x2="0" y2="-20" stroke={CHAR} strokeWidth="4" />
        <circle r="30" fill="#efe7d6" stroke={CHAR} strokeWidth="5" />
        <line x1="0" y1="0" x2="10" y2="18" stroke={CHAR} strokeWidth="4" strokeLinecap="round" />
        <line x1="0" y1="0" x2="-16" y2="-14" stroke={CHAR} strokeWidth="3" strokeLinecap="round" />
      </g>
      {/* enamel platform sign */}
      <g transform="translate(640 150)">
        <line x1="40" y1="-40" x2="40" y2="0" stroke={CHAR} strokeWidth="3" />
        <line x1="260" y1="-40" x2="260" y2="0" stroke={CHAR} strokeWidth="3" />
        <rect width="300" height="74" rx="4" fill="#e0b33b" stroke={CHAR} strokeWidth="4" />
        <text x="150" y="34" textAnchor="middle" fontFamily="var(--font-yatra)" fontSize="28" fill={CHAR}>
          प्लेटफ़ॉर्म ४
        </text>
        <text x="150" y="62" textAnchor="middle" fontFamily="var(--font-sans)" fontWeight="700" fontSize="20" letterSpacing="3" fill={CHAR}>
          PLATFORM 4
        </text>
      </g>
      {/* train indicator */}
      <g transform="translate(1010 140)">
        <line x1="40" y1="-30" x2="40" y2="0" stroke={CHAR} strokeWidth="3" />
        <line x1="320" y1="-30" x2="320" y2="0" stroke={CHAR} strokeWidth="3" />
        <rect width="360" height="84" rx="4" fill="#1b1a18" stroke="#3a3632" strokeWidth="4" />
        <text x="18" y="34" fontFamily="var(--font-mono)" fontSize="19" fill="#e9a23b">06:48 ठाणे THANE</text>
        <text x="300" y="34" fontFamily="var(--font-mono)" fontSize="19" fill="#e9a23b">S 12</text>
        <text x="18" y="66" fontFamily="var(--font-mono)" fontSize="19" fill="#c98a33" opacity=".8">06:51 कल्याण KALYAN</text>
        <text x="300" y="66" fontFamily="var(--font-mono)" fontSize="19" fill="#c98a33" opacity=".8">F 15</text>
      </g>
    </g>
  );
}

function Car({ x, front }: { x: number; front?: boolean }) {
  const r = rng(Math.round(x) + 99);
  const windows = Array.from({ length: 8 }, (_, i) => i);
  return (
    <g transform={`translate(${x} 0)`}>
      {/* roof + pantograph */}
      <path d="M0 340 Q0 318 24 316 H556 Q580 318 580 340 Z" fill="#8f8a80" />
      {r() > 0.4 && <path d="M240 316 L270 286 L320 286 L350 316 M262 286 H330" fill="none" stroke={CHAR} strokeWidth="3" />}
      <rect x="0" y="338" width="580" height="250" rx="10" fill="#ebe1cd" stroke={CHAR} strokeWidth="2" />
      {/* livery: red skirt with a yellow band */}
      <rect x="0" y="500" width="580" height="88" rx="8" fill="#b3402d" />
      <rect x="0" y="492" width="580" height="10" fill="#e0b33b" />
      {windows.map((i) => {
        const wx = 26 + i * 66 + (i >= 4 ? 70 : 0);
        if (wx > 540) return null;
        const heads = Math.floor(r() * 3);
        return (
          <g key={i}>
            <rect x={wx} y="378" width="44" height="58" rx="4" fill="#2a2a35" />
            <path d={`M${wx} 392 H${wx + 44}`} stroke="#ebe1cd" strokeWidth="2" opacity=".5" />
            {Array.from({ length: heads }, (_, k) => (
              <circle key={k} cx={wx + 12 + k * 18} cy={418} r="8" fill={SKIN[(i + k) % SKIN.length]} />
            ))}
          </g>
        );
      })}
      {/* open doors with commuters at the footboard */}
      {[214, 360].map((dx) => (
        <g key={dx}>
          <rect x={dx} y="364" width="64" height="210" fill="#15151b" />
          <circle cx={dx + 22} cy="398" r="12" fill={SKIN[Math.floor(r() * 5)]} />
          <path d={`M${dx + 10} 412 h26 v80 h-26 z`} fill={SHIRTS[Math.floor(r() * SHIRTS.length)]} />
          <circle cx={dx + 46} cy="404" r="11" fill={SKIN[Math.floor(r() * 5)]} />
          <path d={`M${dx + 36} 416 h22 v74 h-22 z`} fill={SHIRTS[Math.floor(r() * SHIRTS.length)]} />
          <line x1={dx + 4} y1="370" x2={dx + 4} y2="570" stroke="#b5b0a6" strokeWidth="3" />
        </g>
      ))}
      <text x="40" y="540" fontFamily="var(--font-mono)" fontSize="15" fill="#efe7d6">
        {front ? "S · CSMT–THANE" : `40${Math.floor(r() * 90 + 10)} A`}
      </text>
      {/* bogies */}
      <rect x="40" y="588" width="130" height="22" rx="6" fill={CHAR} />
      <rect x="410" y="588" width="130" height="22" rx="6" fill={CHAR} />
      {front && (
        <g>
          <path d="M0 338 Q-40 350 -44 420 V588 H0 Z" fill="#ebe1cd" stroke={CHAR} strokeWidth="2" />
          <path d="M-36 380 Q-30 360 0 356 V440 H-38 Z" fill="#2a2a35" />
          <rect x="-44" y="500" width="44" height="88" fill="#b3402d" />
          <circle cx="-26" cy="470" r="7" fill="#f4dd8b" />
          <rect x="-34" y="326" width="56" height="14" rx="2" fill="#1b1a18" />
        </g>
      )}
    </g>
  );
}

export function Train() {
  return (
    <g>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <Car key={i} x={i * 600} front={i === 0} />
      ))}
    </g>
  );
}

export function Platform() {
  return (
    <g>
      <rect x="0" y="606" width="1600" height="16" fill="#3a3632" />
      <path d="M0 622 H1600 V900 H0 Z" fill="#d6c6a8" />
      <rect x="0" y="622" width="1600" height="14" fill="#e0b33b" />
      {Array.from({ length: 40 }, (_, i) => (
        <line key={i} x1={i * 40} y1="622" x2={i * 40} y2="636" stroke="#b78f2c" strokeWidth="2" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={-400 + i * 300} y1="900" x2={200 + i * 150} y2="636" stroke="#c5b394" strokeWidth="2" />
      ))}
      <line x1="0" y1="700" x2="1600" y2="700" stroke="#c5b394" strokeWidth="2" />
      <line x1="0" y1="790" x2="1600" y2="790" stroke="#c5b394" strokeWidth="2" />
    </g>
  );
}

export const SHOE_POINT = { x: 834, y: 836 };

/** The commuter wearing the Comet — the unexpected protagonist. */
export function Commuter({ colors, onlyShoe }: { colors: { canvas: string; heel: string; star: string; midsole: string; outsole: string; laces: string; collar: string }; onlyShoe?: boolean }) {
  const shoe = (x: number, y: number, s: number, flip = false) => (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M8 92 H292 C296 92 297 96 296 100 L294 106 C293 110 290 112 286 112 H14 C10 112 7 110 6 106 L5 100 C4 96 5 92 8 92 Z" fill={colors.midsole} />
      <path d="M6 104 H295 L294 107 C293 110 290 112 286 112 H14 C10 112 7 110 6 107 Z" fill={colors.outsole} />
      <path d={SNEAKER_UPPER} fill={colors.canvas} />
      <path d="M24 88 L96 88 L96 70 L30 70 Z" fill="#b3402d" opacity=".7" />
      <path d={SNEAKER_HEEL} fill={colors.heel} />
      <path d={SNEAKER_STAR} fill={colors.star} />
      <path d="M16 94 C10 78 10 52 18 32 C22 26 30 25 40 28 C52 32 62 40 76 42 C88 43 98 36 108 33" fill="none" stroke={colors.collar} strokeWidth="5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <line key={i} x1={112 + i * 15} y1={35 + i * 4} x2={121 + i * 15} y2={30 + i * 4} stroke={colors.laces} strokeWidth="4" strokeLinecap="round" />
      ))}
    </g>
  );
  if (onlyShoe) return shoe(774, 814, 0.4, false);
  return (
    <g>
      {/* rear leg + shoe */}
      <path d="M700 590 C696 680 706 760 716 842 L752 842 C748 760 746 680 744 600 Z" fill="#24365f" />
      {shoe(700, 806, 0.36, false)}
      {/* front leg, slightly forward, mid-step */}
      <path d="M752 590 C766 680 778 760 788 842 L826 838 C816 760 802 680 796 596 Z" fill="#2a3e6c" />
      {/* jeans seams */}
      <path d="M772 640 C780 700 790 770 806 836" stroke="#e0b33b" strokeWidth="1.5" opacity=".5" fill="none" />
      {shoe(774, 814, 0.4, false)}
      {/* torso */}
      <path d="M690 420 C684 480 690 560 700 606 L800 606 C808 560 812 480 806 420 C780 404 716 404 690 420 Z" fill="#d18a2a" />
      <path d="M748 410 L748 600" stroke="#b97824" strokeWidth="2" />
      {/* backpack strap + pack */}
      <path d="M712 414 C720 470 730 520 736 560" stroke="#1f1d1b" strokeWidth="9" fill="none" />
      <rect x="650" y="430" width="46" height="120" rx="14" fill="#b3402d" />
      {/* arms */}
      <path d="M806 430 C826 480 830 530 822 586" stroke="#d18a2a" strokeWidth="24" strokeLinecap="round" fill="none" />
      <path d="M692 432 C676 484 676 534 684 580" stroke="#d18a2a" strokeWidth="24" strokeLinecap="round" fill="none" />
      <circle cx="822" cy="596" r="12" fill="#7b4f35" />
      {/* phone glow */}
      <rect x="812" y="584" width="16" height="26" rx="3" fill="#1f1d1b" />
      <rect x="738" y="378" width="22" height="30" fill="#7b4f35" />
      <circle cx="749" cy="352" r="34" fill="#7b4f35" />
      <path d="M715 350 C712 310 786 306 784 350 C776 330 730 328 715 350 Z" fill="#1f1d1b" />
      {/* earphones */}
      <path d="M782 356 C790 380 786 400 776 420" stroke="#efe7d6" strokeWidth="2.5" fill="none" />
    </g>
  );
}
