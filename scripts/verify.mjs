// WE_AINA deterministic quality gate.
//
// Rewritten 2026-09-07 after a measured finding: the old gate passed 6/6 in
// 2.85s while a box-shadow, a page with no JSON-LD, a blank-with-JS-off body,
// a publicly served dotfile and a silently-discarded lead were all live. It
// only ever loaded "/" and its shadow assertion carried its own escape hatch.
//
// Principles (see .claude/rules/twelfth-app.md):
//   * PAGES ARE DISCOVERED, never listed. A new page under site/ is covered on
//     the next run because the crawl walks the filesystem the same way the
//     delivery route (app/[[...slug]]/route.js) maps files to URLs.
//   * NO EXEMPTIONS. An assertion with an escape hatch is not an assertion.
//   * Every failure names the page it failed on.
//
// Usage: dev server must be running (npm run dev, port 4310).
//        node scripts/verify.mjs            — full gate
//        VERIFY_URL=... node scripts/verify.mjs
import { chromium } from "playwright";
import { readdirSync, statSync, existsSync } from "node:fs";
import path from "node:path";

const URL = (process.env.VERIFY_URL || "http://localhost:4310").replace(/\/$/, "");
const SITE = path.join(process.cwd(), "site");

/* ---------------------------------------------------------------- checks -- */
const checks = [];
const t0 = Date.now();
/** @param {string} name @param {boolean} ok @param {string} [where] @param {string} [detail] */
const assert = (name, ok, where = "-", detail = "") =>
  checks.push({ check: name, page: where, ok: !!ok, detail: ok ? "" : String(detail).slice(0, 220) });

/* ------------------------------------------------------- page discovery -- */
// Mirror of toSlug()/resolve() in app/[[...slug]]/route.js: a file's public URL
// is its path minus ".html"; index.html maps to its directory. Dot-prefixed
// names are never public.
function discoverPages(dir = SITE, out = []) {
  for (const name of readdirSync(dir).sort()) {
    if (name.startsWith(".")) continue;
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) { discoverPages(p, out); continue; }
    if (!name.endsWith(".html")) continue;
    let rel = path.relative(SITE, p).split(path.sep);
    const last = rel[rel.length - 1];
    if (last === "index.html") rel.pop();
    else rel[rel.length - 1] = last.slice(0, -".html".length);
    out.push("/" + rel.join("/"));
  }
  return out;
}
if (!existsSync(SITE)) { console.error(`No site/ directory at ${SITE}`); process.exit(1); }
const PAGES = discoverPages();
if (!PAGES.length) { console.error("Discovered zero pages under site/ — refusing to pass."); process.exit(1); }

/* ------------------------------------------------------------ banned copy -- */
// Authoritative list: CLAUDE.md "Copy rules" — audit/logging as a selling
// point (founder call 2026-07-22) plus the banned CTA phrasing.
const BANNED_COPY = [
  "audit trail", "auditable", "every action logged", "every claim auditable",
  "every touch logged", "the log shows", "contact us"
];

