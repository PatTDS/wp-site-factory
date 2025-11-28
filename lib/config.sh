#!/bin/bash
#
# WPF Config Library
# Functions for reading and managing project configuration
#

# Load project config from .wpf-config file
# Usage: config_load <project_path>
config_load() {
    local project_path="${1:-.}"
    local config_file="$project_path/.wpf-config"

    if [ ! -f "$config_file" ]; then
        echo "Error: Config file not found: $config_file" >&2
        return 1
    fi

    # Source the config file (it's bash format)
    source "$config_file"

    # Set defaults for optional fields
    HOSTING_PROVIDER="${HOSTING_PROVIDER:-sftp}"
    HOSTING_PORT="${HOSTING_PORT:-22}"
    HOSTING_PATH="${HOSTING_PATH:-/public_html}"
    ENVIRONMENT="${ENVIRONMENT:-production}"

    return 0
}

# Get a config value
# Usage: config_get <key> [default]
config_get() {
    local key="$1"
    local default="${2:-}"
    local value="${!key}"

    if [ -z "$value" ]; then
        echo "$default"
    else
        echo "$value"
    fi
}

# Check if config has required fields
# Usage: config_validate
config_validate() {
    local missing=()

    [ -z "$PROJECT_NAME" ] && missing+=("PROJECT_NAME")
    [ -z "$DOMAIN" ] && missing+=("DOMAIN")

    if [ ${#missing[@]} -gt 0 ]; then
        echo "Error: Missing required config fields: ${missing[*]}" >&2
        return 1
    fi

    return 0
}

# Check if hosting is configured
# Usage: config_has_hosting
config_has_hosting() {
    [ -n "$HOSTING_HOST" ] && [ -n "$HOSTING_USER" ]
}

# Get hosting credentials
# Supports: environment variable, credentials file, or config
# Usage: config_get_hosting_pass
config_get_hosting_pass() {
    # Priority: ENV > credentials file > config

    # 1. Check environment variable
    if [ -n "$WPF_HOSTING_PASS" ]; then
        echo "$WPF_HOSTING_PASS"
        return 0
    fi

    # 2. Check credentials file
    local creds_file="$HOME/.wpf-credentials"
    if [ -f "$creds_file" ]; then
        source "$creds_file"
        local key="${PROJECT_NAME}_HOSTING_PASS"
        local value="${!key}"
        if [ -n "$value" ]; then
            echo "$value"
            return 0
        fi
    fi

    # 3. Check config (not recommended, but supported)
    if [ -n "$HOSTING_PASS" ]; then
        echo "$HOSTING_PASS"
        return 0
    fi

    return 1
}

# Get full URL for the project
# Usage: config_get_url [protocol]
config_get_url() {
    local protocol="${1:-https}"

    if [ -n "$DOMAIN" ]; then
        echo "${protocol}://${DOMAIN}"
    else
        echo "http://localhost:8080"
    fi
}

# Get environment type
# Usage: config_get_environment
config_get_environment() {
    if [ -n "$ENVIRONMENT" ]; then
        echo "$ENVIRONMENT"
    elif [[ "$DOMAIN" == *"staging"* ]] || [[ "$DOMAIN" == *"dev"* ]]; then
        echo "staging"
    elif [[ "$DOMAIN" == "localhost"* ]] || [[ -z "$DOMAIN" ]]; then
        echo "local"
    else
        echo "production"
    fi
}

# Check if we're in a WPF project directory
# Usage: config_is_wpf_project [path]
config_is_wpf_project() {
    local path="${1:-.}"
    [ -f "$path/.wpf-config" ]
}

# Create default config file
# Usage: config_create <project_path> <project_name> [company_name] [domain]
config_create() {
    local project_path="$1"
    local project_name="$2"
    local company_name="${3:-$project_name}"
    local domain="${4:-}"
    local config_file="$project_path/.wpf-config"

    cat > "$config_file" << EOF
# WPF Project Configuration
# Generated: $(date -Iseconds)

# Project Basics
PROJECT_NAME="$project_name"
COMPANY_NAME="$company_name"
DOMAIN="$domain"

# Hosting Configuration (fill in for deployment)
# HOSTING_PROVIDER="sftp"    # sftp, ftp, rsync, ssh
# HOSTING_HOST=""
# HOSTING_USER=""
# HOSTING_PORT="22"
# HOSTING_PATH="/public_html"

# Environment
ENVIRONMENT="production"    # local, staging, production

# Testing
TEST_SKIP_ADMIN="true"      # Skip admin tests on production
TEST_BROWSERS="chromium"    # chromium, firefox, webkit
EOF

    echo "Created config: $config_file"
}

# Update a config value
# Usage: config_set <key> <value> [config_file]
config_set() {
    local key="$1"
    local value="$2"
    local config_file="${3:-.wpf-config}"

    if grep -q "^${key}=" "$config_file" 2>/dev/null; then
        # Update existing
        sed -i "s|^${key}=.*|${key}=\"${value}\"|" "$config_file"
    else
        # Add new
        echo "${key}=\"${value}\"" >> "$config_file"
    fi
}

# Display config summary
# Usage: config_show
config_show() {
    echo "=== WPF Project Configuration ==="
    echo "Project:     ${PROJECT_NAME:-<not set>}"
    echo "Company:     ${COMPANY_NAME:-<not set>}"
    echo "Domain:      ${DOMAIN:-<not set>}"
    echo "Environment: $(config_get_environment)"
    echo ""

    if config_has_hosting; then
        echo "=== Hosting Configuration ==="
        echo "Provider:    ${HOSTING_PROVIDER:-sftp}"
        echo "Host:        ${HOSTING_HOST}"
        echo "User:        ${HOSTING_USER}"
        echo "Port:        ${HOSTING_PORT:-22}"
        echo "Path:        ${HOSTING_PATH:-/public_html}"

        if config_get_hosting_pass > /dev/null 2>&1; then
            echo "Password:    [configured]"
        else
            echo "Password:    [not configured]"
        fi
    else
        echo "=== Hosting: Not Configured ==="
    fi
}
