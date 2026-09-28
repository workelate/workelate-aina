// Animated heroes, /studio and / (2026-09-29). Markup: scripts/genhero.mjs.
// One engine for every [data-hx] root: the big studio stage and the two door
// stages on the landing. Scenes advance on a clock that only runs while the
// root is on screen and the tab is visible; everything moves by transform or
// opacity (class flips, CSS transitions), and one rAF loop drives parallax.
// Reduced motion: nothing starts, the generated markup is the still picture.
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const roots = [...document.querySelectorAll("[data-hx]")];

if (!reduce && roots.length) {
  const stages = roots.map(setup);
  let last = 0, raf = 0;
  const running = () => !document.hidden && stages.some((s) => s.visible);

  function frame(now) {
    const dt = last ? Math.min(now - last, 100) : 16;
    last = now;
    for (const s of stages) if (s.visible) s.tick(dt);
    raf = running() ? requestAnimationFrame(frame) : 0;
    if (!raf) last = 0;
  }
  const wake = () => {
    for (const s of stages) s.root.classList.toggle("hx-paused", document.hidden || !s.visible);
    if (!raf && running()) raf = requestAnimationFrame(frame);
  };
  const io = new IntersectionObserver((es) => {
    for (const e of es) { const s = stages.find((x) => x.root === e.target); if (s) s.visible = e.isIntersecting; }
    wake();
  }, { threshold: 0.05 });
  for (const s of stages) io.observe(s.root);
  document.addEventListener("visibilitychange", wake);

  function setup(root) {
    const n = +root.dataset.n;
    const ms = +root.dataset.ms || 3400;
    const cards = [...root.querySelectorAll("[data-card]")];
    const keyed = [...root.querySelectorAll("[data-k]")];
    const words = [...(root.closest("#hero")?.querySelectorAll(".hx-h1 [data-k]") || [])];
    const cur = root.querySelector(".hx-cur");
    const stage = root.querySelector(".hx-stage");
    const layers = [...root.querySelectorAll(".hx-par")].map((el) => ({ el, d: +el.dataset.depth || 0 }));
    const fine = matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1001px)").matches;
    // scene 0 also waits out the stage entrance, so its bar runs longer
    root.style.setProperty("--hx-ms", ms + (cur ? 1400 : 0) + "ms");
    root.classList.add("hx-live");

    let k = 0, t = -(+root.dataset.delay || 0) - (cur ? 1400 : 0), beat = 3;
    let w = 0, h = 0;
    const size = () => { if (stage) { w = stage.offsetWidth; h = stage.offsetHeight; } };
    size();
    new ResizeObserver(size).observe(stage || root);

    const has = (el, i) => el.dataset.k.split(" ").includes(String(i));
    function show(i) {
      for (const el of keyed) el.classList.toggle("on", has(el, i));
      for (const el of words) el.classList.toggle("on", has(el, i));
    }
    function chip(on) {
      for (const el of keyed) if (el.classList.contains("hx-chip")) el.classList.toggle("on", on && has(el, k));
    }
    function go(i) {
      const leaving = cards[k];
      k = (i + n) % n;
      cards.forEach((c, j) => { if (c !== leaving) c.dataset.pos = String((j - k + n) % n); });
      if (leaving && leaving !== cards[k]) {
        leaving.dataset.pos = "x";
        setTimeout(() => {
          leaving.classList.add("hx-snap");
          leaving.dataset.pos = String((cards.indexOf(leaving) - k + n) % n);
          leaving.offsetWidth; // commit the snap before transitions return
          leaving.classList.remove("hx-snap");
        }, 950);
      }
      show(k);
      chip(false);
      // restart the tab bar
      for (const b of root.querySelectorAll(".hx-tab.on s")) { b.style.animation = "none"; b.offsetWidth; b.style.animation = ""; }
      root.style.setProperty("--hx-ms", ms + "ms");
      t = 0; beat = 0;
      if (cur) cur.style.opacity = "1";
    }
    // the cursor glides to the scene's tap point, taps, the chip answers
    function aim() {
      const c = keyed.find((el) => el.classList.contains("hx-chip") && has(el, k));
      if (!cur || !c) return;
      const [x, y] = c.dataset.pt.split(",").map(Number);
      cur.style.transform = `translate3d(${(x / 100) * w}px, ${(y / 100) * h}px, 0)`;
    }
    for (const b of root.querySelectorAll("[data-go]")) {
      b.addEventListener("click", () => { go(+b.dataset.go); beat = 1; aim(); });
    }
    if (cur) {
      // start resting beside scene 0's chip, already answered
      const c0 = keyed.find((el) => el.classList.contains("hx-chip") && has(el, 0));
      const [x, y] = c0.dataset.pt.split(",").map(Number);
      cur.style.transition = "none";
      cur.style.transform = `translate3d(${(x / 100) * w + 40}px, ${(y / 100) * h + 30}px, 0)`;
      cur.offsetWidth; cur.style.transition = "";
    }

    // pointer + scroll parallax, eased; only the big stage, only fine pointers
    let px = 0, py = 0, tx = 0, ty = 0, sy = 0;
    if (fine && layers.length) {
      const host = root.closest("section") || root;
      host.addEventListener("pointermove", (e) => {
        const r = root.getBoundingClientRect();
        tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      }, { passive: true });
      host.addEventListener("pointerleave", () => { tx = 0; ty = 0; }, { passive: true });
      addEventListener("scroll", () => { sy = Math.min(scrollY / 900, 1); }, { passive: true });
    }

    const s = {
      root, visible: false,
      tick(dt) {
        t += dt;
        if (cur) {
          if (beat === 0 && t > 450) { beat = 1; aim(); }
          if (beat === 1 && t > 1450) { beat = 2; cur.classList.remove("tap"); cur.offsetWidth; cur.classList.add("tap"); chip(true); }
        } else if (beat === 0 && t > 0) { beat = 2; chip(true); }
        if (t > ms) go(k + 1);
        if (layers.length && fine) {
          px += (tx - px) * 0.06; py += (ty - py) * 0.06;
          for (const L of layers) {
            L.el.style.transform = `translate3d(${(px * L.d * 9).toFixed(2)}px, ${(py * L.d * 7 - sy * L.d * 26).toFixed(2)}px, 0)`;
          }
        }
      }
    };
    return s;
  }
}
