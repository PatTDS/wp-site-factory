#!/bin/bash
#
# wpf create - Create a new WordPress project
#
# Auto-registers project in WPF registry upon creation
#

# Source registry library if not already loaded
if [ -z "$(type -t registry_add 2>/dev/null)" ]; then
    source "$WPF_ROOT/lib/registry.sh"
fi

# Ensure we have a project name
if [ -z "$1" ]; then
    echo -e "${RED}Error:${NC} Please provide a project name"
    echo "Usage: wpf create <project-name>"
    exit 1
fi

PROJECT_NAME="$1"
PROJECT_DIR="$PROJECTS_DIR/$PROJECT_NAME"

# Check if project already exists in directory
if [ -d "$PROJECT_DIR" ]; then
    echo -e "${YELLOW}Warning:${NC} Project '$PROJECT_NAME' already exists at $PROJECT_DIR"
    read -p "Do you want to continue working on it? (y/n): " continue_choice
    if [ "$continue_choice" = "y" ]; then
        source "$CLI_DIR/continue.sh" "$PROJECT_NAME"
        exit 0
    else
        exit 1
    fi
fi

# Check if project name already exists in registry
if registry_exists "$PROJECT_NAME"; then
    existing_path=$(registry_get_path "$PROJECT_NAME")
    echo -e "${YELLOW}Warning:${NC} Project '$PROJECT_NAME' already registered at $existing_path"
    read -p "Do you want to continue working on it? (y/n): " continue_choice
    if [ "$continue_choice" = "y" ]; then
        source "$CLI_DIR/continue.sh" "$PROJECT_NAME"
        exit 0
    else
        exit 1
    fi
fi

print_banner
echo -e "${GREEN}Creating new project:${NC} $PROJECT_NAME"
echo ""

# Create project directory
mkdir -p "$PROJECT_DIR"

# Create project config file to store answers
CONFIG_FILE="$PROJECT_DIR/.wpf-config"
touch "$CONFIG_FILE"

echo "# WPF Project Configuration" > "$CONFIG_FILE"
echo "# Generated: $(date)" >> "$CONFIG_FILE"
echo "PROJECT_NAME=$PROJECT_NAME" >> "$CONFIG_FILE"

# =====================================================
# PHASE 1: Company Basics
# =====================================================
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}PHASE 1: Company Basics${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "Company Name: " COMPANY_NAME
read -p "Industry/Sector: " INDUSTRY
read -p "Domain Name (e.g., example.com): " DOMAIN
read -p "City: " CITY
read -p "State/Province: " STATE
read -p "Country: " COUNTRY
read -p "Phone Number: " PHONE
read -p "Email Address: " EMAIL
read -p "Street Address: " ADDRESS
read -p "Business Hours (e.g., Mon-Fri 08:00-18:00): " HOURS

echo "" >> "$CONFIG_FILE"
echo "# Company Basics" >> "$CONFIG_FILE"
echo "COMPANY_NAME=\"$COMPANY_NAME\"" >> "$CONFIG_FILE"
echo "INDUSTRY=\"$INDUSTRY\"" >> "$CONFIG_FILE"
echo "DOMAIN=\"$DOMAIN\"" >> "$CONFIG_FILE"
echo "CITY=\"$CITY\"" >> "$CONFIG_FILE"
echo "STATE=\"$STATE\"" >> "$CONFIG_FILE"
echo "COUNTRY=\"$COUNTRY\"" >> "$CONFIG_FILE"
echo "PHONE=\"$PHONE\"" >> "$CONFIG_FILE"
echo "EMAIL=\"$EMAIL\"" >> "$CONFIG_FILE"
echo "ADDRESS=\"$ADDRESS\"" >> "$CONFIG_FILE"
echo "HOURS=\"$HOURS\"" >> "$CONFIG_FILE"

# =====================================================
# PHASE 2: Brand Identity
# =====================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}PHASE 2: Brand Identity${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "Primary Brand Color (hex, e.g., #16a34a): " PRIMARY_COLOR
read -p "Secondary Brand Color (hex, e.g., #0f766e): " SECONDARY_COLOR
read -p "Logo File Path (or press Enter to skip): " LOGO_PATH
echo "Tone of Voice Options: 1=Professional 2=Friendly 3=Technical 4=Casual"
read -p "Tone of Voice (1-4): " TONE_CHOICE

case $TONE_CHOICE in
    1) TONE="professional" ;;
    2) TONE="friendly" ;;
    3) TONE="technical" ;;
    4) TONE="casual" ;;
    *) TONE="professional" ;;
