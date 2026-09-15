# Content audit, aina.workelate.com

**Read:** all 78 HTML pages under `site/` (prose only, nav and footer stripped), plus `data/brain-narrative.md` as the message house. **Measured:** body words, sentences over 25 words, Flesch-Kincaid grade (0.39 × words/sentence + 11.8 × syllables/word − 15.59), numbers repeated on the same page, and every coined term used on a page that does not define it. **Judged:** first-line clarity after the h1, the one sentence a stranger would say back, and cost to the buyer. Local build at `http://localhost:4310`, repo `/Users/chitransh/code/WE_Code/workelate-aina`, 2026-09-15. Nothing on the site was changed.

**The bar:** a COO, CIO, CFO or CRO on a phone between meetings, who has bought an AI copilot once and been disappointed, can read any single page in under a minute and repeat it in one sentence.

---

## Verdict

The sentences are short (site-wide Flesch-Kincaid grade 5.3 (word-weighted), average sentence 8.8 words, only 174 of 4,858 sentences run past 25 words) and the copy almost never uses the banned brochure words, so on the surface this reads better than most vendor sites. It still fails the bar, and it fails it on vocabulary, not on syntax: 26 coined or internal terms appear **310 times on pages that do not define them**, and the four load-bearing ones (*signals* on 34 pages, *verbs* on 25, *surfaces* on 23, *the model* on 24) are never defined at first use on any page but the glossary. The disclaimer "the 12 surfaces are the Brain's own, not your systems" has to be repeated on eleven pages, which is the site admitting the number confuses. The same two counts, 71 and 287, appear on 39 and 32 pages, up to seven times each on the capabilities index, so the numbers land nowhere. Seventeen of 78 pages open with a first line a stranger cannot follow, and most capability h1s are aphorisms ("Nothing fires when nothing happens. Which is why nothing is the thing that costs you.") whose subject is only in the breadcrumb. The most expensive defect is not on any one page: the site is two companies with two vocabularies and two buyers. The product zone sells *the Brain* to a 200 to 2,000 person company with "a human yes in front of anything it changes"; the studio zone sells *agents* and an *agent fleet* to a "$5–50M business" in rupees, promises "no human in the loop" and "the system earns autonomy per decision type", and eight of its pages end with a CTA ("Five questions. Your report … arrives in 10 minutes") that describes a product that does not exist. A CXO who reads `/brain` and then `/studio` meets a contradiction on the one promise the message house says every page must leave intact.

**Score, in the founder's terms.** Apple-clear pages: 11 of 78 (the four use-case walks, the three role pages, the compare children, `/brain/for/coo`, `/brain/pricing`, `/brain/getting-started`). Readable but off-bar: 49. Written for us, not for them: 18 (architecture, security, capabilities index, the nine "mechanism" capability pages, the roadmap and changelog, the studio home, how-we-work and the six systems pages).

---

## Scorecard, every page

Columns: body words · sentences over 25 words · is the first sentence after the h1 understandable with zero site context · coined terms the page uses without defining · Flesch-Kincaid grade · what a stranger would say the page is about. "Coined terms" counts 26 site vocabulary items (work graph, verbs, confirm gate, interruption budget, signals, declare, fence, honest refusal, re-read, claim check, business objects, surfaces, destructive, session, the model, reason line, cooldown, three checks, the loop, agent fleet, receipts, Start my day, Diagnostic Sprint, system of record, 190, 12 surfaces). A page defines a term if it says what the term is in the same block where it first appears; a term the page is *about* counts as defined.

