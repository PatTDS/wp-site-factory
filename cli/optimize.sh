#!/bin/bash
#
# wpf optimize - Configure WordPress plugins for performance and SEO
# Auto-configures Rank Math, Autoptimize, ShortPixel, Redis, WP Mail SMTP
#

OPTIMIZE_TARGET="${1:-all}"

# Find current project
CURRENT_DIR=$(pwd)
if [ -f "$CURRENT_DIR/.wpf-config" ]; then
    PROJECT_DIR="$CURRENT_DIR"
    source "$CURRENT_DIR/.wpf-config"
elif [ -f "$CURRENT_DIR/../.wpf-config" ]; then
    PROJECT_DIR="$CURRENT_DIR/.."
    source "$CURRENT_DIR/../.wpf-config"
else
    echo -e "${RED}Error:${NC} Not in a WPF project directory"
    exit 1
fi

# Source config library for additional settings
source "$WPF_ROOT/lib/config.sh" 2>/dev/null
config_load "$PROJECT_DIR" 2>/dev/null

print_banner
echo -e "${GREEN}Optimizing:${NC} $PROJECT_NAME"
echo ""

# Check if Docker is running (needed for WP-CLI)
check_docker() {
    if ! docker-compose ps 2>/dev/null | grep -q "Up"; then
        echo -e "${YELLOW}Docker not running. Starting...${NC}"
        docker-compose up -d
        sleep 10
    fi
}

# Execute WP-CLI command in Docker
# Tries multiple strategies: wpcli service, wordpress container, docker exec by name
wp_cli() {
    # Strategy 1: Use dedicated wpcli service (preferred)
    if docker-compose ps 2>/dev/null | grep -q "wpcli"; then
        docker-compose run --rm wpcli "$@" 2>/dev/null && return 0
    fi

    # Strategy 2: Try wordpress service with wp command
    if docker-compose exec -T wordpress which wp >/dev/null 2>&1; then
        docker-compose exec -T wordpress wp "$@" --allow-root 2>/dev/null && return 0
    fi

    # Strategy 3: Try container by project name pattern
    local container=$(docker ps --format '{{.Names}}' | grep -E "(wordpress|wp)" | head -1)
    if [ -n "$container" ]; then
        docker exec "$container" wp "$@" --allow-root 2>/dev/null && return 0
    fi

    echo "WP-CLI not available" >&2
    return 1
}

# Install required plugins
install_plugins() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}Installing Performance Plugins${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    local plugins=(
        "seo-by-rank-math"
        "autoptimize"
        "shortpixel-image-optimiser"
        "redis-cache"
        "wp-mail-smtp"
    )

    for plugin in "${plugins[@]}"; do
        echo -n "  $plugin... "
        if wp_cli plugin is-installed "$plugin" 2>/dev/null; then
            if ! wp_cli plugin is-active "$plugin" 2>/dev/null; then
                wp_cli plugin activate "$plugin" 2>/dev/null
                echo -e "${GREEN}activated${NC}"
            else
                echo -e "${GREEN}already active${NC}"
            fi
        else
            wp_cli plugin install "$plugin" --activate 2>/dev/null
            echo -e "${GREEN}installed & activated${NC}"
        fi
    done

    echo ""
}

# Configure Rank Math SEO
configure_seo() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}Configuring SEO (Rank Math)${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    # Enable modules
    echo "  Enabling SEO modules..."
    wp_cli option update rank_math_modules '["rich-snippet","sitemap","link-counter","404-monitor","local-seo","redirections"]' --format=json 2>/dev/null

    # Configure LocalBusiness schema with project info
    if [ -n "$COMPANY_NAME" ]; then
        echo "  Setting up LocalBusiness schema for: $COMPANY_NAME"
        wp_cli option update rank_math_local_business_type 'Organization' 2>/dev/null
        wp_cli option update rank_math_local_business_name "$COMPANY_NAME" 2>/dev/null
    fi

    if [ -n "$DOMAIN" ]; then
        wp_cli option update rank_math_local_business_url "https://$DOMAIN" 2>/dev/null
    fi

    # Enable breadcrumbs
    wp_cli option update rank_math_breadcrumbs_enable 'on' 2>/dev/null
    wp_cli option update rank_math_breadcrumbs_separator ' » ' 2>/dev/null

    echo -e "  ${GREEN}✓ SEO configured${NC}"
    echo ""
}

# Configure Autoptimize
configure_cache() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}Configuring Cache & Optimization (Autoptimize)${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    # HTML optimization
    echo "  Enabling HTML optimization..."
    wp_cli option update autoptimize_html 'on' 2>/dev/null
    wp_cli option update autoptimize_html_keepcomments '' 2>/dev/null

    # CSS optimization
    echo "  Enabling CSS optimization..."
    wp_cli option update autoptimize_css 'on' 2>/dev/null
    wp_cli option update autoptimize_css_inline 'on' 2>/dev/null
    wp_cli option update autoptimize_css_defer 'on' 2>/dev/null

    # JS optimization
    echo "  Enabling JS optimization..."
    wp_cli option update autoptimize_js 'on' 2>/dev/null
    wp_cli option update autoptimize_js_defer 'on' 2>/dev/null

    # Optimize for logged-in users too
    wp_cli option update autoptimize_optimize_logged 'on' 2>/dev/null

    echo -e "  ${GREEN}✓ Cache optimization configured${NC}"
    echo ""

    # Configure Redis if available
    echo "  Checking Redis..."
    if docker-compose ps 2>/dev/null | grep -q "redis"; then
        echo "  Enabling Redis object cache..."
        wp_cli redis enable 2>/dev/null || echo "  (Redis plugin may need manual setup)"
        echo -e "  ${GREEN}✓ Redis enabled${NC}"
    else
        echo -e "  ${YELLOW}⚠ Redis container not found${NC}"
    fi

    echo ""
}

