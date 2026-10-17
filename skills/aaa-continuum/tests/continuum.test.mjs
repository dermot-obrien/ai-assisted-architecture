// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0

// The check over a scaffolded workspace: passes on a small complete catalogue, and names each
// kind of disagreement when one is introduced. Needs ajv, ajv-formats and js-yaml, resolved from
// the skill or the repository root (npm install at either).

import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { check, csv, loadConfig, loadModules, scaffold } from "../src/continuum.mjs";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const modules = loadModules(REPO);
const sha = (s) => createHash("sha256").update(s).digest("hex");
const common = (extra = "") => `version: 0.1.0
status: active
created: 2026-10-17
last_modified: 2026-10-17
owner: "Team"
${extra}`;

/** A workspace with the scaffold and a small catalogue that walks the whole thread. */
function workspace() {
  const ws = mkdtempSync(path.join(os.tmpdir(), "continuum-"));
  const root = path.join(ws, "docs", "architecture");
  mkdirSync(path.join(ws, ".agents"), { recursive: true });
  const { snippet } = scaffold({ root, namespace: "ex", name: "Example", workspace: ws });
  writeFileSync(path.join(ws, ".agents", "skill-bindings.toml"), 'bindingsVersion = "1.0"\n\n' + snippet);
  const page = (rel, fm, body = "") => {
    const abs = path.join(root, rel);
    mkdirSync(path.dirname(abs), { recursive: true });
    writeFileSync(abs, `---\n${fm}---\n\n# ${body || rel}\n`);
  };
  const row = (rel, line) => writeFileSync(path.join(root, rel), readFileSync(path.join(root, rel), "utf8") + line + "\n");

  page("platform.md", `kind: platform\nid: PL-001\ntitle: "PL-001 Example"\nstrategic_owner: "CTO"\n${common()}provides_capabilities: [CAP-001]\ncontains_bounded_contexts: [BC-001]\nowns_outcomes: [OC-001]\n`);
  page("demand/product.md", `kind: product\nid: PRD-001\ntitle: "PRD-001 Example"\n${common()}platform: PL-001\nteam: "Team"\nruns: [api]\n`);
  page("demand/outcomes/OC-001-answers/index.md", `kind: outcome\nid: OC-001\ntitle: "OC-001 Answers"\n${common()}kpi: "Share of answers"\nkpi_target: { value: 100, unit: "percent" }\nbusiness_rationale: "Why"\ntime_horizon: short\nowned_by_platform: PL-001\nrequires_capabilities: [CAP-001]\nrealised_by_use_cases: [UC-001]\n`);
  row("demand/outcomes.csv", "OC-001,Answers,Share,100,PL-001,CAP-001,active");
  page("demand/use-cases/UC-001-ask/index.md", `kind: use-case\nid: UC-001\ntitle: "UC-001 Ask"\n${common()}primary_actor: "Reader"\nsuccess_criteria: ["Answered"]\nsupports_outcome: OC-001\nrealised_by_abbs: [ABB-001]\nrealised_by: [AP-001, RA-001]\n`);
  row("demand/use-cases.csv", "UC-001,Ask,Reader,OC-001,AP-001 RA-001,ABB-001,,high,active,use-cases/UC-001-ask/index.md");
  page("demand/capabilities/CAP-001-answering/index.md", `kind: capability\nid: CAP-001\ntitle: "CAP-001 Answering"\n${common()}level: L1\nprovided_by_platform: PL-001\nrealised_by_abbs: [ABB-001]\ncomponents:\n  organisation: "The team"\n  people: ["Readers"]\n  processes: ["Ask, check, show"]\n  technology: "The agent"\nmaturity: { current: 2, target: 4 }\n`);
  row("demand/capabilities.csv", "CAP-001,Answering,L1,,core,ABB-001,3,active,capabilities/CAP-001-answering/index.md");
  page("solution/contexts/BC-001-answering/index.md", `kind: bounded-context\nid: BC-001\ntitle: "BC-001 Answering"\n${common()}part_of: PL-001\ncontains: [ABB-001]\nrealises_capabilities: [CAP-001]\nsubdomain_kind: core\nubiquitous_language:\n  - { term: "Question", definition: "What a reader asks" }\n  - { term: "Answer", definition: "What the agent returns" }\n  - { term: "Citation", definition: "The passage an answer rests on" }\n`);
  row("solution/contexts.csv", "BC-001,Answering,core,CAP-001,ABB-001,Team,,active,contexts/BC-001-answering/index.md");
  page("solution/abbs/ABB-001-agent/index.md", `kind: abb\nid: ABB-001\ntitle: "ABB-001 Agent"\n${common()}category: "Application"\npart_of: BC-001\nrealises_capabilities: [CAP-001]\nrealised_by: [SBB-001]\ndomains: [application]\ninterfaces:\n  - { id: "I1", direction: "in", type: "request", description: "Ask" }\nmandatory_subabbs: [iam, observability, governance]\n`);
  row("solution/abbs.csv", "ABB-001,Agent,AGT,active,Application,BC-001,CAP-001,SBB-001,,,abbs/ABB-001-agent/index.md");
  page("solution/sbbs/SBB-001-agent-on-lambda/index.md", `kind: sbb\nid: SBB-001\ntitle: "SBB-001 Agent on Lambda"\n${common()}realises: [ABB-001]\nrealised_by_services: [api]\nproducts:\n  - { name: "AWS Lambda", vendor: "AWS" }\nproduct_mapping:\n  - { abb_component: "Agent", sbb_product: "Lambda" }\ncloud_provider: aws\ndeployment_model: managed\n`);
  row("solution/sbbs.csv", "SBB-001,Agent on Lambda,active,ABB-001,api,AWS Lambda,aws,managed,sbbs/SBB-001-agent-on-lambda/index.md");
  page("runtime/services/SV-001-api/index.md", `kind: service\nid: api\nnumeric_id: SV-001\ntitle: "SV-001 API"\n${common()}realises: [SBB-001]\npart_of: BC-001\nruntime_type: serverless\n`);
  row("runtime/services.csv", "SV-001,api,API,service,function,BC-001,,SBB-001,,,PRD-001,active,services/SV-001-api/index.md");
  const drawio = "<mxfile><diagram name=\"Structure\"/></mxfile>";
  for (const [id, type, extra] of [["AP-001", "architecture-pattern", "implemented_by: [RA-001]\n"], ["RA-001", "reference-architecture", "implements: [AP-001]\n"]]) {
    const dir = `solution/patterns/${id}-example`;
    page(`${dir}/index.md`, `kind: pattern\nid: ${id}\ntitle: "${id} Example"\n${common()}pattern_type: ${type}\npattern_scope: platform\nrealises: [CAP-001]\nserves: [UC-001]\nmodel:\n  diagram: components.drawio\n${extra}`);
    writeFileSync(path.join(root, dir, "components.drawio"), drawio);
    writeFileSync(path.join(root, dir, "components.svg"), "<svg/>");
    writeFileSync(path.join(root, dir, "components.svg.render.json"), JSON.stringify({ source: "components.drawio", sha256: sha(drawio), layers: ["Structure"] }));
  }
  page("decisions/CN-001-which-model/index.md", `kind: consideration\nid: CN-001\ntitle: "CN-001 Which model"\n${common()}consideration_status: resolved\nquestion: "Which model?"\noptions:\n  - { name: "A" }\n  - { name: "B" }\naffects: [ABB-001]\nresolved_by: ADR-001\n`);
  row("decisions/considerations.csv", "CN-001,Which model,resolved,ADR-001,ABB-001,CN-001-which-model/index.md");
  page("decisions/ADR-001-model-a.md", `kind: decision-record\nid: ADR-001\ntitle: "ADR-001 Model A"\n${common()}resolves: [CN-001]\ny_statement: "In the context of the model, facing A or B, we decided for A, to achieve clarity, accepting less generality."\ndecision_drivers: ["Clarity"]\nconsidered_options: ["A", "B"]\ndecision_outcome: "A"\nchange_type: introduce\naffects_artefacts: [ABB-001]\n`);
  row("decisions/decisions.csv", "ADR-001,Model A,active,ABB-001,CN-001,ADR-001-model-a.md");
  return { ws, root };
}

