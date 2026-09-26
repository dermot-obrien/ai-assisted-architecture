---
sidebar_label: Pattern Template
status: Draft
version: "0.4"
last_modified: 2026-09-26
author: "<your name>"
provenance:
  origin: ai-generated
  review_state: ai-raw
---

# PAT-NNN Pattern Name

<!--
HOW TO USE THIS TEMPLATE
- This file is both the pattern template and its authoring instructions, at any scope.
- Guidance lives in HTML comments, which Markdown renderers do not display. An MDX-based
  site must treat .md files as CommonMark for HTML comments to be legal (in Docusaurus,
  markdown.format 'detect'). Delete each guidance comment as you complete its section.
- Copy this file into the directory your repository binds as `outputDir`, as
  <slug>/index.md, and add your repository's standard front matter, including
  pattern_scope: problem, domain, capability-area, platform, hosting-profile or epic.
- Every architecture model is a pattern. Patterns differ by semantic type: the scope you
  author, and the abstraction model validate derives. A problem-scope pattern answers ONE
  recurring problem: rename ## Context to ## Intent (the problem, its forces, the
  invariant enforced) and delete the sections marked WIDER SCOPE. What is often called a
  pattern is a wide-scope pattern.
- Boxes may be any mix of local roles (01 Gateway), catalogued logical building blocks,
  catalogued products and external context. model validate derives the abstraction from
  them: all local is conceptual, logical blocks is logical, every box a product is
  physical, anything else is mixed. Only a physical one is something a team builds from.
- Identifiers below are written as COMP-NNN for components, IF-NN for interfaces and
  PAT-NNN for patterns. Your repository's own series come from its binding file; if it
  declares a template of its own, use that instead of this one, because a house template
  carries the series, the deliverable code and the palette that belong to the repository
  rather than to a published skill.
- Never hyperlink identifiers in body text. Write the plain identifier and its name
  together; publishing rewrites them into links.
- If your repository binds an `ontologySchema`, the section order below is what that
  schema expects: mandatory core body first, optional facets where noted. Do not remove
  a mandatory section.
- Target length is about 10 pages. Tables carry the volume; prose is reserved for the
  architecturally significant minority. Unmaintained detail is the documented decay mode
  for this artefact type, so omit rather than pad.
- Deck tags: sections marked with a deck:slide tag are rendered into an HTML deck and PDF
  by the pattern skill's publisher. The tags are HTML comments and are invisible
  in the published docs page. See the companion specification for the tag vocabulary.
-->

<!-- deck:cover subtitle="One-line subtitle for the cover slide" -->

## Context

<!--
MANDATORY. For a problem scope, rename to ## Intent: the problem, its forces and the
invariant enforced. For a wider scope: the domain, capability area, platform, hosting
profile or epic covered, the drivers, and the target-state problem space this pattern
addresses. Say what "done" looks like for the domain.
Name the audience: who is expected to build against this.
-->

### Non-Goals

<!--
RECOMMENDED. What this pattern is explicitly NOT for. The dominant
documented failure mode for this artefact is adoption for legitimacy rather than fit,
and stating the non-goals is the cheapest mitigation. Three to five bullets.
-->

### Quality Attributes

<!--
RECOMMENDED. The quality attributes this architecture is designed to meet, each with a
response measure so conformance is testable. Use the six-part form: source, stimulus,
environment, artifact, response, response measure. Reference QualityAttribute entities
where they exist rather than restating them.
-->

| Quality attribute | Scenario | Response measure |
|---|---|---|
| Availability | Retrieval service loses its primary index | Degraded answer served within 2s, no error to the caller |

### Principles Realised

<!--
OPTIONAL FACET. The principles this pattern realises, one line each on HOW.
Use plain PRN-NNN identifiers. Delete this subsection if none apply.
-->

| Principle | How this pattern realises it |
|---|---|
| PRN-NNN Principle name | One-sentence statement |

<!-- deck:slide label="Component View" -->

## Diagram

<!--
MANDATORY. Every pattern MUST carry a diagram. A pattern with no diagram is not a pattern.

Author ONE draw.io source beside this file, holding the component view on the base layer
and one layer per scenario. Export to SVG (preferred) or PNG.

  components.drawio  ->  components.svg          the component view, base layer only
  index.md + drawio  ->  scenarios.html          the animated scenario walkthrough
                                                 (model animate index.md)

Use layers, not pages, for scenario overlays. Duplicating the page regenerates every
mxCell id, so scenario arrows stop referencing the real components and every building
block appears twice to the miner.

--- MINEABLE IDENTIFIERS (mandatory) ---
Set compressed="false" on the mxfile root and untick Compressed in draw.io Preferences,
or the file is one unreadable Base64 line and nothing below works.

