#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0
// Part of the ai-assisted-architecture framework: https://github.com/dermot-obrien/ai-assisted-architecture
//
// migrate-frontmatter.mjs — R04 foundation migration (v1.0.0 -> v1.1.0).
//
// Walks foundation/**/index.md and brings each artefact's YAML frontmatter up to
// the v1.1.0 contract:
//
//   1. Universal envelope (id, kind, version, status, created, last_modified,
//      owner) inferred from the folder path and a fixed default date/owner.
//   2. Per-kind required fields, EXTRACTED FROM THE DOCUMENT BODY — the Document
//      Control table and the numbered prose sections — so every artefact validates
//      against its strict per-kind schema (standards/schemas/v1.1.0/<kind>.schema.json).
//
// What is read per kind (source -> frontmatter field):
//   abb         category, short_name, realises_capabilities  <- Document Control
//               interfaces                                    <- §3.1 interface table
//               part_of                                       <- reverse index (the BC
//                                                                that lists this ABB under
//                                                                "Contained ABBs")
//               domains, mandatory_subabbs                    <- defaults (see below)
//   sbb         realises, short_name                          <- Document Control
//               product_mapping                               <- §2.2 product table
//               products                                      <- derived from product_mapping
//   capability  level, parent, provided_by_platform,         <- Document Control
//               required_by_outcomes
//               components.{organisation,people,processes,technology} <- §2.1–2.4
//               maturity.{current,target,...}                 <- §3.2 assessment table
//               realised_by_abbs                              <- §4.2 ABB-mapping table (L3)
//   bounded-context  part_of, owner                           <- Document Control
//               contains, realises_capabilities              <- "Contained ABBs" / "Realised Capabilities"
//               ubiquitous_language                          <- "Ubiquitous Language" list
//   platform    strategic_owner                               <- Document Control
//               provides_capabilities, contains_bounded_contexts <- §3 / §4 lists
//   outcome     kpi                                           <- Document Control "Measure"
//               business_rationale                            <- "Business Rationale" prose
//               owned_by_platform                             <- reverse index (the PL that
//                                                                lists this OC)
//   use-case    primary_actor, supports_outcome               <- Document Control
//               success_criteria                              <- "Success Criteria" list
//               realised_by_abbs                              <- "Realisation" list
//
// Documented defaults / heuristics (flagged in the per-file report):
//   - ABB `domains` defaults to ["application"] — every logical building block is at
//     least an application-domain component; refine by hand where data/technology apply.
//   - ABB `mandatory_subabbs` defaults to ["iam","observability","governance"] (schema default).
//   - ABB interface `direction` is derived from the table's arrow column: the token
//     that appears on one side of every arrow is treated as "self"; arrows pointing
//     at self -> "in", away from self -> "out", otherwise "bidirectional".
//   - ABB interface `type` is mapped from free-text by keyword (stream/event/query/
//     callback/request). The body description is preserved verbatim, so the precise
//     semantics survive even where the enum bucket is approximate — review recommended.
//   - `governance_zone: foundation` is set on every artefact (these are the shipped seed).
//
// Idempotent: a frontmatter key that already exists is never overwritten, so the
// envelope added by an earlier run is preserved and re-running is a no-op.
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
const DIR_KIND = [
  ['architecture-building-blocks', 'abb'],
  ['solution-building-blocks', 'sbb'],
  ['capabilities', 'capability'],
  ['contexts', 'bounded-context'],
  ['platforms', 'platform'],
  ['outcomes', 'outcome'],
  ['use-cases', 'use-case'],
];

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
function splitFrontmatter(raw) {
  const lines = raw.split(/\r?\n/);
  if (lines[0].trim() !== '---') return { fm: null, body: raw, malformed: false };

  let fenceIdx = -1;
  for (let i = 1; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t === '---' || t === '...') { fenceIdx = i; break; }
    if (lines[i].startsWith('#')) break;
  }

  if (fenceIdx !== -1) {
    return {
      fm: lines.slice(1, fenceIdx).join('\n'),
      body: lines.slice(fenceIdx + 1).join('\n'),
      malformed: false,
    };
  }

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

