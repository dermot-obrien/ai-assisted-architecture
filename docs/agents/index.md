# Agents

AI agents that automate and assist with architecture work.

## Overview

AI-Assisted Architecture provides several agent types:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         AI-Assisted Architecture Agents                          │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                            WORK MANAGEMENT AGENTS                                │
│                                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │ Start Work  │  │  Progress   │  │   Status    │  │   Pivot     │            │
│  │   Agent     │  │   Work      │  │   Agent     │  │   Agent     │            │
│  │             │  │   Agent     │  │             │  │             │            │
│  │ Initialize  │  │ Execute     │  │ Report      │  │ Rescope     │            │
│  │ work items  │  │ tasks       │  │ progress    │  │ and replan  │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                            ASCII IMAGE AGENTS                                    │
│                                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Detect     │  │  Convert    │  │  Replace    │  │  Validate   │            │
│  │  ASCII      │  │  ASCII      │  │  ASCII      │  │  Diagrams   │            │
│  │             │  │             │  │             │  │             │            │
│  │ Find ASCII  │  │ Generate    │  │ Update docs │  │ Check       │            │
│  │ in markdown │  │ Draw.io     │  │ with images │  │ consistency │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────┐
│                        ARCHITECTURE ASSISTANT AGENTS                             │
│                                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐            │
│  │  Research   │  │    Gap      │  │   Pattern   │  │    ABB      │            │
│  │   Agent     │  │  Analysis   │  │  Selector   │  │  Composer   │            │
│  │             │  │   Agent     │  │   Agent     │  │   Agent     │            │
│  │ Technology  │  │ Capability  │  │ Recommend   │  │ Select and  │            │
│  │ research    │  │ gap finding │  │ patterns    │  │ compose BBs │            │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘            │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## Agent Categories

### Work Management Agents

Manage architecture work items through their lifecycle:

| Agent | Purpose | Location |
|-------|---------|----------|
| **Start Work** | Initialize work items with plan.md, progress.yaml | `.ai-assisted-work/agents/work-management/` |
| **Progress Work** | Execute tasks, update deliverables | `.ai-assisted-work/agents/work-management/` |
| **Work Status** | Report progress, identify blockers | `.ai-assisted-work/agents/work-management/` |
| **Pivot Work** | Rescope and replan when needed | `.ai-assisted-work/agents/work-management/` |

Work management agents are provided via the `.ai-assisted-work` submodule. See [core/agents/work-management](../../core/agents/work-management/) for local copies.

### ASCII Image Agents

Convert ASCII diagrams to proper images:

| Agent | Purpose |
|-------|---------|
| **Detect ASCII** | Find ASCII diagrams in markdown |
| **Convert ASCII** | Generate Draw.io XML from ASCII |
| **Replace ASCII** | Update documents with image references |
| **Validate** | Check diagram consistency |

ASCII image agents are provided via the `.ai-assisted-work` submodule.

### Architecture Assistants

Assist with architecture tasks:

| Agent | Purpose | Status |
|-------|---------|--------|
| **Research** | Technology research and synthesis | Planned |
| **Gap Analysis** | Capability gap identification | Planned |
| **Pattern Selector** | Recommend appropriate patterns | Planned |
| **ABB Composer** | Select and compose building blocks | Planned |

*Architecture assistant agents are planned for future releases.*

## Using Agents

### With Cursor

Agents are available as Cursor rules:

```
.cursor/rules/
├── work-management.mdc
├── ascii-image.mdc
├── start-work.mdc
├── progress-work.mdc
└── ...
```

Invoke with commands like `/start-work` or `/progress-work`.

### With Claude Code

Reference agent instructions in your prompts:

```bash
claude "Follow the start-work agent instructions to initialize 
a new work item for [description]"
```

### With GitHub Copilot

Use `@workspace` with agent instruction files:

```
@workspace #file:agents/work-management/start-work.md 
Initialize a work item for [description]
```

## Agent Design Principles

See [Design Principles](design-principles.md) for how agents are structured.

## Next Steps

- [Design Principles](design-principles.md) - How agents are structured
- [Tooling Guide](../tooling/index.md) - Configure your IDE
- [Design Principles](design-principles.md) - Understand agent design
