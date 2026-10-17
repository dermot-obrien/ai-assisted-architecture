#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0
// Copied from dermot-obrien/ai-assisted-work bin/skills.mjs (6.0.1, dermot-obrien/ai-assisted-work#82) by the workspace skill. Re-run its install to update it; do not edit here.

/**
 * skills — install standalone Agent Skills into a workspace, from a bundle or one at a time.
 *
 * A bundle is a bundle.json listing skills. A skill with a `source` lives in a repository of
 * its own and is cloned at its ref; one without lives in the bundle's own folder. Each skill
 * is copied to <workspace>/.agents/skills/<name>, which Codex, Cursor, Copilot, VS Code and
 * Gemini CLI read, and <workspace>/.claude/skills/<name> is linked at it when .claude/ exists,
 * for Claude Code. A lock file, .agents/skills.lock.json, records where each came from and a
 * hash of what was installed, so `check` can say what changed and `update` what moved.
 *
 * For a constrained environment: --from <folder> installs from copies already on the machine
 * (a folder of skill folders, or of repository clones), with no network at all; and
 * $SKILLS_BASE_URL points every clone at a mirror instead of the repository's own host.
 *
 * Zero dependencies; Node 18+ and git (git only for skills with a source). Run `skills help`.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, symlinkSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Every git call here names its repository (cwd or -C). Variables that point git at another
// repository would override that and act on the wrong one, such as the agent's own checkout
// when a platform's shell sets GIT_DIR, so they are dropped before anything runs.
for (const v of ["GIT_DIR", "GIT_WORK_TREE", "GIT_INDEX_FILE", "GIT_OBJECT_DIRECTORY", "GIT_ALTERNATE_OBJECT_DIRECTORIES", "GIT_COMMON_DIR", "GIT_NAMESPACE", "GIT_PREFIX"]) delete process.env[v];

const HERE = path.dirname(fileURLToPath(import.meta.url));

const die = (msg, code = 1) => {
  process.stderr.write(`skills: ${msg}\n`);
  process.exit(code);
};
const say = (msg) => console.log(msg);

function parseArgs(argv) {
  const flags = {};
  const pos = [];
  const BOOL = new Set(["json", "help", "dry-run", "copy", "locked"]);
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!BOOL.has(key) && next !== undefined && !next.startsWith("--")) {
        flags[key] = next;
        i++;
      } else flags[key] = true;
    } else pos.push(a);
  }
  return { pos, flags };
}

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

/** The workspace: --workspace, else the git root above the working directory, else the working directory. */
function workspaceOf(flags) {
  if (typeof flags.workspace === "string") return path.resolve(flags.workspace);
  try {
    return git(["rev-parse", "--show-toplevel"], process.cwd());
  } catch {
    return process.cwd();
  }
}

// ---------------------------------------------------------------- the bundle

/** Read a bundle: --bundle <file or folder>, else the bundle.json beside this script's repository. */
function readBundle(flags) {
  let file = typeof flags.bundle === "string" ? path.resolve(flags.bundle) : path.join(HERE, "..", "bundle.json");
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "bundle.json");
  if (!existsSync(file)) die(`no bundle at ${file}. Pass --bundle <bundle.json or its folder>, or --repo <url> for one skill.`);
  const bundle = JSON.parse(readFileSync(file, "utf8"));
  return { ...bundle, root: path.dirname(file) };
}

/** One skill from a repository of its own, from --repo <url> [--ref <tag>] [--path <dir>] [--name <skill>]. */
function singleSkill(flags) {
  const repo = flags.repo;
  const name = typeof flags.name === "string" ? flags.name : path.basename(String(repo)).replace(/\.git$/, "");
  return { name, path: typeof flags.path === "string" ? flags.path : `skills/${name}`, source: { repo, ref: typeof flags.ref === "string" ? flags.ref : undefined } };
}

/** A repository URL, moved onto the mirror in $SKILLS_BASE_URL when one is set. */
function mirrored(repo) {
  const base = process.env.SKILLS_BASE_URL;
  if (!base || /^(\.|\/|file:)/.test(repo)) return repo;
  const name = path.basename(repo).replace(/\.git$/, "");
  return `${base.replace(/\/+$/, "")}/${name}.git`;
}

