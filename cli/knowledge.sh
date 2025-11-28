#!/bin/bash
#
# wpf knowledge - Browse the knowledge base
#

KNOWLEDGE_DIR="$WPF_ROOT/knowledge"

print_banner
echo -e "${GREEN}WPF Knowledge Base${NC}"
echo ""

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}CATEGORIES${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "  1. WordPress Development"
echo "  2. Web Design & UI"
echo "  3. Deployment & Hosting"
echo "  4. Performance Optimization"
echo "  5. Testing Strategies"
echo "  0. Exit"
echo ""
read -p "Select category (0-5): " category

case $category in
    1)
        echo ""
        echo -e "${CYAN}WordPress Development${NC}"
        echo ""
        ls -1 "$KNOWLEDGE_DIR/wordpress/" 2>/dev/null | while read file; do
            echo "  - $file"
        done
        echo ""
        read -p "Enter filename to view (or press Enter to go back): " filename
        if [ -n "$filename" ] && [ -f "$KNOWLEDGE_DIR/wordpress/$filename" ]; then
            less "$KNOWLEDGE_DIR/wordpress/$filename"
        fi
        ;;
    2)
        echo ""
        echo -e "${CYAN}Web Design & UI${NC}"
        echo ""
        ls -1 "$KNOWLEDGE_DIR/webdesign/" 2>/dev/null | while read file; do
            echo "  - $file"
        done
        echo ""
        read -p "Enter filename to view (or press Enter to go back): " filename
        if [ -n "$filename" ] && [ -f "$KNOWLEDGE_DIR/webdesign/$filename" ]; then
            less "$KNOWLEDGE_DIR/webdesign/$filename"
        fi
        ;;
    3)
        echo ""
        echo -e "${CYAN}Deployment & Hosting${NC}"
        echo ""
        ls -1 "$KNOWLEDGE_DIR/deployment/" 2>/dev/null | while read file; do
            echo "  - $file"
        done
        echo ""
        read -p "Enter filename to view (or press Enter to go back): " filename
        if [ -n "$filename" ] && [ -f "$KNOWLEDGE_DIR/deployment/$filename" ]; then
            less "$KNOWLEDGE_DIR/deployment/$filename"
        fi
        ;;
    4)
        echo ""
        echo -e "${CYAN}Performance Optimization${NC}"
        echo ""
        ls -1 "$KNOWLEDGE_DIR/performance/" 2>/dev/null | while read file; do
            echo "  - $file"
        done
        echo ""
        read -p "Enter filename to view (or press Enter to go back): " filename
        if [ -n "$filename" ] && [ -f "$KNOWLEDGE_DIR/performance/$filename" ]; then
            less "$KNOWLEDGE_DIR/performance/$filename"
        fi
        ;;
    5)
        echo ""
        echo -e "${CYAN}Testing Strategies${NC}"
        echo ""
        ls -1 "$KNOWLEDGE_DIR/testing/" 2>/dev/null | while read file; do
            echo "  - $file"
        done
        echo ""
        read -p "Enter filename to view (or press Enter to go back): " filename
        if [ -n "$filename" ] && [ -f "$KNOWLEDGE_DIR/testing/$filename" ]; then
            less "$KNOWLEDGE_DIR/testing/$filename"
        fi
        ;;
    0)
        echo "Goodbye!"
        ;;
    *)
        echo "Invalid option"
        ;;
esac

echo ""
echo "Knowledge base location: $KNOWLEDGE_DIR"
echo "Use 'less' or your editor to browse files directly."
