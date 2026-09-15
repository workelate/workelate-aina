// The site chrome, written ONCE and injected into every page under site/.
//
// ZONES (founder call 2026-09-12, "WorkElate Excellence Studio, two offerings").
// aina.workelate.com is one umbrella with two products under it, and each zone
// carries its own header and footer:
//
//   /            the umbrella landing: Excellence Studio, two doors
//   /brain/*     the product site for WorkElate Chief, the Brain (plus /book-a-demo)
//   /studio/*    the agency, WE_AINA, everything that used to sit at the root
//
// One generator, three chrome sets, chosen by route prefix. The verify gate
// asserts FOOTER PARITY per zone (every page in a zone carries the identical
// footer link set), so the chrome is never hand-edited in a page; it is
// rewritten between markers:
//
//     <!-- NAV:start -->   … generated …   <!-- NAV:end -->
//     <!-- FOOTER:start --> … generated … <!-- FOOTER:end -->
//
// 2026-09-15, UX audit (data/audit-ux.md #3 #4 #8 #12 #23): one primary CTA
// per zone, the mobile sheet as closed accordions, one-line panel rows, one
// header and footer skeleton across zones, and a data-cta hook for a per-page
// closing line. The no-JS contract is unchanged: every link is visible on the
// page with JS off, and site/js/nav.js stamps `js` on <html> before hiding any.
//
// RUN AFTER PAGE GENERATORS. gensystems / gencases / genwork write pages from
// their own templates; this pass makes their chrome match everyone else's.
// SEO, sitemap, corpus and `npm run assets` follow it.
//
//   node scripts/genchrome.mjs
import { readdirSync, statSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const SITE = path.join(import.meta.dirname, "..", "site");

/* --------------------------------------------- conditional link emission -- */
// A route is linked ONLY IF its page exists on disk at generation time. Pages
// of a lane land hours apart, and the gate asserts zero broken internal links,
// so a link written ahead of its page turns every page red at once. Checking
// existsSync means the chrome always describes what actually shipped. Mirrors
// resolve() in app/[[...slug]]/route.js: /a/b is site/a/b.html or
// site/a/b/index.html. Anchors are stripped before the check.
function routeExists(href) {
  const rel = href.split("#")[0].replace(/^\/+/, "").replace(/\/+$/, "");
  if (!rel) return true;
  if (rel.startsWith("mailto:")) return true;
  return existsSync(path.join(SITE, rel + ".html")) ||
         existsSync(path.join(SITE, rel, "index.html"));
}

// Panel rows are ONE LINE each (audit-ux #8): the title only, no description
// span. The depth is on the page; the promo card is the one place a panel
// carries a sentence.
const L = (href, title) => routeExists(href) ? `<a href="${href}"><b>${title}</b></a>` : "";
const F = (href, label) => routeExists(href) ? `<a href="${href}">${label}</a>` : "";
const rows = (...xs) => xs.filter(Boolean);
const nmJoin = (xs) => xs.join("\n            ");
const fJoin = (xs) => xs.join("\n        ");

// One mega-menu panel. Two link columns and a promo, never three columns of
// links: .nm-cols is a 1fr 1fr 1.05fr grid and the third track is the promo.
// Cap: six to eight rows per column (audit-ux #8). The panel is absolutely
// positioned inside a sticky header, so rows past the fold are unreachable.
//
// MOBILE SHEET (audit-ux #4): the panel is wrapped in <details class="nav-acc">
// so that under 860px it renders as a closed accordion with the panel label as
// its <summary>. It SHIPS `open`: with JS off, and on desktop, the panel stays
// the visible source of every link (the verify gate counts hidden text as a
// blank page). site/js/nav.js closes the accordions only under 860px and
// reopens them above it. On desktop the summary is display:none (stylist).
function panel(id, label, colA, colB, promo, foot) {
  if (!colA.body && !colB.body) return "";
  const col = (c) => c.body ? `          <div class="nm-col">\n            <span class="nm-h">${c.h}</span>\n            ${c.body}\n          </div>` : "";
  return `
    <div class="nav-item has-menu">
      <button class="nav-trig" aria-expanded="false" aria-controls="${id}">${label}<span class="chev" aria-hidden="true"></span></button>
      <details class="nav-acc" open>
      <summary>${label}</summary>
      <div class="nav-menu" id="${id}">
        <div class="nm-cols">
${col(colA)}
${col(colB)}
          <div class="nm-promo">
            <span class="nm-k">${promo.k}</span>
            <p class="nm-t">${promo.t}</p>
            <p class="nm-p">${promo.p}</p>
            <a class="nm-go" href="${promo.href}">${promo.go} &rarr;</a>
          </div>
        </div>
        <div class="nm-foot"><span>${foot.text}</span><a href="${foot.href}">${foot.go} &rarr;</a></div>
      </div>
      </details>
    </div>`;
}
const colOf = (h, ...links) => ({ h, body: nmJoin(rows(...links)) });
// Two headed groups in one column; the second heading needs air above it.
const col2 = (h1, links1, h2, links2) => {
  const a = rows(...links1), b = rows(...links2);
  const body = [
    a.length ? nmJoin(a) : "",
    b.length ? `<span class="nm-h"${a.length ? ' style="margin-top:26px"' : ""}>${h2}</span>\n            ${nmJoin(b)}` : ""
  ].filter(Boolean).join("\n            ");
  return { h: h1, body };
};

const toggle = `  <button class="nav-toggle" aria-expanded="false" aria-controls="navmenu"><span class="sr-only">Menu</span><span></span><span></span><span></span></button>`;

/* ------------------------------------------------- one header skeleton -- */
// audit-ux #12: the WorkElate wordmark is constant on every page, the zone
// name is the second word, and a Brain | Studio switch sits right of the logo
// in the same place on every page, the current zone marked. aria-current sits
// BEFORE href on purpose: markCurrent() only rewrites `<a … href="…">` with
// nothing between class and href, so the switch never ends up with two
// aria-current attributes on /brain or /studio.
const ZONE_WORD = { hub: "Excellence Studio", brain: "Chief &middot; the Brain", studio: "AI&#8209;Native Studio" };
const ZONE_HOME = { hub: "/", brain: "/brain", studio: "/studio" };
function brand(zone) {
  const sw = (z, label) => `<a class="zs${zone === z ? " cur" : ""}"${zone === z ? ' aria-current="true"' : ""} href="${ZONE_HOME[z]}">${label}</a>`;
  return `  <div class="nav-brand">
    <a class="logo" href="${ZONE_HOME[zone]}"><img src="/img/workelate-logo.svg" alt="WorkElate" width="140" height="32" decoding="async"><span class="logo-div">${ZONE_WORD[zone]}</span></a>
    <nav class="zone-switch" aria-label="WorkElate sites">${sw("brain", "Brain")}<span class="zs-sep" aria-hidden="true">|</span>${sw("studio", "Studio")}</nav>
  </div>`;
}

// ONE PRIMARY CTA PER ZONE (audit-ux #3). The phrase "Book a Diagnostic Sprint"
// is what the gate asserts on every page; in the brain zone it lives in the
// footer, so the brain header can carry the product's own next step.
const SPRINT = `<a class="btn" href="/studio/contact">Book a Diagnostic Sprint</a>`;
const DEMO = `<a class="btn" href="/book-a-demo">Book a demo</a>`;

/* ============================================================ BRAIN ZONE == */
// The product site for WorkElate Chief. Shape borrowed from the founder's
// reference (citedspy.com): Product, Compare, Resources, Pricing, Book a demo.
// Route-aware: on /book-a-demo the header must not push a second booking, so
// the button is omitted there (Pricing is already the plain link beside it).
const brainNav = (route) => `<header class="nav zone-brain"><div class="wrap row">
${brand("brain")}
${toggle}
  <nav id="navmenu">
${panel("menu-product", "Product",
  colOf("The brain",
    L("/brain", "Overview"),
    L("/brain/capabilities", "Capabilities"),
    L("/brain/architecture", "How it is built"),
    L("/brain/security", "Security"),
    L("/brain/proof", "Proof"),
    L("/brain/getting-started", "Getting started")),
  colOf("Solutions",
    L("/brain/for/coo", "For the COO"),
    L("/brain/for/cio", "For the CIO"),
    L("/brain/for/revenue", "For revenue"),
    L("/brain/use-cases/client-delivery", "Client delivery"),
    L("/brain/use-cases/order-to-cash", "Order to cash"),
    L("/brain/use-cases/mail-triage", "Mail triage"),
    L("/brain/use-cases", "All use cases")),
  { k: "See it on your stack", t: "One system, one week of real signals.", p: "We connect one system read-only, replay a week, and show you what it caught and what it stayed quiet about.", href: "/book-a-demo", go: "Book a demo" },
  { text: "Built and run on our own delivery before it is sold to yours.", href: "/studio", go: "Meet the studio" })}
${panel("menu-compare", "Compare",
  colOf("By name",
    L("/brain/compare/glean", "vs Glean"),
    L("/brain/compare/microsoft-365-copilot", "vs Microsoft 365 Copilot"),
    L("/brain/compare/google-gemini-workspace", "vs Gemini for Workspace"),
    L("/brain/compare/notion-ai", "vs Notion AI"),
    L("/brain/compare/moveworks", "vs Moveworks"),
    L("/brain/compare/workato", "vs Workato"),
    L("/brain/compare#by-name", "All ten names"),
    L("/brain/compare#alternatives", "All alternatives")),
  col2("By category", [
      L("/brain/compare/per-app-copilots", "Per-app copilots"),
      L("/brain/compare/enterprise-search", "Enterprise search"),
      L("/brain/compare/ipaas-and-rpa", "iPaaS and RPA"),
      L("/brain/compare/build-your-own", "Building it yourself")],
    "Decide honestly", [
      L("/brain/compare", "The decision table"),
      L("/brain/objections", "The eight objections")]),
  { k: "Fair to the other side", t: "We name what they are better at.", p: "A comparison that never concedes is a brochure. These do, in the first paragraph.", href: "/brain/compare", go: "Read the table" },
  { text: "Comparisons reflect public product information, not a controlled test.", href: "/brain/proof", go: "What we can prove" })}
${panel("menu-resources", "Resources",
  colOf("Learn",
    L("/brain/faq", "FAQ"),
    L("/brain/glossary", "Glossary"),
    L("/brain/roadmap", "Roadmap"),
    L("/brain/changelog", "What shipped")),
  colOf("Company",
    L("/studio", "The studio"),
    L("/studio/about", "About"),
    L("/studio/blog", "Blog"),
    L("/studio/contact", "Talk to us")),
  { k: "Read it in full", t: "The long form lives with us.", p: "Every capability, objection and use case, written out. Ask and we send the reading pack.", href: "/studio/contact", go: "Ask for the pack" },
  { text: "WorkElate Chief is installed by WE_AINA, WorkElate's own studio.", href: "/", go: "The Excellence Studio" })}
    ${F("/brain/pricing", "Pricing")}
${route === "/book-a-demo" ? "" : `    ${DEMO}\n`}
  </nav>
</div></header>`;

/* =========================================================== STUDIO ZONE == */
// The agency. Everything that used to be the whole site, now under /studio.
// The door across to the product is the zone switch beside the logo, so the
// header carries no second "The Brain" link: one door, one button.
const studioNav = () => `<header class="nav zone-studio"><div class="wrap row">
${brand("studio")}
${toggle}
  <nav id="navmenu">
${panel("menu-work", "Work",
  colOf("Proof",
    L("/studio/work", "The index"),
    L("/studio/case-studies", "Case studies"),
    L("/studio/case-studies/rockprosusa", "RockProsUSA")),
  colOf("Systems we build",
    L("/studio/systems/quarry-dispatch-automation", "Dispatch automation"),
    L("/studio/systems/ar-followup-automation", "AR follow-up"),
    L("/studio/systems/freight-reconciliation", "Freight reconciliation"),
    L("/studio/systems", "All six systems")),
  { k: "How we work", t: "Two partners, an agent fleet, a fixed price.", p: "Diagnostic in two weeks, a working system in weeks after it, and the operating numbers themselves as the report.", href: "/studio/how-we-work", go: "Read the operating model" },
  { text: "Every build scoped, built and run inside the product we would sell you.", href: "/studio/about", go: "Who you talk to" })}
${panel("menu-resources", "Resources",
  colOf("Read",
    L("/studio/blog", "Blog"),
    L("/studio/blog/receipts-over-decks", "Receipts over decks"),
    L("/studio/blog/the-pyramid-cant-survive-agents", "The pyramid and agents")),
  colOf("Company",
    L("/studio/about", "About"),
    L("/studio/how-we-work", "How we work"),
    L("/studio/contact", "Talk to us")),
  { k: "The product we install", t: "WorkElate Chief, the Brain.", p: "One memory across the systems a company already runs. Our delivery runs on it before yours does.", href: "/brain", go: "Meet the brain" },
  { text: "WE_AINA is WorkElate's AI-Native Studio.", href: "/", go: "The Excellence Studio" })}
    ${SPRINT}
  </nav>
</div></header>`;

/* ============================================================== HUB ZONE == */
// The umbrella landing. Two doors, no button: the doors are the CTAs.
const hubNav = () => `<header class="nav zone-hub"><div class="wrap row">
${brand("hub")}
${toggle}
  <nav id="navmenu">
    ${F("/brain", "Chief, the Brain")}
    ${F("/studio", "AI-Native Studio")}
    ${F("/book-a-demo", "Book a demo")}
  </nav>
</div></header>`;

/* ------------------------------------------------- one footer skeleton -- */
// audit-ux #12: one skeleton for all zones. Brand line, four fixed columns
// (Product, Studio, Company, Legal) with zone-appropriate links, and a baseline
// carrying the entity, country and a privacy link. Parity is asserted per
// zone by the gate, so the footer is one string per zone.
//
// ENTITY / COUNTRY / PRIVACY (measured 2026-09-15): no page states a legal
// entity, a registered office or a country; site/studio/contact.html carries a
// FOUNDER-BLOCKED note for exactly that. Nothing is invented here: the baseline
// names what the company already says in public (WorkElate, WE_AINA, Chitransh
// and Pratik). There is no privacy page yet, so "Privacy" points at
// /studio/contact until one exists. Both are founder inputs, not guesses.
const PRIVACY = "/studio/contact";
const legalCol = () => fJoin(rows(
  F(PRIVACY, "Privacy"),
  F("/brain/security", "Security"),
  F("/brain/proof", "Proof and limits")
));
function footer(zone, brandLogo, blurb, product, studio, company) {
  return `<footer class="mega zone-${zone}">
  <div class="wrap">
    <div class="cols">
      <div class="brand">
        ${brandLogo}
        <p>${blurb}</p>
      </div>
      <div>
        <div class="fh">Product</div>
        ${fJoin(rows(...product))}
      </div>
      <div>
        <div class="fh">Studio</div>
        ${fJoin(rows(...studio))}
      </div>
      <div>
        <div class="fh">Company</div>
        ${fJoin(rows(...company))}
      </div>
      <div>
        <div class="fh">Legal</div>
        ${legalCol()}
      </div>
    </div>
    <div class="baseline">
      <span>&copy; 2026 WorkElate &middot; Chitransh &amp; Pratik &middot; WE_AINA is WorkElate's AI&#8209;Native Studio</span>
      <span><a href="/">Excellence Studio</a> &middot; <a href="${PRIVACY}">Privacy</a></span>
    </div>
  </div>
</footer>`;
}

const brainFooter = footer("brain",
  `<a class="logo" href="/brain">WorkElate <span>Chief</span></a>`,
  "The Brain. One memory across the systems a 200 to 2,000 person company already runs, judging what needs a person and carrying it to done with a human yes in front of anything it changes. Installed by WE_AINA.",
  [ F("/brain", "Overview"), F("/brain/capabilities", "Capabilities"), F("/brain/architecture", "How it is built"),
    F("/brain/use-cases", "Use cases"), F("/brain/compare", "Compare"), F("/brain/compare#alternatives", "All alternatives"),
    F("/brain/objections", "Objections"), F("/brain/pricing", "Pricing"), F("/book-a-demo", "Book a demo") ],
  [ F("/studio", "WE_AINA"), F("/studio/work", "The work index"), F("/studio/case-studies", "Case studies"),
    F("/studio/how-we-work", "How we work"), F("/studio/contact", "Book a Diagnostic Sprint") ],
  [ F("/studio/about", "About"), F("/studio/blog", "Blog"), F("/brain/faq", "FAQ"), F("/brain/glossary", "Glossary"),
    F("/brain/roadmap", "Roadmap"), F("/brain/changelog", "What shipped"),
    `<a href="mailto:chitransh@workelate.com">chitransh@workelate.com</a>` ]);

const studioFooter = footer("studio",
  `<a class="logo" href="/studio">WE_<span>AINA</span></a>`,
  "An AI-native product studio. WorkElate's AI-Native Studio: our delivery runs on our own platform, products shipped in weeks not quarters, $30K&ndash;$100K fixed, receipts at every step.",
  [ F("/brain", "Chief, the Brain"), F("/brain/capabilities", "Capabilities"), F("/brain/use-cases", "Use cases"),
    F("/brain/compare", "Compare"), F("/brain/pricing", "Pricing"), F("/book-a-demo", "Book a demo") ],
  [ F("/studio/work", "The work index"), F("/studio/case-studies", "Case studies"), F("/studio/systems", "Systems we build"),
    F("/studio/systems/quarry-dispatch-automation", "Dispatch automation"), F("/studio/systems/ar-followup-automation", "AR follow-up"),
    F("/studio/systems/freight-reconciliation", "Freight reconciliation"), F("/studio/how-we-work", "How we work"),
    F("/studio/contact", "Book a Diagnostic Sprint") ],
  [ F("/studio/about", "About us"), F("/studio/blog", "Blog"), F("/brain/faq", "FAQ"),
    `<a href="mailto:chitransh@workelate.com">chitransh@workelate.com</a>` ]);

const hubFooter = footer("hub",
  `<a class="logo" href="/">WorkElate <span>Excellence Studio</span></a>`,
  "Where ROI meets passion. Two offerings from one company: the Brain, WorkElate Chief, and the studio that installs it, WE_AINA.",
  [ F("/brain", "Chief, the Brain"), F("/brain/capabilities", "Capabilities"), F("/brain/use-cases", "Use cases"),
    F("/brain/compare", "Compare"), F("/brain/pricing", "Pricing"), F("/book-a-demo", "Book a demo") ],
  [ F("/studio", "WE_AINA"), F("/studio/work", "The work index"), F("/studio/case-studies", "Case studies"),
    F("/studio/how-we-work", "How we work"), F("/studio/contact", "Book a Diagnostic Sprint") ],
  [ F("/studio/about", "About"), F("/studio/blog", "Blog"), F("/brain/faq", "FAQ"), F("/brain/objections", "Objections"),
    `<a href="mailto:chitransh@workelate.com">chitransh@workelate.com</a>` ]);

/* ------------------------------------------------ per-page closing line -- */
// audit-ux #23. The #cta band lives in the pages, not here. A page that wants
// its own ending carries `data-cta="One sentence that follows from the page."`
// on any element (its <body> or its #cta section), and this pass emits that
// sentence with the zone's primary button as a `.closing` strip at the top of
// the FOOTER block. A page that carries data-cta should drop its generic #cta
// band; nothing does yet, so today this emits nothing.
function closingOf(html, zone) {
  const m = html.match(/\sdata-cta="([^"]+)"/);
  if (!m) return "";
  const btn = zone === "studio" ? SPRINT : DEMO;
  return `<section class="closing"><div class="wrap"><p>${m[1]}</p>${btn}</div></section>\n`;
}

