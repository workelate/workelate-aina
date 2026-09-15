# SEO + GEO audit, aina.workelate.com

Measured 2026-09-15 14:30 IST against `site/**/*.html` on disk (88 pages) and the live domain
(`curl https://aina.workelate.com`, served by Vercel behind Cloudflare). Seven agents were editing pages
while this ran, so the per-page numbers are a snapshot of that moment; the mechanisms and the live
findings do not move. The audit script lives in the session scratchpad (`audit.mjs`), it reads only.

Founder's question: **"is the entire sub-domain following the SEO and GEO practices?"**

## Verdict

**Technical SEO: mostly yes. Snippet SEO: no. GEO: not yet, and the fixes are cheap.**

- Structure is clean on all 88 pages: one `<h1>`, no heading skips, `lang="en"`, a viewport meta, one canonical,
  one description, at least one valid JSON-LD block, every `<img>` carries `alt`, zero broken internal links,
  zero pages without inbound links. The live domain sends HSTS, nosniff, X-Frame-Options and Referrer-Policy,
  the legacy routes 308 to their `/studio/*` homes, the sitemap is derived from what is served.
- The snippets are wrong-sized on most pages: **79 of 88 descriptions exceed 160 characters** (max 293) and
  **51 of 88 titles fall outside 30 to 60** (41 too short, 10 too long). Google truncates every one of them.
- GEO fails on the three things an engine needs to cite a product: **no one-sentence definition of what WorkElate
  Chief is** in the first 60 words of `/` or `/brain`; **three different definitions** across FAQ, compare and
  the (stale, agency-only) llms.txt; **85 of 88 pages carry no date and no author**. The product is named "the Brain"
  seven times for every "WorkElate Chief" (299 vs 43 in body text), so an engine asked about "WorkElate Chief"
  finds the name mostly in footers.
- Two live-only defects: `/brain` weighs 2.36 MB because `/img/workgraph-poster.png` is 1.51 MB, and the ten
  named compare pages (`/brain/compare/glean` etc.) 404 live because they are not deployed yet (local sitemap 88
  routes, live 78).

Fixed in this session (my files): `site/llms.txt` rewritten for the product, `site/og.png` regenerated on the
dark brand, `scripts/genseo.mjs` written and tested on copies (not yet run against pages). Everything that
touches page HTML is on the crew-lead list at the bottom, paste-ready.

## 1. SEO measurements, all 88 pages

| check | result | evidence |
|---|---|---|
| unique `<title>` | **pass**, 0 duplicates | `dupTitles: {}` |
| title length 30 to 60 | **fail**, 37 of 88 in range | 41 short (every capability page is "Name, WE_AINA", 17 to 29 chars; `/brain/architecture` is 12), 10 long (4 capability pages 61 to 68, 5 systems pages 62 to 80, listed in §7) |
| unique meta description | **pass**, 0 duplicates, exactly one per page | `dupDesc: {}`, `descCount` = 1 on 88 |
| description length 70 to 160 | **fail**, 9 of 88 in range | 79 over 160, max 293 (`/brain/capabilities/twelfth-app`). None under 70 |
| exactly one canonical, matching the served URL | **87 of 88** | `/studio` declares `https://aina.workelate.com/studio/` (trailing slash); live `/studio/` 308s to `/studio`, so the canonical points at a redirect |
| one `<h1>` | **pass** on 88 | |
| heading hierarchy (no level skipped) | **pass** on 88 | |
| image alt | **pass**: 101 `<img>`, 0 without `alt`, 5 with `alt=""` (decorative: `/brain` 1, `/studio/about` 4) | |
| internal links per page | median 39 distinct out-links, min 18; median 16 inbound, min 1 | the header mega menu and the zone footer link most of the site from every page |
| orphans (no inbound from any other page) | **0** | see §3 for the body-only view |
| broken internal links | **0** | every `href="/…"` resolves to a page under `site/` |
| JSON-LD | **pass**: 0 invalid, 0 duplicate types, every page has at least one block | WebPage 59, FAQPage 9, Service 7, HowTo 5, CollectionPage 4, TechArticle 3, Organization 3, BlogPosting 2, ItemList 2, AboutPage 1, Article 1, Blog 1, BreadcrumbList 1, ContactPage 1, DefinedTermSet 1 |
| BreadcrumbList | 1 of 88 (`/studio/case-studies/rockprosusa`) while 75 pages render a visible `.crumb` | genseo derives it from that crumb, §6 |
| Organization | 3 of 88 (`/`, `/studio`, `/studio/contact`), none with `sameAs` | genseo adds one with `sameAs: workelate.com` to the other 85 |
| word count (main content, chrome excluded) | min 144 (`/studio/blog`), median 483, max 1,556 (`/brain/capabilities` index) | the CLAUDE.md band is 250 to 400 words: 1 page under, 86 over |
| viewport meta | **pass** on 88 | |
| `lang` | **pass**, `en` on 88 | |
| hreflang | **n/a**: single-language site, one locale, no alternates. Nothing to declare | 0 pages declare one, correctly |
| `og:image` | present on 88, all `https://aina.workelate.com/og.png` | `twitter:image` on 0 (genseo adds it) |
| `<meta name="robots">` | 0 of 88 | genseo adds `index,follow` |
| author / date signals | `author` on 3 (2 blog posts + rockprosusa), `datePublished`/`dateModified` on 2 (blog posts), 0 pages show "updated" | §5 |

