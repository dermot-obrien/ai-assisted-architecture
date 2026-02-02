# Agent Design Principles

How agents are designed for AI-Assisted Architecture.

## Core Principles

### 1. Single Responsibility

Each agent has one clear purpose:

```
✅ Good: "Start Work Agent" - initializes work items
❌ Bad: "Work Agent" - does everything with work
```

### 2. Explicit Instructions

Agents provide clear, step-by-step instructions:

```markdown
## Steps

1. Read the scope description
2. Create plan.md with activities and tasks
3. Create progress.yaml with initial state
4. Report what was created
```

### 3. Artifact-Oriented

Agents produce specific artifacts:

| Agent | Input | Output |
|-------|-------|--------|
| Start Work | Scope description | plan.md, progress.yaml |
| Convert ASCII | Markdown with ASCII | .drawio, .png files |
| Research | Research question | Research summary |

### 4. Composable

Agents can be chained:

```
Start Work → Progress Work → Work Status → Complete Work
```

### 5. Idempotent Where Possible

Running an agent twice should be safe:

```
✅ "Update progress.yaml with current status" - safe to repeat
❌ "Add a new activity" - would duplicate
```

## Agent Structure

### Standard Agent File

```markdown
# Agent Name

Brief description of what this agent does.

## Purpose

Detailed explanation of the agent's purpose.

## Prerequisites

What must be true before using this agent:

- Prerequisite 1
- Prerequisite 2

## Inputs

| Input | Required | Description |
|-------|----------|-------------|
| input_1 | Yes | Description |
| input_2 | No | Description |

## Steps

1. First step
2. Second step
3. Third step

## Outputs

| Output | Description |
|--------|-------------|
| output_1 | What this produces |

## Examples

### Example 1: [Scenario]

[Example usage and output]

## Error Handling

| Error | Resolution |
|-------|------------|
| error_1 | How to handle |
```

### Cursor Rule Format

```markdown
---
name: agent-name
description: Brief description
type: manual
---

# Agent Name

[Agent content following standard structure]
```

## Agent Hints for Building Blocks

Building blocks include hints for agents:

```yaml
agent_hints:
  selection_criteria: |
    Use this ABB when the solution requires [criteria]
  composition_notes: |
    Typically paired with ABB-YYY for [scenario]
  common_mistakes: |
    Do not use for [anti-pattern]
```

These hints help agents:
- Select appropriate building blocks
- Compose them correctly
- Avoid common errors

## Testing Agents

### Manual Testing

1. Run the agent with sample input
2. Verify outputs match expectations
3. Test edge cases

### Validation Checklist

- [ ] Agent produces expected artifacts
- [ ] Artifacts are well-formed
- [ ] Provenance is set correctly
- [ ] Error cases handled gracefully

## Creating New Agents

1. **Identify the need** - What task needs automation?
2. **Define scope** - Single responsibility
3. **Design artifacts** - What does it produce?
4. **Write instructions** - Clear, step-by-step
5. **Add examples** - Show expected behavior
6. **Test thoroughly** - Verify with real scenarios
7. **Document** - Add to agent index
