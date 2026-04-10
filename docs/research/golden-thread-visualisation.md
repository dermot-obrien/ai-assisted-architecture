---
title: Golden Thread Visualisation — Research and Recommendations
date: 2026-04-08
author: Architecture Team
status: Reference research
---

# Golden Thread Visualisation — Research and Recommendations

## 1. Scope and intent

This document surveys how enterprise-architecture (EA) practice conventionally draws **strategy-to-execution traceability** and distils the findings into a concrete visual grammar for a Python renderer that will be added to the `ai-assisted-architecture` framework.

The renderer will take an SBB identifier (for example `SB-NPC-009`), walk Markdown links upward through the framework's eight-layer chain — Outcome -> Use Case -> Platform -> Bounded Context / Capability -> ABB -> SBB -> Service — and produce a single-page artefact that an executive can read in a meeting. Critically, it must also show **capability completeness** for the Bounded Context the selected ABB lives in: sibling ABBs that exist today, ABBs that are proposed, and ABBs that are explicit gaps. The diagram must therefore be both a *thread* (one vertical slice) and a *slice of a map* (horizontal context around the thread).

This document is not a prescription. It is a survey with a recommended grammar. The renderer specification is a separate deliverable.

## 2. Terminology

The term "Golden Thread" collides with two unrelated ideas. Being precise about which concept we mean is load-bearing for this work.

