#!/bin/bash
#
# wpf status - Display project completion status
# Shows checkmarks for completed items and next recommended action
#

# Find current project
CURRENT_DIR=$(pwd)
if [ -f "$CURRENT_DIR/.wpf-config" ]; then
    PROJECT_DIR="$CURRENT_DIR"
    source "$CURRENT_DIR/.wpf-config"
elif [ -f "$CURRENT_DIR/../.wpf-config" ]; then
    PROJECT_DIR="$CURRENT_DIR/.."
    source "$CURRENT_DIR/../.wpf-config"
else
    echo -e "${RED}Error:${NC} Not in a WPF project directory"
    echo "Navigate to a project directory or use: wpf continue <project-name>"
    exit 1
fi

# Source libraries
source "$WPF_ROOT/lib/wordpress.sh" 2>/dev/null

print_banner
echo -e "${GREEN}Project Status:${NC} $PROJECT_NAME"
echo -e "${CYAN}Directory:${NC} $PROJECT_DIR"
echo ""

# Status tracking
declare -A STATUS
NEXT_ACTION=""
NEXT_COMMAND=""

# Check functions
check_project_created() {
    [ -d "$PROJECT_DIR" ] && [ -f "$PROJECT_DIR/.wpf-config" ]
}

check_docker_running() {
    docker-compose -f "$PROJECT_DIR/docker-compose.yml" ps 2>/dev/null | grep -q "Up"
}

check_wordpress_installed() {
    if ! check_docker_running; then
        return 1
    fi
    is_wordpress_installed 2>/dev/null
}

check_theme_activated() {
    if ! check_docker_running; then
        return 1
    fi
    local theme_name="${PROJECT_NAME}-theme"
    is_theme_active "$theme_name" 2>/dev/null
}

check_plugins_installed() {
    if ! check_docker_running; then
        return 1
    fi
    # Check essential plugins
    local essential=("seo-by-rank-math" "autoptimize" "contact-form-7")
    for plugin in "${essential[@]}"; do
        if ! is_plugin_active "$plugin" 2>/dev/null; then
            return 1
        fi
    done
    return 0
}

check_pages_created() {
    if ! check_docker_running; then
        return 1
    fi
    # Check required pages
    local pages=("home" "about" "services" "contact")
    for page in "${pages[@]}"; do
        if ! page_exists "$page" 2>/dev/null; then
            return 1
        fi
    done
    return 0
}

check_menu_created() {
    if ! check_docker_running; then
        return 1
    fi
    local menu_name="${COMPANY_NAME:-Main} Menu"
    menu_exists "$menu_name" 2>/dev/null
}

check_tailwind_built() {
    local theme_dir="$PROJECT_DIR/wp-content/themes/${PROJECT_NAME}-theme"
    local css_file="$theme_dir/style.css"

    # Check if CSS exists and is recent (built within last day)
    if [ -f "$css_file" ]; then
        local file_age=$(( $(date +%s) - $(stat -c %Y "$css_file" 2>/dev/null || echo 0) ))
        # Consider it built if file exists and is larger than just header
        local file_size=$(stat -c %s "$css_file" 2>/dev/null || echo 0)
        [ "$file_size" -gt 1000 ]
    else
        return 1
    fi
}

check_staging_deployed() {
    local staging_url="${STAGING_URL:-}"
    if [ -z "$staging_url" ]; then
        return 1
    fi
    curl -s -o /dev/null -w "%{http_code}" "$staging_url" 2>/dev/null | grep -qE "^(200|301|302)$"
}

check_production_deployed() {
    local prod_url="${DOMAIN:-}"
    if [ -z "$prod_url" ]; then
        return 1
    fi
    if [[ ! "$prod_url" =~ ^https?:// ]]; then
        prod_url="https://$prod_url"
    fi
    curl -s -o /dev/null -w "%{http_code}" "$prod_url" 2>/dev/null | grep -qE "^(200|301|302)$"
}

# Display status line
show_status() {
    local label="$1"
    local check_func="$2"
    local action="$3"
    local command="$4"

    if $check_func; then
        echo -e "  ${GREEN}✓${NC} $label"
        STATUS["$label"]="done"
    else
        echo -e "  ${YELLOW}○${NC} $label"
        STATUS["$label"]="pending"
        # Set next action if not already set
        if [ -z "$NEXT_ACTION" ]; then
            NEXT_ACTION="$action"
            NEXT_COMMAND="$command"
        fi
    fi
}

# Main status display
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Milestone Status${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

show_status "Project created" check_project_created \
    "Create a new project" "wpf create $PROJECT_NAME"

show_status "Docker running" check_docker_running \
    "Start Docker containers" "docker-compose up -d"

show_status "WordPress installed" check_wordpress_installed \
    "Run WordPress setup" "wpf setup"

show_status "Theme activated" check_theme_activated \
    "Activate project theme" "wpf setup"

show_status "Plugins installed" check_plugins_installed \
    "Install essential plugins" "wpf setup"

show_status "Pages created" check_pages_created \
    "Create starter pages" "wpf setup"

show_status "Menu created" check_menu_created \
    "Create navigation menu" "wpf setup"

show_status "Tailwind built" check_tailwind_built \
    "Build CSS assets" "wpf build"

show_status "Deployed to staging" check_staging_deployed \
    "Deploy to staging" "wpf deploy staging"

show_status "Deployed to production" check_production_deployed \
    "Deploy to production" "wpf deploy production"

echo ""

# Calculate completion
TOTAL=10
DONE=0
for key in "${!STATUS[@]}"; do
    if [ "${STATUS[$key]}" = "done" ]; then
        DONE=$((DONE + 1))
    fi
done

PERCENT=$((DONE * 100 / TOTAL))

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Progress: ${GREEN}$DONE/$TOTAL${NC} (${PERCENT}%)"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Show progress bar
echo -n "  ["
local filled=$((PERCENT / 5))
local empty=$((20 - filled))
for ((i=0; i<filled; i++)); do echo -n "█"; done
for ((i=0; i<empty; i++)); do echo -n "░"; done
echo "]"

echo ""

# Show next action
if [ -n "$NEXT_ACTION" ]; then
    echo -e "${YELLOW}Next Action:${NC} $NEXT_ACTION"
    echo -e "${CYAN}Command:${NC} $NEXT_COMMAND"
else
    echo -e "${GREEN}✓ All milestones complete!${NC}"
    echo ""
    echo "Your site is ready. Consider running:"
    echo "  • wpf test       - Run performance tests"
    echo "  • wpf verify     - Verify deployment"
    echo "  • wpf backup     - Create backup"
fi

echo ""
