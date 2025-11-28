#!/bin/bash
#
# wpf discover - Interactive discovery wizard for project configuration
# Gathers business information and generates .wpf-config
#

# Parse arguments
QUICK_MODE="false"
OUTPUT_JSON="false"
PROJECT_DIR=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --quick|-q)
            QUICK_MODE="true"
            shift
            ;;
        --json)
            OUTPUT_JSON="true"
            shift
            ;;
        *)
            PROJECT_DIR="$1"
            shift
            ;;
    esac
done

# Find project directory
if [ -z "$PROJECT_DIR" ]; then
    CURRENT_DIR=$(pwd)
    if [ -f "$CURRENT_DIR/.wpf-config" ]; then
        PROJECT_DIR="$CURRENT_DIR"
    elif [ -f "$CURRENT_DIR/../.wpf-config" ]; then
        PROJECT_DIR="$CURRENT_DIR/.."
    else
        PROJECT_DIR="$CURRENT_DIR"
    fi
fi

# =====================================================
# HELPER FUNCTIONS
# =====================================================

# Prompt for required field
prompt_required() {
    local prompt="$1"
    local var_name="$2"
    local default="$3"
    local value=""

    while [ -z "$value" ]; do
        if [ -n "$default" ]; then
            read -p "$prompt [$default]: " value
            value="${value:-$default}"
        else
            read -p "$prompt: " value
        fi

        if [ -z "$value" ]; then
            echo -e "${RED}This field is required.${NC}"
        fi
    done

    eval "$var_name=\"$value\""
}

# Prompt for optional field
prompt_optional() {
    local prompt="$1"
    local var_name="$2"
    local default="$3"
    local value=""

    if [ -n "$default" ]; then
        read -p "$prompt [$default]: " value
        value="${value:-$default}"
    else
        read -p "$prompt (optional): " value
    fi

    eval "$var_name=\"$value\""
}

# Prompt for selection from menu
prompt_select() {
    local prompt="$1"
    local var_name="$2"
    local default="$3"
    shift 3
    local options=("$@")

    echo ""
    echo "$prompt"
    local i=1
    for option in "${options[@]}"; do
        echo "  $i) $option"
        ((i++))
    done

    local choice=""
    read -p "Select [1-${#options[@]}] (default: $default): " choice
    choice="${choice:-$default}"

    if [[ "$choice" =~ ^[0-9]+$ ]] && [ "$choice" -ge 1 ] && [ "$choice" -le "${#options[@]}" ]; then
        eval "$var_name=\"${options[$((choice-1))]}\""
    else
        eval "$var_name=\"${options[$((default-1))]}\""
    fi
}

# Prompt for yes/no
prompt_confirm() {
    local prompt="$1"
    local var_name="$2"
    local default="${3:-y}"

    local yn_prompt="[Y/n]"
    [ "$default" = "n" ] && yn_prompt="[y/N]"

    read -p "$prompt $yn_prompt: " response
    response="${response:-$default}"

    if [[ "$response" =~ ^[Yy] ]]; then
        eval "$var_name=\"true\""
    else
        eval "$var_name=\"false\""
    fi
}

# Section header
section_header() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# =====================================================
# DISCOVERY SECTIONS
# =====================================================

discover_basics() {
    section_header "BUSINESS BASICS"
    echo "Let's start with the basic information about your business."
    echo ""

    prompt_required "Business/Company Name" COMPANY_NAME ""
    prompt_required "Project Name (lowercase, no spaces)" PROJECT_NAME "$(echo "$COMPANY_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd '[:alnum:]-')"

    prompt_select "Business Type" BUSINESS_TYPE 1 \
        "Professional Services" \
        "Retail/E-commerce" \
        "Restaurant/Food" \
        "Healthcare" \
        "Construction/Trades" \
        "Technology" \
        "Creative/Agency" \
        "Non-profit" \
        "Other"

    prompt_optional "Tagline/Slogan" TAGLINE ""
}

