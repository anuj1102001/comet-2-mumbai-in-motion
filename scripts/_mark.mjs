import sharp from "sharp";
const S = process.argv[2];
const sides = {
  l1: ["1", 75, 708, 400, 225, 384, 348, 112],
  m1: ["1", 1405, 775, 405, 230, 1109, 346, 98],
  l2: ["2", 100, 805, 510, 295, 430, 422, 140],
  l3: ["3", 473, 902, 685, 560, 690, 632, 104],
  m3: ["3", 1180, 215, 385, 145, 740, 285, 110],
};
for (const [k, [f, hx, tx, by, cy, sx, sy, sw]] of Object.entries(sides)) {
  const meta = await sharp(`design/source/${f}.webp`).metadata();
  const x0 = Math.max(0, Math.min(hx, tx) - 30), x1 = Math.min(meta.width, Math.max(hx, tx) + 30);
  const y0 = Math.max(0, cy - 40), y1 = Math.min(meta.height, by + 80);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${meta.width}" height="${meta.height}">
  <line x1="${hx}" y1="0" x2="${hx}" y2="${meta.height}" stroke="red" stroke-width="2"/>
  <line x1="${tx}" y1="0" x2="${tx}" y2="${meta.height}" stroke="lime" stroke-width="2"/>
  <line x1="0" y1="${by}" x2="${meta.width}" y2="${by}" stroke="red" stroke-width="2"/>
  <line x1="0" y1="${cy}" x2="${meta.width}" y2="${cy}" stroke="orange" stroke-width="2"/>
  <circle cx="${sx}" cy="${sy}" r="${sw / 2}" fill="none" stroke="magenta" stroke-width="3"/>
  <circle cx="${sx}" cy="${sy}" r="3" fill="magenta"/></svg>`;
  const buf = await sharp(`design/source/${f}.webp`).composite([{ input: Buffer.from(svg) }]).png().toBuffer();
  await sharp(buf).extract({ left: x0, top: y0, width: x1 - x0, height: y1 - y0 }).png().toFile(`${S}/mark-${k}.png`);
}
