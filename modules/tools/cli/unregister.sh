#!/bin/bash
#
# wpf unregister - Remove a project from registry
#

# Usage check
if [ -z "$1" ]; then
    echo -e "${RED}Error:${NC} Please provide a project name"
    echo ""
    echo "Usage: wpf unregister <project-name>"
    echo ""
    echo "This only removes the project from WPF tracking."
    echo "It does NOT delete any project files."
    exit 1
fi

PROJECT_NAME="$1"

# Check if project exists
if ! registry_exists "$PROJECT_NAME"; then
    echo -e "${RED}Error:${NC} Project '$PROJECT_NAME' not found in registry"
    echo ""
    echo "Registered projects:"
    registry_list simple | sed 's/^/  - /'
    exit 1
fi

# Get project info before removing
PROJECT_PATH=$(registry_get_path "$PROJECT_NAME")
COMPANY_NAME=$(registry_get "$PROJECT_NAME" "company_name")

echo ""
echo -e "${YELLOW}⚠ About to unregister project:${NC}"
echo ""
echo "  Name:    $PROJECT_NAME"
echo "  Company: $COMPANY_NAME"
echo "  Path:    $PROJECT_PATH"
echo ""
echo -e "${YELLOW}Note: This will NOT delete any files.${NC}"
echo ""

read -p "Are you sure? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Cancelled."
    exit 0
fi

# Remove from registry
registry_remove "$PROJECT_NAME"

echo ""
echo -e "${GREEN}✓ Project '$PROJECT_NAME' unregistered${NC}"
echo ""
echo "Project files remain at: $PROJECT_PATH"
echo "To re-register: wpf register $PROJECT_PATH"
