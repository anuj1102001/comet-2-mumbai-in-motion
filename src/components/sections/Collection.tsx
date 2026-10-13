"use client";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { colorwayById } from "@/lib/colorways";
import { useStore } from "@/lib/store";
import { CometLogo } from "../brand/Logo";
import { ColorwayPicker, MediaTag, Reveal } from "../ui";

/**
 * Chapter 7: the campaign frame. Shoe and box composed together with the
 * COMET 2.0 lockup set in HTML, then the three editions.
 */
export function Collection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const cw = colorwayById(useStore((s) => s.colorway));
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const boxY = useTransform(p, [0, 1], reduce ? [0, 0] : [60, -60]);
  const shoeY = useTransform(p, [0, 1], reduce ? [0, 0] : [120, -120]);

  return (
    <section ref={ref} id="collection" aria-labelledby="h-collection" className="relative overflow-hidden bg-char pb-24 text-paper">
      <div className="mx-auto max-w-[1400px] px-4 pt-24 sm:px-8 lg:px-12">
        <div className="relative overflow-hidden rounded-[28px] bg-paper text-ink">
          <div className="grid min-h-[78svh] items-center lg:grid-cols-[0.9fr_1.1fr]">
            <div className="relative z-10 p-6 sm:p-12">
              <p className="eyebrow text-ink-3">07 · The collection</p>
              <h2 id="h-collection" className="mt-8">
                <CometLogo size="xl" className="text-ink" />
              </h2>
              <p className="wide mt-6 text-sm font-semibold tracking-[0.42em] text-ink">MUMBAI IN MOTION</p>
              <p className="h-display mt-8 text-[clamp(2.2rem,4.6vw,4.2rem)] uppercase text-indigo">A city that never stops.</p>
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-2">{cw.story}</p>
            </div>
            <div className="relative h-[52svh] min-h-[360px] lg:h-full">
              <motion.figure style={{ y: boxY }} className="absolute right-[4%] top-[8%] w-[70%] overflow-hidden rounded-2xl shadow-[0_40px_70px_-40px_rgba(0,0,0,.55)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/img/box-closed.webp" alt="The collectible poster box — concept render" loading="lazy" className="w-full" />
              </motion.figure>
              <motion.figure style={{ y: shoeY }} className="absolute bottom-[6%] left-0 w-[86%]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cw.hero} alt={`${cw.name} edition — concept render`} loading="lazy" className="feather w-full mix-blend-multiply" />
              </motion.figure>
              <div className="absolute bottom-4 right-4">
                <MediaTag>Concept renders</MediaTag>
              </div>
            </div>
          </div>
        </div>

        <Reveal className="mt-14">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <p className="h-display text-3xl">Three editions. One silhouette.</p>
            <a href="#specs" className="btn bg-paper text-ink hover:bg-saffron">
              Product details <span aria-hidden>↓</span>
            </a>
          </div>
          <ColorwayPicker size="lg" tone="dark" />
        </Reveal>
      </div>
    </section>
  );
}
