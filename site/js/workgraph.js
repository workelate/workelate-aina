// ---------------------------------------------------------------------------
// workgraph.js, the living work graph for the Chief (the Brain) hero.
//
// One <canvas>, zero dependencies, plain ES module. Everything is drawn on the
// canvas: nodes, edges, particles, the two chips. No DOM writes per frame, no
// layout reads per frame, no shadowBlur anywhere (glow is a cached sprite and
// a second wide stroke). The layout is a light force simulation run ONCE at
// init, seeded, so it is identical across reloads; it re-runs on resize after
// a debounce.
//
// Mount:   import { mountWorkGraph } from "/js/workgraph.js";
//          mountWorkGraph(canvas, { poster:false });
// Or drop a <canvas data-workgraph> into the page and import the module: it
// mounts every such canvas on load. See data/workgraph-embed.md.
//
// Palette is the workelate.com dark system and nothing else.
// ---------------------------------------------------------------------------

const C = {
  ground: "#07070c", raised: "#0c0c14", text: "#ffffff", muted: "#9ca3b8", dim: "#6b7280",
  cyan: "#00d4ff", purple: "#8b5cf6", blue: "#2563eb", emerald: "#34d399", amber: "#fbbf24",
};
const RGB = { cyan: "0,212,255", purple: "139,92,246", blue: "37,99,235", emerald: "52,211,153", amber: "251,191,36", white: "255,255,255" };
const FONT_URL = "/fonts/worksans-var-latin.woff2";
const FONT = '"Work Sans", "Helvetica Neue", Arial, sans-serif';

// --- the graph ---------------------------------------------------------------
// Every label is one of the product's own object types, in buyer language, and
// every edge is a relationship the product records or derives (dashed = derived).
// The table that maps each label and edge to its source is internal and lives in
// data/workgraph-embed.md, not here: this file ships to browsers.
// tier 1 = the anchors the Brain reads from; tier 2 hangs off them. `phone`
// marks the nine that survive at 390px. `item` is the ranked briefing item the
// node's signal raises.
const NODES = [
  { id: "brain",     label: "Brain",       icon: "brain",     tier: 0, phone: true,  reason: "The Brain, one memory across every system" },
  { id: "client",    label: "Client",      icon: "building",  tier: 1, phone: true,  hue: "cyan",   reason: "Client, the project belongs to it, the doc names it",       item: 4 },
  { id: "project",   label: "Project",     icon: "briefcase", tier: 1, phone: true,  hue: "purple", reason: "Project, belongs to the Client, the meeting is about it",   item: 4 },
  { id: "user",      label: "Person",      icon: "person",    tier: 1, phone: true,  hue: "cyan",   reason: "Person, assigned the task, invited to the meeting",           item: 2 },
  { id: "workspace", label: "Workspace",   icon: "folder",    tier: 1, phone: false, hue: "purple", reason: "Workspace, contains the doc, the sheet and the canvas",      item: 4 },
  { id: "mail",      label: "Mail thread", icon: "chat",      tier: 1, phone: true,  hue: "cyan",   reason: "Mail thread, created the task, scheduled the meeting",       item: 3 },
  { id: "task",      label: "Task",        icon: "ticket",    tier: 1, phone: true,  hue: "purple", reason: "Task, created from the mail thread, assigned to a person",   item: 2 },
  { id: "event",     label: "Meeting",     icon: "calendar",  tier: 1, phone: true,  hue: "cyan",   reason: "Meeting, about the task and the project",                    item: 2 },
  { id: "vendor",    label: "Vendor",      icon: "box",       tier: 2, phone: false, hue: "purple", reason: "Vendor, resolved from the thread's sender domain",           item: 4 },
  { id: "board",     label: "Board",       icon: "board",     tier: 2, phone: false, hue: "cyan",   reason: "Board, created from the doc, the task sits on it",           item: 2 },
  { id: "doc",       label: "Doc",         icon: "doc",       tier: 2, phone: true,  hue: "purple", reason: "Doc, in the workspace, the task and the deck came from it",  item: 1 },
  { id: "message",   label: "Chat",        icon: "chat",      tier: 2, phone: false, hue: "cyan",   reason: "Chat, about the task, scheduled the meeting",                item: 3 },
  { id: "form",      label: "Form",        icon: "check",     tier: 2, phone: false, hue: "purple", reason: "Form, attached to the task, exported to the sheet",          item: 4 },
  { id: "sheet",     label: "Sheet",       icon: "grid",      tier: 2, phone: false, hue: "cyan",   reason: "Sheet, in the workspace, fed by the form",                   item: 4 },
  { id: "deck",      label: "Deck",        icon: "deck",      tier: 2, phone: false, hue: "purple", reason: "Deck, derived from the doc, about the board",                item: 4 },
  { id: "whiteboard",label: "Canvas",      icon: "diamond",   tier: 2, phone: false, hue: "cyan",   reason: "Canvas, in the workspace, the task was made on it",          item: 2 },
  { id: "commitment",label: "Commitment",  icon: "flag",      tier: 2, phone: true,  hue: "purple", reason: "Commitment, extracted from the mail thread",                 item: 0 },
  { id: "decision",  label: "Decision",    icon: "warning",   tier: 2, phone: false, hue: "cyan",   reason: "Decision, captured from the chat and the canvas",            item: 0 },
];
// [from, to, dashed]. from --relation--> to, as the writer emits it.
const EDGES = [
  // the Brain's reads, not stored edges
  ["client", "brain"], ["project", "brain"], ["user", "brain"], ["workspace", "brain"],
  ["mail", "brain"], ["task", "brain"], ["event", "brain"],
  ["mail", "task"],
  ["doc", "task"],
  ["message", "task"],
  ["message", "event"],
  ["mail", "event"],
  ["form", "task"],
  ["doc", "board"],
  ["form", "sheet"],
  ["event", "task"],
  ["event", "project"],
  ["whiteboard", "task"],
  ["whiteboard", "project"],
  ["project", "client"],
  ["mail", "project"],
  ["deck", "board"],
  ["task", "board"],
  ["workspace", "doc"],
  ["workspace", "sheet"],
  ["workspace", "whiteboard"],
  ["doc", "deck"],
  ["task", "user"],
  ["event", "user"],
  // derived by the product: dashed
  ["doc", "client", true],
  ["mail", "vendor", true],
  ["workspace", "client", true],
  ["commitment", "mail", true],
  ["decision", "message", true],
  ["decision", "whiteboard", true],
];
// Ranked briefing items, the shape the product produces: a title, a "Because"
// line, a lane and a blocker.
const ITEMS = [
  { lane: "Needs you", dot: "amber",   title: "Client sign-off overdue",
    because: "Because the approval was due six days ago and the thread has been quiet since Tuesday.",
    blocker: "Blocked on client, 6 days past due" },
  { lane: "Needs you", dot: "amber",   title: "Requirements doc, unresolved comments",
    because: "Because four comments are still open on the scope section, two of them from the client.",
    blocker: "Blocked on review, blocks Monday's start" },
  { lane: "Slipping",  dot: "purple",  title: "Metrics review, linked task still open",
    because: "Because the board sync is Thursday and the task feeding the numbers has not been picked up.",
    blocker: "Blocked on owner, sync in 2 days" },
  { lane: "Waiting on you", dot: "cyan", title: "Reply drafted, not sent",
    because: "Because the thread asks whether sign-off is still expected this week.",
    blocker: "Nothing is sent until a person approves it" },
  { lane: "Handled",   dot: "emerald", title: "9 changes, not worth an interruption",
    because: "Because none of them moved a date, an owner or a client.",
    blocker: "No action" },
];

