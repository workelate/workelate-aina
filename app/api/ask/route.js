// POST /api/ask: the /studio assistant, grounded on our work plus the weekly
// library, answered by a hosted model (Anthropic, raw Messages API over fetch).
//
// Request  { question: string (<=500 chars), history?: [{role, text}] (<=6),
//            subject?: string[] (the last answer's source titles), cid?: conversation id,
//            website?: honeypot }
// Response one of
//   application/json   { mode: "fallback", reason }  -> the browser answers from
//                      its own deterministic corpus engine (site/js/chat.js), so
//                      the visitor never sees a blank or an error.
//                      { mode: "limit", reason }     -> the conversation hit its turn cap.
//   text/event-stream  meta {n}, delta {t}..., sources {sources, card, topic, cta},
//                      done {cached}, or error {reason} if the model fails mid-answer.
//                      Text never carries citation tags: sources are their own event.
//
// Limits: 20 requests a minute and 120 a day per IP, 20 turns per conversation,
//         a daily model-call cap, an answer cache and a kill switch.
// Env: OPENAI_API_KEY (preferred) or ANTHROPIC_API_KEY (no key = fallback), ASK_LLM=off (kill switch),
//      ASK_DAILY_CAP (model calls per UTC day per instance, default 300),
//      ASK_MODEL (default gpt-4.1-mini on OpenAI, claude-haiku-4-5-20251001 on Anthropic).
import corpus from "../../../site/data/corpus.json";
import library from "../../../site/data/library.json";
import {
  createKnowledge, retrieve, readIntent, buildRequest, validate, createRateLimiter, createTurnLimiter,
  createDailyCap, createCache, cacheKey, anthropicText, openaiText, toOpenAI, tidy,
  createTagStripper, stripTags, pickSources, INJECTION, INJECTION_REPLY
} from "../../../lib/ask.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Provider: OpenAI when OPENAI_API_KEY is set (founder's choice, 2026-09-29),
// else Anthropic when ANTHROPIC_API_KEY is set, else the free fallback.
const PROVIDER = process.env.OPENAI_API_KEY ? "openai" : "anthropic";
const MODEL = process.env.ASK_MODEL || (PROVIDER === "openai" ? "gpt-4.1-mini" : "claude-haiku-4-5-20251001");
// $ per million tokens [in, out], for the log line only
const PRICE = PROVIDER === "openai" ? [0.4, 1.6] : [1, 5];
// 40 to 110 words is the answer's length; 260 tokens leaves room, never a wall
const MAX_TOKENS = 260;

// Knowledge is built per module load (a few hundred passages, milliseconds);
// the JSON is bundled at build time. Guards live on globalThis so a dev
// hot-reload keeps counting; the v2 names retire the old 10/min limiter.
const g = globalThis;
const K = createKnowledge({ corpus, library });
const limited = g.__aina_ask_v2_rl ?? (g.__aina_ask_v2_rl = createRateLimiter({ perMin: 20, perDay: 120 }));
const overTurns = g.__aina_ask_v2_turns ?? (g.__aina_ask_v2_turns = createTurnLimiter(20));
const cap = g.__aina_ask_v2_cap ?? (g.__aina_ask_v2_cap = createDailyCap(Number(process.env.ASK_DAILY_CAP) || 300));
const cache = g.__aina_ask_v2_cache ?? (g.__aina_ask_v2_cache = createCache(300));
const inflight = g.__aina_ask_v2_inflight ?? (g.__aina_ask_v2_inflight = new Map());

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const fallback = (reason, status = 200) => json({ mode: "fallback", reason }, status);

