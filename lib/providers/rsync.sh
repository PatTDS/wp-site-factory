#!/bin/bash
#
# WPF Rsync Provider
# Host-agnostic rsync operations for WordPress deployment
# Fastest option for SSH-enabled hosts
#

# Provider identification
_PROVIDER_NAME="rsync"
_PROVIDER_VERSION="1.0.0"

# Check for required tools
_rsync_check_tools() {
    if ! command -v rsync &> /dev/null; then
        echo "Error: rsync is not installed" >&2
        echo "Install with: sudo apt-get install rsync" >&2
        return 1
    fi

    # sshpass for password auth (optional)
    if [ -n "$HOSTING_PASS" ] && ! command -v sshpass &> /dev/null; then
        echo "Warning: sshpass not installed. Password auth may not work." >&2
    fi

    return 0
}

# Build rsync SSH options
_rsync_ssh_opts() {
    local ssh_opts="-o StrictHostKeyChecking=no -o ConnectTimeout=30"

    # Add port if non-standard
    if [ -n "$HOSTING_PORT" ] && [ "$HOSTING_PORT" != "22" ]; then
        ssh_opts="$ssh_opts -p ${HOSTING_PORT}"
    fi

    # Add identity file if configured
    if [ -n "$HOSTING_KEY" ] && [ -f "$HOSTING_KEY" ]; then
        ssh_opts="$ssh_opts -i ${HOSTING_KEY}"
    fi

    echo "ssh $ssh_opts"
}

# Execute rsync command with password support
_rsync_exec() {
    local src="$1"
    local dst="$2"
    local opts="$3"
    local pass

    pass=$(config_get_hosting_pass 2>/dev/null)
    local ssh_opts="$(_rsync_ssh_opts)"

    if [ -n "$pass" ]; then
        sshpass -p "$pass" rsync $opts -e "$ssh_opts" "$src" "$dst" 2>&1
    else
        rsync $opts -e "$ssh_opts" "$src" "$dst" 2>&1
    fi
}

# Test connection to hosting
_provider_test_connection() {
    _rsync_check_tools || return 1

    local ssh_opts="$(_rsync_ssh_opts)"
    local pass
    pass=$(config_get_hosting_pass 2>/dev/null)

    local result
    if [ -n "$pass" ]; then
        result=$(timeout 30 sshpass -p "$pass" ssh $ssh_opts \
            "${HOSTING_USER}@${HOSTING_HOST}" "echo 'Connection successful'" 2>&1)
    else
        result=$(timeout 30 ssh $ssh_opts \
            "${HOSTING_USER}@${HOSTING_HOST}" "echo 'Connection successful'" 2>&1)
    fi

    if echo "$result" | grep -q "Connection successful"; then
        echo "✓ SSH/rsync connection successful to ${HOSTING_HOST}"
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

    _rsync_check_tools || return 1

    # Build rsync options
    local opts="-avz --progress --delete"

    # Add exclude patterns
    for exclude in "${excludes[@]}"; do
        opts="$opts --exclude='$exclude'"
    done

    # Ensure trailing slash for directory sync
    if [ -d "$local_path" ]; then
        local_path="${local_path%/}/"
    fi

    local dst="${HOSTING_USER}@${HOSTING_HOST}:${remote_path}"

    echo "Uploading: $local_path -> $remote_path"
    local result
    result=$(eval _rsync_exec "'$local_path'" "'$dst'" "'$opts'")
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

    _rsync_check_tools || return 1

    # Ensure local directory exists
    mkdir -p "$(dirname "$local_path")"

    local opts="-avz --progress"
    local src="${HOSTING_USER}@${HOSTING_HOST}:${remote_path}"

    echo "Downloading: $remote_path -> $local_path"
    local result
    result=$(_rsync_exec "$src" "$local_path" "$opts")
    local status=$?

    if [ $status -eq 0 ]; then
        echo "✓ Download complete"
        return 0
    else
        echo "✗ Download failed: $result" >&2
        return 1
    fi
}

# List files on hosting (via SSH)
# Usage: _provider_list <remote_path>
_provider_list() {
    local remote_path="${1:-$HOSTING_PATH}"

    _rsync_check_tools || return 1

    local ssh_opts="$(_rsync_ssh_opts)"
    local pass
    pass=$(config_get_hosting_pass 2>/dev/null)

    local result
    if [ -n "$pass" ]; then
        result=$(sshpass -p "$pass" ssh $ssh_opts \
            "${HOSTING_USER}@${HOSTING_HOST}" "ls -la '$remote_path'" 2>&1)
    else
        result=$(ssh $ssh_opts \
            "${HOSTING_USER}@${HOSTING_HOST}" "ls -la '$remote_path'" 2>&1)
    fi

    echo "$result"
}

