// Weekly library crawl: the outside-world half of what the /studio assistant
// answers from (the other half is site/data/corpus.json, our own work).
//
//   node scripts/crawl-library.mjs            crawl, write site/data/library.json if it changed
//   node scripts/crawl-library.mjs --dry      crawl and report, write nothing
//   node scripts/crawl-library.mjs --only=id  crawl one source (debugging)
//
// Sources are curated in data/library-sources.json. Rules this script keeps:
//   * Polite: one identifying UA, robots.txt honoured per origin, one request at
//     a time per host with a pause between them, 15s timeouts, byte caps.
//   * Fresh: feed items older than WINDOW_DAYS are dropped. Our own product
//     pages are evergreen and are snapshotted whatever their date.
//   * Short: title + url + date + an excerpt of at most 300 characters + a one
//     line summary taken from the page's own description or first sentence.
//     Never the full text (copyright), and never a model call (cost).
//   * Stable: the output carries a content hash as its version, and the file is
//     only rewritten when that hash changes, so the weekly workflow commits
//     only when the library actually moved.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const SOURCES = path.join(ROOT, "data", "library-sources.json");
const OUT = path.join(ROOT, "site", "data", "library.json");

const UA = "WE_AINA-LibraryBot/1.0 (+https://aina.workelate.com/studio; weekly reading list, short excerpts with links)";
const UA_TOKEN = "we_aina-librarybot";
const WINDOW_DAYS = 30;
const TIMEOUT_MS = 15000;
const MAX_BYTES = 4_000_000;
const HOST_GAP_MS = 1200;
const CONCURRENCY = 5;
const EXCERPT_MAX = 300;
const SUMMARY_MAX = 200;

const args = process.argv.slice(2);
const DRY = args.includes("--dry");
const ONLY = args.find(a => a.startsWith("--only="))?.slice(7);

// ---------------------------------------------------------------- text utils
const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", hellip: "...", mdash: "-", ndash: "-", rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"' };
export function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => safeChar(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => safeChar(parseInt(d, 10)))
    .replace(/&([a-z]+);/gi, (m, n) => ENT[n.toLowerCase()] ?? m);
}
const safeChar = n => (n > 0 && n < 0x110000 ? String.fromCodePoint(n) : "");

export function toText(html) {
  return decodeEntities(
    String(html || "")
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/<(script|style|noscript|svg)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    // entities can decode into markup ("&lt;p&gt;"), strip once more
    .replace(/<[^>]+>/g, " ")
    .replace(/[—–]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}

export function clip(s, n) {
  if (s.length <= n) return s;
  const cut = s.slice(0, n - 3);
  const sp = cut.lastIndexOf(" ");
  return (sp > n * 0.6 ? cut.slice(0, sp) : cut).replace(/[\s,;:.-]+$/, "") + "...";
}

export function firstSentence(s, n = SUMMARY_MAX) {
  const m = s.match(/^(.{30,}?[.!?])(\s|$)/);
  return clip(m ? m[1] : s, n);
}

// Feed boilerplate that says nothing ("The post X appeared first on Y").
const BOILER = /\s*(The post .{0,200}? appeared first on .{0,80}?\.?|Continue reading.*|Read more.*|\[…\]|\[\.\.\.\])\s*$/i;

// ------------------------------------------------------------------ fetching
const lastHit = new Map();
async function politeFetch(url, { accept } = {}) {
  const host = new URL(url).host;
  const wait = (lastHit.get(host) || 0) + HOST_GAP_MS - Date.now();
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastHit.set(host, Date.now());
  const res = await fetch(url, {
    headers: { "user-agent": UA, accept: accept || "*/*" },
    redirect: "follow",
    signal: AbortSignal.timeout(TIMEOUT_MS)
  });
  lastHit.set(host, Date.now());
  const reader = res.body?.getReader();
  const chunks = [];
  let size = 0;
  if (reader) {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      size += value.length;
      if (size > MAX_BYTES) { await reader.cancel(); break; }
    }
  }
  const text = new TextDecoder("utf-8").decode(Buffer.concat(chunks.map(c => Buffer.from(c))));
  return { status: res.status, url: res.url || url, text, type: res.headers.get("content-type") || "" };
}

// ---------------------------------------------------------------- robots.txt
const robotsCache = new Map();
export function parseRobots(txt) {
  // groups: [{ agents:[], rules:[{allow,path}] }]
  const groups = [];
  let cur = null, lastWasAgent = false;
  for (const raw of txt.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    const m = line.match(/^([a-z-]+)\s*:\s*(.*)$/i);
    if (!m) continue;
    const key = m[1].toLowerCase(), val = m[2].trim();
    if (key === "user-agent") {
      if (!lastWasAgent || !cur) { cur = { agents: [], rules: [] }; groups.push(cur); }
      cur.agents.push(val.toLowerCase());
      lastWasAgent = true;
    } else {
      lastWasAgent = false;
      if (!cur) continue;
      if (key === "allow" || key === "disallow") cur.rules.push({ allow: key === "allow", path: val });
    }
  }
  const mine = groups.filter(g => g.agents.some(a => a !== "*" && UA_TOKEN.includes(a)));
  const star = groups.filter(g => g.agents.includes("*"));
  return (mine.length ? mine : star).flatMap(g => g.rules);
}

function ruleMatches(rulePath, p) {
  if (!rulePath) return false;
  const anchored = rulePath.endsWith("$");
  const body = (anchored ? rulePath.slice(0, -1) : rulePath)
    .split("*").map(s => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join(".*");
  return new RegExp("^" + body + (anchored ? "$" : "")).test(p);
}

export function robotsAllows(rules, p) {
  let best = null;
  for (const r of rules) {
    if (!r.path) continue;                       // "Disallow:" (empty) allows all
    if (!ruleMatches(r.path, p)) continue;
    if (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.allow)) best = r;
  }
  return best ? best.allow : true;
}

async function allowed(url) {
  const u = new URL(url);
  if (!robotsCache.has(u.origin)) {
    let rules = [];
    try {
      const r = await politeFetch(u.origin + "/robots.txt", { accept: "text/plain" });
      // 4xx robots = no restrictions; 5xx or network error = be conservative
      if (r.status >= 500) rules = [{ allow: false, path: "/" }];
      else if (r.status === 200) rules = parseRobots(r.text);
    } catch {
      rules = [{ allow: false, path: "/" }];
    }
    robotsCache.set(u.origin, rules);
  }
  return robotsAllows(robotsCache.get(u.origin), u.pathname + u.search);
}

// -------------------------------------------------------------------- feeds
const tag = (xml, name) => {
  const m = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, "i"));
  return m ? m[1] : "";
};

