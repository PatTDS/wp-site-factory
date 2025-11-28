<?php
/**
 * ShortPixel Configuration Template
 * Configures ShortPixel image optimizer for WordPress
 *
 * Variables loaded from .wpf-config:
 *   SHORTPIXEL_API_KEY
 *
 * Usage: wp eval-file configure-shortpixel.php
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

echo "Configuring ShortPixel Image Optimizer...\n\n";

$results = [];

// Check for API key
$api_key = '{{SHORTPIXEL_API_KEY}}';

// Skip if placeholder
if (strpos($api_key, '{{') !== false || empty($api_key)) {
    echo "No ShortPixel API key configured.\n";
    echo "Add to .wpf-config: SHORTPIXEL_API_KEY=\"your-key\"\n";
    echo "Get free key at: https://shortpixel.com/free-sign-up\n";
    exit(0);
}

// Set API key
echo "Setting API key...\n";
update_option('shortpixel_api_key', $api_key);
$results[] = "API Key: Configured";

// Configure optimization settings
echo "Configuring optimization settings...\n";

// Compression type: 2 = Lossy (best balance)
update_option('shortpixel_compression_type', 2);
$results[] = "Compression Type: Lossy (best balance)";

// Auto-optimize new uploads
update_option('shortpixel_auto_media_library', 1);
$results[] = "Auto-optimize Uploads: Enabled";

// Create WebP versions
update_option('shortpixel_webp', 1);
$results[] = "WebP Generation: Enabled";

// Create retina versions
update_option('shortpixel_retina', 1);
$results[] = "Retina Support: Enabled";

// Remove EXIF data
update_option('shortpixel_remove_exif', 1);
$results[] = "Remove EXIF Data: Enabled";

// Keep original backup
update_option('shortpixel_backupImages', 1);
$results[] = "Backup Originals: Enabled";

// Resize large images
update_option('shortpixel_resize', 1);
update_option('shortpixel_resize_width', 2048);
update_option('shortpixel_resize_height', 2048);
$results[] = "Resize Large Images: Max 2048px";

// Front-end image optimization
update_option('shortpixel_front_bootstrap', 1);
$results[] = "Front-end Optimization: Enabled";

// Display Results
echo "\n" . str_repeat('=', 60) . "\n";
echo "SHORTPIXEL CONFIGURATION COMPLETE\n";
echo str_repeat('=', 60) . "\n\n";

foreach ($results as $result) {
    echo "  " . $result . "\n";
}

echo "\n" . str_repeat('=', 60) . "\n";
echo "Configuration Summary:\n";
echo str_repeat('=', 60) . "\n";
echo "  Compression: Lossy (smaller files, great quality)\n";
echo "  WebP: Enabled (modern browsers, smaller files)\n";
echo "  Retina: Enabled (high-DPI displays)\n";
echo "  Auto-optimize: New uploads automatically processed\n";
echo "  Backups: Original images preserved\n";
echo "\n";

echo "Next Steps:\n";
echo "  1. Go to Media > ShortPixel Bulk to optimize existing images\n";
echo "  2. New uploads will be auto-optimized\n";
echo "  3. WebP versions served automatically when supported\n";
echo "\n";

echo "Done! ShortPixel is now fully configured.\n";
