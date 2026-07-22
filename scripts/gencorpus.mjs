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
    q: ["how long", "timeline", "how fast", "duration", "weeks", "deadline", "quickly", "speed", "faster", "ship faster", "launch", "mvp", "how soon"],
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
    q: ["proof", "trust", "reference", "portfolio", "experience", "track record", "done before", "credentials"],
    a: `We have shipped across ${projects.length} programmes since 2019, from a 13-site dispatch platform to an AI annotation tool with in-browser inference back in 2020. Ask about your industry and I will point you at the closest one.`,
    links: [{ label: "Case studies", href: "/case-studies" }]
  },
  {
    id: "start",
    q: ["start", "begin", "next step", "get going", "engage", "talk", "call", "contact", "reach"],
    a: "Two ways in: take the AI Readiness Score on this page, or book the two-week Diagnostic Sprint. The Sprint ends with a build plan and a fixed price, and if we find nothing worth building we say so in writing.",
    links: [{ label: "Get your AI Readiness Score", href: "#cta" }]
  },
  {
    id: "own",
    q: ["own", "ownership", "code", "lock in", "lockin", "ip", "source", "leave"],
    a: "You own the code and the data. No lock-in clause buried on page 14, and nothing that requires us to stay for the system to keep running.",
    links: [{ label: "How we work", href: "/how-we-work" }]
  },
  {
    id: "ai",
    q: ["ai", "agent", "agents", "llm", "model", "automation", "machine learning", "chatbot"],
    a: "Agents do the volume work: reading messy input, matching records, drafting, chasing and reporting. People keep the judgement calls. That split is the whole method, and we run it on our own delivery first.",
    links: [{ label: "How we work", href: "/how-we-work" }]
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
