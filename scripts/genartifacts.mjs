// Product-artifact mockups rendered to PNG, self-hosted imagery in-palette.
// These stand in for (and get replaced by) real product screenshots.
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, unlinkSync } from "node:fs";
import path from "node:path";

const OUT = path.join(import.meta.dirname, "..", "site", "img");
mkdirSync(OUT, { recursive: true });

const BASE = `<style>
  * { margin:0; box-sizing:border-box; font-family:Menlo,monospace; }
  body { width:1400px; height:900px; background:#FFFFFF; color:#0A1830; padding:0; }
  .bar { background:#0A1F44; color:#F7FBF7; padding:18px 28px; font-size:15px; display:flex; justify-content:space-between; }
  .bar b { color:#0B5FFF; }
  .body { padding:28px; }
  table { width:100%; border-collapse:collapse; font-size:15px; }
  th { text-align:left; color:rgba(10,24,48,.5); font-weight:400; padding:10px 14px; border-bottom:2px solid #0B5FFF; font-size:13px; letter-spacing:.08em; }
  td { padding:13px 14px; border-bottom:1px solid rgba(10,24,48,.1); }
  .ok { color:#0B5FFF; font-weight:700; }
  .warn { color:#FF6A1A; font-weight:700; }
  .pill { border:1px solid #0B5FFF; color:#0A1F44; padding:3px 10px; font-size:12px; }
  .log { font-size:14.5px; line-height:2.1; }
  .log .t { color:rgba(10,24,48,.4); margin-right:14px; }
  .log .a { color:#0B5FFF; font-weight:700; }
  .log .h { color:#FF6A1A; font-weight:700; }
  .chat { max-width:760px; }
  .msg { border:1px solid rgba(10,24,48,.15); padding:14px 18px; margin:14px 0; font-size:15px; max-width:75%; }
  .msg.in { background:rgba(11,95,255,.07); }
  .msg.out { margin-left:auto; background:#0A1F44; color:#F7FBF7; }
  .extract { border-left:4px solid #0B5FFF; padding:12px 18px; margin-top:20px; font-size:14px; background:rgba(11,95,255,.05); }
  .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-bottom:24px; }
  .stat { border:1px solid rgba(10,24,48,.12); padding:20px; }
  .stat .n { font-size:38px; font-weight:700; color:#0A1F44; }
  .stat .n.g { color:#0B5FFF; }
  .stat .l { font-size:12.5px; color:rgba(10,24,48,.55); margin-top:4px; }
</style>`;

