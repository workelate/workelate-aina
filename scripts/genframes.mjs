// Procedural placeholder frames for the case-study scrub.
// Stand-in until the real 20s source video exists (Prompt 2, SET 2) —
// then: ffmpeg -i casestudy.mp4 -vf "fps=8,scale=1920:-1" frame_%03d.webp
// Same count, same path, engine untouched.
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT = path.join(import.meta.dirname, "..", "assets", "frames", "casestudy");
mkdirSync(OUT, { recursive: true });

const COUNT = 160, W = 1920, H = 1080;
const INK = "#0A1F44", BONE = "#FAFCFF", ORANGE = "#FF6A1A", GREEN = "#3B82F6"; // GREEN var now carries brand blue

// deterministic prng
const rnd = seed => { let s = seed >>> 0; return () =>
  (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296; };

const ease = t => t * t * (3 - 2 * t);
const ramp = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));

// static scene geometry (seeded once, camera moves through it)
const R = rnd(20260708);
const ridges = Array.from({ length: 5 }, (_, k) => ({
  y: 0.45 + k * 0.13,
  pts: Array.from({ length: 13 }, (_, i) => ({ x: i / 12, dy: (R() - 0.5) * 0.09 }))
}));
const lights = Array.from({ length: 18 }, () => ({
  x: R(), y: 0.5 + R() * 0.45, r: 2 + R() * 4, tw: R()
}));
const logLines = Array.from({ length: 9 }, () => 0.25 + R() * 0.65);

for (let f = 0; f < COUNT; f++) {
  const t = f / (COUNT - 1);
  // camera: push-in zoom 1 → 2.6 across the journey
  const zoom = 1 + ease(t) * 1.6;
  const cx = W / 2 + Math.sin(t * Math.PI) * 120;
  const cy = H * (0.62 - 0.18 * ease(t));
  const px = v => cx + (v - 0.5) * W * zoom;       // world→screen x
  const py = (v, plane) => cy + (v - 0.62) * H * zoom * plane;

  // phase opacities: quarry → conveyor → control room → agent log → calm
  const quarry   = 1 - ramp(t, 0.30, 0.55);
  const conveyor = ramp(t, 0.10, 0.28) * (1 - ramp(t, 0.55, 0.72));
  const room     = ramp(t, 0.48, 0.66) * (1 - ramp(t, 0.90, 0.98));
  const logOp    = ramp(t, 0.62, 0.78) * (1 - ramp(t, 0.92, 1.0));
  const calm     = ramp(t, 0.86, 1.0);

  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  s += `<rect width="${W}" height="${H}" fill="${INK}"/>`;

  // terrain ridges (quarry aerial)
  ridges.forEach((r2, k) => {
    const plane = 0.6 + k * 0.25;
    const pts = r2.pts.map(p =>
      `${px(p.x).toFixed(1)},${py(r2.y + p.dy, plane).toFixed(1)}`).join(" ");
    s += `<polyline points="${pts}" fill="none" stroke="${BONE}" stroke-opacity="${(0.10 + k * 0.03) * quarry}" stroke-width="${1.5 + k}"/>`;
  });

  // machine lights
  lights.forEach(l => {
    const o = quarry * (0.35 + 0.4 * Math.abs(Math.sin(l.tw * 6 + t * 9)));
    if (o > 0.02) s += `<circle cx="${px(l.x).toFixed(1)}" cy="${py(l.y, 1).toFixed(1)}" r="${l.r * zoom}" fill="${l.tw > 0.8 ? ORANGE : GREEN}" fill-opacity="${o.toFixed(2)}"/>`;
  });

  // conveyor belt diagonal
  if (conveyor > 0.02) {
    const off = (t * 900) % 80;
    s += `<g opacity="${conveyor.toFixed(2)}">`;
    s += `<line x1="0" y1="${H * 0.78}" x2="${W}" y2="${H * 0.52}" stroke="${BONE}" stroke-opacity="0.5" stroke-width="6"/>`;
    for (let i = -1; i < 26; i++) {
      const u = (i * 80 + off) / W;
      s += `<line x1="${(u * W).toFixed(0)}" y1="${(H * (0.78 - u * 0.26) - 14).toFixed(0)}" x2="${(u * W).toFixed(0)}" y2="${(H * (0.78 - u * 0.26) + 14).toFixed(0)}" stroke="${GREEN}" stroke-opacity="0.8" stroke-width="3"/>`;
    }
    s += `</g>`;
  }

  // control room: dashboard rectangles
  if (room > 0.02) {
    s += `<g opacity="${room.toFixed(2)}">`;
    const gw = W * 0.56, gh = H * 0.5, gx = (W - gw) / 2, gy = H * 0.2;
    s += `<rect x="${gx}" y="${gy}" width="${gw}" height="${gh}" fill="none" stroke="${BONE}" stroke-opacity="0.6" stroke-width="2"/>`;
    for (let i = 0; i < 3; i++)
      s += `<rect x="${gx + 20 + i * (gw / 3)}" y="${gy + 20}" width="${gw / 3 - 40}" height="${gh * 0.35}" fill="${GREEN}" fill-opacity="${0.14 + i * 0.06}"/>`;
    s += `</g>`;
  }

  // agent activity log lines
  if (logOp > 0.02) {
    s += `<g opacity="${logOp.toFixed(2)}">`;
    logLines.forEach((w, i) => {
      const vis = ramp(t, 0.62 + i * 0.028, 0.64 + i * 0.028);
      if (vis > 0)
        s += `<rect x="${W * 0.24}" y="${H * 0.3 + i * 34}" width="${W * 0.5 * w * vis}" height="10" fill="${i % 3 === 0 ? GREEN : BONE}" fill-opacity="${i % 3 === 0 ? 0.9 : 0.4}"/>`;
    });
    s += `</g>`;
  }

  // calm office: single steady orange status dot, everything else dark
  if (calm > 0.02) {
    s += `<rect width="${W}" height="${H}" fill="${INK}" fill-opacity="${(calm * 0.7).toFixed(2)}"/>`;
    s += `<circle cx="${W / 2}" cy="${H / 2}" r="7" fill="${GREEN}" fill-opacity="${calm.toFixed(2)}"/>`;
    s += `<rect x="${W / 2 - 160}" y="${H / 2 + 40}" width="320" height="2" fill="${BONE}" fill-opacity="${(calm * 0.4).toFixed(2)}"/>`;
  }

  // vignette via opaque corner blocks would band; skip — low-key is the bg itself
  s += `</svg>`;
  writeFileSync(path.join(OUT, `frame_${String(f + 1).padStart(3, "0")}.svg`), s);
}
console.log(`wrote ${COUNT} frames → ${OUT}`);
