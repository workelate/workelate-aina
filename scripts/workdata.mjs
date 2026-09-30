// Shared copy for the work gallery and the assistant's corpus.
//
// scripts/genwork.mjs renders /studio/work from these lists and
// scripts/gencorpus.mjs turns the same lines into the assistant's our-work
// passages, so the page and the answers can never describe a build two ways.
// Truth rules live in genwork.mjs's header and apply here unchanged.
import { readFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const projects = JSON.parse(readFileSync(path.join(ROOT, "data", "projects.json"), "utf8")).projects;
export const byId = Object.fromEntries(projects.map(p => [p.id, p]));

const cap = s => s ? s[0].toUpperCase() + s.slice(1) : s;
const yrs = y => (y && y.trim()) ? y.trim().replace(/^(\d{4})-(\d{4})$/, "$1 to $2") : "";
export const CASE_RP = "/studio/case-studies/southwest-quarries";

// A projects.json entry as a card: the descriptor when the client is not cleared.
export function fromProject(id, over = {}) {
  const p = byId[id];
  if (!p) throw new Error(`genwork: projects.json has no id "${id}"`);
  return { id, title: cap(p.name), line: /[.!?]$/.test(p.headline) ? p.headline : p.headline + ".", years: yrs(p.years), named: !!p.named, ...over };
}

/* ───────────────────────────────────────────────────────────── featured -- */
export const FEATURED = [
  { ...fromProject("quarries", { title: "Southwest quarries" }),
    wide: true, tag: "Building materials and dispatch",
    line: "13 quarries on one dispatch system. 2,140 invoices with zero manual touches in the first year.",
    img: "quarry-dispatch-board.webp", phone: "quarry-driver-loads-phone.webp",
    phoneAlt: "The quarry driver app on a phone, showing an open load",
    alt: "The quarry dispatch board listing open jobs by delivery date, customer and trucker",
    href: CASE_RP, cta: "Read the case study" },
  { ...fromProject("citysense", { title: "CitySense" }),
    tag: "OOH and digital billboards",
    line: "AI plans, schedules and runs billboard campaigns. Live with agencies and display teams in Mexico.",
    img: "citysense-planner-map.webp",
    alt: "CitySense AI planner: a map of Mexico City with the billboard screens chosen for a campaign" },
  { id: "citedspy", title: "CitedSpy", years: "2026", tag: "SEO and AI search",
    line: "Shows whether AI answers recommend your brand, and which sources they cite.",
    img: "citedspy-dashboard.webp",
    alt: "CitedSpy overview: an AI visibility score, mention rate over time and share of voice" },
  { ...fromProject("workelate"), tag: "Our own product",
    title: "WorkElate",
    line: "An AI-native office suite we build on and sell from. Our own delivery runs on it.",
    img: "workelate-chief-hero.webp", fit: true,
    alt: "WorkElate Chief reading a pipeline sheet and drafting an email that waits for a yes",
    href: "/brain", cta: "See the product" },
  { id: "infinitie", title: "infinitie", years: "2026", tag: "Private networks",
    line: "An invite-only network for operators, where every intro is vouched for.",
    img: "infinitie-room.webp",
    alt: "infinitie member room: intros this week, a twelve-week intro chart and open asks" }
];

/* ─────────────────────────────────────────────────────── six industries -- */
// Each build maps to exactly one industry, and only where the data says so.
export const INDUSTRIES = [
  { k: "building-materials", name: "Building materials", photo: "photo-ind-quarry-4x3.webp",
    alt: "Terraced quarry face with an excavator at its base",
    builds: [
      fromProject("quarries", { title: "Southwest quarries", img: "quarry-customer-po.webp",
        alt: "The customer portal: purchase orders, ordered against delivered",
        line: "Customer, trucker and driver apps and an admin console, across 13 quarry sites.",
        href: CASE_RP, cta: "Read the case study" })
    ] },
  { k: "logistics", name: "Logistics and dispatch", photo: "photo-ind-logistics-4x3.webp",
    alt: "Aerial view of semi-trailers parked in angled bays at a truck yard",
    builds: [
      { title: "Freight reconciliation", years: "", sector: "Logistics, India",
        line: "Carrier bills matched to the weighbridge ticket. Clean lines clear on their own; disputes arrive with the evidence.",
        href: "/studio/systems/freight-reconciliation", cta: "See the system" },
      { title: "Shipment booking and tracking", years: "2020 to 2021",
        line: "A booking and tracking backend with a customer app beside it." },
      { title: "Distribution management", years: "2019 to 2022",
        line: "Dealer-network distribution for an energy and fuel distributor." }
    ] },
  { k: "ooh", name: "OOH and digital billboards", photo: "photo-ind-ooh-4x3.webp",
    alt: "City street at dusk with a large digital billboard on a corner building",
    builds: [
      fromProject("citysense", { title: "CitySense", img: "citysense-live-campaign.webp",
        alt: "CitySense running campaign: live impressions, pacing and screens",
        line: "Campaigns planned by AI and scheduled across physical and digital screens." })
    ] },
  { k: "fintech", name: "Fintech", photo: "photo-ind-fintech-4x3.webp",
    alt: "People at desktop monitors showing charts and data dashboards",
    builds: [
      fromProject("riskdata", { title: "Risk and financial data pipelines" }),
      fromProject("tally", { title: "ERP and finance connector" }),
      fromProject("vc-enrichment", { title: "Deal data for a venture firm" })
    ] },
  { k: "manufacturing", name: "Manufacturing", photo: "photo-ind-manufacturing-4x3.webp",
    alt: "Automated production line on a clean factory floor",
    builds: [
      fromProject("production"),
      fromProject("qms")
    ] },
  { k: "recommerce", name: "Re-commerce and retail", photo: "photo-ind-recommerce-4x3.webp",
    alt: "Bright warehouse with white racking and palletised cartons",
    builds: [
      fromProject("recommerce"),
      fromProject("fieldops", { title: "Storefronts and field apps" }),
      { title: "Local offers marketplace", years: "2019 to 2020",
        line: "Merchants list offers by city; shoppers browse, save and review." }
    ] }
];

/* ─────────────────────────────────────────────────────────── more builds -- */
export const MORE = [
  fromProject("edtech", { title: "Edunomics Scholar", tag: "Education" }),
  fromProject("deployer", { title: "A deployable business-app suite", tag: "SaaS" }),
  fromProject("annotate", { title: "AI annotation platform", tag: "Machine learning" }),
  fromProject("docai", { tag: "Legal technology" }),
  fromProject("innovation", { tag: "Corporate innovation" }),
  fromProject("grc", { tag: "Governance and risk" }),
  fromProject("crm", { title: "Native field-sales CRM", tag: "Real estate" }),
  { title: "Home-buyer portal", years: "2020 to 2021", tag: "Real estate",
    line: "Construction progress in photographs, documents and payment schedules." },
  fromProject("servicemgmt", { tag: "Service operations" }),
  fromProject("marketplace-rental", { tag: "Equipment rental" }),
  { title: "Charter availability dashboard", years: "2023", tag: "Aviation",
    line: "Routes and availability for a private aviation operator." },
  fromProject("altar-poetry", { title: "Altar poetry", tag: "Culture, Mexico" })
];
