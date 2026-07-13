import { ScrollFrames } from "./scrollFrames.js";

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
  const hero = document.getElementById("hero");
  const cta = document.getElementById("cta");
  let heroOut = false, ctaIn = false;
  const upd = () => pill.classList.toggle("show", heroOut && !ctaIn);
  new IntersectionObserver(([e]) => { heroOut = !e.isIntersecting; upd(); }).observe(hero);
  new IntersectionObserver(([e]) => { ctaIn = e.isIntersecting; upd(); }).observe(cta);
}

// Mobile gets stills, non-negotiable (design rule 7)
const mobile = matchMedia("(max-width: 768px)").matches;
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!mobile && !reduced) {
  const section = document.getElementById("cs-pin");
  const canvas = document.getElementById("cs-canvas");
  const bar = document.getElementById("loadbar");

  const sf = new ScrollFrames({
    section,
    canvas,
    path: "/assets/frames/casestudy",
    count: 160,
    ext: "jpg"
  });

  // preload starts when the section approaches, not on page load
  const kick = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    kick.disconnect();
    sf.preload(p => { bar.style.width = p * 100 + "%"; }).then(() => {
      bar.parentElement.style.display = "none";
      sf.start();
      window.__scrubReady = true;
    });
  }, { rootMargin: "150% 0px" });
  kick.observe(section);

  // callouts ride the same frame event, no second scroll listener
  const callouts = [...section.querySelectorAll(".callout")];
  section.addEventListener("frame", e => {
    callouts.forEach(c =>
      c.classList.toggle("on", e.detail.progress >= +c.dataset.at &&
                                e.detail.progress <  +c.dataset.at + 0.18));
  });
  // no scrub on this path yet, readiness set when preload completes above
} else if (!mobile && reduced) {
  // reduced motion on desktop: collapse the pin, show the static strip
  document.getElementById("cs-pin").style.display = "none";
  document.querySelector(".cs-static").style.display = "block";
}

// carousel arrows
document.querySelectorAll("[data-car]").forEach(btn => {
  btn.addEventListener("click", () => {
    const el = document.getElementById(btn.dataset.car);
    el.scrollBy({ left: (parseInt(btn.dataset.dir) || 1) * 420, behavior: "smooth" });
  });
});

if (matchMedia("(max-width: 768px)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) window.__scrubReady = true;
