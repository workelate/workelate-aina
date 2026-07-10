# WE_AINA — Complete Prompt Pack + Loop Coding Engine

Companion to the blueprint. Blueprint had Prompt #1 (master one-shot).
This file has everything else: 7 more prompts + the two loops that make
the site work — the scroll-frame loop (code) and the agentic build loop
(Claude Code workflow).

---

## PART A — THE PROMPT PACK

### Prompt 1 — Master one-shot
Already in the blueprint (section 6). Run this first, fresh session.

### Prompt 2 — Visual generation (run via image/video MCP, or standalone)
```
Generate a cinematic visual set for an industrial AI agency website.
Style lock across ALL assets: dark low-key lighting, safety-orange
accents, shallow depth of field, 4K, moody, anamorphic feel. No people
smiling at cameras. No stock-photo energy.

SET 1 — HERO LOOP (1 video, 8s seamless loop, 4K):
Slow aerial drift over a decorative rock quarry at dusk, conveyor
belts running, orange machine lights against blue-hour terrain.

SET 2 — CASE STUDY FRAME SEQUENCE (1 video, 20s, 4K — I will extract
frames): Continuous push-in journey: quarry aerial → conveyor detail →
control room with glowing dashboards → close-up of a screen showing
an agent activity log → pull back to reveal calm empty office at
night, systems running alone.

SET 3 — STILLS (4 images): (a) control-room monitor with terminal
text, (b) haul truck under sodium lights, (c) hands NOT touching a
keyboard while screen works, (d) abstract macro of crushed rock
texture for section backgrounds.
```

### Prompt 3 — Case-study scroll section (run after master build)
```
Add the pinned scroll-scrub sequence to the RockProsUSA section using
the frame loop engine in /js/scrollFrames.js (already in repo).
Frames live in /assets/frames/casestudy/ (frame_001.webp …
frame_160.webp). Section pin height 500vh. At scroll progress 0.15,
0.35, 0.55, 0.75, 0.9 fade in monospace stat callouts:
"13 quarries. One system." / "Dispatch cycle −38%" / "2,140 invoices,
zero touches" / "11,200 ops hours returned" / "Every action logged.
Every claim auditable."
Mobile (<768px): replace with 5 static frames + same callouts,
standard vertical scroll. Zero jank: canvas rendering, frames
preloaded with a progress indicator, rAF-gated draws.
```

### Prompt 4 — AI Readiness Score widget (frontend)
```
Build the Score widget as a self-contained component embedded in the
final CTA section. 5 steps, one question per screen, progress bar,
keyboard navigable:
1. Industry (building materials / manufacturing / logistics / other)
2. Annual revenue band (<₹5Cr / ₹5–50Cr / ₹50–500Cr / $ equivalents)
3. Team size (<10 / 10–50 / 50–250 / 250+)
4. Biggest manual bottleneck (free text, 140 chars)
5. Current stack (multi-select: Excel/WhatsApp, Tally/ERP, custom
   software, already using AI)
Then email capture: "Your score report arrives in 10 minutes."
Scoring logic client-side: weight revenue band 40%, team 20%,
stack maturity 20%, bottleneck keyword match 20%. Score ≥60 =
qualified. POST full payload {answers, score, qualified, ts} to
/api/score. On success show score dial animation + one-line verdict.
State in memory only, no localStorage. Monospace styling consistent
with the receipt aesthetic.
```

### Prompt 5 — Score report generator (the funnel's live demo)
```
Build /api/score as a Node endpoint. On submission:
1. Store lead in SQLite (leads.db): answers, score, qualified, ts.
2. Call the Anthropic API (claude-sonnet-4-6) with a system prompt:
   "You are WE_AINA's diagnostic engine. Given this business profile,
   produce a 1-page report: 3 specific automation opportunities for
   THIS business (name the workflow, the system we'd build, the
   estimated hours/money recovered — conservative numbers), then one
   paragraph on why building-materials operators specifically leak
   money here. Blunt operator tone. No buzzwords. End with the
   Diagnostic Sprint offer."
3. Render report to branded HTML email (dark, monospace accents) and
   send via SMTP. Qualified leads: add Calendly link for the Sprint.
   Unqualified: add newsletter opt-in instead.
4. Log every step to an audit table — we show receipts, so keep them.
```

