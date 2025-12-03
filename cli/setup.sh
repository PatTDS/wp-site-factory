#!/bin/bash
#
# wpf setup - Zero-touch WordPress installation and configuration
# Installs WordPress, activates theme, installs plugins, creates pages and menus
#

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
    echo "Run this command from a project directory or use: wpf continue <project-name>"
    exit 1
fi

# Source libraries
source "$WPF_ROOT/lib/wordpress.sh"
source "$WPF_ROOT/lib/content.sh"

# Track warnings for summary
WARNINGS=()
ADMIN_PASS=""
START_TIME=$(date +%s)

print_banner
echo -e "${GREEN}Setting up:${NC} $PROJECT_NAME"
echo -e "${CYAN}Directory:${NC} $PROJECT_DIR"
echo ""

# Step 1: Ensure Docker is running
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Step 1: Docker Environment${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

ensure_docker_running

echo ""

# Step 2: Install WordPress
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Step 2: WordPress Installation${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if is_wordpress_installed; then
    echo -e "  ${GREEN}✓${NC} WordPress already installed"
else
    echo "  Installing WordPress..."

    # Generate secure password
    ADMIN_PASS=$(openssl rand -base64 12 | tr -dc 'a-zA-Z0-9' | head -c 16)

    # Determine URL
    SITE_URL="${DOMAIN:-localhost:8080}"
    if [[ ! "$SITE_URL" =~ ^https?:// ]]; then
        SITE_URL="http://$SITE_URL"
    fi

    # Install WordPress
    if wp_cli core install \
        --url="$SITE_URL" \
        --title="${COMPANY_NAME:-$PROJECT_NAME}" \
        --admin_user="admin" \
        --admin_password="$ADMIN_PASS" \
        --admin_email="${EMAIL:-admin@localhost}" \
        --skip-email 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} WordPress installed successfully"
    else
        echo -e "  ${RED}✗${NC} WordPress installation failed"
        WARNINGS+=("WordPress installation failed")
    fi
fi

echo ""

# Step 3: Activate Theme
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Step 3: Theme Activation${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

THEME_NAME="${PROJECT_NAME}-theme"

if is_theme_active "$THEME_NAME"; then
    echo -e "  ${GREEN}✓${NC} Theme '$THEME_NAME' already active"
else
    # Check if theme exists
    if wp_cli theme is-installed "$THEME_NAME" 2>/dev/null; then
        if wp_cli theme activate "$THEME_NAME" 2>/dev/null; then
            echo -e "  ${GREEN}✓${NC} Activated theme: $THEME_NAME"
        else
            echo -e "  ${RED}✗${NC} Failed to activate theme"
            WARNINGS+=("Theme activation failed")
        fi
    else
        echo -e "  ${YELLOW}⚠${NC} Theme '$THEME_NAME' not found, using default"
        WARNINGS+=("Project theme not found")
    fi
fi

echo ""

# Step 4: Configure Permalinks
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Step 4: Permalink Structure${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

wp_cli rewrite structure '/%postname%/' 2>/dev/null && \
    echo -e "  ${GREEN}✓${NC} Set permalink structure to /%postname%/"

wp_cli rewrite flush 2>/dev/null && \
    echo -e "  ${GREEN}✓${NC} Flushed rewrite rules"

echo ""

# Step 5: Install Plugins
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Step 5: Essential Plugins${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

PLUGINS=(
    "seo-by-rank-math"
    "autoptimize"
    "shortpixel-image-optimiser"
    "contact-form-7"
)

# Add Redis if container exists
if docker-compose -f "$PROJECT_DIR/docker-compose.yml" ps 2>/dev/null | grep -q "redis"; then
    PLUGINS+=("redis-cache")
fi

FAILED_PLUGINS=()

for plugin in "${PLUGINS[@]}"; do
    echo -n "  $plugin... "

    if wp_cli plugin is-installed "$plugin" 2>/dev/null; then
        if wp_cli plugin is-active "$plugin" 2>/dev/null; then
            echo -e "${GREEN}already active${NC}"
        else
            if wp_cli plugin activate "$plugin" 2>/dev/null; then
                echo -e "${GREEN}activated${NC}"
            else
                echo -e "${RED}activation failed${NC}"
                FAILED_PLUGINS+=("$plugin")
            fi
        fi
    else
        if wp_cli plugin install "$plugin" --activate 2>/dev/null; then
            echo -e "${GREEN}installed & activated${NC}"
        else
            echo -e "${RED}installation failed${NC}"
            FAILED_PLUGINS+=("$plugin")
        fi
    fi
done

if [ ${#FAILED_PLUGINS[@]} -gt 0 ]; then
    WARNINGS+=("Failed plugins: ${FAILED_PLUGINS[*]}")
fi

echo ""

# Step 6: Create Contact Form
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Step 6: Contact Form${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check if CF7 is active and create default form
if wp_cli plugin is-active contact-form-7 2>/dev/null; then
    # CF7 creates a default form on activation, just verify it exists
    FORM_COUNT=$(wp_cli post list --post_type=wpcf7_contact_form --format=count 2>/dev/null || echo "0")
    if [ "$FORM_COUNT" -gt 0 ]; then
        echo -e "  ${GREEN}✓${NC} Contact Form 7 ready ($FORM_COUNT form(s))"
    else
        echo -e "  ${YELLOW}⚠${NC} No contact forms found"
    fi
else
    echo -e "  ${YELLOW}⚠${NC} Contact Form 7 not active"
fi

echo ""

# Step 7: Remove Default Content
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Step 7: Remove Default Content${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

remove_default_content

# Step 8: Create Starter Pages
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Step 8: Starter Pages${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

create_starter_pages

# Step 9: Create Navigation Menu
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}Step 9: Navigation Menu${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

create_primary_menu

# Summary
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Setup complete in ${DURATION}s${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Show admin credentials if WordPress was installed
if [ -n "$ADMIN_PASS" ]; then
    echo -e "${GREEN}WordPress Admin Credentials:${NC}"
    echo -e "  URL:      ${SITE_URL}/wp-admin"
    echo -e "  Username: admin"
    echo -e "  Password: ${YELLOW}$ADMIN_PASS${NC}"
    echo ""
    echo -e "${RED}⚠ Save this password now - it won't be shown again!${NC}"
    echo ""
fi

# Show warnings if any
if [ ${#WARNINGS[@]} -gt 0 ]; then
    echo -e "${YELLOW}Warnings:${NC}"
    for warning in "${WARNINGS[@]}"; do
        echo -e "  • $warning"
    done
    echo ""
fi

echo "Next steps:"
echo "  1. Run: wpf status     - Check setup completion"
echo "  2. Run: wpf optimize   - Configure plugin settings"
echo "  3. Run: wpf build      - Build theme assets"
echo ""
