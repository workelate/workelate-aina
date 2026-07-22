// Case-studies index generated from data/cases.json, founder adds entries
// there; never hand-edit site/case-studies/index.html.
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const OUT = path.join(ROOT, "site", "case-studies");
mkdirSync(OUT, { recursive: true });

const { cases } = JSON.parse(readFileSync(path.join(ROOT, "data", "cases.json"), "utf8"));

const card = c => `
    <div class="case rv${c.status === "placeholder" ? " placeholder" : ""}">
      <div>
        <span class="ctag">${c.tag}${c.anonymous ? " · client name under NDA" : ""}</span>
        <h3>${c.title}</h3>
        <p class="dim">${c.summary}</p>
      </div>
      <div class="cnum">${c.metric}<small>${c.metricLabel}</small></div>
    </div>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Case studies, WE_AINA</title>
<meta name="description" content="Receipts-first case studies: 13 quarries on agentic dispatch, AI campaign ops for agencies in Mexico, freight reconciliation, AR automation, numbers we can defend.">
<link rel="preload" as="font" type="font/woff2" href="/fonts/bricolage-var-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/fonts/inter-var-latin.woff2" crossorigin>
<link rel="stylesheet" href="/css/site.css">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="canonical" href="https://weaina.com/case-studies">
</head>
<body>

<header class="nav"><div class="wrap row">
  <a class="logo" href="/">WE_<span>AINA</span></a>
  <nav>
    <a href="/how-we-work">How we work</a>
    <a href="/about">About</a>
    <a href="/case-studies" aria-current="page">Case studies</a>
    <a href="/blog">Blog</a>
    <a href="/systems/quarry-dispatch-automation">Systems</a>
    <a class="btn" href="/#ask">Get your AI Readiness Score</a>
  </nav>
</div></header>

<main id="main">

<section class="page-hero">
  <div class="wrap">
    <span class="label">Case studies</span>
    <h1>Work with numbers<br><span class="accent">we can defend.</span></h1>
    <p class="sub dim">Every case here follows the same rule as our systems: receipts over adjectives. Where a client prefers their edge quiet, the work appears without the name, and we walk qualified prospects through the details in the Sprint.</p>
  </div>
</section>

<section>
  <div class="wrap">
${cases.map(card).join("\n")}
  </div>
</section>

<section id="cta" class="deep">
  <div class="wrap">
    <h2>Get your AI Readiness Score</h2>
    <p class="dim">Five questions. Your report, three automation opportunities with conservative numbers, arrives in 10 minutes.</p>
    <p style="margin-top:24px"><a class="btn" href="/#ask">Get your AI Readiness Score</a></p>
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
        <a href="/about">About us</a>
        <a href="/how-we-work">How we work</a>
        <a href="/case-studies">Case studies</a>
        <a href="/blog">Blog</a>
      </div>
      <div>
        <div class="fh">Systems</div>
        <a href="/systems/quarry-dispatch-automation">Dispatch automation</a>
        <a href="/systems/plant-production-reporting">Production reporting</a>
        <a href="/systems/dealer-order-management">Order management</a>
        <a href="/systems/freight-reconciliation">Freight reconciliation</a>
        <a href="/systems/ar-followup-automation">AR follow-up</a>
        <a href="/systems/compliance-documentation">Compliance documentation</a>
      </div>
      <div>
        <div class="fh">Engage</div>
        <a href="/#ask">Get your AI Readiness Score</a>
        <a href="/how-we-work">The Diagnostic Sprint</a>
        <a href="/blog/receipts-over-decks">Receipts over decks</a>
      </div>
    </div>
    <div class="baseline">
      <span>© 2026 WE_AINA · WorkElate's AI-Native Agency · Chitransh & Pratik</span>
    </div>
  </div>
</footer>
<script type="module" src="/js/reveal.js"></script>
</body>
</html>`;

writeFileSync(path.join(OUT, "index.html"), html);
console.log(`wrote case-studies index with ${cases.length} entries`);
