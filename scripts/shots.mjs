// Multi-position screenshots in one browser session: node scripts/shots.mjs <outDir> <w> <h> <y1,y2,...|#id,...> [path]
import puppeteer from "puppeteer-core";
const [out, w = "1440", h = "900", list = "0", path = "/"] = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--use-angle=d3d11", "--enable-webgl", "--ignore-gpu-blocklist"] });
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1, isMobile: +w < 700, hasTouch: +w < 700 });
page.on("pageerror", (e) => console.log("pageerror", e.message));
page.on("console", (m) => m.type() === "error" && console.log("console", m.text().slice(0, 160)));
await page.goto("http://localhost:3300" + path, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 1500));
for (const item of list.split(",")) {
  if (item.startsWith("#")) {
    const [id, off = "0"] = item.slice(1).split(":");
    await page.evaluate((id, off) => { const el = document.getElementById(id); window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY + off); }, id, +off);
  } else {
    await page.evaluate((y) => window.scrollTo(0, y), +item);
  }
  await new Promise((r) => setTimeout(r, 2600));
  const name = item.replace(/[#:]/g, "_");
  await page.screenshot({ path: `${out}/s-${w}-${name}.png` });
  console.log("shot", name, await page.evaluate(() => document.documentElement.scrollHeight));
}
await browser.close();
