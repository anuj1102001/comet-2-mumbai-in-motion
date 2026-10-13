"use client";
import { easeIn, easeInOut, motion, useMotionTemplate, useMotionValueEvent, useReducedMotion, useScroll, useTime, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { colorwayById } from "@/lib/colorways";
import { journey, useStore } from "@/lib/store";
import { Backdrop, Canopy, Commuter, Crowd, Platform, SHOE_POINT, Train } from "./art/CityScene";

/**
 * Scene 1–3 of the opening: the platform wakes up, focus finds the shoe,
 * the camera pushes in and the world dissolves to paper. The final frame
 * hands over to the 3D canvas underneath (scene 4) at the same size and
 * position — a match cut from illustration to object.
 */
const SX = SHOE_POINT.x;
const SY = SHOE_POINT.y;
const ZOOM = 6.3;

export function Intro() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const cw = colorwayById(useStore((s) => s.colorway));
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(p, "change", (v) => {
    journey.intro = v;
  });

  const time = useTime();
  const creep = useTransform(time, (t) => (reduce ? 0 : -Math.min(t / 1000, 30) * 14));
  const trainScroll = useTransform(p, [0, 0.46], [520, -2300]);
  const trainX = useTransform(() => trainScroll.get() + creep.get());
  const backX = useTransform(p, [0, 0.6], [0, -90]);
  const midX = useTransform(p, [0, 0.6], [0, -180]);
  const frontX = useTransform(p, [0, 0.6], [0, -420]);
  const bob = useTransform(time, (t) => (reduce ? 0 : Math.sin(t / 380) * 1.6));

  const blur = useTransform(p, [0.26, 0.48], [0, 7]);
  const bgFilter = useMotionTemplate`blur(${blur}px) saturate(${useTransform(p, [0.26, 0.48], [1, 0.6])})`;
  const vignette = useTransform(p, [0.26, 0.46], [0, 0.82]);

  const k = useTransform(p, [0.48, 0.82], [1, ZOOM], { ease: easeIn });
  const dx = useTransform(p, [0.48, 0.82], [0, 800 - SX], { ease: easeInOut });
  const dy = useTransform(p, [0.48, 0.82], [0, 450 - SY], { ease: easeInOut });
  // the camera push is written straight to the SVG transform attribute (scale around the shoe, then centre it)
  const pushA = useRef<SVGGElement>(null);
  const pushB = useRef<SVGGElement>(null);
  useEffect(() => {
    const apply = () => {
      const t = `translate(${SX + dx.get()} ${SY + dy.get()}) scale(${k.get()}) translate(${-SX} ${-SY})`;
      pushA.current?.setAttribute("transform", t);
      pushB.current?.setAttribute("transform", t);
    };
    apply();
    return p.on("change", apply);
  }, [p, dx, dy, k]);
  const paper = useTransform(p, [0.66, 0.8], [0, 1]);
  const hero = useTransform(p, [0.62, 0.7], [0, 1]);
  const stage = useTransform(p, [0.9, 0.985], [1, 0]);
  const stageEvents = useTransform(stage, (v) => (v < 0.05 ? "none" : "auto"));

  const t1 = useTransform(p, [0, 0.03, 0.14, 0.2], [1, 1, 1, 0]);
  const t2 = useTransform(p, [0.2, 0.25, 0.36, 0.42], [0, 1, 1, 0]);
  const t3 = useTransform(p, [0.44, 0.5, 0.6, 0.66], [0, 1, 1, 0]);
  const t4 = useTransform(p, [0.7, 0.76, 0.86, 0.92], [0, 1, 1, 0]);
  const cue = useTransform(p, [0, 0.06], [1, 0]);

  const skip = () => document.getElementById("chapter-reveal")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });

  if (reduce) {
    return (
      <section ref={ref} id="story" aria-label="Opening: Mumbai in motion" className="relative h-[100svh] overflow-hidden bg-paper">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
          <Backdrop />
          <Canopy />
          <g transform="translate(-200 0)">
            <Train />
          </g>
          <Platform />
          <Crowd seed={3} count={14} y={800} scale={1.05} />
          <Commuter colors={cw.colors} />
          <Crowd seed={8} count={6} y={1010} scale={2} spread={1900} x0={-140} />
        </svg>
        <IntroTitle onSkip={skip} />
      </section>
    );
  }

  return (
    <section ref={ref} id="story" aria-label="Opening: Mumbai in motion" className="relative h-[420svh]">
      <motion.div style={{ opacity: stage, pointerEvents: stageEvents }} className="sticky top-0 h-[100svh] overflow-hidden bg-paper">
        <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <radialGradient id="spot" cx={SX / 1600} cy={SY / 900} r="0.55">
              <stop offset="0.08" stopColor="#1f1d1b" stopOpacity="0" />
              <stop offset="0.5" stopColor="#1f1d1b" stopOpacity="0.55" />
              <stop offset="1" stopColor="#1f1d1b" stopOpacity="0.9" />
            </radialGradient>
          </defs>
          <g ref={pushA}>
            <motion.g style={{ filter: bgFilter }}>
              <Backdrop />
              <motion.g style={{ x: backX }}>
                <Canopy />
              </motion.g>
              <motion.g style={{ x: trainX }}>
                <Train />
              </motion.g>
              <Platform />
              <motion.g style={{ x: midX, y: bob }}>
                <Crowd seed={3} count={16} y={800} scale={1.05} spread={2100} />
              </motion.g>
            </motion.g>
            <motion.rect width="1600" height="900" fill="url(#spot)" style={{ opacity: vignette }} />
            <Commuter colors={cw.colors} />
            <motion.g style={{ x: frontX, filter: bgFilter }}>
              <Crowd seed={8} count={7} y={1010} scale={2.1} spread={2400} x0={-160} density={2} gap={[560, 1000]} />
            </motion.g>
          </g>
          {/* paper dissolve, with the shoe kept on top of it */}
          <motion.rect width="1600" height="900" fill="#eee5d3" style={{ opacity: paper }} />
          <g ref={pushB}>
            <motion.g style={{ opacity: hero }}>
            <HeroShoe colors={cw.colors} />
            </motion.g>
          </g>
        </svg>

        <div className="pointer-events-none absolute inset-0">
          <motion.div style={{ opacity: t1 }} className="absolute inset-x-0 top-0 bg-gradient-to-b from-paper from-55% via-paper/80 to-transparent px-5 pb-28 pt-24 sm:px-10">
            <p className="eyebrow text-ink-2">Comet · India Collection · Vol. 01 — a design concept</p>
            <h1 className="h-display mt-4 text-[clamp(3.2rem,10vw,9.5rem)] text-ink">
              Mumbai <span className="italic text-indigo">in Motion</span>
            </h1>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-2">A city that never stops. A story that moves with every step.</p>
          </motion.div>
          <Caption o={t2} k="06:42 · Platform 4, CSMT" text="The city wakes up." hindi="शहर जाग रहा है" />
          <Caption o={t3} k="Somewhere in the crowd" text="One detail moves differently." />
          <Caption o={t4} k="Scene 3" text="Every platform has a story." center />
          <motion.div style={{ opacity: cue }} className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-ink">
            <span className="eyebrow text-[10px]">Scroll</span>
            <span className="block h-10 w-px origin-top animate-[cue_1.8s_ease-in-out_infinite] bg-ink" />
          </motion.div>
        </div>
        <button onClick={skip} className="btn btn-line absolute right-4 top-20 z-10 bg-paper/70 text-ink backdrop-blur-sm sm:right-8">
          Skip intro <span aria-hidden>↓</span>
        </button>
      </motion.div>
    </section>
  );
}