# Create backup on hosting (via SSH tar)
# Usage: _provider_backup <backup_name>
_provider_backup() {
    local backup_name="$1"
    local backup_dir="${HOSTING_BACKUP_PATH:-${HOSTING_PATH}/../backups}"
    local wp_content="${HOSTING_PATH}/wp-content"

    _rsync_check_tools || return 1

    echo "Creating backup: ${backup_name}"

    local ssh_opts="$(_rsync_ssh_opts)"
    local pass
    pass=$(config_get_hosting_pass 2>/dev/null)

    # Create backup on server using tar
    local remote_cmd="mkdir -p '$backup_dir' && cd '${HOSTING_PATH}' && tar -czf '${backup_dir}/${backup_name}.tar.gz' --exclude='uploads' wp-content 2>/dev/null && echo 'BACKUP_SUCCESS'"

    local result
    if [ -n "$pass" ]; then
        result=$(sshpass -p "$pass" ssh $ssh_opts \
            "${HOSTING_USER}@${HOSTING_HOST}" "$remote_cmd" 2>&1)
    else
        result=$(ssh $ssh_opts \
            "${HOSTING_USER}@${HOSTING_HOST}" "$remote_cmd" 2>&1)
    fi

    if echo "$result" | grep -q "BACKUP_SUCCESS"; then
        echo "✓ Backup created: ${backup_dir}/${backup_name}.tar.gz"
        return 0
    else
        echo "✗ Backup failed: $result" >&2
        return 1
    fi
}

# Execute command on hosting
# Usage: _provider_exec <command>
_provider_exec() {
    local command="$1"

    _rsync_check_tools || return 1

    local ssh_opts="$(_rsync_ssh_opts)"
    local pass
    pass=$(config_get_hosting_pass 2>/dev/null)

    if [ -n "$pass" ]; then
        sshpass -p "$pass" ssh $ssh_opts \
            "${HOSTING_USER}@${HOSTING_HOST}" "$command" 2>&1
    else
        ssh $ssh_opts \
            "${HOSTING_USER}@${HOSTING_HOST}" "$command" 2>&1
    fi
}

# Check if file exists on hosting
# Usage: _provider_exists <remote_path>
_provider_exists() {
    local remote_path="$1"

    local result
    result=$(_provider_exec "test -e '$remote_path' && echo 'EXISTS'" 2>&1)

    echo "$result" | grep -q "EXISTS"
}

# Delete file/directory on hosting
# Usage: _provider_delete <remote_path>
_provider_delete() {
    local remote_path="$1"

    echo "Deleting: $remote_path"

    local result
    result=$(_provider_exec "rm -rf '$remote_path' && echo 'DELETED'" 2>&1)

    if echo "$result" | grep -q "DELETED"; then
        echo "✓ Deleted: $remote_path"
        return 0
    else
        echo "✗ Failed to delete: $remote_path" >&2
        return 1
    fi
}

# Sync with dry-run option
# Usage: _provider_sync <local_path> <remote_path> [excludes...]
_provider_sync() {
    local local_path="$1"
    local remote_path="$2"
    shift 2
    local excludes=("$@")

    _rsync_check_tools || return 1

    # Build rsync options with stats
    local opts="-avz --stats --delete"

    # Add exclude patterns
    for exclude in "${excludes[@]}"; do
        opts="$opts --exclude='$exclude'"
    done

    # Ensure trailing slash
    if [ -d "$local_path" ]; then
        local_path="${local_path%/}/"
    fi

    local dst="${HOSTING_USER}@${HOSTING_HOST}:${remote_path}"

    echo "Syncing: $local_path -> ${HOSTING_HOST}:${remote_path}"
    local result
    result=$(eval _rsync_exec "'$local_path'" "'$dst'" "'$opts'")
    local status=$?

    if [ $status -eq 0 ]; then
        # Parse rsync stats
        local files_transferred=$(echo "$result" | grep "Number of files transferred" | awk '{print $NF}')
        echo "✓ Sync complete: ${files_transferred:-0} files transferred"
        return 0
    else
        echo "✗ Sync failed: $result" >&2
        return 1
    fi
}

# Diff local vs remote
# Usage: _provider_diff <local_path> <remote_path>
_provider_diff() {
    local local_path="$1"
    local remote_path="$2"

    _rsync_check_tools || return 1

    local opts="-avnc --delete"
    local dst="${HOSTING_USER}@${HOSTING_HOST}:${remote_path}"

    echo "Comparing: $local_path vs ${HOSTING_HOST}:${remote_path}"
    _rsync_exec "$local_path/" "$dst" "$opts" | grep -v "^\." | grep -v "^sending\|^building"
}

echo "Rsync provider loaded (v${_PROVIDER_VERSION})"
