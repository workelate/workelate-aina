// Prompt 6, programmatic /systems/ pages from one template.
// v2: 900-1100 words/page, handwritten meta descriptions (≤155 chars),
// Service JSON-LD with category serviceType, rotated sibling links so every
// page receives internal links, CTA above the FAQ block.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT = path.join(import.meta.dirname, "..", "site", "systems");
mkdirSync(OUT, { recursive: true });

const PAGES = [
  {
    slug: "quarry-dispatch-automation",
    h1: "Trucks that stop waiting: quarry dispatch that runs itself",
    cat: "Quarry dispatch automation",
    metaDesc: "AI dispatch for quarries: truck assignment, cycle tracking, exception alerts. The system that cut dispatch cycle time 38% across 13 quarries.",
    costNums: ["A 22-minute average gate-to-load wait across 40 trucks burns roughly 290 driver-hours a month at one site.",
      "One mis-assigned haul per shift, at 3 shifts a day, is about 90 wasted cycles a month, fuel, wear and driver pay with no material moved."],
    system: "The system watches orders, truck positions and weighbridge events, then proposes the next assignment before the dispatcher asks for it. It tracks every cycle end to end, flags the ones that break pattern, a loader down, a queue forming, a driver stuck at the pit, and escalates only those. Dispatchers stop juggling radios and start approving decisions. Every assignment carries the reasoning it was made with, so a bad call can be traced in one click instead of one argument.",
    landing: "Week one, the system runs in shadow mode: it watches your dispatch decisions and proposes its own in parallel, and nobody's workflow changes. Week two, you compare its proposals against what your dispatchers actually did, the gaps go both ways, and both are useful. From week three, dispatchers approve assignments from a queue instead of building them from radio calls. The transition is deliberately boring: no big-bang cutover, no retraining week, no consultants standing behind chairs. The dispatch office on day 30 looks like the dispatch office on day 1, minus the shouting.",
    signs: ["Trucks queue at the gate while a loaded pit sits idle two benches away.",
      "Your best dispatcher is unpromotable because nobody else can hold the board in their head.",
      "Cycle counts come from a diary, and the diary disagrees with the weighbridge.",
      "Evening reconciliation regularly finds hauls nobody can explain."],
    proof: "This is the system running 13 quarries at RockProsUSA today. Dispatch cycle time fell 38% in the first quarter after cutover.",
    faq: [
      ["Does this replace my dispatchers?", "No. It replaces the parts of their day that are radio tag and spreadsheet copying. Assignment decisions stay human-approved until you decide otherwise, the system earns autonomy per decision type, with logs to justify it."],
      ["We run mixed fleets, owned and hired trucks. Does that work?", "Yes. Hired trucks are tracked from gate-in to gate-out even without telematics, using weighbridge and gate events. Owned trucks with GPS get full cycle tracking."],
      ["What data does it need on day one?", "Orders, truck list, and weighbridge feed. That is enough to start proposing assignments. Telematics and loader status make it sharper but are not prerequisites."],
      ["What happens when the internet drops at the pit?", "Dispatch falls back to the last approved plan and queues events locally; when the link returns, the system reconciles what actually happened against what was planned and flags the gaps. A connectivity blip never blanks the board."],
      ["Can it handle multiple sites with shared fleet?", "Yes, that is precisely the RockProsUSA configuration: 13 sites, one system, trucks moving between quarries as demand shifts. Cross-site allocation is proposed with the same reasoning attached as single-site assignments."],
      ["How long until it pays for itself?", "At RockProsUSA scale the returned hours covered the build cost inside two quarters. Your Diagnostic Sprint report puts conservative numbers on your specific operation before you commit."]
    ]
  },
  {
    slug: "plant-production-reporting",
    h1: "The 6 AM production report nobody had to write",
    cat: "Plant production reporting automation",
    metaDesc: "Shift logs, weighbridge tickets and downtime entries become a daily production report by 6 AM, reconciled, discrepancies flagged, no human in the loop.",
    costNums: ["A plant manager spending 90 minutes a day assembling shift data loses about 33 working days a year to copying numbers between systems.",
      "Decisions made on day-old production data cost real tonnage: a crusher running 7% under rate for two days before anyone notices is roughly 800 tonnes of lost throughput at a mid-size plant."],
    system: "The system pulls shift logs, weighbridge tickets, downtime entries and energy readings as they happen, reconciles them against each other, and writes the daily production report before the morning meeting. Discrepancies, tonnage that does not match tickets, downtime nobody entered, are flagged in the report, not buried under it. The report reads like your best plant manager wrote it, because it is built from the questions they would ask.",
    landing: "The first two weeks are plumbing: connectors to wherever your data actually lives, Tally exports, the weighbridge PC, the operator's shift-log spreadsheet, the DCS historian if you have one. Nothing about how your operators record data changes; the system meets the data where it is. By week three you get a parallel report every morning alongside whatever you produce today. You mark what is wrong or missing, the reconciliation rules tighten, and within a month the parallel report is the report. The person who used to assemble it gets their mornings back, most plants redeploy them onto the discrepancies the report now surfaces.",
    signs: ["The morning meeting argues about what happened instead of what to do.",
      "Downtime totals differ depending on who you ask.",
      "Month-end production numbers get 'adjusted' and nobody can say why.",
      "Your MIS is accurate but ten days late, or timely but wrong."],
    proof: "The same reporting spine runs inside the RockProsUSA deployment, 11,200 ops hours returned across the account in year one, a large share of them reporting hours.",
    faq: [
      ["Our data lives in Tally, Excel and a DCS. Can it read all three?", "Yes. The system was built for exactly that mess. Connectors handle ERP exports, spreadsheet drops and historian feeds; reconciliation happens in the middle layer."],
      ["What if the underlying data is wrong?", "Then the report says so, with the specific mismatch called out. Bad data flagged at 6 AM is a fixable problem; bad data discovered at month-end is a write-off."],
      ["Can it write the MIS my directors already expect?", "Yes. The output template is yours, same structure your board reads today, produced without the three people who currently assemble it."],
      ["Do operators have to enter data differently?", "No. Changing operator behavior is where reporting projects die, so we refuse to depend on it. The system adapts to your logs as they are; if a specific field would sharpen the report materially, we tell you the trade-off and you decide."],
      ["What about multiple plants?", "Each plant gets its own daily report; a group roll-up compares plants on the same definitions, which is usually the first time the definitions have actually matched."],
      ["Daily only, or shift-level too?", "Both. Shift handover summaries generate at shift close; the daily rolls them up. Weekly and monthly views come from the same data with no extra work."]
    ]
  },
  {
    slug: "dealer-order-management",
    h1: "Every dealer order in one queue, confirmed in minutes",
    cat: "Dealer order management automation",
    metaDesc: "Orders from WhatsApp, phone and email become one validated queue. Clean orders auto-confirm to the dealer in minutes; exceptions route to a human.",
    costNums: ["An order taken on WhatsApp, re-typed into the ERP, then confirmed by callback touches 3 people and takes 40+ minutes. At 60 orders a day that is 40 hours of pure re-typing a week.",
      "Mis-keyed orders, wrong grade, wrong quantity, wrong site, run 2–4% in manual flows. On ₹50 Cr of dispatches that is ₹1–2 Cr of material moving to the wrong place before anyone catches it."],
    system: "The system reads orders as they arrive, WhatsApp, email, phone transcripts, extracts grade, quantity, site and requested date, checks them against credit limits and stock, and drops them into one queue. Clean orders get confirmed back to the dealer automatically; ambiguous ones go to a human with the ambiguity highlighted. The dealer gets a confirmation in minutes instead of a callback in hours, and your team stops being a transcription service.",
    landing: "Rollout starts with a read-only fortnight: the system ingests your order channels and shows you what it extracted next to what your team keyed in. That comparison is usually the first honest measurement of your current error rate. Then auto-confirmation switches on for the cleanest slice, repeat orders from known dealers within credit, which is typically 60-70% of volume. The remainder keeps a human in the loop, with the system doing the reading and the checking. Dealers notice exactly one change: confirmations arrive in minutes, at any hour, including Sunday evening when they actually place orders.",
    signs: ["Order-entry staff spend evenings clearing a WhatsApp backlog.",
      "Dealers call to confirm the order they already sent, because silence means uncertainty.",
      "Credit breaches get discovered at dispatch, not at order time.",
      "Two people key the same order twice a week."],
    proof: "Built on the same agent spine as the RockProsUSA deployment, where 2,140 invoices have flowed through with zero manual touches.",
    faq: [
      ["Our dealers will not change how they order. Do they have to?", "No. That is the point. They keep sending WhatsApp messages; the system meets them there. Nothing changes on the dealer side except faster confirmations."],
      ["What about credit holds and pricing exceptions?", "Rules you set. Orders breaching credit or off-list pricing never auto-confirm, they route to the person who owns that call, with the breach spelled out."],
      ["Can it handle Hindi and regional-language messages?", "Yes. Order extraction works across the languages your dealers actually use, including mixed-language messages."],
      ["What if the system misreads an order?", "Every auto-confirmed order carries its source message and the extraction beside it, so a misread is visible and traceable rather than silent. In practice extraction disagrees with your best order-entry person far less often than two of your order-entry people disagree with each other."],
      ["Does it manage order changes and cancellations?", "Yes, amendments thread onto the original order with full history, and downstream (dispatch, invoicing) sees one current version instead of three contradictory messages."],
      ["Does it write into our ERP or replace it?", "Writes into it. Your ERP stays the system of record; this system removes the human keyboard between the dealer and the record."]
    ]
  },
  {
    slug: "freight-reconciliation",
    h1: "Freight bills that match themselves, or explain why not",
    cat: "Freight reconciliation automation",
    metaDesc: "Every carrier bill line matched against weighbridge, gate and delivery data. Clean lines clear automatically; disputes get flagged with evidence attached.",
    costNums: ["Manual freight reconciliation typically holds 3 people for the first week of every month; that is 36 person-weeks a year spent matching paper.",
      "Unchallenged carrier overbilling, duplicate trips, inflated distances, rate misapplication, runs 1–3% of freight spend. On ₹10 Cr of annual freight that is ₹10–30 lakh leaking quietly."],
    system: "The system matches every carrier bill line against weighbridge tickets, gate logs and delivery confirmations. Clean lines clear automatically. Mismatches, a billed trip with no weighbridge record, a distance that grew 15% since last quarter, get flagged with the evidence attached, ready to send back to the carrier. Month-end reconciliation becomes an exception review, not an archaeology project.",
    landing: "The first pass runs on last quarter's already-paid bills, a backtest on money already out the door. That backtest is the sales pitch we do not have to write: it names the duplicate trips, the rate misapplications and the distance creep in your own data, with the evidence bundled per line. From there the system moves to live bills: clean lines clear the day they arrive, exceptions queue with their evidence, and your team's month-end week shrinks to a half-day review. Carriers adjust fast once disputes arrive with weighbridge tickets attached, the arguing stops when the receipts start.",
    signs: ["Freight bills get paid on trust in busy months because checking would delay everyone's payment.",
      "The same route's billed distance varies 20% between carriers and nobody has asked why.",
      "Disputes die because assembling the evidence takes longer than the amount is worth.",
      "You have never audited a full month of freight lines, only samples."],
    proof: "The matching engine descends from the RockProsUSA invoice pipeline, 2,140 invoices processed with zero manual touches and every match decision carrying the evidence behind it.",
    faq: [
      ["Our carriers bill in every format imaginable. Does that break it?", "No. PDFs, spreadsheets, scanned images, extraction handles all of them. Format chaos is a solved problem; missing source data is the only real blocker, and the system tells you when that is the case."],
      ["What happens to disputed lines?", "They queue with evidence bundled: the bill line, the matching records, the discrepancy. Your team sends the dispute in two clicks; the system tracks it to resolution."],
      ["Can it enforce our contracted rate cards?", "Yes. Rate cards load once; every bill line checks against them. Rate creep gets caught on the first bill, not the annual audit."],
      ["Will this sour carrier relationships?", "It usually improves them. Good carriers get paid faster because their clean bills clear same-day; only the padding gets disputed, and it gets disputed with evidence rather than suspicion."],
      ["What if our own weighbridge data has gaps?", "Then the system reports the gap honestly, a bill line with no matching ticket is flagged as unverifiable, not silently passed. Most operators fix the gate discipline within a month once the gaps have a number on them."],
      ["We already reconcile in Excel. Why change?", "Because Excel reconciles what someone has time to check. This checks everything, every line, every month, and shows its work."]
    ]
  },
  {
    slug: "ar-followup-automation",
    h1: "Receivables chased every day, escalated on rules, never dropped",
    cat: "Accounts receivable follow-up automation",
    metaDesc: "Every open invoice chased on cadence, escalated by rule. Promises to pay tracked to their date and re-chased the morning after.",
    costNums: ["A collections follow-up that depends on one person's memory skips 30–40% of due accounts in any given week, the quiet accounts age silently.",
      "Every 10 days of DSO on ₹50 Cr revenue is roughly ₹1.4 Cr of working capital parked in other people's businesses."],
    system: "The system watches every open invoice, sends reminders on the cadence you set, and escalates by rule, amount, age, customer tier, to the right human at the right moment. You can see what was sent, when, and what the customer replied. Promises to pay get tracked to their date and re-chased the morning after they break. Your team handles conversations; the system makes sure no account goes quiet.",
    landing: "Setup is one working session: your invoice feed, your customer tiers, and the escalation ladder, who gets pinged at 30 days, who picks up the phone at 60, whose name goes on the letter at 90. The first week runs reminders for your approval before sending, so you see exactly what customers will receive in your tone, not ours. After that the cadence runs itself. The change your team feels is subtraction: no more Monday list-building, no more 'did anyone follow up with them?', the answer is in the log, timestamped. The change your customers feel is consistency, which is quietly the strongest collections lever there is.",
    signs: ["DSO is a number you calculate for the bank, not one you manage weekly.",
      "Collections follow-up collapses every time the person who owns it goes on leave.",
      "Promises to pay are remembered, not tracked, and remembered generously.",
      "Your largest overdue account is also the one nobody wants to call."],
    proof: "Runs on the same delivery spine proven at RockProsUSA, where 2,140 invoices went out with zero manual touches. That track record is what makes an automated chaser safe to point at your customers.",
    faq: [
      ["Will this annoy my customers?", "The cadence and tone are yours. Most operators find customers respond better to consistent, polite, accurate reminders than to the current pattern, silence, then an angry call at day 90."],
      ["Can it hold back on strategic accounts?", "Yes. Tiering is a first-class rule. Key accounts can route straight to a named owner with a prepared summary instead of an automated reminder."],
      ["Does it work with post-dated cheques and part-payments?", "Yes. Part-payments re-age the balance correctly; PDC dates suppress reminders until they matter, then verify clearance."],
      ["What channels does it use?", "Email and WhatsApp are standard; SMS and voice-note reminders where those are what your customers actually read. Escalations land as prepared briefs for a human call, not another automated message."],
      ["Can it reconcile payments against invoices automatically?", "Yes, incoming payments match to invoices including partial and clubbed payments, so reminders never chase money that already arrived, which is the fastest way an automated chaser loses a customer's respect."],
      ["How do I know it is working?", "The monthly report shows DSO trend, promise-kept rate and every action taken. If DSO does not move, the report names the sticking accounts."]
    ]
  },
  {
    slug: "compliance-documentation",
    h1: "Compliance filings assembled from operating data, not month-end panic",
    cat: "Compliance documentation automation",
    metaDesc: "Royalty, GST, e-way and environmental filings built continuously from weighbridge and dispatch data. Month-end becomes a review, not a reconstruction.",
    costNums: ["Royalty, GST and e-way documentation typically consumes 8–12 person-days per site per month when assembled by hand from operating records.",
      "One missed or mismatched royalty filing can freeze dispatches for days; a single day of stopped dispatch at a mid-size quarry is ₹8–15 lakh of deferred revenue and a customer queue you will hear about."],
    system: "The system builds compliance artifacts from the same operating data that runs your business: weighbridge tickets become royalty returns, dispatch records become e-way documentation, production logs feed environmental reports. Because the filings are assembled continuously, month-end is a review, not a reconstruction. Mismatches between what was filed and what was weighed surface immediately, while they are still corrections, not violations.",
    landing: "Implementation begins with an honest inventory: which filings you owe, where each number in them actually comes from, and where today's process papers over gaps. Most operators discover their royalty return and their weighbridge log have never been systematically compared, the first reconciliation is uncomfortable and valuable in equal measure. Then the assembly goes continuous: every ticket and dispatch event lands in the right filing draft the day it happens. Your compliance person stops being an assembler under deadline and becomes a reviewer with slack, reviewing drafts that carry their evidence, days before they are due.",
    signs: ["The three days before a filing deadline are the worst three days of the month.",
      "Filed numbers and operating numbers are reconciled only when an inspector asks.",
      "One person holds the entire filing process, and their notice period is 30 days.",
      "You have paid a late fee this year for a filing whose data existed on time."],
    proof: "Built on the same architecture running at RockProsUSA, where every filed number comes straight from the operating data that produced it. Compliance is where that discipline pays twice.",
    faq: [
      ["Our compliance rules change constantly. How does the system keep up?", "Rule changes are configuration, not rebuilds. When a format or threshold changes, the template updates once and every subsequent filing follows it."],
      ["Does it file directly with government portals?", "It prepares filing-ready artifacts and, where portals allow programmatic submission, files them. Where they do not, your team submits a prepared package instead of building one."],
      ["What about historical gaps, we are behind on documentation?", "The Diagnostic Sprint sizes the backlog first. Back-filling from existing weighbridge and dispatch records is usually possible for 12–18 months of history."],
      ["Can it handle multi-state GST and different state royalty regimes?", "Yes. Each site carries its own regime configuration; the group view shows every site's filing status on one board, which is usually the first time a director has seen that board at all."],
      ["What does an inspector see if they audit us?", "A filing where every number comes straight from the ticket, dispatch record or production entry that produced it. Inspections get shorter when the evidence is already assembled."],
      ["Who is liable if a filing is wrong?", "Same as today: you. What changes is that every number in the filing comes straight from the operating data behind it, so wrong filings become rare and defensible instead of common and mysterious."]
    ]
  }
];

