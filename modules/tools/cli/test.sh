#!/bin/bash
#
# wpf test - Run all tests
# Supports local Docker, staging, and production testing
#

TARGET="${1:-local}"  # local, staging, production, or URL

# Find current project
CURRENT_DIR=$(pwd)
if [ -f "$CURRENT_DIR/.wpf-config" ]; then
    PROJECT_DIR="$CURRENT_DIR"
    source "$CURRENT_DIR/.wpf-config"
else
    echo -e "${RED}Error:${NC} Not in a WPF project directory"
    exit 1
fi

# Source config library
source "$WPF_ROOT/lib/config.sh"
config_load "$PROJECT_DIR" 2>/dev/null

print_banner
echo -e "${GREEN}Running tests for:${NC} $PROJECT_NAME"
echo ""

# Determine SITE_URL based on target
case "$TARGET" in
    local)
        # Check if Docker is running
        if docker-compose ps 2>/dev/null | grep -q "Up"; then
            SITE_URL="http://localhost:8080"
            echo "Target: Local Docker environment"
        else
            echo -e "${YELLOW}Docker not running. Options:${NC}"
            echo "  1) Start Docker and test locally"
            echo "  2) Test production site ($DOMAIN)"
            echo "  3) Enter custom URL"
            read -p "Select [1-3]: " choice
            case "$choice" in
                1)
                    echo "Starting Docker..."
                    docker-compose up -d
                    sleep 10
                    SITE_URL="http://localhost:8080"
                    ;;
                2)
                    SITE_URL="$(config_get_url)"
                    ;;
                3)
                    read -p "Enter URL: " SITE_URL
                    ;;
                *)
                    SITE_URL="http://localhost:8080"
                    ;;
            esac
        fi
        ;;
    staging)
        if [ -n "$STAGING_URL" ]; then
            SITE_URL="$STAGING_URL"
        elif [[ "$DOMAIN" == *"staging"* ]]; then
            SITE_URL="https://$DOMAIN"
        else
            SITE_URL="https://staging.$DOMAIN"
        fi
        echo "Target: Staging environment"
        ;;
    production|prod|live)
        SITE_URL="$(config_get_url)"
        echo "Target: Production site"
        ;;
    http://*|https://*)
        # Direct URL provided
        SITE_URL="$TARGET"
        echo "Target: Custom URL"
        ;;
    *)
        echo -e "${RED}Unknown target: $TARGET${NC}"
        echo "Usage: wpf test [local|staging|production|URL]"
        exit 1
        ;;
esac

echo "Testing: $SITE_URL"
echo ""

ALL_PASSED=true

# =====================================================
# Test 1: Site Accessibility
# =====================================================
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}TEST 1: Site Accessibility${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "$SITE_URL" --connect-timeout 10 2>/dev/null)
RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" -L "$SITE_URL" --connect-timeout 10 2>/dev/null)

if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
    echo -e "${GREEN}✓ Site is accessible (HTTP $HTTP_CODE)${NC}"
    echo "  Response time: ${RESPONSE_TIME}s"
else
    echo -e "${RED}✗ Site not accessible (HTTP $HTTP_CODE)${NC}"
    ALL_PASSED=false
fi

# =====================================================
# Test 2: WordPress Admin
# =====================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}TEST 2: WordPress Admin${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

ADMIN_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "$SITE_URL/wp-admin/" --connect-timeout 10 2>/dev/null)
if [ "$ADMIN_CODE" = "200" ] || [ "$ADMIN_CODE" = "302" ]; then
    echo -e "${GREEN}✓ Admin accessible (HTTP $ADMIN_CODE)${NC}"
else
    echo -e "${YELLOW}⚠ Admin returned HTTP $ADMIN_CODE (may require login)${NC}"
fi

# =====================================================
# Test 3: REST API
# =====================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}TEST 3: REST API${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

API_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "$SITE_URL/wp-json/" --connect-timeout 10 2>/dev/null)
if [ "$API_CODE" = "200" ]; then
    echo -e "${GREEN}✓ REST API working (HTTP $API_CODE)${NC}"
else
    echo -e "${YELLOW}⚠ REST API not responding (HTTP $API_CODE)${NC}"
fi