/* ------------------------------------------------------------- page probe -- */
const browser = await chromium.launch();
// reducedMotion MUST be pinned to "no-preference": headless Chromium reports
// "reduce" by default, and site.css's @media(prefers-reduced-motion) block sets
// .rv{opacity:1} — so the default headless browser silently unhides a page that
// is blank for the majority of real visitors. Measured 2026-09-07.
const CTX = { viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" };
const ctx = await browser.newContext(CTX);

// Fail fast and loudly if the dev server is not up: an unreachable server must
// never look like a green gate.
try {
  const r = await fetch(URL + "/", { method: "GET" });
  if (!r.ok) throw new Error("status " + r.status);
} catch (e) {
  console.error(`Could not reach ${URL} — is the dev server running? (npm run dev)  [${e.message}]`);
  await browser.close();
  process.exit(1);
}

const internalLinks = new Map();   // href -> first page that used it
let footerBaseline = null, footerBaselinePage = null;

for (const route of PAGES) {
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => m.type() === "error" && errors.push(m.text()));
  page.on("requestfailed", r => errors.push(`request failed: ${r.url()} ${r.failure()?.errorText || ""}`));

  const res = await page.goto(URL + route, { waitUntil: "networkidle", timeout: 30000 }).catch(e => ({ err: e }));
  if (!res || res.err || (res.status && res.status() >= 400)) {
    assert("page loads", false, route, res?.err?.message || `status ${res?.status?.()}`);
    await page.close();
    continue;
  }
  assert("page loads", true, route);

  const facts = await page.evaluate((banned) => {
    const txt = el => (el.innerText || "").replace(/\s+/g, " ").trim();

    // headings, in document order
    const heads = [...document.querySelectorAll("h1,h2,h3,h4,h5,h6")]
      .map(h => ({ level: +h.tagName[1], text: txt(h).slice(0, 60) }));
    let orderViolation = null;
    for (let i = 1; i < heads.length; i++) {
      if (heads[i].level > heads[i - 1].level + 1)
        orderViolation = `h${heads[i - 1].level} "${heads[i - 1].text}" -> h${heads[i].level} "${heads[i].text}"`;
    }

    // images: non-empty alt, or explicit alt="" WITH aria-hidden (decorative)
    const badImgs = [...document.querySelectorAll("img")]
      .filter(img => {
        const alt = img.getAttribute("alt");
        if (alt === null) return true;
        if (alt.trim() !== "") return false;
        return img.getAttribute("aria-hidden") !== "true";
      })
      .map(img => img.getAttribute("src") || "(no src)");

    // JSON-LD: PARSED, not counted
    const ld = [...document.querySelectorAll('script[type="application/ld+json"]')];
    const ldErrors = [];
    let ldObjects = 0;
    for (const s of ld) {
      const raw = (s.textContent || "").trim();
      if (!raw) { ldErrors.push("empty <script type=application/ld+json>"); continue; }
      try {
        const parsed = JSON.parse(raw);
        const arr = Array.isArray(parsed) ? parsed : [parsed];
        for (const o of arr) {
          if (!o || typeof o !== "object") { ldErrors.push("JSON-LD node is not an object"); continue; }
          if (!o["@context"]) ldErrors.push("JSON-LD missing @context");
          if (!o["@type"] && !o["@graph"]) ldErrors.push("JSON-LD missing @type");
          ldObjects++;
        }
      } catch (e) { ldErrors.push("JSON-LD parse error: " + e.message); }
    }

    // banned copy, over rendered text
    const body = txt(document.body).toLowerCase();
    const hits = banned.filter(b => body.includes(b));

    // Banned styles. Box-shadow has no exemption anywhere. Gradient has exactly
    // one, added on a founder call 2026-09-07 ("here as navy glossy blue"): the
    // #cta band may carry a navy sheen. The exemption is deliberately keyed to
    // that ONE element id rather than to an attribute a page can stamp on
    // itself — the previous data-shadow-ok escape hatch let shadows return
    // sitewide while the gate reported green, and that must not repeat.
    const GRADIENT_OK = new Set(["cta"]);
    const styleHits = [];
    for (const el of document.querySelectorAll("*")) {
      const s = getComputedStyle(el);
      const sel = el.tagName.toLowerCase() +
        (el.id ? "#" + el.id : "") +
        (el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).join(".") : "");
      if (s.backgroundImage.includes("gradient") && !GRADIENT_OK.has(el.id)) {
        styleHits.push(`gradient on ${sel}: ${s.backgroundImage.slice(0, 60)}`);
      }
      if (s.boxShadow && s.boxShadow !== "none") styleHits.push(`box-shadow on ${sel}: ${s.boxShadow.slice(0, 60)}`);
    }

    // internal links
    const links = [...document.querySelectorAll("a[href]")]
      .map(a => a.getAttribute("href"))
      .filter(h => h && h.startsWith("/") && !h.startsWith("//"));

    const footer = document.querySelector("footer");
    const footerLinks = footer
      ? [...footer.querySelectorAll("a[href]")].map(a => a.getAttribute("href")).sort()
      : null;

    return {
      h1: document.querySelectorAll("h1").length,
      orderViolation,
      badImgs,
      canonical: document.querySelectorAll('link[rel="canonical"]').length,
      canonicalHref: document.querySelector('link[rel="canonical"]')?.getAttribute("href") || "",
      desc: (document.querySelector('meta[name="description"]')?.getAttribute("content") || "").trim(),
      ldCount: ld.length, ldObjects, ldErrors,
      bannedHits: hits,
      styleHits: [...new Set(styleHits)],
      links, footerLinks,
      title: (document.title || "").trim()
    };
  }, BANNED_COPY);

  assert("zero console errors", errors.length === 0, route, errors.join(" | "));
  assert("exactly one h1", facts.h1 === 1, route, `found ${facts.h1}`);
  assert("heading order (no skipped level)", !facts.orderViolation, route, facts.orderViolation);
  assert("every img has alt", facts.badImgs.length === 0, route, facts.badImgs.join(", "));
  assert("exactly one canonical", facts.canonical === 1, route, `found ${facts.canonical}`);
  assert("meta description present", facts.desc.length >= 40, route, `len ${facts.desc.length}`);
  assert("valid parsed JSON-LD", facts.ldCount >= 1 && facts.ldObjects >= 1 && facts.ldErrors.length === 0,
    route, facts.ldCount === 0 ? "no JSON-LD on page" : facts.ldErrors.join("; "));
  assert("no banned copy", facts.bannedHits.length === 0, route, facts.bannedHits.join(", "));
  assert("no box-shadow / gradient", facts.styleHits.length === 0, route, facts.styleHits.slice(0, 3).join(" | "));
  assert("title present", facts.title.length > 0, route);

  for (const h of facts.links) if (!internalLinks.has(h)) internalLinks.set(h, route);

  // footer parity: same link set on every page (homepage is the baseline)
  if (facts.footerLinks === null) {
    assert("footer present", false, route, "no <footer>");
  } else {
    assert("footer present", true, route);
    if (footerBaseline === null) { footerBaseline = facts.footerLinks; footerBaselinePage = route; }
    else {
      const a = new Set(footerBaseline), b = new Set(facts.footerLinks);
      const missing = [...a].filter(x => !b.has(x)), extra = [...b].filter(x => !a.has(x));
      assert("footer parity", missing.length === 0 && extra.length === 0, route,
        `vs ${footerBaselinePage}: missing ${JSON.stringify(missing)} extra ${JSON.stringify(extra)}`);
    }
  }

  // CTA discipline: the one CTA phrase must actually appear on every page
  const cta = await page.getByText("Book a Diagnostic Sprint").count();
  assert("CTA phrase present", cta >= 1, route, `found ${cta}`);

  await page.close();
}