// ---------------------------------------------------------------- fetching

/** Where a skill's files are: a folder under --from, a clone of its source at its ref, or the bundle's folder. */
function locate(skill, bundle, ws, flags) {
  const src = skill.source;
  if (typeof flags.from === "string") {
    const from = path.resolve(flags.from);
    const repoName = src ? path.basename(src.repo).replace(/\.git$/, "") : null;
    // A bundle found under --from serves the skills in its own folder first.
    const own = !src && bundle?.url === "folder" ? path.join(bundle.root, skill.path) : null;
    const tries = [own, path.join(from, skill.name), repoName && path.join(from, repoName, skill.path), repoName && path.join(from, repoName), path.join(from, skill.path)].filter(Boolean);
    const hit = tries.find((d) => existsSync(path.join(d, "SKILL.md")));
    if (!hit) die(`${skill.name}: not found under ${from} (looked in ${tries.map((t) => path.relative(from, t) || ".").join(", ")})`);
    return { dir: hit, commit: null, origin: `folder ${from}` };
  }
  if (!src) {
    const dir = path.join(bundle.root, skill.path);
    if (!existsSync(path.join(dir, "SKILL.md"))) die(`${skill.name}: no SKILL.md at ${dir}`);
    let commit = null;
    // A skill the workspace keeps itself records no commit: the workspace's own would change the lock on every commit.
    if (bundle.url !== "workspace") {
      try {
        commit = git(["rev-parse", "HEAD"], bundle.root);
      } catch {
        /* not a clone */
      }
    }
    return { dir, commit, origin: `bundle ${bundle.name || bundle.root}` };
  }
  const { cache, url } = fetchRepo(src.repo, src.ref, ws, skill.name, src.commit);
  // A repository holds its skill at the entry's path (skills/<name>), or a lone skill at its root.
  const dir = [path.join(cache, skill.path || "."), cache].find((d) => existsSync(path.join(d, "SKILL.md")));
  if (!dir) die(`${skill.name}: no SKILL.md at ${skill.path} in ${url}`);
  return { dir, commit: git(["rev-parse", "HEAD"], cache), origin: url };
}

/**
 * Fetch a repository into .agents/.skill-sources/<name>, at a ref (tag or branch) or, when
 * `commit` is given, at exactly that commit. Returns the clone and the URL used.
 */
function fetchRepo(repo, ref, ws, label, commit) {
  const url = mirrored(repo);
  const cache = path.join(ws, ".agents", ".skill-sources", path.basename(url).replace(/\.git$/, ""));
  const want = commit || ref || "HEAD";
  try {
    if (!existsSync(path.join(cache, ".git"))) {
      mkdirSync(cache, { recursive: true });
      git(["init", "--quiet"], cache);
      git(["remote", "add", "origin", url], cache);
    } else git(["remote", "set-url", "origin", url], cache);
    git(["fetch", "--quiet", "--depth", "1", "origin", want], cache);
    git(["checkout", "--quiet", "--force", "FETCH_HEAD"], cache);
  } catch (e) {
    // Leave nothing behind from a fetch that failed: no half clone, no empty cache folder.
    if (!existsSync(path.join(cache, ".git", "FETCH_HEAD"))) rmSync(cache, { recursive: true, force: true });
    const parent = path.dirname(cache);
    if (existsSync(parent) && !readdirSync(parent).length) rmSync(parent, { recursive: true, force: true });
    die(`${label}: could not fetch ${url} at ${want}:\n${String(e.stderr || e.message).trim()}\n  In a constrained environment, copy the skill onto the machine and pass --from <folder>, or set SKILLS_BASE_URL to a mirror.`);
  }
  return { cache, url };
}

// ---------------------------------------------------------------- the workspace's declaration

const declFile = (ws) => path.join(ws, ".agents", "skills.json");

