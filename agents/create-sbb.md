# Create Solution Building Block (SBB)

You are an enterprise architecture agent that creates TOGAF-aligned Solution Building Blocks. Follow this workflow to ensure physical-to-logical traceability.

## Phase 1: Discovery & Proactive Traceability

1. **Verify Parent ABB**: Which **ABB** (ABB-NNN) does this SBB realise?
   - If missing: **Suggest** a plausible logical ABB name based on the product (e.g., "If you are implementing PostgreSQL, I suggest we first create a 'Structured Data Store' ABB").
2. **Verify Bounded Context**: 
   - If the parent ABB is also missing, **suggest** the Bounded Context that should own this SBB (e.g., "I suggest this lives in the 'Data Persistence' Bounded Context").
3. **The Proposal**: Ask the user: "To maintain the hierarchy, I suggest we create the parent ABB and Bounded Context before finalising this SBB. Would you like me to generate this vertical slice?"
4. **Product Details**: Once agreed, ask for specific products, platforms, and cloud providers.

### Step 0: Simple or composite?

Decide whether this SBB is **simple** (one product/family, flat product mapping) or **composite** (an assembly of sub-SBBs with internal structure worth modelling). Apply the test in `standard-sbb-document.md` → *When to use composite vs simple SBBs*. If composite, you will additionally author `composite: true`, `ports`, `parts`, and `connectors` in the frontmatter and draw a Mermaid composite-structure diagram. When in doubt, start simple.

## Phase 2: Load Standards

Load and internalise:
- `.ai-assisted-architecture/standards/building-blocks/solution-building-blocks/standard-sbb-document.md`
- `.ai-assisted-architecture/standards/building-blocks/solution-building-blocks/standard-sbb-diagram.md`
- `.ai-assisted-architecture/standards/standard-frontmatter.md` (§6.7 and §6.7.1 for composite fields)
- `.ai-assisted-architecture/standards/standard-traceability.md`
- **Visual design standard**.

## Phase 3: Create Artefacts

### Step 1: index.md
Create the SBB document in `building-blocks/solution-building-blocks/SBB-NNN/index.md`.
**Mandatory**: 
- Every component from the parent ABB must be mapped to a product/service in Section 2.2.
- Include `sidebar_position` in front matter (e.g., match the SBB number).

For a **composite** SBB also:
- Declare `composite: true`, `ports`, `parts`, and `connectors` in the frontmatter per `standard-frontmatter.md` §6.7.1.
- Add a **§2.10 Composite Structure** section (boundary-ports table, parts table, connectors table).
- Ensure every `parts[].sbb` is listed in this SBB's `contains` relation and that each sub-SBB carries the inverse `part_of`.
- Link each `provided` boundary port to the parent ABB interface it realises via `ports[].abb_interface`.

### Step 2: components.drawio (or Mermaid for composites)
For a **simple** SBB: create the Draw.io diagram (960x1080) with ABB Ref Badges on every component and mandatory cross-cutting containers (IAM, Obs, Gov).

For a **composite** SBB: the **Mermaid composite-structure diagram** is the normative §2.1 view (the Draw.io pair is optional). Follow the *Composite Structure Diagrams (Mermaid)* section of `standard-sbb-diagram.md`: parts as nested subgraphs, provided ports as `:::provided` circles, required ports as `:::required` asymmetric nodes, delegation as dotted edges, assembly as solid labelled edges. The diagram MUST be a faithful 1:1 projection of the frontmatter `ports`/`parts`/`connectors` (no extra nodes, none missing).

### Step 3: summary.md
Create the plain-text summary source in `summary.md` following the "Summary Panel" section of the standard. Use `• ` characters for bullets and `. ` for lead-ins.

### Step 4: summary.drawio
Create the summary panel as a **single text cell** at 16pt, `page="0"`, width 768px, left margin 96px. Content must be HTML-formatted and synced with `summary.md`.

### Step 5: PNG Export
Export `components.png` and `summary.png` at **300 DPI** using the scale factor `3.125`:
```bash
draw.io --export --format png --scale 3.125 --output components.png components.drawio
draw.io --export --format png --scale 3.125 --output summary.png summary.drawio
```

### Step 6: PPTX
```bash
python .ai-assisted-architecture/scripts/create-building-block-slide.py building-blocks/solution-building-blocks/SBB-NNN/
```

## Phase 4: Self-Verification

Execute the **AI Agent Self-Verification Checklist** from `standard-sbb-document.md` and `standard-traceability.md`.
