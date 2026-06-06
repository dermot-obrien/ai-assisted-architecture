#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0
// Part of the ai-assisted-architecture framework: https://github.com/dermot-obrien/ai-assisted-architecture
//
// migrate-frontmatter.mjs — R04 foundation migration.
//
// Walks foundation/**/index.md and adds the v1.1.0 universal envelope fields
// (id, kind, version, status, created, last_modified, owner) to each artefact's
// YAML frontmatter, preserving every existing field. Idempotent: a field that is
// already present is never overwritten, so re-running is a no-op.
//
// It also repairs malformed frontmatter where the opening `---` was never closed
// (the block runs straight into the document heading) by emitting a proper
// closing fence.
//
// Scope: this adds the ENVELOPE fields only. Per-kind schemas (abb/sbb/capability/
// …) require additional body fields (category, interfaces, products, …) that are
// not derivable mechanically; bringing each artefact to full per-kind validation
// is separate, manual work. After this migration every foundation artefact carries
// a well-formed envelope.
//
// Usage:
//   node scripts/migrate-frontmatter.mjs [--root <dir>] [--date YYYY-MM-DD] [--dry-run]
//
//   --root      Root to walk (default: foundation)
//   --date      Value for created/last_modified (default: today, system clock)
//   --dry-run   Report what would change without writing

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// ---- args -------------------------------------------------------------------
const argv = process.argv.slice(2);
function arg(name, fallback) {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] ? argv[i + 1] : fallback;
}
const ROOT = path.resolve(arg('--root', 'foundation'));
const DRY_RUN = argv.includes('--dry-run');
const TODAY = arg('--date', new Date().toISOString().slice(0, 10));
const OWNER = 'dermot.obrien@patternode.com';

if (!/^\d{4}-\d{2}-\d{2}$/.test(TODAY)) {
  console.error(`Invalid --date '${TODAY}'; expected YYYY-MM-DD.`);
  process.exit(1);
}

// ---- path -> kind mapping ---------------------------------------------------
// Keyed on a directory segment that appears in the artefact's path. First match
// wins, so the more specific building-block segments are listed before generic
// ones. Mirrors the kindEnum in envelope.schema.json.
const DIR_KIND = [
  ['architecture-building-blocks', 'abb'],
  ['solution-building-blocks', 'sbb'],
  ['capabilities', 'capability'],
  ['contexts', 'bounded-context'],
  ['platforms', 'platform'],
  ['outcomes', 'outcome'],
  ['use-cases', 'use-case'],
];

// Expected id prefix per kind, used to sanity-check the derived id.
const KIND_PREFIX = {
  abb: 'ABB', sbb: 'SBB', capability: 'CAP', 'bounded-context': 'BC',
  platform: 'PL', outcome: 'OC', 'use-case': 'UC',
};

function kindForPath(p) {
  const segs = p.split(path.sep);
  for (const [dir, kind] of DIR_KIND) {
    if (segs.includes(dir)) return kind;
  }
  return null;
}

// ---- walk -------------------------------------------------------------------
function findIndexFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) findIndexFiles(full, out);
    else if (entry.isFile() && entry.name === 'index.md') out.push(full);
  }
  return out;
}

// ---- frontmatter splitting --------------------------------------------------
// Returns { fm, body, malformed }. `fm` is the raw YAML text (null if the file
// has no frontmatter). Three shapes are handled:
//   - well-formed: `--- … ---` with a closing fence before the first heading
//   - unclosed:    opening `---` with no closing fence before the first `#`
//                  heading — the YAML region is the run of lines up to the first
//                  blank line or heading; `malformed` is true so the caller
//                  re-emits a proper closing fence
//   - none:        the file does not start with `---`
function splitFrontmatter(raw) {
  const lines = raw.split(/\r?\n/);
  if (lines[0].trim() !== '---') return { fm: null, body: raw, malformed: false };

  let fenceIdx = -1;
  let headIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t === '---' || t === '...') { fenceIdx = i; break; }
    if (lines[i].startsWith('#')) { headIdx = i; break; }
  }

  // Well-formed: a closing fence appears before any heading.
  if (fenceIdx !== -1) {
    return {
      fm: lines.slice(1, fenceIdx).join('\n'),
      body: lines.slice(fenceIdx + 1).join('\n'),
      malformed: false,
    };
  }

  // Unclosed: the YAML region is the run of lines up to the first blank/heading.
  let endIdx = lines.length;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '' || lines[i].startsWith('#')) { endIdx = i; break; }
  }
  return {
    fm: lines.slice(1, endIdx).join('\n'),
    body: lines.slice(endIdx).join('\n'),
    malformed: true,
  };
}

