#!/bin/bash
#
# analyze-pattern.sh
# Analyze code patterns in a directory to understand structure and conventions
#
# Usage: ./scripts/analyze-pattern.sh <directory-path> [output-file]
# Example: ./scripts/analyze-pattern.sh src/simulators/damus/

set -e

TARGET_DIR="$1"
OUTPUT_FILE="${2:-}"

if [ -z "$TARGET_DIR" ]; then
    echo "Error: Target directory required"
    echo "Usage: $0 <directory-path> [output-file]"
    exit 1
fi

if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: Directory not found: $TARGET_DIR"
    exit 1
fi

echo "# Pattern Analysis: ${TARGET_DIR}"
echo "Generated: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# File structure
echo "## File Structure"
echo ""
tree -L 3 "$TARGET_DIR" 2>/dev/null || find "$TARGET_DIR" -type f -o -type d | head -30
echo ""

# File extensions used
echo "## File Types"
echo ""
find "$TARGET_DIR" -type f | sed 's/.*\.//' | sort | uniq -c | sort -rn | head -10
echo ""

# Import patterns
echo "## Common Imports"
echo ""
echo "### React/Component Imports"
grep -r "^import.*from" "$TARGET_DIR" 2>/dev/null | grep -E "(react|@/|components|types)" | head -5 || echo "None found"
echo ""

# Function/Component patterns
echo "## Component Patterns"
echo ""
echo "### Export Patterns"
grep -r "^export" "$TARGET_DIR" 2>/dev/null | head -5 || echo "None found"
echo ""

# Styling patterns
echo "## Styling Approach"
echo ""
if find "$TARGET_DIR" -name "*.css" -o -name "*.scss" -o -name "*.module.css" | grep -q .; then
    echo "- Uses CSS files"
    find "$TARGET_DIR" -name "*.css" -o -name "*.scss" -o -name "*.module.css" | head -3
fi
if grep -r "className=" "$TARGET_DIR" 2>/dev/null | head -1 | grep -q .; then
    echo "- Uses Tailwind/CSS classes"
fi
if grep -r "styled" "$TARGET_DIR" 2>/dev/null | head -1 | grep -q .; then
    echo "- May use CSS-in-JS"
fi
echo ""

# TypeScript patterns
echo "## TypeScript Patterns"
echo ""
echo "### Interface Definitions"
grep -r "^interface\|^type " "$TARGET_DIR" 2>/dev/null | head -5 || echo "None found"
echo ""

# Key files
echo "## Key Files"
echo ""
find "$TARGET_DIR" -type f \( -name "index.ts" -o -name "index.tsx" -o -name "types.ts" -o -name "*.config.*" \) | while read -r file; do
    echo "- $(basename "$file"): $file"
done
echo ""

# Write to file if specified
if [ -n "$OUTPUT_FILE" ]; then
    echo "Saving analysis to: $OUTPUT_FILE"
    # Re-run and save (inefficient but simple)
    $0 "$TARGET_DIR" > "$OUTPUT_FILE" 2>&1
fi