const page = (p, idx) => {
  // rotated siblings: each page links the NEXT 3 in circular order, so all 6
  // pages receive exactly 3 inbound internal links
  const siblings = [1, 2, 3].map(k => PAGES[(idx + k) % PAGES.length]);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${p.h1}, WE_AINA</title>
<meta name="description" content="${p.metaDesc}">
<link rel="preload" as="font" type="font/woff2" href="/fonts/bricolage-var-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="/fonts/inter-var-latin.woff2" crossorigin>
<link rel="stylesheet" href="/css/site.css">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="canonical" href="https://weaina.com/systems/${p.slug}">
<meta property="og:type" content="website">
<meta property="og:title" content="${p.h1}, WE_AINA">
<meta property="og:description" content="${p.metaDesc}">
<meta property="og:image" content="https://weaina.com/og.png">
<meta property="og:url" content="https://weaina.com/systems/${p.slug}">
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
  provider: { "@type": "Organization", name: "WE_AINA", url: "https://weaina.com/" },
  url: `https://weaina.com/systems/${p.slug}`
}, null, 1)}
</script>
</head>
<body>
<header class="nav"><div class="wrap row">
  <a class="logo" href="/">WE_<span>AINA</span></a>
  <nav>
    <a href="/how-we-work">How we work</a>
    <a href="/about">About</a>
    <a href="/case-studies">Case studies</a>
    <a href="/blog">Blog</a>
    <a href="/systems/${p.slug}" aria-current="page">Systems</a>
    <a class="btn" href="/#cta">Get your AI Readiness Score</a>
  </nav>
