// Grid montage for QA: node scripts/montage.mjs out.png cols w h files...
import sharp from "sharp";
const [out, cols, w, h, ...files] = process.argv.slice(2);
const C = +cols, W = +w, H = +h, rows = Math.ceil(files.length / C);
const comps = await Promise.all(files.map(async (f, i) => ({ input: await sharp(f).resize(W, H, { fit: "contain", background: "#333" }).toBuffer(), left: (i % C) * (W + 6), top: Math.floor(i / C) * (H + 6) })));
await sharp({ create: { width: C * (W + 6), height: rows * (H + 6), channels: 3, background: "#333" } }).composite(comps).png().toFile(out);