| route | body words | sentences >25w | first line clear | coined terms used undefined | FK grade | a stranger would say this page is about |
|---|---|---|---|---|---|---|
| `/` | 404 | 2 | n | verbs, the model, receipts | 5.1 | A software company with two things to sell; I am not sure what either does. |
| `/book-a-demo` | 690 | 2 | y | confirm gate, signals, destructive, three checks | 3.5 | A 45-minute demo on my own kind of work, booked through a form. |
| `/brain` | 765 | 5 | y | work graph, verbs, signals, re-read, surfaces, Start my day, 12 surfaces | 3.5 | An AI layer that sits on my existing systems, notices what matters, and asks before changing anything. |
| `/brain/architecture` | 669 | 2 | n | work graph, verbs, signals, declare, fence, re-read, business objects, surfaces, session, the model, Start my day, 190, 12 surfaces | 5.2 | How the AI is built, for my architect. I could not repeat the headline. |
| `/brain/security` | 640 | 2 | n | re-read, session, the model | 5.3 | Something about sessions and models. I would forward it to security without knowing what it says. |
| `/brain/proof` | 535 | 2 | y | surfaces, the model, 12 surfaces | 4.8 | The numbers they will stand behind, and the things they admit are not proven. |
| `/brain/pricing` | 567 | 0 | y | none | 2.5 | Two things to buy, fixed price, I own what is built. The second price is $30K to $100K; the first is not on the page. |
| `/brain/getting-started` | 634 | 3 | y | none | 3.4 | What the first ten weeks look like and what my people must give. |
| `/brain/faq` | 677 | 3 | n | signals, business objects, surfaces, cooldown, system of record, 190, 12 surfaces | 4.8 | Twelve buyer questions answered, including the ones where they say no. |
| `/brain/objections` | 717 | 0 | y | signals, session, the model, system of record | 4.4 | The eight reasons not to buy, answered, four of them with "then do not buy". |
| `/brain/glossary` | 687 | 4 | y | none | 4.7 | Their private dictionary. |
| `/brain/roadmap` | 580 | 2 | y | work graph, verbs, signals, declare, honest refusal, re-read, three checks, the loop, Start my day | 4.7 | What runs today, what is being built, what is only intended. |
| `/brain/changelog` | 432 | 1 | y | work graph, verbs, signals, declare, honest refusal, re-read, surfaces, reason line, three checks, the loop, Start my day, 12 surfaces | 5.2 | Dated list of what shipped. |
| `/brain/compare` | 283 | 0 | y | work graph, verbs, declare, three checks | 3.6 | A table comparing them against four kinds of tool I already own. |
| `/brain/compare/per-app-copilots` | 367 | 0 | y | work graph, verbs, surfaces, three checks | 4.3 | My Copilot sees one tool; this sees across them. |
| `/brain/compare/enterprise-search` | 382 | 0 | y | work graph, verbs, session, the model, three checks | 4.7 | Search finds things; this one also decides and acts. |
| `/brain/compare/ipaas-and-rpa` | 376 | 1 | y | work graph, signals, three checks | 4.9 | Flows do the same thing every time; this handles the cases no flow covers. |
| `/brain/compare/build-your-own` | 377 | 0 | y | verbs, signals, session, the model, three checks, agent fleet, receipts | 5.0 | Whether to build this in-house; they say the hard part is not the demo. |
| `/brain/for/coo` | 382 | 0 | y | interruption budget, signals | 4.1 | I find out late; this tells me before the standup. |
| `/brain/for/cio` | 383 | 0 | y | verbs, business objects, surfaces, destructive, session, the model, system of record, 190, 12 surfaces | 4.9 | Nothing replaced, no new system of record, writes wait for a person. |
| `/brain/for/revenue` | 376 | 1 | y | confirm gate, signals | 3.4 | It spots deals going quiet in email and drafts the chase. |
| `/brain/use-cases` | 321 | 1 | y | work graph, signals | 4.1 | Four workflows; pick the one that looks like mine. |
| `/brain/use-cases/client-delivery` | 440 | 0 | y | signals | 3.8 | One client as one picture, with blockers named and the chase drafted. |
| `/brain/use-cases/order-to-cash` | 467 | 0 | y | none | 4.0 | Order, delivery, invoice and chase joined without people carrying numbers. |
| `/brain/use-cases/mail-triage` | 431 | 0 | y | cooldown | 4.3 | A shared inbox sorted into: needs a person, needs a draft, needs nothing. |
| `/brain/use-cases/board-reporting` | 435 | 0 | y | declare | 3.6 | The board pack built from source numbers instead of four days of retyping. |
| `/brain/capabilities` | 1875 | 19 | n | work graph, confirm gate, signals, declare, fence, re-read, business objects, surfaces, session, the model, reason line, cooldown, the loop, 190, 12 surfaces | 5.5 | A very long inventory of everything it does, in their words. |
| `/brain/capabilities/ask-dont-guess` | 456 | 1 | y | confirm gate, honest refusal | 4.5 | When an instruction is ambiguous it asks instead of guessing. |
| `/brain/capabilities/calendar-awareness` | 466 | 1 | y | work graph, confirm gate, interruption budget | 5.3 | Work gets urgent before the meeting that will ask about it. |
| `/brain/capabilities/change-detection` | 470 | 0 | y | work graph, interruption budget, signals | 4.5 | It tells me what changed, with before and after, not just that something changed. |
| `/brain/capabilities/claim-check` | 463 | 1 | n | honest refusal, re-read, the model | 4.6 | Something is measured against data. I do not know what "the sentence" is. |
| `/brain/capabilities/confirm-gate` | 487 | 1 | y | verbs, interruption budget, signals, surfaces, the model | 4.3 | The AI cannot approve its own actions; a person clicks. |
| `/brain/capabilities/context-assembly` | 459 | 1 | y | declare, fence, surfaces, session, the model | 5.6 | It gathers the related work and contract before answering. |
| `/brain/capabilities/decision-history` | 452 | 1 | y | work graph, verbs, fence, session, the loop | 5.1 | It remembers what was decided and why, so I do not re-explain. |
| `/brain/capabilities/document-grounding` | 462 | 1 | y | work graph, confirm gate, fence, re-read | 4.9 | It reads the contract at decision time instead of rules someone typed in. |
| `/brain/capabilities/drafting` | 485 | 3 | y | confirm gate, signals, re-read, session | 3.8 | Replies arrive drafted with the context already gathered; I decide. |
| `/brain/capabilities/entity-resolution` | 476 | 0 | y | work graph, verbs, business objects, 190 | 4.9 | Four spellings of one client are treated as one client. |
| `/brain/capabilities/evaluation-suite` | 481 | 2 | n | signals, honest refusal, re-read, claim check | 4.1 | They measure judgment case by case. Not sure how that helps me. |
| `/brain/capabilities/fifteen-verbs` | 497 | 1 | n | confirm gate, declare, business objects, surfaces, destructive, session, the model, 190, 12 surfaces | 5.2 | Fifteen verbs and a number that only falls. I do not know why I should care. |
| `/brain/capabilities/filing-artifacts` | 483 | 3 | n | verbs, declare, fence, business objects, surfaces, session, the model, 190, 12 surfaces | 5.7 | What it creates is filed in the client folder automatically. |
| `/brain/capabilities/folder-scope` | 466 | 1 | y | work graph, declare, surfaces, session, the model | 5.0 | A question about a client reads that client's folder and nothing else. |
| `/brain/capabilities/honest-refusal` | 473 | 2 | n | verbs, re-read, claim check | 4.7 | It says no when it cannot do something instead of doing the nearest thing. |
| `/brain/capabilities/identity-and-scope` | 492 | 1 | n | signals, fence, re-read, the model | 6.3 | Something about who is asking and "the model". For security people. |
| `/brain/capabilities/interruption-budget` | 451 | 1 | y | confirm gate, signals | 4.7 | It is limited to 40 interruptions an hour company-wide, 5 per person. |
| `/brain/capabilities/judgment-pipeline` | 471 | 2 | n | work graph, interruption budget, signals, fence, the model, cooldown | 4.4 | Interrupting people is expensive, so there is a process first. Could not say what. |
| `/brain/capabilities/move-and-assign` | 472 | 3 | y | confirm gate, signals, declare | 4.6 | It proposes board moves with evidence; I confirm. |
| `/brain/capabilities/multi-step-sequences` | 451 | 2 | n | verbs, confirm gate, signals, re-read, surfaces, the loop, 12 surfaces | 4.7 | One request, several steps, one confirmation. |
| `/brain/capabilities/one-continuous-thread` | 484 | 1 | y | interruption budget, signals, declare, claim check, session | 4.6 | Alerts and my questions live in one thread that remembers. |
| `/brain/capabilities/organization-memory` | 474 | 2 | n | the model | 6.1 | Memory is per company. The rest is about fields and fences. |
| `/brain/capabilities/ownership-tracking` | 466 | 2 | y | confirm gate, interruption budget, session, the model | 4.9 | It works out who really owns an item and tells them, not a channel. |
| `/brain/capabilities/plain-language-preferences` | 445 | 0 | y | honest refusal, surfaces | 4.7 | I change its behaviour by telling it in plain words. |
| `/brain/capabilities/ranked-briefing` | 467 | 2 | y | interruption budget, signals, declare, surfaces, cooldown | 4.4 | A short morning list, each item with why and what is blocking it. |
| `/brain/capabilities/read-after-write` | 467 | 1 | n | interruption budget, signals, fence, honest refusal, claim check, session, the model | 3.9 | It double-checks that a change really happened before saying so. |
| `/brain/capabilities/record-updates` | 461 | 0 | y | verbs, confirm gate, fence, system of record | 4.5 | One date changed once, everywhere, and verified. |
| `/brain/capabilities/role-aware-scoring` | 484 | 1 | y | signals, fence, reason line | 4.6 | Different people get different lists for the same event. |
| `/brain/capabilities/signal-capture` | 466 | 1 | y | fence, session, agent fleet | 4.8 | It listens to what my systems already announce. |
| `/brain/capabilities/signals-to-suite` | 509 | 3 | n | work graph, signals, declare, honest refusal, re-read, session, system of record | 5.7 | One loop from something happening to something finished. Their internal diagram. |
| `/brain/capabilities/silence-detection` | 466 | 2 | y | confirm gate, interruption budget, signals | 4.5 | It notices when nothing has happened for too long. |
| `/brain/capabilities/stakes-routing` | 465 | 2 | y | verbs, confirm gate, destructive, the model | 4.8 | Small reversible things run fast; consequential things stop for a person. |
| `/brain/capabilities/twelfth-app` | 470 | 1 | n | verbs, signals, honest refusal, business objects, surfaces, destructive, 190, 12 surfaces | 5.4 | Adding a new system should cost the same as adding the second. Engineering talk. |
| `/brain/capabilities/work-graph` | 464 | 1 | y | declare, fence, system of record | 4.5 | Ask about a client, get the client, not ten documents. |
| `/studio` | 2397 | 22 | y | verbs, surfaces, the loop, agent fleet, receipts, 12 surfaces | 7.3 | An agency that has built a lot of things, with everything on one page. |
| `/studio/about` | 726 | 4 | y | the loop | 7.2 | Two senior founders, no juniors, AI does the volume work. |
| `/studio/contact` | 451 | 2 | y | agent fleet | 4.3 | Email a founder; no sales team. |
| `/studio/how-we-work` | 875 | 4 | y | interruption budget, the loop | 5.5 | Why they are cheaper and faster than Accenture-style firms. |
| `/studio/work` | 954 | 2 | y | agent fleet, Diagnostic Sprint | 8.6 | A list of 34 things they built. |
| `/studio/case-studies` | 550 | 4 | y | surfaces, agent fleet, receipts, Diagnostic Sprint | 9.0 | Eight projects, one with real numbers, and an offer to build a free proof of concept. |
| `/studio/case-studies/rockprosusa` | 798 | 9 | y | signals, surfaces, the loop, agent fleet, receipts | 5.8 | Thirteen quarries on one dispatch system, 38% faster, 11,200 hours back. |
| `/studio/systems` | 331 | 1 | y | the loop, receipts | 6.6 | Six things they have built before, mostly for quarries and plants. |
| `/studio/systems/ar-followup-automation` | 561 | 4 | y | session, Diagnostic Sprint | 7.2 | Automated invoice chasing with escalation. |
| `/studio/systems/compliance-documentation` | 583 | 5 | y | surfaces, Diagnostic Sprint | 8.6 | Indian quarry compliance filings built from operating data. |
| `/studio/systems/dealer-order-management` | 563 | 1 | y | the loop, agent fleet, Diagnostic Sprint, system of record | 7.5 | WhatsApp and email orders turned into one confirmed queue. |
| `/studio/systems/freight-reconciliation` | 566 | 3 | y | receipts, Diagnostic Sprint | 7.0 | Carrier bills matched to weighbridge and delivery data automatically. |
| `/studio/systems/plant-production-reporting` | 577 | 6 | y | surfaces | 7.4 | A daily plant report written by 6 AM without a person. |
| `/studio/systems/quarry-dispatch-automation` | 580 | 3 | y | Diagnostic Sprint | 7.4 | Truck dispatch proposed by the system, approved by a dispatcher. |
| `/studio/blog` | 118 | 0 | y | the model, agent fleet, receipts, Diagnostic Sprint | 6.7 | Two blog posts. |
| `/studio/blog/receipts-over-decks` | 391 | 3 | y | agent fleet | 6.2 | Numbers that moved, not status decks. |
| `/studio/blog/the-pyramid-cant-survive-agents` | 615 | 4 | y | none | 7.3 | Big consultancies bill juniors; AI removes that layer. |