/**
 * The workspace's .agents/skills.json: the skills it wants, as a list of sources. A source is
 * a bundle ({ "bundle": "<repository>", "ref": "<tag or branch>", "skills": [<names>] }, all
 * of its skills when "skills" is left out), one skill ({ "repo": "<repository>", "ref": ...,
 * "name": "<skill>", "path": "skills/<skill>" }), or a skill kept in the workspace itself
 * ({ "folder": "skills/<skill>" }), which is copied from there and never fetched.
 */
function readDecl(ws) {
  const f = declFile(ws);
  if (!existsSync(f)) die(`no ${path.relative(ws, f)}: it lists the skills this workspace wants. See skills help.`);
  const decl = JSON.parse(readFileSync(f, "utf8"));
  if (!Array.isArray(decl.sources)) die(`${path.relative(ws, f)}: "sources" must be a list`);
  decl.sources.forEach((src, i) => {
    if ([src.bundle, src.repo, src.folder].filter(Boolean).length !== 1) die(`${path.relative(ws, f)}: sources[${i}] needs exactly one of "bundle", "repo" or "folder"`);
    if (src.repo && !src.name) src.name = path.basename(src.repo).replace(/\.git$/, "");
    if (src.folder && !src.name) src.name = path.basename(src.folder);
  });
  return decl;
}

/** A declared bundle, fetched (or found under --from) and read. */
function bundleOf(src, ws, flags, commit) {
  if (typeof flags.from === "string") {
    const name = path.basename(src.bundle).replace(/\.git$/, "");
    const root = path.join(path.resolve(flags.from), name);
    if (!existsSync(path.join(root, "bundle.json"))) die(`bundle ${name}: no bundle.json under ${root}`);
    return { ...JSON.parse(readFileSync(path.join(root, "bundle.json"), "utf8")), root, commit: null, url: "folder" };
  }
  const { cache, url } = fetchRepo(src.bundle, src.ref, ws, `bundle ${src.bundle}`, commit);
  if (!existsSync(path.join(cache, "bundle.json"))) die(`${url}: no bundle.json at its root`);
  // The lock records the repository as declared: a mirror ($SKILLS_BASE_URL) is where it was fetched from, not what it is.
  return { ...JSON.parse(readFileSync(path.join(cache, "bundle.json"), "utf8")), root: cache, commit: git(["rev-parse", "HEAD"], cache), url: src.bundle, fetchedFrom: url };
}

// ---------------------------------------------------------------- installing

/**
 * Folders running a skill creates inside its copy: its npm packages, Python's bytecode caches and
 * virtual environments. They are not the skill, so they are left out of its hash, and a skill that
 * has been used still checks as unchanged.
 */
const NOT_THE_SKILL = new Set([".git", "node_modules", "__pycache__", ".venv", "venv", ".pytest_cache", ".mypy_cache"]);

/** A hash of a folder's files, by path and content, so a changed copy is noticed. */
function hashDir(dir) {
  const h = createHash("sha256");
  const walk = (d, rel) => {
    for (const e of readdirSync(d, { withFileTypes: true }).sort((a, b) => (a.name < b.name ? -1 : 1))) {
      if (NOT_THE_SKILL.has(e.name) && (e.isDirectory() || e.name === ".git")) continue;
      const p = path.join(d, e.name);
      const r = rel ? `${rel}/${e.name}` : e.name;
      if (e.isDirectory()) walk(p, r);
      else {
        h.update(r + "\0");
        h.update(readFileSync(p).toString("utf8").replace(/\r\n/g, "\n"));
        h.update("\0");
      }
    }
  };
  walk(dir, "");
  return h.digest("hex").slice(0, 16);
}

