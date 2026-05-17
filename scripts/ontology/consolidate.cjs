#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0
// Part of the ai-assisted-architecture framework: https://github.com/dermot-obrien/ai-assisted-architecture

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv2020 = require('ajv/dist/2020');
const addFormats = require('ajv-formats');

const DEFAULT_SCHEMA = path.resolve(
  __dirname,
  '..',
  '..',
  'standards',
  'ontology',
  'ontology-schema.json'
);

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
    'Usage: node consolidate.cjs <root> [options]',
    '',
    'Walks the root folder, finds ontology documents (top-level',
    'ontology_id = "modernisation-ontology"), and merges their top-level',
    'entity arrays into a single aggregate document of the same shape.',
    '',
    'Arguments:',
    '  root                Path to a folder to walk. Required.',
    '',
    'Options:',
    '  --schema <path>     Path to a JSON Schema for validation. Defaults to the',
    '                      modernisation ontology schema in the ontology folder.',
    '  --output <path>     Write the aggregate to this file. Default: stdout.',
    '                      The file extension determines format unless --format is given.',
    '  --format yaml|json  Output format. Default: yaml (matches input convention).',
    '                      Ignored when --output specifies a file extension.',
    '  --validate          Validate the aggregate against the schema before writing.',
    '                      Non-zero exit if validation fails.',
    '  --on-collision <mode>  How to handle duplicate IDs across files.',
    '                         "error" (default) abort and report.',
    '                         "first-wins" keep the first occurrence, warn on others.',
    '                         "last-wins" keep the last occurrence, warn on earlier.',
    '  --annotate-source   Append the source filename to each entity\'s notes field',
    '                      so provenance is preserved in the aggregate.',
    '  --quiet             Suppress progress output (still prints errors).',
    '  -h, --help          Show this help.',
    '',
    'Exit codes:',
    '  0  aggregate produced (and validated, if --validate was used)',
    '  1  collision detected with --on-collision=error',
    '  2  invocation / I/O error, parse failure, or validation failure',
  ].join('\n');
  const stream = exitCode === 0 ? process.stdout : process.stderr;
  stream.write(msg + '\n');
  process.exit(exitCode);
}

