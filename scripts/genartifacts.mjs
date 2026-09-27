// Product-artifact mockups rendered to PNG, self-hosted imagery in-palette (v8, light).
// These stand in for (and get replaced by) real product screenshots.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, unlinkSync } from "node:fs";
import path from "node:path";

const OUT = path.join(import.meta.dirname, "..", "site", "img");
mkdirSync(OUT, { recursive: true });

// v8 (2026-09-28): the light workelate.com system. Each mock is a product
// window on the #f5f5f7 ground, the same recipe as the Chief window on
// workelate.com (white, radius 22, the one layered shadow), with the suite's
// own app icon in the app bar. Canvas heights are pinned to the width/height
// the pages already declare, so a regeneration can never shift layout.
const ICON = (n) => "file://" + path.join(import.meta.dirname, "..", "site", "img", "apps", n + ".webp");
const BASE = `<style>
  * { margin:0; box-sizing:border-box; }
  html, body { font-family:-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing:antialiased; }
  body { width:1400px; background:#f5f5f7; color:#111827; padding:26px 56px; }
  .win { background:#fff; border-radius:22px; overflow:hidden; box-shadow:0 0 0 1px rgba(0,0,0,.05), 0 2px 6px rgba(0,0,0,.04), 0 40px 80px -40px rgba(0,0,0,.28); }
  .bar { height:38px; display:flex; align-items:center; gap:7px; padding:0 16px; background:#fafafa; border-bottom:1px solid #efeff2; font-size:12.5px; color:#86868b; }
  .bar i { width:11px; height:11px; border-radius:50%; background:#e1e1e6; }
  .bar .ttl { margin-left:18px; }
  .bar .ttl b { color:#1d1d1f; font-weight:600; }
  .bar .rt { margin-left:auto; }
  .bar .rt b { color:#0f8083; font-weight:600; }
  .app { display:flex; align-items:center; gap:10px; padding:14px 22px; border-bottom:1px solid #f0f0f3; font-size:14px; }
  .app img { width:26px; height:26px; }
  .app b { font-weight:600; color:#111827; }
  .app span { color:#86868b; }
  .app span::before { content:"/"; margin-right:10px; color:#d1d1d6; }
  .body { padding:18px 22px 20px; }
  table { width:100%; border-collapse:collapse; font-size:13.5px; }
  th { text-align:left; font-weight:600; color:#6b7280; font-size:11.5px; letter-spacing:.02em; padding:8px 12px; background:#fafafa; border:1px solid #f0f0f3; }
  td { padding:9px 12px; border:1px solid #f0f0f3; color:#374151; }
  td:first-child { font-weight:600; color:#111827; font-variant-numeric:tabular-nums; }
  td.ok, td.warn { white-space:nowrap; }
  .ok { color:#1a8f4c; font-weight:600; }
  td.ok::before, td.warn::before { content:""; display:inline-block; width:7px; height:7px; border-radius:50%; margin-right:8px; vertical-align:1px; background:#1a8f4c; }
  .warn { color:#b45309; font-weight:600; }
  td.warn::before { background:#b45309; }
  td:not(:last-child).warn::before { display:none; }
  tr.hl td { background:#fff8e1; }
  .pill { border:1px solid #0f8083; color:#0b6366; padding:3px 10px; font-size:12px; border-radius:999px; }
  .log { font-size:14.5px; line-height:2.1; color:#374151; }
  .log .t { color:#9ca3af; margin-right:14px; font-variant-numeric:tabular-nums; }
  .log .a { color:#0f8083; font-weight:600; }
  .log .h { color:#b45309; font-weight:600; }
  .chat { max-width:760px; }
  .msg { padding:14px 18px; margin:14px 0; font-size:15px; max-width:75%; border-radius:18px; line-height:1.45; }
  .msg.in { background:#f5f5f7; border-radius:18px 18px 18px 5px; }
  .msg.out { margin-left:auto; background:#0a1a5c; color:#fff; border-radius:18px 18px 5px 18px; }
  .extract { border-radius:14px; padding:12px 18px; margin-top:20px; font-size:14px; background:#e6f3f3; color:#374151; }
  .extract b { color:#0b6366; }
  .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:16px; }
  .stat { background:#f5f5f7; border-radius:16px; padding:14px 18px; }
  .stat .n { font-size:30px; font-weight:600; letter-spacing:-.02em; color:#1d1d1f; line-height:1.1; }
  .stat .n.g { color:#0f8083; }
  .stat .l { font-size:12.5px; color:#6e6e73; margin-top:3px; }
</style>`;
const WIN = (icon, app, where, right, inner, cls = "body") =>
  `<div class="win"><div class="bar"><i></i><i></i><i></i><span class="rt">${right}</span></div>` +
  `<div class="app"><img src="${ICON(icon)}" alt=""><b>${app}</b><span>${where}</span></div><div class="${cls}">${inner}</div></div>`;
