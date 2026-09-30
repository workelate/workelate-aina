// Case-studies index generated from data/cases.json, founder adds entries
// there; never hand-edit site/studio/case-studies/index.html.
//
// 2026-09-15: template brought level with the page that was on disk (og tags,
// JSON-LD, linked cards) so a regeneration no longer regresses it, and the copy
// brought onto the Brain's vocabulary (content audit rows 1, 8, 9, 23). A card
// carrying `href` renders as a link; JSON-LD is derived from the same rows.
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const OUT = path.join(ROOT, "site", "studio", "case-studies");
mkdirSync(OUT, { recursive: true });

const { cases } = JSON.parse(readFileSync(path.join(ROOT, "data", "cases.json"), "utf8"));

const DESC = "Case studies with the numbers before and after: 13 quarries on one dispatch system, 256K organic clicks for a SaaS platform, 379K impressions in Google's AI answers.";

const card = c => {
  const img = c.img ? `
      <figure class="case-img${c.imgFit === "contain" ? " case-img--shot" : ""}"><img src="${c.img}" alt="${c.imgAlt || ""}" loading="lazy" decoding="async"></figure>` : "";
  const inner = `${img}
      <div>
        <span class="ctag">${c.tag}${c.anonymous ? " · client name under NDA" : ""}</span>
        <h3>${c.title}</h3>
        <p class="dim">${c.summary}</p>${c.href ? `
        <span class="ctag" style="display:inline-block;margin-top:16px">${c.hrefLabel || "Read more"} &rarr;</span>` : ""}
      </div>
      <div class="cnum">${c.metric}<small>${c.metricLabel}</small></div>`;
  const cls = `case rv${c.img ? " has-img" : ""}${c.status === "placeholder" ? " placeholder" : ""}`;
  return c.href
    ? `\n    <a class="${cls}" href="${c.href}" style="text-decoration:none">${inner}\n    </a>`
    : `\n    <div class="${cls}">${inner}\n    </div>`;
};

const itemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "WE_AINA case studies",
  itemListElement: cases.filter(c => c.href).map((c, i) => ({
    "@type": "ListItem", position: i + 1, name: c.title, url: `https://aina.workelate.com${c.href}`
  }))
};

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Case studies, the numbers that moved, WE_AINA</title>
<meta name="description" content="${DESC}">
<link rel="stylesheet" href="/css/site.css">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="canonical" href="https://aina.workelate.com/studio/case-studies">
<meta property="og:type" content="website">
<meta property="og:title" content="Case studies, the numbers that moved, WE_AINA">
<meta property="og:description" content="${DESC}">
<meta property="og:image" content="https://aina.workelate.com/og.png">
<meta property="og:url" content="https://aina.workelate.com/studio/case-studies">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "WE_AINA case studies",
  description: DESC,
  url: "https://aina.workelate.com/studio/case-studies"
}, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(itemList, null, 2)}
</script>
<noscript><style>.rv{opacity:1!important;transform:none!important}</style></noscript>
</head>
<body>

<header class="nav"><div class="wrap row">
  <a class="logo" href="/">WE_<span>AINA</span></a>
  <nav>
    <a href="/studio/how-we-work">How we work</a>
    <a href="/studio/about">About</a>
    <a href="/studio/case-studies" aria-current="page">Case studies</a>
    <a href="/studio/blog">Blog</a>
    <a href="/studio/systems">Systems</a>
    <a class="btn" href="/studio/contact">Book a call</a>
  </nav>
</div></header>

<main id="main">

<section class="page-hero">
  <div class="wrap">
    <span class="label">Case studies</span>
    <h1>The builds we can put<br><span class="accent">numbers</span> against.</h1>
    <p class="sub dim">Each card names the operation before, what the Brain now does inside it, and the number that moved.</p>
    <p class="hero-cta"><a class="btn" href="/studio/contact">Book a call</a></p>
  </div>
</section>

<section>
  <div class="wrap">
    <h2 style="margin-bottom:16px">One card per build, with the number.</h2>
    <p class="dim" style="margin-bottom:32px">The Southwest quarries case is measured over its first twelve months; the two search cases are measured in the client's own Google Search Console; the rest are described, and named only where the client has cleared it.</p>
${cases.map(card).join("\n")}
    <p class="dim srcnote">Updated 30 September 2026 &middot; WE_AINA</p>
  </div>
</section>

