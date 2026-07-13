// POST /api/score — ported from server.mjs. Same contract, same spam guard,
// same audit trail: every step recorded in the audit table.
import { after } from "next/server";
import { db, audit } from "../../../lib/db.js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ---- report generation (Anthropic; stubbed until ANTHROPIC_API_KEY exists) ----
async function generateReport(payload) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { stub: true, text: "No ANTHROPIC_API_KEY set, report generation skipped." };
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json"
    },
    body: JSON.stringify({
      model: process.env.AINA_MODEL || "claude-sonnet-4-6",
      max_tokens: 1500,
      system: "You are WE_AINA's diagnostic engine. Given this business profile, produce a 1-page report: 3 specific automation opportunities for THIS business (name the workflow, the system we'd build, the estimated hours/money recovered, conservative numbers), then one paragraph on why building-materials operators specifically leak money here. Blunt operator tone. No buzzwords. End with the Diagnostic Sprint offer.",
      messages: [{ role: "user", content: JSON.stringify(payload) }]
    })
  });
  if (!res.ok) throw new Error(`anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { stub: false, text: data.content?.map(b => b.text || "").join("") || "" };
}

// ---- spam guard: in-memory per-IP rate limit + payload validation ----
const RATE_LIMIT = 5, RATE_WINDOW_MS = 60 * 60 * 1000;
const hits = globalThis.__aina_hits ?? (globalThis.__aina_hits = new Map()); // ip -> [timestamps]
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter(t => now - t < RATE_WINDOW_MS);
  if (list.length >= RATE_LIMIT) { hits.set(ip, list); return true; }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 10000) hits.clear(); // memory backstop
  return false;
}

const VALID = {
  industry: ["building-materials", "manufacturing", "logistics", "other"],
  revenue: ["lt5cr", "5-50cr", "50-500cr"],
  team: ["lt10", "10-50", "50-250", "250plus"],
  stack: ["excel-whatsapp", "tally-erp", "custom", "ai"]
};
function validate(p) {
  if (typeof p !== "object" || p === null) return "bad payload";
  if (p.website) return "honeypot"; // hidden field, humans never fill it
  if (typeof p.email !== "string" || p.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return "bad email";
  const a = p.answers;
  if (typeof a !== "object" || a === null) return "bad answers";
  if (a.industry != null && !VALID.industry.includes(a.industry)) return "bad industry";
  if (a.revenue != null && !VALID.revenue.includes(a.revenue)) return "bad revenue";
  if (a.team != null && !VALID.team.includes(a.team)) return "bad team";
  if (typeof a.bottleneck !== "string" || a.bottleneck.length > 200) return "bad bottleneck";
  if (!Array.isArray(a.stack) || a.stack.length > 4 || a.stack.some(s => !VALID.stack.includes(s))) return "bad stack";
  if (typeof p.score !== "number" || p.score < 0 || p.score > 100) return "bad score";
  return null;
}

const json = (obj, status = 200) =>
  new Response(JSON.stringify(obj), { status, headers: { "content-type": "application/json" } });

export async function POST(req) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "?";
  if (rateLimited(ip)) return json({ error: "rate limited" }, 429);

  const body = await req.text();
  if (body.length > 10_000) return json({ error: "too large" }, 413);

  let payload;
  try { payload = JSON.parse(body); }
  catch { return json({ error: "bad json" }, 400); }

  const invalid = validate(payload);
  if (invalid) {
    // honeypot gets a fake 200 so bots don't learn; real validation errors are honest
    if (invalid === "honeypot") return json({ ok: true });
    return json({ error: invalid }, 400);
  }

  const { email = "", answers = {}, score = 0, qualified = false, ts = new Date().toISOString() } = payload;
  const { lastInsertRowid: leadId } = db.prepare(
    "INSERT INTO leads (email, answers, score, qualified, ts) VALUES (?,?,?,?,?)"
  ).run(email, JSON.stringify(answers), score | 0, qualified ? 1 : 0, ts);
  audit(leadId, "lead_stored", `score=${score} qualified=${qualified}`);

  // report generation after the response is sent; lead is already stored
  after(async () => {
    try {
      const report = await generateReport(payload);
      audit(leadId, report.stub ? "report_stubbed" : "report_generated", report.text.slice(0, 500));
      // SMTP not configured: log instead of send, keep the receipt
      audit(leadId, "email_skipped", "SMTP not configured, report stored in audit only");
    } catch (e) {
      audit(leadId, "report_failed", e.message);
    }
  });

  return json({ ok: true, leadId: Number(leadId) });
}
