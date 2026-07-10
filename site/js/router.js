// Bain-style two-question router: industry × need → tailored starting point.
const INDUSTRIES = {
  "building-materials": "Building materials",
  "manufacturing": "Manufacturing",
  "logistics": "Logistics",
  "agencies": "Agencies & creative",
  "services": "Professional services",
  "other": "Another industry"
};

const NEEDS = {
  "manual-ops": {
    label: "Cut manual operations",
    title: "Put the repetitive day on agents",
    blurb: "Dispatch, data entry, matching, chasing — the work that eats your team's day is exactly what agent systems carry best. At RockProsUSA this cut dispatch cycle time 38% across 13 quarries.",
    link: "/systems/quarry-dispatch-automation", linkText: "See the dispatch automation system"
  },
  "reporting": {
    label: "Reporting & visibility",
    title: "Reports that write themselves by 6 AM",
    blurb: "Operating data reconciled continuously and written up daily — discrepancies flagged, not buried. No human assembles anything; decisions run on today's numbers, not last week's.",
    link: "/systems/plant-production-reporting", linkText: "See the production reporting system"
  },
  "cash": {
    label: "Collections & cash flow",
    title: "No receivable goes quiet again",
    blurb: "Every open invoice chased on cadence, escalated by rule, every touch logged. Promises to pay tracked to their date. DSO drops, or the log shows you exactly where it's stuck.",
    link: "/systems/ar-followup-automation", linkText: "See the AR follow-up system"
  },
  "orders": {
    label: "Orders & customer response",
    title: "Every order in one queue, confirmed in minutes",
    blurb: "Orders arriving on WhatsApp, email and phone become one validated queue. Clean orders auto-confirm back to the customer; ambiguous ones reach a human with the ambiguity highlighted.",
    link: "/systems/dealer-order-management", linkText: "See the order management system"
  },
  "leakage": {
    label: "Reconciliation & leakage",
    title: "Bills that match themselves — or explain why not",
    blurb: "Every vendor and carrier bill line matched against your operating records. Clean lines clear automatically; disputes queue with the evidence bundled and ready to send.",
    link: "/systems/freight-reconciliation", linkText: "See the reconciliation system"
  },
  "compliance": {
    label: "Compliance & documentation",
    title: "Filings assembled from operating data, continuously",
    blurb: "Royalty, GST, e-way and environmental artifacts built from the same data that runs your business. Month-end becomes a review, not a reconstruction.",
    link: "/systems/compliance-documentation", linkText: "See the compliance system"
  }
};

const root = document.getElementById("router");
if (root) {
  const step1 = root.querySelector('[data-qstep="1"]');
  const step2 = root.querySelector('[data-qstep="2"]');
  const step3 = root.querySelector('[data-qstep="3"]');
  let industry = null;

  const show = el => {
    [step1, step2, step3].forEach(s => s.classList.remove("on"));
    el.classList.add("on");
  };

  // build pills
  step1.querySelector(".pills").innerHTML = Object.entries(INDUSTRIES)
    .map(([k, v]) => `<button type="button" class="pill-opt" data-ind="${k}">${v}</button>`).join("");
  step2.querySelector(".pills").innerHTML = Object.entries(NEEDS)
    .map(([k, v]) => `<button type="button" class="pill-opt" data-need="${k}">${v.label}</button>`).join("");

  root.addEventListener("click", e => {
    const ind = e.target.closest("[data-ind]");
    const need = e.target.closest("[data-need]");
    const back = e.target.closest(".q-back");
    if (ind) {
      industry = ind.dataset.ind;
      ind.setAttribute("aria-pressed", "true");
      setTimeout(() => show(step2), 220);
    }
    if (need) {
      need.setAttribute("aria-pressed", "true");
      const n = NEEDS[need.dataset.need];
      const indLabel = INDUSTRIES[industry] || "your business";
      step3.querySelector(".qr-tag").textContent = `${indLabel} × ${n.label}`;
      step3.querySelector("h3").textContent = n.title;
      step3.querySelector("p").textContent = n.blurb;
      const [a1, a2] = step3.querySelectorAll(".qr-links a.text");
      a1.href = n.link; a1.textContent = n.linkText + " →";
      a2.href = "/case-studies"; a2.textContent = "Browse the case studies →";
      setTimeout(() => show(step3), 220);
    }
    if (back) {
      root.querySelectorAll(".pill-opt").forEach(p => p.setAttribute("aria-pressed", "false"));
      show(step1);
    }
  });
}