**Totals:** 42,529 body words across 78 pages · 174 sentences over 25 words · 17 pages whose first line is not clear alone · 310 undefined coined-term uses · site FK grade 5.3 word-weighted (range 2.5 on `/brain/pricing` to 9.0 on `/studio/case-studies`). The grade is not the problem. The words are.

---

## Jargon table

Terms ranked by how many pages use them without defining them. "Plain replacement" is the wording to use instead; "definition at first use" is the clause to add where the term must stay.

| term | pages using it undefined | plain replacement, or the one-line definition to place at first use |
|---|---|---|
| **signals** | 33 (every product page but `signal-capture`; also `/book-a-demo`, `/brain/getting-started`, `/studio/case-studies/rockprosusa`) | "what your tools already record: a ticket opened, a date moved, an invoice sent". Where it must stay: "the signals (the events your systems already record) …" |
| **the model** | 21 (architecture, security, 17 capability pages, both compare pages that mention it) | "the AI". A CXO does not know "the model" means the language model. |
| **verbs / 15 verbs** | 21 (`/`, `/brain`, cio, faq, compare hub and three children, roadmap, changelog, 11 capability pages) | "the fifteen things it can be asked to do (find, read, draft, send, assign …)". Drop the count everywhere except `/brain/proof` and `fifteen-verbs`. |
| **surfaces / 12 application surfaces** | 21 (everywhere the 287 count appears, plus studio pages meaning UI screens) | "our own apps". The eleven-page disclaimer "the 12 surfaces are the Brain's own, not your systems" disappears if the word does. |
| **confirm gate / confirm-gated** | 17 (`/brain/for/revenue`, roadmap, changelog, compare children, 12 capability pages) | "stops and waits for a person to click yes". Where it must stay: "the confirm gate, the stop in front of anything that sends, deletes or shares". |
| **declare / declaration / declared event** | 16 (architecture, capabilities index, compare hub, roadmap, changelog, board-reporting, 10 capability pages) | "tells the Brain what it records". "Applications declare their own events" → "each app tells the Brain what it records; nothing is scraped". |
| **fence / fenced / tenant fence** | 14 (architecture, 12 capability pages, `/brain/security` uses it as a heading and never says what it is) | "kept inside your company's data". "inside your organization's fence" → "inside your company's own data, never anyone else's". |
| **honest refusal** | 14 (capabilities index, roadmap, changelog, ipaas, plant-reporting, 10 capability pages) | "it says no, and says what is missing". |
| **re-read / read after write / a write re-read before it is believed** | 15 (`/brain`, architecture, security, roadmap, changelog, 10 capability pages) | "it checks the change actually landed before telling you it did". |
| **work graph** | 12 (`/brain`, architecture, capabilities index, compare hub and three children, roadmap, changelog, use-cases index, 6 capability pages) | "one map of how your deals, threads, tickets, documents and people connect". Keep the term only on `work-graph` and the glossary. |
| **interruption budget / the budget** | 11 (`/brain/for/coo`, proof, 9 capability pages; use-case pages define it in the mechanism block) | "a cap on how often it may interrupt anyone: 40 an hour company-wide, 5 per person". Say the numbers once per page. |
| **session / identity comes from the session, never from the model** | 18 (security h1, architecture, cio, objections, build-your-own, enterprise-search, 12 capability pages) | "it can only act as the person who signed in; nothing in a document, an email or the AI's own output can change who that is". |
| **destructive / classified destructive** | 6 undefined (compare hub, faq, cio, stakes-routing, confirm-gate lede, changelog) | "the 71 actions that send, delete or share". |
| **business objects / 190** | 8 (architecture, cio, faq, capabilities index, entity-resolution, fifteen-verbs, filing-artifacts, twelfth-app) | Drop the number. Where it must stay: "190 kinds of thing it can act on: a document, a deck, a mail thread, an invoice". |
| **three checks** | 7 (compare children ×4, capabilities index, security lede, `/brain/use-cases`) | "three questions before it interrupts anyone: does this matter, what changed, is it worth saying now". |
| **the loop / one loop / sense, recall, judge, act, remember** | 10 (architecture lede, multi-step, judgment-pipeline, twelfth-app, signals-to-suite, one-continuous-thread, capabilities index, document-grounding, context-assembly, `/brain`) | Internal architecture. Replace with what happens: "every change takes the same path: noticed, put in context, judged, acted on with a yes, remembered". |
| **reason line / blocker line** | 3 (changelog, role-aware-scoring, capabilities index) | "one line saying why it is on your list and one saying what it is waiting on". |
| **cooldown** | 7 (faq, mail-triage, judgment-pipeline, ranked-briefing, silence-detection, interruption-budget lede, capabilities index) | "the same item is never raised twice". |
| **claim check** | 5 (evaluation-suite, honest-refusal, one-continuous-thread, read-after-write, record-updates) | "what it tells you is checked against what actually happened". |
| **receipts** | 8 (`/`, studio home, `/studio/case-studies`, rockprosusa, `/studio/systems`, freight, build-your-own, `/studio/blog` index) | "the operating numbers, before and after". The blog defines it; the pages that use it as a brand word do not. |
| **agent fleet / agents / agentic** | 12 studio pages, 0 product pages | This is the studio's word for what the product zone calls the Brain. Pick one. If the studio keeps "agents", say once per page "agents (the same Brain, doing our own delivery work)". Never "agentic" for ourselves; the lexicon bans it. |
| **Diagnostic Sprint** | 8 (the six systems pages, `/studio/blog`, `/studio/case-studies`, where the CTA does not say what it is) | "a two-week, fixed-fee look at one workflow that ends in a build plan with a price". It is the only CTA on the site; it must be defined the first time it is a button, on every page. |
| **Start my day** | 4 (`/brain` caption, architecture caption, roadmap, changelog) | "the morning list". |
| **system of record** | 6 (cio, faq, objections, signals-to-suite, record-updates, dealer-order) | Fine for a CIO, opaque for a COO. "the system that owns the data". |
| **address / resolves to an address** | 10 capability pages | Internal. "it knows exactly which action in which app that request means". |
| **rung / the ladder** | 2 (`/brain` defines it; `/brain/proof` and use-cases index allude to it) | Keep; it is defined where it appears. |

