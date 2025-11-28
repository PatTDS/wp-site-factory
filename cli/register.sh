#!/bin/bash
#
# wpf register - Register an existing project
#

# Usage check
if [ -z "$1" ]; then
    echo -e "${RED}Error:${NC} Please provide a project path"
    echo ""
    echo "Usage: wpf register <path> [name]"
    echo ""
    echo "Examples:"
    echo "  wpf register /home/user/my-project"
    echo "  wpf register /home/user/my-project custom-name"
    echo "  wpf register .  # Register current directory"
    exit 1
fi

PROJECT_PATH="$1"
PROJECT_NAME="${2:-}"

# Handle relative paths and current directory
if [ "$PROJECT_PATH" = "." ]; then
    PROJECT_PATH="$(pwd)"
elif [[ ! "$PROJECT_PATH" = /* ]]; then
    PROJECT_PATH="$(cd "$PROJECT_PATH" 2>/dev/null && pwd)"
fi

# Verify path exists
if [ ! -d "$PROJECT_PATH" ]; then
    echo -e "${RED}Error:${NC} Directory not found: $PROJECT_PATH"
    exit 1
fi

# Get project name from directory if not provided
if [ -z "$PROJECT_NAME" ]; then
    PROJECT_NAME=$(basename "$PROJECT_PATH")
fi

# Normalize project name (lowercase, replace spaces with dashes)
PROJECT_NAME=$(echo "$PROJECT_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')

# Check if already registered
if registry_exists "$PROJECT_NAME"; then
    existing_path=$(registry_get_path "$PROJECT_NAME")
    echo -e "${YELLOW}Warning:${NC} Project '$PROJECT_NAME' already registered"
    echo "  Existing path: $existing_path"
    echo ""
    read -p "Update to new path? (y/n): " update_choice
    if [ "$update_choice" != "y" ]; then
        echo "Registration cancelled."
        exit 0
    fi
    registry_remove "$PROJECT_NAME"
fi

# Try to read existing config
COMPANY_NAME=""
DOMAIN=""
CREATED=""

if [ -f "$PROJECT_PATH/.wpf-config" ]; then
    echo -e "${GREEN}Found existing .wpf-config${NC}"
    source "$PROJECT_PATH/.wpf-config"
    COMPANY_NAME="${COMPANY_NAME:-}"
    DOMAIN="${DOMAIN:-}"
fi

# If no config, try to detect from common files
if [ -z "$COMPANY_NAME" ]; then
    # Try to get from docker-compose.yml
    if [ -f "$PROJECT_PATH/docker-compose.yml" ]; then
        COMPANY_NAME=$(grep -m1 "container_name:" "$PROJECT_PATH/docker-compose.yml" 2>/dev/null | sed 's/.*container_name: \([^_]*\).*/\1/' | head -1)
    fi

    # Try to get from PROJECT_CONTEXT.md
    if [ -z "$COMPANY_NAME" ] && [ -f "$PROJECT_PATH/PROJECT_CONTEXT.md" ]; then
        COMPANY_NAME=$(grep -m1 "^# " "$PROJECT_PATH/PROJECT_CONTEXT.md" 2>/dev/null | sed 's/^# //' | sed 's/ Website.*//')
    fi
fi

# If still nothing, use project name
if [ -z "$COMPANY_NAME" ]; then
    COMPANY_NAME="$PROJECT_NAME"
fi

# Interactive completion if missing info
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}REGISTERING PROJECT${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  Name: $PROJECT_NAME"
echo "  Path: $PROJECT_PATH"
echo ""

# Confirm or update company name
read -p "Company name [$COMPANY_NAME]: " input_company
COMPANY_NAME="${input_company:-$COMPANY_NAME}"

# Confirm or update domain
read -p "Domain [$DOMAIN]: " input_domain
DOMAIN="${input_domain:-$DOMAIN}"

# Get creation date (use directory creation time or now)
if [ -z "$CREATED" ]; then
    CREATED=$(stat -c %y "$PROJECT_PATH" 2>/dev/null | cut -d' ' -f1)
    if [ -z "$CREATED" ]; then
        CREATED=$(date -Iseconds)
    else
        CREATED="${CREATED}T00:00:00"
    fi
fi

# Register the project
registry_add "$PROJECT_NAME" "$PROJECT_PATH" "$COMPANY_NAME" "$DOMAIN" "$CREATED"

# Create or update .wpf-config in project
if [ ! -f "$PROJECT_PATH/.wpf-config" ]; then
    echo "Creating .wpf-config in project..."
    cat > "$PROJECT_PATH/.wpf-config" << EOF
# WPF Project Configuration
# Registered: $(date -Iseconds)
PROJECT_NAME="$PROJECT_NAME"

# Company Basics
COMPANY_NAME="$COMPANY_NAME"
DOMAIN="$DOMAIN"
EOF
fi

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Project registered successfully!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  Project: $PROJECT_NAME"
echo "  Company: $COMPANY_NAME"
echo "  Domain:  $DOMAIN"
echo "  Path:    $PROJECT_PATH"
echo ""
echo "Use 'wpf continue $PROJECT_NAME' to work on this project."
