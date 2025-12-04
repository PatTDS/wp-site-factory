<?php
/**
 * Theme Helper Functions
 *
 * @package anywhere_solutions-theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get theme option with fallback
 */
function anywhere_solutions_get_option($key, $default = '') {
    $options = get_option('anywhere_solutions_options', []);
    return isset($options[$key]) ? $options[$key] : $default;
}

/**
 * Get social media links
 */
function anywhere_solutions_get_social_links() {
    return [
        'facebook'  => anywhere_solutions_get_option('facebook_url'),
        'instagram' => anywhere_solutions_get_option('instagram_url'),
        'whatsapp'  => anywhere_solutions_get_option('whatsapp_url'),
        'linkedin'  => anywhere_solutions_get_option('linkedin_url'),
    ];
}

/**
 * Get contact information
 */
function anywhere_solutions_get_contact_info() {
    return [
        'phone'   => anywhere_solutions_get_option('phone', '{{PHONE}}'),
        'email'   => anywhere_solutions_get_option('email', '{{EMAIL}}'),
        'address' => anywhere_solutions_get_option('address', '{{ADDRESS}}, {{CITY}}, {{STATE}}'),
        'hours'   => anywhere_solutions_get_option('hours', '{{HOURS}}'),
    ];
}

/**
 * Output SVG icon
 */
function anywhere_solutions_icon($name, $class = 'w-6 h-6') {
    $icons = [
        'phone' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>',
        'email' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>',
        'location' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>',
        'clock' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
        'check' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>',
        'arrow-right' => '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>',
    ];

    if (!isset($icons[$name])) {
        return '';
    }

    return sprintf(
        '<svg class="%s" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">%s</svg>',
        esc_attr($class),
        $icons[$name]
    );
}

/**
 * Truncate text
 */
function anywhere_solutions_truncate($text, $length = 100, $append = '...') {
    if (strlen($text) <= $length) {
        return $text;
    }

    $text = substr($text, 0, $length);
    $text = substr($text, 0, strrpos($text, ' '));

    return $text . $append;
}

/**
 * Format phone number for tel: links
 */
function anywhere_solutions_format_phone($phone) {
    return preg_replace('/[^0-9+]/', '', $phone);
}

/**
 * Check if current page is specific template
 */
function anywhere_solutions_is_page_template($template) {
    return is_page_template('templates/' . $template . '.php');
}

/**
 * Calculate reading time for a post
 *
 * @param int $post_id Post ID (optional, uses current post if not provided)
 * @return int Estimated reading time in minutes
 */
function reading_time($post_id = null) {
    if ($post_id === null) {
        $post_id = get_the_ID();
    }

    $content = get_post_field('post_content', $post_id);
    $word_count = str_word_count(strip_tags($content));
    $reading_time = ceil($word_count / 200); // Average reading speed: 200 words/minute

    return max(1, $reading_time); // Minimum 1 minute
}

/**
 * Get primary brand color
 */
function anywhere_solutions_primary_color() {
    return '#1e40af'; // Blue
}

/**
 * Get secondary brand color
 */
function anywhere_solutions_secondary_color() {
    return '#f97316'; // Orange
}