Also counted, not coined but unexplained for the stated buyer: **weighbridge** (9 pages), **Tally**, **DSO**, **MIS**, **DCS**, **e-way**, **GST**, **₹ Cr / lakh** (the six systems pages and rockprosusa). These are Indian mid-market plant vocabulary on a site whose product zone addresses a $50M–$1B company. See punch-list row 1.

---

## Punch list, ranked by what it costs the buyer

Effort: S = one edit on one page · M = one edit repeated across a set, or a section rewrite · L = a page rewrite or a chrome change.

### FIX FIRST

**1. `/studio`, `/studio/about`, `/studio/how-we-work`, `/studio/case-studies`, `/studio/case-studies/rockprosusa`, all six `/studio/systems/*` — two companies, two vocabularies, two buyers, one contradiction.**
As it is: the product zone says "the Brain", "a human yes in front of anything it changes", "200 to 2,000 people". The studio zone says "agents", "agent fleet", "agentic dispatch", "a $5–50M business", prices in ₹ Cr and lakh, "Daily P&L-grade report written by 6:00 AM, no human in the loop" (`/studio`, rockprosusa, `/studio/systems`), and "Assignment decisions stay human-approved until you decide otherwise, the system earns autonomy per decision type, with logs to justify it" (`quarry-dispatch-automation`).
Why it costs: the message house says a stranger must leave every page with "it asks before it writes" intact. The studio zone removes it on four pages, uses two banned words (autonomy, logs) and one banned adjective (agentic, three times), and prices for a different company than the one `/brain` describes. A CIO who reads both zones cannot tell which is true; the safe assumption is neither.
Rewrite: one vocabulary sitewide. On every studio page replace "agents" / "agent fleet" with "the Brain" on first use and "it" after; replace "agentic dispatch system" with "one dispatch system"; replace the two "no human in the loop" lines with "written by 6:00 AM, ready for a person to read"; replace the quarry FAQ answer with "No. It replaces the radio tag and the spreadsheet copying. Every assignment is proposed with its reasoning and a dispatcher approves it. That does not switch off." Rupee figures: convert to USD or remove (row 9). Effort **L**.

