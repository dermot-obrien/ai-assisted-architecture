---
name: reference-architecture
description: Author a reference architecture as one Markdown document that is also the model and also the deck. Creates the document from a template, generates the draw.io diagram and numbered scenario overlays from its own tables, validates that the diagram and the document agree, and publishes HTML slides and a PDF. Use when asked to create, author, scaffold, review or publish a reference architecture, a target-state architecture, or an end-to-end architecture document with a component diagram and scenarios.
license: Apache-2.0
compatibility: Python 3.11+ and Node 18+. Requires the `model` and `markdown-deck` skills, which ship with AI-Assisted Work; installing AAW into the same workspace provides both. Rendering diagrams needs draw.io desktop; PDF export needs playwright.
metadata:
  version: "0.2.0"
  x-skill-requires: "model@^0.1.0, markdown-deck@^0.1.0"
---

# Reference Architecture

One document is the source. The diagram is generated from its tables, the deck is generated from its sections, and both are checked against it.

## Step 0, before anything else

Run the resolver and use only the paths it prints:

```bash
python <skills>/model/bin/model.py doctor --skill reference-architecture --json
```

`<skills>` is the directory this skill is installed in. It prints the installed sibling skills, the resolved absolute paths for every binding, and a `result` of `ok`, `warn` or `error`. It exits non-zero on `error`.

Do not proceed on an error, and do not guess a path. Every path this skill needs comes from that output:

| Binding | Used for |
|---|---|
| `siblings.model` | The model CLI, at `<that>/bin/model.py` |
| `siblings.markdown-deck` | The deck CLI, at `<that>/bin/markdown-deck.mjs` |
| `outputDir` | Where a new reference architecture folder is created |
| `template` | The repository's own template, if it declares one. Otherwise use `assets/template.md` from this skill |
| `deckTheme` | Passed to markdown-deck |
| `ontologySchema` | The schema the section structure is expected to match, if declared |

The contract is declared in `inputs.toml` beside this file. The repository answers it in `[suite.reference-architecture]` of its `.agents/skill-bindings.toml`.

## Prerequisites

| Skill | Why |
|---|---|
| `model` | Generates and validates the diagram from the document's tables, and resolves the bindings above |
| `markdown-deck` | Turns tagged sections into HTML slides and a PDF |

If `doctor` does not list both under `siblings`, stop and tell the user to install the missing one. Do not improvise a substitute: the identifier conventions in the diagram and the tag vocabulary in the document are what make the three parts agree, and a hand-rolled version of either will diverge silently.

## What a reference architecture is

A technology-specific collaboration of solution building blocks that defines an implementable architecture for a domain, platform or hosting profile. Reusable as a reference, unlike a solution design, which instantiates it for one consumer.

The test against a pattern is composition level, not subject matter. If you can express it without naming a product, it is a pattern. If you cannot, it is a reference architecture.

## Structure

The section list is not arbitrary; each answers a documented failure mode or a standards requirement. It is the same whether you use the generic `assets/template.md` or a repository's own bound template.

| Section | Why it is there |
|---|---|
| Context, Non-Goals | The dominant failure mode is adoption for legitimacy rather than fit. Non-goals are the cheapest mitigation |
| Quality Attributes | Six-part scenarios with response measures, so conformance is testable |
| Diagram, Building Blocks | The component view. arc42 Building Block View, C4 Component level |
| Interfaces | TOGAF requires interfaces as one of four minimum building-block specification items. Integration points are the primary stability risk |
| Scenarios | Kruchten's "+1" view, whose stated function is validating the design |
| Cross-Cutting Concerns | Identity, security, observability and retry belong to no single component, so a components-and-interfaces structure loses them |
| Variation Points | A path with no escape hatch for legitimate edge cases gets abandoned |
| Decisions, Risks | ISO/IEC/IEEE 42010 requires decisions and rationale. A document claiming no gaps is not believed |

Target about ten pages. Tables carry the volume; prose is for the architecturally significant minority. Unmaintained detail is the documented decay mode for this artefact.

## Procedure

### 1. Create the document

