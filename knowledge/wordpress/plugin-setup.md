# WordPress Plugin Configuration Workflows

## Essential Plugin Stack Setup

### Performance Optimization Plugins

#### 1. Autoptimize Configuration
```bash
# Install and activate
wp plugin install autoptimize --activate

# Configure for optimal performance
wp option update autoptimize_html 'on'
wp option update autoptimize_html_keepcomments ''
wp option update autoptimize_css 'on'
wp option update autoptimize_css_inline 'on'
wp option update autoptimize_css_defer 'on'
wp option update autoptimize_css_datauris ''
wp option update autoptimize_css_justhead ''
wp option update autoptimize_js 'on'
wp option update autoptimize_js_defer 'on'
wp option update autoptimize_js_forcehead ''
wp option update autoptimize_js_justhead ''
wp option update autoptimize_optimize_logged 'on'
wp option update autoptimize_optimize_checkout ''
```

#### 2. Rank Math SEO Setup
```bash
# Install and activate
wp plugin install seo-by-rank-math --activate

# Basic configuration
wp option update rank_math_modules '["rich-snippet","sitemap","link-counter","404-monitor","redirections","local-seo","woocommerce"]' --format=json

# Local business setup for Capão Bonito, SP
wp option update rank_math_local_business_type 'Organization'
wp option update rank_math_local_business_name 'NatiGeo'
wp option update rank_math_local_address 'Capão Bonito, SP, Brazil'

# Enable breadcrumbs
wp option update rank_math_breadcrumbs_enable 'on'
wp option update rank_math_breadcrumbs_separator ' » '
```

#### 3. ShortPixel Image Optimizer
```bash
# Install
wp plugin install shortpixel-image-optimiser --activate

# Configure (requires API key)
read -p "Enter ShortPixel API Key: " SHORTPIXEL_KEY
wp option update shortpixel_api_key "$SHORTPIXEL_KEY"

# Optimization settings
wp option update shortpixel_compression_type 2  # Lossy
wp option update shortpixel_auto_media_library 1  # Auto-optimize
wp option update shortpixel_webp 1  # Create WebP
wp option update shortpixel_retina 1  # Support retina
wp option update shortpixel_remove_exif 1  # Remove EXIF
```

### Security Plugins

#### 4. Wordfence Security
```bash
# Install and activate
wp plugin install wordfence --activate

# Basic hardening
wp option update wordfence_hide_version 1
wp option update wordfence_disable_xmlrpc 1
wp option update wordfence_block_author_scan 1
wp option update wordfence_login_security_strong_passwords 1
```

#### 5. Jetpack Protect (Free)
```bash
# Install
wp plugin install jetpack --activate

# Enable only security features (free)
wp jetpack module activate protect
wp jetpack module deactivate photon  # Disable CDN
wp jetpack module deactivate stats   # Disable tracking
```

### Utility Plugins

#### 6. Query Monitor (Development)
```bash
# Install for development environment only
if [ "$WP_ENV" = "development" ]; then
  wp plugin install query-monitor --activate
  wp option update qm_enable_caps_panel 1
  wp option update qm_enable_environment_panel 1
fi
```

#### 7. WP Mail SMTP
```bash
# Install
wp plugin install wp-mail-smtp --activate

# Configure for local development
wp option update wp_mail_smtp '{"mail":{"from_email":"noreply@example.com","from_name":"NatiGeo","mailer":"mail","return_path":true}}' --format=json
```

## Custom Plugin Development

### NatiGeo Plugin Structure
```php
<?php
/**
 * Plugin Name: NatiGeo Features
 * Description: Custom post types and functionality for NatiGeo
 * Version: 1.0.0
 * Author: NatiGeo Team
 * Text Domain: natigeo
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('NATIGEO_VERSION', '1.0.0');
define('NATIGEO_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('NATIGEO_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include functionality
require_once NATIGEO_PLUGIN_DIR . 'includes/post-types.php';
require_once NATIGEO_PLUGIN_DIR . 'includes/taxonomies.php';
require_once NATIGEO_PLUGIN_DIR . 'includes/meta-boxes.php';
require_once NATIGEO_PLUGIN_DIR . 'includes/shortcodes.php';

// Activation hook
register_activation_hook(__FILE__, 'natigeo_activate');
function natigeo_activate() {
    // Register post types
    natigeo_register_post_types();

    // Flush rewrite rules
    flush_rewrite_rules();

    // Create database tables if needed
    natigeo_create_tables();
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'natigeo_deactivate');
function natigeo_deactivate() {
    // Clean up
    flush_rewrite_rules();
}
```

