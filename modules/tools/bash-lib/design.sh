#!/bin/bash
# WPF Design System Library Functions
# Provides functions for working with the design system

DESIGN_SYSTEM_DIR="${WPF_ROOT:-/home/atric/wp-site-factory}/design-system"
COMPONENTS_DIR="$DESIGN_SYSTEM_DIR/components"
TOKENS_DIR="$DESIGN_SYSTEM_DIR/tokens"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Load component index
load_component_index() {
    if [[ -f "$COMPONENTS_DIR/index.json" ]]; then
        cat "$COMPONENTS_DIR/index.json"
    else
        echo "{}"
    fi
}

# Get all categories
get_categories() {
    load_component_index | jq -r '.categories | keys[]'
}

# Get components for a category
get_components_for_category() {
    local category=$1
    load_component_index | jq -r ".categories.\"$category\".components[] | .id"
}

# Get component details
get_component_details() {
    local component_id=$1
    load_component_index | jq -r ".categories[] | .components[] | select(.id == \"$component_id\")"
}

# Get component file path
get_component_file() {
    local component_id=$1
    local file=$(load_component_index | jq -r ".categories[] | .components[] | select(.id == \"$component_id\") | .file")
    echo "$COMPONENTS_DIR/$file"
}

# Load industry presets
load_industry_presets() {
    if [[ -f "$TOKENS_DIR/industry-presets.json" ]]; then
        cat "$TOKENS_DIR/industry-presets.json"
    else
        echo "{}"
    fi
}

# Get industry preset
get_industry_preset() {
    local industry=$1
    load_industry_presets | jq -r ".presets.\"$industry\""
}

# Get all industry types
get_industry_types() {
    load_industry_presets | jq -r '.presets | keys[]'
}

# Apply industry preset to project
apply_industry_preset() {
    local industry=$1
    local project_dir=$2

    local preset=$(get_industry_preset "$industry")
    if [[ "$preset" == "null" ]]; then
        echo -e "${RED}Error: Unknown industry preset '$industry'${NC}"
        return 1
    fi

    echo -e "${GREEN}Applying industry preset: $industry${NC}"

    # Extract colors from preset
    local primary=$(echo "$preset" | jq -r '.primary.DEFAULT')
    local secondary=$(echo "$preset" | jq -r '.secondary.DEFAULT')
    local accent=$(echo "$preset" | jq -r '.accent.DEFAULT')

    echo -e "  Primary: ${CYAN}$primary${NC}"
    echo -e "  Secondary: ${CYAN}$secondary${NC}"
    echo -e "  Accent: ${CYAN}$accent${NC}"

    return 0
}

# Display component list
display_component_list() {
    local category=$1

    if [[ -z "$category" ]]; then
        # Show all categories
        echo -e "${BOLD}Available Component Categories:${NC}"
        echo ""

        for cat in $(get_categories); do
            local name=$(load_component_index | jq -r ".categories.\"$cat\".name")
            local desc=$(load_component_index | jq -r ".categories.\"$cat\".description")
            local count=$(load_component_index | jq ".categories.\"$cat\".components | length")

            echo -e "  ${BOLD}$cat${NC} ($count components)"
            echo -e "    ${CYAN}$name${NC} - $desc"
            echo ""
        done
    else
        # Show components in category
        local name=$(load_component_index | jq -r ".categories.\"$category\".name")
        echo -e "${BOLD}$name Components:${NC}"
        echo ""

        load_component_index | jq -r ".categories.\"$category\".components[] | \"  \(.id)|\(.name)|\(.description)\"" | while IFS='|' read -r id name desc; do
            echo -e "  ${BOLD}$id${NC}"
            echo -e "    ${CYAN}$name${NC}"
            echo -e "    $desc"
            echo ""
        done
    fi
}

# Display component details
display_component_details() {
    local component_id=$1
    local details=$(get_component_details "$component_id")

    if [[ -z "$details" || "$details" == "null" ]]; then
        echo -e "${RED}Error: Component '$component_id' not found${NC}"
        return 1
    fi

    local name=$(echo "$details" | jq -r '.name')
    local desc=$(echo "$details" | jq -r '.description')
    local file=$(echo "$details" | jq -r '.file')

    echo -e "${BOLD}Component: $name${NC}"
    echo -e "ID: ${CYAN}$component_id${NC}"
    echo -e "Description: $desc"
    echo ""

    echo -e "${BOLD}Best For:${NC}"
    echo "$details" | jq -r '.bestFor[]' | while read -r industry; do
        echo -e "  - $industry"
    done
    echo ""

    echo -e "${BOLD}Features:${NC}"
    echo "$details" | jq -r '.features[]' | while read -r feature; do
        echo -e "  - $feature"
    done
    echo ""

    echo -e "${BOLD}File:${NC} $COMPONENTS_DIR/$file"
}

# Read component HTML
read_component_html() {
    local component_id=$1
    local file=$(get_component_file "$component_id")

    if [[ -f "$file" ]]; then
        cat "$file"
    else
        echo ""
    fi
}

# Compile design for project
compile_design() {
    local project_dir=$1
    local design_file="$project_dir/design.json"

    if [[ ! -f "$design_file" ]]; then
        echo -e "${RED}Error: No design.json found in project${NC}"
        return 1
    fi

    echo -e "${GREEN}Compiling design for project...${NC}"

    # Read design selections
    local header=$(jq -r '.sections.header' "$design_file")
    local hero=$(jq -r '.sections.hero' "$design_file")
    local sections=$(jq -r '.sections.body[]' "$design_file")
    local footer=$(jq -r '.sections.footer' "$design_file")

    echo -e "  Header: ${CYAN}$header${NC}"
    echo -e "  Hero: ${CYAN}$hero${NC}"
    echo -e "  Footer: ${CYAN}$footer${NC}"

    return 0
}

# Validate design.json
validate_design() {
    local design_file=$1

    if [[ ! -f "$design_file" ]]; then
        echo -e "${RED}Error: Design file not found${NC}"
        return 1
    fi

    # Check required fields
    local has_industry=$(jq 'has("industry")' "$design_file")
    local has_sections=$(jq 'has("sections")' "$design_file")
    local has_content=$(jq 'has("content")' "$design_file")

    local errors=0

    if [[ "$has_industry" != "true" ]]; then
        echo -e "${RED}Missing: industry field${NC}"
        ((errors++))
    fi

    if [[ "$has_sections" != "true" ]]; then
        echo -e "${RED}Missing: sections field${NC}"
        ((errors++))
    fi

    if [[ "$has_content" != "true" ]]; then
        echo -e "${RED}Missing: content field${NC}"
        ((errors++))
    fi

    if [[ $errors -eq 0 ]]; then
        echo -e "${GREEN}Design file is valid${NC}"
        return 0
    else
        echo -e "${RED}Design file has $errors error(s)${NC}"
        return 1
    fi
}

# Export functions
export -f load_component_index
export -f get_categories
export -f get_components_for_category
export -f get_component_details
export -f get_component_file
export -f load_industry_presets
export -f get_industry_preset
export -f get_industry_types
export -f apply_industry_preset
export -f display_component_list
export -f display_component_details
export -f read_component_html
export -f compile_design
export -f validate_design