/* ------------------------------------------------------------- injector -- */
function pages(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) pages(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}

// A file's route, the same mapping app/[[...slug]]/route.js serves.
function routeOf(file) {
  let rel = path.relative(SITE, file).split(path.sep);
  const last = rel[rel.length - 1];
  if (last === "index.html") rel.pop();
  else rel[rel.length - 1] = last.slice(0, -".html".length);
  return "/" + rel.join("/");
}

// The zone is the first path segment. /book-a-demo belongs to the product.
// verify.mjs imports this so its footer-parity baseline is keyed the same way.
export function zoneOf(route) {
  if (route === "/") return "hub";
  if (route.startsWith("/brain") || route === "/book-a-demo") return "brain";
  if (route.startsWith("/studio")) return "studio";
  return "hub";
}
const CHROME = {
  brain: { nav: brainNav, footer: brainFooter },
  studio: { nav: studioNav, footer: studioFooter },
  hub: { nav: hubNav, footer: hubFooter }
};   // nav is a function of the route (the brain header is route-aware)

// aria-current on the exact route only: /brain must not light up on
// /brain/roadmap, or every sub-page claims to be the overview.
function markCurrent(nav, route) {
  return nav.replace(new RegExp(`(<a(?: class="[^"]*")? href="${route.replace(/[/.]/g, m => "\\" + m)}")>`, "g"),
    `$1 aria-current="page">`);
}

