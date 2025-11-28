# WordPress Development Best Practices

## Performance Optimization Stack

### The Free Performance Stack (Achieves 70-85 Lighthouse Score)

#### 1. Rank Math SEO (Free Version)
**Purpose:** SEO + Performance optimization

**Configuration:**
```php
// Enable in wp-config.php
define('RANK_MATH_DISABLE_ANALYTICS', true); // Reduce DB queries

// Optimal settings via WP-CLI
wp option update rank_math_modules '["rich-snippet","sitemap","link-counter","404-monitor"]' --format=json
```

**Key Features to Enable:**
- Local Business Schema
- Breadcrumbs (reduces bounce rate)
- XML Sitemap (exclude unnecessary post types)
- Remove unnecessary meta tags
- Disable comment URLs (spam prevention)

#### 2. Autoptimize (Free)
**Purpose:** CSS/JS optimization

**Optimal Configuration:**
```php
// Autoptimize settings
wp option update autoptimize_html 'on'
wp option update autoptimize_html_keepcomments ''
wp option update autoptimize_css 'on'
wp option update autoptimize_css_inline 'on'
wp option update autoptimize_css_defer 'on'
wp option update autoptimize_js 'on'
wp option update autoptimize_js_defer 'on'
wp option update autoptimize_js_forcehead ''
wp option update autoptimize_optimize_logged 'on'
wp option update autoptimize_optimize_checkout ''
```

**Critical CSS Generation:**
```bash
#!/bin/bash
# generate-critical-css.sh

# Install critical tool
npm install -g critical

# Generate for homepage
critical https://localhost:8080 \
  --base . \
  --inline \
  --minify \
  --extract \
  --width 1920 \
  --height 1080 \
  > critical-home.css

# Add to Autoptimize
wp option update autoptimize_css_inline "$(cat critical-home.css)"
```

#### 3. ShortPixel (Free Tier: 100 images/month)
**Purpose:** Image optimization

**Configuration:**
```php
// ShortPixel optimal settings
wp option update shortpixel_api_key 'YOUR_API_KEY'
wp option update shortpixel_compression_type 2  // Lossy compression
wp option update shortpixel_auto_media_library 1  // Auto-optimize uploads
wp option update shortpixel_webp 1  // Create WebP versions
wp option update shortpixel_retina 1  // Support retina displays
```

**Bulk Optimization Script:**
```bash
# For existing images (using ImageMagick as free alternative)
find wp-content/uploads -type f \( -name "*.jpg" -o -name "*.jpeg" \) \
  -exec mogrify -strip -interlace Plane -quality 85 {} \;

# Convert to WebP
for file in wp-content/uploads/**/*.{jpg,jpeg,png}; do
  cwebp -q 80 "$file" -o "${file%.*}.webp"
done
```

### Database Optimization

#### Query Optimization Patterns
```php
// ❌ BAD: Multiple queries in loop
foreach ($post_ids as $id) {
    $meta = get_post_meta($id, 'custom_field', true);
}

// ✅ GOOD: Single query with caching
$meta_values = wp_cache_get('custom_meta_values');
if (false === $meta_values) {
    global $wpdb;
    $meta_values = $wpdb->get_results(
        "SELECT post_id, meta_value
         FROM {$wpdb->postmeta}
         WHERE meta_key = 'custom_field'
         AND post_id IN (" . implode(',', $post_ids) . ")"
    );
    wp_cache_set('custom_meta_values', $meta_values, '', HOUR_IN_SECONDS);
}
```

#### Transient API Best Practices
```php
// Complex query caching
function get_expensive_data() {
    $cache_key = 'expensive_data_v2';
    $data = get_transient($cache_key);

    if (false === $data) {
        // Expensive operation
        global $wpdb;
        $data = $wpdb->get_results("
            SELECT p.*, pm.*
            FROM {$wpdb->posts} p
            JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id
            WHERE p.post_type = 'product'
            AND p.post_status = 'publish'
            ORDER BY pm.meta_value DESC
            LIMIT 100
        ");

        // Cache for 12 hours
        set_transient($cache_key, $data, 12 * HOUR_IN_SECONDS);
    }

    return $data;
}

// Delete transient on relevant changes
add_action('save_post_product', function($post_id) {
    delete_transient('expensive_data_v2');
});
```

