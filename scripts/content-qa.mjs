#!/usr/bin/env node
// =============================================================================
// content-qa.mjs - Content QA gates for the October 2026 batch
//
// What this does, in plain terms: it reads the content files you changed and
// refuses to pass if any of Barrett's hard rules are broken. Run it before every
// commit and before every build.
//
// Usage:
//   node scripts/content-qa.mjs                  # check the default target list
//   node scripts/content-qa.mjs path/a path/b     # check specific files
//   node scripts/content-qa.mjs --slugs a,b,c     # check specific blog slugs
//
// Exit code 0 = all gates pass. Exit code 1 = at least one gate failed.
//
// If it breaks, check this:
//   - "Cannot find module" means you are not in the repo root. cd there first.
//   - A dash flagged inside a file you did not touch? Only pass files you
//     changed. The default target list is intentionally narrow.
// =============================================================================

import fs from "node:fs";
import path from "node:path";

// ---------------------------------------------------------------------------
// Gate definitions
// ---------------------------------------------------------------------------

/** Gate 1: typographic dashes are banned outright. */
const EM_DASH = "—";
const EN_DASH = "–";

/** Gate 2 to 5: literal strings that must never appear. Case-insensitive. */
const BANNED_LITERALS = [
  // Gate 2: brand and terminology rules
  "RE/MAX",
  "#FloridaUncensored",
  "master suite",
  "master bedroom",
  // Gate 3: property types that are never mentioned
  "manufactured home",
  "manufactured housing",
  "mobile home",
  "double-wide",
  "doublewide",
  "double wide",
  // Gate 5: banned phrases
  "in today's market",
  "in today’s market",
  "fast-paced",
  "fast paced",
  "navigate",
  "dive into",
  "unlock",
  "seamless",
  "game-changer",
  "game changer",
  "dream home",
  "nestled",
  "boasts",
  "look no further",
  "whether you're",
  "whether you’re",
  "in conclusion",
  "it's important to note",
  "it’s important to note",
  "elevate",
  "embark",
  "realm",
  "landscape",
  "hidden gem",
  "robust",
  "stunning",
];

/** Gate 4: client names and addresses that must never be published. */
const BANNED_CLIENT_TERMS = [
  "Gallegos", "Torchwood", "Mirada", "Rossow", "Whitlock", "Sproul",
  "117th Ave", "Savaya", "Virginia Ave", "Coral St", "Brennan",
  "Forest Breeze", "Strawberry Ln", "Kingston", "Speach", "Jennifer Wood",
  "Peyton", "Reflections", "900 Gulf", "Malerba", "Knopp", "Tonghui",
  "Louis Jacques", "Hillary", "Newtown", "McCraw", "Amendola",
  "Pioneer Trails", "Gesich", "Brimhollow", "Gutierrez",
  "Industrial Capital", "Krzesinski",
];

/** Gate 6: gold, yellow and amber are banned in design. */
const BANNED_COLORS = [
  // Named gold hexes from the brief
  "#FFD700", "#D4AF37", "#C9A227", "#B8860B",
  // Tailwind utility classes
  "text-yellow-", "bg-yellow-", "border-yellow-", "from-yellow-", "to-yellow-",
  "text-amber-", "bg-amber-", "border-amber-", "from-amber-", "to-amber-",
  // Raw Tailwind amber/yellow hex values. These are what inline-styled legacy
  // content actually uses, and the class-name checks above never catch them.
  "#fffbeb", "#fef3c7", "#fde68a", "#fcd34d", "#fbbf24", "#f59e0b",
  "#d97706", "#b45309", "#92400e", "#78350f", "#fff8e1", "#fffde7",
  "#eab308", "#facc15", "#fef08a", "#fde047", "#ca8a04", "#a16207",
  "gold",
];

