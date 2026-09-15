// WE_AINA · /work — the index of everything the studio has shipped.
//
// Why this page exists (founder, 2026-09-07): the site read as if the firm had
// only ever done one quarry project. The fix that research kept landing on is
// not a portfolio grid of screenshots, it is an INDEX: one line per build, with
// sector filter chips above it. The chips communicate range even when nobody
// clicks them, and the count in the furniture states the span.
//
// GENERATED FILE — site/work.html is output, never hand-edited (CLAUDE.md).
// Edit this generator and re-run:  node scripts/genwork.mjs
//
// ── Truth rules encoded here ────────────────────────────────────────────────
// 1. Every row is backed by a data file. Two sources only:
//      A. data/projects.json — the 20 curated programme entries (read at build
//         time, so the page grows when that file grows).
//      B. data/programme-briefs.md + data/portfolio-inventory.md — programmes
//         that are in the crawl but not yet curated into projects.json. These
//         are declared in EXTRA below, each carrying the brief/inventory row it
//         came from, so any claim on the page can be traced back to a line in a
//         data file.
// 2. NO CLIENT NAMES unless cleared. data/name-clearance.md has 41 blank
//    decisions; only RockProsUSA, WorkElate, CitiSense and Edunomics are
//    cleared (`named: true` in projects.json). Everything else renders as an
//    anonymised descriptor. Rows from EXTRA are anonymised by construction —
//    none of them carries a client name at all.
// 3. NO INVENTED NUMBERS. Per-row repository counts are deliberately NOT
//    rendered. The only hard numbers on the page are the ones already cleared
//    for the site: 13 quarry sites, -38% dispatch cycle, 2,140 invoices,
//    11,200 hours, 374 repositories, 34 products, 9 sectors, 2018-2026,
//    $30K-$100K. The one count set sitewide is 34 / 9 / 374 (brain-narrative §5).
// 4. Entries carrying `sourced: "founder-asserted..."` have no year and no
//    repository. They render as "undated" in the Years column, never a
//    guessed date (em dashes are banned in copy).
//
// ── Filter chips without JavaScript ─────────────────────────────────────────
// The chips are <label>s driving hidden radio inputs; the filtering is a CSS
// sibling selector. The page therefore filters with JS disabled, and the
// default state shows every row — so the verify gate's JS-off pass sees the
// full table (nothing is hidden by default, which is also why no row can be
// "invisible text" to that probe).
//
// ── Colour ─────────────────────────────────────────────────────────────────
// No literal colour values in this file. Everything is a var() against the
// site sheet, with a fallback to the token that exists today, so the page is
// correct both before and after the palette port lands in site/css/site.css.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const projects = JSON.parse(readFileSync(path.join(ROOT, "data", "projects.json"), "utf8")).projects;
const byId = Object.fromEntries(projects.map(p => [p.id, p]));

/* ─────────────────────────────────────────────── sector groups (the chips) --
   A group is a filter chip. Keeping the list short is the point: the chips are
   read, not clicked, so eight or nine legible sectors beat twenty accurate
   ones. `all` is not in the list; it is rendered first and always. */
const GROUPS = [
  ["industrial", "Industrial &amp; manufacturing"],
  ["commerce",   "Commerce &amp; marketplaces"],
  ["ai",         "AI &amp; data"],
  ["enterprise", "Enterprise systems"],
  ["service",    "Field &amp; service ops"],
  ["property",   "Property &amp; real estate"],
  ["education",  "Education"],
  ["media",      "Media &amp; culture"],
  ["own",        "Our own platform"]
];

/* ────────────────────────────────────── presentation facts for curated rows --
   group  = which chip the row answers to
   type   = the product-type column (the shape of the thing we built)
   title  = OVERRIDE only where projects.json `name` reads as a proper noun on
            an entry whose client is not name-cleared. Only one entry needs it:
            "the Deployer platform" is a product codename carried in the crawl,
            and a codename on a public page is a name we were not given. */
