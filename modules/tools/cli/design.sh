#!/bin/bash
# WPF Design Command
# Manage design system components and create designs

set -e

WPF_ROOT="${WPF_ROOT:-/home/atric/wp-site-factory}"
source "$WPF_ROOT/lib/design.sh"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

show_usage() {
    echo -e "${BOLD}WPF Design System${NC}"
    echo ""
    echo -e "${BOLD}Usage:${NC}"
    echo "  wpf design [command] [options]"
    echo ""
    echo -e "${BOLD}Commands:${NC}"
    echo "  list [category]     List available components"
    echo "  show <component>    Show component details"
    echo "  industries          List industry presets"
    echo "  init <project>      Initialize design for project"
    echo "  preview <project>   Preview design in browser"
    echo "  approve <project>   Approve design, proceed to implementation"
    echo "  compile <project>   Compile design into theme files"
    echo ""
    echo -e "${BOLD}Examples:${NC}"
    echo "  wpf design list                    # List all categories"
    echo "  wpf design list heroes             # List hero components"
    echo "  wpf design show hero-split-cards   # Show component details"
    echo "  wpf design industries              # List industry presets"
    echo "  wpf design init my-project         # Start design for project"
    echo ""
}

cmd_list() {
    local category=$1
    display_component_list "$category"
}

cmd_show() {
    local component=$1
    if [[ -z "$component" ]]; then
        echo -e "${RED}Error: Component ID required${NC}"
        echo "Usage: wpf design show <component-id>"
        exit 1
    fi
    display_component_details "$component"
}

cmd_industries() {
    echo -e "${BOLD}Available Industry Presets:${NC}"
    echo ""

    for industry in $(get_industry_types); do
        local preset=$(get_industry_preset "$industry")
        local name=$(echo "$preset" | jq -r '.name')
        local primary=$(echo "$preset" | jq -r '.primary.DEFAULT')
        local secondary=$(echo "$preset" | jq -r '.secondary.DEFAULT')

        echo -e "  ${BOLD}$industry${NC}"
        echo -e "    $name"
        echo -e "    Primary: ${CYAN}$primary${NC}  Secondary: ${CYAN}$secondary${NC}"
        echo ""
    done
}

cmd_init() {
    local project=$1

    if [[ -z "$project" ]]; then
        echo -e "${RED}Error: Project name required${NC}"
        echo "Usage: wpf design init <project-name>"
        exit 1
    fi

    # Find project directory
    local project_dir="$WPF_ROOT/projects/$project"
    if [[ ! -d "$project_dir" ]]; then
        echo -e "${RED}Error: Project '$project' not found${NC}"
        exit 1
    fi

    local design_file="$project_dir/design.json"

    if [[ -f "$design_file" ]]; then
        echo -e "${YELLOW}Design file already exists: $design_file${NC}"
        read -p "Overwrite? (y/N): " confirm
        if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
            echo "Aborted."
            exit 0
        fi
    fi

    echo -e "${BOLD}Initializing design for: $project${NC}"
    echo ""

    # Interactive industry selection
    echo -e "${BOLD}Select industry preset:${NC}"
    select industry in $(get_industry_types) "custom"; do
        if [[ -n "$industry" ]]; then
            break
        fi
    done

    # Create design.json template
    cat > "$design_file" << EOF
{
  "version": "1.0",
  "project": "$project",
  "industry": "$industry",
  "status": "draft",

  "colors": {
    "primary": "#1e3a5f",
    "secondary": "#f97316",
    "accent": "#22c55e"
  },

  "typography": {
    "headingFont": "Poppins",
    "bodyFont": "Inter"
  },

  "sections": {
    "header": "header-modern",
    "hero": "hero-split-cards",
    "body": [
      "stats-cards",
      "services-cards",
      "testimonials-cards",
      "cta-gradient"
    ],
    "footer": "footer-comprehensive"
  },

  "content": {
    "company": {
      "name": "",
      "tagline": "",
      "description": ""
    },
    "contact": {
      "phone": "",
      "email": "",
      "address": ""
    },
    "social": {
      "facebook": "",
      "instagram": "",
      "linkedin": ""
    }
  },

  "pages": [
    {
      "name": "Home",
      "slug": "/",
      "sections": ["hero", "stats", "services", "testimonials", "cta"]
    },
    {
      "name": "About",
      "slug": "/about",
      "sections": ["hero-simple", "features", "team", "cta"]
    },
    {
      "name": "Services",
      "slug": "/services",
      "sections": ["hero-simple", "services-detailed", "pricing", "cta"]
    },
    {
      "name": "Contact",
      "slug": "/contact",
      "sections": ["contact-split"]
    }
  ]
}
EOF

    # Apply industry colors if selected
    if [[ "$industry" != "custom" ]]; then
        local preset=$(get_industry_preset "$industry")
        local primary=$(echo "$preset" | jq -r '.primary.DEFAULT')
        local secondary=$(echo "$preset" | jq -r '.secondary.DEFAULT')
        local accent=$(echo "$preset" | jq -r '.accent.DEFAULT')

        # Update colors in design.json
        local tmp=$(mktemp)
        jq ".colors.primary = \"$primary\" | .colors.secondary = \"$secondary\" | .colors.accent = \"$accent\"" "$design_file" > "$tmp"
        mv "$tmp" "$design_file"
    fi

    echo -e "${GREEN}Design file created: $design_file${NC}"
    echo ""
    echo -e "${BOLD}Next steps:${NC}"
    echo "  1. Edit design.json with project content"
    echo "  2. Run: wpf design preview $project"
    echo "  3. Once approved: wpf design approve $project"
}

