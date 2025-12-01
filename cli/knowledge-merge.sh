#!/bin/bash
#
# wpf knowledge merge - Merge learnings into knowledge base
#
# Processes pending learnings and appends to appropriate knowledge files
#

# Source learnings library if not already loaded
if [ -z "$(type -t learnings_list 2>/dev/null)" ]; then
    source "$WPF_ROOT/lib/learnings.sh"
fi

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}WPF KNOWLEDGE MERGE${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Initialize
learnings_init

# Get all pending learnings
LEARNINGS=$(learnings_list)

if [ -z "$LEARNINGS" ]; then
    echo "No pending learnings to merge."
    exit 0
fi

COUNT=$(echo "$LEARNINGS" | wc -l)
echo -e "Found ${GREEN}$COUNT${NC} learning(s) to merge."
echo ""

# Confirmation
read -p "Merge all pending learnings into knowledge base? (y/n): " confirm
if [ "$confirm" != "y" ]; then
    echo "Merge cancelled."
    exit 0
fi

echo ""
echo "Processing learnings..."
echo ""

MERGED_COUNT=0
FAILED_COUNT=0

while IFS= read -r file; do
    [ -z "$file" ] && continue

    # Extract info
    filename=$(basename "$file")
    category=$(basename $(dirname "$file"))
    title=$(head -1 "$file" | sed 's/^# //')

    # Skip if in merged folder
    [[ "$file" == *"/merged/"* ]] && continue

    echo -n "  Merging: $title... "

    # Extract content section
    content=$(sed -n '/^## Content/,/^---$/p' "$file" | head -n -1 | tail -n +3)

    if [ -z "$content" ]; then
        # Fallback: get all content after ## Content or ## Note
        content=$(sed -n '/^## Content/,/^$/p' "$file" | tail -n +3)
        [ -z "$content" ] && content=$(sed -n '/^## Note/,/^$/p' "$file" | tail -n +3)
    fi

    # Add title to content
    full_content="**$title**

$content"

    # Append to knowledge base
    if learnings_append_to_knowledge "$category" "$full_content"; then
        learnings_mark_merged "$file"
        echo -e "${GREEN}✓${NC}"
        MERGED_COUNT=$((MERGED_COUNT + 1))
    else
        echo -e "${RED}✗${NC}"
        FAILED_COUNT=$((FAILED_COUNT + 1))
    fi
done <<< "$LEARNINGS"

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Merge complete!"
echo -e "  Merged: ${GREEN}$MERGED_COUNT${NC}"
if [ "$FAILED_COUNT" -gt 0 ]; then
    echo -e "  Failed: ${RED}$FAILED_COUNT${NC}"
fi
echo ""

# Show updated knowledge base locations
WP_KB="/home/atric/wordpress-knowledge-base"

echo "Updated knowledge files:"
echo ""
echo "  WordPress KB (external):"
if [ -f "$WP_KB/examples/examples-natigeo-lessons.md" ]; then
    count=$(grep -c "^### " "$WP_KB/examples/examples-natigeo-lessons.md" 2>/dev/null || echo 0)
    echo "    examples-natigeo-lessons.md: $count entries"
fi
if [ -f "$WP_KB/examples/examples-testing-patterns.md" ]; then
    count=$(grep -c "^### " "$WP_KB/examples/examples-testing-patterns.md" 2>/dev/null || echo 0)
    echo "    examples-testing-patterns.md: $count entries"
fi

echo ""
echo "  Local (webdesign):"
if [ -f "$WPF_ROOT/knowledge/webdesign/lessons-learned.md" ]; then
    count=$(grep -c "^### " "$WPF_ROOT/knowledge/webdesign/lessons-learned.md" 2>/dev/null || echo 0)
    echo "    lessons-learned.md: $count entries"
fi
echo ""

echo "Knowledge base locations:"
echo "  WordPress: $WP_KB"
echo "  Local:     $WPF_ROOT/knowledge/"
echo ""
