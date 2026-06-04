#!/usr/bin/env node
// SPDX-FileCopyrightText: 2026 Dermot O'Brien
// SPDX-License-Identifier: Apache-2.0
//
// `aaa` launcher — a zero-dependency thin wrapper.
//
// AAA installs through the shared Node engine that ships with AAW (which AAA
// depends on). This launcher locates the sibling AAW bundle and delegates:
// `aaw install --framework <this AAA repo>`. No npm install / node_modules here.
//
//   aaa install          Wire AAA shims for detected tools (Claude/Cursor/Copilot/Gemini)
//   aaa install --seed    ...and scaffold the foundation (capabilities + building-blocks)
//   aaa --help

import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const HELP = `aaa — AI-Assisted Architecture installer

Usage:
  aaa install            Wire AAA command shims for detected AI tools
  aaa install --seed     ...and scaffold the foundation seed into this workspace
                         (capabilities/ + building-blocks/)
  aaa --help             Show this help

AAA depends on AAW: the .ai-assisted-work submodule must be present (it provides
the shared install engine).
`;

function findWorkspaceRoot(start) {
  let dir = path.resolve(start);
  for (;;) {
    if (existsSync(path.join(dir, ".git")) || existsSync(path.join(dir, ".aaw-config.yaml"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) return path.resolve(start);
    dir = parent;
  }
}

/** Locate the AAW install engine across: npm dependency, hoisted node_modules, then submodule. */
function resolveAawBin(workspaceRoot) {
  try {
    const pkg = createRequire(import.meta.url).resolve("ai-assisted-work/package.json");
    const bin = path.join(path.dirname(pkg), "bin", "aaw.js");
    if (existsSync(bin)) return bin;
  } catch {
    /* not an npm dep — try other layouts */
  }
  const hoisted = path.join(workspaceRoot, "node_modules", "ai-assisted-work", "bin", "aaw.js");
  if (existsSync(hoisted)) return hoisted;
  const submodule = path.join(workspaceRoot, ".ai-assisted-work", "bin", "aaw.js");
  if (existsSync(submodule)) return submodule;
  return undefined;
}

function main(argv) {
  const command = argv[0];
  if (command === "--help" || command === "-h" || command === "help") {
    process.stdout.write(HELP);
    return 0;
  }
  if (command !== undefined && command !== "install") {
    process.stderr.write(`Unknown command: ${command}\n\n${HELP}`);
    return 2;
  }

  const frameworkRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const workspaceRoot = findWorkspaceRoot(process.cwd());
  const aawBin = resolveAawBin(workspaceRoot);
  if (!aawBin) {
    process.stderr.write(
      "AAA requires AAW (it provides the shared install engine). Install it as an\n" +
        "npm dependency (npm i github:dermot-obrien/ai-assisted-work) or add the\n" +
        ".ai-assisted-work submodule, then re-run `aaa install`.\n",
    );
    return 1;
  }

  const passthrough = command === "install" ? argv.slice(1) : [];
  const result = spawnSync(
    "node",
    [aawBin, "install", "--framework", frameworkRoot, ...passthrough],
    { stdio: "inherit" },
  );
  return result.status ?? 1;
}

process.exit(main(process.argv.slice(2)));
