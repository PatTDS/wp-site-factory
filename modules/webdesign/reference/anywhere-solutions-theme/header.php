<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <!-- Google Fonts: Inter (body) + Poppins (headings) -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@500;600;700;800&display=swap" rel="stylesheet">
    <?php wp_head(); ?>
</head>

<body <?php body_class('bg-gray-50 text-gray-900 antialiased'); ?>>
<?php wp_body_open(); ?>

<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded">
    <?php _e('Skip to content', 'anywhere_solutions-theme'); ?>
</a>

<header class="bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-18 md:h-20">
            <!-- Logo -->
            <div class="flex-shrink-0">
                <?php if (has_custom_logo()) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <a href="<?php echo home_url('/'); ?>" class="flex items-center gap-2 group">
                        <div class="w-10 h-10 bg-gradient-to-br from-primary-700 to-primary-900 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                            <span class="text-white font-bold text-lg">A</span>
                        </div>
                        <div class="hidden sm:block">
                            <span class="text-xl font-heading font-bold text-primary-800"><?php bloginfo('name'); ?></span>
                        </div>
                    </a>
                <?php endif; ?>
            </div>

            <!-- Desktop Navigation -->
            <nav class="hidden lg:flex items-center space-x-1" aria-label="<?php esc_attr_e('Primary navigation', 'anywhere_solutions-theme'); ?>">
                <?php
                wp_nav_menu([
                    'theme_location' => 'primary',
                    'container'      => false,
                    'menu_class'     => 'flex items-center space-x-1',
                    'fallback_cb'    => false,
                    'depth'          => 2,
                    'link_before'    => '<span class="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-700 hover:bg-primary-50 font-medium transition-colors inline-block">',
                    'link_after'     => '</span>',
                ]);
                ?>
            </nav>

            <!-- CTA Buttons -->
            <div class="hidden lg:flex items-center gap-3">
                <a href="tel:+61893456789" class="flex items-center gap-2 text-gray-600 hover:text-primary-700 font-medium transition-colors">
                    <svg class="w-5 h-5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span class="hidden xl:inline">(08) 9345 6789</span>
                </a>
                <a href="<?php echo home_url('/contact'); ?>" class="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5">
                    Get Quote
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                </a>
            </div>

            <!-- Mobile Menu Button -->
            <button type="button" class="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors" id="mobile-menu-toggle" aria-expanded="false" aria-controls="mobile-menu">
                <span class="sr-only"><?php _e('Open menu', 'anywhere_solutions-theme'); ?></span>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
    </div>

    <!-- Mobile Navigation -->
    <nav id="mobile-menu" class="hidden lg:hidden bg-white border-t border-gray-100" aria-label="<?php esc_attr_e('Mobile navigation', 'anywhere_solutions-theme'); ?>">
        <div class="max-w-7xl mx-auto px-4 py-4">
            <?php
            wp_nav_menu([
                'theme_location' => 'mobile',
                'container'      => false,
                'menu_class'     => 'space-y-1',
                'fallback_cb'    => false,
                'link_before'    => '<span class="block px-4 py-3 rounded-lg text-gray-700 hover:text-primary-700 hover:bg-primary-50 font-medium transition-colors">',
                'link_after'     => '</span>',
            ]);
            ?>
            <div class="pt-4 mt-4 border-t border-gray-100 space-y-3">
                <a href="tel:+61893456789" class="flex items-center justify-center gap-2 px-4 py-3 text-gray-700 bg-gray-50 rounded-xl font-medium">
                    <svg class="w-5 h-5 text-secondary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    (08) 9345 6789
                </a>
                <a href="<?php echo home_url('/contact'); ?>" class="block w-full text-center px-4 py-3 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-semibold rounded-xl">
                    Get a Quote
                </a>
            </div>
        </div>
    </nav>
</header>
