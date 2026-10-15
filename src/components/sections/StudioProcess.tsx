"use client";
import { COLORWAYS } from "@/lib/colorways";
import { Reveal } from "../ui";
import { Backdrop, Canopy, Commuter, Crowd, Platform, Train } from "../art/CityScene";

const LOCAL = COLORWAYS[0];

const DIRECTIONS = [
  { img: "/img/board-1.webp", name: "Platform Local", verdict: "Chosen as the hero", why: "The most wearable: one scene per quarter, a clean vamp, everyday colours. It carries the commute, the core of the idea." },
  { img: "/img/board-2.webp", name: "Postcard", verdict: "Collector's edition", why: "The strongest packaging story, so it became the box system. Busier artwork suits a smaller, collectable run." },
  { img: "/img/board-3.webp", name: "Harbour", verdict: "Statement edition", why: "The only all-over print. Too loud for the hero, right for a limited third drop." },
];

const PIPELINE = [
  ["/img/process/frame-1.webp", "01 · Board", "The approved render, as drawn."],
  ["/img/process/frame-2.webp", "02 · Cut-out", "Separated from the board in Photoshop; the product pixels are never redrawn."],
  ["/img/process/frame-4.webp", "03 · Staged & graded", "A paper sweep, a traced contact shadow, a warm grade and one shared grain."],
];

const UNBOXING = [
  { img: "/img/box-closed.webp", step: "The lid", note: "A poster: the shoe breaks the frame, CST etched behind, a red sun. It reads from across a room." },
  { img: "/img/box-open.webp", step: "The wrap", note: "Indigo toile tissue redrawn with Mumbai scenes, closed with a star seal: a pause before the product." },
  { img: "/img/box-inserts.webp", step: "The keepsakes", note: "A postcard to send home, a ticket-style hang tag and a navy dust bag: ephemera that outlive the box." },
];

function Sub({ title }: { title: string }) {
  return <h4 className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-paper/55">{title}</h4>;
}

