# Deploying WE_AINA to Vercel

The site is a Next.js app whose pages are **statically prerendered at build**.
The generators in `scripts/` write `site/` + `assets/`; the catch-all route
`app/[[...slug]]/route.js` enumerates every file via `generateStaticParams` and
Next emits each as a CDN static artifact. No JavaScript is required to render
page content — the HTML ships complete.

## One-time
1. Push this repo to GitHub (git is already initialized).
2. In Vercel: **New Project → import the repo**. Framework auto-detects as
   Next.js. No build/output overrides needed.
   - Build command: `next build` (default)
   - Node version: 22.x (pinned via `engines` in package.json)
3. Set the real domain and update the placeholder `weaina.com` in the
   generators (canonicals/sitemap/OG), then re-run `node scripts/gensystems.mjs`
   and rebuild. (Founder-blocked: real domain.)

## What already works on Vercel
- 384 pages/assets prerendered to the CDN (perf + TTFB).
- Clean URLs; `/x.html` and `/x/` 308-redirect to `/x` (no duplicate content).
- Real 404 status on unknown paths (`dynamicParams=false`).
- Security headers + immutable caching for `/fonts` and `/assets/frames`.
- `robots.txt`, `sitemap.xml`, `llms.txt`, OG image, JSON-LD all served.

## Founder-blocked before this is production-complete
- **Lead persistence.** `/api/score` runs, but Vercel's filesystem is
  ephemeral/read-only, so `node:sqlite` writes are skipped and the response is
  `{ ok:true, persisted:false }`. To persist, wire a hosted store — **Turso /
  libSQL** is the closest to the current SQL (swap `lib/db.js` to
  `@libsql/client`, set `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`). Vercel
  Postgres also works.
- **Report + email.** `ANTHROPIC_API_KEY` and SMTP creds still stubbed (audit
  records the skip). Set env vars in Vercel to activate.
- Real hero video + scrub source, founder photos, CitiSense number, LinkedIn
  URLs, Sprint fee band — tracked in CLAUDE.md.