const MOCKS = {
  "dispatch-board": `${BASE}<div class="bar"><span><b>WE_AINA</b> · dispatch, Site 07 Redrock</span><span>Tue 06:42 · 31 trucks live · agent: <b>proposing</b></span></div>
  <div class="body">
    <div class="grid">
      <div class="stat"><div class="n g">38%</div><div class="l">cycle time vs manual baseline</div></div>
      <div class="stat"><div class="n">4m 12s</div><div class="l">avg gate-to-load today</div></div>
      <div class="stat"><div class="n">2</div><div class="l">exceptions needing a human</div></div>
    </div>
    <table>
      <tr><th>TRUCK</th><th>ASSIGNMENT</th><th>CYCLE</th><th>AGENT REASONING</th><th>STATUS</th></tr>
      <tr><td>KA-51-T 4402</td><td>Pit B → Crusher 2</td><td>17:40</td><td>C2 queue empty; B has 3 loaded benches</td><td class="ok">APPROVED</td></tr>
      <tr><td>KA-51-T 1188</td><td>Pit A → Stock E</td><td>21:05</td><td>order #5531 short 140t; E nearest</td><td class="ok">APPROVED</td></tr>
      <tr><td>HR-38-M 7710</td><td>hold at gate</td><td>-</td><td>loader L3 down 11 min; re-route in 2 cycles</td><td class="warn">REVIEW</td></tr>
      <tr><td>KA-51-T 9034</td><td>Pit B → Crusher 2</td><td>18:22</td><td>pairs with 4402; keeps C2 fed through shift change</td><td class="ok">APPROVED</td></tr>
      <tr><td>MH-12-K 3319</td><td>Weighbridge → out</td><td>44:10</td><td class="warn">cycle 2.3× median, flagged, GPS gap 09:12–09:31</td><td class="warn">REVIEW</td></tr>
    </table>
  </div>`,

  "agent-log": `${BASE}<div class="bar"><span><b>WE_AINA</b> · agent activity, invoices</span><span>last 24h · 71 actions · 0 unlogged</span></div>
  <div class="body log">
    <div><span class="t">05:58:11</span><span class="a">agent.match</span> delivery #88671 ↔ invoice INV-2214, 3-way match OK (order, weighbridge, delivery) → <b>posted</b></div>
    <div><span class="t">05:58:14</span><span class="a">agent.match</span> delivery #88672 ↔ invoice INV-2215, matched, tolerance 0.4% → <b>posted</b></div>
    <div><span class="t">06:02:47</span><span class="a">agent.report</span> daily production report assembled, 4 sources reconciled, 1 discrepancy flagged → sent 06:00 list</div>
    <div><span class="t">06:14:03</span><span class="h">agent.flag</span> invoice INV-2219: billed qty 34.2t vs weighbridge 31.8t (+7.5%) → routed to A. Sharma with evidence bundle</div>
    <div><span class="t">06:14:04</span><span class="a">agent.audit</span> evidence bundle: ticket #10221, gate log 05:11, rate card v7, attached</div>
    <div><span class="t">07:30:00</span><span class="a">agent.ar</span> reminder #2 sent, INV-2101 (day 32), tier B cadence, promise-to-pay date watching: 11 Jul</div>
    <div><span class="t">07:30:02</span><span class="a">agent.ar</span> INV-2088 payment received yesterday, reminder suppressed, account re-aged</div>
    <div><span class="t">08:05:19</span><span class="a">agent.order</span> WhatsApp order parsed, dealer Sunrise Traders, 60t M-sand, site Yelahanka, credit OK → auto-confirmed in 41s</div>
  </div>`,

  "invoice-match": `${BASE}<div class="bar"><span><b>WE_AINA</b> · freight reconciliation, April</span><span>1,412 lines · 96.2% auto-cleared</span></div>
  <div class="body">
    <div class="grid">
      <div class="stat"><div class="n g">1,358</div><div class="l">lines matched &amp; cleared automatically</div></div>
      <div class="stat"><div class="n">54</div><div class="l">exceptions queued with evidence</div></div>
      <div class="stat"><div class="n">₹2.4L</div><div class="l">disputed this month, receipts attached</div></div>
    </div>
    <table>
      <tr><th>BILL LINE</th><th>CARRIER</th><th>BILLED</th><th>EVIDENCE</th><th>VERDICT</th></tr>
      <tr><td>TRIP-0491</td><td>Shakti Logistics</td><td>₹8,400</td><td>ticket #9921 + delivery POD ✓</td><td class="ok">CLEARED</td></tr>
      <tr><td>TRIP-0492</td><td>Shakti Logistics</td><td>₹8,400</td><td class="warn">duplicate of TRIP-0491, same ticket ref</td><td class="warn">DISPUTE</td></tr>
      <tr><td>TRIP-0507</td><td>OM Freight</td><td>₹12,150</td><td>km billed 118 vs contracted route 96</td><td class="warn">DISPUTE</td></tr>
      <tr><td>TRIP-0508</td><td>OM Freight</td><td>₹9,900</td><td>rate card v7 applied ✓ weighbridge ✓</td><td class="ok">CLEARED</td></tr>
    </table>
  </div>`,

  "order-extract": `${BASE}<div class="bar"><span><b>WE_AINA</b> · dealer orders, live queue</span><span>today: 47 in · 43 auto-confirmed · 4 human review</span></div>
  <div class="body chat">
    <div class="msg in">"bhaiya kal subah 60 ton m sand chahiye yelahanka site pe, wahi rate. gadi 7 baje tak bhej dena 🙏"<br><span style="font-size:12px;color:rgba(10,24,48,.45)">Sunrise Traders · WhatsApp · 20:47</span></div>
    <div class="extract"><b>agent extracted</b>, product: M-sand · qty: 60t · site: Yelahanka · date: tomorrow 07:00 · rate: last agreed (₹640/t) · credit check: <span class="ok">OK ₹3.2L headroom</span> · stock: <span class="ok">OK</span></div>
    <div class="msg out">Order confirmed ✓ 60t M-sand → Yelahanka site, delivery tomorrow by 07:00, ₹640/t as agreed. Order #5533., WE_AINA for Sunrise Traders <span style="font-size:12px;opacity:.7">(auto-confirmed 20:48)</span></div>
  </div>`
};

const b = await chromium.launch();
for (const [name, html] of Object.entries(MOCKS)) {
  const tmp = path.join(import.meta.dirname, `_${name}.html`);
  writeFileSync(tmp, `<!doctype html><html><head>${html.split("</style>")[0]}</style></head><body>${html.split("</style>")[1]}</body></html>`);
  const p = await b.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1 });
  await p.goto("file://" + tmp);
  await p.screenshot({ path: path.join(OUT, `${name}.png`) });
  await p.close();
  unlinkSync(tmp);
  console.log(`wrote site/img/${name}.png`);
}
await b.close();