// --- tiny deterministic PRNG so the layout is the same on every load ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// --- icons: 12 unit box, stroked white, drawn at the node centre ---------------
const ICONS = {
  brain(g) { // a small constellation: centre dot and six around it, joined
    const pts = [];
    for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + i * Math.PI / 3; pts.push([Math.cos(a) * 7, Math.sin(a) * 7]); }
    g.beginPath();
    for (const p of pts) { g.moveTo(0, 0); g.lineTo(p[0], p[1]); }
    for (let i = 0; i < 6; i++) { const p = pts[i], q = pts[(i + 1) % 6]; g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); }
    g.stroke();
    g.beginPath(); g.arc(0, 0, 1.8, 0, 7); g.fill();
    for (const p of pts) { g.beginPath(); g.arc(p[0], p[1], 1.3, 0, 7); g.fill(); }
  },
  doc(g) { g.beginPath(); g.moveTo(-4, -6); g.lineTo(2, -6); g.lineTo(5, -3); g.lineTo(5, 6); g.lineTo(-4, 6); g.closePath(); g.moveTo(2, -6); g.lineTo(2, -3); g.lineTo(5, -3); g.moveTo(-2, 0); g.lineTo(3, 0); g.moveTo(-2, 3); g.lineTo(3, 3); g.stroke(); },
  chat(g) { g.beginPath(); g.moveTo(-5, -5); g.lineTo(5, -5); g.lineTo(5, 2); g.lineTo(-1, 2); g.lineTo(-4, 5); g.lineTo(-4, 2); g.lineTo(-5, 2); g.closePath(); g.stroke(); },
  person(g) { g.beginPath(); g.arc(0, -3, 2.6, 0, 7); g.moveTo(-5.5, 6.5); g.arc(0, 6.5, 5.5, Math.PI, 0); g.stroke(); },
  calendar(g) { g.beginPath(); g.rect(-5.5, -4, 11, 10); g.moveTo(-5.5, -1); g.lineTo(5.5, -1); g.moveTo(-2.5, -6.5); g.lineTo(-2.5, -3); g.moveTo(2.5, -6.5); g.lineTo(2.5, -3); g.stroke(); g.beginPath(); g.arc(1.5, 2.5, 1.2, 0, 7); g.fill(); },
  ticket(g) { g.beginPath(); g.moveTo(-6, -4); g.lineTo(6, -4); g.lineTo(6, -1.5); g.arc(6, 0, 1.5, -Math.PI / 2, Math.PI / 2, true); g.lineTo(6, 4); g.lineTo(-6, 4); g.lineTo(-6, 1.5); g.arc(-6, 0, 1.5, Math.PI / 2, -Math.PI / 2, true); g.closePath(); g.moveTo(-1, -4); g.lineTo(-1, 4); g.stroke(); },
  briefcase(g) { g.beginPath(); g.rect(-6, -3, 12, 8.5); g.moveTo(-2.5, -3); g.lineTo(-2.5, -5.5); g.lineTo(2.5, -5.5); g.lineTo(2.5, -3); g.moveTo(-6, 1); g.lineTo(6, 1); g.stroke(); },
  warning(g) { g.beginPath(); g.moveTo(0, -6); g.lineTo(6.5, 5.5); g.lineTo(-6.5, 5.5); g.closePath(); g.moveTo(0, -1.5); g.lineTo(0, 2); g.stroke(); g.beginPath(); g.arc(0, 3.8, .9, 0, 7); g.fill(); },
  building(g) { g.beginPath(); g.rect(-5, -6, 10, 12); g.moveTo(-2.5, -3); g.lineTo(-.5, -3); g.moveTo(1.5, -3); g.lineTo(3.5, -3); g.moveTo(-2.5, 0); g.lineTo(-.5, 0); g.moveTo(1.5, 0); g.lineTo(3.5, 0); g.moveTo(-1.5, 6); g.lineTo(-1.5, 3); g.lineTo(1.5, 3); g.lineTo(1.5, 6); g.stroke(); },
  folder(g) { g.beginPath(); g.moveTo(-6, -4.5); g.lineTo(-1.5, -4.5); g.lineTo(0, -2.5); g.lineTo(6, -2.5); g.lineTo(6, 5); g.lineTo(-6, 5); g.closePath(); g.stroke(); },
  receipt(g) { g.beginPath(); g.moveTo(-4.5, -6); g.lineTo(4.5, -6); g.lineTo(4.5, 6); g.lineTo(3, 4.5); g.lineTo(1.5, 6); g.lineTo(0, 4.5); g.lineTo(-1.5, 6); g.lineTo(-3, 4.5); g.lineTo(-4.5, 6); g.closePath(); g.moveTo(-2, -2.5); g.lineTo(2, -2.5); g.moveTo(-2, .5); g.lineTo(2, .5); g.stroke(); },
  box(g) { g.beginPath(); g.moveTo(0, -6); g.lineTo(6, -3); g.lineTo(6, 3.5); g.lineTo(0, 6.5); g.lineTo(-6, 3.5); g.lineTo(-6, -3); g.closePath(); g.moveTo(-6, -3); g.lineTo(0, 0); g.lineTo(6, -3); g.moveTo(0, 0); g.lineTo(0, 6.5); g.stroke(); },
  diamond(g) { g.beginPath(); g.moveTo(0, -6.5); g.lineTo(6.5, 0); g.lineTo(0, 6.5); g.lineTo(-6.5, 0); g.closePath(); g.stroke(); g.beginPath(); g.arc(0, 0, 1.2, 0, 7); g.fill(); },
  deck(g) { g.beginPath(); g.rect(-6, -5, 12, 8); g.moveTo(-3, 6); g.lineTo(3, 6); g.moveTo(0, 3); g.lineTo(0, 6); g.moveTo(-3, -2); g.lineTo(3, -2); g.moveTo(-3, .5); g.lineTo(1, .5); g.stroke(); },
  grid(g) { g.beginPath(); g.rect(-6, -5, 12, 10); g.moveTo(-6, -1.5); g.lineTo(6, -1.5); g.moveTo(-6, 1.5); g.lineTo(6, 1.5); g.moveTo(-2, -5); g.lineTo(-2, 5); g.moveTo(2, -5); g.lineTo(2, 5); g.stroke(); },
  check(g) { g.beginPath(); g.arc(0, 0, 6.2, 0, 7); g.moveTo(-3, 0); g.lineTo(-.8, 2.4); g.lineTo(3.4, -2.4); g.stroke(); },
  flag(g) { g.beginPath(); g.moveTo(-4.5, 6.5); g.lineTo(-4.5, -6); g.lineTo(5, -6); g.lineTo(2.5, -2.5); g.lineTo(5, 1); g.lineTo(-4.5, 1); g.stroke(); },
  board(g) { g.beginPath(); g.rect(-6, -6, 12, 8); g.moveTo(0, 2); g.lineTo(0, 4); g.moveTo(-3, 6.5); g.lineTo(0, 4); g.lineTo(3, 6.5); g.moveTo(-3.5, 0); g.lineTo(-1.5, -2.5); g.lineTo(.5, -1); g.lineTo(3.5, -4); g.stroke(); },
  refresh(g) { g.beginPath(); g.arc(0, 0, 5.5, -Math.PI * .75, Math.PI * .55); g.stroke(); g.beginPath(); g.moveTo(-5.4, -5.4); g.lineTo(-4.2, -1.5); g.lineTo(-.6, -3.2); g.closePath(); g.fill(); },
};