<section id="cta" class="deep">
  <div class="wrap">
    <h2>Book a call</h2>
    <p class="dim">Every card above began with one conversation; yours starts the same way.</p>
    <p style="margin-top:24px"><a class="btn" href="/studio/contact">Book a call</a></p>
  </div>
</section>

</main>

<footer class="mega">
  <div class="wrap">
    <div class="cols">
      <div class="brand">
        <a class="logo" href="/">WE_<span>AINA</span></a>
        <p>WorkElate's AI-Native Agency: our delivery runs on our own platform, products shipped in weeks not quarters.</p>
      </div>
    </div>
    <div class="baseline">
      <span>© 2026 WE_AINA · WorkElate's AI-Native Agency</span>
    </div>
  </div>
</footer>
<script src="/js/nav.js" defer></script>
<script type="module" src="/js/reveal.js"></script>
</body>
</html>`;

writeFileSync(path.join(OUT, "index.html"), html);
console.log(`wrote case-studies index with ${cases.length} entries`);

/* ------------------------------------------------------------ story pages -- */
// 2026-09-28 (founder: "ek sundar page", image-led, Apple / Metalab grade).
// A case carrying `story` in data/cases.json gets its own page at
// /studio/case-studies/<story.slug>, rendered here from that data. The layout
// is generic: any case that supplies the same fields gets the same page, so a
// second story is a data change, not a template change. Styles live in
// site/css/case.css. Photos with a `-2400` / `-1200` pair are served by srcset.
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const photo = (p, cls, sizes, eager) => `<img class="${cls}" src="${p.img}-1200.webp" srcset="${p.img}-1200.webp 1200w, ${p.img}-2400.webp 2400w" sizes="${sizes}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}"${eager ? ' fetchpriority="high" decoding="async"' : ' loading="lazy" decoding="async"'}>`;
const shot = (s, cls = "") => `<figure class="cs-shot${cls}">
        <img src="${s.img}" width="${s.w}" height="${s.h}" alt="${esc(s.alt)}" loading="lazy" decoding="async">
        <figcaption>${esc(s.cap)}</figcaption>
      </figure>`;

const storyPage = (c) => {
  const s = c.story;
  const url = `https://aina.workelate.com/studio/case-studies/${s.slug}`;
  const ogImg = `https://aina.workelate.com${s.hero.img}-1200.webp`;
  const article = {
    "@context": "https://schema.org", "@type": "Article",
    headline: s.title, description: s.description,
    datePublished: s.published, dateModified: s.modified,
    author: { "@type": "Organization", name: "WE_AINA" },
    publisher: { "@type": "Organization", name: "WE_AINA", url: "https://aina.workelate.com/" },
    image: ogImg, mainEntityOfPage: url
  };
  const crumbs = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Case studies", item: "https://aina.workelate.com/studio/case-studies" },
      { "@type": "ListItem", position: 2, name: s.crumb, item: url }
    ]
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(s.title)}, WE_AINA</title>
<meta name="description" content="${esc(s.description)}">
<link rel="stylesheet" href="/css/site.css">
<link rel="stylesheet" href="/css/case.css">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="canonical" href="${url}">
<link rel="preload" as="image" href="${s.hero.img}-1200.webp" imagesrcset="${s.hero.img}-1200.webp 1200w, ${s.hero.img}-2400.webp 2400w" imagesizes="100vw">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(s.title)}">
<meta property="og:description" content="${esc(s.description)}">
<meta property="og:image" content="${ogImg}">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
${JSON.stringify(article, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(crumbs, null, 2)}
</script>
<noscript><style>.rv{opacity:1!important;transform:none!important}</style></noscript>
</head>
<body class="cs-story">

<!-- NAV:start -->
<header class="nav"></header>
<!-- NAV:end -->

<main id="main">

<section class="cs-hero">
  ${photo(s.hero, "cs-hero-img", "100vw", true)}
  <div class="wrap cs-hero-copy">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/studio/case-studies">Case studies</a> / ${esc(s.crumb)}</nav>
    <h1>${s.hero.h1}</h1>
    <p class="cs-hero-sub">${esc(s.hero.sub)}</p>
    <p class="cs-hero-cta"><a class="btn" href="/studio/contact">Book a call</a></p>
  </div>
</section>

<section class="cs-intro">
  <div class="wrap cs-intro-grid">
    <div>
      <span class="label">${esc(s.client.eyebrow)}</span>
      <h2>${esc(s.client.h2)}</h2>
      ${s.client.lines.map(l => `<p class="cs-lede">${esc(l)}</p>`).join("\n      ")}
    </div>
    <ul class="cs-stones" aria-label="Rock colours">
      ${s.client.stones.map(t => `<li><img src="${t.img}" width="600" height="400" alt="${esc(t.name)} decorative rock, close up" loading="lazy" decoding="async"><span>${esc(t.name)}</span></li>`).join("\n      ")}
    </ul>
  </div>
</section>

<section class="cs-before">
  <div class="wrap">
    <span class="label">${esc(s.before.eyebrow)}</span>
    <h2>${esc(s.before.h2)}</h2>
    ${s.before.lines.map(l => `<p class="cs-lede">${esc(l)}</p>`).join("\n    ")}
  </div>
</section>

<section class="cs-built">
  <div class="wrap">
    <span class="label">${esc(s.built.eyebrow)}</span>
    <h2>${esc(s.built.h2)}</h2>
    <p class="cs-lede">${esc(s.built.sub)}</p>
    <div class="cs-screens">
      ${shot(s.built.main, " cs-shot-main")}
      <div class="cs-pair">
      ${s.built.pair.map(p => shot(p)).join("\n      ")}
      </div>
    </div>
  </div>
</section>

<section class="cs-band" aria-label="${esc(s.band.line)}">
  <img src="${s.band.img}" width="${s.band.w}" height="${s.band.h}" alt="${esc(s.band.alt)}" loading="lazy" decoding="async">
  <p class="wrap">${esc(s.band.line)}</p>
</section>

<section class="cs-numbers">
  ${photo(s.numbers, "cs-numbers-img", "100vw", false)}
  <div class="wrap cs-numbers-copy">
    <span class="label">${esc(s.numbers.eyebrow)}</span>
    <h2>${esc(s.numbers.h2)}</h2>
    <ul class="cs-stats">
      ${s.numbers.items.map(i => `<li><span class="cs-n">${esc(i.n)}</span><span class="cs-t">${esc(i.t)}</span></li>`).join("\n      ")}
    </ul>
  </div>
</section>

<section class="cs-apps">
  <div class="wrap">
    <span class="label">${esc(s.apps.eyebrow)}</span>
    <h2>${esc(s.apps.h2)}</h2>
    <p class="cs-lede">${esc(s.apps.sub)}</p>
    <ul class="cs-phones">
      ${s.apps.items.map(a => `<li>
        <div class="cs-phone"><img src="${a.shot}" width="645" height="1401" alt="${esc(a.alt)}" loading="lazy" decoding="async"></div>
        <div class="cs-app">
          <img class="cs-icon" src="${a.icon}" width="160" height="160" alt="" aria-hidden="true" loading="lazy">
          <div><h3>${esc(a.name)}</h3><p>${esc(a.tag)}</p>${a.href ? `<a href="${a.href}" rel="noopener" target="_blank">View on the App Store</a>` : ""}</div>
        </div>
      </li>`).join("\n      ")}
    </ul>
  </div>
</section>

<section class="cs-steps">
  <div class="wrap">
    <span class="label">${esc(s.steps.eyebrow)}</span>
    <h2>${esc(s.steps.h2)}</h2>
    <ol class="cs-steplist">
      ${s.steps.items.map(i => `<li><span class="cs-k">${esc(i.k)}</span><h3>${esc(i.h)}</h3><p>${esc(i.t)}</p></li>`).join("\n      ")}
    </ol>
    <p class="cs-related">The same systems, written up: ${s.related.map(r => `<a href="${r.href}">${esc(r.label)}</a>`).join(" · ")}</p>
  </div>
</section>

<section id="cta" class="cs-cta">
  <div class="wrap">
    <h2>Book a call</h2>
    <p class="cs-lede">${esc(s.cta)}</p>
    <p class="cs-cta-row"><a class="btn" href="/studio/contact">Book a call</a> <a class="cs-back" href="/studio/case-studies">All case studies</a></p>
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
};