cmd_preview() {
    local project=$1

    if [[ -z "$project" ]]; then
        echo -e "${RED}Error: Project name required${NC}"
        exit 1
    fi

    local project_dir="$WPF_ROOT/projects/$project"
    local design_file="$project_dir/design.json"

    if [[ ! -f "$design_file" ]]; then
        echo -e "${RED}Error: No design.json found. Run 'wpf design init $project' first.${NC}"
        exit 1
    fi

    echo -e "${BOLD}Generating design preview...${NC}"

    # Generate preview HTML
    local preview_file="$project_dir/design-preview.html"

    # Read design selections
    local header=$(jq -r '.sections.header' "$design_file")
    local hero=$(jq -r '.sections.hero' "$design_file")
    local footer=$(jq -r '.sections.footer' "$design_file")
    local primary=$(jq -r '.colors.primary' "$design_file")
    local secondary=$(jq -r '.colors.secondary' "$design_file")

    # Create preview HTML with Tailwind CDN
    cat > "$preview_file" << 'PREVIEW_START'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Design Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        heading: ['Poppins', 'sans-serif'],
                        body: ['Inter', 'sans-serif'],
                    },
                    colors: {
PREVIEW_START

    # Add dynamic colors
    echo "                        primary: { DEFAULT: '$primary', 50: '#f0f4ff', 100: '#e0e9ff', 600: '$primary', 700: '$(echo $primary | sed 's/#/#1/')' }," >> "$preview_file"
    echo "                        secondary: { DEFAULT: '$secondary', 400: '$secondary', 500: '$secondary' }," >> "$preview_file"
    echo "                        accent: { DEFAULT: '#22c55e', 100: '#dcfce7', 600: '#16a34a' }," >> "$preview_file"

    cat >> "$preview_file" << 'PREVIEW_MID'
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Inter', sans-serif; }
    </style>
</head>
<body class="bg-gray-50">
    <div class="bg-yellow-50 border-b border-yellow-100 p-4 text-center">
        <span class="text-yellow-800 font-medium">🎨 Design Preview Mode</span>
        <span class="text-yellow-600 ml-2">| Status: Draft | Run 'wpf design approve' when ready</span>
    </div>

    <!-- Preview content will be inserted here -->
    <div class="preview-content">
PREVIEW_MID

    # Insert component previews (simplified placeholders for now)
    echo "        <div class=\"bg-primary-600 text-white p-20 text-center\">" >> "$preview_file"
    echo "            <h1 class=\"text-4xl font-heading font-bold mb-4\">Hero Section: $hero</h1>" >> "$preview_file"
    echo "            <p class=\"text-xl opacity-80\">Component preview will render here</p>" >> "$preview_file"
    echo "        </div>" >> "$preview_file"

    # Add more section placeholders
    jq -r '.sections.body[]' "$design_file" 2>/dev/null | while read -r section; do
        echo "        <div class=\"bg-white p-16 text-center border-b\">" >> "$preview_file"
        echo "            <h2 class=\"text-2xl font-heading font-bold text-gray-900 mb-2\">Section: $section</h2>" >> "$preview_file"
        echo "            <p class=\"text-gray-600\">This section will display the $section component</p>" >> "$preview_file"
        echo "        </div>" >> "$preview_file"
    done

    cat >> "$preview_file" << 'PREVIEW_END'
    </div>

    <div class="bg-gray-900 text-white p-12 text-center">
        <p class="text-gray-400">Footer component will render here</p>
    </div>
</body>
</html>
PREVIEW_END

    echo -e "${GREEN}Preview generated: $preview_file${NC}"
    echo ""

    # Try to open in browser
    if command -v xdg-open &> /dev/null; then
        xdg-open "$preview_file" 2>/dev/null &
        echo -e "Opening in browser..."
    elif command -v wslview &> /dev/null; then
        wslview "$preview_file" 2>/dev/null &
        echo -e "Opening in browser..."
    else
        echo -e "Open in browser: file://$preview_file"
    fi
}

