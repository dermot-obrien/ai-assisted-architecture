#!/usr/bin/env python3
# SPDX-FileCopyrightText: 2026 Dermot O'Brien
# SPDX-License-Identifier: Apache-2.0
"""Post-install check for aaa-rung (DD-11 of AI-Assisted Work).

Run from the workspace root, with SKILL_DIR set to the installed skill's directory:

    python bin/check.py

Resolves [suite.aaa-rung] of the workspace's .agents/skill-bindings.toml the way
`rung.py --doctor` does: the file must exist, and every directory it binds must exist.
PyYAML is optional, since a built-in parser reads front matter without it, so its absence
is a warning.

Exit 0: correct (warnings may be printed). Exit 1: problems, one line each.
Exit 2: usage or environment error. Offline and read-only.

`--doctor` keeps its own exit codes; this is the check an installer runs.
"""
import importlib.util
import os
import sys

if sys.version_info < (3, 11):
    print(f"Python {sys.version.split()[0]} is too old: aaa-rung needs 3.11 or newer.", file=sys.stderr)
    sys.exit(2)
if len(sys.argv) > 1:
    print("usage: check.py   (run from the workspace root; takes no arguments)", file=sys.stderr)
    sys.exit(2)

SKILL_DIR = os.path.abspath(os.environ.get("SKILL_DIR")
                            or os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.join(SKILL_DIR, "src"))
from aaa_rung import bindings  # noqa: E402

problems = []
if importlib.util.find_spec("yaml") is None:
    print("warning: PyYAML is not installed; the built-in front matter parser is used instead.")
try:
    b = bindings.load(None)
except bindings.BindingError as ex:
    problems = [line.strip() for line in str(ex).split("\n") if line.strip()]
else:
    if not b.paths:
        print(f"warning: {b.path}: [suite.aaa-rung] binds no directory, so every capability derives "
              f"from nothing. Bind capabilityDir at least.")

for p in problems:
    print(p)
if not problems:
    print("aaa-rung: ok")
sys.exit(1 if problems else 0)
