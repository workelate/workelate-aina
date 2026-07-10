// OG image: 1200×630 render of a receipt-style card, screenshotted via playwright.
import { chromium } from "playwright";
import { writeFileSync } from "node:fs";
import path from "node:path";

const html = `<!doctype html><html><head><style>
  * { margin:0; box-sizing:border-box; }
  body { width:1200px; height:630px; background:#FAFCFF; color:#0A1830; font-family:-apple-system,"Segoe UI",Roboto,Arial,sans-serif;
    font-family:Menlo,monospace; padding:72px; display:flex; flex-direction:column; justify-content:space-between; }
  .label { color:#0B5FFF; font-size:20px; letter-spacing:.2em; }
  h1 { font-size:64px; line-height:1.15; font-weight:700; }
  h1 span { color:#0B5FFF; }
  .meta { display:flex; gap:48px; font-size:22px; color:rgba(10,24,48,.65);
    border-top:4px solid #0B5FFF; padding-top:28px; }
  .meta b { color:#0B5FFF; }
</style></head><body>
  <div class="label">WE_AINA</div>
  <h1>Your business runs 24/7.<br>Your software waits for clicks.<br><span>We fix that.</span></h1>
  <div class="meta">
    <span><b>10×</b> faster delivery</span>
    <span><b>$30K–$100K</b> fixed budgets</span>
    <span><b>2,140</b> invoices, zero touches</span>
  </div>
</body></html>`;

const tmp = path.join(import.meta.dirname, "_og.html");
writeFileSync(tmp, html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto("file://" + tmp);
await p.screenshot({ path: path.join(import.meta.dirname, "..", "site", "og.png") });
await b.close();
const { unlinkSync } = await import("node:fs");
unlinkSync(tmp);
console.log("wrote site/og.png");