esac

echo "" >> "$CONFIG_FILE"
echo "# Brand Identity" >> "$CONFIG_FILE"
echo "PRIMARY_COLOR=\"$PRIMARY_COLOR\"" >> "$CONFIG_FILE"
echo "SECONDARY_COLOR=\"$SECONDARY_COLOR\"" >> "$CONFIG_FILE"
echo "LOGO_PATH=\"$LOGO_PATH\"" >> "$CONFIG_FILE"
echo "TONE=\"$TONE\"" >> "$CONFIG_FILE"

# =====================================================
# PHASE 3: Services/Products
# =====================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}PHASE 3: Services/Products${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Enter services/products (one per line, empty line to finish):"
SERVICES=""
while true; do
    read -p "> " service
    [ -z "$service" ] && break
    SERVICES="$SERVICES|$service"
done

read -p "Unique Selling Proposition (what makes you different): " USP
read -p "Target Audience (who are your customers): " TARGET_AUDIENCE

echo "" >> "$CONFIG_FILE"
echo "# Services" >> "$CONFIG_FILE"
echo "SERVICES=\"$SERVICES\"" >> "$CONFIG_FILE"
echo "USP=\"$USP\"" >> "$CONFIG_FILE"
echo "TARGET_AUDIENCE=\"$TARGET_AUDIENCE\"" >> "$CONFIG_FILE"

# =====================================================
# PHASE 4: Features Needed
# =====================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}PHASE 4: Features${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

read -p "Contact Form? (y/n): " HAS_CONTACT_FORM
read -p "Newsletter Signup? (y/n): " HAS_NEWSLETTER
read -p "Blog Section? (y/n): " HAS_BLOG
read -p "Portfolio/Projects? (y/n): " HAS_PORTFOLIO
read -p "Team Members Page? (y/n): " HAS_TEAM
read -p "Testimonials? (y/n): " HAS_TESTIMONIALS
read -p "Google Maps? (y/n): " HAS_MAPS
read -p "Social Media Links? (y/n): " HAS_SOCIAL

echo "" >> "$CONFIG_FILE"
echo "# Features" >> "$CONFIG_FILE"
echo "HAS_CONTACT_FORM=\"$HAS_CONTACT_FORM\"" >> "$CONFIG_FILE"
echo "HAS_NEWSLETTER=\"$HAS_NEWSLETTER\"" >> "$CONFIG_FILE"
echo "HAS_BLOG=\"$HAS_BLOG\"" >> "$CONFIG_FILE"
echo "HAS_PORTFOLIO=\"$HAS_PORTFOLIO\"" >> "$CONFIG_FILE"
echo "HAS_TEAM=\"$HAS_TEAM\"" >> "$CONFIG_FILE"
echo "HAS_TESTIMONIALS=\"$HAS_TESTIMONIALS\"" >> "$CONFIG_FILE"
echo "HAS_MAPS=\"$HAS_MAPS\"" >> "$CONFIG_FILE"
echo "HAS_SOCIAL=\"$HAS_SOCIAL\"" >> "$CONFIG_FILE"

