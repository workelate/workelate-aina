// Prompt 6, programmatic /systems/ pages from one template.
// v2: 900-1100 words/page, handwritten meta descriptions (≤155 chars),
// Service JSON-LD with category serviceType, rotated sibling links so every
// page receives internal links, CTA above the FAQ block.
// v3 (2026-09-07): the six pages were mutual dead ends and /systems itself
// 404'd, so the main nav pointed at one quarry page and a buyer landed on
// "Trucks that stop waiting" instead of a catalogue. This file now also emits
// site/systems/index.html, and every page carries an "all systems" sibling
// link in its breadcrumb and its related-systems line.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT = path.join(import.meta.dirname, "..", "site", "studio", "systems");
mkdirSync(OUT, { recursive: true });
const PAGES = [
  {
    slug: "quarry-dispatch-automation",
    h1: "Every truck assignment proposed by the system, approved by a dispatcher",
    h1html: 'Every truck assignment<br>proposed, <span class="accent">then approved.</span>',
    cat: "Quarry dispatch automation",
    metaDesc: "Truck assignments proposed with their reasoning and approved by a dispatcher, behind a 38% lower dispatch cycle across 13 quarries.",
    costNums: ["At a site this size, a 22-minute average wait between gate and loader across 40 trucks is roughly 290 driver-hours a month.",
      "One mis-assigned haul per shift, at 3 shifts a day, is about 90 wasted cycles a month: fuel, wear and driver pay, no material moved."],
    system: "The system watches orders, truck positions and weighbridge events, then proposes the next assignment before the dispatcher asks. It flags the cycles that break pattern, a loader down, a queue forming, and escalates only those. Every assignment carries its reasoning.",
    landing: "Week one it runs in shadow, proposing assignments in parallel. Week two you compare its proposals against what your dispatchers did. From week three dispatchers approve from a queue instead of radio calls.",
    signs: ["Trucks queue at the gate while a loaded pit sits idle.",
      "Your best dispatcher is unpromotable because nobody else can hold the board.",
      "Cycle counts come from a diary, and the diary disagrees with the weighbridge.",
      "Evening reconciliation finds hauls nobody can explain."],
    proof: "This is the system running 13 quarries at RockProsUSA today: dispatch cycle time 38% lower over the first twelve months.",
    faq: [
      ["Does this replace my dispatchers?", "No. It replaces the radio tag and the spreadsheet copying. Every assignment is proposed with its reasoning and a dispatcher approves it."],
      ["We run mixed fleets, owned and hired trucks. Does that work?", "Yes. Hired trucks are tracked gate-in to gate-out from gate events; owned trucks with GPS get full cycle tracking."],
      ["What data does it need on day one?", "Orders, truck list and weighbridge feed. Telematics and loader status make it sharper but are not prerequisites."],
      ["What happens when the internet drops at the pit?", "Dispatch falls back to the last approved plan and queues events locally; when the link returns, the gaps are flagged."],
      ["Can it handle multiple sites with shared fleet?", "Yes, that is the RockProsUSA configuration: 13 sites, one system, trucks moving between quarries as demand shifts."],
      ["How long until it pays for itself?", "We do not quote a number we have not measured on your site. The Sprint measures it; the build price is fixed before it starts."]
    ]
  },
  {
    slug: "plant-production-reporting",
    h1: "The 6 AM production report nobody had to write",
    h1html: 'The 6 AM production report<br><span class="accent">nobody</span> had to write.',
    cat: "Plant production reporting automation",
    metaDesc: "Shift logs, weighbridge tickets and downtime entries become a reconciled daily production report by 6 AM, discrepancies flagged.",
    costNums: ["At a plant this size, a manager spending 90 minutes a day assembling shift data loses about 33 working days a year to copying numbers.",
      "A crusher running 7% under rate for two days before anyone notices is roughly 800 tonnes of lost throughput at a mid-size plant."],
    system: "The system pulls shift logs, weighbridge tickets, downtime entries and energy readings as they happen, reconciles them, and writes the daily production report before the morning meeting. Tonnage that does not match tickets, and downtime nobody entered, are flagged in the report.",
    landing: "The first two weeks are connectors to wherever your data lives: Tally, the weighbridge PC, the shift-log spreadsheet, the control system. By week three a parallel report arrives every morning; you mark what is wrong, and within a month it is the report.",
    signs: ["The morning meeting argues about what happened instead of what to do.",
      "Downtime totals differ depending on who you ask.",
      "Month-end production numbers get adjusted and nobody can say why.",
      "Your monthly report is accurate but ten days late, or timely but wrong."],
    proof: "The same reporting runs at RockProsUSA, where 11,200 operations hours were returned over the first twelve months, a large share of them reporting hours.",
    faq: [
      ["Our data lives in Tally, Excel and the plant control system. Can it read all three?", "Yes. Connectors read accounting exports, spreadsheet drops and control-system feeds."],
      ["What if the underlying data is wrong?", "The report says so, mismatch called out. Bad data flagged at 6 AM is fixable; at month-end it is a write-off."],
      ["Can it write the monthly report my directors already expect?", "Yes. The output template is yours, the same structure your board reads today."],
      ["Do operators have to enter data differently?", "No. The system adapts to your logs as they are; if one field would sharpen the report, you decide."],
      ["What about multiple plants?", "Each plant gets its own daily report; a group roll-up compares plants on the same definitions."],
      ["Daily only, or shift-level too?", "Both. Shift summaries generate at shift close; daily, weekly and monthly views roll up from the same data."]
    ]
  },
  {
    slug: "dealer-order-management",
    h1: "Every dealer order in one queue, confirmed in minutes",
    h1html: 'Dealer orders in one queue,<br>confirmed in <span class="accent">minutes.</span>',
    cat: "Dealer order management automation",
    metaDesc: "Orders from WhatsApp, phone and email become one validated queue; clean orders confirm to the dealer in minutes, exceptions route to a person.",
    costNums: ["An order taken on WhatsApp, re-typed into the ERP and confirmed by callback touches 3 people and takes 40 minutes; at 60 orders a day that is 40 hours of re-typing a week.",
      "Mis-keyed orders, wrong grade, quantity or site, run 2 to 4% in manual flows, and each one is material moving to the wrong place."],
    system: "The system reads orders as they arrive on WhatsApp, email and phone transcripts, extracts grade, quantity, site and date, checks credit and stock, and drops them into one queue. Clean orders confirm back to the dealer automatically; ambiguous ones go to a person with the ambiguity highlighted.",
    landing: "Rollout starts with a read-only fortnight: what the system extracted next to what your team keyed in. Then auto-confirmation switches on for repeat orders from known dealers within credit, typically 60 to 70% of volume. Dealers notice one change: confirmations in minutes, at any hour.",
    signs: ["Order-entry staff spend evenings clearing a WhatsApp backlog.",
      "Dealers call to confirm the order they already sent.",
      "Credit breaches get discovered at dispatch, not at order time.",
      "Two people key the same order twice a week."],
    proof: "The same system runs at RockProsUSA, where 2,140 invoices flowed through with zero manual touches over the first twelve months.",
    faq: [
      ["Our dealers will not change how they order. Do they have to?", "No. They keep sending WhatsApp messages; the system meets them there. Dealers only see faster confirmations."],
      ["What about credit holds and pricing exceptions?", "Rules you set. Orders breaching credit or off-list pricing never auto-confirm; they route to the person who owns that call."],
      ["Can it handle Hindi and regional-language messages?", "Yes, including mixed-language messages."],
      ["What if the system misreads an order?", "Every auto-confirmed order carries its source message beside the extraction, so a misread is visible, not silent."],
      ["Does it manage order changes and cancellations?", "Yes. Amendments thread onto the original order, and dispatch and invoicing see one current version."],
      ["Does it write into our ERP or replace it?", "Writes into it. Your ERP still owns the data; this removes the keyboard between the dealer and the record."]
    ]
  },
  {
    slug: "freight-reconciliation",
    h1: "Freight bills that match themselves, or explain why not",
    h1html: 'Freight bills that match,<br>or <span class="accent">explain why</span> not.',
    cat: "Freight reconciliation automation",
    metaDesc: "Every carrier bill line matched against weighbridge, gate and delivery data; clean lines clear, disputes are flagged with evidence attached.",
    costNums: ["Manual freight reconciliation holds 3 people for the first week of every month: 36 person-weeks a year spent matching paper.",
      "Unchallenged carrier overbilling, duplicate trips, inflated distances, rate misapplication, runs 1 to 3% of freight spend."],
    system: "The system matches every carrier bill line against weighbridge tickets, gate records and delivery confirmations. Clean lines clear automatically. A billed trip with no weighbridge record, or a distance that grew 15% since last quarter, is flagged with the evidence attached.",
    landing: "The first pass runs on last quarter's paid bills and names the duplicate trips and distance creep in your own data. Then live bills: clean lines clear the day they arrive, exceptions queue with evidence, and month-end shrinks to a half-day review.",
    signs: ["Freight bills get paid on trust in busy months.",
      "The same route's billed distance varies 20% between carriers.",
      "Disputes die because assembling the evidence costs more than the amount.",
      "You have only ever checked samples, never a full month."],
    proof: "The same matching runs at RockProsUSA, where 2,140 invoices went out with zero manual touches over the first twelve months.",
    faq: [
      ["Our carriers bill in every format imaginable. Does that break it?", "No. PDFs, spreadsheets and scans are all read. Missing source data is the only real blocker, and the system says when that is so."],
      ["What happens to disputed lines?", "They queue for a person with the bill line, matching records and discrepancy bundled. Nothing goes to a carrier until your team approves it."],
      ["Can it check our contracted rate cards?", "Yes. Rate cards load once and every bill line checks against them, so rate creep is caught on the first bill."],
      ["Will this sour carrier relationships?", "It usually improves them. Clean bills clear same-day; only the padding gets disputed, with evidence."],
      ["What if our own weighbridge data has gaps?", "A bill line with no matching ticket is flagged as unverifiable, not silently passed. Most operators fix gate discipline within a month."],
      ["We already reconcile in Excel. Why change?", "Excel reconciles what someone has time to check. This checks every line, every month, and shows its work."]
    ]
  },
  {
    slug: "ar-followup-automation",
    h1: "Receivables chased every day, escalated on rules, never dropped",
    h1html: 'Receivables chased daily,<br><span class="accent">never dropped.</span>',
    cat: "Accounts receivable follow-up automation",
    metaDesc: "Every open invoice chased on cadence and escalated by rule; promises to pay are tracked to their date and re-chased the morning after.",
    costNums: ["A collections follow-up that depends on one person's memory skips a third of due accounts in any given week.",
      "Every ten days added to DSO, the days your invoices take to get paid, is working capital parked in other people's businesses."],
    system: "The system watches every open invoice, sends reminders on the cadence you set, and escalates by amount, age and customer tier to the right person. Promises to pay are tracked to their date and re-chased the morning after they break. Your team handles conversations; no account goes quiet.",
    landing: "Setup is one session: your invoice feed, your customer tiers and the escalation ladder, who is pinged at 30 days, who calls at 60, whose name is on the letter at 90. The first week runs reminders for your approval, in your tone; after that every escalation still lands with a person.",
    signs: ["DSO is a number you calculate for the bank, not one you manage weekly.",
      "Follow-up collapses whenever the person who owns it goes on leave.",
      "Promises to pay are remembered, not tracked.",
      "Your largest overdue account is the one nobody wants to call."],
    proof: "The same system runs at RockProsUSA, where 2,140 invoices went out with zero manual touches over the first twelve months.",
    faq: [
      ["Will this annoy my customers?", "The cadence and tone are yours. Customers respond better to consistent reminders than to silence and an angry call at day 90."],
      ["Can it hold back on strategic accounts?", "Yes. Key accounts route straight to a named owner with a prepared summary instead of an automated reminder."],
      ["Does it work with post-dated cheques and part-payments?", "Yes. Part-payments re-age the balance; PDC dates suppress reminders until they matter, then verify clearance."],
      ["What channels does it use?", "Email and WhatsApp as standard, SMS and voice notes where your customers read those. Escalations land as briefs for a call."],
      ["Can it reconcile payments against invoices automatically?", "Yes, including partial and clubbed payments, so a reminder never chases money that already arrived."],
      ["How do I know it is working?", "The monthly report shows the DSO trend and the promise-kept rate, and names the sticking accounts."]
    ]
  },
  {
    slug: "compliance-documentation",
    h1: "Compliance filings assembled from operating data, not month-end panic",
    h1html: 'Compliance filings, not<br><span class="accent">month-end panic.</span>',
    cat: "Compliance documentation automation",
    metaDesc: "Royalty, GST, e-way and environmental filings built continuously from weighbridge and dispatch data, so month-end becomes a review.",
    costNums: ["Royalty, GST and e-way documentation assembled by hand from operating records consumes 8 to 12 person-days per site per month.",
      "One missed royalty filing can stop dispatches for days, and each day at a mid-size quarry is deferred revenue."],
    system: "The system builds the filings from the operating data that runs your business: weighbridge tickets become royalty returns, dispatch records become e-way documentation, production logs feed environmental reports. Mismatches between filed and weighed surface while they are still corrections. Nothing is filed until a person approves it.",
    landing: "It begins with an inventory: which filings you owe and where each number comes from. Most operators find their royalty return and weighbridge log have never been compared. Then assembly goes continuous, and drafts carry their evidence days before they are due.",
    signs: ["The three days before a filing deadline are the worst of the month.",
      "Filed and operating numbers are reconciled only when an inspector asks.",
      "One person holds the filing process, and their notice period is 30 days.",
      "You paid a late fee this year for a filing whose data existed on time."],
    proof: "The same system runs at RockProsUSA, where every reported number comes straight from the operating data that produced it.",
    faq: [
      ["Our compliance rules change constantly. How does the system keep up?", "Rule changes are configuration. The template updates once and every later filing follows it."],
      ["Does it file directly with government portals?", "Where portals allow it, yes. Otherwise your team submits a prepared package instead of building one."],
      ["What about historical gaps, we are behind on documentation?", "The Sprint sizes the backlog first. Back-filling from weighbridge and dispatch records usually covers 12 to 18 months of history."],
      ["Can it handle multi-state GST and different state royalty regimes?", "Yes. Each site carries its own regime configuration; the group view shows every site's filing status on one board."],
      ["What does an inspector see?", "A filing where every number traces to the ticket, dispatch record or production entry that produced it."],
      ["Who is liable if a filing is wrong?", "Same as today: you. What changes is that wrong filings become rare and defensible."]
    ]
  }
];

