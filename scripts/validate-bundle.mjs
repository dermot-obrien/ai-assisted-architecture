#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0

/**
 * Validate a skill bundle's bundle.json (DD-11), or a JSON document against a schema.
 *
 * A bundle's manifest is checked against bundle.schema.json, then against the bundle
 * itself:
 *   - every skills/<name>/SKILL.md is listed, and nothing else is
 *   - each skill's name, version and requirements equal its SKILL.md's name,
 *     metadata.version and metadata.x-skill-requires
 *   - each purl is pkg:generic/<owner>/<bundle>/<skill>@<version>
 *   - each check's command names files that exist in the skill
 *   - the ontology module's $id equals ontology.id, every $ref in it resolves, and
 *     every module it references is declared in ontology.extends
 *   - a claude-plugin adapter lists each skill at the same version
 *
 * Zero dependencies on purpose, like validate-skills.mjs, so CI needs no install step.
 * The JSON Schema support covers the 2020-12 keywords these schemas use: $ref, $defs,
 * type, enum, const, properties, required, additionalProperties, patternProperties,
 * propertyNames, items, minItems, maxItems, uniqueItems, minLength, maxLength, pattern,
 * minimum, maximum, allOf, anyOf, oneOf, not, if/then/else. Annotations such as format,
 * description and examples are ignored.
 *
 * Schemas are found by $id. A reference to a module without its version
 * (pkg:generic/o/b/module#/$defs/X) resolves to whichever version is loaded, and
 * ontology.extends states the range that version must meet.
 *
 * Usage:
 *   node scripts/validate-bundle.mjs [bundleDir ...]            default: .
 *   node scripts/validate-bundle.mjs --instance data.json --schema <$id or file>[#/$defs/X]
 *   node scripts/validate-bundle.mjs --run-checks <workspace> --skills <dir> [bundleDir]
 *   Each form takes --schemas <dir> (repeatable) to load more schemas by $id.
 *
 * --run-checks runs each skill's post-install check as an installer would: from the
 * workspace, with SKILL_DIR set to <skills dir>/<name>, the runtime resolved (python
 * tries python3, python, then py -3), and exits non-zero if any check does.
 *
 * Schemas are loaded from ../schemas and ./vendor beside this script, from any
 * --schemas directory, and from each bundle's own ontology module.
 */

import { spawnSync } from "node:child_process";
import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BUNDLE_SCHEMA_ID = "pkg:generic/dermot-obrien/ai-assisted-work/bundle-schema";

// --- Semantic Versioning ----------------------------------------------------------

function parseVersion(v) {
  const m = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?(?:\+[0-9A-Za-z.-]+)?$/.exec(String(v).trim());
  return m ? { major: +m[1], minor: +m[2], patch: +m[3], pre: m[4] ?? null } : null;
}

function compare(a, b) {
  for (const k of ["major", "minor", "patch"]) if (a[k] !== b[k]) return a[k] < b[k] ? -1 : 1;
  if (a.pre === b.pre) return 0;
  if (a.pre === null) return 1;
  if (b.pre === null) return -1;
  return a.pre < b.pre ? -1 : 1;
}

/** Expand a partial version (1, 1.2, 1.x) into a lower bound and the precision given. */
function partial(v) {
  const [core, ...pre] = v.split("-");
  const nums = [];
  for (const p of core.split(".")) {
    if (/^[xX*]$/.test(p)) break;
    if (!/^\d+$/.test(p)) return { v: null, given: 0 };
    nums.push(Number(p));
  }
  if (nums.length > 3) return { v: null, given: 0 };
  const full = { major: nums[0] ?? 0, minor: nums[1] ?? 0, patch: nums[2] ?? 0, pre: nums.length === 3 && pre.length ? pre.join("-") : null };
  return { v: full, given: nums.length };
}

