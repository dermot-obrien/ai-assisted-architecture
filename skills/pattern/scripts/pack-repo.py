#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0
"""Assemble this skill into a standalone, publishable git repository.

The installed shape and the published shape differ on purpose:

    installed   .agents/skills/model/SKILL.md      (name must match the parent directory)
    published   model/skills/model/SKILL.md

Nesting the payload under skills/ keeps repo scaffolding out of the directory that lands
in every consumer's context window, and it is the layout the install tooling expects:
`gh skill install owner/repo model`, `npx skills add owner/repo/skills/model` and
`gemini skills install <url> --path skills/model` all resolve it.

Usage:
  python scripts/pack-repo.py --owner patternode --out ../../../../model
"""
from __future__ import annotations

import argparse
import json
import os
import shutil

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL_DIR = os.path.dirname(HERE)
NAME = os.path.basename(SKILL_DIR)

# Belongs to the repository, not to the portable payload.
REPO_ONLY = {"README.md", "CHANGELOG.md", ".gitignore", ".gitattributes"}
NEVER = {"__pycache__", ".git", ".tmp", "dist", ".pytest_cache"}


def version() -> str:
    """Read the version out of SKILL.md frontmatter; this skill is content, not code."""
    for line in open(os.path.join(SKILL_DIR, "SKILL.md"), encoding="utf-8"):
        if line.strip().startswith("version:"):
            return line.split(":", 1)[1].strip().strip('"').strip("'")
    return "0.0.0"


def copy_tree(src, dst, skip_rel=()):
    for root, dirs, files in os.walk(src):
        dirs[:] = [d for d in dirs if d not in NEVER]
        for f in files:
            full = os.path.join(root, f)
            rel = os.path.relpath(full, src).replace(os.sep, "/")
            if rel in REPO_ONLY or rel in skip_rel:
                continue
            out = os.path.join(dst, rel)
            os.makedirs(os.path.dirname(out), exist_ok=True)
            shutil.copy2(full, out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", default=os.path.join(SKILL_DIR, ".tmp", "packed"))
    ap.add_argument("--owner", default="OWNER")
    ap.add_argument("--repo")
    a = ap.parse_args()

    v = version()
    out_root = os.path.abspath(a.out)
    repo_url = a.repo or f"https://github.com/{a.owner}/{NAME}"

    if os.path.exists(out_root):
        shutil.rmtree(out_root)
    payload = os.path.join(out_root, "skills", NAME)
    os.makedirs(payload, exist_ok=True)

    # 1. The portable payload. LICENSE stays inside it so a copied directory is
    #    legally self-sufficient, which is what published skills do.
    copy_tree(SKILL_DIR, payload, skip_rel=("scripts/pack-repo.py",))

    # 2. Repo-level files.
    for f in REPO_ONLY:
        src = os.path.join(SKILL_DIR, f)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(out_root, f))
    shutil.copy2(os.path.join(SKILL_DIR, "LICENSE"), os.path.join(out_root, "LICENSE"))
    os.makedirs(os.path.join(out_root, "LICENSES"), exist_ok=True)
    shutil.copy2(os.path.join(SKILL_DIR, "LICENSE"),
                 os.path.join(out_root, "LICENSES", "Apache-2.0.txt"))

    # 3. Claude Code plugin and marketplace. The only distribution route that resolves
    #    dependencies between skills, so it is worth shipping even with none declared.
    pdir = os.path.join(out_root, ".claude-plugin")
    os.makedirs(pdir, exist_ok=True)
    desc = ("Author an architecture pattern at any scope: the document, the diagram generated from "
            "its tables, the scenario overlays, and the published deck.")
    write_json(os.path.join(pdir, "plugin.json"), {
        "name": NAME,
        "displayName": "Pattern",
        "version": v,
        "description": desc,
        "author": {"name": a.owner, "url": f"https://github.com/{a.owner}"},
        "repository": repo_url,
        "license": "Apache-2.0",
        "keywords": ["architecture", "pattern", "reference-architecture", "togaf", "c4"],
        "skills": "./skills/",
        "dependencies": ["model", "markdown-deck"],
    })
    write_json(os.path.join(pdir, "marketplace.json"), {
        "name": f"{a.owner}-skills",
        "owner": {"name": a.owner},
        "plugins": [{
            "name": NAME, "source": "./", "description": desc, "version": v,
            "category": "documentation", "tags": ["architecture", "documentation"],
        }],
    })

    n = sum(len(f) for _r, _d, f in os.walk(out_root))
    print(f"  packed {NAME} v{v} -> {out_root}")
    print(f"  {n} files; payload at skills/{NAME}/")
    print("")
    print("  next:")
    print(f"    cd {out_root}")
    print(f'    git init && git add -A && git commit -m "{NAME} {v}"')
    print(f"    git remote add origin {repo_url}.git && git push -u origin main")
    print(f"    git tag v{v} && git push --tags")


def write_json(path, obj):
    with open(path, "w", encoding="utf-8", newline="\n") as fh:
        json.dump(obj, fh, indent=2, ensure_ascii=False)
        fh.write("\n")


if __name__ == "__main__":
    main()
