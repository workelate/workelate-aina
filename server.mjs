import http from "node:http";
import { readFile } from "node:fs/promises";
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

const PORT = process.env.PORT || 4310;
const ROOT = path.join(import.meta.dirname, "site");
const FRAMES = path.join(import.meta.dirname, "assets");

// ---- DB ----
const db = new DatabaseSync(path.join(import.meta.dirname, "leads.db"));
db.exec(`
  CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT, answers TEXT, score INTEGER, qualified INTEGER, ts TEXT
  );
  CREATE TABLE IF NOT EXISTS audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lead_id INTEGER, step TEXT, detail TEXT, ts TEXT
  );
`);
const audit = (leadId, step, detail) =>
  db.prepare("INSERT INTO audit (lead_id, step, detail, ts) VALUES (?,?,?,?)")
    .run(leadId, step, String(detail).slice(0, 2000), new Date().toISOString());

// ---- report generation (Anthropic) ----
async function generateReport(payload) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) return { stub: true, text: "No ANTHROPIC_API_KEY set — report generation skipped." };
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
      system: "You are WE_AINA's diagnostic engine. Given this business profile, produce a 1-page report: 3 specific automation opportunities for THIS business (name the workflow, the system we'd build, the estimated hours/money recovered — conservative numbers), then one paragraph on why building-materials operators specifically leak money here. Blunt operator tone. No buzzwords. End with the Diagnostic Sprint offer.",
      messages: [{ role: "user", content: JSON.stringify(payload) }]
    })
  });
  if (!res.ok) throw new Error(`anthropic ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return { stub: false, text: data.content?.map(b => b.text || "").join("") || "" };
}

// ---- spam guard: in-memory per-IP rate limit + payload validation ----
const RATE_LIMIT = 5, RATE_WINDOW_MS = 60 * 60 * 1000;
const hits = new Map(); // ip -> [timestamps]
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
  if (p.website) return "honeypot"; // hidden field — humans never fill it
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

// ---- api ----
async function handleScore(req, res) {
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket.remoteAddress || "?";
  if (rateLimited(ip)) {
    res.writeHead(429, { "content-type": "application/json" });
    return res.end('{"error":"rate limited"}');
  }
  let body = "";
  for await (const chunk of req) {
    body += chunk;
    if (body.length > 10_000) { res.writeHead(413); return res.end('{"error":"too large"}'); }
  }
  let payload;
  try { payload = JSON.parse(body); }
  catch { res.writeHead(400); return res.end('{"error":"bad json"}'); }

  const invalid = validate(payload);
  if (invalid) {
    // honeypot gets a fake 200 so bots don't learn; real validation errors are honest
    if (invalid === "honeypot") { res.writeHead(200, { "content-type": "application/json" }); return res.end('{"ok":true}'); }
    res.writeHead(400, { "content-type": "application/json" });
    return res.end(JSON.stringify({ error: invalid }));
  }

  const { email = "", answers = {}, score = 0, qualified = false, ts = new Date().toISOString() } = payload;
  const { lastInsertRowid: leadId } = db.prepare(
    "INSERT INTO leads (email, answers, score, qualified, ts) VALUES (?,?,?,?,?)"
  ).run(email, JSON.stringify(answers), score | 0, qualified ? 1 : 0, ts);
  audit(leadId, "lead_stored", `score=${score} qualified=${qualified}`);

  res.writeHead(200, { "content-type": "application/json" });
  res.end(JSON.stringify({ ok: true, leadId: Number(leadId) }));

  // report generation after response — lead is already stored
  try {
    const report = await generateReport(payload);
    audit(leadId, report.stub ? "report_stubbed" : "report_generated", report.text.slice(0, 500));
    // SMTP not configured in dev: log instead of send, keep the receipt
    audit(leadId, "email_skipped", "SMTP not configured — report stored in audit only");
  } catch (e) {
    audit(leadId, "report_failed", e.message);
  }
}

// ---- static ----
const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".mjs": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp",
  ".json": "application/json", ".xml": "application/xml", ".ico": "image/x-icon",
  ".png": "image/png", ".txt": "text/plain"
};

function serveStatic(res, base, rel) {
  let p = path.normalize(path.join(base, rel));
  if (!p.startsWith(base)) { res.writeHead(403); return res.end(); }
  if (existsSync(p) && statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!existsSync(p)) {
    // extensionless routes → .html (for /systems/slug pages)
    if (existsSync(p + ".html")) p += ".html";
    else { res.writeHead(404, { "content-type": "text/plain" }); return res.end("404"); }
  }
  res.writeHead(200, {
    "content-type": MIME[path.extname(p)] || "application/octet-stream",
    "cache-control": p.includes("/frames/") ? "public, max-age=31536000, immutable" : "no-cache"
  });
  createReadStream(p).pipe(res);
}

http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (req.method === "POST" && url.pathname === "/api/score")
    return handleScore(req, res).catch(e => { res.writeHead(500); res.end(JSON.stringify({ error: e.message })); });
  if (url.pathname.startsWith("/assets/"))
    return serveStatic(res, FRAMES, url.pathname.slice("/assets/".length));
  return serveStatic(res, ROOT, url.pathname);
}).listen(PORT, () => console.log(`WE_AINA dev server → http://localhost:${PORT}`));
