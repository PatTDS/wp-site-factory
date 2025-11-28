#!/bin/bash
#
# wpf knowledge review - Review pending learnings
#
# Display and manage captured learnings before merging
#

# Source learnings library if not already loaded
if [ -z "$(type -t learnings_list 2>/dev/null)" ]; then
    source "$WPF_ROOT/lib/learnings.sh"
fi

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}WPF KNOWLEDGE REVIEW${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Initialize learnings
learnings_init

# Get optional category filter
CATEGORY_FILTER="$1"

if [ -n "$CATEGORY_FILTER" ]; then
    if ! learnings_valid_category "$CATEGORY_FILTER"; then
        echo -e "${RED}Invalid category:${NC} $CATEGORY_FILTER"
        echo ""
        echo "Valid categories: wordpress, webdesign, deployment, performance, testing"
        exit 1
    fi
    echo -e "Filtering by category: ${GREEN}$CATEGORY_FILTER${NC}"
    echo ""
fi

# Show summary
learnings_summary
echo ""

# Get list of learnings
if [ -n "$CATEGORY_FILTER" ]; then
    LEARNINGS=$(learnings_list "$CATEGORY_FILTER")
else
    LEARNINGS=$(learnings_list)
fi

if [ -z "$LEARNINGS" ]; then
    echo "No pending learnings found."
    echo ""
    echo "Capture new learnings with:"
    echo "  wpf learn"
    exit 0
fi

# Count learnings
COUNT=$(echo "$LEARNINGS" | wc -l)
echo -e "Found ${GREEN}$COUNT${NC} pending learning(s):"
echo ""

# Display each learning
INDEX=1
declare -a LEARNING_FILES
while IFS= read -r file; do
    [ -z "$file" ] && continue

    LEARNING_FILES[$INDEX]="$file"

    # Extract info from file
    filename=$(basename "$file")
    category=$(basename $(dirname "$file"))
    title=$(head -1 "$file" | sed 's/^# //')
    priority=$(grep "Priority:" "$file" | sed 's/.*Priority:\*\* //')
    date=$(grep "Date:" "$file" | sed 's/.*Date:\*\* //')

    # Priority color
    case $priority in
        high) priority_color="${RED}$priority${NC}" ;;
        medium) priority_color="${YELLOW}$priority${NC}" ;;
        *) priority_color="${GREEN}$priority${NC}" ;;
    esac

    echo -e "${GREEN}[$INDEX]${NC} $title"
    echo "    Category: $category | Priority: $priority_color | Date: $date"
    echo ""

    INDEX=$((INDEX + 1))
done <<< "$LEARNINGS"

# Menu
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Actions:"
echo "  v <n>  - View learning #n in full"
echo "  d <n>  - Delete learning #n"
echo "  m      - Merge all into knowledge base"
echo "  q      - Quit"
echo ""
read -p "Action: " action arg

case $action in
    v|view)
        if [ -n "$arg" ] && [ -n "${LEARNING_FILES[$arg]}" ]; then
            echo ""
            echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            cat "${LEARNING_FILES[$arg]}"
            echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        else
            echo -e "${RED}Invalid selection${NC}"
        fi
        ;;
    d|delete)
        if [ -n "$arg" ] && [ -n "${LEARNING_FILES[$arg]}" ]; then
            title=$(head -1 "${LEARNING_FILES[$arg]}" | sed 's/^# //')
            read -p "Delete '$title'? (y/n): " confirm
            if [ "$confirm" = "y" ]; then
                learnings_delete "${LEARNING_FILES[$arg]}"
                echo -e "${GREEN}✓ Learning deleted${NC}"
            fi
        else
            echo -e "${RED}Invalid selection${NC}"
        fi
        ;;
    m|merge)
        echo ""
        echo "Starting merge process..."
        source "$CLI_DIR/knowledge-merge.sh"
        ;;
    q|quit)
        echo "Goodbye!"
        ;;
    *)
        echo -e "${RED}Invalid action${NC}"
        ;;
esac