function comparators(range) {
  const out = [];
  for (const tok of range.trim().split(/\s+/).filter(Boolean)) {
    const m = /^(\^|~|>=|<=|>|<|=)?(.+)$/.exec(tok);
    const op = m[1] ?? "";
    const { v, given } = partial(m[2]);
    if (!v) return null;
    const next = (k) => ({ major: k === "major" ? v.major + 1 : v.major, minor: k === "minor" ? v.minor + 1 : k === "major" ? 0 : v.minor, patch: 0, pre: null });
    if (op === "^") {
      out.push([">=", v]);
      if (v.major > 0 || given === 1) out.push(["<", next("major")]);
      else if (v.minor > 0 || given === 2) out.push(["<", next("minor")]);
      else out.push(["<", { ...v, patch: v.patch + 1, pre: null }]);
    } else if (op === "~") {
      out.push([">=", v]);
      out.push(["<", given === 1 ? next("major") : next("minor")]);
    } else if (op === "" || op === "=") {
      if (given === 3) out.push(["=", v]);
      else {
        out.push([">=", v]);
        if (given > 0) out.push(["<", given === 1 ? next("major") : next("minor")]);
      }
    } else out.push([op, v]);
  }
  return out;
}

/** Whether a version satisfies a range in the ^, ~, comparison, x and || forms. */
export function satisfies(version, range) {
  const v = parseVersion(version);
  if (!v) return false;
  let r = range.trim();
  if (r.startsWith("vers:semver/")) r = r.slice(12).split("|").join(" ");
  return r.split("||").some((alt) => {
    if (alt.trim() === "" || alt.trim() === "*") return true;
    const cs = comparators(alt);
    if (!cs) return false;
    return cs.every(([op, b]) => {
      const c = compare(v, b);
      return op === ">=" ? c >= 0 : op === "<=" ? c <= 0 : op === ">" ? c > 0 : op === "<" ? c < 0 : c === 0;
    });
  });
}

// --- JSON Schema ------------------------------------------------------------------