## 2. Live domain (curl, 2026-09-15)

| probe | result |
|---|---|
| `/robots.txt` | `User-agent: * / Allow: / / Sitemap: https://aina.workelate.com/sitemap.xml`. Identical to `site/robots.txt`. No AI crawler is disallowed |
| AI crawler user agents | GPTBot, OAI-SearchBot, PerplexityBot, ClaudeBot, Google-Extended, Bingbot, Applebot all get **200** on `/brain` (19,886 B). Cloudflare is not blocking them |
| `/sitemap.xml` | live lists **78** routes, local `site/sitemap.xml` lists **88**. The 10 missing are the named compare pages (`/brain/compare/{glean,coveo,dust,google-gemini-workspace,guru,microsoft-365-copilot,moveworks,notion-ai,unifyapps,workato}`): they **404 live**. Not an SEO bug, a deploy gap |
| sample routes | `/` 200, `/brain` 200, `/brain/faq` 200, `/studio/about` 200, `/book-a-demo` 200, `/studio` 200, `/llms.txt` 200 (the OLD agency text), `/og.png` 200 (the OLD light card), `/nonexistent-page` 404 |
| legacy 308s | `/about` → `/studio/about`, `/systems/quarry-dispatch-automation` → `/studio/systems/…`, `/brain/` → `/brain`, `/brain.html` → `/brain`, `/studio/` → `/studio`. All 308, all correct |
| `/index.html` | live 308 → `/index` (an older `next.config.mjs`; local 4310 sends 308 → `/`, so the next deploy fixes it). **`/index` itself returns 200 on both live and local**, a duplicate of `/` (its canonical says `/`, so it is soft-handled, but it should 308) |
| security headers | present: `strict-transport-security: max-age=63072000; includeSubDomains; preload`, `x-content-type-options: nosniff`, `x-frame-options: SAMEORIGIN`, `referrer-policy: strict-origin-when-cross-origin`. **Absent: `Content-Security-Policy`, `Permissions-Policy`.** `server: cloudflare`, `x-vercel-cache: HIT` |
| cache headers | HTML `public, max-age=0, must-revalidate` (served from the Vercel CDN, `age: 228319` = 2.6 days on `/`); `/css/site.css` `max-age=14400, must-revalidate`; `/fonts/*` `max-age=31536000, immutable`; `/og.png` `max-age=14400` |
| Cloudflare email obfuscation | live `/` carries `/cdn-cgi/l/email-protection` and **zero plain `chitransh@workelate.com`** in the HTML: the contact address is not liftable by a crawler that does not run JS. Cloudflare Scrape Shield → Email Address Obfuscation is on |

### Page weight and requests

| page | HTML | requests | total | largest image |
|---|---|---|---|---|
| `/` | 9.4 KB | 8 (html, site.css 103.8 KB, nav.js 11.7 KB, reveal.js 0.6 KB, worksans woff2 50.5 KB, workelate-logo.svg 27.8 KB, favicon.svg 0.8 KB, Cloudflare email-decode 1.2 KB) | **~206 KB** | `workelate-logo.svg` 27.8 KB (no raster image on the page) |
| `/brain` | 19.9 KB | 12 (the 8 above + workgraph.js 40.2 KB + 3 PNGs) | **~2.36 MB** | `/img/workgraph-poster.png` **1,505,892 B**, then `/img/real/tasks-board-rockcross-ops-portal.png` 416 KB, `/img/real/briefing-needs-you.png` 178 KB |

`site.css` at 103.8 KB is the same file on every page and revalidates every 4 hours; fine. The 1.5 MB poster is the
one thing on the product page a mobile Lighthouse will fail on.

## 3. Orphans