/* -------------------------------------------------- internal link integrity -- */
{
  const bad = [];
  for (const [href, from] of internalLinks) {
    const target = href.split("#")[0] || "/";
    if (!target.startsWith("/")) continue;
    const r = await fetch(URL + target, { redirect: "follow" }).catch(e => ({ status: 0, err: e.message }));
    if (!r.status || r.status >= 400) bad.push(`${href} (${r.status || r.err}) linked from ${from}`);
  }
  assert("zero broken internal links", bad.length === 0, `${internalLinks.size} links`, bad.join(" | "));
}

/* ------------------------------------------------------ dotfile leak guard -- */
// Regression test: /img/.verify-live/last-receipt.md was publicly served.
// Any dot-prefixed segment must 404, whether or not the file exists on disk.
{
  // Discovered, not listed: every dot-prefixed file that actually exists under
  // site/ is probed, so a new agent receipt directory is covered on the next
  // run without anyone remembering to add it (.claude/rules/twelfth-app.md).
  const dotted = [];
  (function walkDot(dir) {
    for (const name of readdirSync(dir)) {
      const p = path.join(dir, name);
      if (statSync(p).isDirectory()) walkDot(p);
      else if (path.relative(SITE, p).split(path.sep).some(s => s.startsWith(".")))
        dotted.push("/" + path.relative(SITE, p).split(path.sep).join("/"));
    }
  })(SITE);
  const probes = [...new Set([
    ...dotted,
    "/img/.verify-live/last-receipt.md",  // the leak that was fixed — pinned
    "/.claude/rules/design-system.md",
    "/data/.env"
  ])];
  const served = [];
  for (const p of probes) {
    const r = await fetch(URL + p).catch(() => ({ status: 0 }));
    if (r.status && r.status < 400) served.push(`${p} -> ${r.status}`);
  }
  assert("no dot-prefixed path is served", served.length === 0, "dotfiles", served.join(" | "));
}

