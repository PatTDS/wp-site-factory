#!/bin/bash
#
# wpf deploy - Deploy project to staging or production
# Uses host-agnostic hosting abstraction layer
#

# Parse arguments
ENVIRONMENT="staging"
DRY_RUN="false"
BUILD_FIRST="false"
VERIFY_AFTER="false"
FULL_WORKFLOW="false"

while [[ $# -gt 0 ]]; do
    case $1 in
        staging|production)
            ENVIRONMENT="$1"
            shift
            ;;
        --dry-run)
            DRY_RUN="true"
            shift
            ;;
        --build)
            BUILD_FIRST="true"
            shift
            ;;
        --verify)
            VERIFY_AFTER="true"
            shift
            ;;
        --full)
            FULL_WORKFLOW="true"
            BUILD_FIRST="true"
            VERIFY_AFTER="true"
            shift
            ;;
        *)
            shift
            ;;
    esac
done

# Find current project
CURRENT_DIR=$(pwd)
if [ -f "$CURRENT_DIR/.wpf-config" ]; then
    PROJECT_DIR="$CURRENT_DIR"
elif [ -f "$CURRENT_DIR/../.wpf-config" ]; then
    PROJECT_DIR="$CURRENT_DIR/.."
else
    echo -e "${RED}Error:${NC} Not in a WPF project directory"
    echo "Please run this from within a project directory or use 'wpf continue <project>'"
    exit 1
fi

# Source hosting abstraction
source "$WPF_ROOT/lib/hosting.sh"

# Initialize hosting
if ! hosting_init "$PROJECT_DIR"; then
    echo -e "${YELLOW}Hosting not configured. Let's set it up:${NC}"
    echo ""

    echo "Choose your hosting provider:"
    echo "  1) SFTP (most shared hosting: Locaweb, HostGator, etc.)"
    echo "  2) FTP (legacy hosts)"
    echo "  3) Rsync/SSH (VPS, dedicated servers)"
    read -p "Select [1-3]: " provider_choice

    case "$provider_choice" in
        1) HOSTING_PROVIDER="sftp" ;;
        2) HOSTING_PROVIDER="ftp" ;;
        3) HOSTING_PROVIDER="rsync" ;;
        *) HOSTING_PROVIDER="sftp" ;;
    esac

    read -p "Hostname (e.g., ftp.example.com): " HOSTING_HOST
    read -p "Username: " HOSTING_USER
    read -p "Port [22 for SFTP, 21 for FTP]: " HOSTING_PORT
    HOSTING_PORT="${HOSTING_PORT:-22}"
    read -p "Remote path [/public_html]: " HOSTING_PATH
    HOSTING_PATH="${HOSTING_PATH:-/public_html}"

    # Save to config
    cat >> "$PROJECT_DIR/.wpf-config" << EOF

# Hosting Configuration
HOSTING_PROVIDER="$HOSTING_PROVIDER"
HOSTING_HOST="$HOSTING_HOST"
HOSTING_USER="$HOSTING_USER"
HOSTING_PORT="$HOSTING_PORT"
HOSTING_PATH="$HOSTING_PATH"
EOF

    echo ""
    echo -e "${GREEN}✓ Hosting configuration saved${NC}"
    echo ""

    # Reload config
    hosting_init "$PROJECT_DIR" || exit 1
fi

print_banner
echo -e "${GREEN}Deploying:${NC} $PROJECT_NAME to $ENVIRONMENT"
if [ "$FULL_WORKFLOW" = "true" ]; then
    echo -e "${CYAN}Mode: Full workflow (build → deploy → verify)${NC}"
fi
echo ""