### Register Custom Post Types
```php
// includes/post-types.php

function natigeo_register_post_types() {
    // Services CPT
    register_post_type('natigeo_service', [
        'labels' => [
            'name' => __('Services', 'natigeo'),
            'singular_name' => __('Service', 'natigeo'),
            'add_new' => __('Add New Service', 'natigeo'),
            'add_new_item' => __('Add New Service', 'natigeo'),
            'edit_item' => __('Edit Service', 'natigeo'),
            'new_item' => __('New Service', 'natigeo'),
            'view_item' => __('View Service', 'natigeo'),
            'search_items' => __('Search Services', 'natigeo'),
            'not_found' => __('No services found', 'natigeo'),
        ],
        'public' => true,
        'has_archive' => true,
        'rewrite' => ['slug' => 'services'],
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt', 'custom-fields'],
        'menu_icon' => 'dashicons-admin-tools',
        'show_in_rest' => true,
    ]);

    // Projects CPT
    register_post_type('natigeo_project', [
        'labels' => [
            'name' => __('Projects', 'natigeo'),
            'singular_name' => __('Project', 'natigeo'),
        ],
        'public' => true,
        'has_archive' => true,
        'rewrite' => ['slug' => 'projects'],
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
        'menu_icon' => 'dashicons-portfolio',
        'show_in_rest' => true,
    ]);

    // Team Members CPT
    register_post_type('natigeo_team', [
        'labels' => [
            'name' => __('Team', 'natigeo'),
            'singular_name' => __('Team Member', 'natigeo'),
        ],
        'public' => true,
        'has_archive' => false,
        'rewrite' => ['slug' => 'team'],
        'supports' => ['title', 'editor', 'thumbnail'],
        'menu_icon' => 'dashicons-groups',
        'show_in_rest' => true,
    ]);
}
add_action('init', 'natigeo_register_post_types');
```

### Custom Taxonomies
```php
// includes/taxonomies.php

function natigeo_register_taxonomies() {
    // Service Categories
    register_taxonomy('service_category', 'natigeo_service', [
        'labels' => [
            'name' => __('Service Categories', 'natigeo'),
            'singular_name' => __('Service Category', 'natigeo'),
        ],
        'hierarchical' => true,
        'show_ui' => true,
        'show_in_rest' => true,
        'rewrite' => ['slug' => 'service-category'],
    ]);

    // Project Types
    register_taxonomy('project_type', 'natigeo_project', [
        'labels' => [
            'name' => __('Project Types', 'natigeo'),
            'singular_name' => __('Project Type', 'natigeo'),
        ],
        'hierarchical' => true,
        'show_ui' => true,
        'show_in_rest' => true,
        'rewrite' => ['slug' => 'project-type'],
    ]);

    // Team Departments
    register_taxonomy('department', 'natigeo_team', [
        'labels' => [
            'name' => __('Departments', 'natigeo'),
            'singular_name' => __('Department', 'natigeo'),
        ],
        'hierarchical' => true,
        'show_ui' => true,
        'show_in_rest' => true,
    ]);
}
add_action('init', 'natigeo_register_taxonomies');
```

### Meta Boxes and Custom Fields
```php
// includes/meta-boxes.php

function natigeo_add_meta_boxes() {
    // Service pricing
    add_meta_box(
        'natigeo_service_pricing',
        __('Service Pricing', 'natigeo'),
        'natigeo_service_pricing_callback',
        'natigeo_service',
        'side',
        'default'
    );

    // Project details
    add_meta_box(
        'natigeo_project_details',
        __('Project Details', 'natigeo'),
        'natigeo_project_details_callback',
        'natigeo_project',
        'normal',
        'default'
    );

    // Team member info
    add_meta_box(
        'natigeo_team_info',
        __('Team Member Info', 'natigeo'),
        'natigeo_team_info_callback',
        'natigeo_team',
        'normal',
        'default'
    );
}
add_action('add_meta_boxes', 'natigeo_add_meta_boxes');

function natigeo_service_pricing_callback($post) {
    wp_nonce_field('natigeo_service_pricing', 'natigeo_service_pricing_nonce');
    $price = get_post_meta($post->ID, '_service_price', true);
    $duration = get_post_meta($post->ID, '_service_duration', true);
    ?>
    <p>
        <label for="service_price"><?php _e('Price (R$)', 'natigeo'); ?></label>
        <input type="number" id="service_price" name="service_price" value="<?php echo esc_attr($price); ?>" class="widefat">
    </p>
    <p>
        <label for="service_duration"><?php _e('Duration', 'natigeo'); ?></label>
        <input type="text" id="service_duration" name="service_duration" value="<?php echo esc_attr($duration); ?>" class="widefat">
    </p>
    <?php
}

function natigeo_save_meta_boxes($post_id) {
    // Security checks
    if (!isset($_POST['natigeo_service_pricing_nonce'])) {
        return;
    }
    if (!wp_verify_nonce($_POST['natigeo_service_pricing_nonce'], 'natigeo_service_pricing')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Save service pricing
    if (isset($_POST['service_price'])) {
        update_post_meta($post_id, '_service_price', sanitize_text_field($_POST['service_price']));
    }
    if (isset($_POST['service_duration'])) {
        update_post_meta($post_id, '_service_duration', sanitize_text_field($_POST['service_duration']));
    }
}
add_action('save_post', 'natigeo_save_meta_boxes');
```

