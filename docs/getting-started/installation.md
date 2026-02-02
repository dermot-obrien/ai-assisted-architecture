# Installation

Complete guide to setting up AI-Assisted Architecture.

## Prerequisites

| Component | Required | Purpose |
|-----------|----------|---------|
| Git | Yes | Version control |
| IDE (VS Code/Cursor/IntelliJ) | Yes | Development environment |
| AI Tool | Yes | AI assistance |
| Python 3.9+ | Optional | Document conversion scripts |
| Node.js 18+ | Optional | Docusaurus (if using) |

## Clone the Repository

```bash
git clone https://github.com/dermot-obrien/ai-assisted-architecture.git
cd ai-assisted-architecture
```

## Documentation Site (Optional)

### Using MkDocs

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
.\venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements-docs.txt

# Serve locally
mkdocs serve

# Build static site
mkdocs build
```

## IDE Setup

### VS Code

1. Install recommended extensions:
   - GitHub Copilot
   - Markdown All in One
   - Draw.io Integration
   - YAML

2. Configure settings:

```json
{
  "editor.formatOnSave": true,
  "markdown.preview.breaks": true,
  "files.associations": {
    "*.md": "markdown"
  }
}
```

### Cursor

1. Download from [cursor.sh](https://cursor.sh)
2. Import VS Code settings (optional)
3. Configure AI preferences in Settings → AI

### IntelliJ IDEA

1. Install plugins:
   - GitHub Copilot
   - Markdown Navigator Enhanced
   - PlantUML Integration

## AI Tool Setup

### GitHub Copilot

1. Subscribe at [github.com/features/copilot](https://github.com/features/copilot)
2. Install extension in your IDE
3. Sign in with GitHub account
4. Enable web search in Copilot Chat settings

### Cursor AI

Built into Cursor IDE. Configure in Settings → AI:

- Model selection
- Context settings
- Privacy preferences

### Claude Code

```bash
# Install CLI
npm install -g @anthropic-ai/claude-code

# Authenticate
claude auth login

# Use in terminal
claude "Your prompt here"
```

## Agent Setup

### Cursor Rules

Copy agent rules to your project:

```bash
cp -r ai-assisted-architecture/core/agents/cursor-rules/ .cursor/rules/
```

### Work Management Agents

See [Agents](../agents/index.md) for configuration and available agents.

## Verify Installation

```bash
# Check MkDocs
mkdocs --version

# Serve documentation
mkdocs serve

# Open http://localhost:8000
```

## Next Steps

- [First Project](first-project.md) - Create your first project
- [Tool Guides](../tooling/index.md) - Detailed tool configuration
- [Methodology](../methodology/index.md) - Start using the methodology
