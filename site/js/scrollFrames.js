export class ScrollFrames {
  constructor({ section, canvas, path, count, pad = 3, ext = "webp", window: win = 24 }) {
    this.section = section;          // the pinned wrapper (e.g. 500vh)
    this.canvas  = canvas;
    this.ctx     = canvas.getContext("2d");
    this.count   = count;
    this.imgs    = new Array(count); // decoded-on-demand <img> handles (~1 MB total)
    this.bitmaps = new Map();        // idx -> ImageBitmap, sliding window only
    this.window  = win;              // ± live bitmaps around current frame
    this.current = -1;
    this.running = false;
    this.src = i => `${path}/frame_${String(i + 1).padStart(pad, "0")}.${ext}`;
  }

  // ---- PRELOAD LOOP: first/last/middle first, then fill gaps ----
  // Loads lightweight Image handles only. Bitmaps (the expensive rasters:
  // 1920×1080×4B each) are created lazily in a ±window around the current
  // frame and evicted outside it, full-deck bitmaps would hold ~1.3 GB.
  async preload(onProgress) {
    const order = this.priorityOrder();     // 0, N-1, N/2, N/4, 3N/4 ...
    let loaded = 0;
    const load = i => new Promise(res => {
      const img = new Image();
      const done = () => { onProgress(++loaded / this.count); res(); };
      img.onload = () => { this.imgs[i] = img; done(); };
      img.onerror = done;
      img.src = this.src(i);
    });
    // 6 parallel workers pulling from the queue
    const queue = [...order];
    await Promise.all(Array.from({ length: 6 }, async () => {
      while (queue.length) await load(queue.shift());
    }));
    await this.ensureWindow(0);
  }

  priorityOrder() {
    const seen = new Set(), out = [];
    const push = i => { i = Math.round(i);
      if (i >= 0 && i < this.count && !seen.has(i)) { seen.add(i); out.push(i); } };
    // binary-subdivision order: coarse coverage first
    let step = this.count;
    while (step >= 1) {
      for (let i = 0; i < this.count; i += step) push(i);
      step = Math.floor(step / 2);
    }
    return out;
  }

  // ---- BITMAP WINDOW: rasterize near frames, evict far ones ----
  async ensureWindow(center) {
    const lo = Math.max(0, center - this.window);
    const hi = Math.min(this.count - 1, center + this.window);
    for (const [i, bmp] of this.bitmaps) {
      if (i < lo || i > hi) { bmp.close(); this.bitmaps.delete(i); }
    }
    if (this._filling) return;   // one filler at a time; next frame re-triggers
    this._filling = true;
    try {
      // current frame first, then outward, the scrub needs "here" before "near"
      for (let d = 0; d <= this.window; d++) {
        for (const i of d === 0 ? [center] : [center - d, center + d]) {
          if (i < lo || i > hi || this.bitmaps.has(i) || !this.imgs[i]) continue;
          try { this.bitmaps.set(i, await createImageBitmap(this.imgs[i])); }
          catch { /* fall back to drawing the img directly */ }
          // yield to the main thread between rasterizations
          await new Promise(r => setTimeout(r, 0));
        }
      }
    } finally {
      this._filling = false;
    }
  }

  nearestBitmap(idx) {
    if (this.bitmaps.has(idx)) return this.bitmaps.get(idx);
    for (let d = 1; d <= this.window; d++) {
      if (this.bitmaps.has(idx - d)) return this.bitmaps.get(idx - d);
      if (this.bitmaps.has(idx + d)) return this.bitmaps.get(idx + d);
    }
    return this.imgs[idx] || null;  // raw img draw as last resort
  }

  // ---- SCROLL → FRAME MAP ----
  progress() {
    const r = this.section.getBoundingClientRect();
    const total = r.height - window.innerHeight;   // scrubbing distance
    return Math.min(1, Math.max(0, -r.top / total));
  }

  frameFor(p) {
    return Math.min(this.count - 1, Math.floor(p * this.count));
  }

  // ---- DRAW LOOP: rAF-gated, draws only on frame change, idles off-screen ----
  start() {
    const fit = () => {                    // cover-fit, devicePixelRatio-aware
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width  = innerWidth  * dpr;
      this.canvas.height = innerHeight * dpr;
      this.current = -1;                   // force redraw at new size
    };
    fit(); addEventListener("resize", fit);

    const draw = () => {
      if (!this.running) return;           // idle: no rAF churn off-screen
      const idx = this.frameFor(this.progress());
      const img = this.nearestBitmap(idx);
      if (img && idx !== this.current) {
        this.current = idx;
        this.ensureWindow(idx);
        const { width: cw, height: ch } = this.canvas;
        const s = Math.max(cw / img.width, ch / img.height); // cover
        const w = img.width * s, h = img.height * s;
        this.ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
        this.section.dispatchEvent(new CustomEvent("frame", {
          detail: { index: idx, progress: idx / (this.count - 1) }
        }));
      }
      requestAnimationFrame(draw);
    };

    // rAF loop runs only while the pinned section is anywhere near viewport
    const io = new IntersectionObserver(([e]) => {
      const was = this.running;
      this.running = e.isIntersecting;
      if (this.running && !was) requestAnimationFrame(draw);
    }, { rootMargin: "50% 0px" });
    io.observe(this.section);
  }
}