### Prompt 6 — Programmatic /systems/ pages
```
Generate 6 SEO pages from one template at /systems/[slug]:
quarry-dispatch-automation, plant-production-reporting,
dealer-order-management, freight-reconciliation,
ar-followup-automation, compliance-documentation.
Template per page: H1 (pain as outcome), cost-of-problem block with
2 concrete numbers, "the system" section (what we build, 4 bullets
max as prose), RockPros proof line, Score CTA, FAQ block (4 Q&As),
FAQPage + Service JSON-LD. 900–1100 words each, written in the same
blunt operator voice — no two pages sharing sentences. Add all 6 to
sitemap.xml and crosslink from the service-lines section on home.
```

### Prompt 7 — Edit-loop prompt (reusable, for every revision pass)
```
Review [section] against these locked rules before changing anything:
one typeface, #0A0A0A/#F4F1EC/#FF5C00 only, no cards/shadows/
gradients, receipts (real numbers) over adjectives, one CTA
("Get your AI Readiness Score"), motion subtle except the case-study
scrub. Now apply this change: [CHANGE]. If the change violates a
locked rule, push back and propose the compliant version instead of
silently complying. Then run the verify loop (npm run verify) and
report results before declaring done.
```

### Prompt 8 — Pre-launch audit (Council-of-Five style)
```
Audit the full site as five experts, each with a verdict + top 3 fixes:
1. Conversion strategist — does every scroll depth push toward the
   Score? Any leaks?
2. Technical SEO — schema validity, CWV, crawlability of programmatic
   pages, internal linking.
3. GEO/AEO analyst — would an LLM cite this site for "AI transformation
   building materials"? What declarative statements are missing?
4. Brand/design director — where does it smell like a template or
   fake-agency? Kill list.
5. Performance engineer — Lighthouse on 3G mobile, frame-loop memory
   footprint, preload strategy.
Output one prioritized fix list, max 12 items, effort-tagged S/M/L.
```

---

## PART B — LOOP #1: THE SCROLL-FRAME ENGINE (the actual code)

This is the trick behind every "3D cinematic scroll" site: it is NOT
3D. It's a video exported as frames, scrubbed by scroll position,
drawn to a canvas. Deterministic, no WebGL, works everywhere.

### Step 1 — Frame extraction pipeline (ffmpeg)
```bash
# 20s source video → 160 frames (8 fps), webp for size
mkdir -p assets/frames/casestudy
ffmpeg -i casestudy.mp4 -vf "fps=8,scale=1920:-1" -quality 82 \
  assets/frames/casestudy/frame_%03d.webp

# Rule of thumb: pin-height 500vh ≈ 150–180 frames feels buttery.
# Fewer frames per vh = steppy; more = wasted bandwidth.
```

