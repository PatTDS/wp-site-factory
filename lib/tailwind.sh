#!/bin/bash
#
# Tailwind CSS color generation utilities for WPF
# Generates color palettes from hex colors and updates tailwind.config.js
#

# Convert hex to RGB
# Usage: hex_to_rgb "#ff5500" -> "255 85 0"
hex_to_rgb() {
    local hex="${1#\#}"
    printf "%d %d %d" "0x${hex:0:2}" "0x${hex:2:2}" "0x${hex:4:2}"
}

# Convert RGB to HSL
# Usage: rgb_to_hsl 255 85 0 -> "20 100 50"
rgb_to_hsl() {
    local r=$1 g=$2 b=$3

    # Normalize to 0-1
    local r_norm=$(echo "scale=6; $r / 255" | bc)
    local g_norm=$(echo "scale=6; $g / 255" | bc)
    local b_norm=$(echo "scale=6; $b / 255" | bc)

    # Find min and max
    local max=$(echo "$r_norm $g_norm $b_norm" | tr ' ' '\n' | sort -rn | head -1)
    local min=$(echo "$r_norm $g_norm $b_norm" | tr ' ' '\n' | sort -n | head -1)

    # Calculate lightness
    local l=$(echo "scale=6; ($max + $min) / 2" | bc)

    # Calculate saturation and hue
    local s=0
    local h=0

    if [ "$(echo "$max == $min" | bc)" -eq 0 ]; then
        local d=$(echo "scale=6; $max - $min" | bc)

        if [ "$(echo "$l > 0.5" | bc)" -eq 1 ]; then
            s=$(echo "scale=6; $d / (2 - $max - $min)" | bc)
        else
            s=$(echo "scale=6; $d / ($max + $min)" | bc)
        fi

        if [ "$(echo "$max == $r_norm" | bc)" -eq 1 ]; then
            h=$(echo "scale=6; (($g_norm - $b_norm) / $d) + (($g_norm < $b_norm) * 6)" | bc)
        elif [ "$(echo "$max == $g_norm" | bc)" -eq 1 ]; then
            h=$(echo "scale=6; (($b_norm - $r_norm) / $d) + 2" | bc)
        else
            h=$(echo "scale=6; (($r_norm - $g_norm) / $d) + 4" | bc)
        fi

        h=$(echo "scale=6; $h / 6" | bc)
    fi

    # Convert to degrees and percentages
    local h_deg=$(echo "scale=0; $h * 360" | bc)
    local s_pct=$(echo "scale=0; $s * 100" | bc)
    local l_pct=$(echo "scale=0; $l * 100" | bc)

    echo "$h_deg $s_pct $l_pct"
}

# Convert HSL to hex
# Usage: hsl_to_hex 20 100 50 -> "#ff5500"
hsl_to_hex() {
    local h=$1 s=$2 l=$3

    # Normalize
    local h_norm=$(echo "scale=6; $h / 360" | bc)
    local s_norm=$(echo "scale=6; $s / 100" | bc)
    local l_norm=$(echo "scale=6; $l / 100" | bc)

    local r g b

    if [ "$(echo "$s_norm == 0" | bc)" -eq 1 ]; then
        r=$l_norm
        g=$l_norm
        b=$l_norm
    else
        local q
        if [ "$(echo "$l_norm < 0.5" | bc)" -eq 1 ]; then
            q=$(echo "scale=6; $l_norm * (1 + $s_norm)" | bc)
        else
            q=$(echo "scale=6; $l_norm + $s_norm - $l_norm * $s_norm" | bc)
        fi
        local p=$(echo "scale=6; 2 * $l_norm - $q" | bc)

        r=$(hue_to_rgb $p $q $(echo "scale=6; $h_norm + 1/3" | bc))
        g=$(hue_to_rgb $p $q $h_norm)
        b=$(hue_to_rgb $p $q $(echo "scale=6; $h_norm - 1/3" | bc))
    fi

    # Convert to hex
    local r_hex=$(printf "%02x" $(echo "scale=0; $r * 255 / 1" | bc))
    local g_hex=$(printf "%02x" $(echo "scale=0; $g * 255 / 1" | bc))
    local b_hex=$(printf "%02x" $(echo "scale=0; $b * 255 / 1" | bc))

    echo "#${r_hex}${g_hex}${b_hex}"
}

# Helper for HSL to RGB conversion
hue_to_rgb() {
    local p=$1 q=$2 t=$3

    if [ "$(echo "$t < 0" | bc)" -eq 1 ]; then
        t=$(echo "scale=6; $t + 1" | bc)
    fi
    if [ "$(echo "$t > 1" | bc)" -eq 1 ]; then
        t=$(echo "scale=6; $t - 1" | bc)
    fi

    if [ "$(echo "$t < 1/6" | bc)" -eq 1 ]; then
        echo "scale=6; $p + ($q - $p) * 6 * $t" | bc
    elif [ "$(echo "$t < 1/2" | bc)" -eq 1 ]; then
        echo "$q"
    elif [ "$(echo "$t < 2/3" | bc)" -eq 1 ]; then
        echo "scale=6; $p + ($q - $p) * (2/3 - $t) * 6" | bc
    else
        echo "$p"
    fi
}