const block = (name, body) => `<!-- ${name}:start (generated by scripts/genchrome.mjs) -->\n${body}\n<!-- ${name}:end -->`;

function inject(html, name, body, legacy) {
  const marked = new RegExp(`<!-- ${name}:start[^>]*-->[\\s\\S]*?<!-- ${name}:end -->`);
  if (marked.test(html)) return html.replace(marked, block(name, body));
  if (legacy.test(html)) return html.replace(legacy, block(name, body));
  return null;
}

if (process.argv[1] && import.meta.url === `file://${process.argv[1]}`) {
  let changed = 0, skipped = [];
  const perZone = { brain: 0, studio: 0, hub: 0 };
  for (const file of pages(SITE)) {
    const route = routeOf(file);
    const zone = zoneOf(route);
    const { nav, footer } = CHROME[zone];
    const before = readFileSync(file, "utf8");

    let html = inject(before, "NAV", markCurrent(nav(route), route), /<header class="nav[^"]*">[\s\S]*?<\/header>/);
    if (html === null) { skipped.push(`${route}: no nav marker and no <header class="nav">`); continue; }
    const withFooter = inject(html, "FOOTER", closingOf(before, zone) + footer, /<footer class="mega[^"]*">[\s\S]*?<\/footer>/);
    if (withFooter === null) { skipped.push(`${route}: no footer marker and no <footer class="mega">`); continue; }
    html = withFooter;

    perZone[zone]++;
    if (html !== before) { writeFileSync(file, html); changed++; }
  }
  console.log(`genchrome: ${changed} page(s) rewritten (brain ${perZone.brain}, studio ${perZone.studio}, hub ${perZone.hub})`);
  for (const s of skipped) console.log(`  skipped ${s}`);
}