const FACET = {
  rockpros:           { group: "industrial", type: "Multi-app platform" },
  workelate:          { group: "own",        type: "Product suite" },
  citysense:          { group: "media",      type: "AI platform" },
  deployer:           { group: "enterprise", type: "Product suite", title: "A deployable business-app suite" },
  edtech:             { group: "education",  type: "Marketplace" },
  annotate:           { group: "ai",         type: "ML tooling" },
  fieldops:           { group: "service",    type: "Storefront and field apps" },
  riskdata:           { group: "ai",         type: "Data pipeline" },
  "altar-poetry":     { group: "media",      type: "Creative product" },
  "vc-enrichment":    { group: "ai",         type: "Data enrichment" },
  recommerce:         { group: "commerce",   type: "Mobile marketplace" },
  qms:                { group: "industrial", type: "Enterprise system" },
  innovation:         { group: "enterprise", type: "Enterprise SaaS" },
  grc:                { group: "enterprise", type: "Enterprise SaaS" },
  crm:                { group: "property",   type: "Native mobile CRM" },
  servicemgmt:        { group: "service",    type: "Operations system" },
  tally:              { group: "enterprise", type: "ERP connector" },
  "marketplace-rental": { group: "commerce", type: "Marketplace" },
  production:         { group: "industrial", type: "Operations system" },
  docai:              { group: "ai",         type: "Document AI" }
};

/* ─────────────────────────────────────────────────────── the display order --
   Deliberate, not alphabetical: the cleared, load-bearing programmes first,
   then depth. Any id in projects.json that is missing here is appended at the
   end rather than dropped, so the page cannot silently lose a programme. */
const ORDER = [
  "rockpros", "workelate", "production", "deployer", "edtech", "innovation",
  "grc", "recommerce", "annotate", "tally", "crm", "marketplace-rental",
  "qms", "citysense", "riskdata", "docai", "servicemgmt", "fieldops",
  "vc-enrichment", "altar-poetry"
];

/* ───────────────────────────────────── programmes not yet in projects.json --
   Every row cites the data file it was read out of. Descriptors only: not one
   of these carries a client name, because not one of the 41 rows in
   data/name-clearance.md has been decided. */
