// Two-question router: industry × need → a starting point that actually
// reflects BOTH answers.
//
// Founder call 2026-07-22: the old version captured the industry and then
// ignored it. Six industries × six needs produced six identical results, so
// an agency asking about manual ops was answered with quarry dispatch times.
// Now the industry supplies its own opening line and its own eligible needs,
// and the result is composed from both.
const INDUSTRIES = {
  "mining": {
    label: "Mining",
    track: "ops",
    line: "Multiple pits, a shared fleet and a dispatch decision every few minutes, most of it still living on phone calls."
  },
  "building-materials": {
    label: "Building materials",
    track: "ops",
    line: "Cement, RMC, steel, tiles and pipes move fast on thin margins, and the paperwork never keeps up with the trucks."
  },
  "freight": {
    label: "Freight, logistics & fleet",
    track: "ops",
    line: "Carrier bills, trip sheets and delivery proof rarely agree, and nobody has time to check a full month of lines."
  },
  "manufacturing": {
    label: "Manufacturing",
    track: "ops",
    line: "Shift logs, downtime entries and production numbers sit in three places, and none of them is current."
  },
  "distribution": {
    label: "Distribution & dealer networks",
    track: "ops",
    line: "Orders arrive on WhatsApp, phone and email from a few hundred dealers, and the queue only exists in someone's head."
  },
  "construction": {
    label: "Construction & infra",
    track: "ops",
    line: "RA bills, subcontractor certificates and measurement books decide your cash, and all three are assembled by hand."
  },
  "food": {
    label: "Food processing",
    track: "ops",
    line: "Batches, yields, wastage and cold-chain records are logged for compliance and then never used for decisions."
  },
  "proserv": {
    label: "Professional services",
    track: "ops",
    line: "Billable time, document turnaround and receivables all leak in the same place: the manual step between systems."
  },
  "startups": {
    label: "Funded startups & product teams",
    track: "build",
    line: "You have a roadmap longer than your runway, and hiring a team to close the gap costs more than the gap."
  },
  "agencies": {
    label: "Agencies & creative",
    track: "build",
    line: "Client work scales by adding people, which is exactly the model we replaced in our own delivery."
  },
  "other": {
    label: "Another industry",
    track: "both",
    line: "Every business that runs on a repeatable process has the same problem underneath, whatever the industry is called."
  }
};

