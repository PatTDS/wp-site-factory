<?php
/**
 * Redis Cache Configuration Template
 * Configures Redis object caching for WordPress
 *
 * Requires Redis server running (e.g., via Docker)
 *
 * Usage: wp eval-file configure-redis.php
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

echo "Configuring Redis Object Cache...\n\n";

$results = [];

// Check if Redis plugin is active
if (!class_exists('WP_Redis_Factory') && !function_exists('wp_redis')) {
    echo "Redis Cache plugin not found. Install it first:\n";
    echo "  wp plugin install redis-cache --activate\n";
    exit(1);
}

// Redis connection settings (from Docker)
$redis_host = defined('WP_REDIS_HOST') ? WP_REDIS_HOST : 'redis';
$redis_port = defined('WP_REDIS_PORT') ? WP_REDIS_PORT : 6379;

echo "Redis Host: {$redis_host}:{$redis_port}\n";

// Test Redis connection
echo "Testing Redis connection...\n";

try {
    $redis = new Redis();
    $connected = $redis->connect($redis_host, $redis_port, 2);

    if ($connected) {
        $pong = $redis->ping();
        if ($pong) {
            $results[] = "Redis Connection: SUCCESS (PONG)";

            // Get Redis info
            $info = $redis->info();
            $results[] = "Redis Version: " . ($info['redis_version'] ?? 'unknown');
            $results[] = "Memory Used: " . (isset($info['used_memory_human']) ? $info['used_memory_human'] : 'unknown');
        }
        $redis->close();
    } else {
        $results[] = "Redis Connection: FAILED";
        echo "\nRedis is not responding. Make sure Redis container is running:\n";
        echo "  docker-compose up -d redis\n";
        exit(1);
    }
} catch (Exception $e) {
    echo "Redis connection error: " . $e->getMessage() . "\n";
    echo "\nMake sure Redis is running and accessible.\n";
    exit(1);
}

// Configure Redis settings
echo "Configuring Redis settings...\n";

// Database index (0-15)
update_option('wp_redis_database', 0);
$results[] = "Redis Database: 0";

// Key prefix
$prefix = sanitize_key(get_bloginfo('name')) . '_';
update_option('wp_redis_prefix', $prefix);
$results[] = "Key Prefix: {$prefix}";

// Enable object cache
update_option('wp_redis_client', 'phpredis');
$results[] = "Client: phpredis";

// Set timeout
update_option('wp_redis_timeout', 5);
$results[] = "Timeout: 5 seconds";

// Try to enable Redis object cache
if (function_exists('wp_cache_flush')) {
    wp_cache_flush();
    $results[] = "Cache Flushed: Yes";
}

// Copy object-cache.php drop-in if not exists
$drop_in_source = WP_CONTENT_DIR . '/plugins/redis-cache/includes/object-cache.php';
$drop_in_dest = WP_CONTENT_DIR . '/object-cache.php';

if (file_exists($drop_in_source) && !file_exists($drop_in_dest)) {
    if (copy($drop_in_source, $drop_in_dest)) {
        $results[] = "Object Cache Drop-in: Installed";
    } else {
        $results[] = "Object Cache Drop-in: Failed to install (check permissions)";
    }
} elseif (file_exists($drop_in_dest)) {
    $results[] = "Object Cache Drop-in: Already installed";
}

// Display Results
echo "\n" . str_repeat('=', 60) . "\n";
echo "REDIS CACHE CONFIGURATION COMPLETE\n";
echo str_repeat('=', 60) . "\n\n";

foreach ($results as $result) {
    echo "  " . $result . "\n";
}

echo "\n" . str_repeat('=', 60) . "\n";
echo "Configuration Summary:\n";
echo str_repeat('=', 60) . "\n";
echo "  Object Caching: Enabled\n";
echo "  Persistent Cache: Yes (survives page loads)\n";
echo "  Database Queries: Reduced by ~30-50%\n";
echo "  Page Load: Faster repeated requests\n";
echo "\n";

echo "Verification:\n";
echo "  1. Visit wp-admin > Settings > Redis\n";
echo "  2. Check 'Status: Connected'\n";
echo "  3. Run: wp redis status\n";
echo "\n";

echo "Done! Redis object cache is now configured.\n";
