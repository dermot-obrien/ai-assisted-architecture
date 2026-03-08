# AI writes faster than your architecture team can stay consistent

*Most enterprise architecture teams produce inconsistent artefacts because they rely on conventions that live in people's heads. AI agents make this worse unless you give them explicit, deterministic standards. I built an open-source framework that does exactly that.*

Last year I started using AI agentic tools seriously for enterprise architecture work, including [Claude Code](https://code.claude.com/docs/en/overview), [Gemini CLI](https://geminicli.com/), [Codex CLI](https://developers.openai.com/codex/cli/), [Cursor](https://cursor.com/), [GitHub Copilot](https://github.com/copilot), roughly in preference order but depending on the task and context. The productivity gains were immediate and obvious from the start. Draft a reference architecture in an afternoon instead of a week. Generate a gap analysis while you're still in the meeting. Produce a capability model before the stakeholder has finished describing what they want.

But a pattern emerged that took longer to see.

Every artefact the agents produced was *individually* good. Plausible structure, reasonable content, professional tone. The problem was that none of them were consistent with each other. Two building blocks created a week apart used different document structures, different diagram conventions, different terminology for the same concepts. One had a security section. The other didn't. The capability model used terms that didn't appear in any of the building blocks it supposedly mapped to.

I was producing high-quality *inconsistency* at scale.

## The consistency problem predates AI

This isn't a new problem, of course. Enterprise architecture teams have always struggled with it. The difference is that AI accelerates the rate at which inconsistent artefacts accumulate. When creating a building block took a week, inconsistencies crept in slowly and could be caught in reviews. When it takes an afternoon, the backlog of "we should really align these" grows faster than anyone can address it.

The root cause is the same either way: the standards live in people's heads, in tribal knowledge, in "look at what Sarah did for the last one and follow that pattern". That works when Sarah is available and the team is small. It falls apart at scale, and it falls apart completely when the person doing the work is an AI agent that has never met Sarah or Sarah leaves the team.

## What the framework does

[AI-Assisted Architecture](https://github.com/dermot-obrien/ai-assisted-architecture) is an open-source framework I built to solve this in my personal practice over the last year or so. It provides 14 explicit standards and 7 agent skills that together ensure every architecture artefact, whether produced by a human, an AI agent, or a combination, follows the same structure, visual language, and traceability rules.

It installs as a Git submodule (`.ai-assisted-architecture/`) in any workspace and works with Claude Code, Cursor, GitHub Copilot, Gemini, Cline, and Windsurf. The standards are plain markdown files. The agent skills are prompt specifications. There's no platform dependency and no vendor lock-in. However, some agents and tools work better than others. Claude Code and Opus 4.6 are my current go-to tool and model for best quality documents and diagrams (via Draw.io).

The framework is TOGAF-aligned. It uses Architecture Building Blocks (ABBs) for technology-agnostic logical architecture and Solution Building Blocks (SBBs) for product-specific implementations. But it extends TOGAF's vocabulary with concepts from Team Topologies (Platforms), Domain-Driven Design (Bounded Contexts, Ubiquitous Language), and capability modelling to create a complete hierarchy:

```
Business Outcomes → Use Cases → Platforms → Bounded Contexts
    → Capabilities → ABBs → SBBs → Runtime Services
```

I call this the *Golden Thread*. Every entity links to the layers above and below it. The traceability is structural, not aspirational. Agents check for it and flag gaps.

## Design decisions worth explaining

A few choices in the framework are non-obvious, and I want to explain the reasoning behind them.

### Mandatory cross-cutting concerns

Every ABB must explicitly address three things before expanding into the context-specific features: Identity and Access Management, Observability, and Governance. These aren't optional sections that architects can fill in later. They're mandatory in both the document template and the diagram layout, with reserved visual colours so they're immediately identifiable.

I made this choice because in twenty-five years of enterprise and solution architecture work, I've never seen optional security and observability sections get filled in consistently. People intend to. They don't. AI agents will happily skip them too unless the standard says they're required and the verification checklist checks for them.

This is how the framework shifts cross-cutting concerns left. Not by asking people to remember, but by making the structure enforce it.

### Platform as the primary organisational unit

The framework is opinionated about organisational structure: a *Platform* is the primary unit. It's a team-owned, boundary-defined entity that provides capabilities as a product. It has consumption interfaces (APIs, CLIs, portals, SDKs) and is accountable for strategic outcomes. Each Platform contains one or more Bounded Contexts.

This collapses several concepts that other frameworks keep separate ("domain", "capability area", "product", "team boundary") into a single entity with clear ownership semantics. It draws from Team Topologies, the CNCF Platforms White Paper, and Evan Bottcher's definition of a digital platform.

The practical benefit: when an AI agent creates a building block, it knows where that building block belongs organisationally. The Platform gives it a home. The Bounded Context gives it linguistic boundaries. The capability model gives it business justification. None of these relationships need to be inferred or guessed.

### Deterministic diagram specifications

The framework is also opinionated about architecture diagram format. After working through different options over the last year, I've settled on Draw.io being a good format that LLMs can generate and consume. I found a diagrams-as-code approach (Mermaid, PlantUML, D2, etc.) too frustrating to wrangle diagrams into the shape I needed, apart from narrow areas such as sequence diagrams.

The ABB diagram standard in the framework specifies using Draw.io ready to paste into PowerPoint slides. It specifies compatible canvas dimensions, component box content requirements, external actor placement (right side, outside boundary, specific dimensions), interface label formats ("I1 Policy query", not just "I1"), and cross-cutting sub-group positioning.

This level of detail might look excessive. It's deliberate. When two different agents create diagrams on two different days, the output should look like it came from the same hand. That only happens when the specification leaves no room for interpretation. However, the differences between current foundation models mean that diagram quality may become inconsistent if you switch models frequently.

## The agent workflow

Each of the seven agent skills (one per hierarchy layer) follows a four-phase pattern:

**Discovery.** The agent checks what already exists. If you're creating an ABB and there's no Bounded Context for it, the agent proposes one. If there's no Platform, it suggests that too. The Golden Thread doesn't get broken by accident.

**Load Standards.** Before generating anything, the agent reads the relevant standards from the framework. The ABB skill loads the document standard, diagram standard, visual design standard, and traceability standard.

**Create Artefacts.** The agent produces the full artefact set: structured markdown, draw.io diagrams, PNG exports at 300 DPI, and PowerPoint slides. All following the loaded standards.

**Self-Verification.** The agent runs through a checklist derived from the standard. Missing traceability links, empty mandatory sections, bare component names without descriptions, incorrect colour references: all get flagged before the agent considers the job done.

## The foundation seed

Staring at a blank workspace is demoralising, and AI agents work better when they have examples to learn from. The framework ships with a foundation seed that bootstraps:

- 12 example Platforms (Security through Continuous Delivery)
- 44 example Capabilities across three levels (L1 domains, L2 subdomains, L3 concrete capabilities)
- 12 example Bounded Contexts with defined ubiquitous language
- 8 example ABBs with complete diagram sets
- 3 example SBBs with product mappings
- 13 example Strategic Outcomes

A single script seeds the workspace. Profiles let you be selective: `core` for cross-cutting baseline, `integration` for API and messaging, `infrastructure` for compute and storage, or `foundation` for everything. Delete what doesn't apply, rename what doesn't fit, extend what's useful.

The seed content also serves as a worked example of every standard in the framework. Reading AB-001 (Identity and Access Management) teaches you more about the ABB standard than reading the standard itself.

## What this is and isn't

It is a set of standards and agent skills for producing consistent architecture artefacts. It is TOGAF-aligned and methodology-aware. It is open source and dual-licensed: free for open-source and non-commercial use (AGPL-3.0), with a commercial licence available for proprietary use. Documentation is freely reusable with attribution.

It is not a repository tool (use Confluence, SharePoint, whatever), nor an EA modelling tool (not competing with Sparx or LeanIX), nor a methodology (TOGAF and Team Topologies are the methodologies; this provides the production scaffolding). It assumes you will use git and markdown as your primary expression of architecture and use standard tools to render into HTML for publishing. In this way, it takes full advantage of AI tools designed for coding.

## What's next

The framework currently handles creation workflows. The roadmap includes governance workflows (review, approve, deprecate), landscape analysis (gap identification, redundancy detection, maturity assessment across building blocks), and automated traceability audits across large architecture repositories.

I also want to explore multi-agent workflows where different agents own different layers of the hierarchy (a capability agent, a building block agent, a solution agent) coordinating through the shared standards and traceability rules.

But the immediate value is simpler than any of that. If you're using AI agents for architecture work today and the output is inconsistent, the fix isn't better prompts. It's better standards.

The framework is at [github.com/dermot-obrien/ai-assisted-architecture](https://github.com/dermot-obrien/ai-assisted-architecture).

---

*Dermot O'Brien is an enterprise architect with over 40 years in IT, including AI and machine learning research since the early 1990s. He builds open-source frameworks for AI-assisted architecture and writes about the intersection of enterprise architecture, AI agents, and practical ways of working. This is the second article in a series. The first, on cognitive load and WIP limits for architects, is [here](https://www.dermot-obrien.com/before-ai-can-help-you-fix-your-cognitive-load/). Connect on [LinkedIn](https://www.linkedin.com/in/dermot-obrien/) or explore the framework on [GitHub](https://github.com/dermot-obrien/ai-assisted-architecture).*
