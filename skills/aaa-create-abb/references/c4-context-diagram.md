# C4 System Context diagram (top-level ABBs only)

Added to `index.md` as section 2.1.1, per the C4 context diagram standard
(`standard-c4-context-diagram.md`). Resolve that standard before drawing, and treat it as
authoritative where it and this summary differ.

## When it applies

Only for a top-level ABB: one that represents a whole system a stakeholder would name, such
as a trading platform or a payments system. A fine-grained ABB only ever seen inside a larger
system does not get one; its component diagram is sufficient.

## Rendering contract

- Render a Mermaid `flowchart`. Do not use the experimental `C4Context` diagram type.
- Apply the `classDef` palette mandated by the standard.
- Layout: persons on the left, the dashed ABB boundary in the centre holding its internal
  systems, external systems on the right.
- Every node carries a name, a type tag of `[Person]`, `[Software System]` or
  `[External System]`, and a description of two to four words.

## AAA mapping to document alongside it

- The boundary is this ABB.
- External systems often correspond to this ABB's `requires` dependencies. Cite them by ABB
  ID where they do.
- Persons have no AAA artefact. They are stakeholders, not catalogued building blocks.

## Cross-linking

If a realising composite SBB exists, cross-link the context view to it as the zoom-in
companion, and reconcile the external systems shown here with that composite's `required`
ports. A mismatch between the two is a modelling error to resolve, not a difference to
leave standing.
