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
    metaDesc: "Quarry dispatch: truck assignments proposed with their reasoning, approved by a dispatcher. Behind a 38% lower dispatch cycle across 13 quarries.",
    costNums: ["In a typical operation of this size, a 22-minute average wait between the gate and the loader across 40 trucks is roughly 290 driver-hours a month at one site.",
      "One mis-assigned haul per shift, at 3 shifts a day, is about 90 wasted cycles a month: fuel, wear and driver pay with no material moved."],
    system: "The system watches orders, truck positions and weighbridge events (the weight recorded as each truck crosses the gate scale), then proposes the next assignment before the dispatcher asks for it. It tracks every cycle end to end, flags the ones that break pattern, a loader down, a queue forming, a driver stuck at the pit, and escalates only those. Dispatchers stop juggling radios and start approving decisions. Every assignment carries the reasoning it was made with, so a bad call can be traced in one click instead of one argument.",
    landing: "Week one, the system runs in shadow mode: it watches your dispatch decisions and proposes its own in parallel, and nobody's workflow changes. Week two, you compare its proposals against what your dispatchers actually did, the gaps go both ways, and both are useful. From week three, dispatchers approve assignments from a queue instead of building them from radio calls. The transition is deliberately boring: no big-bang cutover, no retraining week, no consultants standing behind chairs. The dispatch office on day 30 looks like the dispatch office on day 1, minus the shouting.",
    signs: ["Trucks queue at the gate while a loaded pit sits idle two benches away.",
      "Your best dispatcher is unpromotable because nobody else can hold the board in their head.",
      "Cycle counts come from a diary, and the diary disagrees with the weighbridge.",
      "Evening reconciliation regularly finds hauls nobody can explain."],
    proof: "This is the system running 13 quarries at RockProsUSA today. Dispatch cycle time was 38% lower over the first twelve months.",
    faq: [
      ["Does this replace my dispatchers?", "No. It replaces the radio tag and the spreadsheet copying. Every assignment is proposed with its reasoning and a dispatcher approves it. That does not switch off."],
      ["We run mixed fleets, owned and hired trucks. Does that work?", "Yes. Hired trucks are tracked from gate-in to gate-out even without telematics, using weighbridge and gate events. Owned trucks with GPS get full cycle tracking."],
      ["What data does it need on day one?", "Orders, truck list, and weighbridge feed. That is enough to start proposing assignments. Telematics and loader status make it sharper but are not prerequisites."],
      ["What happens when the internet drops at the pit?", "Dispatch falls back to the last approved plan and queues events locally; when the link returns, the system reconciles what actually happened against what was planned and flags the gaps. A connectivity blip never blanks the board."],
      ["Can it handle multiple sites with shared fleet?", "Yes, that is precisely the RockProsUSA configuration: 13 sites, one system, trucks moving between quarries as demand shifts. Cross-site allocation is proposed with the same reasoning attached as single-site assignments."],
      ["How long until it pays for itself?", "That depends on your operation, and we will not quote a number we have not measured on it. The Diagnostic Sprint puts conservative numbers on your specific site before you commit, and the build price is fixed before it starts."]
    ]
  },
  {
    slug: "plant-production-reporting",
    h1: "The 6 AM production report nobody had to write",
    h1html: 'The 6 AM production report<br><span class="accent">nobody</span> had to write.',
    cat: "Plant production reporting automation",
    metaDesc: "Shift logs, weighbridge tickets and downtime entries become a daily production report by 6 AM, reconciled, discrepancies flagged, ready to read.",
    costNums: ["In a typical operation of this size, a plant manager spending 90 minutes a day assembling shift data loses about 33 working days a year to copying numbers between systems.",
      "Decisions made on day-old production data cost real tonnage: a crusher running 7% under rate for two days before anyone notices is roughly 800 tonnes of lost throughput at a mid-size plant."],
    system: "The system pulls shift logs, weighbridge tickets (the weight recorded at the gate scale), downtime entries and energy readings as they happen, reconciles them against each other, and writes the daily production report before the morning meeting. Discrepancies, tonnage that does not match tickets, downtime nobody entered, are flagged in the report, not buried under it. The report reads like your best plant manager wrote it, because it is built from the questions they would ask.",
    landing: "The first two weeks are plumbing: connectors to wherever your data actually lives, exports from Tally (the accounting software most Indian mid-size businesses run on), the weighbridge PC, the operator's shift-log spreadsheet, the plant control system's history if you have one. Nothing about how your operators record data changes; the system meets the data where it is. By week three you get a parallel report every morning alongside whatever you produce today. You mark what is wrong or missing, the reconciliation rules tighten, and within a month the parallel report is the report. The person who used to assemble it gets their mornings back, most plants redeploy them onto the discrepancies the report now surfaces.",
    signs: ["The morning meeting argues about what happened instead of what to do.",
      "Downtime totals differ depending on who you ask.",
      "Month-end production numbers get 'adjusted' and nobody can say why.",
      "Your monthly management report is accurate but ten days late, or timely but wrong."],
    proof: "The same reporting system runs at RockProsUSA, where 11,200 operations hours were returned over the first twelve months, a large share of them reporting hours.",
    faq: [
      ["Our data lives in Tally, Excel and the plant control system. Can it read all three?", "Yes. The system was built for exactly that mess. Connectors handle accounting exports, spreadsheet drops and control-system feeds; reconciliation happens in the middle."],
      ["What if the underlying data is wrong?", "Then the report says so, with the specific mismatch called out. Bad data flagged at 6 AM is a fixable problem; bad data discovered at month-end is a write-off."],
      ["Can it write the monthly report my directors already expect?", "Yes. The output template is yours, the same structure your board reads today, produced without the three people who currently assemble it."],
      ["Do operators have to enter data differently?", "No. Changing operator behavior is where reporting projects die, so we refuse to depend on it. The system adapts to your logs as they are; if a specific field would sharpen the report materially, we tell you the trade-off and you decide."],
      ["What about multiple plants?", "Each plant gets its own daily report; a group roll-up compares plants on the same definitions, which is usually the first time the definitions have actually matched."],
      ["Daily only, or shift-level too?", "Both. Shift handover summaries generate at shift close; the daily rolls them up. Weekly and monthly views come from the same data with no extra work."]
    ]
  },
  {
    slug: "dealer-order-management",
    h1: "Every dealer order in one queue, confirmed in minutes",
    h1html: 'Dealer orders in one queue,<br>confirmed in <span class="accent">minutes.</span>',
    cat: "Dealer order management automation",
    metaDesc: "Orders from WhatsApp, phone and email become one validated queue. Clean orders auto-confirm to the dealer in minutes; exceptions route to a human.",
    costNums: ["In a typical operation of this size, an order taken on WhatsApp, re-typed into the ERP, then confirmed by callback touches 3 people and takes 40 minutes or more. At 60 orders a day that is 40 hours of pure re-typing a week.",
      "Mis-keyed orders, wrong grade, wrong quantity, wrong site, run 2 to 4% in manual flows. Every one of them is material moving to the wrong place before anyone catches it."],
    system: "The system reads orders as they arrive, WhatsApp, email, phone transcripts, extracts grade, quantity, site and requested date, checks them against credit limits and stock, and drops them into one queue. Clean orders get confirmed back to the dealer automatically; ambiguous ones go to a human with the ambiguity highlighted. The dealer gets a confirmation in minutes instead of a callback in hours, and your team stops being a transcription service.",
    landing: "Rollout starts with a read-only fortnight: the system ingests your order channels and shows you what it extracted next to what your team keyed in. That comparison is usually the first honest measurement of your current error rate. Then auto-confirmation switches on for the cleanest slice, repeat orders from known dealers within credit, which is typically 60-70% of volume. The remainder keeps a human in the loop, with the system doing the reading and the checking. Dealers notice exactly one change: confirmations arrive in minutes, at any hour, including Sunday evening when they actually place orders.",
    signs: ["Order-entry staff spend evenings clearing a WhatsApp backlog.",
      "Dealers call to confirm the order they already sent, because silence means uncertainty.",
      "Credit breaches get discovered at dispatch, not at order time.",
      "Two people key the same order twice a week."],
    proof: "The same system that runs at RockProsUSA, where 2,140 invoices flowed through with zero manual touches over the first twelve months.",
    faq: [
      ["Our dealers will not change how they order. Do they have to?", "No. That is the point. They keep sending WhatsApp messages; the system meets them there. Nothing changes on the dealer side except faster confirmations."],
      ["What about credit holds and pricing exceptions?", "Rules you set. Orders breaching credit or off-list pricing never auto-confirm, they route to the person who owns that call, with the breach spelled out."],
      ["Can it handle Hindi and regional-language messages?", "Yes. Order extraction works across the languages your dealers actually use, including mixed-language messages."],
      ["What if the system misreads an order?", "Every auto-confirmed order carries its source message and the extraction beside it, so a misread is visible and traceable rather than silent. In practice extraction disagrees with your best order-entry person far less often than two of your order-entry people disagree with each other."],
      ["Does it manage order changes and cancellations?", "Yes, amendments thread onto the original order with full history, and downstream (dispatch, invoicing) sees one current version instead of three contradictory messages."],
      ["Does it write into our ERP or replace it?", "Writes into it. Your ERP stays the system that owns the data; this system removes the human keyboard between the dealer and the record."]
    ]
  },
  {
    slug: "freight-reconciliation",
    h1: "Freight bills that match themselves, or explain why not",
    h1html: 'Freight bills that match,<br>or <span class="accent">explain why</span> not.',
    cat: "Freight reconciliation automation",
    metaDesc: "Every carrier bill line matched against weighbridge, gate and delivery data. Clean lines clear automatically; disputes get flagged with evidence attached.",
    costNums: ["In a typical operation of this size, manual freight reconciliation holds 3 people for the first week of every month; that is 36 person-weeks a year spent matching paper.",
      "Unchallenged carrier overbilling, duplicate trips, inflated distances, rate misapplication, runs 1 to 3% of freight spend, and it leaks quietly."],
    system: "The system matches every carrier bill line against weighbridge tickets (the weight recorded at the gate scale), gate records and delivery confirmations. Clean lines clear automatically. Mismatches, a billed trip with no weighbridge record, a distance that grew 15% since last quarter, get flagged with the evidence attached, ready to send back to the carrier. Month-end reconciliation becomes an exception review, not an archaeology project.",
    landing: "The first pass runs on last quarter's already-paid bills, a backtest on money already out the door. That backtest is the sales pitch we do not have to write: it names the duplicate trips, the rate misapplications and the distance creep in your own data, with the evidence bundled per line. From there the system moves to live bills: clean lines clear the day they arrive, exceptions queue with their evidence, and your team's month-end week shrinks to a half-day review. Carriers adjust fast once disputes arrive with weighbridge tickets attached, the arguing stops when the receipts start.",
    signs: ["Freight bills get paid on trust in busy months because checking would delay everyone's payment.",
      "The same route's billed distance varies 20% between carriers and nobody has asked why.",
      "Disputes die because assembling the evidence takes longer than the amount is worth.",
      "You have never checked a full month of freight lines, only samples."],
    proof: "The same matching that runs at RockProsUSA, where 2,140 invoices went out with zero manual touches over the first twelve months, every match carrying the evidence behind it.",
    faq: [
      ["Our carriers bill in every format imaginable. Does that break it?", "No. PDFs, spreadsheets, scanned images, extraction handles all of them. Format chaos is a solved problem; missing source data is the only real blocker, and the system tells you when that is the case."],
      ["What happens to disputed lines?", "They queue for a person with the evidence bundled: the bill line, the matching records, the discrepancy. Nothing is sent to a carrier until your team approves it; the system then tracks the dispute to resolution."],
      ["Can it enforce our contracted rate cards?", "Yes. Rate cards load once; every bill line checks against them. Rate creep gets caught on the first bill, not at year end."],
      ["Will this sour carrier relationships?", "It usually improves them. Good carriers get paid faster because their clean bills clear same-day; only the padding gets disputed, and it gets disputed with evidence rather than suspicion."],
      ["What if our own weighbridge data has gaps?", "Then the system reports the gap honestly, a bill line with no matching ticket is flagged as unverifiable, not silently passed. Most operators fix the gate discipline within a month once the gaps have a number on them."],
      ["We already reconcile in Excel. Why change?", "Because Excel reconciles what someone has time to check. This checks everything, every line, every month, and shows its work."]
    ]
  },
  {
    slug: "ar-followup-automation",
    h1: "Receivables chased every day, escalated on rules, never dropped",
    h1html: 'Receivables chased daily,<br><span class="accent">never dropped.</span>',
    cat: "Accounts receivable follow-up automation",
    metaDesc: "Every open invoice chased on cadence, escalated by rule. Promises to pay tracked to their date and re-chased the morning after.",
    costNums: ["In a typical operation of this size, a collections follow-up that depends on one person's memory skips a third of due accounts in any given week, and the quiet accounts age silently.",
      "Every ten days added to DSO (days sales outstanding, how long your invoices take to get paid) is working capital parked in other people's businesses."],
    system: "The system watches every open invoice, sends reminders on the cadence you set, and escalates by rule, amount, age, customer tier, to the right human at the right moment. You can see what was sent, when, and what the customer replied. Promises to pay get tracked to their date and re-chased the morning after they break. Your team handles conversations; the system makes sure no account goes quiet.",
    landing: "Setup is one working session: your invoice feed, your customer tiers, and the escalation ladder, who gets pinged at 30 days, who picks up the phone at 60, whose name goes on the letter at 90. The first week runs reminders for your approval before sending, so you see exactly what customers will receive in your tone, not ours. After that the routine reminders run on the cadence you approved, and every escalation still lands with a person. The change your team feels is subtraction: no more Monday list-building, no more 'did anyone follow up with them?', the answer is one screen, not a memory. The change your customers feel is consistency, which is quietly the strongest collections lever there is.",
    signs: ["DSO is a number you calculate for the bank, not one you manage weekly.",
      "Collections follow-up collapses every time the person who owns it goes on leave.",
      "Promises to pay are remembered, not tracked, and remembered generously.",
      "Your largest overdue account is also the one nobody wants to call."],
    proof: "The same system that runs at RockProsUSA, where 2,140 invoices went out with zero manual touches over the first twelve months. That track record is what makes an automated reminder safe to point at your customers.",
    faq: [
      ["Will this annoy my customers?", "The cadence and tone are yours. Most operators find customers respond better to consistent, polite, accurate reminders than to the current pattern, silence, then an angry call at day 90."],
      ["Can it hold back on strategic accounts?", "Yes. Tiering is a first-class rule. Key accounts can route straight to a named owner with a prepared summary instead of an automated reminder."],
      ["Does it work with post-dated cheques and part-payments?", "Yes. Part-payments re-age the balance correctly; PDC dates suppress reminders until they matter, then verify clearance."],
      ["What channels does it use?", "Email and WhatsApp are standard; SMS and voice-note reminders where those are what your customers actually read. Escalations land as prepared briefs for a human call, not another automated message."],
      ["Can it reconcile payments against invoices automatically?", "Yes, incoming payments match to invoices including partial and clubbed payments, so reminders never chase money that already arrived, which is the fastest way an automated chaser loses a customer's respect."],
      ["How do I know it is working?", "The monthly report shows the DSO trend, the promise-kept rate and every action taken. If DSO does not move, the report names the sticking accounts."]
    ]
  },
  {
    slug: "compliance-documentation",
    h1: "Compliance filings assembled from operating data, not month-end panic",
    h1html: 'Compliance filings, not<br><span class="accent">month-end panic.</span>',
    cat: "Compliance documentation automation",
    metaDesc: "Royalty, tax, transport-permit and environmental filings built continuously from weighbridge and dispatch data. Month-end becomes a review.",
    costNums: ["In a typical operation of this size, royalty, GST (India's goods and services tax) and e-way documentation (the transport permit that travels with every consignment) consumes 8 to 12 person-days per site per month when assembled by hand from operating records.",
      "One missed or mismatched royalty filing can freeze dispatches for days, and a single day of stopped dispatch at a mid-size quarry is a day of deferred revenue and a customer queue you will hear about."],
    system: "The system builds the filings from the same operating data that runs your business: weighbridge tickets (the weight recorded at the gate scale) become royalty returns, dispatch records become e-way documentation, production logs feed environmental reports. Because the filings are assembled continuously, month-end is a review, not a reconstruction. Mismatches between what was filed and what was weighed surface immediately, while they are still corrections, not violations. Nothing is filed until a person has approved it.",
    landing: "Implementation begins with an honest inventory: which filings you owe, where each number in them actually comes from, and where today's process papers over gaps. Most operators discover their royalty return and their weighbridge log have never been systematically compared, the first reconciliation is uncomfortable and valuable in equal measure. Then the assembly goes continuous: every ticket and dispatch event lands in the right filing draft the day it happens. Your compliance person stops being an assembler under deadline and becomes a reviewer with slack, reviewing drafts that carry their evidence, days before they are due.",
    signs: ["The three days before a filing deadline are the worst three days of the month.",
      "Filed numbers and operating numbers are reconciled only when an inspector asks.",
      "One person holds the entire filing process, and their notice period is 30 days.",
      "You have paid a late fee this year for a filing whose data existed on time."],
    proof: "The same system that runs at RockProsUSA, where every reported number comes straight from the operating data that produced it. Compliance is where that discipline pays twice.",
    faq: [
      ["Our compliance rules change constantly. How does the system keep up?", "Rule changes are configuration, not rebuilds. When a format or threshold changes, the template updates once and every subsequent filing follows it."],
      ["Does it file directly with government portals?", "It prepares filing-ready artifacts and, where portals allow programmatic submission, files them. Where they do not, your team submits a prepared package instead of building one."],
      ["What about historical gaps, we are behind on documentation?", "The Diagnostic Sprint sizes the backlog first. Back-filling from existing weighbridge and dispatch records is usually possible for 12–18 months of history."],
      ["Can it handle multi-state GST and different state royalty regimes?", "Yes. Each site carries its own regime configuration; the group view shows every site's filing status on one board, which is usually the first time a director has seen that board at all."],
      ["What does an inspector see?", "A filing where every number comes straight from the ticket, dispatch record or production entry that produced it. Inspections get shorter when the evidence is already assembled."],
      ["Who is liable if a filing is wrong?", "Same as today: you. What changes is that every number in the filing comes straight from the operating data behind it, so wrong filings become rare and defensible instead of common and mysterious."]
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
    <p class="sub dim">A system we have built before, run by the Brain, WorkElate Chief: it proposes each action with its reasoning, and a person on your team approves it.</p>
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
    <p class="dim">Two weeks inside your operation to find out what ${p.cat.toLowerCase()} would return for you, before a price goes on it.</p>
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
    <p class="sub dim">These are not product tiers. Each one is a system we have designed, shipped and run on real operating data, with the Brain, WorkElate Chief, proposing and a person approving.</p>
    <p class="hero-cta"><a class="btn" href="/studio/contact">Book a Diagnostic Sprint</a></p>
  </div>
</section>

<section>
  <div class="wrap">
    <h2 style="margin-bottom:16px">The six, written up</h2>
    <p class="dim" style="margin-bottom:40px">Every page names what the problem costs today, how the system lands in an operation, and what it does not do.</p>
    ${PAGES.map((p, i) => `<a class="svc rv" href="/studio/systems/${p.slug}">
      <span class="num">${String(i + 1).padStart(2, "0")}</span><h3>${p.cat}</h3>
      <p class="dim">${p.metaDesc}</p>
    </a>`).join("\n    ")}
  </div>
</section>

<section class="deep">
  <div class="wrap">
    <span class="label">Not on this list</span>
    <h2>The list is where we have been, not where we stop.</h2>
    <p class="dim">Six write-ups is what we have documented, not the boundary of what we build. The delivery history behind them runs to 34 products across 9 sectors and 374 repositories since 2018; dispatch and reporting are simply the ones with the cleanest numbers. If your problem is not on this page, that is the normal case: the Diagnostic Sprint, a two-week, fixed-fee look at one workflow, exists to size it.</p>
    <p style="margin-top:24px"><a href="/studio/case-studies">See the case studies</a> · <a href="/studio/how-we-work">How we work</a> · <a href="/studio/contact">Talk to us</a></p>
    <p class="dim srcnote">Updated 15 September 2026 &middot; WE_AINA</p>
  </div>
</section>

<section id="cta">
  <div class="wrap">
    <h2>Book a Diagnostic Sprint</h2>
    <p class="dim">If your problem is not one of the six, the Sprint is how it gets sized and priced.</p>
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
