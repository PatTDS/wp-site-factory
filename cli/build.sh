#!/bin/bash
#
# wpf build - Build and compile project assets
# Handles CSS compilation, image optimization, and critical CSS generation
#

BUILD_TARGET="${1:-all}"

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

THEME_DIR="$PROJECT_DIR/wp-content/themes/${PROJECT_NAME}-theme"
UPLOADS_DIR="$PROJECT_DIR/wp-content/uploads"

print_banner
echo -e "${GREEN}Building:${NC} $PROJECT_NAME"
echo ""

# Check dependencies
check_dependencies() {
    local missing=()

    command -v npm &> /dev/null || missing+=("npm")
    command -v node &> /dev/null || missing+=("node")

    if [ ${#missing[@]} -gt 0 ]; then
        echo -e "${RED}Missing dependencies: ${missing[*]}${NC}"
        echo "Please install Node.js and npm first."
        exit 1
    fi
}

# Build CSS with Tailwind
build_css() {
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}Building CSS${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    if [ ! -d "$THEME_DIR" ]; then
        echo -e "${RED}Theme directory not found: $THEME_DIR${NC}"
        return 1
    fi

    cd "$THEME_DIR"

    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "Installing npm dependencies..."
        npm install --silent
    fi

    # Check for Tailwind config
    if [ -f "tailwind.config.js" ]; then
        echo "Compiling Tailwind CSS..."
        npm run build 2>&1 || {
            echo -e "${YELLOW}npm run build failed, trying npx tailwindcss directly...${NC}"
            npx tailwindcss -i ./assets/css/input.css -o ./style.css --minify 2>&1
        }

        if [ -f "style.css" ]; then
            local size=$(wc -c < "style.css")
            echo -e "${GREEN}✓ CSS built: style.css (${size} bytes)${NC}"
        else
            echo -e "${RED}✗ CSS build failed${NC}"
            return 1
        fi
    else
        echo -e "${YELLOW}No tailwind.config.js found - skipping CSS build${NC}"
    fi

    cd "$PROJECT_DIR"
    return 0
}

# Optimize images
build_images() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}Optimizing Images${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    # Check for ImageMagick
    if ! command -v convert &> /dev/null; then
        echo -e "${YELLOW}ImageMagick not installed - skipping image optimization${NC}"
        echo "Install with: sudo apt-get install imagemagick"
        return 0
    fi

    local optimized=0
    local webp_created=0

    # Find images in theme and uploads
    local search_dirs=("$THEME_DIR/assets" "$UPLOADS_DIR")

    for dir in "${search_dirs[@]}"; do
        if [ -d "$dir" ]; then
            echo "Scanning: $dir"

            # Optimize JPEGs
            while IFS= read -r -d '' file; do
                local size_before=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")

                # Optimize (strip metadata, 85% quality)
                convert "$file" -strip -quality 85 "$file" 2>/dev/null

                local size_after=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")

                if [ "$size_after" -lt "$size_before" ]; then
                    local saved=$((size_before - size_after))
                    echo "  ✓ $(basename "$file"): saved ${saved} bytes"
                    ((optimized++))
                fi

                # Create WebP version
                if command -v cwebp &> /dev/null; then
                    local webp_file="${file%.*}.webp"
                    if [ ! -f "$webp_file" ]; then
                        cwebp -q 80 "$file" -o "$webp_file" 2>/dev/null
                        if [ -f "$webp_file" ]; then
                            ((webp_created++))
                        fi
                    fi
                fi
            done < <(find "$dir" -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) -print0 2>/dev/null)

            # Optimize PNGs
            while IFS= read -r -d '' file; do
                local size_before=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")

                convert "$file" -strip "$file" 2>/dev/null

                local size_after=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file")

                if [ "$size_after" -lt "$size_before" ]; then
                    ((optimized++))
                fi

                # Create WebP version
                if command -v cwebp &> /dev/null; then
                    local webp_file="${file%.*}.webp"
                    if [ ! -f "$webp_file" ]; then
                        cwebp -q 80 "$file" -o "$webp_file" 2>/dev/null
                        if [ -f "$webp_file" ]; then
                            ((webp_created++))
                        fi
                    fi
                fi
            done < <(find "$dir" -type f -iname "*.png" -print0 2>/dev/null)
        fi
    done

    echo ""
    echo -e "${GREEN}✓ Optimized: $optimized images${NC}"
    if [ $webp_created -gt 0 ]; then
        echo -e "${GREEN}✓ Created: $webp_created WebP versions${NC}"
    fi

    return 0
}

# Generate critical CSS
build_critical() {
    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}Generating Critical CSS${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

    # Check if site is accessible
    local site_url="http://localhost:8080"
    if [ -n "$DOMAIN" ]; then
        site_url="https://$DOMAIN"
    fi

    # Check if critical is installed
    if ! command -v npx &> /dev/null; then
        echo -e "${YELLOW}npx not available - skipping critical CSS${NC}"
        return 0
    fi

    # Test if site is accessible
    if ! curl -s -o /dev/null -w "%{http_code}" "$site_url" | grep -q "200\|302"; then
        echo -e "${YELLOW}Site not accessible at $site_url - skipping critical CSS${NC}"
        echo "Start Docker with: docker-compose up -d"
        return 0
    fi

    echo "Generating critical CSS for: $site_url"

    cd "$THEME_DIR"

    # Generate critical CSS
    npx critical "$site_url" \
        --base . \
        --inline false \
        --minify \
        --width 1920 \
        --height 1080 \
        > critical.css 2>/dev/null

    if [ -f "critical.css" ] && [ -s "critical.css" ]; then
        local size=$(wc -c < "critical.css")
        echo -e "${GREEN}✓ Critical CSS generated: critical.css (${size} bytes)${NC}"
    else
        echo -e "${YELLOW}⚠ Critical CSS generation failed (site may need to be running)${NC}"
        rm -f critical.css
    fi

    cd "$PROJECT_DIR"
    return 0
}

# Watch mode for development
build_watch() {
    echo -e "${CYAN}Starting watch mode...${NC}"
    echo "Press Ctrl+C to stop"
    echo ""

    cd "$THEME_DIR"

    if [ -f "package.json" ] && grep -q "watch" "package.json"; then
        npm run watch
    else
        echo "Running Tailwind in watch mode..."
        npx tailwindcss -i ./assets/css/input.css -o ./style.css --watch
    fi
}

# Main build orchestration
build_all() {
    local start_time=$(date +%s)

    build_css || echo -e "${YELLOW}CSS build had issues${NC}"
    build_images || echo -e "${YELLOW}Image optimization had issues${NC}"

    # Only try critical CSS if Docker is running
    if docker-compose ps 2>/dev/null | grep -q "Up"; then
        build_critical || echo -e "${YELLOW}Critical CSS had issues${NC}"
    fi

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    echo ""
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}✓ Build complete in ${duration}s${NC}"
    echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Check dependencies first
check_dependencies

# Execute based on target
case "$BUILD_TARGET" in
    css)
        build_css
        ;;
    images)
        build_images
        ;;
    critical)
        build_critical
        ;;
    watch)
        build_watch
        ;;
    all)
        build_all
        ;;
    *)
        echo -e "${RED}Unknown build target: $BUILD_TARGET${NC}"
        echo "Usage: wpf build [css|images|critical|watch|all]"
        exit 1
        ;;
esac