// Apple rule (content audit 2026-09-15, row 9): paragraphs of two or three
// sentences. Long prose fields are split on sentence ends and grouped in threes.
const paras = (text, gap = 16) => {
  const sentences = text.match(/[^.!?]+[.!?]+(?:["')]|\s|$)/g)?.map(s => s.trim()).filter(Boolean) || [text];
  const out = [];
  for (let i = 0; i < sentences.length; i += 3) out.push(sentences.slice(i, i + 3).join(" "));
  return out.map((t, i) => `<p${i ? ` style="margin-top:${gap}px"` : ""}>${t}</p>`).join("\n    ");
};

const page = (p, idx) => {
  // rotated siblings: each page links the NEXT 3 in circular order, so all 6
  // pages receive exactly 3 inbound internal links
  const siblings = [1, 2, 3].map(k => PAGES[(idx + k) % PAGES.length]);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.cat}, WE_AINA</title>
<meta name="description" content="${p.metaDesc}">
<link rel="preload" as="font" type="font/woff2" href="/fonts/worksans-var-latin.woff2" crossorigin fetchpriority="high">
<link rel="stylesheet" href="/css/site.css">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="canonical" href="https://aina.workelate.com/studio/systems/${p.slug}">
<meta property="og:type" content="website">
<meta property="og:title" content="${p.cat}, WE_AINA">
<meta property="og:description" content="${p.metaDesc}">
<meta property="og:image" content="https://aina.workelate.com/og.png">
<meta property="og:url" content="https://aina.workelate.com/studio/systems/${p.slug}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: p.faq.map(([q, a]) => ({
    "@type": "Question", name: q,
    acceptedAnswer: { "@type": "Answer", text: a }
  }))
}, null, 1)}
</script>
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Service",
  name: p.h1,
  serviceType: p.cat,
  description: p.metaDesc,
  provider: { "@type": "Organization", name: "WE_AINA", url: "https://aina.workelate.com/" },
  url: `https://aina.workelate.com/studio/systems/${p.slug}`
}, null, 1)}
</script>
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
    <a href="/studio/systems/${p.slug}" aria-current="page">Systems</a>
    <a class="btn" href="/studio/contact">Book a Diagnostic Sprint</a>
  </nav>
