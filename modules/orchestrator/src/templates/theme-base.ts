import type { ProjectConfig } from "../types/project.js";

// Base WordPress theme templates
export const generateStyleCss = (config: ProjectConfig): string => `/*
Theme Name: ${config.companyName} Theme
Theme URI: https://wpf.dev
Author: WPF Platform
Description: Custom theme for ${config.companyName}
Version: 1.0.0
License: GNU General Public License v2 or later
Text Domain: ${config.slug}-theme
*/

/* This file is intentionally minimal - styles are in Tailwind CSS */
`;

export const generateFunctionsPhp = (config: ProjectConfig): string => `<?php
/**
 * ${config.companyName} Theme Functions
 *
 * @package ${config.slug}_theme
 */

if (!defined('ABSPATH')) {
    exit;
}

// Theme constants
define('${config.slug.toUpperCase()}_THEME_VERSION', '1.0.0');
define('${config.slug.toUpperCase()}_THEME_DIR', get_template_directory());
define('${config.slug.toUpperCase()}_THEME_URI', get_template_directory_uri());

/**
 * Theme Setup
 */
function ${config.slug}_theme_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ));

    // Register navigation menus
    register_nav_menus(array(
        'primary'   => __('Primary Menu', '${config.slug}-theme'),
        'footer'    => __('Footer Menu', '${config.slug}-theme'),
    ));
}
add_action('after_setup_theme', '${config.slug}_theme_setup');

/**
 * Enqueue Scripts and Styles
 */
function ${config.slug}_theme_scripts() {
    // Main stylesheet (Tailwind CSS)
    wp_enqueue_style(
        '${config.slug}-style',
        get_template_directory_uri() . '/dist/style.css',
        array(),
        ${config.slug.toUpperCase()}_THEME_VERSION
    );

    // Main script
    wp_enqueue_script(
        '${config.slug}-script',
        get_template_directory_uri() . '/dist/main.js',
        array(),
        ${config.slug.toUpperCase()}_THEME_VERSION,
        true
    );
}
add_action('wp_enqueue_scripts', '${config.slug}_theme_scripts');

/**
 * Register Widget Areas
 */
function ${config.slug}_widgets_init() {
    register_sidebar(array(
        'name'          => __('Footer Widget Area', '${config.slug}-theme'),
        'id'            => 'footer-1',
        'description'   => __('Add widgets here to appear in the footer.', '${config.slug}-theme'),
        'before_widget' => '<div class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ));
}
add_action('widgets_init', '${config.slug}_widgets_init');

/**
 * Custom Excerpt Length
 */
function ${config.slug}_excerpt_length($length) {
    return 20;
}
add_filter('excerpt_length', '${config.slug}_excerpt_length');

/**
 * Add custom colors to Gutenberg
 */
function ${config.slug}_gutenberg_colors() {
    add_theme_support('editor-color-palette', array(
        array(
            'name'  => __('Primary', '${config.slug}-theme'),
            'slug'  => 'primary',
            'color' => '${config.primaryColor}',
        ),
        array(
            'name'  => __('Secondary', '${config.slug}-theme'),
            'slug'  => 'secondary',
            'color' => '${config.secondaryColor}',
        ),
        array(
            'name'  => __('White', '${config.slug}-theme'),
            'slug'  => 'white',
            'color' => '#ffffff',
        ),
        array(
            'name'  => __('Black', '${config.slug}-theme'),
            'slug'  => 'black',
            'color' => '#000000',
        ),
    ));
}
add_action('after_setup_theme', '${config.slug}_gutenberg_colors');
`;

export const generateIndexPhp = (config: ProjectConfig): string => `<?php
/**
 * Main Template
 *
 * @package ${config.slug}_theme
 */

get_header();
?>

<main id="main" class="site-main">
    <?php if (have_posts()) : ?>
        <div class="container mx-auto px-4 py-12">
            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <?php while (have_posts()) : the_post(); ?>
                    <article <?php post_class('bg-white rounded-lg shadow-md overflow-hidden'); ?>>
                        <?php if (has_post_thumbnail()) : ?>
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('medium_large', array('class' => 'w-full h-48 object-cover')); ?>
                            </a>
                        <?php endif; ?>
                        <div class="p-6">
                            <h2 class="text-xl font-semibold mb-2">
                                <a href="<?php the_permalink(); ?>" class="hover:text-primary">
                                    <?php the_title(); ?>
                                </a>
                            </h2>
                            <div class="text-gray-600 text-sm mb-4">
                                <?php the_excerpt(); ?>
                            </div>
                            <a href="<?php the_permalink(); ?>" class="text-primary font-medium hover:underline">
                                <?php _e('Read More', '${config.slug}-theme'); ?> &rarr;
                            </a>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>

            <?php the_posts_pagination(array(
                'mid_size' => 2,
                'prev_text' => '&larr;',
                'next_text' => '&rarr;',
            )); ?>
        </div>
    <?php else : ?>
        <div class="container mx-auto px-4 py-12 text-center">
            <h1 class="text-2xl font-bold mb-4"><?php _e('Nothing Found', '${config.slug}-theme'); ?></h1>
            <p class="text-gray-600"><?php _e('Sorry, no posts matched your criteria.', '${config.slug}-theme'); ?></p>
        </div>
    <?php endif; ?>
</main>

<?php
get_footer();
`;