**2. Eight studio pages — a CTA that describes a product that does not exist.**
As it is (`/studio/blog`, `/studio/case-studies`, `/studio/systems/ar-followup-automation`, `compliance-documentation`, `dealer-order-management`, `freight-reconciliation`, `plant-production-reporting`, `quarry-dispatch-automation`): "Book a Diagnostic Sprint. Five questions. Your report, three automation opportunities with conservative numbers, arrives in 10 minutes." The button goes to `/studio/contact`, where the page promises "a reply from Chitransh or Pratik" and "Nothing here is a chatbot, an autoresponder or a CRM sequence."
Why it costs: the one next step on the site changes meaning eight times, and the promise (a report in ten minutes) is broken on the next click. This is the single fastest way to lose the disappointed-once buyer.
Rewrite, ready to paste: "Book a Diagnostic Sprint. Two weeks, fixed fee. You get a build plan with a price on it, and if we find nothing worth building we say so in writing." Effort **S** (one string, eight files; it looks generated, so fix the source).

**3. Site-wide — 71 and 287 are on 39 and 32 pages and land nowhere.**
As it is: `/brain/capabilities` says 287 seven times and 71 seven times; `/brain` says 71 three times; `confirm-gate` three times; the four use-case pages carry the identical block "THE CONFIRM GATE · 71 of the 287 actions wait for a person. THE INTERRUPTION BUDGET · At most 40 interruptions per organization per hour and 5 per person." The message house says a number appears once, where it lands hardest.
Why it costs: repetition reads as insecurity, and the buyer stops seeing the number by the third page. The confirm count is the strongest fact on the site and it has been spent.
Rewrite: keep 71/287 on `/brain` (the four-number block), `/brain/proof`, `/brain/security` and `confirm-gate`. Everywhere else say the fact without the count: "anything that sends, deletes or shares stops for a person". On the four use-case pages, replace the two mechanism cells with: "THE CONFIRM GATE · Nothing is sent or shared until a person clicks." and "THE INTERRUPTION BUDGET · It may not interrupt anyone more than a few times an hour." Effort **M**.

**4. `/brain/for/cio`, `/brain/faq`, `/brain/capabilities`, `/brain/architecture`, `fifteen-verbs`, `filing-artifacts`, `twelfth-app` — four coined counts in one sentence.**
As it is (`/brain/faq`): "15 verbs, not hundreds of buttons, resolving to 287 concrete actions across the Brain's own 12 application surfaces and 190 business objects. Which of your systems they reach is what the Sprint establishes." Same sentence on the CIO page as four stat tiles.
Why it costs: a CXO cannot say what a verb, a surface or a business object is, so the sentence is four numbers with no nouns, followed by a disclaimer that the numbers are not about them. The disclaimer "the 12 surfaces are the Brain's own, not your systems" is on eleven pages.
Rewrite, ready to paste: "It can be asked to do fifteen things, from find and draft to send and assign. Those fifteen reach 287 actions inside our own apps, and 71 of them, everything that sends, deletes or shares, stop for a person. Which of *your* systems it reaches is what the two-week Sprint establishes." Delete 190 and 12 from every page but `/brain/proof`. Effort **M**.

**5. `/brain/security` — an h1 a CXO cannot repeat.**
As it is: "Identity comes from the session, never from the model." Then: "Anything a model can write, a document can influence", "A tool cannot read its own approval off the model's arguments", "An unfenced check returns unknown, never a pass."
Why it costs: this is the page the champion forwards to the person who can kill the deal, and its headline is in our dialect. "Session" and "the model" are undefined on the page.
Rewrite: h1 "It can only act as the person who signed in." Sub: "Nothing in a document, an email, or the AI's own output can change who that is, or approve an action on their behalf. We hold no certification and we say so." Section heads: "What it may read, and what it may change on its own" (keep), "The five questions a review asks" (keep the table), "What we do not claim" (keep). Effort **S**.

**6. `/brain/architecture` — the h1 and the first paragraph are our internals.**
As it is: "One loop, a small vocabulary, and two checks on every claim." then "The Brain is a single decision loop with no business branches in it, 15 verbs that resolve to concrete actions in the systems you connect, a confirmation gate in front of anything destructive, and two checks between what the system did and what it may tell you it did."
Why it costs: this page exists to survive an architect; it should still open in a sentence the COO who forwarded it could have read.
Rewrite: h1 "Built so a person, not a rule, decides." Sub: "One process for every change, no hand-written rules per case, a stop in front of anything that sends or deletes, and two checks that what it says it did is what happened. Where a claim is not proved, the page says so." Effort **S**.

