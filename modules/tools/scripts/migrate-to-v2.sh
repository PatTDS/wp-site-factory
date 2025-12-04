#!/bin/bash
#
# WPF v1 to v2 Migration Script
#
# Migrates existing WPF projects to the new TypeScript-based v2 system
#

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
WPF_ROOT="$(dirname "$SCRIPT_DIR")"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║          WPF v1 → v2 Migration Tool                       ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if running from WPF root
if [[ ! -f "$WPF_ROOT/package.json" ]]; then
    echo -e "${RED}Error: Run this script from WPF root directory${NC}"
    exit 1
fi

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is required. Install Node.js 18+${NC}"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [[ "$NODE_VERSION" -lt 18 ]]; then
    echo -e "${YELLOW}Warning: Node.js 18+ recommended (found v$(node -v))${NC}"
fi

# Step 1: Install dependencies
echo -e "\n${CYAN}[1/5] Installing dependencies...${NC}"
if [[ ! -d "$WPF_ROOT/node_modules" ]]; then
    cd "$WPF_ROOT"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
else
    echo -e "${GREEN}✓ Dependencies already installed${NC}"
fi

# Step 2: Build TypeScript
echo -e "\n${CYAN}[2/5] Building TypeScript...${NC}"
cd "$WPF_ROOT"
npm run build
echo -e "${GREEN}✓ TypeScript compiled${NC}"

# Step 3: Check for existing projects
echo -e "\n${CYAN}[3/5] Scanning for v1 projects...${NC}"

V1_REGISTRY="$WPF_ROOT/.wpf-registry.json"
PROJECTS_DIR="$WPF_ROOT/projects"
MIGRATED=0

if [[ -f "$V1_REGISTRY" ]]; then
    echo "Found v1 registry at $V1_REGISTRY"

    # Parse registry and migrate each project
    if command -v jq &> /dev/null; then
        PROJECT_NAMES=$(jq -r 'keys[]' "$V1_REGISTRY" 2>/dev/null || echo "")

        for PROJECT in $PROJECT_NAMES; do
            PROJECT_PATH=$(jq -r ".[\"$PROJECT\"].path" "$V1_REGISTRY" 2>/dev/null)

            if [[ -d "$PROJECT_PATH" ]]; then
                echo -e "  Found project: ${YELLOW}$PROJECT${NC} at $PROJECT_PATH"

                # Check for v1 config (.wpf-config)
                V1_CONFIG="$PROJECT_PATH/.wpf-config"
                V2_CONFIG="$PROJECT_PATH/wpf-config.yaml"

                if [[ -f "$V1_CONFIG" ]] && [[ ! -f "$V2_CONFIG" ]]; then
                    echo -e "    ${YELLOW}→ Migrating config...${NC}"

                    # Read v1 config (bash format)
                    source "$V1_CONFIG"

                    # Generate v2 config (YAML)
                    cat > "$V2_CONFIG" << EOF
# Migrated from WPF v1
# Review and update this configuration

project:
  name: ${PROJECT_NAME:-$PROJECT}
  version: "1.0.0"

company:
  name: "${COMPANY_NAME:-Unknown}"
  tagline: "${TAGLINE:-}"
  industry: ${INDUSTRY:-other}

contact:
  email: "${EMAIL:-info@example.com}"
  phone: "${PHONE:-}"
  address:
    street: "${ADDRESS:-}"
    city: "${CITY:-Unknown}"
    state: "${STATE:-}"
    postal_code: "${POSTAL_CODE:-}"
    country: "${COUNTRY:-US}"

branding:
  primary_color: "${PRIMARY_COLOR:-#16a34a}"
  secondary_color: "${SECONDARY_COLOR:-#15803d}"
  font_family: "${FONT_FAMILY:-Inter}"

pages:
  - slug: home
    title: Home
    template: front-page

menu:
  primary: []

compliance:
  level: standard
EOF
                    echo -e "    ${GREEN}✓ Created wpf-config.yaml${NC}"
                    ((MIGRATED++))
                elif [[ -f "$V2_CONFIG" ]]; then
                    echo -e "    ${GREEN}✓ Already has wpf-config.yaml${NC}"
                else
                    echo -e "    ${YELLOW}! No v1 config found, skipping${NC}"
                fi
            fi
        done
    else
        echo -e "${YELLOW}Warning: jq not installed, cannot parse registry${NC}"
        echo "Install jq: sudo apt install jq"
    fi
else
    echo "No v1 registry found"
fi

# Step 4: Check projects directory
if [[ -d "$PROJECTS_DIR" ]]; then
    for PROJECT_PATH in "$PROJECTS_DIR"/*/; do
        if [[ -d "$PROJECT_PATH" ]]; then
            PROJECT=$(basename "$PROJECT_PATH")
            V2_CONFIG="$PROJECT_PATH/wpf-config.yaml"

            if [[ ! -f "$V2_CONFIG" ]]; then
                echo -e "  ${YELLOW}$PROJECT${NC}: Missing wpf-config.yaml"
                echo -e "    Run: ${CYAN}wpf discover${NC} in project directory"
            fi
        fi
    done
fi

echo -e "${GREEN}✓ Migration scan complete ($MIGRATED configs migrated)${NC}"

# Step 5: Update PATH
echo -e "\n${CYAN}[4/5] Setting up CLI...${NC}"

BIN_PATH="$WPF_ROOT/bin"
SHELL_RC=""

if [[ -f "$HOME/.bashrc" ]]; then
    SHELL_RC="$HOME/.bashrc"
elif [[ -f "$HOME/.zshrc" ]]; then
    SHELL_RC="$HOME/.zshrc"
fi

if [[ -n "$SHELL_RC" ]]; then
    if ! grep -q "wpf-site-factory/bin" "$SHELL_RC" 2>/dev/null; then
        echo "" >> "$SHELL_RC"
        echo "# WPF v2 CLI" >> "$SHELL_RC"
        echo "export PATH=\"\$PATH:$BIN_PATH\"" >> "$SHELL_RC"
        echo -e "${GREEN}✓ Added to PATH in $SHELL_RC${NC}"
        echo -e "${YELLOW}  Run: source $SHELL_RC${NC}"
    else
        echo -e "${GREEN}✓ Already in PATH${NC}"
    fi
fi

# Step 6: Verify installation
echo -e "\n${CYAN}[5/5] Verifying installation...${NC}"

cd "$WPF_ROOT"
if ./bin/wpf-ts doctor 2>/dev/null; then
    echo -e "${GREEN}✓ WPF v2 is ready${NC}"
else
    echo -e "${YELLOW}! Some issues detected. Run: wpf doctor --fix${NC}"
fi

# Summary
echo -e "\n${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Migration complete!${NC}"
echo ""
echo "Next steps:"
echo -e "  1. ${CYAN}source ~/.bashrc${NC} (or ~/.zshrc)"
echo -e "  2. ${CYAN}wpf doctor${NC} - Verify environment"
echo -e "  3. ${CYAN}wpf discover${NC} - Create new project config"
echo -e "  4. ${CYAN}wpf build <project>${NC} - Build a site"
echo ""
echo "Documentation:"
echo -e "  ${CYAN}examples/minimal.wpf-config.yaml${NC} - Minimal config"
echo -e "  ${CYAN}examples/full.wpf-config.yaml${NC} - Full options"
echo ""