function parseArgs(argv) {
  const args = {
    schema: DEFAULT_SCHEMA,
    root: null,
    output: null,
    format: null,
    validate: false,
    onCollision: 'error',
    annotateSource: false,
    quiet: false,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--schema') {
      const next = argv[++i];
      if (!next) usage(2);
      args.schema = path.resolve(next);
    } else if (a === '--output') {
      const next = argv[++i];
      if (!next) usage(2);
      args.output = path.resolve(next);
    } else if (a === '--format') {
      const next = argv[++i];
      if (!next || !['yaml', 'json'].includes(next.toLowerCase())) usage(2);
      args.format = next.toLowerCase();
    } else if (a === '--validate') {
      args.validate = true;
    } else if (a === '--on-collision') {
      const next = argv[++i];
      if (!['error', 'first-wins', 'last-wins'].includes(next)) usage(2);
      args.onCollision = next;
    } else if (a === '--annotate-source') {
      args.annotateSource = true;
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

function discoverEntityArrayKeys(schema) {
  if (!schema || !schema.properties) return [];
  return Object.entries(schema.properties)
    .filter(([_, def]) => def && def.type === 'array')
    .map(([key]) => key);
}

function detectFormat(args) {
  if (args.format) return args.format;
  if (args.output) {
    const ext = path.extname(args.output).toLowerCase();
    if (ext === '.json') return 'json';
    if (ext === '.yaml' || ext === '.yml') return 'yaml';
  }
  return 'yaml';
}

function serialise(aggregate, format) {
  if (format === 'json') {
    return JSON.stringify(aggregate, null, 2) + '\n';
  }
  return yaml.dump(aggregate, { lineWidth: 120, noRefs: true, sortKeys: false });
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

  const entityKeys = discoverEntityArrayKeys(schema);
  if (entityKeys.length === 0) {
    process.stderr.write(`Schema has no top-level array properties to consolidate.\n`);
    process.exit(2);
  }

  const candidates = walkForCandidates(args.root);
  const baseDir = rootStat.isDirectory() ? args.root : path.dirname(args.root);

  const aggregate = {
    version: schema.properties && schema.properties.version && schema.properties.version.const
      ? schema.properties.version.const
      : '1.1.0',
    ontology_id: 'modernisation-ontology',
  };
  for (const key of entityKeys) aggregate[key] = [];

  const seenIds = new Map();
  for (const key of entityKeys) seenIds.set(key, new Map());

  let merged = 0;
  let skipped = 0;
  let collisions = 0;

  for (const file of candidates) {
    let doc;
    try {
      doc = loadDocument(file);
    } catch (e) {
      process.stderr.write(`PARSE  ${relative(baseDir, file)}  ${e.message}\n`);
      process.exit(2);
    }
    if (!looksLikeOntologyDoc(doc)) {
      skipped++;
      continue;
    }
    if (!args.quiet) {
      process.stderr.write(`MERGE  ${relative(baseDir, file)}\n`);
    }
    for (const key of entityKeys) {
      const items = Array.isArray(doc[key]) ? doc[key] : [];
      for (const item of items) {
        const id = item && item.id;
        if (id) {
          const existing = seenIds.get(key).get(id);
          if (existing) {
            collisions++;
            const msg = `COLLISION  ${key}.id='${id}'  first seen in ${relative(baseDir, existing.file)}, also in ${relative(baseDir, file)}`;
            if (args.onCollision === 'error') {
              process.stderr.write(msg + '\n');
              continue;
            }
            if (args.onCollision === 'first-wins') {
              process.stderr.write(`SKIP  ${msg}  (first-wins)\n`);
              continue;
            }
            if (args.onCollision === 'last-wins') {
              const idx = aggregate[key].findIndex((x) => x && x.id === id);
              if (idx >= 0) aggregate[key].splice(idx, 1);
              process.stderr.write(`REPLACE  ${msg}  (last-wins)\n`);
            }
          }
          seenIds.get(key).set(id, { file });
        }
        const toAdd = args.annotateSource
          ? annotateNotes(item, relative(baseDir, file))
          : item;
        aggregate[key].push(toAdd);
      }
    }
    merged++;
  }

  if (collisions > 0 && args.onCollision === 'error') {
    process.stderr.write(`Aggregate not produced: ${collisions} collision(s). Re-run with --on-collision first-wins or --on-collision last-wins to override.\n`);
    process.exit(1);
  }

  if (args.validate) {
    const ajv = new Ajv2020({ allErrors: true, strict: false });
    addFormats(ajv);
    let validate;
    try {
      validate = ajv.compile(schema);
    } catch (e) {
      process.stderr.write(`Failed to compile schema for validation: ${e.message}\n`);
      process.exit(2);
    }
    const ok = validate(aggregate);
    if (!ok) {
      process.stderr.write(`Aggregate failed schema validation: ${validate.errors.length} error(s)\n`);
      for (const err of validate.errors) {
        const where = err.instancePath && err.instancePath.length > 0 ? err.instancePath : '<root>';
        const params = err.params && Object.keys(err.params).length > 0 ? ' ' + JSON.stringify(err.params) : '';
        process.stderr.write(`  ${where}  ${err.message}${params}\n`);
      }
      process.exit(2);
    }
    if (!args.quiet) {
      process.stderr.write(`VALIDATED  aggregate conforms to schema v${schema.version || 'unknown'}\n`);
    }
  }

  const format = detectFormat(args);
  const text = serialise(aggregate, format);
  if (args.output) {
    fs.writeFileSync(args.output, text, 'utf8');
    if (!args.quiet) {
      process.stderr.write(`WRITTEN  ${args.output}  (${format}, ${text.length} bytes)\n`);
    }
  } else {
    process.stdout.write(text);
  }

  if (!args.quiet) {
    const counts = entityKeys.map((k) => `${k}=${aggregate[k].length}`).join(', ');
    process.stderr.write(`Summary: merged ${merged} document(s), skipped ${skipped}, entities { ${counts} }\n`);
  }

  process.exit(0);
}

function annotateNotes(item, sourceRelPath) {
  if (!item || typeof item !== 'object') return item;
  const tag = `[source: ${sourceRelPath}]`;
  if (item.notes && typeof item.notes === 'string' && !item.notes.includes(tag)) {
    return { ...item, notes: `${item.notes} ${tag}` };
  }
  return { ...item, notes: tag };
}

main();