discover_contact() {
    section_header "CONTACT & LOCATION"
    echo "Enter your business contact information for SEO and schema markup."
    echo ""

    prompt_optional "Street Address" BUSINESS_STREET ""
    prompt_optional "Neighborhood/District" BUSINESS_NEIGHBORHOOD ""
    prompt_required "City" BUSINESS_CITY ""
    prompt_required "State/Province" BUSINESS_STATE ""
    prompt_optional "Postal/ZIP Code" BUSINESS_POSTAL_CODE ""
    prompt_optional "Country Code (e.g., BR, US)" BUSINESS_COUNTRY "BR"
    prompt_required "Phone Number (with country code)" BUSINESS_PHONE ""
    prompt_required "Contact Email" BUSINESS_EMAIL ""

    prompt_optional "Business Hours (e.g., Mo-Fr 08:00-18:00)" BUSINESS_HOURS "Mo-Fr 08:00-18:00"

    prompt_select "Price Range" BUSINESS_PRICE_RANGE 2 \
        "$" \
        "$$" \
        "$$$" \
        "$$$$"

    # Optional: coordinates
    prompt_confirm "Do you want to enter GPS coordinates?" ENTER_COORDS "n"
    if [ "$ENTER_COORDS" = "true" ]; then
        prompt_optional "Latitude (e.g., -23.5505)" BUSINESS_LATITUDE ""
        prompt_optional "Longitude (e.g., -46.6333)" BUSINESS_LONGITUDE ""
    fi
}

discover_online() {
    section_header "ONLINE PRESENCE"
    echo "Configure your domain and social media profiles."
    echo ""

    prompt_required "Primary Domain (without https://)" DOMAIN ""

    echo ""
    echo "Social Media Profiles (leave empty to skip):"
    prompt_optional "Facebook Page URL" SOCIAL_FACEBOOK ""
    prompt_optional "Instagram Profile URL" SOCIAL_INSTAGRAM ""
    prompt_optional "LinkedIn Page URL" SOCIAL_LINKEDIN ""

    prompt_confirm "Are you migrating from an existing website?" HAS_EXISTING_SITE "n"
    if [ "$HAS_EXISTING_SITE" = "true" ]; then
        prompt_optional "Existing website URL" EXISTING_SITE_URL ""
    fi
}

discover_visual() {
    section_header "VISUAL PREFERENCES"
    echo "Configure the visual style of your website."
    echo ""

    prompt_select "Color Scheme" COLOR_SCHEME 1 \
        "Professional (Blue/Gray)" \
        "Warm (Orange/Brown)" \
        "Cool (Teal/Green)" \
        "Earth (Green/Brown)" \
        "Vibrant (Purple/Pink)" \
        "Minimal (Black/White)" \
        "Custom"

    if [ "$COLOR_SCHEME" = "Custom" ]; then
        prompt_optional "Primary Color (hex, e.g., #3498db)" PRIMARY_COLOR "#3498db"
        prompt_optional "Secondary Color (hex)" SECONDARY_COLOR "#2ecc71"
    else
        # Set defaults based on scheme
        case "$COLOR_SCHEME" in
            "Professional (Blue/Gray)")
                PRIMARY_COLOR="#2563eb"
                SECONDARY_COLOR="#64748b"
                ;;
            "Warm (Orange/Brown)")
                PRIMARY_COLOR="#ea580c"
                SECONDARY_COLOR="#78350f"
                ;;
            "Cool (Teal/Green)")
                PRIMARY_COLOR="#0d9488"
                SECONDARY_COLOR="#059669"
                ;;
            "Earth (Green/Brown)")
                PRIMARY_COLOR="#65a30d"
                SECONDARY_COLOR="#a16207"
                ;;
            "Vibrant (Purple/Pink)")
                PRIMARY_COLOR="#9333ea"
                SECONDARY_COLOR="#db2777"
                ;;
            "Minimal (Black/White)")
                PRIMARY_COLOR="#18181b"
                SECONDARY_COLOR="#71717a"
                ;;
        esac
    fi

    prompt_select "Hero Style" HERO_STYLE 1 \
        "Full-screen Image" \
        "Video Background" \
        "Gradient Background" \
        "Slideshow" \
        "Minimal (Text Only)"

    prompt_optional "Logo file path (optional)" LOGO_PATH ""
}

