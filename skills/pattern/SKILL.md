---
name: pattern
description: Author an architecture pattern as one Markdown document that is also the model and also the deck, at any scope from one recurring problem to a whole domain, platform, hosting profile or epic. Creates the document from a template, generates the draw.io diagram and scenario overlays from its own tables, validates that the diagram and the document agree, animates the scenarios, and publishes HTML slides and a PDF. Use when asked to create, author, scaffold, review or publish a pattern, a reference architecture, a target-state architecture, or an end-to-end architecture document with a component diagram and scenarios.
license: Apache-2.0
compatibility: Python 3.11+ and Node 18+. Requires the `model` and `markdown-deck` skills, which ship with AI-Assisted Work; installing AAW into the same workspace provides both. draw.io desktop is optional; without it, views are exported by hand from draw.io desktop or online and stamped. PDF export needs playwright.
metadata:
  version: "0.7.0"
  x-skill-requires: "model@^0.5.0, markdown-deck@^0.1.0"
---

# Pattern

One document is the source. The diagram is generated from its tables, the deck is generated from its sections, and both are checked against it.

## Step 0, before anything else

Run the resolver and use only the paths it prints:

```bash
python <skills>/model/bin/model.py doctor --skill pattern --json
```

`<skills>` is the directory this skill is installed in. It prints the installed sibling skills, the resolved absolute paths for every binding, and a `result` of `ok`, `warn` or `error`. It exits non-zero on `error`.

Do not proceed on an error, and do not guess a path. Every path this skill needs comes from that output:

| Binding | Used for |
|---|---|
| `siblings.model` | The model CLI, at `<that>/bin/model.py` |
| `siblings.markdown-deck` | The deck CLI, at `<that>/bin/markdown-deck.mjs` |
| `outputDir` | Where a new pattern folder is created |
| `template` | The repository's own template, if it declares one. Otherwise use `assets/template.md` from this skill |
| `deckTheme` | Passed to markdown-deck |
| `ontologySchema` | The schema the section structure is expected to match, if declared |

The contract is declared in `inputs.toml` beside this file. The repository answers it in `[suite.pattern]` of its `.agents/skill-bindings.toml`.

## Prerequisites

| Skill | Why |
|---|---|
| `model` | Generates and validates the diagram from the document's tables, and resolves the bindings above |
| `markdown-deck` | Turns tagged sections into HTML slides and a PDF |

If `doctor` does not list both under `siblings`, stop and tell the user to install the missing one. Do not improvise a substitute: the identifier conventions in the diagram and the tag vocabulary in the document are what make the three parts agree, and a hand-rolled version of either will diverge silently.

## What a pattern is

Every architecture model is a pattern: building blocks, the interfaces between them and the scenarios that walk across them. Reusable as a reference, unlike a solution design, which instantiates one for one consumer. What is often called a reference architecture is a pattern with a wide scope, and this skill authors it the same way.

Patterns differ by semantic type, which has two parts:

| Part | Values | Set by |
|---|---|---|
| Scope | `problem` for one recurring problem; `domain`, `capability-area`, `platform`, `hosting-profile` or `epic` for a composed design | The author, in front matter as `pattern_scope` |
| Abstraction | `conceptual`, `logical`, `physical`, `mixed` | Derived by `model validate` from the kinds of box, never declared |

A problem-scope pattern opens with Intent: the problem, the forces it balances and the invariant it enforces, and is usually short. A wider-scope pattern opens with Context and names the narrower patterns it applies. Any mix of boxes is allowed: local roles, catalogued logical building blocks, catalogued products, and external context. Report the derived abstraction. A conceptual pattern explains and scopes; one that a team will build from must be physical.

## Tying a pattern to capabilities

A pattern names the capabilities it realises in its front matter, so the capabilities' rungs on the definition ladder can count it:

```yaml
realises: [CAP-012]          # the capabilities this pattern realises
flows: [take-order]          # optional: only these flows of them; omit to cover every flow
references:
  - { type: cost-model, path: "../cost/order-intake.xlsx" }
  - { type: evidence, path: "../../evaluations/order-intake-trial/" }
```

`realises` is optional, and a pattern without it is still a valid pattern. It just counts toward no capability. The derived abstraction decides which rung it can evidence: a logical pattern, every box an ABB, is part of R3 Decided; a physical pattern, every box an SBB, with a `cost-model` reference is part of R4 Buildable; an `evidence` reference on that physical pattern is R5 Proven. The `aaa-rung` skill reads these fields. The rungs are defined in the Definition Ladder Standard (`standards/capabilities/standard-definition-ladder.md`).

## Structure

The section list is not arbitrary; each answers a documented failure mode or a standards requirement. It is the same whether you use the generic `assets/template.md` or a repository's own bound template.

| Section | Why it is there |
|---|---|
| Intent, or Context and Non-Goals | Intent states the problem and forces that make a pattern reusable. For a wider scope, the dominant failure mode is adoption for legitimacy rather than fit, and non-goals are the cheapest mitigation |
| Quality Attributes | Six-part scenarios with response measures, so conformance is testable |
| Diagram, Building Blocks | The component view. arc42 Building Block View, C4 Component level |
| Interfaces | TOGAF requires interfaces as one of four minimum building-block specification items. Integration points are the primary stability risk |
| Scenarios | Kruchten's "+1" view, whose stated function is validating the design |
| Cross-Cutting Concerns | Identity, security, observability and retry belong to no single component, so a components-and-interfaces structure loses them |
| Variation Points | A path with no escape hatch for legitimate edge cases gets abandoned |
| Decisions, Risks | ISO/IEC/IEEE 42010 requires decisions and rationale. A document claiming no gaps is not believed |

