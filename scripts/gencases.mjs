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

const DESC = "Case studies with the operating numbers, before and after: 13 quarries on one dispatch system, AI campaign operations for agencies, freight reconciliation.";

const card = c => {
  const inner = `
      <div>
        <span class="ctag">${c.tag}${c.anonymous ? " · client name under NDA" : ""}</span>
        <h3>${c.title}</h3>
        <p class="dim">${c.summary}</p>${c.href ? `
        <span class="ctag" style="display:inline-block;margin-top:16px">${c.hrefLabel || "Read more"} &rarr;</span>` : ""}
      </div>
      <div class="cnum">${c.metric}<small>${c.metricLabel}</small></div>`;
  const cls = `case rv${c.status === "placeholder" ? " placeholder" : ""}`;
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
<link rel="preload" as="font" type="font/woff2" href="/fonts/worksans-var-latin.woff2" crossorigin fetchpriority="high">
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
    <a class="btn" href="/studio/contact">Book a Diagnostic Sprint</a>
  </nav>
</div></header>

<main id="main">

<section class="page-hero">
  <div class="wrap">
    <span class="label">Case studies</span>
    <h1>The builds we can put<br><span class="accent">numbers</span> against.</h1>
    <p class="sub dim">Each card names what the operation looked like before, what the Brain, WorkElate Chief, now does inside it, and the operating number that moved.</p>
    <p class="hero-cta"><a class="btn" href="/studio/contact">Book a Diagnostic Sprint</a></p>
  </div>
</section>

<section>
  <div class="wrap">
    <h2 style="margin-bottom:16px">One card per build: before, after, and the number.</h2>
    <p class="dim" style="margin-bottom:32px">One engagement, RockProsUSA, is measured over its first twelve months and carries the numbers. The rest are described, and named only where the client has cleared it.</p>
${cases.map(card).join("\n")}
    <p class="dim srcnote">Updated 15 September 2026 &middot; WE_AINA</p>
  </div>
</section>

<section id="cta" class="deep">
  <div class="wrap">
    <h2>Book a Diagnostic Sprint</h2>
    <p class="dim">Every card above began as a two-week Sprint inside the operation; yours starts the same way.</p>
    <p style="margin-top:24px"><a class="btn" href="/studio/contact">Book a Diagnostic Sprint</a></p>
  </div>
</section>

</main>

<footer class="mega">
  <div class="wrap">
    <div class="cols">
      <div class="brand">
        <a class="logo" href="/">WE_<span>AINA</span></a>
        <p>WorkElate's AI-Native Agency: our delivery runs on our own platform, products shipped in weeks not quarters, $30K to $100K fixed.</p>
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
</html>`;

writeFileSync(path.join(OUT, "index.html"), html);
console.log(`wrote case-studies index with ${cases.length} entries`);
