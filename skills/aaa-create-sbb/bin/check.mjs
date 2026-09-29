#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0

/**
 * Post-install check for an aaa-create-* skill (DD-11 of AI-Assisted Work).
 *
 * Run from the workspace root, with SKILL_DIR set to the installed skill's directory.
 * Checks that .aaa-config.yaml is there, that the ontology schema it names exists, and
 * that [suite.<skill>] of .agents/skill-bindings.toml answers the skill's inputs.toml:
 * every required binding declared, and every declared directory or file present. Paths
 * resolve against the binding file's directory, as the skills resolve them.
 *
 * Exit 0: correct (warnings may be printed). Exit 1: problems, one line each.
 * Exit 2: usage or environment error. Offline and read-only.
 *
 * The same file ships in every aaa-create-* skill, so each skill is complete on its own;
 * CI checks the copies are identical.
 */

import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

if (Number(process.versions.node.split(".")[0]) < 18) {
  console.error(`Node.js ${process.versions.node} is too old: this check needs 18 or newer.`);
  process.exit(2);
}
if (process.argv.length > 2) {
  console.error("usage: check.mjs   (run from the workspace root; takes no arguments)");
  process.exit(2);
}

const skillDir = path.resolve(process.env.SKILL_DIR || path.dirname(path.dirname(fileURLToPath(import.meta.url))));
const skill = path.basename(skillDir);
const root = process.cwd();
const problems = [];
const warnings = [];

/**
 * The tables of a TOML file as { "a.b": { key: value } }, for the flat string, boolean
 * and number values these files use. A multi-line string is skipped, since only
 * descriptions are written that way.
 */
function toml(text) {
  const out = {};
  let table = (out[""] = {});
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t || t.startsWith("#")) continue;
    const h = /^\[\s*([^\]]+?)\s*\]$/.exec(t);
    if (h) {
      table = out[h[1]] ??= {};
      continue;
    }
    const m = /^([A-Za-z0-9_-]+)\s*=\s*(.*)$/.exec(t);
    if (!m) continue;
    let v = m[2];
    if (v.startsWith('"""') || v.startsWith("'''")) {
      const q = v.slice(0, 3);
      if (!v.slice(3).includes(q)) while (i + 1 < lines.length && !lines[++i].includes(q));
      continue;
    }
    if (v[0] === '"' || v[0] === "'") v = v.slice(1, v.indexOf(v[0], 1));
    else {
      v = v.replace(/\s+#.*$/, "");
      v = v === "true" ? true : v === "false" ? false : v;
    }
    table[m[1]] = v;
  }
  return out;
}

// .aaa-config.yaml, and the ontology schema it names.
const config = path.join(root, ".aaa-config.yaml");
if (!existsSync(config)) {
  problems.push(
    `.aaa-config.yaml: not found in ${root}. Run the AI-Assisted Architecture installer in the workspace root, or copy install/templates/aaa-config.yaml from it.`,
  );
} else {
  const text = readFileSync(config, "utf8").replace(/\r\n/g, "\n");
  const block = /^ontology:\s*\n((?:[ \t]+.*\n?)*)/m.exec(text)?.[1] ?? "";
  const schema = /^\s+schema:\s*["']?([^"'#\n]+?)["']?\s*(#.*)?$/m.exec(block)?.[1];
  if (schema && !existsSync(path.resolve(root, schema))) {
    warnings.push(
      `.aaa-config.yaml: ontology.schema ${schema} does not exist, so nothing can be validated against the ontology. Put the schema there, or correct the path.`,
    );
  }
}

// The skill's inputs.toml, answered in [suite.<skill>] of the bindings.
const inputsFile = path.join(skillDir, "inputs.toml");
const options = {};
if (existsSync(inputsFile)) {
  for (const [name, table] of Object.entries(toml(readFileSync(inputsFile, "utf8")))) {
    const m = /^inputs\.options\.(.+)$/.exec(name);
    if (m) options[m[1]] = table;
  }
}
let bindingsFile = null;
for (let d = root; ; d = path.dirname(d)) {
  for (const n of [path.join(".agents", "skill-bindings.toml"), "skill-bindings.toml"]) {
    if (!bindingsFile && existsSync(path.join(d, n))) bindingsFile = path.join(d, n);
  }
  if (bindingsFile || path.dirname(d) === d) break;
}
const required = Object.entries(options).filter(([, o]) => o.required === true).map(([k]) => k);
if (!bindingsFile) {
  if (required.length) {
    problems.push(
      `.agents/skill-bindings.toml: not found at or above ${root}. Create it with [suite.${skill}] declaring ${required.join(", ")}.`,
    );
  }
} else {
  const section = toml(readFileSync(bindingsFile, "utf8"))[`suite.${skill}`] ?? {};
  const base = path.dirname(bindingsFile);
  for (const k of required) {
    if (section[k] === undefined || section[k] === "") {
      problems.push(`${bindingsFile}: [suite.${skill}] does not declare ${k}. ${options[k].type === "dir" ? "Name the folder" : "Name it"}; it has no default.`);
    }
  }
  for (const [k, v] of Object.entries(section)) {
    const type = options[k]?.type;
    if (!["dir", "file", "path"].includes(type) || typeof v !== "string") continue;
    const cut = v.indexOf("{");
    const p = path.resolve(base, cut >= 0 ? v.slice(0, cut) : v);
    const target = cut >= 0 ? path.dirname(p + "x") : p;
    if (!existsSync(target)) {
      problems.push(`${bindingsFile}: [suite.${skill}] ${k} = "${v}" resolves to ${target}, which does not exist. Create it, or correct ${k}.`);
    } else if (type === "dir" && cut < 0 && !statSync(target).isDirectory()) {
      problems.push(`${bindingsFile}: [suite.${skill}] ${k} = "${v}" is a file; it should name a folder.`);
    }
  }
}

for (const w of warnings) console.log(`warning: ${w}`);
for (const p of problems) console.log(p);
if (problems.length === 0) console.log(`${skill}: ok`);
process.exit(problems.length ? 1 : 0);