function HeroShoe({ colors }: { colors: Parameters<typeof Commuter>[0]["colors"] }) {
  // the commuter's front shoe, redrawn above the paper dissolve
  return <Commuter colors={colors} onlyShoe />;
}

function Caption({ o, k, text, hindi, center }: { o: import("motion/react").MotionValue<number>; k: string; text: string; hindi?: string; center?: boolean }) {
  return (
    <motion.div
      style={{ opacity: o, y: useTransform(o, [0, 1], [14, 0]) }}
      className={center ? "absolute inset-x-0 top-[16%] px-5 text-center" : "absolute bottom-[12%] left-5 max-w-sm sm:left-10"}
    >
      <p className="eyebrow text-ink-2">{k}</p>
      <p className="h-display mt-3 text-[clamp(2rem,4.6vw,3.6rem)] text-ink">{text}</p>
      {hindi && <p className="deva mt-2 text-xl text-red">{hindi}</p>}
    </motion.div>
  );
}

function IntroTitle({ onSkip }: { onSkip: () => void }) {
  return (
    <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-paper via-paper/85 to-transparent px-5 pb-24 pt-24 sm:px-10">
      <p className="eyebrow text-ink-2">Comet · India Collection · Vol. 01 — a design concept</p>
      <h1 className="h-display mt-4 text-[clamp(3.2rem,10vw,9.5rem)] text-ink">
        Mumbai <span className="italic text-indigo">in Motion</span>
      </h1>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-2">A city that never stops. A story that moves with every step.</p>
      <button onClick={onSkip} className="btn btn-ink mt-6">
        Explore the sneaker <span aria-hidden>↓</span>
      </button>
    </div>
  );
}
