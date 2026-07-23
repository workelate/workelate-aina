// POST /api/lead — captures a lead from the on-page assistant. Replaces the
// old /api/score readiness widget (removed 2026-07-23, founder call). Same
// spam-guard shape as before: per-IP rate limit, size cap, honeypot, strict
// validation. Stores contact + the chat transcript so the founders read the
// intent, not just an address.
import { after } from "next/server";
import { insertChatLead, audit } from "../../../lib/db.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// per-IP rate limit, in memory (mirrors the retired score route)
const RATE_LIMIT = 8, RATE_WINDOW_MS = 60 * 60 * 1000;
const hits = globalThis.__aina_lead_hits ?? (globalThis.__aina_lead_hits = new Map());
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  if (list.length >= RATE_LIMIT) { hits.set(ip, list); return true; }
  list.push(now); hits.set(ip, list);
  if (hits.size > 10000) hits.clear();
  return false;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// permissive international phone: 7-15 digits, optional +, spaces/dashes/parens
const PHONE = /^\+?[\d][\d\s\-()]{6,18}\d$/;

function classify(contact) {
  const c = String(contact || "").trim();
  if (EMAIL.test(c)) return "email";
  if (PHONE.test(c) && (c.match(/\d/g) || []).length >= 7) return "phone";
  return null;
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "?";
  if (rateLimited(ip)) return json({ error: "rate limited" }, 429);

  const body = await req.text();
  if (body.length > 12_000) return json({ error: "too large" }, 413);

  let p;
  try { p = JSON.parse(body); } catch { return json({ error: "bad json" }, 400); }

  // honeypot: a hidden field bots fill and humans never see. Fake success.
  if (p.website) return json({ ok: true });

  const kind = classify(p.contact);
  if (!kind) return json({ error: "need a valid email or phone" }, 400);

  const lead = {
    contact: String(p.contact).trim().slice(0, 254),
    kind,
    industry: typeof p.industry === "string" ? p.industry.slice(0, 40) : "",
    transcript: typeof p.transcript === "string" ? p.transcript : "",
    path: typeof p.path === "string" ? p.path.slice(0, 300) : "",
    ua: req.headers.get("user-agent") || "",
    ts: new Date().toISOString()
  };

  // Same degradation contract as the score route: on Vercel's ephemeral FS the
  // store returns null and we still hand back a receipt. Wire a hosted store
  // (Turso/libSQL) to persist in prod.
  const id = await insertChatLead(lead);
  if (id == null) return json({ ok: true, persisted: false, note: "lead store not configured" });

  await audit(id, "chat_lead_captured", `${kind} · ${lead.industry || "no-industry"}`);
  // notify (email/SMS) once creds exist; recorded as skipped until then
  after(async () => {
    await audit(id, "notify_skipped", "SMTP/SMS not configured; lead stored only");
  });

  return json({ ok: true, persisted: true, id });
}