# =====================================================
# Test 4: Critical Resources
# =====================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}TEST 4: Critical Resources${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Check theme CSS
CSS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "$SITE_URL/wp-content/themes/${PROJECT_NAME}-theme/style.css" --connect-timeout 10 2>/dev/null)
if [ "$CSS_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Theme CSS accessible${NC}"
else
    echo -e "${YELLOW}⚠ Theme CSS not found (HTTP $CSS_CODE)${NC}"
fi

# Check plugin
PLUGIN_CODE=$(curl -s -o /dev/null -w "%{http_code}" -L "$SITE_URL/wp-content/plugins/${PROJECT_NAME}-plugin/" --connect-timeout 10 2>/dev/null)
if [ "$PLUGIN_CODE" = "200" ] || [ "$PLUGIN_CODE" = "403" ]; then
    echo -e "${GREEN}✓ Plugin directory exists${NC}"
else
    echo -e "${YELLOW}⚠ Plugin not found (HTTP $PLUGIN_CODE)${NC}"
fi

# =====================================================
# Test 5: Playwright E2E (if installed)
# =====================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}TEST 5: E2E Tests${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ -f "$PROJECT_DIR/package.json" ] && command -v npx &> /dev/null; then
    if grep -q "playwright" "$PROJECT_DIR/package.json" 2>/dev/null; then
        echo "Running Playwright tests against $SITE_URL..."
        cd "$PROJECT_DIR"

        # Export BASE_URL for Playwright
        export BASE_URL="$SITE_URL"

        # Run tests (skip admin tests for remote targets)
        if [ "$TARGET" != "local" ]; then
            echo "(Skipping admin tests for remote target)"
            npx playwright test --grep-invert="admin" --reporter=list 2>&1 || {
                echo -e "${YELLOW}⚠ Some E2E tests failed${NC}"
                ALL_PASSED=false
            }
        else
            npx playwright test --reporter=list 2>&1 || {
                echo -e "${YELLOW}⚠ Some E2E tests failed${NC}"
                ALL_PASSED=false
            }
        fi
    else
        echo -e "${YELLOW}Playwright not configured - skipping${NC}"
    fi
else
    echo -e "${YELLOW}No package.json found - skipping E2E tests${NC}"
fi

# =====================================================
# Test 6: Lighthouse Performance
# =====================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}TEST 6: Performance Audit${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if command -v lighthouse &> /dev/null || command -v npx &> /dev/null; then
    echo "Running Lighthouse..."

    # Use npx lighthouse if global not installed
    LIGHTHOUSE_CMD="lighthouse"
    if ! command -v lighthouse &> /dev/null; then
        LIGHTHOUSE_CMD="npx lighthouse"
    fi

    $LIGHTHOUSE_CMD "$SITE_URL" \
        --output=json \
        --output-path="$PROJECT_DIR/lighthouse-report.json" \
        --chrome-flags="--headless --no-sandbox" \
        --quiet 2>/dev/null

    if [ -f "$PROJECT_DIR/lighthouse-report.json" ]; then
        # Parse scores
        PERF=$(cat "$PROJECT_DIR/lighthouse-report.json" | grep -o '"performance":[0-9.]*' | head -1 | cut -d: -f2)
        ACCESS=$(cat "$PROJECT_DIR/lighthouse-report.json" | grep -o '"accessibility":[0-9.]*' | head -1 | cut -d: -f2)
        BEST=$(cat "$PROJECT_DIR/lighthouse-report.json" | grep -o '"best-practices":[0-9.]*' | head -1 | cut -d: -f2)
        SEO=$(cat "$PROJECT_DIR/lighthouse-report.json" | grep -o '"seo":[0-9.]*' | head -1 | cut -d: -f2)

        # Convert to percentages
        PERF_PCT=$(echo "$PERF * 100" | bc 2>/dev/null | cut -d. -f1 || echo "N/A")
        ACCESS_PCT=$(echo "$ACCESS * 100" | bc 2>/dev/null | cut -d. -f1 || echo "N/A")
        BEST_PCT=$(echo "$BEST * 100" | bc 2>/dev/null | cut -d. -f1 || echo "N/A")
        SEO_PCT=$(echo "$SEO * 100" | bc 2>/dev/null | cut -d. -f1 || echo "N/A")

        echo "Lighthouse Scores:"

        # Performance
        if [ "$PERF_PCT" != "N/A" ] && [ "$PERF_PCT" -ge 70 ]; then
            echo -e "  ${GREEN}✓ Performance: ${PERF_PCT}%${NC}"
        elif [ "$PERF_PCT" != "N/A" ]; then
            echo -e "  ${YELLOW}⚠ Performance: ${PERF_PCT}% (target: 70+)${NC}"
        fi

        # Accessibility
        if [ "$ACCESS_PCT" != "N/A" ] && [ "$ACCESS_PCT" -ge 90 ]; then
            echo -e "  ${GREEN}✓ Accessibility: ${ACCESS_PCT}%${NC}"
        elif [ "$ACCESS_PCT" != "N/A" ]; then
            echo -e "  ${YELLOW}⚠ Accessibility: ${ACCESS_PCT}%${NC}"
        fi

        # Best Practices
        echo "  Best Practices: ${BEST_PCT}%"

        # SEO
        if [ "$SEO_PCT" != "N/A" ] && [ "$SEO_PCT" -ge 90 ]; then
            echo -e "  ${GREEN}✓ SEO: ${SEO_PCT}%${NC}"
        elif [ "$SEO_PCT" != "N/A" ]; then
            echo "  SEO: ${SEO_PCT}%"
        fi
    fi
else
    echo -e "${YELLOW}Lighthouse not available - skipping${NC}"
    echo "Install with: npm install -g lighthouse"
fi

# =====================================================
# Summary
# =====================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}TEST SUMMARY${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo "Tested: $SITE_URL"
echo ""

if [ "$ALL_PASSED" = true ]; then
    echo -e "${GREEN}✓ All critical tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some tests failed - review above${NC}"
    exit 1
fi
