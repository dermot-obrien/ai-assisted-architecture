#!/usr/bin/env bun
/**
 * seed-foundation.ts — Bun/TypeScript port of seed-foundation.ps1
 *
 * Seeds a workspace from .ai-assisted-architecture/foundation/ by copying
 * canonical capability registry files, capability folders, ABB folders,
 * and SBB folders from the requested profiles.
 *
 * macOS / Linux / Windows compatible — requires Bun 1.0+.
 *
 * Usage:
 *   bun .ai-assisted-architecture/scripts/seed-foundation.ts
 *   bun .ai-assisted-architecture/scripts/seed-foundation.ts --profile core
 *   bun .ai-assisted-architecture/scripts/seed-foundation.ts --profile core --profile integration
 *   bun .ai-assisted-architecture/scripts/seed-foundation.ts --profile core,integration
 *   bun .ai-assisted-architecture/scripts/seed-foundation.ts --profile all --force
 *   bun .ai-assisted-architecture/scripts/seed-foundation.ts --profile core --dry-run
 *
 * Run from the workspace root (the directory containing capabilities/ and
 * building-blocks/), or pass --workspace-root explicitly.
 */

import {
  existsSync,
  mkdirSync,
  copyFileSync,
  cpSync,
  rmSync,
  readFileSync,
} from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// ─── CLI argument parsing ──────────────────────────────────────────────────

interface Args {
  profiles: string[];
  workspaceRoot: string;
  force: boolean;
  dryRun: boolean;
  help: boolean;
}

const VALID_PROFILES = new Set([
  "core",
  "integration",
  "infrastructure",
  "all",
  "foundation",
]);

function parseArgs(argv: string[]): Args {
  const args: Args = {
    profiles: [],
    workspaceRoot: process.cwd(),
    force: false,
    dryRun: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];

    if (a === "--profile" || a === "-p") {
      const next = argv[++i];
      if (!next) throw new Error("--profile requires a value");
      args.profiles.push(...splitCsv(next));
    } else if (a.startsWith("--profile=")) {
      args.profiles.push(...splitCsv(a.slice("--profile=".length)));
    } else if (a === "--workspace-root" || a === "-w") {
      const next = argv[++i];
      if (!next) throw new Error("--workspace-root requires a value");
      args.workspaceRoot = next;
    } else if (a.startsWith("--workspace-root=")) {
      args.workspaceRoot = a.slice("--workspace-root=".length);
    } else if (a === "--force" || a === "-f") {
      args.force = true;
    } else if (a === "--dry-run" || a === "-n") {
      args.dryRun = true;
    } else if (a === "--help" || a === "-h") {
      args.help = true;
    } else {
      console.error(`Unknown argument: ${a}`);
      args.help = true;
    }
  }

  if (args.profiles.length === 0) {
    args.profiles = ["core"];
  }

  for (const p of args.profiles) {
    if (!VALID_PROFILES.has(p)) {
      throw new Error(
        `Invalid profile: '${p}'. Valid: ${[...VALID_PROFILES].join(", ")}`,
      );
    }
  }

  return args;
}

