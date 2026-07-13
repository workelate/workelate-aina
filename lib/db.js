// Shared sqlite handle (node:sqlite, zero npm deps for the data layer).
// Cached on globalThis so Next dev recompiles don't stack open handles.
import path from "node:path";
import { DatabaseSync } from "node:sqlite";

function open() {
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
  return db;
}

export const db = globalThis.__aina_db ?? (globalThis.__aina_db = open());

export const audit = (leadId, step, detail) =>
  db.prepare("INSERT INTO audit (lead_id, step, detail, ts) VALUES (?,?,?,?)")
    .run(leadId, step, String(detail).slice(0, 2000), new Date().toISOString());
