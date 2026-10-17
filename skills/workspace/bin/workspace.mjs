#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0
/**
 * workspace: initialise or reinitialise a repository that uses the architecture skills.
 * Run `workspace.mjs help`. Zero dependencies; Node 18+ and git.
 */
import path from "node:path";
import {
  applyClean, applyInstall, build, check, doctor, installSkillDependencies, isGitRepo, planClean, planInstall, regenerate, runInstaller,
} from "../src/workspace.mjs";

const USAGE = `workspace: initialise or reinitialise a repository that uses the architecture skills

  workspace.mjs doctor                   what is declared, installed, wired and left over; changes nothing
  workspace.mjs clean [--apply]          what retired tooling left behind, and the installed copies; a dry run without --apply
  workspace.mjs install [--force] [--declare vX.Y.Z] [--from <folder>] [--dry-run]
                                         write scripts/architecture.mjs and the installer, wire package.json and
                                         .gitignore, install the declared skills and their packages
  workspace.mjs regenerate               diagrams and decks from the pages; a missing skill is skipped in one line
  workspace.mjs check [args]             the continuum and cross-reference checks; a missing skill is skipped
  workspace.mjs build [--fresh]          npm ci when asked or missing, then npm run build
  workspace.mjs init [--dry-run] [--force] [--declare vX.Y.Z] [--from <folder>] [--no-build]
                                         clean --apply, install, build --fresh

  --repo <dir>   the repository (default: the working directory)
  --force        replace files and package.json scripts the skill did not write
  --declare      when .agents/skills.json is missing, declare the architecture-continuum bundle at that tag
  --from         install the skills from copies on this machine (the installer's --from)
  REGENERATE=0   build without regenerating; DECK_PDF=0 publishes decks without PDFs

  Exit 0 done, 1 a step failed, 2 usage or a problem to fix first.`;

const argv = process.argv.slice(2);
const cmd = argv[0];
const flags = { _: [] };
for (let i = 1; i < argv.length; i++) {
  const a = argv[i];
  if (["--repo", "--declare", "--from"].includes(a)) flags[a.slice(2)] = argv[++i];
  else if (a.startsWith("--") && ["apply", "dry-run", "force", "fresh", "no-build"].includes(a.slice(2))) flags[a.slice(2)] = true;
  else flags._.push(a);
}
if (!cmd || cmd === "help" || cmd === "--help" || cmd === "-h") {
  console.log(USAGE);
  process.exit(cmd ? 0 : 2);
}
const repo = path.resolve(flags.repo ?? process.cwd());
const dryRun = Boolean(flags["dry-run"]);

function needGit() {
  if (!isGitRepo(repo)) {
    console.error(`${repo} is not a git repository: clean removes only what git or the installer can give back, so it needs git`);
    process.exit(2);
  }
}

function cleanStep(apply) {
  needGit();
  const { actions, notes } = planClean(repo);
  console.log(`clean: ${actions.length ? `${actions.length} thing(s) to remove or edit` : "nothing left over"}`);
  if (apply) applyClean(repo, actions);
  else for (const a of actions) console.log(`  would ${a.op === "edit" ? "edit  " : "remove"} ${a.path}: ${a.why}`);
  for (const n of notes) console.log(`  note    ${n.path}: ${n.why}`);
  if (!apply && actions.length) console.log("  (a dry run: --apply removes them)");
}

function installStep() {
  const plan = planInstall(repo, { force: flags.force, declare: flags.declare });
  for (const p of plan.problems) console.error(`install: ${p}`);
  if (plan.problems.length) process.exit(2);
  console.log("install:");
  if (dryRun) {
    for (const w of plan.writes) console.log(`  would write ${w.path}: ${w.why}`);
    for (const [k, v] of Object.entries(plan.scripts)) console.log(`  would set script ${k}: ${v}`);
    if (plan.ignore.length) console.log(`  would ignore ${plan.ignore.join(", ")}`);
  } else applyInstall(repo, plan);
  for (const n of plan.notes) console.log(`  note    ${n.path}: ${n.why}`);
  if (dryRun) return console.log("  would install the declared skills, then their packages"), 0;
  const s = runInstaller(repo, { from: flags.from });
  if (s) return s;
  return installSkillDependencies(repo);
}

let status = 0;
switch (cmd) {
  case "doctor":
    doctor(repo);
    break;
  case "clean":
    cleanStep(Boolean(flags.apply) && !dryRun);
    break;
  case "install":
    status = installStep();
    break;
  case "regenerate":
    status = regenerate(repo);
    break;
  case "check":
    status = check(repo, { extra: flags._ });
    break;
  case "build":
    status = build(repo, { fresh: flags.fresh });
    break;
  case "init":
    cleanStep(!dryRun);
    status = installStep();
    if (!status && !dryRun && !flags["no-build"]) {
      console.log("build:");
      status = build(repo, { fresh: true });
    }
    if (!status) console.log(dryRun ? "init: a dry run; run it without --dry-run to make these changes" : "init: done; review git status, then commit what changed");
    break;
  default:
    console.error(`unknown command: ${cmd}\n\n${USAGE}`);
    process.exit(2);
}
process.exit(status);