/** Strip a trailing @version from a purl. */
const unversioned = (id) => (id.startsWith("pkg:") ? id.replace(/@[^@#/]+$/, "") : id);

export class Registry {
  constructor() {
    this.byId = new Map();
    this.files = new Map();
  }

  add(schema, file) {
    const id = schema && schema.$id;
    if (typeof id !== "string") return null;
    this.byId.set(id, schema);
    if (id !== unversioned(id)) this.byId.set(unversioned(id), schema);
    if (file) this.files.set(id, file);
    return id;
  }

  addFile(file) {
    return this.add(JSON.parse(readFileSync(file, "utf8")), file);
  }

  addDir(dir) {
    if (!existsSync(dir)) return;
    for (const n of readdirSync(dir).sort()) {
      if (!n.endsWith(".json")) continue;
      try {
        this.addFile(path.join(dir, n));
      } catch {
        /* not a schema; ignore */
      }
    }
  }

  /** Resolve a $ref against the document it appears in. Returns { schema, root } or null. */
  resolve(ref, root) {
    const hash = ref.indexOf("#");
    const base = hash === -1 ? ref : ref.slice(0, hash);
    const pointer = hash === -1 ? "" : ref.slice(hash + 1);
    const doc = base === "" ? root : this.byId.get(base) ?? this.byId.get(unversioned(base));
    if (!doc) return null;
    let node = doc;
    for (const raw of pointer.split("/").slice(1)) {
      const key = decodeURIComponent(raw).replace(/~1/g, "/").replace(/~0/g, "~");
      if (node === null || typeof node !== "object" || !(key in node)) return null;
      node = node[key];
    }
    return { schema: node, root: doc };
  }
}

const typeOf = (v) =>
  v === null ? "null" : Array.isArray(v) ? "array" : Number.isInteger(v) ? "integer" : typeof v;

const typeMatches = (v, t) => t === typeOf(v) || (t === "number" && typeof v === "number");

const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Validate `value` against `schema`. Returns a list of { path, message }.
 * `root` is the document `schema` belongs to, for resolving local references.
 */
export function validate(value, schema, registry, root = schema, where = "") {
  const errors = [];
  const err = (message) => errors.push({ path: where || "/", message });
  if (schema === true || schema === undefined) return errors;
  if (schema === false) return [{ path: where || "/", message: "is not allowed" }];

  if (schema.$ref) {
    const r = registry.resolve(schema.$ref, root);
    if (!r) err(`$ref ${schema.$ref} does not resolve`);
    else errors.push(...validate(value, r.schema, registry, r.root, where));
  }

  if (schema.type !== undefined) {
    const types = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!types.some((t) => typeMatches(value, t))) {
      err(`is ${typeOf(value)}, expected ${types.join(" or ")}`);
      return errors;
    }
  }
  if (schema.enum && !schema.enum.some((e) => equal(e, value))) {
    err(`${JSON.stringify(value)} is not one of ${schema.enum.map((e) => JSON.stringify(e)).join(", ")}`);
  }
  if ("const" in schema && !equal(schema.const, value)) err(`must be ${JSON.stringify(schema.const)}`);

  if (typeof value === "string") {
    if (schema.minLength !== undefined && [...value].length < schema.minLength) err(`is shorter than ${schema.minLength}`);
    if (schema.maxLength !== undefined && [...value].length > schema.maxLength) err(`is longer than ${schema.maxLength}`);
    if (schema.pattern && !new RegExp(schema.pattern, "u").test(value)) {
      err(`${JSON.stringify(value)} does not match ${schema.pattern}`);
    }
  }
  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) err(`is less than ${schema.minimum}`);
    if (schema.maximum !== undefined && value > schema.maximum) err(`is more than ${schema.maximum}`);
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) err(`has fewer than ${schema.minItems} items`);
    if (schema.maxItems !== undefined && value.length > schema.maxItems) err(`has more than ${schema.maxItems} items`);
    if (schema.uniqueItems && new Set(value.map((v) => JSON.stringify(v))).size !== value.length) err("has duplicate items");
    if (schema.items !== undefined) {
      value.forEach((v, i) => errors.push(...validate(v, schema.items, registry, root, `${where}/${i}`)));
    }
  }
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    for (const k of schema.required ?? []) if (!(k in value)) err(`${k} is required`);
    const props = schema.properties ?? {};
    const patterns = Object.entries(schema.patternProperties ?? {}).map(([p, s]) => [new RegExp(p, "u"), s]);
    for (const [k, v] of Object.entries(value)) {
      const at = `${where}/${k}`;
      if (schema.propertyNames) {
        for (const e of validate(k, schema.propertyNames, registry, root, at)) errors.push({ ...e, message: `name ${e.message}` });
      }
      let known = false;
      if (k in props) {
        known = true;
        errors.push(...validate(v, props[k], registry, root, at));
      }
      for (const [re, s] of patterns) {
        if (re.test(k)) {
          known = true;
          errors.push(...validate(v, s, registry, root, at));
        }
      }
      if (!known && schema.additionalProperties !== undefined) {
        if (schema.additionalProperties === false) errors.push({ path: at, message: "is not an allowed property" });
        else errors.push(...validate(v, schema.additionalProperties, registry, root, at));
      }
    }
  }

  for (const s of schema.allOf ?? []) errors.push(...validate(value, s, registry, root, where));
  if (schema.anyOf && !schema.anyOf.some((s) => validate(value, s, registry, root, where).length === 0)) {
    const detail = schema.anyOf.map((s) => validate(value, s, registry, root, where)[0]?.message).filter(Boolean);
    err(`matches none of the allowed forms${detail.length ? ` (${detail.join("; ")})` : ""}`);
  }
  if (schema.oneOf) {
    const n = schema.oneOf.filter((s) => validate(value, s, registry, root, where).length === 0).length;
    if (n !== 1) err(`matches ${n} of the oneOf forms, expected exactly 1`);
  }
  if (schema.not && validate(value, schema.not, registry, root, where).length === 0) err("matches a form that is not allowed");
  if (schema.if !== undefined) {
    const branch = validate(value, schema.if, registry, root, where).length === 0 ? schema.then : schema.else;
    if (branch !== undefined) errors.push(...validate(value, branch, registry, root, where));
  }
  return errors;
}

