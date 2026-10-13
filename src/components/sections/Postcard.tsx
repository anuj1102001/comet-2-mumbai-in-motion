"use client";
import { useReduced } from "../motion/useReduced";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { ChapterHead, MediaTag, Reveal } from "../ui";

const RULES = [
  ["One view per panel", "Each quarter is composed like a single postcard: one scene, never a collage of icons."],
  ["One horizon line", "Train tracks, harbour and street sit on a shared line, so the scene reads continuously as the shoe turns."],
  ["A limited ink set", "Navy linework, cream ground, a single warm accent — the economy of old two-colour printing."],
];

/**
 * Chapter 4: the illustration system. Three layers drift at slightly
 * different speeds — enough depth to feel printed and stacked, never enough
 * to compete with the artwork.
 */
export function Postcard() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReduced();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.0005 });
  const back = useTransform(p, [0, 1], reduce ? [0, 0] : [40, -40]);
  const mid = useTransform(p, [0, 1], reduce ? [0, 0] : [90, -90]);
  const front = useTransform(p, [0, 1], reduce ? [0, 0] : [150, -150]);

  return (
    <section ref={ref} id="postcard" aria-labelledby="h-postcard" className="relative overflow-hidden bg-paper-2 py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-4 sm:px-8 lg:grid-cols-[1fr_1.25fr] lg:gap-16 lg:px-12">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span id="h-postcard" className="sr-only">
            The postcard
          </span>
          <ChapterHead index="04" kicker="The postcard" hindi="पोस्टकार्ड" title={<>Sent home from <span className="italic text-indigo">Bombay.</span></>}>
            Vintage Indian picture postcards framed one view per card, tinted by hand, with a printed border and a postmark. The sneaker graphics follow the same rules, translated onto a curved, flexing canvas upper.
          </ChapterHead>
          <ol className="mt-10 divide-y divide-line border-y border-line">
            {RULES.map(([k, v], i) => (
              <li key={k} className="grid grid-cols-[2.5rem_1fr] gap-2 py-4">
                <span className="font-mono text-xs text-terracotta">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <b className="block text-ink">{k}</b>
                  <span className="text-[15px] leading-relaxed text-ink-2">{v}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative min-h-[620px] sm:min-h-[760px]">
          <motion.figure style={{ y: back }} className="absolute left-0 top-0 w-[78%] overflow-hidden rounded-[22px] shadow-[0_40px_80px_-50px_rgba(0,0,0,.6)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/postcard-hero.webp" alt="Postcard edition poster: the sneaker in front of a CST etching with मुंबई MUMBAI lettering" loading="lazy" className="w-full" />
            <figcaption className="absolute bottom-3 left-3">
              <MediaTag>Concept render</MediaTag>
            </figcaption>
          </motion.figure>
          <motion.figure style={{ y: mid, rotate: -4 }} className="absolute right-0 top-[18%] w-[42%] rounded-md bg-paper p-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,.55)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/postcard-stamp.webp" alt="Air-mail stamp artwork: मुंबई MUMBAI with the sneaker, a red sun, the train and a cricketer" loading="lazy" className="w-full" />
          </motion.figure>
          <motion.figure style={{ y: front, rotate: 5 }} className="absolute bottom-0 left-[14%] w-[36%] rounded-md bg-paper p-2 shadow-[0_30px_60px_-30px_rgba(0,0,0,.55)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/harbour-stamp.webp" alt="Bombay stamp artwork with the Gateway of India and ferries" loading="lazy" className="w-full" />
          </motion.figure>
        </div>
      </div>

      <Reveal className="mx-auto mt-16 max-w-[1400px] px-4 sm:px-8 lg:px-12">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["/img/local-d-train.webp", "Board → quarter", "The rake is drawn as a postcard view, then cropped to the quarter's curve."],
            ["/img/local-d-sign.webp", "Board → sign", "Station boards keep their frame, so lettering reads as an object in the scene."],
            ["/img/harbour-d-toe.webp", "Board → postmark", "The cancellation mark is used once per side, like a real franking."],
          ].map(([src, k, v]) => (
            <figure key={k} className="overflow-hidden rounded-2xl border border-line bg-paper">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <figcaption className="p-4 text-sm leading-relaxed text-ink-2">
                <b className="block text-ink">{k}</b>
                {v}
              </figcaption>
            </figure>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
