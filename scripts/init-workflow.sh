#!/bin/bash
#
# init-workflow.sh
# Initialize a new workflow run with progress tracking
#
# Usage: ./scripts/init-workflow.sh <workflow-id> [key=value...]
# Example: ./scripts/init-workflow.sh add-simulator "client_name=Iris" "platform=web"

set -e

WORKFLOW_ID="$1"
shift

if [ -z "$WORKFLOW_ID" ]; then
    echo "Error: Workflow ID required"
    echo "Usage: $0 <workflow-id> [key=value...]"
    exit 1
fi

# Generate unique run ID
RUN_ID="${WORKFLOW_ID}-$(date +%Y%m%d-%H%M%S)"
PROGRESS_FILE="progress/${RUN_ID}.md"

# Create progress directory if needed
mkdir -p progress

# Parse inputs into JSON-like format
INPUTS=""
for arg in "$@"; do
    if [[ "$arg" == *"="* ]]; then
        key="${arg%%=*}"
        value="${arg#*=}"
        INPUTS="${INPUTS}- **${key}**: ${value}\n"
    fi
done

# Create progress file
cat > "$PROGRESS_FILE" << EOF
# Workflow Run: ${RUN_ID}

**Workflow**: ${WORKFLOW_ID}
**Started**: $(date '+%Y-%m-%d %H:%M:%S')
**Status**: 🟡 In Progress

## Inputs

${INPUTS}

## Steps

EOF

# Load workflow definition and append steps
WORKFLOW_FILE="workflows/${WORKFLOW_ID}.yaml"
if [ -f "$WORKFLOW_FILE" ]; then
    echo "Loading workflow steps from ${WORKFLOW_FILE}..."
    
    # Extract step names and create checklist
    # Note: This is a simple parser, assumes YAML structure
    grep -E "^  - id:" "$WORKFLOW_FILE" | while read -r line; do
        step_id=$(echo "$line" | sed 's/.*id: //')
        echo "- [ ] ${step_id}" >> "$PROGRESS_FILE"
    done
else
    echo "Warning: Workflow file not found: ${WORKFLOW_FILE}"
    echo "- [ ] Define workflow steps" >> "$PROGRESS_FILE"
fi

cat >> "$PROGRESS_FILE" << EOF

## Outputs

*Pending...*

## Log

- $(date '+%H:%M:%S') - Workflow initialized

EOF

echo "✅ Workflow initialized: ${RUN_ID}"
echo "Progress file: ${PROGRESS_FILE}"

# Output the run ID for use by caller
echo "RUN_ID=${RUN_ID}"