/* ------------------------------------------------------- JS-off rendering -- */
// DEPLOY.md claims "No JavaScript is required to render page content".
// site/css/site.css sets .rv{opacity:0} and only JS adds .in, so with JS off
// the page below the hero was blank. This encodes the claim as a gate.
{
  const noJs = await browser.newContext({ ...CTX, javaScriptEnabled: false });
  for (const route of PAGES) {
    const p = await noJs.newPage();
    // "load", never "domcontentloaded": with DCL the stylesheet may not have
    // applied yet, every element reports opacity 1 and the check passes on a
    // page that is in fact blank. Measured 2026-09-07.
    await p.goto(URL + route, { waitUntil: "load", timeout: 30000 });
    const r = await p.evaluate(() => {
      // checkVisibility({opacityProperty:true}) walks ANCESTORS — a <p> inside a
      // .rv{opacity:0} wrapper still reports computed opacity 1, which is how an
      // earlier version of this probe missed a fully blank page.
      const NON_CONTENT = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "TEMPLATE", "TITLE", "META", "LINK"]);
      const hiddenText = [];
      let visibleChars = 0;
      for (const el of document.querySelectorAll("body *")) {
        if (NON_CONTENT.has(el.tagName)) continue;
        const own = [...el.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join(" ").trim();
        if (!own) continue;
        const visible = el.checkVisibility({ opacityProperty: true, visibilityProperty: true, contentVisibilityAuto: true });
        if (!visible) { if (own.length > 20) hiddenText.push(own.slice(0, 50)); }
        else visibleChars += own.length;
      }
      return { hiddenText, visibleChars, hiddenCount: hiddenText.length };
    });
    await p.close();
    assert("renders with JS disabled", r.hiddenCount === 0 && r.visibleChars > 800, route,
      `${r.hiddenCount} text blocks invisible without JS, ${r.visibleChars} visible chars` +
      (r.hiddenText[0] ? ` — e.g. "${r.hiddenText[0]}"` : ""));
  }
  await noJs.close();
}

/* ------------------------------------------------------- conversion path -- */
// The site's only conversion path. It silently discarded every lead on the
// deploy target and no gate saw it. Local dev server only — no external calls
// (notify() is a no-op without RESEND_API_KEY).
{
  // The route rate-limits 8/hr per IP. Without a distinct source address the
  // gate exhausts the quota after eight runs and then fails on its own probes
  // (measured), and worse, it would be spending a real visitor's allowance.
  // 192.0.2.0/24 is TEST-NET-1 (RFC 5737) — never a real client.
  const runIp = `192.0.2.${(Math.floor(Date.now() / 1000) % 250) + 1}`;
  const post = (body) => fetch(URL + "/api/lead", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": runIp },
    body: JSON.stringify(body)
  }).then(async r => ({ status: r.status, json: await r.json().catch(() => ({})) }))
    .catch(e => ({ status: 0, json: { err: e.message } }));

  const good = await post({
    contact: "verify-gate@example.com", industry: "verify",
    transcript: "[automated verify gate run — not a real lead]", path: "/verify"
  });
  assert("POST /api/lead accepts a valid lead", good.status === 200 && good.json.ok === true,
    "/api/lead", `status ${good.status} ${JSON.stringify(good.json).slice(0, 120)}`);
  // A lead must land somewhere: stored, or the response says the store is not
  // configured (in which case the email path is the delivery). A silent drop —
  // ok:true with neither signal — is the bug this line exists to catch.
  assert("a valid lead is accounted for (stored or explicitly not)",
    good.json.persisted === true || typeof good.json.note === "string",
    "/api/lead", JSON.stringify(good.json).slice(0, 160));

  const honey = await post({ contact: "bot@example.com", website: "http://spam.example" });
  // The route answers a fake 200 by design; what must NOT happen is storage.
  assert("honeypot lead is not stored", honey.json.persisted !== true && honey.json.id === undefined,
    "/api/lead", JSON.stringify(honey.json).slice(0, 160));

  const junk = await post({ contact: "not-an-email" });
  assert("invalid contact is rejected", junk.status === 400, "/api/lead", `status ${junk.status}`);
}