### Useful Shortcodes
```php
// includes/shortcodes.php

// [natigeo_services] - Display services grid
function natigeo_services_shortcode($atts) {
    $atts = shortcode_atts([
        'limit' => 6,
        'category' => '',
        'columns' => 3,
    ], $atts);

    $args = [
        'post_type' => 'natigeo_service',
        'posts_per_page' => $atts['limit'],
        'post_status' => 'publish',
    ];

    if (!empty($atts['category'])) {
        $args['tax_query'] = [
            [
                'taxonomy' => 'service_category',
                'field' => 'slug',
                'terms' => $atts['category'],
            ],
        ];
    }

    $services = new WP_Query($args);
    ob_start();
    ?>
    <div class="natigeo-services-grid columns-<?php echo esc_attr($atts['columns']); ?>">
        <?php while ($services->have_posts()): $services->the_post(); ?>
            <div class="service-card">
                <?php if (has_post_thumbnail()): ?>
                    <div class="service-thumbnail">
                        <?php the_post_thumbnail('medium'); ?>
                    </div>
                <?php endif; ?>
                <h3><?php the_title(); ?></h3>
                <div class="service-excerpt">
                    <?php the_excerpt(); ?>
                </div>
                <a href="<?php the_permalink(); ?>" class="button">
                    <?php _e('Learn More', 'natigeo'); ?>
                </a>
            </div>
        <?php endwhile; ?>
    </div>
    <?php
    wp_reset_postdata();
    return ob_get_clean();
}
add_shortcode('natigeo_services', 'natigeo_services_shortcode');

// [natigeo_contact_form] - Simple contact form
function natigeo_contact_form_shortcode() {
    ob_start();
    ?>
    <form class="natigeo-contact-form" method="post" action="">
        <?php wp_nonce_field('natigeo_contact_form', 'natigeo_contact_nonce'); ?>
        <p>
            <label><?php _e('Name', 'natigeo'); ?> *</label>
            <input type="text" name="contact_name" required>
        </p>
        <p>
            <label><?php _e('Email', 'natigeo'); ?> *</label>
            <input type="email" name="contact_email" required>
        </p>
        <p>
            <label><?php _e('Phone', 'natigeo'); ?></label>
            <input type="tel" name="contact_phone">
        </p>
        <p>
            <label><?php _e('Message', 'natigeo'); ?> *</label>
            <textarea name="contact_message" rows="5" required></textarea>
        </p>
        <p>
            <button type="submit"><?php _e('Send Message', 'natigeo'); ?></button>
        </p>
    </form>
    <?php
    return ob_get_clean();
}
add_shortcode('natigeo_contact_form', 'natigeo_contact_form_shortcode');
```

## Plugin Testing Workflow

### Unit Testing Setup
```bash
# Install PHPUnit
composer require --dev phpunit/phpunit

# Create test structure
mkdir -p tests/unit
mkdir -p tests/integration

# Create phpunit.xml
cat > phpunit.xml << 'EOF'
<?xml version="1.0"?>
<phpunit bootstrap="tests/bootstrap.php">
    <testsuites>
        <testsuite name="Unit">
            <directory>tests/unit</directory>
        </testsuite>
        <testsuite name="Integration">
            <directory>tests/integration</directory>
        </testsuite>
    </testsuites>
</phpunit>
EOF
```

### Sample Test
```php
// tests/unit/PostTypesTest.php

class PostTypesTest extends WP_UnitTestCase {

    public function test_service_post_type_exists() {
        $this->assertTrue(post_type_exists('natigeo_service'));
    }

    public function test_service_supports_thumbnails() {
        $supports = get_all_post_type_supports('natigeo_service');
        $this->assertTrue(array_key_exists('thumbnail', $supports));
    }

    public function test_service_has_archive() {
        $post_type = get_post_type_object('natigeo_service');
        $this->assertTrue($post_type->has_archive);
    }
}
```

## Plugin Distribution

### Prepare for Distribution
```bash
#!/bin/bash
# prepare-plugin.sh

PLUGIN_NAME="natigeo-plugin"
VERSION="1.0.0"

# Create distribution directory
mkdir -p dist

# Copy plugin files
rsync -av --exclude='node_modules' \
         --exclude='.git' \
         --exclude='tests' \
         --exclude='*.log' \
         --exclude='.DS_Store' \
         $PLUGIN_NAME/ dist/$PLUGIN_NAME/

# Create zip file
cd dist
zip -r $PLUGIN_NAME-$VERSION.zip $PLUGIN_NAME/

echo "Plugin package created: dist/$PLUGIN_NAME-$VERSION.zip"
```

## Plugin Maintenance

### Update Checklist
- [ ] Test with latest WordPress version
- [ ] Check PHP 8.0+ compatibility
- [ ] Update dependencies
- [ ] Run security audit
- [ ] Test with popular plugins
- [ ] Update documentation
- [ ] Increment version number
- [ ] Update changelog

### Version Management
```php
// Version update process
// 1. Update main plugin file header
// 2. Update README.txt
// 3. Update constant
define('NATIGEO_VERSION', '1.0.1');

// 4. Add database migration if needed
function natigeo_update_101() {
    $current_version = get_option('natigeo_version', '1.0.0');

    if (version_compare($current_version, '1.0.1', '<')) {
        // Run updates

        // Update version
        update_option('natigeo_version', '1.0.1');
    }
}
add_action('admin_init', 'natigeo_update_101');
```