// POST /api/ask: the /studio assistant, grounded on our work plus the weekly
// library, answered by a hosted model (Anthropic, raw Messages API over fetch).
//
// Request  { question: string (<=500 chars), history?: [{role, text}] (<=6), website?: honeypot }
// Response one of
//   application/json   { mode: "fallback", reason }  -> the browser answers from
//                      its own deterministic corpus engine (site/js/chat.js), so
//                      the visitor never sees a blank or an error.
//   text/event-stream  meta {passages:[{tag,title,url,kind,source}]}, delta {t}...,
//                      done {cached}, or error {reason} if the model fails mid-answer.
//
// Env: ANTHROPIC_API_KEY (no key = fallback), ASK_LLM=off (kill switch),
//      ASK_DAILY_CAP (model calls per UTC day per instance, default 300),
//      ASK_MODEL (default claude-haiku-4-5-20251001).
import corpus from "../../../site/data/corpus.json";
import library from "../../../site/data/library.json";
import {
  createKnowledge, retrieve, buildRequest, validate, createRateLimiter,
  createDailyCap, createCache, cacheKey, anthropicText, tidy
} from "../../../lib/ask.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MODEL = process.env.ASK_MODEL || "claude-haiku-4-5-20251001";
const MAX_TOKENS = 400;

// Built once per instance; the JSON is bundled at build time.
const g = globalThis;
const K = g.__aina_ask_k ?? (g.__aina_ask_k = createKnowledge({ corpus, library }));
const limited = g.__aina_ask_rl ?? (g.__aina_ask_rl = createRateLimiter({ perMin: 10, perDay: 60 }));
const cap = g.__aina_ask_cap ?? (g.__aina_ask_cap = createDailyCap(Number(process.env.ASK_DAILY_CAP) || 300));
const cache = g.__aina_ask_cache ?? (g.__aina_ask_cache = createCache(300));
const inflight = g.__aina_ask_inflight ?? (g.__aina_ask_inflight = new Map());

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });
const fallback = (reason, status = 200) => json({ mode: "fallback", reason }, status);

const sse = (event, data) => `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
const cite = ps => ps.map(p => ({ tag: p.tag, title: p.title, url: p.url, kind: p.kind, source: p.source || null }));

function streamCached(entry) {
  const body = sse("meta", { passages: entry.passages }) + sse("delta", { t: entry.text }) + sse("done", { cached: true });
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

  if (process.env.ASK_LLM === "off") return fallback("llm off");
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return fallback("no key");

  // Retrieval sees the last visitor turn too, so "and how long?" keeps its subject.
  const lastUser = [...v.history].reverse().find(h => h.role === "user")?.text || "";
  const passages = retrieve(K, v.question + " " + lastUser);
  // Nothing to ground on: the deterministic engine answers for free.
  if (!passages.length) return fallback("no passages");

  const ck = v.history.length ? null : cacheKey(K.version, v.question);
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
    res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify(buildRequest({ passages, question: v.question, history: v.history, model: MODEL, maxTokens: MAX_TOKENS })),
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

  const meta = cite(passages);
  let settle;
  if (ck) inflight.set(ck, new Promise((r, j) => { settle = { r, j }; }).catch(() => null));

  const enc = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(enc.encode(sse("meta", { passages: meta })));
      let text = "", usage = {};
      try {
        for await (const ev of anthropicText(res)) {
          if (ev.text) {
            const t = tidy(ev.text);
            text += t;
            controller.enqueue(enc.encode(sse("delta", { t })));
          }
          if (ev.usage) usage = { ...usage, ...ev.usage };
        }
        controller.enqueue(enc.encode(sse("done", { cached: false })));
        // cost line for the logs: Haiku 4.5 at $1 / $5 per million tokens
        const cost = ((usage.input_tokens || 0) * 1 + (usage.output_tokens || 0) * 5) / 1e6;
        console.log(`[ask] ${MODEL} in=${usage.input_tokens || 0} out=${usage.output_tokens || 0} ~$${cost.toFixed(5)} calls_today=${cap.used}`);
        const entry = { text, passages: meta };
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
