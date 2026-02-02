# Design Decisions

Key design decisions made in creating AI-Assisted Architecture.

**Author**: Dermot Canniffe  
**Date**: February 2026

---

## DD-01: Repository Structure

### Context

Need a structure that supports:
- Documentation site generation
- Multi-organization adoption
- Core vs customization separation

### Decision

Three-tier structure:
1. `core/` - Versioned methodology and agents
2. `extensions/` - Extension points and examples
3. `docs/` - Documentation site source

### Rationale

- Clear separation of concerns
- Organizations can override without touching core
- Documentation site builds cleanly

---

## DD-02: Building Block Separation (ABB/SBB)

### Context

Architecture patterns need to be:
- Reusable across platforms
- Vendor-specific when needed
- Stable yet evolvable

### Decision

Two-tier building blocks:
- **ABB (Architecture Building Block)**: Logical, vendor-agnostic
- **SBB (Solution Building Block)**: Physical, vendor-specific

### Rationale

- ABBs provide stable reference points
- SBBs capture technology evolution
- Clear mapping between capability and implementation
- Enables multi-cloud strategies

---

## DD-03: Provenance Standard

### Context

AI-generated content needs:
- Clear origin identification
- Review state tracking
- Audit trail

### Decision

Three-state model:
- `ai-raw` - AI-generated, not reviewed
- `ai-curated` - Reviewed by generalist
- `draft` - Validated by SME

### Rationale

- Aligns with EU AI Act requirements
- Matches C2PA and NIST standards
- Simple enough to adopt
- Clear quality gates

---

## DD-04: Agent Design Pattern

### Context

AI agents need:
- Clear purpose
- Reproducible behavior
- Integration with multiple tools

### Decision

Single-responsibility agents with:
- Explicit instructions (steps)
- Defined inputs/outputs
- Artifact-oriented design
- Tool-agnostic instructions

### Rationale

- Easier to test and validate
- Works across Cursor, Claude Code, Copilot
- Composable for complex workflows

---

## DD-05: Multi-Organization Adoption

### Context

Organizations need to:
- Adopt the methodology
- Customize for their needs
- Stay current with updates
- Contribute back improvements

### Decision

Fork-and-customize model:
- Core as git subtree/submodule
- `overrides/` for customizations
- Semantic versioning for updates
- PR-based contribution

### Rationale

- Organizations control their pace
- Updates don't break customizations
- Clear contribution path
- Community can grow

---

## DD-06: Documentation Platform

### Context

Need static site generation that:
- Works with Markdown
- Supports navigation
- Deploys to GitHub Pages
- Is easy to maintain

### Decision

MkDocs Material as primary, with Docusaurus config available.

### Rationale

- MkDocs is simpler (Python vs Node.js)
- Material theme is excellent
- Wide adoption in technical docs
- Easy migration path if needed

---

## DD-07: Tooling Neutrality

### Context

AI tools are evolving rapidly:
- GitHub Copilot established
- Cursor gaining adoption
- Claude Code emerging
- More tools coming

### Decision

Support multiple tools with:
- Tool-specific guides
- Common agent instructions
- No hard dependency on any tool

### Rationale

- Users choose their tools
- Methodology survives tool changes
- Broader adoption potential

---

## DD-08: Work Management Approach

### Context

Architecture work needs tracking:
- Scope definition
- Task breakdown
- Progress monitoring
- Deliverable tracking

### Decision

File-based work management:
- `scope.md` - Scope definition
- `plan.md` - Activities and tasks
- `progress.yaml` - Machine-readable status
- Agent-driven updates

### Rationale

- Version controlled with architecture
- AI agents can read/update
- No external tool dependency
- Simple and portable

---

## DD-09: ASCII Diagram Strategy

### Context

Architecture documents often have ASCII diagrams:
- Quick to create in text
- Version control friendly
- But look unprofessional in published docs

### Decision

ASCII-to-image conversion agents:
- Detect ASCII in markdown
- Convert to Draw.io format
- Replace with image references
- Maintain both formats

### Rationale

- Authors can work in ASCII
- Published docs look professional
- Source remains version-controllable
- Automated conversion reduces friction

---

## DD-10: Licensing Strategy

### Context

Need licenses that:
- Encourage adoption
- Allow commercial use
- Require attribution
- Protect scripts separately

### Decision

Dual licensing:
- **CC BY 4.0** for documentation/methodology
- **MIT** for code/scripts

### Rationale

- CC BY 4.0 is standard for documentation
- Attribution requirement builds community
- MIT for code is permissive and familiar
- Commercial use encouraged

---

## DD-11: Security Dialogue Framework

### Context

Organizations using AI for architecture need:
- Security team buy-in
- Clear boundaries
- Governance controls
- Regulatory alignment

### Decision

Structured security dialogue framework with:
- Pre-conditions checklist
- Information flow controls
- Candidate decisions
- Regulatory mapping

### Rationale

- Proactive engagement better than reactive
- Clear controls reduce friction
- Regulatory alignment future-proofs
- Reusable across organizations

---

## Decision Log

| ID | Decision | Date | Status |
|----|----------|------|--------|
| DD-01 | Repository Structure | 2026-02 | Implemented |
| DD-02 | ABB/SBB Separation | 2026-02 | Implemented |
| DD-03 | Provenance Standard | 2026-02 | Implemented |
| DD-04 | Agent Design Pattern | 2026-02 | Implemented |
| DD-05 | Multi-Org Adoption | 2026-02 | Implemented |
| DD-06 | Documentation Platform | 2026-02 | Implemented |
| DD-07 | Tooling Neutrality | 2026-02 | Implemented |
| DD-08 | Work Management | 2026-02 | Implemented |
| DD-09 | ASCII Diagram Strategy | 2026-02 | Implemented |
| DD-10 | Licensing Strategy | 2026-02 | Implemented |
| DD-11 | Security Dialogue | 2026-02 | Implemented |
