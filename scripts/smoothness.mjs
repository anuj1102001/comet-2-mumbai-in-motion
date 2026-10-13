// Wheel-scrolls the whole page like a mouse user and reports frame pacing.
// node scripts/smoothness.mjs [url]
import puppeteer from "puppeteer-core";
const url = process.argv[2] ?? "http://localhost:3300/";
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", args: ["--use-angle=d3d11", "--ignore-gpu-blocklist"] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
page.on("pageerror", (e) => console.log("pageerror", e.message));
await page.goto(url, { waitUntil: "networkidle2", timeout: 120000 });
await new Promise((r) => setTimeout(r, 1500));
await page.evaluate(() => {
  window.__frames = [];
  let last = performance.now();
  window.__long = [];
  const tick = (t) => { const d = t - last; window.__frames.push(d); if (d > 33) { const sec = [...document.querySelectorAll("main > section")].find((el) => { const r = el.getBoundingClientRect(); return r.top <= innerHeight / 2 && r.bottom > innerHeight / 2; }); window.__long.push((sec?.id ?? "?") + ":" + Math.round(d)); } last = t; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
});
await page.mouse.move(700, 450);
const H = await page.evaluate(() => document.documentElement.scrollHeight);
for (let i = 0; i < 400 && (await page.evaluate(() => scrollY + innerHeight)) < H - 10; i++) {
  await page.mouse.wheel({ deltaY: 120 });
  await new Promise((r) => setTimeout(r, 40));
}
await new Promise((r) => setTimeout(r, 1200));
const f = await page.evaluate(() => window.__frames.slice(5));
f.sort((a, b) => a - b);
const pct = (p) => f[Math.floor(f.length * p)].toFixed(1);
console.log({ lenis: await page.evaluate(() => document.documentElement.classList.contains("lenis")), frames: f.length, median: pct(0.5), p95: pct(0.95), p99: pct(0.99), over33ms: f.filter((x) => x > 33).length });
console.log(await page.evaluate(() => window.__long.join(" ")));
await browser.close();
