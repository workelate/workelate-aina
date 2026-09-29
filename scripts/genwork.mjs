// WE_AINA · /studio/work, the case gallery.
//
// Founder, 2026-09-28, looking at the old numbered index table: "koi bhi apne
// karya ko aise batata hai kya is tarah k table me? see the websites of other
// studios". Nobody presents their work as a table. This page is now a visual
// case gallery in the shape the best studios use (data/studio-inspiration.md):
// big real images, a short title, one outcome line, an industry tag, and an
// arrow to the case study where one exists.
//
// GENERATED FILE: site/studio/work.html is output, never hand-edited (CLAUDE.md).
// Edit this generator and re-run:  node scripts/genwork.mjs
// then genchrome → genseo → gensitemap → gencorpus → `npm run assets`.
//
// ── Truth rules encoded here ────────────────────────────────────────────────
// 1. Every card is backed by a data file: data/projects.json (by id), one
//    anonymous entry in data/cases.json, programme rows in
//    data/programme-briefs.md, or a product whose real screens sit in
//    site/img/studio (data/image-credits.md). Outcome lines are the data
//    file's own words; nothing is measured here that was not measured there.
// 2. `named:false` projects render the descriptor, never a client name.
// 3. RockProsUSA numbers always carry "over the first twelve months".
// 4. The studio's numbers are 25+ products, 6 industries, since 2018
//    (data/studio.json). No other count appears on the page.
// 5. No em dashes in copy; no "not yet matched / not proven" lines.
//
// ── Layout ─────────────────────────────────────────────────────────────────
// Featured (large image cards) → six industries (one industry photograph and
// its builds) → More builds (compact tiles) → the CTA band. No JavaScript.
// All CSS lives in site/css/work.css.
import { writeFileSync } from "node:fs";
import path from "node:path";
// The card copy (featured, six industries, more builds) lives in workdata.mjs,
// shared with gencorpus.mjs so the assistant describes each build in these words.
import { byId, FEATURED, INDUSTRIES, MORE } from "./workdata.mjs";

const ROOT = path.join(import.meta.dirname, "..");

const IMG = "/img/studio/";
// Intrinsic sizes of every image used here, so each <img> carries width and
// height (CLS 0). Measured with `sips` on 2026-09-28.
const SIZE = {
  "rockpros-dispatch-board.webp": [2400, 1784],
  "rockpros-customer-po.webp": [1600, 1242],
  "rockpros-driver-loads-phone.webp": [1600, 1660],
  "citysense-planner-map.webp": [2400, 1784],
  "citysense-live-campaign.webp": [1600, 1242],
  "citedspy-dashboard.webp": [2400, 1784],
  "workelate-chief-hero.webp": [2400, 1420],
  "workelate-phone.webp": [1600, 1744],
  "infinitie-room.webp": [1600, 1242],
  "photo-ind-quarry-4x3.webp": [1600, 1200],
  "photo-ind-logistics-4x3.webp": [1600, 1200],
  "photo-ind-ooh-4x3.webp": [1600, 1200],
  "photo-ind-fintech-4x3.webp": [1600, 1200],
  "photo-ind-manufacturing-4x3.webp": [1600, 1200],
  "photo-ind-recommerce-4x3.webp": [1600, 1200]
};

const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// Invariant: a card tied to an uncleared projects.json entry must not carry a
// title override that could be a client name (a word with inner capitals).
for (const c of [...FEATURED, ...INDUSTRIES.flatMap(i => i.builds), ...MORE])
  if (c.id && byId[c.id] && !byId[c.id].named && /\b[A-Z][a-z]+[A-Z]/.test(c.title))
    throw new Error(`genwork: "${c.title}" reads as an uncleared client name`);
for (const c of [...FEATURED, ...INDUSTRIES.flatMap(i => i.builds), ...MORE, ...INDUSTRIES]) {
  const copy = [c.title, c.line, c.tag, c.name].join(" ");
  if (/—/.test(copy)) throw new Error(`genwork: em dash in "${c.title || c.name}"`);
}

/* ───────────────────────────────────────────────────────────── markup -- */
const img = (file, alt, { eager = false, cls = "", sizes = "" } = {}) => {
  const [w, h] = SIZE[file] || (() => { throw new Error(`genwork: no size for ${file}`); })();
  return `<img${cls ? ` class="${cls}"` : ""} src="${IMG}${file}" alt="${esc(alt)}" width="${w}" height="${h}"${sizes ? ` sizes="${sizes}"` : ""} ${eager ? `fetchpriority="high"` : `loading="lazy"`} decoding="async">`;
};
const arrow = `<svg class="wk-arrow" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M3 8h9.5M8.5 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const meta = (a, b) => [a, b].filter(Boolean).map(esc).join(" · ");

function featCard(c, i) {
  const tagName = c.href ? "a" : "article";
  const attrs = c.href ? ` href="${c.href}"` : "";
  return `    <${tagName} class="wk-feat${c.wide ? " wk-feat--wide" : ""}"${attrs}>
      <div class="wk-media${c.phone ? " wk-media--phone" : ""}${c.fit ? " wk-media--fit" : ""}">
        ${img(c.img, c.alt, { eager: i === 0, cls: "wk-shot" })}${c.phone ? `
        ${img(c.phone, c.phoneAlt, { cls: "wk-phone" })}` : ""}
      </div>
      <div class="wk-body">
        <p class="wk-tag">${meta(c.tag, c.years)}</p>
        <h3 class="wk-title">${esc(c.title)}</h3>
        <p class="wk-line">${esc(c.line)}</p>${c.href ? `
        <span class="wk-go">${esc(c.cta)} ${arrow}</span>` : ""}
      </div>
    </${tagName}>`;
}

function buildCard(b) {
  const tagName = b.href ? "a" : "article";
  const attrs = b.href ? ` href="${b.href}"` : "";
  return `          <${tagName} class="wk-build${b.img ? " wk-build--img" : ""}"${attrs}>${b.img ? `
            <div class="wk-thumb">${img(b.img, b.alt)}</div>` : ""}
            <div class="wk-bbody">
              <p class="wk-tag">${meta(b.sector, b.years)}</p>
              <h4 class="wk-btitle">${esc(b.title)}</h4>
              <p class="wk-bline">${esc(b.line)}</p>${b.href ? `
              <span class="wk-go">${esc(b.cta)} ${arrow}</span>` : ""}
            </div>
          </${tagName}>`;
}

const industryBlocks = INDUSTRIES.map(ind => `      <article class="wk-ind" id="${ind.k}">
        <div class="wk-ind-photo">
          <h3 class="wk-ind-name">${esc(ind.name)}</h3>
          ${img(ind.photo, ind.alt)}
        </div>
        <div class="wk-ind-builds">
