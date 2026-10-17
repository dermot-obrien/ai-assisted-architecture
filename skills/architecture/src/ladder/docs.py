# SPDX-FileCopyrightText: 2026 Dermot O'Brien
# SPDX-License-Identifier: Apache-2.0
"""Markdown artefacts: front matter, sections and tables, read the way the model skill reads them."""
from __future__ import annotations

import os
import re
from dataclasses import dataclass, field

from . import yamlish

COMMENT_RE = re.compile(r"<!--.*?-->", re.S)
FENCE_RE = re.compile(r"^\s*(```|~~~)")
ROW_RE = re.compile(r"^\s*\|(.*)\|\s*$")
SEP_RE = re.compile(r"^\s*\|[\s:|-]+\|\s*$")
LINK_RE = re.compile(r"\[([^\]]*)\]\([^)]*\)")


@dataclass
class Doc:
    path: str
    meta: dict
    body: str
    problems: list = field(default_factory=list)

    @property
    def id(self) -> str:
        return text(self.meta.get("id"))

    def get(self, key, default=None):
        return self.meta.get(key, default)


def text(value) -> str:
    """A scalar as a trimmed string; None, null and ~ are empty."""
    if value is None or isinstance(value, (list, dict)):
        return ""
    s = str(value).strip()
    return "" if s in ("null", "~", "Null", "NULL") else s


def as_list(value) -> list:
    """A front matter value that should be a list. A lone scalar becomes a one-item list."""
    if value is None:
        return []
    if isinstance(value, list):
        return value
    s = text(value)
    return [s] if s else []


def split(raw: str):
    """(front matter text or None, body). A leading HTML comment (a REUSE header) is skipped."""
    s = raw.lstrip("﻿").replace("\r\n", "\n")
    s = re.sub(r"^\s*<!--[\s\S]*?-->\s*", "", s, count=1) if s.lstrip().startswith("<!--") else s
    if not s.startswith("---\n"):
        return None, raw
    m = re.search(r"\n(---|\.\.\.)[ \t]*(\n|$)", s[3:])
    if not m:
        return None, raw
    return s[4:3 + m.start() + 1], s[3 + m.end():]


def read(path: str) -> Doc | None:
    """A Markdown file with front matter, or None when it has none."""
    try:
        with open(path, encoding="utf-8") as fh:
            raw = fh.read()
    except (OSError, UnicodeDecodeError):
        return None
    fm, body = split(raw)
    if fm is None:
        return None
    try:
        meta = yamlish.load(fm)
    except yamlish.YamlError as ex:
        return Doc(path, {}, body, [f"front matter is not valid YAML: {ex}"])
    if not isinstance(meta, dict):
        return Doc(path, {}, body, ["front matter is not a mapping"])
    return Doc(path, meta, body)


def scan(root: str) -> list:
    """Every Markdown document with front matter under root, in a stable order."""
    out = []
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = sorted(d for d in dirnames if not d.startswith(".") and d != "node_modules")
        for name in sorted(filenames):
            if name.lower().endswith((".md", ".mdx")):
                d = read(os.path.join(dirpath, name))
                if d is not None:
                    out.append(d)
    return out


def sections(body: str) -> list:
    """(level, title, content) for every heading outside code fences, comments removed."""
    body = COMMENT_RE.sub("", body)
    out, cur, fenced = [], None, False
    for ln in body.split("\n"):
        if FENCE_RE.match(ln):
            fenced = not fenced
        h = None if fenced else re.match(r"^(#{1,6})\s+(.*?)\s*#*\s*$", ln)
        if h:
            if cur:
                out.append(cur)
            cur = [len(h.group(1)), h.group(2).strip(), []]
        elif cur is not None:
            cur[2].append(ln)
    if cur:
        out.append(cur)
    return [(lv, t, "\n".join(b)) for lv, t, b in out]


def _cells(line: str) -> list:
    inner = ROW_RE.match(line).group(1)
    return [LINK_RE.sub(r"\1", c).strip().strip("`").strip() for c in inner.split("|")]


def tables(content: str) -> list:
    """Every table in a block, as lists of dicts keyed by header text."""
    out, rows, header = [], [], None
    for ln in content.split("\n"):
        if ROW_RE.match(ln):
            if SEP_RE.match(ln):
                continue
            c = _cells(ln)
            if header is None:
                header = c
            else:
                rows.append(dict(zip(header, c)))
        else:
            if header is not None:
                out.append(rows)
            header, rows = None, []
    if header is not None:
        out.append(rows)
    return out


def section_text(body: str, title_re: str) -> str | None:
    """The content under the first heading matching title_re (case-insensitive), or None."""
    rx = re.compile(title_re, re.I)
    for _lv, title, content in sections(body):
        if rx.search(title):
            return content
    return None
