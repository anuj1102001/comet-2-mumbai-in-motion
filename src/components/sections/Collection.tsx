"use client";
import { useReduced } from "../motion/useReduced";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { CometLogo } from "../brand/Logo";
import { OriginButton } from "@/components/OriginButton";
import { ColorwayPicker, MediaTag, Reveal } from "../ui";

/**
 * Chapter 7: the campaign frame — the studio photograph of shoe and box with
 * the COMET 2.0 lockup set in HTML beside it — then the three editions.
 */
export function Collection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduced();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.0005 });
  // the photograph settles as it scrolls through: a slow push-in, like a dolly
  const scale = useTransform(p, [0, 1], reduce ? [1, 1] : [1.05, 1]);
  const y = useTransform(p, [0, 1], reduce ? [0, 0] : [-12, 12]);

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
              <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-ink-2">Three editions on one silhouette, each in its poster box. Shown here: Platform Local, the everyday edition.</p>
            </div>
            <div className="relative h-[52svh] min-h-[360px] overflow-hidden lg:h-full">
              <motion.figure style={{ scale, y }} className="absolute inset-0 will-change-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/img/photo/06-campaign-box-and-shoe.webp"
                  alt="COMET 2.0 Platform Local sneaker in front of its poster box, studio photograph"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-[50%_62%]"
                />
              </motion.figure>
              <div className="absolute bottom-4 right-4">
                <MediaTag>Studio composite · Platform Local</MediaTag>
              </div>
            </div>
          </div>
        </div>

        <Reveal className="mt-14">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <p className="h-display text-3xl">Three editions. One silhouette.</p>
            <OriginButton href="#specs" tone="dark">
              Product details <span aria-hidden>↓</span>
            </OriginButton>
          </div>
          <ColorwayPicker size="lg" tone="dark" />
        </Reveal>
      </div>
    </section>
  );
}