export function parseFeed(xml) {
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || xml.match(/<entry[\s>][\s\S]*?<\/entry>/gi) || [];
  return blocks.map(b => {
    let link = toText(tag(b, "link"));
    if (!link) {
      const alt = b.match(/<link[^>]*rel=["']alternate["'][^>]*href=["']([^"']+)["']/i)
        || b.match(/<link[^>]*href=["']([^"']+)["']/i);
      link = alt ? decodeEntities(alt[1]) : "";
    }
    if (!/^https?:\/\//.test(link)) {
      const guid = toText(tag(b, "guid"));
      if (/^https?:\/\//.test(guid)) link = guid;
    }
    const dateRaw = toText(tag(b, "pubDate") || tag(b, "dc:date") || tag(b, "published") || tag(b, "updated"));
    const d = dateRaw ? new Date(dateRaw) : null;
    const desc = toText(tag(b, "description") || tag(b, "summary") || tag(b, "content:encoded") || tag(b, "content")).replace(BOILER, "");
    return {
      title: toText(tag(b, "title")),
      url: link.trim(),
      date: d && !isNaN(d) ? d.toISOString().slice(0, 10) : null,
      text: desc
    };
  }).filter(x => x.title && x.url);
}

// -------------------------------------------------------------------- pages
const meta = (html, attr, name) => {
  const re1 = new RegExp(`<meta[^>]+${attr}=["']${name}["'][^>]*content=["']([^"']*)["']`, "i");
  const re2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]*${attr}=["']${name}["']`, "i");
  const m = html.match(re1) || html.match(re2);
  return m ? toText(m[1]) : "";
};

export function parsePage(html) {
  const title = meta(html, "property", "og:title") || toText(tag(html, "title"));
  const description = meta(html, "name", "description") || meta(html, "property", "og:description");
  const published = meta(html, "property", "article:published_time") || meta(html, "property", "article:modified_time");
  const body = html.replace(/<(header|nav|footer|script|style)[\s\S]*?<\/\1>/gi, " ");
  const paras = (body.match(/<p[\s>][\s\S]*?<\/p>/gi) || []).map(toText).filter(p => p.length > 60);
  const d = published ? new Date(published) : null;
  return {
    title,
    date: d && !isNaN(d) ? d.toISOString().slice(0, 10) : null,
    text: [description, paras[0] || ""].filter(Boolean).join(" ")
  };
}

// ------------------------------------------------------------------ helpers
export function normUrl(u) {
  try {
    const x = new URL(u);
    for (const k of [...x.searchParams.keys()]) if (/^(utm_|ref$|source$|mc_)/i.test(k)) x.searchParams.delete(k);
    x.hash = "";
    return (x.origin.replace("://www.", "://") + x.pathname.replace(/\/+$/, "") + (x.search || "")).toLowerCase();
  } catch { return u.toLowerCase(); }
}

function makeItem(src, raw, crawledOn) {
  const text = raw.text || "";
  return {
    id: createHash("sha1").update(normUrl(raw.url)).digest("hex").slice(0, 12),
    source: src.name,
    sourceId: src.id,
    scope: src.scope,
    topic: src.topic,
    title: clip(raw.title, 160),
    url: raw.url,
    date: raw.date || null,
    seen: crawledOn,
    summary: text ? firstSentence(text) : "",
    excerpt: text ? clip(text, EXCERPT_MAX) : ""
  };
}

const withinWindow = (date, now) => date && (now - new Date(date + "T00:00:00Z")) / 86400000 <= WINDOW_DAYS;

// ------------------------------------------------------------------ crawlers
async function crawlFeed(src, now, day) {
  if (!(await allowed(src.url))) return { items: [], note: "robots.txt disallows" };
  const r = await politeFetch(src.url, { accept: "application/rss+xml, application/atom+xml, application/xml, text/xml" });
  if (r.status !== 200) return { items: [], note: `HTTP ${r.status}` };
  const all = parseFeed(r.text);
  const fresh = all.filter(x => withinWindow(x.date, now))
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
    .slice(0, src.max || 5);
  return { items: fresh.map(x => makeItem(src, x, day)), note: `${all.length} in feed, ${fresh.length} kept` };
}

async function crawlPage(src, url, day) {
  if (!(await allowed(url))) return { items: [], note: "robots.txt disallows" };
  const r = await politeFetch(url, { accept: "text/html" });
  if (r.status !== 200 || !/html/i.test(r.type)) return { items: [], note: `HTTP ${r.status}` };
  const p = parsePage(r.text);
  if (!p.title) return { items: [], note: "no title" };
  return { items: [makeItem(src, { ...p, url }, day)], note: "page" };
}

async function crawlSitemap(src, day) {
  if (!(await allowed(src.url))) return { items: [], note: "robots.txt disallows" };
  const r = await politeFetch(src.url, { accept: "application/xml" });
  if (r.status !== 200) return { items: [], note: `HTTP ${r.status}` };
  const locs = [...r.text.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map(m => decodeEntities(m[1]))
    .filter(u => !src.match || u.includes(src.match))
    .filter(u => !src.match || !u.replace(/\/+$/, "").endsWith(src.match.replace(/\/+$/, "")))
    .slice(0, src.max || 5);
  const items = [];
  for (const u of locs) {
    try { items.push(...(await crawlPage(src, u, day)).items); } catch { /* one page failing never sinks the source */ }
  }
  return { items, note: `${locs.length} pages from sitemap` };
}

async function crawlSource(src, now, day) {
  try {
    if (src.type === "feed") return await crawlFeed(src, now, day);
    if (src.type === "page") return await crawlPage(src, src.url, day);
    if (src.type === "sitemap") return await crawlSitemap(src, day);
    return { items: [], note: `unknown type ${src.type}` };
  } catch (e) {
    return { items: [], note: `error: ${e.message.slice(0, 80)}` };
  }
}

export function dedupe(items) {
  const seenUrl = new Set(), seenTitle = new Set(), out = [];
  for (const it of items) {
    const u = normUrl(it.url);
    const t = it.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    if (seenUrl.has(u) || (t.length > 20 && seenTitle.has(t))) continue;
    seenUrl.add(u); seenTitle.add(t);
    out.push(it);
  }
  return out;
}

// --------------------------------------------------------------------- main
async function main() {
  const { sources } = JSON.parse(readFileSync(SOURCES, "utf8"));
  const list = ONLY ? sources.filter(s => s.id === ONLY) : sources;
  const now = Date.now();
  const day = new Date(now).toISOString().slice(0, 10);

  const results = new Array(list.length);
  let next = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (next < list.length) {
      const i = next++;
      results[i] = await crawlSource(list[i], now, day);
    }
  }));

  let ok = 0;
  const report = [];
  const collected = [];
  list.forEach((s, i) => {
    const r = results[i];
    if (r.items.length) ok++;
    report.push(`${r.items.length ? "ok  " : "--  "} ${String(r.items.length).padStart(2)}  ${s.id.padEnd(24)} ${r.note}`);
    collected.push(...r.items);
  });
  const items = dedupe(collected);

  // version = hash of the content, so an unchanged library is an unchanged file
  const hashBody = items.map(it => [it.url, it.title, it.date, it.excerpt].join("\u0001")).join("\u0002");
  const version = createHash("sha1").update(hashBody).digest("hex").slice(0, 12);

  console.log(report.join("\n"));
  console.log(`\ncrawl-library: ${ok}/${list.length} sources returned items, ${items.length} items after dedupe, version ${version}`);

  if (DRY || ONLY) { console.log("(dry run, nothing written)"); return; }

  if (existsSync(OUT)) {
    try {
      const prev = JSON.parse(readFileSync(OUT, "utf8"));
      if (prev.version === version) { console.log("unchanged, not rewritten"); return; }
    } catch { /* unreadable previous file: overwrite */ }
  }
  if (!items.length) {
    // A network outage must not wipe a good library.
    console.error("zero items crawled, keeping the previous library");
    process.exitCode = 1;
    return;
  }
  const out = {
    version,
    generated: day,
    windowDays: WINDOW_DAYS,
    note: "Weekly reading library for the /studio assistant. Short excerpts with links to the original; generated by scripts/crawl-library.mjs, never hand-edit.",
    sources: list.length,
    sourcesWithItems: ok,
    items
  };
  writeFileSync(OUT, JSON.stringify(out, null, 1) + "\n");
  console.log(`wrote ${path.relative(ROOT, OUT)} (${(Buffer.byteLength(JSON.stringify(out)) / 1024).toFixed(0)} KB)`);
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