/** Real forks in the project: the board directions, the opening, the frame pipeline and the lettering. */
export function Iterations() {
  return (
    <div className="grid gap-14">
      <div>
        <Sub title="Three directions, one silhouette" />
        <ul className="grid gap-4 md:grid-cols-3">
          {DIRECTIONS.map((d, i) => (
            <li key={d.name}>
              <Reveal delay={i * 0.06}>
                <div className="overflow-hidden rounded-2xl bg-paper">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={d.img} alt={`${d.name} concept board`} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover object-top" />
                </div>
                <p className="mt-3 flex flex-wrap items-baseline justify-between gap-2">
                  <b>{d.name}</b>
                  <span className={`font-mono text-[10px] uppercase tracking-wider ${i === 0 ? "text-saffron" : "text-paper/50"}`}>{d.verdict}</span>
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-paper/65">{d.why}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <Sub title="The opening, three times" />
        <ol className="grid gap-4 md:grid-cols-3">
          <li>
            <Reveal>
              <div className="grid aspect-[16/10] place-items-center rounded-2xl border border-dashed border-white/25 p-6 text-center">
                <p className="font-mono text-[11px] uppercase tracking-wider text-paper/50">v1 · real-time 3D shoe</p>
              </div>
              <p className="mt-3 font-semibold">Dropped</p>
              <p className="mt-1 text-[13px] leading-relaxed text-paper/65">A parametric 3D shoe built in code read as a blocky toe, a slab sole and smeared artwork: worse than the boards. Without a properly modelled shoe, 3D was the wrong medium.</p>
            </Reveal>
          </li>
          <li>
            <Reveal delay={0.06}>
              <div className="overflow-hidden rounded-2xl bg-[#1b2440]">
                <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="block aspect-[16/10] w-full" role="img" aria-label="The illustrated storyboard opening: a local train at a crowded platform, drawn in navy etching">
                  <Backdrop />
                  <Canopy />
                  <g transform="translate(-300 0)">
                    <Train />
                  </g>
                  <Platform />
                  <Crowd seed={3} count={16} y={800} scale={1.05} spread={2100} />
                  <Commuter colors={LOCAL.colors} />
                  <Crowd seed={8} count={7} y={1010} scale={2.1} spread={2400} x0={-160} density={2} gap={[560, 1000]} />
                </svg>
              </div>
              <p className="mt-3 font-semibold">v2 · Storyboard</p>
              <p className="mt-1 text-[13px] leading-relaxed text-paper/65">An illustrated platform in the shoe&apos;s own etching language, animated in CSS. It proved the camera push into the shoe, but read as a drawing, not a launch.</p>
            </Reveal>
          </li>
          <li>
            <Reveal delay={0.12}>
              <div className="overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/look/platform-wide-1400.webp" alt="The final opening: a commuter in a local train doorway at CSMT" loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" />
              </div>
              <p className="mt-3 font-semibold text-saffron">Final · the campaign frame</p>
              <p className="mt-1 text-[13px] leading-relaxed text-paper/65">The same move on a lifelike platform. The frame was extended to landscape for wide screens, and the push lands on the commuter&apos;s shoe.</p>
            </Reveal>
          </li>
        </ol>
      </div>

      <div>
        <Sub title="Making a studio frame" />
        <ol className="grid grid-cols-3 gap-3 sm:gap-4">
          {PIPELINE.map(([src, t, n], i) => (
            <li key={t}>
              <Reveal delay={i * 0.06}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" decoding="async" className="aspect-[3/2] w-full rounded-2xl object-cover" />
                <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-paper/80 sm:text-[11px]">{t}</p>
                <p className="mt-1 hidden text-[13px] leading-relaxed text-paper/65 sm:block">{n}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <Sub title="Proofreading the city" />
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal className="grid grid-cols-[6rem_1fr] items-center gap-5 rounded-2xl border border-white/15 p-5 sm:grid-cols-[7rem_1fr]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/local-d-sign.webp" alt="The station sign tile on the Platform Local board" loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
            <div>
              <p className="deva text-2xl">
                <s className="text-paper/40 decoration-terracotta decoration-2">मुबई</s> <span aria-hidden>→</span> <span className="text-saffron">मुंबई</span>
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-paper/65">The board&apos;s sign tile drops the anusvara, the dot that makes it Mumbai. Logged for the production artwork and flagged on the site rather than hidden.</p>
            </div>
          </Reveal>
          <Reveal delay={0.06} className="grid grid-cols-[6rem_1fr] items-center gap-5 rounded-2xl border border-white/15 p-5 sm:grid-cols-[7rem_1fr]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/harbour-stamp.webp" alt="The Harbour edition's stamp artwork" loading="lazy" className="aspect-square w-full rounded-xl object-cover" />
            <div>
              <p className="deva text-2xl">
                <s className="text-paper/40 decoration-terracotta decoration-2">बंदर</s> <span aria-hidden>→</span> <span className="text-saffron">हार्बर</span>
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-paper/65">The Harbour edition&apos;s Hindi name first read बंदर, which most readers take as &ldquo;monkey&rdquo;. Renamed हार्बर, the word Mumbaikars use for the Harbour line.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

type Net = { w: number; d: number; h: number };

/** One flat box net drawn 1:1 in millimetres: panel, four walls, glue tabs, fold lines. */
function BoxNet({ x, y, b, label }: { x: number; y: number; b: Net; label: string }) {
  const { w, d, h } = b;
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M${h} 0 H${h + w} V${h} H${h * 2 + w} V${h + d} H${h + w} V${h * 2 + d} H${h} V${h + d} H0 V${h} H${h} Z`} className="fill-white/[0.04] stroke-paper" strokeWidth="1.4" />
      {/* corner glue tabs on the long walls */}
      {[
        [h, 0, -1, -1],
        [h + w, 0, 1, -1],
        [h, h * 2 + d, -1, 1],
        [h + w, h * 2 + d, 1, 1],
      ].map(([cx, cy, sx, sy], i) => (
        <path key={i} d={`M${cx} ${cy} l${sx * (h - 4)} ${-sy * 6} l0 ${-sy * (h - 12)} l${-sx * (h - 4)} ${-sy * 6}`} className="fill-none stroke-paper/45" strokeWidth="1" />
      ))}
      <rect x={h} y={h} width={w} height={d} className="fill-none stroke-saffron" strokeWidth="1" strokeDasharray="6 5" />
      <text x={h + w / 2} y={h + d / 2 - 6} textAnchor="middle" className="fill-paper font-mono" fontSize="13">
        {label}
      </text>
      <text x={h + w / 2} y={h + d / 2 + 14} textAnchor="middle" className="fill-paper/55 font-mono" fontSize="11">
        {`${w} × ${d} × ${h} mm`}
      </text>
    </g>
  );
}

/** Flat dieline of the proposed two-piece box (lid and base), then the three unboxing beats. */
export function PackagingStructure() {
  const lid = { w: 340, d: 220, h: 40 };
  const base = { w: 334, d: 214, h: 120 };
  return (
    <div className="grid gap-10">
      <Reveal>
        <figure className="rounded-2xl border border-white/15 p-4 sm:p-6">
          <svg viewBox="-10 -10 1100 480" className="w-full" role="img" aria-label="Flat dieline of the proposed two-piece shoe box: a lid 340 by 220 by 40 millimetres and a base 334 by 214 by 120 millimetres">
            <BoxNet x={0} y={80} b={lid} label="LID · POSTER ARTWORK" />
            <BoxNet x={470} y={0} b={base} label="BASE · KRAFT, NAVY INSIDE" />
          </svg>
          <figcaption className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[10px] uppercase tracking-wider text-paper/55">
            <span>
              <i className="mr-2 inline-block h-px w-5 bg-paper align-middle" />
              Cut
            </span>
            <span>
              <i className="mr-2 inline-block w-5 border-t border-dashed border-saffron align-middle" />
              Fold
            </span>
            <span>Proposed structure · not a production dieline</span>
          </figcaption>
        </figure>
      </Reveal>
      <ol className="grid gap-4 sm:grid-cols-3">
        {UNBOXING.map((u, i) => (
          <li key={u.step}>
            <Reveal delay={i * 0.06}>
              <div className="relative overflow-hidden rounded-2xl bg-paper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={u.img} alt={`${u.step}: ${u.note}`} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-char/80 px-2.5 py-1 font-mono text-[10px] text-paper">Beat {i + 1}</span>
              </div>
              <p className="mt-3 font-semibold">{u.step}</p>
              <p className="mt-1 text-[13px] leading-relaxed text-paper/65">{u.note}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </div>
  );
}
