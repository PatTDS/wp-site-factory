#!/bin/bash
#
# WPF FTP Provider
# Host-agnostic FTP operations for WordPress deployment
# For legacy hosts that don't support SFTP
#

# Provider identification
_PROVIDER_NAME="ftp"
_PROVIDER_VERSION="1.0.0"

# Check for required tools
_ftp_check_tools() {
    local missing=()

    # lftp is preferred for scripted FTP operations
    if ! command -v lftp &> /dev/null; then
        # Fall back to ncftp or standard ftp
        if ! command -v ncftp &> /dev/null && ! command -v ftp &> /dev/null; then
            missing+=("lftp or ncftp")
        fi
    fi

    if [ ${#missing[@]} -gt 0 ]; then
        echo "Error: Missing required tools: ${missing[*]}" >&2
        echo "Install with: sudo apt-get install lftp" >&2
        return 1
    fi

    return 0
}

# Build lftp connection string
_ftp_connect_str() {
    local pass
    pass=$(config_get_hosting_pass 2>/dev/null)

    local port="${HOSTING_PORT:-21}"
    local proto="ftp"

    # Use FTPS if configured
    if [ "${HOSTING_FTP_SSL:-false}" = "true" ]; then
        proto="ftps"
    fi

    if [ -n "$pass" ]; then
        echo "open -u ${HOSTING_USER},'${pass}' ${proto}://${HOSTING_HOST}:${port}"
    else
        echo "open ${proto}://${HOSTING_USER}@${HOSTING_HOST}:${port}"
    fi
}

# Execute lftp commands
_ftp_exec() {
    local commands="$1"
    local connect_str="$(_ftp_connect_str)"

    # Create script file
    local script_file="/tmp/wpf_ftp_script_$$.lftp"
    cat > "$script_file" << EOF
set ssl:verify-certificate no
set net:timeout 30
set net:reconnect-interval-base 5
set net:max-retries 3
$connect_str
$commands
bye
EOF

    local result
    result=$(lftp -f "$script_file" 2>&1)
    local status=$?

    rm -f "$script_file"

    echo "$result"
    return $status
}

# Test connection to hosting
_provider_test_connection() {
    _ftp_check_tools || return 1

    local result
    result=$(_ftp_exec "ls")
    local status=$?

    if [ $status -eq 0 ]; then
        echo "✓ FTP connection successful to ${HOSTING_HOST}"
        return 0
    else
        echo "✗ FTP connection failed: $result" >&2
        return 1
    fi
}

# Upload files to hosting
# Usage: _provider_upload <local_path> <remote_path> [excludes...]
_provider_upload() {
    local local_path="$1"
    local remote_path="$2"
    shift 2
    local excludes=("$@")

    _ftp_check_tools || return 1

    # Build exclude options for lftp
    local exclude_opts=""
    for exclude in "${excludes[@]}"; do
        exclude_opts="$exclude_opts --exclude='$exclude'"
    done

    local commands
    if [ -f "$local_path" ]; then
        # Single file upload
        commands="put '$local_path' -o '$remote_path'"
    else
        # Directory upload with mirror
        commands="mirror -R $exclude_opts '$local_path' '$remote_path'"
    fi

    echo "Uploading: $local_path -> $remote_path"
    local result
    result=$(_ftp_exec "$commands")
    local status=$?

    if [ $status -eq 0 ]; then
        echo "✓ Upload complete"
        return 0
    else
        echo "✗ Upload failed: $result" >&2
        return 1
    fi
}

# Download files from hosting
# Usage: _provider_download <remote_path> <local_path>
_provider_download() {
    local remote_path="$1"
    local local_path="$2"

    _ftp_check_tools || return 1

    # Ensure local directory exists
    mkdir -p "$(dirname "$local_path")"

    local commands
    # Check if directory or file
    local test_result
    test_result=$(_ftp_exec "cls '$remote_path'")

    if echo "$test_result" | grep -q "^d"; then
        # Directory download with mirror
        commands="mirror '$remote_path' '$local_path'"
    else
        # File download
        commands="get '$remote_path' -o '$local_path'"
    fi

    echo "Downloading: $remote_path -> $local_path"
    local result
    result=$(_ftp_exec "$commands")
    local status=$?

    if [ $status -eq 0 ]; then
        echo "✓ Download complete"
        return 0
    else
        echo "✗ Download failed: $result" >&2
        return 1
    fi
}

# List files on hosting
# Usage: _provider_list <remote_path>
_provider_list() {
    local remote_path="${1:-$HOSTING_PATH}"

    _ftp_check_tools || return 1

    local result
    result=$(_ftp_exec "cls -la '$remote_path'")
    local status=$?

    if [ $status -eq 0 ]; then
        echo "$result"
        return 0
    else
        echo "Error listing files: $result" >&2
        return 1
    fi
}

# Create backup on hosting
# Usage: _provider_backup <backup_name>
_provider_backup() {
    local backup_name="$1"
    local backup_dir="${HOSTING_BACKUP_PATH:-${HOSTING_PATH}/../backups}"
    local wp_content="${HOSTING_PATH}/wp-content"

    _ftp_check_tools || return 1

    echo "Creating backup: ${backup_name}"

    # Create backup directory
    _ftp_exec "mkdir -p '$backup_dir/$backup_name'" > /dev/null 2>&1

    local temp_dir="/tmp/wpf_backup_$$"
    mkdir -p "$temp_dir"

    # Download themes and plugins
    echo "  Downloading themes..."
    _ftp_exec "mirror '${wp_content}/themes' '$temp_dir/themes'" > /dev/null 2>&1

    echo "  Downloading plugins..."
    _ftp_exec "mirror '${wp_content}/plugins' '$temp_dir/plugins'" > /dev/null 2>&1

    # Create local zip
    echo "  Creating archive..."
    cd "$temp_dir" && zip -rq "${backup_name}.zip" . 2>/dev/null

    # Upload backup
    echo "  Uploading backup..."
    _ftp_exec "put '${temp_dir}/${backup_name}.zip' -o '${backup_dir}/${backup_name}.zip'" > /dev/null
    local status=$?

    # Cleanup
    rm -rf "$temp_dir"

    if [ $status -eq 0 ]; then
        echo "✓ Backup created: ${backup_dir}/${backup_name}.zip"
        return 0
    else
        echo "✗ Backup failed" >&2
        return 1
    fi
}

# Check if file exists on hosting
# Usage: _provider_exists <remote_path>
_provider_exists() {
    local remote_path="$1"

    _ftp_check_tools || return 1

    local result
    result=$(_ftp_exec "ls '$remote_path'" 2>&1)

    # Check for existence
    if echo "$result" | grep -qi "no such file\|not found\|cannot access"; then
        return 1
    fi

    return 0
}

# Delete file/directory on hosting
# Usage: _provider_delete <remote_path>
_provider_delete() {
    local remote_path="$1"

    _ftp_check_tools || return 1

    local commands="rm -rf '$remote_path'"

    local result
    result=$(_ftp_exec "$commands")
    local status=$?

    # Verify deletion
    if ! _provider_exists "$remote_path"; then
        echo "✓ Deleted: $remote_path"
        return 0
    else
        echo "✗ Failed to delete: $remote_path" >&2
        return 1
    fi
}

# Sync local directory to remote (FTP mirror)
# Usage: _provider_sync <local_path> <remote_path> [excludes...]
_provider_sync() {
    local local_path="$1"
    local remote_path="$2"
    shift 2
    local excludes=("$@")

    _ftp_check_tools || return 1

    # Build exclude options
    local exclude_opts=""
    for exclude in "${excludes[@]}"; do
        exclude_opts="$exclude_opts --exclude='$exclude'"
    done

    echo "Syncing $local_path -> ${HOSTING_HOST}:${remote_path}"

    local commands="mirror -R --only-newer --delete $exclude_opts '$local_path' '$remote_path'"

    local result
    result=$(_ftp_exec "$commands")
    local status=$?

    if [ $status -eq 0 ]; then
        echo "✓ Sync complete"
        return 0
    else
        echo "✗ Sync failed: $result" >&2
        return 1
    fi
}

echo "FTP provider loaded (v${_PROVIDER_VERSION})"
