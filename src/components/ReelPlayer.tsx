"use client";
import { useEffect, useRef, useState } from "react";
import { OriginButton } from "./OriginButton";
import { useReduced } from "./motion/useReduced";

const SRC = {
  wide: { video: "/video/reel-16x9.mp4", poster: "/video/reel-16x9.jpg", ratio: "aspect-video" },
  tall: { video: "/video/reel-9x16.mp4", poster: "/video/reel-9x16.jpg", ratio: "aspect-[9/16]" },
};

/**
 * The 20-second launch reel (design/reel). Nothing downloads until the player
 * is near the viewport; it then plays muted while visible and pauses when
 * scrolled away. Phones in portrait get the 9:16 cut. Reduced motion: no
 * autoplay, the poster shows until the visitor presses play.
 */
export function ReelPlayer({ tone = "light", className = "", allowTall = true }: { tone?: "light" | "dark"; className?: string; allowTall?: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduce = useReduced();
  const [tall, setTall] = useState(false);
  const [near, setNear] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const f = tall ? SRC.tall : SRC.wide;

  useEffect(() => {
    if (!allowTall) return;
    const mq = window.matchMedia("(max-width: 767px) and (orientation: portrait)");
    const on = () => setTall(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [allowTall]);

  // load when close, play only while actually on screen
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setNear(true);
        const v = video.current;
        if (!v) return;
        if (e.intersectionRatio > 0.35 && !reduce && !userPaused) v.play().catch(() => {});
        else if (e.intersectionRatio < 0.2) v.pause();
      },
      { rootMargin: "300px 0px", threshold: [0, 0.2, 0.35, 0.6] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce, userPaused, near]);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      setUserPaused(false);
      v.play().catch(() => {});
    } else {
      setUserPaused(true);
      v.pause();
    }
  };

  return (
    <div ref={box} className={`relative overflow-hidden rounded-[22px] bg-char ${f.ratio} ${tall ? "mx-auto max-h-[80svh]" : ""} ${className}`}>
      {near ? (
        <video
          key={f.video}
          ref={video}
          className="absolute inset-0 h-full w-full object-cover"
          src={f.video}
          poster={f.poster}
          muted
          loop
          playsInline
          preload="metadata"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          aria-label="COMET 2.0 launch reel: the logo, the three editions, design details and the poster box. Silent, 20 seconds."
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={f.poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4">
        <OriginButton size="xs" tone={tone} variant="secondary" onClick={toggle} aria-pressed={playing} aria-label={playing ? "Pause the launch reel" : "Play the launch reel"}>
          {playing ? "❚❚ Pause" : "▶ Play"}
        </OriginButton>
      </div>
    </div>
  );
}
