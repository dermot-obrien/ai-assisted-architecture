# SPDX-FileCopyrightText: 2026 Dermot O'Brien
# SPDX-License-Identifier: Apache-2.0
"""Where the repository keeps the artefacts this skill reads.

The skill carries no layout of its own. The repository answers the contract in
`inputs.toml` in `[suite.aaa-rung]` of its `.agents/skill-bindings.toml`, and every
relative path resolves against that file's directory, never the working directory.
Every directory is optional: one left unset means the repository does not keep that kind,
and nothing is read for it. A path that is set but does not exist stops the run: a derived
rung computed over the wrong directory would look exactly like a real one.
"""
from __future__ import annotations

import os
import re

try:
    import tomllib
except ModuleNotFoundError:  # pragma: no cover - Python < 3.11
    tomllib = None

SUITE = "aaa-rung"
CONFIG_NAMES = (os.path.join(".agents", "skill-bindings.toml"), "skill-bindings.toml")
SKILL_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class BindingError(Exception):
    pass


def find(start: str) -> str | None:
    """The nearest bindings file, searching upward from start."""
    d = os.path.abspath(start if os.path.isdir(start) else os.path.dirname(start) or ".")
    while True:
        for n in CONFIG_NAMES:
            p = os.path.join(d, n)
            if os.path.isfile(p):
                return p
        parent = os.path.dirname(d)
        if parent == d:
            return None
        d = parent


def contract(skill_dir: str = SKILL_DIR) -> dict:
    p = os.path.join(skill_dir, "inputs.toml")
    if tomllib is None:
        raise BindingError("reading bindings needs Python 3.11 or newer (tomllib)")
    with open(p, "rb") as fh:
        return tomllib.load(fh)


class Bindings:
    def __init__(self, path: str, paths: dict, local_pattern: str, unbound: list | None = None):
        self.path = path
        self.root = os.path.dirname(os.path.abspath(path))
        self.paths = paths
        self.local_pattern = local_pattern
        self.unbound = list(unbound or [])

    def __getitem__(self, key):
        return self.paths[key]

    def to_dict(self):
        return {"bindingFile": self.path, "resolved": dict(self.paths),
                "unbound": list(self.unbound), "localPattern": self.local_pattern}


def load(path: str | None = None, start: str | None = None) -> Bindings:
    """Resolve [suite.aaa-rung] against its contract. Raises BindingError naming each problem."""
    if tomllib is None:
        raise BindingError("reading bindings needs Python 3.11 or newer (tomllib)")
    path = path or find(start or os.getcwd())
    if not path or not os.path.isfile(path):
        raise BindingError(
            "no .agents/skill-bindings.toml found above the working directory. Add "
            f"[suite.{SUITE}] to the repository's bindings file, or pass --bindings")
    try:
        with open(path, "rb") as fh:
            raw = tomllib.load(fh)
    except tomllib.TOMLDecodeError as ex:
        raise BindingError(f"{path} is not valid TOML: {ex}")

    # No section is the same as a section binding nothing: every kind is unbound.
    section = (raw.get("suite") or {}).get(SUITE) or {}

    options = contract().get("inputs", {}).get("options", {})
    root = os.path.dirname(os.path.abspath(path))
    problems, resolved, unbound = [], {}, []
    for key, spec in options.items():
        value = section.get(key)
        if value in (None, ""):
            if spec.get("required"):
                problems.append(f"[suite.{SUITE}] {key} is required: {spec.get('description', '').strip()}")
            elif spec.get("type") == "dir":
                unbound.append(key)
            continue
        if spec.get("type") in ("dir", "file", "path"):
            full = os.path.normpath(os.path.join(root, str(value)))
            if spec.get("type") == "dir" and not os.path.isdir(full):
                problems.append(f"[suite.{SUITE}] {key} = {value!r} resolves to {full}, which is not a directory")
            elif spec.get("type") == "file" and not os.path.isfile(full):
                problems.append(f"[suite.{SUITE}] {key} = {value!r} resolves to {full}, which is not a file")
            resolved[key] = full
        else:
            resolved[key] = value
    for key in section:
        if key not in options:
            problems.append(f"[suite.{SUITE}] {key} is not a key this skill declares")
    if problems:
        raise BindingError("\n".join(problems))

    local = str(section.get("localPattern") or (raw.get("model") or {}).get("local_pattern") or "[0-9]{1,3}")
    try:
        re.compile(local)
    except re.error as ex:
        raise BindingError(f"local pattern {local!r} is not a valid regex: {ex}")
    return Bindings(os.path.abspath(path), resolved, local, unbound)
