<!-- SPDX-License-Identifier: Apache-2.0 -->

# Worked example: REF-002 Knowledge Retrieval

Everything here is generated from one file, [index.md](./index.md). The building block identifiers are real; the composition is illustrative, not an approved architecture.

## Run it

```sh
./run.sh
```

Needs the `model` and `markdown-deck` skills beside this one, Python 3.11+, Node 18+, draw.io desktop for the diagrams and playwright for the PDF.

## Inputs

| File | What it is |
|---|---|
| `index.md` | The document. Also the model, in its Building Blocks, Interfaces and Scenarios tables. Also the deck, in its `deck:` tags |
| `model.toml` | How this example's tables map to nodes, edges and scenarios. Nothing in the skill knows the ABB or IF series; this file declares them. A repository would normally use `.agents/skill-bindings.toml` at its root; the example keeps its own so it is self-contained |

## Outputs, and why they are committed

| File | Produced by |
|---|---|
| `model.json` | `model extract` |
| `components.drawio` | `model emit`, then arranged by hand, then kept current by `model sync` |
| `components.svg`, `scenario-s1.svg`, `scenario-s2.svg` | `model render`, one image per scenario |
| `dist/deck.html`, `dist/assets/` | `markdown-deck build` |
| `dist/deck.pdf` | `markdown-deck pdf`. Not committed: this repository ignores `*.pdf`, so run `./run.sh` to produce it |

Generated outputs usually do not belong in a skill: they go stale, and they add weight to a directory that lands in a context window. They are kept here on purpose, because the point of an example is to show what you get without having to install a toolchain and run it. `run.sh` regenerates all of them, so drift is one command away from being fixed.

`components.drawio` is the exception that is not really an output. It is emitted once and then owned jointly: the document owns which shapes exist and what they connect to, the diagram owns where they sit. `sync` is what keeps both true at once.

## What to look at

The two overlay images. `scenario-s1.svg` is the structure with six numbered steps drawn over the real component shapes, generated from the steps table in the document rather than drawn by hand. Change a step in the table, run `sync`, and the overlay follows. Re-point an arrow in draw.io without changing the table, and `validate` says so.

## Known rough edge

Edge labels collide where several interfaces converge on one component, and two of them currently sit over a box. That is the mechanical layout doing its job badly: generation gets every shape and connector present and correctly identified, and arranging them is the author's work in draw.io. `sync` will not undo that work.
