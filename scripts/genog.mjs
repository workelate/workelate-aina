// OG image: 1200×630, the dark WorkElate brand (tokens from data/workelate-design.md,
// §1.1 and §1.4: ground #07070c, text #ffffff, muted #9ca3b8, eyebrow #c7d2fe,
// headline gradient 90deg #00d4ff → #8b5cf6, Work Sans self-hosted), rendered in
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
const FONT = pathToFileURL(path.join(ROOT, "site", "fonts", "worksans-var-latin.woff2")).href;
const LOGO = pathToFileURL(path.join(ROOT, "site", "img", "workelate-logo.svg")).href;

// One line of the positioning, the same sentence /brain, llms.txt and the
// Organization JSON-LD carry. Change it there first, then here.
const POSITIONING = "It reads what your CRM, mail, tickets and documents already record, holds it as one memory, judges what needs a person, and asks before it changes anything.";

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face { font-family: "Work Sans"; src: url("${FONT}") format("woff2"); font-weight: 100 900; font-display: block; }
  * { margin:0; box-sizing:border-box; }
  html, body { width:1200px; height:630px; overflow:hidden; }
  body { background:#07070c; color:#ffffff; font-family:"Work Sans", Arial, sans-serif; position:relative; }
  .aurora { position:absolute; inset:0; overflow:hidden; }
  .aurora i { position:absolute; border-radius:50%; filter:blur(90px); opacity:.55; }
  .aurora .a { width:560px; height:560px; left:-140px; top:-260px; background:#2563eb; opacity:.35; }
  .aurora .b { width:520px; height:520px; right:-160px; top:-120px; background:#8b5cf6; opacity:.40; }
  .aurora .c { width:420px; height:420px; right:120px; bottom:-300px; background:#00d4ff; opacity:.22; }
  .grid { position:absolute; inset:0; background-image:linear-gradient(hsla(0,0%,100%,.045) 1px, transparent 1px), linear-gradient(90deg, hsla(0,0%,100%,.045) 1px, transparent 1px); background-size:48px 48px; mask-image:radial-gradient(ellipse at 30% 40%, #000 30%, transparent 75%); -webkit-mask-image:radial-gradient(ellipse at 30% 40%, #000 30%, transparent 75%); }
  .card { position:relative; height:100%; padding:64px 72px 56px; display:flex; flex-direction:column; justify-content:space-between; }
  .top { display:flex; align-items:center; gap:18px; }
  .top img { height:34px; width:auto; }
  .eyebrow { display:inline-flex; align-items:center; gap:10px; font-size:20px; font-weight:600; color:#c7d2fe; letter-spacing:.01em; }
  .eyebrow .dot { width:10px; height:10px; border-radius:50%; background:linear-gradient(135deg,#00d4ff,#8b5cf6); box-shadow:0 0 14px rgba(0,212,255,.45); }
  h1 { font-size:76px; line-height:1.04; font-weight:700; letter-spacing:-0.02em; max-width:1000px; }
  h1 span { background:linear-gradient(90deg,#00d4ff,#8b5cf6); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; color:transparent; }
  .lede { margin-top:26px; font-size:26px; line-height:1.45; color:#9ca3b8; max-width:960px; font-weight:400; }
  .foot { display:flex; justify-content:space-between; align-items:flex-end; border-top:1px solid hsla(0,0%,100%,.12); padding-top:22px; font-size:19px; color:#6b7280; }
  .foot b { color:#ffffff; font-weight:600; }
</style></head><body>
  <div class="aurora"><i class="a"></i><i class="b"></i><i class="c"></i></div>
  <div class="grid"></div>
  <div class="card">
    <div class="top">
      <img src="${LOGO}" alt="">
      <span class="eyebrow"><span class="dot"></span>WorkElate Chief · the Brain</span>
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
