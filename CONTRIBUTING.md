# Contributing to AI-Assisted Architecture

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Ways to Contribute

### 1. Report Issues
- Bug reports for standards or scripts
- Suggestions for improvements
- Documentation clarifications

### 2. Improve Standards
- Enhanced ABB/SBB document or diagram standards
- Visual design standard improvements
- Cross-referencing refinements

### 3. Improve Agents
- Enhanced agent instructions
- New agent capabilities
- Bug fixes in existing agents

### 4. Improve Documentation
- Clearer explanations
- More examples
- Integration guides

### 5. Share Experience
- Use cases and examples
- Tips and best practices
- Integration patterns

## Contribution Process

### For Minor Changes

1. Fork the repository
2. Make your changes
3. Submit a pull request

### For Significant Changes

1. **Open an Issue** describing what you want to contribute
2. **Discuss** with maintainers
3. **Fork and develop**
4. **Submit PR** referencing the issue

## Pull Request Guidelines

### PR Title Format

```
[TYPE] Brief description

Types:
- [STANDARD] Standards changes
- [AGENT] Agent improvements
- [SCRIPT] Script/tooling changes
- [DOCS] Documentation
- [FIX] Bug fixes
```

### PR Description

```markdown
## Summary
What this PR does

## Type
- [ ] Standards improvement
- [ ] Agent improvement
- [ ] Script/tooling change
- [ ] Documentation
- [ ] Bug fix

## Testing
How you tested the changes

## Checklist
- [ ] Organisation-agnostic (no company-specific references)
- [ ] Follows existing patterns
- [ ] Documentation updated
- [ ] Scripts tested locally
```

## Content Guidelines

### Organisation-Agnostic

All contributions must be:

- **Generic.** No company-specific references
- **Reusable.** Works for any organisation
- **Adaptable.** Easy to customise

### Standards

When contributing standards:

- Clear, unambiguous rules
- Non-normative examples where helpful
- British English spelling
- Bullet lead-ins use `. ` not ` — `

### Agent Instructions

When contributing agents:

- Clear, step-by-step instructions
- Defined inputs and outputs
- Error handling guidance
- Examples of usage

## Attribution

### Acknowledging the Original

AI-Assisted Architecture was created by **Dermot O'Brien**. When you:

- **Write** about the framework (blog posts, articles)
- **Present** the framework (talks, demos)
- **Teach** the framework (workshops, courses)
- **Fork** or create derivatives

Please consider crediting the original project and linking to this repository. This helps others find the source and supports the community.

### Derivative Works

If you create a derivative or fork:

1. Keep the original `LICENSE`, `LICENSES/`, and `REUSE.toml` files intact.
2. Preserve `SPDX-FileCopyrightText` and `SPDX-License-Identifier` headers in the files you carry over.
3. Mention "Based on AI-Assisted Architecture by Dermot O'Brien" in your README, and link to the original repository.
4. Indicate any changes you have made (required by both CC BY 4.0 and Apache-2.0).
5. Choose a different name for forks distributed as a distinct product — "AI-Assisted Architecture" is a trademark.

## Licensing of Contributions

This repository is dual-licensed:

- **Content** (Markdown, YAML, CSV, Draw.io, agent specs, foundation seeds): [CC BY 4.0](LICENSES/CC-BY-4.0.txt)
- **Code** (`scripts/*.py`, `scripts/*.ps1`): [Apache-2.0](LICENSES/Apache-2.0.txt)

By submitting a contribution (pull request, patch, issue with code), you agree that your contribution is licensed under the same terms as the file you are modifying. New code files must include an SPDX header:

```python
# SPDX-FileCopyrightText: <year> <your name or organisation>
# SPDX-License-Identifier: Apache-2.0
```

New content files are covered by the bulk rules in `REUSE.toml` and do not need per-file headers, but you may add one if you wish.

The project follows the [REUSE Specification 3.3](https://reuse.software/spec-3.3/) for machine-checkable licensing metadata.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Recognition

Contributors are recognised in:

- Release notes
- Documentation credits

## Questions?

- Open a [Discussion](https://github.com/dermot-obrien/ai-assisted-architecture/discussions)
- Create an [Issue](https://github.com/dermot-obrien/ai-assisted-architecture/issues)

---

Thank you for helping improve AI-Assisted Architecture!
