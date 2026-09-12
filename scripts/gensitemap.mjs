// The sitemap and robots.txt, DERIVED from what is actually under site/.
//
// Until 2026-09-12 scripts/gensystems.mjs wrote the sitemap from a hand list,
// and the day the site restructured into zones the live sitemap advertised 16
// routes that now 404 and none of the 61 new pages. A list somebody has to
// remember to extend is the failure mode this repo already knows.
//
// So: walk site/, map every .html to the clean URL app/[[...slug]]/route.js
// serves, skip dot-prefixed paths (never public), and write the lot.
//
//   node scripts/gensitemap.mjs        run it LAST, after every page generator
import { readdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";

const SITE = path.join(import.meta.dirname, "..", "site");
const ORIGIN = "https://aina.workelate.com";

function pages(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) pages(p, out);
    else if (name.endsWith(".html")) out.push(p);
  }
  return out;
}
function routeOf(file) {
  const rel = path.relative(SITE, file).split(path.sep);
  const last = rel[rel.length - 1];
  if (last === "index.html") rel.pop();
  else rel[rel.length - 1] = last.slice(0, -".html".length);
  return "/" + rel.join("/");
}

const routes = pages(SITE).map(routeOf).sort();
writeFileSync(path.join(SITE, "sitemap.xml"),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(r => `  <url><loc>${ORIGIN}${r === "/" ? "/" : r}</loc></url>`).join("\n")}
</urlset>
`);
writeFileSync(path.join(SITE, "robots.txt"),
`User-agent: *
Allow: /
Sitemap: ${ORIGIN}/sitemap.xml
`);
console.log(`gensitemap: ${routes.length} routes`);
