// Contrast audit: every visible text node on every page, WCAG ratio vs
// effective background. Reports anything under 4.5:1 (3:1 for large text).
import { chromium } from "playwright";

const PAGES = ["/", "/how-we-work", "/about", "/case-studies", "/blog",
  "/blog/the-pyramid-cant-survive-agents", "/blog/receipts-over-decks",
  "/systems/quarry-dispatch-automation", "/systems/plant-production-reporting",
  "/systems/dealer-order-management", "/systems/freight-reconciliation",
  "/systems/ar-followup-automation", "/systems/compliance-documentation"];

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
let total = 0;
for (const path of PAGES) {
  await p.goto("http://localhost:4310" + path, { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  const bad = await p.evaluate(() => {
    const lum = (r, g, bl) => {
      const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl);
    };
    const parse = c => { const m = c.match(/[\d.]+/g)?.map(Number) || [0,0,0,1]; return m.length === 3 ? [...m, 1] : m; };
    const ratio = (c1, c2) => { const l1 = lum(...c1.slice(0,3)), l2 = lum(...c2.slice(0,3)); return (Math.max(l1,l2)+0.05)/(Math.min(l1,l2)+0.05); };
    const bgOf = el => {
      let n = el;
      while (n && n !== document.documentElement) {
        const bg = parse(getComputedStyle(n).backgroundColor);
        if (bg[3] > 0.5) return bg;
        n = n.parentElement;
      }
      return [250,252,255,1];
    };
    const out = [];
    for (const el of document.querySelectorAll("body *")) {
      if (!el.checkVisibility?.()) continue;
      const own = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 2);
      if (!own) continue;
      const cs = getComputedStyle(el);
      if (parseFloat(cs.opacity) === 0) continue;
      const fg = parse(cs.color);
      // blend fg alpha onto bg
      const bg = bgOf(el);
      const a = fg[3] ?? 1;
      const blended = [0,1,2].map(i => fg[i]*a + bg[i]*(1-a));
      const r = ratio(blended, bg);
      const size = parseFloat(cs.fontSize);
      const large = size >= 24 || (size >= 18.66 && parseInt(cs.fontWeight) >= 700);
      const min = large ? 3 : 4.5;
      if (r < min) {
        const sel = el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.split(" ").filter(Boolean).slice(0,2).join(".") : "");
        out.push({ sel, ratio: +r.toFixed(2), text: el.textContent.trim().slice(0, 40) });
      }
    }
    // dedupe by selector
    const seen = new Map();
    for (const o of out) if (!seen.has(o.sel) || seen.get(o.sel).ratio > o.ratio) seen.set(o.sel, o);
    return [...seen.values()];
  });
  if (bad.length) {
    console.log(`\n== ${path}`);
    bad.forEach(o => console.log(`  ${o.ratio}  ${o.sel}  "${o.text}"`));
    total += bad.length;
  }
}
console.log(`\nTOTAL low-contrast elements: ${total}`);
await b.close();