Counting every `<a href>` on every page: **no page is an orphan** (minimum inbound = 1, from the mega menu or footer).

Counting only links **outside the generated nav and footer** (the links an engine weights as editorial), five pages
have zero body inbound links and nineteen have exactly one:

| body inbound = 0 | why it matters |
|---|---|
| `/brain/for/cio`, `/brain/for/coo`, `/brain/for/revenue` | the three persona pages are reachable only from the mega menu. No product page says "if you are the CIO, read this" |
| `/studio/blog` | the blog index is footer-only, and at 144 words it is the thinnest page on the site |
| `/` | the home page is linked only from the logo in the chrome, which is normal |

Body inbound = 1: all 13 `/brain/compare/*` pages (from the compare index only), `/brain/faq`, `/brain/glossary`,
`/brain/objections`, both blog posts, `/studio/work`.

## 4. Scorecard

Bold = outside the band (title 30 to 60, description 70 to 160, inbound-body 0, words under 250).
Inbound is "body links / all links including nav and footer".

| page | title len | desc len | h1 | JSON-LD | inbound (body / all) | words |
|---|---|---|---|---|---|---|
| / | **27** | **240** | 1 | Organization | **0** / 87 | 417 |
| /book-a-demo | 33 | **193** | 1 | WebPage, FAQPage | 52 / 87 | 661 |
| /brain | 35 | **244** | 1 | WebPage | 71 / 87 | 806 |
| /brain/architecture | **12** | **229** | 1 | TechArticle | 4 / 69 | 713 |
| /brain/capabilities | 44 | **226** | 1 | WebPage | 38 / 87 | 1556 |
| /brain/capabilities/ask-dont-guess | 52 | **166** | 1 | WebPage | 4 / 4 | 436 |
| /brain/capabilities/calendar-awareness | **27** | **224** | 1 | WebPage | 2 / 2 | 457 |
| /brain/capabilities/change-detection | **25** | **194** | 1 | WebPage | 4 / 4 | 461 |
| /brain/capabilities/claim-check | **20** | **226** | 1 | WebPage | 6 / 6 | 467 |
| /brain/capabilities/confirm-gate | **25** | **197** | 1 | WebPage | 6 / 6 | 488 |
| /brain/capabilities/context-assembly | **61** | **231** | 1 | WebPage | 4 / 4 | 447 |
| /brain/capabilities/decision-history | **25** | **238** | 1 | WebPage | 4 / 4 | 444 |
| /brain/capabilities/document-grounding | **27** | **249** | 1 | WebPage | 3 / 3 | 447 |
| /brain/capabilities/drafting | **17** | **237** | 1 | WebPage | 4 / 4 | 484 |
| /brain/capabilities/entity-resolution | **26** | **229** | 1 | WebPage | 3 / 3 | 458 |
| /brain/capabilities/evaluation-suite | **29** | **253** | 1 | WebPage | 4 / 4 | 489 |
| /brain/capabilities/fifteen-verbs | **26** | **173** | 1 | WebPage | 4 / 4 | 506 |
| /brain/capabilities/filing-artifacts | **25** | **225** | 1 | WebPage | 2 / 2 | 461 |
| /brain/capabilities/folder-scope | **21** | **275** | 1 | WebPage | 5 / 5 | 464 |
| /brain/capabilities/honest-refusal | **23** | **213** | 1 | WebPage | 6 / 6 | 466 |
| /brain/capabilities/identity-and-scope | **27** | **214** | 1 | WebPage | 3 / 3 | 494 |
| /brain/capabilities/interruption-budget | **28** | **275** | 1 | WebPage | 5 / 5 | 454 |
| /brain/capabilities/judgment-pipeline | **63** | **235** | 1 | WebPage | 6 / 6 | 458 |
| /brain/capabilities/move-and-assign | **24** | **219** | 1 | WebPage | 3 / 3 | 475 |
| /brain/capabilities/multi-step-sequences | **29** | **206** | 1 | WebPage | 5 / 5 | 448 |
| /brain/capabilities/one-continuous-thread | 30 | **256** | 1 | WebPage | 3 / 3 | 481 |
| /brain/capabilities/organization-memory | **28** | **164** | 1 | WebPage | 4 / 4 | 448 |
| /brain/capabilities/ownership-tracking | **27** | **222** | 1 | WebPage | 5 / 5 | 457 |
| /brain/capabilities/plain-language-preferences | **68** | **211** | 1 | WebPage | 4 / 4 | 425 |
| /brain/capabilities/ranked-briefing | 47 | **256** | 1 | WebPage | 3 / 3 | 464 |
| /brain/capabilities/read-after-write | **25** | **238** | 1 | WebPage | 6 / 6 | 474 |
| /brain/capabilities/record-updates | **23** | **209** | 1 | WebPage | 4 / 4 | 455 |
| /brain/capabilities/role-aware-scoring | **61** | **254** | 1 | WebPage | 3 / 3 | 475 |
| /brain/capabilities/signal-capture | **23** | **244** | 1 | WebPage | 3 / 3 | 457 |
| /brain/capabilities/signals-to-suite | 37 | **254** | 1 | WebPage | 4 / 4 | 509 |
| /brain/capabilities/silence-detection | **26** | **251** | 1 | WebPage | 5 / 5 | 450 |
| /brain/capabilities/stakes-routing | **68** | **217** | 1 | WebPage | 4 / 4 | 447 |
| /brain/capabilities/twelfth-app | 32 | **293** | 1 | WebPage | 3 / 3 | 486 |
| /brain/capabilities/work-graph | **23** | **275** | 1 | WebPage | 5 / 5 | 471 |
| /brain/changelog | 32 | **170** | 1 | WebPage | 2 / 69 | 456 |
| /brain/compare | **26** | **223** | 1 | CollectionPage | 16 / 87 | 658 |
| /brain/compare/build-your-own | 39 | **217** | 1 | WebPage | 1 / 69 | 411 |
| /brain/compare/coveo | **27** | **192** | 1 | WebPage | 1 / 1 | 551 |
| /brain/compare/dust | **26** | **188** | 1 | WebPage | 1 / 1 | 589 |
| /brain/compare/enterprise-search | 39 | **197** | 1 | WebPage | 1 / 69 | 429 |
| /brain/compare/glean | **27** | **193** | 1 | WebPage | 1 / 69 | 590 |
| /brain/compare/google-gemini-workspace | 49 | **177** | 1 | WebPage | 1 / 69 | 636 |
| /brain/compare/guru | **26** | **176** | 1 | WebPage | 1 / 1 | 556 |
| /brain/compare/ipaas-and-rpa | 35 | **187** | 1 | WebPage | 2 / 69 | 420 |
| /brain/compare/microsoft-365-copilot | 43 | **184** | 1 | WebPage | 1 / 69 | 623 |
| /brain/compare/moveworks | 31 | **198** | 1 | WebPage | 1 / 69 | 565 |
| /brain/compare/notion-ai | 31 | **186** | 1 | WebPage | 1 / 69 | 604 |
| /brain/compare/per-app-copilots | 38 | **204** | 1 | WebPage | 1 / 69 | 424 |
| /brain/compare/unifyapps | 31 | **185** | 1 | WebPage | 1 / 1 | 583 |
| /brain/compare/workato | **29** | **199** | 1 | WebPage | 1 / 69 | 555 |
| /brain/faq | 34 | **192** | 1 | FAQPage | 1 / 87 | 694 |
| /brain/for/cio | 30 | **218** | 1 | WebPage | **0** / 69 | 450 |
| /brain/for/coo | **21** | **203** | 1 | WebPage | **0** / 69 | 385 |
| /brain/for/revenue | 30 | **210** | 1 | WebPage | **0** / 69 | 402 |
| /brain/getting-started | 35 | **218** | 1 | HowTo | 2 / 69 | 624 |
| /brain/glossary | **28** | 149 | 1 | DefinedTermSet | 1 / 69 | 636 |
| /brain/objections | 30 | 152 | 1 | FAQPage | 1 / 70 | 711 |
| /brain/pricing | **27** | **223** | 1 | WebPage | 2 / 87 | 591 |
| /brain/proof | **25** | **232** | 1 | TechArticle | 4 / 87 | 539 |
| /brain/roadmap | 43 | 124 | 1 | WebPage | 3 / 69 | 595 |
| /brain/security | 35 | **207** | 1 | TechArticle | 4 / 87 | 678 |
| /brain/use-cases | 52 | **198** | 1 | WebPage | 10 / 87 | 333 |
| /brain/use-cases/board-reporting | 42 | **201** | 1 | HowTo | 7 / 7 | 380 |
| /brain/use-cases/client-delivery | 36 | **191** | 1 | HowTo | 16 / 69 | 456 |
| /brain/use-cases/mail-triage | 36 | **191** | 1 | HowTo | 10 / 69 | 381 |
| /brain/use-cases/order-to-cash | 41 | **195** | 1 | HowTo | 10 / 69 | 413 |
| /studio | 44 | **200** | 1 | Organization, Service | 7 / 87 | 625 |
| /studio/about | 42 | **198** | 1 | AboutPage | 2 / 87 | 757 |
| /studio/blog | 48 | **163** | 1 | Blog | **0** / 87 | **144** |
| /studio/blog/receipts-over-decks | 46 | 160 | 1 | BlogPosting | 1 / 16 | 469 |
| /studio/blog/the-pyramid-cant-survive-agents | 52 | **182** | 1 | BlogPosting | 1 / 16 | 651 |
| /studio/case-studies | **21** | **188** | 1 | CollectionPage, ItemList | 3 / 87 | 635 |
| /studio/case-studies/rockprosusa | 56 | **207** | 1 | Article, BreadcrumbList | 9 / 22 | 790 |
| /studio/contact | **16** | **181** | 1 | ContactPage, Organization | 87 / 87 | 483 |
| /studio/how-we-work | **20** | **185** | 1 | WebPage | 4 / 87 | 733 |
| /studio/systems | **25** | 157 | 1 | CollectionPage, ItemList | 7 / 16 | 350 |
| /studio/systems/ar-followup-automation | **72** | 127 | 1 | FAQPage, Service | 5 / 16 | 642 |
| /studio/systems/compliance-documentation | **78** | **161** | 1 | FAQPage, Service | 4 / 4 | 661 |
| /studio/systems/dealer-order-management | **62** | 146 | 1 | FAQPage, Service | 4 / 4 | 622 |
| /studio/systems/freight-reconciliation | **64** | 154 | 1 | FAQPage, Service | 6 / 16 | 634 |
| /studio/systems/plant-production-reporting | 55 | 157 | 1 | FAQPage, Service | 5 / 5 | 660 |
| /studio/systems/quarry-dispatch-automation | **80** | **161** | 1 | FAQPage, Service | 5 / 16 | 656 |
| /studio/work | **26** | **190** | 1 | CollectionPage | 1 / 87 | 1032 |

