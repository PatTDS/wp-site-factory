<?php
/**
 * Anywhere Solutions Theme Functions
 *
 * @package anywhere_solutions-theme
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define theme constants
define('ANYWHERE_SOLUTIONS_THEME_VERSION', '1.0.0');
define('ANYWHERE_SOLUTIONS_THEME_DIR', get_template_directory());
define('ANYWHERE_SOLUTIONS_THEME_URI', get_template_directory_uri());

/**
 * Theme Setup
 */
function anywhere_solutions_theme_setup() {
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
        'primary'   => __('Primary Menu', 'anywhere_solutions-theme'),
        'footer'    => __('Footer Menu', 'anywhere_solutions-theme'),
        'mobile'    => __('Mobile Menu', 'anywhere_solutions-theme'),
    ]);

    // Add image sizes
    add_image_size('hero', 1920, 1080, true);
    add_image_size('card', 600, 400, true);
    add_image_size('thumbnail-small', 150, 150, true);
}
add_action('after_setup_theme', 'anywhere_solutions_theme_setup');

/**
 * Enqueue Scripts and Styles
 */
function anywhere_solutions_enqueue_assets() {
    // Main stylesheet
    wp_enqueue_style(
        'anywhere_solutions-style',
        get_stylesheet_uri(),
        [],
        ANYWHERE_SOLUTIONS_THEME_VERSION
    );

    // Tailwind CSS
    wp_enqueue_style(
        'anywhere_solutions-tailwind',
        ANYWHERE_SOLUTIONS_THEME_URI . '/assets/css/main.css',
        [],
        ANYWHERE_SOLUTIONS_THEME_VERSION
    );

    // Main JavaScript
    wp_enqueue_script(
        'anywhere_solutions-script',
        ANYWHERE_SOLUTIONS_THEME_URI . '/assets/js/main.js',
        [],
        ANYWHERE_SOLUTIONS_THEME_VERSION,
        true
    );

    // Dequeue unnecessary WordPress styles
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('classic-theme-styles');
}
add_action('wp_enqueue_scripts', 'anywhere_solutions_enqueue_assets');

/**
 * Register Widget Areas
 */
function anywhere_solutions_widgets_init() {
    register_sidebar([
        'name'          => __('Footer Widget 1', 'anywhere_solutions-theme'),
        'id'            => 'footer-1',
        'description'   => __('Footer widget area 1', 'anywhere_solutions-theme'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ]);

    register_sidebar([
        'name'          => __('Footer Widget 2', 'anywhere_solutions-theme'),
        'id'            => 'footer-2',
        'description'   => __('Footer widget area 2', 'anywhere_solutions-theme'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ]);
}
add_action('widgets_init', 'anywhere_solutions_widgets_init');

/**
 * Remove unnecessary WordPress features
 */
function anywhere_solutions_cleanup() {
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
add_action('after_setup_theme', 'anywhere_solutions_cleanup');

/**
 * Defer non-critical JavaScript
 */
function anywhere_solutions_defer_scripts($tag, $handle) {
    if (is_admin()) {
        return $tag;
    }

    $defer_scripts = ['anywhere_solutions-script'];

    if (in_array($handle, $defer_scripts)) {
        return str_replace(' src', ' defer src', $tag);
    }

    return $tag;
}
add_filter('script_loader_tag', 'anywhere_solutions_defer_scripts', 10, 2);

/**
 * Custom excerpt length
 */
function anywhere_solutions_excerpt_length($length) {
    return 25;
}
add_filter('excerpt_length', 'anywhere_solutions_excerpt_length');

/**
 * Custom excerpt more
 */
function anywhere_solutions_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'anywhere_solutions_excerpt_more');

/**
 * Theme helper functions
 */
require_once ANYWHERE_SOLUTIONS_THEME_DIR . '/inc/helpers.php';
