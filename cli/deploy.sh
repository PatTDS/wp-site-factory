#!/bin/bash
#
# wpf deploy - Deploy project to staging or production
#

ENVIRONMENT="${1:-staging}"

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
    echo "Please run this from within a project directory or use 'wpf continue <project>'"
    exit 1
fi

print_banner
echo -e "${GREEN}Deploying:${NC} $PROJECT_NAME to $ENVIRONMENT"
echo ""

# Pre-deployment checks
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}PRE-DEPLOYMENT CHECKS${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

CHECKS_PASSED=true

# Check 1: Docker is running
echo -n "Checking Docker status... "
if docker-compose ps 2>/dev/null | grep -q "Up"; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ Not running (might be okay for deploy)${NC}"
fi

# Check 2: Build assets exist
echo -n "Checking built assets... "
THEME_DIR="$PROJECT_DIR/wp-content/themes/${PROJECT_NAME}-theme"
if [ -f "$THEME_DIR/style.css" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}⚠ style.css not found - may need to build${NC}"
fi

# Check 3: No debug mode (for production)
if [ "$ENVIRONMENT" = "production" ]; then
    echo -n "Checking debug mode disabled... "
    if grep -q "WORDPRESS_DEBUG: 1" "$PROJECT_DIR/docker-compose.yml" 2>/dev/null; then
        echo -e "${YELLOW}⚠ Debug enabled in docker-compose${NC}"
    else
        echo -e "${GREEN}✓${NC}"
    fi
fi

# Check 4: FTP credentials
echo -n "Checking deployment credentials... "
if [ -n "$FTP_HOST" ] && [ -n "$FTP_USER" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗ Missing FTP credentials${NC}"
    CHECKS_PASSED=false
fi

echo ""

if [ "$CHECKS_PASSED" = false ]; then
    echo -e "${RED}Some checks failed. Please fix before deploying.${NC}"

    if [ -z "$FTP_HOST" ] || [ -z "$FTP_USER" ]; then
        echo ""
        echo "Missing deployment credentials. Enter them now:"
        read -p "FTP/SFTP Host: " FTP_HOST
        read -p "FTP/SFTP Username: " FTP_USER
        read -s -p "FTP/SFTP Password: " FTP_PASS
        echo ""

        # Save to config
        echo "FTP_HOST=\"$FTP_HOST\"" >> "$PROJECT_DIR/.wpf-config"
        echo "FTP_USER=\"$FTP_USER\"" >> "$PROJECT_DIR/.wpf-config"
    fi
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

# Create deployment package
echo ""
echo -e "${CYAN}Creating deployment package...${NC}"

DEPLOY_DIR="$PROJECT_DIR/deployment-package"
rm -rf "$DEPLOY_DIR"
mkdir -p "$DEPLOY_DIR"

# Copy theme
cp -r "$PROJECT_DIR/wp-content/themes/${PROJECT_NAME}-theme" "$DEPLOY_DIR/"

# Copy plugin if exists
if [ -d "$PROJECT_DIR/wp-content/plugins/${PROJECT_NAME}-plugin" ]; then
    cp -r "$PROJECT_DIR/wp-content/plugins/${PROJECT_NAME}-plugin" "$DEPLOY_DIR/"
fi

# Create zip
cd "$DEPLOY_DIR"
zip -rq "../deploy-$(date +%Y%m%d-%H%M%S).zip" .
cd "$PROJECT_DIR"

echo -e "${GREEN}✓ Deployment package created${NC}"

# Deploy via SFTP
echo ""
echo -e "${CYAN}Deploying via SFTP...${NC}"

if [ -z "$FTP_PASS" ]; then
    read -s -p "Enter FTP password for $FTP_USER@$FTP_HOST: " FTP_PASS
    echo ""
fi

# Check if sshpass is installed
if ! command -v sshpass &> /dev/null; then
    echo -e "${YELLOW}sshpass not installed. Install with: sudo apt-get install sshpass${NC}"
    echo ""
    echo "Manual deployment steps:"
    echo "  1. Connect to $FTP_HOST as $FTP_USER"
    echo "  2. Upload contents of $DEPLOY_DIR to wp-content/"
    exit 1
fi

# Create SFTP batch file
SFTP_BATCH=$(mktemp)
cat > "$SFTP_BATCH" << SFTP
cd /public_html/wp-content/themes
put -r ${DEPLOY_DIR}/${PROJECT_NAME}-theme
SFTP

# Add plugin if exists
if [ -d "$DEPLOY_DIR/${PROJECT_NAME}-plugin" ]; then
    cat >> "$SFTP_BATCH" << SFTP
cd /public_html/wp-content/plugins
put -r ${DEPLOY_DIR}/${PROJECT_NAME}-plugin
SFTP
fi

echo "bye" >> "$SFTP_BATCH"

# Execute SFTP
timeout 120 sshpass -p "$FTP_PASS" sftp -oBatchMode=no -oStrictHostKeyChecking=no "$FTP_USER@$FTP_HOST" < "$SFTP_BATCH"
RESULT=$?

rm -f "$SFTP_BATCH"

if [ $RESULT -eq 0 ]; then
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✓ Deployment successful!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo "Site: https://$DOMAIN"
    echo ""
    echo "Post-deployment checklist:"
    echo "  [ ] Clear cache on hosting"
    echo "  [ ] Verify homepage loads"
    echo "  [ ] Test contact form"
    echo "  [ ] Check mobile responsiveness"
    echo "  [ ] Run Lighthouse audit"
else
    echo -e "${RED}Deployment failed with exit code $RESULT${NC}"
    exit 1
fi
