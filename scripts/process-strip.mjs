// Builds the "how a studio frame is made" strip for the Studio chapter:
// board render → cut-out → staged on the sweep → graded. node scripts/process-strip.mjs
import sharp from "sharp";
const W = 900, H = 600;
const steps = [
  ["design/photo/in/local-lateral.png", "contain", "#e9e0cd"],
  ["design/photo/cut/local-lateral.png", "contain", "#d9d2c4"],
  ["design/photo/staged/01-local-lateral-hero.png", "cover", null],
  ["design/photo/final/01-local-lateral-hero.png", "cover", null],
];
for (const [i, [src, fit, bg]] of steps.entries()) {
  let img = sharp(src).resize(W, H, { fit, background: bg ?? "#000" });
  if (bg) img = img.flatten({ background: bg });
  await img.webp({ quality: 80 }).toFile(`public/img/process/frame-${i + 1}.webp`);
}
console.log("ok");
