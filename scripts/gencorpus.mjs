// Builds the retrieval corpus the on-page assistant answers from.
// Sources: data/projects.json (delivery portfolio, derived from the GitHub
// crawl), data/cases.json (published case studies) and a hand-written set of
// firm facts. Output is a single small JSON the browser fetches once.
//
// Keep this a GENERATOR. Editing site/data/corpus.json by hand dies on the
// next run.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { FEATURED, INDUSTRIES, CASE_RP } from "./workdata.mjs";

const ROOT = path.join(import.meta.dirname, "..");
const read = p => JSON.parse(readFileSync(path.join(ROOT, p), "utf8"));

const { projects } = read("data/projects.json");
const { cases } = read("data/cases.json");

// Firm facts the assistant must be able to answer without hedging. Every
// number here has to be defensible; no aspirational figures.
// Order matters: on a tie the FIRST fact wins (the scorer keeps the incumbent
// unless a later fact scores strictly higher). The buyer-anxiety facts below
// are deliberately first, because their questions ("can I talk to a customer",
// "where are you") share generic words with the older facts ("call", "talk",
// "people") and were losing the tie to them.
const FACTS = [
  {
    // Measured miss: "what if it doesn't work" returned the WorkElate product
    // blurb. Every clause here is on how-we-work.html or about.html already.
    // Apostrophes are stripped before matching, so triggers are written flat.
    id: "guarantee",
    q: ["what if it doesnt work", "doesnt work", "does not work", "dont work", "didnt work", "guarantee", "guarantees", "guaranteed", "refund", "money back", "what if it fails", "it fails", "goes wrong", "go wrong", "worst case", "no results", "doesnt deliver", "over budget", "overrun", "who carries the risk", "our risk", "downside"],
    a: "Three things carry that risk instead of you. The price is fixed before we start, so an overrun is our problem and not a change order. Every build runs a deterministic verify gate plus weekly demos on your real data from week 3, so you watch it work long before you sign anything off. And if the Diagnostic Sprint finds nothing worth building, we say so in writing and you keep your money. Beyond that we do not publish a money-back guarantee, and I am not going to invent one: ask us directly and you get a straight answer rather than a clause.",
    links: [{ label: "How engagement works", href: "/how-we-work" }, { label: "Talk to the team", href: "/contact" }]
  },
  {
    // Measured miss: "what happens if you disappear halfway like our last dev
    // shop" returned the WorkElate blurb, while the site's own answer sat in
    // how-we-work.html ("Documented handover; you can fire us and keep
    // everything") and about.html ("You own everything").
    id: "exit",
    q: ["disappear", "disappears", "disappeared", "walk away", "walks away", "walked away", "halfway", "half way", "hit by a bus", "bus factor", "if you quit", "if you stop", "stop working", "go away", "handover", "hand over", "handoff", "transition out", "continuity", "fire you", "fire us", "sack you", "drop us", "last dev shop", "last agency", "last vendor", "previous shop", "ghosted", "vanish", "vanished", "only two of you", "two of you", "what if you leave"],
    a: "You own the code and the data from day one, the handover is documented, and nothing requires us to stay for the system to keep running. You can fire us and keep everything, which is the point of a fixed price with the team that built it accountable for it, rather than a maintenance contract. That is also why the build ships in weeks with demos on your data every week: there is no long stretch where you are holding nothing.",
    links: [{ label: "How we work", href: "/how-we-work" }, { label: "About us", href: "/about" }]
  },
  {
    // Measured miss: "can I talk to one of your customers" and "do you have
    // references I can call" both returned the same deflection twice. The
    // honest answer is that we do not publish a reference list.
    id: "references",
    q: ["reference", "references", "referenceable", "reference call", "talk to a customer", "talk to a client", "talk to one of your customers", "your customers", "customers", "speak to a client", "speak to a customer", "call a client", "call one of your clients", "testimonial", "testimonials", "referee", "introduce me", "past client", "existing client", "existing clients", "vouch", "someone i can call", "backchannel"],
    // No "Label: a, b, c." opening, the renderer turns that shape into
    // bullets and these clauses read as fragments when it does.
    a: "We do not publish a reference list, and most client names are held under NDA, so I cannot hand you a contact from this page. Ask us and you will get a straight answer on which clients can be approached and which cannot. What is public without asking anyone is the case studies, where each number is tied to a system we shipped.",
    links: [{ label: "Case studies", href: "/case-studies" }, { label: "Talk to the team", href: "/contact" }]
  },
  {
    // Measured miss: "where are you located" hit the generic fallback. The
    // site publishes no office address, so this says that rather than
    // inventing one. FOUNDER-BLOCKED: registered entity, city, time zone.
    id: "location",
    q: ["where are you", "where are you located", "where are you based", "located", "location", "based", "office", "offices", "headquarters", "head office", "hq", "address", "which city", "which country", "what country", "time zone", "timezone", "onsite", "on site", "in person", "remote team", "near me", "visit us", "come to our office"],
    a: "We have not published an office address on this site and I am not going to make one up. What is on record: the work has been delivered across India, the US and Mexico, and diagnosis happens inside your operation rather than in an offshore delivery centre, we sit in your dispatch office, your studio, your finance room. For the registered entity, the city and who signs the contract, ask us directly.",
    links: [{ label: "How we work", href: "/how-we-work" }, { label: "Talk to the team", href: "/contact" }]
  },
  {
    // Measured miss: "do you have SOC2 / how do you handle our data security"
    // returned the WorkElate product blurb. The site states no security
    // posture; claiming one would be the exact lie the local engine exists to
    // prevent. FOUNDER-BLOCKED: certifications, data residency, DPA/NDA.
    id: "security",
    q: ["soc2", "soc 2", "iso 27001", "iso27001", "iso certification", "gdpr", "hipaa", "security", "secure", "data security", "infosec", "information security", "penetration test", "pentest", "vulnerability", "privacy", "privacy policy", "confidential", "confidentiality", "nda", "dpa", "data processing agreement", "data residency", "where is our data", "who sees our data", "data protection", "certification", "certifications", "vendor security", "security questionnaire", "encryption"],
    a: "We have not published a security posture, a SOC 2 or an ISO certificate on this site, and I will not claim a badge we have not shown you. What is true and on record: you own the code and the data, there is no lock-in clause and nothing requires us to stay for the system to keep running, and client names are held under NDA unless the client clears them. For certifications, data residency and an NDA or DPA, put it to us before the Sprint and you get a straight answer instead of a logo wall.",
    links: [{ label: "How we work", href: "/how-we-work" }, { label: "Talk to the team", href: "/contact" }]
  },
  {
    id: "price",
    q: ["price", "cost", "budget", "fee", "how much", "expensive", "rate", "pricing", "afford"],
    a: "Builds are fixed price, $30K to $100K, agreed before we start. Most first systems land in the $30K to $50K band; multi-site builds run higher. The two-week Diagnostic Sprint is what sets that number.",
    links: [{ label: "How engagement works", href: "/how-we-work" }]
  },
  {
    id: "speed",
    // "weeks" removed as a trigger: it appears in half the questions a visitor
    // asks ("an MVP in weeks", "live in weeks") and was stealing them from the
    // more specific facts. "mvp" belongs to the mvp fact, not here.
    q: ["how long", "timeline", "how fast", "duration", "deadline", "quickly", "how soon", "when can you"],
    a: "Diagnostic Sprint takes two weeks. The build runs weeks, not quarters, with demos on your real data every week. Before agents this same scope took us nine to twelve months.",
    links: [{ label: "How engagement works", href: "/how-we-work" }]
  },
  {
    id: "team",
    q: ["who", "team", "size", "people", "partners", "juniors", "account manager", "founders"],
    a: "A tier-1 team: senior engineers, product and growth people, with an AI fleet doing the volume work. We sit with you, own the outcome end to end and drive it until it ships. No account manager between you and the people building it.",
    links: [{ label: "About us", href: "/about" }]
  },
  {
    id: "why",
    q: ["why you", "why work", "different", "compare", "versus", "instead", "big four", "consultancy", "competitor", "accenture", "tcs", "infosys", "wipro", "dxc", "coforge", "cognizant", "vs agency", "why not a big firm"],
    a: "A pyramid firm, Accenture, TCS, Infosys, DXC, prices your project as a headcount line: revenue for them, a rate-card discount for you, and impact is nobody's number. We fix the price to the build instead, so shipping it faster is our gain. Same scope, a third to a quarter of the cost, in weeks.",
    links: [{ label: "How we work", href: "/how-we-work" }, { label: "Why the pyramid can't survive agents", href: "/blog/the-pyramid-cant-survive-agents" }]
  },
  {
    id: "trust",
    q: ["proof", "trust", "reference", "portfolio", "experience", "track record", "done before", "credentials", "how many projects", "how much work"],
    a: "25+ products shipped across six industries since 2018. Whole systems with their apps, backends, admin consoles and integrations, not a wall of demos. Ask about your industry and I will point you at the closest one.",
    links: [{ label: "Depth and width", href: "/#portfolio" }, { label: "Case studies", href: "/case-studies" }]
  },
  {
    id: "sectors",
    q: ["industry", "industries", "sector", "sectors", "verticals", "who do you work with", "clients", "kind of business", "worked with"],
    a: "Six industries, on purpose: building materials, logistics and dispatch, OOH and digital billboards, fintech, manufacturing, re-commerce and retail. Earlier builds also reach education, legal technology, real estate and service operations.",
    links: [{ label: "Depth and width", href: "/#portfolio" }]
  },
  {
    id: "enterprise",
    // plurals are listed explicitly: matching is word-boundary, so "enterprise"
    // does not match "enterprises" and the question fell through to a project
    q: ["enterprise", "enterprises", "large company", "large companies", "big company", "big companies", "listed", "corporate", "conglomerate", "serious client", "serious clients", "name your clients", "client names", "logos"],
    a: "Yes, including listed developers and diversified industrial groups. Several do not publicise their vendors, so we name them in the room with their permission rather than on a landing page. What we can show you publicly is the work itself.",
    links: [{ label: "Depth and width", href: "/#portfolio" }, { label: "Case studies", href: "/case-studies" }]
  },
  {
    id: "erp",
    q: ["tally", "erp integration", "accounting software", "connector", "erp connector", "books", "gst"],
    a: "We have built Tally connectors more than a dozen times over. Most Indian businesses run on it, most integrations with it are written once and abandoned, and we have been back to that problem enough times to know exactly where it breaks.",
    links: [{ label: "Depth and width", href: "/#portfolio" }]
  },
  {
    id: "start",
    q: ["start", "begin", "next step", "get going", "engage", "talk", "call", "reach", "book", "sprint", "diagnostic", "proposal", "quote"],
    a: "Tell me your industry and the process that hurts and I will show you the closest thing we have built. When you want it costed, the two-week Diagnostic Sprint ends with a build plan and a fixed price, and if we find nothing worth building we say so in writing.",
    links: [{ label: "How engagement works", href: "/how-we-work" }]
  },
  {
    id: "own",
    // "we don't want to be locked in to you" used to return a scholarship
    // marketplace: the triggers only covered "lock in", never "locked in".
    q: ["own", "ownership", "code", "lock in", "lockin", "lock-in", "locked in", "locked into", "vendor lock", "tied in", "ip", "source", "leave"],
    a: "You own the code and the data. No lock-in clause buried on page 14, and nothing that requires us to stay for the system to keep running.",
    links: [{ label: "How we work", href: "/how-we-work" }]
  },
  {
    id: "ai",
    q: ["ai", "agent", "agents", "llm", "automation", "machine learning", "chatbot"],
    a: "Agents do the volume work: reading messy input, matching records, drafting, chasing and reporting. People keep the judgement calls. That split is the whole method, and we run it on our own delivery first.",
    links: [{ label: "How we work", href: "/how-we-work" }]
  },

  // ---- product-studio questions (founder call 2026-07-22: the assistant was
  // answering operations-automation questions from the old positioning) ----
  {
    id: "build",
    q: ["what do you build", "what do you actually build", "what do you make", "services", "what you do", "offering", "capabilities", "product studio"],
    a: "Four shapes of work: a product built from zero, a platform with several apps on one backend, AI features inside a product that already exists, and the internal systems a company runs on. Web, mobile and the backend under them.",
    links: [{ label: "See what we have built", href: "/case-studies" }]
  },
  {
    id: "mvp",
    q: ["mvp", "from scratch", "zero", "new product", "greenfield", "idea", "prototype", "v1", "first version", "ship a product"],
    a: "A first version is where the fixed price works hardest: we scope it in the two-week Sprint, then build it for $30K to $100K in weeks. You get a product real users can hit, not a prototype that needs rebuilding.",
    links: [{ label: "How engagement works", href: "/how-we-work" }]
  },
  {
    id: "mobile",
    q: ["mobile", "app", "ios", "android", "react native", "phone app", "mobile app"],
    a: "Yes. At RockProsUSA we shipped three separate React Native apps, one each for customers, truckers and drivers, against a shared backend. Field apps are a different discipline from web and we build both.",
    links: [{ label: "Read the case study", href: "/case-studies" }]
  },
  {
    id: "platform",
    q: ["platform", "marketplace", "two sided", "two-sided", "saas", "multi tenant", "multi-tenant", "portal", "dashboard"],
    a: "Our largest builds are platforms, not single apps. Edunomics runs donor, applicant and admin surfaces on 33 endpoints; WorkElate is a whole suite of apps on one backend. Multi-role and multi-tenant is the normal case for us.",
    links: [{ label: "See what we have built", href: "/case-studies" }]
  },
  {
    id: "aifeature",
    q: ["add ai", "ai features", "ai into", "existing product", "llm features", "ai feature", "intelligence", "copilot", "recommendation"],
    a: "We shipped a detection model running in the browser to pre-label images for human correction in 2020, well before this was a category. Putting AI inside a live product is an engineering problem, not a demo, and it is what we do.",
    links: [{ label: "See what we have built", href: "/case-studies" }]
  },
  {
    id: "rescue",
    q: ["stalled", "take over", "takeover", "inherit", "existing codebase", "rescue", "stuck", "abandoned", "previous developer", "previous agency", "half built", "half-built"],
    a: "We inherit the codebase and spend the two-week Sprint on what is actually there rather than what the last team said was there. It ends with a fixed price to finish it, or a written recommendation to stop.",
    links: [{ label: "How engagement works", href: "/how-we-work" }]
  },
  {
    id: "stack",
    q: ["stack", "technology", "tech", "framework", "react", "node", "language", "built with", "typescript", "database"],
    a: "React and Next.js on the front, React Native for mobile, Node behind it, Mongo or Postgres underneath, deployed on cloud infrastructure. We pick what your team can hire for later, not what is fashionable this quarter.",
    links: [{ label: "How we work", href: "/how-we-work" }]
  },
  {
    id: "billing",
    q: ["payment", "payments", "stripe", "subscription", "billing", "checkout", "razorpay", "paypal", "monetise", "monetize"],
    a: "Yes, including the parts that get skipped. We have shipped a product with Stripe and PayPal both live, tiered pricing and the invoicing behind it, so subscriptions actually reconcile.",
    links: [{ label: "See what we have built", href: "/case-studies" }]
  },
  {
    id: "hire",
    q: ["hire", "hiring", "in house", "in-house", "our own team", "recruit", "developers", "freelancer", "agency instead", "why not hire"],
    a: "Hiring a product team takes months before anyone writes a line, and you carry the salaries whether or not the roadmap needs them. We are a senior team plus an AI fleet at a fixed price, embedded with you until it ships.",
    links: [{ label: "How we work", href: "/how-we-work" }]
  },
  {
    id: "agentcode",
    q: ["agents write", "ai write", "who writes the code", "written by ai", "vibe", "generated code", "quality", "is it safe", "reliable"],
    a: "Yes, agents write most of the volume code, and that is exactly why every build runs inside a deterministic gate: automated checks that block \"done\" until it provably works on your data. The team owns what ships, end to end, not a tool.",
    links: [{ label: "The verify loop", href: "/how-we-work" }]
  },
  {
    id: "integrate",
    q: ["integrate", "integration", "erp", "tally", "sap", "api", "existing systems", "connect", "sync", "whatsapp", "legacy"],
    a: "Every build we ship plugs into something older than itself: ERP exports, weighbridges, WhatsApp, spreadsheets, customer portals. Integration is usually where the real work is, so we scope it in the Sprint rather than discovering it later.",
    links: [{ label: "See the systems we install", href: "/systems/quarry-dispatch-automation" }]
  },
  {
    id: "design",
    q: ["design", "ux", "ui", "designer", "wireframe", "figma", "look", "brand", "interface"],
    a: "Design is part of the build, not a separate purchase. A product designer works on every engagement, and the interfaces are made for the people who use them all day rather than for a demo.",
    links: [{ label: "The delivery bench", href: "/about" }]
  },
  {
    id: "internal",
    q: ["internal tool", "internal tools", "spreadsheet", "excel", "back office", "admin panel", "ops tool", "manual process"],
    a: "Every scaling company has one spreadsheet holding it together and one person who understands it. Turning that into a system the whole team can use, with the rules written down instead of remembered, is a common first build.",
    links: [{ label: "See the systems we install", href: "/systems/dealer-order-management" }]
  }
];