${ind.builds.map(buildCard).join("\n")}
        </div>
      </article>`).join("\n");

const jump = INDUSTRIES.map(i => `<a class="wk-chip" href="#${i.k}">${esc(i.name)}</a>`).join("\n        ");

const moreTiles = MORE.map(m => `      <article class="wk-tile">
        <p class="wk-tag">${meta(m.tag, m.years)}</p>
        <h3 class="wk-ttitle">${esc(m.title)}</h3>
        <p class="wk-tline">${esc(m.line)}</p>
      </article>`).join("\n");

const DESC = "25+ products shipped across six industries since 2018: building materials, logistics and dispatch, OOH and digital billboards, fintech, manufacturing, re-commerce and retail.";
const TITLE = "Work that ships, WE_AINA";

const all = [...FEATURED, ...INDUSTRIES.flatMap(i => i.builds.filter(b => !FEATURED.some(f => f.id && f.id === b.id))), ...MORE];
const itemList = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Work, WE_AINA",
  description: DESC,
  url: "https://aina.workelate.com/studio/work",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: all.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.title, description: c.line }))
  }
};

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${TITLE}</title>
<meta name="description" content="${DESC}">
<link rel="stylesheet" href="/css/site.css">
<link rel="stylesheet" href="/css/work.css">
<link rel="preload" as="image" href="${IMG}${FEATURED[0].img}" fetchpriority="high">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="canonical" href="https://aina.workelate.com/studio/work">
<meta property="og:type" content="website">
<meta property="og:title" content="${TITLE}">
<meta property="og:description" content="${DESC}">
<meta property="og:image" content="https://aina.workelate.com/og.png">
<meta property="og:url" content="https://aina.workelate.com/studio/work">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
${JSON.stringify(itemList, null, 2)}
</script>
<noscript><style>.rv{opacity:1!important;transform:none!important}</style></noscript>
</head>
<body class="wk-page">

<!-- NAV:start -->
<header class="nav"></header>
<!-- NAV:end -->

<main id="main">

<section class="wk-hero">
  <div class="wrap wk-wrap">
    <span class="label">Work</span>
    <h1>Work that <span class="accent">ships.</span></h1>
    <p class="sub wk-sub">25+ products shipped across six industries since 2018. Here is the work we can show.</p>
  </div>
</section>

<section class="wk-featured" aria-labelledby="wk-feat-h">
  <h2 id="wk-feat-h" class="sr-only">Featured work</h2>
  <div class="wrap wk-wrap wk-feat-grid">
${FEATURED.map(featCard).join("\n")}
  </div>
</section>

<section class="wk-industries deep" aria-labelledby="wk-ind-h">
  <div class="wrap wk-wrap">
    <div class="wk-sec-head">
      <h2 id="wk-ind-h">Six industries.</h2>
      <nav class="wk-chips" aria-label="Jump to an industry">
        ${jump}
      </nav>
    </div>
    <div class="wk-ind-list">
${industryBlocks}
    </div>
  </div>
</section>

<section class="wk-more" aria-labelledby="wk-more-h">
  <div class="wrap wk-wrap">
    <h2 id="wk-more-h" class="wk-more-h">More builds.</h2>
    <div class="wk-tiles">
${moreTiles}
    </div>
  </div>
</section>

<section id="cta" class="deep">
  <div class="wrap center-head">
    <h2>Book a Diagnostic Sprint</h2>
    <p class="dim">Two weeks to scope and price your build.</p>
    <p style="margin-top:24px"><a class="btn" href="/studio/contact">Book a Diagnostic Sprint</a></p>
  </div>
</section>

</main>

<!-- FOOTER:start -->
<footer class="mega"></footer>
<!-- FOOTER:end -->
<script src="/js/nav.js" defer></script>
<script type="module" src="/js/reveal.js"></script>
</body>
</html>
`;

writeFileSync(path.join(ROOT, "site", "studio", "work.html"), html);
console.log(`wrote site/studio/work.html: ${FEATURED.length} featured, ${INDUSTRIES.length} industries (${INDUSTRIES.reduce((n, i) => n + i.builds.length, 0)} builds), ${MORE.length} more builds`);