discover_content() {
    section_header "CONTENT STRUCTURE"
    echo "Configure the pages and sections for your website."
    echo ""

    echo "Which pages should your website include?"
    prompt_confirm "  Home page" PAGE_HOME "y"
    prompt_confirm "  About page" PAGE_ABOUT "y"
    prompt_confirm "  Services page" PAGE_SERVICES "y"
    prompt_confirm "  Portfolio/Projects page" PAGE_PORTFOLIO "n"
    prompt_confirm "  Blog page" PAGE_BLOG "n"
    prompt_confirm "  Contact page" PAGE_CONTACT "y"

    if [ "$PAGE_SERVICES" = "true" ]; then
        echo ""
        prompt_optional "How many services/products will you list?" SERVICE_COUNT "6"
    fi

    echo ""
    echo "Additional sections:"
    prompt_confirm "  Testimonials section" SECTION_TESTIMONIALS "y"
    prompt_confirm "  Team section" SECTION_TEAM "n"
    prompt_confirm "  FAQ section" SECTION_FAQ "n"
    prompt_confirm "  Partners/Clients logos" SECTION_PARTNERS "n"
}

discover_technical() {
    section_header "TECHNICAL CONFIGURATION"
    echo "Configure hosting and API settings."
    echo ""

    prompt_select "Hosting Provider Type" HOSTING_PROVIDER 1 \
        "sftp" \
        "ftp" \
        "rsync"

    prompt_optional "Hosting hostname (e.g., ftp.example.com)" HOSTING_HOST ""
    prompt_optional "Hosting username" HOSTING_USER ""

    case "$HOSTING_PROVIDER" in
        sftp)
            prompt_optional "SSH/SFTP Port" HOSTING_PORT "22"
            ;;
        ftp)
            prompt_optional "FTP Port" HOSTING_PORT "21"
            ;;
        rsync)
            prompt_optional "SSH Port" HOSTING_PORT "22"
            ;;
    esac

    prompt_optional "Remote WordPress path" HOSTING_PATH "/public_html"

    echo ""
    echo "API Keys (optional - can be added later):"
    prompt_optional "ShortPixel API Key (for image optimization)" SHORTPIXEL_API_KEY ""
}

# =====================================================
# OUTPUT GENERATION
# =====================================================