const chunks = [];

// The corpus spells one product "CitiSense" in data/projects.json; the product
// and every page call it CitySense. The assistant uses the product's name.
const fixName = t => String(t || "").replace(/CitiSense/g, "CitySense");

// Featured and industry cards on /studio/work, keyed by project id, so a build's
// passage carries the same one line, image and page the gallery shows.
const CARD = {}, IND_OF = {};
for (const c of [...FEATURED, ...INDUSTRIES.flatMap(i => i.builds)])
  if (c.id && !CARD[c.id]) CARD[c.id] = c;
for (const i of INDUSTRIES) for (const b of i.builds) if (b.id && !IND_OF[b.id]) IND_OF[b.id] = i.k;

// One image per build for the answer's work card. Only files that exist in
// site/img/studio, the same ones /studio/work renders.
const IMGDIR = path.join(ROOT, "site", "img", "studio");
const imgOk = f => { try { readFileSync(path.join(IMGDIR, f)); return "/img/studio/" + f; } catch { return null; } };

for (const p of projects) {
  const card = CARD[p.id];
  const title = fixName(p.named ? `${p.name}: ${p.headline}` : `${p.headline}`);
  chunks.push({
    id: `project:${p.id}`,
    kind: "project",
    topic: "work",
    name: p.named ? fixName(card?.title || p.name) : null,
    title,
    body: fixName(p.what),
    meta: fixName(`${p.sector} · ${p.years} · ${p.repos} ${p.repos === 1 ? "repository" : "repositories"}`),
    outcomes: (p.outcomes || []).map(fixName),
    line: card ? fixName(card.line) : null,
    url: card?.href || (p.id === "rockpros" ? CASE_RP : IND_OF[p.id] ? `/studio/work#${IND_OF[p.id]}` : "/studio/work"),
    img: card?.img ? imgOk(card.img) : null,
    links: card?.href ? [{ label: card.cta || "See the work", href: card.href }, ...(p.links || [])] : (p.links || []),
    terms: fixName([
      p.named ? p.name : "", card?.title || "", card?.line || "", p.sector, p.headline, p.what,
      ...(p.capabilities || []), ...(p.tags || []), ...(p.outcomes || [])
    ].join(" ")).toLowerCase()
  });
}

