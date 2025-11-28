#!/bin/bash
#
# wpf continue - Continue working on an existing project
#

# Ensure we have a project name
if [ -z "$1" ]; then
    echo -e "${RED}Error:${NC} Please provide a project name"
    echo "Usage: wpf continue <project-name>"
    echo ""
    echo "Available projects:"
    ls -1 "$PROJECTS_DIR" 2>/dev/null | sed 's/^/  - /'
    exit 1
fi

PROJECT_NAME="$1"
PROJECT_DIR="$PROJECTS_DIR/$PROJECT_NAME"

# Check if project exists
if [ ! -d "$PROJECT_DIR" ]; then
    echo -e "${RED}Error:${NC} Project '$PROJECT_NAME' not found"
    echo ""
    echo "Available projects:"
    ls -1 "$PROJECTS_DIR" 2>/dev/null | sed 's/^/  - /'
    exit 1
fi

# Load project config
CONFIG_FILE="$PROJECT_DIR/.wpf-config"
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
fi

print_banner
echo -e "${GREEN}Continuing project:${NC} $PROJECT_NAME"
echo ""

# Show project context
if [ -f "$PROJECT_DIR/PROJECT_CONTEXT.md" ]; then
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}PROJECT CONTEXT${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    # Show first 30 lines of context
    head -30 "$PROJECT_DIR/PROJECT_CONTEXT.md"
    echo "..."
    echo ""
fi

# Check Docker status
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}DOCKER STATUS${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

cd "$PROJECT_DIR"
if [ -f "docker-compose.yml" ]; then
    DOCKER_STATUS=$(docker-compose ps 2>/dev/null)
    if [ -n "$DOCKER_STATUS" ]; then
        echo "$DOCKER_STATUS"

        # Check if containers are running
        RUNNING=$(docker-compose ps --services --filter "status=running" 2>/dev/null | wc -l)
        if [ "$RUNNING" -eq 0 ]; then
            echo ""
            echo -e "${YELLOW}Containers not running.${NC}"
            read -p "Start Docker environment? (y/n): " start_docker
            if [ "$start_docker" = "y" ]; then
                docker-compose up -d
                echo -e "${GREEN}Docker environment started!${NC}"
                echo "  - WordPress: http://localhost:8080"
                echo "  - PHPMyAdmin: http://localhost:8081"
            fi
        else
            echo ""
            echo -e "${GREEN}✓ Docker environment is running${NC}"
            echo "  - WordPress: http://localhost:8080"
            echo "  - PHPMyAdmin: http://localhost:8081"
        fi
    else
        echo -e "${YELLOW}Docker not running for this project${NC}"
        read -p "Start Docker environment? (y/n): " start_docker
        if [ "$start_docker" = "y" ]; then
            docker-compose up -d
        fi
    fi
else
    echo -e "${YELLOW}No docker-compose.yml found${NC}"
fi

# Show available actions
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}AVAILABLE ACTIONS${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  1. Open project in VS Code"
echo "  2. Run tests"
echo "  3. Deploy to staging"
echo "  4. Deploy to production"
echo "  5. Create backup"
echo "  6. Run health check"
echo "  7. Open WordPress admin"
echo "  8. View logs"
echo "  0. Exit"
echo ""
read -p "Select action (0-8): " action

case $action in
    1)
        code "$PROJECT_DIR"
        ;;
    2)
        source "$CLI_DIR/test.sh"
        ;;
    3)
        source "$CLI_DIR/deploy.sh" staging
        ;;
    4)
        source "$CLI_DIR/deploy.sh" production
        ;;
    5)
        source "$CLI_DIR/backup.sh"
        ;;
    6)
        source "$CLI_DIR/doctor.sh"
        ;;
    7)
        xdg-open "http://localhost:8080/wp-admin" 2>/dev/null || open "http://localhost:8080/wp-admin" 2>/dev/null
        ;;
    8)
        docker-compose logs -f --tail=50
        ;;
    0)
        echo "Goodbye!"
        ;;
    *)
        echo "Invalid option"
        ;;
esac
