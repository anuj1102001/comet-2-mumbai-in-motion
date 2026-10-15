// Renders the campaign advertising assets in design/ads/ads.html to public/img/ads.
// node scripts/ads.mjs
import puppeteer from "puppeteer-core";
import sharp from "sharp";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--allow-file-access-from-files"] });
const page = await browser.newPage();
await page.setViewport({ width: 2600, height: 4600, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(resolve("design/ads/ads.html")).href, { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
for (const id of ["billboard", "post", "story"]) {
  const el = await page.$(`#${id}`);
  const buf = await el.screenshot({ type: "png" });
  await sharp(buf).png().toFile(`design/ads/${id}.png`);
  await sharp(buf).resize({ width: id === "billboard" ? 1800 : 900 }).webp({ quality: 82 }).toFile(`public/img/ads/${id}.webp`);
  console.log(id);
}
await browser.close();
