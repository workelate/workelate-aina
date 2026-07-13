// Catch-all: serves the statically generated site (site/) and the scrub
// frame deck (assets/) byte-identical to the old zero-dependency server.
// Generators in scripts/ keep writing site/ — this route is the delivery
// layer, so a hand edit here never touches content.
import { createReadStream, existsSync, statSync } from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SITE = path.join(process.cwd(), "site");
const ASSETS = path.join(process.cwd(), "assets");

const MIME = {
  ".html": "text/html", ".css": "text/css", ".js": "text/javascript",
  ".mjs": "text/javascript", ".svg": "image/svg+xml", ".webp": "image/webp",
  ".json": "application/json", ".xml": "application/xml", ".ico": "image/x-icon",
  ".png": "image/png", ".txt": "text/plain", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".woff2": "font/woff2"
};

export async function GET(req) {
  const { pathname } = new URL(req.url);
  const rel = decodeURIComponent(pathname);

  let base = SITE, sub = rel;
  if (rel.startsWith("/assets/")) { base = ASSETS; sub = rel.slice("/assets/".length); }

  let p = path.normalize(path.join(base, sub));
  if (!p.startsWith(base)) return new Response("403", { status: 403 });
  if (existsSync(p) && statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (!existsSync(p)) {
    // extensionless routes → .html (for /systems/slug pages)
    if (existsSync(p + ".html")) p += ".html";
    else return new Response("404", { status: 404, headers: { "content-type": "text/plain" } });
  }

  return new Response(Readable.toWeb(createReadStream(p)), {
    status: 200,
    headers: {
      "content-type": MIME[path.extname(p)] || "application/octet-stream",
      "cache-control": p.includes("/frames/") ? "public, max-age=31536000, immutable" : "no-cache"
    }
  });
}
