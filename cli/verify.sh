#!/bin/bash
#
# wpf verify - Verify deployment success and site health
# Compares local vs remote files, runs smoke tests, checks performance
#

VERIFY_TARGET="${1:-all}"

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

# Source libraries
source "$WPF_ROOT/lib/config.sh" 2>/dev/null
source "$WPF_ROOT/lib/hosting.sh" 2>/dev/null
config_load "$PROJECT_DIR" 2>/dev/null

SITE_URL="$(config_get_url 2>/dev/null || echo "https://$DOMAIN")"

print_banner
echo -e "${GREEN}Verifying:${NC} $PROJECT_NAME"
echo "URL: $SITE_URL"
echo ""

ALL_PASSED=true

# Smoke tests - basic HTTP checks
verify_smoke() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}Smoke Tests${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    local endpoints=(
        "$SITE_URL|Homepage"
        "$SITE_URL/wp-admin/|Admin"
        "$SITE_URL/wp-json/|REST API"
        "$SITE_URL/wp-content/themes/${PROJECT_NAME}-theme/style.css|Theme CSS"
    )

    for endpoint_info in "${endpoints[@]}"; do
        local url="${endpoint_info%%|*}"
        local name="${endpoint_info##*|}"

        echo -n "  $name: "

        local response=$(curl -s -o /dev/null -w "%{http_code}|%{time_total}" -L "$url" --connect-timeout 10 2>/dev/null)
        local http_code="${response%%|*}"
        local time="${response##*|}"

        case "$http_code" in
            200|301|302)
                echo -e "${GREEN}✓ HTTP $http_code (${time}s)${NC}"
                ;;
            403)
                echo -e "${YELLOW}⚠ HTTP $http_code (forbidden - may be expected)${NC}"
                ;;
            *)
                echo -e "${RED}✗ HTTP $http_code${NC}"
                ALL_PASSED=false
                ;;
        esac
    done

    echo ""
}

# File verification - compare local vs remote
verify_files() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}File Verification${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    # Check if hosting is configured
    if ! config_has_hosting 2>/dev/null; then
        echo -e "  ${YELLOW}⚠ Hosting not configured - skipping file verification${NC}"
        echo "  Run 'wpf deploy' first to configure hosting"
        echo ""
        return 0
    fi

    # Initialize hosting
    if ! hosting_init "$PROJECT_DIR" 2>/dev/null; then
        echo -e "  ${YELLOW}⚠ Could not initialize hosting - skipping${NC}"
        echo ""
        return 0
    fi

    # Critical files to verify
    local theme_path="$PROJECT_DIR/wp-content/themes/${PROJECT_NAME}-theme"
    local plugin_path="$PROJECT_DIR/wp-content/plugins/${PROJECT_NAME}-plugin"

    local files_to_check=(
        "$theme_path/style.css|${HOSTING_PATH}/wp-content/themes/${PROJECT_NAME}-theme/style.css"
        "$theme_path/functions.php|${HOSTING_PATH}/wp-content/themes/${PROJECT_NAME}-theme/functions.php"
        "$theme_path/front-page.php|${HOSTING_PATH}/wp-content/themes/${PROJECT_NAME}-theme/front-page.php"
    )

    # Add plugin if exists
    if [ -d "$plugin_path" ]; then
        files_to_check+=("$plugin_path/${PROJECT_NAME}-plugin.php|${HOSTING_PATH}/wp-content/plugins/${PROJECT_NAME}-plugin/${PROJECT_NAME}-plugin.php")
    fi

    local match_count=0
    local diff_count=0
    local error_count=0

    for file_pair in "${files_to_check[@]}"; do
        local local_file="${file_pair%%|*}"
        local remote_file="${file_pair##*|}"
        local filename=$(basename "$local_file")

        echo -n "  $filename: "

        if [ ! -f "$local_file" ]; then
            echo -e "${YELLOW}⚠ Local file not found${NC}"
            ((error_count++))
            continue
        fi

        # Get local hash
        local local_hash=$(md5sum "$local_file" 2>/dev/null | cut -d' ' -f1)

        # Get remote hash via hosting abstraction
        local temp_file="/tmp/wpf_verify_$$_$(basename "$remote_file")"
        if hosting_download "$remote_file" "$temp_file" > /dev/null 2>&1; then
            local remote_hash=$(md5sum "$temp_file" 2>/dev/null | cut -d' ' -f1)
            rm -f "$temp_file"

            if [ "$local_hash" = "$remote_hash" ]; then
                echo -e "${GREEN}✓ Match${NC}"
                ((match_count++))
            else
                echo -e "${YELLOW}⚠ Different${NC}"
                ((diff_count++))
            fi
        else
            echo -e "${YELLOW}⚠ Could not download${NC}"
            ((error_count++))
        fi
    done

    echo ""
    echo "  Results: $match_count match, $diff_count different, $error_count errors"

    if [ $diff_count -gt 0 ]; then
        echo -e "  ${YELLOW}Some files differ - consider redeploying${NC}"
        ALL_PASSED=false
    fi

    echo ""
}

