# Progress Tracking

This directory tracks the execution of all workflows.

## File Naming Convention

```
{workflow-id}-{timestamp}.md
```

Example: `add-simulator-20240101-120000.md`

## Status Icons

- ⚪ Pending - Not started yet
- 🟡 In Progress - Currently executing
- ✅ Completed - Successfully finished
- ❌ Failed - Encountered errors

## Structure

Each progress file contains:

```markdown
# Workflow Run: {run-id}

**Workflow**: {workflow-id}
**Started**: {timestamp}
**Status**: {icon} {status}

## Inputs

- **input1**: value1
- **input2**: value2

## Steps

- [x] step_one
- [x] step_two
- [ ] step_three

## Outputs

*Pending...*

## Log

- 12:00:00 - Workflow initialized
- 12:05:30 - Step one completed
```

## Viewing Progress

To see all workflow runs:

```bash
ls -la progress/*.md
```

To view specific run:

```bash
cat progress/{run-id}.md
```

## Cleanup

Old progress files can be archived or deleted after workflows complete.