**7. `/` — a tagline that says nothing, and a homepage that sells two things a stranger cannot tell apart.**
As it is: h1 "WorkElate Excellence Studio", sub "Where ROI meets passion. One company, two offerings: a brain that gives your work one memory, and the studio that puts it on the systems you already run."
Why it costs: "Where ROI meets passion" is the one line on the site a disappointed buyer has read on every other vendor's site. The stranger's sentence for this page was "a software company with two things to sell; I am not sure what either does."
Rewrite: h1 "One memory for the work your systems already hold." Sub: "The Brain watches your CRM, mail, tickets and documents, tells you what needs a person, and asks before it changes anything. The studio installs it in two weeks and prices the build before it starts." Keep the two cards below. Effort **S**.

**8. `/studio`, `/studio/case-studies`, `/studio/systems`, `/studio/work` — the studio's own numbers disagree with each other.**
As it is: "34 products delivered, 9 industry sectors, 374 repositories" (17 places, and `/brain/proof`), then on the same `/studio` page "100+ projects shipped … 16 sectors … 9 years", "See the other 40 programmes", "41 programmes"; `/studio/case-studies`: "A hundred-plus products across sixteen sectors", "Eight programmes", "33 more programmes being written up", "8 of 100+ projects documented"; `/studio/systems`: "100+ projects across 16 sectors"; `/studio/work`: "34 programmes shown, drawn from 374 repositories and 41 programmes".
Why it costs: a CFO reads numbers first. Five different totals for the same portfolio on four pages is the fastest credibility loss available, and the message house names exactly one set (34 / 9 / 374).
Rewrite: use "34 products, 9 sectors, 374 repositories since 2018" everywhere; delete "100+ projects", "16 sectors", "40 programmes", "41 programmes", "Eight programmes", "33 more". On `/studio/case-studies` the "Your project here" card becomes: "More are being written up in the same format, named only where the client has cleared it." Effort **M**.

**9. `/studio/case-studies`, `/studio/case-studies/rockprosusa`, `quarry-dispatch-automation`, six systems pages — numbers the message house says may not be published.**
As it is: "Cycle time fell 38% in the first quarter after cutover, and held" and "The returned hours covered the build cost inside two quarters" (rockprosusa, quarry page); the message house frames all RockProsUSA figures as "first twelve months" and lists no payback claim. `/studio/case-studies` carries "96%+ bill lines auto-cleared" and "DSO ↓" for clients "under NDA", against rule §5.7 (no customer other than RockProsUSA by number). The systems pages state "30–40% of due accounts", "1–3% of freight spend", "8–12 person-days per site per month", "₹1.4 Cr", "₹10–30 lakh" as fact, against rule §5.6 (buyer-process figures are illustrations and must be framed as such).
Why it costs: a sharp CIO checks one number; if it is the wrong kind of number, every other one is discounted.
Rewrite: rockprosusa and quarry: "Cycle time was 38% lower over the first twelve months." Delete the payback sentence unless the founder clears it. Case-studies index: replace "96%+" with "clean lines clear automatically" and "DSO ↓" with "measured monthly"; systems pages: prefix each cost figure with "In a typical operation of this size," and drop the rupee conversions or convert to USD. Effort **S** per page, **M** total.

**10. `/brain/capabilities` — 1,875 words, 19 long sentences, and every capability listed twice.**
As it is: the "full set" lists each capability as its h1 and then, on the line beneath, the same h1 or a longer paraphrase: "A brain that interrupts freely is worse than no brain at all. / A brain that interrupts freely is worse than no brain at all." "A write that reports success is not believed on its word. / A write that reports success is not believed on its word." Above that, six zone intros re-run the depth argument the message house says this page must not carry.
Why it costs: this is the page a champion forwards internally to answer "but can it actually". At 1,875 words in aphorisms it answers "can it actually" with "read 34 more pages".
Rewrite: cut the six zone intros to one line each; render the list as **capability noun · one line of what it removes**, e.g. "Interruption budget · At most five nudges an hour per person, so nobody switches it off." "Confirm gate · Nothing is sent, deleted or shared until a person clicks." "Silence detection · A thread quiet for nine days shows up as an item, not a surprise." Target 700 words. Effort **M**.

**11. 34 capability pages — riddle h1s, subject in the breadcrumb only.**
As it is: "Nothing fires when nothing happens. Which is why nothing is the thing that costs you." (silence-detection); "Labelling a task and wiring a payment should not cost the same thinking." (stakes-routing); "The sentence is measured against the data, not against what you asked for." (claim-check); "Who is asking is never something the model gets to decide." (identity-and-scope); "Judgment is measured case by case, or it is not measured at all." (evaluation-suite); "One loop carries a change from emitted to finished." (signals-to-suite).
Why it costs: on a phone, the h1 is the page. Thirteen of the 34 need the breadcrumb to know the subject; six of them (claim-check, read-after-write, identity-and-scope, organization-memory, signals-to-suite, fifteen-verbs) also open with a first line a stranger cannot follow.
Rewrite pattern: h1 = plain capability sentence, aphorism demoted to the sub. Examples: silence-detection h1 "It notices when nothing has happened for too long." · stakes-routing "Small things run fast. Consequential things stop for a person." · claim-check "What it tells you is checked against what actually happened." · identity-and-scope "It can only act as the person who signed in." · evaluation-suite "Every wrong call becomes a test it can never fail again." · signals-to-suite "From something happening to something finished, one path." · read-after-write "It checks the change landed before it says so." · organization-memory "Your memory is yours. Here is what that means." · fifteen-verbs "Fifteen things it can be asked to do. The list only gets shorter." · judgment-pipeline "Three questions before it interrupts anyone." Effort **M** (34 h1s, ~10 first lines).

