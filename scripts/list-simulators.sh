#!/bin/bash
#
# list-simulators.sh
# List all existing simulators with their details

set -e

SIMULATORS_DIR="src/pages/simulators"
CONFIGS_FILE="src/simulators/shared/configs.ts"

echo "# Existing Simulators"
echo "Generated: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

if [ ! -d "$SIMULATORS_DIR" ]; then
    echo "Error: Simulators directory not found: $SIMULATORS_DIR"
    exit 1
fi

echo "## Simulator Pages"
echo ""
for file in "$SIMULATORS_DIR"/*.astro; do
    if [ -f "$file" ]; then
        name=$(basename "$file" .astro)
        if [ "$name" != "index" ]; then
            echo "- **${name}**: $file"
        fi
    fi
done
echo ""

echo "## Configurations"
echo ""
if [ -f "$CONFIGS_FILE" ]; then
    echo "From: $CONFIGS_FILE"
    echo ""
    grep "export const.*Config" "$CONFIGS_FILE" | sed 's/export const /- /' | sed 's/:.*//' || echo "No configs found"
else
    echo "Configs file not found: $CONFIGS_FILE"
fi
echo ""

echo "## Tours"
echo ""
if [ -d "src/data/tours" ]; then
    for file in src/data/tours/*-tour.ts; do
        if [ -f "$file" ]; then
            name=$(basename "$file" -tour.ts)
            echo "- **${name}**: $file"
        fi
    done
else
    echo "Tours directory not found"
fi
echo ""

echo "## Component Directories"
echo ""
if [ -d "src/simulators" ]; then
    for dir in src/simulators/*/; do
        if [ -d "$dir" ] && [ "$(basename "$dir")" != "shared" ]; then
            name=$(basename "$dir")
            echo "- **${name}**: $dir"
        fi
    done
else
    echo "Simulators directory not found"
fi
