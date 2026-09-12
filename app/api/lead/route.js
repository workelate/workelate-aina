// POST /api/lead — captures a lead from the on-page assistant. Replaces the
// old /api/score readiness widget (removed 2026-07-23, founder call). Same
// spam-guard shape as before: per-IP rate limit, size cap, honeypot, strict
// validation. Stores contact + the chat transcript so the founders read the
// intent, not just an address.
import { after } from "next/server";
import { insertChatLead, audit } from "../../../lib/db.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Every lead goes to one inbox, by founder instruction (2026-07-23): no other
// address. Overridable by env only so staging can point elsewhere, never
// broadened in code.
const NOTIFY_TO = process.env.LEAD_NOTIFY_TO || "chitransh@workelate.com";

// Send the notification the moment an email provider key exists; until then the
// lead is stored and the skip is recorded. Uses Resend's HTTP API (no npm dep,
// just fetch), gated on RESEND_API_KEY.
async function notify(lead) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { sent: false, reason: "no RESEND_API_KEY" };
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: process.env.LEAD_NOTIFY_FROM || "WE_AINA <onboarding@resend.dev>",
      to: [NOTIFY_TO],
      reply_to: lead.kind === "email" ? lead.contact : undefined,
      subject: `New lead: ${lead.contact} (${lead.industry || "no industry"})`,
      text: `Contact: ${lead.contact} [${lead.kind}]\nIndustry: ${lead.industry || "-"}\nPage: ${lead.path || "-"}\nWhen: ${lead.ts}\n\n--- conversation ---\n${lead.transcript || "(none)"}`
    })
  });
  if (!res.ok) return { sent: false, reason: `resend ${res.status}: ${(await res.text()).slice(0, 200)}` };
  return { sent: true };
}

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

// Character-class allowlist, not "anything without a space": the old pattern
// accepted a@b.c<script> and stored it verbatim, which then went into Resend's
// reply_to and made the send fail silently.
const EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}$/;
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
  // A missing x-forwarded-for used to collapse every visitor into one bucket
  // keyed "?", so eight anonymous requests rate-limited the entire site. With
  // no usable IP we fail OPEN: spam protection is not worth dropping leads.
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = fwd || req.headers.get("x-real-ip")?.trim() || null;

  const body = await req.text();
  if (body.length > 12_000) return json({ error: "too large" }, 413);

  let p;
  try { p = JSON.parse(body); } catch { return json({ error: "bad json" }, 400); }

  // honeypot: a hidden field bots fill and humans never see. Fake success.
  if (p.website) return json({ ok: true });

  const kind = classify(p.contact);
  if (!kind) return json({ error: "need a valid email or phone" }, 400);

  // Rate-limit AFTER validation so rejected junk (oversize, honeypot, bad
  // contact) cannot burn a real visitor's quota for the hour.
  if (ip && rateLimited(ip)) return json({ error: "rate limited" }, 429);

  const lead = {
    contact: String(p.contact).trim().slice(0, 254),
    kind,
    industry: typeof p.industry === "string" ? p.industry.slice(0, 40) : "",
    transcript: typeof p.transcript === "string" ? p.transcript : "",
    path: typeof p.path === "string" ? p.path.slice(0, 300) : "",
    ua: req.headers.get("user-agent") || "",
    ts: new Date().toISOString()
  };

  // On Vercel's ephemeral FS the SQLite store returns null. That used to return
  // early, BEFORE the notify below — so on the documented deploy target every
  // lead was discarded and never emailed while the visitor was told a founder
  // would call. The email is now the primary delivery path and always runs;
  // the database is the durable copy when one is configured.
  const id = await insertChatLead(lead);
  const persisted = id != null;
  if (persisted) {
    await audit(id, "chat_lead_captured", `${kind} · ${lead.industry || "no-industry"}`);
  }

  // email chitransh@workelate.com after the response is sent, stored or not
  after(async () => {
    try {
      const r = await notify(lead);
      if (persisted) {
        await audit(id, r.sent ? "notify_sent" : "notify_skipped",
          r.sent ? `to ${NOTIFY_TO}` : r.reason);
      } else if (!r.sent) {
        // Nowhere left to record it: say so loudly in the server log so a lost
        // lead is visible in `vercel logs` instead of vanishing silently.
        console.error("[lead] NOT STORED AND NOT EMAILED", r.reason, lead.contact);
      }
    } catch (e) {
      if (persisted) await audit(id, "notify_failed", e.message);
      else console.error("[lead] NOT STORED, notify threw", e.message, lead.contact);
    }
  });

  return json({ ok: true, persisted, ...(persisted ? { id } : { note: "lead store not configured" }) });
}
