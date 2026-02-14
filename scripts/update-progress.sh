#!/bin/bash
#
# update-progress.sh
# Update a workflow progress file
#
# Usage: ./scripts/update-progress.sh <run-id> <status> [step-id] [message]
# Example: ./scripts/update-progress.sh add-simulator-20240101-120000 completed research "Research complete"

set -e

RUN_ID="$1"
STATUS="$2"
STEP_ID="${3:-}"
MESSAGE="${4:-}"

if [ -z "$RUN_ID" ] || [ -z "$STATUS" ]; then
    echo "Error: Run ID and status required"
    echo "Usage: $0 <run-id> <status> [step-id] [message]"
    echo "Status: pending | in_progress | completed | failed"
    exit 1
fi

PROGRESS_FILE="progress/${RUN_ID}.md"

if [ ! -f "$PROGRESS_FILE" ]; then
    echo "Error: Progress file not found: $PROGRESS_FILE"
    exit 1
fi

# Map status to emoji
case "$STATUS" in
    "pending") STATUS_ICON="⚪" ;;
    "in_progress") STATUS_ICON="🟡" ;;
    "completed") STATUS_ICON="✅" ;;
    "failed") STATUS_ICON="❌" ;;
    *) STATUS_ICON="⚪" ;;
esac

# Update status in file
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    sed -i '' "s/^\\(\\*\\*Status\\*\\*: \\).*/\\1${STATUS_ICON} ${STATUS^}/" "$PROGRESS_FILE"
else
    # Linux
    sed -i "s/^\\(\\*\\*Status\\*\\*: \\).*/\\1${STATUS_ICON} ${STATUS^}/" "$PROGRESS_FILE"
fi

# Update step if provided
if [ -n "$STEP_ID" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/- \\[ \\] ${STEP_ID}/- [x] ${STEP_ID}/" "$PROGRESS_FILE"
    else
        sed -i "s/- \\[ \\] ${STEP_ID}/- [x] ${STEP_ID}/" "$PROGRESS_FILE"
    fi
fi

# Add log entry
if [ -n "$MESSAGE" ]; then
    echo "- $(date '+%H:%M:%S') - ${MESSAGE}" >> "$PROGRESS_FILE"
fi

echo "✅ Progress updated: ${RUN_ID}"

# If completed, update final timestamp
if [ "$STATUS" == "completed" ]; then
    echo "" >> "$PROGRESS_FILE"
    echo "**Completed**: $(date '+%Y-%m-%d %H:%M:%S')" >> "$PROGRESS_FILE"
fi