Copy the template into `<outputDir>/<slug>/index.md`, using the `template` binding if the repository declares one and `assets/template.md` from this skill if it does not. A repository's own template carries its identifier series, its deliverable code and its palette; the one shipped here is deliberately free of all three. Fill it in this order, which is not document order:

Context and Non-Goals, then Patterns Applied, then Building Blocks, then Interfaces. Interfaces is where most of the real thinking happens and it usually sends you back to revise Building Blocks. Only then the diagram, then Scenarios, then the controls and decisions, which are the residue of everything above.

### 2. Generate the diagram

```bash
python <model>/bin/model.py emit index.md --to drawio --out components.drawio
```

The tables are the model. Every row in Building Blocks becomes a shape carrying its identifier, every row in Interfaces becomes a labelled connector, and every scenario's steps table becomes a numbered overlay on its own layer.

Generated layout is a mechanical grid. Open the result, arrange it, and save. From then on use `sync`, never `emit`, because `emit` would discard the arrangement and `sync` preserves it:

```bash
python <model>/bin/model.py sync index.md components.drawio
```

### 3. Check they agree

Declare the diagram in the document's front matter first, so every later step can find it:

```yaml
model:
  diagram: components.drawio
```

```bash
python <model>/bin/model.py validate index.md
```

Report what it finds. The findings that matter are the ones invisible to the eye: an interface wired one way in the table and another on the canvas, an overlay step whose endpoints disagree with its metadata, an identifier drawn twice because a shape was copy-pasted.

### 4. Render the views

```bash
python <model>/bin/model.py layers components.drawio
python <model>/bin/model.py render components.drawio --out components.svg --layer Structure
python <model>/bin/model.py render components.drawio --out scenario-1.svg \
  --layer Structure --layer "S1 <name>"
```

One image per scenario, each the structure plus exactly one overlay. Two overlays on the same boxes collide and destroy readability.

### 5. Publish the deck

Tag the sections an audience needs, typically six to twelve, then publish the folder:

```bash
python <skills>/reference-architecture/scripts/publish.py <folder>
```

It runs `model scan`, and for every document that declares a diagram and passes validation it renders `<stem>.svg` plus one `<stem>-sN.svg` per scenario beside the document, then builds `dist/<name>/deck.html` and `deck.pdf` with the bound `deckTheme`. `<name>` is the file stem, or the folder name for an `index.md`. Reference the views in the document by those names. A model that fails validation is skipped unless `--force`; `--dry-run` says what would be done, `--no-pdf` stops at HTML, and `--thumbnails` opens each deck's slide index with thumbnails rather than titles. The script works on any declared model, not only reference architectures, so a folder holding a reference architecture and two alternative views publishes all three in one run.

The document keeps its detail; the deck shows a selection of it. Untagged sections stay document-only, and `deck:skip` removes detail from a slide without removing it from the document.

## Rules that are easy to get wrong

Scenarios are layers, not pages. Duplicating a page regenerates every draw.io cell id, so the overlay arrows stop referencing the real shapes.

A scenario cannot express branching, loops, concurrency or failure paths, because a communication diagram has no combined fragments. Two to four scenarios, each a straight-line flow of roughly five to ten steps. Anything with real alternatives belongs in a sequence diagram, and say so in one line where the reader expects the overlay.

Every diagram carries a key. Omitting it is the most commonly skipped rule and a primary comprehension failure.

A box with no catalogue entry yet takes a local id, a plain number leading its cell such as `01 Gateway` when the binding sets `local_pattern`, and a row in a `## Catalogue Mapping` table saying what it realises, partly covers, or leaves as a gap. Do not invent a catalogue id to get past validation. When the entry exists, `model rename` promotes it. To bring an existing hand-drawn diagram into a model, write its tables, then `model sync --adopt --dry-run` and read what it would tag.

Identifiers are never hyperlinked in body text. Write the plain identifier and its name together; publishing rewrites them.

## Reporting back

Say which of the four artefacts you produced, give the counts from the validator, name anything that failed and why, and give the paths. Never report a render or a PDF as successful without checking the file exists and is non-empty.