for (const c of cases) {
  if (c.status === "placeholder") continue;
  chunks.push({
    id: `case:${fixName(c.title).slice(0, 24)}`,
    kind: "case",
    topic: "work",
    title: fixName(c.title),
    body: fixName(c.summary),
    meta: fixName(`${c.tag} · ${c.metric} ${c.metricLabel}`),
    outcomes: [],
    url: c.href || "/studio/case-studies",
    links: [{ label: "Read the case studies", href: c.href || "/case-studies" }],
    terms: fixName(`${c.tag} ${c.title} ${c.summary} ${c.metricLabel}`).toLowerCase()
  });
}

const SYSTEMS = [
  ["quarry-dispatch-automation", "Dispatch automation", "Truck and job assignment proposed with reasoning attached, across one site or thirteen.", "dispatch trucks fleet assignment mining quarry aggregates logistics scheduling"],
  ["plant-production-reporting", "Production reporting", "Shift logs, weighbridge tickets and downtime reconciled into a daily report written by 6 AM.", "production reporting plant manufacturing shift downtime yield output daily report"],
  ["dealer-order-management", "Order management", "Orders arriving on WhatsApp, phone and email become one validated queue with confirmations sent back.", "orders whatsapp dealer distribution customer response quotation confirmation"],
  ["freight-reconciliation", "Freight reconciliation", "Carrier bills matched to weighbridge and delivery data, disputes flagged with evidence attached.", "freight reconciliation carrier bills invoice matching leakage disputes logistics transport"],
  ["ar-followup-automation", "AR follow-up", "Receivables chased on cadence and escalated by rule, promises to pay tracked to their date.", "receivables collections cash flow dso invoice chasing payment overdue"],
  ["compliance-documentation", "Compliance documentation", "Royalty, GST, e-way and environmental filings assembled from operating data instead of month-end panic.", "compliance gst royalty eway environmental filing inspection audit documentation"]
];

