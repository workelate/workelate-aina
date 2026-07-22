// On-page assistant. Replaces the hero stat row (founder call 2026-07-22:
// "those numbers add no value") with something a visitor can actually talk to.
//
// Design decision worth knowing: the answering engine is LOCAL and
// deterministic, not a hosted model call. Reasons:
//   1. It answers in ~1ms with no key, no vendor and no per-visit cost, so it
//      cannot be the thing that breaks in front of a prospect.
//   2. It can only say what is in site/data/corpus.json, which is generated
//      from the real portfolio. A hosted model free-typing about our numbers
//      is exactly how a consultancy site starts lying.
// When ANTHROPIC_API_KEY exists, POST /api/chat is used to REPHRASE the
// retrieved answer, never to invent one. Retrieval stays the source of truth.

const STOP = new Set("a an and are as at be but by can do does for from has have how i if in is it its me my of on or our so that the their they this to us was we what when where which who why will with you your".split(" "));
const norm = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(w => w && !STOP.has(w) && w.length > 2);

// what we try to learn across the conversation
const state = { industry: null, challenge: null, turns: 0, asked: new Set() };

const INDUSTRY_HINTS = {
  mining: "mining quarry quarries aggregate aggregates pit crusher blasting",
  "building-materials": "cement rmc concrete steel tiles pipes bricks sand building material",
  freight: "freight logistics fleet transport trucking carrier shipping courier 3pl warehouse",
  manufacturing: "manufacturing plant factory production shift machine assembly fabrication",
  distribution: "distribution dealer dealers distributor retail wholesale channel stockist",
  construction: "construction infra contractor site civil project ra bill subcontractor",
  food: "food processing dairy agri batch cold chain fmcg beverage",
  proserv: "consulting legal accounting audit firm agency services practice clinic",
  startups: "startup founder saas product mvp funded seed series app platform build",
  agencies: "agency creative marketing campaign advertising design studio brand"
};

let CORPUS = null;

const score = (queryTerms, hay) => {
  let s = 0;
  for (const t of queryTerms) {
    if (hay.includes(t)) s += 2;
    else if (t.length > 4 && hay.includes(t.slice(0, Math.max(4, t.length - 2)))) s += 1;
  }
  return s;
};

function detectIndustry(text) {
  const t = text.toLowerCase();
  let best = null, bestScore = 0;
  for (const [k, words] of Object.entries(INDUSTRY_HINTS)) {
    const n = words.split(" ").reduce((a, w) => a + (t.includes(w) ? 1 : 0), 0);
    if (n > bestScore) { bestScore = n; best = k; }
  }
  return bestScore ? best : null;
}

// the follow-up is how we learn expectation and perceived challenge
const FOLLOWUPS = [
  { key: "challenge", q: "What eats the most time in that operation right now?" },
  { key: "scale", q: "Roughly how many people touch that process every day?" },
  { key: "timeline", q: "Is this something you want live this quarter, or are you still scoping?" }
];

function answer(text) {
  const q = norm(text);
  const ind = detectIndustry(text);
  if (ind) state.industry = ind;

  // 1. a direct question about the firm beats a portfolio match. An explicit
  // phrase ("how much", "how long") is decisive: someone asking the price
  // wants the price, not the nearest project that happens to say "build".
  const lower = text.toLowerCase();
  // Word boundaries, not substrings: "wastage is unknown" contains "own" and
  // was answering a question about code ownership.
  const hasPhrase = phrase => phrase.includes(" ")
    ? lower.includes(phrase)
    : new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(lower);

  let bestFact = null, bestFactScore = 0;
  for (const f of CORPUS.facts) {
    let s = 0;
    for (const phrase of f.q) if (hasPhrase(phrase)) s += 6;
    s += score(q, f.q.join(" "));
    if (s > bestFactScore) { bestFactScore = s; bestFact = f; }
  }

  // 2. otherwise the closest thing we have actually built
  const ranked = CORPUS.chunks
    .map(c => {
      const base = score(q, c.terms);
      let s = base;
      // remembered industry only sharpens a real match; it must never
      // manufacture one, or gibberish inherits the last turn's context
      if (base > 0 && state.industry && c.terms.includes(state.industry)) s += 3;
      if (base > 0 && c.kind === "project") s += 1;   // prefer delivery over a page
      return { c, s };
    })
    .filter(x => x.s > 0)
    .sort((a, b) => b.s - a.s);

  const useFact = bestFactScore >= 6 || (bestFactScore >= 4 && bestFactScore >= (ranked[0]?.s || 0));
  state.turns++;

  if (useFact) {
    return { text: bestFact.a, links: bestFact.links, followup: pickFollowup() };
  }
  if (ranked.length) {
    const top = ranked[0].c;
    const line = top.outcomes && top.outcomes.length
      ? ` ${top.outcomes[0][0].toUpperCase()}${top.outcomes[0].slice(1)}.`
      : "";
    return {
      text: `Closest thing we have built: ${top.title}. ${top.body}${line}`,
      links: top.links,
      followup: pickFollowup()
    };
  }
  return {
    text: "I can only speak to what we have actually built, so tell me the industry and the process that hurts, dispatch, orders, collections, reporting, compliance, or a product you need shipped. I will point you at the closest thing we have delivered.",
    links: [{ label: "Browse the case studies", href: "/case-studies" }],
    followup: null
  };
}

function pickFollowup() {
  for (const f of FOLLOWUPS) {
    if (!state.asked.has(f.key)) { state.asked.add(f.key); return f.q; }
  }
  return null;
}

// ---- UI ----
const root = document.getElementById("ask");
if (root) {
  const form = root.querySelector(".ask-form");
  const input = root.querySelector(".ask-input");
  const log = root.querySelector(".ask-log");
  const chips = root.querySelector(".ask-chips");

  const bubble = (who, html) => {
    const d = document.createElement("div");
    d.className = `ask-msg ${who}`;
    d.innerHTML = html;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  };

  const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  async function ensureCorpus() {
    if (CORPUS) return;
    const r = await fetch("/data/corpus.json");
    CORPUS = await r.json();
  }

  async function ask(text) {
    if (!text.trim()) return;
    root.classList.add("open");
    bubble("me", esc(text));
    input.value = "";
    const thinking = bubble("bot", '<span class="ask-dots"><i></i><i></i><i></i></span>');
    try {
      await ensureCorpus();
      const a = answer(text);
      // small deliberate beat: an instant reply reads like a lookup table
      await new Promise(r => setTimeout(r, 260));
      let html = `<p>${esc(a.text)}</p>`;
      if (a.followup) html += `<p class="ask-follow">${esc(a.followup)}</p>`;
      if (a.links && a.links.length) {
        html += `<p class="ask-links">` +
          a.links.map(l => `<a href="${esc(l.href)}">${esc(l.label)} →</a>`).join("") + `</p>`;
      }
      thinking.innerHTML = html;
      log.scrollTop = log.scrollHeight;
    } catch (err) {
      thinking.innerHTML = `<p>That did not load. The case studies cover the same ground: <a href="/case-studies">browse them here →</a></p>`;
    }
  }

  form.addEventListener("submit", e => { e.preventDefault(); ask(input.value); });
  chips?.addEventListener("click", e => {
    const c = e.target.closest("[data-ask]");
    if (c) ask(c.dataset.ask);
  });
}