cmd_approve() {
    local project=$1

    if [[ -z "$project" ]]; then
        echo -e "${RED}Error: Project name required${NC}"
        exit 1
    fi

    local project_dir="$WPF_ROOT/projects/$project"
    local design_file="$project_dir/design.json"

    if [[ ! -f "$design_file" ]]; then
        echo -e "${RED}Error: No design.json found${NC}"
        exit 1
    fi

    echo -e "${BOLD}Design Approval for: $project${NC}"
    echo ""

    # Validate design
    if ! validate_design "$design_file"; then
        echo -e "${RED}Please fix design.json before approving${NC}"
        exit 1
    fi

    echo ""
    echo -e "${YELLOW}This will:${NC}"
    echo "  1. Mark design as 'approved'"
    echo "  2. Generate WordPress theme files"
    echo "  3. Apply design tokens to Tailwind config"
    echo "  4. Create page templates"
    echo ""

    read -p "Proceed with approval? (y/N): " confirm
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        echo "Aborted."
        exit 0
    fi

    # Update status
    local tmp=$(mktemp)
    jq '.status = "approved" | .approvedAt = now' "$design_file" > "$tmp"
    mv "$tmp" "$design_file"

    echo -e "${GREEN}✓ Design approved!${NC}"
    echo ""
    echo -e "${BOLD}Next steps:${NC}"
    echo "  1. Run: wpf design compile $project"
    echo "  2. Start Docker: docker-compose up -d"
    echo "  3. Build CSS: npm run build"
}

cmd_compile() {
    local project=$1

    if [[ -z "$project" ]]; then
        echo -e "${RED}Error: Project name required${NC}"
        exit 1
    fi

    local project_dir="$WPF_ROOT/projects/$project"
    local design_file="$project_dir/design.json"

    if [[ ! -f "$design_file" ]]; then
        echo -e "${RED}Error: No design.json found${NC}"
        exit 1
    fi

    local status=$(jq -r '.status' "$design_file")
    if [[ "$status" != "approved" ]]; then
        echo -e "${YELLOW}Warning: Design not approved yet. Run 'wpf design approve $project' first.${NC}"
        read -p "Compile anyway? (y/N): " confirm
        if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
            exit 0
        fi
    fi

    echo -e "${BOLD}Compiling design into theme...${NC}"
    compile_design "$project_dir"

    echo ""
    echo -e "${GREEN}✓ Design compiled!${NC}"
    echo "  Theme files updated in: $project_dir/wp-content/themes/"
}

# Main command router
case "${1:-}" in
    list)
        cmd_list "${2:-}"
        ;;
    show)
        cmd_show "${2:-}"
        ;;
    industries)
        cmd_industries
        ;;
    init)
        cmd_init "${2:-}"
        ;;
    preview)
        cmd_preview "${2:-}"
        ;;
    approve)
        cmd_approve "${2:-}"
        ;;
    compile)
        cmd_compile "${2:-}"
        ;;
    help|--help|-h|"")
        show_usage
        ;;
    *)
        echo -e "${RED}Unknown command: $1${NC}"
        show_usage
        exit 1
        ;;
esac