for (const [slug, title, body, terms] of SYSTEMS) {
  chunks.push({
    id: `system:${slug}`,
    kind: "system",
    topic: "capability",
    title,
    body,
    meta: "System we install",
    outcomes: [],
    links: [{ label: `See the ${title.toLowerCase()} system`, href: `/systems/${slug}` }],
    terms: `${title} ${body} ${terms}`.toLowerCase()
  });
}

// ------------------------------------------------------------------------
// The six topics a visitor explores (founder, 2026-09-29: "an experience about
// the capability of the team, experience, work we did, are doing and want to
// do, and trends"). Every chunk below is copied from a file in this repo or a
// product repo's own docs, dated where the source is dated. Nothing here is a
// new claim: if a line cannot point at its source, it does not belong.
// ------------------------------------------------------------------------
const studio = read("data/studio.json");
const library = read("site/data/library.json");
const push = c => chunks.push({ outcomes: [], links: [{ label: "See the work", href: c.url }], ...c,
  terms: [c.title, c.body, c.terms || ""].join(" ").toLowerCase() });

// capability: the six capabilities on /studio (data/studio.json)
push({
  id: "capability:overview", kind: "capability", topic: "capability",
  title: "What our team does",
  body: `One team for product, tech, ops and marketing. Six capabilities: ${studio.capabilities.map(c => c.name).join("; ")}. Senior people with an AI fleet doing the volume work, embedded with you until it ships.`,
  meta: "Capabilities", url: "/studio#services", img: imgOk("photo-studio-whiteboard-4x3.webp"),
  terms: "team capabilities services skills what can you do offer help with"
});
for (const c of studio.capabilities) {
  push({
    id: "capability:" + c.name.toLowerCase().replace(/[^a-z]+/g, "-"), kind: "capability", topic: "capability",
    title: c.name, body: `${c.note} Where it shows: ${c.proof}.`, meta: "Capability",
    url: "/studio#services", img: imgOk(c.img), line: c.note,
    terms: `capability team ${c.proof}`
  });
}