# =====================================================
# PHASE 5: Technical Setup
# =====================================================
echo ""
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${CYAN}PHASE 5: Technical Setup${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "Hosting Provider Options:"
echo "  1. Locaweb (Brazil)"
echo "  2. HostGator"
echo "  3. GoDaddy"
echo "  4. AWS/Lightsail"
echo "  5. DigitalOcean"
echo "  6. Other"
read -p "Hosting Provider (1-6): " HOSTING_CHOICE

case $HOSTING_CHOICE in
    1) HOSTING="locaweb" ;;
    2) HOSTING="hostgator" ;;
    3) HOSTING="godaddy" ;;
    4) HOSTING="aws" ;;
    5) HOSTING="digitalocean" ;;
    *) read -p "Enter hosting provider name: " HOSTING ;;
esac

read -p "FTP/SFTP Host (if known, or press Enter): " FTP_HOST
read -p "FTP/SFTP Username (if known, or press Enter): " FTP_USER

echo "" >> "$CONFIG_FILE"
echo "# Technical" >> "$CONFIG_FILE"
echo "HOSTING=\"$HOSTING\"" >> "$CONFIG_FILE"
echo "FTP_HOST=\"$FTP_HOST\"" >> "$CONFIG_FILE"
echo "FTP_USER=\"$FTP_USER\"" >> "$CONFIG_FILE"

# =====================================================
# CREATE PROJECT STRUCTURE
# =====================================================
echo ""
echo -e "${GREEN}Creating project structure...${NC}"

# Copy templates
cp -r "$WPF_ROOT/templates/docker/"* "$PROJECT_DIR/" 2>/dev/null || true
mkdir -p "$PROJECT_DIR/wp-content/themes/${PROJECT_NAME}-theme"
mkdir -p "$PROJECT_DIR/wp-content/plugins/${PROJECT_NAME}-plugin"
mkdir -p "$PROJECT_DIR/scripts"
mkdir -p "$PROJECT_DIR/tests"
mkdir -p "$PROJECT_DIR/docs"
mkdir -p "$PROJECT_DIR/assets"

# Copy theme template if exists
if [ -d "$WPF_ROOT/templates/theme" ]; then
    cp -r "$WPF_ROOT/templates/theme/"* "$PROJECT_DIR/wp-content/themes/${PROJECT_NAME}-theme/" 2>/dev/null || true
fi

# Copy plugin template if exists
if [ -d "$WPF_ROOT/templates/plugin" ]; then
    cp -r "$WPF_ROOT/templates/plugin/"* "$PROJECT_DIR/wp-content/plugins/${PROJECT_NAME}-plugin/" 2>/dev/null || true
fi

# Copy scripts
if [ -d "$WPF_ROOT/templates/scripts" ]; then
    cp -r "$WPF_ROOT/templates/scripts/"* "$PROJECT_DIR/scripts/" 2>/dev/null || true
fi

# Copy tests
if [ -d "$WPF_ROOT/templates/tests" ]; then
    cp -r "$WPF_ROOT/templates/tests/"* "$PROJECT_DIR/tests/" 2>/dev/null || true
fi

# Create PROJECT_CONTEXT.md
cat > "$PROJECT_DIR/PROJECT_CONTEXT.md" << CONTEXT
# $COMPANY_NAME Website Project

## TL;DR
WordPress website for $COMPANY_NAME ($INDUSTRY sector) at $DOMAIN.
Location: $CITY, $STATE, $COUNTRY

## Project Details
- **Company**: $COMPANY_NAME
- **Industry**: $INDUSTRY
- **Domain**: $DOMAIN
- **Primary Color**: $PRIMARY_COLOR
- **Secondary Color**: $SECONDARY_COLOR
- **Tone**: $TONE

## Contact Information
- **Phone**: $PHONE
- **Email**: $EMAIL
- **Address**: $ADDRESS
- **Hours**: $HOURS

## Services
$(echo "$SERVICES" | tr '|' '\n' | grep -v '^$' | sed 's/^/- /')

## Unique Selling Proposition
$USP

## Target Audience
$TARGET_AUDIENCE