const sse = (event, data) => `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
const cite = p => ({
  title: p.title, url: p.url, kind: p.kind, source: p.source || null, date: p.date || null,
  name: p.name || null, img: p.img || null, line: p.line || null, topic: p.topic || null
});
// What the page renders under an answer: source chips, one work card when the
// answer is about a build, the topic for follow-up chips, and whether a call
// to action may show (only on a buying signal).
const sourcesEvent = (passages, text, buying) => {
  const { sources, card, topic } = pickSources(passages, text);
  // the card's in-page context: the passage itself, so "See the work" opens
  // here instead of sending the visitor away mid-conversation
  const body = card ? (card.text.startsWith(card.title + ".") ? card.text.slice(card.title.length + 1) : card.text).trim() : "";
  const flatBody = body.replace(/\s+/g, " ");
  const more = card ? (flatBody.length > 360 ? flatBody.slice(0, 360).replace(/\s\S*$/, "") + "..." : flatBody) : null;
  return { sources: sources.map(cite), card: card ? { ...cite(card), more } : null, topic, cta: !!buying };
};

function streamCached(entry) {
  const body = sse("meta", { n: entry.sources.sources.length }) + sse("delta", { t: entry.text }) +
    sse("sources", entry.sources) + sse("done", { cached: true });
  return new Response(body, { headers: { "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-store" } });
}

export async function POST(req) {
  const raw = await req.text();
  if (raw.length > 8_000) return fallback("too large", 413);
  let p;
  try { p = JSON.parse(raw); } catch { return fallback("bad json", 400); }

  const v = validate(p);
  if (v.error) return fallback(v.error, 400);
  if (v.honeypot) return fallback("ok");                  // bots get the free path

  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = fwd || req.headers.get("x-real-ip")?.trim() || null;
  if (limited(ip)) return fallback("rate limited", 429);
  if (overTurns(v.cid)) return json({ mode: "limit", reason: "conversation limit" }, 429);

  // Asked for the prompt or told to change role: one fixed line, no model call.
  if (INJECTION.test(v.question.toLowerCase().replace(/['’]/g, ""))) {
    console.log("[ask] guard injection, no model call, $0");
    return streamCached({ text: INJECTION_REPLY, sources: { sources: [], card: null, topic: "capability", cta: false } });
  }

  if (process.env.ASK_LLM === "off") return fallback("llm off");
  const key = PROVIDER === "openai" ? process.env.OPENAI_API_KEY : process.env.ANTHROPIC_API_KEY;
  if (!key) return fallback("no key");

  // Retrieval reads the conversation: the visitor's last two turns and what
  // the last answer was about, so "have you built it?" keeps its subject.
  const intent = readIntent(v.question, v.history, v.subject);
  const passages = retrieve(K, v.question, { history: v.history, subject: v.subject, intent });
  // Nothing to ground on: the deterministic engine answers for free.
  if (!passages.length) return fallback("no passages");

  const ck = cacheKey(K.version, v.question, v.history, v.subject);
  if (ck) {
    const hit = cache.get(ck);
    if (hit) return streamCached(hit);
    // single flight: an identical question already on the wire is joined, not re-billed
    if (inflight.has(ck)) {
      const done = await inflight.get(ck).catch(() => null);
      if (done) return streamCached(done);
    }
  }

  if (!cap.take()) return fallback("daily cap");

  let res;
  try {
    const body = buildRequest({ passages, question: v.question, history: v.history, model: MODEL, maxTokens: MAX_TOKENS, buying: intent.buying });
    res = PROVIDER === "openai"
      ? await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
          body: JSON.stringify(toOpenAI(body)),
          signal: AbortSignal.timeout(25_000)
        })
      : await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(25_000)
        });
  } catch (e) {
    console.error("[ask] model fetch failed", e.message);
    return fallback("model unreachable");
  }
  if (!res.ok || !res.body) {
    console.error("[ask] model error", res.status, (await res.text().catch(() => "")).slice(0, 200));
    return fallback("model error " + res.status);
  }

  let settle;
  if (ck) inflight.set(ck, new Promise((r, j) => { settle = { r, j }; }).catch(() => null));

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(enc.encode(sse("meta", { n: passages.length })));
      let text = "", usage = {};
      const strip = createTagStripper();
      const send = t => { if (!t) return; t = tidy(t); text += t; controller.enqueue(enc.encode(sse("delta", { t }))); };
      try {
        for await (const ev of (PROVIDER === "openai" ? openaiText(res) : anthropicText(res))) {
          if (ev.text) send(strip.push(ev.text));
          if (ev.usage) usage = { ...usage, ...ev.usage };
        }
        send(strip.flush());
        text = stripTags(text);
        const src = sourcesEvent(passages, text, intent.buying);
        controller.enqueue(enc.encode(sse("sources", src)));
        controller.enqueue(enc.encode(sse("done", { cached: false })));
        const cost = ((usage.input_tokens || 0) * PRICE[0] + (usage.output_tokens || 0) * PRICE[1]) / 1e6;
        console.log(`[ask] ${MODEL} in=${usage.input_tokens || 0} out=${usage.output_tokens || 0} ~$${cost.toFixed(5)} calls_today=${cap.used} hist=${v.history.length} cta=${intent.buying ? 1 : 0}`);
        const entry = { text, sources: src };
        if (ck && text.trim()) cache.set(ck, entry);
        settle?.r(entry);
      } catch (e) {
        console.error("[ask] stream failed", e.message);
        controller.enqueue(enc.encode(sse("error", { reason: "stream", partial: !!text })));
        settle?.j(e);
      } finally {
        if (ck) inflight.delete(ck);
        controller.close();
      }
    }
  });
  return new Response(stream, { headers: { "content-type": "text/event-stream; charset=utf-8", "cache-control": "no-store", "x-accel-buffering": "no" } });
}
