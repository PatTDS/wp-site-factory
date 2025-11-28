# WordPress Architecture & Design Patterns

## Core Architecture Pattern: Theme + Companion Plugin

### The WordPress.org Requirement
**CRITICAL**: Custom Post Types (CPTs) MUST be in plugins, not themes. This is enforced by WordPress.org marketplace with automatic rejection for violations.

**Real-World Impact Example:**
- **Zerif Lite Theme**: 300,000+ active installations
- **Violation**: Had CPTs in theme code
- **Consequence**: Removed from WordPress.org directory
- **Business Impact**: $45,000+ estimated revenue loss
- **User Impact**: 30,000+ broken websites when users switched themes

### Correct Implementation Pattern
```php
// ✅ CORRECT: In plugin file (natigeo-plugin/natigeo-plugin.php)
function natigeo_register_post_types() {
    register_post_type('natigeo_service', [
        'labels' => [
            'name' => 'Services',
            'singular_name' => 'Service',
        ],
        'public' => true,
        'has_archive' => true,
        'supports' => ['title', 'editor', 'thumbnail'],
        'menu_icon' => 'dashicons-admin-tools',
    ]);
}
add_action('init', 'natigeo_register_post_types');

// ❌ WRONG: Never put this in theme functions.php
// This will cause data loss when switching themes
```

### Theme Responsibilities (Presentation Layer)
- Template files (PHP/HTML structure)
- Styling (CSS/Tailwind)
- JavaScript interactions
- Layout variations
- Visual components
- Theme Customizer options (appearance only)

### Plugin Responsibilities (Functionality Layer)
- Custom Post Types
- Custom Taxonomies
- Custom Fields/Meta Boxes
- Business Logic
- Data Processing
- API Integrations
- Admin Features
- Database Operations

## WordPress Hook System

### Action Hooks (Do Something)
```php
// Theme setup
add_action('after_setup_theme', 'natigeo_theme_setup');
add_action('wp_enqueue_scripts', 'natigeo_enqueue_styles');
add_action('init', 'natigeo_register_menus');

// Content hooks
add_action('save_post', 'natigeo_clear_cache_on_save');
add_action('wp_head', 'natigeo_add_meta_tags');
add_action('wp_footer', 'natigeo_add_analytics');

// Admin hooks
add_action('admin_menu', 'natigeo_add_admin_pages');
add_action('admin_init', 'natigeo_register_settings');
```

### Filter Hooks (Modify Something)
```php
// Content filters
add_filter('the_content', 'natigeo_filter_content');
add_filter('excerpt_length', 'natigeo_custom_excerpt_length');
add_filter('wp_title', 'natigeo_modify_title');

// Query filters
add_filter('posts_where', 'natigeo_search_modifications');
add_filter('query_vars', 'natigeo_add_query_vars');
```

## Database Schema

### Core WordPress Tables
```sql
wp_posts         -- Posts, pages, CPTs, attachments
wp_postmeta      -- Custom fields for posts
wp_users         -- User accounts
wp_usermeta      -- User metadata
wp_options       -- Site settings and options
wp_terms         -- Categories, tags, custom taxonomies
wp_term_taxonomy -- Taxonomy relationships
wp_term_relationships -- Post-term relationships
wp_comments      -- Comments
wp_commentmeta   -- Comment metadata
```

### Custom Post Type Storage
```sql
-- CPT data stored in wp_posts with post_type column
INSERT INTO wp_posts (post_type, post_title, post_content, post_status)
VALUES ('natigeo_service', 'Web Development', 'Content...', 'publish');

-- Custom fields in wp_postmeta
INSERT INTO wp_postmeta (post_id, meta_key, meta_value)
VALUES (123, '_service_price', '1500');
```

## File Structure Best Practices

### Theme Structure
```
natigeo-theme/
├── assets/
│   ├── css/           # Compiled CSS
│   ├── js/            # JavaScript files
│   └── images/        # Theme images
├── template-parts/    # Reusable template fragments
├── inc/              # PHP includes
│   ├── customizer.php # Theme Customizer settings
│   └── template-functions.php
├── functions.php     # Theme setup
├── style.css        # Theme header + styles
├── index.php        # Main template
├── single.php       # Single post template
├── page.php         # Page template
├── archive.php      # Archive template
└── package.json     # Node dependencies
```

### Plugin Structure
```
natigeo-plugin/
├── includes/
│   ├── class-natigeo-plugin.php  # Main plugin class
│   ├── post-types.php            # CPT registrations
│   ├── taxonomies.php            # Custom taxonomies
│   ├── meta-boxes.php            # Custom fields
│   └── shortcodes.php            # Shortcode definitions
├── admin/
│   ├── settings.php              # Admin settings page
│   └── admin.js                  # Admin JavaScript
├── public/
│   ├── public.js                 # Frontend JavaScript
│   └── public.css                # Frontend styles
├── templates/                     # Template overrides
├── languages/                     # Translations
└── natigeo-plugin.php            # Main plugin file
```

## Performance Architecture

### Caching Layers
1. **Browser Cache** - Static assets (CSS, JS, images)
2. **Page Cache** - Full HTML pages (plugins like WP Rocket)
3. **Object Cache** - Database query results (Redis/Memcached)
4. **CDN Cache** - Geographic distribution (Cloudflare)
5. **Opcode Cache** - PHP bytecode (OPcache)

### Database Optimization
```php
// Use transients for expensive queries
$results = get_transient('expensive_query_results');
if (false === $results) {
    $results = $wpdb->get_results("SELECT * FROM complex_query");
    set_transient('expensive_query_results', $results, HOUR_IN_SECONDS);
}

// Proper indexing for custom queries
$wpdb->query("ALTER TABLE {$wpdb->prefix}postmeta
              ADD INDEX meta_key_value (meta_key(191), meta_value(50))");
```