function run(ws) {
  const config = loadConfig({ cwd: ws });
  assert.deepEqual(config.problems, []);
  return check(config, modules);
}
const codes = (r) => r.findings.map((f) => f.code);

test("the modules the check needs are installed at the repository root", () => {
  assert.ok(modules, "npm install at the repository root provides ajv, ajv-formats and js-yaml");
});

test("csv reads quoted fields with commas and newlines", () => {
  const t = csv('id,name\nA-001,"one, two"\nA-002,"line\nbreak"\n');
  assert.deepEqual(t.header, ["id", "name"]);
  assert.equal(t.rows[0].name, "one, two");
  assert.equal(t.rows[1].name, "line\nbreak");
  assert.equal(t.rows[1]._line, 3);
});

test("a scaffolded workspace with a complete small catalogue passes", () => {
  const { ws } = workspace();
  try {
    const r = run(ws);
    assert.deepEqual(r.findings.filter((f) => f.level === "error"), [], JSON.stringify(r.findings, null, 1));
    assert.equal(r.summary.errors, 0);
    assert.equal(r.summary.pages, 13);
    assert.ok(r.summary.schemes >= 17);
    assert.deepEqual(codes(r), []);
  } finally { rmSync(ws, { recursive: true, force: true }); }
});

test("an empty scaffold passes with no pages", () => {
  const ws = mkdtempSync(path.join(os.tmpdir(), "continuum-"));
  try {
    const root = path.join(ws, "arch");
    mkdirSync(path.join(ws, ".agents"));
    const { snippet, written } = scaffold({ root, namespace: "ex", name: "Example", workspace: ws });
    writeFileSync(path.join(ws, ".agents", "skill-bindings.toml"), snippet);
    assert.ok(written.includes("registers/identifier-schemes.csv"));
    const r = run(ws);
    assert.equal(r.summary.errors, 0);
    assert.equal(r.summary.pages, 0);
    const again = scaffold({ root, namespace: "ex", name: "Example", workspace: ws });
    assert.deepEqual(again.written, [], "scaffold never overwrites");
  } finally { rmSync(ws, { recursive: true, force: true }); }
});

