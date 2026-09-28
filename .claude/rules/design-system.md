# WE_AINA design system — v8 (founder call 2026-09-28: align with the new workelate.com)

## v8 SUPERSEDES v7 and everything below it. Read this section first.

Founder, 2026-09-28: *"align the aina website and its graphics as per the
workelate-website"*. The product site moved to a light, apple.com-grade system
(workelate-website, branch messaging/sharp: `src/components/apple/home.css`,
`src/components/apple/chrome.css`). The agency ships as aina.workelate.com, a
subdomain of the product, so the product's system is the brand and this site
follows it. The bar is Apple-grade: flat, decorated, "intern grade" visuals are
rejected. Render and LOOK at every page you change (desktop 1440 + phone 390).

### Tokens (taken from the product's code, not guessed)

| token | value | use |
|---|---|---|
| white | `#ffffff` | page ground |
| light | `#f5f5f7` | alternate section band, card fill on white, footer |
| ink | `#1d1d1f` | headings and body |
| ink-2 | `#424245` | body copy inside cards |
| grey | `#6e6e73` | secondary copy, captions, footer links (5.07:1 on white) |
| line / hair | `#d2d2d7` / `#e8e8ed` | control boundary / hairlines |
| teal | `#0f8083` | THE accent: primary pill, links, one highlighted word |
| teal-2 | `#0b6366` | teal hover, teal text on teal-soft |
| teal-soft | `#e6f3f3` | selected / current wash |
| navy | `#0a1a5c` | only inside product UI (the user's chat bubble) |
| ui | `#111827` | ink of product UI mockups, dark action pill |
| ok / amber / red | `#1a8f4c` / `#b45309` / `#c0392b` | state only, never decoration |

- **Font: the system SF stack**, `-apple-system, BlinkMacSystemFont, "SF Pro Display",
  "SF Pro Text", "Inter", "Helvetica Neue", Arial, sans-serif`. No webfont (no FOUT,
  no layout shift, no request). Work Sans is retired with v7.
- **Type:** h1 clamp(40px, 6vw, 80px) / 600 / -0.035em / 1.04; h2 clamp(32px, 4.6vw,
  56px) / 600 / -0.03em; eyebrow 21px/600 ink, plain text (no pill); sub-line
  21 to 28px regular; body 19px/1.5; captions 14px grey.
- **Buttons:** primary = teal pill (radius 980px, 44px tall, 17px), secondary =
  1px teal outline pill. Nothing else is a button.
- **Cards:** `#f5f5f7` on white and `#fff` on a `#f5f5f7` band, radius 28px
  (20px small), no border. Product windows are white with the layered shadow
  `0 0 0 1px rgba(0,0,0,.05), 0 2px 6px rgba(0,0,0,.04), 0 50px 100px -40px
  rgba(0,0,0,.32)`. That window shadow is the only shadow on the site.
- **Header:** sticky, 48px, `rgba(251,251,253,.96)` with a `rgba(0,0,0,.06)` hairline,
  13px links, a small teal pill CTA. No backdrop-filter (the 2026-07-13 rule stands).
- **Footer:** the `#f5f5f7` band, 12 to 13px grey links, ink column heads.
- **Rhythm:** sections separate by ground change (white / `#f5f5f7`) and air, never by
  rules or glows. The one dark moment allowed is a black chapter (`#000`) for trust.
- **Graphics:** light cards, teal accent, the suite's own app icons
  (`site/img/apps/*.webp`, copied from workelate-website `public/app-icons/suite`).
  Real product captures in `site/img/real/` are never recoloured.

### Banned in v8
Dark grounds (`#07070c`, `#0c0c14`), cyan `#00d4ff`, purple `#8b5cf6`, every
gradient on a background or on text, glass (`rgba(255,255,255,.0x)` surfaces),
glows and coloured box-shadows, aurora blobs and dot grids, the pill-shaped eyebrow.
Exception (founder call 2026-09-29, "background effect little bit"): the animated /studio hero stage alone may carry soft light behind it, built only from solid discs with `filter: blur()` drifting by transform (site/css/hero.css `.hx-bg`); still no gradient, no backdrop-filter, paused off-screen, still under reduced motion.

### The gate
`scripts/verify.mjs` asserts **"on the brand system (ground + family)"** on every
page: the body must paint `rgb(255, 255, 255)` and render in the system SF stack.
It also asserts **"no gradient or glass surface"**: no element may compute a
`background-image` gradient or a `backdrop-filter`, so a half-migrated block fails.

Unchanged and still binding: fonts self-hosted or system only; no backdrop-filter on
the sticky header; em dashes banned in copy; receipts over adjectives; the single CTA
phrase "Book a Diagnostic Sprint"; "contact us" banned; never fabricate a customer
quote, a number or a testimonial; no individual names on the site, the team is the face
(founder call 2026-09-28, see §9); WCAG AA contrast
on every text tier (grey `#6e6e73` is the floor, never lighter for text).

---

# (retired) v7 — dark ground, Work Sans, cyan/purple gradients and glass (founder call 2026-09-12: match workelate.com)

## v7 SUPERSEDES the white system below. Read this section first.

Founder, 2026-09-12: *"color, font css and more is not giving fun make the entire
website looks consistent as per workelate.com"*.

The agency ships as aina.workelate.com, a subdomain of the product. So the product's
system is the brand, and this site adopts it rather than running a second one:

- **Ground is DARK.** `#07070c` page, `#0c0c14` raised. The white/off-white v6 ground
  is retired.
- **Type is Work Sans**, self-hosted (no runtime request to Google Fonts, that part of
  the old law stands). Instrument Serif / Familjen Grotesk / Inter / JetBrains Mono are
  retired as the display and data faces.
- **Accents are the product's**: cyan `#00d4ff`, purple `#8b5cf6`, blue `#2563eb`,
  with emerald `#34d399`, amber `#fbbf24` and red `#f87171` as state colours.
- **Gradients and glass are the language, not a violation.** `linear-gradient(90deg,
  #00d4ff, #8b5cf6)` and `linear-gradient(135deg, #2563eb, #8b5cf6)` are brand
  assets. Glass surfaces are `hsla(0,0%,100%,.035)` over the dark ground with
  `hsla(0,0%,100%,.09)` borders.
- **Rule 3 of the old system ("no cards, no box-shadows, no gradients") is RETIRED**,
  and with it the verify gate's blanket `no box-shadow / gradient` assertion.

What replaces that gate, so the rebrand cannot half-land: `scripts/verify.mjs` now
asserts **"on the brand system (ground + family)"** on every page, measuring the
ground the body actually paints and the family it actually renders in. A page left on
the white system fails. A partial rebrand is invisible to a copy gate, which is
exactly why this one is measured.

Unchanged and still binding from the old system: fonts are self-hosted only; no
backdrop-filter on the sticky header; em dashes banned in copy; receipts over
adjectives; the single CTA phrase "Book a Diagnostic Sprint"; "contact us" banned;
never fabricate a customer quote, a number or a testimonial; no individual names
(superseded 2026-09-28, see §9). Contrast still has to clear WCAG on the dark ground, and dark grounds
make that harder, not easier: check every accent used as text, and note that the
product's own `--ws-text-dim` `#6b7280` measures under 4.5:1 on `#07070c`.

The exact token set, type scale, component specs and the measured contrast table live
in `data/workelate-design.md`, taken from the live site and the Chief product page.

---

# The retired white system (v4 to v6), kept for history

# WE_AINA design system — v4 (founder-amended 2026-07-08, third pass)

POSITIONING (founder call 2026-07-22): WE_AINA is an **AI-native product
studio** and digital engineering partner. We BUILD: products, platforms,
mobile apps and the internal systems a company runs on. The old
"digital transformation partner / we fix your software" framing read as a
support company and is banned. Never describe the firm as fixing,
supporting or maintaining someone else's software as the primary offer.
Vocabulary: "product studio", "digital and product engineering",
"design, build and ship". Still keep "WorkElate's AI-Native Agency".

No decorative background images in the hero (founder: "no zebra lines").
The hero-*.jpg banded placeholder art is DELETED. Hero is flat navy and
carries itself on type.

These rules are law. If a change request violates one, push back and
propose the compliant version instead of silently complying.

v4 change (founder call): v3 was green-everywhere — rejected. Brand is
a REAL digital-transformation firm ("10× a big consultancy, for $5-50M
businesses"): WHITE + BLUE, corporate-grade. Green survives only as a
pinch on positive deltas. Voice talks like a transformation partner —
speed, team size, fixed budgets ($30K–$100K) stated on the page.

1. Typefaces (founder-amended 2026-09-07, v5): self-hosted DISPLAY
   serif — **Instrument Serif** (400 + italic), which carries the
   argument. Self-hosted **Inter** for prose. **JetBrains Mono** for
   ALL data — numbers, labels, receipts, sector tags, IDs, years.
   Never mono prose paragraphs, never sans numerals. Fonts self-hosted
   only — no runtime external font requests, ever.
   Why the serif: a display serif against a grotesque is the single
   clearest taste signal in the category. Measured 2026-09-07 across 25
   fetched studio sites: 8 of them pair a display serif with a
   grotesque (Metalab/PP Eiko, Unseen/Saol, Work & Co/Garamond,
   Hello Monday/Clarendon, Raycast/Instrument Serif, Ink & Switch,
   Stripe Press/Ivar). The other elite move is single-family rigour
   (Antinomy ships only ABC Diatype). What reads cheap is three
   unrelated sans faces.
   Bricolage Grotesque is RETIRED as the display face (kept only if a
   page still references it during migration).
   Still binding from 2026-07-13: no backdrop-filter/blur on the sticky
   header; em dashes banned in copy.

2. Palette (founder call 2026-09-07, v6 — supersedes the v5 warm-paper
   system below). His instruction, with screenshots: "make background white
   ... the fonts in black and blue and green", and pointing at the inverted
   band, "here as navy glossy blue".
   - `#FFFFFF` paper. True white, not off-white and not warm.
   - `#0A0A0A` ink. Black.
   - `#5A6470` muted.
   - `#E2E6EA` rule; a stronger neutral bounds any CONTROL, to clear the 3:1
     that WCAG 1.4.11 asks of a control boundary.
   - TWO accents, both taken from the WorkElate logo: `#0F8083` green (teal)
     and `#001372` blue (deep indigo), with `#349ED0` cyan available for data
     and highlights.
   - The `#cta` band is navy `#001372` and MAY carry a gradient sheen. It is
     the single gradient permitted on the site; `scripts/verify.mjs` keys the
     exemption to that one element id, not to an attribute a page can stamp on
     itself. The old `data-shadow-ok` attribute let shadows return sitewide
     while the gate reported green, and that failure must not repeat.
   Retired: the v5 warm system (`#F6F3EC`, `#FFFDF8`, `#16130F`, `#6E675C`,
   `#D9D2C4`, `#8A2B1E`, `#F0E4DF`, `#1F3D34`) and, still, the original
   corporate blue system (`#0B5FFF`, `#0A1F44`, `#FAFCFF`, `#7FB0FF`,
   `#0ACF6B`, `#FF6A1A`).
   Why the change: the warm cream and serif read as a generic assistant-made
   site ("why a normal claude code design"), and the palette must align with
   the WorkElate logo because the agency ships as aina.workelate.com, a
   subdomain — WorkElate is the brand.

3. No cards, no box-shadows, no gradients. Structure comes from rules
   (1px borders), whitespace, inversion, and type scale.
4. Receipts over adjectives. Every claim carries a real number or it
   gets cut. No "world-class", no "cutting-edge".
5. One CTA on the whole site: "Book a Diagnostic Sprint" (founder call
   2026-07-23 retired "Get your AI Readiness Score" with the score widget).
   The phrase "contact us" is banned.
6. Motion: count-up stats, reveal-on-scroll, hover fills are welcome —
   cheap transforms/opacity only, no layout thrash. Respect
   `prefers-reduced-motion`.
   Founder-amended 2026-07-22: the 500vh pinned case-study SCRUB IS
   DEAD ("this section is entirely looking pathetic"). It rendered as
   near-blank navy because the 160 frames were procedural placeholders
   and no real video ever landed. #casestudy is now a normal-height
   content section: stat band + before/after table + product-artifact
   mockups. Do NOT reinstate a scroll-scrub without real footage AND
   a fresh founder call.
7. The case-study section carries its weight with CONTENT, not motion,
   and reads the same on mobile and desktop. Any full-viewport
   scroll-jacked section needs a founder call before it ships.
8. Voice: industry-agnostic, process-agnostic. Never position as
   "industrial only". Named proof: RockProsUSA (industrial ops),
   CitiSense (marketing/creative, Mexico). The other projects stay
   anonymized as industry + receipt tiles.
   WE_AINA is WorkElate's AI-Native Agency — the dogfooding flywheel
   ("our delivery runs on our own platform") is PUBLIC positioning:
   keep it on About, How-we-work principle 06, and every footer.
9. Human connection is required, as a TEAM, never as named people
   (founder call 2026-09-28, aina.workelate.com: "entire website se
   chitransh + pratik hata do ... bolo tier 1 talent"). No founder or
   staff names, avatars, bios, alumni, signatures, author bylines or
   personal email addresses anywhere on the site, in JSON-LD, llms.txt
   or the corpus. Present a tier-1 team (senior engineers, product and
   growth people) that takes the toughest problems, moves at light
   speed, sits with the client and owns the outcome until it ships.
   No invented team size or headcount. Bylines and JSON-LD authors are
   the Organization "WE_AINA". Contact is /studio/contact, never a
   personal mailbox. verify.mjs enforces zero names. Warm micro-copy.
   NEVER fabricate customer quotes or testimonials.
10. Imagery (founder-amended 2026-07-10): photography is welcome — stock
   or self-made, founder's call is quality, not provenance ("lagao
   dhang k pics"). All images self-hosted (no runtime external image
   requests). Prefer shots that sit well on the white/blue palette;
   product-artifact mockups (dashboards, agent logs, receipts) remain
   first choice for product-proof slots.
   Founder-amended 2026-07-22: img/photos/team.jpg is DELETED, do not
   reinstate it. Wide banner slots use `.band-cycle` — a 4-shot
   crossfade (28s, 7s per shot, opacity+transform only), not one static
   hero photo. Source shots must be at least 3:2; a near-square source
   in a 2:1 band loses ~48% of the frame to the crop and turns into a
   wall of face, which is what got team.jpg cut.
