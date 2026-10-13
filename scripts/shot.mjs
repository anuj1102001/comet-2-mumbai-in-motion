// Headless screenshots for visual QA: node scripts/shot.mjs <path> <out.png> [width] [height] [waitMs] [scrollY]
import puppeteer from "puppeteer-core";
const [path = "/", out = "shot.png", w = "1440", h = "900", wait = "4000", scrollY = "0"] = process.argv.slice(2);
const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--use-angle=d3d11", "--enable-webgl", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.log("pageerror", e.message));
page.on("console", (m) => m.type() === "error" && console.log("console", m.text().slice(0, 200)));
await page.goto("http://localhost:3300" + path, { waitUntil: "networkidle2", timeout: 90000 });
if (+scrollY) await page.evaluate((y) => window.scrollTo(0, y), +scrollY);
await new Promise((r) => setTimeout(r, +wait));
await page.screenshot({ path: out });
await browser.close();
