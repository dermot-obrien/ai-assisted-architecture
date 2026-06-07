// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0
//
// Aligns each L3 capability's `realised_by_abbs` frontmatter with the
// authoritative Capability-to-ABB Traceability Matrix in capability-model.md.
// Order within the list: primary, then supporting, then cross-cutting — each
// group in ascending ABB-id order (matches the existing CAP-004/CAP-014 style).
// Idempotent. Run from repo root: node scripts/sync-cap-abb-frontmatter.mjs

import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = process.cwd();
const MODEL = `${ROOT}/foundation/capabilities/capability-model.md`;
const cols = ['ABB-001', 'ABB-002', 'ABB-003', 'ABB-004', 'ABB-005', 'ABB-006', 'ABB-007', 'ABB-008'];
const rank = { primary: 0, supporting: 1, 'cross-cutting': 2 };

const lines = readFileSync(MODEL, 'utf8').split(/\r?\n/);
const model = {};
for (const l of lines) {
  if (!l.startsWith('| **CAP-')) continue;
  const c = l.split('|').slice(1, -1).map((x) => x.trim());
  const id = c[0].replace(/\*\*/g, '').match(/CAP-\d{3}/)[0];
  const entries = [];
  for (let i = 0; i < 8; i++) {
    const v = c[i + 1].replace(/\*\*/g, '').trim().toLowerCase();
    if (v && v !== '-') entries.push({ abb: cols[i], rel: v });
  }
  entries.sort((a, b) => (rank[a.rel] - rank[b.rel]) || a.abb.localeCompare(b.abb));
  model[id] = entries.map((e) => e.abb);
}

let changed = 0;
for (const id of Object.keys(model)) {
  const path = `${ROOT}/foundation/capabilities/${id}/index.md`;
  const text = readFileSync(path, 'utf8');
  const nl = text.includes('\r\n') ? '\r\n' : '\n';
  const all = text.split(/\r?\n/);
  // Frontmatter is between the first two '---' lines.
  const close = all.indexOf('---', 1);
  const fm = all.slice(1, close);
  const body = all.slice(close); // includes the closing '---'

  // Line-based strip of any existing realised_by_abbs key + its '- ' items.
  const kept = [];
  for (let i = 0; i < fm.length; i++) {
    if (/^realised_by_abbs:/.test(fm[i])) {
      // skip the key line and following indented sequence items
      while (i + 1 < fm.length && /^\s*-\s*ABB-\d{3}\s*$/.test(fm[i + 1])) i++;
      continue;
    }
    kept.push(fm[i]);
  }
  kept.push('realised_by_abbs:');
  for (const a of model[id]) kept.push(`  - ${a}`);

  const out = ['---', ...kept, ...body].join(nl);
  if (out !== text) { writeFileSync(path, out); changed++; }
}
console.log(`Updated ${changed} capability files.`);