# Configure ShortPixel
configure_images() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}Configuring Image Optimization (ShortPixel)${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    # Check for API key
    local api_key="${SHORTPIXEL_API_KEY:-}"

    if [ -z "$api_key" ]; then
        echo -e "  ${YELLOW}⚠ No SHORTPIXEL_API_KEY in config${NC}"
        echo "  Add to .wpf-config: SHORTPIXEL_API_KEY=\"your-key\""
        echo "  Get free key at: https://shortpixel.com/free-sign-up"
        echo ""
        return 0
    fi

    echo "  Setting API key..."
    wp_cli option update shortpixel_api_key "$api_key" 2>/dev/null

    # Optimal settings
    echo "  Configuring optimization settings..."
    wp_cli option update shortpixel_compression_type 2 2>/dev/null  # Lossy
    wp_cli option update shortpixel_auto_media_library 1 2>/dev/null  # Auto-optimize
    wp_cli option update shortpixel_webp 1 2>/dev/null  # WebP
    wp_cli option update shortpixel_retina 1 2>/dev/null  # Retina
    wp_cli option update shortpixel_remove_exif 1 2>/dev/null  # Remove EXIF

    echo -e "  ${GREEN}✓ Image optimization configured${NC}"
    echo ""
}

# Configure WP Mail SMTP
configure_email() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}Configuring Email (WP Mail SMTP)${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    local from_email="noreply@${DOMAIN:-localhost}"
    local from_name="${COMPANY_NAME:-WordPress}"

    echo "  Setting from: $from_name <$from_email>"

    # Basic configuration (uses PHP mail by default)
    local smtp_config="{\"mail\":{\"from_email\":\"$from_email\",\"from_name\":\"$from_name\",\"mailer\":\"mail\",\"return_path\":true}}"
    wp_cli option update wp_mail_smtp "$smtp_config" --format=json 2>/dev/null

    echo -e "  ${GREEN}✓ Email configured (using PHP mail)${NC}"
    echo -e "  ${YELLOW}Note: For production, configure SMTP in WordPress admin${NC}"
    echo ""
}

# Validate all configurations
validate_config() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}Validating Configuration${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    local all_good=true

    # Check Rank Math
    echo -n "  Rank Math SEO: "
    if wp_cli plugin is-active seo-by-rank-math 2>/dev/null; then
        echo -e "${GREEN}✓ Active${NC}"
    else
        echo -e "${RED}✗ Not active${NC}"
        all_good=false
    fi

    # Check Autoptimize
    echo -n "  Autoptimize: "
    if wp_cli plugin is-active autoptimize 2>/dev/null; then
        local css_on=$(wp_cli option get autoptimize_css 2>/dev/null)
        if [ "$css_on" = "on" ]; then
            echo -e "${GREEN}✓ Active & Configured${NC}"
        else
            echo -e "${YELLOW}✓ Active but not configured${NC}"
        fi
    else
        echo -e "${RED}✗ Not active${NC}"
        all_good=false
    fi

    # Check ShortPixel
    echo -n "  ShortPixel: "
    if wp_cli plugin is-active shortpixel-image-optimiser 2>/dev/null; then
        local api_key=$(wp_cli option get shortpixel_api_key 2>/dev/null)
        if [ -n "$api_key" ]; then
            echo -e "${GREEN}✓ Active & API key set${NC}"
        else
            echo -e "${YELLOW}✓ Active but no API key${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ Not active${NC}"
    fi

    # Check Redis
    echo -n "  Redis Cache: "
    if wp_cli plugin is-active redis-cache 2>/dev/null; then
        if wp_cli redis status 2>/dev/null | grep -q "Connected"; then
            echo -e "${GREEN}✓ Connected${NC}"
        else
            echo -e "${YELLOW}✓ Active but not connected${NC}"
        fi
    else
        echo -e "${YELLOW}⚠ Not active${NC}"
    fi

    # Check WP Mail SMTP
    echo -n "  WP Mail SMTP: "
    if wp_cli plugin is-active wp-mail-smtp 2>/dev/null; then
        echo -e "${GREEN}✓ Active${NC}"
    else
        echo -e "${YELLOW}⚠ Not active${NC}"
    fi

    echo ""

    if [ "$all_good" = true ]; then
        echo -e "${GREEN}✓ All critical plugins configured${NC}"
    else
        echo -e "${YELLOW}⚠ Some plugins need attention${NC}"
    fi
}

# Main optimization orchestration
optimize_all() {
    local start_time=$(date +%s)

    check_docker
    install_plugins
    configure_seo
    configure_cache
    configure_images
    configure_email
    validate_config

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✓ Optimization complete in ${duration}s${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Clear browser cache"
    echo "  2. Run: wpf test"
    echo "  3. Check Lighthouse score"
}

# Execute based on target
case "$OPTIMIZE_TARGET" in
    plugins)
        check_docker
        install_plugins
        ;;
    seo)
        check_docker
        configure_seo
        ;;
    cache)
        check_docker
        configure_cache
        ;;
    images)
        check_docker
        configure_images
        ;;
    email)
        check_docker
        configure_email
        ;;
    validate)
        check_docker
        validate_config
        ;;
    all)
        optimize_all
        ;;
    *)
        echo -e "${RED}Unknown optimize target: $OPTIMIZE_TARGET${NC}"
        echo "Usage: wpf optimize [plugins|seo|cache|images|email|validate|all]"
        exit 1
        ;;
esac
