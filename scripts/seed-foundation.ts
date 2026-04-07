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
 *   bun .ai-assisted-architecture/scripts/seed-foundation.ts --all
 *   bun .ai-assisted-architecture/scripts/seed-foundation.ts --profile all --force
 *   bun .ai-assisted-architecture/scripts/seed-foundation.ts --profile core --dry-run
 *
 * Two modes:
 *   • Targeted profile slice (--profile core|integration|infrastructure):
 *     copies only the capabilities/ABBs/SBBs listed in that profile.yaml.
 *   • All dimensions (--all  OR  --profile all  OR  --profile foundation):
 *     walks every foundation seed_path declared in foundation-manifest.yaml
 *     and copies every artefact (outcomes, use cases, platforms, contexts,
 *     capabilities, ABBs, SBBs). Use this for new workspaces so AI agents
 *     have the full reference architecture available locally.
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
  readdirSync,
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
  all: boolean;
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
    all: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];

    if (a === "--profile" || a === "-p") {
      const next = argv[++i];
      if (!next) throw new Error("--profile requires a value");
      args.profiles.push(...splitCsv(next));
    } else if (a.startsWith("--profile=")) {
      args.profiles.push(...splitCsv(a.slice("--profile=".length)));
    } else if (a === "--all" || a === "-a") {
      args.all = true;
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
  console.log(`seed-foundation.ts — Seed a workspace from foundation/

Usage:
  bun seed-foundation.ts [options]

Modes:
  Targeted profile slice — copies only the capabilities/ABBs/SBBs listed in
  the named profile.yaml. Use this for narrow, controlled seeding.

  All dimensions — walks every foundation seed_path (outcomes, use cases,
  platforms, contexts, capabilities, ABBs, SBBs) and copies every artefact.
  Use this for new workspaces so AI agents have the full reference
  architecture available locally. Triggered by --all OR --profile all OR
  --profile foundation.

Options:
  -p, --profile <name>          Profile to seed. Repeatable or comma-separated.
                                Valid: core, integration, infrastructure,
                                       all (= every dimension; alias: foundation)
                                Default: core
  -a, --all                     Seed every dimension (same as --profile all)
  -w, --workspace-root <path>   Workspace root (default: current directory)
  -f, --force                   Overwrite existing files
  -n, --dry-run                 Print actions without making changes
  -h, --help                    Show this help

Examples:
  bun .ai-assisted-architecture/scripts/seed-foundation.ts
  bun .ai-assisted-architecture/scripts/seed-foundation.ts -p core,integration
  bun .ai-assisted-architecture/scripts/seed-foundation.ts --all --dry-run
  bun .ai-assisted-architecture/scripts/seed-foundation.ts --all --force
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

// ─── All-dimensions walk (--all / --profile all / --profile foundation) ──
//
// Mirrors the seed_paths block in foundation/foundation-manifest.yaml.
// When the user requests "all dimensions", we ignore profile lists and walk
// each foundation subtree directly, copying every child folder/file.
// Skip-existing semantics still apply per child.

interface DimensionSpec {
  subpath: string;
  label: string;
}

const ALL_DIMENSIONS: DimensionSpec[] = [
  { subpath: "strategy/outcomes", label: "outcomes" },
  { subpath: "strategy/use-cases", label: "use cases" },
  { subpath: "platforms", label: "platforms" },
  { subpath: "contexts", label: "contexts" },
  { subpath: "capabilities", label: "capabilities" },
  { subpath: "building-blocks/architecture-building-blocks", label: "ABBs" },
  { subpath: "building-blocks/solution-building-blocks", label: "SBBs" },
];

function seedAllDimensions(
  foundationRoot: string,
  workspaceRoot: string,
  ctx: CopyContext,
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const dim of ALL_DIMENSIONS) {
    const srcRoot = join(foundationRoot, dim.subpath);
    const dstRoot = join(workspaceRoot, dim.subpath);

    if (!existsSync(srcRoot)) {
      console.warn(`⚠ Foundation dimension missing on disk: ${dim.subpath}`);
      counts[dim.label] = 0;
      continue;
    }

    if (!ctx.dryRun) {
      mkdirSync(dstRoot, { recursive: true });
    }

    let copied = 0;
    for (const entry of readdirSync(srcRoot, { withFileTypes: true })) {
      if (entry.name.startsWith(".")) continue;
      const src = join(srcRoot, entry.name);
      const dst = join(dstRoot, entry.name);
      const result = copySeedItem(src, dst, entry.isDirectory(), ctx);
      if (result === "copied" || result === "dryrun") copied++;
    }
    counts[dim.label] = copied;
  }

  return counts;
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

  // Decide whether to run in "all dimensions" mode or per-profile slice mode.
  // --all OR --profile all OR --profile foundation → walk every foundation
  // seed_path. Otherwise → per-profile capabilities/ABBs/SBBs slice.
  const allDimensionsMode =
    args.all ||
    args.profiles.includes("all") ||
    args.profiles.includes("foundation");

  if (allDimensionsMode) {
    console.log(`Framework root: ${frameworkRoot}`);
    console.log(`Workspace root: ${workspaceRootAbs}`);
    console.log("Mode: ALL DIMENSIONS — every artefact in foundation/");
    if (args.dryRun) console.log("       (DryRun)");
    else if (args.force) console.log("       (Force overwrite)");
    console.log("");

    if (!args.dryRun) {
      mkdirSync(workspaceRootAbs, { recursive: true });
    }

    const ctx: CopyContext = { force: args.force, dryRun: args.dryRun };
    const counts = seedAllDimensions(foundationRoot, workspaceRootAbs, ctx);

    // Drop the workspace manifest example if the workspace doesn't have one.
    copySeedItem(
      join(foundationRoot, "workspace-manifest.example.yaml"),
      join(workspaceRootAbs, "foundation-workspace.yaml"),
      false,
      ctx,
    );

    console.log("");
    console.log("Seed complete (all dimensions).");
    for (const dim of ALL_DIMENSIONS) {
      const n = counts[dim.label] ?? 0;
      console.log(`  ${dim.label.padEnd(13)} ${n}`);
    }
    console.log(
      "Workspace content is canonical. Framework foundation is fallback/read-only.",
    );
    return;
  }

  // ── Per-profile slice mode ────────────────────────────────────────────
  const selectedProfiles = [...new Set(args.profiles)];

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
