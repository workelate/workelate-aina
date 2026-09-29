// brain home (2026-09-29): the Monday sticky story and the ladder.
// Without this file every step, its screen and the full ladder are already
// visible. With it: the stage swaps to the step being read, and the ladder
// rises once when it enters view. Transform/opacity only; nothing runs while
// off-screen; reduced motion keeps the static layout.
const root = document.documentElement;
const still = matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!still && "IntersectionObserver" in window) {
  root.dataset.bh = "1";

  const story = document.querySelector("[data-story]");
  if (story) {
    const steps = [...story.querySelectorAll(".bh-step")];
    const shots = [...story.querySelectorAll(".bh-shot")];
    const pips = [...story.querySelectorAll(".bh-pips li")];
    const now = story.querySelector("[data-now]");
    let cur = 0;
    const show = i => {
      if (i === cur) return;
      cur = i;
      steps.forEach((s, k) => s.classList.toggle("is-on", k === i));
      shots.forEach((s, k) => { s.classList.toggle("is-on", k === i); s.classList.toggle("is-past", k < i); });
      pips.forEach((p, k) => p.classList.toggle("is-on", k === i));
      if (now) now.textContent = steps[i].querySelector(".bh-t").textContent;
    };
    // a thin band across the middle of the viewport: the step crossing it is the one being read
    const io = new IntersectionObserver(es => {
      for (const e of es) if (e.isIntersecting) show(steps.indexOf(e.target));
    }, { rootMargin: "-45% 0px -45% 0px" });
    steps.forEach(s => io.observe(s));
    // warm the next screens once the story is near, so a swap never shows a blank frame
    const warm = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { shots.forEach(s => { s.loading = "eager"; }); warm.disconnect(); }
    }, { rootMargin: "600px 0px" });
    warm.observe(story);
  }

  const ladder = document.querySelector("[data-ladder]");
  if (ladder) {
    const lo = new IntersectionObserver(es => {
      if (es.some(e => e.isIntersecting)) { ladder.classList.add("in"); lo.disconnect(); }
    }, { threshold: 0.25 });
    lo.observe(ladder);
  }
}