/** Every $ref string in a schema document. */
function refsIn(node, out = []) {
  if (Array.isArray(node)) node.forEach((n) => refsIn(n, out));
  else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (k === "$ref" && typeof v === "string") out.push(v);
      else refsIn(v, out);
    }
  }
  return out;
}

// --- SKILL.md frontmatter (the same subset validate-skills.mjs reads) ---------------

function frontmatter(file) {
  const s = readFileSync(file, "utf8").replace(/\r\n/g, "\n");
  if (!s.startsWith("---\n")) return null;
  const end = s.indexOf("\n---\n", 3);
  if (end === -1) return null;
  const out = {};
  let map = null;
  for (const line of s.slice(4, end + 1).split("\n")) {
    if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
    const nested = /^\s+(\S[^:]*):\s*(.*)$/.exec(line);
    if (nested && map) {
      map[nested[1]] = unquote(nested[2]);
      continue;
    }
    const top = /^([A-Za-z][\w-]*):\s*(.*)$/.exec(line);
    if (!top) continue;
    if (top[2] === "") out[top[1]] = map = {};
    else {
      out[top[1]] = unquote(top[2]);
      map = null;
    }
  }
  return out;
}

function unquote(v) {
  const t = v.trim();
  return t.length >= 2 && (t[0] === '"' || t[0] === "'") && t.endsWith(t[0]) ? t.slice(1, -1) : t;
}

/**
 * Parse metadata.x-skill-requires: comma-separated "<purl> <range>" entries. A bare
 * skill name (the older "name@range" or "name range" form) is allowed only for a skill
 * in the same bundle, so it is qualified with this bundle's owner and name.
 */
export function parseRequires(raw, owner, bundle) {
  const out = [];
  for (const entry of String(raw ?? "").split(",").map((s) => s.trim()).filter(Boolean)) {
    const m = /^(pkg:\S+?)\s+(.+)$/.exec(entry) ?? /^([a-z0-9-]+)(?:@|\s+)(.+)$/.exec(entry);
    if (!m) {
      out.push({ purl: entry, range: "", malformed: true });
      continue;
    }
    const purl = m[1].startsWith("pkg:") ? m[1] : `pkg:generic/${owner}/${bundle}/${m[1]}`;
    out.push({ purl, range: m[2].trim() });
  }
  return out;
}

const key = (r) => `${r.purl} ${r.range}`;

// --- Bundle checks ----------------------------------------------------------------