const EXTRA = [
  { title: "Home-buyer portal for a residential developer",
    note: "OTP login, construction progress in photographs, documents, invoices and payment schedules.",
    sector: "Property and real estate", type: "Mobile app", years: "2020-2021",
    group: "property", src: "programme-briefs.md #1" },

  { title: "Local deals and offers marketplace",
    note: "Merchants list offers by city and category; consumers browse, favourite and review.",
    sector: "Consumer marketplace", type: "Two-sided marketplace", years: "2019-2020",
    group: "commerce", src: "programme-briefs.md #6" },

  { title: "HRMS with project management",
    note: "Attendance and leave on one side, project, module and task breakdown on the other.",
    sector: "Human resources", type: "Enterprise system", years: "2020",
    group: "enterprise", src: "programme-briefs.md #7" },

  { title: "Guided cost estimator",
    note: "A multi-step wizard that returns a costed output with charts, rebuilt from Angular to React over its life.",
    sector: "Estimating and pricing", type: "Web product", years: "2019-2023",
    group: "enterprise", src: "programme-briefs.md #13" },

  { title: "Laundry operations platform",
    note: "Customer ordering, a collection-supervisor app for pickup rounds, and an admin console over one backend.",
    sector: "Consumer services", type: "Operations system", years: "2020",
    group: "service", src: "programme-briefs.md #15" },

  { title: "Field service and hospitality platform",
    note: "A customer app, a field-agent app and an admin console on a shared server.",
    sector: "Hospitality and field service", type: "Operations system", years: "2020",
    group: "service", src: "programme-briefs.md #16" },

  { title: "Charter route and availability dashboard",
    note: "An operator-facing dashboard for routes and availability in private aviation.",
    sector: "Aviation", type: "Operations dashboard", years: "2023",
    group: "service", src: "programme-briefs.md #17" },

  { title: "Augmented-reality application",
    note: "A Flutter AR build for iOS and Android with a content admin behind it.",
    sector: "Media and entertainment", type: "Mobile app", years: "2022",
    group: "media", src: "programme-briefs.md #18" },

  { title: "Shipment booking and tracking",
    note: "A booking and tracking backend with a customer-facing app beside it.",
    sector: "Logistics", type: "Operations system", years: "2020-2021",
    group: "service", src: "programme-briefs.md #19" },

  { title: "Distribution management system",
    note: "Distribution management for an energy and fuel distributor's dealer network.",
    sector: "Energy distribution", type: "Distribution system", years: "2019-2022",
    group: "industrial", src: "programme-briefs.md #20" },

  { title: "Content and document management builds",
    note: "Content and document management systems, delivered as a recurring programme.",
    sector: "Enterprise content", type: "Enterprise system", years: "2018-2020",
    group: "enterprise", src: "portfolio-inventory.md row 20" },

  { title: "SMS messaging platform",
    note: "A messaging platform and the application around it.",
    sector: "Communications", type: "Platform", years: "2018-2019",
    group: "enterprise", src: "portfolio-inventory.md row 27" },

  { title: "Online auction platform",
    note: "An auction site and its companion application, among the oldest work in the crawl.",
    sector: "Commerce", type: "Web product", years: "2018",
    group: "commerce", src: "portfolio-inventory.md row 37" },

  { title: "Social application",
    note: "A social application with its own backend service.",
    sector: "Consumer social", type: "Web product", years: "2023",
    group: "media", src: "portfolio-inventory.md row 32" }
];

/* ──────────────────────────────────────────────────────────── row assembly -- */
const esc = s => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
// The site's copy rules use a hyphen where a keyboard would; en-dash the spans.
const span = y => (y && y.trim()) ? esc(y).replace(/-/g, "–") : "undated";
// projects.json names are written as sentence fragments ("an AI annotation
// platform"); an index column wants them capitalised. Never touch anything but
// the first character, so "eBay" and "iOS" inside a title stay correct.
const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;

const ids = [...ORDER.filter(id => byId[id]), ...projects.map(p => p.id).filter(id => !ORDER.includes(id))];
const curated = ids.map(id => {
  const p = byId[id];
  const f = FACET[id] || {};
  if (!f.group) throw new Error(`genwork: no facet for projects.json id "${id}" — add it to FACET`);
  return {
    title: cap(f.title || p.name),
    note: p.headline,
    sector: p.sector,
    type: f.type,
    years: p.years,
    group: f.group,
    named: !!p.named,
    src: "projects.json:" + id
  };
});

const ROWS = [...curated, ...EXTRA.map(r => ({ ...r, named: false }))];

// Invariant, not instance: no row may print a client name that is not cleared.
// The cleared names are exactly those carrying `named: true` in projects.json.
const CLEARED = new Set(projects.filter(p => p.named).map(p => p.name));
for (const r of ROWS) {
  if (r.named && !CLEARED.has(r.title))
    throw new Error(`genwork: "${r.title}" is rendered as a name but is not name-cleared`);
}
const counts = Object.fromEntries(GROUPS.map(([k]) => [k, ROWS.filter(r => r.group === k).length]));
for (const [k, label] of GROUPS)
  if (!counts[k]) throw new Error(`genwork: chip "${label}" (${k}) would filter to zero rows`);

/* ────────────────────────────────────────────────────────────── the markup -- */
const pad = n => String(n).padStart(3, "0");

const chips = [
  `<input class="wk-radio" type="radio" name="wk-sector" id="wk-all" checked>`,
  ...GROUPS.map(([k]) => `<input class="wk-radio" type="radio" name="wk-sector" id="wk-${k}">`)
].join("\n  ");

