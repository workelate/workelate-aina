// ---------------------------------------------------------------------------
// genbrain.mjs, figures for the /brain pages, on the workelate.com dark system.
//
// WHAT THESE ARE: explanatory figures rendered in the brand palette and
// screenshotted to PNG. They are NOT product captures. The only numbers that
// may appear are the public set from CLAUDE.md "IP stays internal":
//   15 verbs, 287 actions, 12 application surfaces, 190 business objects,
//   71 confirm-gated, 40 per organization and 5 per person per hour.
// No measurement date, no repo name, no timing figure, no count of anything
// else, and no sentence about how the code is structured.
//
// Four plates: brain-ladder, brain-adoption, brain-verbs, brain-honesty.
// brain-briefing, brain-gate and brain-graph were retired on 2026-09-12 in
// favour of real product captures and the live graph; they are not generated
// and the PNGs were deleted.
//
// House pattern copied from scripts/genartifacts.mjs: render a standalone HTML
// document in headless chromium, measure the content height, clip the shot to
// the content so nothing dead ships under the figure.
//
// Palette (data/workelate-design.md, PORTING NOTES):
//   ground #07070c   raised #0c0c14   text #ffffff   muted #9ca3b8
//   dim #8b93a7 (labels only)   border rgba(255,255,255,.22)
//   cyan #00d4ff  purple #8b5cf6  blue #2563eb  emerald #34d399
//   amber #fbbf24  red #f87171
// One gradient, linear-gradient(90deg,#00d4ff,#8b5cf6), on one emphasised
// mark per plate. No shadows. 12px radius interactive, 20px containers.
// Font: Work Sans, self-hosted at site/fonts/worksans-var-latin.woff2.
// No em dashes in any string that renders inside a plate.
// ---------------------------------------------------------------------------
import { chromium } from "playwright";
import { mkdirSync, writeFileSync, unlinkSync, statSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const OUT = path.join(import.meta.dirname, "..", "site", "img");
mkdirSync(OUT, { recursive: true });
const FONT = pathToFileURL(path.join(import.meta.dirname, "..", "site", "fonts", "worksans-var-latin.woff2")).href;

const FAM = "'Work Sans', Arial, sans-serif";

const GROUND = "#07070c";
const RAISED = "#0c0c14";
const TEXT = "#ffffff";
const MUTED = "#9ca3b8";
const DIM = "#8b93a7";
const BORDER = "rgba(255,255,255,.22)";
const FILL = "rgba(255,255,255,.035)";
const CYAN = "#00d4ff";
const PURPLE = "#8b5cf6";
const BLUE = "#2563eb";
const EMERALD = "#34d399";
const AMBER = "#fbbf24";
const RED = "#f87171";

const BASE = `<style>
  @font-face { font-family:"Work Sans"; src:url("${FONT}") format("woff2");
               font-weight:100 900; font-style:normal; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:1400px; background:${GROUND}; color:${TEXT}; font-family:${FAM};
         -webkit-font-smoothing:antialiased; }
  .bar { background:${RAISED}; border-bottom:1px solid ${BORDER}; padding:22px 40px;
         display:flex; justify-content:space-between; align-items:center; }
  .bar .t { font-size:15px; font-weight:600; letter-spacing:-.01em; color:${TEXT}; }
  .bar .rt { font-size:11px; font-weight:700; letter-spacing:.07em; text-transform:uppercase; color:${DIM}; }
  .body { padding:44px 40px 40px; }
</style>`;

// --- small SVG helpers ------------------------------------------------------
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// one line of text. weight defaults to 400; eyebrow() is the 11px/700 label.
function t(x, y, size, fill, str, o = {}) {
  const ls = o.ls != null ? ` letter-spacing="${o.ls}"` : "";
  const anchor = o.anchor ? ` text-anchor="${o.anchor}"` : "";
  const weight = ` font-weight="${o.weight || 400}"`;
  return `<text x="${x}" y="${y}" font-family="${FAM}" font-size="${size}" fill="${fill}"${ls}${anchor}${weight}>${esc(str)}</text>`;
}
function stack(x, y, step, size, fill, arr, o = {}) {
  return arr.map((s, i) => t(x, y + i * step, size, fill, s, o)).join("");
}
// the section eyebrow: 11px / 700 / uppercase / .07em, dim
const eyebrow = (x, y, str, fill = DIM, o = {}) =>
  t(x, y, 11, fill, String(str).toUpperCase(), { ls: 0.8, weight: 700, ...o });
function arrowR(x1, y1, x2, y2, colour, w = 1) {
  return `<path d="M${x1} ${y1} L${x2 - 8} ${y2}" stroke="${colour}" stroke-width="${w}" fill="none"></path>` +
    `<path d="M${x2 - 9} ${y2 - 5} L${x2} ${y2} L${x2 - 9} ${y2 + 5} Z" fill="${colour}"></path>`;
}
function arrowD(x, y1, y2, colour, w = 1) {
  return `<path d="M${x} ${y1} L${x} ${y2 - 8}" stroke="${colour}" stroke-width="${w}" fill="none"></path>` +
    `<path d="M${x - 5} ${y2 - 9} L${x} ${y2} L${x + 5} ${y2 - 9} Z" fill="${colour}"></path>`;
}
// a container: white-alpha fill, hairline border, 20px radius (12 for interactive)
const box = (x, y, w, h, o = {}) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r ?? 20}" fill="${o.fill ?? FILL}" stroke="${o.stroke ?? BORDER}" stroke-width="${o.sw ?? 1}"></rect>`;
// an accent surface: rgba(accent,.10) fill + rgba(accent,.25) border
const hex2rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)).join(",");
const wash = (x, y, w, h, accent, o = {}) =>
  box(x, y, w, h, { fill: `rgba(${hex2rgb(accent)},.10)`, stroke: `rgba(${hex2rgb(accent)},.25)`, ...o });
