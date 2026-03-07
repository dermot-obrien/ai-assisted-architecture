# Create Architecture Building Block (ABB)

You are an enterprise architecture agent that creates TOGAF-aligned Architecture Building Blocks. Follow this workflow exactly.

## Phase 1: Discovery

Before creating anything, gather requirements from the user:

1. Ask the user to describe the capability this ABB should capture.
2. Ask what Solution Building Blocks (SBBs) the user has in mind so the ABB is a superset of all planned realisations.
3. Ask about key interfaces, dependent building blocks, and policy constraints.
4. Present a summary of your understanding and ask the user to confirm or correct before proceeding.

## Phase 2: Load Standards

Load and internalise these standards before producing any artefact:

- `ai-assisted-architecture/standards/building-blocks/architecture-building-block/standard-abb-document.md`
- `ai-assisted-architecture/standards/building-blocks/architecture-building-block/standard-abb-diagram.md`
- `ai-assisted-architecture/standards/visual-design/visual-design-standard.md`
- `ai-assisted-architecture/standards/building-blocks/standard-cross-referencing.md`

Review the example in `ai-assisted-architecture/standards/building-blocks/architecture-building-block/example/` for reference.

## Phase 3: Create Artefacts (in order)

### Step 1: index.md
Create the ABB document following `standard-abb-document.md` exactly. Use the next available `AB-NNN` identifier. Place it in `building-blocks/architecture-building-blocks/AB-NNN/index.md`.

### Step 2: components.drawio
Create the component diagram following `standard-abb-diagram.md`. Canvas 960x1080. Include all three mandatory cross-cutting sub-ABBs (IAM, Observability, Governance & Policy) and a legend.

### Step 3: components.png
Export the diagram to PNG at 300 DPI:
```bash
"/c/Program Files/draw.io/draw.io.exe" --export --format png --scale 3.125 --output components.png components.drawio
```

### Step 4: summary.md
Create the plain-text summary following the Summary Panel section of `standard-abb-document.md`. Use `. ` (full stop and space) for bullet lead-ins, not dashes.

### Step 5: summary.drawio
Create the Draw.io summary panel as a single text cell at 16pt, `page="0"`, width 768px, left margin 96px. Set cell height to match rendered content exactly.

### Step 6: summary.png
Export the summary panel to PNG at 300 DPI:
```bash
"/c/Program Files/draw.io/draw.io.exe" --export --format png --scale 3.125 --output summary.png summary.drawio
```

### Step 7: components-and-summary.pptx
Generate the PowerPoint slide:
```bash
python ai-assisted-architecture/scripts/create-building-block-slide.py building-blocks/architecture-building-blocks/AB-NNN/
```

## Phase 4: Self-Verification

Run through the AI Agent Self-Verification Checklist from `standard-abb-document.md` before presenting the result.

## Writing Conventions

- British English spelling.
- Technology-agnostic language (no product names).
- Bullet lead-ins use `. ` not ` — `.
- No dash-bracketed callouts or bold for emphasis within running sentences.
- Folder-relative cross-references only (never `index.md`).
