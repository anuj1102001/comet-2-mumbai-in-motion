// Cuts the three concept boards (design/source) into the individual
// views and details used on the site. Run: node scripts/crop.mjs
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const OUT = "public/img";
mkdirSync(OUT, { recursive: true });

// [name, left, top, right, bottom]
const crops = {
  1: [
    ["local-lateral", 55, 165, 725, 475],
    ["local-medial", 765, 170, 1415, 475],
    ["local-toe", 45, 495, 255, 780],
    ["local-heel", 335, 500, 510, 780],
    ["local-top", 580, 555, 1005, 750],
    ["local-outsole", 1010, 565, 1510, 740],
    ["local-d-train", 140, 820, 336, 985],
    ["local-d-sign", 345, 820, 537, 985],
    ["local-d-vadapav", 546, 820, 738, 985],
    ["local-d-cricket", 746, 820, 938, 985],
    ["local-d-cst", 944, 820, 1138, 985],
    ["local-d-heel", 1146, 820, 1336, 985],
  ],
  2: [
    ["postcard-hero", 0, 0, 884, 612],
    ["postcard-shoe", 90, 235, 815, 585],
    ["postcard-stamp", 888, 0, 1312, 642],
    ["box-closed", 0, 615, 548, 962],
    ["box-open", 545, 615, 862, 962],
    ["box-inserts", 860, 640, 1312, 962],
    ["postcard-d-heel", 12, 975, 232, 1145],
    ["postcard-d-train", 240, 975, 432, 1145],
    ["postcard-d-vadapav", 448, 975, 656, 1145],
    ["postcard-d-tongue", 664, 975, 862, 1145],
    ["postcard-d-sole", 870, 975, 1082, 1145],
    ["postcard-d-insole", 1094, 975, 1302, 1145],
  ],
  3: [
    ["harbour-lateral", 200, 140, 1175, 505],
    ["harbour-stamp", 1212, 22, 1532, 402],
    ["harbour-top", 22, 500, 445, 970],
    ["harbour-medial", 448, 515, 912, 725],
    ["harbour-heel", 490, 760, 705, 965],
    ["harbour-d-toe", 938, 536, 1232, 720],
    ["harbour-d-tongue", 1256, 536, 1532, 720],
    ["harbour-d-side", 938, 760, 1232, 947],
    ["harbour-d-heel", 1256, 758, 1532, 947],
  ],
};

for (const [src, list] of Object.entries(crops)) {
  const file = `design/source/${src}.webp`;
  await sharp(file).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 82 }).toFile(`${OUT}/board-${src}.webp`);
  for (const [name, l, t, r, b] of list) {
    await sharp(file)
      .extract({ left: l, top: t, width: r - l, height: b - t })
      .resize({ width: Math.min(1400, (r - l) * 2), kernel: "lanczos3" })
      .webp({ quality: 86 })
      .toFile(`${OUT}/${name}.webp`);
  }
}
console.log("done");
