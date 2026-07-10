// Vibrant abstract artwork (Infosys-style 3D-ribbon feel) as self-contained
// SVGs — gradients live INSIDE image assets, never in CSS.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT = path.join(import.meta.dirname, "..", "site", "img");
mkdirSync(OUT, { recursive: true });

const rnd = seed => { let s = seed >>> 0; return () =>
  (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };

// palette families — blue-led, Infosys-adjacent vibrancy
// v4 palette law: white/blue corporate — every family stays in the blue
// register (no violets, greens, oranges); variety comes from seeds + tone.
const FAMS = {
  azure:    ["#0B5FFF", "#7FB0FF", "#B7E3FF", "#0A1F44"],
  glacier:  ["#2E7CF6", "#9AD7FF", "#EAF6FF", "#0A2B55"],
  midnight: ["#0B5FFF", "#3D7DF2", "#7FB0FF", "#081733"],
  ice:      ["#7FB0FF", "#B7E3FF", "#EAF6FF", "#0D2E5C"],
  cobalt:   ["#0846C4", "#0B5FFF", "#9AD7FF", "#071B3A"]
};

function ribbons(name, famKey, seed, W = 1200, H = 800) {
  const R = rnd(seed);
  const [c1, c2, c3, bg] = FAMS[famKey];
  let defs = "", body = "";
  const N = 7;
  for (let i = 0; i < N; i++) {
    const gid = `g${i}`;
    const stops = [c1, c2, c3];
    const a = stops[i % 3], b = stops[(i + 1) % 3];
    defs += `<linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
    // flowing ribbon: two roughly-parallel bezier edges joined
    const y0 = H * (0.15 + R() * 0.7), amp = 90 + R() * 190, th = 26 + R() * 90;
    const x1 = -100, x2 = W + 100;
    const cxa = W * (0.2 + R() * 0.2), cxb = W * (0.6 + R() * 0.2);
    const ya = y0 - amp * (R() - 0.5) * 2, yb = y0 + amp * (R() - 0.5) * 2;
    const rot = (R() - 0.5) * 26;
    body += `<g transform="rotate(${rot.toFixed(1)} ${W / 2} ${H / 2})" opacity="${(0.55 + R() * 0.4).toFixed(2)}">
      <path d="M ${x1} ${y0} C ${cxa} ${ya}, ${cxb} ${yb}, ${x2} ${y0 + (R() - 0.5) * 160}
               L ${x2} ${y0 + (R() - 0.5) * 160 + th} C ${cxb} ${yb + th * 1.4}, ${cxa} ${ya + th * 1.4}, ${x1} ${y0 + th} Z"
            fill="url(#${gid})"/></g>`;
  }
  // soft grain dots
  let dots = "";
  for (let i = 0; i < 40; i++)
    dots += `<circle cx="${(R() * W).toFixed(0)}" cy="${(R() * H).toFixed(0)}" r="${(1 + R() * 2.5).toFixed(1)}" fill="#FFFFFF" fill-opacity="${(R() * 0.35).toFixed(2)}"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<defs>${defs}
<radialGradient id="vig" cx="0.5" cy="0.42" r="0.85">
  <stop offset="0" stop-color="${bg}" stop-opacity="0"/><stop offset="1" stop-color="${bg}" stop-opacity="0.55"/>
</radialGradient></defs>
<rect width="${W}" height="${H}" fill="${bg}"/>
${body}${dots}
<rect width="${W}" height="${H}" fill="url(#vig)"/>
</svg>`;
  writeFileSync(path.join(OUT, `${name}.svg`), svg);
  console.log(`wrote site/img/${name}.svg`);
}

ribbons("art-hero", "azure", 11, 1920, 1080);
ribbons("art-case-rockpros", "glacier", 23);
ribbons("art-case-citisense", "ice", 37);
ribbons("art-case-logistics", "cobalt", 51);
ribbons("art-case-services", "midnight", 67);
ribbons("art-insight-1", "glacier", 83);
ribbons("art-insight-2", "azure", 97);
ribbons("art-insight-3", "midnight", 113);