const svg = (w, h, inner) =>
  `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${CYAN}"/><stop offset="1" stop-color="${PURPLE}"/></linearGradient></defs>${inner}</svg>`;
const rule = (y, x1 = 40, x2 = 1320) =>
  `<path d="M${x1} ${y} L${x2} ${y}" stroke="${BORDER}" stroke-width="1" fill="none"></path>`;

// ===========================================================================
// 1. the six rungs of depth
// ===========================================================================
const RUNGS = [
  { n: "01", name: "Answer", d: ["Replies about the one", "thing you have open."] },
  { n: "02", name: "Assemble", d: ["Gathers the pieces from", "files, threads and rows."] },
  { n: "03", name: "Watch", d: ["Notices change while", "nobody is looking."] },
  { n: "04", name: "Judge", d: ["Decides what deserves you,", "and what does not."] },
  { n: "05", name: "Act", d: ["Does the work, and waits", "for a person to confirm."] },
  { n: "06", name: "Compound", d: ["Remembers the outcome, so", "the next call starts ahead."] },
];
const COL_W = 194, COL_STEP = 212, BASELINE = 470;
const rungTop = (i) => BASELINE - (92 + i * 54);
const rungCols = RUNGS.map((r, i) => {
  const x = 40 + i * COL_STEP;
  const top = rungTop(i);
  const shallow = i < 2;
  return (shallow
    ? box(x, top, COL_W, BASELINE - top, { r: 12 })
    : wash(x, top, COL_W, BASELINE - top, CYAN, { r: 12 })) +
    eyebrow(x + 20, top + 30, r.n, shallow ? DIM : CYAN) +
    t(x + 20, top + 60, 20, shallow ? MUTED : TEXT, r.name, { weight: 600, ls: -0.2 }) +
    stack(x + 20, 506, 21, 13, MUTED, r.d);
}).join("");

const copilotEndX = 40 + COL_STEP + COL_W;
const brainStartX = 40 + 2 * COL_STEP;
const brainEndX = 40 + 5 * COL_STEP + COL_W;
const copBracketY = rungTop(1) - 16;
const brainBracketY = rungTop(5) - 18;

const ladderInner = [
  eyebrow(40, 40, "Six rungs. Each one needs the one below it."),
  t(40, 128, 22, TEXT, "Nearly every AI in an office suite lives on the first two rungs.", { weight: 600, ls: -0.3 }),
  t(40, 158, 22, TEXT, "It answers about the thing you have open, and it stops there.", { weight: 600, ls: -0.3 }),
  t(40, 200, 15, MUTED, "The work that changes a week sits above them."),
  rungCols,
  `<path d="M40 ${copBracketY + 12} L40 ${copBracketY} L${copilotEndX} ${copBracketY} L${copilotEndX} ${copBracketY + 12}" stroke="${MUTED}" stroke-width="1" fill="none"></path>`,
  eyebrow(40, copBracketY - 16, "A per app copilot stops here", MUTED),
  `<path d="M${brainStartX} ${brainBracketY + 12} L${brainStartX} ${brainBracketY} L${brainEndX} ${brainBracketY} L${brainEndX} ${brainBracketY + 12}" stroke="${CYAN}" stroke-width="1.25" fill="none"></path>`,
  eyebrow(brainStartX, brainBracketY - 16, "The brain carries on from here", CYAN),
  `<path d="M40 ${BASELINE} L${brainEndX} ${BASELINE}" stroke="${BORDER}" stroke-width="1.25" fill="none"></path>`,
  rule(574, 40, brainEndX),
  t(40, 604, 13, MUTED, "Depth is the argument, not the number of apps. A tool that only answers never reaches rung three."),
].join("");

