# C4 System Context diagram (the capability's, never an ABB's)

Produced for the capability an ABB realises, per the C4 context diagram standard
(`standard-c4-context-diagram.md`), and linked from the ABB's section 2.1.1. Resolve that
standard before drawing, and treat it as authoritative where it and this summary differ.

## When it applies

Only when a context view is asked for. The system in it is always a Capability: an ABB is
one C4 container and never carries a context diagram, and there is no top-level ABB
(`standard-building-block-calibration.md`). The ABB being created appears as one node inside
the capability's boundary.

## Rendering contract

- Render a Mermaid `flowchart`. Do not use the experimental `C4Context` diagram type.
- Apply the `classDef` palette mandated by the standard.
- Layout: persons on the left, the dashed ABB boundary in the centre holding its internal
  systems, external systems on the right.
- Every node carries a name, a type tag of `[Person]`, `[Software System]` or
  `[External System]`, and a description of two to four words.

## AAA mapping to document alongside it

- The boundary is the capability. This ABB is one node inside it.
- External systems often correspond to this ABB's `requires` dependencies. Cite them by ABB
  ID where they do.
- Persons have no AAA artefact. They are stakeholders, not catalogued building blocks.

## Cross-linking

The zoom-in companion is the pattern that realises the capability, whose boxes are its
containers. Cross-link the context view to it, and reconcile the external systems shown here
with the pattern's external boxes and `requires` dependencies. A mismatch between the two zoom
levels is a modelling error to resolve, not a difference to leave standing.
