# Composite SBBs

A composite SBB is an assembly of sub-SBBs whose internal structure is worth modelling. A
simple SBB is one product or family with a flat product mapping. Apply the test in the SBB
document standard under "When to use composite vs simple SBBs", and when in doubt start
simple. A composite that turns out to be simple is easy to collapse; the reverse is not.

## Frontmatter

Beyond the usual fields, a composite declares, per the frontmatter standard sections 6.7 and
6.7.1:

| Field | Holds |
|-------|-------|
| `composite: true` | Marks it as an assembly |
| `ports` | The boundary ports, both `provided` and `required` |
| `parts` | The sub-SBBs it is assembled from |
| `connectors` | Delegation and assembly edges between ports and parts |

Rules that are easy to miss:

- Every `parts[].sbb` must appear in this SBB's `contains` relation, and each sub-SBB must
  carry the inverse `part_of`. A part recorded on one side only is a broken model.
- Every `provided` boundary port links to the parent ABB interface it realises, via
  `ports[].abb_interface`.

## Section 2.10 Composite Structure

Add the section to `index.md` with three tables: boundary ports, parts, and connectors.

## The Mermaid diagram

For a composite, the Mermaid composite-structure diagram is the normative section 2.1 view and
the draw.io pair is optional. Follow the Composite Structure Diagrams (Mermaid) section of the
SBB diagram standard:

- Parts as nested subgraphs
- Provided ports as `:::provided` circles
- Required ports as `:::required` asymmetric nodes
- Delegation as dotted edges
- Assembly as solid labelled edges

The diagram must be a faithful one-to-one projection of the frontmatter `ports`, `parts` and
`connectors`. No extra nodes, none missing. Where the diagram and the frontmatter disagree,
the frontmatter is the model and the diagram is wrong.

## The zoom pair

The composite diagram is the inside view of this SBB, C4 levels 2 and 3. Its complement is the
outside view, C4 level 1: the C4 System Context diagram of the parent Capability or top-level
ABB, where this SBB appears as one `[Software System]` node inside the boundary.

After authoring a composite SBB, offer to create or refresh that Context diagram, as a
`c4-context.md` alongside the system's `index.md`. Follow the C4 context diagram standard:
Mermaid `flowchart`, never the experimental `C4Context` type.

Then reconcile the two. The context view's `[External System]` nodes must agree with this
composite's `required` boundary ports. A mismatch between the two zoom levels is a modelling
error to resolve, not a difference to leave standing.

A worked pair ships with the standards at
`standards/building-blocks/solution-building-blocks/example-composite/`: `c4-context.md` is the
outside view, `index.md` the inside.