export function checkBundle(dir, registry) {
  const errors = [];
  const where = (p, m) => errors.push(`${path.join(dir, "bundle.json")}: ${p ? `${p}: ` : ""}${m}`);
  const file = path.join(dir, "bundle.json");
  if (!existsSync(file)) return [`${file}: not found`];
  let b;
  try {
    b = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    return [`${file}: not valid JSON: ${e.message}`];
  }

  const schema = registry.byId.get(BUNDLE_SCHEMA_ID);
  if (!schema) return [`bundle.schema.json (${BUNDLE_SCHEMA_ID}) was not found; pass --schemas <dir>`];
  const declared = typeof b.$schema === "string" ? b.$schema : null;
  if (declared && unversioned(declared) !== BUNDLE_SCHEMA_ID) where("$schema", `${declared} is not the bundle schema`);
  const loaded = parseVersion(schema.$id.split("@")[1] ?? "");
  const wanted = declared && parseVersion(declared.split("@")[1] ?? "");
  if (loaded && wanted && wanted.major !== loaded.major) {
    where("$schema", `written for bundle schema ${wanted.major}.x, validated with ${schema.$id}`);
  }
  for (const e of validate(b, schema, registry)) where(e.path, e.message);
  if (errors.length) return errors;

  // Every skill directory is listed, and every listed skill exists.
  const listed = new Map(b.skills.map((s, i) => [s.name, i]));
  if (listed.size !== b.skills.length) where("/skills", "a skill is listed twice");
  const skillsRoot = path.join(dir, "skills");
  if (existsSync(skillsRoot)) {
    for (const n of readdirSync(skillsRoot).sort()) {
      if (existsSync(path.join(skillsRoot, n, "SKILL.md")) && !b.skills.some((s) => path.normalize(s.path) === path.normalize(`skills/${n}`))) {
        where("/skills", `skills/${n} holds a SKILL.md but is not listed`);
      }
    }
  }

  b.skills.forEach((s, i) => {
    const at = `/skills/${i}`;
    const sdir = path.join(dir, s.path);
    const skillMd = path.join(sdir, "SKILL.md");
    if (!existsSync(skillMd)) return where(`${at}/path`, `${s.path}/SKILL.md does not exist`);
    const fm = frontmatter(skillMd);
    if (!fm) return where(`${at}/path`, `${s.path}/SKILL.md has no frontmatter`);
    if (fm.name !== s.name) where(`${at}/name`, `${s.name} is not SKILL.md's name, ${fm.name}`);
    if (path.basename(s.path) !== s.name) where(`${at}/path`, `the directory ${s.path} is not named ${s.name}`);
    const md = fm.metadata ?? {};
    if (md.version !== s.version) where(`${at}/version`, `${s.version} is not SKILL.md's metadata.version, ${md.version}`);
    const purl = `pkg:generic/${b.owner}/${b.name}/${s.name}@${s.version}`;
    if (s.purl !== purl) where(`${at}/purl`, `${s.purl} should be ${purl}`);

    const fromMd = parseRequires(md["x-skill-requires"], b.owner, b.name);
    for (const r of fromMd.filter((r) => r.malformed)) where(`${at}/requires`, `SKILL.md x-skill-requires entry '${r.purl}' is not "<purl> <range>"`);
    const a = new Set(s.requires.map(key));
    const m = new Set(fromMd.filter((r) => !r.malformed).map(key));
    for (const k of a) if (!m.has(k)) where(`${at}/requires`, `${k} is not in SKILL.md's x-skill-requires`);
    for (const k of m) if (!a.has(k)) where(`${at}/requires`, `SKILL.md requires ${k}, which bundle.json does not list`);
    for (const r of s.requires) {
      const own = r.purl.startsWith(`pkg:generic/${b.owner}/${b.name}/`) ? b.skills.find((x) => r.purl.endsWith(`/${x.name}`)) : null;
      if (own && !satisfies(own.version, r.range)) where(`${at}/requires`, `${r.purl} ${r.range} is not met by this bundle's ${own.name} ${own.version}`);
    }

    if (s.check) {
      for (const arg of s.check.command.slice(s.check.runtime ? 1 : 0)) {
        if (/^[^-][^\s]*\.(py|mjs|cjs|js|sh|ps1|ts)$/.test(arg) && !existsSync(path.join(sdir, arg))) {
          where(`${at}/check/command`, `${arg} does not exist in ${s.path}`);
        }
      }
    }
  });

  if (b.ontology) {
    const o = b.ontology;
    const f = path.join(dir, o.path);
    if (!existsSync(f)) where("/ontology/path", `${o.path} does not exist`);
    else {
      let mod;
      try {
        mod = JSON.parse(readFileSync(f, "utf8"));
      } catch (e) {
        where("/ontology/path", `${o.path} is not valid JSON: ${e.message}`);
      }
      if (mod) {
        if (mod.$id !== o.id) where("/ontology/id", `${o.id} is not the $id of ${o.path}, ${mod.$id}`);
        const prefix = `pkg:generic/${b.owner}/${b.name}/`;
        if (!o.id.startsWith(prefix)) where("/ontology/id", `${o.id} is not a component of ${prefix.slice(0, -1)}`);
        registry.add(mod, f);
        const ext = new Map((o.extends ?? []).map((r) => [r.purl, r.range]));
        // A module of this bundle's own, by purl, or a schema file inside it that has no
        // purl, such as an older base schema the module builds on, needs no entry in
        // extends. Another bundle's module, even a vendored copy, does.
        const inBundle = (doc) => {
          const file = doc && registry.files.get(doc.$id);
          return Boolean(file) && !path.relative(dir, file).startsWith("..") && !path.isAbsolute(path.relative(dir, file));
        };
        const seen = new Set();
        for (const ref of new Set(refsIn(mod))) {
          const resolved = registry.resolve(ref, mod);
          if (!resolved) {
            where(o.path, `$ref ${ref} does not resolve`);
            continue;
          }
          const base = ref.split("#")[0];
          if (!base || unversioned(base) === unversioned(o.id)) continue;
          const target = unversioned(base);
          if (target.startsWith("pkg:") ? target.startsWith(prefix) : inBundle(resolved.root)) continue;
          if (base !== target) where(o.path, `$ref ${ref} pins a version; reference ${target} and state the range in extends`);
          if (seen.has(target)) continue;
          seen.add(target);
          if (!ext.has(target)) {
            where("/ontology/extends", `${o.path} references ${target}, which extends does not declare`);
            continue;
          }
          const got = registry.byId.get(target);
          const version = got && got.$id.includes("@") ? got.$id.split("@").pop() : null;
          if (version && !satisfies(version, ext.get(target))) {
            where("/ontology/extends", `${target} ${ext.get(target)} is not met by the loaded ${got.$id}`);
          }
        }
        for (const target of ext.keys()) {
          if (!seen.has(target)) where("/ontology/extends", `${target} is declared, but ${o.path} references nothing in it`);
        }
      }
    }
  }

  const plugin = b.adapters?.["claude-plugin"];
  if (plugin) {
    const f = path.join(dir, plugin);
    if (!existsSync(f)) where("/adapters/claude-plugin", `${plugin} does not exist`);
    else {
      const market = JSON.parse(readFileSync(f, "utf8"));
      const plugins = new Map((market.plugins ?? []).map((p) => [p.name, p]));
      for (const s of b.skills) {
        const p = plugins.get(s.name);
        if (!p) where("/adapters/claude-plugin", `${plugin} has no plugin for ${s.name}`);
        else if (p.version !== undefined && p.version !== s.version) {
          where("/adapters/claude-plugin", `${plugin} gives ${s.name} ${p.version}, bundle.json ${s.version}`);
        }
      }
    }
  }
  return errors;
}