</div></header>

<main id="main">
<section id="hero" style="min-height:auto">
  <div class="wrap">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/studio">WE_AINA</a> / <a href="/studio/systems">systems</a></nav>
    <h1>${p.h1html || p.h1}</h1>
    <p class="sub dim">Built before and run by the Brain, WorkElate Chief: it proposes each action with its reasoning, and your team approves it.</p>
    <p class="hero-cta"><a class="btn" href="/studio/contact">Book a Diagnostic Sprint</a></p>
  </div>
</section>

<section>
  <div class="wrap">
    <span class="label">What this costs you today</span>
    <p>${p.costNums[0]}</p>
    <p style="margin-top:16px">${p.costNums[1]}</p>
  </div>
</section>

<section>
  <div class="wrap">
    <span class="label">The system</span>
    ${paras(p.system)}
    <p class="accent" style="margin-top:24px">${p.proof}</p>
  </div>
</section>

<section class="deep">
  <div class="wrap">
    <span class="label">How it lands in your operation</span>
    ${paras(p.landing)}
    <h2 style="margin-top:48px">Signs you need this</h2>
    ${p.signs.map(s => `<p class="dim" style="margin-top:12px">- ${s}</p>`).join("\n    ")}
    <p class="dim srcnote">Updated 15 September 2026 &middot; WE_AINA</p>
  </div>
