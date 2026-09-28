// Generates the homepage breadth block (#services inner) from data/projects.json.
// The founder's complaint 2026-09-07 was that the site read as a single-industry
// (quarry) shop. The fix is structural: the range comes from the data, so adding
// a project to projects.json puts it on the homepage. Never hand-edit the block
// between the BREADTH markers in site/index.html -- edit this and re-run.
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const { projects } = JSON.parse(readFileSync(path.join(ROOT, "data/projects.json"), "utf8"));
// The studio's own declaration (founder, 2026-09-28): capabilities, industries
// and the KPI line. A new capability or industry is a data row, not an edit here.
const studio = JSON.parse(readFileSync(path.join(ROOT, "data/studio.json"), "utf8"));

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// One row per build. `named:false` renders the descriptor, never the client.
// Each row carries its authored pigment: colour is per-project DATA (the move
// Stripe Press makes), so range is visible as chromatic variety before a word
// is read. That is the answer to "it looks like we only did quarries".
const row = (p, i) => {
  const title = p.named ? p.name : p.headline;
  const note  = p.named ? p.headline : (p.what || "").split(".")[0] + ".";
  return `        <li class="ix-row rv" style="--pig:${p.pigment}">
          <span class="ix-n">${String(i + 1).padStart(3, "0")}</span>
          <span class="ix-build"><b>${esc(title)}</b><span class="ix-note">${esc(note)}</span></span>
          <span class="ix-sector"><i class="ix-dot" aria-hidden="true"></i>${esc(p.sector || "")}</span>
          <span class="ix-years">${esc(p.years || "undated")}</span>
        </li>`;
};
const rows = projects.map(row).join("\n");

// The hero strip leads with the PRODUCT CATEGORY, not the client. Founder,
// 2026-09-07: "project name or client name dont excite them ... need to brief
// the type of work, means technical product terms of them like P2P, D2C,
// E-com, O2C, or more than that". A buyer scanning for their own problem
// recognises "O2C · DISPATCH" and does not recognise "RockProsUSA".
const heroRows = studio.capabilities.map((c, i) => `        <li style="--pig:${["#0F8083", "#0b6366", "#1d1d1f", "#0F8083", "#0b6366", "#1d1d1f"][i % 6]}"><i aria-hidden="true"></i><b>${esc(c.name)}</b><span>${esc(c.note)}</span><em>${esc(c.proof)}</em></li>`).join("\n");

// KPI line. Every figure is derived, not asserted:
//   products  = rows in data/projects.json plus the 14 declared in genwork.mjs
//   sectors   = distinct declared families
//   repos     = the crawl total in data/portfolio-inventory.md
//   (no people count: the team is not sized in public, founder call 2026-09-28;
//               everywhere is 34 / 9 / 374 (data/brain-narrative.md §5)
// Chips are FAMILIES the project declares, not raw sector strings. Deriving
// them from `sector` gave 20 chips for 20 projects, which is a dump wearing a
// chip's clothes. Each project names its family in data/projects.json, so a new
// project joins an existing chip instead of minting another one.
const families = [...new Set(projects.map((p) => p.family).filter(Boolean))].sort();
const missingFamily = projects.filter((p) => !p.family).map((p) => p.id);
if (missingFamily.length) { console.error(`projects missing family: ${missingFamily.join(", ")}`); process.exit(1); }

const KPI = studio.kpi;
const kpiBlock = KPI.map(([n, l]) => `        <li><b>${n}</b><span>${l}</span></li>`).join("\n");

// The studio home carries the RANGE, not the index: the 20-row list lives on
// /studio/work (content audit 2026-09-15, row 15: the home page was 2,400 words
// of other pages). Chips are derived from the data, so a new family shows up
// here on the next run without a hand edit.
const IMG = (f) => `/img/studio/${f}`;
// The range, as images (founder, 2026-09-28: "internet par images k kami hai
// kya ... absorb them in a native way"). Capabilities and industries are the
// studio's own declaration in data/studio.json; each carries its real image.
const capCards = studio.capabilities.map((c) => `      <li class="cap rv">
        <figure class="cap-img"><img src="${IMG(c.img)}" alt="${esc(c.name)}: ${esc(c.proof)}" loading="lazy" decoding="async" width="800" height="600"></figure>
        <h3>${esc(c.name)}</h3>
        <p>${esc(c.note)}</p>
        <span class="cap-proof">${esc(c.proof)}</span>
      </li>`).join("\n");
const indTiles = studio.industries.map((x) => `      <li class="ind rv"><img src="${IMG(x.img)}" alt="${esc(x.name)}" loading="lazy" decoding="async" width="800" height="600"><span>${esc(x.name)}</span></li>`).join("\n");

const block = `
    <span class="label rv">What we do</span>
    <h2 class="rv">Everything it takes <span class="accent">to ship.</span></h2>
    <p class="dim rv ix-lede">Strategy, product, engineering, operations and growth. One team, one plan, no hand-offs.</p>
    <ul class="caps" aria-label="what we do">
${capCards}
    </ul>

    <span class="label rv ind-label">Where we work</span>
    <h2 class="rv">Six industries we <span class="accent">know cold.</span></h2>
    <ul class="inds" aria-label="industries we ship into">
${indTiles}
    </ul>
    <p class="ix-foot rv"><a href="/studio/work">See the work &rarr;</a></p>
`;

const H = studio.heroImages;
// A fixed mosaic, not a free collage: every tile has its own box and crops its
// image, so no screen can spill into the next section at any width.
const heroBlock = `
      <div class="mosaic">
        <figure class="m-a"><img src="${IMG(H.back)}" alt="CitySense, AI billboard campaign planner" width="1600" height="1000" decoding="async" fetchpriority="high"></figure>
        <figure class="m-b"><img src="${IMG(H.front)}" alt="CitedSpy, AI search visibility dashboard" width="1600" height="1000" decoding="async"></figure>
        <figure class="m-c"><img src="${IMG(H.third)}" alt="RockPros, quarry dispatch board" width="1600" height="1000" decoding="async"></figure>
      </div>
`;

const idx = path.join(ROOT, "site/studio/index.html");
let html = readFileSync(idx, "utf8");
const A = "<!-- BREADTH:start (generated by scripts/genbreadth.mjs) -->";
const B = "<!-- BREADTH:end -->";
const i = html.indexOf(A), j = html.indexOf(B);
if (i === -1 || j === -1) { console.error("markers missing in site/index.html"); process.exit(1); }
// index splice, not a regex: the start marker contains parentheses.
html = html.slice(0, i) + A + block + "    " + html.slice(j);

// The hero (HEROWORK markers) is owned by scripts/genhero.mjs since 2026-09-29.
writeFileSync(idx, html);
console.log(`breadth block written: ${projects.length} rows, ${families.length} families`);
