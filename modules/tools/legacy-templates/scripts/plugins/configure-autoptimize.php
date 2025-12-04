<?php
/**
 * Autoptimize Configuration Template
 * Configures Autoptimize for optimal WordPress performance
 *
 * Usage: wp eval-file configure-autoptimize.php
 */

// Load WordPress
require_once(__DIR__ . '/../wp-load.php');

// Security check
if (!defined('ABSPATH')) {
    die('Direct access not permitted');
}

if (php_sapi_name() !== 'cli' && !current_user_can('manage_options')) {
    die('Access denied. Administrator permissions required.');
}

echo "Starting Autoptimize Configuration...\n\n";

$results = [];

// 1. HTML Optimization
echo "Configuring HTML Optimization...\n";

update_option('autoptimize_html', 'on');
$results[] = "HTML Optimization: Enabled";

update_option('autoptimize_html_keepcomments', '');
$results[] = "HTML Keep Comments: Disabled (remove comments)";

// 2. CSS Optimization
echo "Configuring CSS Optimization...\n";

update_option('autoptimize_css', 'on');
$results[] = "CSS Optimization: Enabled";

update_option('autoptimize_css_inline', 'on');
$results[] = "CSS Inline: Enabled";

update_option('autoptimize_css_defer', 'on');
$results[] = "CSS Defer: Enabled (non-blocking)";

update_option('autoptimize_css_datauris', '');
$results[] = "CSS Data URIs: Disabled (better caching)";

update_option('autoptimize_css_justhead', '');
$results[] = "CSS Just Head: Disabled (optimize all)";

update_option('autoptimize_css_defer_inline', '');
$results[] = "CSS Defer Inline: Disabled";

// 3. JavaScript Optimization
echo "Configuring JavaScript Optimization...\n";

update_option('autoptimize_js', 'on');
$results[] = "JavaScript Optimization: Enabled";

update_option('autoptimize_js_defer', 'on');
$results[] = "JavaScript Defer: Enabled (non-blocking)";

update_option('autoptimize_js_forcehead', '');
$results[] = "JS Force Head: Disabled (better performance)";

update_option('autoptimize_js_justhead', '');
$results[] = "JS Just Head: Disabled (optimize all)";

update_option('autoptimize_js_trycatch', '');
$results[] = "JS Try-Catch: Disabled (avoid wrapping)";

// 4. Optimization Settings
echo "Configuring Advanced Settings...\n";

update_option('autoptimize_optimize_logged', 'on');
$results[] = "Optimize for Logged Users: Enabled";

update_option('autoptimize_optimize_checkout', '');
$results[] = "Optimize Checkout: Disabled (safety)";

// 5. Cache Settings
echo "Configuring Cache Settings...\n";

update_option('autoptimize_cache_clean', '1');
$results[] = "Cache Clean: Enabled";

// 6. Exclude specific scripts that should not be optimized
echo "Configuring Exclusions...\n";

// Exclude Google Analytics and other tracking scripts
$js_exclude = 'gtag,analytics,jquery.js';
update_option('autoptimize_js_exclude', $js_exclude);
$results[] = "JS Exclusions: {$js_exclude}";

// Don't exclude any CSS by default
update_option('autoptimize_css_exclude', '');
$results[] = "CSS Exclusions: None (optimize all)";

// 7. CDN Settings (if using CDN)
echo "Configuring CDN Settings...\n";

update_option('autoptimize_cdn_url', '');
$results[] = "CDN URL: Not configured (local serving)";

// 8. Clear Autoptimize cache to apply new settings
echo "Clearing Autoptimize Cache...\n";

// Delete all cached files
if (class_exists('autoptimizeCache')) {
    autoptimizeCache::clearall();
    $results[] = "Cache Cleared: All optimized files regenerated";
} else {
    $cache_dir = WP_CONTENT_DIR . '/cache/autoptimize/';
    if (is_dir($cache_dir)) {
        $files = glob($cache_dir . '*');
        foreach ($files as $file) {
            if (is_file($file)) {
                unlink($file);
            }
        }
        $results[] = "Cache Cleared: Manual cleanup completed";
    }
}

// Display Results
echo "\n" . str_repeat('=', 60) . "\n";
echo "AUTOPTIMIZE CONFIGURATION COMPLETE\n";
echo str_repeat('=', 60) . "\n\n";

foreach ($results as $result) {
    echo "  " . $result . "\n";
}

echo "\n" . str_repeat('=', 60) . "\n";
echo "Configuration Summary:\n";
echo str_repeat('=', 60) . "\n";
echo "  HTML Minification: Enabled\n";
echo "  CSS Optimization: Enabled + Defer\n";
echo "  JS Optimization: Enabled + Defer\n";
echo "  Inline Assets: Optimized\n";
echo "  Cache: Cleared and Ready\n";
echo "\n";

echo "Performance Impact:\n";
echo "  CSS Files: Concatenated into single file\n";
echo "  JS Files: Concatenated and deferred\n";
echo "  HTML: Minified (comments removed)\n";
echo "  Non-blocking: CSS and JS load asynchronously\n";
echo "  Logged Users: Also benefit from optimization\n";
echo "\n";

echo "Done! Autoptimize is now fully configured.\n";