for (const c of cases.filter(c => c.story)) {
  writeFileSync(path.join(OUT, `${c.story.slug}.html`), storyPage(c));
  console.log(`wrote case study /studio/case-studies/${c.story.slug}`);
}

/* ---------------------------------------------------------- insight pages -- */
// 2026-09-30. The story layout above is photo-led and needs a client's own
// photography. A case that is anonymous (numbers under NDA, no photos) carries
// `insight` instead: a light hero with one product window, a black numbers
// chapter, then a list of sections, each one of five generic kinds. Grounds
// alternate white / #f5f5f7 by position, so the data never picks a colour.
//
//   window  { kind:"metrics", tiles:[{k,n,d}], bars:{title,items:[{k,n,v}]}, cap }
//         | { kind:"shot", img, w, h, alt, cap }
//   section kinds: "table" {head:[..], rows:[[..]], caption}
//                  "steps" {items:[{k,h,t}]}
//                  "cards" {items:[{n?,h,t}]}          (n: an optional big figure)
//                  "shot"  {shot:{img,w,h,alt,cap}, items?:[{h,t}]}
//                  "prose" {}                          (eyebrow, h2, lines only)
const insightWindow = w => w.kind === "shot"
  ? `<figure class="ci-window ci-shot">
      <img src="${w.img}" width="${w.w}" height="${w.h}" alt="${esc(w.alt)}" fetchpriority="high" decoding="async">
      <figcaption>${esc(w.cap)}</figcaption>
    </figure>`
  : `<figure class="ci-window">
      <div class="ci-panel" role="img" aria-label="${esc(w.aria)}">
        <div class="ci-tiles">
          ${w.tiles.map(t => `<div class="ci-tile"><span class="ci-tk">${esc(t.k)}</span><span class="ci-tn">${esc(t.n)}</span><span class="ci-td">${esc(t.d)}</span></div>`).join("\n          ")}
        </div>
        <div class="ci-bars">
          <span class="ci-tk">${esc(w.bars.title)}</span>
          ${w.bars.items.map(b => `<div class="ci-bar"><span class="ci-bk">${esc(b.k)}</span><span class="ci-bt"><span class="ci-bf" style="width:${Number(b.v)}%"></span></span><span class="ci-bn">${esc(b.n)}</span></div>`).join("\n          ")}
        </div>
      </div>
      <figcaption>${esc(w.cap)}</figcaption>
    </figure>`;