#### Database Maintenance Script
```bash
#!/bin/bash
# monthly-db-maintenance.sh

# Delete old revisions (keep last 3)
wp post list --post_type=revision --format=ids | \
  xargs -I {} wp eval 'if(count(wp_get_post_revisions({})) > 3) {
    $revisions = wp_get_post_revisions({});
    $keep = array_slice($revisions, 0, 3);
    foreach(array_slice($revisions, 3) as $revision) {
      wp_delete_post($revision->ID, true);
    }
  }'

# Clean expired transients
wp transient delete --expired

# Delete orphaned metadata
wp db query "DELETE FROM wp_postmeta WHERE post_id NOT IN (SELECT ID FROM wp_posts)"
wp db query "DELETE FROM wp_termmeta WHERE term_id NOT IN (SELECT term_id FROM wp_terms)"

# Optimize tables
wp db optimize

echo "Database maintenance complete"
```

## Security Hardening

### File & Directory Security
```bash
#!/bin/bash
# harden-wordpress.sh

# Set correct permissions
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;

# Secure sensitive files
chmod 600 wp-config.php
chmod 600 .htaccess

# Protect uploads directory
cat > wp-content/uploads/.htaccess << 'EOF'
# Disable PHP execution
<Files *.php>
deny from all
</Files>

# Allow specific file types only
<FilesMatch "\.(jpg|jpeg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|zip)$">
Order Allow,Deny
Allow from all
</FilesMatch>
EOF

# Protect wp-includes
cat > wp-includes/.htaccess << 'EOF'
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^wp-admin/includes/ - [F,L]
RewriteRule !^wp-includes/ - [S=3]
RewriteRule ^wp-includes/[^/]+\.php$ - [F,L]
RewriteRule ^wp-includes/js/tinymce/langs/.+\.php - [F,L]
RewriteRule ^wp-includes/theme-compat/ - [F,L]
</IfModule>
EOF
```

### Security Headers (.htaccess)
```apache
# Security Headers
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "no-referrer-when-downgrade"
Header set Content-Security-Policy "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:;"

# Disable directory browsing
Options -Indexes

# Block access to sensitive files
<FilesMatch "\.(env|log|sql|ini|conf|bak)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Block access to hidden files
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule (^\.|/\.) - [F]
</IfModule>

# Protect wp-config.php
<Files wp-config.php>
    Order allow,deny
    Deny from all
</Files>

# Disable XML-RPC
<Files xmlrpc.php>
    Order allow,deny
    Deny from all
</Files>
```

### WordPress Configuration Hardening
```php
// wp-config.php security settings

// Disable file editing
define('DISALLOW_FILE_EDIT', true);
define('DISALLOW_FILE_MODS', true);

// SSL for admin
define('FORCE_SSL_ADMIN', true);

// Limit login attempts
define('WP_LOGIN_ATTEMPTS', 5);

// Hide WordPress version
remove_action('wp_head', 'wp_generator');

// Disable pingbacks
add_filter('xmlrpc_enabled', '__return_false');

// Security keys (regenerate regularly)
define('AUTH_KEY',         'unique-phrase-here');
define('SECURE_AUTH_KEY',  'unique-phrase-here');
define('LOGGED_IN_KEY',    'unique-phrase-here');
define('NONCE_KEY',        'unique-phrase-here');

// Database security
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', 'utf8mb4_unicode_ci');

// Disable debug in production
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);
define('SCRIPT_DEBUG', false);
```

## Code Quality Standards

