#!/bin/bash
#
# wpf knowledge - Browse the knowledge base
#

LOCAL_KNOWLEDGE="$WPF_ROOT/knowledge"
WP_KNOWLEDGE="/home/atric/wordpress-knowledge-base"

print_banner
echo -e "${GREEN}WPF Knowledge Base${NC}"
echo ""

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}CATEGORIES${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  WordPress Knowledge (external repo):"
echo "  1. Tutorials"
echo "  2. How-Tos"
echo "  3. Reference"
echo "  4. Concepts"
echo "  5. Examples"
echo ""
echo "  Local Knowledge:"
echo "  6. Web Design & UI"
echo ""
echo "  0. Exit"
echo ""
read -p "Select category (0-6): " category

browse_folder() {
    local folder="$1"
    local title="$2"

    echo ""
    echo -e "${CYAN}$title${NC}"
    echo ""
    if [ -d "$folder" ]; then
        ls -1 "$folder"/*.md 2>/dev/null | xargs -I{} basename {} | while read file; do
            echo "  - $file"
        done
    else
        echo "  (folder not found: $folder)"
    fi
    echo ""
    read -p "Enter filename to view (or press Enter to go back): " filename
    if [ -n "$filename" ] && [ -f "$folder/$filename" ]; then
        less "$folder/$filename"
    fi
}

case $category in
    1)
        browse_folder "$WP_KNOWLEDGE/tutorials" "WordPress Tutorials"
        ;;
    2)
        browse_folder "$WP_KNOWLEDGE/howtos" "WordPress How-Tos"
        ;;
    3)
        browse_folder "$WP_KNOWLEDGE/reference" "WordPress Reference"
        ;;
    4)
        browse_folder "$WP_KNOWLEDGE/concepts" "WordPress Concepts"
        ;;
    5)
        browse_folder "$WP_KNOWLEDGE/examples" "WordPress Examples"
        ;;
    6)
        browse_folder "$LOCAL_KNOWLEDGE/webdesign" "Web Design & UI"
        ;;
    0)
        echo "Goodbye!"
        ;;
    *)
        echo "Invalid option"
        ;;
esac

echo ""
echo "Knowledge base locations:"
echo "  WordPress: $WP_KNOWLEDGE"
echo "  Local:     $LOCAL_KNOWLEDGE"
echo ""
echo "Use 'less' or your editor to browse files directly."
