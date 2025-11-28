#!/bin/bash
#
# wpf list - List all projects
#

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}WPF PROJECTS${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ ! -d "$PROJECTS_DIR" ] || [ -z "$(ls -A $PROJECTS_DIR 2>/dev/null)" ]; then
    echo "No projects found."
    echo ""
    echo "Create your first project with:"
    echo "  wpf create <project-name>"
    exit 0
fi

for project in "$PROJECTS_DIR"/*/; do
    if [ -d "$project" ]; then
        PROJECT_NAME=$(basename "$project")
        CONFIG_FILE="$project/.wpf-config"

        echo -e "${GREEN}● $PROJECT_NAME${NC}"

        if [ -f "$CONFIG_FILE" ]; then
            source "$CONFIG_FILE"
            echo "  Company: $COMPANY_NAME"
            echo "  Domain:  $DOMAIN"
            echo "  Hosting: $HOSTING"
        fi

        # Check Docker status
        if [ -f "$project/docker-compose.yml" ]; then
            cd "$project"
            RUNNING=$(docker-compose ps --services --filter "status=running" 2>/dev/null | wc -l)
            if [ "$RUNNING" -gt 0 ]; then
                echo -e "  Status:  ${GREEN}Running${NC}"
            else
                echo -e "  Status:  ${YELLOW}Stopped${NC}"
            fi
            cd - > /dev/null
        fi

        echo "  Path:    $project"
        echo ""
    fi
done

echo "Use 'wpf continue <project-name>' to work on a project."