# Performance check - quick Lighthouse audit
verify_performance() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}Performance Check${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    # Quick performance metrics via curl
    echo "  Response times:"

    local ttfb=$(curl -s -o /dev/null -w "%{time_starttransfer}" -L "$SITE_URL" --connect-timeout 10 2>/dev/null)
    local total=$(curl -s -o /dev/null -w "%{time_total}" -L "$SITE_URL" --connect-timeout 10 2>/dev/null)

    echo -n "    Time to First Byte: "
    if (( $(echo "$ttfb < 1.0" | bc -l 2>/dev/null || echo 0) )); then
        echo -e "${GREEN}${ttfb}s ✓${NC}"
    elif (( $(echo "$ttfb < 2.0" | bc -l 2>/dev/null || echo 0) )); then
        echo -e "${YELLOW}${ttfb}s (acceptable)${NC}"
    else
        echo -e "${RED}${ttfb}s (slow)${NC}"
    fi

    echo -n "    Total Load Time: "
    if (( $(echo "$total < 2.0" | bc -l 2>/dev/null || echo 0) )); then
        echo -e "${GREEN}${total}s ✓${NC}"
    elif (( $(echo "$total < 4.0" | bc -l 2>/dev/null || echo 0) )); then
        echo -e "${YELLOW}${total}s (acceptable)${NC}"
    else
        echo -e "${RED}${total}s (slow)${NC}"
        ALL_PASSED=false
    fi

    # Check page size
    local page_size=$(curl -s -L "$SITE_URL" --connect-timeout 10 2>/dev/null | wc -c)
    local page_size_kb=$((page_size / 1024))

    echo -n "    Page Size: "
    if [ $page_size_kb -lt 500 ]; then
        echo -e "${GREEN}${page_size_kb}KB ✓${NC}"
    elif [ $page_size_kb -lt 1000 ]; then
        echo -e "${YELLOW}${page_size_kb}KB (consider optimizing)${NC}"
    else
        echo -e "${RED}${page_size_kb}KB (too large)${NC}"
    fi

    echo ""

    # Run Lighthouse if available
    if command -v lighthouse &> /dev/null || command -v npx &> /dev/null; then
        echo "  Running Lighthouse audit (this may take a minute)..."

        local lighthouse_cmd="lighthouse"
        if ! command -v lighthouse &> /dev/null; then
            lighthouse_cmd="npx lighthouse"
        fi

        local report_file="$PROJECT_DIR/lighthouse-verify-$(date +%Y%m%d-%H%M%S).json"

        $lighthouse_cmd "$SITE_URL" \
            --output=json \
            --output-path="$report_file" \
            --chrome-flags="--headless --no-sandbox" \
            --quiet \
            --only-categories=performance 2>/dev/null

        if [ -f "$report_file" ]; then
            local perf=$(cat "$report_file" | grep -o '"performance":[0-9.]*' | head -1 | cut -d: -f2)
            local perf_pct=$(echo "$perf * 100" | bc 2>/dev/null | cut -d. -f1 || echo "N/A")

            echo -n "    Lighthouse Performance: "
            if [ "$perf_pct" != "N/A" ] && [ "$perf_pct" -ge 70 ]; then
                echo -e "${GREEN}${perf_pct}% ✓${NC}"
            elif [ "$perf_pct" != "N/A" ] && [ "$perf_pct" -ge 50 ]; then
                echo -e "${YELLOW}${perf_pct}% (needs improvement)${NC}"
            else
                echo -e "${RED}${perf_pct}% (poor)${NC}"
                ALL_PASSED=false
            fi

            echo "    Report: $report_file"
        fi
    else
        echo -e "  ${YELLOW}Lighthouse not available for detailed audit${NC}"
        echo "  Install with: npm install -g lighthouse"
    fi

    echo ""
}

# Security check - basic security headers
verify_security() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}Security Check${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    local headers=$(curl -sI -L "$SITE_URL" --connect-timeout 10 2>/dev/null)

    # Check for HTTPS
    echo -n "  HTTPS: "
    if [[ "$SITE_URL" == https://* ]]; then
        echo -e "${GREEN}✓ Enabled${NC}"
    else
        echo -e "${YELLOW}⚠ Not using HTTPS${NC}"
    fi

    # Check security headers
    echo -n "  X-Content-Type-Options: "
    if echo "$headers" | grep -qi "X-Content-Type-Options"; then
        echo -e "${GREEN}✓ Present${NC}"
    else
        echo -e "${YELLOW}⚠ Missing${NC}"
    fi

    echo -n "  X-Frame-Options: "
    if echo "$headers" | grep -qi "X-Frame-Options"; then
        echo -e "${GREEN}✓ Present${NC}"
    else
        echo -e "${YELLOW}⚠ Missing${NC}"
    fi

    echo -n "  WordPress Version Hidden: "
    local page_content=$(curl -s -L "$SITE_URL" --connect-timeout 10 2>/dev/null)
    if echo "$page_content" | grep -q "generator.*WordPress"; then
        echo -e "${YELLOW}⚠ Version exposed${NC}"
    else
        echo -e "${GREEN}✓ Hidden${NC}"
    fi

    echo ""
}

# Full verification
verify_all() {
    local start_time=$(date +%s)

    verify_smoke
    verify_files
    verify_performance
    verify_security

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}Verification Summary${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""

    if [ "$ALL_PASSED" = true ]; then
        echo -e "${GREEN}✓ All verifications passed!${NC}"
        echo ""
        echo "Site is deployed and functioning correctly."
    else
        echo -e "${YELLOW}⚠ Some verifications failed${NC}"
        echo ""
        echo "Review issues above and consider:"
        echo "  • Redeploying: wpf deploy production"
        echo "  • Running optimization: wpf optimize"
        echo "  • Running full tests: wpf test production"
    fi

    echo ""
    echo "Completed in ${duration}s"
}

# Execute based on target
case "$VERIFY_TARGET" in
    smoke)
        verify_smoke
        ;;
    files)
        verify_files
        ;;
    performance)
        verify_performance
        ;;
    security)
        verify_security
        ;;
    all)
        verify_all
        ;;
    *)
        echo -e "${RED}Unknown verify target: $VERIFY_TARGET${NC}"
        echo "Usage: wpf verify [smoke|files|performance|security|all]"
        exit 1
        ;;
esac
