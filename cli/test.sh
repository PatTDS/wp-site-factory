#!/bin/bash
#
# wpf test - Run all tests
#

# Find current project
CURRENT_DIR=$(pwd)
if [ -f "$CURRENT_DIR/.wpf-config" ]; then
    PROJECT_DIR="$CURRENT_DIR"
    source "$CURRENT_DIR/.wpf-config"
else
    echo -e "${RED}Error:${NC} Not in a WPF project directory"
    exit 1
fi

print_banner
echo -e "${GREEN}Running tests for:${NC} $PROJECT_NAME"
echo ""

# Check if Docker is running
if ! docker-compose ps 2>/dev/null | grep -q "Up"; then
    echo -e "${YELLOW}Docker not running. Starting...${NC}"
    docker-compose up -d
    sleep 10
fi

SITE_URL="http://localhost:8080"
ALL_PASSED=true

# =====================================================
# Test 1: Site Accessibility
# =====================================================
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}TEST 1: Site Accessibility${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL" 2>/dev/null)
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "302" ]; then
    echo -e "${GREEN}✓ Site is accessible (HTTP $HTTP_CODE)${NC}"
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

ADMIN_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/wp-admin/" 2>/dev/null)
if [ "$ADMIN_CODE" = "200" ] || [ "$ADMIN_CODE" = "302" ]; then
    echo -e "${GREEN}✓ Admin accessible (HTTP $ADMIN_CODE)${NC}"
else
    echo -e "${RED}✗ Admin not accessible (HTTP $ADMIN_CODE)${NC}"
    ALL_PASSED=false
fi

# =====================================================
# Test 3: REST API
# =====================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}TEST 3: REST API${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

API_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$SITE_URL/wp-json/" 2>/dev/null)
if [ "$API_CODE" = "200" ]; then
    echo -e "${GREEN}✓ REST API working (HTTP $API_CODE)${NC}"
else
    echo -e "${YELLOW}⚠ REST API not responding (HTTP $API_CODE)${NC}"
fi

# =====================================================
# Test 4: Playwright E2E (if installed)
# =====================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}TEST 4: E2E Tests${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ -f "$PROJECT_DIR/package.json" ] && command -v npx &> /dev/null; then
    if grep -q "playwright" "$PROJECT_DIR/package.json" 2>/dev/null; then
        echo "Running Playwright tests..."
        cd "$PROJECT_DIR"
        npx playwright test --reporter=list 2>&1 || {
            echo -e "${YELLOW}⚠ Some E2E tests failed${NC}"
            ALL_PASSED=false
        }
    else
        echo -e "${YELLOW}Playwright not configured - skipping${NC}"
    fi
else
    echo -e "${YELLOW}No package.json found - skipping E2E tests${NC}"
fi

# =====================================================
# Test 5: Lighthouse Performance
# =====================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}TEST 5: Performance Audit${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if command -v lighthouse &> /dev/null; then
    echo "Running Lighthouse..."
    lighthouse "$SITE_URL" --output=json --output-path="$PROJECT_DIR/lighthouse-report.json" --chrome-flags="--headless" --quiet 2>/dev/null

    if [ -f "$PROJECT_DIR/lighthouse-report.json" ]; then
        PERF_SCORE=$(cat "$PROJECT_DIR/lighthouse-report.json" | grep -o '"performance":[0-9.]*' | head -1 | cut -d: -f2)
        PERF_PERCENT=$(echo "$PERF_SCORE * 100" | bc 2>/dev/null || echo "N/A")

        if [ "$PERF_PERCENT" != "N/A" ] && [ $(echo "$PERF_PERCENT >= 70" | bc) -eq 1 ]; then
            echo -e "${GREEN}✓ Performance: ${PERF_PERCENT}%${NC}"
        else
            echo -e "${YELLOW}⚠ Performance: ${PERF_PERCENT}% (target: 70+)${NC}"
        fi
    fi
else
    echo -e "${YELLOW}Lighthouse not installed - skipping${NC}"
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

if [ "$ALL_PASSED" = true ]; then
    echo -e "${GREEN}✓ All critical tests passed!${NC}"
    exit 0
else
    echo -e "${YELLOW}⚠ Some tests failed - review above${NC}"
    exit 1
fi
