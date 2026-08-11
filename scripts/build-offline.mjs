import { build } from "vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

const scriptsDirectory = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptsDirectory, "..");
const buildDirectory = resolve(projectRoot, ".offline-build");
const outputFile = resolve(projectRoot, "Reviewer-2-Major-Revision.html");
const pagesDirectory = resolve(projectRoot, ".pages");
const pagesFile = resolve(pagesDirectory, "index.html");

await build({
  configFile: resolve(projectRoot, "vite.offline.config.ts"),
});

let html = await readFile(resolve(buildDirectory, "index.html"), "utf8");

const resolveAsset = (assetUrl) =>
  resolve(buildDirectory, assetUrl.replace(/^(?:\.\/|\/)+/, ""));

const scriptTags = [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+\.js)"[^>]*><\/script>/g)];
for (const match of scriptTags) {
  const source = await readFile(resolveAsset(match[1]), "utf8");
  const safeSource = source.replace(/<\/script/gi, "<\\/script");
  // A function replacement is required here. Minified framework code may
  // contain `$&`, `$\`` or `$'`, which String.replace would otherwise expand
  // against the original external script tag and corrupt the offline bundle.
  html = html.replace(
    match[0],
    () => `<script type="module">${safeSource}</script>`,
  );
}

const stylesheetTags = [...html.matchAll(/<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+\.css)"[^>]*>/g)];
for (const match of stylesheetTags) {
  const styles = await readFile(resolveAsset(match[1]), "utf8");
  html = html.replace(match[0], () => `<style>${styles}</style>`);
}

if (scriptTags.length !== 1 || stylesheetTags.length !== 1) {
  throw new Error(`Expected one JavaScript bundle and one stylesheet, received ${scriptTags.length} and ${stylesheetTags.length}.`);
}

html = html.replace(
  "</head>",
  "<!-- Single-file offline build: JavaScript, CSS, and game content are embedded below. --></head>",
);

await mkdir(pagesDirectory, { recursive: true });
await writeFile(outputFile, html, "utf8");
await writeFile(pagesFile, html, "utf8");
await rm(buildDirectory, { recursive: true, force: true });

const size = Buffer.byteLength(html);
console.log(`Offline game ready: Reviewer-2-Major-Revision.html (${Math.ceil(size / 1024)} KiB)`);
