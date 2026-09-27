// OG image: 1200×630, the light workelate.com system (v8, 2026-09-28: white
// ground, ink #1d1d1f, grey #6e6e73, one teal #0f8083 word, the system SF
// stack, the Chief mark), rendered in
// headless Chromium via playwright and screenshotted to site/og.png.
//
// It says: WorkElate Chief, the Brain, and one line of the positioning. No numbers:
// the card travels on its own (Slack, LinkedIn, iMessage) with no page to source them.
//
//   node scripts/genog.mjs
import { chromium } from "playwright";
import { writeFileSync, unlinkSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = path.join(import.meta.dirname, "..");
const LOGO = pathToFileURL(path.join(ROOT, "site", "img", "workelate-logo.svg")).href;

// One line of the positioning, the same sentence /brain, llms.txt and the
// Organization JSON-LD carry. Change it there first, then here.
const POSITIONING = "It reads what your CRM, mail, tickets and documents already record, holds it as one memory, judges what needs a person, and asks before it changes anything.";

const CHIEF = `<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#0f8083"/><path d="M12 5.2c.5 3.6 1.9 5 5.5 5.6-3.6.6-5 2-5.5 5.6-.5-3.6-1.9-5-5.5-5.6 3.6-.6 5-2 5.5-5.6Z" fill="#fff"/></svg>`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin:0; box-sizing:border-box; }
  html, body { width:1200px; height:630px; overflow:hidden; }
  body { background:#ffffff; color:#1d1d1f; font-family:-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing:antialiased; }
  .card { height:100%; padding:60px 76px 52px; display:flex; flex-direction:column; justify-content:space-between; }
  .top { display:flex; align-items:center; justify-content:space-between; }
  .top img { height:30px; width:auto; }
  .eyebrow { display:inline-flex; align-items:center; gap:12px; font-size:22px; font-weight:600; letter-spacing:-.01em; color:#1d1d1f; }
  h1 { font-size:78px; line-height:1.04; font-weight:600; letter-spacing:-0.035em; max-width:1000px; }
  h1 span { color:#0f8083; }
  .lede { margin-top:24px; font-size:26px; line-height:1.4; letter-spacing:-.01em; color:#6e6e73; max-width:980px; }
  .foot { display:flex; justify-content:space-between; align-items:flex-end; border-top:1px solid #e8e8ed; padding-top:20px; font-size:19px; color:#6e6e73; }
  .foot b { color:#1d1d1f; font-weight:600; }
</style></head><body>
  <div class="card">
    <div class="top">
      <img src="${LOGO}" alt="">
      <span class="eyebrow">${CHIEF}WorkElate Chief · the Brain</span>
    </div>
    <div>
      <h1><span>One memory</span> for the work your systems already hold.</h1>
      <p class="lede">${POSITIONING}</p>
    </div>
    <div class="foot">
      <span><b>aina.workelate.com</b></span>
      <span>Installed by WE_AINA, WorkElate's own studio</span>
    </div>
  </div>
</body></html>`;

const tmp = path.join(import.meta.dirname, "_og.html");
writeFileSync(tmp, html);
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await p.goto(pathToFileURL(tmp).href);
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: path.join(ROOT, "site", "og.png"), type: "png" });
await b.close();
unlinkSync(tmp);
console.log("wrote site/og.png (1200×630)");