Every component shape carries its identifier as a custom attribute, added via Edit then
Edit Data (Ctrl+M): the catalogue identifier, or local_id for a local role such as 01.
Generating the diagram from the tables with model emit sets them for you. The attribute
wraps the shape in an object element:

    <object id="COMP-024" label="Identity Provider" component_id="COMP-024">
      <mxCell style="rounded=1;whiteSpace=wrap;html=1;" vertex="1" parent="1">
        <mxGeometry x="200" y="100" width="160" height="60" as="geometry" />
      </mxCell>
    </object>

Do NOT rely on the mxCell id as the catalogue key. draw.io regenerates it on copy, paste,
duplicate and id collision. The custom attribute is part of the cell's user object and is
cloned with it, so the identifier survives. Setting id and the identifier attribute to
the same value is deliberate: a copy-pasted shape gets a random id while keeping the
identifier, which is how the validator
detects accidental duplication.

Attribute vocabulary (the actual names come from your binding file's
`model.node_id_attrs` and `model.edge_id_attr`; these are the defaults):
  component_id      the catalogue identifier, on every component shape
  iface_id          the interface identifier, on every connector between components
  scenario          the scenario key (S1, S2, ...), on every overlay element
  step              the step number within that scenario, on every overlay element
  from / to         the endpoints a scenario arrow asserts, cross-checked against
                    the resolved source and target

Reserved names that must NOT be used as custom attributes: id, label, placeholders,
tooltip, link, linkTarget, tags, treeRoot.

--- BASE LAYER (the component view) ---
- Nodes: every building block from ## Building Blocks, plus external actors and domain
  boundaries. Overlay the applied patterns as labelled bands so the reader sees which
  pattern owns which region, and which building blocks are the connective tissue.
- Box label: line 1 bold "COMP-NNN Official Name"; line 2 the short role in THIS
  pattern. Do not invent names; use the catalogue's official name.
- Every connector is labelled with what flows and carries an iface_id. No unlabeled arrows.
- Include a KEY on the canvas explaining colours, shapes and line semantics. A diagram
  without a key is a primary comprehension failure.
- Colour by role, and show the same key in a small legend. Your repository's palette
  comes from the `style` section of its binding file; if it has none, any consistent
  scheme works as long as the legend explains it.
- Canvas: pageWidth about 1920, white background, no page grid.

--- SCENARIO LAYERS (one per scenario) ---
Each scenario is a named layer holding numbered badges and flow arrows drawn over the
base components. This is a UML communication diagram, which C4 calls a dynamic diagram.
- Badge: a small filled circle carrying the step number, placed on or beside the acting
  component, with scenario and step attributes.
- Flow arrow: source and target set to the real base-layer component shapes, labelled
  "N: what happens", with scenario, step, from_abb and to_abb attributes.
- Step numbers are contiguous from 1 with no gaps and no duplicates.
- One scenario per layer. Two overlays on the same boxes collide and destroy readability.

Embed the exported views under ## Diagram and in each scenario:

    ![PAT-NNN components](./components.svg)
-->

## Applicability

<!-- MANDATORY. When to use this pattern. -->

## Not Applicable

<!-- MANDATORY. When NOT to adopt it; the boundary cases it explicitly excludes. -->

## Patterns Applied

<!--
WIDER SCOPE. OPTIONAL FACET, expected wherever a published pattern covers part of the
design. The narrower patterns this pattern composes. Use plain PAT-NNN identifiers; do not
restate each pattern's body, summarise its role here. A conceptual pattern drawn before
its narrower patterns exist may say so in one line.
-->

| Pattern | Role in this pattern |
|---|---|
| PAT-NNN Pattern Name | What this pattern contributes to the end-to-end design |

<!-- deck:slide label="Building Blocks" -->

## Building Blocks

<!--
MANDATORY. At least one building block, of any kind. These are the components on the
diagram, and the table is the authoritative list the diagram is generated from and
validated against. Every row must have a shape on the base layer carrying the matching
identifier attribute, and every shape must have a row. Mix kinds freely: a catalogue
identifier where an entry exists, a local number such as 07 where it does not.

Both pattern-owned AND loose building blocks belong here. Loose ones are the connective
tissue that no single pattern owns. Mark which is which in Source.

Write prose beneath this table ONLY for the architecturally significant components, as a
### subsection each. Most components need nothing beyond the row.
-->

| Building Block | Role in this pattern | Source |
|---|---|---|
| COMP-NNN Official Name | What it does here, one clause | PAT-NNN / loose |
| 07 Local role name | A role with no catalogue entry yet | loose |

