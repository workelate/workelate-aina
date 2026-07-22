// v2 energy layer: reveal-on-scroll + count-up stats (opacity/transform only)
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll(".rv").forEach(el => io.observe(el));

const fmt = n => n.toLocaleString("en-IN");
const counters = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  counters.unobserve(e.target);
  const target = +e.target.dataset.count;
  const t0 = performance.now(), dur = 1100;
  const step = now => {
    const p = Math.min(1, (now - t0) / dur);
    e.target.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}), { threshold: 0.6 });
if (!matchMedia("(prefers-reduced-motion: reduce)").matches)
  document.querySelectorAll("[data-count]").forEach(el => counters.observe(el));

// sticky CTA pill: appears once the hero button scrolls out, hides at the widget
const pill = document.getElementById("cta-pill");
if (pill) {
  // #cta was removed 2026-07-22; the assistant in the hero is the intake now,
  // so the pill simply tracks whether the hero is off screen.
  const hero = document.getElementById("hero");
  const upd = out => pill.classList.toggle("show", out);
  new IntersectionObserver(([e]) => upd(!e.isIntersecting)).observe(hero);
}

// carousel arrows
document.querySelectorAll("[data-car]").forEach(btn => {
  btn.addEventListener("click", () => {
    const el = document.getElementById(btn.dataset.car);
    el.scrollBy({ left: (parseInt(btn.dataset.dir) || 1) * 420, behavior: "smooth" });
  });
});

// case study is static content now; nothing to preload before the jank probe
window.__scrubReady = true;