**12. Site chrome — two CTAs, and the one the message house names points at the wrong door.**
As it is: the nav carries both "Book a demo" (→ `/book-a-demo`, which has the only real form) and "Book a Diagnostic Sprint" (→ `/studio/contact`, a generic contact page). 76 of 78 pages' bottom CTA also goes to `/studio/contact`. The message house: one CTA phrase, and "every other page's CTA points [to `/book-a-demo`]". `/studio/index` adds a third: "Or ask first" with a chat box.
Why it costs: the buyer gets two next steps with different names, and the named one lands on a page that does not mention the Sprint form until step 2.
Rewrite: one button, "Book a Diagnostic Sprint", → `/book-a-demo`; retitle that page's h1 "Book a Diagnostic Sprint" with the current first paragraph beneath it ("Forty five minutes, no slideware …" becomes the demo that starts the Sprint). Keep `/studio/contact` for "write to a founder". Effort **L** (generated chrome, `scripts/genchrome.mjs`).

**13. `/brain`, `/brain/for/*`, `/brain/pricing` — what a CXO looks for in the first minute is missing or buried.**
As it is: on `/brain` the price band ($30K–$100K) is the last paragraph; who is behind it is nowhere on the page (only in the Resources menu); the Sprint fee is withheld on `/brain/pricing` ("a real fixed number you will have in writing"); run cost is "quoted at the end of the Sprint". What happens when it is wrong is answered well (`/brain` limits block, FAQ).
Why it costs: the buyer's four first-minute questions are cost, time to start, who, and failure mode. Three of four require scrolling or a second page.
Rewrite: add one line under the `/brain` hero "What changes on Monday" paragraph: "Two weeks to see it on one of your systems, fixed fee. Builds are $30K–$100K, priced before they start, by the two partners who built it." On `/brain/pricing`, either print the Sprint fee band or say why in one sentence: "The Sprint fee depends on which system we connect; you have it in writing before anything is scheduled, and it is a fraction of the build." Effort **S**.

**14. `/studio/how-we-work`, `/studio/blog/the-pyramid-cant-survive-agents`, `/studio`, rockprosusa — unsourced claims about named competitors.**
As it is: a table headed "Pyramid firm (Accenture / TCS / Infosys / DXC / Coforge …)" asserting "partner gives it ~10% of their time; the average pair of hands has 3 years' experience", "6–18 months; the first quarter is discovery decks", "Offshore delivery center you never meet"; then "Industry context: … the delivery-model gap is now well documented, not our marketing claim" with no source; "10× faster delivery, 1/10 the team, 3–4× lower cost"; rockprosusa "Quoted as a multi-quarter ERP programme by a traditional consultancy"; and "enterprise-grade governance" (banned word, twice).
Why it costs: the message house bans competitor weaknesses we cannot source, and the buyer has probably worked with one of those firms. Unsourced ratios read as the "10×" every vendor says.
Rewrite: drop the named firms from the table header ("A large systems integrator"), cut the three rows that assert their staffing, replace "well documented, not our marketing claim" with a link or delete, replace "10× / 1/10 / 3–4×" with the one thing we can show: "Two partners, a fixed price, weeks not quarters. The RockProsUSA build is the receipt." Remove "enterprise-grade". Effort **M**.

**15. `/studio` — 2,397 words, 22 long sentences, and most of it is somewhere else already.**
As it is: the RockProsUSA before/after table (verbatim from the case study), the four RockProsUSA numbers (twice on the page), the partner bios and the founder quote (verbatim from `/studio/about`), a 20-row project index (from `/studio/work`), the pricing block (from `/brain/pricing`), the three-phase engagement (from `/studio/how-we-work`), plus a chat assistant.
Why it costs: this is the second-most-visited page after `/brain` and it takes four minutes on a phone. The message house rule is "link to the page that owns the claim".
Rewrite: keep the hero, the four receipts once with the source note, the "why one company" section, three cards (case study, how we work, the partners), one CTA. Everything else becomes a link. Target 600 words. Effort **L**.

### The rest, in order

**16.** Site-wide, **"signals"** undefined at first use on 33 pages. On `/brain` the first paragraph says "It reads the signals those tools already emit". Rewrite: "It reads what those tools already record, a ticket opened, a date moved, an invoice sent". Then the word can stay. **M**.

**17.** Site-wide, **"the model"** on 21 pages meaning the AI. Replace with "the AI" everywhere except `/brain/architecture` and `identity-and-scope`, where a one-time "the AI (the model)" is fine. **M**.

**18.** `/brain/roadmap` — tags rendered as concatenated pairs: "MailMemory", "FilesContext", "GraphJudgmentHonesty", "CostJudgment". Read on a phone these are nonsense words. Either space and lowercase them ("mail · memory") or remove. **S**.

**19.** `/brain/changelog` — the "Standing capability" entry: "A write re-read before it is believed, the sentence checked against what the tools returned, and honest refusal. All of it predates this log." Rewrite: "It checks a change landed before it says so, checks what it tells you against what happened, and says no when it cannot do something." Also "log" is in the banned family; say "predates this page". **S**.

**20.** `/brain/compare` — jargon inside the decision table: "Yes, three checks first", "Connect it and declare it", "The estate, the graph, the confirm rules". Rewrite cells: "Yes, after deciding it is worth your time", "Connect it; nothing in the Brain is rewritten", "Your systems, the map between them, and the rules on what needs a yes". **S**.

**21.** Four use-case pages — the identical "Four mechanisms, not four features" block. It is the same 60 words on all four, and it re-runs 71/287 and 40/5. Replace with one line plus a link: "What had to be true: your systems as they are, one folder per client, a click before anything leaves, and a cap on interruptions. How each works." **S**.

**22.** `/book-a-demo` — "There is no calendar widget on this page on purpose, the site loads nothing from anyone else." Written for us. Cut. Also "45" appears four times on a 690-word page. **S**.

**23.** `/studio/case-studies` — "Pick the problem you think is the hardest one you have. We will build a working proof of concept, not a slide about it, and let the result decide whether we earn the long-term build." This is a third offer (a free PoC) that contradicts `/brain/objections` #8 ("We will not work for free") and the Sprint. Cut the paragraph; open with the RockProsUSA card. **S**.