<!-- deck:slide label="Interfaces" -->

## Interfaces

<!--
RECOMMENDED. Every connector on the component diagram, as a row. This is the section that
makes the difference between a picture and an architecture: TOGAF requires interfaces as
one of the four minimum building-block specification items, and integration points are
the primary stability risk in any composed design.

Every row must have a connector on the base layer carrying the matching iface_id, and
every connector must have a row.

Expand to a ### subsection only for interfaces that are externally contracted or carry
non-obvious failure semantics. For those, add: resources provided with syntax and
semantics, pre- and post-conditions, data types, variability, and rationale.
-->

| Interface | Provider | Consumer | Purpose | Protocol | Payload | Sync | Errors and retry | NFRs |
|---|---|---|---|---|---|---|---|---|
| IF-01 | COMP-NNN | COMP-NNN | What flows and why | HTTPS / JSON-RPC | Schema ref | Sync | Timeout 5s, retry 3x on 503, non-retryable on 4xx | p95 200ms, 99.9% |

## Scenarios

<!--
RECOMMENDED. Two to four scenarios. The criterion is architectural relevance, not
coverage: a large number of scenarios is explicitly not the goal. Each scenario is a
numbered overlay layer on the component diagram plus a steps table, and all of them are
presented through one animated walkthrough, scenarios.html, generated by
model animate index.md. Keep the link and the deck:html slide below; give the scenario
sections no image and no slide tag of their own.

A scenario is the right form for a happy-path flow of roughly five to ten steps. It
CANNOT express branching, loops, concurrency or failure paths, because a communication
diagram has no combined fragments. If the flow has real alternatives or error handling,
use a mermaid sequenceDiagram instead and say why in one line.

Repeat the block below per scenario. Keep the heading key (S1, S2) aligned to the
scenario attribute on the draw.io layer.
-->

Step through them in the [animated scenario walkthrough](./scenarios.html): each step is numbered on the acting box, the arrow is drawn to its target and the rest of the diagram dims. It opens from disk; arrow keys step and space plays.

<!-- deck:html src="./scenarios.html" title="Scenario walkthrough" header="true" -->

### S1 Scenario name

<!-- One sentence on what this scenario proves and which quality attribute it exercises. -->

| Step | Actor | Target | Action | Interface |
|---:|---|---|---|---|
| 1 | COMP-NNN | COMP-NNN | What happens | IF-01 |

<!-- deck:skip -->
<!--
Prose that belongs in the document but not on the slide goes between deck:skip markers.
Use it for the detail a reader needs and an audience does not.
-->
<!-- /deck:skip -->

## Key Concepts

<!-- OPTIONAL FACET. Definitions of the load-bearing terms this pattern
introduces. Delete if unused. -->

## Standards Applied

<!-- OPTIONAL FACET. The binding standards this pattern mandates
conformance to. Use plain standard_* identifiers. Delete if none apply. -->

| Standard | What it constrains |
|---|---|
| standard_xxx | Conformance requirement |

## Controls and Guardrails

<!-- MANDATORY. The enforceable controls this pattern establishes across
its composed patterns, and where each is enforced. -->

| Control | Source Standard/Policy | Enforcement Point |
|---|---|---|
| Control statement | standard_xxx / Policy | Build / Release / Runtime |

### Cross-Cutting Concerns

<!--
RECOMMENDED. Identity, security, observability, data handling, error and retry, and
lifecycle. These belong to no single component or interface, so a structure made only of
components and interfaces loses them. One line each, pointing at where the concern is
discharged.
-->

| Concern | How it is discharged here |
|---|---|
| Identity | Which building block, which pattern |

### Variation Points

<!--
RECOMMENDED. What is mandatory, what is guidance, and where a team may legitimately
deviate and how, for a wider scope. A pattern with no escape hatch for legitimate edge cases
gets abandoned rather than followed.
-->

| Element | Mandatory or guidance | Permitted deviation and route |
|---|---|---|

## Decisions

<!--
RECOMMENDED. The decisions this pattern rests on, with the alternative
rejected in one clause. Link to the ADR rather than restating it; the Decision entity
already points at this pattern from its side, so this list is a
convenience for the reader, not a second source of truth.
-->

| Decision | What was chosen, and what was rejected |
|---|---|
| ADR-XXXX | One clause |

## Risks and Trade-offs

<!-- MANDATORY. Residual risks, known gaps and accepted design trade-offs, each with a
mitigation. State the gaps honestly; a pattern that claims no gaps is not
believed. -->

| Risk/Trade-off | Mitigation |
|---|---|
| Risk statement | Mitigation |
