# Tooling

Tools and environment setup for AI-assisted architecture.

## Overview

AI-Assisted Architecture works within standard development environments:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                       AI-Assisted Architecture Tooling                           │
└─────────────────────────────────────────────────────────────────────────────────┘

   ┌─────────────────────────────────────────────────────────────────────────┐
   │                           IDE ENVIRONMENT                                │
   │                  (VS Code / Cursor / IntelliJ)                          │
   │                                                                          │
   │  ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────────┐ │
   │  │   AI Assistant   │  │  Workspace Files │  │   Terminal/Scripts     │ │
   │  │  (Copilot/etc)   │  │  (Markdown, YAML)│  │   (Python, Pandoc)     │ │
   │  └──────────────────┘  └──────────────────┘  └────────────────────────┘ │
   └─────────────────────────────────────────────────────────────────────────┘
```

## Supported IDEs

| IDE | Best For | AI Integration |
|-----|----------|----------------|
| **VS Code** | Most users | GitHub Copilot extension |
| **Cursor** | AI-first experience | Built-in AI |
| **IntelliJ** | JetBrains users | Copilot plugin |

## Supported AI Assistants

| Tool | Strengths |
|------|-----------|
| **GitHub Copilot** | Wide IDE support, enterprise ready |
| **Cursor AI** | Deep codebase understanding, agent mode |
| **Claude Code** | Advanced reasoning, large context |

## Quick Setup

### VS Code + GitHub Copilot

```bash
# Install VS Code extensions
code --install-extension GitHub.copilot
code --install-extension GitHub.copilot-chat
code --install-extension yzhang.markdown-all-in-one
code --install-extension hediet.vscode-drawio
```

### Cursor

1. Download from [cursor.sh](https://cursor.sh)
2. Import VS Code settings (optional)
3. AI is built-in - configure with `.cursor/rules/` files

### Python Utilities

```bash
# For document conversion
pip install python-docx pandoc markdown
```

## Workspace Structure

Recommended repository structure:

```
your-architecture-repo/
├── .ai-assisted-work/    # Submodule with agents
├── .cursor/rules/        # Cursor rule files
├── core/                 # Methodology and templates
├── docs/                 # Documentation
└── change/               # Work items
```

## Agent Configuration

AI agents are configured via:

1. **Cursor rules** (`.cursor/rules/*.mdc`) - Always-on guidance
2. **Agent instruction files** - Detailed agent behavior
3. **Building block metadata** - AI hints for selection

See [Agents](../agents/index.md) for details on available agents.

## Next Steps

- [Getting Started](../getting-started/index.md) - Quick start guide
- [Agents](../agents/index.md) - Available AI agents
- [Governance](../governance/index.md) - Controls for AI-assisted work