// the pages declare these sizes; everything else crops to content
const PINNED = { "dispatch-board": 501, "invoice-match": 456 };

const MOCKS = {
  "dispatch-board": BASE + WIN("task", "WE_AINA", "dispatch, Site 07 (representative view)", "Tue 06:42 · 31 trucks live · agent: <b>proposing</b>", `
    <div class="grid">
      <div class="stat"><div class="n g">38%</div><div class="l">cycle time vs manual baseline</div></div>
      <div class="stat"><div class="n">4m 12s</div><div class="l">avg gate-to-load today</div></div>
      <div class="stat"><div class="n">2</div><div class="l">exceptions needing a human</div></div>
    </div>
    <table>
      <tr><th>TRUCK</th><th>ASSIGNMENT</th><th>CYCLE</th><th>AGENT REASONING</th><th>STATUS</th></tr>
      <tr><td>UNIT 4402</td><td>Pit B → Crusher 2</td><td>17:40</td><td>C2 queue empty; B has 3 loaded benches</td><td class="ok">APPROVED</td></tr>
      <tr><td>UNIT 1188</td><td>Pit A → Stock E</td><td>21:05</td><td>order #5531 short 140t; E nearest</td><td class="ok">APPROVED</td></tr>
      <tr><td>UNIT 7710</td><td>hold at gate</td><td>-</td><td>loader L3 down 11 min; re-route in 2 cycles</td><td class="warn">REVIEW</td></tr>
      <tr><td>UNIT 9034</td><td>Pit B → Crusher 2</td><td>18:22</td><td>pairs with 4402; keeps C2 fed through shift change</td><td class="ok">APPROVED</td></tr>
      <tr><td>UNIT 3319</td><td>Weighbridge → out</td><td>44:10</td><td class="warn">cycle 2.3× median, flagged, GPS gap 09:12–09:31</td><td class="warn">REVIEW</td></tr>
    </table>
  `, "body"),

  "agent-log": BASE + WIN("wao", "WE_AINA", "agent worklist, invoices", "representative view · illustrative volumes", `
    <div><span class="t">05:58:11</span><span class="a">agent.match</span> delivery #88671 ↔ invoice INV-2214, 3-way match OK (order, weighbridge, delivery) → <b>posted</b></div>
    <div><span class="t">05:58:14</span><span class="a">agent.match</span> delivery #88672 ↔ invoice INV-2215, matched, tolerance 0.4% → <b>posted</b></div>
    <div><span class="t">06:02:47</span><span class="a">agent.report</span> daily production report assembled, 4 sources reconciled, 1 discrepancy flagged → sent 06:00 list</div>
    <div><span class="t">06:14:03</span><span class="h">agent.flag</span> invoice INV-2219: billed qty 34.2t vs weighbridge 31.8t (+7.5%) → routed to A. Sharma with evidence bundle</div>
    <div><span class="t">06:14:04</span><span class="a">agent.check</span> evidence bundle: ticket #10221, gate log 05:11, rate card v7, attached</div>
    <div><span class="t">07:30:00</span><span class="a">agent.ar</span> reminder #2 sent, INV-2101 (day 32), tier B cadence, promise-to-pay date watching: 11 Jul</div>
    <div><span class="t">07:30:02</span><span class="a">agent.ar</span> INV-2088 payment received yesterday, reminder suppressed, account re-aged</div>
    <div><span class="t">08:05:19</span><span class="a">agent.order</span> dealer order parsed, Ridgeline Materials, 60t crushed stone, Bell County yard, credit OK → auto-confirmed in 41s</div>
  `, "body log"),

  "invoice-match": BASE + WIN("data", "WE_AINA", "freight reconciliation (representative view)", "1,412 lines · 96.2% auto-cleared", `
    <div class="grid">
      <div class="stat"><div class="n g">1,358</div><div class="l">lines matched &amp; cleared automatically</div></div>
      <div class="stat"><div class="n">54</div><div class="l">exceptions queued with evidence</div></div>
      <div class="stat"><div class="n">$18,400</div><div class="l">disputed this month, receipts attached</div></div>
    </div>
    <table>
      <tr><th>BILL LINE</th><th>CARRIER</th><th>BILLED</th><th>EVIDENCE</th><th>VERDICT</th></tr>
      <tr><td>TRIP-0491</td><td>Cross Creek Hauling</td><td>$1,180</td><td>ticket #9921 + delivery POD ✓</td><td class="ok">CLEARED</td></tr>
      <tr><td>TRIP-0492</td><td>Cross Creek Hauling</td><td>$1,180</td><td class="warn">duplicate of TRIP-0491, same ticket ref</td><td class="warn">DISPUTE</td></tr>
      <tr><td>TRIP-0507</td><td>Redland Carriers</td><td>$1,640</td><td>miles billed 118 vs contracted route 96</td><td class="warn">DISPUTE</td></tr>
      <tr><td>TRIP-0508</td><td>Redland Carriers</td><td>$1,325</td><td>rate card v7 applied ✓ weighbridge ✓</td><td class="ok">CLEARED</td></tr>
    </table>
  `, "body"),

  "order-extract": BASE + WIN("mail", "WE_AINA", "dealer orders, live queue (representative view)", "today: 47 in · 43 auto-confirmed · 4 human review", `
    <div class="msg in">"need 60 ton crushed stone at the Bell County yard first thing tomorrow, same rate as last load. try to have it there by 7."<br><span style="font-size:12px;color:rgba(10,24,48,.45)">Ridgeline Materials · email · 20:47</span></div>
    <div class="extract"><b>agent extracted</b>, product: crushed stone · qty: 60t · site: Bell County yard · date: tomorrow 07:00 · rate: last agreed ($21.50/t) · credit check: <span class="ok">OK, $24K headroom</span> · stock: <span class="ok">OK</span></div>
    <div class="msg out">Order confirmed ✓ 60t crushed stone → Bell County yard, delivery tomorrow by 07:00, $21.50/t as agreed. Order #5533., WE_AINA for Ridgeline Materials <span style="font-size:12px;opacity:.7">(auto-confirmed 20:48)</span></div>
  `, "body chat")
};