### Step 2 — The loop itself (`/js/scrollFrames.js`)
```js
class ScrollFrames {
  constructor({ section, canvas, path, count, pad = 3, ext = "webp" }) {
    this.section = section;          // the pinned wrapper (e.g. 500vh)
    this.canvas  = canvas;
    this.ctx     = canvas.getContext("2d");
    this.count   = count;
    this.frames  = new Array(count);
    this.current = -1;
    this.src = i => `${path}/frame_${String(i + 1).padStart(pad, "0")}.${ext}`;
  }

  // ---- PRELOAD LOOP: first/last/middle first, then fill gaps ----
  async preload(onProgress) {
    const order = this.priorityOrder();     // 0, N-1, N/2, N/4, 3N/4 ...
    let loaded = 0;
    const load = i => new Promise(res => {
      const img = new Image();
      img.onload = img.onerror = () => {
        this.frames[i] = img;
        onProgress(++loaded / this.count);
        res();
      };
      img.src = this.src(i);
    });
    // 6 parallel workers pulling from the queue
    const queue = [...order];
    await Promise.all(Array.from({ length: 6 }, async () => {
      while (queue.length) await load(queue.shift());
    }));
  }

  priorityOrder() {
    const seen = new Set(), out = [];
    const push = i => { i = Math.round(i);
      if (i >= 0 && i < this.count && !seen.has(i)) { seen.add(i); out.push(i); } };
    // binary-subdivision order: coarse coverage first
    let step = this.count;
    while (step >= 1) {
      for (let i = 0; i < this.count; i += step) push(i);
      step = Math.floor(step / 2);
    }
    return out;
  }

  // ---- SCROLL → FRAME MAP ----
  progress() {
    const r = this.section.getBoundingClientRect();
    const total = r.height - window.innerHeight;   // scrubbing distance
    return Math.min(1, Math.max(0, -r.top / total));
  }

  frameFor(p) {
    return Math.min(this.count - 1, Math.floor(p * this.count));
  }

  // ---- DRAW LOOP: rAF-gated, draws only on frame change ----
  start() {
    const fit = () => {                    // cover-fit, devicePixelRatio-aware
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width  = innerWidth  * dpr;
      this.canvas.height = innerHeight * dpr;
    };
    fit(); addEventListener("resize", fit);

    const draw = () => {
      const idx = this.frameFor(this.progress());
      const img = this.frames[idx] || this.nearestLoaded(idx);
      if (img && idx !== this.current) {
        this.current = idx;
        const { width: cw, height: ch } = this.canvas;
        const s = Math.max(cw / img.width, ch / img.height); // cover
        const w = img.width * s, h = img.height * s;
        this.ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
        this.section.dispatchEvent(new CustomEvent("frame", {
          detail: { index: idx, progress: idx / (this.count - 1) }
        }));
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
  }

  nearestLoaded(idx) {                      // graceful while preloading
    for (let d = 1; d < this.count; d++) {
      if (this.frames[idx - d]) return this.frames[idx - d];
      if (this.frames[idx + d]) return this.frames[idx + d];
    }
    return null;
  }
}
```

### Step 3 — Pin + callouts wiring
```html
<section class="pin-wrap" id="casestudy" style="height:500vh">
  <div class="pin" style="position:sticky;top:0;height:100vh">
    <canvas id="cs-canvas"></canvas>
    <div class="callout" data-at="0.15">13 quarries. One system.</div>
    <div class="callout" data-at="0.35">Dispatch cycle −38%</div>
    <!-- ... -->
  </div>
</section>
<script type="module">
  const sf = new ScrollFrames({
    section: document.getElementById("casestudy"),
    canvas:  document.getElementById("cs-canvas"),
    path: "/assets/frames/casestudy", count: 160
  });
  sf.preload(p => bar.style.width = p * 100 + "%").then(() => sf.start());

  // callout loop rides the same event — no second scroll listener
  const callouts = [...document.querySelectorAll(".callout")];
  sf.section.addEventListener("frame", e => {
    callouts.forEach(c =>
      c.classList.toggle("on", e.detail.progress >= +c.dataset.at &&
                                e.detail.progress <  +c.dataset.at + 0.18));
  });
</script>
```

### The four rules that keep it at 60fps
1. **Draw only on frame change** — scroll fires ~100×/s, frames change
   ~8×/s of scrolling. The `idx !== this.current` guard is the whole
   performance story.
2. **Canvas, never `<img src>` swaps** — src swapping causes decode
   jank; canvas draws pre-decoded bitmaps.
3. **Priority preload** — binary-subdivision order means the scrub is
   usable at ~15% loaded; `nearestLoaded` covers the gaps.
