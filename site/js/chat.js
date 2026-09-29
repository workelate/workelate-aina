// On-page assistant on /studio: a conversation, not a chatbot. Founder,
// 2026-09-29: "a user may ask back-to-back questions ... redirect only when
// it's a must ... an experience about the capability of the team, experience,
// work we did, are doing and want to do, and trends."
//
// Two engines, one voice:
//
//   1. POST /api/ask (app/api/ask/route.js): a hosted model that answers ONLY
//      from passages retrieved server side, from our own work
//      (site/data/corpus.json) and a reading library crawled every week
//      (site/data/library.json). It streams text, then a `sources` event: the
//      source chips, one work card when the answer is about a build, the topic
//      for follow-up chips, and whether a call to action may show.
//   2. The LOCAL deterministic engine below, answering from corpus.json in
//      ~1ms with no key, vendor or cost. It is the fallback whenever the model
//      path says so (no key, kill switch, daily cap, rate limit, nothing
//      retrieved) or fails in any way, so a visitor never sees a blank or an
//      error. It also still decides the buying signal on that path.
//
// The thread stays on the page. Nothing here navigates: sources and "See the
// work" open in a new tab or in place, and the only call to action appears
// when the visitor asks how to start, price, timeline or talk to someone.
//
// Honest label: the model is hosted, not ours. Never call it "our own model".

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