// ---- markdown helpers -------------------------------------------------------
// Strip markdown inline formatting: bold, code, links -> visible text.
function stripFmt(s) {
  return String(s)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/[`*]/g, '')                     // code/bold markers
    .replace(/\s+/g, ' ')
    .trim();
}

// Pull every artefact ID of the given prefix(es) out of a string, in order, deduped.
function idsIn(text, prefix) {
  const pat = new RegExp(`\\b(?:${prefix})-\\d{3}\\b`, 'g');
  const out = [];
  for (const m of String(text).matchAll(pat)) {
    if (!out.includes(m[0])) out.push(m[0]);
  }
  return out;
}
function firstId(text, prefix) {
  const all = idsIn(text, prefix);
  return all.length ? all[0] : null;
}

// Parse all GitHub-flavoured pipe tables in a block of markdown.
// Returns [{ headers: [...], rows: [[cell,...], ...] }].
function parseTables(md) {
  const lines = md.split(/\r?\n/);
  const tables = [];
  let i = 0;
  const cells = (line) => line.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map((c) => c.trim());
  while (i < lines.length) {
    if (/^\s*\|.*\|\s*$/.test(lines[i]) && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|?\s*$/.test(lines[i + 1]) && lines[i + 1].includes('-')) {
      const headers = cells(lines[i]);
      const rows = [];
      i += 2;
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) {
        rows.push(cells(lines[i]));
        i++;
      }
      tables.push({ headers, rows });
    } else {
      i++;
    }
  }
  return tables;
}

// The Document Control table is the first table in the file. Build a map of
// stripped-property-name -> raw value cell (formatting preserved for ID extraction).
function docControl(md) {
  const tables = parseTables(md);
  const map = {};
  if (!tables.length) return map;
  for (const row of tables[0].rows) {
    if (row.length < 2) continue;
    const key = stripFmt(row[0]).toLowerCase();
    if (key) map[key] = row[1];
  }
  return map;
}
function dc(map, ...keys) {
  for (const k of keys) {
    const v = map[k.toLowerCase()];
    if (v != null && stripFmt(v) !== '' && stripFmt(v) !== '-' && stripFmt(v) !== '—') return v;
  }
  return null;
}

// Return the body of the first section whose heading contains `keyword`
// (case-insensitive, ignoring leading #'s and section numbers), up to the next
// heading of the same or higher level.
function section(md, keyword) {
  const lines = md.split(/\r?\n/);
  const kw = keyword.toLowerCase();
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(#{1,6})\s+(.*)$/);
    if (!m) continue;
    const level = m[1].length;
    const heading = m[2].replace(/^[\d.\s]+/, '').toLowerCase();
    if (heading.includes(kw)) {
      const out = [];
      for (let j = i + 1; j < lines.length; j++) {
        const hm = lines[j].match(/^(#{1,6})\s+/);
        if (hm && hm[1].length <= level) break;
        out.push(lines[j]);
      }
      return out.join('\n');
    }
  }
  return null;
}

// Bulleted list items in a block: returns [{ lead, text }] where `lead` is the
// bold lead-in term (if any) and `text` is the whole item, formatting stripped.
function bullets(md) {
  if (!md) return [];
  const out = [];
  for (const line of md.split(/\r?\n/)) {
    const m = line.match(/^\s*[-*]\s+(.*)$/);
    if (!m) continue;
    const raw = m[1];
    const lead = (raw.match(/^\*\*(.+?)\*\*/) || [])[1];
    // Lead-ins follow the house style "**Term.** Description" — the full stop lives
    // inside the bold, so strip a single trailing '.' to get a clean catalog term.
    out.push({ lead: lead ? stripFmt(lead).replace(/\.$/, '') : null, text: stripFmt(raw) });
  }
  return out;
}
// Lead-in terms (or whole item where there is no bold lead) — for array fields.
function bulletTerms(md) {
  return bullets(md).map((b) => b.lead || b.text).filter(Boolean);
}

// ---- per-kind field builders ------------------------------------------------
// Each returns an object of fields to ADD (existing keys are filtered out later).

function buildAbb(dcMap, body, ctx, id, flags) {
  const f = {};
  const cat = dc(dcMap, 'category');
  if (cat) f.category = stripFmt(cat);
  const sn = dc(dcMap, 'short name');
  if (sn) f.short_name = stripFmt(sn);

  let caps = idsIn(dc(dcMap, 'realizes capability', 'realises capability') || '', 'CAP');
  // Fallback: ABBs without a Document-Control "Realizes Capability" row (ABB-004…008)
  // are recovered from the capability side — the capabilities that name this ABB as
  // their `primary` realiser (reverse index built in pass 1).
  if (!caps.length && ctx.abbToCaps[id]) caps = ctx.abbToCaps[id];
  if (caps.length) f.realises_capabilities = caps;

  // part_of: the BC that contains this ABB (reverse index).
  if (ctx.abbToBc[id]) f.part_of = ctx.abbToBc[id];

  // interfaces from §3.1 (or the "Interfaces" section's first table).
  const ifSec = section(body, 'interface');
  const tables = ifSec ? parseTables(ifSec) : [];
  if (tables.length) {
    const t = tables[0];
    const col = (names) => t.headers.findIndex((h) => names.some((n) => stripFmt(h).toLowerCase().includes(n)));
    const ci = col(['id']);
    const cd = col(['direction']);
    const ct = col(['type']);
    const cdesc = col(['description']);
    // detect the "self" token shared by every direction arrow
    const selfTok = detectSelf(t.rows.map((r) => (cd >= 0 ? r[cd] : '')));
    const ifaces = [];
    for (const r of t.rows) {
      const iid = (stripFmt(r[ci] || '').match(/I\d+/) || [])[0];
      if (!iid) continue;
      const dirCell = cd >= 0 ? r[cd] : '';
      const typeCell = ct >= 0 ? stripFmt(r[ct]) : '';
      const desc = cdesc >= 0 ? stripFmt(r[cdesc]) : (typeCell || iid);
      ifaces.push({
        id: iid,
        direction: ifaceDir(dirCell, selfTok),
        type: ifaceType(typeCell, desc),
        description: desc || iid,
      });
    }
    if (ifaces.length) {
      f.interfaces = ifaces;
      flags.push('interfaces direction/type heuristically mapped');
    }
  }

  f.domains = ['application'];
  flags.push('domains defaulted to [application]');
  f.mandatory_subabbs = ['iam', 'observability', 'governance'];
  return f;
}

function detectSelf(dirCells) {
  const tally = {};
  for (const cell of dirCells) {
    const parts = String(cell).split(/→|->|—>|➔|⇒|<->|↔/);
    for (const p of parts) {
      const tok = stripFmt(p).toLowerCase();
      if (tok) tally[tok] = (tally[tok] || 0) + 1;
    }
  }
  let best = null; let bestN = 0;
  for (const [tok, n] of Object.entries(tally)) {
    if (n > bestN) { best = tok; bestN = n; }
  }
  return best;
}
function ifaceDir(cell, selfTok) {
  const parts = String(cell).split(/→|->|—>|➔|⇒|<->|↔/);
  if (parts.length === 2 && selfTok) {
    const left = stripFmt(parts[0]).toLowerCase();
    const right = stripFmt(parts[1]).toLowerCase();
    const inR = right.includes(selfTok);
    const inL = left.includes(selfTok);
    if (inR && !inL) return 'in';
    if (inL && !inR) return 'out';
  }
  if (/↔|<->/.test(cell)) return 'bidirectional';
  return 'bidirectional';
}
function ifaceType(typeCell, desc) {
  const s = `${typeCell} ${desc}`.toLowerCase();
  if (/\bstream\b/.test(s)) return 'stream';
  if (/\bevent|feed|\blog\b|logs\b|notification|telemetry\b/.test(s)) return 'event';
  if (/\bquery|lookup|read\b|metadata\b/.test(s)) return 'query';
  if (/\bcallback|response|decision|reply|result|issued\b/.test(s)) return 'callback';
  return 'request';
}

function buildSbb(dcMap, body, ctx, id, flags) {
  const f = {};
  const abbs = idsIn(dc(dcMap, 'realizes abb', 'realises abb') || '', 'ABB');
  if (abbs.length) f.realises = abbs;
  const sn = dc(dcMap, 'short name');
  if (sn) f.short_name = stripFmt(sn);

  // product_mapping from the §2.2 product-mapping table.
  const pmSec = section(body, 'product mapping') || body;
  const tables = parseTables(pmSec);
  const mapping = [];
  for (const t of tables) {
    const comp = t.headers.findIndex((h) => /component/i.test(stripFmt(h)));
    const prod = t.headers.findIndex((h) => /product|service/i.test(stripFmt(h)));
    const note = t.headers.findIndex((h) => /note/i.test(stripFmt(h)));
    if (comp < 0 || prod < 0) continue;
    for (const r of t.rows) {
      const ac = stripFmt(r[comp] || '');
      const sp = stripFmt(r[prod] || '');
      if (!ac || !sp) continue;
      const row = { abb_component: ac, sbb_product: sp };
      if (note >= 0 && stripFmt(r[note] || '')) row.notes = stripFmt(r[note]);
      mapping.push(row);
    }
    if (mapping.length) break; // first usable table only
  }
  if (mapping.length) {
    f.product_mapping = mapping;
    // products derived from the distinct SBB products in the mapping.
    const seen = new Set();
    const products = [];
    for (const m of mapping) {
      if (seen.has(m.sbb_product)) continue;
      seen.add(m.sbb_product);
      products.push({ name: m.sbb_product });
    }
    f.products = products;
    flags.push('products derived from product_mapping');
  }
  return f;
}

function buildCapability(dcMap, body, ctx, id, flags) {
  const f = {};
  const lvl = stripFmt(dc(dcMap, 'level') || '');
  if (/^L[123]$/.test(lvl)) f.level = lvl;
  const parent = firstId(dc(dcMap, 'parent') || '', 'CAP');
  if (parent) f.parent = parent;

  const plat = firstId(dc(dcMap, 'platform') || '', 'PL');
  if (plat) f.provided_by_platform = plat;

  const outs = idsIn(dc(dcMap, 'realizes outcome', 'realises outcome') || '', 'OC');
  if (outs.length) f.required_by_outcomes = outs;

  // components from §2.1–2.4
  const org = bulletTerms(section(body, 'organisation') || section(body, 'organization') || '');
  const people = bulletTerms(section(body, 'people') || '');
  const proc = bulletTerms(section(body, 'process') || '');
  const tech = bulletTerms(section(body, 'technology') || '');
  f.components = {
    organisation: org.length ? org.join(', ') : 'Architecture Team',
    people: people.length ? people : ['Architects'],
    processes: proc.length ? proc : ['Architecture governance'],
    technology: tech.length ? tech.join(', ') : 'Platform services',
  };
  if (!org.length || !people.length || !proc.length || !tech.length) {
    flags.push('components partially defaulted (missing §2.x prose)');
  }

  // maturity from §3.2 assessment table
  const matSec = section(body, 'maturity') || body;
  const mm = {};
  for (const t of parseTables(matSec)) {
    for (const r of t.rows) {
      const k = stripFmt(r[0] || '').toLowerCase();
      const v = stripFmt(r[1] || '');
      if (k.includes('current maturity')) mm.current = parseInt(v, 10);
      else if (k.includes('target maturity')) mm.target = parseInt(v, 10);
      else if (k.includes('assessment date')) mm.assessment_date = v;
      else if (k.includes('assessor')) mm.assessor = v;
    }
  }
  f.maturity = {
    current: Number.isInteger(mm.current) ? mm.current : 1,
    target: Number.isInteger(mm.target) ? mm.target : 3,
  };
  if (mm.assessment_date && /^\d{4}-\d{2}-\d{2}$/.test(mm.assessment_date)) f.maturity.assessment_date = mm.assessment_date;
  if (mm.assessor) f.maturity.assessor = mm.assessor;
  if (!Number.isInteger(mm.current) || !Number.isInteger(mm.target)) {
    flags.push('maturity defaulted (no §3.2 assessment)');
  }

  // realised_by_abbs (L3) from §4.2 ABB-mapping table or "ABB Realisation" section
  if (f.level === 'L3') {
    const abbSec = section(body, 'abb mapping') || section(body, 'abb realisation') || body;
    const abbs = idsIn(abbSec, 'ABB');
    if (abbs.length) f.realised_by_abbs = abbs;
  }
  return f;
}

function buildBoundedContext(dcMap, body, ctx, id, flags) {
  const f = {};
  const plat = firstId(dc(dcMap, 'platform') || '', 'PL');
  if (plat) f.part_of = plat;
  const ownerTeam = dc(dcMap, 'owner team', 'owner');
  if (ownerTeam) f.owner = stripFmt(ownerTeam);
  const sub = stripFmt(dc(dcMap, 'subdomain type', 'subdomain kind') || '').toLowerCase();
  if (['core', 'supporting', 'generic'].includes(sub)) f.subdomain_kind = sub;

  const contains = idsIn(section(body, 'contained abb') || '', 'ABB');
  if (contains.length) f.contains = contains;
  const caps = idsIn(section(body, 'realised capabilit') || section(body, 'realized capabilit') || '', 'CAP');
  if (caps.length) f.realises_capabilities = caps;

  // ubiquitous language: list of "- **Term**: definition" / "- **Term**. definition"
  const ulSec = section(body, 'ubiquitous language') || '';
  const ul = [];
  for (const line of ulSec.split(/\r?\n/)) {
    const m = line.match(/^\s*[-*]\s+(.*)$/);
    if (!m) continue;
    const raw = m[1];
    const tm = raw.match(/^\*\*(.+?)\*\*\s*[:.\-—]\s*(.*)$/) || raw.match(/^\*\*(.+?)\*\*\s+(.*)$/);
    if (tm) ul.push({ term: stripFmt(tm[1]), definition: stripFmt(tm[2]) });
    else {
      const cm = stripFmt(raw).match(/^(.+?)[:.\-—]\s+(.*)$/);
      if (cm) ul.push({ term: cm[1].trim(), definition: cm[2].trim() });
    }
  }
  if (ul.length) f.ubiquitous_language = ul;
  return f;
}

function buildPlatform(dcMap, body, ctx, id, flags) {
  const f = {};
  const so = dc(dcMap, 'strategic owner');
  if (so) f.strategic_owner = stripFmt(so);
  const ownerTeam = dc(dcMap, 'owner team');
  if (ownerTeam) f.owner = stripFmt(ownerTeam);

  const caps = idsIn(section(body, 'capabilit') || '', 'CAP');
  if (caps.length) f.provides_capabilities = caps;
  const bcs = idsIn(section(body, 'bounded context') || '', 'BC');
  if (bcs.length) f.contains_bounded_contexts = bcs;
  const outs = idsIn(section(body, 'strategic outcome') || section(body, 'outcome') || '', 'OC');
  if (outs.length) f.owns_outcomes = outs;
  return f;
}

function buildOutcome(dcMap, body, ctx, id, flags) {
  const f = {};
  const measure = dc(dcMap, 'measure', 'kpi');
  if (measure) f.kpi = stripFmt(measure);
  const br = section(body, 'business rationale');
  if (br && stripFmt(br)) f.business_rationale = stripFmt(br);
  if (ctx.ocToPl[id]) f.owned_by_platform = ctx.ocToPl[id];
  const caps = idsIn(section(body, 'traceability') || '', 'CAP');
  if (caps.length) f.requires_capabilities = caps;
  return f;
}

function buildUseCase(dcMap, body, ctx, id, flags) {
  const f = {};
  const actor = dc(dcMap, 'primary actor');
  if (actor) f.primary_actor = stripFmt(actor);
  const out = firstId(dc(dcMap, 'parent outcome', 'supports outcome') || '', 'OC');
  if (out) f.supports_outcome = out;
  const crit = bullets(section(body, 'success criteria') || '').map((b) => b.text).filter(Boolean);
  if (crit.length) f.success_criteria = crit;
  const abbs = idsIn(section(body, 'realisation') || section(body, 'realization') || '', 'ABB');
  if (abbs.length) f.realised_by_abbs = abbs;
  return f;
}

const BUILDERS = {
  abb: buildAbb,
  sbb: buildSbb,
  capability: buildCapability,
  'bounded-context': buildBoundedContext,
  platform: buildPlatform,
  outcome: buildOutcome,
  'use-case': buildUseCase,
};

// ---- pass 1: parse everything, build reverse indices ------------------------
const files = findIndexFiles(ROOT).sort();
const parsed = []; // { file, rel, kind, id, existing, body, dcMap }
for (const file of files) {
  const raw = fs.readFileSync(file, 'utf8');
  const rel = path.relative(process.cwd(), file);
  const kind = kindForPath(file);
  const id = path.basename(path.dirname(file));
  const { fm, body } = splitFrontmatter(raw);
  let existing = {};
  if (fm) {
    try { existing = yaml.load(fm, { schema: yaml.JSON_SCHEMA }) || {}; } catch { existing = {}; }
  }
  parsed.push({ file, rel, raw, kind, id, existing, body, dcMap: docControl(body) });
}

const ctx = { abbToBc: {}, ocToPl: {}, abbToCaps: {} };
for (const p of parsed) {
  if (p.kind === 'bounded-context') {
    for (const abb of idsIn(section(p.body, 'contained abb') || '', 'ABB')) {
      if (!ctx.abbToBc[abb]) ctx.abbToBc[abb] = p.id;
    }
  } else if (p.kind === 'platform') {
    for (const oc of idsIn(section(p.body, 'strategic outcome') || section(p.body, 'outcome') || '', 'OC')) {
      if (!ctx.ocToPl[oc]) ctx.ocToPl[oc] = p.id;
    }
  } else if (p.kind === 'capability') {
    // Reverse map: ABB -> capabilities that name it as their `primary` realiser,
    // read from the §4.2 ABB-mapping table. Used to recover realises_capabilities
    // for ABBs whose own Document Control omits the capability link.
    const abbSec = section(p.body, 'abb mapping') || section(p.body, 'abb realisation') || '';
    for (const t of parseTables(abbSec)) {
      const ai = t.headers.findIndex((h) => /abb id|abb/i.test(stripFmt(h)));
      const ri = t.headers.findIndex((h) => /relationship/i.test(stripFmt(h)));
      if (ai < 0 || ri < 0) continue;
      for (const r of t.rows) {
        const abb = firstId(r[ai] || '', 'ABB');
        if (!abb) continue;
        if (!/primary/i.test(stripFmt(r[ri] || ''))) continue;
        (ctx.abbToCaps[abb] ||= []);
        if (!ctx.abbToCaps[abb].includes(p.id)) ctx.abbToCaps[abb].push(p.id);
      }
    }
  }
}

// ---- pass 2: migrate --------------------------------------------------------
const ENVELOPE_ORDER = ['id', 'kind', 'version', 'status', 'created', 'last_modified', 'owner', 'governance_zone'];

function migrate(p) {
  if (!p.kind) return { file: p.rel, status: 'skipped', reason: 'no kind for path' };
  const prefix = KIND_PREFIX[p.kind];
  if (prefix && !new RegExp(`^${prefix}-\\d{3}$`).test(p.id)) {
    return { file: p.rel, status: 'skipped', reason: `folder '${p.id}' is not a ${prefix}-NNN id` };
  }
  if (typeof p.existing !== 'object' || Array.isArray(p.existing)) {
    return { file: p.rel, status: 'error', reason: 'frontmatter is not a mapping' };
  }

  const flags = [];
  // Envelope defaults.
  const envelope = {
    id: p.id,
    kind: p.kind,
    version: '0.1.0',
    status: 'draft',
    created: TODAY,
    last_modified: TODAY,
    owner: OWNER,
    governance_zone: 'foundation',
  };
  // Per-kind extracted fields.
  const perKind = BUILDERS[p.kind](p.dcMap, p.body, ctx, p.id, flags);

  // Merge: envelope first (canonical order), then per-kind, skipping anything
  // already present in the existing frontmatter.
  const additions = {};
  const added = [];
  const consider = (obj, order) => {
    const keys = order || Object.keys(obj);
    for (const k of keys) {
      if (!(k in obj)) continue;
      if (Object.prototype.hasOwnProperty.call(p.existing, k)) continue;
      if (obj[k] == null) continue;
      additions[k] = obj[k];
      added.push(k);
    }
  };
  consider(envelope, ENVELOPE_ORDER);
  consider(perKind);

  if (added.length === 0) {
    return { file: p.rel, status: 'unchanged', added: [], flags };
  }

  // Emit the additions as YAML and append to the existing frontmatter block.
  const { fm } = splitFrontmatter(p.raw);
  const dumped = yaml.dump(additions, { lineWidth: -1, noRefs: true, quotingType: '"', forceQuotes: false }).trimEnd();
  const fmBlock = [fm && fm.trim() ? fm.trimEnd() : '', dumped].filter(Boolean).join('\n');
  const { body } = splitFrontmatter(p.raw);
  const bodyContent = body.replace(/^(\r?\n)+/, '');
  const next = `---\n${fmBlock}\n---\n\n${bodyContent}\n`;

  if (!DRY_RUN) fs.writeFileSync(p.file, next);
  return { file: p.rel, status: DRY_RUN ? 'would-update' : 'updated', added, flags };
}

const results = parsed.map(migrate);

const counts = {};
for (const r of results) counts[r.status] = (counts[r.status] || 0) + 1;

for (const r of results) {
  if (r.status === 'updated' || r.status === 'would-update') {
    console.log(`  ${r.status}: ${r.file}  (+${r.added.join(', ')})`);
    for (const fl of r.flags || []) console.log(`      · ${fl}`);
  } else if (r.status === 'skipped' || r.status === 'error') {
    console.log(`  ${r.status}: ${r.file}  — ${r.reason}`);
  }
}

console.log('');
console.log(`migrate-frontmatter: ${files.length} index.md under ${path.relative(process.cwd(), ROOT) || '.'}`);
console.log(`  date=${TODAY} owner=${OWNER}${DRY_RUN ? '  [DRY RUN]' : ''}`);
console.log('  ' + Object.entries(counts).map(([k, v]) => `${k}=${v}`).join('  '));

if (counts.error) process.exit(1);
