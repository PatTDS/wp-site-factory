#!/bin/bash
#
# WordPress helper functions for WPF
# Provides WP-CLI execution and container readiness checks
#

# Execute WP-CLI command in Docker
# Tries multiple strategies: wpcli service, wordpress container, docker exec by name
wp_cli() {
    local project_dir="${PROJECT_DIR:-$(pwd)}"

    # Strategy 1: Use dedicated wpcli service (preferred)
    if docker-compose -f "$project_dir/docker-compose.yml" ps 2>/dev/null | grep -q "wpcli"; then
        docker-compose -f "$project_dir/docker-compose.yml" run --rm wpcli "$@" 2>/dev/null && return 0
    fi

    # Strategy 2: Try wordpress service with wp command
    if docker-compose -f "$project_dir/docker-compose.yml" exec -T wordpress which wp >/dev/null 2>&1; then
        docker-compose -f "$project_dir/docker-compose.yml" exec -T wordpress wp "$@" --allow-root 2>/dev/null && return 0
    fi

    # Strategy 3: Try container by project name pattern
    local container=$(docker ps --format '{{.Names}}' | grep -E "(wordpress|wp)" | head -1)
    if [ -n "$container" ]; then
        docker exec "$container" wp "$@" --allow-root 2>/dev/null && return 0
    fi

    echo "WP-CLI not available" >&2
    return 1
}

# Wait for WordPress container to be ready
# Usage: wait_for_wordpress [timeout_seconds]
wait_for_wordpress() {
    local timeout="${1:-60}"
    local elapsed=0
    local interval=2

    echo -n "  Waiting for WordPress..."

    while [ $elapsed -lt $timeout ]; do
        # Check if WordPress responds
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080 2>/dev/null | grep -qE "^(200|301|302|303)$"; then
            echo -e " ${GREEN}ready${NC}"
            return 0
        fi

        sleep $interval
        elapsed=$((elapsed + interval))
        echo -n "."
    done

    echo -e " ${RED}timeout${NC}"
    return 1
}

# Wait for MySQL container to be ready
# Usage: wait_for_mysql [timeout_seconds]
wait_for_mysql() {
    local timeout="${1:-60}"
    local elapsed=0
    local interval=2
    local project_dir="${PROJECT_DIR:-$(pwd)}"

    echo -n "  Waiting for MySQL..."

    while [ $elapsed -lt $timeout ]; do
        # Check if MySQL accepts connections
        if docker-compose -f "$project_dir/docker-compose.yml" exec -T db mysqladmin ping -h localhost --silent 2>/dev/null; then
            echo -e " ${GREEN}ready${NC}"
            return 0
        fi

        sleep $interval
        elapsed=$((elapsed + interval))
        echo -n "."
    done

    echo -e " ${RED}timeout${NC}"
    return 1
}

# Check if Docker containers are running
check_docker_running() {
    local project_dir="${PROJECT_DIR:-$(pwd)}"

    if docker-compose -f "$project_dir/docker-compose.yml" ps 2>/dev/null | grep -q "Up"; then
        return 0
    fi
    return 1
}

# Start Docker containers if not running
ensure_docker_running() {
    local project_dir="${PROJECT_DIR:-$(pwd)}"

    if ! check_docker_running; then
        echo -e "${YELLOW}Docker not running. Starting...${NC}"
        docker-compose -f "$project_dir/docker-compose.yml" up -d
        wait_for_mysql 60
        wait_for_wordpress 60
    fi
}

# Check if WordPress is installed
is_wordpress_installed() {
    wp_cli core is-installed 2>/dev/null
    return $?
}

# Check if a theme is active
is_theme_active() {
    local theme_name="$1"
    local active_theme=$(wp_cli theme list --status=active --field=name 2>/dev/null)
    [ "$active_theme" = "$theme_name" ]
}

# Check if a plugin is active
is_plugin_active() {
    local plugin_name="$1"
    wp_cli plugin is-active "$plugin_name" 2>/dev/null
    return $?
}

# Get list of pages by slug
page_exists() {
    local slug="$1"
    wp_cli post list --post_type=page --name="$slug" --format=count 2>/dev/null | grep -q "^[1-9]"
}

# Check if menu exists
menu_exists() {
    local menu_name="$1"
    wp_cli menu list --format=json 2>/dev/null | grep -q "\"$menu_name\""
}