// experience: the studio's numbers and the six industries (studio.json + workdata)
const [kProducts, kInd, kYears] = studio.kpi;
push({
  id: "experience:overview", kind: "experience", topic: "experience",
  title: "Our experience",
  body: `${kProducts[0]} ${kProducts[1]} across ${kInd[0]} ${kInd[1]} ${kYears[1].replace(/^years shipping, /, "")}: ${studio.industries.map(i => i.name).join("; ")}. Whole systems with their apps, backends, admin consoles and integrations.`,
  meta: "Experience", url: "/studio/work", img: imgOk("photo-studio-review-4x3.webp"),
  terms: "experience track record years how long been doing industries sectors products shipped portfolio"
});
for (const ind of INDUSTRIES) {
  push({
    id: "industry:" + ind.k, kind: "industry", topic: "experience",
    title: `${ind.name}: our work`,
    body: ind.builds.map(b => `${fixName(b.title)}: ${fixName(b.line)}`).join(" "),
    meta: "Industry", url: `/studio/work#${ind.k}`, img: imgOk(ind.photo),
    line: `${ind.builds.length} ${ind.builds.length === 1 ? "build" : "builds"} in ${ind.name.toLowerCase()}.`,
    terms: `industry ${ind.name} ${ind.k}`
  });
}

