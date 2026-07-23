// Builds the retrieval corpus the on-page assistant answers from.
// Sources: data/projects.json (delivery portfolio, derived from the GitHub
// crawl), data/cases.json (published case studies) and a hand-written set of
// firm facts. Output is a single small JSON the browser fetches once.
//
// Keep this a GENERATOR. Editing site/data/corpus.json by hand dies on the
// next run.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const read = p => JSON.parse(readFileSync(path.join(ROOT, p), "utf8"));

const { projects } = read("data/projects.json");
const { cases } = read("data/cases.json");

// Firm facts the assistant must be able to answer without hedging. Every
// number here has to be defensible; no aspirational figures.
const FACTS = [
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
    a: "Two accountable partners, Chitransh and Pratik, plus senior specialists pulled in per build and an agent fleet doing the volume work. No pyramid of juniors, and no account manager between you and us.",
    links: [{ label: "About us", href: "/about" }]
  },
  {
    id: "why",
    q: ["why you", "why work", "different", "compare", "versus", "instead", "big four", "consultancy", "competitor"],
    a: "A large consultancy bills a pyramid of people for the work agents now do. We kept the senior judgement, replaced the pyramid, and passed the difference on: same scope, roughly a third to a quarter of the cost, in weeks.",
    links: [{ label: "How we work", href: "/how-we-work" }]
  },
  {
    id: "trust",
    q: ["proof", "trust", "reference", "portfolio", "experience", "track record", "done before", "credentials", "how many projects", "how much work"],
    a: "100+ projects shipped continuously from 2018 to 2026, across 16 sectors. Whole systems with their apps, backends, admin consoles and integrations, not a wall of demos. Ask about your sector and I will point you at the closest one.",
    links: [{ label: "Depth and width", href: "/#portfolio" }, { label: "Case studies", href: "/case-studies" }]
  },
  {
    id: "sectors",
    q: ["industry", "industries", "sector", "sectors", "verticals", "who do you work with", "clients", "kind of business", "worked with"],
    a: "Sixteen sectors so far: property development, industrial operations, fuel distribution, freight, manufacturing, pharma and diversified industry, ERP and finance ops, e-commerce, edtech, SaaS, marketing, ML tooling, AR and VR, marketplaces, HR and contract intelligence.",
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
    q: ["start", "begin", "next step", "get going", "engage", "talk", "call", "reach", "readiness", "readiness score", "assess", "assessment"],
    a: "Tell me your industry and the process that hurts and I will show you the closest thing we have built. When you want it costed, the two-week Diagnostic Sprint ends with a build plan and a fixed price, and if we find nothing worth building we say so in writing.",
    links: [{ label: "How engagement works", href: "/how-we-work" }]
  },
  {
    id: "own",
    q: ["own", "ownership", "code", "lock in", "lockin", "ip", "source", "leave"],
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
    a: "Hiring a product team takes months before anyone writes a line, and you carry the salaries whether or not the roadmap needs them. We are two senior partners plus agents at a fixed price, and we go away when it ships.",
    links: [{ label: "How we work", href: "/how-we-work" }]
  },
  {
    id: "agentcode",
    q: ["agents write", "ai write", "who writes the code", "written by ai", "vibe", "generated code", "quality", "is it safe", "reliable"],
    a: "Yes, agents write most of the volume code, and that is exactly why every build runs inside a deterministic gate: automated checks that block \"done\" until it provably works on your data. Two named partners are accountable for what ships, not a tool.",
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

for (const p of projects) {
  chunks.push({
    id: `project:${p.id}`,
    kind: "project",
    title: p.named ? `${p.name}: ${p.headline}` : `${p.headline}`,
    body: p.what,
    meta: `${p.sector} · ${p.years} · ${p.repos} ${p.repos === 1 ? "repository" : "repositories"}`,
    outcomes: p.outcomes || [],
    links: p.links || [],
    terms: [
      p.named ? p.name : "", p.sector, p.headline, p.what,
      ...(p.capabilities || []), ...(p.tags || []), ...(p.outcomes || [])
    ].join(" ").toLowerCase()
  });
}

for (const c of cases) {
  if (c.status === "placeholder") continue;
  chunks.push({
    id: `case:${c.title.slice(0, 24)}`,
    kind: "case",
    title: c.title,
    body: c.summary,
    meta: `${c.tag} · ${c.metric} ${c.metricLabel}`,
    outcomes: [],
    links: [{ label: "Read the case studies", href: "/case-studies" }],
    terms: `${c.tag} ${c.title} ${c.summary} ${c.metricLabel}`.toLowerCase()
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
    title,
    body,
    meta: "System we install",
    outcomes: [],
    links: [{ label: `See the ${title.toLowerCase()} system`, href: `/systems/${slug}` }],
    terms: `${title} ${body} ${terms}`.toLowerCase()
  });
}

const out = {
  generated: new Date().toISOString().slice(0, 10),
  facts: FACTS,
  chunks
};

mkdirSync(path.join(ROOT, "site", "data"), { recursive: true });
writeFileSync(path.join(ROOT, "site", "data", "corpus.json"), JSON.stringify(out));
console.log(`wrote site/data/corpus.json: ${chunks.length} chunks, ${FACTS.length} facts`);
