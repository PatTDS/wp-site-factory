#!/bin/bash
#
# wpf learn - Capture new knowledge/insights
#
# Records learnings for later review and merge into knowledge base
#

# Source learnings library if not already loaded
if [ -z "$(type -t learnings_add 2>/dev/null)" ]; then
    source "$WPF_ROOT/lib/learnings.sh"
fi

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}WPF KNOWLEDGE CAPTURE${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Record new insights, fixes, or discoveries to improve WPF."
echo ""

# If category provided as argument
if [ -n "$1" ]; then
    CATEGORY="$1"
    shift

    # Validate category
    case $CATEGORY in
        wordpress|webdesign|deployment|performance|testing)
            ;;
        *)
            echo -e "${RED}Invalid category:${NC} $CATEGORY"
            echo ""
            echo "Valid categories:"
            echo "  - wordpress   (plugins, themes, wp-cli, hooks)"
            echo "  - webdesign   (UI/UX, CSS, accessibility, layouts)"
            echo "  - deployment  (staging, production, hosting, DNS)"
            echo "  - performance (speed, caching, optimization)"
            echo "  - testing     (e2e, lighthouse, debugging)"
            exit 1
            ;;
    esac
else
    # Interactive category selection
    echo "Select category:"
    echo ""
    echo "  1. wordpress   - Plugins, themes, WP-CLI, hooks"
    echo "  2. webdesign   - UI/UX, CSS, accessibility, layouts"
    echo "  3. deployment  - Staging, production, hosting, DNS"
    echo "  4. performance - Speed, caching, optimization"
    echo "  5. testing     - E2E, Lighthouse, debugging"
    echo ""
    read -p "Category (1-5): " category_choice

    case $category_choice in
        1) CATEGORY="wordpress" ;;
        2) CATEGORY="webdesign" ;;
        3) CATEGORY="deployment" ;;
        4) CATEGORY="performance" ;;
        5) CATEGORY="testing" ;;
        *)
            echo -e "${RED}Invalid selection${NC}"
            exit 1
            ;;
    esac
fi

echo ""
echo -e "Category: ${GREEN}$CATEGORY${NC}"
echo ""

# Get title
if [ -n "$1" ]; then
    TITLE="$*"
else
    read -p "Title (brief description): " TITLE
fi

if [ -z "$TITLE" ]; then
    echo -e "${RED}Title is required${NC}"
    exit 1
fi

echo ""
echo "Enter the content (multi-line supported)."
echo "Type 'END' on a new line when finished:"
echo ""

CONTENT=""
while IFS= read -r line; do
    [ "$line" = "END" ] && break
    CONTENT="${CONTENT}${line}
"
done

if [ -z "$CONTENT" ]; then
    echo -e "${RED}Content is required${NC}"
    exit 1
fi

# Optional: get source
echo ""
read -p "Source (URL, project, or press Enter to skip): " SOURCE

# Optional: get priority
echo ""
echo "Priority (how important to merge into knowledge base):"
echo "  1. Low    - Nice to have"
echo "  2. Medium - Should add soon"
echo "  3. High   - Critical insight"
read -p "Priority (1-3, default 2): " priority_choice

case $priority_choice in
    1) PRIORITY="low" ;;
    3) PRIORITY="high" ;;
    *) PRIORITY="medium" ;;
esac

# Save the learning
learnings_add "$CATEGORY" "$TITLE" "$CONTENT" "$SOURCE" "$PRIORITY"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Learning captured!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Show current learning counts
echo "Current learnings by category:"
learnings_summary

echo ""
echo "Commands:"
echo "  wpf knowledge review    - Review all pending learnings"
echo "  wpf knowledge merge     - Merge learnings into knowledge base"
echo ""
