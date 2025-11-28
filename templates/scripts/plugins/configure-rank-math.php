<?php
/**
 * Rank Math Local SEO Configuration Template
 * Configures Local Business schema with project business details
 *
 * Variables loaded from .wpf-config:
 *   PROJECT_NAME, COMPANY_NAME, DOMAIN, BUSINESS_*
 *
 * Usage: wp eval-file configure-rank-math.php
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

echo "Configuring Rank Math Local SEO...\n\n";

$results = [];

// Business Information - Replace with project values or configure in .wpf-config
$business_info = [
    'name' => '{{COMPANY_NAME}}',
    'legal_name' => '{{COMPANY_NAME}}',
    'street' => '{{BUSINESS_STREET}}',
    'neighborhood' => '{{BUSINESS_NEIGHBORHOOD}}',
    'city' => '{{BUSINESS_CITY}}',
    'state' => '{{BUSINESS_STATE}}',
    'postal_code' => '{{BUSINESS_POSTAL_CODE}}',
    'country' => '{{BUSINESS_COUNTRY}}',
    'phone' => '{{BUSINESS_PHONE}}',
    'email' => '{{BUSINESS_EMAIL}}',
    'latitude' => '{{BUSINESS_LATITUDE}}',
    'longitude' => '{{BUSINESS_LONGITUDE}}',
    'price_range' => '{{BUSINESS_PRICE_RANGE}}',
    'hours' => '{{BUSINESS_HOURS}}',
    'type' => '{{BUSINESS_TYPE}}',
];

// Enable Local SEO module
$current_modules = get_option('rank_math_modules', []);
if (!in_array('local-seo', $current_modules)) {
    $current_modules[] = 'local-seo';
    update_option('rank_math_modules', $current_modules);
    $results[] = "Local SEO Module: Enabled";
} else {
    $results[] = "Local SEO Module: Already Enabled";
}

// Configure Local Business Settings
$local_business_config = [
    'knowledgegraph_type' => 'organization',
    'knowledgegraph_name' => $business_info['name'],
    'url' => home_url(),
    'email' => $business_info['email'],
    'phone' => $business_info['phone'],
    'address_format' => 'custom',
    'street_address' => $business_info['street'],
    'address_locality' => $business_info['city'],
    'address_region' => $business_info['state'],
    'postal_code' => $business_info['postal_code'],
    'country' => $business_info['country'],
    'geo_latitude' => $business_info['latitude'],
    'geo_longitude' => $business_info['longitude'],
    'opening_hours' => $business_info['hours'],
    'price_range' => $business_info['price_range'],
    'local_business_type' => $business_info['type'],
];

// Update Rank Math General Settings
$general_settings = get_option('rank-math-options-general', []);
foreach ($local_business_config as $key => $value) {
    $general_settings[$key] = $value;
}
update_option('rank-math-options-general', $general_settings);
$results[] = "Local Business Schema: Configured";

// Configure Social Media Profiles (optional)
$social_profiles = [
    'facebook' => '{{SOCIAL_FACEBOOK}}',
    'instagram' => '{{SOCIAL_INSTAGRAM}}',
    'linkedin' => '{{SOCIAL_LINKEDIN}}',
];

$social_config = get_option('rank-math-options-general', []);
if (!empty($social_profiles['facebook']) && strpos($social_profiles['facebook'], '{{') === false) {
    $social_config['social_url_facebook'] = $social_profiles['facebook'];
}
if (!empty($social_profiles['instagram']) && strpos($social_profiles['instagram'], '{{') === false) {
    $social_config['social_url_instagram'] = $social_profiles['instagram'];
}
if (!empty($social_profiles['linkedin']) && strpos($social_profiles['linkedin'], '{{') === false) {
    $social_config['social_url_linkedin'] = $social_profiles['linkedin'];
}
update_option('rank-math-options-general', $social_config);
$results[] = "Social Media Profiles: Configured";

// Enable important Rank Math features
$titles_config = get_option('rank-math-options-titles', []);

// Enable Breadcrumbs
$titles_config['breadcrumbs'] = 'on';
$titles_config['breadcrumbs_separator'] = ' > ';
$titles_config['breadcrumbs_home'] = 'on';
$titles_config['breadcrumbs_home_label'] = 'Home';

// OpenGraph settings
$titles_config['open_graph'] = 'on';
$titles_config['twitter_card_type'] = 'summary_large_image';

update_option('rank-math-options-titles', $titles_config);
$results[] = "Breadcrumbs: Enabled";
$results[] = "OpenGraph Tags: Enabled";

// Configure Sitemap settings
$sitemap_config = get_option('rank-math-options-sitemap', []);
$sitemap_config['sitemap'] = 'on';
$sitemap_config['exclude_posts'] = [];
$sitemap_config['exclude_terms'] = [];
update_option('rank-math-options-sitemap', $sitemap_config);
$results[] = "XML Sitemap: Configured";

// Flush rewrite rules for sitemap
flush_rewrite_rules();

// Display Results
echo "\n" . str_repeat('=', 60) . "\n";
echo "RANK MATH LOCAL SEO CONFIGURATION COMPLETE\n";
echo str_repeat('=', 60) . "\n\n";

foreach ($results as $result) {
    echo "  " . $result . "\n";
}

echo "\n" . str_repeat('=', 60) . "\n";
echo "Business Information Configured:\n";
echo str_repeat('=', 60) . "\n";
echo "  Business Name: {$business_info['name']}\n";
echo "  Address: {$business_info['street']}, {$business_info['neighborhood']}\n";
echo "           {$business_info['city']}, {$business_info['state']} {$business_info['postal_code']}\n";
echo "  Phone: {$business_info['phone']}\n";
echo "  Email: {$business_info['email']}\n";
echo "  Business Hours: {$business_info['hours']}\n";
echo "  Business Type: {$business_info['type']}\n";
echo "\n";

echo "Done! Local SEO is fully configured.\n";
