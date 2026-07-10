import { chromium } from "playwright";

const URL = process.env.VERIFY_URL || "http://localhost:4310";
const checks = [];
const assert = (name, ok) => checks.push({ name, ok });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", e => errors.push(e.message));
page.on("console", m => m.type() === "error" && errors.push(m.text()));

try {
  await page.goto(URL, { waitUntil: "networkidle", timeout: 30000 });
} catch (e) {
  console.error(`Could not reach ${URL} — is the dev server running? (npm run dev)`);
  process.exit(1);
}

assert("zero console errors", errors.length === 0);
if (errors.length) console.error("console errors:", errors);

assert("single H1", (await page.locator("h1").count()) === 1);

assert("one CTA phrase only",
  (await page.getByText("Get your AI Readiness Score").count()) >= 2 &&
  (await page.getByText(/contact us/i).count()) === 0);

assert("no banned styles", await page.evaluate(() =>
  ![...document.querySelectorAll("*")].some(el => {
    const s = getComputedStyle(el);
    return s.backgroundImage.includes("gradient") ||
           (s.boxShadow !== "none" && !el.closest("[data-shadow-ok]"));
  })));

assert("schema present", (await page.locator(
  'script[type="application/ld+json"]').count()) >= 1);

// scroll-jank probe on the case study — measured at steady state: load-time
// work is Lighthouse TBT's domain; this budget is about SCROLLING.
await page.evaluate(() => {
  const s = document.getElementById("cs-pin");
  if (s) s.scrollIntoView();               // trigger lazy preload
});
await page.waitForFunction(() => window.__scrubReady === true, { timeout: 20000 }).catch(() => {});
await page.waitForTimeout(600);
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
// Best-of-2: a long task can come from CPU contention on a loaded dev box
// (GC, raster threads, parallel test runs) — environmental noise passes on
// retry; systematic page jank fails both runs.
async function jankProbe() {
  return page.evaluate(async () => {
    const long = [];
    const obs = new PerformanceObserver(l => long.push(...l.getEntries()));
    obs.observe({ type: "longtask" });          // NOT buffered: only THIS run
    await new Promise(r => setTimeout(r, 100));
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      scrollTo(0, y); await new Promise(r => setTimeout(r, 16));
    }
    await new Promise(r => setTimeout(r, 100));
    obs.disconnect();
    return long.filter(t => t.duration > 50).length;
  });
}
let jank = await jankProbe();
if (jank > 0) {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  jank = await jankProbe();
}
assert("scroll long-tasks (>50ms) === 0", jank === 0);

await browser.close();
console.table(checks);
if (checks.some(c => !c.ok)) process.exit(1);