generate_wpf_config() {
    local config_file="$PROJECT_DIR/.wpf-config"

    cat > "$config_file" << EOF
# WPF Project Configuration
# Generated by wpf discover on $(date +%Y-%m-%d)
#

# =====================================================
# PROJECT BASICS
# =====================================================

PROJECT_NAME="$PROJECT_NAME"
COMPANY_NAME="$COMPANY_NAME"
DOMAIN="$DOMAIN"
TAGLINE="$TAGLINE"

# =====================================================
# HOSTING CONFIGURATION
# =====================================================

HOSTING_PROVIDER="$HOSTING_PROVIDER"
HOSTING_HOST="$HOSTING_HOST"
HOSTING_USER="$HOSTING_USER"
HOSTING_PORT="$HOSTING_PORT"
HOSTING_PATH="$HOSTING_PATH"

# =====================================================
# BUSINESS INFORMATION (For SEO/Schema)
# =====================================================

BUSINESS_TYPE="$BUSINESS_TYPE"
BUSINESS_STREET="$BUSINESS_STREET"
BUSINESS_NEIGHBORHOOD="$BUSINESS_NEIGHBORHOOD"
BUSINESS_CITY="$BUSINESS_CITY"
BUSINESS_STATE="$BUSINESS_STATE"
BUSINESS_POSTAL_CODE="$BUSINESS_POSTAL_CODE"
BUSINESS_COUNTRY="$BUSINESS_COUNTRY"
BUSINESS_PHONE="$BUSINESS_PHONE"
BUSINESS_EMAIL="$BUSINESS_EMAIL"
BUSINESS_LATITUDE="$BUSINESS_LATITUDE"
BUSINESS_LONGITUDE="$BUSINESS_LONGITUDE"
BUSINESS_PRICE_RANGE="$BUSINESS_PRICE_RANGE"
BUSINESS_HOURS="$BUSINESS_HOURS"

# =====================================================
# SOCIAL MEDIA
# =====================================================

SOCIAL_FACEBOOK="$SOCIAL_FACEBOOK"
SOCIAL_INSTAGRAM="$SOCIAL_INSTAGRAM"
SOCIAL_LINKEDIN="$SOCIAL_LINKEDIN"

# =====================================================
# VISUAL PREFERENCES
# =====================================================

COLOR_SCHEME="$COLOR_SCHEME"
PRIMARY_COLOR="$PRIMARY_COLOR"
SECONDARY_COLOR="$SECONDARY_COLOR"
HERO_STYLE="$HERO_STYLE"
LOGO_PATH="$LOGO_PATH"

# =====================================================
# CONTENT STRUCTURE
# =====================================================

PAGE_HOME="$PAGE_HOME"
PAGE_ABOUT="$PAGE_ABOUT"
PAGE_SERVICES="$PAGE_SERVICES"
PAGE_PORTFOLIO="$PAGE_PORTFOLIO"
PAGE_BLOG="$PAGE_BLOG"
PAGE_CONTACT="$PAGE_CONTACT"
SERVICE_COUNT="$SERVICE_COUNT"
SECTION_TESTIMONIALS="$SECTION_TESTIMONIALS"
SECTION_TEAM="$SECTION_TEAM"
SECTION_FAQ="$SECTION_FAQ"
SECTION_PARTNERS="$SECTION_PARTNERS"

# =====================================================
# API KEYS
# =====================================================

SHORTPIXEL_API_KEY="$SHORTPIXEL_API_KEY"

# =====================================================
# TESTING CONFIGURATION
# =====================================================

TEST_SKIP_ADMIN="true"
TEST_BROWSERS="chromium"
TEST_PERFORMANCE_TARGET="70"
ENVIRONMENT="production"
EOF

    echo -e "${GREEN}Configuration saved to: $config_file${NC}"
}

