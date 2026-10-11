#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0

/**
 * Write each skill's own copy of the standards it reads, from skill-standards.json.
 *
 * A skill installed on its own, with no framework clone beside it, still needs the
 * standards its method follows. So each skill carries a copy in references/standards/,
 * and this script writes those copies from the framework's standards/ so they cannot
 * drift: CI runs it with --check.
 *
 * The manifest, skill-standards.json at the repository root, maps each skill to a list:
 *   - "standards/<path>"   copied to skills/<skill>/references/standards/<path>
 *   - "standards/<dir>/"   every file under that folder, the same way
 *   - { "from": "<repo path>", "to": "<path inside the skill>" }   a file outside standards/
 *
 * Markdown files are rewritten as they are copied; every other file is copied byte for byte.
 *   - An image a copied file embeds (![..](x) or <img src="x">) is copied too.
 *   - A relative link whose target is in the skill's copy is pointed at the copy.
 *   - Any other relative link is rewritten to the file on GitHub, so it still works.
 * Links inside fenced code blocks and inline code are left alone: they are templates.
 *
 * Usage:
 *   node scripts/sync-skill-standards.mjs           write the copies, removing stale ones
 *   node scripts/sync-skill-standards.mjs --check   exit 1 if any copy differs, is missing or is stale
 *
 * Run from anywhere; paths resolve against the repository root, one level above this script.
 * Zero dependencies on purpose, like validate-skills.mjs.
 */

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const MANIFEST = "skill-standards.json";
const REPO_URL = "https://github.com/dermot-obrien/ai-assisted-architecture";
const COPY_DIR = "references/standards";
const IMAGE = /\.(png|svg|jpe?g|gif|webp)$/i;

const args = process.argv.slice(2);
if (args.some((a) => a === "-h" || a === "--help")) {
  console.log(`usage: node scripts/sync-skill-standards.mjs [--check]

Write skills/<skill>/references/standards/ from standards/, as ${MANIFEST} lists.

  --check      Write nothing; exit 1 if any copy differs from what would be written
  -h, --help   Show this help`);
  process.exit(0);
}
const unknown = args.filter((a) => a !== "--check");
if (unknown.length) {
  console.error(`unknown argument: ${unknown.join(" ")} (see --help)`);
  process.exit(2);
}
const CHECK = args.includes("--check");

// Repository paths are always posix, whatever the platform.
const posix = path.posix;
const abs = (rel) => path.join(ROOT, ...rel.split("/"));
const isFile = (rel) => existsSync(abs(rel)) && statSync(abs(rel)).isFile();
const isDir = (rel) => existsSync(abs(rel)) && statSync(abs(rel)).isDirectory();

function walk(rel) {
  const out = [];
  for (const e of readdirSync(abs(rel), { withFileTypes: true })) {
    const child = posix.join(rel, e.name);
    if (e.isDirectory()) out.push(...walk(child));
    else if (e.isFile()) out.push(child);
  }
  return out.sort();
}

// --- The plan: for each skill, every source file and where it lands -------------------

/** Map of repo source path to path inside the skill, for one skill's manifest entries. */
function expand(skill, entries) {
  const files = new Map();
  const add = (from, to) => {
    if (!isFile(from)) throw new Error(`${skill}: ${from} is not a file`);
    files.set(from, to);
  };
  const intoCopy = (from) => {
    if (!from.startsWith("standards/")) throw new Error(`${skill}: ${from} is outside standards/; give it as {from, to}`);
    return posix.join(COPY_DIR, from.slice("standards/".length));
  };
  for (const entry of entries) {
    if (typeof entry === "string" && entry.endsWith("/")) {
      const dir = entry.slice(0, -1);
      if (!isDir(dir)) throw new Error(`${skill}: ${entry} is not a folder`);
      for (const f of walk(dir)) add(f, intoCopy(f));
    } else if (typeof entry === "string") {
      add(entry, intoCopy(entry));
    } else if (entry && typeof entry.from === "string" && typeof entry.to === "string") {
      add(entry.from, entry.to);
    } else {
      throw new Error(`${skill}: entry ${JSON.stringify(entry)} is neither a path nor {from, to}`);
    }
  }
  // Images the Markdown embeds come along. They are not Markdown, so this needs one pass.
  for (const [from] of [...files]) {
    if (!from.endsWith(".md")) continue;
    for (const link of links(readFileSync(abs(from), "utf8"))) {
      if (!link.image) continue;
      const target = resolveLink(from, link.target);
      if (target && isFile(target.path) && !files.has(target.path) && target.path.startsWith("standards/")) {
        files.set(target.path, intoCopy(target.path));
      }
    }
  }
  return files;
}

