# WE_AINA build rules

WE_AINA = WorkElate's AI-Native Agency. The strategic spine: the agency
runs its delivery on WorkElate (dogfooding at commercial stakes),
services revenue bootstraps the company, and the agency itself is the
proof-of-product that powers the fundraise. This linkage is public —
never strip "WorkElate's AI-Native Agency" from the site narrative.

## The loop
1. Work in the loop: PLAN one section → BUILD → run `npm run verify`
   → FIX until green → only then move to the next section.
2. Never claim a section is done without pasting verify output.
3. Design system in .claude/rules/design-system.md is LAW (currently
   v7: WorkElate dark ground, Work Sans, cyan/purple gradients and glass).
   If a request conflicts, push back with
   the compliant alternative.
4. Section order: hero → ticker → shift → work → services → casestudy
   → process → founders → cta → footer.
5. After touching #casestudy or any JS: run Lighthouse mobile;
   budgets — perf ≥ 95, 0 long tasks >50ms during scroll, CLS 0.
6. Final summaries must name exact file paths for created/changed
   files and state "tests pass" only after running them — verify-live
   checks every claim.

## Commands
- `npm run dev` — Next.js dev server on http://localhost:4310 (NOT
  4321 — another project owns [::1]:4321; do not kill it).
- `npm run build` / `npm run start` — Next.js production build/serve.
- `npm run dev:legacy` — old zero-dependency server.mjs (kept as
  reference; same routes).
- `npm run verify` — deterministic gate (Playwright). Needs dev server.
- `npm run frames` — regenerates the 160 procedural scrub frames.
  DEAD as of 2026-07-22: the scrub section was cut, nothing reads
  assets/frames/casestudy/ any more. Kept only as reference.
- `node scripts/gensystems.mjs` — regenerate /studio/systems pages.
- `node scripts/gencorpus.mjs` — rebuild site/data/corpus.json, the
  knowledge base the hero assistant answers from.
- `npm run assets` — minify live CSS/JS and update all static page refs.
  Run last, after page, chrome, SEO, sitemap and corpus generators.
- `node scripts/genartifacts.mjs` — regenerate product mockup PNGs.
- `node scripts/genog.mjs` — regenerate the OG image.
- `node scripts/genchrome.mjs` — rewrite the header nav and the mega footer
  into EVERY page under site/. Run after gensystems/gencases/genwork and
  before SEO, sitemap, corpus and production assets.
  The chrome lives in that one file; pages carry `<!-- NAV:start -->` /
  `<!-- FOOTER:start -->` markers it rewrites. Never hand-edit a nav or footer
  in a page: footer parity is a gate assertion and a hand edit dies on the
  next run.
- `node scripts/gensitemap.mjs` — sitemap.xml + robots.txt derived from site/.
  Run after SEO and before corpus/production assets.
- `node scripts/gencapindex.mjs` — regenerate the capability index rows in
  site/brain/capabilities/index.html from the capability pages themselves.
- `node scripts/genbrain.mjs` — regenerate the /brain product mockups (being
  replaced by real product captures under site/img/real/)
  (site/img/brain-verbs, -honesty, -ladder, -adoption.png).