export const generateHeaderPhp = (config: ProjectConfig): string => `<?php
/**
 * Header Template
 *
 * @package ${config.slug}_theme
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <div class="flex-shrink-0">
                <?php if (has_custom_logo()) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <a href="<?php echo esc_url(home_url('/')); ?>" class="text-xl font-bold" style="color: ${config.primaryColor}">
                        <?php bloginfo('name'); ?>
                    </a>
                <?php endif; ?>
            </div>

            <!-- Navigation -->
            <nav class="hidden md:flex items-center space-x-8">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container'      => false,
                    'menu_class'     => 'flex items-center space-x-8',
                    'fallback_cb'    => false,
                    'depth'          => 2,
                ));
                ?>
            </nav>

            <!-- CTA Button -->
            <div class="hidden md:block">
                <a href="<?php echo esc_url(home_url('/contact')); ?>"
                   class="inline-flex items-center px-4 py-2 rounded-md text-white font-medium transition-colors"
                   style="background-color: ${config.primaryColor}">
                    <?php _e('Contact Us', '${config.slug}-theme'); ?>
                </a>
            </div>

            <!-- Mobile Menu Button -->
            <button class="md:hidden p-2" id="mobile-menu-toggle" aria-label="Toggle menu">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
            </button>
        </div>
    </div>

    <!-- Mobile Menu -->
    <div class="md:hidden hidden" id="mobile-menu">
        <div class="px-4 py-4 space-y-2 bg-gray-50">
            <?php
            wp_nav_menu(array(
                'theme_location' => 'primary',
                'container'      => false,
                'menu_class'     => 'space-y-2',
                'fallback_cb'    => false,
            ));
            ?>
            <a href="<?php echo esc_url(home_url('/contact')); ?>"
               class="block px-4 py-2 rounded-md text-white font-medium text-center"
               style="background-color: ${config.primaryColor}">
                <?php _e('Contact Us', '${config.slug}-theme'); ?>
            </a>
        </div>
    </div>
</header>
`;

export const generateFooterPhp = (config: ProjectConfig): string => `<?php
/**
 * Footer Template
 *
 * @package ${config.slug}_theme
 */
?>

<footer class="bg-gray-900 text-white">
    <div class="container mx-auto px-4 py-12">
        <div class="grid gap-8 md:grid-cols-4">
            <!-- Company Info -->
            <div class="md:col-span-2">
                <h3 class="text-xl font-bold mb-4"><?php bloginfo('name'); ?></h3>
                <p class="text-gray-400 mb-4">
                    <?php bloginfo('description'); ?>
                </p>
                <?php if (!empty('${config.address}')) : ?>
                    <p class="text-gray-400">
                        ${config.address || ""}<br>
                        ${config.city || ""}, ${config.state || ""}
                    </p>
                <?php endif; ?>
            </div>

            <!-- Quick Links -->
            <div>
                <h4 class="text-lg font-semibold mb-4"><?php _e('Quick Links', '${config.slug}-theme'); ?></h4>
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'footer',
                    'container'      => false,
                    'menu_class'     => 'space-y-2',
                    'fallback_cb'    => false,
                ));
                ?>
            </div>

            <!-- Contact Info -->
            <div>
                <h4 class="text-lg font-semibold mb-4"><?php _e('Contact', '${config.slug}-theme'); ?></h4>
                <ul class="space-y-2 text-gray-400">
                    <?php if (!empty('${config.phone}')) : ?>
                        <li>
                            <a href="tel:${config.phone || ""}" class="hover:text-white">
                                ${config.phone || ""}
                            </a>
                        </li>
                    <?php endif; ?>
                    <?php if (!empty('${config.email}')) : ?>
                        <li>
                            <a href="mailto:${config.email || ""}" class="hover:text-white">
                                ${config.email || ""}
                            </a>
                        </li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>

        <!-- Copyright -->
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>
                &copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>.
                <?php _e('All rights reserved.', '${config.slug}-theme'); ?>
            </p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
`;

export const generateTailwindConfig = (config: ProjectConfig): string => `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './**/*.php',
    './src/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '${config.primaryColor}',
          50: '${config.primaryColor}10',
          100: '${config.primaryColor}20',
          500: '${config.primaryColor}',
          600: '${config.primaryColor}',
          700: '${config.primaryColor}',
        },
        secondary: {
          DEFAULT: '${config.secondaryColor}',
          500: '${config.secondaryColor}',
          600: '${config.secondaryColor}',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
`;

export const generatePackageJson = (config: ProjectConfig): string =>
  JSON.stringify(
    {
      name: `${config.slug}-theme`,
      version: "1.0.0",
      scripts: {
        build: "npx tailwindcss -i ./src/input.css -o ./dist/style.css --minify",
        watch: "npx tailwindcss -i ./src/input.css -o ./dist/style.css --watch",
      },
      devDependencies: {
        tailwindcss: "^3.4.0",
      },
    },
    null,
    2
  );

export const generateInputCss = (): string => `@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
@layer base {
  body {
    @apply antialiased text-gray-900;
  }

  a {
    @apply transition-colors duration-200;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-bold leading-tight;
  }
}

/* Custom component styles */
@layer components {
  .btn-primary {
    @apply inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-md hover:opacity-90 transition-opacity;
  }

  .btn-secondary {
    @apply inline-flex items-center px-4 py-2 bg-secondary text-white font-medium rounded-md hover:opacity-90 transition-opacity;
  }

  .btn-outline {
    @apply inline-flex items-center px-4 py-2 border border-primary text-primary font-medium rounded-md hover:bg-primary hover:text-white transition-colors;
  }
}
`;
