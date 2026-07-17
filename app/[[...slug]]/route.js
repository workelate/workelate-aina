// Catch-all delivery layer. Serves the statically generated site (site/) and
// the scrub frame deck (assets/) that the generators in scripts/ keep writing.
//
// Vercel note: this route is STATICALLY PRERENDERED. generateStaticParams()
// enumerates every servable file at build time, force-static makes Next emit
// each GET as a CDN artifact, and dynamicParams=false turns any unknown path
// into a real 404. Files are read at BUILD (cwd is fully present then), so
// there is no runtime filesystem dependency on the serverless bundle.
import { readdirSync, statSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";

export const dynamic = "force-static";
export const dynamicParams = false;

const SITE = path.join(process.cwd(), "site");
const ASSETS = path.join(process.cwd(), "assets");

const MIME = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".json": "application/json",
  ".xml": "application/xml; charset=utf-8", ".ico": "image/x-icon", ".png": "image/png",
  ".txt": "text/plain; charset=utf-8", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".woff2": "font/woff2"
};

// A file's public URL is its path minus the .html extension; index.html maps to
// its directory. Assets keep their extension. Returns a slug array for the
// optional catch-all ([] == site root "/").
function toSlug(base, filePath) {
  let rel = path.relative(base, filePath).split(path.sep);
  if (base === ASSETS) rel = ["assets", ...rel];
  const last = rel[rel.length - 1];
  if (last === "index.html") rel.pop();
  else if (last.endsWith(".html")) rel[rel.length - 1] = last.slice(0, -".html".length);
  return rel;
}

function walk(dir, base, out) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, base, out);
    else out.push(toSlug(base, p));
  }
}

export function generateStaticParams() {
  const out = [];
  if (existsSync(SITE)) walk(SITE, SITE, out);
  if (existsSync(ASSETS)) walk(ASSETS, ASSETS, out);
  return out.map(slug => ({ slug }));
}

// Reverse the clean-URL mapping back to a file on disk.
function resolve(slug = []) {
  let base = SITE, parts = slug;
  if (parts[0] === "assets") { base = ASSETS; parts = parts.slice(1); }

  let p = path.normalize(path.join(base, ...parts));
  if (!p.startsWith(base)) return null; // path traversal guard

  if (existsSync(p) && statSync(p).isDirectory()) p = path.join(p, "index.html");
  if (existsSync(p)) return p;
  if (existsSync(p + ".html")) return p + ".html"; // extensionless clean URL
  return null;
}

function cacheFor(p) {
  if (/[\\/](frames|fonts)[\\/]/.test(p)) return "public, max-age=31536000, immutable";
  if (/[\\/]img[\\/]/.test(p)) return "public, max-age=604800";       // 7d — photos are stable
  if (/\.(css|js|mjs)$/.test(p)) return "public, max-age=3600";       // rev on deploy, keep short
  if (p.endsWith(".html")) return "public, max-age=0, must-revalidate";
  return "public, max-age=3600";
}

export async function GET(_req, { params }) {
  const { slug } = await params;
  const p = resolve(slug);
  if (!p) return new Response("404", { status: 404, headers: { "content-type": "text/plain" } });

  return new Response(readFileSync(p), {
    status: 200,
    headers: {
      "content-type": MIME[path.extname(p)] || "application/octet-stream",
      "cache-control": cacheFor(p)
    }
  });
}
