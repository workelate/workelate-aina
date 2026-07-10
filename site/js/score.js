// AI Readiness Score widget — state in memory only, no localStorage.
const form = document.getElementById("score-form");
const steps = [...form.querySelectorAll(".q")];
const bar = document.querySelector("#score-progress i");
const result = document.getElementById("score-result");

const answers = { industry: null, revenue: null, team: null, bottleneck: "", stack: [] };
let step = 0;

function show(n) {
  step = Math.max(0, Math.min(steps.length - 1, n));
  steps.forEach((q, i) => q.classList.toggle("on", i === step));
  bar.style.width = (step / steps.length) * 100 + "%";
  const focusable = steps[step].querySelector("button, input");
  if (focusable) focusable.focus();
}

form.addEventListener("click", e => {
  const b = e.target.closest(".opt");
  if (!b) return;
  const { k, v } = b.dataset;
  if (b.classList.contains("multi")) {
    const on = b.getAttribute("aria-pressed") === "true";
    b.setAttribute("aria-pressed", String(!on));
    answers.stack = on ? answers.stack.filter(x => x !== v) : [...answers.stack, v];
  } else {
    answers[k] = v;
    b.parentElement.querySelectorAll(".opt").forEach(o => o.setAttribute("aria-pressed", "false"));
    b.setAttribute("aria-pressed", "true");
    setTimeout(() => show(step + 1), 180);
  }
});

form.addEventListener("click", e => {
  if (e.target.closest("[data-adv]")) {
    if (step === 3) answers.bottleneck = document.getElementById("bottleneck").value.trim();
    show(step + 1);
  }
});

// keyboard: Enter advances on text steps, arrows move between options
form.addEventListener("keydown", e => {
  if (e.key === "Enter" && e.target.matches('input[type="text"]')) {
    e.preventDefault();
    answers.bottleneck = e.target.value.trim();
    show(step + 1);
  }
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    const opts = [...steps[step].querySelectorAll(".opt")];
    const i = opts.indexOf(document.activeElement);
    if (i > -1) {
      e.preventDefault();
      opts[(i + (e.key === "ArrowDown" ? 1 : opts.length - 1)) % opts.length].focus();
    }
  }
});

// ---- scoring: revenue 40%, team 20%, stack maturity 20%, bottleneck 20% ----
const REV = { lt5cr: 25, "5-50cr": 65, "50-500cr": 100 };
const TEAM = { lt10: 30, "10-50": 60, "50-250": 90, "250plus": 100 };
const KEYWORDS = /dispatch|invoice|report|reconcil|excel|manual|whatsapp|follow.?up|billing|entry|paperwork|compliance|freight|order/i;

function computeScore() {
  const rev = (REV[answers.revenue] ?? 0) * 0.4;
  const team = (TEAM[answers.team] ?? 0) * 0.2;
  let stack = 0;
  if (answers.stack.includes("excel-whatsapp")) stack += 40;   // most to gain
  if (answers.stack.includes("tally-erp")) stack += 30;
  if (answers.stack.includes("custom")) stack += 20;
  if (answers.stack.includes("ai")) stack += 10;
  stack = Math.min(100, stack) * 0.2;
  const bottleneck = (KEYWORDS.test(answers.bottleneck) ? 100 : 40) * 0.2;
  return Math.round(rev + team + stack + bottleneck);
}

form.addEventListener("submit", async e => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  if (!/.+@.+\..+/.test(email)) { document.getElementById("email").focus(); return; }

  const score = computeScore();
  const qualified = score >= 60;
  const payload = { email, answers, score, qualified, ts: new Date().toISOString(),
    website: document.getElementById("website").value };

  try {
    await fetch("/api/score", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch { /* result still shows; lead retry is a backend concern */ }

  form.style.display = "none";
  bar.style.width = "100%";
  result.classList.add("on");

  const arc = result.querySelector(".arc");
  const num = result.querySelector("text");
  const C = 490;
  requestAnimationFrame(() => { arc.style.strokeDashoffset = String(C - (C * score) / 100); });
  let shown = 0;
  const tick = () => {
    shown = Math.min(score, shown + Math.max(1, Math.ceil(score / 40)));
    num.textContent = String(shown);
    if (shown < score) requestAnimationFrame(tick);
  };
  tick();

  document.getElementById("verdict").textContent = qualified
    ? `Score ${score}. There is recoverable money in this operation — your report lands in 10 minutes.`
    : `Score ${score}. Not sprint-ready yet — your report shows the two things to fix first.`;
});
