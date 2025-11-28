#!/bin/bash
#
# WPF Learnings Library
# Functions for capturing and managing knowledge learnings
#

LEARNINGS_DIR="$WPF_ROOT/learnings"
VALID_CATEGORIES=("wordpress" "webdesign" "deployment" "performance" "testing")

# Initialize learnings directories
learnings_init() {
    for category in "${VALID_CATEGORIES[@]}"; do
        mkdir -p "$LEARNINGS_DIR/$category"
    done
}

# Validate category
learnings_valid_category() {
    local category="$1"
    for valid in "${VALID_CATEGORIES[@]}"; do
        if [ "$category" = "$valid" ]; then
            return 0
        fi
    done
    return 1
}

# Add a learning note
# Usage: learnings_add <category> <title> <content> [source] [priority]
learnings_add() {
    local category="$1"
    local title="$2"
    local content="$3"
    local source="${4:-manual}"
    local priority="${5:-medium}"
    local timestamp=$(date +%Y%m%d-%H%M%S)
    local date_readable=$(date "+%Y-%m-%d %H:%M:%S")

    learnings_init

    if ! learnings_valid_category "$category"; then
        echo -e "${RED}Invalid category: $category${NC}"
        echo "Valid categories: ${VALID_CATEGORIES[*]}"
        return 1
    fi

    # Create safe filename from title
    local safe_title=$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | head -c 50)
    local file="$LEARNINGS_DIR/$category/${timestamp}-${safe_title}.md"

    cat > "$file" << EOF
# $title

**Date:** $date_readable
**Category:** $category
**Source:** $source
**Priority:** $priority
**Status:** pending

## Content

$content

---
*Captured by WPF learn command*
EOF

    echo "$file"
}

# List pending learnings
# Usage: learnings_list [category]
learnings_list() {
    local category="$1"

    learnings_init

    if [ -n "$category" ]; then
        if learnings_valid_category "$category"; then
            find "$LEARNINGS_DIR/$category" -name "*.md" -type f 2>/dev/null | sort -r
        fi
    else
        find "$LEARNINGS_DIR" -name "*.md" -type f 2>/dev/null | sort -r
    fi
}

# Count pending learnings
learnings_count() {
    local category="$1"

    if [ -n "$category" ]; then
        find "$LEARNINGS_DIR/$category" -name "*.md" -type f 2>/dev/null | wc -l
    else
        find "$LEARNINGS_DIR" -name "*.md" -type f 2>/dev/null | wc -l
    fi
}

# Get learning content
# Usage: learnings_get <file_path>
learnings_get() {
    local file="$1"
    if [ -f "$file" ]; then
        cat "$file"
    fi
}

# Mark learning as merged
# Usage: learnings_mark_merged <file_path>
learnings_mark_merged() {
    local file="$1"

    if [ -f "$file" ]; then
        sed -i 's/Status:** pending/Status:** merged/' "$file"

        # Move to merged folder
        local category=$(basename $(dirname "$file"))
        mkdir -p "$LEARNINGS_DIR/$category/merged"
        mv "$file" "$LEARNINGS_DIR/$category/merged/"
    fi
}

# Delete a learning
# Usage: learnings_delete <file_path>
learnings_delete() {
    local file="$1"
    if [ -f "$file" ]; then
        rm "$file"
    fi
}

# Get summary of all pending learnings
learnings_summary() {
    echo "=== Pending Learnings Summary ==="
    echo ""

    local total=0
    for category in "${VALID_CATEGORIES[@]}"; do
        local count=$(find "$LEARNINGS_DIR/$category" -maxdepth 1 -name "*.md" -type f 2>/dev/null | wc -l)
        if [ "$count" -gt 0 ]; then
            echo "  $category: $count"
            total=$((total + count))
        fi
    done

    echo ""
    echo "  Total: $total pending"
}

# Append learning to knowledge file
# Usage: learnings_append_to_knowledge <category> <content>
learnings_append_to_knowledge() {
    local category="$1"
    local content="$2"
    local knowledge_file=""

    case "$category" in
        wordpress)
            knowledge_file="$WPF_ROOT/knowledge/wordpress/lessons-learned.md"
            ;;
        webdesign)
            knowledge_file="$WPF_ROOT/knowledge/webdesign/lessons-learned.md"
            ;;
        deployment)
            knowledge_file="$WPF_ROOT/knowledge/deployment/lessons-learned.md"
            ;;
        performance)
            knowledge_file="$WPF_ROOT/knowledge/performance/lessons-learned.md"
            ;;
        testing)
            knowledge_file="$WPF_ROOT/knowledge/testing/lessons-learned.md"
            ;;
    esac

    if [ -n "$knowledge_file" ]; then
        # Create file if not exists
        if [ ! -f "$knowledge_file" ]; then
            cat > "$knowledge_file" << EOF
# Lessons Learned - ${category^}

This file contains learnings captured during project development.

---

EOF
        fi

        # Append content
        echo "" >> "$knowledge_file"
        echo "### $(date "+%Y-%m-%d")" >> "$knowledge_file"
        echo "" >> "$knowledge_file"
        echo "$content" >> "$knowledge_file"
        echo "" >> "$knowledge_file"
        echo "---" >> "$knowledge_file"

        return 0
    else
        return 1
    fi
}

# Export functions
export -f learnings_init learnings_valid_category learnings_add
export -f learnings_list learnings_count learnings_get
export -f learnings_mark_merged learnings_delete learnings_summary
export -f learnings_append_to_knowledge
export VALID_CATEGORIES