## 5. GEO checklist

GEO = being cited by ChatGPT, Perplexity, Gemini, Copilot and Google AI Mode. Engines lift a sentence that defines the
entity, prefer pages with a date and an author, and cite the page that answers the question in its first paragraph.

| # | check | verdict | evidence |
|---|---|---|---|
| 1 | `llms.txt` present and current | **fail → fixed** | live and on-disk file described "AI-native product studio for $5–50M businesses", never named WorkElate Chief, and linked eight routes (`/how-we-work`, `/about`, `/systems/*`, `/blog/*`) that now 308. Rewritten: product first, the one definition, the public number set only, every link checked against `site/` (0 missing) |
| 2 | entity clarity on `/` and `/brain`: one plain sentence saying what WorkElate Chief IS, who makes it, for whom | **fail** | first 60 words of `/`: "Where ROI meets passion One memory for the work your systems already hold. The Brain watches your CRM…" First 60 of `/brain`: "Your systems already know. Nothing remembers. The Brain reads what…". Neither contains "WorkElate Chief is …". Only 4 of 88 pages have a "{name} is …" sentence in their first 60 words (`/book-a-demo`, `/brain/capabilities/read-after-write`, `/studio/about`, `/studio/contact`). Paste-ready sentence in §7 |
| 3 | FAQPage schema coverage | **pass** | 9 pages: `/brain/faq` (12 Q), `/brain/objections`, `/book-a-demo`, six `/studio/systems/*`. All parse |
| 4 | HowTo schema coverage | **pass** | 5 pages: `/brain/getting-started` and the four `/brain/use-cases/*` |
| 5 | "what is X" definition near the top of each key page | **partial** | `/brain/faq` Q1 is literally "What is the Brain, exactly?"; `/brain` has a "What is installed" section below the fold; `/brain/compare` has "The Brain is WorkElate Chief, installed by WE_AINA on what you already run." in the intro. `/`, `/brain/capabilities`, `/brain/pricing`, the persona pages: none |
| 6 | named comparison pages exist | **pass on disk, fail live** | 10 by name + 4 by category under `/brain/compare/`, each with 1 to 3 external source links to the competitor's own pricing/product page (28 external links total). The 10 named ones are 404 on the live domain until the next deploy |
| 7 | About page names the people | **pass, with a gap** | `/studio/about`: `AboutPage` → `Organization` → two `Person` with `alumniOf` and `jobTitle`. First names only ("Chitransh", "Pratik"); an engine cannot resolve a first name to a person. Founder decision: publish surnames, or leave as is |
| 8 | consistent product name | **fail** | body-text counts across 88 pages: "The Brain" 179 + "the Brain" 120 = **299**, "WorkElate Chief" **43**, "Chief" alone 7, "the brain" (lowercase) 8 (`site/index.html` 4, `site/brain/glossary.html` 4 in file counts; also one each in 8 studio pages). Ratio 7:1 in favour of the nickname. The footer sentence "WorkElate Chief is installed by WE_AINA" appears on 70 pages, which is why the trademark name is mostly chrome |
| 9 | pages that answer a question in the first 60 words | **partial**: 46 of 88 | heuristic: a `?` or an "is/are/means" clause inside the first 60 words of main content |
| 10 | claims carry a source note | **partial**: 22 of 88 | "measured", "source", "as of" appear on the 14 compare pages, `/brain/proof`, `/brain/security`, `/studio/case-studies*`, `/studio/how-we-work`, `/studio`, `/brain/capabilities/{change-detection,honest-refusal}`, 1 blog post, 1 system page. The numbers pages (`/brain`, `/brain/capabilities/*`, `/brain/pricing`) state 15 / 287 / 71 / 40 / 5 with no "measured on" line |
| 11 | publication date, author, last-updated | **fail**: 85 of 88 have none | `datePublished` + `author` only on the two blog posts; `author` on rockprosusa. No page shows a visible "Updated …". `/brain/changelog` has dated entries in prose but no `dateModified` in its schema. Engines rank undated pages as unverifiable. genseo adds `<meta name="author">` on every page and `article:modified_time` with `--modified=YYYY-MM-DD`; a visible line is still the crew lead's (§7) |
| 12 | llms.txt, compare pages and the FAQ carry the same definition | **fail → half fixed** | three wordings before this session: FAQ: "WorkElate Chief, our own product, installed on top of the systems you already run. It holds one memory of the work crossing those systems, judges what is worth a person's attention, and carries work forward with a person's yes…"; compare: "The Brain is WorkElate Chief, installed by WE_AINA on what you already run."; llms.txt: no product definition at all. Now llms.txt and the genseo Organization `description` carry one sentence, word for word. FAQ Q1 and the compare intro need the paste (§7) |
| 13 | robots and crawler access for AI engines | **pass** | no `Disallow`, all seven AI user agents get 200 live, `llms.txt` served as `text/plain` |
| 14 | contact liftable in plain text | **fail (Cloudflare)** | the mail address is obfuscated on the live HTML (§2). Either switch off Scrape Shield → Email Address Obfuscation for this zone, or accept that engines quote the site without a contact |
| 15 | Organization schema with `sameAs` | **fail → genseo** | none of the three existing Organization blocks has `sameAs`; the site links `workelate.com` nowhere as an `<a>` (only in the mail address and the footer text "WorkElate"). genseo emits `sameAs: ["https://www.workelate.com/"]` and `parentOrganization.url`. No social URL is invented: none is stated anywhere on the site |

