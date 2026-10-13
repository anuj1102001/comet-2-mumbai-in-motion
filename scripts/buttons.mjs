// Hover QA for OriginButton: enters each sample button from the left edge and
// captures mid-fill and full-fill frames. node scripts/buttons.mjs <outDir> [base]
import puppeteer from "puppeteer-core";
import sharp from "sharp";
const [out, base = "http://localhost:3300"] = process.argv.slice(2);
const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe" });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
page.on("pageerror", (e) => console.log("pageerror", e.message));
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
await page.goto(base + "/", { waitUntil: "networkidle2", timeout: 120000 });
await wait(1200);

// viewport screenshot, cropped afterwards: never scrolls the page under the mouse
async function shot(path, c) {
  const buf = await page.screenshot();
  const left = Math.round(Math.max(0, c.x)), top = Math.round(Math.max(0, c.y));
  await sharp(buf).extract({ left, top, width: Math.round(Math.min(c.width, 1440 - left)), height: Math.round(Math.min(c.height, 900 - top)) }).toFile(path);
}

async function hoverShot(selectorText, name) {
  const box = await page.evaluate((t) => {
    const el = [...document.querySelectorAll("a,button")].find((b) => b.textContent.trim().startsWith(t) && b.getBoundingClientRect().width > 0);
    if (!el) return null;
    const r0 = el.getBoundingClientRect();
    if (r0.top < 0 || r0.bottom > innerHeight) window.scrollTo(0, scrollY + r0.top - innerHeight / 2);
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  }, selectorText);
  if (!box) return console.log("not found", selectorText);
  await wait(2500);
  const b2 = await page.evaluate((t) => {
    const el = [...document.querySelectorAll("a,button")].find((b) => b.textContent.trim().startsWith(t) && b.getBoundingClientRect().width > 0);
    const r = el.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height, sy: scrollY };
  }, selectorText);
  await page.mouse.move(b2.x - 30, b2.y + b2.h / 2);
  await page.mouse.move(b2.x + 6, b2.y + b2.h / 2, { steps: 2 });
  await wait(140);
  // capture in place: a screenshot that scrolls would move the button out from under the mouse
  const clip = { x: Math.max(0, b2.x - 40), y: Math.max(0, b2.y - 30), width: b2.w + 80, height: b2.h + 60 };
  await shot(`${out}/btn-${name}-mid.png`, clip);
  await wait(700);
  await shot(`${out}/btn-${name}-full.png`, clip);
  await page.mouse.move(5, 5);
  await wait(700);
  await shot(`${out}/btn-${name}-rest.png`, clip);
}

await hoverShot("Explore the sneaker", "hero-primary");
await hoverShot("Discover the story", "hero-secondary");
// further down the page: skip wheel smoothing so the programmatic scroll lands exactly
await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
await page.reload({ waitUntil: "networkidle2" });
await wait(1200);
await hoverShot("View the design case study", "specs-primary");
await hoverShot("Watch the story again", "specs-secondary");
await browser.close();