## Features Required
- Contact Form: $HAS_CONTACT_FORM
- Newsletter: $HAS_NEWSLETTER
- Blog: $HAS_BLOG
- Portfolio: $HAS_PORTFOLIO
- Team Page: $HAS_TEAM
- Testimonials: $HAS_TESTIMONIALS
- Google Maps: $HAS_MAPS
- Social Media: $HAS_SOCIAL

## Technical Details
- **Hosting**: $HOSTING
- **FTP Host**: $FTP_HOST

## Project Structure
\`\`\`
$PROJECT_NAME/
├── wp-content/
│   ├── themes/${PROJECT_NAME}-theme/
│   └── plugins/${PROJECT_NAME}-plugin/
├── scripts/
├── tests/
├── docs/
└── docker-compose.yml
\`\`\`

## Next Steps
1. Run \`docker-compose up -d\` to start development environment
2. Activate theme: \`wp theme activate ${PROJECT_NAME}-theme\`
3. Configure plugins (Rank Math, Autoptimize, ShortPixel)
4. Create content pages
5. Test and optimize
6. Deploy to staging
7. Final review and production deployment

---
*Generated by WPF on $(date)*
CONTEXT

# Create docker-compose.yml from template
cat > "$PROJECT_DIR/docker-compose.yml" << DOCKER
version: '3.8'

services:
  wordpress:
    image: wordpress:6.7-php8.2-apache
    container_name: ${PROJECT_NAME}_wordpress
    restart: unless-stopped
    ports:
      - "8080:80"
    environment:
      WORDPRESS_DB_HOST: db
      WORDPRESS_DB_USER: wordpress
      WORDPRESS_DB_PASSWORD: wordpress
      WORDPRESS_DB_NAME: wordpress
      WORDPRESS_DEBUG: 1
    volumes:
      - wordpress_data:/var/www/html
      - ./wp-content/themes:/var/www/html/wp-content/themes
      - ./wp-content/plugins:/var/www/html/wp-content/plugins
    depends_on:
      - db
    networks:
      - ${PROJECT_NAME}_network

  db:
    image: mysql:8.0
    container_name: ${PROJECT_NAME}_db
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: wordpress
      MYSQL_USER: wordpress
      MYSQL_PASSWORD: wordpress
      MYSQL_ROOT_PASSWORD: rootpassword
    volumes:
      - db_data:/var/lib/mysql
    networks:
      - ${PROJECT_NAME}_network

  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    container_name: ${PROJECT_NAME}_phpmyadmin
    restart: unless-stopped
    ports:
      - "8081:80"
    environment:
      PMA_HOST: db
    depends_on:
      - db
    networks:
      - ${PROJECT_NAME}_network

volumes:
  wordpress_data:
  db_data:

networks:
  ${PROJECT_NAME}_network:
    driver: bridge
DOCKER

# Initialize git
cd "$PROJECT_DIR"
git init -q
echo "node_modules/" > .gitignore
echo "*.log" >> .gitignore
echo ".env" >> .gitignore

# Create README
cat > "$PROJECT_DIR/README.md" << README
# $COMPANY_NAME Website

WordPress website for $COMPANY_NAME.

## Quick Start

\`\`\`bash
# Start development environment
docker-compose up -d

# Access site
open http://localhost:8080

# Access database admin
open http://localhost:8081
\`\`\`

## Documentation
See [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) for full project details.

---
*Created with WPF (WordPress Site Factory)*
README

# =====================================================
# REGISTER PROJECT
# =====================================================
echo ""
echo -e "${GREEN}Registering project in WPF...${NC}"
registry_add "$PROJECT_NAME" "$PROJECT_DIR" "$COMPANY_NAME" "$DOMAIN"

echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✓ Project '$PROJECT_NAME' created and registered!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "Project Location: ${BLUE}$PROJECT_DIR${NC}"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo "  1. cd $PROJECT_DIR"
echo "  2. docker-compose up -d"
echo "  3. Open http://localhost:8080"
echo "  4. Complete WordPress installation"
echo ""
echo -e "Or use: ${CYAN}wpf continue $PROJECT_NAME${NC}"