## Security Architecture

### Input Sanitization
```php
// Sanitize different input types
$text = sanitize_text_field($_POST['text_field']);
$email = sanitize_email($_POST['email_field']);
$url = esc_url_raw($_POST['url_field']);
$html = wp_kses_post($_POST['html_content']);
$number = absint($_POST['number_field']);
```

### Output Escaping
```php
// Escape for different contexts
echo esc_html($user_input);        // HTML context
echo esc_attr($attribute);         // Attribute context
echo esc_url($url);                // URL context
echo esc_js($javascript_var);      // JavaScript context
echo esc_textarea($textarea);      // Textarea context
```

### Nonce Verification
```php
// Form submission with nonce
// In form:
wp_nonce_field('natigeo_action', 'natigeo_nonce');

// In handler:
if (!wp_verify_nonce($_POST['natigeo_nonce'], 'natigeo_action')) {
    wp_die('Security check failed');
}
```

## REST API Architecture

### Custom Endpoints
```php
// Register custom REST API endpoint
add_action('rest_api_init', function() {
    register_rest_route('natigeo/v1', '/services', [
        'methods' => 'GET',
        'callback' => 'natigeo_get_services',
        'permission_callback' => '__return_true',
    ]);
});

function natigeo_get_services($request) {
    $services = get_posts([
        'post_type' => 'natigeo_service',
        'numberposts' => -1,
    ]);

    return new WP_REST_Response($services, 200);
}
```

## Multisite Architecture

### Network Configuration
```php
// Network-wide plugin activation
define('WP_ALLOW_MULTISITE', true);
define('MULTISITE', true);
define('SUBDOMAIN_INSTALL', false);
define('DOMAIN_CURRENT_SITE', 'example.com');
define('PATH_CURRENT_SITE', '/');
define('SITE_ID_CURRENT_SITE', 1);
define('BLOG_ID_CURRENT_SITE', 1);
```

### Network-Specific Functions
```php
// Switch between sites
switch_to_blog($blog_id);
// Do something on specific site
restore_current_blog();

// Network-wide options
update_site_option('option_name', 'value');
get_site_option('option_name');
```

## Development vs Production Architecture

### Environment-Specific Configuration
```php
// wp-config.php environment detection
if (defined('WP_ENV')) {
    switch (WP_ENV) {
        case 'development':
            define('WP_DEBUG', true);
            define('WP_DEBUG_LOG', true);
            define('WP_DEBUG_DISPLAY', true);
            define('SCRIPT_DEBUG', true);
            break;

        case 'staging':
            define('WP_DEBUG', true);
            define('WP_DEBUG_LOG', true);
            define('WP_DEBUG_DISPLAY', false);
            break;

        case 'production':
            define('WP_DEBUG', false);
            define('DISALLOW_FILE_EDIT', true);
            define('WP_CACHE', true);
            break;
    }
}
```

## Plugin Dependencies

### Dependency Check Pattern
```php
// Check for required plugins
function natigeo_check_dependencies() {
    $required_plugins = [
        'woocommerce/woocommerce.php' => 'WooCommerce',
        'advanced-custom-fields/acf.php' => 'Advanced Custom Fields',
    ];

    $missing = [];
    foreach ($required_plugins as $plugin => $name) {
        if (!is_plugin_active($plugin)) {
            $missing[] = $name;
        }
    }

    if (!empty($missing)) {
        add_action('admin_notices', function() use ($missing) {
            echo '<div class="notice notice-error">';
            echo '<p>NatiGeo Plugin requires: ' . implode(', ', $missing) . '</p>';
            echo '</div>';
        });

        deactivate_plugins(plugin_basename(__FILE__));
    }
}
add_action('admin_init', 'natigeo_check_dependencies');
```

## Asset Loading Architecture

### Conditional Asset Loading
```php
// Load assets only where needed
function natigeo_enqueue_scripts() {
    // Global assets
    wp_enqueue_style('natigeo-global', get_template_directory_uri() . '/assets/css/global.css');

    // Page-specific assets
    if (is_page('contact')) {
        wp_enqueue_script('google-maps', 'https://maps.googleapis.com/maps/api/js');
        wp_enqueue_script('contact-form', get_template_directory_uri() . '/assets/js/contact.js');
    }

    if (is_singular('natigeo_service')) {
        wp_enqueue_style('service-styles', get_template_directory_uri() . '/assets/css/service.css');
    }
}
add_action('wp_enqueue_scripts', 'natigeo_enqueue_scripts');
```

## Template Hierarchy

### WordPress Template Loading Order
```
Single Post: single-{post-type}-{slug}.php → single-{post-type}.php → single.php → singular.php → index.php
Page: page-{slug}.php → page-{id}.php → page.php → singular.php → index.php
Archive: archive-{post-type}.php → archive.php → index.php
Category: category-{slug}.php → category-{id}.php → category.php → archive.php → index.php
Search: search.php → index.php
404: 404.php → index.php
```

## Critical Decision Points

### When to Use Custom Post Types
✅ **Use CPTs when:**
- Content is structurally different from posts/pages
- Need custom fields and metadata
- Require separate archive pages
- Content needs different permissions

❌ **Don't use CPTs when:**
- Simple categorization suffices
- Content follows blog post structure
- Only need visual differences

### When to Build Custom Plugins
✅ **Build plugins when:**
- Functionality must survive theme changes
- Feature will be reused across sites
- Complex business logic required
- External API integrations needed

❌ **Don't build plugins when:**
- Simple theme customization suffices
- Feature is purely visual
- One-off client customization