- **Golden Thread (EA, traceability sense).** The unbroken chain of justification from strategic intent to running technology. "Organizations seek strategy-to-execution traceability — from objectives and principles to roadmaps and project charters" ([Good e-Learning on TOGAF Roadmap](https://goodelearning.com/what-is-a-togaf-architecture-roadmap/)). This is what TOGAF's Roadmap, Gap, and Consolidated Gaps/Solutions/Dependencies matrices operationalise ([TOGAF 9.2, Phase E](https://pubs.opengroup.org/architecture/togaf9-doc/arch/chap12.html)). It is also implicit in ArchiMate's Realization relationships across layers. **This is the sense used throughout this document and by the framework.**

- **Golden Path (Spotify / Platform Engineering sense).** The opinionated, supported, paved way to build a specific kind of thing: a backend service, a data pipeline, a frontend. It is a *developer-enablement* concept, not a traceability one ([Spotify Engineering](https://engineering.atspotify.com/2020/08/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem), [Red Hat on Golden Paths](https://www.redhat.com/en/topics/platform-engineering/golden-paths)). Netflix calls its equivalent the "paved road". The two phrases are regularly confused in slide decks; the renderer must not use "Golden Path" to mean traceability.

- **Traceability Matrix.** A tabular form of the same idea. TOGAF's "Consolidated Gaps, Solutions, and Dependencies Matrix" is the canonical example. Matrices scale and audit well but are executive-hostile; they communicate completeness but not narrative flow.

- **Value Stream Map.** A horizontal, left-to-right representation of the stages by which value reaches a customer, usually from lean/SAFe practice ([TOGAF Value Streams Guide](https://pubs.opengroup.org/togaf-standard/business-architecture/value-streams.html)). It is a *business* view and is orthogonal to technical traceability, though the two are increasingly cross-mapped (value stream stages x capabilities) in tools such as Bizzdesign, Ardoq and SAP LeanIX.

For the renderer, we are building a **Golden Thread view with embedded capability-completeness context**. It is neither a pure traceability matrix nor a pure value stream map; it borrows from both.

## 3. Conventions from established frameworks

### 3.1 TOGAF

TOGAF supplies the vocabulary ("Baseline", "Target", "Gap", "Architecture Roadmap", "Work Package") but does not prescribe a single Golden Thread diagram. Phase E produces the Roadmap and the Consolidated Gaps/Solutions/Dependencies Matrix as separate artefacts ([TOGAF 9.2, Phase E](https://pubs.opengroup.org/architecture/togaf9-doc/arch/chap12.html)). Readers are expected to mentally join them. The Roadmap is a timeline; the matrix is a table. Neither is a stakeholder-friendly single-page visual.

**Takeaway for the renderer.** The framework's concepts (existing / proposed / gap) map cleanly to TOGAF's Baseline / Target / Gap. We should re-use that vocabulary verbatim in the legend.

### 3.2 ArchiMate

ArchiMate 3.2 is the most directly relevant standard. It supplies layers (Strategy, Motivation, Business, Application, Technology, Physical, Implementation & Migration) and explicit cross-layer relationships — *realization*, *serving*, *assignment* — that literally draw a thread between strategic motivation and running technology ([ArchiMate 3.2 Strategy Layer](https://pubs.opengroup.org/architecture/archimate3-doc/ch-Strategy-Layer.html), [Example Viewpoints](https://pubs.opengroup.org/architecture/archimate3-doc/ch-Example-Viewpoints.html)).

Two viewpoints matter for us:

- **Capability Realization Viewpoint.** Shows a Capability being realised by Business Processes and Application Components, which in turn are deployed on Technology. This is structurally the same trace our framework wants.
- **Goal Realization / Motivation Viewpoint.** Links Stakeholder -> Driver -> Goal -> Outcome -> Requirement, and is the upstream half of our chain (Outcome / Use Case / Platform).

ArchiMate deliberately leaves **colour** semantically meaningless — "many modelers use colours to distinguish between the different layers", but the spec does not mandate it ([Visual Paradigm ArchiMate guide](https://www.visual-paradigm.com/guide/archimate/full-archimate-viewpoints-guide/)). In practice, the de-facto convention in Archi, Sparx, and Bizzdesign tooling is:

- Motivation / Strategy — purple
- Business — yellow
- Application — blue
- Technology — green
- Implementation & Migration — pink / orange

**Takeaway for the renderer.** Adopt the de-facto ArchiMate layer colours as a *starting point*, then override with the tokens in `standards/visual-design/visual-design-standard.md`. Stakeholders accustomed to ArchiMate will read the layering without needing a legend.

### 3.3 Team Topologies

Team Topologies does not define traceability diagrams; it defines **team shapes** (stream-aligned, platform, enabling, complicated-subsystem) and **interaction modes** (collaboration, X-as-a-service, facilitating) ([teamtopologies.com/key-concepts](https://teamtopologies.com/key-concepts)). Its contribution to our work is conceptual: a platform exists to reduce cognitive load on stream-aligned teams, and so a Golden Thread diagram is most useful when it answers "which stream-aligned team consumes this, and via what interface?" This argues for making the **Platform row** of the diagram name the platform *team* alongside the platform itself, and for showing the self-service interface as a distinct shape.

### 3.4 C4 model

Simon Brown's C4 model ([c4model.com](https://c4model.com/)) is a **zoom** model, not a traceability model: Context -> Container -> Component -> Code. Each level nests inside the one above it. Its relevance here is a single, important design principle: **different audiences read different levels of the same picture**, and the levels must be visually distinct and linkable. The renderer should make each layer of the Golden Thread clickable / hyperlinkable down to the more detailed artefact for that layer — an ABB block, for instance, should link to its full ABB diagram — in the same spirit that a C4 Context box links to a Container diagram.

### 3.5 SAFe

SAFe frames architecture through **value streams** (operational and development) and **Agile Release Trains** realising them ([Scaled Agile — Value Stream Identification](https://scaledagile.com/blog/10-tips-for-value-stream-identification/)). Its characteristic visualisation is the left-to-right value stream strip with capabilities cross-mapped to stages. Northwestern Mutual's "Big Visible Information Radiator" is a well-known instance, showing flow from ART identification through launch.

**Takeaway for the renderer.** Executives are far more practised at reading **horizontal value-stream strips** than vertical tree-of-life diagrams. Even when the semantic flow is top-down (Outcome -> Service), the *physical* layout may benefit from being horizontal, with the chain running left-to-right and the capability-completeness band running vertically beneath the selected ABB.

### 3.6 Gartner and tooling vendors

Gartner's Magic Quadrant leaders for EA tooling (Bizzdesign, Ardoq, SAP LeanIX, Software AG) all produce **business capability heatmaps** as their flagship executive visual. Heatmaps colour capabilities by maturity, value, cost, or investment need ([Capstera on heatmaps](https://www.capstera.com/business-capability-heatmaps/), [NILUS on ArchiMate heatmapping](https://www.nilus.be/blog/capability-heatmapping-with-archimate-advanced-techniques/)). This is the single most battle-tested executive EA visual, and the renderer should borrow its grammar for the capability-completeness band: a strip of equal-sized tiles, one per ABB, colour-coded by status.

## 4. Readability patterns for stakeholder audiences

Synthesising from the frameworks above and from Azure's explicit diagramming guidance ([Create architecture design diagrams, Microsoft Learn](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/design-diagrams)):

- **Flow direction.** Use horizontal left-to-right for the main spine. Non-architects read stories left-to-right. Reserve vertical stacking for cross-cutting concerns that "cut through" the spine. Conflict: ArchiMate tradition is vertical (Strategy on top, Technology on the bottom). Resolution: run the spine horizontally but keep the ArchiMate layer *colours* so trained readers still get the signal.

- **Status notation.** TOGAF and ArchiMate do **not** standardise a status notation for baseline / target / gap. Practitioner convention (widely adopted, e.g. in Archi, Sparx, Bizzdesign) is:
  - *Existing / baseline*: solid fill, full-opacity border.
  - *Proposed / target*: dashed border, lighter fill.
  - *Gap / missing*: dashed border, no fill, status glyph (warning or plus).
  - *Deprecated*: strikethrough, grey fill.
  - *Selected (the one ABB this workload uses)*: heavy border, accent colour, or glow.
  Recommend adopting these verbatim and encoding them as tokens in the visual-design standard. The colours themselves should come from the visual-design palette, not be hardcoded.

- **Alternatives considered but not selected.** Two conventions exist. (a) A lighter "also-rans" tile row beneath the selected item, greyed out. (b) A footnote box. The first is preferred because it keeps the comparison on-page, which is the whole point of showing alternatives to an executive.

- **Cross-cutting concerns.** IAM / Observability / Governance should be drawn as a **horizontal band** underneath the spine, with a visible connector into the selected ABB. ArchiMate handles this via Grouping or the Implementation & Migration layer; our framework treats them as mandatory rows on every ABB, so the renderer should surface them as a *pinned footer band* on the diagram.

- **"One workload's slice" framing.** The executive question is "is this all we have, or is there more?" Answer it visually by drawing the selected ABB on top of a faded strip of all sibling ABBs in the same Bounded Context. The strip is the capability map; the highlighted tile is the thread.

- **Linking to detail.** Every block on the diagram should be a hyperlink. Draw.io supports per-shape hyperlinks in its XML and preserves them through SVG export. This gives the Simon Brown "zoom" behaviour without adding any new visual complexity.

## 5. Reference examples

The following public examples informed the recommendations. Each is useful and each has something wrong with it.

1. **ArchiMate Capability Realization View (The Open Group spec, Example Viewpoints).** Authoritative and complete — every layer is visible and every relationship typed. *Confusing:* uses many relationship arrow types (realization, assignment, serving) that look almost identical to a non-architect, and relies on vertical stacking with colour-coded layers with no legend.

2. **Northwestern Mutual BVIR (SAFe, via Scaled Agile).** A large physical information radiator tracking ARTs through identification, formation, launch, sustainment. *Works well:* horizontal flow, very clear state columns, large format. *Confusing:* assumes you already know SAFe vocabulary; there is no trace to business outcomes, only to ARTs.

3. **Bizzdesign / SAP LeanIX capability heatmaps (vendor demos; see [Dragon1 Business Capability Heat Map demo](https://www.dragon1.com/demo/business-capability-heat-map)).** The gold standard for executive-readable capability views. *Works well:* equal-size tiles, single colour dimension, legend on the page, grouped by business domain. *Confusing:* no traceability to the strategy that justifies investment; it is a snapshot, not a story.

4. **TOGAF Architecture Roadmap (Phase E deliverable).** Canonical and auditable. *Works well:* explicit work packages on a timeline. *Confusing:* it is essentially a Gantt chart, and has no visual link between the work packages and the capabilities they realise. Executives have to trust that the join was done correctly offstage.

5. **UK GDS Architectural Decision Record framework ([GOV.UK ADR framework](https://www.gov.uk/government/publications/architectural-decision-record-framework/architectural-decision-record-framework)).** Not a diagram but a document pattern; mentioned because it is the clearest public statement that traceability of *decisions* is a first-class EA concern in large public programmes. The renderer should make the thread's links clickable in a way that lets an ADR attach to any node.

**Common failure mode.** Every example above communicates either the thread *or* the map, not both. Our renderer's novel contribution is to put them on one page.

## 6. Python tooling assessment

The renderer must write draw.io XML (for editability) and should additionally emit PNG and SVG for embedding. The following libraries were evaluated:

- **drawpyo** ([PyPI](https://pypi.org/project/drawpyo/), [GitHub](https://github.com/MerrimanInd/drawpyo)). A Python wrapper that writes Draw.io XML. Supports styles, containers, external shape libraries (Azure, AWS, GCP). Actively maintained. Plaintext XML output is version-controllable. **Verdict: primary candidate.** Lowest-friction path from Python dicts to editable Draw.io files.

- **Hand-written mxGraph XML via `lxml` or `xml.etree`.** Maximum control, no dependency surface, but the XML is verbose and brittle. Reasonable as a fallback if drawpyo's abstractions get in the way of, for example, custom routing of the cross-cutting-concerns band. **Verdict: keep as escape hatch.**

- **`mermaid-py` / Mermaid as text.** Mermaid is easy, version-friendly, and renders on GitHub. However, it is *not editable in Draw.io*, its architecture-diagram support is still marked beta, and its layout algorithms do not cope well with the asymmetric spine-plus-band layout we want. **Verdict: not suitable for the primary output; acceptable as a secondary text-readable version in the ADR body.**

- **`diagrams` (mingrammer).** Beautiful for cloud-provider-icon diagrams, but PNG-only and not editable. **Verdict: not suitable.**

- **`graphviz2drawio`.** Round-trip Graphviz to Draw.io. Useful if we ever want Graphviz's layout engine. **Verdict: optional accelerator if drawpyo's manual placement becomes painful.**

**Recommendation.** Build on drawpyo. Keep hand-written XML as an escape hatch for any shape drawpyo does not yet expose. Do not use Mermaid for the executive artefact.

## 7. Recommended visual grammar for the framework

This is the starting point for the renderer specification. All values referenced by colour-token ID map to `standards/visual-design/visual-design-standard.md` and must not be hardcoded in examples.

### Layout topology

- **Spine.** Horizontal, left-to-right, one row of blocks: `Outcome | Use Case | Platform | Bounded Context | Capability | ABB | SBB | Service`. Eight cells, equal width, arrows between them labelled with the relationship type (`realises`, `owned by`, `lives in`, `implements`).
- **Capability-completeness band.** Directly beneath the ABB cell, a horizontal strip containing one tile for every sibling ABB in the same Bounded Context. The selected ABB is visually lifted out of the strip and drawn on the spine. The strip makes the "slice of a map" visible.
- **Cross-cutting-concerns footer.** A thin horizontal band across the full width of the page containing three labelled tiles: IAM, Observability, Governance. Each has a connector into the selected ABB.
- **Header.** Title, SBB ID, workload name, date, framework version.
- **Legend.** Bottom-right. Explains the six status treatments and the layer colours.

### Shape conventions

| Artefact | Shape | Size class |
|---|---|---|
| Outcome | Rounded rectangle, strategy-layer colour | Small, spine |
| Use Case | Rounded rectangle, strategy-layer colour | Small, spine |
| Platform | Rectangle with a badge for the platform team | Medium, spine |
| Bounded Context | Rectangle with a dashed internal divider | Medium, spine |
| Capability | Rounded rectangle, business-layer colour | Small, spine |
| ABB | Rectangle, application-layer colour, heavy border if selected | Large, spine + band |
| SBB | Rectangle with vendor/product glyph | Medium, spine |
| Service | Hexagon (runtime unit) | Small, spine |
| Cross-cutting concern | Pill shape, technology-layer colour | Footer band |

### Colour conventions

Use the de-facto ArchiMate layer hues as the base semantics, mapped through the framework's visual-design tokens:

- Strategy / Motivation layer — token group `strategy.*`
- Business layer (Capability, Bounded Context) — token group `business.*`
- Application layer (ABB, SBB) — token group `application.*`
- Technology / runtime layer (Service, cross-cutting) — token group `technology.*`

### Status markers

| Status | Fill | Border | Glyph |
|---|---|---|---|
| Existing (baseline) | Solid, full opacity | Solid | none |
| Proposed (target) | 40% opacity of base | Dashed | small "+" top-right |
| Gap (missing) | None (white) | Dashed, accent | warning triangle |
| Gap-just-closed (this workload delivers it) | Solid | Solid, accent glow | star |
| Deprecated | Grey, 30% opacity | Solid, strikethrough | cross |
| Alternative considered | 30% opacity | Dotted | footnote marker |

The "selected" treatment is a heavy border plus a subtle glow; it is **orthogonal** to status (a selected block can be existing *or* gap-just-closed).

### Where capability-completeness context lives

Under the ABB spine cell. Same horizontal band, equal-sized tiles, one tile per sibling ABB in the owning Bounded Context, coloured by status. A faint vertical connector links the selected ABB on the spine down to its tile in the strip, so the reader sees "this is the one we picked out of the set". The strip's width is capped; if there are more than ten sibling ABBs, overflow into a second row rather than shrinking tiles below legibility.

### Gap and alternative markers

Gaps are shown twice: once as their own tile in the completeness strip (so the audience sees the hole in the map), and once as a ghost block on the spine if the workload narratively depends on closing that gap. Alternatives considered but not selected for the current workload are shown as a small stacked row beneath the selected ABB on the spine, each with a footnote marker linking to the decision record.

### Detail links

Every block must carry a hyperlink attribute in the emitted mxGraph XML, pointing at the Markdown file for that artefact in the workspace. On SVG export these become real anchor tags. On PNG export they are lost; the renderer should also emit a Markdown sibling file with the same links listed in order, so that the image stays browsable from a doc.

## 8. Open questions

- **Horizontal vs vertical spine.** Recommended horizontal. Conflict with ArchiMate tradition. Decide before implementation; a configuration flag would cost little.
- **How many sibling ABBs before the completeness strip stops being useful?** Pragmatic guess: ten. Beyond that, consider wrapping or replacing with a separate capability heatmap page.
- **Should Use Case be a separate spine cell or merged with Outcome?** The framework's concept model treats them as distinct, but the visual spine has a budget of ~8 cells and Use Case is often invisible to executives. Candidate compromise: draw Use Case as a small caption beneath Outcome rather than a full cell.
- **Cross-cutting concerns on every ABB or only the selected one?** The framework says every ABB must address IAM / Observability / Governance. The diagram only has room to show them for the selected ABB. Recommend footer-band scoping to the selected ABB plus a note in the legend that every ABB has the same concerns.
- **Multiple SBBs realising one ABB.** The chain is technically Outcome -> ... -> ABB -> SBB -> Service, but an ABB often has more than one SBB. Do we widen the spine at that point, or show SBBs as a fanout band like the capability-completeness strip? The fanout band is more consistent and is the recommended default.
- **Version and time.** TOGAF Roadmaps are time-phased. The first version of this renderer is a *snapshot*. Adding a time axis is a separate, larger problem and should not be attempted in v1.

---

## Sources

- [TOGAF 9.2 — Phase E: Opportunities and Solutions](https://pubs.opengroup.org/architecture/togaf9-doc/arch/chap12.html)
- [TOGAF 9.2 — Architecture Deliverables](https://pubs.opengroup.org/architecture/togaf9-doc/arch/chap32.html)
- [TOGAF Value Streams Guide — The Open Group](https://pubs.opengroup.org/togaf-standard/business-architecture/value-streams.html)
- [TOGAF Business Capabilities Guide — The Open Group](https://pubs.opengroup.org/togaf-standard/business-architecture/business-capabilities.html)
- [What is a TOGAF Architecture Roadmap? — Good e-Learning](https://goodelearning.com/what-is-a-togaf-architecture-roadmap/)
- [ArchiMate 3.2 Specification — Strategy Layer](https://pubs.opengroup.org/architecture/archimate3-doc/ch-Strategy-Layer.html)
- [ArchiMate 3.2 Specification — Example Viewpoints](https://pubs.opengroup.org/architecture/archimate3-doc/ch-Example-Viewpoints.html)
- [Full ArchiMate Viewpoints Guide — Visual Paradigm](https://www.visual-paradigm.com/guide/archimate/full-archimate-viewpoints-guide/)
- [Capability Heatmapping with ArchiMate — NILUS](https://www.nilus.be/blog/capability-heatmapping-with-archimate-advanced-techniques/)
- [ArchiMate Examples — Holistic Enterprise Development](https://www.hosiaisluoma.fi/blog/archimate-examples/)
- [C4 model — c4model.com](https://c4model.com/)
- [C4 model — Wikipedia](https://en.wikipedia.org/wiki/C4_model)
- [Team Topologies — Key Concepts](https://teamtopologies.com/key-concepts)
- [Spotify Engineering — How We Use Golden Paths](https://engineering.atspotify.com/2020/08/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem)
- [Red Hat — What is a Golden Path for software development?](https://www.redhat.com/en/topics/platform-engineering/golden-paths)
- [Scaled Agile — 10 Tips for Value Stream Identification](https://scaledagile.com/blog/10-tips-for-value-stream-identification/)
- [Dragon1 Business Capability Heat Map demo](https://www.dragon1.com/demo/business-capability-heat-map)
- [Capstera — Business Capability Heatmaps](https://www.capstera.com/business-capability-heatmaps/)
- [Microsoft Learn — Create architecture design diagrams (Azure Well-Architected)](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/design-diagrams)
- [GOV.UK — Architectural Decision Record Framework](https://www.gov.uk/government/publications/architectural-decision-record-framework/architectural-decision-record-framework)
- [drawpyo — PyPI](https://pypi.org/project/drawpyo/)
- [drawpyo — GitHub (MerrimanInd)](https://github.com/MerrimanInd/drawpyo)
- [mermaid-py — PyPI](https://pypi.org/project/mermaid-py/)