// --- Links --------------------------------------------------------------------------

const INLINE = /(!?)\[((?:[^\[\]]|\[[^\]]*\])*)\]\(\s*(<[^>]*>|[^)\s]+)((?:\s+"[^"]*")?\s*)\)/g;
const HTML = /(<(?:img|a|source)\b[^>]*?\s)(src|href)="([^"]+)"/gi;
const DEFINITION = /^(\s{0,3}\[[^\]]+\]:\s*)(<[^>]*>|\S+)(.*)$/;

/** The [start, end) ranges of a line's code spans, so links in code are never touched. */
function codeSpans(line) {
  return [...line.matchAll(/(`+)[\s\S]*?\1/g)].map((m) => [m.index, m.index + m[0].length]);
}

/** Apply fn to every link outside code. fn(target, image) returns the new target or null. */
function mapLinks(text, fn) {
  let fence = null;
  return text
    .split("\n")
    .map((line) => {
      const f = /^\s{0,3}(`{3,}|~{3,})/.exec(line);
      if (f) {
        if (!fence) fence = f[1];
        else if (f[1][0] === fence[0] && f[1].length >= fence.length && /^\s*(`+|~+)\s*$/.test(line)) fence = null;
        return line;
      }
      if (fence) return line;
      const d = DEFINITION.exec(line);
      if (d) {
        const t = fn(unwrap(d[2]), false);
        return t === null ? line : d[1] + t + d[3];
      }
      // A link label may hold inline code; a link that starts inside code is not a link.
      const inCode = (text, i) => codeSpans(text).some(([a, b]) => i >= a && i < b);
      return line
        .replace(INLINE, (all, bang, label, target, title, at, text) => {
          if (inCode(text, at)) return all;
          const t = fn(unwrap(target), bang === "!");
          return t === null ? all : `${bang}[${label}](${t}${title})`;
        })
        .replace(HTML, (all, head, attr, target, at, text) => {
          if (inCode(text, at)) return all;
          const t = fn(target, /^<img|^<source/i.test(head));
          return t === null ? all : `${head}${attr}="${t}"`;
        });
    })
    .join("\n");
}

const unwrap = (t) => (t.startsWith("<") && t.endsWith(">") ? t.slice(1, -1) : t);

function links(text) {
  const out = [];
  mapLinks(text, (target, image) => {
    out.push({ target, image });
    return null;
  });
  return out;
}

const isRelative = (t) => t && !/^[a-z][a-z0-9+.-]*:/i.test(t) && !t.startsWith("#") && !t.startsWith("/");

/** The repository path a relative link from file `from` points at, with its fragment. */
function resolveLink(from, target) {
  if (!isRelative(target)) return null;
  const hash = target.indexOf("#");
  const raw = hash === -1 ? target : target.slice(0, hash);
  const fragment = hash === -1 ? "" : target.slice(hash);
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    /* keep it as written */
  }
  const joined = posix.normalize(posix.join(posix.dirname(from), decoded));
  return { path: joined.replace(/\/$/, ""), raw: decoded, dir: raw.endsWith("/"), fragment };
}

/** Rewrite one copied Markdown file's relative links for where it lands in the skill. */
function rewrite(from, to, text, files, warnings) {
  const landed = new Map([...files].map(([src, dest]) => [src, dest]));
  const dirs = new Set();
  for (const [src] of landed) for (let d = posix.dirname(src); d !== "."; d = posix.dirname(d)) dirs.add(d);
  return mapLinks(text, (target) => {
    const r = resolveLink(from, target);
    if (!r) return null;
    // A target in the copy keeps its link as written when the layout leaves it where it was.
    const same = (rel) => posix.normalize(rel) === posix.normalize(r.raw).replace(/\/$/, "");
    if (landed.has(r.path)) {
      const rel = posix.relative(posix.dirname(to), landed.get(r.path)) || posix.basename(to);
      return same(rel) ? null : rel + r.fragment;
    }
    if (dirs.has(r.path) && r.path.startsWith("standards/")) {
      const rel = posix.relative(posix.dirname(to), posix.join(COPY_DIR, r.path.slice("standards/".length))) || ".";
      return same(rel) ? null : rel + "/" + r.fragment;
    }
    if (r.path.startsWith("..")) {
      warnings.push(`${from}: ${target} leaves the repository; left as written`);
      return null;
    }
    const exists = existsSync(abs(r.path));
    if (!exists) warnings.push(`${from}: ${target} does not exist in the repository; linked to GitHub anyway`);
    const kind = (exists && isDir(r.path)) || (!exists && r.dir) ? "tree" : "blob";
    return `${REPO_URL}/${kind}/main/${r.path}${r.dir ? "/" : ""}${r.fragment}`;
  });
}

/** Remove folders left empty once stale copies are gone. */
function prune(rel) {
  for (const e of readdirSync(abs(rel), { withFileTypes: true })) if (e.isDirectory()) prune(posix.join(rel, e.name));
  if (readdirSync(abs(rel)).length === 0) rmSync(abs(rel), { recursive: true });
}

// --- Run ----------------------------------------------------------------------------

let manifest;
try {
  manifest = JSON.parse(readFileSync(abs(MANIFEST), "utf8"));
} catch (e) {
  console.error(`cannot read ${MANIFEST}: ${e.message}`);
  process.exit(2);
}

const problems = [];
const warnings = [];
let written = 0;

try {
  for (const [skill, entries] of Object.entries(manifest.skills ?? {})) {
    const skillDir = `skills/${skill}`;
    if (!isFile(`${skillDir}/SKILL.md`)) throw new Error(`${skill}: no ${skillDir}/SKILL.md`);
    const files = expand(skill, entries);

    const expected = new Map();
    for (const [from, to] of files) {
      const bytes = readFileSync(abs(from));
      expected.set(posix.join(skillDir, to), {
        from,
        bytes: from.endsWith(".md") ? Buffer.from(rewrite(from, to, bytes.toString("utf8"), files, warnings), "utf8") : bytes,
      });
    }

    for (const [dest, { from, bytes }] of expected) {
      const current = isFile(dest) ? readFileSync(abs(dest)) : null;
      if (current && current.equals(bytes)) continue;
      if (CHECK) problems.push(`${dest} ${current ? "differs from" : "is missing, copied from"} ${from}`);
      else {
        mkdirSync(path.dirname(abs(dest)), { recursive: true });
        writeFileSync(abs(dest), bytes);
        written++;
      }
    }

    // Anything else under references/standards/ is a copy the manifest no longer lists.
    const copyRoot = posix.join(skillDir, COPY_DIR);
    if (isDir(copyRoot)) {
      for (const f of walk(copyRoot)) {
        if (expected.has(f)) continue;
        if (CHECK) problems.push(`${f} is not in ${MANIFEST}; remove it or list its source`);
        else {
          rmSync(abs(f));
          written++;
        }
      }
      if (!CHECK) prune(copyRoot);
    }
  }
} catch (e) {
  console.error(e.message);
  process.exit(2);
}

if (!CHECK) for (const w of [...new Set(warnings)]) console.warn(`warning: ${w}`);

if (problems.length) {
  for (const p of problems) console.error(p);
  console.error(`\n${problems.length} standards cop${problems.length === 1 ? "y is" : "ies are"} out of date. Run: node scripts/sync-skill-standards.mjs`);
  process.exit(1);
}
console.log(CHECK ? "skill standards copies are up to date" : `skill standards copies written (${written} file${written === 1 ? "" : "s"} changed)`);