generate_discovery_json() {
    local json_file="$PROJECT_DIR/discovery-results.json"

    cat > "$json_file" << EOF
{
  "generated": "$(date -Iseconds)",
  "project": {
    "name": "$PROJECT_NAME",
    "company": "$COMPANY_NAME",
    "domain": "$DOMAIN",
    "tagline": "$TAGLINE"
  },
  "business": {
    "type": "$BUSINESS_TYPE",
    "address": {
      "street": "$BUSINESS_STREET",
      "neighborhood": "$BUSINESS_NEIGHBORHOOD",
      "city": "$BUSINESS_CITY",
      "state": "$BUSINESS_STATE",
      "postalCode": "$BUSINESS_POSTAL_CODE",
      "country": "$BUSINESS_COUNTRY"
    },
    "contact": {
      "phone": "$BUSINESS_PHONE",
      "email": "$BUSINESS_EMAIL"
    },
    "hours": "$BUSINESS_HOURS",
    "priceRange": "$BUSINESS_PRICE_RANGE",
    "coordinates": {
      "latitude": "$BUSINESS_LATITUDE",
      "longitude": "$BUSINESS_LONGITUDE"
    }
  },
  "social": {
    "facebook": "$SOCIAL_FACEBOOK",
    "instagram": "$SOCIAL_INSTAGRAM",
    "linkedin": "$SOCIAL_LINKEDIN"
  },
  "visual": {
    "colorScheme": "$COLOR_SCHEME",
    "primaryColor": "$PRIMARY_COLOR",
    "secondaryColor": "$SECONDARY_COLOR",
    "heroStyle": "$HERO_STYLE",
    "logoPath": "$LOGO_PATH"
  },
  "content": {
    "pages": {
      "home": $PAGE_HOME,
      "about": $PAGE_ABOUT,
      "services": $PAGE_SERVICES,
      "portfolio": $PAGE_PORTFOLIO,
      "blog": $PAGE_BLOG,
      "contact": $PAGE_CONTACT
    },
    "serviceCount": "$SERVICE_COUNT",
    "sections": {
      "testimonials": $SECTION_TESTIMONIALS,
      "team": $SECTION_TEAM,
      "faq": $SECTION_FAQ,
      "partners": $SECTION_PARTNERS
    }
  },
  "migration": {
    "hasExistingSite": $HAS_EXISTING_SITE,
    "existingSiteUrl": "$EXISTING_SITE_URL"
  }
}
EOF

    echo -e "${GREEN}Discovery results saved to: $json_file${NC}"
}

# =====================================================
# MAIN EXECUTION
# =====================================================

print_banner
echo -e "${GREEN}WPF Discovery Wizard${NC}"
echo "This wizard will gather information about your business and website."
echo ""

if [ "$QUICK_MODE" = "true" ]; then
    echo -e "${YELLOW}Quick Mode: Only essential fields will be asked.${NC}"
    echo ""

    # Quick mode - just basics
    discover_basics
    discover_contact
    discover_online

    # Set defaults for skipped sections
    COLOR_SCHEME="Professional (Blue/Gray)"
    PRIMARY_COLOR="#2563eb"
    SECONDARY_COLOR="#64748b"
    HERO_STYLE="Full-screen Image"
    PAGE_HOME="true"
    PAGE_ABOUT="true"
    PAGE_SERVICES="true"
    PAGE_PORTFOLIO="false"
    PAGE_BLOG="false"
    PAGE_CONTACT="true"
    SERVICE_COUNT="6"
    SECTION_TESTIMONIALS="true"
    SECTION_TEAM="false"
    SECTION_FAQ="false"
    SECTION_PARTNERS="false"
    HOSTING_PROVIDER="sftp"
    HOSTING_PORT="22"
    HOSTING_PATH="/public_html"
else
    # Full discovery
    discover_basics
    discover_contact
    discover_online
    discover_visual
    discover_content
    discover_technical
fi

# Summary
section_header "DISCOVERY SUMMARY"
echo ""
echo "Project: $PROJECT_NAME"
echo "Company: $COMPANY_NAME"
echo "Domain:  $DOMAIN"
echo "Type:    $BUSINESS_TYPE"
echo "City:    $BUSINESS_CITY, $BUSINESS_STATE"
echo "Phone:   $BUSINESS_PHONE"
echo "Email:   $BUSINESS_EMAIL"
echo ""

prompt_confirm "Save this configuration?" SAVE_CONFIG "y"

if [ "$SAVE_CONFIG" = "true" ]; then
    generate_wpf_config

    if [ "$OUTPUT_JSON" = "true" ]; then
        generate_discovery_json
    fi

    echo ""
    echo -e "${GREEN}Discovery complete!${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Review .wpf-config and edit if needed"
    echo "  2. Run: wpf create $PROJECT_NAME"
    echo "  3. Or: wpf optimize all (if project exists)"
else
    echo ""
    echo -e "${YELLOW}Configuration not saved.${NC}"
    echo "Run 'wpf discover' again to restart."
fi
