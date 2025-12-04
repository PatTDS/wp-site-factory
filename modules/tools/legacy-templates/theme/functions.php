<?php
/**
 * {{COMPANY_NAME}} Theme Functions
 *
 * @package {{PROJECT_NAME}}-theme
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define theme constants
define('{{PROJECT_NAME_UPPER}}_THEME_VERSION', '1.0.0');
define('{{PROJECT_NAME_UPPER}}_THEME_DIR', get_template_directory());
define('{{PROJECT_NAME_UPPER}}_THEME_URI', get_template_directory_uri());

/**
 * Theme Setup
 */
function {{PROJECT_NAME}}_theme_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', [
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ]);
    add_theme_support('custom-logo', [
        'height'      => 100,
        'width'       => 300,
        'flex-height' => true,
        'flex-width'  => true,
    ]);

    // Register navigation menus
    register_nav_menus([
        'primary'   => __('Primary Menu', '{{PROJECT_NAME}}-theme'),
        'footer'    => __('Footer Menu', '{{PROJECT_NAME}}-theme'),
        'mobile'    => __('Mobile Menu', '{{PROJECT_NAME}}-theme'),
    ]);

    // Add image sizes
    add_image_size('hero', 1920, 1080, true);
    add_image_size('card', 600, 400, true);
    add_image_size('thumbnail-small', 150, 150, true);
}
add_action('after_setup_theme', '{{PROJECT_NAME}}_theme_setup');

/**
 * Enqueue Scripts and Styles
 */
function {{PROJECT_NAME}}_enqueue_assets() {
    // Main stylesheet
    wp_enqueue_style(
        '{{PROJECT_NAME}}-style',
        get_stylesheet_uri(),
        [],
        {{PROJECT_NAME_UPPER}}_THEME_VERSION
    );

    // Tailwind CSS
    wp_enqueue_style(
        '{{PROJECT_NAME}}-tailwind',
        {{PROJECT_NAME_UPPER}}_THEME_URI . '/assets/css/main.css',
        [],
        {{PROJECT_NAME_UPPER}}_THEME_VERSION
    );

    // Main JavaScript
    wp_enqueue_script(
        '{{PROJECT_NAME}}-script',
        {{PROJECT_NAME_UPPER}}_THEME_URI . '/assets/js/main.js',
        [],
        {{PROJECT_NAME_UPPER}}_THEME_VERSION,
        true
    );

    // Dequeue unnecessary WordPress styles
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('classic-theme-styles');
}
add_action('wp_enqueue_scripts', '{{PROJECT_NAME}}_enqueue_assets');

/**
 * Register Widget Areas
 */
function {{PROJECT_NAME}}_widgets_init() {
    register_sidebar([
        'name'          => __('Footer Widget 1', '{{PROJECT_NAME}}-theme'),
        'id'            => 'footer-1',
        'description'   => __('Footer widget area 1', '{{PROJECT_NAME}}-theme'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ]);

    register_sidebar([
        'name'          => __('Footer Widget 2', '{{PROJECT_NAME}}-theme'),
        'id'            => 'footer-2',
        'description'   => __('Footer widget area 2', '{{PROJECT_NAME}}-theme'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ]);
}
add_action('widgets_init', '{{PROJECT_NAME}}_widgets_init');

/**
 * Remove unnecessary WordPress features
 */
function {{PROJECT_NAME}}_cleanup() {
    // Remove emoji scripts
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');

    // Remove WordPress version
    remove_action('wp_head', 'wp_generator');

    // Remove RSD link
    remove_action('wp_head', 'rsd_link');

    // Remove wlwmanifest link
    remove_action('wp_head', 'wlwmanifest_link');

    // Remove shortlink
    remove_action('wp_head', 'wp_shortlink_wp_head');
}
add_action('after_setup_theme', '{{PROJECT_NAME}}_cleanup');

/**
 * Defer non-critical JavaScript
 */
function {{PROJECT_NAME}}_defer_scripts($tag, $handle) {
    if (is_admin()) {
        return $tag;
    }

    $defer_scripts = ['{{PROJECT_NAME}}-script'];

    if (in_array($handle, $defer_scripts)) {
        return str_replace(' src', ' defer src', $tag);
    }

    return $tag;
}
add_filter('script_loader_tag', '{{PROJECT_NAME}}_defer_scripts', 10, 2);

/**
 * Custom excerpt length
 */
function {{PROJECT_NAME}}_excerpt_length($length) {
    return 25;
}
add_filter('excerpt_length', '{{PROJECT_NAME}}_excerpt_length');

/**
 * Custom excerpt more
 */
function {{PROJECT_NAME}}_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', '{{PROJECT_NAME}}_excerpt_more');

/**
 * Theme helper functions
 */
require_once {{PROJECT_NAME_UPPER}}_THEME_DIR . '/inc/helpers.php';
