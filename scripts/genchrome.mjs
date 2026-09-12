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
// RUN IT LAST. gensystems / gencases / genwork write pages from their own
// templates; this pass is what makes their chrome match everyone else's.
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

const L = (href, title, sub) =>
  routeExists(href) ? `<a href="${href}"><b>${title}</b><span>${sub}</span></a>` : "";
const F = (href, label) => routeExists(href) ? `<a href="${href}">${label}</a>` : "";
const rows = (...xs) => xs.filter(Boolean);
const nmJoin = (xs) => xs.join("\n            ");
const fJoin = (xs) => xs.join("\n        ");

// One mega-menu panel. Two link columns and a promo, never three columns of
// links: .nm-cols is a 1fr 1fr 1.15fr grid and the third track is the promo.
// HEIGHT IS A CONSTRAINT: the panel is absolutely positioned inside a sticky
// header, so rows past the fold are unreachable. Keep columns to ~6 rows.
function panel(id, label, colA, colB, promo, foot) {
  if (!colA.body && !colB.body) return "";
  const col = (c) => c.body ? `          <div class="nm-col">\n            <span class="nm-h">${c.h}</span>\n            ${c.body}\n          </div>` : "";
  return `
    <div class="nav-item has-menu">
      <button class="nav-trig" aria-expanded="false" aria-controls="${id}">${label}<span class="chev" aria-hidden="true"></span></button>
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

// The single CTA phrase the gate asserts on every page.
const CTA = `<a class="btn" href="/studio/contact">Book a Diagnostic Sprint</a>`;

/* ============================================================ BRAIN ZONE == */
// The product site for WorkElate Chief. Shape borrowed from the founder's
// reference (citedspy.com): Product, Compare, Resources, Pricing, Book a demo.
const brainNav = `<header class="nav zone-brain"><div class="wrap row">
  <a class="logo" href="/brain"><img src="/img/workelate-logo.svg" alt="WorkElate" width="140" height="32" decoding="async"><span class="logo-div">Chief &middot; the Brain</span></a>
${toggle}
  <nav id="navmenu">
${panel("menu-product", "Product",
  colOf("The brain",
    L("/brain", "Overview", "One memory across the systems you already run"),
    L("/brain/capabilities", "Capabilities", "Every verb, grouped by what it does"),
    L("/brain/architecture", "How it is built", "The loop, the fence, the confirm gate"),
    L("/brain/security", "Security", "What a review asks, answered plainly"),
    L("/brain/proof", "Proof", "What is measured and what is not claimed"),
    L("/brain/getting-started", "Getting started", "The first two weeks, as a checklist")),
  col2("For your role", [
      L("/brain/for/coo", "For the COO", "Find out before the standup, not after the quarter"),
      L("/brain/for/cio", "For the CIO", "No rip and replace, no new system of record"),
      L("/brain/for/revenue", "For revenue", "Deals that go quiet get a nudge, not a post-mortem")],
    "Use cases", [
      L("/brain/use-cases/client-delivery", "Client delivery", "Scope, plan and status that keep themselves current"),
      L("/brain/use-cases/order-to-cash", "Order to cash", "Order in, invoice matched, money chased"),
      L("/brain/use-cases", "All use cases", "The workflows the brain is put on first")]),
  { k: "See it on your stack", t: "One system, one week of real signals.", p: "We connect one system read-only, replay a week, and show you what it caught and what it stayed quiet about.", href: "/book-a-demo", go: "Book a demo" },
  { text: "Built and run on our own delivery before it is sold to yours.", href: "/studio", go: "Meet the studio" })}
${panel("menu-compare", "Compare",
  colOf("Against what you already pay for",
    L("/brain/compare/per-app-copilots", "Per-app copilots", "The assistant inside one tool"),
    L("/brain/compare/enterprise-search", "Enterprise search", "Finds the document, stops at the answer"),
    L("/brain/compare/ipaas-and-rpa", "iPaaS and RPA", "A flow per scenario, forever"),
    L("/brain/compare/build-your-own", "Building it yourself", "Real option, real cost")),
  colOf("Decide honestly",
    L("/brain/compare", "The decision table", "Six questions, five columns"),
    L("/brain/objections", "The eight objections", "With the answers that concede"),
    L("/brain/compare#choose", "When not to pick us", "Two situations where we say so")),
  { k: "Fair to the other side", t: "We name what they are better at.", p: "A comparison that never concedes is a brochure. These do, in the first paragraph.", href: "/brain/compare", go: "Read the table" },
  { text: "Comparisons reflect public product information, not a controlled test.", href: "/brain/proof", go: "What we can prove" })}
${panel("menu-resources", "Resources",
  colOf("Learn",
    L("/brain/faq", "FAQ", "The questions a buyer asks, in order"),
    L("/brain/glossary", "Glossary", "Our words, defined once"),
    L("/brain/roadmap", "Roadmap", "What we are building next, no dates"),
    L("/brain/changelog", "What shipped", "Dated, not promised")),
  colOf("Company",
    L("/studio", "The studio", "WE_AINA, the agency that installs it"),
    L("/studio/about", "About", "Chitransh and Pratik, in first person"),
    L("/studio/blog", "Blog", "Field notes from the delivery floor"),
    L("/studio/contact", "Talk to us", "Straight to the two partners")),
  { k: "Read it in full", t: "The long form lives with us.", p: "Every capability, objection and use case, written out. Ask and we send the reading pack.", href: "/studio/contact", go: "Ask for the pack" },
  { text: "WorkElate Chief is installed by WE_AINA, WorkElate's own studio.", href: "/", go: "The Excellence Studio" })}
    ${routeExists("/brain/pricing") ? '<a href="/brain/pricing">Pricing</a>' : ""}
    <a href="/book-a-demo">Book a demo</a>
    ${CTA}
  </nav>
</div></header>`;

const brainFooter = `<footer class="mega zone-brain">
  <div class="wrap">
    <div class="cols">
      <div class="brand">
        <a class="logo" href="/brain">WorkElate <span>Chief</span></a>
        <p>The Brain. One memory across the systems a 200 to 2,000 person company already runs, judging what needs a person and carrying it to done with a human yes in front of anything it changes. Installed by WE_AINA.</p>
      </div>
      <div>
        <div class="fh">Product</div>
        ${fJoin(rows(
          F("/brain", "Overview"),
          F("/brain/capabilities", "Capabilities"),
          F("/brain/architecture", "How it is built"),
          F("/brain/security", "Security"),
          F("/brain/proof", "Proof"),
          F("/brain/pricing", "Pricing")
        ))}
      </div>
      <div>
        <div class="fh">Use cases</div>
        ${fJoin(rows(
          F("/brain/use-cases/client-delivery", "Client delivery"),
          F("/brain/use-cases/order-to-cash", "Order to cash"),
          F("/brain/use-cases/mail-triage", "Mail triage"),
          F("/brain/use-cases/board-reporting", "Board reporting"),
          F("/brain/for/coo", "For the COO"),
          F("/brain/for/cio", "For the CIO"),
          F("/brain/for/revenue", "For revenue")
        ))}
      </div>
      <div>
        <div class="fh">Compare</div>
        ${fJoin(rows(
          F("/brain/compare/per-app-copilots", "vs per-app copilots"),
          F("/brain/compare/enterprise-search", "vs enterprise search"),
          F("/brain/compare/ipaas-and-rpa", "vs iPaaS and RPA"),
          F("/brain/compare/build-your-own", "vs building it yourself"),
          F("/brain/compare", "All comparisons"),
          F("/brain/objections", "Objections")
        ))}
      </div>
      <div>
        <div class="fh">Resources</div>
        ${fJoin(rows(
          F("/brain/faq", "FAQ"),
          F("/brain/glossary", "Glossary"),
          F("/brain/getting-started", "Getting started"),
          F("/brain/roadmap", "Roadmap"),
          F("/brain/changelog", "What shipped"),
          F("/book-a-demo", "Book a demo"),
          F("/studio", "The studio")
        ))}
      </div>
    </div>
    <div class="baseline">
      <span>&copy; 2026 WorkElate &middot; Chief is installed and run by WE_AINA, WorkElate's AI-Native Studio</span>
      <span><a href="/">Excellence Studio</a> &middot; <a href="/studio/contact">Book a Diagnostic Sprint</a></span>
    </div>
  </div>
</footer>`;

/* =========================================================== STUDIO ZONE == */
// The agency. Everything that used to be the whole site, now under /studio,
// with one door across to the product.
const studioNav = `<header class="nav zone-studio"><div class="wrap row">
  <a class="logo" href="/studio"><img src="/img/weaina-logo.svg" alt="WE_AINA" width="152" height="35" decoding="async"><span class="logo-div">AI&#8209;Native Studio</span></a>
${toggle}
  <nav id="navmenu">
${panel("menu-work", "Work",
  colOf("Proof",
    L("/studio/work", "The index", "34 builds, 9 sectors, 374 repositories"),
    L("/studio/case-studies", "Case studies", "The engagements we can put numbers against"),
    L("/studio/case-studies/rockprosusa", "RockProsUSA", "13 quarries, 38% off the dispatch cycle")),
  colOf("Systems we build",
    L("/studio/systems/quarry-dispatch-automation", "Dispatch automation", "Orders to trucks, confirmed"),
    L("/studio/systems/ar-followup-automation", "AR follow-up", "Chasing money without a chaser"),
    L("/studio/systems/freight-reconciliation", "Freight reconciliation", "Three-way match, zero touches"),
    L("/studio/systems", "All six systems", "The shapes that repeat across clients")),
  { k: "How we work", t: "Two partners, an agent fleet, a fixed price.", p: "Diagnostic in two weeks, a working system in weeks after it, and the operating numbers themselves as the report.", href: "/studio/how-we-work", go: "Read the operating model" },
  { text: "Every build scoped, built and run inside the product we would sell you.", href: "/studio/about", go: "Who you talk to" })}
${panel("menu-resources", "Resources",
  colOf("Read",
    L("/studio/blog", "Blog", "Field notes from the delivery floor"),
    L("/studio/blog/receipts-over-decks", "Receipts over decks", "Why we report numbers, not status"),
    L("/studio/blog/the-pyramid-cant-survive-agents", "The pyramid and agents", "What breaks in the SI model")),
  colOf("Company",
    L("/studio/about", "About", "Chitransh and Pratik, in first person"),
    L("/studio/how-we-work", "How we work", "The 10&times; operating model"),
    L("/studio/contact", "Talk to us", "Straight to the two partners")),
  { k: "The product we install", t: "WorkElate Chief, the Brain.", p: "One memory across the systems a company already runs. Our delivery runs on it before yours does.", href: "/brain", go: "Meet the brain" },
  { text: "WE_AINA is WorkElate's AI-Native Studio.", href: "/", go: "The Excellence Studio" })}
    <a href="/brain">The Brain</a>
    <a href="/book-a-demo">Book a demo</a>
    ${CTA}
  </nav>
</div></header>`;

const studioFooter = `<footer class="mega zone-studio">
  <div class="wrap">
    <div class="cols">
      <div class="brand">
        <a class="logo" href="/studio">WE_<span>AINA</span></a>
        <p>An AI-native product studio. WorkElate's AI-Native Studio: our delivery runs on our own platform, products shipped in weeks not quarters, $30K&ndash;$100K fixed, receipts at every step.</p>
      </div>
      <div>
        <div class="fh">Work</div>
        ${fJoin(rows(
          F("/studio/work", "The index"),
          F("/studio/case-studies", "Case studies"),
          F("/studio/systems", "Systems we build"),
          F("/studio/systems/quarry-dispatch-automation", "Dispatch automation"),
          F("/studio/systems/ar-followup-automation", "AR follow-up"),
          F("/studio/systems/freight-reconciliation", "Freight reconciliation")
        ))}
      </div>
      <div>
        <div class="fh">The Brain</div>
        ${fJoin(rows(
          F("/brain", "Overview"),
          F("/brain/capabilities", "Capabilities"),
          F("/brain/use-cases", "Use cases"),
          F("/brain/compare", "Compare"),
          F("/brain/pricing", "Pricing"),
          F("/book-a-demo", "Book a demo")
        ))}
      </div>
      <div>
        <div class="fh">Company</div>
        ${fJoin(rows(
          F("/studio/about", "About us"),
          F("/studio/how-we-work", "How we work"),
          F("/studio/blog", "Blog"),
          F("/studio/contact", "Book a Diagnostic Sprint"),
          `<a href="mailto:chitransh@workelate.com">chitransh@workelate.com</a>`
        ))}
      </div>
      <div>
        <div class="fh">Excellence Studio</div>
        ${fJoin(rows(
          F("/", "Two offerings, one company"),
          F("/brain", "Product: Chief, the Brain"),
          F("/studio", "Studio: WE_AINA")
        ))}
      </div>
    </div>
    <div class="baseline">
      <span>&copy; 2026 WE_AINA &middot; WorkElate's AI-Native Studio &middot; Chitransh &amp; Pratik</span>
    </div>
  </div>
</footer>`;

/* ============================================================== HUB ZONE == */
// The umbrella landing. Two doors, nothing else in the header.
const hubNav = `<header class="nav zone-hub"><div class="wrap row">
  <a class="logo" href="/"><img src="/img/workelate-logo.svg" alt="WorkElate" width="140" height="32" decoding="async"><span class="logo-div">Excellence Studio</span></a>
${toggle}
  <nav id="navmenu">
    <a href="/brain">Chief, the Brain</a>
    <a href="/studio">AI-Native Studio</a>
    <a href="/book-a-demo">Book a demo</a>
    ${CTA}
  </nav>
</div></header>`;

const hubFooter = `<footer class="mega zone-hub">
  <div class="wrap">
    <div class="cols">
      <div class="brand">
        <a class="logo" href="/">WorkElate <span>Excellence Studio</span></a>
        <p>Where ROI meets passion. Two offerings from one company: the Brain, WorkElate Chief, and the studio that installs it, WE_AINA.</p>
      </div>
      <div>
        <div class="fh">Product</div>
        ${fJoin(rows(
          F("/brain", "Chief, the Brain"),
          F("/brain/capabilities", "Capabilities"),
          F("/brain/use-cases", "Use cases"),
          F("/brain/compare", "Compare"),
          F("/brain/pricing", "Pricing")
        ))}
      </div>
      <div>
        <div class="fh">Studio</div>
        ${fJoin(rows(
          F("/studio", "WE_AINA"),
          F("/studio/work", "The work index"),
          F("/studio/case-studies", "Case studies"),
          F("/studio/how-we-work", "How we work"),
          F("/studio/about", "About")
        ))}
      </div>
      <div>
        <div class="fh">Engage</div>
        ${fJoin(rows(
          F("/book-a-demo", "Book a demo"),
          F("/studio/contact", "Book a Diagnostic Sprint"),
          `<a href="mailto:chitransh@workelate.com">chitransh@workelate.com</a>`
        ))}
      </div>
      <div>
        <div class="fh">Read</div>
        ${fJoin(rows(
          F("/brain/faq", "FAQ"),
          F("/brain/objections", "Objections"),
          F("/studio/blog", "Blog")
        ))}
      </div>
    </div>
    <div class="baseline">
      <span>&copy; 2026 WorkElate &middot; Excellence Studio &middot; Chitransh &amp; Pratik</span>
    </div>
  </div>
</footer>`;

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
};

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

    let html = inject(before, "NAV", markCurrent(nav, route), /<header class="nav[^"]*">[\s\S]*?<\/header>/);
    if (html === null) { skipped.push(`${route}: no nav marker and no <header class="nav">`); continue; }
    const withFooter = inject(html, "FOOTER", footer, /<footer class="mega[^"]*">[\s\S]*?<\/footer>/);
    if (withFooter === null) { skipped.push(`${route}: no footer marker and no <footer class="mega">`); continue; }
    html = withFooter;

    perZone[zone]++;
    if (html !== before) { writeFileSync(file, html); changed++; }
  }
  console.log(`genchrome: ${changed} page(s) rewritten (brain ${perZone.brain}, studio ${perZone.studio}, hub ${perZone.hub})`);
  for (const s of skipped) console.log(`  skipped ${s}`);
}
