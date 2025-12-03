#!/bin/bash
#
# wpf knowledge - Browse the knowledge base
#

LOCAL_KNOWLEDGE="$WPF_ROOT/knowledge"
# Windows path: \\wsl.localhost\Ubuntu\home\atric\wordpress-knowledge-base
WP_KNOWLEDGE="/home/atric/wordpress-knowledge-base"

print_banner
echo -e "${GREEN}WPF Knowledge Base${NC}"
echo ""

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}CATEGORIES${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  WordPress Knowledge (external repo - Diataxis structure):"
echo "  1. Web Design (webdesign/)"
echo "  2. SEO (seo/)"
echo "  3. Testing (testing/)"
echo "  4. Security (security/)"
echo "  5. Performance (performance/)"
echo "  6. Tools (tools/)"
echo ""
echo "  Local Knowledge:"
echo "  7. Web Design & UI (local)"
echo ""
echo "  0. Exit"
echo ""
read -p "Select category (0-7): " category

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
        browse_folder "$WP_KNOWLEDGE/webdesign" "Web Design (Tailwind, shadcn, responsive)"
        ;;
    2)
        browse_folder "$WP_KNOWLEDGE/seo" "SEO (Technical SEO, schema, local)"
        ;;
    3)
        browse_folder "$WP_KNOWLEDGE/testing" "Testing (Playwright, Lighthouse, a11y)"
        ;;
    4)
        browse_folder "$WP_KNOWLEDGE/security" "Security (Hardening, OWASP, GDPR)"
        ;;
    5)
        browse_folder "$WP_KNOWLEDGE/performance" "Performance (Core Web Vitals, caching)"
        ;;
    6)
        browse_folder "$WP_KNOWLEDGE/tools" "Tools (WP-CLI, Docker, deployment)"
        ;;
    7)
        browse_folder "$LOCAL_KNOWLEDGE/webdesign" "Web Design & UI (local)"
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