4. **Mobile gets stills** — `matchMedia("(max-width:768px)")` → skip
   the engine, render 5 static frames. Non-negotiable.

---

## PART C — LOOP #2: THE AGENTIC BUILD LOOP (Claude Code workflow)

Hardcode the nervous system, not the orchestration — same principle as
WAO. The repo enforces a build→verify→fix loop so Fable/Claude Code
can't declare "done" without receipts.

### Repo skeleton
```
we-aina/
├── CLAUDE.md
├── .claude/
│   ├── settings.json
│   ├── rules/design-system.md       # the locked rules from Prompt 7
│   ├── commands/verify.md           # /verify slash command
│   └── hooks/post-edit-verify.sh    # runs checks after every edit
├── scripts/verify.mjs
└── src/ ...
```

### CLAUDE.md (the loop contract)
```md
# WE_AINA build rules
1. Work in the loop: PLAN one section → BUILD → run `npm run verify`
   → FIX until green → only then move to the next section.
2. Never claim a section is done without pasting verify output.
3. Design system in .claude/rules/design-system.md is LAW. If a
   request conflicts, push back with the compliant alternative.
4. Section order: hero → ticker → shift → services → casestudy →
   process → founders → cta → footer. One section per loop iteration.
5. After casestudy section: run Lighthouse mobile; scrub-jank budget
   is 0 long tasks >50ms during scroll.
```

### scripts/verify.mjs (deterministic gate — no LLM verdicts)
```js
import { chromium } from "playwright";
const checks = [];
const assert = (name, ok) => checks.push({ name, ok });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }});
const errors = [];
page.on("pageerror", e => errors.push(e.message));
page.on("console", m => m.type() === "error" && errors.push(m.text()));
await page.goto("http://localhost:4321", { waitUntil: "networkidle" });

assert("zero console errors", errors.length === 0);
assert("single H1", await page.locator("h1").count() === 1);
assert("one CTA phrase only",
  (await page.getByText("Get your AI Readiness Score").count()) >= 2 &&
  (await page.getByText(/contact us/i).count()) === 0);
assert("no banned styles", await page.evaluate(() =>
  ![...document.querySelectorAll("*")].some(el => {
    const s = getComputedStyle(el);
    return s.backgroundImage.includes("gradient") ||
           (s.boxShadow !== "none" && !el.closest("[data-shadow-ok]"));
  })));
assert("schema present", await page.locator(
  'script[type="application/ld+json"]').count() >= 1);

// scroll-jank probe on the case study
await page.evaluate(() => window.scrollTo(0, 0));
const jank = await page.evaluate(async () => {
  const long = [];
  new PerformanceObserver(l => long.push(...l.getEntries()))
    .observe({ type: "longtask", buffered: true });
  for (let y = 0; y < document.body.scrollHeight; y += 400) {
    scrollTo(0, y); await new Promise(r => setTimeout(r, 16));
  }
  return long.filter(t => t.duration > 50).length;
});
assert("scroll long-tasks (>50ms) === 0", jank === 0);

await browser.close();
console.table(checks);
if (checks.some(c => !c.ok)) process.exit(1);
```

### .claude/hooks/post-edit-verify.sh
```bash
#!/usr/bin/env bash
# PostToolUse hook on Edit/Write for src/** — the receipt mechanism
npm run -s verify || {
  echo "VERIFY FAILED — fix before proceeding. Do not move to the next section."
  exit 2   # exit 2 feeds output back to Claude as a blocking correction
}
```

### The loop, stated once
```
PLAN (one section, one paragraph, no code)
  → BUILD (edit files)
  → VERIFY (deterministic script, hook-enforced)
  → green? next section : FIX and re-verify
  → after final section: Prompt 8 audit → fix list → one more loop
```

Same shape as verify-live's thesis: the agent never grades its own
homework — a deterministic script does, and the hook makes skipping it
impossible.