const b = await chromium.launch();
for (const [name, html] of Object.entries(MOCKS)) {
  const tmp = path.join(import.meta.dirname, `_${name}.html`);
  writeFileSync(tmp, `<!doctype html><html><head>${html.split("</style>")[0]}</style></head><body>${html.split("</style>")[1]}</body></html>`);
  const p = await b.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
  await p.goto("file://" + tmp);
  // crop to the content, not the viewport: the mocks are shorter than 900px and
  // a fixed-height shot left a slab of dead white under every artifact.
  const natural = await p.evaluate(() => {
    document.body.style.height = "auto";
    return Math.ceil(document.body.getBoundingClientRect().height);
  });
  const h = PINNED[name] || natural;
  if (natural > h) console.warn(`  ${name}: content ${natural}px overflows the pinned ${h}px`);
  await p.evaluate((hh) => { document.body.style.height = hh + "px"; document.body.style.display = "flex"; document.body.style.flexDirection = "column"; document.body.style.justifyContent = "center"; }, h);
  await p.screenshot({ path: path.join(OUT, `${name}.png`), clip: { x: 0, y: 0, width: 1400, height: h } });
  await p.close();
  unlinkSync(tmp);
  console.log(`wrote site/img/${name}.png (1400x${h})`);
}
await b.close();
