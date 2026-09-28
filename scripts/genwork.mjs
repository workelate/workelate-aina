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
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const projects = JSON.parse(readFileSync(path.join(ROOT, "data", "projects.json"), "utf8")).projects;
const byId = Object.fromEntries(projects.map(p => [p.id, p]));

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
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
const yrs = y => (y && y.trim()) ? y.trim().replace(/^(\d{4})-(\d{4})$/, "$1 to $2") : "";
const CASE_RP = "/studio/case-studies/rockprosusa";

// A projects.json entry as a card: the descriptor when the client is not cleared.
function fromProject(id, over = {}) {
  const p = byId[id];
  if (!p) throw new Error(`genwork: projects.json has no id "${id}"`);
  return { id, title: cap(p.name), line: /[.!?]$/.test(p.headline) ? p.headline : p.headline + ".", years: yrs(p.years), named: !!p.named, ...over };
}

/* ───────────────────────────────────────────────────────────── featured -- */
const FEATURED = [
  { ...fromProject("rockpros", { title: "RockProsUSA" }),
    wide: true, tag: "Building materials and dispatch",
    line: "13 quarries on one dispatch system. 2,140 invoices with zero manual touches in the first year.",
    img: "rockpros-dispatch-board.webp", phone: "rockpros-driver-loads-phone.webp",
    phoneAlt: "RockProsUSA driver app on a phone, showing an open load",
    alt: "RockProsUSA dispatch board listing open jobs by delivery date, customer and trucker",
    href: CASE_RP, cta: "Read the case study" },
  { ...fromProject("citysense", { title: "CitySense" }),
    tag: "OOH and digital billboards",
    line: "AI plans, schedules and runs billboard campaigns. Live with agencies and display teams in Mexico.",
    img: "citysense-planner-map.webp",
    alt: "CitySense AI planner: a map of Mexico City with the billboard screens chosen for a campaign" },
  { id: "citedspy", title: "CitedSpy", years: "2026", tag: "SEO and AI search",
    line: "Shows whether AI answers recommend your brand, and which sources they cite.",
    img: "citedspy-dashboard.webp",
    alt: "CitedSpy overview: an AI visibility score, mention rate over time and share of voice" },
  { ...fromProject("workelate"), tag: "Our own product",
    title: "WorkElate",
    line: "An AI-native office suite we build on and sell from. Our own delivery runs on it.",
    img: "workelate-chief-hero.webp", fit: true,
    alt: "WorkElate Chief reading a pipeline sheet and drafting an email that waits for a yes",
    href: "/brain", cta: "See the product" },
  { id: "infinitie", title: "infinitie", years: "2026", tag: "Private networks",
    line: "An invite-only network for operators, where every intro is vouched for.",
    img: "infinitie-room.webp",
    alt: "infinitie member room: intros this week, a twelve-week intro chart and open asks" }
];

/* ─────────────────────────────────────────────────────── six industries -- */
// Each build maps to exactly one industry, and only where the data says so.
const INDUSTRIES = [
  { k: "building-materials", name: "Building materials", photo: "photo-ind-quarry-4x3.webp",
    alt: "Terraced quarry face with an excavator at its base",
    builds: [
      fromProject("rockpros", { title: "RockProsUSA", img: "rockpros-customer-po.webp",
        alt: "RockProsUSA customer portal: purchase orders, ordered against delivered",
        line: "Customer, trucker and driver apps and an admin console, across 13 quarry sites.",
        href: CASE_RP, cta: "Read the case study" })
    ] },
  { k: "logistics", name: "Logistics and dispatch", photo: "photo-ind-logistics-4x3.webp",
    alt: "Aerial view of semi-trailers parked in angled bays at a truck yard",
    builds: [
      { title: "Freight reconciliation", years: "", sector: "Logistics, India",
        line: "Carrier bills matched to the weighbridge ticket. Clean lines clear on their own; disputes arrive with the evidence.",
        href: "/studio/systems/freight-reconciliation", cta: "See the system" },
      { title: "Shipment booking and tracking", years: "2020 to 2021",
        line: "A booking and tracking backend with a customer app beside it." },
      { title: "Distribution management", years: "2019 to 2022",
        line: "Dealer-network distribution for an energy and fuel distributor." }
    ] },
  { k: "ooh", name: "OOH and digital billboards", photo: "photo-ind-ooh-4x3.webp",
    alt: "City street at dusk with a large digital billboard on a corner building",
    builds: [
      fromProject("citysense", { title: "CitySense", img: "citysense-live-campaign.webp",
        alt: "CitySense running campaign: live impressions, pacing and screens",
        line: "Campaigns planned by AI and scheduled across physical and digital screens." })
    ] },
  { k: "fintech", name: "Fintech", photo: "photo-ind-fintech-4x3.webp",
    alt: "People at desktop monitors showing charts and data dashboards",
    builds: [
      fromProject("riskdata", { title: "Risk and financial data pipelines" }),
      fromProject("tally", { title: "ERP and finance connector" }),
      fromProject("vc-enrichment", { title: "Deal data for a venture firm" })
    ] },
  { k: "manufacturing", name: "Manufacturing", photo: "photo-ind-manufacturing-4x3.webp",
    alt: "Automated production line on a clean factory floor",
    builds: [
      fromProject("production"),
      fromProject("qms")
    ] },
  { k: "recommerce", name: "Re-commerce and retail", photo: "photo-ind-recommerce-4x3.webp",
    alt: "Bright warehouse with white racking and palletised cartons",
    builds: [
      fromProject("recommerce"),
      fromProject("fieldops", { title: "Storefronts and field apps" }),
      { title: "Local offers marketplace", years: "2019 to 2020",
        line: "Merchants list offers by city; shoppers browse, save and review." }
    ] }
];

/* ─────────────────────────────────────────────────────────── more builds -- */
const MORE = [
  fromProject("edtech", { title: "Edunomics Scholar", tag: "Education" }),
  fromProject("deployer", { title: "A deployable business-app suite", tag: "SaaS" }),
  fromProject("annotate", { title: "AI annotation platform", tag: "Machine learning" }),
  fromProject("docai", { tag: "Legal technology" }),
  fromProject("innovation", { tag: "Corporate innovation" }),
  fromProject("grc", { tag: "Governance and risk" }),
  fromProject("crm", { title: "Native field-sales CRM", tag: "Real estate" }),
  { title: "Home-buyer portal", years: "2020 to 2021", tag: "Real estate",
    line: "Construction progress in photographs, documents and payment schedules." },
  fromProject("servicemgmt", { tag: "Service operations" }),
  fromProject("marketplace-rental", { tag: "Equipment rental" }),
  { title: "Charter availability dashboard", years: "2023", tag: "Aviation",
    line: "Routes and availability for a private aviation operator." },
  fromProject("altar-poetry", { title: "Altar poetry", tag: "Culture, Mexico" })
];

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
