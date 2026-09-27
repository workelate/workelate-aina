// Unknown paths (dynamicParams=false on app/[[...slug]]/route.js) fall through
// to this page, which Next prerenders to a static 404.html with a real 404
// status. Its content is site/404.html, written like every other page and
// given its chrome by scripts/genchrome.mjs, read here at BUILD time, so the
// 404 is never a second, hand-kept copy of the design.
import Head from "next/head";
import { readFileSync } from "node:fs";
import path from "node:path";

export async function getStaticProps() {
  const html = readFileSync(path.join(process.cwd(), "site", "404.html"), "utf8");
  const body = (html.match(/<body[^>]*>([\s\S]*?)<\/body>/)?.[1] || "").replace(/<script[\s\S]*?<\/script>/g, "");
  const css = html.match(/<link rel="stylesheet" href="([^"]+)"/)?.[1] || "/css/site.min.css";
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] || "Page not found";
  return { props: { body, css, title } };
}

export default function NotFound({ body, css, title }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex,follow" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="stylesheet" href={css} />
        <script src="/js/nav.min.js" defer />
      </Head>
      <div className="hub" dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}