# Run build first if requested
if [ "$BUILD_FIRST" = "true" ]; then
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}BUILDING ASSETS${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    source "$WPF_ROOT/cli/build.sh" all 2>/dev/null || echo -e "${YELLOW}Build had some issues, continuing...${NC}"
    echo ""
fi

# Show hosting info
hosting_info
echo ""

# Pre-deployment checks
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}PRE-DEPLOYMENT CHECKS${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

CHECKS_PASSED=true

# Check 1: Build assets exist
echo -n "Checking built assets... "
THEME_DIR="$PROJECT_DIR/wp-content/themes/${PROJECT_NAME}-theme"
if [ -f "$THEME_DIR/style.css" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ style.css not found - may need to build${NC}"
fi

# Check 2: No debug mode (for production)
if [ "$ENVIRONMENT" = "production" ]; then
    echo -n "Checking debug mode disabled... "
    if grep -q "WORDPRESS_DEBUG: 1" "$PROJECT_DIR/docker-compose.yml" 2>/dev/null; then
        echo -e "${YELLOW}⚠ Debug enabled in docker-compose${NC}"
    else
        echo -e "${GREEN}✓${NC}"
    fi
fi

# Check 3: Test connection
echo -n "Testing connection to hosting... "
if hosting_test_connection > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Connection failed${NC}"
    CHECKS_PASSED=false
fi

echo ""

if [ "$CHECKS_PASSED" = false ]; then
    echo -e "${RED}Some checks failed. Please fix before deploying.${NC}"
    exit 1
fi

# Dry run mode
if [ "$DRY_RUN" = "true" ] || [ "$DRY_RUN" = "--dry-run" ]; then
    echo -e "${YELLOW}DRY RUN MODE${NC}"
    echo ""
    echo "Would deploy:"
    echo "  Theme: ${PROJECT_DIR}/wp-content/themes/${PROJECT_NAME}-theme"
    if [ -d "$PROJECT_DIR/wp-content/plugins/${PROJECT_NAME}-plugin" ]; then
        echo "  Plugin: ${PROJECT_DIR}/wp-content/plugins/${PROJECT_NAME}-plugin"
    fi
    echo ""
    echo "To: ${HOSTING_HOST}:${HOSTING_PATH}/wp-content/"
    exit 0
fi

# Production requires confirmation
if [ "$ENVIRONMENT" = "production" ]; then
    echo -e "${YELLOW}⚠ PRODUCTION DEPLOYMENT${NC}"
    echo "This will deploy to the live site at $DOMAIN"
    read -p "Are you sure? Type 'DEPLOY' to confirm: " confirm
    if [ "$confirm" != "DEPLOY" ]; then
        echo "Deployment cancelled."
        exit 0
    fi
fi

# Execute deployment
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}DEPLOYING${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Standard excludes for WordPress deployment
EXCLUDES=(
    "node_modules"
    ".git"
    ".DS_Store"
    "*.log"
    "debug.log"
    "*.sql"
    ".env"
)

# Step 1: Create backup
echo "Step 1/3: Creating pre-deployment backup..."
BACKUP_NAME="pre-deploy-${ENVIRONMENT}-$(date +%Y%m%d-%H%M%S)"
hosting_backup "$BACKUP_NAME" 2>/dev/null || echo "  (backup skipped or failed)"

# Step 2: Upload theme
echo ""
echo "Step 2/3: Deploying theme..."
THEME_SRC="$PROJECT_DIR/wp-content/themes/${PROJECT_NAME}-theme"
THEME_DST="${HOSTING_PATH}/wp-content/themes/${PROJECT_NAME}-theme"

if [ -d "$THEME_SRC" ]; then
    hosting_upload "$THEME_SRC" "$THEME_DST" "${EXCLUDES[@]}"
    THEME_STATUS=$?
else
    echo "  Theme not found: $THEME_SRC"
    THEME_STATUS=1
fi

# Step 3: Upload plugin (if exists)
echo ""
echo "Step 3/3: Deploying plugin..."
PLUGIN_SRC="$PROJECT_DIR/wp-content/plugins/${PROJECT_NAME}-plugin"
PLUGIN_DST="${HOSTING_PATH}/wp-content/plugins/${PROJECT_NAME}-plugin"

if [ -d "$PLUGIN_SRC" ]; then
    hosting_upload "$PLUGIN_SRC" "$PLUGIN_DST" "${EXCLUDES[@]}"
    PLUGIN_STATUS=$?
else
    echo "  Plugin not found (skipping)"
    PLUGIN_STATUS=0
fi

# Results
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ $THEME_STATUS -eq 0 ] && [ $PLUGIN_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓ Deployment successful!${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Site: $(config_get_url)"
    echo ""

    # Run verification if requested
    if [ "$VERIFY_AFTER" = "true" ]; then
        echo ""
        echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${CYAN}POST-DEPLOYMENT VERIFICATION${NC}"
        echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        source "$WPF_ROOT/cli/verify.sh" all
    else
        echo "Post-deployment checklist:"
        echo "  [ ] Clear cache on hosting"
        echo "  [ ] Verify homepage loads"
        echo "  [ ] Test contact form"
        echo "  [ ] Check mobile responsiveness"
        echo "  [ ] Run: wpf test"
    fi
else
    echo -e "${RED}✗ Deployment failed${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Check the errors above. You can rollback using:"
    echo "  wpf backup restore $BACKUP_NAME"
    exit 1
fi