// --- Running post-install checks -------------------------------------------------------

const RUNTIMES = { python: [["python3"], ["python"], ["py", "-3"]], node: [[process.execPath]] };

/** The argv prefix that starts a runtime here, or null when none of its forms runs. */
function resolveRuntime(name) {
  for (const argv of RUNTIMES[name] ?? [[name]]) {
    const r = spawnSync(argv[0], [...argv.slice(1), "--version"], { stdio: "ignore" });
    if (r.status === 0) return argv;
  }
  return null;
}

/**
 * Run each skill's check the way DD-11 says an installer does. Returns the number of
 * checks that did not exit 0. Exit 2 from a check, or a missing runtime, is reported
 * as an environment error rather than a problem with the workspace.
 */
export function runChecks(bundleDir, workspace, skillsDir) {
  const b = JSON.parse(readFileSync(path.join(bundleDir, "bundle.json"), "utf8"));
  let bad = 0;
  for (const s of b.skills) {
    if (!s.check) {
      console.log(`  --   ${s.name}: no check declared`);
      continue;
    }
    const skillDir = path.resolve(skillsDir, s.name);
    let argv = s.check.command;
    if (s.check.runtime) {
      const rt = resolveRuntime(s.check.runtime);
      if (!rt) {
        console.log(`  env  ${s.name}: runtime ${s.check.runtime} not found`);
        bad++;
        continue;
      }
      argv = [...rt, ...argv.slice(1)];
    }
    const args = argv.slice(1).map((a) => (existsSync(path.join(skillDir, a)) ? path.join(skillDir, a) : a));
    const r = spawnSync(argv[0], args, {
      cwd: workspace,
      env: { ...process.env, SKILL_DIR: skillDir },
      encoding: "utf8",
    });
    const label = r.status === 0 ? "  ok  " : r.status === 1 ? " FAIL " : "  env ";
    console.log(`${label} ${s.name}: ${s.check.command.join(" ")} exited ${r.status}`);
    for (const line of `${r.stdout ?? ""}${r.stderr ?? ""}`.split(/\r?\n/).filter(Boolean)) console.log(`        ${line}`);
    if (r.status !== 0) bad++;
  }
  return bad;
}