## 6. What genseo does (written, tested on copies, NOT run against pages)

`scripts/genseo.mjs` rebuilds one block per page between `<!-- SEO:start (generated by scripts/genseo.mjs) -->` and
`<!-- SEO:end -->`, inserted before `</head>`. Tested on copies of `/brain/faq`, `/`, `/brain/compare/glean` and
`/studio/case-studies/rockprosusa` in the scratchpad: second run byte-identical, every JSON-LD block parses, canonical
count stays 1, `og:image` count stays 1. A `--dry` pass over all 88 pages reported 88 writes, 0 failures.

Per page it emits, skipping anything the page already declares outside the block:

- `<meta name="robots" content="index,follow">`
- `<meta property="og:image">` (skipped on all 88: present) and `<meta name="twitter:image">` (added on 88), both `/og.png`
- `<meta name="author" content="WE_AINA, WorkElate Excellence Studio">` (skipped where a page has one: the blog posts)
- `<meta property="article:modified_time" content="YYYY-MM-DD">` only when run with `--modified=YYYY-MM-DD`
- `BreadcrumbList` JSON-LD from the page's own `.crumb` (`<p class="crumb">` on 68 pages, `<nav class="crumb">` on 7),
  falling back to the route's ancestors that exist as pages, named from their titles. Skipped on rockprosusa (has one),
  on `/`, `/brain`, `/studio`, `/book-a-demo` (a one-item trail says nothing). Sample: `/brain/compare/glean` →
  The Brain › Compare › The Brain vs Glean; `/studio/systems/freight-reconciliation` → WE_AINA › systems › Freight bills that match themselves
