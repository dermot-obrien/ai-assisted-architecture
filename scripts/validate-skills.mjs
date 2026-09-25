#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0

/**
 * Validate Agent Skills against the agentskills.io specification.
 *
 * Checks every `<root>/<name>/SKILL.md`:
 *   - frontmatter is the first thing in the file, delimited by `---`
 *   - `name` present, <= 64 chars, lowercase alphanumeric and single hyphens,
 *     no leading/trailing hyphen, and equal to the directory name
 *   - `description` present and <= 1024 chars
 *   - `compatibility`, if present, <= 500 chars
 *   - only spec fields at the top level (others warn, since clients may add their own)
 *   - relative Markdown links in the body resolve on disk
 *   - body length against the spec's 500-line guidance (warning)
 *
 * Zero dependencies on purpose: this runs in CI for both AAW and AAA, and AAA has
 * no node_modules. The frontmatter parser handles the flat scalars and the single
 * nested `metadata` map the spec allows, which is all a SKILL.md may contain.
 *
 * Usage: node scripts/validate-skills.mjs [skillsRoot]   (default: ./skills)
 */

import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";

const SPEC_FIELDS = new Set([
  "name",
  "description",
  "license",
  "compatibility",
  "metadata",
  "allowed-tools",
]);
const MAX_NAME = 64;
const MAX_DESCRIPTION = 1024;
const MAX_COMPATIBILITY = 500;
const BODY_LINE_GUIDANCE = 500;
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

/**
 * Split the `---` delimited frontmatter off the front. Returns null when absent.
 *
 * Normalises CRLF first. The spec says nothing about line endings, and a checkout
 * on Windows with core.autocrlf=true has CRLF in every file, so an LF-only reader
 * rejects skills that are perfectly valid — and the agents load them fine. CI never
 * caught this because Linux runners check out LF.
 */
function splitFrontmatter(text) {
  const s = text.replace(/\r\n/g, "\n");
  if (!s.startsWith("---\n")) return null;
  const end = s.indexOf("\n---\n", 3);
  if (end === -1) return null;
  return { frontmatter: s.slice(4, end + 1), body: s.slice(end + 5) };
}

/** Parse the flat scalars and one level of nesting a SKILL.md frontmatter may hold. */
function parseFrontmatter(raw) {
  const out = {};
  let currentMap = null;
  for (const line of raw.split("\n")) {
    if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
    const nested = /^\s+(\S[^:]*):\s*(.*)$/.exec(line);
    if (nested && currentMap) {
      currentMap[nested[1]] = scalar(nested[2]);
      continue;
    }
    const top = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (!top) continue;
    const [, key, rest] = top;
    if (rest === "") {
      currentMap = {};
      out[key] = currentMap;
    } else {
      out[key] = scalar(rest);
      currentMap = null;
    }
  }
  return out;
}

/**
 * Resolve a YAML scalar the way a parser would type it.
 *
 * Quoting matters here: the spec requires metadata values to be strings, and an
 * unquoted `version: 1.0` is a number to every real YAML parser, so it must be
 * reported rather than silently read as text.
 */
function scalar(v) {
  const t = v.trim();
  if (t.length >= 2) {
    const first = t[0];
    if ((first === '"' || first === "'") && t.endsWith(first)) return t.slice(1, -1);
  }
  if (/^-?\d+(\.\d+)?$/.test(t)) return Number(t);
  if (t === "true" || t === "false") return t === "true";
  if (t === "null" || t === "~") return null;
  return t;
}

function validateSkill(dir) {
  const errors = [];
  const warnings = [];
  const skillFile = path.join(dir, "SKILL.md");
  const dirName = path.basename(dir);

  if (!existsSync(skillFile)) return { errors: [`${dir}: no SKILL.md`], warnings, name: dirName };

  const text = readFileSync(skillFile, "utf8");
  const split = splitFrontmatter(text);
  if (!split) {
    return {
      errors: [`${skillFile}: YAML frontmatter must be the first thing in the file`],
      warnings,
      name: dirName,
    };
  }

  const fm = parseFrontmatter(split.frontmatter);
  const body = split.body;

  for (const key of Object.keys(fm)) {
    if (!SPEC_FIELDS.has(key)) {
      warnings.push(`${skillFile}: '${key}' is not a spec field (client-specific; fine if intended)`);
    }
  }

  const name = typeof fm.name === "string" ? fm.name : undefined;
  if (!name) errors.push(`${skillFile}: name is required and must be a string`);
  else {
    if (name.length > MAX_NAME) errors.push(`${skillFile}: name exceeds ${MAX_NAME} chars`);
    if (!NAME_RE.test(name)) {
      errors.push(
        `${skillFile}: name '${name}' must be lowercase alphanumeric with single hyphens, and must not start or end with one`,
      );
    }
    if (name !== dirName) errors.push(`${skillFile}: name '${name}' must equal the directory name '${dirName}'`);
  }

  const description = typeof fm.description === "string" ? fm.description : undefined;
  if (!description) errors.push(`${skillFile}: description is required and must be a string`);
  else if (description.length > MAX_DESCRIPTION) {
    errors.push(`${skillFile}: description is ${description.length} chars, max ${MAX_DESCRIPTION}`);
  }

  if (typeof fm.compatibility === "string" && fm.compatibility.length > MAX_COMPATIBILITY) {
    errors.push(`${skillFile}: compatibility is ${fm.compatibility.length} chars, max ${MAX_COMPATIBILITY}`);
  }

  if (fm.metadata && typeof fm.metadata === "object") {
    for (const [k, v] of Object.entries(fm.metadata)) {
      if (typeof v !== "string") {
        errors.push(
          `${skillFile}: metadata.${k} is ${typeof v}; the spec requires string values, so quote it (e.g. version: "1.0")`,
        );
      }
    }
  }

  for (const m of body.matchAll(/\]\((?!https?:|#|mailto:)([^)]+)\)/g)) {
    const target = m[1].split("#")[0];
    if (target && !existsSync(path.join(dir, target))) {
      errors.push(`${skillFile}: broken relative link -> ${target}`);
    }
  }

  const lines = body.split("\n").length;
  if (lines > BODY_LINE_GUIDANCE) {
    warnings.push(
      `${skillFile}: body is ${lines} lines; the spec recommends keeping SKILL.md under ${BODY_LINE_GUIDANCE} and moving detail to references/`,
    );
  }

  return { errors, warnings, name: name ?? dirName, description: description ?? "", lines };
}

const root = path.resolve(process.argv[2] ?? "skills");
if (!existsSync(root)) {
  console.error(`No skills directory at ${root}`);
  process.exit(1);
}

const dirs = readdirSync(root)
  .map((n) => path.join(root, n))
  .filter((p) => statSync(p).isDirectory())
  .sort();

if (dirs.length === 0) {
  console.error(`No skill directories found under ${root}`);
  process.exit(1);
}

let errorCount = 0;
let warningCount = 0;
for (const dir of dirs) {
  const { errors, warnings, name, description, lines } = validateSkill(dir);
  const detail = description ? ` (description ${description.length} chars, body ${lines} lines)` : "";
  console.log(`${errors.length === 0 ? "  ok  " : " FAIL "} ${name}${detail}`);
  for (const w of warnings) console.log(`        warn: ${w}`);
  for (const e of errors) console.log(`        error: ${e}`);
  errorCount += errors.length;
  warningCount += warnings.length;
}

console.log(
  `\n${dirs.length} skill(s), ${errorCount} error(s), ${warningCount} warning(s).`,
);
process.exit(errorCount > 0 ? 1 : 0);
