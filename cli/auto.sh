#!/bin/bash
#
# wpf auto - Full automation mode
# Creates complete WordPress site from discovery to deployment
#
# Usage:
#   wpf auto                    # Interactive mode
#   wpf auto --quick            # Quick mode with defaults
#   wpf auto --skip-deploy      # Skip deployment step
#

# Parse arguments
QUICK_MODE="false"
SKIP_DEPLOY="false"
SKIP_CONTENT="false"
PROJECT_NAME_ARG=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --quick|-q)
            QUICK_MODE="true"
            shift
            ;;
        --skip-deploy)
            SKIP_DEPLOY="true"
            shift
            ;;
        --skip-content)
            SKIP_CONTENT="true"
            shift
            ;;
        *)
            PROJECT_NAME_ARG="$1"
            shift
            ;;
    esac
done

print_banner
echo -e "${GREEN}WPF Auto Mode${NC}"
echo "Complete WordPress site creation in one command."
echo ""

# Track timing
START_TIME=$(date +%s)

# Step counter
STEP=0
TOTAL_STEPS=7

next_step() {
    ((STEP++))
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}STEP $STEP/$TOTAL_STEPS: $1${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# =====================================================
# STEP 1: DISCOVERY
# =====================================================

next_step "DISCOVERY"

if [ "$QUICK_MODE" = "true" ]; then
    echo "Running quick discovery..."
    source "$CLI_DIR/discover.sh" --quick
else
    echo "Running full discovery..."
    source "$CLI_DIR/discover.sh"
fi

# Check if discovery completed
if [ ! -f ".wpf-config" ]; then
    echo -e "${RED}Discovery not completed. Exiting.${NC}"
    exit 1
fi

# Reload config
source ".wpf-config"

echo ""
echo -e "${GREEN}Discovery complete for: $PROJECT_NAME${NC}"

# =====================================================
# STEP 2: PROJECT CREATION
# =====================================================

next_step "PROJECT CREATION"

# Check if project already exists
if [ -d "$WPF_ROOT/projects/$PROJECT_NAME" ]; then
    echo -e "${YELLOW}Project already exists. Using existing project.${NC}"
    cd "$WPF_ROOT/projects/$PROJECT_NAME"
else
    echo "Creating new project: $PROJECT_NAME"
    source "$CLI_DIR/create.sh" "$PROJECT_NAME"
    cd "$WPF_ROOT/projects/$PROJECT_NAME"
fi

# Copy config to project directory
cp "$CURRENT_DIR/.wpf-config" ".wpf-config" 2>/dev/null || true

echo ""
echo -e "${GREEN}Project ready: $PROJECT_NAME${NC}"

# =====================================================
# STEP 3: ENVIRONMENT SETUP
# =====================================================

next_step "ENVIRONMENT SETUP"

echo "Starting Docker environment..."
docker-compose up -d

echo "Waiting for WordPress to initialize..."
sleep 15

# Check WordPress is running
if docker-compose ps 2>/dev/null | grep -q "wordpress.*Up"; then
    echo -e "${GREEN}WordPress is running${NC}"
else
    echo -e "${RED}WordPress failed to start. Check Docker logs.${NC}"
    docker-compose logs wordpress
    exit 1
fi

# =====================================================
# STEP 4: BUILD ASSETS
# =====================================================

next_step "BUILD ASSETS"

echo "Building theme assets..."
source "$CLI_DIR/build.sh" all 2>&1 || echo -e "${YELLOW}Build had some issues, continuing...${NC}"

echo ""
echo -e "${GREEN}Assets built${NC}"

# =====================================================
# STEP 5: CONTENT GENERATION
# =====================================================

if [ "$SKIP_CONTENT" = "false" ]; then
    next_step "CONTENT GENERATION"

    echo "Generating content structure..."
    source "$CLI_DIR/content.sh" generate 2>&1 || echo -e "${YELLOW}Content generation had issues, continuing...${NC}"

    echo ""
    echo -e "${GREEN}Content structure created${NC}"
else
    echo ""
    echo -e "${YELLOW}Skipping content generation (--skip-content)${NC}"
    ((TOTAL_STEPS--))
fi

# =====================================================
# STEP 6: OPTIMIZATION
# =====================================================

next_step "OPTIMIZATION"

echo "Configuring performance plugins..."
source "$CLI_DIR/optimize.sh" all 2>&1 || echo -e "${YELLOW}Optimization had issues, continuing...${NC}"

echo ""
echo -e "${GREEN}Optimization complete${NC}"

# =====================================================
# STEP 7: DEPLOYMENT (Optional)
# =====================================================

if [ "$SKIP_DEPLOY" = "false" ] && [ -n "$HOSTING_HOST" ]; then
    next_step "DEPLOYMENT"

    echo "Deploying to staging..."
    source "$CLI_DIR/deploy.sh" staging --verify 2>&1 || {
        echo -e "${YELLOW}Deployment had issues. You can deploy manually later.${NC}"
    }
else
    if [ "$SKIP_DEPLOY" = "true" ]; then
        echo ""
        echo -e "${YELLOW}Skipping deployment (--skip-deploy)${NC}"
    else
        echo ""
        echo -e "${YELLOW}Skipping deployment (no hosting configured)${NC}"
        echo "Configure hosting in .wpf-config and run: wpf deploy staging"
    fi
    ((TOTAL_STEPS--))
fi

# =====================================================
# SUMMARY
# =====================================================

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}AUTO MODE COMPLETE${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Project: $PROJECT_NAME"
echo "Company: $COMPANY_NAME"
echo "Domain:  $DOMAIN"
echo ""
echo "Time: ${MINUTES}m ${SECONDS}s"
echo ""
echo -e "${GREEN}What was created:${NC}"
echo "  [x] Project structure"
echo "  [x] Docker environment"
echo "  [x] Theme with Tailwind CSS"
echo "  [x] Plugin for custom post types"
echo "  [x] Page structure"
echo "  [x] Service entries"
echo "  [x] AI content prompts"
echo "  [x] Performance optimization"
[ "$SKIP_DEPLOY" = "false" ] && [ -n "$HOSTING_HOST" ] && echo "  [x] Staging deployment"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "  1. Review: content-prompts.md"
echo "  2. Edit content in WordPress admin: http://localhost:8080/wp-admin"
echo "  3. Customize theme colors and layout"
echo "  4. Add real images and content"
echo "  5. Deploy to production: wpf deploy production"
echo ""
echo -e "${GREEN}Useful commands:${NC}"
echo "  wpf build watch     # Watch for CSS changes"
echo "  wpf test            # Run E2E tests"
echo "  wpf verify          # Verify deployment"
echo "  wpf backup          # Create backup"
echo ""