const chipLabels = [
  `<label class="wk-chip" for="wk-all">All work <span class="wk-n">${ROWS.length}</span></label>`,
  ...GROUPS.map(([k, label]) => `<label class="wk-chip" for="wk-${k}">${label} <span class="wk-n">${counts[k]}</span></label>`)
].join("\n      ");

const rows = ROWS.map((r, i) => `      <tr class="wk-row wk-g-${r.group}">
        <td class="wk-num">${pad(i + 1)}</td>
        <td class="wk-title">${esc(r.title)}<span class="wk-note">${esc(r.note)}</span></td>
        <td class="wk-sector">${esc(r.sector)}</td>
        <td class="wk-kind">${esc(r.type)}</td>
        <td class="wk-yr">${span(r.years)}</td>
      </tr>`).join("\n");

// Generated CSS: one pair of rules per chip. Adding a sector to GROUPS is a
// data change; nothing here is per-app hand-maintained.
const filterCss = GROUPS.map(([k]) =>
  `#wk-${k}:checked ~ .wk-index .wk-row:not(.wk-g-${k}){display:none}\n` +
  `#wk-${k}:checked ~ .wk-chips label[for="wk-${k}"]{background:var(--accent,var(--blue));border-color:var(--accent,var(--blue));color:var(--sheet,var(--paper))}\n` +
  `#wk-${k}:focus-visible ~ .wk-chips label[for="wk-${k}"]{outline:2px solid var(--accent,var(--blue));outline-offset:2px}`
).join("\n");

const itemList = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "The index of work, WE_AINA",
  description: `One line per build. ${ROWS.length} products across 9 sectors, drawn from 374 repositories shipped between 2018 and 2026.`,
  url: "https://aina.workelate.com/studio/work",
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: ROWS.length,
    itemListOrder: "https://schema.org/ItemListUnordered",
    itemListElement: ROWS.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: r.title,
      description: r.note
    }))
  }
};

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>The index of work, every build since 2018, WE_AINA</title>
<meta name="description" content="One line per build. ${ROWS.length} products across 9 sectors, drawn from 374 repositories shipped between 2018 and 2026.">
<link rel="preload" as="font" type="font/woff2" href="/fonts/worksans-var-latin.woff2" crossorigin fetchpriority="high">
<link rel="stylesheet" href="/css/site.css">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="canonical" href="https://aina.workelate.com/studio/work">
<meta property="og:type" content="website">
<meta property="og:title" content="The index of work, every build since 2018, WE_AINA">
<meta property="og:description" content="One line per build. ${ROWS.length} products across 9 sectors, drawn from 374 repositories shipped between 2018 and 2026.">
<meta property="og:image" content="https://aina.workelate.com/og.png">
<meta property="og:url" content="https://aina.workelate.com/studio/work">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
${JSON.stringify(itemList, null, 2)}
</script>
<style>
/* /work, page-scoped. Colours are tokens only: var(--x, <existing token>) so
   the page is correct before and after the palette port lands in site.css. */
.wk-lede{max-width:56ch;font-size:19px;line-height:1.55}
.wk-facts{display:grid;grid-template-columns:auto 1fr;gap:7px 20px;font-family:var(--mono);font-size:12.5px;margin-top:10px;border-left:1px solid var(--rule,rgba(10,24,48,.14));padding-left:26px}
.wk-facts dt{font-weight:600;letter-spacing:.02em}
.wk-facts dd{color:var(--muted,rgba(10,24,48,.62))}
.wk-head{display:grid;grid-template-columns:1fr 300px;gap:56px;align-items:start}

