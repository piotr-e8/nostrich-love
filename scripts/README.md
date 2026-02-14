# Scripts

Reusable scripts for workflow execution and common operations.

## Script Philosophy

- **Idempotent**: Can run multiple times safely
- **Composable**: Scripts can call other scripts
- **Documented**: Each script explains what it does
- **Error Handling**: Clear error messages and exit codes

## Available Scripts

### Workflow Execution
- `init-workflow.sh` - Initialize a new workflow run
- `track-progress.sh` - Update progress tracking
- `validate-workflow.sh` - Validate workflow YAML against schema

### Utility Scripts
- `analyze-pattern.sh` - Analyze code patterns in a directory
- `create-agent-task.sh` - Create a task file for an agent
- `update-progress.sh` - Update progress markdown files

### Simulator-Specific
- `extract-brand-colors.sh` - Extract color scheme from images
- `validate-simulator.sh` - Check simulator completeness

## Usage

Scripts are designed to be called by agents or run manually:

```bash
# Initialize workflow tracking
./scripts/init-workflow.sh add-simulator "client_name=Iris" "platform=web"

# Analyze existing patterns
./scripts/analyze-pattern.sh src/simulators/damus/
```

## Adding New Scripts

1. Create script with `.sh` extension
2. Add header comment with description
3. Make executable: `chmod +x scripts/name.sh`
4. Document in this README