- `Organization` JSON-LD, one declaration in the script, with `sameAs: ["https://www.workelate.com/"]`,
  `parentOrganization.url`, `logo`, `email`, both founders. Skipped on `/`, `/studio`, `/studio/contact` (they carry one)

Never written: a canonical, a title, a description. Run order: after genchrome and every page generator, before gensitemap.

    node scripts/genseo.mjs --dry                    # see what it would do
    node scripts/genseo.mjs --modified=2026-09-15    # write, stamping the date the batch landed

Note on "systems" in the studio crumb: the seven systems pages' own `<nav class="crumb">` links `/studio/systems` as
"systems", lowercase; genseo repeats the page's declaration. Capitalise it in the page and the schema follows.

## 7. Punch list

### Fixed by me (this session)

| file | change | gate status |
|---|---|---|
| `site/llms.txt` | rewritten: product first (WorkElate Chief, the Brain), the one definition sentence, maker, buyer, the public number set only (15 / 287 / 12 / 190 / 71 / 40 / 5 / $30K to $100K / 2-week Sprint / RockProsUSA receipts / 34 / 9 / 374), every route on the site grouped by zone, legacy-redirect note. 0 dead links (checked against `site/`) | BUILT. Live once deployed |
| `site/og.png` via `scripts/genog.mjs` | regenerated on the v7 dark brand: `#07070c` ground, Work Sans from `site/fonts/worksans-var-latin.woff2`, cyan→purple gradient on "One memory", eyebrow "WorkElate Chief · the Brain", one line of the positioning, the WorkElate logo, `aina.workelate.com`. No numbers. 1200×630, 218 KB (was 50 KB, light, "10× faster / $30K–$100K / 2,140 invoices") | BUILT + RENDERED (looked at). Live once deployed |
| `scripts/genseo.mjs` | new, §6. Not run against `site/` | BUILT, tested on copies |
| `site/robots.txt`, `scripts/gensitemap.mjs` | reviewed, **unchanged**. Both correct: derived from `site/`, no AI crawler blocked, sitemap URL absolute. Two optional improvements, not made: `<lastmod>` per URL (only worth it with a real date source; file mtime lies in a repo that regenerates pages), and a `# llms: https://aina.workelate.com/llms.txt` comment line (non-standard, ignored by every crawler) | reviewed |

