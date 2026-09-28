// Animated heroes, /studio and / (founder 2026-09-29: "something to animate").
// One source: data/studio.json heroImages. This script
//   1. cuts hero-sized derivatives of the real screens into site/img/studio/hero/
//      (window chrome kept, grey capture margin dropped, 800w + 1400w),
//   2. writes the studio stage between the HEROWORK markers and splits the
//      studio h1 into words so the stage can underline the discipline on show,
//   3. rewrites the landing #hero section (same copy, doors carry a live mini-stage).
// Motion lives in site/js/hero.js and site/css/hero.css. With JS off, or with
// prefers-reduced-motion, the markup below IS the picture: scene 0 in front,
// the rest stacked behind, its chip showing.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.join(import.meta.dirname, "..");
const SRC = path.join(ROOT, "site/img/studio");
const OUT = path.join(SRC, "hero");
mkdirSync(OUT, { recursive: true });
const H = JSON.parse(readFileSync(path.join(ROOT, "data/studio.json"), "utf8")).heroImages;
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

// ---------------------------------------------------------------- images --
const made = new Map();
async function cut(src, crop, widths) {
  const key = src + (crop || []).join(",") + widths.join(",");
  if (made.has(key)) return made.get(key);
  const base = src.replace(/\.(webp|png)$/, "");
  const img = sharp(path.join(SRC, src));
  const meta = await img.metadata();
  const [l, t, w, h] = crop || [0, 0, meta.width, meta.height];
  const out = [];
  for (const W of widths) {
    const file = `${base}-${W}.webp`;
    const H2 = Math.round((h * W) / w);
    const dest = path.join(OUT, file);
    if (!existsSync(dest)) {
      await sharp(path.join(SRC, src)).extract({ left: l, top: t, width: w, height: h })
        .resize(W).webp({ quality: 80, effort: 5, alphaQuality: 90 }).toFile(dest);
    }
    out.push({ url: `/img/studio/hero/${file}`, w: W, h: H2 });
  }
  const r = { set: out, ratio: w / h };
  made.set(key, r);
  return r;
}
const srcset = (r) => r.set.map((s) => `${s.url} ${s.w}w`).join(", ");
const img = (r, alt, sizes, eager) =>
  `<img src="${r.set[0].url}" srcset="${srcset(r)}" sizes="${sizes}" alt="${esc(alt)}" width="${r.set.at(-1).w}" height="${r.set.at(-1).h}" decoding="async"${eager ? ' fetchpriority="high"' : ' loading="lazy" fetchpriority="low"'}>`;

// ----------------------------------------------------------- studio stage --
const S = H.scenes;
const N = S.length;
const MS = 3400;
const cards = [], chips = [], tabs = [], sats = [], photos = [];
for (const [k, s] of S.entries()) {
  const r = await cut(s.src, s.crop, [800, 1400]);
  cards.push(`<figure class="hx-card" data-card data-pos="${k}">${img(r, s.alt, "(max-width: 1000px) 88vw, 520px", k === 0)}</figure>`);
  // the chip sits just above the point the cursor taps (stage percentages,
  // the deck spans 5..91% x 13..81.8%)
  // (or at an explicit stage point, `at`, when it answers a satellite)
  const x = (s.at ? s.at[0] : 5 + 86 * s.pt[0]).toFixed(1), y = (s.at ? s.at[1] : 13 + 68.8 * s.pt[1]).toFixed(1);
  chips.push(`<span class="hx-chip${s.side === "right" ? " hx-chip-r" : ""}${k === 0 ? " on" : ""}" data-k="${k}" data-pt="${x},${y}" style="left:${x}%;top:${y}%"><i></i>${esc(s.chip)}</span>`);
  tabs.push(`<li><button type="button" class="hx-tab${k === 0 ? " on" : ""}" data-k="${k}" data-go="${k}" aria-label="Show ${esc(s.word)}: ${esc(s.name)}"><b>${esc(s.word)}</b><span>${esc(s.name)}</span><i><s></s></i></button></li>`);
}
for (const [name, v] of Object.entries(H.sats)) {
  const r = await cut(v.src, v.crop, [v.w]);
  const ks = S.map((s, k) => (s.sat === name ? k : -1)).filter((k) => k >= 0);
  sats.push(`<figure class="hx-sat hx-sat-${name}${ks.includes(0) ? " on" : ""}" data-k="${ks.join(" ")}">${img(r, v.alt, name === "phone" ? "110px" : "270px", false)}</figure>`);
}
const uniq = [...new Set(S.map((s) => s.photo))];
for (const [i, p] of uniq.entries()) {
  const r = await cut(p, null, [720]);
  const ks = S.map((s, k) => (s.photo === p ? k : -1)).filter((k) => k >= 0);
  photos.push(`<img class="hx-ph${ks.includes(0) ? " on" : ""}" data-k="${ks.join(" ")}" src="${r.set[0].url}" alt="${esc(["The team planning at a whiteboard", "An engineer writing code", "The team reviewing a build"][i] || "The team at work")}" width="720" height="540" loading="lazy" fetchpriority="low" decoding="async">`);
}

