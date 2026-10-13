# COMET 2.0 launch reel

20 seconds, 30 fps, H.264, silent, in two formats: 16:9 (1920×1080) for the portfolio and 9:16 (1080×1920) for Reels and Stories.

**Running order:** comet logo sweep, then three editions (Platform Local, Postcard, Harbour), then the details (train, vada pav, CST), then the poster box, then the end card (COMET 2.0 · Mumbai in Motion · A city that never stops).

**How it's made**
- `reel.html`: a single timeline. `window.render(t)` poses every element for time `t`, so frames are exact and no animation runs on its own.
- `scripts/reel.mjs <w> <h> <out.mp4>`: steps the timeline frame by frame in headless Chrome and pipes the frames to ffmpeg.
- **Footage:** the studio photographs from `design/photo`. The 9:16 versions were extended to a vertical frame with Adobe Photoshop Generative Expand (backdrop only; the product is untouched).

The videos are silent on purpose. Add a licensed track in Adobe Express (Premium audio library) before posting.