function splitCsv(s: string): string[] {
  return s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function printHelp(): void {
  console.log(`seed-foundation.ts — Seed a workspace from foundation/ profiles

Usage:
  bun seed-foundation.ts [options]

Options:
  -p, --profile <name>          Profile to seed. Repeatable or comma-separated.
                                Valid: core, integration, infrastructure,
                                       foundation (alias: all)
                                Default: core
  -w, --workspace-root <path>   Workspace root (default: current directory)
  -f, --force                   Overwrite existing files
  -n, --dry-run                 Print actions without making changes
  -h, --help                    Show this help

Examples:
  bun .ai-assisted-architecture/scripts/seed-foundation.ts
  bun .ai-assisted-architecture/scripts/seed-foundation.ts -p core,integration
  bun .ai-assisted-architecture/scripts/seed-foundation.ts -p all --force
  bun .ai-assisted-architecture/scripts/seed-foundation.ts -p core --dry-run
`);
}

// ─── Profile YAML parser (line-based, matches PS version semantics) ───────
//
// Profile YAML structure is fixed and shallow. We don't need a full YAML
// parser — just extract list items under specific section headers inside
// the `includes:` block. This avoids adding any dependency.

function getProfileIncludes(
  profileFilePath: string,
  sectionName: string,
): string[] {
  if (!existsSync(profileFilePath)) {
    throw new Error(`Profile file not found: ${profileFilePath}`);
  }

  const lines = readFileSync(profileFilePath, "utf-8").split(/\r?\n/);
  const values: string[] = [];
  let inIncludes = false;
  let activeSection = "";

  for (const line of lines) {
    const trim = line.trim();
    if (!trim || trim.startsWith("#")) continue;

    if (trim === "includes:") {
      inIncludes = true;
      activeSection = "";
      continue;
    }

    if (!inIncludes) continue;

    // Section header on its own line: "capabilities:"
    if (/^[a-zA-Z_]+:\s*$/.test(trim)) {
      activeSection = trim.replace(/:$/, "");
      continue;
    }

    // List item: "- VALUE"
    const m = trim.match(/^- (.+)$/);
    if (m && activeSection === sectionName) {
      values.push(m[1].trim());
    }
  }

  return values;
}

// ─── File copy with skip-existing / force / dry-run semantics ─────────────

interface CopyContext {
  force: boolean;
  dryRun: boolean;
}

type CopyResult = "copied" | "skipped" | "missing" | "dryrun";

function copySeedItem(
  sourcePath: string,
  destPath: string,
  isDirectory: boolean,
  ctx: CopyContext,
): CopyResult {
  if (!existsSync(sourcePath)) {
    console.warn(`⚠ Missing seed source: ${sourcePath}`);
    return "missing";
  }

  if (existsSync(destPath) && !ctx.force) {
    console.log(`Skip existing: ${destPath}`);
    return "skipped";
  }

  if (ctx.dryRun) {
    console.log(`[DryRun] Copy ${sourcePath} -> ${destPath}`);
    return "dryrun";
  }

  const destParent = dirname(destPath);
  if (destParent) {
    mkdirSync(destParent, { recursive: true });
  }

  if (isDirectory && existsSync(destPath) && ctx.force) {
    rmSync(destPath, { recursive: true, force: true });
  }

  if (isDirectory) {
    cpSync(sourcePath, destPath, { recursive: true, force: true });
  } else {
    copyFileSync(sourcePath, destPath);
  }

  console.log(`Copied: ${destPath}`);
  return "copied";
}

// ─── Main ─────────────────────────────────────────────────────────────────

function main(): void {
  let args: Args;
  try {
    args = parseArgs(process.argv.slice(2));
  } catch (e) {
    console.error(`Error: ${(e as Error).message}`);
    printHelp();
    process.exit(2);
  }

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  // Resolve framework root from this script's location: scripts/seed-foundation.ts → ..
  const scriptPath = fileURLToPath(import.meta.url);
  const frameworkRoot = resolve(dirname(scriptPath), "..");
  const foundationRoot = join(frameworkRoot, "foundation");
  const workspaceRootAbs = resolve(args.workspaceRoot);

  if (!existsSync(foundationRoot)) {
    throw new Error(`Foundation folder not found at: ${foundationRoot}`);
  }

  if (!existsSync(workspaceRootAbs)) {
    throw new Error(`Workspace root not found: ${workspaceRootAbs}`);
  }

  if (workspaceRootAbs === frameworkRoot) {
    throw new Error(
      "Workspace root points to framework root. Run this script from a workspace, not from .ai-assisted-architecture.",
    );
  }

  // Resolve profile aliases (all/foundation = core + integration + infrastructure)
  let selectedProfiles: string[];
  if (args.profiles.includes("all") || args.profiles.includes("foundation")) {
    selectedProfiles = ["core", "integration", "infrastructure"];
  } else {
    selectedProfiles = [...new Set(args.profiles)];
  }

  console.log(`Framework root: ${frameworkRoot}`);
  console.log(`Workspace root: ${workspaceRootAbs}`);
  console.log(`Profiles: ${selectedProfiles.join(", ")}`);
  if (args.dryRun) console.log("Mode: DryRun");
  else if (args.force) console.log("Mode: Force overwrite");
  console.log("");

  // Aggregate IDs across all selected profiles
  const capabilityIds = new Set<string>();
  const abbIds = new Set<string>();
  const sbbIds = new Set<string>();

  for (const profileName of selectedProfiles) {
    const profilePath = join(
      foundationRoot,
      "profiles",
      profileName,
      "profile.yaml",
    );
    if (!existsSync(profilePath)) {
      console.warn(`⚠ Profile not found: ${profileName} (${profilePath})`);
      continue;
    }

    for (const id of getProfileIncludes(profilePath, "capabilities")) {
      capabilityIds.add(id);
    }
    for (const id of getProfileIncludes(profilePath, "architecture_building_blocks")) {
      abbIds.add(id);
    }
    for (const id of getProfileIncludes(profilePath, "solution_building_blocks")) {
      sbbIds.add(id);
    }
  }

  const workspaceCapabilitiesRoot = join(workspaceRootAbs, "capabilities");
  const workspaceAbbRoot = join(
    workspaceRootAbs,
    "building-blocks/architecture-building-blocks",
  );
  const workspaceSbbRoot = join(
    workspaceRootAbs,
    "building-blocks/solution-building-blocks",
  );

  if (!args.dryRun) {
    mkdirSync(workspaceCapabilitiesRoot, { recursive: true });
    mkdirSync(workspaceAbbRoot, { recursive: true });
    mkdirSync(workspaceSbbRoot, { recursive: true });
  }

  const ctx: CopyContext = { force: args.force, dryRun: args.dryRun };

  // ─── Capability registry files (always seeded) ────────
  const foundationCapabilitiesRoot = join(foundationRoot, "capabilities");
  const seedCapabilityFiles = [
    "capability-model.md",
    "capability-hierarchy.csv",
    "capability-abb-mapping.csv",
    "README.md",
  ];

  for (const fileName of seedCapabilityFiles) {
    copySeedItem(
      join(foundationCapabilitiesRoot, fileName),
      join(workspaceCapabilitiesRoot, fileName),
      false,
      ctx,
    );
  }

  // Capability diagrams folder
  copySeedItem(
    join(foundationCapabilitiesRoot, "diagrams"),
    join(workspaceCapabilitiesRoot, "diagrams"),
    true,
    ctx,
  );

  // ─── Capability folders ───────────────────────────────
  for (const capId of capabilityIds) {
    copySeedItem(
      join(foundationCapabilitiesRoot, capId),
      join(workspaceCapabilitiesRoot, capId),
      true,
      ctx,
    );
  }

  // ─── ABB folders ──────────────────────────────────────
  const foundationAbbRoot = join(
    foundationRoot,
    "building-blocks/architecture-building-blocks",
  );
  for (const abbId of abbIds) {
    copySeedItem(
      join(foundationAbbRoot, abbId),
      join(workspaceAbbRoot, abbId),
      true,
      ctx,
    );
  }

  // ─── SBB folders ──────────────────────────────────────
  const foundationSbbRoot = join(
    foundationRoot,
    "building-blocks/solution-building-blocks",
  );
  for (const sbbId of sbbIds) {
    copySeedItem(
      join(foundationSbbRoot, sbbId),
      join(workspaceSbbRoot, sbbId),
      true,
      ctx,
    );
  }

  // ─── Workspace manifest example ───────────────────────
  copySeedItem(
    join(foundationRoot, "workspace-manifest.example.yaml"),
    join(workspaceRootAbs, "foundation-workspace.yaml"),
    false,
    ctx,
  );

  console.log("");
  console.log("Seed complete.");
  console.log(`Capabilities: ${capabilityIds.size}`);
  console.log(`ABBs:         ${abbIds.size}`);
  console.log(`SBBs:         ${sbbIds.size}`);
  console.log(
    "Workspace content is canonical. Framework foundation is fallback/read-only.",
  );
}

main();