const studioBlock = `
      <div class="hx" data-hx data-ms="${MS}" data-n="${N}">
        <div class="hx-stage">
          <div class="hx-bg" aria-hidden="true"><span></span><span></span><span></span></div>
          <div class="hx-par hx-photo" data-depth="-0.6"><figure>${photos.join("")}</figure></div>
          <div class="hx-par hx-deck" data-depth="1">
            ${cards.join("\n            ")}
          </div>
          <div class="hx-par hx-sats" data-depth="1.8">
            ${sats.join("\n            ")}
          </div>
          <div class="hx-par hx-chips" data-depth="1.4">
            ${chips.join("\n            ")}
            <span class="hx-cur" aria-hidden="true"><svg viewBox="0 0 20 24" width="20" height="24"><path d="M2 1.5v18.2l4.9-4.6 3.1 7.1 3.2-1.4-3.1-7h6.8z" fill="#1d1d1f" stroke="#fff" stroke-width="1.6" stroke-linejoin="round"/></svg></span>
          </div>
        </div>
        <ol class="hx-tabs">
          ${tabs.join("\n          ")}
        </ol>
      </div>
`;

const idx = path.join(ROOT, "site/studio/index.html");
let html = readFileSync(idx, "utf8");
const HA = "<!-- HEROWORK:start (generated by scripts/genhero.mjs) -->";
const HB = "<!-- HEROWORK:end -->";
const hi = html.search(/<!-- HEROWORK:start[^>]*-->/), hj = html.indexOf(HB);
if (hi === -1 || hj === -1) { console.error("hero markers missing"); process.exit(1); }
html = html.slice(0, hi) + HA + studioBlock + "      " + html.slice(hj);

// studio h1: each discipline a word the stage can underline, each line rises
// two words to a line ("Product. Tech." / "Ops. Marketing."), so no width
// leaves one word stranded on a line of its own
const w = S.map((s, k) => `<span class="hx-w${k === 0 ? " on" : ""}" data-k="${k}">${esc(s.word)}.</span>`);
const lines = [];
for (let i = 0; i < w.length; i += 2) lines.push(`<span class="hx-l">${w.slice(i, i + 2).join(" ")}</span>`);
const h1 = `<h1 class="hx-h1">${lines.join(" ")} <span class="hx-l"><em>One AI-native team.</em></span></h1>`;
const heroAt = html.indexOf('<section id="hero"');
const h1re = /<h1[^>]*>[\s\S]*?<\/h1>/;
const before = html.slice(0, heroAt), after = html.slice(heroAt);
html = before + after.replace(h1re, h1);
html = linkAssets(html);
writeFileSync(idx, html);

// -------------------------------------------------------------- landing --
async function mini(list, eagerFirst) {
  const out = [];
  for (const [k, d] of list.entries()) {
    const isPhoto = d.src.startsWith("photo-");
    const s = S.find((x) => x.src === d.src);
    const crop = d.crop || s?.crop || H.sats[Object.keys(H.sats).find((n) => H.sats[n].src === d.src)]?.crop || null;
    const r = await cut(d.src, crop, isPhoto ? [720] : [800, 1400]);
    out.push(`<figure class="dm-card${isPhoto ? " dm-photo" : ""}" data-card data-pos="${k}">${img(r, d.alt, "(max-width: 900px) 70vw, 340px", eagerFirst && k === 0)}<span class="hx-chip dm-chip${k === 0 ? " on" : ""}" data-k="${k}"><i></i>${esc(d.chip)}</span></figure>`);
  }
  return out.join("");
}
const landing = `<section id="hero" class="doors-hero">
  <div class="wrap">
    <div class="doors-split">
      <div class="doors-say">
        <span class="label">WorkElate Excellence Studio</span>
        <h1 class="rise"><span>Ship faster.</span><span>Run smoother.</span><span class="accent">Grow bigger.</span></h1>
        <p class="lede">Your product, your operations and your marketing, handled by one AI-native team. Teams in six industries have shipped 25+ products with us since 2018.</p>
      </div>
      <div class="doors">
        <a class="door door-product door-live rv" href="/brain">
          <div class="door-txt">
            <span class="door-k">Product</span>
            <span class="door-t">Chief, the Brain</span>
            <span class="door-p">Your CRM, mail, tickets and documents, finally working as one. It asks before it changes anything.</span>
            <span class="door-go">See Chief &rarr;</span>
          </div>
          <div class="dm" data-hx data-ms="3000" data-n="${H.doors.product.length}" aria-hidden="true">${await mini(H.doors.product, true)}</div>
        </a>
        <a class="door door-studio door-live rv" href="/studio">
          <div class="door-txt">
            <span class="door-k">Studio</span>
            <span class="door-t">WE_AINA Studio</span>
            <span class="door-p">Your product, ops and marketing in one team. From the first sprint to launch to growth.</span>
            <span class="door-go">See the studio &rarr;</span>
          </div>
          <div class="dm" data-hx data-ms="3000" data-delay="1500" data-n="${H.doors.studio.length}" aria-hidden="true">${await mini(H.doors.studio, false)}</div>
        </a>
      </div>
    </div>
  </div>
</section>`;
const li = path.join(ROOT, "site/index.html");
let land = readFileSync(li, "utf8");
const lre = /<section id="hero"[\s\S]*?<\/section>/;
if (!lre.test(land)) { console.error("landing #hero missing"); process.exit(1); }
land = linkAssets(land.replace(lre, landing));
writeFileSync(li, land);

// head: hero.css after the page sheets, hero.js deferred (module scripts defer)
function linkAssets(page) {
  if (!/\/css\/hero(\.min)?\.css/.test(page)) {
    page = page.replace(/(<link rel="stylesheet" href="\/css\/studio(?:\.min)?\.css">)/, `$1\n<link rel="stylesheet" href="/css/hero.css">`);
  }
  if (!/\/js\/hero(\.min)?\.js/.test(page)) {
    page = page.replace("</head>", `<script type="module" src="/js/hero.js"></script>\n</head>`);
  }
  return page;
}
console.log(`heroes written: ${N} studio scenes, ${H.doors.product.length}+${H.doors.studio.length} door cards, ${made.size} image cuts`);
