/**
 * Cinematic shot slots (see design/higgsfield-shot-list.md).
 *
 * Each slot plays `video` when the file exists, otherwise the site shows the
 * clearly labelled fallback named in `fallback`. To drop in a generated shot:
 * export it to /public/video/<id>.mp4 (H.264, ~1080p, CRF 24–28, no audio),
 * add a poster frame at /public/video/<id>.jpg, and set `ready: true`.
 */
export type Shot = {
  id: string;
  title: string;
  ready: boolean;
  video: string;
  poster: string;
  fallback: "animatic" | "render";
};

export const SHOTS: Record<"city" | "discovery" | "hero" | "packaging", Shot> = {
  city: { id: "shot-a", title: "Mumbai local train arrives", ready: false, video: "/video/shot-a.mp4", poster: "/video/shot-a.jpg", fallback: "animatic" },
  discovery: { id: "shot-b", title: "The discovery", ready: false, video: "/video/shot-b.mp4", poster: "/video/shot-b.jpg", fallback: "animatic" },
  hero: { id: "shot-d", title: "Hero product film", ready: false, video: "/video/shot-d.mp4", poster: "/video/shot-d.jpg", fallback: "render" },
  packaging: { id: "shot-f", title: "Packaging reveal", ready: false, video: "/video/shot-f.mp4", poster: "/video/shot-f.jpg", fallback: "render" },
};

/** One easing family and three durations for the whole site. */
export const MOTION = {
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  easeInOut: [0.65, 0, 0.35, 1] as [number, number, number, number],
  fast: 0.35,
  base: 0.7,
  slow: 1.1,
};