const ladder = `${BASE}
<div class="bar"><span class="t">The six rungs of depth</span><span class="rt">answer to compound</span></div>
<div class="body">${svg(1320, 626, ladderInner)}</div>`;

// ===========================================================================
// 2. the adoption path
// ===========================================================================
const STAGES = [
  {
    when: "Week 1 to 2", title: "The diagnostic", accent: CYAN,
    d: ["We read how the work actually", "moves in the systems you", "already run. Nothing is written."],
    head: "Connected by the end",
    conn: ["Mail, read only", "Tickets, read only", "Calendar, read only"],
    note: "No writes. No confirms.",
  },
  {
    when: "Week 3 to 8", title: "One workflow, one team", accent: BLUE,
    d: ["A single workflow runs live for", "one team, end to end. Every", "write waits for a person."],
    head: "Connected by the end",
    conn: ["Mail, tickets, calendar", "Documents and files", "The team's own workspace"],
    note: "Writes on confirm only.",
  },
  {
    when: "Quarter 2", title: "The department", accent: PURPLE,
    d: ["The same brain covers the", "neighbouring teams and the", "handoffs between them."],
    head: "Added in this stage",
    conn: ["CRM and accounts", "Finance and invoicing", "The shared drive"],
    note: "Confirm gates stay in place.",
  },
  {
    when: "From there", title: "The company standard", accent: EMERALD,
    d: ["New teams join a brain that", "already knows the accounts,", "the threads and the decisions."],
    head: "Connected",
    conn: ["Every system you gave it", "One memory across them", "The same 15 verbs throughout"],
    note: "Depth grows. Surface does not.",
  },
];
const STAGE_W = 292, STAGE_STEP = 320, AXIS_Y = 96;
const stageCols = STAGES.map((s, i) => {
  const x = 40 + i * STAGE_STEP;
  const cx = x + 14;
  return eyebrow(x, 72, s.when, s.accent) +
    `<circle cx="${cx}" cy="${AXIS_Y}" r="5" fill="${s.accent}"></circle>` +
    `<path d="M${cx} ${AXIS_Y + 6} L${cx} 126" stroke="${s.accent}" stroke-width="1" fill="none"></path>` +
    t(x, 154, 20, TEXT, s.title, { weight: 600, ls: -0.2 }) +
    stack(x, 188, 21, 13.5, MUTED, s.d) +
    box(x, 262, STAGE_W, 156) +
    eyebrow(x + 20, 292, s.head, s.accent) +
    stack(x + 20, 322, 25, 14, TEXT, s.conn) +
    t(x + 20, 398, 12.5, DIM, s.note);
}).join("");

const adoptInner = [
  eyebrow(40, 40, "How it goes in. No rip and replace, no big bang."),
  `<path d="M40 ${AXIS_Y} L1292 ${AXIS_Y}" stroke="${BORDER}" stroke-width="1" fill="none"></path>`,
  stageCols,
  rule(452, 40, 1292),
  t(40, 482, 13, MUTED, "One workflow is live before the second one is scoped. The diagnostic is where you find out if that is true."),
].join("");

const adoption = `${BASE}
<div class="bar"><span class="t">The adoption path</span><span class="rt">diagnostic to standard</span></div>
<div class="body">${svg(1320, 504, adoptInner)}</div>`;

// ===========================================================================
// 3. the verb map  (public numbers: 15, 287, 12, 190, 71)
// ===========================================================================
const VERBS = ["find", "read", "research", "recall", "remember", "ask", "create",
  "edit", "improve", "delete", "send", "share", "schedule", "assign", "judge"];
const VERB_Y0 = 82, VERB_STEP = 30;