## Generated files — never hand-edit
site/studio/systems/*.html, site/data/corpus.json, site/sitemap.xml,
site/robots.txt, site/og.png,
site/img/*.png, site/css/*.min.css, site/js/*.min.js,
assets/frames/casestudy/* are ALL generator output.
Edit the generator in scripts/, then re-run it. A hand edit dies on
the next regeneration.

## Architecture facts (non-obvious)
- Next.js (founder call 2026-07-13) is the delivery layer only: pages
  stay statically generated HTML in site/, served byte-identical by
  the catch-all app/[[...slug]]/route.js (site/ + assets/). Content
  still comes from generators — do NOT convert pages to JSX without a
  founder call. server.mjs kept as dev:legacy reference.
- POST /api/lead lives in app/api/lead/route.js. It validates email/phone,
  caps payloads, uses the `website` honeypot (fake 200), and rate-limits
  valid submissions to 8/hr/IP. Next dev hot-reloads route handlers.
- The pinned scroll-scrub was CUT on 2026-07-22 (founder: "entirely
  looking pathetic") — 500vh of near-blank navy, because the frames
  were never more than placeholder SVGs. #casestudy is now a static
  content section in site/index.html. site/js/scrollFrames.js and
  assets/frames/casestudy/ (4.8 MB) are now DEAD CODE, imported by
  nothing; delete them once the founder confirms no scrub returns.
- Lead capture: the on-page assistant (site/js/chat.js) captures a
  contact mid-conversation and POSTs to app/api/lead/route.js, which
  stores it in the chat_leads table (lib/db.js) and emails it. ALL leads
  go to chitransh@workelate.com and no other address (founder call
  2026-07-23); override only via env LEAD_NOTIFY_TO. Notification uses
  Resend's HTTP API gated on RESEND_API_KEY — set that (and optionally
  LEAD_NOTIFY_FROM with a verified domain) to turn sending on. Until
  then leads are stored and the audit table records notify_skipped.
- The old /api/score readiness widget was DELETED 2026-07-23; the one
  CTA phrase is now "Book a Diagnostic Sprint" (verify enforces it).

- Hero assistant (site/js/chat.js) answers from site/data/corpus.json ONLY,
  a local deterministic retrieval engine, no model call. It cannot say
  anything the corpus does not contain, which is deliberate: a hosted model
  free-typing about our numbers is how a consultancy site starts lying.
  Corpus comes from data/projects.json + data/cases.json via gencorpus.mjs.
- data/projects.json is the delivery portfolio, derived from the ESLABS101 /
  workelate GitHub account (300 accessible repos, 2019-2026, crawled
  2026-07-22). `named:false` means the client has NOT cleared use of their
  name; render the descriptor only.
- IMPORTANT: never run `npm run build` while `npm run dev` is running. They
  share .next/ and the production build corrupts the dev server (module not
  found on every route). Kill dev, or build, then `rm -rf .next`.

## Zones (founder call 2026-09-12: "WorkElate Excellence Studio, two offerings")
- `/` is the umbrella landing (site/index.html): Excellence Studio, two doors.
- `/brain/*` plus `/book-a-demo` is the PRODUCT site for WorkElate Chief, the Brain.
- `/studio/*` is the agency, WE_AINA: everything that used to sit at the root
  (about, contact, work, how-we-work, blog, case-studies, systems). The CTA
  target sitewide is now `/studio/contact`.
- `scripts/genchrome.mjs` writes a different nav and footer per zone
  (`zoneOf(route)`), and `scripts/verify.mjs` asserts footer parity PER ZONE.
- Generators write into `site/studio/…` now (gensystems, gencases, genwork,
  genbreadth); sitemap and robots still land at `site/`.
- `site/` is committed and deployed from `main` through Vercel's GitHub
  integration; no separate deploy branch.

## IP stays internal (founder, 2026-09-12)
"kya unify or glean ne ip share kiya hai?" Public pages carry OUTCOMES and
buyer-facing numbers only. Never on a page: a commit sha, file / emit-site /
model / identity-field / evaluation counts, internal module or service names,
or any sentence about how the code is structured. Public set: 15 verbs, 287
actions, the Brain's own 12 application surfaces, 71
confirm-gated, 40 per organization and 5 per person per hour, the RockProsUSA
receipts, $30K to $100K, the 2-week Sprint, 34 / 9 / 374. The full measurement
and the long form live in `data/brain-facts.md` and `data/brain-reading-pack.md`
(section 13 is the redaction checklist). Pages run 250 to 400 words. Visuals
must be the real product (local stack, seeded org), never a mockup.

## The brain lane (2026-09-12)
- /brain, /brain/capabilities, /brain/compare/*, /brain/roadmap,
  /brain/changelog and /book-a-demo sell THE BRAIN: WE_AINA installs WorkElate
  Chief on top of the systems a 200 to 2,000 person, $50M to $1B company
  already runs. No rip-and-replace. The argument is DEPTH of work, never the
  number of apps (founder, 2026-09-12).
- Every number on those pages is MEASURED from workelate-backend at
  origin/main commit 518e750e, written up in data/brain-facts.md with the
  grep that produced it. That file also carries a DO NOT PUBLISH list
  (tenancy is NOT enforced by default, endpoint and line totals are not a
  quality claim, appHomes covers 7 of 11 apps). Read it before writing a
  number, and never publish from the marketing deck instead: the "167 actions"
  claim on the Chief product page is not what the code says (15 verbs, 287
  actions, 71 of them confirm-gated).
- The mega menu and the FAQ panels have a NO-JS CONTRACT. Panels ship visible
  and `site/js/nav.js` stamps `js` on <html> to turn them into dropdowns;
  `<details>` ship `open` and JS collapses all but the first. The gate
  assertion "renders with JS disabled" fails on any hidden text over 20
  characters, an SVG `<title>` included.

## Copy rules
- Receipts over adjectives; every claim carries a real number.
- BANNED sitewide (founder call 2026-07-22): audit/logging as a selling
  point. "Every action logged. Every claim auditable.", "audit trail",
  "auditable", "every touch logged", "the log shows". Stripped from 50
  occurrences across site/, scripts/ and data/cases.json. A receipt is a
  NUMBER THAT MOVED, not a log line — say what changed, not that it was
  recorded. The leads/audit DB tables in lib/db.js stay untouched; this
  is a copy ban, not an architecture change.
- One CTA phrase sitewide: "Book a Diagnostic Sprint" (the score widget and
  its phrase were retired 2026-07-23; verify enforces the live phrase).
  "contact us" is banned (verify enforces both).
- NEVER fabricate customer quotes, testimonials, or project numbers.
  Missing number → ask the founder, or ship without the claim.
- Real numbers in stock: RockProsUSA 13 quarries, −38% dispatch cycle,
  2,140 invoices zero touches, 11,200 ops hours returned. CitiSense =
  AI marketing/sales platform for agencies, Mexico (no numbers yet —
  blocked on founder).

## Success = (in order)
1. Verify gate 6/6 green.
2. Lighthouse mobile ≥95, scroll jank 0.
3. A lead submitted through the widget lands in leads.db with a full
   audit trail.
4. Founder-blocked items tracked, not silently dropped: real visuals
   (hero video), founder photos, CitiSense number,
   LinkedIn URLs, Sprint fee band, SMTP + Anthropic creds, real domain
   git init + deploy. (Domain settled 2026-09-07: the site ships as
   aina.workelate.com, a subdomain — WE_AINA owns no domain of its own, so
   WorkElate is the brand and the agency is a division of it.)
