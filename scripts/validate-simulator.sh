#!/bin/bash
#
# validate-simulator.sh
# Validate a simulator implementation for completeness
#
# Usage: ./scripts/validate-simulator.sh <client-slug>
# Example: ./scripts/validate-simulator.sh damus

set -e

CLIENT_SLUG="$1"

if [ -z "$CLIENT_SLUG" ]; then
    echo "Error: Client slug required"
    echo "Usage: $0 <client-slug>"
    exit 1
fi

CLIENT_NAME=$(echo "$CLIENT_SLUG" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')

echo "# Simulator Validation: ${CLIENT_NAME}"
echo "Checked: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

ERRORS=0
WARNINGS=0

check_file() {
    local file="$1"
    local desc="$2"
    local required="$3"
    
    if [ -f "$file" ]; then
        echo "✅ ${desc}: ${file}"
        return 0
    else
        if [ "$required" == "true" ]; then
            echo "❌ ${desc}: ${file} (REQUIRED)"
            ((ERRORS++))
        else
            echo "⚠️  ${desc}: ${file} (optional)"
            ((WARNINGS++))
        fi
        return 1
    fi
}

check_dir() {
    local dir="$1"
    local desc="$2"
    
    if [ -d "$dir" ]; then
        echo "✅ ${desc}: ${dir}"
        return 0
    else
        echo "❌ ${desc}: ${dir}"
        ((ERRORS++))
        return 1
    fi
}

echo "## Required Files"
echo ""
check_file "src/pages/simulators/${CLIENT_SLUG}.astro" "Page file" "true"
check_file "src/data/tours/${CLIENT_SLUG}-tour.ts" "Tour config" "true"
check_file "src/simulators/${CLIENT_SLUG}/${CLIENT_SLUG}.theme.css" "Theme CSS" "false"
echo ""

echo "## Component Structure"
echo ""
check_dir "src/simulators/${CLIENT_SLUG}" "Component directory"
check_file "src/simulators/${CLIENT_SLUG}/${CLIENT_NAME}Simulator.tsx" "Main component" "true"
check_file "src/simulators/${CLIENT_SLUG}/${CLIENT_NAME}SimulatorWithTour.tsx" "Tour wrapper" "true"
check_file "src/simulators/${CLIENT_SLUG}/index.ts" "Index export" "true"
echo ""

echo "## Screens"
echo ""
SCREEN_COUNT=$(find "src/simulators/${CLIENT_SLUG}/screens" -name "*.tsx" 2>/dev/null | wc -l)
if [ "$SCREEN_COUNT" -gt 0 ]; then
    echo "✅ Screen components: ${SCREEN_COUNT} found"
    find "src/simulators/${CLIENT_SLUG}/screens" -name "*.tsx" 2>/dev/null | head -5 | sed 's/^/  - /'
else
    echo "⚠️  Screen components: None found (may use different structure)"
    ((WARNINGS++))
fi
echo ""

echo "## Configuration"
echo ""
if [ -f "src/simulators/shared/configs.ts" ]; then
    if grep -q "${CLIENT_SLUG}Config" "src/simulators/shared/configs.ts"; then
        echo "✅ Config registered"
    else
        echo "❌ Config not registered in configs.ts"
        ((ERRORS++))
    fi
    
    if grep -q "${CLIENT_NAME}" "src/simulators/shared/configs.ts"; then
        echo "✅ Client name in configs"
    else
        echo "❌ Client name not found in configs.ts"
        ((ERRORS++))
    fi
else
    echo "❌ Configs file not found"
    ((ERRORS++))
fi
echo ""

echo "## Assets"
echo ""
if [ -f "public/icons/${CLIENT_SLUG}.png" ] || [ -f "public/icons/${CLIENT_SLUG}.svg" ]; then
    echo "✅ Icon exists"
else
    echo "⚠️  Icon not found: public/icons/${CLIENT_SLUG}.(png|svg)"
    ((WARNINGS++))
fi

echo ""
echo "## Summary"
echo ""
echo "- Errors: ${ERRORS}"
echo "- Warnings: ${WARNINGS}"
echo ""

if [ "$ERRORS" -eq 0 ] && [ "$WARNINGS" -eq 0 ]; then
    echo "✅ All checks passed!"
    exit 0
elif [ "$ERRORS" -eq 0 ]; then
    echo "⚠️  Validation passed with warnings"
    exit 0
else
    echo "❌ Validation failed with ${ERRORS} errors"
    exit 1
fi
