// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0
//
// Regenerates the two derived capability CSVs from the authoritative
// capability-model.md (Canonical Capability Registry + Capability-to-ABB
// Traceability Matrix). Run from the repo root:
//   node scripts/gen-capability-csvs.mjs
//
// Hierarchy CSV  <- the registry table.
// ABB mapping CSV <- the traceability matrix, with coverage/scope derived from
// the relationship by a fixed rule:
//   primary      -> coverage=full,    scope_relevance=core
//   supporting   -> coverage=partial, scope_relevance=core
//   cross-cutting-> coverage=full,    scope_relevance=context

import { readFileSync, writeFileSync } from 'node:fs';

const ROOT = process.cwd();
const MODEL = `${ROOT}/foundation/capabilities/capability-model.md`;
const HIER_OUT = `${ROOT}/foundation/capabilities/capability-hierarchy.csv`;
const MAP_OUT = `${ROOT}/foundation/capabilities/capability-abb-mapping.csv`;
const LAST_VERIFIED = '2026-06-07';
const DOMAIN = 'Platform Foundations'; // single L1 root (CAP-001)

const ABB_NAMES = {
  'ABB-001': 'Identity & Access Management',
  'ABB-002': 'Observability',
  'ABB-003': 'Governance & Policy Enforcement',
  'ABB-004': 'API Mediation & Gateway',
  'ABB-005': 'Event Streaming & Messaging',
  'ABB-006': 'Compute Orchestration Platform',
  'ABB-007': 'Storage & Persistence Platform',
  'ABB-008': 'Network Connectivity & Security',
};
// Matrix column order (header row of the traceability matrix).
const ABB_COLS = ['ABB-001', 'ABB-002', 'ABB-003', 'ABB-004', 'ABB-005', 'ABB-006', 'ABB-007', 'ABB-008'];

const cells = (line) => line.split('|').slice(1, -1).map((c) => c.trim());
const strip = (s) => s.replace(/\*\*/g, '').replace(/`/g, '').trim();
const linkId = (s) => {
  const m = strip(s).match(/\[?(CAP-\d{3})\]?/);
  return m ? m[1] : null;
};

const lines = readFileSync(MODEL, 'utf8').split(/\r?\n/);

// --- Parse Canonical Capability Registry ---
const registry = [];
for (const line of lines) {
  if (!line.startsWith('| [CAP-')) continue;
  const c = cells(line);
  // ID | Name | Level | Parent ID | Platform | Current | Target
  const id = linkId(c[0]);
  if (!id) continue;
  registry.push({
    id,
    name: strip(c[1]),
    level: strip(c[2]),
    parent: strip(c[3]) === '-' ? '' : strip(c[3]),
    current: strip(c[5]),
    target: strip(c[6]),
  });
}

// --- Parse Capability-to-ABB Traceability Matrix ---
const mapRows = [];
for (const line of lines) {
  if (!line.startsWith('| **CAP-')) continue;
  const c = cells(line);
  const id = linkId(c[0]);
  if (!id) continue;
  const name = strip(c[0]).replace(/^CAP-\d{3}\s*/, '');
  for (let i = 0; i < ABB_COLS.length; i++) {
    const val = strip(c[i + 1]).toLowerCase();
    if (!val || val === '-') continue;
    const relationship = val; // primary | supporting | cross-cutting
    const coverage = relationship === 'supporting' ? 'partial' : 'full';
    const scope = relationship === 'cross-cutting' ? 'context' : 'core';
    mapRows.push({
      id, name, abb: ABB_COLS[i], abbName: ABB_NAMES[ABB_COLS[i]],
      relationship, coverage, scope,
    });
  }
}

// --- Emit hierarchy CSV ---
const hierHeader = 'capability_id,capability_name,level,parent_id,domain,path,status,current_maturity,target_maturity';
const hierLines = registry.map((r) =>
  [r.id, r.name, r.level, r.parent, DOMAIN, `capabilities/${r.id}/index.md`, 'DRAFT', r.current, r.target].join(','));
writeFileSync(HIER_OUT, hierHeader + '\n' + hierLines.join('\n') + '\n');

// --- Emit ABB mapping CSV ---
const mapHeader = 'capability_id,capability_name,abb_id,abb_name,relationship,coverage,scope_relevance,source_capability_path,source_section,last_verified';
const mapLines = mapRows.map((r) =>
  [r.id, r.name, r.abb, r.abbName, r.relationship, r.coverage, r.scope, `capabilities/${r.id}/index.md`, '4.2 ABB Mapping', LAST_VERIFIED].join(','));
writeFileSync(MAP_OUT, mapHeader + '\n' + mapLines.join('\n') + '\n');

console.log(`hierarchy.csv: ${hierLines.length} rows`);
console.log(`abb-mapping.csv: ${mapLines.length} rows`);
