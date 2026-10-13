// Renders design/reel/reel.html frame by frame and encodes it with ffmpeg.
// node scripts/reel.mjs <width> <height> <out.mp4> [fps]
// Example: node scripts/reel.mjs 1920 1080 design/reel/comet-reel-16x9.mp4
import puppeteer from "puppeteer-core";
import ffmpeg from "ffmpeg-static";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const [w = "1920", h = "1080", out = "design/reel/reel.mp4", fps = "30"] = process.argv.slice(2);
const url = pathToFileURL(resolve("design/reel/reel.html")).href + `?w=${w}&h=${h}`;

const browser = await puppeteer.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  args: ["--allow-file-access-from-files", "--force-color-profile=srgb"],
});
const page = await browser.newPage();
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
await page.goto(url, { waitUntil: "networkidle0", timeout: 120000 });
await page.evaluate(() => window.ready);
const duration = await page.evaluate(() => window.DURATION);
const frames = Math.round(duration * +fps);

// H.264, yuv420p, faststart: plays everywhere (Instagram, LinkedIn, Express, browsers)
const enc = spawn(ffmpeg, [
  "-y", "-f", "image2pipe", "-framerate", fps, "-i", "-",
  "-c:v", "libx264", "-preset", "slow", "-crf", "18", "-pix_fmt", "yuv420p",
  "-movflags", "+faststart", out,
], { stdio: ["pipe", "ignore", "inherit"] });

for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.render(t), i / +fps);
  const buf = await page.screenshot({ type: "jpeg", quality: 95, optimizeForSpeed: true });
  if (!enc.stdin.write(buf)) await new Promise((r) => enc.stdin.once("drain", r));
  if (i % 60 === 0) console.log(`frame ${i}/${frames}`);
}
enc.stdin.end();
await new Promise((r) => enc.on("close", r));
await browser.close();
console.log("wrote", out);
