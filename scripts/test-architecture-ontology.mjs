#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0

/**
 * Test ontology/architecture.schema.json: the base ontology's worked example still
 * validates through it, entity by entity, and its work-layer types accept a work item
 * that produces architecture artefacts and refuse what they should.
 *
 * Zero dependencies: it uses scripts/validate-bundle.mjs, which resolves the work layer
 * from scripts/vendor/ and the base ontology from standards/ontology/.
 *
 * Usage: node scripts/test-architecture-ontology.mjs
 */

import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Registry, validate } from "./validate-bundle.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const registry = new Registry();
registry.addDir(path.join(ROOT, "scripts", "vendor"));
const BASE = registry.addFile(path.join(ROOT, "standards", "ontology", "ontology-schema.json"));
const MODULE = registry.addFile(path.join(ROOT, "ontology", "architecture.schema.json"));

let failed = 0;
function expect(label, value, ref, ok) {
  const r = registry.resolve(ref, null);
  if (!r) {
    failed++;
    console.log(` FAIL  ${label}: ${ref} does not resolve`);
    return;
  }
  const errors = validate(value, r.schema, registry, r.root);
  const pass = ok ? errors.length === 0 : errors.length > 0;
  console.log(`${pass ? "  ok  " : " FAIL "} ${label}`);
  if (!pass) {
    failed++;
    if (ok) for (const e of errors.slice(0, 10)) console.log(`        ${e.path}: ${e.message}`);
    else console.log("        was accepted, and should have been refused");
  }
}

// The base ontology's worked example, whole and entity by entity through the module.
const example = JSON.parse(readFileSync(path.join(ROOT, "standards", "ontology", "example-identity-platform.json"), "utf8"));
// The test sets the version to the schema's const, so it does not depend on the example
// keeping pace with the base ontology's version.
const base = registry.byId.get(BASE);
expect("the worked example validates against the base ontology", { ...example, version: base.properties.version.const ?? example.version }, BASE, true);
const entities = {
  platform: "Platform",
  capability: "Capability",
  component: "Component",
  driver: "Driver",
  change: "Change",
  transition: "Transition",
  risk: "Risk",
  standard: "Standard",
  interface: "Interface",
};
for (const [key, def] of Object.entries(entities)) {
  (example[key] ?? []).forEach((item, i) => expect(`example ${key}[${i}] is an architecture ${def}`, item, `${MODULE}#/$defs/${def}`, true));
}

// Architecture work on the work layer.
const work = {
  schema_version: 3,
  version: 1,
  work_item_id: "WI-010",
  title: "Decide the identity broker",
  type: "architecture",
  status: "in_progress",
  work_item_level: "epic",
  advances_criterion_ids: ["OC-001-M1"],
  deliverables: [
    { id: "WI-010-D1", name: "Broker decision", state: "accepted", artefact_kind: "decision-record", artefact_ids: ["DR-004"] },
    { id: "WI-010-D2", name: "Broker building block", state: "drafted", artefact_kind: "abb", artefact_ids: ["ABB-012"] },
  ],
  activities: [
    { id: "WI-010-A1", title: "Record the decision", produces: "WI-010-D1", status: "completed" },
    { id: "WI-010-A2", title: "Specify the building block", produces: "WI-010-D2", status: "in_progress" },
  ],
};
const ARCH = `${MODULE}#/$defs/ArchitectureWork`;
const clone = () => JSON.parse(JSON.stringify(work));
expect("a work item producing a Decision Record and an ABB is ArchitectureWork", work, ARCH, true);

let x = clone();
x.deliverables[0].artefact_kind = "memo";
expect("an artefact kind the metamodel does not name is refused", x, ARCH, false);
x = clone();
x.advances_criterion_ids = ["OC-001"];
expect("a criterion that is not an outcome measure is refused", x, ARCH, false);
x = clone();
delete x.activities[1].produces;
expect("the work layer still applies: a schema version 3 activity must name what it produces", x, ARCH, false);
x = clone();
x.deliverables[1].state = "done";
expect("the work layer still applies: a product state it does not know is refused", x, ARCH, false);

console.log(failed ? `\n${failed} failure(s).` : "\narchitecture.schema.json: all cases pass.");
process.exit(failed ? 1 : 0);