// Words that legitimately contain a banned substring. Checked before flagging so
// "Navigate" inside "navigation" or "Goldstein" style false hits do not fail QA.
const LITERAL_EXCEPTIONS = {
  navigate: ["navigation", "navigator", "navigated", "navigating"],
  unlock: ["unlocked", "unlocking"],
  realm: [],
  landscape: ["landscaping", "landscaper", "landscapers", "landscaped"],
  gold: ["goldenrod", "golden rule", "goldstein", "marigold"],
  elevate: ["elevated", "elevation", "elevations", "elevator"],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const failures = [];
const warnings = [];

function fail(file, gate, message) {
  failures.push({ file, gate, message });
}
function warn(file, gate, message) {
  warnings.push({ file, gate, message });
}

/** Strip HTML tags and markdown link syntax so word counts reflect prose. */
function toPlainText(input) {
  return input
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    // HTML comments are notes to the next developer, not prose the reader sees,
    // so they must not count toward the word budget.
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * True when the root layout renders a component that contains the brokerage
 * name, which satisfies the Florida advertising requirement for every page.
 * Cached after the first call.
 */
let _layoutRemax = null;
function layoutHasRemaxCollective() {
  if (_layoutRemax !== null) return _layoutRemax;
  _layoutRemax = false;
  try {
    const layout = fs.readFileSync("src/app/layout.tsx", "utf-8");
    if (/REMAX Collective/.test(layout)) { _layoutRemax = true; return true; }
    // Follow <Footer /> style imports one level deep.
    for (const m of layout.matchAll(/import\s+(\w+)\s+from\s+"@\/(components\/[^"]+)"/g)) {
      if (!new RegExp(`<${m[1]}[\\s/>]`).test(layout)) continue;
      for (const ext of [".tsx", ".ts"]) {
        const p = `src/${m[2]}${ext}`;
        if (fs.existsSync(p) && /REMAX\s+Collective/.test(fs.readFileSync(p, "utf-8"))) {
          _layoutRemax = true;
          return true;
        }
      }
    }
  } catch {}
  return _layoutRemax;
}

function wordCount(input) {
  const plain = toPlainText(input);
  return plain ? plain.split(" ").length : 0;
}

/**
 * Find every line/column where `needle` appears, skipping occurrences that are
 * part of a known-good longer word.
 */
function findLiteral(haystack, needle) {
  const hits = [];
  const lower = haystack.toLowerCase();
  const target = needle.toLowerCase();
  const exceptions = (LITERAL_EXCEPTIONS[target] || []).map((e) => e.toLowerCase());
  let idx = lower.indexOf(target);
  while (idx !== -1) {
    // Pull a window around the hit and see if it belongs to an allowed word.
    const window = lower.slice(Math.max(0, idx - 20), idx + target.length + 20);
    const isException = exceptions.some((ex) => window.includes(ex));
    if (!isException) {
      const line = haystack.slice(0, idx).split("\n").length;
      hits.push({ line, excerpt: haystack.slice(Math.max(0, idx - 40), idx + 60).replace(/\n/g, " ") });
    }
    idx = lower.indexOf(target, idx + 1);
  }
  return hits;
}

// ---------------------------------------------------------------------------
// Core text checks - run against any content string
// ---------------------------------------------------------------------------

function checkText(label, text, opts = {}) {
  // Gate 1: dashes
  for (const [name, ch] of [["em dash", EM_DASH], ["en dash", EN_DASH]]) {
    const hits = findLiteral(text, ch);
    if (hits.length) {
      fail(label, 1, `${hits.length} ${name}(s), first at line ${hits[0].line}: "${hits[0].excerpt.trim()}"`);
    }
  }

  // Gates 2, 3, 5: banned literals and phrases
  for (const needle of BANNED_LITERALS) {
    const hits = findLiteral(text, needle);
    if (hits.length) {
      fail(label, needle.startsWith("#") || /RE\/MAX|master /i.test(needle) ? 2 : 5,
        `banned term "${needle}" x${hits.length}, first at line ${hits[0].line}: "${hits[0].excerpt.trim()}"`);
    }
  }

  // Gate 4: client names and addresses
  for (const needle of BANNED_CLIENT_TERMS) {
    const hits = findLiteral(text, needle);
    if (hits.length) {
      fail(label, 4, `banned client term "${needle}" at line ${hits[0].line}`);
    }
  }

  // Gate 6: gold, yellow, amber
  for (const needle of BANNED_COLORS) {
    const hits = findLiteral(text, needle);
    if (hits.length) {
      fail(label, 6, `banned color token "${needle}" at line ${hits[0].line}: "${hits[0].excerpt.trim()}"`);
    }
  }

  // Gate 7: structure requirements for long-form content
  if (opts.kind === "post" || opts.kind === "page") {
    const wc = wordCount(text);
    const min = opts.minWords ?? (opts.kind === "post" ? 1200 : 600);
    const max = opts.maxWords ?? (opts.kind === "post" ? 2000 : 1200);
    // The 1,200 to 2,000 range governs NEW pieces. For an update to a page that
    // already existed, the brief scopes length to "only the new section", so the
    // pre-existing body is not re-litigated here. The total is still reported so
    // nothing is hidden.
    if (opts.isUpdate) {
      warn(label, 7, `total word count ${wc} (existing page, length gate applies to the new section only)`);
    } else if (wc < min || wc > max) {
      fail(label, 7, `word count ${wc} outside ${min} to ${max}`);
    }

    const hasCta = /813\)?\s*733-7907|8137337907|\/contact|rental-analysis|free-home-valuation/i.test(text);
    if (!hasCta) fail(label, 7, "no CTA: needs (813) 733-7907 or a contact form link");

    if (opts.kind === "post") {
      if (!/frequently asked|\bFAQ\b/i.test(text)) fail(label, 7, "no FAQ section");
      if (!/\bSources\b/i.test(text)) fail(label, 7, "no Sources section");
    }

    // "REMAX Collective" must appear on every nowtb.com page. It is rendered
    // site-wide by the Footer in the root layout, so a page satisfies the rule
    // either in its own copy or through the layout. The layout is verified once,
    // at startup, rather than assumed.
    if (opts.requireRemaxCollective && !/REMAX Collective/.test(text) && !layoutHasRemaxCollective()) {
      fail(label, 7, 'missing "REMAX Collective" (Florida advertising rule) and the global layout footer does not supply it either');
    }

    // Gate 8: exactly one H1
    const h1Html = (text.match(/<h1[\s>]/gi) || []).length;
    const h1Md = (text.match(/^#\s+/gm) || []).length;
    const h1Total = h1Html + h1Md;
    if (opts.expectH1 !== false && h1Total > 1) {
      fail(label, 8, `${h1Total} H1 tags, expected at most 1 (the template supplies the H1)`);
    }
  }
}

// ---------------------------------------------------------------------------
// Checkers for each content store
// ---------------------------------------------------------------------------

/** nowtb.com blog posts live as HTML records in posts-export.json. */
function checkNowtbPosts(slugs, updateSlugs = []) {
  const file = "src/data/posts-export.json";
  if (!fs.existsSync(file)) return;
  const posts = JSON.parse(fs.readFileSync(file, "utf-8"));
  const titles = new Map();

  for (const post of posts) {
    if (!slugs.includes(post.slug)) continue;
    checkText(`post:${post.slug}`, post.content, {
      kind: "post",
      requireRemaxCollective: true,
      isUpdate: updateSlugs.includes(post.slug),
    });
    // Title and excerpt get the literal checks but not the structural ones.
    checkText(`post:${post.slug}:title`, post.title);
    checkText(`post:${post.slug}:excerpt`, post.excerpt || "");

    // Gate 8: title and meta lengths
    if (post.title.length > 60) {
      fail(`post:${post.slug}`, 8, `title ${post.title.length} chars, max 60: "${post.title}"`);
    }
    const desc = (post.excerpt || "").replace(/<[^>]*>/g, "").trim();
    if (desc.length > 155) {
      fail(`post:${post.slug}`, 8, `excerpt/meta ${desc.length} chars, max 155`);
    }
    if (desc.length < 50) {
      warn(`post:${post.slug}`, 8, `excerpt/meta only ${desc.length} chars, aim for 120 to 155`);
    }
  }

  // Gate 8: no duplicate titles anywhere on the site
  for (const post of posts) {
    const key = post.title.trim().toLowerCase();
    if (!titles.has(key)) titles.set(key, []);
    titles.get(key).push(post.slug);
  }
  for (const slug of slugs) {
    const post = posts.find((p) => p.slug === slug);
    if (!post) {
      fail(`post:${slug}`, 0, "slug not found in posts-export.json");
      continue;
    }
    const dupes = titles.get(post.title.trim().toLowerCase()) || [];
    if (dupes.length > 1) {
      fail(`post:${slug}`, 8, `duplicate title shared with: ${dupes.filter((s) => s !== slug).join(", ")}`);
    }
  }
}

/** vivipm.com blog posts live as markdown in src/lib/blog-posts.ts. */
function checkViviPosts(slugs, updateSlugs = []) {
  const file = "src/lib/blog-posts.ts";
  if (!fs.existsSync(file)) return;
  const src = fs.readFileSync(file, "utf-8");
  for (const slug of slugs) {
    // Grab the body_mdx template literal that follows this slug.
    const slugIdx = src.indexOf(`slug: "${slug}"`);
    if (slugIdx === -1) {
      fail(`vivi:${slug}`, 0, "slug not found in blog-posts.ts");
      continue;
    }
    const bodyIdx = src.indexOf("body_mdx: `", slugIdx);
    if (bodyIdx === -1) {
      fail(`vivi:${slug}`, 0, "body_mdx not found for slug");
      continue;
    }
    const start = bodyIdx + "body_mdx: `".length;
    const end = src.indexOf("`,", start);
    const body = src.slice(start, end);
    checkText(`vivi:${slug}`, body, { kind: "post", isUpdate: updateSlugs.includes(slug) });

    const titleMatch = src.slice(slugIdx, slugIdx + 400).match(/title:\s*\n?\s*"([^"]+)"/);
    if (titleMatch && titleMatch[1].length > 60) {
      warn(`vivi:${slug}`, 8, `title ${titleMatch[1].length} chars (vivi titles are question-format, 60 is a soft cap)`);
    }
  }
}

/**
 * nowtb.com guides live as records in guides-content.json. Check only the slugs
 * we actually edited. Scanning the whole 1.5MB file would report violations in
 * the other 47 guides, which this batch did not touch and must not silently
 * rewrite.
 */
function checkGuides(slugs, updateSlugs = []) {
  const file = "src/data/guides-content.json";
  if (!fs.existsSync(file)) return;
  const guides = JSON.parse(fs.readFileSync(file, "utf-8"));
  for (const slug of slugs) {
    const g = guides.find((x) => x.slug === slug);
    if (!g) {
      fail(`guide:${slug}`, 0, "slug not found in guides-content.json");
      continue;
    }
    checkText(`guide:${slug}`, g.content, {
      kind: "post",
      requireRemaxCollective: true,
      isUpdate: updateSlugs.includes(slug),
    });
    checkText(`guide:${slug}:title`, g.title);
    if (g.title.length > 60) {
      fail(`guide:${slug}`, 8, `title ${g.title.length} chars, max 60: "${g.title}"`);
    }
  }
}

/** Plain source files: pages, components, data modules. */
function checkFiles(files) {
  for (const file of files) {
    if (!fs.existsSync(file)) {
      fail(file, 0, "file not found");
      continue;
    }
    const text = fs.readFileSync(file, "utf-8");
    const ext = path.extname(file);
    const isPage = /src\/app\/.*page\.tsx$/.test(file);
    checkText(file, text, {
      kind: isPage ? "page" : undefined,
      requireRemaxCollective: isPage,
      // Page files include nav, schema and JSX, so the prose word count is not
      // a reliable signal. Range checks are applied to prose stores only.
      minWords: 0,
      maxWords: Number.MAX_SAFE_INTEGER,
    });

    if (isPage) {
      // Many pages on this site get their single H1 from <HeroSection title=...>,
      // which renders the <h1> internally. Count that as the page's H1 so the
      // gate measures the rendered output rather than the literal JSX.
      const literalH1 = (text.match(/<h1[\s>]/gi) || []).length;
      const heroH1 = /<HeroSection[\s\S]*?\btitle=/.test(text) ? 1 : 0;
      const h1 = literalH1 + heroH1;
      if (h1 !== 1) {
        fail(file, 8, `${h1} H1 tags (${literalH1} literal + ${heroH1} from HeroSection), expected exactly 1`);
      }
      if (!/alternates:\s*{\s*canonical/.test(text)) fail(file, 8, "missing alternates.canonical");
      const title = text.match(/title:\s*"([^"]{1,200})"/);
      if (title && title[1].length > 60) {
        fail(file, 8, `title ${title[1].length} chars, max 60: "${title[1]}"`);
      }
      const desc = text.match(/description:\s*\n?\s*"([^"]{1,400})"/);
      if (desc && desc[1].length > 155) {
        fail(file, 8, `meta description ${desc[1].length} chars, max 155`);
      }
    }
    if (ext === ".json") {
      try { JSON.parse(text); } catch (e) { fail(file, 0, `invalid JSON: ${e.message}`); }
    }
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

const argv = process.argv.slice(2);
let slugArg = null;
let updateArg = null;
let guideArg = null;
const fileArgs = [];
for (let i = 0; i < argv.length; i++) {
  if (argv[i] === "--slugs") { slugArg = argv[++i]; continue; }
  // --update-slugs marks pieces that are edits to pages that already existed.
  // Every gate still runs; only the whole-post length range is reported as a
  // warning instead of a failure, because the brief scopes update length to the
  // new section.
  if (argv[i] === "--update-slugs") { updateArg = argv[++i]; continue; }
  if (argv[i] === "--guide-slugs") { guideArg = argv[++i]; continue; }
  fileArgs.push(argv[i]);
}

const isVivi = fs.existsSync("src/lib/blog-posts.ts");
const slugs = slugArg ? slugArg.split(",").map((s) => s.trim()).filter(Boolean) : [];
const updateSlugs = updateArg ? updateArg.split(",").map((s) => s.trim()).filter(Boolean) : [];
const allSlugs = Array.from(new Set([...slugs, ...updateSlugs]));

const guideSlugs = guideArg ? guideArg.split(",").map((s) => s.trim()).filter(Boolean) : [];

if (allSlugs.length) {
  if (isVivi) checkViviPosts(allSlugs, updateSlugs);
  else checkNowtbPosts(allSlugs, updateSlugs);
}
if (guideSlugs.length) checkGuides(guideSlugs, guideSlugs);
if (fileArgs.length) checkFiles(fileArgs);

if (!allSlugs.length && !fileArgs.length && !guideSlugs.length) {
  console.log("Nothing to check. Pass files, or --slugs a,b,c");
  process.exit(0);
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

const byGate = {};
for (const f of failures) {
  byGate[f.gate] = byGate[f.gate] || [];
  byGate[f.gate].push(f);
}

const GATE_NAMES = {
  0: "File integrity",
  1: "No em or en dashes",
  2: "Brand and terminology",
  3: "Banned property types",
  4: "Client privacy",
  5: "Banned phrases",
  6: "No gold, yellow or amber",
  7: "Structure: length, FAQ, Sources, CTA, REMAX Collective",
  8: "Metadata: title, meta, single H1, no duplicates",
};

if (warnings.length) {
  console.log("\nWARNINGS (not blocking):");
  for (const w of warnings) console.log(`  [gate ${w.gate}] ${w.file}: ${w.message}`);
}

if (failures.length === 0) {
  console.log("\nAll content QA gates PASS.");
  process.exit(0);
}

console.log("\nCONTENT QA FAILURES:\n");
for (const gate of Object.keys(byGate).sort()) {
  console.log(`Gate ${gate} - ${GATE_NAMES[gate] || "unknown"}`);
  for (const f of byGate[gate]) console.log(`  ${f.file}: ${f.message}`);
  console.log("");
}
console.log(`${failures.length} failure(s).`);
process.exit(1);
