// Optimises the campaign photographs into public/img/look (full + 900w).
// node scripts/look.mjs <source-dir>
import sharp from "sharp";
const src = process.argv[2];
const map = { "5.webp": "triptych", "6.png": "box-street", "7.webp": "gateway", "8.webp": "platform", "9.webp": "studio-pair", "10.webp": "vadapav", "11.webp": "studio-step", "12.webp": "studio-seated", "13.webp": "studio-walk", "14.webp": "studio-suit" };
for (const [file, name] of Object.entries(map)) {
  const img = sharp(`${src}/${file}`);
  const { width, height } = await img.metadata();
  await img.clone().resize({ width: Math.min(width, 2000) }).webp({ quality: 80 }).toFile(`public/img/look/${name}.webp`);
  if (width > 1000) await img.clone().resize({ width: 900 }).webp({ quality: 78 }).toFile(`public/img/look/${name}-900.webp`);
  console.log(name, width, height);
}
