// Build browser-ready CSS/JS from readable source, then point every static page
// at the generated assets. Run after page/chrome/SEO generators: those retain
// readable source paths in their templates; this final pass owns deploy paths.
//
// Uses the minifiers already pinned inside Next.js, so no second CSS/JS toolchain
// or dependency version can drift from the delivery layer.
import { createRequire } from "node:module";
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import postcss from "postcss";

const require = createRequire(import.meta.url);
const cssnanoSimple = require("next/dist/compiled/cssnano-simple");
const { minify } = require("next/dist/compiled/terser");

const ROOT = path.join(import.meta.dirname, "..");
const SITE = path.join(ROOT, "site");
const CSS = ["site", "compare"];
const JS = ["nav", "reveal", "workgraph", "chat", "main"];

function pages(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".")) continue;
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) pages(file, out);
    else if (name.endsWith(".html")) out.push(file);
  }
  return out;
}

let sourceBytes = 0;
let outputBytes = 0;

for (const name of CSS) {
  const source = path.join(SITE, "css", `${name}.css`);
  const output = path.join(SITE, "css", `${name}.min.css`);
  const input = readFileSync(source, "utf8");
  const result = await postcss([
    cssnanoSimple({ colormin: false }, postcss)
  ]).process(input, { from: source, to: output, map: false });
  writeFileSync(output, result.css);
  sourceBytes += Buffer.byteLength(input);
  outputBytes += Buffer.byteLength(result.css);
}

for (const name of JS) {
  const source = path.join(SITE, "js", `${name}.js`);
  const output = path.join(SITE, "js", `${name}.min.js`);
  const input = readFileSync(source, "utf8");
  const result = await minify(input, {
    module: name !== "nav",
    compress: { passes: 2 },
    mangle: true,
    format: { comments: false }
  });
  if (!result.code) throw new Error(`Terser emitted no code for ${source}`);
  writeFileSync(output, result.code);
  sourceBytes += Buffer.byteLength(input);
  outputBytes += Buffer.byteLength(result.code);
}

let changed = 0;
const refs = [
  ...CSS.map(name => [`/css/${name}.css`, `/css/${name}.min.css`]),
  ...JS.map(name => [`/js/${name}.js`, `/js/${name}.min.js`])
];
for (const file of pages(SITE)) {
  const input = readFileSync(file, "utf8");
  let output = input;
  for (const [source, generated] of refs) output = output.replaceAll(source, generated);
  if (output !== input) {
    writeFileSync(file, output);
    changed++;
  }
}

const saved = sourceBytes - outputBytes;
const pct = Math.round((saved / sourceBytes) * 100);
console.log(`genassets: 7 assets, ${sourceBytes} -> ${outputBytes} bytes (-${pct}%); ${changed} pages updated`);