.wk-receipts{border-top:1px solid var(--ink);border-bottom:1px solid var(--rule,rgba(10,24,48,.14));background:var(--sheet,var(--paper))}
.wk-receipts .wrap{display:grid;grid-template-columns:repeat(4,1fr);gap:0}
.wk-rc{padding:28px 26px 28px 0;border-right:1px solid var(--rule,rgba(10,24,48,.14))}
.wk-rc:last-child{border-right:0;padding-right:0}
.wk-rc b{display:block;font-family:var(--display);font-weight:500;font-size:42px;line-height:1;letter-spacing:-.02em}
.wk-rc b.wk-delta{color:var(--accent,var(--blue))}
.wk-rc p{font-size:13px;line-height:1.5;color:var(--muted,rgba(10,24,48,.62));margin-top:10px;max-width:28ch}

.wk-sec-head{display:flex;align-items:flex-end;justify-content:space-between;gap:40px;border-bottom:1px solid var(--ink);padding-bottom:16px}
.wk-sec-head h2{margin:0}
.wk-sec-head p{font-size:14px;line-height:1.5;color:var(--muted,rgba(10,24,48,.62));max-width:36ch;padding-bottom:5px}

.wk-radio{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0}
.wk-chips{display:flex;gap:8px;flex-wrap:wrap;margin:24px 0 4px}
.wk-chip{font-family:var(--mono);font-size:11px;letter-spacing:.07em;text-transform:uppercase;padding:7px 13px;border:1px solid var(--rule,rgba(10,24,48,.2));border-radius:999px;color:var(--muted,rgba(10,24,48,.62));cursor:pointer;user-select:none;transition:color .18s,border-color .18s,background .18s}
.wk-chip:hover{color:var(--accent,var(--blue));border-color:var(--accent,var(--blue))}
.wk-chip .wk-n{opacity:.55;margin-left:5px}
#wk-all:focus-visible ~ .wk-chips label[for="wk-all"]{outline:2px solid var(--accent,var(--blue));outline-offset:2px}
#wk-all:checked ~ .wk-chips label[for="wk-all"]{background:var(--ink);border-color:var(--ink);color:var(--sheet,var(--paper))}
${filterCss}

.wk-index{width:100%;border-collapse:collapse;margin-top:10px}
.wk-index th{font-family:var(--mono);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted,rgba(10,24,48,.62));text-align:left;font-weight:400;padding:14px 14px 12px 0;border-bottom:1px solid var(--rule,rgba(10,24,48,.14))}
.wk-index th.wk-yr{text-align:right;padding-right:0}
.wk-index td{padding:18px 14px 18px 0;border-bottom:1px solid var(--rule,rgba(10,24,48,.14));vertical-align:baseline;font-size:15px}
.wk-index tr:hover td{background:var(--tint,rgba(11,95,255,.05))}
.wk-num{font-family:var(--mono);font-size:11px;color:var(--muted,rgba(10,24,48,.62));width:54px}
.wk-title{font-weight:600;width:36%;line-height:1.35}
.wk-note{display:block;font-weight:400;font-size:13px;line-height:1.45;color:var(--muted,rgba(10,24,48,.62));margin-top:5px;max-width:52ch}
.wk-sector{color:var(--muted,rgba(10,24,48,.62));font-size:14px;width:21%}
.wk-kind{font-family:var(--mono);font-size:11px;letter-spacing:.05em;text-transform:uppercase;color:var(--muted,rgba(10,24,48,.62));width:19%}
td.wk-yr{font-family:var(--mono);font-size:11.5px;color:var(--muted,rgba(10,24,48,.62));text-align:right;white-space:nowrap;padding-right:0}
.wk-foot{display:flex;justify-content:space-between;align-items:baseline;gap:24px;margin-top:20px;font-family:var(--mono);font-size:12px;color:var(--muted,rgba(10,24,48,.62));flex-wrap:wrap}
.wk-note-clearance{margin-top:40px;padding-top:22px;border-top:1px solid var(--rule,rgba(10,24,48,.14));font-size:14px;line-height:1.6;color:var(--muted,rgba(10,24,48,.62));max-width:70ch}

