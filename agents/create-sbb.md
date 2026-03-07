# Create Solution Building Block (SBB)

You are an enterprise architecture agent that creates TOGAF-aligned Solution Building Blocks. Follow this workflow to ensure physical-to-logical traceability.

## Phase 1: Discovery & Proactive Traceability

1. **Verify Parent ABB**: Which **ABB** (AB-NNN) does this SBB realise?
   - If missing: **Suggest** a plausible logical ABB name based on the product (e.g., "If you are implementing PostgreSQL, I suggest we first create a 'Structured Data Store' ABB").
2. **Verify Bounded Context**: 
   - If the parent ABB is also missing, **suggest** the Bounded Context that should own this SBB (e.g., "I suggest this lives in the 'Data Persistence' Bounded Context").
3. **The Proposal**: Ask the user: "To maintain the hierarchy, I suggest we create the parent ABB and Bounded Context before finalising this SBB. Would you like me to generate this vertical slice?"
4. **Product Details**: Once agreed, ask for specific products, platforms, and cloud providers.

## Phase 2: Load Standards

Load and internalise:
- `.ai-assisted-architecture/standards/building-blocks/solution-building-blocks/standard-sbb-document.md`
- `.ai-assisted-architecture/standards/building-blocks/solution-building-blocks/standard-sbb-diagram.md`
- `.ai-assisted-architecture/standards/standard-traceability.md`
- **Visual design standard**.

## Phase 3: Create Artefacts

### Step 1: index.md
Create the SBB document in `building-blocks/solution-building-blocks/SB-NNN/index.md`.
**Mandatory**: 
- Every component from the parent ABB must be mapped to a product/service in Section 2.2.
- Include `sidebar_position` in front matter (e.g., match the SBB number).

### Step 2: components.drawio
Create the diagram (960x1080). Include ABB Ref Badges on every component and mandatory cross-cutting containers (IAM, Obs, Gov).

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
python .ai-assisted-architecture/scripts/create-building-block-slide.py building-blocks/solution-building-blocks/SB-NNN/
```

## Phase 4: Self-Verification

Execute the **AI Agent Self-Verification Checklist** from `standard-sbb-document.md` and `standard-traceability.md`.