// work we did: the featured builds in one passage, for "what have you built"
push({
  id: "work:overview", kind: "work", topic: "work",
  title: "What we have built",
  body: FEATURED.map(f => `${f.title}: ${f.line}`).join(" ") + " Beyond these, builds across fintech, manufacturing, re-commerce, logistics, education, legal technology and real estate.",
  meta: "Work", url: "/studio/work", img: null,
  terms: "built build shipped made work portfolio products examples what have you built featured"
});

// work we did: featured builds that have no projects.json row (CitedSpy, infinitie)
for (const f of FEATURED.filter(f => !projects.some(p => p.id === f.id))) {
  const extra = {
    citedspy: {
      body: "CitedSpy is our AI search visibility product, the GEO category (generative engine optimization). It shows whether ChatGPT, Perplexity, Gemini, Copilot and Google AI Mode recommend your brand, with what sentiment, and which sources those answers cite, so a marketing team can see and grow the AI-answer channel it cannot see in Google Analytics.",
      terms: "citedspy ai search visibility geo generative engine optimization aeo answer engine cited chatgpt perplexity gemini copilot ai overviews brand mentions citations share of voice seo llm visibility"
    },
    infinitie: {
      body: "infinitie is an invite-only network for vetted growth, product and founder operators: vouched intros, senior roles and candid peer counsel. Registration is an application, and every intro is vouched for by a member.",
      terms: "infinitie invite only network community operators founders vouched intros referrals roles peer"
    }
  }[f.id] || { body: f.line, terms: "" };
  push({
    id: "build:" + f.id, kind: "build", topic: "work", name: f.title,
    title: `${f.title}: ${f.line.replace(/\.$/, "")}`, body: extra.body, line: f.line,
    meta: `${f.tag} · ${f.years}`, url: `/studio/work`, img: imgOk(f.img),
    links: [{ label: "See the work", href: "/studio/work" }],
    terms: `${f.title} ${f.tag} ${extra.terms}`
  });
}