// --- CLI ----------------------------------------------------------------------------

function main(argv) {
  const dirs = [];
  const schemaDirs = [path.join(HERE, "..", "schemas"), path.join(HERE, "vendor")];
  let instance = null;
  let against = null;
  let workspace = null;
  let skillsDir = null;
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--schemas") schemaDirs.push(path.resolve(argv[++i]));
    else if (a === "--instance") instance = argv[++i];
    else if (a === "--schema") against = argv[++i];
    else if (a === "--run-checks") workspace = path.resolve(argv[++i]);
    else if (a === "--skills") skillsDir = path.resolve(argv[++i]);
    else if (a === "-h" || a === "--help") {
      console.log(
        "usage: validate-bundle.mjs [bundleDir ...]\n" +
          "       validate-bundle.mjs --instance <file.json> --schema <$id|file>[#pointer]\n" +
          "       validate-bundle.mjs --run-checks <workspace> [--skills <dir>] [bundleDir]\n" +
          "       any form: --schemas <dir> to load more schemas",
      );
      return 0;
    } else if (a.startsWith("-")) {
      console.error(`unknown option ${a}`);
      return 2;
    } else dirs.push(a);
  }
  const registry = new Registry();
  for (const d of schemaDirs) registry.addDir(d);

  if (workspace) {
    const bundleDir = path.resolve(dirs[0] ?? ".");
    return runChecks(bundleDir, workspace, skillsDir ?? path.join(workspace, ".agents", "skills")) ? 1 : 0;
  }

  if (instance) {
    if (!against) {
      console.error("--instance needs --schema");
      return 2;
    }
    let [ref, pointer] = against.split("#");
    if (existsSync(ref) && statSync(ref).isFile()) ref = registry.addFile(ref);
    const r = registry.resolve(`${ref}${pointer !== undefined ? `#${pointer}` : ""}`, null);
    if (!r) {
      console.error(`schema ${against} not found`);
      return 2;
    }
    const errors = validate(JSON.parse(readFileSync(instance, "utf8")), r.schema, registry, r.root);
    for (const e of errors) console.log(`${instance}: ${e.path}: ${e.message}`);
    console.log(errors.length ? `${errors.length} error(s)` : `${instance}: ok`);
    return errors.length ? 1 : 0;
  }

  let failed = 0;
  for (const d of dirs.length ? dirs : ["."]) {
    const errors = checkBundle(path.resolve(d), registry);
    if (errors.length) {
      failed++;
      for (const e of errors) console.log(`error: ${e}`);
    } else {
      const b = JSON.parse(readFileSync(path.join(d, "bundle.json"), "utf8"));
      const checks = b.skills.filter((s) => s.check).length;
      console.log(`  ok   ${b.owner}/${b.name}: ${b.skills.length} skill(s), ${checks} with a check${b.ontology ? `, ontology ${b.ontology.id}` : ""}`);
    }
  }
  return failed ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exit(main(process.argv.slice(2)));
}