const insightBody = sec => {
  if (sec.kind === "table") return `<div class="cmp-wrap">
      <table class="cmp ci-table">
        <caption class="sr-only">${esc(sec.caption)}</caption>
        <thead><tr>${sec.head.map(h => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead>
        <tbody>
          ${sec.rows.map(r => `<tr>${r.map((c, i) => `<td${i === r.length - 1 ? ' class="us"' : ""}>${esc(c)}</td>`).join("")}</tr>`).join("\n          ")}
        </tbody>
      </table>
    </div>`;
  if (sec.kind === "steps") return `<ol class="cs-steplist${sec.items.length === 3 ? " ci-three" : ""}">
      ${sec.items.map(i => `<li><span class="cs-k">${esc(i.k)}</span><h3>${esc(i.h)}</h3><p>${esc(i.t)}</p></li>`).join("\n      ")}
    </ol>`;
  if (sec.kind === "cards") return `<ul class="ci-cards${sec.items.length === 4 ? " ci-four" : ""}">
      ${sec.items.map(i => `<li>${i.n ? `<span class="ci-cn">${esc(i.n)}</span>` : ""}<h3>${esc(i.h)}</h3><p>${esc(i.t)}</p></li>`).join("\n      ")}
    </ul>`;
  if (sec.kind === "shot") return `<figure class="ci-window ci-shot ci-wide">
      <img src="${sec.shot.img}" width="${sec.shot.w}" height="${sec.shot.h}" alt="${esc(sec.shot.alt)}" loading="lazy" decoding="async">
      <figcaption>${esc(sec.shot.cap)}</figcaption>
    </figure>${sec.items ? `
    <ul class="ci-cards ci-four">
      ${sec.items.map(i => `<li><h3>${esc(i.h)}</h3><p>${esc(i.t)}</p></li>`).join("\n      ")}
    </ul>` : ""}`;
  return "";
};

