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
| `photo-cap-billboards-4x3.webp` | People on a wet Times Square street lined with digital billboards (third-party ads visible), 4:3 crop 1200x900, saturation 0.92, WebP q78; performance-marketing card base on /studio, downloaded 2026-09-29 | [Jamie Fenn](https://unsplash.com/@jamiefenn) | https://unsplash.com/photos/C8-wDFJp20o (Unsplash License) |

Caveats: the OOH photo shows a real third-party bank ad on the billboard, partly cropped. The fintech photo is, per its Unsplash caption, a classroom screen of climate charts; it reads as people at dashboards. Apple logos show on laptop lids in studio-review and studio-whiteboard, and a 'MacBook Pro' label under the screen in studio-code.

## C. RockProsUSA case study (client material, name and imagery cleared by the founder; downloaded 2026-09-28)

RockProsUSA is a WE_AINA client and we built the apps below. Their site footer reads "Product images may not be used without permission"; use here rests on that client clearance. Self-hosted as webp, resized, no recolouring. Used only on /studio/case-studies/rockprosusa.

| files | what it shows | source |
|---|---|---|
| `rockpros-quarry-red-2400.webp`, `-1200.webp` | Aerial of a red-rock quarry with crushing plant and stockpiles below a desert mountain (hero) | rockprosusa.com home slider, wp-content/uploads/2023/11/rockpros-home-slider-2-1-scaled.jpg |
| `rockpros-quarry-blue-2400.webp`, `-1200.webp` | Aerial of a terraced blue-grey quarry in a desert valley (numbers section) | rockprosusa.com home page, wp-content/uploads/2024/06/MM-AF-scaled.jpg |
| `rockpros-truck-2200.webp` | Green tri-axle dump truck outside a depot | rockprosusa.com/trucking header, wp-content/uploads/2023/11/Trucking-Page-header.jpg |
| `rockpros-stone-gold/red/brown/modern.webp` | Close-ups of four decorative rock colour families | rockprosusa.com home colour tiles (homepage-rock-color-gold.jpg, red-rebelred-, brown-beattybrown-, modern-kinoblue-homepage-featured-2.jpg) |
| `rockpros-app-customer-stats.webp` | Rock Pros Customer: Quantity Statistics (tons dispatched / received) | App Store screenshot, apps.apple.com/us/app/rock-pros-customer/id6740747257 |
| `rockpros-app-driver-sign.webp` | Rock Pros Driver: delivery signature pad (test signature) | App Store screenshot, apps.apple.com/us/app/rock-pros-driver/id6742345868 |
| `rockpros-app-trucker-loads.webp` | Rock Pros Trucker: Dispatched Loads. The real customer company name is BLURRED in both cards | App Store screenshot, apps.apple.com/us/app/rock-pros-trucker/id6742343397 |
| `rockpros-icon-customer/driver/trucker.webp` | The three apps' App Store icons | same App Store listings (developer page apps.apple.com/us/developer/rockpros/id1785935566) |

Not used, on purpose: the Driver "Open Loads" screenshot (shows a real job-site contact first name and street address) and the Driver map screenshot (shows a test location unrelated to the quarries).

# Image credits: site/img/systems/

For the /studio/systems pages (founder 2026-09-28, "images daalo"). Unsplash License (free for commercial use, attribution not required; credited anyway). Downloaded 2026-09-28 from images.unsplash.com through each photo's download link and self-hosted. Resized with sharp: `-16x9.webp` 2000x1125 (hero and wide band), `-4x3.webp` 1200x900 (pair tiles and index cards), attention crop, saturation 0.92, WebP quality 78. Product screens on these pages are the existing captures in site/img/studio/ (credited above), not recoloured.

| files | what it shows | used on | author | source |
|---|---|---|---|---|
| `sys-quarry-haul-16x9.webp`, `-4x3.webp` | Loaded haul truck climbing a quarry road | quarry dispatch band, index card | Lars Portjanow | https://unsplash.com/photos/7qFRRHjfJ6c |
| `sys-quarry-truck-4x3.webp` | Haul truck on a dusty quarry road, mountains behind | quarry dispatch "Today" tile | omid roshan | https://unsplash.com/photos/Evss0Whf5OI |
| `sys-plant-stockpile-16x9.webp`, `-4x3.webp` | Sand and gravel stockpiles under conveyors | plant reporting hero, index card | Valentin | https://unsplash.com/photos/HkxPrTZGEl8 |
| `sys-plant-conveyor-16x9.webp` | Conveyor dropping crushed stone onto a conical pile | plant reporting band | Roger Starnes Sr | https://unsplash.com/photos/dne48obE_2M |
| `sys-plant-clipboard-4x3.webp` | Hand writing on a blue clipboard | plant reporting "Today" tile | Phil Hearing | https://unsplash.com/photos/eXcF6L9pEug |
| `sys-dealer-delivery-16x9.webp`, `-4x3.webp` | White dump truck tipping at a stockyard | dealer orders band, index card | Juan Pablo Lara | https://unsplash.com/photos/s-qDIU6-kyM |
| `sys-dealer-phone-4x3.webp` | Person typing on a smartphone | dealer orders "Today" tile | Kelli McClintock | https://unsplash.com/photos/cr-Gh5A_9Nc |
| `sys-freight-loading-16x9.webp`, `-4x3.webp` | Gravel falling from a conveyor onto a pile | freight band, index card | Adriano | https://unsplash.com/photos/qCB_-fzt35s |
| `sys-ar-desk-16x9.webp`, `-4x3.webp` | Calculator, notebook and pencil on a white desk | AR band, index card | Cht Gsml | https://unsplash.com/photos/QfQW294I8sQ |
| `sys-ar-list-4x3.webp` | Clipboard with an empty "Open Projects" checklist beside a laptop | AR "Today" tile | Markus Winkler | https://unsplash.com/photos/Q2J2qQsoYH8 |
| `sys-compliance-folders-16x9.webp`, `-4x3.webp` | Stack of thick white folders on white | compliance hero, index card | Beatriz Pérez Moya | https://unsplash.com/photos/XN4T2PVUUgk |
| `sys-compliance-paper-4x3.webp` | Stacks of paper documents and folders in an office | compliance "Today" tile | Wesley Tingey | https://unsplash.com/photos/snNHKZ-mGfE |

Also reused from site/img/studio/: `photo-ind-logistics-4x3.webp` (freight "Today" tile) and `photo-ind-quarry-16x9.webp` (compliance band).

# Image credits: site/img/brain/ (the /brain page, 2026-09-29)

Every file is a crop and WebP (quality 82) re-encode of an existing real capture already in this repo; no new capture, no stock photo, pixels not recoloured. Crops are cut to the app window only.

| file | source | crop |
|---|---|---|
| `story-folder.webp` | `site/img/real/folder-container@2x.png` (local WorkElate hub, seeded org) | full frame, 1600w |
| `story-blocked.webp` | `site/img/real/tasks-board-rockcross-ops-portal@2x.png` (local Tasks app, seeded org) | board columns only, sidebar and account row removed |
| `story-quiet.webp` | `site/img/real/start-my-day-fresh@2x.png` (local hub Start my day, seeded org) | full frame |
| `story-draft.webp` | `site/img/studio/workelate-chief-hero.webp` (workelate.com home hero, sample data) | inner window, outer shadow removed |
| `story-yes.webp` | `site/img/studio/workelate-asks-first.webp` (workelate.com 'It asks first.') | card interior, black surround removed |
| `story-written.webp` | `site/img/studio/workelate-chief-reschedule.webp` (workelate.com hero, second prompt) | inner window |
| `gov-gate.webp` | `site/img/real/draft-at-confirm-gate@2x.png` (local hub, seeded org) | full frame |
| `gov-checks.webp` | `site/img/studio/workelate-checks-work.webp` (workelate.com 'It checks its work.') | trimmed margins |
| `role-day.webp` | `site/img/studio/workelate-start-my-day.webp` (workelate.com 'Your day, sorted.') | card interior |
| `role-ring.webp` | `site/img/studio/workelate-suite-ring.webp` (workelate.com 'Every app. One Chief.') | 1000w |
| `role-quiet.webp` | `site/img/real/gone-quiet-nudge@2x.png` (local hub, seeded org; the client and contact are seed personas) | title, reasons and actions |

# Image credits: site/img/brain/sub/ (the /brain sub-pages, 2026-09-29)

Visual pass on /brain/* sub-pages (founder 2026-09-29: "clean but text heavy"). Every file is WebP, resized with sharp (quality 80 to 82 for screens, 74 for photos); files over 1000px wide also ship a `-800.webp` for `srcset`. Screens are never recoloured.

Product illustrations captured 2026-09-29 from https://www.workelate.com (our own product site; it labels its screens as illustrations with sample data), headless Chromium at 1440 wide, 3x, element screenshots of the product windows:

| file | what it shows | source on workelate.com |
|---|---|---|
| `chief-send.webp` | Chief window: a request, four checked steps, the WeMail draft with its pipeline table | home hero |
| `start-my-day.webp` | Start my day: needs you, slipping, handled, each with a Because line | home 'Your day, sorted.' |
| `checks-work.webp` | Before vs With Chief: a card moved, then the board checked | home 'It checks its work.' |
| `asks-first.webp` | 'Waiting for your yes' confirm card, Send or Edit | home 'It asks first.' |
| `tasks-done.webp` | Tasks board, Doing and Done, the moved card outlined | home highlight |
| `folder-client.webp` | One client folder with five artifacts of five kinds | home highlights 'One client. One place.' |
| `board-update.webp` | Chief prepares a board update, checks each change, waits for a yes | /capabilities/founder |
| `quiet-deals.webp` | Chief finds five deals with no touch in 14 days, drafts follow-ups, waits | /capabilities/sales-leader |
| `followups.webp`, `calendar-slot.webp` | Five drafts waiting; a slot free for everyone, waiting | /capabilities/sales-leader |
| `reread.webp` | Chief re-reads the sheet and reports the one row that did not change | /security 'Every change, re-read.' |
| `permissions.webp` | Chief declines to edit a view-only sheet and says who can grant access | /security 'If you can't, Chief won't.' |
| `found-three.webp`, `needs-you.webp`, `share-confirm.webp` | Search results across apps; a needs-you list; a share confirm card | /products/hub |

Real product captures, re-encoded from `site/img/real/` (local hub, seeded org; credited above): `real-tasks-board`, `real-drawer`, `real-deck-folder`, `real-folder`, `real-quiet`, `real-refusal`, `real-decline`, `real-draft-gate`, `real-briefing`, `real-smd`. Re-encoded from `site/img/studio/`: `suite-ring` (workelate.com), `rockpros-dispatch` (RockProsUSA dispatch board, credited above).

Persona photographs, Unsplash License (free for commercial use; credited anyway), downloaded 2026-09-29 through each photo's download link, cropped 16:9 with attention crop:

| file | what it shows | used on | author | source |
|---|---|---|---|---|
| `persona-coo.webp`, `-800` | A worker walking a bright warehouse aisle under orange racking | /brain/for/coo | Adrian Sulyok | https://unsplash.com/photos/MqtT8GL_5Ks |
| `persona-cio.webp`, `-800` | A rack of servers, patch cables and status lights | /brain/for/cio | Kevin Ache | https://unsplash.com/photos/2JJ3wBHu4_0 |
| `persona-revenue.webp`, `-800` | A team with coffee around a laptop in a glass-walled office | /brain/for/revenue | Vitaly Gariev | https://unsplash.com/photos/YyJNda7nsPo |

Also reused read-only from `site/img/brain/` (the /brain home's crops, credited above): the six `story-*.webp` on /brain/use-cases/client-delivery.
Added the same day: `workgraph.webp` / `-800` (re-encoded from `site/img/workgraph-poster.webp`, the work map poster) for /brain/architecture, /brain/glossary and the work-graph capability.

## C. Case-study card photos (added 2026-09-30, Unsplash License; 4:3 crop, saturation 0.9, WebP)

| file | what it shows | photographer | source |
|---|---|---|---|
| `photo-case-graduation-4x3.webp` | Graduates in gowns throwing their caps against a city skyline at dusk (scholarship marketplace card) | [Pang Yuhao](https://unsplash.com/@yuhao) | https://unsplash.com/photos/_kd5cxwZOK4 (Unsplash License) |
| `photo-case-journeymap-4x3.webp` | Hands placing sticky notes on a printed customer journey map (CX SaaS card) | [UX Indonesia](https://unsplash.com/@uxindo) | https://unsplash.com/photos/w00FkE6e8zE (Unsplash License) |
| `photo-case-annotation-4x3.webp` | Aerial view of a car park full of cars, the kind of image a labelling platform annotates (annotation card) | [Ryan Searle](https://unsplash.com/@ryan_searle) | https://unsplash.com/photos/k1AFA4N8O0g (Unsplash License) |
