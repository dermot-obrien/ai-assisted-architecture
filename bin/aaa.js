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
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import process from "node:process";
import { createInterface } from "node:readline/promises";
import { fileURLToPath } from "node:url";

const HELP = `aaa — AI-Assisted Architecture installer

Usage:
  aaa install [--workspace PATH]
                         Wire AAA command shims for detected AI tools
  aaa install --seed     ...and scaffold the foundation seed into this workspace
                         (capabilities/ + building-blocks/)
  aaa --help             Show this help

AAA depends on AAW: install AAW into the target workspace first. AAA resolves
AAW from that workspace's .aaw-config.yaml when available, then falls back to
local conventions such as .ai-assisted-work.
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

function workspaceArg(args) {
  const i = args.indexOf("--workspace");
  if (i === -1) return void 0;
  const value = args[i + 1];
  if (value === void 0 || value.startsWith("--")) {
    throw new Error("--workspace requires a path argument");
  }
  return path.resolve(process.cwd(), value);
}

async function resolveWorkspaceRoot(args) {
  const explicit = workspaceArg(args);
  if (explicit) return explicit;

  const detected = findWorkspaceRoot(process.cwd());
  if (!process.stdin.isTTY || !process.stdout.isTTY) return detected;

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const answer = (await rl.question(`Install into workspace [${detected}]: `)).trim();
    return answer === "" ? detected : path.resolve(process.cwd(), answer);
  } finally {
    rl.close();
  }
}

function recordedAawBin(workspaceRoot) {
  const configPath = path.join(workspaceRoot, ".aaw-config.yaml");
  if (!existsSync(configPath)) return void 0;
  try {
    const text = readFileSync(configPath, "utf8");
    const match = text.match(/(?:^|\n)modules:\s*\n(?:^[ \t].*\n)*?^[ \t]+aaw:\s*\n(?:^[ \t].*\n)*?^[ \t]+source_root:\s*([^\n]+)/m);
    if (!match) return void 0;
    const raw = match[1].trim().replace(/^['"]|['"]$/g, "");
    if (raw === "") return void 0;
    const sourceRoot = path.resolve(workspaceRoot, raw);
    const bin = path.join(sourceRoot, "bin", "aaw.js");
    return existsSync(bin) ? bin : void 0;
  } catch {
    return void 0;
  }
}

/** Locate the AAW install engine across: npm dependency, hoisted node_modules, then a workspace-local clone. */
function resolveAawBin(workspaceRoot) {
  try {
    const pkg = createRequire(import.meta.url).resolve("ai-assisted-work/package.json");
    const bin = path.join(path.dirname(pkg), "bin", "aaw.js");
    if (existsSync(bin)) return bin;
  } catch {
    /* not an npm dep — try other layouts */
  }
  const recorded = recordedAawBin(workspaceRoot);
  if (recorded) return recorded;
  const hoisted = path.join(workspaceRoot, "node_modules", "ai-assisted-work", "bin", "aaw.js");
  if (existsSync(hoisted)) return hoisted;
  const localClone = path.join(workspaceRoot, ".ai-assisted-work", "bin", "aaw.js");
  if (existsSync(localClone)) return localClone;
  return undefined;
}

async function main(argv) {
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
  const passthrough = command === "install" ? argv.slice(1) : [];
  const workspaceRoot = await resolveWorkspaceRoot(passthrough);
  const aawBin = resolveAawBin(workspaceRoot);
  if (!aawBin) {
    process.stderr.write(
      "AAA requires AAW (it provides the shared install engine). Install AAW into\n" +
        "this target workspace first, or ensure .aaw-config.yaml records\n" +
        "modules.aaw.source_root, then re-run `aaa install`.\n",
    );
    return 1;
  }

  const result = spawnSync(
    "node",
    [aawBin, "install", "--framework", frameworkRoot, "--workspace", workspaceRoot, ...passthrough],
    { stdio: "inherit" },
  );
  return result.status ?? 1;
}

main(process.argv.slice(2)).then((code) => process.exit(code));
