// Shared reveal + counters for inner pages (home has its own in main.js).
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.15 });
document.querySelectorAll(".rv").forEach(el => io.observe(el));

document.querySelectorAll("[data-car]").forEach(btn => {
  btn.addEventListener("click", () => {
    const el = document.getElementById(btn.dataset.car);
    el?.scrollBy({ left: (parseInt(btn.dataset.dir) || 1) * 420, behavior: "smooth" });
  });
});