@media (max-width:900px){
  .wk-head{grid-template-columns:1fr;gap:30px}
  .wk-facts{border-left:0;border-top:1px solid var(--rule,rgba(10,24,48,.14));padding-left:0;padding-top:22px;justify-content:start}
  .wk-receipts .wrap{grid-template-columns:1fr 1fr}
  .wk-rc{padding:20px 18px 20px 0}
  .wk-rc:nth-child(2n){border-right:0;padding-right:0}
  .wk-rc:nth-child(-n+2){border-bottom:1px solid var(--rule,rgba(10,24,48,.14))}
  .wk-rc b{font-size:34px}
  .wk-sec-head{display:block}
  .wk-sec-head p{margin-top:12px;max-width:none;padding-bottom:0}
  .wk-chip{font-size:10px;padding:6px 10px;letter-spacing:.06em}
  .wk-chips{gap:6px;margin:20px 0 2px}
  .wk-index thead{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
  .wk-index tr{display:grid;grid-template-columns:40px 1fr;border-bottom:1px solid var(--rule,rgba(10,24,48,.14));padding:15px 0}
  .wk-index td{border:0;padding:0;width:auto}
  .wk-index tr:hover td{background:none}
  .wk-num{grid-row:span 4;padding-top:2px}
  .wk-title{font-size:16px}
  .wk-note{margin-top:3px;max-width:none}
  .wk-sector{margin-top:7px;font-size:13px;line-height:1.35}
  .wk-kind{margin-top:5px;font-size:10px}
  td.wk-yr{text-align:left;margin-top:4px;font-size:11px}
  .wk-foot{display:block}
  .wk-foot span+span{display:block;margin-top:6px}
}
</style>
<noscript><style>.rv{opacity:1!important;transform:none!important}</style></noscript>
</head>
<body>

<header class="nav"><div class="wrap row">
  <a class="logo" href="/">WE_<span>AINA</span></a>
  <button class="nav-toggle" aria-expanded="false" aria-controls="navmenu"><span class="sr-only">Menu</span><span></span><span></span><span></span></button>
  <nav id="navmenu">
    <a href="/studio/how-we-work">How we work</a>
    <a href="/studio/about">About</a>
    <a href="/studio/case-studies">Case studies</a>
    <a href="/studio/blog">Blog</a>
    <a href="/studio/systems/quarry-dispatch-automation">Systems</a>
    <a class="btn" href="/studio/contact">Book a Diagnostic Sprint</a>
  </nav>
</div></header>

<main id="main">

<section class="page-hero">
  <div class="wrap">
    <span class="label">The index of work, 2018 to 2026</span>
    <div class="wk-head">
      <div>
        <h1>Your next build is<br>probably <span class="accent">already built.</span></h1>
        <p class="sub dim wk-lede">34 products across 9 sectors, drawn from 374 repositories since 2018, from dispatch systems to a home-buyer portal.</p>
        <p class="hero-cta"><a class="btn" href="/studio/contact">Book a Diagnostic Sprint</a></p>
              </div>
      <dl class="wk-facts">
        <dt>Span</dt><dd>2018 to 2026</dd>
        <dt>Shipped</dt><dd>374 repositories</dd>
        <dt>Products</dt><dd>34, across 9 sectors</dd>
        <dt>Engagement</dt><dd>$30K to $100K fixed</dd>
        <dt>Platform</dt><dd>WorkElate</dd>
      </dl>
    </div>
  </div>
</section>

<section class="wk-receipts">
  <div class="wrap">
    <div class="wk-rc"><b>13</b><p>quarry sites on one dispatch system.</p></div>
    <div class="wk-rc"><b class="wk-delta">-38%</b><p>dispatch cycle time, order to confirmed truck.</p></div>
    <div class="wk-rc"><b>2,140</b><p>invoices issued with zero manual touches.</p></div>
    <div class="wk-rc"><b>11,200</b><p>operations hours returned in the first year.</p></div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="wk-sec-head">
      <h2>One line per build</h2>
      <p>The range is the argument, including the one platform of our own that our delivery runs on.</p>
    </div>

    ${chips}
    <div class="wk-chips">
      ${chipLabels}
    </div>

    <table class="wk-index">
      <thead><tr>
        <th class="wk-num" scope="col">No.</th>
        <th scope="col">Build</th>
        <th scope="col">Sector</th>
        <th scope="col">Type</th>
        <th class="wk-yr" scope="col">Years</th>
      </tr></thead>
      <tbody>
${rows}
      </tbody>
    </table>

    <p class="wk-foot"><span>${ROWS.length} products shown, drawn from 374 repositories, 2018 to 2026.</span><span>Two entries are not yet matched to a repository, so they are undated.</span></p>

    <p class="wk-note-clearance">Client names appear only where the client has cleared them: RockProsUSA, WorkElate, CitiSense and Edunomics. For the detail behind any line, ask in the Sprint and we will walk you through the code.</p>
    <p class="dim srcnote">Updated 15 September 2026 &middot; WE_AINA</p>
  </div>
</section>

<section id="cta" class="deep">
  <div class="wrap">
    <h2>Book a Diagnostic Sprint</h2>
    <p class="dim">Thirty-four builds are on this page; the Sprint scopes and prices the thirty-fifth.</p>
    <p style="margin-top:24px"><a class="btn" href="/studio/contact">Book a Diagnostic Sprint</a></p>
  </div>
</section>

</main>

<footer class="mega">
  <div class="wrap">
    <div class="cols">
      <div class="brand">
        <a class="logo" href="/">WE_<span>AINA</span></a>
        <p>An AI-native product studio. WorkElate's AI-Native Agency: our delivery runs on our own platform, products shipped in weeks not quarters, $30K–$100K fixed, receipts at every step.</p>
      </div>
      <div>
        <div class="fh">Company</div>
        <a href="/studio/about">About us</a>
        <a href="/studio/how-we-work">How we work</a>
        <a href="/studio/case-studies">Case studies</a>
        <a href="/studio/blog">Blog</a>
      </div>
      <div>
        <div class="fh">Systems</div>
        <a href="/studio/systems/quarry-dispatch-automation">Dispatch automation</a>
        <a href="/studio/systems/plant-production-reporting">Production reporting</a>
        <a href="/studio/systems/dealer-order-management">Order management</a>
        <a href="/studio/systems/freight-reconciliation">Freight reconciliation</a>
        <a href="/studio/systems/ar-followup-automation">AR follow-up</a>
        <a href="/studio/systems/compliance-documentation">Compliance documentation</a>
      </div>
      <div>
        <div class="fh">Engage</div>
        <a href="/studio/contact">Book a Diagnostic Sprint</a>
        <a href="/studio/how-we-work">The Diagnostic Sprint</a>
        <a href="mailto:chitransh@workelate.com">chitransh@workelate.com</a>
        <a href="/studio/blog/receipts-over-decks">Receipts over decks</a>
      </div>
    </div>
    <div class="baseline">
      <span>© 2026 WE_AINA · WorkElate's AI-Native Agency · Chitransh &amp; Pratik</span>
    </div>
  </div>
</footer>
<script src="/js/nav.js" defer></script>
<script type="module" src="/js/reveal.js"></script>
</body>
</html>
`;

writeFileSync(path.join(ROOT, "site", "studio", "work.html"), html);

// sitemap.xml is derived from site/ by scripts/gensitemap.mjs; nothing to add here.

console.log(`wrote site/work.html — ${ROWS.length} rows (${curated.length} from data/projects.json, ${EXTRA.length} from data/programme-briefs.md + data/portfolio-inventory.md), ${GROUPS.length} sector chips`);