</section>

<section id="cta">
  <div class="wrap">
    <h2>Book a Diagnostic Sprint</h2>
    <p class="dim">Two weeks in your operation to size what ${p.cat.toLowerCase()} returns, before a price.</p>
    <p style="margin-top:24px"><a class="btn" href="/studio/contact">Book a Diagnostic Sprint</a></p>
  </div>
</section>

<section>
  <div class="wrap">
    <span class="label">Questions operators ask</span>
    ${p.faq.map(([q, a]) => `<div class="step"><span class="k">Q</span><div><h3>${q}</h3><p class="dim">${a}</p></div></div>`).join("\n    ")}
    <p class="dim" style="margin-top:48px">Related systems: ${siblings.map(x =>
      `<a href="/studio/systems/${x.slug}">${x.cat.toLowerCase()}</a>`).join(" · ")} · <a href="/studio/systems">all six systems</a></p>
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
      <span>© 2026 WE_AINA · WorkElate's AI-Native Agency · Chitransh & Pratik</span>
      <span><a href="mailto:chitransh@workelate.com" style="display:inline;padding:0">chitransh@workelate.com</a> · <a href="/studio/contact" style="display:inline;padding:0">Contact</a></span>
      <!-- FOUNDER-BLOCKED: phone number, registered address and LinkedIn URLs. -->
    </div>
  </div>
