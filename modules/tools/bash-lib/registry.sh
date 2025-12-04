#!/bin/bash
#
# WPF Registry Library
# Functions for managing project registry
#

# Registry file location
REGISTRY_FILE="$WPF_ROOT/.wpf-registry.json"

# Initialize registry if not exists
registry_init() {
    if [ ! -f "$REGISTRY_FILE" ]; then
        cat > "$REGISTRY_FILE" << 'EOF'
{
  "version": "1.0",
  "projects": {}
}
EOF
    fi
}

# Check if jq is available, if not use basic parsing
check_jq() {
    if command -v jq &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# Add project to registry
# Usage: registry_add <name> <path> <company_name> <domain>
registry_add() {
    local name="$1"
    local path="$2"
    local company_name="${3:-}"
    local domain="${4:-}"
    local created="${5:-$(date -Iseconds)}"
    local registered="$(date -Iseconds)"

    registry_init

    if check_jq; then
        # Use jq for proper JSON manipulation
        local tmp_file=$(mktemp)
        jq --arg name "$name" \
           --arg path "$path" \
           --arg company "$company_name" \
           --arg domain "$domain" \
           --arg created "$created" \
           --arg registered "$registered" \
           '.projects[$name] = {
               "path": $path,
               "company_name": $company,
               "domain": $domain,
               "created": $created,
               "registered": $registered,
               "status": "active"
           }' "$REGISTRY_FILE" > "$tmp_file" && mv "$tmp_file" "$REGISTRY_FILE"
    else
        # Fallback: Simple text-based approach
        # Read current content, add new entry
        local tmp_file=$(mktemp)
        if grep -q '"projects": {}' "$REGISTRY_FILE"; then
            # Empty projects, add first entry
            sed 's/"projects": {}/"projects": {\n    "'"$name"'": {\n      "path": "'"$path"'",\n      "company_name": "'"$company_name"'",\n      "domain": "'"$domain"'",\n      "created": "'"$created"'",\n      "registered": "'"$registered"'",\n      "status": "active"\n    }\n  }/' "$REGISTRY_FILE" > "$tmp_file"
        else
            # Add to existing projects
            sed 's/"projects": {/"projects": {\n    "'"$name"'": {\n      "path": "'"$path"'",\n      "company_name": "'"$company_name"'",\n      "domain": "'"$domain"'",\n      "created": "'"$created"'",\n      "registered": "'"$registered"'",\n      "status": "active"\n    },/' "$REGISTRY_FILE" > "$tmp_file"
        fi
        mv "$tmp_file" "$REGISTRY_FILE"
    fi
}

# Remove project from registry
# Usage: registry_remove <name>
registry_remove() {
    local name="$1"

    if check_jq; then
        local tmp_file=$(mktemp)
        jq --arg name "$name" 'del(.projects[$name])' "$REGISTRY_FILE" > "$tmp_file" && mv "$tmp_file" "$REGISTRY_FILE"
    else
        echo -e "${YELLOW}Warning: jq not installed. Cannot remove project cleanly.${NC}"
        echo "Install jq with: sudo apt-get install jq"
        return 1
    fi
}

# Check if project exists in registry
# Usage: registry_exists <name>
registry_exists() {
    local name="$1"

    registry_init

    if check_jq; then
        local result=$(jq -r --arg name "$name" '.projects[$name] // empty' "$REGISTRY_FILE")
        [ -n "$result" ]
    else
        grep -q "\"$name\":" "$REGISTRY_FILE"
    fi
}

# Get project path by name
# Usage: registry_get_path <name>
registry_get_path() {
    local name="$1"

    if check_jq; then
        jq -r --arg name "$name" '.projects[$name].path // empty' "$REGISTRY_FILE"
    else
        grep -A1 "\"$name\":" "$REGISTRY_FILE" | grep "path" | sed 's/.*"path": "\([^"]*\)".*/\1/'
    fi
}

# Get project info by name
# Usage: registry_get <name> <field>
registry_get() {
    local name="$1"
    local field="$2"

    if check_jq; then
        jq -r --arg name "$name" --arg field "$field" '.projects[$name][$field] // empty' "$REGISTRY_FILE"
    else
        grep -A10 "\"$name\":" "$REGISTRY_FILE" | grep "\"$field\"" | sed 's/.*"'"$field"'": "\([^"]*\)".*/\1/'
    fi
}

# List all projects
# Usage: registry_list [format]
# format: simple (just names), detail (with info)
registry_list() {
    local format="${1:-detail}"

    registry_init

    if check_jq; then
        if [ "$format" = "simple" ]; then
            jq -r '.projects | keys[]' "$REGISTRY_FILE" 2>/dev/null
        else
            jq -r '.projects | to_entries[] | "\(.key)|\(.value.path)|\(.value.company_name)|\(.value.domain)|\(.value.status)"' "$REGISTRY_FILE" 2>/dev/null
        fi
    else
        # Fallback: extract project names
        grep -o '"[^"]*":' "$REGISTRY_FILE" | grep -v "version\|projects\|path\|company\|domain\|created\|registered\|status" | tr -d '":' | head -20
    fi
}

# Count projects
registry_count() {
    if check_jq; then
        jq '.projects | length' "$REGISTRY_FILE" 2>/dev/null || echo "0"
    else
        registry_list simple | wc -l
    fi
}

# Update project field
# Usage: registry_update <name> <field> <value>
registry_update() {
    local name="$1"
    local field="$2"
    local value="$3"

    if check_jq; then
        local tmp_file=$(mktemp)
        jq --arg name "$name" --arg field "$field" --arg value "$value" \
           '.projects[$name][$field] = $value' "$REGISTRY_FILE" > "$tmp_file" && mv "$tmp_file" "$REGISTRY_FILE"
    else
        echo -e "${YELLOW}Warning: jq not installed. Cannot update field.${NC}"
        return 1
    fi
}

# Archive a project (set status to archived)
registry_archive() {
    local name="$1"
    registry_update "$name" "status" "archived"
}

# Get all active projects
registry_list_active() {
    if check_jq; then
        jq -r '.projects | to_entries[] | select(.value.status == "active") | .key' "$REGISTRY_FILE" 2>/dev/null
    else
        registry_list simple
    fi
}

# Validate project path exists
registry_validate() {
    local name="$1"
    local path=$(registry_get_path "$name")

    if [ -n "$path" ] && [ -d "$path" ]; then
        return 0
    else
        return 1
    fi
}

# Export functions
export -f registry_init registry_add registry_remove registry_exists
export -f registry_get_path registry_get registry_list registry_count
export -f registry_update registry_archive registry_list_active registry_validate