const insightPage = (c) => {
  const s = c.insight;
  const url = `https://aina.workelate.com/studio/case-studies/${s.slug}`;
  const article = {
    "@context": "https://schema.org", "@type": "Article",
    headline: s.title, description: s.description,
    datePublished: s.published, dateModified: s.modified,
    author: { "@type": "Organization", name: "WE_AINA" },
    publisher: { "@type": "Organization", name: "WE_AINA", url: "https://aina.workelate.com/" },
    image: "https://aina.workelate.com/og.png", mainEntityOfPage: url
  };
  const crumbs = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Case studies", item: "https://aina.workelate.com/studio/case-studies" },
      { "@type": "ListItem", position: 2, name: s.crumb, item: url }
    ]
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(s.title)}, WE_AINA</title>
<meta name="description" content="${esc(s.description)}">
<link rel="stylesheet" href="/css/site.css">
<link rel="stylesheet" href="/css/case.css">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="canonical" href="${url}">
<meta property="og:type" content="article">
<meta property="og:title" content="${esc(s.title)}">
<meta property="og:description" content="${esc(s.description)}">
<meta property="og:image" content="https://aina.workelate.com/og.png">
<meta property="og:url" content="${url}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
${JSON.stringify(article, null, 2)}
</script>
<script type="application/ld+json">
${JSON.stringify(crumbs, null, 2)}
</script>
<noscript><style>.rv{opacity:1!important;transform:none!important}</style></noscript>
</head>
<body class="cs-story ci-page">

<!-- NAV:start -->
<header class="nav"></header>
<!-- NAV:end -->

<main id="main">

<section class="ci-hero">
  <div class="wrap">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/studio/case-studies">Case studies</a> / ${esc(s.crumb)}</nav>
    <span class="label">${esc(s.hero.eyebrow)}</span>
    <h1>${s.hero.h1}</h1>
    <p class="cs-lede ci-sub">${esc(s.hero.sub)}</p>
    <p class="cs-hero-cta"><a class="btn" href="/studio/contact">Book a call</a></p>
    ${insightWindow(s.hero.window)}
  </div>
</section>

<section class="ci-numbers">
  <div class="wrap">
    <span class="label">${esc(s.numbers.eyebrow)}</span>
    <h2>${esc(s.numbers.h2)}</h2>
    <ul class="cs-stats${s.numbers.items.length === 4 ? " ci-four" : ""}">
      ${s.numbers.items.map(i => `<li><span class="cs-n">${esc(i.n)}</span><span class="cs-t">${esc(i.t)}</span></li>`).join("\n      ")}
    </ul>
    <p class="ci-note">${esc(s.numbers.note)}</p>
  </div>
</section>
${s.sections.map((sec, i) => `
<section class="ci-sec ${i % 2 ? "ci-white" : "ci-light"}">
  <div class="wrap">
    <span class="label">${esc(sec.eyebrow)}</span>
    <h2>${esc(sec.h2)}</h2>
    ${(sec.lines || []).map(l => `<p class="cs-lede">${esc(l)}</p>`).join("\n    ")}
    ${insightBody(sec)}${sec.note ? `
    <p class="ci-note">${esc(sec.note)}</p>` : ""}
  </div>
</section>`).join("\n")}

<section class="ci-also">
  <div class="wrap ci-also-grid${s.also.shot ? " ci-also-wide" : ""}">
    <div>
      <span class="label">${esc(s.also.eyebrow)}</span>
      <h2>${esc(s.also.h2)}</h2>
      <p class="cs-lede">${esc(s.also.t)}</p>
    </div>
    ${s.also.shot ? `<figure class="ci-window ci-shot ci-also-shot">
      <img src="${s.also.shot.img}" width="${s.also.shot.w}" height="${s.also.shot.h}" alt="${esc(s.also.shot.alt)}" loading="lazy" decoding="async">
      <figcaption>${esc(s.also.shot.cap)}</figcaption>
    </figure>` : `<div class="ci-also-card"><span class="cs-n">${esc(s.also.n)}</span><span class="ci-td">${esc(s.also.nl)}</span></div>`}
  </div>
</section>

<section id="cta" class="cs-cta">
  <div class="wrap">
    <h2>Book a call</h2>
    <p class="cs-lede">${esc(s.cta)}</p>
    <p class="cs-cta-row"><a class="btn" href="/studio/contact">Book a call</a> <a class="cs-back" href="${s.next.href}">${esc(s.next.label)}</a> <a class="cs-back" href="/studio/case-studies">All case studies</a></p>
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
};

for (const c of cases.filter(c => c.insight)) {
  writeFileSync(path.join(OUT, `${c.insight.slug}.html`), insightPage(c));
  console.log(`wrote case study /studio/case-studies/${c.insight.slug}`);
}

