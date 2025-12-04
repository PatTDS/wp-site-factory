#!/bin/bash
#
# wpf doctor - Health check for project
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
echo -e "${GREEN}Health check for:${NC} $PROJECT_NAME"
echo ""

ISSUES=0

# =====================================================
# Check 1: Docker
# =====================================================
echo -e "${CYAN}━━━ Docker Environment ━━━${NC}"

if [ -f "$PROJECT_DIR/docker-compose.yml" ]; then
    echo -e "${GREEN}✓${NC} docker-compose.yml exists"

    cd "$PROJECT_DIR"
    RUNNING=$(docker-compose ps --services --filter "status=running" 2>/dev/null | wc -l)

    if [ "$RUNNING" -gt 0 ]; then
        echo -e "${GREEN}✓${NC} Containers running: $RUNNING"
        docker-compose ps --format "table {{.Name}}\t{{.Status}}" 2>/dev/null | head -10
    else
        echo -e "${YELLOW}⚠${NC} No containers running"
        ((ISSUES++))
    fi
else
    echo -e "${RED}✗${NC} docker-compose.yml missing"
    ((ISSUES++))
fi
echo ""

# =====================================================
# Check 2: Theme
# =====================================================
echo -e "${CYAN}━━━ Theme ━━━${NC}"

THEME_DIR="$PROJECT_DIR/wp-content/themes/${PROJECT_NAME}-theme"
if [ -d "$THEME_DIR" ]; then
    echo -e "${GREEN}✓${NC} Theme directory exists"

    if [ -f "$THEME_DIR/style.css" ]; then
        echo -e "${GREEN}✓${NC} style.css exists"
    else
        echo -e "${YELLOW}⚠${NC} style.css missing"
        ((ISSUES++))
    fi

    if [ -f "$THEME_DIR/functions.php" ]; then
        echo -e "${GREEN}✓${NC} functions.php exists"
    else
        echo -e "${YELLOW}⚠${NC} functions.php missing"
        ((ISSUES++))
    fi

    if [ -f "$THEME_DIR/index.php" ]; then
        echo -e "${GREEN}✓${NC} index.php exists"
    else
        echo -e "${RED}✗${NC} index.php missing (required)"
        ((ISSUES++))
    fi
else
    echo -e "${RED}✗${NC} Theme directory missing"
    ((ISSUES++))
fi
echo ""

# =====================================================
# Check 3: Plugin
# =====================================================
echo -e "${CYAN}━━━ Plugin ━━━${NC}"

PLUGIN_DIR="$PROJECT_DIR/wp-content/plugins/${PROJECT_NAME}-plugin"
if [ -d "$PLUGIN_DIR" ]; then
    echo -e "${GREEN}✓${NC} Plugin directory exists"

    MAIN_FILE=$(find "$PLUGIN_DIR" -maxdepth 1 -name "*.php" | head -1)
    if [ -n "$MAIN_FILE" ]; then
        echo -e "${GREEN}✓${NC} Main plugin file exists"
    else
        echo -e "${YELLOW}⚠${NC} Main plugin file missing"
    fi
else
    echo -e "${YELLOW}⚠${NC} Plugin directory not created (optional)"
fi
echo ""

# =====================================================
# Check 4: Configuration
# =====================================================
echo -e "${CYAN}━━━ Configuration ━━━${NC}"

if [ -f "$PROJECT_DIR/.wpf-config" ]; then
    echo -e "${GREEN}✓${NC} WPF config exists"

    # Check required fields
    if [ -n "$COMPANY_NAME" ]; then
        echo -e "${GREEN}✓${NC} Company name: $COMPANY_NAME"
    else
        echo -e "${YELLOW}⚠${NC} Company name not set"
    fi

    if [ -n "$DOMAIN" ]; then
        echo -e "${GREEN}✓${NC} Domain: $DOMAIN"
    else
        echo -e "${YELLOW}⚠${NC} Domain not set"
    fi

    if [ -n "$FTP_HOST" ]; then
        echo -e "${GREEN}✓${NC} Deployment credentials configured"
    else
        echo -e "${YELLOW}⚠${NC} Deployment credentials not set"
    fi
else
    echo -e "${RED}✗${NC} WPF config missing"
    ((ISSUES++))
fi
echo ""

# =====================================================
# Check 5: Project Files
# =====================================================
echo -e "${CYAN}━━━ Project Files ━━━${NC}"

if [ -f "$PROJECT_DIR/PROJECT_CONTEXT.md" ]; then
    echo -e "${GREEN}✓${NC} PROJECT_CONTEXT.md exists"
else
    echo -e "${YELLOW}⚠${NC} PROJECT_CONTEXT.md missing"
fi

if [ -f "$PROJECT_DIR/README.md" ]; then
    echo -e "${GREEN}✓${NC} README.md exists"
else
    echo -e "${YELLOW}⚠${NC} README.md missing"
fi

if [ -d "$PROJECT_DIR/.git" ]; then
    echo -e "${GREEN}✓${NC} Git repository initialized"
else
    echo -e "${YELLOW}⚠${NC} Git not initialized"
fi
echo ""

# =====================================================
# Check 6: Disk Space
# =====================================================
echo -e "${CYAN}━━━ Disk Space ━━━${NC}"

PROJECT_SIZE=$(du -sh "$PROJECT_DIR" 2>/dev/null | cut -f1)
echo "Project size: $PROJECT_SIZE"

DISK_FREE=$(df -h "$PROJECT_DIR" 2>/dev/null | tail -1 | awk '{print $4}')
echo "Free disk space: $DISK_FREE"
echo ""

# =====================================================
# Summary
# =====================================================
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Project is healthy.${NC}"
else
    echo -e "${YELLOW}⚠ Found $ISSUES issue(s) to address${NC}"
fi
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
