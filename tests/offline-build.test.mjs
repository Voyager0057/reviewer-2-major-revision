import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const offlineFile = new URL("../Reviewer-2-Major-Revision.html", import.meta.url);
const pagesFile = new URL("../.pages/index.html", import.meta.url);

test("offline release is one self-contained playable HTML file", async () => {
  const html = await readFile(offlineFile, "utf8");
  const inlineStyle = html.match(/<style>([^]*?)<\/style>/);
  const inlineScript = html.match(/<script type="module">([^]*?)<\/script>/);

  assert.match(html, /Reviewer #2: Major Revision/);
  assert.match(html, /ACADEMIC SURVIVAL DECKBUILDER/);
  assert.match(html, /528 cards/);
  assert.match(html, /256 events/);
  assert.match(html, /English/);
  assert.match(html, /简体中文/);
  assert.match(html, /日本語/);
  assert.match(html, /한국어/);
  assert.match(html, /Español/);
  assert.match(html, /data:image\/jpeg;base64,/, "expected embedded event illustrations");
  assert.match(html, /REVISION NIGHT/, "expected illustrated title-screen reel copy");
  assert.match(html, /Title-screen scenes/, "expected title-screen reel controls");
  assert.doesNotMatch(html, /Outcome pending|Resolution remains sealed|收益与代价已封存/);
  assert.ok(inlineStyle?.[1].length > 1_000, "expected embedded game styles");
  assert.ok(inlineScript?.[1].length > 400_000, "expected embedded game code and content");
  assert.equal(
    (html.match(/<\/script>/gi) ?? []).length,
    1,
    "embedded code must not terminate the module script early",
  );

  // Inspect only the document shell. Framework source code can legitimately
  // contain HTML examples as strings, but those do not request any resource.
  const shell = html
    .replace(inlineStyle[0], "<style></style>")
    .replace(inlineScript[0], '<script type="module"></script>');

  assert.doesNotMatch(shell, /<script\b[^>]*\bsrc=/i);
  assert.doesNotMatch(shell, /<link\b[^>]*\brel="stylesheet"/i);
  assert.doesNotMatch(shell, /\b(?:src|href)="https?:\/\//i);
});

test("GitHub Pages artifact is byte-for-byte identical to the download", async () => {
  const [offline, pages] = await Promise.all([
    readFile(offlineFile),
    readFile(pagesFile),
  ]);

  assert.deepEqual(pages, offline);
});
