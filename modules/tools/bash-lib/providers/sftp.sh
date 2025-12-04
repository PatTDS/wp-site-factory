#!/bin/bash
#
# WPF SFTP Provider
# Host-agnostic SFTP operations for WordPress deployment
#

# Provider identification
_PROVIDER_NAME="sftp"
_PROVIDER_VERSION="1.0.0"

# Check for required tools
_sftp_check_tools() {
    local missing=()

    command -v sftp &> /dev/null || missing+=("sftp")
    command -v scp &> /dev/null || missing+=("scp")

    # sshpass is optional (for password auth)
    if [ -n "$HOSTING_PASS" ] && ! command -v sshpass &> /dev/null; then
        echo "Warning: sshpass not installed. Password auth may not work." >&2
        echo "Install with: sudo apt-get install sshpass" >&2
    fi

    if [ ${#missing[@]} -gt 0 ]; then
        echo "Error: Missing required tools: ${missing[*]}" >&2
        return 1
    fi

    return 0
}

# Build SSH/SFTP options string
_sftp_build_opts() {
    local opts="-o StrictHostKeyChecking=no -o BatchMode=no"

    # Add port if non-standard
    if [ -n "$HOSTING_PORT" ] && [ "$HOSTING_PORT" != "22" ]; then
        opts="$opts -o Port=${HOSTING_PORT}"
    fi

    # Add identity file if configured
    if [ -n "$HOSTING_KEY" ] && [ -f "$HOSTING_KEY" ]; then
        opts="$opts -o IdentityFile=${HOSTING_KEY}"
    fi

    # Connection timeout
    opts="$opts -o ConnectTimeout=30"

    echo "$opts"
}

# Build SCP port option
_sftp_scp_port() {
    if [ -n "$HOSTING_PORT" ] && [ "$HOSTING_PORT" != "22" ]; then
        echo "-P ${HOSTING_PORT}"
    fi
}

# Execute SFTP command with password support
_sftp_exec_cmd() {
    local batch_file="$1"
    local opts="$(_sftp_build_opts)"
    local pass

    pass=$(config_get_hosting_pass 2>/dev/null)

    if [ -n "$pass" ]; then
        # Use sshpass for password auth
        timeout 60 sshpass -p "$pass" sftp $opts -b "$batch_file" \
            "${HOSTING_USER}@${HOSTING_HOST}" 2>&1
    else
        # Key-based or interactive auth
        timeout 60 sftp $opts -b "$batch_file" \
            "${HOSTING_USER}@${HOSTING_HOST}" 2>&1
    fi
}

# Execute SCP command with password support
_sftp_scp() {
    local src="$1"
    local dst="$2"
    local direction="${3:-upload}"  # upload or download
    local opts="-o StrictHostKeyChecking=no -o BatchMode=no -o ConnectTimeout=30"
    local port_opt="$(_sftp_scp_port)"
    local pass

    pass=$(config_get_hosting_pass 2>/dev/null)

    if [ -n "$HOSTING_KEY" ] && [ -f "$HOSTING_KEY" ]; then
        opts="$opts -i ${HOSTING_KEY}"
    fi

    if [ "$direction" = "upload" ]; then
        if [ -n "$pass" ]; then
            sshpass -p "$pass" scp -r $opts $port_opt "$src" \
                "${HOSTING_USER}@${HOSTING_HOST}:${dst}" 2>&1
        else
            scp -r $opts $port_opt "$src" \
                "${HOSTING_USER}@${HOSTING_HOST}:${dst}" 2>&1
        fi
    else
        if [ -n "$pass" ]; then
            sshpass -p "$pass" scp -r $opts $port_opt \
                "${HOSTING_USER}@${HOSTING_HOST}:${src}" "$dst" 2>&1
        else
            scp -r $opts $port_opt \
                "${HOSTING_USER}@${HOSTING_HOST}:${src}" "$dst" 2>&1
        fi
    fi
}

# Test connection to hosting
_provider_test_connection() {
    _sftp_check_tools || return 1

    local batch_file="/tmp/wpf_sftp_test_$$.txt"
    echo "ls" > "$batch_file"

    local result
    result=$(_sftp_exec_cmd "$batch_file")
    local status=$?

    rm -f "$batch_file"

    if [ $status -eq 0 ]; then
        echo "✓ Connection successful to ${HOSTING_HOST}"
        return 0
    else
        echo "✗ Connection failed: $result" >&2
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

    _sftp_check_tools || return 1

    # For single file upload
    if [ -f "$local_path" ]; then
        echo "Uploading file: $local_path"
        _sftp_scp "$local_path" "$remote_path" "upload"
        return $?
    fi

    # For directory upload, use rsync-style approach
    # First, create a temp directory with excluded files removed
    local temp_dir="/tmp/wpf_upload_$$"
    mkdir -p "$temp_dir"

    # Build rsync exclude args
    local rsync_excludes=""
    for exclude in "${excludes[@]}"; do
        rsync_excludes="$rsync_excludes --exclude='$exclude'"
    done

    # Copy to temp, excluding patterns
    eval rsync -a $rsync_excludes "$local_path/" "$temp_dir/"

    # Upload using scp
    echo "Uploading directory: $local_path -> $remote_path"
    _sftp_scp "$temp_dir/." "$remote_path" "upload"
    local status=$?

    # Cleanup
    rm -rf "$temp_dir"

    return $status
}

# Download files from hosting
# Usage: _provider_download <remote_path> <local_path>
_provider_download() {
    local remote_path="$1"
    local local_path="$2"

    _sftp_check_tools || return 1

    # Ensure local directory exists
    mkdir -p "$(dirname "$local_path")"

    echo "Downloading: $remote_path -> $local_path"
    _sftp_scp "$remote_path" "$local_path" "download"
    return $?
}

# List files on hosting
# Usage: _provider_list <remote_path>
_provider_list() {
    local remote_path="${1:-$HOSTING_PATH}"

    _sftp_check_tools || return 1

    local batch_file="/tmp/wpf_sftp_list_$$.txt"
    echo "ls -la $remote_path" > "$batch_file"

    local result
    result=$(_sftp_exec_cmd "$batch_file")
    local status=$?

    rm -f "$batch_file"

    if [ $status -eq 0 ]; then
        echo "$result" | grep -v "^sftp>"
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

    _sftp_check_tools || return 1

    # Create backup directory if it doesn't exist
    local batch_file="/tmp/wpf_sftp_backup_$$.txt"
    cat > "$batch_file" << EOF
-mkdir ${backup_dir}
-mkdir ${backup_dir}/${backup_name}
EOF

    _sftp_exec_cmd "$batch_file" > /dev/null 2>&1

    # Since most SFTP hosts don't support server-side commands,
    # we download, zip locally, then upload the backup
    echo "Creating backup: ${backup_name}"

    local temp_dir="/tmp/wpf_backup_$$"
    mkdir -p "$temp_dir"

    # Download wp-content (themes and plugins only)
    echo "  Downloading themes..."
    _sftp_scp "${wp_content}/themes" "$temp_dir" "download" 2>/dev/null

    echo "  Downloading plugins..."
    _sftp_scp "${wp_content}/plugins" "$temp_dir" "download" 2>/dev/null

    # Create local zip
    echo "  Creating archive..."
    cd "$temp_dir" && zip -rq "${backup_name}.zip" . 2>/dev/null

    # Upload backup
    echo "  Uploading backup..."
    _sftp_scp "${temp_dir}/${backup_name}.zip" "${backup_dir}/${backup_name}.zip" "upload"
    local status=$?

    # Cleanup
    rm -rf "$temp_dir"
    rm -f "$batch_file"

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

    _sftp_check_tools || return 1

    local batch_file="/tmp/wpf_sftp_exists_$$.txt"
    echo "ls -la $remote_path" > "$batch_file"

    local result
    result=$(_sftp_exec_cmd "$batch_file" 2>&1)
    local status=$?

    rm -f "$batch_file"

    # Check for "not found" or similar errors
    if echo "$result" | grep -qi "no such file\|not found\|cannot\|error"; then
        return 1
    fi

    [ $status -eq 0 ]
}

# Delete file/directory on hosting
# Usage: _provider_delete <remote_path>
_provider_delete() {
    local remote_path="$1"

    _sftp_check_tools || return 1

    local batch_file="/tmp/wpf_sftp_delete_$$.txt"

    # Try rm first (file), then rmdir (directory)
    cat > "$batch_file" << EOF
-rm $remote_path
-rmdir $remote_path
EOF

    local result
    result=$(_sftp_exec_cmd "$batch_file")
    local status=$?

    rm -f "$batch_file"

    # Verify deletion
    if ! _provider_exists "$remote_path"; then
        echo "✓ Deleted: $remote_path"
        return 0
    else
        echo "✗ Failed to delete: $remote_path" >&2
        return 1
    fi
}

# Get remote file hash (MD5)
# Usage: _provider_hash <remote_path>
_provider_hash() {
    local remote_path="$1"
    local temp_file="/tmp/wpf_hash_$$"

    # Download file temporarily
    if _sftp_scp "$remote_path" "$temp_file" "download" > /dev/null 2>&1; then
        md5sum "$temp_file" | cut -d' ' -f1
        rm -f "$temp_file"
        return 0
    else
        rm -f "$temp_file"
        return 1
    fi
}

# Compare local and remote file
# Usage: _provider_compare <local_path> <remote_path>
_provider_compare() {
    local local_path="$1"
    local remote_path="$2"

    local local_hash remote_hash

    local_hash=$(md5sum "$local_path" 2>/dev/null | cut -d' ' -f1)
    remote_hash=$(_provider_hash "$remote_path")

    if [ -z "$local_hash" ] || [ -z "$remote_hash" ]; then
        echo "unknown"
        return 2
    fi

    if [ "$local_hash" = "$remote_hash" ]; then
        echo "match"
        return 0
    else
        echo "different"
        return 1
    fi
}

# Sync local directory to remote
# Usage: _provider_sync <local_path> <remote_path> [excludes...]
_provider_sync() {
    local local_path="$1"
    local remote_path="$2"
    shift 2
    local excludes=("$@")

    echo "Syncing $local_path -> ${HOSTING_HOST}:${remote_path}"

    # Find all files to sync
    local files_to_upload=0
    local files_matched=0

    while IFS= read -r -d '' file; do
        local rel_path="${file#$local_path/}"
        local remote_file="${remote_path}/${rel_path}"

        # Check if should be excluded
        local skip=false
        for exclude in "${excludes[@]}"; do
            if [[ "$rel_path" == *"$exclude"* ]]; then
                skip=true
                break
            fi
        done

        if [ "$skip" = "true" ]; then
            continue
        fi

        # Compare files
        local status
        status=$(_provider_compare "$file" "$remote_file")

        case "$status" in
            "match")
                ((files_matched++))
                ;;
            "different"|"unknown")
                echo "  Uploading: $rel_path"
                _sftp_scp "$file" "$remote_file" "upload" > /dev/null 2>&1
                ((files_to_upload++))
                ;;
        esac
    done < <(find "$local_path" -type f -print0)

    echo "✓ Sync complete: $files_to_upload uploaded, $files_matched unchanged"
}

echo "SFTP provider loaded (v${_PROVIDER_VERSION})"