/** The name a SKILL.md declares, and what it says it requires. */
function frontMatter(dir) {
  const text = readFileSync(path.join(dir, "SKILL.md"), "utf8");
  const head = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text)?.[1] || "";
  const name = /^name:\s*["']?([^"'\s]+)/m.exec(head)?.[1] || null;
  const version = /^\s+version:\s*["']?([^"'\s]+)/m.exec(head)?.[1] || null;
  const req = /x-skill-requires:\s*["']?([^"'\n]*)/.exec(head)?.[1]?.trim() || "";
  // x-skill-requires is "<purl> <range>, ..." (or bare names); the skill is the purl's last segment.
  const requires = req
    .split(",")
    .map((e) => e.trim().split(/\s+/)[0])
    .filter(Boolean)
    .map((p) => p.split("/").pop().split("@")[0]);
  return { name, version, requires };
}

function linkClaude(ws, name, target, copy) {
  const claude = path.join(ws, ".claude");
  if (!existsSync(claude)) return null;
  const link = path.join(claude, "skills", name);
  mkdirSync(path.dirname(link), { recursive: true });
  rmSync(link, { recursive: true, force: true });
  if (!copy) {
    try {
      // A junction on Windows needs an absolute target and no developer mode; elsewhere a relative symlink.
      if (process.platform === "win32") symlinkSync(target, link, "junction");
      else symlinkSync(path.relative(path.dirname(link), target), link);
      return "linked";
    } catch {
      /* fall back to a copy */
    }
  }
  cpSync(target, link, { recursive: true });
  return "copied";
}

const lockFile = (ws) => path.join(ws, ".agents", "skills.lock.json");
function readLock(ws) {
  const f = lockFile(ws);
  return existsSync(f) ? JSON.parse(readFileSync(f, "utf8")) : { lockfile: 1, skills: {} };
}
function writeLock(ws, lock) {
  mkdirSync(path.dirname(lockFile(ws)), { recursive: true });
  const sorted = Object.fromEntries(Object.entries(lock.skills).sort(([a], [b]) => (a < b ? -1 : 1)));
  writeFileSync(lockFile(ws), JSON.stringify({ lockfile: 1, skills: sorted }, null, 2) + "\n");
}

function installOne(skill, bundle, ws, flags, lock) {
  const { dir, commit, origin } = locate(skill, bundle, ws, flags);
  const fm = frontMatter(dir);
  if (fm.name && fm.name !== skill.name) die(`${skill.name}: its SKILL.md is named ${fm.name}`);
  const target = path.join(ws, ".agents", "skills", skill.name);
  if (flags["dry-run"]) return say(`would install ${skill.name}${fm.version ? ` ${fm.version}` : ""} from ${origin}`);
  rmSync(target, { recursive: true, force: true });
  mkdirSync(path.dirname(target), { recursive: true });
  cpSync(dir, target, { recursive: true, filter: (p) => path.basename(p) !== ".git" });
  const linked = linkClaude(ws, skill.name, target, flags.copy);
  // From copies on this machine (--from), keep the provenance the lock already holds, so an
  // offline install neither loses the pinned commit nor leaves the committed lock changed.
  const kept = typeof flags.from === "string" ? lock.skills[skill.name] : null;
  if (kept) {
    lock.skills[skill.name] = { ...kept, version: fm.version ?? kept.version, hash: hashDir(target) };
    say(`installed ${skill.name}${fm.version ? ` ${fm.version}` : ""} from ${origin}, keeping its locked source${linked ? ` (.claude/skills ${linked})` : ""}`);
    return fm;
  }
  lock.skills[skill.name] = {
    version: fm.version,
    source: skill.source ? skill.source.repo : typeof flags.from === "string" ? "folder" : bundle.url === "workspace" ? "workspace" : "bundle",
    ...(bundle.url && bundle.url !== "folder" && bundle.url !== "workspace" ? { bundle: bundle.url, bundleRef: bundle.ref ?? null } : {}),
    ref: skill.source?.ref ?? null,
    path: skill.path,
    commit,
    hash: hashDir(target),
  };
  say(`installed ${skill.name}${fm.version ? ` ${fm.version}` : ""} from ${origin}${linked ? ` (.claude/skills ${linked})` : ""}`);
  return fm;
}

// ---------------------------------------------------------------- commands

function chosen(bundle, names) {
  if (!names.length) return bundle.skills;
  const out = names.map((n) => bundle.skills.find((s) => s.name === n) || die(`no skill ${n} in the bundle. skills list shows them`));
  return out;
}

const commands = {
  install(pos, flags) {
    const ws = workspaceOf(flags);
    const bundle = flags.repo ? { name: "single", root: ws, skills: [singleSkill(flags)] } : readBundle(flags);
    const lock = readLock(ws);
    const installed = [];
    for (const s of chosen(bundle, flags.repo ? [] : pos)) installed.push([s.name, installOne(s, bundle, ws, flags, lock)]);
    if (flags["dry-run"]) return;
    writeLock(ws, lock);
    // Skills are standalone: anything one still says it needs is reported, never pulled in.
    for (const [name, fm] of installed) {
      const missing = (fm?.requires || []).filter((r) => !existsSync(path.join(ws, ".agents", "skills", r)));
      if (missing.length) say(`note: ${name} says it needs ${missing.join(", ")}, which is not installed`);
    }
  },

  sync(pos, flags) {
    // Make the workspace match .agents/skills.json: install what it declares, remove what this
    // installer put here and it no longer declares. --locked installs the commits the lock holds.
    const ws = workspaceOf(flags);
    const decl = readDecl(ws);
    const lock = readLock(ws);
    const locked = Boolean(flags.locked);
    const wanted = new Set();
    const installed = [];
    for (const src of decl.sources) {
      if (src.bundle) {
        // Locks written while a mirror was set recorded the mirrored URL; accept either.
        const prior = Object.values(lock.skills).find((e) => e.source === "bundle" && (e.bundle === src.bundle || e.bundle === mirrored(src.bundle)));
        if (locked && !prior && typeof flags.from !== "string") die(`--locked: the lock has no commit for bundle ${src.bundle}; run skills sync first`);
        const bundle = { ...bundleOf(src, ws, flags, locked ? prior?.commit : undefined), ref: src.ref ?? null };
        for (const s of chosen(bundle, src.skills || [])) {
          wanted.add(s.name);
          // A skill the bundle sources from its own repository: at the lock's commit when --locked.
          const entry = s.source && locked ? lock.skills[s.name] : null;
          const skill = entry?.commit ? { ...s, source: { ...s.source, commit: entry.commit } } : s;
          installed.push([s.name, installOne(skill, bundle, ws, flags, lock)]);
        }
      } else if (src.folder) {
        // A skill this workspace keeps itself: copied from its folder, never fetched or locked to a commit.
        wanted.add(src.name);
        const root = path.join(ws, path.dirname(src.folder));
        installed.push([src.name, installOne({ name: src.name, path: path.basename(src.folder) }, { name: "workspace", root, url: "workspace" }, ws, { ...flags, from: undefined }, lock)]);
      } else {
        wanted.add(src.name);
        const entry = locked ? lock.skills[src.name] : null;
        if (locked && !entry?.commit && typeof flags.from !== "string") die(`--locked: the lock has no commit for ${src.name}; run skills sync first`);
        const skill = { name: src.name, path: src.path || `skills/${src.name}`, source: { repo: src.repo, ref: src.ref, commit: entry?.commit } };
        installed.push([src.name, installOne(skill, { name: "single", root: ws }, ws, flags, lock)]);
      }
    }
    if (flags["dry-run"]) return;
    // Only what the lock says this installer put here is ever removed.
    for (const name of Object.keys(lock.skills)) {
      if (wanted.has(name)) continue;
      rmSync(path.join(ws, ".agents", "skills", name), { recursive: true, force: true });
      rmSync(path.join(ws, ".claude", "skills", name), { recursive: true, force: true });
      delete lock.skills[name];
      say(`removed ${name}: no longer in ${path.relative(ws, declFile(ws))}`);
    }
    writeLock(ws, lock);
    for (const [name, fm] of installed) {
      const missing = (fm?.requires || []).filter((r) => !existsSync(path.join(ws, ".agents", "skills", r)));
      if (missing.length) say(`note: ${name} says it needs ${missing.join(", ")}, which is not installed`);
    }
  },

  update(pos, flags) {
    // Fetch each installed skill's source again and reinstall it; a skill from a folder needs --from again.
    const ws = workspaceOf(flags);
    const lock = readLock(ws);
    const bundle = readBundle(flags);
    const names = pos.length ? pos : Object.keys(lock.skills);
    for (const n of names) {
      const s = bundle.skills.find((x) => x.name === n);
      if (!s) {
        say(`${n}: not in this bundle; reinstall it with skills install --repo <url> --name ${n}`);
        continue;
      }
      installOne(s, bundle, ws, flags, lock);
    }
    writeLock(ws, lock);
  },

  check(pos, flags) {
    const ws = workspaceOf(flags);
    const lock = readLock(ws);
    let bad = 0;
    for (const [name, entry] of Object.entries(lock.skills)) {
      const dir = path.join(ws, ".agents", "skills", name);
      if (!existsSync(path.join(dir, "SKILL.md"))) {
        say(`✗ ${name}: missing from .agents/skills`);
        bad++;
      } else if (hashDir(dir) !== entry.hash) {
        say(`✗ ${name}: changed since it was installed; skills install ${name} puts it back`);
        bad++;
      } else say(`✓ ${name} ${entry.version ?? ""}`.trimEnd());
    }
    if (!Object.keys(lock.skills).length) say("nothing installed by skills here");
    process.exitCode = bad ? 1 : 0;
  },

  list(pos, flags) {
    const bundle = readBundle(flags);
    const ws = workspaceOf(flags);
    const lock = readLock(ws);
    if (flags.json) return say(JSON.stringify(bundle.skills.map((s) => ({ ...s, installed: lock.skills[s.name] ?? null })), null, 2));
    for (const s of bundle.skills) {
      const where = s.source ? `${s.source.repo}${s.source.ref ? ` @ ${s.source.ref}` : ""}` : `bundle ${s.path}`;
      say(`${lock.skills[s.name] ? "●" : "○"} ${s.name} ${s.version} · ${where}`);
    }
  },

  remove(pos, flags) {
    const ws = workspaceOf(flags);
    const lock = readLock(ws);
    for (const n of pos) {
      rmSync(path.join(ws, ".agents", "skills", n), { recursive: true, force: true });
      rmSync(path.join(ws, ".claude", "skills", n), { recursive: true, force: true });
      delete lock.skills[n];
      say(`removed ${n}`);
    }
    writeLock(ws, lock);
  },

  help() {
    say(`skills — install standalone Agent Skills into a workspace

  skills list [--bundle <file|dir>] [--json]        the bundle's skills; ● installed here
  skills install [<name>...] [--bundle <file|dir>]  install all, or the ones named
  skills install --repo <url> [--ref <tag>] [--path skills/<name>] [--name <skill>]   one skill from its own repository
  skills sync [--locked]                            install what .agents/skills.json declares, remove what it no longer does;
                                                    --locked installs the commits in the lock, as a session start should
  skills update [<name>...]                         fetch each installed skill again and reinstall it
  skills check                                      ✓ or ✗ per installed skill; exit 1 when one changed or is missing
  skills remove <name>...

  --workspace <dir>  the workspace (default: the git root, else the working directory)
  --from <folder>    install from copies on this machine, no network: a folder of skill folders or clones
  --copy             copy into .claude/skills instead of linking
  --dry-run          say what would be installed
  SKILLS_BASE_URL    clone from a mirror: <base>/<repository>.git

  Skills go to .agents/skills/<name>, linked from .claude/skills/<name> when .claude/ exists.
  The lock file is .agents/skills.lock.json; .agents/.skill-sources/ holds the clones (gitignore it).
  .agents/skills.json, committed, declares a workspace's skills:
    { "sources": [ { "bundle": "<repository>", "ref": "main", "skills": ["work"] },
                   { "repo": "<repository>", "ref": "<tag>", "name": "<skill>" },
                   { "folder": "skills/<skill>" } ] }`);
  },
};

const { pos, flags } = parseArgs(process.argv.slice(2));
const cmd = pos.shift() ?? "help";
if (flags.help || cmd === "help" || cmd === "-h") commands.help();
else if (!commands[cmd]) die(`unknown command "${cmd}". Try: skills help`);
else commands[cmd](pos, flags);
