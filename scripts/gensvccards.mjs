// Service-card artwork: abstract line-art SVGs per system, navy/blue palette.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT = path.join(import.meta.dirname, "..", "site", "img");
mkdirSync(OUT, { recursive: true });

const NAVY = "#0A1F44", BLUE = "#0B5FFF", LIGHT = "#7FB0FF", PAPER = "#FAFCFF", GREEN = "#0ACF6B";
const W = 800, H = 440;

const wrap = inner => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="${NAVY}"/>
<g stroke-linecap="round">${inner}</g>
<rect x="0" y="${H - 6}" width="${W}" height="6" fill="${BLUE}"/>
</svg>`;

const node = (x, y, r, c = BLUE, o = 1) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" fill-opacity="${o}"/>`;
const ring = (x, y, r, c = LIGHT) => `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="${c}" stroke-width="2" stroke-opacity="0.6"/>`;
const line = (x1, y1, x2, y2, c = LIGHT, w2 = 2, o = 0.55) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c}" stroke-width="${w2}" stroke-opacity="${o}"/>`;
const bar = (x, y, w2, h2, c = BLUE, o = 0.85) => `<rect x="${x}" y="${y}" width="${w2}" height="${h2}" fill="${c}" fill-opacity="${o}"/>`;

const CARDS = {
  // dispatch: route network
  "svc-dispatch": wrap([
    line(90, 340, 260, 180), line(260, 180, 470, 260), line(470, 260, 690, 120),
    line(260, 180, 500, 90), line(470, 260, 300, 360),
    node(90, 340, 12), node(260, 180, 16), node(470, 260, 14), node(690, 120, 12), node(500, 90, 10, LIGHT), node(300, 360, 10, LIGHT),
    ring(260, 180, 30), ring(470, 260, 26),
    node(575, 195, 6, GREEN)
  ].join("")),
  // reporting: rising bars + line
  "svc-reporting": wrap([
    bar(120, 300, 52, 80, LIGHT, 0.4), bar(210, 260, 52, 120, LIGHT, 0.55), bar(300, 220, 52, 160, BLUE, 0.8),
    bar(390, 180, 52, 200, BLUE), bar(480, 130, 52, 250, BLUE),
    line(120, 280, 540, 90, GREEN, 3, 0.9), node(540, 90, 8, GREEN),
    line(80, 390, 720, 390, LIGHT, 2, 0.3)
  ].join("")),
  // orders: chat bubbles → queue
  "svc-orders": wrap([
    `<rect x="100" y="110" width="240" height="90" rx="14" fill="${LIGHT}" fill-opacity="0.25"/>`,
    `<rect x="140" y="230" width="240" height="90" rx="14" fill="${BLUE}" fill-opacity="0.9"/>`,
    bar(500, 120, 200, 34, LIGHT, 0.35), bar(500, 174, 200, 34, LIGHT, 0.5), bar(500, 228, 200, 34, BLUE, 0.9), bar(500, 282, 200, 34, LIGHT, 0.5),
    line(390, 265, 490, 245, GREEN, 3, 0.9), node(490, 245, 7, GREEN)
  ].join("")),
  // reconciliation: two columns matching
  "svc-recon": wrap([
    bar(150, 100, 160, 40, LIGHT, 0.45), bar(150, 170, 160, 40, LIGHT, 0.45), bar(150, 240, 160, 40, LIGHT, 0.45), bar(150, 310, 160, 40, LIGHT, 0.45),
    bar(490, 100, 160, 40, BLUE, 0.85), bar(490, 170, 160, 40, BLUE, 0.85), bar(490, 240, 160, 40, BLUE, 0.85), bar(490, 310, 160, 40, BLUE, 0.85),
    line(310, 120, 490, 120, GREEN, 3, 0.9), line(310, 190, 490, 190, GREEN, 3, 0.9),
    line(310, 260, 490, 330, "#FF6A1A", 3, 0.9), line(310, 330, 490, 260, "#FF6A1A", 3, 0.9)
  ].join("")),
  // AR: cash cycle
  "svc-ar": wrap([
    ring(400, 220, 120, LIGHT), ring(400, 220, 121, LIGHT),
    `<path d="M 400 100 A 120 120 0 0 1 520 220" fill="none" stroke="${GREEN}" stroke-width="6"/>`,
    node(400, 100, 10, GREEN), node(520, 220, 8, BLUE), node(400, 340, 8, BLUE), node(280, 220, 8, BLUE),
    bar(370, 195, 60, 8, PAPER, 0.8), bar(370, 215, 44, 8, PAPER, 0.5), bar(370, 235, 52, 8, PAPER, 0.5)
  ].join("")),
  // compliance: document + check grid
  "svc-compliance": wrap([
    `<rect x="150" y="90" width="220" height="270" rx="8" fill="none" stroke="${LIGHT}" stroke-width="2.5" stroke-opacity="0.7"/>`,
    bar(180, 130, 150, 10, LIGHT, 0.5), bar(180, 160, 120, 10, LIGHT, 0.5), bar(180, 190, 140, 10, LIGHT, 0.5), bar(180, 220, 100, 10, LIGHT, 0.5),
    node(480, 140, 10, GREEN), node(480, 200, 10, GREEN), node(480, 260, 10, GREEN), node(480, 320, 10, "#FF6A1A"),
    bar(510, 132, 140, 12, LIGHT, 0.5), bar(510, 192, 160, 12, LIGHT, 0.5), bar(510, 252, 120, 12, LIGHT, 0.5), bar(510, 312, 150, 12, LIGHT, 0.5)
  ].join(""))
};

for (const [name, svg] of Object.entries(CARDS)) {
  writeFileSync(path.join(OUT, `${name}.svg`), svg);
  console.log(`wrote site/img/${name}.svg`);
}
