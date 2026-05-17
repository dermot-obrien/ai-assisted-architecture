#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0
// Part of the ai-assisted-architecture framework: https://github.com/dermot-obrien/ai-assisted-architecture

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const DATA_EXTENSIONS = new Set(['.yaml', '.yml', '.json']);
const SKIP_DIRS = new Set([
  'node_modules',
  'build',
  'dist',
  '.next',
  '.turbo',
  '.cache',
  '.venv',
  'venv',
  '__pycache__',
]);

const CROSS_PLATFORM_TYPES = [
  'driver',
  'pattern',
  'standard',
  'risk',
  'control',
  'stakeholder',
  'viewpoint',
  'view',
  'decision',
  'industry_reference_domain',
];

function usage(exitCode) {
  const msg = [
    'Usage: node namespace-divergent.cjs <root> [options]',
    '',
    'For cross-platform entity types (Driver, Pattern, Standard, Risk, Control,',
    'Stakeholder, Viewpoint, View, Decision, IndustryReferenceDomain), find IDs that',
    'appear in more than one ontology document. Rename each occurrence to include',
    'the file\'s platform code so each platform owns a distinct entity rather than',
    'colliding on a shared ID.',
    '',
    'Example: stake_board appearing in P022\'s file and P008\'s file becomes',
    '  stake_P022_board in P022\'s file',
    '  stake_P008_board in P008\'s file',
    'and every cross-reference within each file is updated alongside the rename.',
    '',
    'Singletons (IDs that appear in only one file) are left unchanged.',
    'IDs already containing _P###_ are left unchanged (idempotent).',
    '',
    'Arguments:',
    '  root             Path to a folder to walk.',
    '',
    'Options:',
    '  --dry-run        Show planned renames without writing.',
    '  --quiet          Suppress progress output (errors still printed).',
    '  -h, --help       Show this help.',
    '',
    'Exit codes:',
    '  0  finished (or dry-run completed) successfully',
    '  2  invocation or I/O error',
  ].join('\n');
  const stream = exitCode === 0 ? process.stdout : process.stderr;
  stream.write(msg + '\n');
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = { root: null, dryRun: false, quiet: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') {
      args.dryRun = true;
    } else if (a === '--quiet') {
      args.quiet = true;
    } else if (a === '-h' || a === '--help') {
      usage(0);
    } else if (a.startsWith('--')) {
      process.stderr.write(`Unknown option: ${a}\n`);
      usage(2);
    } else if (!args.root) {
      args.root = path.resolve(a);
    } else {
      process.stderr.write(`Unexpected positional argument: ${a}\n`);
      usage(2);
    }
  }
  if (!args.root) usage(2);
  return args;
}

function walkForCandidates(root) {
  const results = [];
  const stat = fs.statSync(root);
  if (stat.isFile()) {
    results.push(root);
    return results;
  }
  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
      return;
    }
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (SKIP_DIRS.has(e.name)) continue;
        if (e.name.startsWith('.')) continue;
        walk(full);
      } else if (e.isFile()) {
        const ext = path.extname(e.name).toLowerCase();
        if (DATA_EXTENSIONS.has(ext)) results.push(full);
      }
    }
  }
  walk(root);
  return results;
}

function loadDocument(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.yaml' || ext === '.yml') {
    return yaml.load(raw, { schema: yaml.JSON_SCHEMA, filename: filePath });
  }
  if (ext === '.json') {
    return JSON.parse(raw);
  }
  throw new Error(`Unsupported file extension '${ext}'.`);
}

function looksLikeOntologyDoc(doc) {
  return doc && typeof doc === 'object' && doc.ontology_id === 'modernisation-ontology';
}