**24.** `/studio/about` — "WorkElate, our AI-native operating system for agencies" contradicts the product zone's buyer (a 200 to 2,000 person company). Rewrite: "WorkElate, the work platform we build and sell". Same on `/studio/contact`. **S**.

**25.** `/studio/blog` index — "Almost nobody shows you the log", "what the logs showed"; `ar-followup-automation` — "the answer is in the log, timestamped". Banned family (audit and logging are not a selling point). Rewrite blog: "Almost nobody shows you the number that moved." AR page: "the answer is one screen, not a memory." **S**.

**26.** `/studio` and `/studio/work` — five em dashes in body copy (banned mechanic). **S**.

**27.** `/brain/glossary` — "Verb: One of the 15 things the model may want". Rewrite: "One of the fifteen things it can be asked to do". "Business object: One addressable noun the system can act on" → "One kind of thing it can act on". **S**.

**28.** `/brain/capabilities/fifteen-verbs` — the lede opens with the raw verb list "find, read, research, recall, remember, ask, create, edit, improve, delete, send, share, schedule, assign, judge." and the page says 15 seven times. Move the list to the figure caption; say the number once. **S**.

**29.** `/brain/capabilities/organization-memory` — lede: "Every stored fact names the organization it belongs to, and that field is required, not a filter applied on the way out. Retrieval runs inside that fence, the fence is being extended across the rest of the data layer…" This is a database description. Rewrite lede: "What it remembers about your company stays with your company. Every fact it keeps is stamped with whose it is, and it only ever reads yours." Keep the honest limit about the data layer in the limits block. **S**.

**30.** `/brain/capabilities/judgment-pipeline` — lede "Candidates are gathered, mechanical fences are applied, and only what survives is put to the model, once". Rewrite: "First the cheap checks: is this inside the hourly cap, has it been raised already, is it this person's. Only then does the AI get one question: does this deserve this person now, and why." **S**.

**31.** `/brain/capabilities/honest-refusal` — "a request either resolves to an address under one of 15 verbs or it does not, and there is no third state where the closest match is quietly chosen." Rewrite: "Either it knows exactly what you asked for, or it says so. It never quietly does the nearest thing instead." **S**.

**32.** 15 of the 34 capability pages have no CTA row under the lede (claim-check, confirm-gate, drafting, evaluation-suite, fifteen-verbs, filing-artifacts, honest-refusal, identity-and-scope, move-and-assign, multi-step-sequences, one-continuous-thread, read-after-write, record-updates, signals-to-suite, twelfth-app); the other 19 carry "Book a Diagnostic Sprint · See it running first". The same 15 format their related links as "Use case, mail triage" where the other 19 write "Use case: mail triage". Two authors, one template; add the row and match the punctuation. **S**.

**33.** `/brain/for/revenue` — "Four numbers behind noticing the silence" mixes a product default (5), a RockProsUSA receipt (2,140 invoices, on a revenue page), the Sprint length (2) and the price ($30K). Four numbers of four different kinds is not a proof block. Replace 2,140 with "11 days, the quiet gap in the story above, is the kind of thing that becomes an item" or drop the block to three. **S**.

**34.** `/studio/how-we-work` and `/studio` — "The verify loop: nobody grades their own homework … a deterministic verification gate … This is how a 2-person firm ships with enterprise-grade governance." Our engineering process, in our words. Rewrite: "Nothing is called done until it runs on your data and a check we cannot talk our way past says so." **S**.

**35.** Six `/studio/systems/*` pages — "Runs on the same delivery spine proven at RockProsUSA" / "descends from the RockProsUSA invoice pipeline" / "Built on the same agent spine". "Spine" is internal. Rewrite: "The same system that runs at RockProsUSA, where …". **S**.

**36.** `/brain/capabilities/twelfth-app` — h1 "The twelfth system has to cost what the second one cost" is good; the body is engineering ("no new branch, no name in a list and no prompt section", "hand-kept coverage tables remain, tracked as debt"). Keep the h1 and the Monday line; cut "How it works" to one sentence: "Each app tells the Brain what it records and what it can do. The Brain keeps no list to update, so there is nothing to forget." **S**.

**37.** `/brain/proof` — "Built, wired and proven are different words here" is our internal definition-of-done vocabulary. Rewrite: "Where a thing only exists in code we say so. What has shipped is dated on the changelog." **S**.

**38.** `/brain/getting-started` — good page; the single-digit numbers (3, 1, 2, 5, 6, 8) repeat because of the day/week labels. Fine. One fix: "the blast radius of the Sprint is what that credential can reach" → "the Sprint can see only what that one credential can see". **S**.

**39.** `/studio/contact` — "WE_AINA is two accountable partners and an agent fleet." Undefined "agent fleet" in the first line of the page a buyer writes from. Rewrite: "WE_AINA is two partners and the Brain doing the volume work." **S**.

**40.** `/brain/capabilities/context-assembly` — "Retrieval is the improvable surface … it never contains a branch that decides a business outcome." Our architecture rule. Rewrite: "When an answer is bad, it is almost always because the deciding fact was not in front of it. That is what we improve, never a hand-written rule." **S**.

---

## What is not in this list

Sentence length and reading grade are fine on every page but `/studio/case-studies` (FK 9.0) and the two blog posts (average sentence 13–15 words), and those are essays. The banned brochure words (seamless, leverage, unlock, transformative, world-class, cutting-edge, game-changing, revolutionary, "contact us") do not appear anywhere. The four use-case walks, the three role pages, `/brain/pricing`, `/brain/getting-started`, `/brain/objections` and the four compare children are at the bar and should be the template for the rest: a plain h1, one Monday line, a walk with times on it, a limits block, one CTA.

Not verified: rendered layout, images, or how any page reads on a real phone. This audit read the prose in source order; a line that is fine in text may still be a wall on a 400px screen, and that is a separate look.