</div></header>
<section id="hero" style="min-height:auto">
  <div class="wrap">
    <span class="label"><a href="/">WE_AINA</a> / systems</span>
    <h1>${p.h1}</h1>
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
    <p>${p.system}</p>
    <p class="accent" style="margin-top:24px">${p.proof}</p>
  </div>
</section>

<section class="deep">
  <div class="wrap">
    <span class="label">How it lands in your operation</span>
    <p>${p.landing}</p>
    <h3 style="margin-top:48px">Signs you need this</h3>
    ${p.signs.map(s => `<p class="dim" style="margin-top:12px">- ${s}</p>`).join("\n    ")}
  </div>
</section>

<section id="cta">
  <div class="wrap">
    <h2>Get your AI Readiness Score</h2>
    <p class="dim">Five questions. Your report, three automation opportunities with conservative numbers, arrives in 10 minutes.</p>
    <p style="margin-top:24px"><a class="btn" href="/#cta">Get your AI Readiness Score</a></p>
  </div>
</section>

<section>
  <div class="wrap">
    <span class="label">Questions operators ask</span>
    ${p.faq.map(([q, a]) => `<div class="step"><span class="k">Q</span><div><h3>${q}</h3><p class="dim">${a}</p></div></div>`).join("\n    ")}
    <p class="dim" style="margin-top:48px">Related systems: ${siblings.map(x =>
      `<a href="/systems/${x.slug}">${x.cat.toLowerCase()}</a>`).join(" · ")}</p>
  </div>
