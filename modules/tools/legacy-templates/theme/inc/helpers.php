<?php
/**
 * Theme Helper Functions
 *
 * @package {{PROJECT_NAME}}-theme
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get theme option with fallback
 */
function {{PROJECT_NAME}}_get_option($key, $default = '') {
    $options = get_option('{{PROJECT_NAME}}_options', []);
    return isset($options[$key]) ? $options[$key] : $default;
}

/**
 * Get social media links
 */
function {{PROJECT_NAME}}_get_social_links() {
    return [
        'facebook'  => {{PROJECT_NAME}}_get_option('facebook_url'),
        'instagram' => {{PROJECT_NAME}}_get_option('instagram_url'),
        'whatsapp'  => {{PROJECT_NAME}}_get_option('whatsapp_url'),
        'linkedin'  => {{PROJECT_NAME}}_get_option('linkedin_url'),
    ];
}

/**
 * Get contact information
 */
function {{PROJECT_NAME}}_get_contact_info() {
    return [
        'phone'   => {{PROJECT_NAME}}_get_option('phone', '{{PHONE}}'),
        'email'   => {{PROJECT_NAME}}_get_option('email', '{{EMAIL}}'),
        'address' => {{PROJECT_NAME}}_get_option('address', '{{ADDRESS}}, {{CITY}}, {{STATE}}'),
        'hours'   => {{PROJECT_NAME}}_get_option('hours', '{{HOURS}}'),
    ];
}

/**
 * Output SVG icon
 */
function {{PROJECT_NAME}}_icon($name, $class = 'w-6 h-6') {
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
function {{PROJECT_NAME}}_truncate($text, $length = 100, $append = '...') {
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
function {{PROJECT_NAME}}_format_phone($phone) {
    return preg_replace('/[^0-9+]/', '', $phone);
}

/**
 * Check if current page is specific template
 */
function {{PROJECT_NAME}}_is_page_template($template) {
    return is_page_template('templates/' . $template . '.php');
}