/* -------------------------------------------------- assistant / chat path -- */
// The homepage assistant is the surface that produces leads. Exercise it: open
// it, ask a question, and require an answer with zero console errors.
{
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", e => errors.push("pageerror: " + e.message));
  page.on("console", m => m.type() === "error" && errors.push(m.text()));
  await page.goto(URL + "/", { waitUntil: "networkidle", timeout: 30000 });
  const probe = await page.evaluate(async () => {
    const input = document.querySelector('input[type="text"], textarea, [contenteditable="true"]');
    if (!input) return { found: false };
    const form = input.closest("form");
    const before = document.body.innerText.length;
    input.focus();
    if ("value" in input) {
      input.value = "What does WE_AINA do?";
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
    if (form) form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    else input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    await new Promise(r => setTimeout(r, 1200));
    return { found: true, grew: document.body.innerText.length > before + 40 };
  });
  assert("assistant answers a question", probe.found && probe.grew, "/",
    probe.found ? "asked a question, page text did not grow (no answer rendered)" : "no assistant input found on /");
  assert("zero console errors during assistant use", errors.length === 0, "/", errors.join(" | "));
  await page.close();
}

/* ------------------------------------------------------------ jank probe -- */
// Honest: EVERY run must be clean. The old best-of-2 let a task that fires
// half the time pass every time.
{
  const page = await ctx.newPage();
  await page.goto(URL + "/", { waitUntil: "networkidle", timeout: 30000 });
  await page.evaluate(() => document.getElementById("casestudy")?.scrollIntoView());
  await page.waitForTimeout(600);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const probe = () => page.evaluate(async () => {
    const long = [];
    const obs = new PerformanceObserver(l => long.push(...l.getEntries()));
    obs.observe({ type: "longtask" });
    await new Promise(r => setTimeout(r, 100));
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      scrollTo(0, y); await new Promise(r => setTimeout(r, 16));
    }
    await new Promise(r => setTimeout(r, 100));
    obs.disconnect();
    return long.filter(t => t.duration > 50).map(t => Math.round(t.duration));
  });
  const runs = [];
  for (let i = 0; i < 2; i++) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    runs.push(await probe());
  }
  const worst = runs.flat();
  assert("scroll long-tasks (>50ms) === 0 on EVERY run", worst.length === 0, "/",
    `runs: ${runs.map(r => r.length).join(",")} long tasks, durations ${worst.join("/")}ms`);
  await page.close();
}

await browser.close();

/* ---------------------------------------------------------------- report -- */
const fails = checks.filter(c => !c.ok);
const byCheck = new Map();
for (const c of checks) {
  const e = byCheck.get(c.check) || { check: c.check, pass: 0, fail: 0, failed_on: [] };
  c.ok ? e.pass++ : (e.fail++, e.failed_on.push(c.page));
  byCheck.set(c.check, e);
}
console.log(`\nWE_AINA verify gate — ${PAGES.length} pages crawled, ${checks.length} assertions, ${((Date.now() - t0) / 1000).toFixed(1)}s\n`);
console.table([...byCheck.values()].map(e => ({
  check: e.check, pass: e.pass, fail: e.fail,
  failed_on: e.failed_on.slice(0, 4).join(", ") + (e.failed_on.length > 4 ? ` +${e.failed_on.length - 4}` : "")
})));
if (fails.length) {
  console.log("\nFAILURES\n────────");
  for (const f of fails) console.log(`✗ ${f.check}  [${f.page}]\n    ${f.detail}`);
  console.log(`\n${fails.length} failing assertion(s) across ${new Set(fails.map(f => f.page)).size} page(s).`);
  process.exit(1);
}
console.log(`\nAll ${checks.length} assertions green.`);