</footer>
<script src="/js/nav.js" defer></script>
<script type="module" src="/js/reveal.js"></script>
</body>
</html>`;
};

// ---- /systems index: the catalogue the main nav should have pointed at ----
const INDEX_DESC = "Six systems we build and run: quarry dispatch, production reporting, dealer order management, freight reconciliation, AR follow-up, compliance filings.";

const indexPage = () => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Six systems we build and run, WE_AINA</title>
<meta name="description" content="${INDEX_DESC}">
<link rel="preload" as="font" type="font/woff2" href="/fonts/worksans-var-latin.woff2" crossorigin fetchpriority="high">
<link rel="stylesheet" href="/css/site.css">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="canonical" href="https://aina.workelate.com/studio/systems">
<meta property="og:type" content="website">
<meta property="og:title" content="Six systems we build and run, WE_AINA">
<meta property="og:description" content="${INDEX_DESC}">
<meta property="og:image" content="https://aina.workelate.com/og.png">
<meta property="og:url" content="https://aina.workelate.com/studio/systems">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Systems we build, WE_AINA",
  description: INDEX_DESC,
  url: "https://aina.workelate.com/studio/systems"
}, null, 1)}
</script>
<script type="application/ld+json">
${JSON.stringify({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Systems WE_AINA builds",
  itemListElement: PAGES.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: p.cat,
    url: `https://aina.workelate.com/studio/systems/${p.slug}`
  }))
}, null, 1)}
</script>
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
    <a href="/studio/systems" aria-current="page">Systems</a>
    <a class="btn" href="/studio/contact">Book a Diagnostic Sprint</a>
  </nav>
