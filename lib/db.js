// Lead + audit store. node:sqlite (zero npm deps), file at leads.db.
//
// Vercel note: serverless filesystems are ephemeral/read-only, and node:sqlite
// needs Node >=22.5 — so the store is opened LAZILY behind a guard. Where it
// can't open (Vercel, or an older runtime) the store degrades to unavailable
// and the caller records the skip in the audit trail instead of crashing. Wire
// a hosted store (Turso/libSQL is closest to this SQL) to persist on Vercel.
import path from "node:path";

// state: null (untried) | { db } (open) | { reason } (unavailable)
async function store() {
  if (globalThis.__aina_store) return globalThis.__aina_store;

  // Persistent local writes only. Vercel's FS won't keep leads.db between
  // invocations, so don't pretend to persist there.
  if (process.env.VERCEL) {
    return (globalThis.__aina_store = { reason: "vercel-ephemeral-fs" });
  }
  try {
    const { DatabaseSync } = await import("node:sqlite");
    const db = new DatabaseSync(path.join(process.cwd(), "leads.db"));
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
    return (globalThis.__aina_store = { db });
  } catch (e) {
    return (globalThis.__aina_store = { reason: e.message });
  }
}

export async function dbAvailable() {
  return !!(await store()).db;
}

// Returns the new lead id, or null when no store is available.
export async function insertLead({ email, answers, score, qualified, ts }) {
  const s = await store();
  if (!s.db) return null;
  const { lastInsertRowid } = s.db.prepare(
    "INSERT INTO leads (email, answers, score, qualified, ts) VALUES (?,?,?,?,?)"
  ).run(email, JSON.stringify(answers), score | 0, qualified ? 1 : 0, ts);
  return Number(lastInsertRowid);
}

export async function audit(leadId, step, detail) {
  const s = await store();
  if (!s.db) return; // no-op when store is unavailable; caller logs the skip
  s.db.prepare("INSERT INTO audit (lead_id, step, detail, ts) VALUES (?,?,?,?)")
    .run(leadId, step, String(detail).slice(0, 2000), new Date().toISOString());
}
