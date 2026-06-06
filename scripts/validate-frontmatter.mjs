#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0
// Part of the ai-assisted-architecture framework: https://github.com/dermot-obrien/ai-assisted-architecture
//
// validate-frontmatter.mjs — validate catalog-artefact frontmatter against the
// v1.1.0 JSON Schemas (standards/schemas/v1.1.0/).
//
// Walks index.md files under a root, extracts the YAML frontmatter, and validates
// each against its per-kind schema (resolved from the `kind` field), with the
// universal envelope composed in via $ref. Prints per-file errors and a summary,
// and exits non-zero if any artefact fails.
//
// Usage:
//   node scripts/validate-frontmatter.mjs [--root <dir>] [--quiet]
//
//   --root    Root to walk (default: foundation)
//   --quiet   Only print failures and the summary

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_DIR = path.resolve(__dirname, '..', 'standards', 'schemas', 'v1.1.0');

const argv = process.argv.slice(2);
function arg(name, fallback) {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
}
const ROOT = path.resolve(arg('--root', 'foundation'));
const QUIET = argv.includes('--quiet');

// Per-kind schema files. (Placeholders under _placeholders/ are not validated.)
const KIND_SCHEMA = {
  outcome: 'outcome.schema.json',
  'use-case': 'use-case.schema.json',
  platform: 'platform.schema.json',
  capability: 'capability.schema.json',
  'bounded-context': 'bounded-context.schema.json',
  abb: 'abb.schema.json',
  sbb: 'sbb.schema.json',
  service: 'service.schema.json',
  'decision-record': 'decision-record.schema.json',
  snapshot: 'snapshot.schema.json',
  transition: 'transition.schema.json',
};

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

// Load the envelope first (every per-kind schema $refs it by $id), then per-kind.
ajv.addSchema(JSON.parse(fs.readFileSync(path.join(SCHEMA_DIR, 'envelope.schema.json'), 'utf8')));
const validators = {};
for (const [kind, file] of Object.entries(KIND_SCHEMA)) {
  const full = path.join(SCHEMA_DIR, file);
  if (!fs.existsSync(full)) continue;
  validators[kind] = ajv.compile(JSON.parse(fs.readFileSync(full, 'utf8')));
}

function findIndexFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) findIndexFiles(full, out);
    else if (entry.isFile() && entry.name === 'index.md') out.push(full);
  }
  return out;
}

function frontmatter(raw) {
  // Skip a leading REUSE/SPDX HTML comment block and any blank lines before the
  // YAML frontmatter fence.
  let text = raw.replace(/^﻿/, '');
  text = text.replace(/^\s*<!--[\s\S]*?-->\s*/, '');
  const lines = text.split(/\r?\n/);
  if (lines[0].trim() !== '---') return null;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---' || lines[i].trim() === '...') {
      return yaml.load(lines.slice(1, i).join('\n'), { schema: yaml.JSON_SCHEMA });
    }
  }
  return null;
}

const files = findIndexFiles(ROOT).sort();
let pass = 0; let fail = 0; let skip = 0;
for (const file of files) {
  const rel = path.relative(process.cwd(), file);
  let fm;
  try { fm = frontmatter(fs.readFileSync(file, 'utf8')); } catch (e) {
    console.log(`  FAIL ${rel} — frontmatter parse: ${e.message}`); fail++; continue;
  }
  if (!fm || !fm.kind) { console.log(`  SKIP ${rel} — no kind`); skip++; continue; }
  const validate = validators[fm.kind];
  if (!validate) { console.log(`  SKIP ${rel} — no schema for kind '${fm.kind}'`); skip++; continue; }
  if (validate(fm)) {
    pass++;
    if (!QUIET) console.log(`  ok   ${rel}  (${fm.kind})`);
  } else {
    fail++;
    console.log(`  FAIL ${rel}  (${fm.kind})`);
    for (const e of validate.errors) {
      console.log(`         ${e.instancePath || '/'} ${e.message}${e.params && Object.keys(e.params).length ? ' ' + JSON.stringify(e.params) : ''}`);
    }
  }
}

console.log('');
console.log(`validate-frontmatter: ${files.length} files under ${path.relative(process.cwd(), ROOT) || '.'}  ->  pass=${pass} fail=${fail} skip=${skip}`);
process.exit(fail ? 1 : 0);