const NEEDS = {
  // ---- operations track ----
  "manual-ops": {
    label: "Cut manual operations", tracks: ["ops", "both"],
    title: "Put the repetitive day on agents",
    blurb: "Data entry, matching, chasing and coordinating are what agent systems carry best. At RockProsUSA that approach cut dispatch cycle time 38% across 13 sites.",
    link: "/systems/quarry-dispatch-automation", linkText: "See the dispatch automation system"
  },
  "reporting": {
    label: "Reporting & visibility", tracks: ["ops", "both"],
    title: "Reports that write themselves by 6 AM",
    blurb: "Operating data reconciled continuously and written up daily, discrepancies flagged rather than buried. Nobody assembles anything, and decisions run on today's numbers.",
    link: "/systems/plant-production-reporting", linkText: "See the production reporting system"
  },
  "cash": {
    label: "Collections & cash flow", tracks: ["ops", "build", "both"],
    title: "No receivable goes quiet again",
    blurb: "Every open invoice chased on cadence and escalated by rule. Promises to pay tracked to their date. DSO drops, or you see exactly where it is stuck.",
    link: "/systems/ar-followup-automation", linkText: "See the AR follow-up system"
  },
  "orders": {
    label: "Orders & customer response", tracks: ["ops", "both"],
    title: "Every order in one queue, confirmed in minutes",
    blurb: "Orders arriving on WhatsApp, email and phone become one validated queue. Clean orders confirm themselves; ambiguous ones reach a human with the ambiguity highlighted.",
    link: "/systems/dealer-order-management", linkText: "See the order management system"
  },
  "leakage": {
    label: "Reconciliation & leakage", tracks: ["ops", "both"],
    title: "Bills that match themselves, or explain why not",
    blurb: "Every vendor and carrier bill line matched against your operating records. Clean lines clear automatically; disputes queue with the evidence already bundled.",
    link: "/systems/freight-reconciliation", linkText: "See the reconciliation system"
  },
  "compliance": {
    label: "Compliance & documentation", tracks: ["ops", "both"],
    title: "Filings assembled from operating data, continuously",
    blurb: "Royalty, GST, e-way and environmental artifacts built from the same data that runs the business. Month-end becomes a review instead of a reconstruction.",
    link: "/systems/compliance-documentation", linkText: "See the compliance system"
  },
  // ---- product build track ----
  "ship-product": {
    label: "Ship a product faster", tracks: ["build", "both"],
    title: "A product team's output, without hiring a product team",
    blurb: "Two senior people and an agent fleet build what used to need eight engineers. The same scope we quoted at $100K–$500K before agents now lands in the $30K–$100K band, in weeks.",
    link: "/how-we-work", linkText: "See how the build works"
  },
  "ai-features": {
    label: "Add AI to an existing product", tracks: ["build", "both"],
    title: "AI features that survive contact with real users",
    blurb: "We shipped in-browser model inference to assist human labelling back in 2020, long before it was fashionable. Adding AI to a live product is an engineering problem, not a demo.",
    link: "/case-studies", linkText: "See what we have built"
  },
  "rescue": {
    label: "Rescue a stalled build", tracks: ["build", "both"],
    title: "Take over the build that stopped moving",
    blurb: "We inherit the codebase, run a two-week diagnostic on what is actually there, and come back with a fixed price to finish it or a written recommendation to stop.",
    link: "/how-we-work", linkText: "See the Diagnostic Sprint"
  },
  "internal-tools": {
    label: "Internal tools done by hand", tracks: ["build", "ops", "both"],
    title: "The spreadsheet holding your company together",
    blurb: "Every scaling business has one file and one person who understands it. We turn that into a system your team can use without asking them first.",
    link: "/how-we-work", linkText: "See how the build works"
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

  const pill = (attr, key, label) =>
    `<button type="button" class="pill-opt" data-${attr}="${key}">${label}</button>`;

  step1.querySelector(".pills").innerHTML = Object.entries(INDUSTRIES)
    .map(([k, v]) => pill("ind", k, v.label)).join("");

  // step 2 is rebuilt per industry: an agency never sees "royalty filings"
  const renderNeeds = () => {
    const track = (INDUSTRIES[industry] || {}).track || "both";
    const eligible = Object.entries(NEEDS)
      .filter(([, v]) => v.tracks.includes(track) || track === "both")
      // a need whose PRIMARY track is this one leads; borrowed needs trail.
      // Without this a funded startup is offered "collections" before "ship a
      // product", which reads as another canned answer.
      .sort((a, b) => (a[1].tracks[0] === track ? 0 : 1) - (b[1].tracks[0] === track ? 0 : 1));
    step2.querySelector(".pills").innerHTML = eligible
      .map(([k, v]) => pill("need", k, v.label)).join("");
  };
  renderNeeds();

  root.addEventListener("click", e => {
    const ind = e.target.closest("[data-ind]");
    const need = e.target.closest("[data-need]");
    const back = e.target.closest(".q-back");
    if (ind) {
      industry = ind.dataset.ind;
      ind.setAttribute("aria-pressed", "true");
      renderNeeds();
      setTimeout(() => show(step2), 220);
    }
    if (need) {
      need.setAttribute("aria-pressed", "true");
      const n = NEEDS[need.dataset.need];
      const i = INDUSTRIES[industry] || INDUSTRIES.other;
      step3.querySelector(".qr-tag").textContent = `${i.label} × ${n.label}`;
      step3.querySelector("h3").textContent = n.title;
      // the industry line is the half that was missing before
      step3.querySelector("p").textContent = `${i.line} ${n.blurb}`;
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