// --- glow sprite cache: one radial gradient bitmap per colour, scaled on draw ---
function makeSprite(rgb, size, inner = 1) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d");
  const r = size / 2;
  const grad = g.createRadialGradient(r, r, 0, r, r, r);
  grad.addColorStop(0, `rgba(${rgb},${inner})`);
  grad.addColorStop(.25, `rgba(${rgb},${inner * .45})`);
  grad.addColorStop(.6, `rgba(${rgb},${inner * .1})`);
  grad.addColorStop(1, `rgba(${rgb},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

// Size model: every dimension follows the box's SHORT side, so a wide-and-low
// box and a narrow-and-tall box both get nodes, labels and rings that fit.
//   sc        1 at 600px short side, floors at .6 (a 450x400 box gives 14px nodes)
//   compact   the nine-node set (narrow, or small in both axes)
//   cardMode  side: card beside the Brain | band: card in a top band the layout
//             keeps clear | chip: one line above the Brain | none
function sizing(W, H) {
  const m = Math.min(W, H);
  const sc = Math.max(.6, Math.min(1, m / 600));
  const compact = W < 900 || m < 420;
  const cardMode = !compact ? "side" : (H >= 480 && W >= 360) ? "band" : H >= 220 ? "chip" : "none";
  return {
    sc, m, compact, cardMode,
    nodeR: Math.round(21 * sc), brainR: Math.round(40 * sc),
    fs: Math.max(11, +(12.5 * sc).toFixed(1)), brainFs: Math.max(11.5, +(14 * sc).toFixed(1)),
    minDist: Math.round(118 * sc),
    padX: Math.max(42, Math.round(64 * sc)), padTop: Math.round(21 * sc) + 12, padBot: Math.round(21 * sc) + 8 + Math.max(11, 12.5 * sc) + 10,
  };
}
// card geometry for a box: the card is narrower than the box, and the gap beside
// the Brain tightens on mid widths so it still fits. Shared by layout and renderer.
function cardGeom(W) {
  return { w: W < 640 ? Math.min(W - 16, 300) : 340, gap: W < 1100 ? 30 : 46, h: 118 };
}

// --- layout ------------------------------------------------------------------
// Anchor + collision, not a free spring system: a free one collapses the ring
// into a cluster on one side (measured). Every node owns a seeded slot on its
// tier's ring; tier 2 is slotted by the mean angle of its parents; relaxation
// only resolves overlaps and pulls each node back toward its slot.
function layout(nodes, edges, W, H, seed, sz) {
  const rnd = mulberry32(seed);
  const { compact, cardMode, padX, padTop, padBot, minDist } = sz;
  const cg = cardGeom(W);
  const band = cardMode === "band" ? 10 + cg.h + 12 : 0;   // top band the card owns
  const cx = W / 2, cy = band + (H - band) / 2;
  const m = Math.min(W, H - band);
  const availX = W / 2 - padX, availY = (H - band - padTop - padBot) / 2;
  let rx1, ry1, rx2, ry2;
  if (!compact) {
    rx2 = Math.min(W * .40, m * .70, availX); ry2 = Math.min(m * .43, availY);
    rx1 = Math.min(W * .19, m * .34, rx2 * .55); ry1 = Math.min(m * .25, ry2 * .6);
  } else {
    // fill the box in BOTH axes: two rings around the Brain, never one band
    rx2 = availX; ry2 = availY;
    rx1 = rx2 * .58; ry1 = ry2 * .58;
  }
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const t1 = nodes.filter(n => n.tier === 1), t2 = nodes.filter(n => n.tier === 2);
  byId.brain.x = cx; byId.brain.y = cy; byId.brain.ax = cx; byId.brain.ay = cy;
  const rot = rnd() * 6.283;
  t1.forEach((n, i) => { n.ang = rot + (i / t1.length) * 6.283 + (rnd() - .5) * .25; });
  // tier 2: preferred angle = circular mean of its neighbours (two passes so a
  // node whose parents are all tier 2 still follows them), then a 1D angular
  // relaxation that keeps a minimum gap without leaving the neighbourhood.
  for (const n of t2) n.pref = null;
  for (let pass = 0; pass < 3; pass++) {
    for (const n of t2) {
      let sx = 0, sy = 0;
      for (const [a, b] of edges) {
        const o = a === n.id ? byId[b] : b === n.id ? byId[a] : null;
        if (!o || o.tier === 0) continue;
        const ang = o.tier === 1 ? o.ang : o.pref;
        if (ang == null) continue;
        const w = o.tier === 1 ? 1 : .6;
        sx += Math.cos(ang) * w; sy += Math.sin(ang) * w;
      }
      n.pref = (sx || sy) ? Math.atan2(sy, sx) : (n.pref ?? rnd() * 6.283);
    }
  }
  t2.forEach(n => { n.ang = n.pref + (rnd() - .5) * .2; });
  if (t2.length > 1) {
    const gap = 6.283 / t2.length * .92;
    for (let it = 0; it < 80; it++) {
      t2.sort((a, b) => a.ang - b.ang);
      for (let i = 0; i < t2.length; i++) {
        const a = t2[i], b = t2[(i + 1) % t2.length];
        let d = b.ang - a.ang; if (i === t2.length - 1) d += 6.283;
        if (d < gap) { const push = (gap - d) / 2; a.ang -= push; b.ang += push; }
      }
    }
  }
  for (const n of nodes) {
    if (n.tier === 0) continue;
    const rx = n.tier === 1 ? rx1 : rx2, ry = n.tier === 1 ? ry1 : ry2;
    n.ax = cx + Math.cos(n.ang) * rx; n.ay = cy + Math.sin(n.ang) * ry;
    n.x = n.ax; n.y = n.ay;
  }
  for (let it = 0; it < 160; it++) {
    for (const n of nodes) { n.fx = 0; n.fy = 0; }
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const dx = b.x - a.x, dy = (b.y - a.y) * .8;
      const d = Math.hypot(dx, dy) || .01;
      const want = (a.tier === 0 || b.tier === 0) ? minDist * 1.5 : minDist;
      if (d < want) {
        const f = (want - d) / d * .45;
        a.fx -= dx * f; a.fy -= dy * f; b.fx += dx * f; b.fy += dy * f;
      }
    }
    for (const n of nodes) {
      if (n.tier === 0) continue;
      n.fx += (n.ax - n.x) * .12; n.fy += (n.ay - n.y) * .12;
      if (cardMode === "side" || cardMode === "band") { // keep the card's slot clear
        const bandMode = cardMode === "band", BR = sz.brainR;
        const L = bandMode ? cx - cg.w / 2 - 44 : cx + BR + cg.gap - 48;
        const R = bandMode ? cx + cg.w / 2 + 44 : cx + BR + cg.gap + cg.w + 48;
        const T = bandMode ? -1e4 : cy - 59 - 78, B = bandMode ? band + 34 : cy + 59 + 48;
        if (n.x > L && n.x < R && n.y > T && n.y < B) {
          const dl = L >= padX ? n.x - L : 1e9, dr = R <= W - padX ? R - n.x : 1e9;
          const db = B - n.y, dt = bandMode ? 1e9 : n.y - T, mn = Math.min(dl, dr, dt, db);
          if (mn === dt) n.fy -= dt * .5; else if (mn === db) n.fy += db * .5; else if (mn === dl) n.fx -= dl * .5; else n.fx += dr * .5;
        }
      }
      n.x += n.fx; n.y += n.fy;
      n.x = Math.max(padX, Math.min(W - padX, n.x));
      n.y = Math.max(padTop, Math.min(H - padBot, n.y));
    }
  }
  for (const n of nodes) { n.x = Math.round(n.x); n.y = Math.round(n.y); }
}

// Label collision pass, every size. Labels sit under their node; two labels or a
// label and a disc must never overlap. Push the lower-priority node (tier 2
// before tier 1, later before earlier; the Brain never moves), then hide what
// still collides. Returns the overlap count after the pass (0 by construction)
// and the number of labels hidden.
function settleLabels(ctx, nodes, W, H, sz) {
  ctx.font = `500 ${sz.fs}px ${FONT}`;
  for (const n of nodes) { n.lw = ctx.measureText(n.label).width; n.hideLabel = false; }
  ctx.font = `600 ${sz.brainFs}px ${FONT}`;
  for (const n of nodes) if (n.tier === 0) n.lw = ctx.measureText(n.label).width;
  const R = n => (n.tier === 0 ? sz.brainR : sz.nodeR);
  const rect = n => { const off = n.tier === 0 ? 8 + 16 * sz.sc : 8; return [n.x - n.lw / 2 - 3, n.y + R(n) + off - 2, n.x + n.lw / 2 + 3, n.y + R(n) + off + sz.fs + 2]; };
  const disc = n => { const r = R(n) + 3; return [n.x - r, n.y - r, n.x + r, n.y + r]; };
  const ov = (a, b) => a[0] < b[2] && b[0] < a[2] && a[1] < b[3] && b[1] < a[3];
  const lower = (A, B) => (A.tier === 0 ? B : B.tier === 0 ? A : A.tier > B.tier ? A : B.tier > A.tier ? B : B);
  const clash = (A, B) => ov(rect(A), rect(B)) || ov(rect(A), disc(B)) || ov(disc(A), rect(B));
  for (let it = 0; it < 60; it++) {
    let moved = false;
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const A = nodes[i], B = nodes[j];
      if (!clash(A, B)) continue;
      const mv = lower(A, B), ot = mv === A ? B : A;
      let dx = mv.x - ot.x, dy = mv.y - ot.y; const d = Math.hypot(dx, dy) || 1;
      mv.x = Math.round(Math.max(sz.padX, Math.min(W - sz.padX, mv.x + dx / d * 3)));
      mv.y = Math.round(Math.max(sz.padTop, Math.min(H - sz.padBot, mv.y + dy / d * 3 + (dy >= 0 ? 1 : -1))));
      moved = true;
    }
    if (!moved) break;
  }
  let hidden = 0;
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
    const A = nodes[i], B = nodes[j];
    if (A.hideLabel && B.hideLabel) continue;
    if (clash(A, B)) { const mv = lower(A, B); if (!mv.hideLabel) { mv.hideLabel = true; hidden++; } }
  }
  let overlaps = 0;
  const vis = nodes.filter(n => !n.hideLabel);
  for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) if (ov(rect(vis[i]), rect(vis[j]))) overlaps++;
  return { overlaps, hidden };
}

// shortest path (in hops) from every node to the Brain, for the signal pulses
function routes(nodes, edges) {
  const adj = {};
  for (const n of nodes) adj[n.id] = [];
  edges.forEach((e, i) => { adj[e[0]].push([e[1], i]); adj[e[1]].push([e[0], i]); });
  const prev = { brain: null }, q = ["brain"];
  while (q.length) {
    const u = q.shift();
    for (const [v, ei] of adj[u]) if (!(v in prev)) { prev[v] = [u, ei]; q.push(v); }
  }
  const out = {};
  for (const n of nodes) {
    const path = []; let u = n.id;
    while (prev[u]) { path.push(prev[u][1]); u = prev[u][0]; }
    out[n.id] = path; // edge indices, leaf to brain
  }
  return { paths: out, prev };
}

// --- the instance ------------------------------------------------------------
export function mountWorkGraph(canvas, opts = {}) {
  const ctx = canvas.getContext("2d", { alpha: false });
  const reduce = !opts.poster && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const debug = opts.debug || canvas.dataset.debug === "1";
  const S = { W: 0, H: 0, dpr: 1, nodes: [], edges: [], particles: [], t: opts.time || 7.3,
    hover: null, pulse: null, chip: null, burst: 0, nextPulse: 2.2, paths: {}, running: false, visible: true, seed: 7 };

  const sprites = {
    cyan: makeSprite(RGB.cyan, 128, .9), purple: makeSprite(RGB.purple, 128, .9),
    white: makeSprite(RGB.white, 64, 1), amber: makeSprite(RGB.amber, 64, .9),
  };
  let bgGrad = null, brainGrad = null;

  function build() {
    const sz = S.sz = sizing(S.W, S.H), compact = sz.compact;
    S.nodes = NODES.filter(n => !compact || n.phone).map(n => ({ ...n, lift: 0, phase: 0 }));
    const ids = new Set(S.nodes.map(n => n.id));
    S.edges = EDGES.filter(e => ids.has(e[0]) && ids.has(e[1])).map(e => ({ a: e[0], b: e[1], inferred: !!e[2], lit: 0 }));
    layout(S.nodes, S.edges.map(e => [e.a, e.b]), S.W, S.H, S.seed, sz);
    S.labels = settleLabels(ctx, S.nodes, S.W, S.H, sz);
    const byId = Object.fromEntries(S.nodes.map(n => [n.id, n]));
    S.byId = byId;
    const rnd = mulberry32(S.seed + 11);
    S.nodes.forEach(n => { n.phase = rnd() * 6.283; });
    const { paths, prev } = routes(S.nodes, S.edges.map(e => [e.a, e.b]));
    S.paths = paths;
    // orient every edge toward the Brain so particles read as "flowing in"
    S.edges.forEach((e, i) => {
      const na = byId[e.a], nb = byId[e.b];
      const aCloser = paths[e.a].length <= paths[e.b].length;
      e.from = aCloser ? nb : na; e.to = aCloser ? na : nb;
      const dx = e.to.x - e.from.x, dy = e.to.y - e.from.y, L = Math.hypot(dx, dy);
      e.len = L;
      // gentle bow: control point offset perpendicular, sign seeded per edge
      const bow = (i % 2 ? 1 : -1) * Math.min(28, L * .12);
      e.cx = (e.from.x + e.to.x) / 2 - dy / L * bow;
      e.cy = (e.from.y + e.to.y) / 2 + dx / L * bow;
      e.hue = e.to.hue || e.from.hue || "cyan";
    });
    const N = Math.round(Math.max(20, Math.min(compact ? 40 : 84, S.edges.length * 3)) * (sz.sc < .8 ? .7 : 1));
    S.particles = [];
    for (let i = 0; i < N; i++) {
      S.particles.push({ e: i % S.edges.length, t: rnd(), v: .10 + rnd() * .12, r: .9 + rnd() * 1.3 });
    }
    bgGrad = ctx.createRadialGradient(byId.brain.x, byId.brain.y, 0, byId.brain.x, byId.brain.y, Math.max(S.W, S.H) * .55);
    bgGrad.addColorStop(0, "rgba(139,92,246,.10)");
    bgGrad.addColorStop(.35, "rgba(0,212,255,.045)");
    bgGrad.addColorStop(1, "rgba(7,7,12,0)");
    const R = brainR();
    brainGrad = ctx.createLinearGradient(-R, -R, R, R);
    brainGrad.addColorStop(0, C.cyan); brainGrad.addColorStop(1, C.purple);
    S.hover = null; S.pulse = null; S.chip = null;
    S.cardSide = pickCardSide();
    S.chipPos = sz.cardMode === "chip" ? ITEMS.map(placeChip) : null;
  }
  // Chip mode: a one-line chip needs a spot that covers no disc and no label.
  // Candidates: above the Brain, below its label, then the four corners. If none
  // is clear the chip is not drawn for that item (the pulse still plays).
  function placeChip(it) {
    const sz = S.sz, fs = sz.fs, b = S.byId.brain, BR = sz.brainR;
    ctx.font = `500 ${fs}px ${FONT}`;
    const w = ctx.measureText(`${it.lane}: ${it.title}`).width + 34, h = Math.round(fs * 2.3);
    if (w > S.W - 16) return null;
    const cands = [
      [b.x - w / 2, b.y - BR - 19 * sz.sc - 12 - h], [b.x - w / 2, b.y + BR + 8 + 16 * sz.sc + fs + 10],
      [8, 8], [S.W - w - 8, 8], [8, S.H - h - 8], [S.W - w - 8, S.H - h - 8],
    ];
    const boxes = [];
    for (const n of S.nodes) {
      const r = (n.tier === 0 ? BR : sz.nodeR) + 4;
      boxes.push([n.x - r, n.y - r, n.x + r, n.y + r]);
      const off = n.tier === 0 ? 8 + 16 * sz.sc : 8, lw = (n.lw || 40) / 2 + 4;
      if (!n.hideLabel) boxes.push([n.x - lw, n.y + r - 4 + off, n.x + lw, n.y + r - 4 + off + fs + 4]);
    }
    for (const [x, y] of cands) {
      if (x < 8 || y < 8 || x + w > S.W - 8 || y + h > S.H - 8) continue;
      const rect = [x - 6, y - 6, x + w + 6, y + h + 6];
      if (!boxes.some(bx => bx[0] < rect[2] && rect[0] < bx[2] && bx[1] < rect[3] && rect[1] < bx[3])) return { x: x + w / 2, y };
    }
    return null;
  }
  // Where the ranked card sits: right, left, above or below the Brain, whichever
  // rectangle overlaps the fewest nodes. Decided once per layout, never per frame.
  function pickCardSide() {
    const b = S.byId.brain, BR = brainR(), { w, gap, h } = cardGeom(S.W);
    const mode = S.sz.cardMode;
    if (mode === "band") return "top";
    if (mode !== "side") return mode; // "chip" | "none"

    const rects = {
      right: [b.x + BR + gap, b.y - h / 2, w, h],
      left:  [b.x - BR - gap - w, b.y - h / 2, w, h],
      above: [b.x - w / 2, b.y - BR - 40 - h, w, h],
      below: [b.x - w / 2, b.y + BR + 44, w, h],
    };
    let best = "right", bestScore = -1e9;
    for (const [side, [x, y, rw, rh]] of Object.entries(rects)) {
      if (x < 8 || y < 8 || x + rw > S.W - 8 || y + rh > S.H - 8) continue;
      let score = 0;
      for (const n of S.nodes) {
        if (n.tier === 0) continue;
        const dx = Math.max(x - n.x, 0, n.x - (x + rw)), dy = Math.max(y - n.y, 0, n.y - (y + rh));
        const d = Math.hypot(dx, dy);
        if (d < 34) { score = -1e9; break; }
        score += Math.min(d, 160);
      }
      if (score > bestScore) { bestScore = score; best = side; }
    }
    return best;
  }
  const brainR = () => (S.sz ? S.sz.brainR : 40);
  const nodeR = () => (S.sz ? S.sz.nodeR : 21);

  // Size from the canvas's ACTUAL rendered box, every time it changes. A
  // ResizeObserver (not only window resize) catches the container settling after
  // CSS or fonts land, a parent that grows, or a devtools drawer. Layout is
  // ~18 nodes x 160 iterations, well under a millisecond, so it re-runs on every
  // settled box and never on a frame.
  function resize() {
    const W = Math.round(canvas.clientWidth), H = Math.round(canvas.clientHeight);
    if (W < 40 || H < 40) return; // hidden or not laid out yet: wait for the observer
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    if (W === S.W && H === S.H && dpr === S.dpr) return;
    S.W = W; S.H = H; S.dpr = dpr;
    canvas.width = W * dpr; canvas.height = H * dpr;
    build();
    if (!S.running) draw(0);
  }

  // point on a quadratic edge at t in [0,1]
  function at(e, t) {
    const u = 1 - t;
    return [u * u * e.from.x + 2 * u * t * e.cx + t * t * e.to.x, u * u * e.from.y + 2 * u * t * e.cy + t * t * e.to.y];
  }
  function edgePath(e) { ctx.moveTo(e.from.x, e.from.y); ctx.quadraticCurveTo(e.cx, e.cy, e.to.x, e.to.y); }

  function chip(x, y, text, dot, alpha, above) {
    const fs = S.sz.fs;
    ctx.font = `500 ${fs}px ${FONT}`;
    const [head, tail] = text.includes(":") ? [text.slice(0, text.indexOf(":") + 1), text.slice(text.indexOf(":") + 1)] : ["", text];
    const w = ctx.measureText(text).width + 34, h = Math.round(fs * 2.3);
    let X = Math.round(Math.max(8, Math.min(S.W - w - 8, x - w / 2)));
    let Y = Math.round(above ? y - h : y);
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(12,12,20,.94)";
    ctx.beginPath(); ctx.roundRect(X, Y, w, h, 7); ctx.fill();
    ctx.strokeStyle = `rgba(${RGB[dot]},.55)`; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = C[dot]; ctx.beginPath(); ctx.arc(X + 14, Y + h / 2, 3, 0, 7); ctx.fill();
    ctx.textBaseline = "middle"; ctx.textAlign = "left";
    let tx = X + 25;
    if (head) { ctx.fillStyle = C[dot]; ctx.fillText(head, tx, Y + h / 2 + .5); tx += ctx.measureText(head).width; }
    ctx.fillStyle = C.text; ctx.fillText(tail, tx, Y + h / 2 + .5);
    ctx.globalAlpha = 1;
  }

  // the ranked briefing item: title, the "Because" line, lane and blocker.
  // Sits beside the Brain on wide canvases, above it on phones.
  function card(bx, by, BR, it, alpha, rise) {
    const { w, gap } = cardGeom(S.W), pad = 14;
    const fs = S.sz.fs;
    ctx.font = `600 ${fs + 1}px ${FONT}`;
    const titles = wrap(it.title, w - pad * 2, `600 ${fs + 1}px ${FONT}`);
    const lines = wrap(it.because, w - pad * 2, `400 ${fs}px ${FONT}`);
    ctx.font = `600 ${fs - 1.5}px ${FONT}`;
    const lane = it.lane.toUpperCase();
    const lw = ctx.measureText(lane).width + 18;
    ctx.font = `500 ${fs - 1}px ${FONT}`;
    const stack = lw + 10 + ctx.measureText(it.blocker).width > w - pad * 2;
    const blockers = stack ? wrap(it.blocker, w - pad * 2, `500 ${fs - 1}px ${FONT}`) : [it.blocker];
    const h = pad + titles.length * 18 + 6 + lines.length * (fs + 5) + 8 + 22 + (stack ? blockers.length * (fs + 4) + 4 : 0) + pad - 6;
    const side = S.cardSide || "right";
    let X, Y;
    if (side === "right") { X = Math.round(bx + BR + gap); Y = Math.round(by - h / 2 + rise); }
    else if (side === "left") { X = Math.round(bx - BR - gap - w); Y = Math.round(by - h / 2 + rise); }
    else if (side === "below") { X = Math.round(bx - w / 2); Y = Math.round(by + BR + 44 + rise); }
    else if (side === "top") { X = Math.round((S.W - w) / 2); Y = Math.round(10 + rise); }
    else { X = Math.round(bx - w / 2); Y = Math.round(by - BR - 40 - h + rise); }
    X = Math.max(8, Math.min(S.W - w - 8, X)); Y = Math.max(8, Math.min(S.H - h - 8, Y));
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(12,12,20,.95)";
    ctx.beginPath(); ctx.roundRect(X, Y, w, h, 9); ctx.fill();
    ctx.strokeStyle = `rgba(${RGB[it.dot]},.5)`; ctx.lineWidth = 1; ctx.stroke();
    // connector to the Brain
    ctx.strokeStyle = `rgba(${RGB[it.dot]},.35)`;
    ctx.beginPath();
    if (side === "above" || side === "top") { ctx.moveTo(bx, Y + h); ctx.lineTo(bx, by - BR - 24); }
    else if (side === "below") { ctx.moveTo(bx, Y); ctx.lineTo(bx, by + BR + 24); }
    else if (side === "right") { ctx.moveTo(X, Y + h / 2); ctx.lineTo(bx + BR + Math.min(26, gap - 4), by); }
    else { ctx.moveTo(X + w, Y + h / 2); ctx.lineTo(bx - BR - Math.min(26, gap - 4), by); }
    ctx.stroke();
    ctx.textAlign = "left"; ctx.textBaseline = "top";
    let y = Y + pad;
    ctx.font = `600 ${fs + 1}px ${FONT}`; ctx.fillStyle = C.text;
    for (const l of titles) { ctx.fillText(l, X + pad, y); y += 18; } y += 6;
    ctx.font = `400 ${fs}px ${FONT}`; ctx.fillStyle = C.muted;
    for (const l of lines) { ctx.fillText(l, X + pad, y); y += fs + 5; }
    y += 8;
    ctx.font = `600 ${fs - 1.5}px ${FONT}`;
    ctx.fillStyle = `rgba(${RGB[it.dot]},.14)`; ctx.beginPath(); ctx.roundRect(X + pad, y, lw, 20, 5); ctx.fill();
    ctx.strokeStyle = `rgba(${RGB[it.dot]},.6)`; ctx.stroke();
    ctx.fillStyle = C[it.dot]; ctx.fillText(lane, X + pad + 9, y + 5);
    ctx.font = `500 ${fs - 1}px ${FONT}`; ctx.fillStyle = C.muted;
    if (stack) blockers.forEach((l, i) => ctx.fillText(l, X + pad, y + 22 + 6 + i * (fs + 4))); else ctx.fillText(it.blocker, X + pad + lw + 10, y + 4.5);
    ctx.globalAlpha = 1;
  }
  const wrapCache = new Map();
  function wrap(text, maxW, font) {
    const k = font + "|" + maxW + "|" + text;
    if (wrapCache.has(k)) return wrapCache.get(k);
    ctx.font = font;
    const out = []; let line = "";
    for (const wd of text.split(" ")) {
      const test = line ? line + " " + wd : wd;
      if (ctx.measureText(test).width > maxW && line) { out.push(line); line = wd; } else line = test;
    }
    if (line) out.push(line);
    wrapCache.set(k, out);
    return out;
  }

  function draw(dt) {
    const { W, H, t, nodes, edges, byId } = S;
    ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0);
    ctx.fillStyle = C.ground; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

    const hov = S.hover;
    const hovSet = hov ? new Set(edges.filter(e => e.a === hov.id || e.b === hov.id).map((e) => e)) : null;

    // --- edges: batched, two strokes, no shadowBlur
    ctx.lineCap = "round";
    const baseA = hov ? .05 : .13;
    // glow stroke (wide, faint), solid + dashed together
    ctx.lineWidth = 5; ctx.strokeStyle = `rgba(${RGB.cyan},${hov ? .015 : .035})`;
    ctx.beginPath(); for (const e of edges) if (!hovSet || !hovSet.has(e)) edgePath(e); ctx.stroke();
    ctx.lineWidth = 1; ctx.strokeStyle = `hsla(0,0%,100%,${baseA})`;
    ctx.beginPath(); for (const e of edges) if (!e.inferred && (!hovSet || !hovSet.has(e))) edgePath(e); ctx.stroke();
    ctx.setLineDash([3, 7]); ctx.lineDashOffset = -(t * 14) % 10;
    ctx.beginPath(); for (const e of edges) if (e.inferred && (!hovSet || !hovSet.has(e))) edgePath(e); ctx.stroke();
    ctx.setLineDash([]);
    // lit edges (pulse trail) and hovered edges, drawn bright on top
    for (const e of edges) {
      const on = hovSet && hovSet.has(e);
      if (!on && e.lit <= 0.01) continue;
      const a = on ? .75 : e.lit * .8;
      ctx.lineWidth = 6; ctx.strokeStyle = `rgba(${RGB[e.hue]},${a * .18})`;
      ctx.beginPath(); edgePath(e); ctx.stroke();
      ctx.lineWidth = 1.4; ctx.strokeStyle = `rgba(${RGB[e.hue]},${a})`;
      if (e.inferred) { ctx.setLineDash([3, 7]); ctx.lineDashOffset = -(t * 14) % 10; }
      ctx.beginPath(); edgePath(e); ctx.stroke();
      ctx.setLineDash([]);
      e.lit = Math.max(0, e.lit - dt * .9);
    }

    // --- particles
    const ps = S.particles, sp = sprites.cyan;
    for (const p of ps) {
      const e = edges[p.e];
      p.t += dt * p.v * (160 / Math.max(80, e.len));
      if (p.t > 1) p.t -= 1;
      const [x, y] = at(e, p.t);
      const dim = hovSet && !hovSet.has(e) ? .35 : 1;
      const s = p.r * 9;
      ctx.globalAlpha = .55 * dim;
      ctx.drawImage(sp, x - s / 2, y - s / 2, s, s);
      ctx.globalAlpha = .95 * dim;
      ctx.fillStyle = "#c9f4ff";
      ctx.beginPath(); ctx.arc(x, y, p.r * .75, 0, 7); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // --- pulse: a bright signal travelling leaf -> Brain
    if (S.pulse) {
      const P = S.pulse;
      P.t += dt / P.per;
      const idx = Math.floor(P.t);
      if (idx >= P.path.length) {
        S.pulse = null; S.burst = 1;
        S.chip = { item: ITEMS[P.node.item], t: 0 };
      } else {
        const e = edges[P.path[idx]];
        e.lit = 1;
        const [x, y] = at(e, P.t - idx);
        const s = Math.round(38 * S.sz.sc);
        ctx.drawImage(sprites.cyan, x - s / 2, y - s / 2, s, s);
        ctx.drawImage(sprites.white, x - 8, y - 8, 16, 16);
        // sparse tail
        for (let k = 1; k <= 4; k++) {
          const tt = P.t - idx - k * .045; if (tt < 0) break;
          const [tx, ty] = at(e, tt);
          ctx.globalAlpha = .5 - k * .1; ctx.fillStyle = C.cyan;
          ctx.beginPath(); ctx.arc(tx, ty, 2.2 - k * .35, 0, 7); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
    }

    // --- nodes
    const R = nodeR(), BR = brainR();
    for (const n of nodes) {
      const target = hov === n ? 1 : 0;
      n.lift += (target - n.lift) * Math.min(1, dt * 9);
      const breathe = .5 + .5 * Math.sin(t * .9 + n.phase);
      const dim = hov && hov !== n && !(hovSet && edges.some(e => hovSet.has(e) && (e.a === n.id || e.b === n.id))) ? .4 : 1;
      const isBrain = n.tier === 0;
      const r = (isBrain ? BR : R) * (1 + n.lift * .12 + (isBrain ? .015 : .02) * Math.sin(t * .9 + n.phase));
      const x = n.x, y = n.y - n.lift * 4;
      ctx.globalAlpha = dim;
      if (isBrain) {
        // gradient node: cyan and purple sprites overlapped, flashing on burst
        const gs = BR * 5.2 * (1 + S.burst * .25);
        ctx.globalAlpha = (.55 + .2 * breathe + S.burst * .5) * dim;
        ctx.drawImage(sprites.cyan, x - gs / 2 - BR * .5, y - gs / 2, gs, gs);
        ctx.drawImage(sprites.purple, x - gs / 2 + BR * .5, y - gs / 2, gs, gs);
        ctx.globalAlpha = dim;
        if (S.burst > 0) { // one expanding ring
          const rr = BR + (1 - S.burst) * BR * 2.2;
          ctx.strokeStyle = `rgba(${RGB.cyan},${S.burst * .6})`; ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.arc(x, y, rr, 0, 7); ctx.stroke();
          S.burst = Math.max(0, S.burst - dt * 1.1);
        }
        // slow orbiting dashed ring: the Brain is always working
        ctx.save(); ctx.translate(x, y); ctx.rotate(t * .25);
        ctx.setLineDash([2, 9]); ctx.lineWidth = 1; ctx.strokeStyle = `rgba(${RGB.cyan},.35)`;
        ctx.beginPath(); ctx.arc(0, 0, r + 11 * S.sz.sc, 0, 7); ctx.stroke(); ctx.setLineDash([]);
        ctx.rotate(-t * .5);
        ctx.setLineDash([1, 6]); ctx.strokeStyle = `rgba(${RGB.purple},.35)`;
        ctx.beginPath(); ctx.arc(0, 0, r + 19 * S.sz.sc, 0, 7); ctx.stroke(); ctx.setLineDash([]);
        ctx.restore();
        ctx.save(); ctx.translate(x, y);
        ctx.fillStyle = C.raised; ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fill();
        ctx.strokeStyle = brainGrad; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "rgba(0,212,255,.06)"; ctx.fill();
        ctx.scale(r / 15, r / 15);
        ctx.strokeStyle = brainGrad; ctx.fillStyle = C.text; ctx.lineWidth = 1.1;
        ICONS.brain(ctx);
        ctx.restore();
      } else {
        const hue = n.hue, gs = R * 4.4 * (1 + n.lift * .4);
        ctx.globalAlpha = (.42 + .22 * breathe + n.lift * .35) * dim;
        ctx.drawImage(sprites[hue], x - gs / 2, y - gs / 2, gs, gs);
        ctx.globalAlpha = dim;
        ctx.fillStyle = C.raised; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
        ctx.fillStyle = `rgba(${RGB[hue]},${.08 + n.lift * .12})`; ctx.fill();
        ctx.strokeStyle = `rgba(${RGB[hue]},${.45 + .25 * breathe + n.lift * .3})`; ctx.lineWidth = 1; ctx.stroke();
        ctx.save(); ctx.translate(x, y); ctx.scale(r / 15, r / 15);
        ctx.strokeStyle = "rgba(255,255,255,.92)"; ctx.fillStyle = "rgba(255,255,255,.92)";
        ctx.lineWidth = 1.35; ctx.lineJoin = "round";
        ICONS[n.icon](ctx);
        ctx.restore();
      }
      // label
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      if (isBrain) {
        ctx.font = `600 ${S.sz.brainFs}px ${FONT}`; ctx.fillStyle = C.text;
        ctx.fillText(n.label, x, y + r + 8 + 16 * S.sz.sc);
      } else if (!n.hideLabel || hov === n) {
        ctx.font = `500 ${S.sz.fs}px ${FONT}`;
        ctx.fillStyle = hov === n ? C.text : C.muted;
        ctx.fillText(n.label, x, y + r + 8);
      }
      ctx.globalAlpha = 1;
    }

    // --- chips
    if (hov) {
      const y = hov.y - hov.lift * 4 - (hov.tier === 0 ? BR : R) - 14;
      chip(hov.x, y, hov.reason, hov.hue || "cyan", Math.min(1, hov.lift * 1.4), true);
    }
    if (S.chip) {
      const ch = S.chip; ch.t += dt;
      const life = 4.2, a = ch.t < .25 ? ch.t / .25 : ch.t > life - .5 ? Math.max(0, (life - ch.t) / .5) : 1;
      const b = byId.brain;
      const rise = (1 - Math.min(1, ch.t / .35)) * 6;
      const mode = S.sz.cardMode;
      if (mode === "side" || mode === "band") card(b.x, b.y, BR, ch.item, a, rise);
      else if (mode === "chip") {
        const pos = S.chipPos && S.chipPos[ITEMS.indexOf(ch.item)];
        if (pos) chip(pos.x, pos.y + rise, `${ch.item.lane}: ${ch.item.title}`, ch.item.dot, a, false);
      }
      if (ch.t > life) S.chip = null;
    }
  }

  // --- pulses every 3 to 5 s from a tier-2 node (tier-1 on phones)
  const rndP = mulberry32(99);
  function schedule() {
    const leaves = S.nodes.filter(n => n.tier === (S.W < 900 ? 1 : 2) && n.item);
    const n = leaves[Math.floor(rndP() * leaves.length)];
    S.pulse = { node: n, path: S.paths[n.id], t: 0, per: .5 };
    S.nextPulse = S.t + 3 + rndP() * 2 + S.paths[n.id].length * .5;
  }

  // --- loop with perf probe
  let last = 0, raf = 0, maxFrame = 0, frames = 0;
  function frame(now) {
    raf = 0;
    if (!S.running) return;
    const t0 = performance.now();
    const dt = Math.min(.05, last ? (now - last) / 1000 : .016); last = now;
    S.t += dt;
    if (!S.pulse && S.t >= S.nextPulse) schedule();
    draw(dt);
    const ms = performance.now() - t0;
    if (ms > maxFrame) maxFrame = ms;
    if (debug && ++frames === 300) {
      canvas.__wg = { maxFrameMs: +maxFrame.toFixed(2), particles: S.particles.length, nodes: S.nodes.length, edges: S.edges.length };
      console.log(`[workgraph] max frame ${maxFrame.toFixed(2)} ms over 300 frames, ${S.particles.length} particles, ${S.nodes.length} nodes`);
    }
    raf = requestAnimationFrame(frame);
  }
  function start() { if (reduce || S.running || !S.visible || document.hidden) return; S.running = true; last = 0; raf = requestAnimationFrame(frame); }
  function stop() { S.running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }

  // --- pointer: offsetX/Y needs no layout read
  function hit(x, y) {
    const R = nodeR() + 10;
    let best = null, bd = 1e9;
    for (const n of S.nodes) {
      const d = Math.hypot(n.x - x, n.y - y), lim = n.tier === 0 ? brainR() + 12 : R;
      if (d < lim && d < bd) { best = n; bd = d; }
    }
    return best;
  }
  let cursor = "";
  function setHover(n) {
    if (S.hover === n) return;
    S.hover = n;
    const c = n ? "pointer" : "";
    if (c !== cursor) { cursor = c; canvas.style.cursor = c; }
    if (reduce) draw(0.05);
  }
  if (!opts.poster) {
    canvas.addEventListener("pointermove", ev => setHover(hit(ev.offsetX, ev.offsetY)));
    canvas.addEventListener("pointerleave", () => setHover(null));
    canvas.addEventListener("pointerdown", ev => { if (ev.pointerType === "touch") setHover(hit(ev.offsetX, ev.offsetY)); });
  }

  // --- lifecycle
  let rt = 0;
  const onResize = () => { clearTimeout(rt); rt = setTimeout(resize, 120); };
  function boot() {
    resize();
    if (opts.poster) { posterFrame(); return; }
    if (reduce) { draw(0); if ("ResizeObserver" in window) new ResizeObserver(onResize).observe(canvas); return; }
    window.addEventListener("resize", onResize);
    if ("ResizeObserver" in window) new ResizeObserver(onResize).observe(canvas);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(([en]) => { S.visible = en.isIntersecting; S.visible ? start() : stop(); }, { threshold: .05 }).observe(canvas);
    } else start();
    if (opts.onReady) opts.onReady();
  }
  // a single frame that looks like the middle of the animation: a signal in
  // flight and a ranked item already on screen
  function posterFrame() {
    const n = S.byId.commitment || S.nodes.find(x => x.tier > 0);
    S.pulse = { node: n, path: S.paths[n.id], t: .55, per: .5 };
    S.chip = { item: ITEMS[n.item], t: .6 };
    S.edges[S.paths[n.id][0]].lit = .7;
    draw(.016);
    if (opts.onReady) opts.onReady();
  }

  // Work Sans, self-hosted, same origin. Never a Google Fonts request.
  const fontUrl = opts.font || canvas.dataset.font || FONT_URL;
  let ready = false;
  const go = () => { if (ready) return; ready = true; boot(); };
  try {
    const ff = new FontFace("Work Sans", `url(${fontUrl})`, { weight: "100 900", display: "swap" });
    document.fonts.add(ff);
    ff.load().then(go, go);
    setTimeout(go, 1500); // never wait on a font that will not come
  } catch { go(); }

  return { stop, start, resize, state: S };
}

// auto-mount
if (typeof document !== "undefined") {
  const mountAll = () => document.querySelectorAll("canvas[data-workgraph]").forEach(c => { if (!c.dataset.mounted) { c.dataset.mounted = "1"; mountWorkGraph(c); } });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountAll); else mountAll();
}