// doing now: current builds, from each product repo's own docs and recent
// history (WorkElate: site/brain/roadmap.html "shipped" and "building now";
// CitySense: its June 2026 client changelog and September commits; CitedSpy:
// AGENTS.md and September commits; infinitie: docs/PROGRESS.md, 12 Sep 2026).
push({
  id: "now:workelate", kind: "now", topic: "now", name: "WorkElate",
  title: "Building now: WorkElate Chief",
  body: "We are building WorkElate Chief, the Brain inside our AI-native office suite, and our own delivery runs on it. In flight now: the morning list as cards you act on in place, a desk brief that assembles a client's state from everything in their folder, a mail policy that decides nudge, draft or silence from each organization's own documents, and cheaper turns so the briefing can run more often. Already running: mail replies drafted with the account's context, one folder holding every artifact for a client, and decks built from the files in a folder.",
  line: "The Brain inside our AI-native office suite. Our own delivery runs on it.",
  meta: "Building now", url: "/brain/roadmap", img: imgOk("workelate-start-my-day.webp"),
  terms: "workelate chief brain office suite ai native morning brief desk brief mail building now current"
});
push({
  id: "now:citedspy", kind: "now", topic: "now", name: "CitedSpy",
  title: "Building now: CitedSpy",
  body: "CitedSpy is live and we keep shipping it. It reads the real answer pages of ChatGPT, Perplexity, Gemini, Copilot and Google AI Mode rather than calling their APIs, so it sees what a buyer sees. Recent work: a WordPress plugin and a Webflow integration, connectors for Zapier, Make, n8n, Activepieces and Looker Studio, bring-your-own-key setup for agencies, and localized PDF reports.",
  line: "AI search visibility, live and shipping weekly.",
  meta: "Building now", url: "/studio/work", img: imgOk("citedspy-citations.webp"),
  terms: "citedspy ai search visibility geo integrations wordpress webflow zapier building now current"
});
push({
  id: "now:citysense", kind: "now", topic: "now", name: "CitySense",
  title: "Building now: CitySense",
  body: "CitySense, our DOOH platform, is live with agencies and display teams in Mexico and in active development. Recent work: a marketplace for printed billboards with negotiation, artwork approval and photo proof of installation, rolling out per account; live proof of play from the field; CPM plans priced from real screen audience rather than the budget; screens chosen by brand and location, not size alone; and a self-updating player that runs on Raspberry Pi. A test connector to Broadsign and NovaCloud is live, with certification in progress.",
  line: "AI plans, schedules and runs billboard campaigns.",
  meta: "Building now", url: "/studio/work#ooh", img: imgOk("citysense-live-campaign.webp"),
  terms: "citysense dooh ooh billboard billboards digital signage screens out of home proof of play cpm building now current"
});
push({
  id: "now:infinitie", kind: "now", topic: "now", name: "infinitie",
  title: "Building now: infinitie",
  body: "infinitie is live as an invite-only network for operators. Registration is an application, and recent work added a feed with media and polls, a follow graph, funding and sponsor slots.",
  line: "An invite-only network where every intro is vouched for.",
  meta: "Building now", url: "/studio/work", img: imgOk("infinitie-room.webp"),
  terms: "infinitie network community operators building now current"
});

