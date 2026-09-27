// Unknown paths (dynamicParams=false on the catch-all) land here. The page is
// site/404.html, written like every other page and given its chrome by
// scripts/genchrome.mjs; this reads it at build time and renders its body, so
// the 404 is never a second, hand-kept copy of the design.
import { readFileSync } from "node:fs";
import path from "node:path";

export const metadata = {
  title: "Page not found · WorkElate Excellence Studio",
  robots: { index: false, follow: true },
};

function page() {
  const html = readFileSync(path.join(process.cwd(), "site", "404.html"), "utf8");
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] || "";
  const css = html.match(/<link rel="stylesheet" href="([^"]+)"/)?.[1] || "/css/site.min.css";
  return { body: body.replace(/<script[\s\S]*?<\/script>/g, ""), css };
}

export default function NotFound() {
  const { body, css } = page();
  return (
    <>
      <link rel="stylesheet" href={css} precedence="default" />
      <div dangerouslySetInnerHTML={{ __html: body }} />
      <script src="/js/nav.min.js" defer />
    </>
  );
}
