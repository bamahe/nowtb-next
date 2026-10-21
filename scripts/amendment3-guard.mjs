#!/usr/bin/env node
/**
 * Amendment 3 protected-file guard.
 *
 *   node scripts/amendment3-guard.mjs --init     write the hash manifest
 *   node scripts/amendment3-guard.mjs --check    verify nothing protected moved
 *   node scripts/amendment3-guard.mjs --staged   verify the staged diff is in-lane
 *
 * WHY THIS EXISTS
 * The pre-election updater lets an agent edit this repo. The agent is already
 * restricted two other ways: it runs without Bash, and it runs with a deny
 * list. This is the third layer, and it is the one that still works after a
 * future CLI flag gets renamed and silently stops being honoured.
 *
 * A protected file changing is not a warning. It means the agent went
 * somewhere it was never supposed to reach, so nothing from that run can be
 * trusted and the caller must hard reset instead of committing.
 *
 * IF IT BREAKS
 *   "manifest missing"        -> run --init once and commit .locked.sha256
 *   "PROTECTED FILE CHANGED"  -> read the diff before trusting anything. If
 *                                Barrett legitimately edited the file, re-run
 *                                --init and commit the new manifest.
 *   "out of lane"             -> the agent wrote a file outside the allowlist.
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { execSync } from "node:child_process";
import path from "node:path";

const ROOT = process.cwd();
const MANIFEST = "src/data/amendment-3/.locked.sha256";

/** Files automation must never modify. */
const PROTECTED = [
  "src/data/amendment-3/branches.ts",
  "src/data/amendment-3-take.ts",
  "src/data/amendment-3-content.ts",
  "src/data/amendment-3-faqs.ts",
  "src/data/amendment-3-outcomes.ts",
  "src/lib/amendment3.ts",
  "src/app/guides/florida-amendment-3-property-tax/page.tsx",
  "src/components/amendment3/SavingsCalculator.tsx",
  "src/components/amendment3/ResidencyChecker.tsx",
  "src/components/amendment3/StatusBanner.tsx",
  "src/components/amendment3/NewsFeed.tsx",
  "src/components/amendment3/PollingBlock.tsx",
  "src/components/amendment3/CountyTable.tsx",
];

/** The ONLY files the pre-election / election jobs may stage. */
const ALLOWED_TO_CHANGE = [
  "src/data/amendment-3/news.json",
  "src/data/amendment-3/polling.json",
  "src/data/amendment-3/result.json",
];

function hash(rel) {
  const p = path.join(ROOT, rel);
  if (!existsSync(p)) return "MISSING";
  return createHash("sha256").update(readFileSync(p)).digest("hex");
}

function die(msg) {
  console.error(`GUARD FAIL: ${msg}`);
  process.exit(1);
}

const mode = process.argv[2] ?? "--check";

if (mode === "--init") {
  const manifest = Object.fromEntries(PROTECTED.map((f) => [f, hash(f)]));
  const missing = Object.entries(manifest).filter(([, h]) => h === "MISSING");
  if (missing.length) {
    die(`cannot init, these protected files do not exist:\n  ${missing.map(([f]) => f).join("\n  ")}`);
  }
  writeFileSync(
    path.join(ROOT, MANIFEST),
    JSON.stringify(manifest, null, 2) + "\n",
  );
  console.log(`wrote ${MANIFEST} covering ${PROTECTED.length} protected files`);
  process.exit(0);
}

if (mode === "--check") {
  if (!existsSync(path.join(ROOT, MANIFEST))) die("manifest missing, run --init");
  const manifest = JSON.parse(readFileSync(path.join(ROOT, MANIFEST), "utf8"));
  const changed = [];
  for (const [file, expected] of Object.entries(manifest)) {
    const actual = hash(file);
    if (actual !== expected) changed.push(`${file}\n    expected ${expected}\n    actual   ${actual}`);
  }
  if (changed.length) {
    die(
      `PROTECTED FILE CHANGED (${changed.length}). Do not commit this run.\n  ` +
        changed.join("\n  "),
    );
  }
  console.log(`OK: ${Object.keys(manifest).length} protected files unchanged`);
  process.exit(0);
}

if (mode === "--staged") {
  const staged = execSync("git diff --cached --name-only", { cwd: ROOT })
    .toString()
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  const outOfLane = staged.filter((f) => !ALLOWED_TO_CHANGE.includes(f));
  if (outOfLane.length) {
    die(`staged files out of lane:\n  ${outOfLane.join("\n  ")}`);
  }
  if (!staged.length) {
    console.log("nothing staged");
    process.exit(2); // distinct code: caller treats this as "no work", not failure
  }
  console.log(`OK: staged files all in lane (${staged.join(", ")})`);
  process.exit(0);
}

die(`unknown mode ${mode}`);
