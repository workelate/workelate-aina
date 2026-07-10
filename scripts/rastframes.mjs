// Rasterize the procedural SVG frames to JPEG — browsers decode rasters off
// the main thread; live-rasterizing full-HD SVGs in createImageBitmap can
// block >50ms and trip the jank budget. Run after genframes.mjs.
import { chromium } from "playwright";
import { readdirSync } from "node:fs";
import path from "node:path";

const DIR = path.join(import.meta.dirname, "..", "assets", "frames", "casestudy");
const W = 1600, H = 900;

const svgs = readdirSync(DIR).filter(f => f.endsWith(".svg")).sort();
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: W, height: H } });
let n = 0;
for (const f of svgs) {
  await p.goto("file://" + path.join(DIR, f));
  await p.screenshot({
    path: path.join(DIR, f.replace(".svg", ".jpg")),
    type: "jpeg", quality: 80
  });
  if (++n % 40 === 0) console.log(`${n}/${svgs.length}`);
}
await b.close();
console.log(`rasterized ${n} frames → jpg`);
