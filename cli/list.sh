#!/bin/bash
#
# wpf list - List all registered projects
#
# Uses the project registry to display projects from any location
#

# Source registry library if not already loaded
if [ -z "$(type -t registry_list 2>/dev/null)" ]; then
    source "$WPF_ROOT/lib/registry.sh"
fi

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}WPF PROJECTS${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Initialize registry
registry_init

# Get project count
project_count=$(registry_count)

if [ "$project_count" -eq 0 ]; then
    echo "No projects registered."
    echo ""
    echo "Options:"
    echo "  • Create a new project:      wpf create <project-name>"
    echo "  • Register existing project: wpf register <path>"
    echo ""
    echo "Example:"
    echo "  wpf register /home/user/my-wordpress-site"
    exit 0
fi

echo -e "Found ${GREEN}$project_count${NC} project(s):"
echo ""

# List all projects with details
while IFS='|' read -r name path company domain status; do
    # Skip empty lines
    [ -z "$name" ] && continue

    # Status indicator
    if [ "$status" = "active" ]; then
        status_icon="${GREEN}●${NC}"
    else
        status_icon="${YELLOW}○${NC}"
    fi

    echo -e "${status_icon} ${GREEN}$name${NC}"

    # Show company if available
    if [ -n "$company" ]; then
        echo "  Company: $company"
    fi

    # Show domain if available
    if [ -n "$domain" ]; then
        echo "  Domain:  $domain"
    fi

    # Verify path exists
    if [ -d "$path" ]; then
        # Check Docker status if docker-compose.yml exists
        if [ -f "$path/docker-compose.yml" ]; then
            cd "$path" 2>/dev/null
            RUNNING=$(docker-compose ps --services --filter "status=running" 2>/dev/null | wc -l)
            if [ "$RUNNING" -gt 0 ]; then
                echo -e "  Status:  ${GREEN}Running${NC} ($RUNNING services)"
            else
                echo -e "  Status:  ${YELLOW}Stopped${NC}"
            fi
            cd - > /dev/null 2>&1
        fi
        echo "  Path:    $path"
    else
        echo -e "  Path:    ${RED}$path (NOT FOUND)${NC}"
        echo -e "  ${YELLOW}⚠ Project directory missing. Use 'wpf unregister $name' to remove.${NC}"
    fi

    echo ""
done < <(registry_list detail)

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Commands:"
echo "  wpf continue <name>    Resume work on a project"
echo "  wpf register <path>    Register an existing project"
echo "  wpf unregister <name>  Remove project from registry"
echo ""