### For the crew lead (page HTML, next.config, Cloudflare; exact file and paste-ready copy)

1. **The one definition sentence, on `/` and `/brain`, inside the first 60 words** (GEO #2, #12). Paste as the first
   `<p>` after the `<h1>` (or as the hero lede), verbatim, it is the sentence llms.txt and the Organization schema already carry:

   > WorkElate Chief, the Brain, is one memory across the systems a 200 to 2,000 person company already runs, made by WorkElate and installed by WE_AINA, WorkElate's own studio: it reads what your CRM, mail, tickets and documents already record, judges what needs a person, and asks before it changes anything.

   - `site/index.html`: replace the lede "The Brain watches your CRM, mail, tickets and documents, tells you what needs a person, and asks before it changes anything. The studio installs it in two weeks and prices the build before it starts." with the sentence above plus "The studio installs it in two weeks and prices the build before it starts."
   - `site/brain/index.html`: replace the hero lede "The Brain reads what your CRM, mail, tickets and documents already record, holds it as one memory, and asks before it writes anything." with the sentence above.
   - `site/brain/faq.html`: Q1 answer ("WorkElate Chief, our own product, installed on top of the systems you already run…") → the sentence above, in both the visible `<details>` and the `FAQPage` JSON `acceptedAnswer.text`.
   - `site/brain/compare/index.html` line ~166: "The Brain is WorkElate Chief, installed by WE_AINA on what you already run." → the sentence above.

2. **Run genseo last**, after every page edit lands: `node scripts/genseo.mjs --modified=2026-09-15`, then
   `node scripts/gensitemap.mjs`, then `npm run verify`. If verify's "renders with JS disabled" or footer-parity
   assertions object to the new head block, they should not (the block is head-only, no visible text); report if they do.

3. **A visible date line on every page** (GEO #11). genseo stamps `article:modified_time` in the head; engines also
   read the visible page. Suggested, one line under the `.crumb` or at the foot of `<main>`, in `site/css` if a class is needed:
   `<p class="dim updated">Updated 15 September 2026 · WE_AINA</p>`. Cheapest true source of the date: the day the batch
   is deployed. Do not fake per-page dates.

4. **Descriptions over 160 characters, 79 pages** (§1). Rule that fits the existing copy: the description is the
   page's first lede sentence, cut at the first full stop, max 155 characters. The nine already in band are
   `/brain/capabilities/organization-memory` (164 is borderline), `/studio/blog`, `/studio/systems/compliance-documentation`,
   `/studio/systems/quarry-dispatch-automation` and the shortest capability pages. Worst ten: `twelfth-app` 293,
   `folder-scope` 275, `interruption-budget` 275, `work-graph` 275, `one-continuous-thread` 256, `ranked-briefing` 256,
   `role-aware-scoring` 254, `signals-to-suite` 254, `evaluation-suite` 253, `silence-detection` 251.

5. **Titles outside 30 to 60, 51 pages** (§1). No duplicates to rename. Two patterns fix all of them:
   - 41 too short, all "{Capability}, WE_AINA" (17 to 29 chars) plus `/brain/architecture` ("Architecture", 12),
     `/brain/for/coo` (21), `/studio/contact` (16), `/studio/how-we-work` (20), `/studio/case-studies` (21), `/` (27).
     Pattern: `{Capability}, the Brain by WorkElate Chief` (e.g. "Claim check, the Brain by WorkElate Chief" = 41). This
     also fixes GEO #8 by putting the product name in 37 titles that currently carry only the nickname.
     For `/`: "WorkElate Excellence Studio: the Brain and the studio that installs it" (69, trim to taste) or
     "WorkElate Chief, the Brain, and WE_AINA" (39).
   - 10 too long: `/brain/capabilities/{context-assembly 61, judgment-pipeline 63, plain-language-preferences 68,
     role-aware-scoring 61, stakes-routing 68}` (drop the explanatory clause after the comma) and
     `/studio/systems/{ar-followup-automation 72, compliance-documentation 78, dealer-order-management 62,
     freight-reconciliation 64, quarry-dispatch-automation 80}` (the H1 sentence is the title; use the system name:
     "AR follow-up automation, WE_AINA" etc.).

6. **Product-name consistency** (GEO #8). First mention on every page as "WorkElate Chief, the Brain", then "the Brain".
   Eight lowercase "the brain" to capitalise: `site/index.html` (4), `site/brain/glossary.html` (4 in file), and one
   each in `site/studio/{index,work,how-we-work}.html` and `site/studio/systems/{index,ar-followup-automation,
   compliance-documentation,dealer-order-management,freight-reconciliation,plant-production-reporting,quarry-dispatch-automation}.html`
   (grep: `grep -rn 'the brain\b' site --include='*.html'`).

7. **`/studio` canonical**: `site/studio/index.html` has `<link rel="canonical" href="https://aina.workelate.com/studio/">`;
   change to `https://aina.workelate.com/studio` (the served URL; the slash form 308s).

8. **`next.config.mjs`**: add `{ source: "/index", destination: "/", permanent: true }` before the `.html` rule, so the
   `/index` duplicate (200 live and local) goes away. Optional: `Permissions-Policy` and a `Content-Security-Policy`
   header in `headers()`; the site has no third-party script except Cloudflare's email-decode, so a CSP is feasible.

9. **`/brain` weight**: `/img/workgraph-poster.png` is 1.51 MB, 64% of the page. Re-export as WebP at the rendered
   width (or add `loading="lazy"` and a `width`/`height`), target under 200 KB. `/img/real/tasks-board-rockcross-ops-portal.png`
   416 KB is the second.

10. **Persona pages and the blog index are body-orphans** (§3). One editorial link each: from `/brain` ("Reading this as
    the CIO, the COO or the revenue lead? …" linking `/brain/for/*`) and from `/studio` to `/studio/blog`.
    Add 100 words to `/studio/blog` (144 now) or fold it into `/studio`.

11. **Deploy**: the ten named compare pages, the new llms.txt and og.png are all on disk only. Live is behind by 10 routes.

12. **Cloudflare** (GEO #14): Scrape Shield → Email Address Obfuscation is rewriting `chitransh@workelate.com` on the
    live HTML. Founder call: off (address liftable by engines, more spam) or on (as now).

13. **Founder call**: surnames on `/studio/about` (GEO #7). "Chitransh" and "Pratik" cannot be resolved to people by an engine.

### Not done, by design

- genseo was not run against `site/` (seven agents editing; the crew lead runs it last).
- No `npm run build`, no server started, no page HTML, `site/css`, `site/js` or `scripts/genchrome.mjs` touched.
- No Lighthouse run (needs a browser session against 4310; the weight numbers above are from `curl`).
- Live-path proof of the new llms.txt and og.png waits on the deploy: live still serves the old ones.
