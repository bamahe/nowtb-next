// =============================================================================
// check-client-compare.mjs: sanity test for the client comparison math
//
// Run it with:  node scripts/check-client-compare.mjs
//
// It loads the REAL calculator from src/lib/clientCompare.ts and the real
// client JSON, then checks four known monthly totals. If any of them drifts by
// more than $3 the script exits non zero, so a bad edit to the JSON or the math
// fails loudly instead of quietly shipping wrong numbers to a client.
//
// The repo has no test runner and no TypeScript loader, so this script
// transpiles that one .ts file in memory using the typescript package that is
// already a devDependency. Nothing new to install.
//
// If it breaks, check this:
//  - "Cannot find module typescript" means node_modules is missing. Run npm i.
//  - A failing total almost always means someone edited a number in
//    data/clients/ellenburg-x7k2.json. That is fine and expected when a listing
//    changes. Update the EXPECTED table below to the new correct totals.
// =============================================================================

import { readFileSync, writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";

const root = resolve(import.meta.dirname, "..");

// ── Transpile src/lib/clientCompare.ts into something node can import ──
const source = readFileSync(join(root, "src/lib/clientCompare.ts"), "utf8");
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
}).outputText;

const tmp = join(mkdtempSync(join(tmpdir(), "client-compare-")), "lib.mjs");
writeFileSync(tmp, js);
const { computeAll } = await import(pathToFileURL(tmp).href);

// ── Load the real client file and run the math ──
const data = JSON.parse(
  readFileSync(join(root, "data/clients/ellenburg-x7k2.json"), "utf8")
);
const rows = computeAll(data);

// ── The four totals we know are right ──
// "newVa"  = Option A, a brand new VA loan at 0% down
// "assume" = Option B, taking over the seller's existing loan
const EXPECTED = [
  { id: "lake-lucaya", field: "newVa", value: 3965 },
  { id: "blue-pacific", field: "assume", value: 3119 },
  { id: "cinnamon-fern", field: "assume", value: 3982 },
  { id: "alcon-blue", field: "newVa", value: 4407 },
];

const TOLERANCE = 3;
let failures = 0;

for (const want of EXPECTED) {
  const row = rows.find((r) => r.home.id === want.id);

  if (!row) {
    console.error(`FAIL  no home with id "${want.id}" in the client file`);
    failures++;
    continue;
  }

  const label = row.home.name;
  const got =
    want.field === "assume" ? row.assume?.assumeAllIn : row.newVaAllIn;

  if (typeof got !== "number") {
    console.error(
      `FAIL  ${label} has no ${want.field} total. ` +
        `For an assume total the home needs "assumable": true plus pi, mip and bal in its loan block.`
    );
    failures++;
    continue;
  }

  const drift = Math.abs(got - want.value);
  if (drift > TOLERANCE) {
    console.error(
      `FAIL  ${label} ${want.field} all in is $${got}, expected about $${want.value} (off by $${drift})`
    );
    failures++;
  } else {
    console.log(
      `ok    ${label.padEnd(23)} ${want.field.padEnd(6)} all in $${got} (expected about $${want.value})`
    );
  }
}

// ── Structural checks so the page never renders something broken ──

// The commute block has exactly two legs, so there must be exactly two
// workplaces for the table to line up.
if (data.settings.workplaces.length !== 2) {
  console.error(
    `FAIL  settings.workplaces has ${data.settings.workplaces.length} entries, but the commute block only holds toWork1 and toWork2`
  );
  failures++;
}

for (const row of rows) {
  for (const leg of ["toWork1", "toWork2"]) {
    const v = row.home.commute?.[leg];
    if (!v || typeof v.miles !== "string" || typeof v.time !== "string") {
      console.error(
        `FAIL  ${row.home.name} is missing commute.${leg}.miles or .time`
      );
      failures++;
    }
  }

  // An assumable home without pi silently loses its whole Option B column.
  if (row.home.loan.assumable && typeof row.home.loan.pi !== "number") {
    console.error(
      `FAIL  ${row.home.name} is marked assumable but has no loan.pi, so Option B will not render`
    );
    failures++;
  }
}

if (!rows.some((r) => r.isBaseline)) {
  console.error(
    `FAIL  settings.baselineHomeId is "${data.settings.baselineHomeId}" but no home has that id`
  );
  failures++;
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}

console.log(`\nAll ${EXPECTED.length} monthly totals and structure checks passed.`);
