import { chromium } from "playwright";
const b = await chromium.launch({ headless: false, args: ["--disable-blink-features=AutomationControlled", "--start-maximized"] });
const ctx = await b.newContext({ viewport: null, locale: "en-US",
  userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36" });
const p1 = await ctx.newPage();
await p1.addInitScript(() => Object.defineProperty(navigator, "webdriver", { get: () => undefined }));
try {
  await p1.goto("https://www.infosys.com/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await p1.waitForTimeout(6000);
  try { await p1.click("#onetrust-accept-btn-handler", { timeout: 3000 }); } catch {}
  await p1.waitForTimeout(2000);
  await p1.screenshot({ path: process.env.SCRATCH + "/infyH-1.png" });
  for (const [y, n] of [[1100,2],[2400,3],[3800,4]]) {
    await p1.evaluate(v => scrollTo(0, v), y); await p1.waitForTimeout(2000);
    await p1.screenshot({ path: process.env.SCRATCH + `/infyH-${n}.png` });
  }
  await p1.evaluate(() => scrollTo(0, 0));
} catch (e) { console.error("infosys err:", e.message); }
const p2 = await ctx.newPage();
await p2.addInitScript(() => Object.defineProperty(navigator, "webdriver", { get: () => undefined }));
try {
  await p2.goto("https://www.bain.com/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await p2.waitForTimeout(5000);
  await p2.screenshot({ path: process.env.SCRATCH + "/bainH-1.png" });
} catch (e) { console.error("bain err:", e.message); }
const p3 = await ctx.newPage();
await p3.goto("http://localhost:4310", { waitUntil: "domcontentloaded" }).catch(()=>{});
console.log("browser open — leaving it running for manual inspection");
await new Promise(r => setTimeout(r, 1800000)); // keep open 30 min
await b.close();
