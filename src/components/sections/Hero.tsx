"use client";
import { useReduced } from "../motion/useReduced";
import { motion, useMotionTemplate, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { colorwayById } from "@/lib/colorways";
import { SHOTS } from "@/lib/media";
import { scrollToId } from "@/lib/scroll";
import { OriginButton } from "@/components/OriginButton";
import { useStore } from "@/lib/store";
import { CometLogo } from "../brand/Logo";
import { MediaTag } from "../ui";

/**
 * Chapters 1–2: the city, then the reveal.
 *
 * Opens on the campaign photograph at the CSMT platform (a landscape crop on
 * wide screens, the original portrait on phones). Scrolling 1.6 screens pushes
 * the camera toward the commuter's shoe and cross-fades to the product on
 * paper. Only transform and opacity animate. When generated footage lands
 * (lib/media.ts), the video replaces the photograph in the same slot.
 */
const OPENING = {
  // generative-expanded to landscape in Photoshop; shoe = the near (left) sneaker, as a fraction of the image
  wide: { src: "/img/look/platform-wide.webp", srcSet: "/img/look/platform-wide-1400.webp 1400w, /img/look/platform-wide.webp 2400w", w: 3293, h: 2000, shoe: { x: 0.453, y: 0.792 } },
  tall: { src: "/img/look/platform.webp", srcSet: "/img/look/platform-900.webp 900w, /img/look/platform.webp 1493w", w: 1493, h: 2000, shoe: { x: 0.536, y: 0.8 } },
};

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReduced();
  const cw = colorwayById(useStore((s) => s.colorway));
  const shot = SHOTS.city;
  const photo = cw.studio[0];

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // sprung progress: the camera push glides instead of tracking each wheel notch
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.0005 });
  // freeze the slow drift while the camera pushes in: a scaled layer that also repaints every frame is what makes zooms stutter
  const [frozen, setFrozen] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setFrozen((f) => (f === v > 0.04 ? f : v > 0.04)));

  // where the commuter's shoe lands on screen (the photo uses object-cover scaling)
  const [origin, setOrigin] = useState({ x: 0.45, y: 0.79 });
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const art = w >= h ? OPENING.wide : OPENING.tall;
      const s = Math.max(w / art.w, h / art.h);
      setOrigin({ x: ((w - art.w * s) / 2 + art.shoe.x * art.w * s) / w, y: ((h - art.h * s) / 2 + art.shoe.y * art.h * s) / h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const scale = useTransform(p, [0.08, 0.62], [1, 3.2], { ease: (t) => t * t });
  const lift = useTransform(p, [0.08, 0.62], ["0%", "-34%"]);
  const vignette = useTransform(p, [0.05, 0.4], [0, 0.78]);
  const product = useTransform(p, [0.56, 0.68], [0, 1]);
  const productScale = useTransform(p, [0.5, 0.9], [1.06, 1]);
  const intro = useTransform(p, [0, 0.16], [1, 0]);
  const introY = useTransform(p, [0, 0.16], [0, -30]);
  const focusCopy = useTransform(p, [0.2, 0.3, 0.42, 0.5], [0, 1, 1, 0]);
  const revealCopy = useTransform(p, [0.7, 0.82], [0, 1]);
  const spot = useMotionTemplate`radial-gradient(circle at ${origin.x * 100}% ${origin.y * 100}%, transparent 8%, rgba(25,24,22,.55) 34%, rgba(25,24,22,.92) 70%)`;

  const go = scrollToId;

  return (
    <section ref={ref} id="city" aria-label="The city and the reveal" className={reduce ? "relative" : "relative h-[240svh]"}>
      <span id="reveal" aria-hidden className="absolute left-0 top-[62%] h-px w-px" />
      <div ref={stageRef} className={`${reduce ? "relative" : "sticky top-0"} h-[100svh] overflow-hidden bg-char`}>
        {/* the city */}
        <motion.div
          className="absolute inset-0 will-change-transform"
          style={reduce ? undefined : { scale, y: lift, transformOrigin: `${origin.x * 100}% ${origin.y * 100}%` }}
        >
          {shot.ready ? (
            <video className="h-full w-full object-cover" src={shot.video} poster={shot.poster} autoPlay muted loop playsInline preload="metadata" />
          ) : (
            <picture className={`block h-full w-full ${frozen ? "anim-paused" : ""}`}>
              <source media="(min-aspect-ratio: 1/1)" srcSet={OPENING.wide.srcSet} sizes="100vw" />
              <img
                src={OPENING.tall.src}
                srcSet={OPENING.tall.srcSet}
                sizes="100vw"
                alt="A commuter sits in the open door of a Mumbai local train at CSMT, wearing COMET 2.0 Platform Local sneakers"
                fetchPriority="high"
                decoding="async"
                className={`h-full w-full object-cover ${reduce ? "" : "anim-kenburns"}`}
                style={{ transformOrigin: `${origin.x * 100}% ${origin.y * 100}%` }}
              />
            </picture>
          )}
        </motion.div>
        {!reduce && <motion.div aria-hidden className="pointer-events-none absolute inset-0" style={{ opacity: vignette, backgroundImage: spot }} />}

        {/* the product stage the city resolves into */}
        <motion.div
          aria-hidden={false}
          className={`absolute inset-0 overflow-hidden ${photo.tone === "dark" ? "bg-[#18202f]" : "bg-[#e3d9c5]"}`}
          style={reduce ? { opacity: 0 } : { opacity: product }}
        >
          {/* the studio photograph fills the frame on wide screens and is shown whole on narrow ones */}
          <motion.figure style={reduce ? undefined : { scale: productScale }} className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photo.src}
              alt={`COMET 2.0 ${cw.name} sneaker in the studio`}
              decoding="async"
              className="feather-y h-full w-full object-contain md:object-cover"
            />
          </motion.figure>
          <motion.div style={{ opacity: revealCopy }} className="absolute inset-x-0 top-[13svh] px-5 text-center">
            <p className={`eyebrow ${photo.tone === "dark" ? "text-paper/70" : "text-ink-3"}`}>02 · The reveal</p>
            <p className={`h-display mt-3 text-[clamp(2rem,4.6vw,4rem)] ${photo.tone === "dark" ? "text-paper" : "text-ink"}`}>A city that never stops.</p>
          </motion.div>
          <div className="absolute bottom-4 left-4 sm:left-8">
            <MediaTag tone={photo.tone === "dark" ? "dark" : "light"}>Studio composite · from the board render</MediaTag>
          </div>
        </motion.div>

        {/* opening copy — HTML, never part of the footage */}
        <motion.div style={reduce ? undefined : { opacity: intro, y: introY }} className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-char/85 via-char/30 to-transparent px-5 pb-16 text-paper sm:px-10 sm:pb-20">
          <CometLogo size="xl" />
          <p className="wide mt-6 text-sm font-semibold tracking-[0.42em] text-paper/90 sm:text-base">MUMBAI IN MOTION</p>
          <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-paper/80">“A city that never stops. A story that moves with every step.”</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <OriginButton href="#silhouette" tone="dark" onClick={(e) => (e.preventDefault(), go("silhouette"))}>
              Explore the sneaker <span aria-hidden>→</span>
            </OriginButton>
            <OriginButton href="#postcard" tone="dark" variant="secondary" onClick={(e) => (e.preventDefault(), go("postcard"))}>
              Discover the story
            </OriginButton>
          </div>
        </motion.div>

        <motion.div style={reduce ? undefined : { opacity: intro }} className="absolute right-4 top-20 sm:right-8">
          <MediaTag tone="dark">AI-generated campaign still</MediaTag>
        </motion.div>

        <motion.div style={reduce ? { opacity: 0 } : { opacity: focusCopy }} className="pointer-events-none absolute left-5 top-[24%] max-w-sm text-paper sm:left-10">
          <p className="eyebrow text-paper/70">Somewhere in the crowd</p>
          <p className="h-display mt-3 text-[clamp(2rem,4vw,3.4rem)]">One detail moves differently.</p>
        </motion.div>

        <div className="absolute bottom-5 right-4 z-10 sm:right-8">
          <OriginButton tone="dark" variant="secondary" size="sm" onClick={() => go("silhouette")}>
            Skip intro <span aria-hidden>↓</span>
          </OriginButton>
        </div>
      </div>
    </section>
  );
}
