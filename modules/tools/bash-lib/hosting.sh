#!/bin/bash
#
# WPF Hosting Abstraction Library
# Provider-agnostic hosting operations
#

# Source config library if not already loaded
if [ -z "$(type -t config_load 2>/dev/null)" ]; then
    source "${WPF_ROOT:-$(dirname "${BASH_SOURCE[0]}")/..}/lib/config.sh"
fi

# Current provider (set by hosting_init)
_HOSTING_PROVIDER=""

# Initialize hosting with current project config
# Usage: hosting_init [project_path]
hosting_init() {
    local project_path="${1:-.}"

    # Load project config
    if ! config_load "$project_path"; then
        return 1
    fi

    # Validate hosting config
    if ! config_has_hosting; then
        echo "Error: Hosting not configured in .wpf-config" >&2
        echo "Required: HOSTING_HOST, HOSTING_USER" >&2
        return 1
    fi

    # Set provider
    _HOSTING_PROVIDER="${HOSTING_PROVIDER:-sftp}"

    # Load provider implementation
    local provider_file="$WPF_ROOT/lib/providers/${_HOSTING_PROVIDER}.sh"
    if [ -f "$provider_file" ]; then
        source "$provider_file"
    else
        echo "Error: Unknown hosting provider: $_HOSTING_PROVIDER" >&2
        echo "Available: sftp, ftp, rsync" >&2
        return 1
    fi

    return 0
}

# Test connection to hosting
# Usage: hosting_test_connection
hosting_test_connection() {
    if [ -z "$_HOSTING_PROVIDER" ]; then
        echo "Error: Hosting not initialized. Call hosting_init first." >&2
        return 1
    fi

    echo "Testing connection to ${HOSTING_HOST}..."

    # Call provider-specific implementation
    _provider_test_connection
}

# Upload files to hosting
# Usage: hosting_upload <local_path> <remote_path> [exclude_patterns...]
hosting_upload() {
    local local_path="$1"
    local remote_path="${2:-$HOSTING_PATH}"
    shift 2
    local excludes=("$@")

    if [ -z "$_HOSTING_PROVIDER" ]; then
        echo "Error: Hosting not initialized" >&2
        return 1
    fi

    echo "Uploading $local_path to ${HOSTING_HOST}:${remote_path}..."
    _provider_upload "$local_path" "$remote_path" "${excludes[@]}"
}

# Download files from hosting
# Usage: hosting_download <remote_path> <local_path>
hosting_download() {
    local remote_path="$1"
    local local_path="$2"

    if [ -z "$_HOSTING_PROVIDER" ]; then
        echo "Error: Hosting not initialized" >&2
        return 1
    fi

    echo "Downloading ${HOSTING_HOST}:${remote_path} to ${local_path}..."
    _provider_download "$remote_path" "$local_path"
}

# List files on hosting
# Usage: hosting_list [remote_path]
hosting_list() {
    local remote_path="${1:-$HOSTING_PATH}"

    if [ -z "$_HOSTING_PROVIDER" ]; then
        echo "Error: Hosting not initialized" >&2
        return 1
    fi

    _provider_list "$remote_path"
}

# Create backup on hosting
# Usage: hosting_backup <backup_name>
hosting_backup() {
    local backup_name="${1:-backup-$(date +%Y%m%d-%H%M%S)}"

    if [ -z "$_HOSTING_PROVIDER" ]; then
        echo "Error: Hosting not initialized" >&2
        return 1
    fi

    echo "Creating backup: ${backup_name}..."
    _provider_backup "$backup_name"
}

# Execute command on hosting (if supported)
# Usage: hosting_exec <command>
hosting_exec() {
    local command="$1"

    if [ -z "$_HOSTING_PROVIDER" ]; then
        echo "Error: Hosting not initialized" >&2
        return 1
    fi

    if type -t _provider_exec &> /dev/null; then
        _provider_exec "$command"
    else
        echo "Error: Remote execution not supported by $_HOSTING_PROVIDER provider" >&2
        return 1
    fi
}

# Check if file exists on hosting
# Usage: hosting_exists <remote_path>
hosting_exists() {
    local remote_path="$1"

    if [ -z "$_HOSTING_PROVIDER" ]; then
        echo "Error: Hosting not initialized" >&2
        return 1
    fi

    _provider_exists "$remote_path"
}

# Delete file/directory on hosting
# Usage: hosting_delete <remote_path>
hosting_delete() {
    local remote_path="$1"

    if [ -z "$_HOSTING_PROVIDER" ]; then
        echo "Error: Hosting not initialized" >&2
        return 1
    fi

    echo "Deleting ${HOSTING_HOST}:${remote_path}..."
    _provider_delete "$remote_path"
}

# Get hosting info
# Usage: hosting_info
hosting_info() {
    echo "=== Hosting Configuration ==="
    echo "Provider: $_HOSTING_PROVIDER"
    echo "Host:     ${HOSTING_HOST}"
    echo "User:     ${HOSTING_USER}"
    echo "Port:     ${HOSTING_PORT:-22}"
    echo "Path:     ${HOSTING_PATH:-/public_html}"
}

# Deploy with standard workflow
# Usage: hosting_deploy <local_wp_content> [dry_run]
hosting_deploy() {
    local local_path="$1"
    local dry_run="${2:-false}"

    echo "======================================"
    echo "  WPF Deployment"
    echo "======================================"
    echo ""

    # Show what we're doing
    hosting_info
    echo ""

    # Standard excludes for WordPress deployment
    local excludes=(
        "node_modules"
        ".git"
        ".DS_Store"
        "*.log"
        "debug.log"
        "*.sql"
        ".env"
        "wp-config.php"
        "uploads"          # Usually don't deploy uploads
        "cache"
        "upgrade"
    )

    if [ "$dry_run" = "true" ]; then
        echo "[DRY RUN] Would upload:"
        echo "  From: $local_path"
        echo "  To:   ${HOSTING_PATH}/wp-content"
        echo "  Excluding: ${excludes[*]}"
        return 0
    fi

    # Pre-deployment backup
    echo "Step 1/3: Creating backup..."
    if ! hosting_backup "pre-deploy-$(date +%Y%m%d-%H%M%S)"; then
        echo "Warning: Backup failed, continuing anyway..."
    fi

    # Upload files
    echo ""
    echo "Step 2/3: Uploading files..."
    if ! hosting_upload "$local_path" "${HOSTING_PATH}/wp-content" "${excludes[@]}"; then
        echo "Error: Upload failed" >&2
        return 1
    fi

    # Post-deployment verification
    echo ""
    echo "Step 3/3: Verifying deployment..."
    if hosting_exists "${HOSTING_PATH}/wp-content/themes"; then
        echo "✓ Themes directory exists"
    fi
    if hosting_exists "${HOSTING_PATH}/wp-content/plugins"; then
        echo "✓ Plugins directory exists"
    fi

    echo ""
    echo "======================================"
    echo "  Deployment Complete!"
    echo "======================================"
    echo ""
    echo "Verify at: $(config_get_url)"

    return 0
}