</div></header>

<main id="main">

<section class="page-hero">
  <div class="wrap">
    <span class="label">Systems</span>
    <h1>Six systems already built.<br>Yours is <span class="accent">the seventh.</span></h1>
    <p class="sub dim">Each one is a system we have designed, shipped and run on operating data, with the Brain proposing and a person approving.</p>
    <p class="hero-cta"><a class="btn" href="/studio/contact">Book a Diagnostic Sprint</a></p>
  </div>
</section>

<section>
  <div class="wrap">
    <h2 style="margin-bottom:16px">The six, written up</h2>
    <p class="dim" style="margin-bottom:40px">Each page names what the problem costs today and how the system lands.</p>
    ${PAGES.map((p, i) => `<a class="svc rv" href="/studio/systems/${p.slug}">
      <span class="num">${String(i + 1).padStart(2, "0")}</span><h3>${p.cat}</h3>
      <p class="dim">${p.metaDesc}</p>
    </a>`).join("\n    ")}
  </div>
</section>

<section class="deep">
  <div class="wrap">
    <span class="label">Not on this list</span>
    <h2>Where we have been, not where we stop.</h2>
    <p class="dim">Behind these six sit 34 products across 9 sectors and 374 repositories since 2018; dispatch and reporting have the cleanest numbers. If your problem is not here, the two-week Diagnostic Sprint sizes it.</p>
    <p style="margin-top:24px"><a href="/studio/case-studies">See the case studies</a> · <a href="/studio/how-we-work">How we work</a> · <a href="/studio/contact">Talk to us</a></p>
    <p class="dim srcnote">Updated 15 September 2026 &middot; WE_AINA</p>
  </div>
</section>

<section id="cta">
  <div class="wrap">
    <h2>Book a Diagnostic Sprint</h2>
    <p class="dim">If your problem is not one of the six, the Sprint sizes and prices it.</p>
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
      <span>© 2026 WE_AINA · WorkElate's AI-Native Agency · Chitransh & Pratik</span>
      <span><a href="mailto:chitransh@workelate.com" style="display:inline;padding:0">chitransh@workelate.com</a> · <a href="/studio/contact" style="display:inline;padding:0">Contact</a></span>
      <!-- FOUNDER-BLOCKED: phone number, registered address and LinkedIn URLs. -->
    </div>
  </div>
</footer>
<script src="/js/nav.js" defer></script>
<script type="module" src="/js/reveal.js"></script>
</body>
</html>`;

PAGES.forEach((p, i) => writeFileSync(path.join(OUT, `${p.slug}.html`), page(p, i)));
writeFileSync(path.join(OUT, "index.html"), indexPage());

// sitemap.xml and robots.txt are written by scripts/gensitemap.mjs, derived
// from site/ itself. Run it after this generator.
console.log(`wrote ${PAGES.length} system pages + systems/index.html`);
