# AI-Assisted Architecture

[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Documentation](https://img.shields.io/badge/docs-mkdocs-blue)](https://dermot-obrien.github.io/ai-assisted-architecture/)

An opinionated methodology for AI-assisted enterprise and solution architecture.

## Overview

AI-Assisted Architecture provides a comprehensive framework for leveraging AI agents in architecture practice. It enables architects to accelerate research, analysis, and design work while maintaining governance, quality, and human accountability.

## Key Features

- **Opinionated Methodology**: End-to-end process from enterprise context through solution design
- **Building Block Framework**: Architecture Building Blocks (ABBs) and Solution Building Blocks (SBBs)
- **AI Agents**: Work management, ASCII-to-image conversion, and architecture assistants
- **Governance Framework**: Provenance tracking, security dialogue framework, human review gates
- **Multi-Tool Support**: GitHub Copilot, Cursor, Claude Code guides
- **Organization Adoption**: Fork, customize, and contribute back model

## Quick Start

```bash
# Clone the repository
git clone https://github.com/dermot-obrien/ai-assisted-architecture.git
cd ai-assisted-architecture

# Install documentation dependencies
pip install -r requirements-docs.txt

# Serve documentation locally
mkdocs serve
```

Visit `http://localhost:8000` to browse the documentation.

## Methodology Flow

```
Enterprise Context → Capability Modeling → ABBs → SBBs → Solution Design
        ↓                    ↓               ↓       ↓          ↓
    Vision &            L0→L1→L2         Logical  Vendor    Components
    Drivers             Hierarchy        Blocks   Specific  Integration
                        Maturity                            Deployment
```

## Repository Structure

```
ai-assisted-architecture/
├── core/                    # Core methodology and agents
│   ├── methodology/         # End-to-end architecture methodology
│   ├── agents/              # AI agent definitions
│   ├── governance/          # Governance frameworks
│   ├── tooling/             # IDE and tool guides
│   ├── templates/           # Base templates
│   └── building-blocks/     # Reference ABBs and SBBs
├── extensions/              # Extension points for customization
├── docs/                    # Documentation site source
└── scripts/                 # Utility scripts
```

## For Organizations

Organizations can adopt this framework by:

1. **Fork** this repository
2. **Customize** templates, branding, and governance in `overrides/`
3. **Extend** with organization-specific building blocks
4. **Sync** updates from upstream without losing customizations
5. **Contribute** improvements back to the core

See [Organization Adoption Guide](docs/getting-started/organization-adoption.md) for details.

## Documentation

Full documentation is available at: https://dermot-obrien.github.io/ai-assisted-architecture/

Key sections:
- [Getting Started](docs/getting-started/)
- [Methodology](docs/methodology/)
- [Agents](docs/agents/)
- [Governance](docs/governance/)
- [Building Blocks](docs/building-blocks/)

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on:
- Submitting issues and feature requests
- Contributing improvements
- Code of conduct

## License

- Documentation: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)
- Code/Scripts: [MIT License](LICENSE-CODE)

## Attribution

If you use AI-Assisted Architecture, we'd appreciate attribution:
- In documentation: "Built with AI-Assisted Architecture by Dermot Canniffe"
- For derivatives: Keep LICENSE, mention original in README

## Author

**Dermot Canniffe**
- GitHub: [@dermot-obrien](https://github.com/dermot-obrien)
- LinkedIn: [dermot-obrien](https://linkedin.com/in/dermot-obrien)

---

*AI-Assisted Architecture - Accelerating architecture practice through AI agents*