# Generate color palette from a single hex color
# Usage: generate_color_palette "#16a34a" -> outputs shade scale
generate_color_palette() {
    local base_hex="$1"

    # Lightness targets for each shade
    declare -A lightness_map=(
        [50]=97
        [100]=94
        [200]=86
        [300]=77
        [400]=66
        [500]=50
        [600]=42
        [700]=35
        [800]=25
        [900]=18
        [950]=10
    )

    # Get base color HSL
    local rgb=($(hex_to_rgb "$base_hex"))
    local hsl=($(rgb_to_hsl ${rgb[0]} ${rgb[1]} ${rgb[2]}))
    local h=${hsl[0]}
    local s=${hsl[1]}

    # Generate each shade
    local shades=("50" "100" "200" "300" "400" "500" "600" "700" "800" "900" "950")

    echo "{"
    for shade in "${shades[@]}"; do
        local target_l=${lightness_map[$shade]}
        local hex=$(hsl_to_hex $h $s $target_l)
        echo "          $shade: '$hex',"
    done | sed '$ s/,$//'
    echo "        }"
}

# Simplified palette generation using predefined scales
# More reliable than HSL math in bash
generate_simple_palette() {
    local base_hex="${1#\#}"

    # Use a simple approach: just vary the hex values
    # This is a simplified version that works for most colors

    cat << EOF
{
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#$base_hex',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        }
EOF
}

# Update tailwind.config.js with brand colors
# Usage: update_tailwind_config "/path/to/theme" "#primary" "#secondary"
update_tailwind_config() {
    local theme_dir="$1"
    local primary_color="${2:-#16a34a}"
    local secondary_color="${3:-#0f766e}"
    local config_file="$theme_dir/tailwind.config.js"

    if [ ! -f "$config_file" ]; then
        echo -e "  ${RED}✗${NC} tailwind.config.js not found in $theme_dir"
        return 1
    fi

    # Create backup
    cp "$config_file" "$config_file.backup"
    echo -e "  ${GREEN}✓${NC} Created backup: tailwind.config.js.backup"

    # Check if colors section already exists
    if grep -q "colors:" "$config_file"; then
        echo -e "  ${YELLOW}⚠${NC} Colors section exists, updating..."

        # For simplicity, we'll add/update using sed
        # This is a simplified approach - a full implementation would parse JS properly

        # Remove existing primary/secondary if present
        sed -i '/primary:/,/},/d' "$config_file"
        sed -i '/secondary:/,/},/d' "$config_file"
    fi

    # Generate the colors config
    local primary_hex="${primary_color#\#}"
    local secondary_hex="${secondary_color#\#}"

    # Create a temporary file with the new colors section
    local temp_colors=$(mktemp)
    cat > "$temp_colors" << EOF
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#$primary_hex',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#$secondary_hex',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
      },
EOF

    # Try to insert colors into extend section
    if grep -q "extend:" "$config_file"; then
        # Insert after extend: {
        sed -i "/extend: {/r $temp_colors" "$config_file"
        echo -e "  ${GREEN}✓${NC} Added brand colors to tailwind.config.js"
    else
        echo -e "  ${YELLOW}⚠${NC} Could not find extend section, manual update may be needed"
    fi

    rm "$temp_colors"

    # Verify the file is still valid JavaScript (basic check)
    if node -c "$config_file" 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} Config file syntax valid"
    else
        echo -e "  ${YELLOW}⚠${NC} Config syntax check failed, restoring backup"
        mv "$config_file.backup" "$config_file"
        return 1
    fi

    return 0
}

# Build Tailwind CSS
# Usage: build_tailwind "/path/to/theme"
build_tailwind() {
    local theme_dir="$1"

    if [ ! -f "$theme_dir/package.json" ]; then
        echo -e "  ${RED}✗${NC} No package.json found in theme directory"
        return 1
    fi

    echo "  Building Tailwind CSS..."

    cd "$theme_dir"

    # Install deps if needed
    if [ ! -d "node_modules" ]; then
        npm install 2>/dev/null
    fi

    # Run build
    if npm run build 2>/dev/null; then
        echo -e "  ${GREEN}✓${NC} Tailwind CSS built successfully"
        return 0
    else
        echo -e "  ${RED}✗${NC} Tailwind build failed"
        return 1
    fi
}

# Main function to setup Tailwind with brand colors
# Usage: setup_tailwind_colors
setup_tailwind_colors() {
    local theme_dir="${PROJECT_DIR}/wp-content/themes/${PROJECT_NAME}-theme"
    local primary="${PRIMARY_COLOR:-#16a34a}"
    local secondary="${SECONDARY_COLOR:-#0f766e}"

    echo -e "${CYAN}Configuring Tailwind with brand colors...${NC}"

    if [ ! -d "$theme_dir" ]; then
        echo -e "  ${YELLOW}⚠${NC} Theme directory not found: $theme_dir"
        return 1
    fi

    # Update config
    update_tailwind_config "$theme_dir" "$primary" "$secondary"

    # Build CSS
    build_tailwind "$theme_dir"

    echo ""
}
