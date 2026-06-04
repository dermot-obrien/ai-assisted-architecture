#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0
//
// Cross-platform Node port of scripts/seed-foundation.ps1 (which was Windows-only
// PowerShell). Seeds the AAA foundation into a host workspace: reads the selected
// profile(s), copies the canonical capability registry + selected capability / ABB
// / SBB folders + the workspace manifest. Invoked by the shared install engine via
// the framework manifest's `seed:` block, but also runnable directly:
//
//   node .ai-assisted-architecture/src/seed-foundation.mjs --workspace . [--profile core] [--force] [--dry-run]
//
// Zero dependencies (no npm install needed): the profile `includes:` lists are
// parsed with the same line-based reader the PowerShell version used.

import { cpSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

function parseArgs(argv) {
  const out = { workspace: process.cwd(), profiles: ["core"], force: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--workspace") out.workspace = argv[++i] ?? out.workspace;
    else if (a === "--profile") out.profiles = (argv[++i] ?? "core").split(",").map((s) => s.trim());
    else if (a === "--force") out.force = true;
    else if (a === "--dry-run") out.dryRun = true;
  }
  if (out.profiles.includes("all") || out.profiles.includes("foundation")) {
    out.profiles = ["core", "integration", "infrastructure"];
  }
  return out;
}

/** Mirror of the PowerShell Get-ProfileIncludes: pull `- ID` items under a section of `includes:`. */
function getProfileIncludes(profileText, section) {
  const values = [];
  let inIncludes = false;
  let activeSection = "";
  for (const raw of profileText.split(/\r?\n/)) {
    const trim = raw.trim();
    if (trim === "" || trim.startsWith("#")) continue;
    if (trim === "includes:") {
      inIncludes = true;
      activeSection = "";
      continue;
    }
    if (!inIncludes) continue;
    if (/^[a-zA-Z_]+:\s*$/.test(trim)) {
      activeSection = trim.replace(/:\s*$/, "");
      continue;
    }
    const m = trim.match(/^-\s+(.+)$/);
    if (m && activeSection === section) values.push(m[1].trim());
  }
  return values;
}

function copySeedItem(src, dest, { force, dryRun }) {
  if (!existsSync(src)) {
    process.stderr.write(`  ! missing seed source: ${src}\n`);
    return false;
  }
  if (existsSync(dest) && !force) {
    process.stdout.write(`  = skip existing: ${path.basename(dest)}\n`);
    return false;
  }
  if (dryRun) {
    process.stdout.write(`  [dry-run] ${src} -> ${dest}\n`);
    return false;
  }
  mkdirSync(path.dirname(dest), { recursive: true });
  cpSync(src, dest, { recursive: true, force: true });
  return true;
}

function main() {
  const opts = parseArgs(process.argv.slice(2));
  const frameworkRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const foundationRoot = path.join(frameworkRoot, "foundation");
  const workspaceRoot = path.resolve(opts.workspace);

  if (!existsSync(foundationRoot)) throw new Error(`Foundation folder not found at: ${foundationRoot}`);
  if (!existsSync(workspaceRoot)) throw new Error(`Workspace root not found: ${workspaceRoot}`);
  if (workspaceRoot === frameworkRoot) {
    throw new Error("Workspace root points to the framework root — run from a workspace, not .ai-assisted-architecture.");
  }

  process.stdout.write(`  framework: ${frameworkRoot}\n  workspace: ${workspaceRoot}\n  profiles: ${opts.profiles.join(", ")}\n`);

  const capabilityIds = new Set();
  const abbIds = new Set();
  const sbbIds = new Set();
  for (const name of opts.profiles) {
    const profilePath = path.join(foundationRoot, "profiles", name, "profile.yaml");
    if (!existsSync(profilePath)) {
      process.stderr.write(`  ! profile not found: ${name} (${profilePath})\n`);
      continue;
    }
    const text = readFileSync(profilePath, "utf8");
    for (const id of getProfileIncludes(text, "capabilities")) capabilityIds.add(id);
    for (const id of getProfileIncludes(text, "architecture_building_blocks")) abbIds.add(id);
    for (const id of getProfileIncludes(text, "solution_building_blocks")) sbbIds.add(id);
  }

  const wsCaps = path.join(workspaceRoot, "capabilities");
  const wsAbb = path.join(workspaceRoot, "building-blocks", "architecture-building-blocks");
  const wsSbb = path.join(workspaceRoot, "building-blocks", "solution-building-blocks");
  if (!opts.dryRun) {
    for (const d of [wsCaps, wsAbb, wsSbb]) mkdirSync(d, { recursive: true });
  }

  // Canonical capability registry files + diagrams.
  const fCaps = path.join(foundationRoot, "capabilities");
  for (const f of ["capability-model.md", "capability-hierarchy.csv", "capability-abb-mapping.csv", "README.md"]) {
    copySeedItem(path.join(fCaps, f), path.join(wsCaps, f), opts);
  }
  copySeedItem(path.join(fCaps, "diagrams"), path.join(wsCaps, "diagrams"), opts);

  for (const id of capabilityIds) copySeedItem(path.join(fCaps, id), path.join(wsCaps, id), opts);
  const fAbb = path.join(foundationRoot, "building-blocks", "architecture-building-blocks");
  for (const id of abbIds) copySeedItem(path.join(fAbb, id), path.join(wsAbb, id), opts);
  const fSbb = path.join(foundationRoot, "building-blocks", "solution-building-blocks");
  for (const id of sbbIds) copySeedItem(path.join(fSbb, id), path.join(wsSbb, id), opts);

  copySeedItem(
    path.join(foundationRoot, "workspace-manifest.example.yaml"),
    path.join(workspaceRoot, "foundation-workspace.yaml"),
    opts,
  );

  process.stdout.write(
    `  seed complete — capabilities: ${capabilityIds.size}, ABBs: ${abbIds.size}, SBBs: ${sbbIds.size}\n`,
  );
}

main();