const verbRows = VERBS.map((v, i) => {
  const y = VERB_Y0 + i * VERB_STEP;
  return `<circle cx="46" cy="${y - 5}" r="4" fill="${CYAN}"></circle>` +
    t(66, y, 16, TEXT, v, { weight: 500 }) +
    `<path d="M172 ${y - 5} C 268 ${y - 5}, 330 296, 428 296" stroke="${BORDER}" stroke-width="1" fill="none"></path>`;
}).join("");

// 287 squares, one per action; the first 71 are the confirm-gated ones.
const GRID_X = 520, GRID_Y = 262, CELL = 14, GAP = 5, COLS = 41;   // spans 774px
let cells = "";
for (let i = 0; i < 287; i++) {
  const cx = GRID_X + (i % COLS) * (CELL + GAP);
  const cy = GRID_Y + Math.floor(i / COLS) * (CELL + GAP);
  cells += i < 71
    ? `<rect x="${cx}" y="${cy}" width="${CELL}" height="${CELL}" rx="3" fill="${CYAN}"></rect>`
    : `<rect x="${cx}" y="${cy}" width="${CELL}" height="${CELL}" rx="3" fill="rgba(255,255,255,.14)"></rect>`;
}
const GRID_BOTTOM = GRID_Y + 7 * (CELL + GAP) - GAP;

const COUNTS = [
  { x: 520, n: "287", l: ["Concrete", "actions"], grad: true },
  { x: 778, n: "12", l: ["Application", "surfaces"] },
  { x: 1036, n: "190", l: ["Business", "objects"] },
];
const countCells = COUNTS.map((c, i) => (
  (i ? `<path d="M${c.x} 61 L${c.x} 185" stroke="${BORDER}" stroke-width="1" fill="none"></path>` : "") +
  t(c.x + 26, 128, 48, c.grad ? "url(#g)" : TEXT, c.n, { weight: 700, ls: -1 }) +
  stack(c.x + 26, 152, 17, 11, DIM, c.l.map((s) => s.toUpperCase()), { ls: 0.8, weight: 700 })
)).join("");

const verbsInner = [
  eyebrow(40, 40, "15 verbs, the whole vocabulary"),
  verbRows,
  t(40, 560, 13, MUTED, "Fifteen verbs is the whole vocabulary."),
  t(40, 581, 13, MUTED, "It does not grow with the suite."),
  eyebrow(300, 286, "Resolve to"),
  arrowR(428, 296, 500, 296, CYAN, 1.5),
  box(520, 60, 774, 126),
  countCells,
  eyebrow(520, 232, "Each square is one action the verbs can address"),
  cells,
  `<rect x="520" y="${GRID_BOTTOM + 34}" width="14" height="14" rx="3" fill="${CYAN}"></rect>`,
  t(546, GRID_BOTTOM + 46, 13.5, TEXT, "71 are confirm gated. A person approves before they run.", { weight: 500 }),
  `<rect x="520" y="${GRID_BOTTOM + 64}" width="14" height="14" rx="3" fill="rgba(255,255,255,.14)"></rect>`,
  t(546, GRID_BOTTOM + 76, 13.5, MUTED, "The rest run on the model's judgement, then get checked."),
  t(520, GRID_BOTTOM + 118, 13.5, MUTED, "A model can never approve its own action. Approval counts only when it came"),
  t(520, GRID_BOTTOM + 139, 13.5, MUTED, "from a door where a person clicked."),
  rule(602, 40, 1294),
  t(40, 632, 13, MUTED, "One small vocabulary reaches the whole suite: 287 actions across 12 application surfaces and 190 business objects."),
].join("");

const verbs = `${BASE}
<div class="bar"><span class="t">15 verbs, 287 actions, 12 application surfaces</span><span class="rt">the verb map</span></div>
<div class="body">${svg(1320, 658, verbsInner)}</div>`;

// ===========================================================================
// 4. the two honesty checks  (no numbers on this plate)
// ===========================================================================
const P1 = 40, P2 = 700, PW = 580;
function panel(x, head, q, desc, rows) {
  return box(x, 150, PW, 316) +
    eyebrow(x + 28, 186, head, CYAN) +
    t(x + 28, 226, 20, TEXT, q, { weight: 600, ls: -0.2 }) +
    stack(x + 28, 256, 21, 13.5, MUTED, desc) +
    rule(322, x + 28, x + PW - 28) +
    rows.map((r, i) => {
      const y = 356 + i * 40;
      return `<circle cx="${x + 34}" cy="${y - 5}" r="5" fill="${r.c}"></circle>` +
        eyebrow(x + 52, y, r.n, r.c) +
        t(x + 190, y, 13.5, MUTED, r.d);
    }).join("");
}

