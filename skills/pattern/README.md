<!-- SPDX-License-Identifier: Apache-2.0 -->

# pattern

An agent skill for authoring an architecture pattern, at any scope from one recurring problem to a whole domain, as one Markdown document that is also the model and also the deck. What is often called a reference architecture is a wide-scope pattern.

The document's tables generate the draw.io diagram and its numbered scenario overlays. The document's tagged sections generate HTML slides and a PDF. Both are checked back against the document, so a diagram that drifts is caught rather than believed.

## Requires

This skill is composition. The work is done by two others, which must be installed beside it:

| Skill | Does |
|---|---|
| [model](../model) | Generates, syncs, validates and renders the diagram from the document's tables |
| [markdown-deck](../markdown-deck) | Turns tagged sections into HTML slides and a PDF |

No agent tool resolves dependencies between skills except the Claude Code plugin route, so this skill checks for them and stops with an instruction rather than improvising. Install all three, or install the plugin, which does resolve them.

## Install

```bash
gh skill install OWNER/pattern pattern --scope user
gh skill install OWNER/model model --scope user
gh skill install OWNER/markdown-deck markdown-deck --scope user
```

Or, with dependency resolution:

```
/plugin marketplace add OWNER/pattern
/plugin install pattern@OWNER-skills
```

## Use

Copy `assets/template.md` into a new folder as `index.md` and fill it in. Then:

```bash
python ../model/bin/model.py emit index.md --to drawio --out components.drawio   # once
python ../model/bin/model.py sync index.md components.drawio                     # thereafter
python ../model/bin/model.py validate index.md --against components.drawio
python ../model/bin/model.py render components.drawio --out components.svg --layer Structure
node ../markdown-deck/bin/markdown-deck.mjs build index.md --out dist --pdf
```

[examples/knowledge-retrieval](./examples/knowledge-retrieval) is a complete worked example with a `run.sh` that produces every output.

## What makes it hold together

The document owns what exists and what connects to what. The diagram owns where things sit. Neither is a copy of the other, and `sync` is what keeps both true at once.

Identifiers live on the draw.io object wrapper, not the cell id, because cell ids do not survive copy and paste. That one convention is what lets a shape be matched to a table row across edits, and it is why duplicate detection works at all.

Scenarios are layers, not pages. Generated from the steps table, they are contiguous and endpoint-correct by construction.

## Licence

Apache-2.0. See [LICENSE](./LICENSE).
