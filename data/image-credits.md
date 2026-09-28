# Image credits: site/img/studio/

All files produced 2026-09-28. Screens are local captures of the real product code, run on this machine with demo or seed data only (no customer data, no secrets, no paid API calls, nothing sent). Framing (white window chrome or phone bezel, v8 window shadow) was added afterwards; the app pixels inside are not recoloured. Widths: 2400px for heroes and full-bleed, 1600px for cards, WebP quality 82. Phone frames also ship as a transparent PNG.

## A. Product screens

| file | what it shows | source |
|---|---|---|
| `workelate-chief-hero.webp` | WorkElate Chief window: 'Send Priya the Q3 numbers', steps checked, WeMail draft with pipeline table, confirm card | capture of https://www.workelate.com home hero (our own product site; the site labels its screens as illustrations with sample data) |
| `workelate-chief-reschedule.webp` | Chief window: 'Move the Acme review to Friday', WeMail note to attendees | same, second demo prompt |
| `workelate-start-my-day.webp` | Start my day card: needs you / slipping / handled, each with a Because line | workelate.com 'Your day, sorted.' section |
| `workelate-asks-first.webp` | 'Send the Q3 update to Acme?' confirm card on the black trust chapter | workelate.com 'It asks first.' section |
| `workelate-checks-work.webp` | Before vs With Chief: moved card, checked the board | workelate.com 'It checks its work.' section |
| `workelate-suite-ring.webp` | Chief at the centre of the suite app icons | workelate.com 'Every app. One Chief.' section (1400px, native size) |
| `workelate-phone.webp / .png` | workelate.com mobile hero in a phone frame | workelate.com at 390x844, 3x |
| `citysense-planner-map.webp` | CitySense AI planner: Mexico City map with screen clusters, 54 screens selected, 333K reach, why these screens | local run of /Users/chitransh/code/citysense (app + backend on a throwaway Postgres/PostGIS), seeded with the repo's import-billboards.js and create-demo-*-campaign.js; planner inputs typed as 'Demo Coffee Co'. Route /ai-planner. OpenAI key was a dummy, so AI text is the product's built-in fallback |
| `citysense-screen-map.webp` | Explore: map of 472 active billboards with filters and Ask AI bar | same run, /explore. Map tiles Mapbox + OpenStreetMap (attribution visible in frame). Billboard sites and providers are the repo's public CSV |
| `citysense-schedule.webp` | Recommended schedule: dayparts (morning, midday, evening peaks) | same run, /ai-planner review step |
| `citysense-coverage.webp` | Coverage map with 54 pins and recommended location cards with cost and CPM | same run, /ai-planner locations step |
| `citysense-live-campaign.webp` | Running campaign: live impressions counter, pacing on track, 46 screens | same run, /campaign/:id (seeded demo campaign) |
| `citysense-ai-decisions.webp` | 'AI decisions affecting this campaign' cards | same run, /campaign/:id scrolled |
| `citedspy-dashboard.webp` | CitedSpy overview: Acme Analytics 59/100 AI visibility, score cards, mention rate chart, share of voice | local run of /Users/chitransh/code/citedspy (app + server on a throwaway PGlite, repo migrations + engines seed); fictional brand 'Acme Analytics' and fictional competitors seeded, user demo@example.com. Route /dashboard. No scans, no keys loaded |
| `citedspy-competitive.webp` | Head-to-head win rate vs competitors, win rate over time | same run, /dashboard scrolled |
| `citedspy-citations.webp` | Citations: 18 sources, 12 citing you, 6 missing, coverage by engine | same run, /citations (public sites such as gartner.com appear as seeded sources) |
| `citedspy-sources.webp` | Citation source table with engines, coverage, co-cited brands | same run, /citations scrolled |
| `citedspy-prompts.webp` | Tracked prompts with mention-rate bars | same run, /prompts |
| `citedspy-brands.webp` | Brand and competitor cards with mention counts | same run, /brands |
| `citedspy-landing.webp` | Marketing hero 'Does AI recommend your brand?' | local run of citedspy/marketing (Next.js), repo content as is |
| `citedspy-phone.webp / .png` | Marketing hero at 390px in a phone frame (its embedded mockup is the repo's own marketing art) | same, 390x844 2x |
| `rockpros-dispatch-board.webp` | RockPros admin Open Jobs dispatch board | real rockpros-admin web app run locally; data served by a local stand-in API with demo names, 555 numbers and Austin demo addresses (the backend needs MySQL/MSSQL, not available here). Route /openjobs |
| `rockpros-po-progress-admin.webp` | Open Jobs scrolled right: PO progress bars per line | same, /openjobs |
| `rockpros-dispatched-loads.webp` | Dispatched loads with Pending Delivery / Pending Pickup status | same, /dispatchedloads |
| `rockpros-customer-tracking.webp` | Customer portal: scheduled deliveries per load, truck, loaded tons | real rockpros_customer web app, same stand-in demo data. Route /schedule_order |
| `rockpros-customer-po.webp` | Customer portal: active POs, ordered vs delivered, progress | same, /po-progress |
| `rockpros-driver-loads-phone.webp / .png` | Driver app: Orders > Open Loads with signature warning and a load card | real rockpros_driver iOS app built from a scratch copy, run in the iPhone 15 simulator (393x852 @2x), demo session, stand-in API |
| `rockpros-driver-profile-phone.webp / .png` | Driver app: My Profile (Driver Demo, truck DEMO-4100) | same |
| `rockpros-driver-welcome-phone.webp / .png` | Driver app welcome / Driver Login | same |
| `infinitie-landing.webp` | infinitie hero 'The room where a vouch still means something.' | local run of /Users/chitransh/code/infinitie (next dev, embedded PGlite; the real DB and Clerk keys were NOT used). The stats row is hard-coded copy in the repo, not measured |
| `infinitie-room.webp` | 'The room': intros this week / 90 days / led to something real, 12-week chart, open asks | same, /app Feed as a seeded demo member; 3 ask rows naming real companies hidden |
| `infinitie-phone.webp / .png` | Mobile 'The room' stat tiles and intro chart in a phone frame | same, 390x844 |

## B. Photography (Unsplash License: free for commercial use, attribution not required; credited anyway)

Each photo ships as `-16x9.webp` (2400x1350, banner) and `-4x3.webp` (1600x1200, card). Lightly graded: saturation 0.9, slight cool shift. Downloaded 2026-09-28 from images.unsplash.com and self-hosted.

| files | what it shows | author | source |
|---|---|---|---|
| `photo-ind-quarry-16x9.webp`, `photo-ind-quarry-4x3.webp` | Marble quarry terraces with a small excavator at the base (Cava Lazzareschi, Colonnata, Italy) | [Gianluigi Marin](https://unsplash.com/@gianluigi_marin) | https://unsplash.com/photos/fobNVvDUI2A (Unsplash License) |
| `photo-ind-logistics-16x9.webp`, `photo-ind-logistics-4x3.webp` | Aerial top-down view of semi-trailers parked in angled bays at a truck yard (Jankowice, Poland) | [Marcin Jozwiak](https://unsplash.com/@marcinjozwiak) | https://unsplash.com/photos/kGoPcmpPT7c (Unsplash License) |
| `photo-ind-ooh-16x9.webp`, `photo-ind-ooh-4x3.webp` | City street at dusk with a large illuminated digital billboard on a corner building (third-party ad, partly cropped) | [Anton Borzenkov](https://unsplash.com/@borzenkov) | https://unsplash.com/photos/ia2rfAbL_Sw (Unsplash License) |
| `photo-ind-fintech-16x9.webp`, `photo-ind-fintech-4x3.webp` | People working at desktop monitors showing charts and data dashboards, shallow depth of field | [Anastassia Anufrieva](https://unsplash.com/@antoie) | https://unsplash.com/photos/3yb7ZsaY0LY (Unsplash License) |
| `photo-ind-manufacturing-16x9.webp`, `photo-ind-manufacturing-4x3.webp` | Clean, cool-lit automated production line on a factory floor (refrigerator panel forming line) | [Homa Appliances](https://unsplash.com/@homaappliances) | https://unsplash.com/photos/pWUyHVJgLhg (Unsplash License) |
| `photo-ind-recommerce-16x9.webp`, `photo-ind-recommerce-4x3.webp` | Bright white warehouse with white racking and palletised cartons | [Petr](https://unsplash.com/@mpetrucho) | https://unsplash.com/photos/hgBbLfOWowQ (Unsplash License) |
| `photo-studio-whiteboard-16x9.webp`, `photo-studio-whiteboard-4x3.webp` | Two people planning at a whiteboard with wireframe sketches, one holding a laptop | [Kaleidico](https://unsplash.com/@kaleidico) | https://unsplash.com/photos/3V8xo5Gbusk (Unsplash License) |
| `photo-studio-review-16x9.webp`, `photo-studio-review-4x3.webp` | Hands pointing at a laptop screen during a review, faces out of frame (Apple logo visible on lid) | [Mimi Thian](https://unsplash.com/@mimithian) | https://unsplash.com/photos/ZKBzlifgkgw (Unsplash License) |
| `photo-studio-code-16x9.webp`, `photo-studio-code-4x3.webp` | Laptop with code editor on a dark desk in soft window light, large negative space | [Emile Perron](https://unsplash.com/@emilep) | https://unsplash.com/photos/xrVDYZRGdw4 (Unsplash License) |

Caveats: the OOH photo shows a real third-party bank ad on the billboard, partly cropped. The fintech photo is, per its Unsplash caption, a classroom screen of climate charts; it reads as people at dashboards. Apple logos show on laptop lids in studio-review and studio-whiteboard, and a 'MacBook Pro' label under the screen in studio-code.