### PHP Best Practices
```php
<?php
/**
 * Service Manager Class
 *
 * @package NatiGeo
 * @since 1.0.0
 */

namespace NatiGeo\Services;

use NatiGeo\Interfaces\ServiceInterface;

class ServiceManager implements ServiceInterface {
    /**
     * Services cache
     *
     * @var array
     */
    private array $services = [];

    /**
     * Get all services
     *
     * @return array List of services
     */
    public function get_services(): array {
        if (empty($this->services)) {
            $this->services = $this->fetch_services();
        }

        return $this->services;
    }

    /**
     * Fetch services from database
     *
     * @return array
     */
    private function fetch_services(): array {
        $cache_key = 'natigeo_services';
        $services = wp_cache_get($cache_key);

        if (false === $services) {
            $services = get_posts([
                'post_type'      => 'natigeo_service',
                'posts_per_page' => -1,
                'post_status'    => 'publish',
                'orderby'        => 'menu_order',
                'order'          => 'ASC',
            ]);

            wp_cache_set($cache_key, $services, '', HOUR_IN_SECONDS);
        }

        return $services;
    }

    /**
     * Clear services cache
     *
     * @return void
     */
    public function clear_cache(): void {
        wp_cache_delete('natigeo_services');
    }
}
```

### JavaScript Best Practices
```javascript
/**
 * NatiGeo Frontend Scripts
 *
 * @package NatiGeo
 */

(function(window, document, $) {
    'use strict';

    /**
     * Service Handler
     */
    const ServiceHandler = {
        /**
         * Initialize
         */
        init() {
            this.bindEvents();
            this.lazyLoadImages();
        },

        /**
         * Bind events
         */
        bindEvents() {
            document.addEventListener('DOMContentLoaded', () => {
                this.handleServiceCards();
            });

            // Debounced scroll handler
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    this.handleScroll();
                }, 100);
            });
        },

        /**
         * Handle service cards
         */
        handleServiceCards() {
            const cards = document.querySelectorAll('.service-card');

            cards.forEach(card => {
                card.addEventListener('click', (e) => {
                    if (!e.target.matches('a')) {
                        const link = card.querySelector('a');
                        if (link) {
                            window.location = link.href;
                        }
                    }
                });
            });
        },

        /**
         * Lazy load images
         */
        lazyLoadImages() {
            if ('IntersectionObserver' in window) {
                const imageObserver = new IntersectionObserver((entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            const img = entry.target;
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                            imageObserver.unobserve(img);
                        }
                    });
                });

                document.querySelectorAll('img[data-src]').forEach(img => {
                    imageObserver.observe(img);
                });
            }
        },

        /**
         * Handle scroll events
         */
        handleScroll() {
            const scrollTop = window.pageYOffset;
            const header = document.querySelector('.site-header');

            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    };

    // Initialize
    ServiceHandler.init();

})(window, document, jQuery);
```

## Testing Strategy

### E2E Testing with Playwright
```javascript
// tests/e2e/homepage.spec.js

const { test, expect } = require('@playwright/test');

test.describe('Homepage Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should load homepage successfully', async ({ page }) => {
        await expect(page).toHaveTitle(/NatiGeo/);
        await expect(page.locator('header')).toBeVisible();
        await expect(page.locator('footer')).toBeVisible();
    });

    test('should display services section', async ({ page }) => {
        const servicesSection = page.locator('#services');
        await expect(servicesSection).toBeVisible();

        const serviceCards = servicesSection.locator('.service-card');
        await expect(serviceCards).toHaveCount(6);
    });

    test('should have working navigation', async ({ page }) => {
        await page.click('nav a[href="/services"]');
        await expect(page).toHaveURL('/services');
    });

    test('should pass accessibility checks', async ({ page }) => {
        const accessibilityScanResults = await page.evaluate(() => {
            return new Promise((resolve) => {
                window.axe.run((err, results) => {
                    resolve(results.violations);
                });
            });
        });

        expect(accessibilityScanResults).toHaveLength(0);
    });
});
```

### Performance Testing
```javascript
// tests/performance/lighthouse.js

const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse(url) {
    const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
    const options = {
        logLevel: 'info',
        output: 'json',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        port: chrome.port
    };

    const runnerResult = await lighthouse(url, options);

    // Parse results
    const results = JSON.parse(runnerResult.report);
    const scores = {
        performance: results.categories.performance.score * 100,
        accessibility: results.categories.accessibility.score * 100,
        bestPractices: results.categories['best-practices'].score * 100,
        seo: results.categories.seo.score * 100
    };

    await chrome.kill();

    // Check thresholds
    if (scores.performance < 70) {
        throw new Error(`Performance score ${scores.performance} is below threshold of 70`);
    }

    return scores;
}

// Run test
runLighthouse('http://localhost:8080')
    .then(scores => console.log('Lighthouse Scores:', scores))
    .catch(error => {
        console.error('Lighthouse test failed:', error);
        process.exit(1);
    });
```

