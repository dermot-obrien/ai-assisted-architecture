#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0
"""Name the endpoints in a pattern's Interfaces table.

A Provider or Consumer cell holding only an identifier ("ABB-017", "04") is rewritten as
the identifier followed by the name its Building Blocks row gives it ("ABB-017 Context
Retrieval Service", "04 Identity provider"). The model reads only the leading identifier,
so the diagram, validation and the walkthrough are unchanged; the document and every deck
built from it become readable without a lookup.

    python name-endpoints.py <file-or-folder>... [--check]

A folder is searched recursively for Markdown. --check changes nothing and exits 1 when
any cell would change. A cell that already carries a name, or whose identifier has no
Building Blocks row, is left as it is; the second is reported.
"""
import argparse
import os
import re
import sys

ID = r"(?:[A-Z][A-Z0-9]*-\d+(?:\.\d+)*|\d{1,3})"
ID_ONLY = re.compile(rf"^\s*({ID})\s*$")
ID_LEAD = re.compile(rf"^\s*({ID})\s+(\S.*?)\s*$")
HEADING = re.compile(r"^(#{2,6})\s+(.*?)\s*#*\s*$")
ROW = re.compile(r"^\s*\|(.*)\|\s*$")
SEP = re.compile(r"^\s*\|[\s:|-]+\|\s*$")
FENCE = re.compile(r"^\s*(```|~~~)")
BLOCK_SECTIONS = {"building blocks", "required building blocks"}
ENDPOINT_COLUMNS = {"provider", "consumer"}


def cells(line):
    return [c.strip() for c in ROW.match(line).group(1).split("|")]


def tables(lines):
    """Yield (section, header, [(line index, cells)]) for every table outside code fences."""
    section, fenced, i = "", False, 0
    while i < len(lines):
        line = lines[i]
        if FENCE.match(line):
            fenced = not fenced
        elif not fenced and HEADING.match(line):
            section = HEADING.match(line).group(2).strip().lower()
        elif (not fenced and ROW.match(line) and i + 1 < len(lines) and SEP.match(lines[i + 1])):
            header, rows, i = cells(line), [], i + 2
            while i < len(lines) and ROW.match(lines[i]):
                rows.append((i, cells(lines[i])))
                i += 1
            yield section, header, rows
            continue
        i += 1


def names(lines):
    """Identifier to name, from the first column of every Building Blocks table."""
    out = {}
    for section, _, rows in tables(lines):
        if section in BLOCK_SECTIONS:
            for _, row in rows:
                m = ID_LEAD.match(row[0]) if row else None
                if m:
                    out.setdefault(m.group(1), m.group(2))
    return out


def fix(text):
    """Return (new text, number of cells named, identifiers with no row)."""
    lines = text.split("\n")
    known, named, unknown = names(lines), 0, set()
    for section, header, rows in tables(lines):
        if section != "interfaces":
            continue
        cols = [k for k, h in enumerate(header) if h.lower() in ENDPOINT_COLUMNS]
        for idx, row in rows:
            if "\\|" in lines[idx]:
                continue  # an escaped pipe would not survive the split and rejoin
            changed = False
            for k in cols:
                m = ID_ONLY.match(row[k]) if k < len(row) else None
                if not m:
                    continue
                if m.group(1) in known:
                    row[k] = f"{m.group(1)} {known[m.group(1)]}"
                    named, changed = named + 1, True
                else:
                    unknown.add(m.group(1))
            if changed:
                lines[idx] = "| " + " | ".join(row) + " |"
    return "\n".join(lines), named, sorted(unknown)


def markdown(paths):
    for p in paths:
        if os.path.isdir(p):
            for root, dirs, files in os.walk(p):
                dirs[:] = sorted(d for d in dirs if not d.startswith(".") and d not in ("node_modules", "dist"))
                for f in sorted(files):
                    if f.endswith((".md", ".mdx")):
                        yield os.path.join(root, f)
        else:
            yield p


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("paths", nargs="+")
    ap.add_argument("--check", action="store_true", help="change nothing; exit 1 if any cell would change")
    a = ap.parse_args()
    total = 0
    for path in markdown(a.paths):
        with open(path, encoding="utf-8", newline="") as f:
            text = f.read()
        eol = "\r\n" if "\r\n" in text else "\n"
        new, named, unknown = fix(text.replace("\r\n", "\n"))
        for u in unknown:
            print(f"  ! {path}: {u} is an interface endpoint with no Building Blocks row", file=sys.stderr)
        if not named:
            continue
        total += named
        print(f"  {'would name' if a.check else 'named'} {named} endpoint(s) in {path}")
        if not a.check:
            with open(path, "w", encoding="utf-8", newline="") as f:
                f.write(new.replace("\n", eol))
    if a.check and total:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
