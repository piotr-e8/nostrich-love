/**
 * SEO invariants check — runs against dist/, exits non-zero on failure.
 *
 * Replaces an earlier version that validated routes the routing refactor
 * removed and always exited 0 (audit findings #75/#90). Every check here
 * encodes a decision documented in docs/audit-2026-07/session-handoff.md:
 * English is served un-prefixed, hreflang is emitted only for routes that
 * exist in all seven locales, and the sitemap must agree with the pages.
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const SITE = "https://nostrich.love";
const LOCALES = ["pl", "es", "de", "zh", "ar", "hi"]; // prefixed locales; en is un-prefixed

let failures = 0;
const fail = (msg) => {
  failures++;
  console.error(`✗ ${msg}`);
};
const ok = (msg) => console.log(`✓ ${msg}`);

const read = (p) => readFileSync(join(DIST, p), "utf8");

if (!existsSync(DIST)) {
  console.error("dist/ does not exist — run `npm run build` first");
  process.exit(1);
}

// --- 1. The old /en/ scheme must be gone -----------------------------------
if (existsSync(join(DIST, "en"))) {
  fail("dist/en/ exists — English must be served un-prefixed");
} else {
  ok("no dist/en/ — English is un-prefixed");
}

// --- 2. English guide page: canonical, hreflang, JSON-LD, og:type ----------
const SAMPLE = "guides/what-is-nostr/index.html";
if (!existsSync(join(DIST, SAMPLE))) {
  fail(`${SAMPLE} missing`);
} else {
  const html = read(SAMPLE);

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical === `${SITE}/guides/what-is-nostr/`) ok(`canonical: ${canonical}`);
  else fail(`canonical is ${canonical}, expected ${SITE}/guides/what-is-nostr/`);

  const hreflangs = [...html.matchAll(/hreflang="([^"]+)"/g)].map((m) => m[1]);
  const expected = ["en", ...LOCALES, "x-default"];
  const missing = expected.filter((l) => !hreflangs.includes(l));
  if (missing.length === 0 && hreflangs.length === expected.length)
    ok(`guide hreflang set complete (${hreflangs.length})`);
  else fail(`guide hreflang wrong — got [${hreflangs}], missing [${missing}]`);

  const ld = html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)?.[1];
  if (!ld) fail("guide page has no JSON-LD");
  else {
    try {
      const parsed = JSON.parse(ld);
      if (parsed["@type"]) ok(`JSON-LD parses (@type: ${parsed["@type"]})`);
      else fail("JSON-LD has no @type");
    } catch {
      fail("JSON-LD does not parse");
    }
  }

  if (/property="og:type" content="article"/.test(html)) ok("og:type is article on guides");
  else fail("guide og:type is not article");
}

// --- 3. Localized guide pages exist with their own canonicals --------------
for (const l of LOCALES) {
  const p = `${l}/guides/what-is-nostr/index.html`;
  if (!existsSync(join(DIST, p))) {
    fail(`${p} missing`);
    continue;
  }
  const canonical = read(p).match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (canonical === `${SITE}/${l}/guides/what-is-nostr/`) ok(`${l} canonical correct`);
  else fail(`${l} canonical is ${canonical}`);
}

// --- 4. English-only pages must NOT advertise alternates -------------------
for (const p of ["tools/index.html"]) {
  if (!existsSync(join(DIST, p))) {
    fail(`${p} missing`);
    continue;
  }
  const n = (read(p).match(/hreflang=/g) || []).length;
  if (n === 0) ok(`${p} has no hreflang (English-only route)`);
  else fail(`${p} advertises ${n} hreflang alternates for pages that may not exist`);
}

// --- 4b. Glossary ships in exactly en+pl+es+de -----------------------------
// The route is partially localized: hreflang must list exactly the built
// variants (a wrong alternate advertises a 404 — the audit's original sin),
// and the unshipped locales must not exist on disk.
const GLOSSARY_LOCALES = ["pl", "es", "de"]; // + un-prefixed en
{
  const expectedGlossary = ["en", ...GLOSSARY_LOCALES, "x-default"].sort();
  const pages = [
    { path: "glossary/index.html", canonical: `${SITE}/glossary/` },
    ...GLOSSARY_LOCALES.map((l) => ({
      path: `${l}/glossary/index.html`,
      canonical: `${SITE}/${l}/glossary/`,
    })),
  ];
  for (const { path, canonical } of pages) {
    if (!existsSync(join(DIST, path))) {
      fail(`${path} missing`);
      continue;
    }
    const html = read(path);
    const got = [...html.matchAll(/hreflang="([^"]+)"/g)].map((m) => m[1]).sort();
    if (got.join(",") === expectedGlossary.join(","))
      ok(`${path} hreflang is exactly {en,pl,es,de,x-default}`);
    else fail(`${path} hreflang wrong — got [${got}], expected [${expectedGlossary}]`);

    const c = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (c === canonical) ok(`${path} canonical correct`);
    else fail(`${path} canonical is ${c}, expected ${canonical}`);
  }
  const unshipped = ["zh", "ar", "hi"].filter((l) => existsSync(join(DIST, l, "glossary")));
  if (unshipped.length === 0) ok("no unshipped glossary locales on disk (zh/ar/hi)");
  else for (const l of unshipped) fail(`dist/${l}/glossary exists but is not in the shipped locale set`);
}

// --- 5. Sitemap exists and agrees with the un-prefixed scheme --------------
if (!existsSync(join(DIST, "sitemap-index.xml"))) fail("sitemap-index.xml missing");
else ok("sitemap-index.xml present");

if (existsSync(join(DIST, "sitemap-0.xml"))) {
  const sm = read("sitemap-0.xml");
  if (sm.includes(`${SITE}/en/`)) fail("sitemap contains /en/ URLs (old scheme)");
  else ok("sitemap has no /en/ URLs");
  if (sm.includes(`${SITE}/guides/what-is-nostr/`)) ok("sitemap lists un-prefixed English guides");
  else fail("sitemap is missing the un-prefixed English guide URLs");
} else {
  fail("sitemap-0.xml missing");
}

// --- 6. Manifest must be valid JSON (it is linked from every page) ---------
try {
  JSON.parse(readFileSync("public/site.webmanifest", "utf8"));
  ok("site.webmanifest is valid JSON");
} catch {
  fail("site.webmanifest is not valid JSON");
}

console.log(failures === 0 ? "\nAll SEO invariants hold." : `\n${failures} SEO invariant(s) violated.`);
process.exit(failures === 0 ? 0 : 1);