</section>

<footer class="mega">
  <div class="wrap">
    <div class="cols">
      <div class="brand">
        <a class="logo" href="/">WE_<span>AINA</span></a>
        <p>Digital transformation, delivered 10×. WorkElate's AI-Native Agency: our delivery runs on our own platform, weeks not quarters, $30K–$100K fixed, receipts at every step.</p>
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
        <a href="/#cta">Get your AI Readiness Score</a>
        <a href="/how-we-work">The Diagnostic Sprint</a>
        <a href="/blog/receipts-over-decks">Our audit-trail promise</a>
      </div>
    </div>
    <div class="baseline">
      <span>© 2026 WE_AINA · WorkElate's AI-Native Agency · Chitransh Agnihotri & Pratik Kinage</span>
    </div>
  </div>
</footer>
<script type="module" src="/js/reveal.js"></script>
</body>
</html>`;
};

PAGES.forEach((p, i) => writeFileSync(path.join(OUT, `${p.slug}.html`), page(p, i)));

// sitemap
const urls = [
  "https://weaina.com/",
  "https://weaina.com/how-we-work",
  "https://weaina.com/about",
  "https://weaina.com/case-studies",
  "https://weaina.com/blog",
  "https://weaina.com/blog/the-pyramid-cant-survive-agents",
  "https://weaina.com/blog/receipts-over-decks",
  ...PAGES.map(p => `https://weaina.com/systems/${p.slug}`)
];
writeFileSync(path.join(OUT, "..", "sitemap.xml"),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>
`);
writeFileSync(path.join(OUT, "..", "robots.txt"),
`User-agent: *
Allow: /
Sitemap: https://weaina.com/sitemap.xml
`);
console.log(`wrote ${PAGES.length} system pages + sitemap.xml + robots.txt`);
