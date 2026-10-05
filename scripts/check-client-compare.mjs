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
  { name: "11412 Lake Lucaya Dr", field: "newVa", value: 3965 },
  { name: "12349 Blue Pacific Dr", field: "assume", value: 3119 },
  { name: "11967 Cinnamon Fern Dr", field: "assume", value: 3982 },
  { name: "10415 Alcon Blue Dr", field: "newVa", value: 4407 },
];

const TOLERANCE = 3;
let failures = 0;

for (const want of EXPECTED) {
  const row = rows.find((r) => r.home.name === want.name);

  if (!row) {
    console.error(`FAIL  ${want.name} is not in the client file at all`);
    failures++;
    continue;
  }

  const got =
    want.field === "assume" ? row.assume?.assumeAllIn : row.newVaAllIn;

  if (typeof got !== "number") {
    console.error(
      `FAIL  ${want.name} has no ${want.field} total. ` +
        `For an assume total the home needs "assumable": true and a filled in loan block.`
    );
    failures++;
    continue;
  }

  const drift = Math.abs(got - want.value);
  if (drift > TOLERANCE) {
    console.error(
      `FAIL  ${want.name} ${want.field} all in is $${got}, expected about $${want.value} (off by $${drift})`
    );
    failures++;
  } else {
    console.log(
      `ok    ${want.name} ${want.field} all in $${got} (expected about $${want.value})`
    );
  }
}

// ── A couple of structural checks so the page never renders something broken ──
for (const row of rows) {
  if (row.home.commute.length !== data.settings.workplaces.length) {
    console.error(
      `FAIL  ${row.home.name} has ${row.home.commute.length} commute entries but there are ${data.settings.workplaces.length} workplaces`
    );
    failures++;
  }
}

if (!rows.some((r) => r.isBaseline)) {
  console.error(
    `FAIL  settings.baselineHome is "${data.settings.baselineHome}" but no home has that exact name`
  );
  failures++;
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}

console.log(`\nAll ${EXPECTED.length} monthly totals and structure checks passed.`);