// --- typo tolerance -------------------------------------------------------
// Buyers type "whats the pricng" and "how mcuh does a bild cost". The old
// fallback was a PREFIX test: any term over 4 chars matched anything sharing
// its first 4 letters, so "whats" matched every chunk containing "what" and
// typo questions were answered by a random project, while the correct fact
// (worth +1) never reached the >= 4 threshold. Replaced with whole-word
// matching inside one or two edits (Damerau-Levenshtein, so transpositions
// like "mcuh"/"much" count), which is both tighter and stronger.
function editDistance(a, b, tol) {
  const la = a.length, lb = b.length;
  let prev2 = new Array(lb + 1).fill(0);
  let prev = new Array(lb + 1);
  let cur = new Array(lb + 1);
  for (let j = 0; j <= lb; j++) prev[j] = j;
  for (let i = 1; i <= la; i++) {
    cur[0] = i;
    let best = i;
    for (let j = 1; j <= lb; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(cur[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        v = Math.min(v, prev2[j - 2] + 1);
      }
      cur[j] = v;
      if (v < best) best = v;
    }
    if (best > tol) return tol + 1;      // no row can recover, bail early
    const spare = prev2; prev2 = prev; prev = cur; cur = spare;
  }
  return prev[lb];
}

// Only words long enough that one edit is a typo rather than a different
// word: "code"/"cost" are two edits apart, "own"/"one" would be one.
const near = (a, b) => {
  if (a === b) return true;
  const min = Math.min(a.length, b.length);
  if (min < 5) return false;
  const tol = min >= 8 ? 2 : 1;
  if (Math.abs(a.length - b.length) > tol) return false;
  return editDistance(a, b, tol) <= tol;
};

const tokCache = new Map();
const hayTokens = hay => {
  let t = tokCache.get(hay);
  if (!t) {
    t = [...new Set(hay.split(/[^a-z0-9]+/).filter(w => w.length >= 5))];
    tokCache.set(hay, t);
  }
  return t;
};

const score = (queryTerms, hay) => {
  let s = 0;
  for (const t of queryTerms) {
    if (hay.includes(t)) { s += 2; continue; }
    if (t.length >= 5 && hayTokens(hay).some(w => near(t, w))) s += 1;
  }
  return s;
};

// A visitor calling us liars is not asking about the team. Measured: "you
// people are frauds and your numbers are fake" matched the trigger "people"
// and got the team blurb. Hostility routes to the honest fallback.
const HOSTILE = /\b(fraud|frauds|fraudulent|fake|faked|scam|scams|scammer|liar|liars|lying|bullshit|bullsh|crooks?|con artists?|useless|garbage|rubbish|nonsense|shit|bogus)\b/;

const INJECTION = /\b(ignore (all |your |the )?(previous|prior|above|earlier)|disregard (all |your |the )?(previous|prior|above)|system prompt|you are now|pretend (you|to be)|act as if|repeat after me|say that you (charge|cost))\b/;

// Negation cues, apostrophes already stripped.
const NEG = new Set(["not", "no", "dont", "doesnt", "didnt", "cant", "cannot", "wont", "isnt", "arent", "never", "without", "nor", "neither", "avoid", "except"]);

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

// The one thing to say when we cannot answer. It used to be 44 words in a
// single sentence, emitted exactly when the visitor is already lost. Short,
// honest, and it points at the two places that do answer: the work, and the
// team that built it.
const fallback = () => ({
  text: "I only answer from what we have actually built, so I do not have that one. The case studies are the work itself, and for anything else the team that builds it answers your message directly.",
  links: [
    { label: "Case studies", href: "/case-studies" },
    { label: "Talk to the team", href: "/contact" }
  ],
  followup: null,
  factId: null
});

// "we do not want mobile apps" used to return "Yes. At RockProsUSA we shipped
// three separate React Native apps..." — the exact opposite of what was asked.
// If a negation cue sits within three words before a matched single-word
// trigger, we do not assert the positive. A cue that is part of a matched
// multi-word trigger ("what if it doesnt work") is the question, not a
// negation, so it is ignored.
function isNegated(hits, words) {
  const multi = hits.filter(p => p.includes(" ")).map(p => p.split(" "));
  for (const p of hits) {
    if (p.includes(" ")) continue;
    for (let i = 0; i < words.length; i++) {
      if (words[i] !== p && !near(words[i], p)) continue;
      for (let d = 1; d <= 3 && i - d >= 0; d++) {
        const cue = words[i - d];
        if (!NEG.has(cue)) continue;
        if (multi.some(m => m.includes(cue))) continue;
        return true;
      }
    }
  }
  return false;
}

function answer(text) {
  const q = norm(text);
  const lower = text.toLowerCase();
  // apostrophes folded, so "doesn't" is one token and matches "doesnt"
  const flat = lower.replace(/['‘’ʼ]/g, "");
  const words = flat.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);

  state.turns++;
  // Neither of these is a question about the firm. The engine has no model to
  // hijack, so injection was already harmless, but answering it with a random
  // project reads as if something almost worked. Both go to the fallback.
  if (INJECTION.test(flat)) return { ...fallback(), guard: true, injection: true, topic: "capability" };
  if (HOSTILE.test(flat)) return { ...fallback(), guard: true };

  const ind = detectIndustry(text);
  if (ind) state.industry = ind;

  // 1. a direct question about the firm beats a portfolio match. An explicit
  // phrase ("how much", "how long") is decisive: someone asking the price
  // wants the price, not the nearest project that happens to say "build".
  //
  // Word boundaries, not substrings: "wastage is unknown" contains "own" and
  // was answering a question about code ownership. A near-miss on a single
  // word ("pricng") is worth 5, just under an exact hit, so a typo still
  // clears the fact threshold instead of falling through to a random project.
  const phraseHit = phrase => {
    if (phrase.includes(" ")) return flat.includes(phrase) ? 6 : 0;
    if (new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(flat)) return 6;
    return words.some(w => near(w, phrase)) ? 5 : 0;
  };

  let bestFact = null, bestFactScore = 0, bestHits = [];
  for (const f of CORPUS.facts) {
    let s = 0;
    const hits = [];
    for (const phrase of f.q) {
      const h = phraseHit(phrase);
      if (h) { s += h; hits.push(phrase); }
    }
    s += score(q, f.q.join(" "));
    if (s > bestFactScore) { bestFactScore = s; bestFact = f; bestHits = hits; }
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

  if (useFact) {
    if (isNegated(bestHits, words)) {
      return {
        text: "Understood, we scope that out rather than sell it to you. Tell me what the system does need to do and I will point you at the closest thing we have built.",
        links: [
          { label: "Case studies", href: "/case-studies" },
          { label: "Talk to the team", href: "/contact" }
        ],
        followup: pickFollowup(),
        factId: null
      };
    }
    return { text: bestFact.a, links: bestFact.links, followup: pickFollowup(), factId: bestFact.id, topic: bestFact.topic };
  }
  if (ranked.length) {
    const top = ranked[0].c;
    const line = top.outcomes && top.outcomes.length
      ? ` ${top.outcomes[0][0].toUpperCase()}${top.outcomes[0].slice(1)}.`
      : "";
    return {
      text: `Closest thing we have built: ${top.title}. ${top.body}${line}`,
      links: top.links,
      followup: pickFollowup(),
      factId: null,
      topic: top.topic,
      matched: true
    };
  }
  return fallback();
}

// buying signals: when one of these facts is the answer, the visitor is asking
// how to actually engage, which is the right moment to ask for a way to reach
// them back. Ordinary "what do you build" curiosity is not.
const BUYING = new Set(["price", "start", "mvp", "rescue", "speed"]);

function pickFollowup() {
  for (const f of FOLLOWUPS) {
    if (!state.asked.has(f.key)) { state.asked.add(f.key); return f.q; }
  }
  return null;
}

// ---- pure helpers (exported for scripts/test-ask.mjs) ----

// Safety net: the model is told never to write passage tags, and the server
// strips them, but a tag must never reach the visitor even if both slip.
const TAG_RE = /\s*[[(【]\s*(?:[WL]\d+)(?:\s*[,;/]\s*[WL]?\d+)*\s*[\])】]/g;
export const stripTags = t => String(t || "").replace(TAG_RE, "").replace(/\s*—\s*/g, ", ");

// Follow-up chips by the answer's topic. Questions, not links: each one stays
// in the conversation.
const FOLLOW = {
  capability: ["What have you built?", "Which industries do you know best?", "What are you building now?"],
  experience: ["What have you built?", "What are you building now?", "What's changing in my industry?"],
  work: ["What are you building now?", "What can your team do?", "What's next for you?"],
  now: ["What's next for you?", "What have you built?", "What can your team do?"],
  next: ["What are you building now?", "What have you built?", "What can your team do?"],
  trends: ["Have you built anything for this?", "What can your team do?", "What are you building now?"],
  start: ["What happens in the Diagnostic Sprint?", "How long does a build take?", "Who would I work with?"]
};
const normQ = q => String(q || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
export function followupsFor(topic, name, asked = []) {
  const seen = new Set(asked.map(normQ));
  const list = [];
  if (name) list.push(`What are you building on ${name} now?`);
  list.push(...(FOLLOW[topic] || FOLLOW.capability));
  if (topic !== "start") list.push("How would we start?");
  return [...new Set(list)].filter(q => !seen.has(normQ(q))).slice(0, 3);
}

// ---- UI ----
const root = typeof document !== "undefined" ? document.getElementById("ask") : null;
if (root) {
  const form = root.querySelector(".ask-form");
  const input = root.querySelector(".ask-input");
  const log = root.querySelector(".ask-log");
  const chips = root.querySelector(".ask-chips");
  // The no-JS contract: without this script the form and its chips submit to
  // /studio/contact. With it, the conversation happens here.
  root.classList.add("ask-live");

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const el = (cls, html, tag = "div") => { const d = document.createElement(tag); d.className = cls; d.innerHTML = html; return d; };

  // Presentation only. A "Label: a, b, c and d." answer reads as a wall of
  // prose; render it as a lead line plus bullets. Anything that is not clearly
  // a short-label list stays as plain paragraphs. Never changes the words.
  function formatAnswer(text) {
    const m = text.match(/^(.{3,46}?):\s+([^.]+)\.(.*)$/s);
    if (m && !m[1].includes(",")) {
      const parts = m[2]
        .replace(/,?\s+and\s+/g, "|").split(/,\s*|\|/)
        .map(s => s.trim()).filter(Boolean);
      const rest = m[3].trim();
      if (parts.length >= 3 && parts.every(p => p.length <= 90)) {
        return `<p class="ask-lead">${esc(m[1])}</p><ul class="ask-list">` +
          parts.map(p => `<li>${esc(p)}</li>`).join("") + `</ul>` +
          (rest ? `<p>${esc(rest)}</p>` : "");
      }
    }
    return `<p>${esc(text)}</p>`;
  }
  const paras = t => stripTags(t).split(/\n{2,}/).map(x => x.trim()).filter(Boolean)
    .map(x => `<p>${esc(x).replace(/\n/g, "<br>")}</p>`).join("");

  async function ensureCorpus() {
    if (CORPUS) return;
    const r = await fetch("/data/corpus.json");
    CORPUS = await r.json();
  }

  // transcript goes with a lead so the team reads the intent, not just an
  // address; history is what the model sees; subject is what the last answer
  // was about, so "have you built it?" keeps its subject.
  const transcript = [];
  const history = [];
  const asked = [];
  let subject = [];
  const cid = (Date.now().toString(36) + Math.random().toString(36).slice(2, 10)).slice(0, 24);
  const cap = { done: false, shown: false };
  let busy = false;

  const thin = s => s.length > 56 ? s.slice(0, 53).replace(/\s\S*$/, "") + "..." : s;
  const niceDate = d => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(d || "");
    if (!m) return "";
    return `${+m[3]} ${"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ")[+m[2] - 1]} ${m[1]}`;
  };

  // Source chips: ours link to the page, the library's to the publication.
  // Both open in a new tab so the conversation stays where it is.
  function renderSources(turn, sources) {
    const ours = sources.filter(s => s.kind === "work");
    const lib = sources.filter(s => s.kind === "library");
    if (!ours.length && !lib.length) return;
    const a = (s, label) => `<a class="ask-src" href="${esc(s.url)}" target="_blank" rel="noopener${/^https?:/.test(s.url) ? " nofollow" : ""}">${label}</a>`;
    let html = "";
    if (ours.length) html += `<div class="ask-srcs"><span class="ask-srcs-h">From our work</span>` +
      ours.map(s => a(s, esc(thin(s.name || s.title)))).join("") + `</div>`;
    if (lib.length) html += `<div class="ask-srcs"><span class="ask-srcs-h">From our weekly library</span>` +
      lib.map(s => a(s, `<b>${esc(s.source || "")}</b>${s.date ? ` <span>${esc(niceDate(s.date))}</span>` : ""} ${esc(thin(s.title))}`)).join("") + `</div>`;
    turn.appendChild(el("ask-sources", html));
  }

  // One work card when the answer is about a build. "See the work" opens the
  // build's own passage here; the page itself is one more deliberate click.
  const carded = new Set();
  function renderCard(turn, c) {
    // one card per build per conversation: the second answer about it says
    // so in words and keeps the source chip
    if (!c || !c.img || carded.has(c.name || c.title)) return;
    carded.add(c.name || c.title);
    const card = el("ask-card", `
      <figure class="ask-card-media"><img src="${esc(c.img)}" alt="${esc(c.name || c.title)}, from our work" width="1600" height="1000" loading="lazy" decoding="async"></figure>
      <div class="ask-card-b">
        <p class="ask-card-k">From our work</p>
        <p class="ask-card-t">${esc(c.name || c.title)}</p>
        ${c.line ? `<p class="ask-card-l">${esc(c.line)}</p>` : ""}
        <button type="button" class="ask-card-go" aria-expanded="false">See the work <span aria-hidden="true">&rarr;</span></button>
        <div class="ask-card-more" hidden>
          ${c.more ? `<p>${esc(stripTags(c.more))}</p>` : ""}
          <a href="${esc(c.url)}" target="_blank" rel="noopener">Open the full page in a new tab</a>
        </div>
      </div>`);
    const go = card.querySelector(".ask-card-go");
    const more = card.querySelector(".ask-card-more");
    go.addEventListener("click", () => {
      const open = more.hidden;
      more.hidden = !open;
      go.setAttribute("aria-expanded", String(open));
      go.firstChild.textContent = open ? "Hide the work " : "See the work ";
    });
    turn.appendChild(card);
  }

  // Three next questions; only the newest answer carries them.
  function renderFollowups(turn, topic, name) {
    log.querySelectorAll(".ask-next").forEach(n => n.remove());
    const qs = followupsFor(topic, name, asked);
    if (!qs.length) return;
    const box = el("ask-next", qs.map(q => `<button type="button" data-ask="${esc(q)}">${esc(q)}</button>`).join(""));
    box.setAttribute("aria-label", "Ask next");
    turn.appendChild(box);
  }

  // The one call to action, only on a buying signal.
  function renderCta(turn) {
    turn.appendChild(el("ask-cta-row", `<a class="ask-pill ask-cta-pill" href="/studio/contact">Book a Diagnostic Sprint <span aria-hidden="true">&rarr;</span></a>`));
  }

  // Returns {text, sources, card, topic, cta} when the model path answered,
  // {limit:true} at the conversation cap, or null so the local engine answers.
  async function askModel(text, bot) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 12000);
    let r;
    try {
      r = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: text.slice(0, 500), history: history.slice(-6), subject, cid }),
        signal: ctl.signal
      });
    } catch { clearTimeout(timer); return null; }
    const ct = r.headers.get("content-type") || "";
    if (!ct.includes("text/event-stream")) {
      clearTimeout(timer);
      const j = await r.json().catch(() => ({}));
      return j.mode === "limit" ? { limit: true } : null;
    }
    const reader = r.body.getReader();
    const dec = new TextDecoder();
    let buf = "", out = "", body = null, status = "open", src = null;
    try {
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        let i;
        while ((i = buf.indexOf("\n\n")) >= 0) {
          const raw = buf.slice(0, i); buf = buf.slice(i + 2);
          const ev = (raw.match(/^event: (.+)$/m) || [])[1];
          const data = (raw.match(/^data: (.+)$/m) || [])[1];
          let d = {}; try { d = JSON.parse(data || "{}"); } catch {}
          if (ev === "delta" && d.t) {
            clearTimeout(timer);
            out += d.t;
            if (!body) {
              bot.innerHTML = `<span class="ask-who">WE_AINA assistant <span class="ask-ai">AI answer</span></span><div class="ask-body"></div>`;
              body = bot.querySelector(".ask-body");
            }
            body.innerHTML = paras(out);
          } else if (ev === "sources") src = d;
          else if (ev === "error") status = "error";
          else if (ev === "done") status = "done";
        }
      }
    } catch { status = "error"; }
    clearTimeout(timer);
    if (!out.trim()) return null;                  // nothing shown yet: local answer takes over
    if (status !== "done") body.insertAdjacentHTML("beforeend", `<p class="ask-note">The answer was cut short. Ask again, or the team answers the rest directly.</p>`);
    return { text: stripTags(out), ...(src || { sources: [], card: null, topic: "capability", cta: false }) };
  }

  async function ask(text) {
    text = String(text || "").trim();
    if (!text || busy) return;
    busy = true;
    root.classList.add("open");
    input.value = "";
    const turn = el("ask-turn", "");
    turn.appendChild(el("ask-msg me", esc(text)));
    const bot = el("ask-msg bot", '<span class="ask-dots" aria-label="Thinking"><i></i><i></i><i></i></span>');
    turn.appendChild(bot);
    log.appendChild(turn);
    // bring the new question into view once; the answer grows under it
    turn.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
    transcript.push("You: " + text);
    try {
      await ensureCorpus();
      // The local engine always runs (1ms, free): it holds the buying signal on
      // the fallback path, and the answer if the model path declines.
      const a = answer(text);
      const said = a.guard ? null : await askModel(text, bot);
      let topic, name = null, cta;
      if (said && said.limit) {
        bot.innerHTML = `<p>This conversation has run long. The team can pick it up directly from here.</p>`;
        renderCta(turn);
        cta = true;
      } else if (said) {
        renderCard(turn, said.card);
        renderSources(turn, said.sources || []);
        topic = said.topic; name = said.card?.name || null; cta = !!said.cta;
        transcript.push("WE_AINA assistant (AI): " + said.text);
        history.push({ role: "user", text }, { role: "assistant", text: said.text });
        subject = [...new Set([said.card?.name, ...(said.sources || []).filter(s => s.kind === "work").map(s => s.name || s.title)].filter(Boolean))].slice(0, 3);
      } else {
        await new Promise(r => setTimeout(r, 200));
        const guardLine = "I can't share how I'm set up, but I'm happy to talk about our work, what we're building now, or what's changing in your industry.";
        bot.innerHTML = `<span class="ask-who">WE_AINA assistant</span>` + formatAnswer(a.injection ? guardLine : a.text);
        if (a.links && a.links.length && !a.guard) {
          renderSources(turn, a.links.map(l => ({ kind: "work", title: l.label, url: l.href })));
        }
        topic = a.topic; cta = BUYING.has(a.factId);
        transcript.push("WE_AINA: " + a.text);
        history.push({ role: "user", text }, { role: "assistant", text: a.text });
      }
      asked.push(text);
      if (cta && !(said && said.limit)) renderCta(turn);
      renderFollowups(turn, topic || "capability", name);
      // lead capture: on a buying signal, or once after a real conversation
      // (five exchanges). Never on the first curious question.
      if (!cap.done && !cap.shown && (cta || asked.length >= 5)) showCapture(cta);
    } catch (err) {
      bot.innerHTML = `<p>That did not load. The work itself covers the same ground: <a href="/studio/work" target="_blank" rel="noopener">see the work</a>.</p>`;
    } finally {
      busy = false;
    }
  }

  // ---- lead capture, inline in the conversation ----
  function showCapture(signal) {
    cap.shown = true;
    const lead = signal
      ? "If you want this costed, leave an email or phone and the team will come back with a build plan, usually same day."
      : "Want the team to look at your specifics? Leave an email or phone and we will come back with where we would start.";
    const box = el("ask-msg bot cap", `
      <p>${lead}</p>
      <form class="cap-form" autocomplete="on">
        <input class="cap-website" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
        <input class="cap-input" name="contact" type="text" inputmode="email"
               placeholder="you@company.com or +91..." aria-label="Your email or phone">
        <button class="cap-send" type="submit">Send</button>
      </form>
      <p class="cap-msg" role="status"></p>`);
    log.appendChild(box);
    const f = box.querySelector(".cap-form");
    const msg = box.querySelector(".cap-msg");
    f.addEventListener("submit", async e => {
      e.preventDefault();
      const contact = f.contact.value.trim();
      if (!contact) return;
      msg.textContent = "Sending...";
      try {
        const r = await fetch("/api/lead", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            contact,
            website: f.website.value,        // honeypot
            industry: state.industry || "",
            transcript: transcript.join("\n"),
            path: location.pathname
          })
        });
        const d = await r.json().catch(() => ({}));
        if (r.ok && d.ok) {
          cap.done = true;
          f.remove();
          msg.textContent = "Got it. You will hear from the team, not an autoresponder.";
        } else {
          msg.textContent = d.error === "need a valid email or phone"
            ? "That does not look like an email or phone, try again?"
            : "Could not send just now. Try the form at /studio/contact instead.";
        }
      } catch {
        msg.textContent = "Could not send just now. Try the form at /studio/contact instead.";
      }
    });
  }

  form.addEventListener("submit", e => {
    e.preventDefault();
    // a chip is a submit button for the no-JS path; with JS its click asks
    if (e.submitter && e.submitter.dataset.ask) return;
    ask(input.value);
  });
  root.addEventListener("click", e => {
    const c = e.target.closest("[data-ask]");
    if (!c || !(chips?.contains(c) || log.contains(c))) return;
    e.preventDefault();
    ask(c.dataset.ask);
  });

  // "Book a Diagnostic Sprint" is the one CTA phrase sitewide (design rule 5).
  // A #ask link opens the assistant and goes straight to capturing a way to
  // reach back: the visitor asked to start, so this is the buying signal.
  document.querySelectorAll('a[href="#ask"], a[href="/#ask"]').forEach(a => {
    a.addEventListener("click", e => {
      if (a.getAttribute("href") === "/#ask" && location.pathname !== "/") return;
      e.preventDefault();
      root.scrollIntoView({ behavior: "smooth", block: "center" });
      input.focus({ preventScroll: true });
      if (!root.classList.contains("open")) {
        root.classList.add("open");
        log.appendChild(el("ask-msg bot", "<p>The Diagnostic Sprint is two weeks: we sit inside your operation, then hand you a build plan with a fixed price. Tell me your industry and what you want built, or leave a contact below and we will reach out.</p>"));
        if (!cap.done) showCapture(true);
      }
    });
  });
}