## Content Management Best Practices

### Structured Content with Custom Fields
```php
// Register custom fields for services
function natigeo_register_service_fields() {
    register_post_meta('natigeo_service', 'service_icon', [
        'type'          => 'string',
        'single'        => true,
        'show_in_rest'  => true,
        'sanitize_callback' => 'sanitize_text_field',
    ]);

    register_post_meta('natigeo_service', 'service_price', [
        'type'          => 'number',
        'single'        => true,
        'show_in_rest'  => true,
        'sanitize_callback' => 'absint',
    ]);

    register_post_meta('natigeo_service', 'service_features', [
        'type'          => 'array',
        'single'        => true,
        'show_in_rest'  => [
            'schema' => [
                'type'  => 'array',
                'items' => [
                    'type' => 'string',
                ],
            ],
        ],
    ]);
}
add_action('init', 'natigeo_register_service_fields');
```

### Image Optimization Workflow
```php
// Automatic image optimization on upload
add_filter('wp_handle_upload', function($file) {
    if (strpos($file['type'], 'image') === 0) {
        // Get image resource
        $image_path = $file['file'];

        // Optimize based on type
        switch ($file['type']) {
            case 'image/jpeg':
            case 'image/jpg':
                $image = imagecreatefromjpeg($image_path);
                imagejpeg($image, $image_path, 85); // 85% quality
                break;

            case 'image/png':
                $image = imagecreatefrompng($image_path);
                imagepng($image, $image_path, 7); // Compression level 7
                break;
        }

        if (isset($image)) {
            imagedestroy($image);
        }

        // Create WebP version
        $webp_path = preg_replace('/\.(jpg|jpeg|png)$/i', '.webp', $image_path);
        exec("cwebp -q 80 '$image_path' -o '$webp_path'");
    }

    return $file;
});
```

## SEO Implementation

### Schema.org Markup
```php
// Add Local Business Schema
function natigeo_add_schema_markup() {
    if (is_front_page()) {
        $schema = [
            '@context' => 'https://schema.org',
            '@type' => 'LocalBusiness',
            'name' => 'NatiGeo',
            'description' => get_bloginfo('description'),
            'url' => home_url(),
            'telephone' => get_theme_mod('business_phone'),
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => get_theme_mod('business_street'),
                'addressLocality' => 'Capão Bonito',
                'addressRegion' => 'SP',
                'postalCode' => get_theme_mod('business_postal'),
                'addressCountry' => 'BR'
            ],
            'openingHours' => 'Mo-Fr 08:00-18:00',
            'priceRange' => '$$'
        ];

        echo '<script type="application/ld+json">' . json_encode($schema) . '</script>';
    }
}
add_action('wp_head', 'natigeo_add_schema_markup');
```

### Meta Tags Optimization
```php
// Dynamic meta tags
function natigeo_meta_tags() {
    global $post;

    // Default values
    $title = get_bloginfo('name');
    $description = get_bloginfo('description');
    $image = get_theme_mod('default_og_image');

    // Page-specific values
    if (is_singular()) {
        $title = get_the_title();
        $description = get_the_excerpt();

        if (has_post_thumbnail()) {
            $image = get_the_post_thumbnail_url(null, 'large');
        }
    }

    // Output meta tags
    ?>
    <meta property="og:title" content="<?php echo esc_attr($title); ?>">
    <meta property="og:description" content="<?php echo esc_attr($description); ?>">
    <meta property="og:image" content="<?php echo esc_url($image); ?>">
    <meta property="og:url" content="<?php echo esc_url(get_permalink()); ?>">
    <meta property="og:type" content="<?php echo is_single() ? 'article' : 'website'; ?>">

    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="<?php echo esc_attr($title); ?>">
    <meta name="twitter:description" content="<?php echo esc_attr($description); ?>">
    <meta name="twitter:image" content="<?php echo esc_url($image); ?>">
    <?php
}
add_action('wp_head', 'natigeo_meta_tags');
```