const honestyInner = [
  eyebrow(40, 38, "A tool has reported success and a sentence about it is drafted"),
  box(40, 58, 1240, 52, { r: 12 }),
  t(64, 90, 15, TEXT, "“I have updated the delivery date and told the client.”", { weight: 500 }),
  eyebrow(1256, 90, "Not shown yet", DIM, { anchor: "end" }),
  arrowD(330, 112, 150, MUTED),
  panel(P1, "Check 1 · the record", "Does the record exist?", [
    "One re-read, fenced to your own organisation, of the",
    "record the tool says it wrote. Fast enough to never be felt.",
  ], [
    { c: EMERALD, n: "Found", d: "the claim stands." },
    { c: RED, n: "Absent", d: "the call is marked failed, not done." },
    { c: AMBER, n: "Uncertain", d: "abstains. The claim stands." },
  ]),
  panel(P2, "Check 2 · the sentence", "Does the data support it?", [
    "The drafted sentence is compared to the raw data",
    "the tools returned, not to what was asked for.",
  ], [
    { c: EMERALD, n: "Supported", d: "it reaches you as written." },
    { c: RED, n: "Refuted", d: "rewritten from the data, or stated plainly." },
    { c: AMBER, n: "Uncertain", d: "abstains. It reaches you as written." },
  ]),
  arrowR(628, 300, 700, 300, MUTED),
  eyebrow(664, 286, "Then", DIM, { anchor: "middle" }),
  t(40, 508, 14, TEXT, "The case this catches: a write that returned success and changed nothing, narrated as “done”.", { weight: 500 }),
  wash(40, 528, 1240, 62, PURPLE, { r: 12 }),
  eyebrow(64, 565, "Neither check blocks on its own uncertainty. They only downgrade a claim they can point at data to refute.", PURPLE),
].join("");

const honesty = `${BASE}
<div class="bar"><span class="t">Two checks before a claim reaches you</span><span class="rt">the honesty reflexes</span></div>
<div class="body">${svg(1320, 600, honestyInner)}</div>`;

// ===========================================================================
const MOCKS = {
  "brain-ladder": ladder,
  "brain-adoption": adoption,
  "brain-verbs": verbs,
  "brain-honesty": honesty,
};

// house law check: nothing banned may render inside a plate
const BANNED = ["audit trail", "auditable", "every action logged", "every claim auditable",
  "every touch logged", "the log shows", "contact us", "—", "measured", "backend",
  "workelate-backend", "300", " ms", "millisecond", "2026-"];
// numbers allowed on a plate: the public set, plus rung/stage ordinals and timeline weeks
const ALLOWED_NUMBERS = new Set(["15", "287", "12", "190", "71", "40", "5",
  "01", "02", "03", "04", "05", "06", "1", "2", "3", "8"]);
for (const [name, html] of Object.entries(MOCKS)) {
  const text = html.split("</style>")[1].replace(/<[^>]+>/g, " ").replace(/#[0-9a-f]{6}/gi, " ");
  for (const bad of BANNED) {
    if (text.toLowerCase().includes(bad.toLowerCase())) {
      throw new Error(`banned string "${bad}" in ${name}`);
    }
  }
  for (const n of text.match(/\d+/g) || []) {
    if (!ALLOWED_NUMBERS.has(n)) throw new Error(`number ${n} in ${name} is not in the public set`);
  }
}

const b = await chromium.launch();
for (const [name, html] of Object.entries(MOCKS)) {
  const style = html.split("</style>")[0] + "</style>";
  const markup = html.split("</style>")[1];
  const tmp = path.join(import.meta.dirname, `_${name}.html`);
  writeFileSync(tmp, `<!doctype html><html><head><meta charset="utf-8">${style}</head><body>${markup}</body></html>`);
  const p = await b.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 2 });
  await p.goto("file://" + tmp);
  await p.evaluate(() => document.fonts.ready);
  const h = await p.evaluate(() => Math.ceil(document.body.getBoundingClientRect().height));
  const file = path.join(OUT, `${name}.png`);
  await p.screenshot({ path: file, clip: { x: 0, y: 0, width: 1400, height: h } });
  await p.close();
  unlinkSync(tmp);
  console.log(`wrote site/img/${name}.png  css ${1400}x${h}  px ${2800}x${h * 2}  ${statSync(file).size} bytes`);
}
await b.close();