function relative(from, to) {
  const rel = path.relative(from, to);
  return rel.length === 0 ? to : rel;
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function deriveNamespacedId(oldId, platformCode) {
  if (/_P\d{3}_/.test(oldId)) return null;
  const underscoreIdx = oldId.indexOf('_');
  if (underscoreIdx === -1) {
    return `${platformCode}_${oldId}`;
  }
  const prefix = oldId.slice(0, underscoreIdx);
  const rest = oldId.slice(underscoreIdx + 1);
  return `${prefix}_${platformCode}_${rest}`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  let rootStat;
  try {
    rootStat = fs.statSync(args.root);
  } catch (e) {
    process.stderr.write(`Root not found: ${args.root}\n`);
    process.exit(2);
  }
  const baseDir = rootStat.isDirectory() ? args.root : path.dirname(args.root);

  const candidates = walkForCandidates(args.root);
  const docs = [];
  for (const file of candidates) {
    let doc;
    try {
      doc = loadDocument(file);
    } catch (e) {
      process.stderr.write(`PARSE  ${relative(baseDir, file)}  ${e.message}\n`);
      process.exit(2);
    }
    if (looksLikeOntologyDoc(doc)) docs.push({ path: file, doc });
  }

  if (!args.quiet) {
    process.stderr.write(`Scanning ${docs.length} ontology document(s).\n`);
  }

  const occurrences = new Map();
  for (const type of CROSS_PLATFORM_TYPES) {
    for (const { path: filePath, doc } of docs) {
      const platforms = Array.isArray(doc.platform) ? doc.platform : [];
      const platformCode = platforms[0] && platforms[0].id;
      if (!platformCode || !/^P\d{3}$/.test(platformCode)) continue;
      const arr = Array.isArray(doc[type]) ? doc[type] : [];
      for (const entity of arr) {
        if (!entity || typeof entity.id !== 'string') continue;
        const key = `${type}|${entity.id}`;
        if (!occurrences.has(key)) occurrences.set(key, []);
        occurrences.get(key).push({ type, id: entity.id, filePath, platformCode });
      }
    }
  }

  const renamesPerFile = new Map();
  let totalRenames = 0;
  for (const [, instances] of occurrences) {
    if (instances.length < 2) continue;
    for (const inst of instances) {
      const newId = deriveNamespacedId(inst.id, inst.platformCode);
      if (!newId || newId === inst.id) continue;
      if (!renamesPerFile.has(inst.filePath)) renamesPerFile.set(inst.filePath, new Map());
      const fileRenames = renamesPerFile.get(inst.filePath);
      if (!fileRenames.has(inst.id)) {
        fileRenames.set(inst.id, newId);
        totalRenames++;
      }
    }
  }

  if (renamesPerFile.size === 0) {
    if (!args.quiet) process.stderr.write('No divergent cross-platform IDs to namespace.\n');
    process.exit(0);
  }

  if (args.dryRun) {
    process.stdout.write(`DRY  would rename ${totalRenames} id(s) across ${renamesPerFile.size} file(s):\n`);
    for (const [filePath, renames] of renamesPerFile) {
      process.stdout.write(`  ${relative(baseDir, filePath)}\n`);
      for (const [oldId, newId] of renames) {
        process.stdout.write(`    ${oldId}  ->  ${newId}\n`);
      }
    }
    process.exit(0);
  }

  for (const [filePath, renames] of renamesPerFile) {
    let text = fs.readFileSync(filePath, 'utf8');
    const sortedOld = [...renames.keys()].sort((a, b) => b.length - a.length);
    for (const oldId of sortedOld) {
      const newId = renames.get(oldId);
      const re = new RegExp(`\\b${escapeRegex(oldId)}\\b`, 'g');
      text = text.replace(re, newId);
    }
    fs.writeFileSync(filePath, text, 'utf8');
    if (!args.quiet) {
      process.stdout.write(`RENAMED  ${relative(baseDir, filePath)}  ${renames.size} id(s)\n`);
    }
  }

  if (!args.quiet) {
    process.stderr.write(`\nSummary: renamed ${totalRenames} id(s) across ${renamesPerFile.size} file(s).\n`);
  }
  process.exit(0);
}

main();
