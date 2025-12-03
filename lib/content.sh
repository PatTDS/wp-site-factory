#!/bin/bash
#
# Content creation functions for WPF
# Creates starter pages, menus, and placeholder content
#

# Source WordPress helpers if not already loaded
if ! type wp_cli &>/dev/null; then
    source "$WPF_ROOT/lib/wordpress.sh"
fi

# Create a page if it doesn't exist
# Usage: create_page "slug" "title" "content"
create_page() {
    local slug="$1"
    local title="$2"
    local content="$3"

    if page_exists "$slug"; then
        echo -e "  ${YELLOW}⚠${NC} Page '$title' already exists"
        return 0
    fi

    local page_id=$(wp_cli post create \
        --post_type=page \
        --post_title="$title" \
        --post_name="$slug" \
        --post_status=publish \
        --post_content="$content" \
        --porcelain 2>/dev/null)

    if [ -n "$page_id" ]; then
        echo -e "  ${GREEN}✓${NC} Created page: $title (ID: $page_id)"
        echo "$page_id"
        return 0
    else
        echo -e "  ${RED}✗${NC} Failed to create page: $title"
        return 1
    fi
}

# Create all starter pages
# Uses COMPANY_NAME from .wpf-config
create_starter_pages() {
    local company="${COMPANY_NAME:-Your Company}"

    echo -e "${CYAN}Creating starter pages...${NC}"

    # Home page
    local home_content="<!-- wp:heading {\"level\":1} -->
<h1>Welcome to $company</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We provide exceptional services to help your business grow. Discover how we can help you achieve your goals.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class=\"wp-block-buttons\">
<!-- wp:button -->
<div class=\"wp-block-button\"><a class=\"wp-block-button__link wp-element-button\" href=\"/contact\">Get in Touch</a></div>
<!-- /wp:button -->
<!-- wp:button {\"className\":\"is-style-outline\"} -->
<div class=\"wp-block-button is-style-outline\"><a class=\"wp-block-button__link wp-element-button\" href=\"/services\">Our Services</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->"

    local home_id=$(create_page "home" "Home" "$home_content")

    # About page
    local about_content="<!-- wp:heading {\"level\":1} -->
<h1>About $company</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>$company has been serving clients with dedication and excellence. Our team of experts is committed to delivering outstanding results.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Our Mission</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>To provide innovative solutions that help our clients succeed in their endeavors.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Our Values</h2>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
<li>Excellence in everything we do</li>
<li>Integrity and transparency</li>
<li>Customer-focused approach</li>
<li>Continuous improvement</li>
</ul>
<!-- /wp:list -->"

    create_page "about" "About Us" "$about_content"

    # Services page
    local services_content="<!-- wp:heading {\"level\":1} -->
<h1>Our Services</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We offer a comprehensive range of services designed to meet your needs.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Service 1</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Description of your first service. Explain the benefits and what clients can expect.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Service 2</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Description of your second service. Highlight what makes it valuable.</p>
<!-- /wp:paragraph -->

<!-- wp:heading -->
<h2>Service 3</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Description of your third service. Include key features and benefits.</p>
<!-- /wp:paragraph -->

<!-- wp:buttons -->
<div class=\"wp-block-buttons\">
<!-- wp:button -->
<div class=\"wp-block-button\"><a class=\"wp-block-button__link wp-element-button\" href=\"/contact\">Request a Quote</a></div>
<!-- /wp:button -->
</div>
<!-- /wp:buttons -->"

    create_page "services" "Services" "$services_content"

    # Contact page with Contact Form 7 shortcode
    local contact_content="<!-- wp:heading {\"level\":1} -->
<h1>Contact Us</h1>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.</p>
<!-- /wp:paragraph -->

<!-- wp:shortcode -->
[contact-form-7 id=\"contact-form\" title=\"Contact Form\"]
<!-- /wp:shortcode -->

<!-- wp:heading -->
<h2>Other Ways to Reach Us</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><strong>Phone:</strong> ${PHONE:-+1 (555) 123-4567}</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>Email:</strong> ${EMAIL:-contact@example.com}</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>Address:</strong> ${ADDRESS:-123 Main Street}, ${CITY:-City}, ${STATE:-State}</p>
<!-- /wp:paragraph -->"

    create_page "contact" "Contact" "$contact_content"

    # Set Home as static front page
    if [ -n "$home_id" ] && [ "$home_id" -gt 0 ] 2>/dev/null; then
        wp_cli option update show_on_front 'page' 2>/dev/null
        wp_cli option update page_on_front "$home_id" 2>/dev/null
        echo -e "  ${GREEN}✓${NC} Set Home as static front page"
    fi

    echo ""
}

# Create primary navigation menu
create_primary_menu() {
    local company="${COMPANY_NAME:-Main}"
    local menu_name="${company} Menu"

    echo -e "${CYAN}Creating navigation menu...${NC}"

    # Check if menu already exists
    if menu_exists "$menu_name"; then
        echo -e "  ${YELLOW}⚠${NC} Menu '$menu_name' already exists"
        return 0
    fi

    # Create the menu
    local menu_id=$(wp_cli menu create "$menu_name" --porcelain 2>/dev/null)

    if [ -z "$menu_id" ]; then
        echo -e "  ${RED}✗${NC} Failed to create menu"
        return 1
    fi

    echo -e "  ${GREEN}✓${NC} Created menu: $menu_name"

    # Add menu items in order
    local pages=("home:Home" "about:About Us" "services:Services" "contact:Contact")
    local position=1

    for page_info in "${pages[@]}"; do
        local slug="${page_info%%:*}"
        local title="${page_info#*:}"

        # Get page ID
        local page_id=$(wp_cli post list --post_type=page --name="$slug" --field=ID 2>/dev/null)

        if [ -n "$page_id" ]; then
            wp_cli menu item add-post "$menu_name" "$page_id" --position=$position 2>/dev/null
            echo -e "  ${GREEN}✓${NC} Added menu item: $title"
            position=$((position + 1))
        fi
    done

    # Assign menu to primary location
    wp_cli menu location assign "$menu_name" primary 2>/dev/null && \
        echo -e "  ${GREEN}✓${NC} Assigned menu to 'primary' location"

    echo ""
}

# Remove default WordPress content
remove_default_content() {
    echo -e "${CYAN}Removing default content...${NC}"

    # Delete "Hello World" post
    local hello_world=$(wp_cli post list --post_type=post --name="hello-world" --field=ID 2>/dev/null)
    if [ -n "$hello_world" ]; then
        wp_cli post delete "$hello_world" --force 2>/dev/null
        echo -e "  ${GREEN}✓${NC} Deleted 'Hello World' post"
    fi

    # Delete "Sample Page"
    local sample_page=$(wp_cli post list --post_type=page --name="sample-page" --field=ID 2>/dev/null)
    if [ -n "$sample_page" ]; then
        wp_cli post delete "$sample_page" --force 2>/dev/null
        echo -e "  ${GREEN}✓${NC} Deleted 'Sample Page'"
    fi

    # Delete default comment
    wp_cli comment delete 1 --force 2>/dev/null && \
        echo -e "  ${GREEN}✓${NC} Deleted default comment"

    echo ""
}
