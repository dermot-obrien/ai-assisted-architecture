#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0
// Part of the ai-assisted-architecture framework: https://github.com/dermot-obrien/ai-assisted-architecture

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv2020 = require('ajv/dist/2020');
const addFormats = require('ajv-formats');

const FRAMEWORK_SCHEMA = path.resolve(
  __dirname,
  '..',
  '..',
  'standards',
  'ontology',
  'ontology-schema.json'
);

/**
 * Resolve the effective schema path. Priority:
 *   1. Explicit --schema argument (handled by caller)
 *   2. ontology.schema from .aaa-config.yaml in the workspace root
 *   3. ontology.schema from .aaw-config.yaml (legacy compatibility)
 *   4. Framework default (ontology-schema.json in this package)
 */
function schemaFromConfig(configPath, baseDir) {
  try {
    const config = yaml.load(fs.readFileSync(configPath, 'utf8'), { schema: yaml.JSON_SCHEMA });
    const configured =
      (config && config.ontology && config.ontology.schema) ||
      (config && config.modules && config.modules.aaa && config.modules.aaa.ontology_schema);
    if (!configured) return null;
    const resolved = path.resolve(baseDir, configured);
    return fs.existsSync(resolved) ? resolved : null;
  } catch (_) {
    return null;
  }
}

function resolveDefaultSchema() {
  // Walk up from cwd looking for workspace config files.
  let dir = process.cwd();
  const root = path.parse(dir).root;
  while (dir !== root) {
    const aaaConfigPath = path.join(dir, '.aaa-config.yaml');
    if (fs.existsSync(aaaConfigPath)) {
      const resolved = schemaFromConfig(aaaConfigPath, dir);
      if (resolved) return resolved;
    }

    const aawConfigPath = path.join(dir, '.aaw-config.yaml');
    if (fs.existsSync(aawConfigPath)) {
      const resolved = schemaFromConfig(aawConfigPath, dir);
      if (resolved) return resolved;
      if (fs.existsSync(aaaConfigPath)) {
        // A workspace config exists, but without a schema path; use bundled default.
        break;
      }
    }
    dir = path.dirname(dir);
  }
  return FRAMEWORK_SCHEMA;
}

const DEFAULT_SCHEMA = resolveDefaultSchema();

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

function usage(exitCode) {
  const msg = [
    'Usage: node validate.cjs <root> [--schema <path>] [--quiet] [--verbose]',
    '',
    'Walks the root folder recursively, finds YAML and JSON files that look like',
    'modernisation-ontology documents (top-level ontology_id = "modernisation-ontology"),',
    'and validates each against the schema.',
    '',
    'Arguments:',
    '  root               Path to a folder to walk, or a single file to validate.',
    '',
    'Options:',
    '  --schema <path>    Path to a JSON Schema file. Defaults to the modernisation',
    '                     ontology schema next to this script.',
    '  --quiet            Suppress per-file OK output; only print failures and summary.',
    '  --verbose          Also print files that were skipped (not ontology documents).',
    '  -h, --help         Show this help.',
    '',
    'Exit codes:',
    '  0  all ontology documents in the tree conform to the schema',
    '  1  at least one document does not conform',
    '  2  invocation / I/O error (e.g., root not found, schema parse failure)',
  ].join('\n');
  const stream = exitCode === 0 ? process.stdout : process.stderr;
  stream.write(msg + '\n');
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = { schema: DEFAULT_SCHEMA, root: null, quiet: false, verbose: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--schema') {
      const next = argv[++i];
      if (!next) usage(2);
      args.schema = path.resolve(next);
    } else if (a === '--quiet') {
      args.quiet = true;
    } else if (a === '--verbose') {
      args.verbose = true;
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

function formatError(err) {
  const where = err.instancePath && err.instancePath.length > 0 ? err.instancePath : '<root>';
  const params = err.params && Object.keys(err.params).length > 0 ? ' ' + JSON.stringify(err.params) : '';
  return `  ${where}  ${err.message}${params}`;
}

function relative(from, to) {
  const rel = path.relative(from, to);
  return rel.length === 0 ? to : rel;
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

  let schema;
  try {
    schema = JSON.parse(fs.readFileSync(args.schema, 'utf8'));
  } catch (e) {
    process.stderr.write(`Failed to load schema '${args.schema}': ${e.message}\n`);
    process.exit(2);
  }

  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);

  let validate;
  try {
    validate = ajv.compile(schema);
  } catch (e) {
    process.stderr.write(`Failed to compile schema: ${e.message}\n`);
    process.exit(2);
  }

  const candidates = walkForCandidates(args.root);
  const baseDir = rootStat.isDirectory() ? args.root : path.dirname(args.root);
  const schemaLabel = `${path.basename(args.schema)}${schema.version ? ' v' + schema.version : ''}`;

  let validated = 0;
  let skipped = 0;
  let failed = 0;
  const skippedPaths = [];

  for (const file of candidates) {
    let doc;
    try {
      doc = loadDocument(file);
    } catch (e) {
      process.stderr.write(`PARSE  ${relative(baseDir, file)}  ${e.message}\n`);
      failed++;
      continue;
    }
    if (!looksLikeOntologyDoc(doc)) {
      skipped++;
      skippedPaths.push(file);
      continue;
    }
    const ok = validate(doc);
    if (ok) {
      validated++;
      if (!args.quiet) {
        process.stdout.write(`OK    ${relative(baseDir, file)}\n`);
      }
    } else {
      failed++;
      process.stderr.write(`FAIL  ${relative(baseDir, file)}  ${validate.errors.length} error(s)\n`);
      for (const err of validate.errors) {
        process.stderr.write(formatError(err) + '\n');
      }
    }
  }

  if (args.verbose) {
    for (const p of skippedPaths) {
      process.stdout.write(`SKIP  ${relative(baseDir, p)}  (not an ontology document)\n`);
    }
  }

  const summary = `Summary: ${validated} validated, ${skipped} skipped, ${failed} failed  (schema ${schemaLabel})`;
  const stream = failed > 0 ? process.stderr : process.stdout;
  stream.write(summary + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

main();