// Quote a scalar for YAML output where a bareword would be ambiguous (dates,
// versions, emails) so it is parsed back as a string. Plain enums like 'draft'
// stay unquoted for readability.
function q(v) {
  return `"${String(v).replace(/"/g, '\\"')}"`;
}

// ---- per-file migration -----------------------------------------------------
function migrateFile(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const rel = path.relative(process.cwd(), file);

  const kind = kindForPath(file);
  if (!kind) return { file: rel, status: 'skipped', reason: 'no kind for path' };

  const id = path.basename(path.dirname(file));
  const prefix = KIND_PREFIX[kind];
  if (prefix && !new RegExp(`^${prefix}-\\d{3}$`).test(id)) {
    return { file: rel, status: 'skipped', reason: `folder '${id}' is not a ${prefix}-NNN id` };
  }

  const { fm, body, malformed } = splitFrontmatter(raw);
  let existing = {};
  if (fm) {
    try {
      existing = yaml.load(fm, { schema: yaml.JSON_SCHEMA }) || {};
    } catch (e) {
      return { file: rel, status: 'error', reason: `unparseable frontmatter: ${e.message}` };
    }
  }
  if (typeof existing !== 'object' || Array.isArray(existing)) {
    return { file: rel, status: 'error', reason: 'frontmatter is not a mapping' };
  }

  // Envelope fields to ensure, in display order. Only those missing are added;
  // existing values (e.g. an already-present title) are preserved untouched.
  const ensure = [
    ['id', id],
    ['kind', kind],
    ['version', q('0.1.0')],
    ['status', 'draft'],
    ['created', q(TODAY)],
    ['last_modified', q(TODAY)],
    ['owner', q(OWNER)],
  ];

  const addLines = [];
  const added = [];
  for (const [key, val] of ensure) {
    if (Object.prototype.hasOwnProperty.call(existing, key)) continue;
    addLines.push(`${key}: ${val}`);
    added.push(key);
  }

  // Already complete and well-formed -> nothing to do.
  if (added.length === 0 && !malformed) {
    return { file: rel, status: 'unchanged', added: [], malformed };
  }

  // New envelope lines on top, then the existing frontmatter lines verbatim.
  const fmBlock = [...addLines, ...(fm ? [fm] : [])].filter((s) => s !== '').join('\n');
  // Normalise to exactly one blank line between the closing fence and the body.
  const bodyContent = body.replace(/^(\r?\n)+/, '');
  const next = `---\n${fmBlock}\n---\n\n${bodyContent}`;

  if (!DRY_RUN) fs.writeFileSync(file, next);
  return {
    file: rel,
    status: DRY_RUN ? 'would-update' : 'updated',
    added, id, kind, malformed,
  };
}

// ---- main -------------------------------------------------------------------
if (!fs.existsSync(ROOT)) {
  console.error(`Root not found: ${ROOT}`);
  process.exit(1);
}

const files = findIndexFiles(ROOT).sort();
const results = files.map(migrateFile);

const counts = {};
let repaired = 0;
for (const r of results) {
  counts[r.status] = (counts[r.status] || 0) + 1;
  if (r.malformed && (r.status === 'updated' || r.status === 'would-update')) repaired++;
}

for (const r of results) {
  if (r.status === 'updated' || r.status === 'would-update') {
    console.log(`  ${r.status}${r.malformed ? ' (repaired fence)' : ''}: ${r.file}  (+${r.added.join(', ')})`);
  } else if (r.status === 'skipped' || r.status === 'error') {
    console.log(`  ${r.status}: ${r.file}  — ${r.reason}`);
  }
}

console.log('');
console.log(`migrate-frontmatter: ${files.length} index.md under ${path.relative(process.cwd(), ROOT) || '.'}`);
console.log(`  date=${TODAY} owner=${OWNER}${DRY_RUN ? '  [DRY RUN]' : ''}`);
console.log('  ' + Object.entries(counts).map(([k, v]) => `${k}=${v}`).join('  ') + (repaired ? `  (unclosed-frontmatter repaired=${repaired})` : ''));

if (counts.error) process.exit(1);