// want to do next: roadmap items, phrased as roadmap, never as shipped
push({
  id: "next:workelate", kind: "next", topic: "next", name: "WorkElate",
  title: "On our roadmap: WorkElate Chief",
  body: "On our roadmap for WorkElate Chief, not started yet: connections to the systems a company already runs, added by telling the Brain what each system records; opening a document, sheet or deck read only inside another application; the morning brief delivered where a team already looks, at the hour they start; briefing shapes per role, since finance, delivery and revenue need different first items; and a self-serve check showing what the Brain could see in your stack. The order is set by what a client needs in production.",
  line: "What the Brain learns next, set by what clients need in production.",
  meta: "Roadmap", url: "/brain/roadmap", img: imgOk("workelate-suite-ring.webp"),
  terms: "roadmap next future plan plans vision workelate chief brain connections"
});
push({
  id: "next:infinitie", kind: "next", topic: "next", name: "infinitie",
  title: "On our roadmap: infinitie",
  body: "On our roadmap for infinitie: meetup outcomes posted back to the feed, a weekly board of who opened doors, signed invite links, notifications as an email digest first, the digest on WhatsApp, one search across members, posts and playbooks, and an Ask that reads a problem and names the right three people.",
  line: "Next for the operator network.",
  meta: "Roadmap", url: "/studio/work", img: imgOk("infinitie-room.webp"),
  terms: "roadmap next future plan infinitie network"
});
push({
  id: "next:studio", kind: "next", topic: "next",
  title: "Where the studio is heading",
  body: "We are staying focused on six industries rather than going wide: building materials, logistics and dispatch, OOH and digital billboards, fintech, manufacturing, re-commerce and retail. Every build is scoped, built and run inside WorkElate, the product we would sell you, so what we learn on client work goes back into the product.",
  meta: "Focus", url: "/studio", img: null,
  terms: "roadmap next future plan focus vision direction heading studio want to do"
});

// trends: what the weekly library covers (derived from library.json)
{
  const counts = {};
  for (const it of library.items || []) counts[it.topic] = (counts[it.topic] || 0) + 1;
  const topics = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([t]) => t)
    .filter(t => !/^(citedspy|citysense|workelate)$/i.test(t));
  const pubs = [...new Set((library.items || []).map(i => i.source))];
  push({
    id: "trends:library", kind: "trends", topic: "trends",
    title: "What we read every week",
    body: `We keep a reading library, refreshed every week from ${pubs.length} publications, on ${topics.join("; ")}. Name your industry and we will tell you what is moving in it, with the publication that reported it.`,
    meta: "Weekly library", url: "/studio", img: null,
    terms: "trends trend changing change industry market news whats happening shift"
  });
}

// every chunk carries a topic; a chunk without one is a generator bug
for (const c of chunks) if (!c.topic) throw new Error(`gencorpus: chunk ${c.id} has no topic`);
for (const c of chunks) for (const k of ["title", "body", "line"]) if (/—/.test(c[k] || "")) throw new Error(`gencorpus: em dash in ${c.id}.${k}`);

// Topic per fact, for the assistant's follow-ups (how to start vs who we are).
const FACT_TOPIC = {
  guarantee: "start", exit: "start", references: "experience", location: "start", security: "start",
  price: "start", speed: "start", start: "start", own: "start", mvp: "start", rescue: "start", hire: "start",
  trust: "experience", sectors: "experience", enterprise: "experience", erp: "work", mobile: "work",
  platform: "work", aifeature: "work", billing: "work", integrate: "work"
};
for (const f of FACTS) f.topic = FACT_TOPIC[f.id] || "capability";

const body = { facts: FACTS, chunks };
const out = {
  generated: new Date().toISOString().slice(0, 10),
  // content hash: the assistant's answer cache is keyed by it, so any corpus
  // change retires every cached answer
  hash: createHash("sha1").update(JSON.stringify(body)).digest("hex").slice(0, 12),
  ...body
};

mkdirSync(path.join(ROOT, "site", "data"), { recursive: true });
writeFileSync(path.join(ROOT, "site", "data", "corpus.json"), JSON.stringify(out));
const byTopic = {};
for (const c of chunks) byTopic[c.topic] = (byTopic[c.topic] || 0) + 1;
console.log(`wrote site/data/corpus.json: ${chunks.length} chunks (${Object.entries(byTopic).map(([k, v]) => k + " " + v).join(", ")}), ${FACTS.length} facts`);