## Monitoring & Analytics

### Custom Performance Monitoring
```php
// Track page load performance
function natigeo_performance_tracking() {
    if (!is_admin()) {
        ?>
        <script>
        window.addEventListener('load', function() {
            if (window.performance && window.performance.timing) {
                const timing = window.performance.timing;
                const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
                const dnsTime = timing.domainLookupEnd - timing.domainLookupStart;
                const tcpTime = timing.connectEnd - timing.connectStart;
                const serverTime = timing.responseEnd - timing.requestStart;
                const domTime = timing.domComplete - timing.domInteractive;

                // Send to analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'timing_complete', {
                        'name': 'load',
                        'value': pageLoadTime,
                        'event_category': 'Performance',
                        'event_label': window.location.pathname
                    });
                }

                // Log to console in development
                <?php if (WP_DEBUG): ?>
                console.table({
                    'Page Load Time': pageLoadTime + 'ms',
                    'DNS Lookup': dnsTime + 'ms',
                    'TCP Connection': tcpTime + 'ms',
                    'Server Response': serverTime + 'ms',
                    'DOM Processing': domTime + 'ms'
                });
                <?php endif; ?>
            }
        });
        </script>
        <?php
    }
}
add_action('wp_footer', 'natigeo_performance_tracking', 100);
```

## Version Control Best Practices

### .gitignore for WordPress
```gitignore
# WordPress core files
/wordpress/
/wp-admin/
/wp-includes/
/index.php
/license.txt
/readme.html
/wp-*.php
/xmlrpc.php

# Configuration
wp-config.php
.htaccess

# Content we don't want to track
/wp-content/uploads/
/wp-content/upgrade/
/wp-content/backup-db/
/wp-content/backups/
/wp-content/blogs.dir/
/wp-content/cache/
/wp-content/advanced-cache.php
/wp-content/wp-cache-config.php
/wp-content/debug.log

# Plugins (track only custom ones)
/wp-content/plugins/*
!/wp-content/plugins/natigeo-plugin/

# Themes (track only custom ones)
/wp-content/themes/*
!/wp-content/themes/natigeo-theme/
!/wp-content/themes/natigeo-child/

# Dependencies
node_modules/
vendor/

# Build files
*.map
*.min.css
*.min.js

# Environment
.env
.env.*

# IDE
.vscode/
.idea/
*.sublime-*

# OS
.DS_Store
Thumbs.db

# Logs
*.log
error_log
```

## Documentation Standards

### README.md Template
```markdown
# NatiGeo WordPress Site

## Overview
WordPress site for NatiGeo - Environmental consulting and geotechnical services.

## Requirements
- PHP 8.0+
- MySQL 8.0+
- WordPress 6.7+
- Node.js 20+
- Docker & Docker Compose

## Quick Start
\`\`\`bash
# Clone repository
git clone https://github.com/natigeo/website.git
cd website

# Start environment
docker-compose up -d

# Install dependencies
cd wp-content/themes/natigeo-theme
npm install
npm run build

# Activate theme and plugins
wp theme activate natigeo-theme
wp plugin activate natigeo-plugin
\`\`\`

## Development

### Commands
- `npm run watch` - Watch for CSS changes
- `npm run build` - Build production assets
- `npm test` - Run test suite
- `npm run lighthouse` - Run performance audit

### Project Structure
\`\`\`
/
├── wp-content/
│   ├── themes/natigeo-theme/    # Custom theme
│   ├── plugins/natigeo-plugin/  # Custom functionality
│   └── uploads/                 # Media files
├── scripts/                     # Automation scripts
├── tests/                       # Test suites
└── docker-compose.yml          # Docker configuration
\`\`\`

## Deployment
See [deployment.md](docs/deployment.md) for detailed deployment instructions.

## Contributing
1. Create feature branch
2. Make changes
3. Run tests
4. Submit PR

## License
Proprietary - NatiGeo © 2024
```