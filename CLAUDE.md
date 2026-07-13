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
   v4/v5: white/blue corporate, Infosys-pattern layout, green only as
   a positive-delta pinch). If a request conflicts, push back with
   the compliant alternative.
4. Section order: hero → ticker → shift → work → services → casestudy
   → process → founders → cta → footer.
5. After touching the casestudy scrub or any JS: run Lighthouse mobile;
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
- `npm run frames` — regenerate the 160 procedural scrub frames.
- `node scripts/gensystems.mjs` — regenerate /systems pages + sitemap.
- `node scripts/genartifacts.mjs` — regenerate product mockup PNGs.
- `node scripts/genog.mjs` — regenerate the OG image.

## Generated files — never hand-edit
site/systems/*.html, site/sitemap.xml, site/robots.txt, site/og.png,
site/img/*.png, assets/frames/casestudy/* are ALL generator output.
Edit the generator in scripts/, then re-run it. A hand edit dies on
the next regeneration.

## Architecture facts (non-obvious)
- Next.js (founder call 2026-07-13) is the delivery layer only: pages
  stay statically generated HTML in site/, served byte-identical by
  the catch-all app/[[...slug]]/route.js (site/ + assets/). Content
  still comes from generators — do NOT convert pages to JSX without a
  founder call. server.mjs kept as dev:legacy reference.
- POST /api/score lives in app/api/score/route.js. DB = leads.db via
  node:sqlite in lib/db.js (leads + audit tables — every step audited,
  keep it that way). Report generation runs via next/server after().
- /api/score has a spam guard: 5/hr/IP rate limit, payload validation,
  honeypot field `website` (returns fake 200). Next dev hot-reloads
  route handlers; no manual restart needed.
- Scrub engine (site/js/scrollFrames.js) keeps only a ±24 frame
  ImageBitmap window (~full deck would hold ~1.3 GB). Don't "simplify"
  the window away. Frames are placeholder SVGs until the real video
  exists; then ffmpeg-extract to webp, same path/count, engine
  untouched.
- Anthropic report + email send are STUBBED until ANTHROPIC_API_KEY /
  SMTP creds exist; the audit table records the skip. The site promises
  "report in 10 minutes" — do not deploy before wiring this.

## Copy rules
- Receipts over adjectives; every claim carries a real number.
- One CTA phrase sitewide: "Get your AI Readiness Score".
  "contact us" is banned (verify enforces both).
- NEVER fabricate customer quotes, testimonials, or project numbers.
  Missing number → ask the founder, or ship without the claim.
- Real numbers in stock: RockProsUSA 13 quarries, −38% dispatch cycle,
  2,140 invoices zero touches, 11,200 ops hours returned. CitiSense =
  AI marketing/sales platform for agencies, Mexico (no numbers yet —
  blocked on founder).

## Success = (in order)
1. Verify gate 6/6 green.
2. Lighthouse mobile ≥95, scrub jank 0.
3. A lead submitted through the widget lands in leads.db with a full
   audit trail.
4. Founder-blocked items tracked, not silently dropped: real visuals
   (hero video + scrub source), founder photos, CitiSense number,
   LinkedIn URLs, Sprint fee band, SMTP + Anthropic creds, real domain
   (weaina.com in canonicals is a placeholder), git init + deploy.
