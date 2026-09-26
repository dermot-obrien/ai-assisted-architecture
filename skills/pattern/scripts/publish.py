#!/usr/bin/env python3
# SPDX-License-Identifier: Apache-2.0
"""Publish every model in a folder: render its views, build its deck and PDF.

A model is a document that declares its diagram in front matter. `model scan` finds
them and validates each; this script does the rest, so one command turns a folder of
related models into one set of images and one deck per document.

    python scripts/publish.py <folder> [--recursive] [--no-pdf] [--thumbnails]
                              [--scenario-images] [--no-animate] [--no-deck] [--force] [--dry-run]

Per model, written beside the document:

    <stem>.svg              the structure layer
    scenarios.html          the animated scenario walkthrough, when the model has
                            scenarios (<stem>-scenarios.html beside a document not
                            named index.md); built before the deck, so a deck:html
                            slide that embeds it is current
    <stem>-s1.svg, ...      one static image per scenario, only with --scenario-images
    dist/<name>/deck.html   when the document carries deck tags, and deck.pdf with it;
                            --no-deck stops before this, for a site build that makes
                            its own decks from the views written above

<name> is the document's file stem, or its folder name for an index.md. A model that
fails validation is not published unless --force, because a deck built from a document
and diagram that disagree shows one of them wrongly.

Exit codes: 0 all published, 1 a model failed or was skipped, 2 usage, 3 missing tool.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
SKILL_DIR = os.path.dirname(HERE)
SKILLS = os.path.dirname(SKILL_DIR)
MODEL = os.path.join(SKILLS, "model", "bin", "model.py")
DECK = os.path.join(SKILLS, "markdown-deck", "bin", "markdown-deck.mjs")


def run(cmd, timeout=600):
    return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)


def nonempty(path):
    return os.path.isfile(path) and os.path.getsize(path) > 0


def deck_theme(folder):
    """The bound deck theme: a built-in name, or a path to a .css file.

    A repository that keeps its own theme rather than one in the skill names it by path.
    That path is written relative to the binding file, as every other path in that file
    is, so resolve it here; otherwise it would depend on where publish was run from.
    """
    r = run([sys.executable, MODEL, "doctor", "--skill", "pattern",
             "--near", folder, "--json"])
    try:
        doc = json.loads(r.stdout)
        theme = doc["resolved"].get("deckTheme") or "default"
    except (ValueError, KeyError):
        return "default"
    if theme.endswith(".css") and not os.path.isabs(theme):
        bindings = doc.get("bindingFile")
        if bindings:
            theme = os.path.normpath(os.path.join(os.path.dirname(bindings), theme))
    return theme


def deck_name(doc):
    stem = os.path.splitext(os.path.basename(doc))[0]
    return os.path.basename(os.path.dirname(os.path.abspath(doc))) if stem == "index" else stem


def publish(entry, theme, pdf, dry_run, thumbnails=False, scenario_images=False, animate=True,
            deck=True):
    """Render one model's views, animate its scenarios and build its deck. Returns (ok, notes)."""
    notes, ok = [], True
    docdir = os.path.dirname(entry["doc"])

    views = [v for v in entry["views"] if scenario_images or not v.get("scenario")]
    has_scenarios = any(v.get("scenario") for v in entry["views"])

    for v in views:
        out = os.path.join(docdir, v["file"])
        cmd = [sys.executable, MODEL, "render", entry["diagram"], "--out", out]
        for layer in v["layers"]:
            cmd += ["--layer", layer]
        if dry_run:
            notes.append(f"would render {v['file']}")
            continue
        r = run(cmd)
        if r.returncode != 0 or not nonempty(out):
            ok = False
            notes.append(f"render failed: {v['file']}: {(r.stderr or r.stdout).strip()[:200]}")
        else:
            notes.append(f"rendered {v['file']}")

    if animate and has_scenarios:
        stem = os.path.splitext(os.path.basename(entry["doc"]))[0]
        page = "scenarios.html" if stem == "index" else f"{stem}-scenarios.html"
        if dry_run:
            notes.append(f"would animate {page}")
        else:
            r = run([sys.executable, MODEL, "animate", entry["doc"]])
            if r.returncode != 0 or not nonempty(os.path.join(docdir, page)):
                ok = False
                notes.append(f"animate failed: {(r.stderr or r.stdout).strip()[:200]}")
            else:
                notes.append(f"animated {page}")

    if not deck:
        return ok, notes
    if not entry["deckTagged"]:
        notes.append("no deck tags; deck skipped")
        return ok, notes

    out_dir = os.path.join(docdir, "dist", deck_name(entry["doc"]))
    cmd = ["node", DECK, "build", entry["doc"], "--out", out_dir, "--theme", theme]
    # Explicit either way, so a repository's pdf default cannot override --no-pdf.
    cmd.append("--pdf" if pdf else "--no-pdf")
    if thumbnails:
        cmd.append("--thumbnails")
    if dry_run:
        notes.append(f"would build {os.path.relpath(out_dir, docdir)}")
        return ok, notes
    r = run(cmd)
    html = os.path.join(out_dir, "deck.html")
    if r.returncode != 0 or not nonempty(html):
        return False, notes + [f"deck failed: {(r.stderr or r.stdout).strip()[:300]}"]
    notes.append(f"built {os.path.relpath(html, docdir)}")
    if pdf:
        p = os.path.join(out_dir, "deck.pdf")
        if nonempty(p):
            notes.append(f"built {os.path.relpath(p, docdir)}")
        else:
            ok = False
            notes.append(f"pdf missing: {(r.stderr or r.stdout).strip()[:300]}")
    return ok, notes


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("folder")
    ap.add_argument("--recursive", action="store_true")
    ap.add_argument("--no-pdf", action="store_true", help="build the HTML deck only")
    ap.add_argument("--force", action="store_true", help="publish models that fail validation")
    ap.add_argument("--dry-run", action="store_true", help="say what would be done")
    ap.add_argument("--thumbnails", action="store_true",
                    help="slide index shows thumbnails; the default is titles only")
    ap.add_argument("--scenario-images", action="store_true",
                    help="also render one static image per scenario; the walkthrough replaces them")
    ap.add_argument("--no-animate", action="store_true",
                    help="do not build the animated scenario walkthrough")
    ap.add_argument("--no-deck", action="store_true",
                    help="render the views and the walkthrough only; build no deck")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()

    if not os.path.isdir(a.folder):
        print(f"  ! {a.folder}: not a folder", file=sys.stderr)
        return 2
    for path, what in ((MODEL, "model"), (DECK, "markdown-deck")):
        if not os.path.exists(path):
            print(f"  ! the {what} skill is not installed beside this one ({path})",
                  file=sys.stderr)
            return 3
    if not shutil.which("node"):
        print("  ! node is not on PATH; markdown-deck needs it", file=sys.stderr)
        return 3

    cmd = [sys.executable, MODEL, "scan", a.folder, "--json", "--fail-on", "never"]
    if a.recursive:
        cmd.append("--recursive")
    r = run(cmd)
    try:
        scanned = json.loads(r.stdout)
    except ValueError:
        print(f"  ! model scan failed: {r.stderr.strip()}", file=sys.stderr)
        return 2

    theme = deck_theme(a.folder)
    results = []
    for e in scanned["models"]:
        name = os.path.relpath(e["doc"], a.folder)
        if e["result"] == "error" and not a.force:
            errs = [f["message"] for f in e["findings"] if f["severity"] == "error"]
            results.append({"doc": name, "status": "skipped",
                            "notes": ["fails validation; fix it or pass --force"] + errs[:5]})
            continue
        ok, notes = publish(e, theme, not a.no_pdf, a.dry_run, a.thumbnails,
                            a.scenario_images, not a.no_animate, not a.no_deck)
        results.append({"doc": name, "status": "ok" if ok else "failed", "notes": notes})

    if a.json:
        print(json.dumps({"folder": a.folder, "theme": theme, "results": results,
                          "undeclared": scanned.get("skipped", [])}, indent=2))
    else:
        for res in results:
            print(f"  {res['status']:<8} {res['doc']}")
            for n in res["notes"]:
                print(f"           {n}")
        print(f"  {len(results)} model(s), theme '{theme}'"
              + (", dry run" if a.dry_run else ""))
    return 0 if all(r["status"] == "ok" for r in results) else 1


if __name__ == "__main__":
    sys.exit(main())
