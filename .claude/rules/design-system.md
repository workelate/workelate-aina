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

2. Palette (founder call 2026-09-07 — v5, "this blue colour is
   fucking bad ... bring some taste, purity of design and direction of
   future"). WHITE + BLUE IS RETIRED. The new system is warm paper,
   true near-black ink, and ONE accent:
   - `#F6F3EC` paper (warm, the default canvas)
   - `#FFFDF8` sheet (raised surfaces, receipt bands, table zebra)
   - `#16130F` ink (text, and inverted sections)
   - `#6E675C` muted (labels, mono metadata)
   - `#D9D2C4` rule (1px borders — warm, never grey)
   - `#8A2B1E` oxblood — THE accent. CTAs, links, emphasis, positive
     deltas. It is the only chromatic hue on the page.
   - `#F0E4DF` oxblood tint (row hover, the only tinted background)
   - `#1F3D34` deep green, reserved for ONE inverted band per page.
   Retired: `#0B5FFF`, `#0A1F44`, `#FAFCFF`, `#7FB0FF`, `#0ACF6B`,
   `#FF6A1A`.
   THE ONE-ACCENT TEST, and it is enforceable: grep the stylesheet; if
   two chromatic hues each exceed 15 occurrences, you have a palette,
   not an accent. Measured across 25 studio sites 2026-09-07, the best
   have exactly one (Metalab #584dff, basement #ff4d00, Raycast
   #ff6363, AE Studio one orange); corporate blue was THE brand colour
   on only 2 of 25, both the weakest sites in the survey. `#0B5FFF`
   was within 2% of one of them.
   Also retired: the blue-tinted "white". `#FAFCFF` is a screen colour;
   every studio with taste used a warm off-white.

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
9. Human connection is required: founders visible and accountable
   (names, note in first person, "you talk to Chitransh or Pratik"),
   warm micro-copy. NEVER fabricate customer quotes or testimonials.
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