test("each kind of disagreement is named", () => {
  const { ws, root } = workspace();
  try {
    // A row with no page, and a page with no row.
    writeFileSync(path.join(root, "solution/abbs.csv"), readFileSync(path.join(root, "solution/abbs.csv"), "utf8") + "ABB-002,Ghost,GH,active,Application,BC-001,,,,,\n");
    let r = run(ws);
    assert.ok(r.findings.some((f) => f.code === "REG-002" && f.message.includes("ABB-002 has no page")), codes(r).join());
    // A retired row needs no page.
    writeFileSync(path.join(root, "solution/abbs.csv"), readFileSync(path.join(root, "solution/abbs.csv"), "utf8").replace("ABB-002,Ghost,GH,active", "ABB-002,Ghost,GH,retired"));
    r = run(ws);
    assert.equal(r.summary.errors, 0, codes(r).join());
    // A reference architecture that implements a reference architecture, and a stale view.
    const ra = path.join(root, "solution/patterns/RA-001-example/index.md");
    writeFileSync(ra, readFileSync(ra, "utf8").replace("implements: [AP-001]", "implements: [RA-001]"));
    writeFileSync(path.join(root, "solution/patterns/AP-001-example/components.drawio"), "<mxfile>changed</mxfile>");
    r = run(ws);
    assert.ok(codes(r).includes("PAT-001"), codes(r).join());
    assert.ok(r.findings.some((f) => f.code === "MOD-002" && f.message.startsWith("stale")), codes(r).join());
    // A relation to nothing, an unknown namespace, and a page in the wrong folder.
    const abb = path.join(root, "solution/abbs/ABB-001-agent/index.md");
    writeFileSync(abb, readFileSync(abb, "utf8").replace("realised_by: [SBB-001]", "realised_by: [SBB-009, zz:SBB-001]"));
    mkdirSync(path.join(root, "solution/sbbs/misplaced"), { recursive: true });
    writeFileSync(path.join(root, "solution/sbbs/misplaced/index.md"), `---\nkind: sbb\nid: SBB-002\ntitle: "SBB-002 Misplaced"\n${common()}realises: [ABB-001]\nproducts:\n  - { name: "X", vendor: "Y" }\nproduct_mapping:\n  - { abb_component: "A", sbb_product: "X" }\ncloud_provider: aws\ndeployment_model: managed\n---\n`);
    r = run(ws);
    for (const code of ["REL-001", "REL-003", "ID-003", "REG-002"]) assert.ok(codes(r).includes(code), `${code} in ${codes(r).join()}`);
    // Front matter that breaks its schema, and an index.md with no kind.
    writeFileSync(abb, readFileSync(abb, "utf8").replace("status: active", "status: whenever"));
    mkdirSync(path.join(root, "solution/contexts/BC-002-bare"), { recursive: true });
    writeFileSync(path.join(root, "solution/contexts/BC-002-bare/index.md"), "---\ntitle: Bare\n---\n");
    r = run(ws);
    assert.ok(r.findings.some((f) => f.code === "FM-003" && f.file.endsWith("ABB-001-agent/index.md")), codes(r).join());
    assert.ok(r.findings.some((f) => f.code === "FM-001" && f.file.endsWith("BC-002-bare/index.md")), codes(r).join());
  } finally { rmSync(ws, { recursive: true, force: true }); }
});

test("inverse relations and open considerations warn", () => {
  const { ws, root } = workspace();
  try {
    const sbb = path.join(root, "solution/sbbs/SBB-001-agent-on-lambda/index.md");
    writeFileSync(sbb, readFileSync(sbb, "utf8").replace("realised_by_services: [api]\n", ""));
    const cn = path.join(root, "decisions/CN-001-which-model/index.md");
    writeFileSync(cn, readFileSync(cn, "utf8").replace("consideration_status: resolved", "consideration_status: open").replace("resolved_by: ADR-001\n", ""));
    const r = run(ws);
    assert.equal(r.summary.errors, 0, codes(r).join());
    assert.ok(r.findings.some((f) => f.code === "REL-002" && f.file.endsWith("SBB-001-agent-on-lambda/index.md")), codes(r).join());
    assert.ok(codes(r).includes("DEC-002"), codes(r).join());
  } finally { rmSync(ws, { recursive: true, force: true }); }
});