Target at most about ten pages, and far less for a problem-scope pattern. Tables carry the volume; prose is for the architecturally significant minority. Unmaintained detail is the documented decay mode for this artefact.

## Procedure

### 1. Create the document

Copy the template into `<outputDir>/<slug>/index.md`, using the `template` binding if the repository declares one and `assets/template.md` from this skill if it does not. A repository's own template carries its identifier series, its deliverable code and its palette; the one shipped here is deliberately free of all three. Fill it in this order, which is not document order:

Intent, or Context and Non-Goals for a wider scope, then Patterns Applied where published patterns cover part of the design, then Building Blocks, then Interfaces. Interfaces is where most of the real thinking happens and it usually sends you back to revise Building Blocks. Write each Provider and Consumer as the identifier followed by the name, as Building Blocks has it (`ABB-017 Context Retrieval Service`, `04 Identity provider`), never the bare identifier: the table is read on the page and on its deck slide, and a reader should not have to look names up. The model reads only the leading identifier. `python <skills>/pattern/scripts/name-endpoints.py <file-or-folder>` fills in names from the Building Blocks table, and `--check` reports without changing anything; `publish.py` notes any document that still needs it. Only then the diagram, then Scenarios, then the controls and decisions, which are the residue of everything above.

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

### 4. Render or export the view, and animate the scenarios

With draw.io desktop installed:

```bash
python <model>/bin/model.py render components.drawio --out components.svg --layer Structure
python <model>/bin/model.py animate index.md
```

Without it, draw.io online does the same job by hand. Open the `.drawio`, show only the Structure layer, export it as SVG to `components.svg` beside the diagram, and record what it shows so it is checked for staleness like a render:

```bash
python <model>/bin/model.py stamp components.svg --diagram components.drawio --layer Structure
python <model>/bin/model.py animate index.md
```

`animate` draws on that committed view and never needs draw.io. `python <model>/bin/model.py drawio` says whether draw.io desktop is installed. Commit the diagram, the view and its `.render.json` together.

The structure is the one static image. The scenarios are shown by the animated walkthrough, `scenarios.html`, a self-contained page that opens from disk and steps through each scenario on the structure: the step's number on the acting box, the arrow to its target, the rest dimmed. Link to `./scenarios.html` at the top of `## Scenarios` and give it one deck slide:

```markdown
<!-- deck:html src="./scenarios.html" title="Scenario walkthrough" header="true" -->
```

Each scenario keeps its steps table, because the walkthrough is generated from it, but carries no image and no slide tag of its own. Re-run `animate` after moving shapes. A static image per scenario, the structure plus exactly one overlay, is still available with `render --layer Structure --layer "S1 <name>"` when a medium cannot run the page.

### 5. Publish the deck

Tag the sections an audience needs, typically six to twelve, then publish the folder:

```bash
python <skills>/pattern/scripts/publish.py <folder>
```

It runs `model scan`, and for every document that declares a diagram and passes validation it renders `<stem>.svg` beside the document, builds the animated walkthrough when the model has scenarios, then builds `dist/<name>/deck.html` and `deck.pdf` with the bound `deckTheme`. `--scenario-images` also renders one `<stem>-sN.svg` per scenario; `--no-animate` skips the walkthrough. `--render auto` (the default) renders a view only when it is missing or older than its diagram and draw.io desktop is installed, and otherwise requires it to be current; `--render never` never calls draw.io, for a build machine without it, and fails naming each view to export and stamp; `--render always` re-renders every view. `--no-deck` stops after the views and the walkthrough, for a site build that builds its own decks from them: run it with `--recursive` over the pattern folders before the site's deck build, so a deck never embeds a missing or stale view. `<name>` is the file stem, or the folder name for an `index.md`. Reference the views in the document by those names. A model that fails validation is skipped unless `--force`; `--dry-run` says what would be done, `--no-pdf` stops at HTML, and `--thumbnails` opens each deck's slide index with thumbnails rather than titles. The script works on any declared model, so a folder holding a pattern and two alternative views publishes all three in one run.

The document keeps its detail; the deck shows a selection of it. Untagged sections stay document-only, and `deck:skip` removes detail from a slide without removing it from the document.

## Rules that are easy to get wrong

Scenarios are layers, not pages. Duplicating a page regenerates every draw.io cell id, so the overlay arrows stop referencing the real shapes.

A scenario cannot express branching, loops, concurrency or failure paths, because a communication diagram has no combined fragments. Two to four scenarios, each a straight-line flow of roughly five to ten steps. Anything with real alternatives belongs in a sequence diagram, and say so in one line where the reader expects the overlay.

Every diagram carries a key. Omitting it is the most commonly skipped rule and a primary comprehension failure.

A box with no catalogue entry yet takes a local id, a plain number leading its cell such as `01 Gateway` when the binding sets `local_pattern`, and a row in a `## Catalogue Mapping` table saying what it realises, partly covers, or leaves as a gap. Do not invent a catalogue id to get past validation. When the entry exists, `model rename` promotes it. To bring an existing hand-drawn diagram into a model, write its tables, then `model sync --adopt --dry-run` and read what it would tag.

Identifiers are never hyperlinked in body text. Write the plain identifier and its name together; publishing rewrites them.

## Reporting back

Say which of the artefacts you produced (document, diagram, walkthrough, deck), give the counts and the derived abstraction from the validator, the capabilities the pattern `realises` if any, name anything that failed and why, and give the paths. Never report a render or a PDF as successful without checking the file exists and is non-empty.
