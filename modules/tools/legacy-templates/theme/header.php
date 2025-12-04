<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <?php wp_head(); ?>
</head>

<body <?php body_class('bg-gray-50 text-gray-900 antialiased'); ?>>
<?php wp_body_open(); ?>

<a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white px-4 py-2 rounded">
    <?php _e('Skip to content', '{{PROJECT_NAME}}-theme'); ?>
</a>

<header class="bg-white shadow-sm sticky top-0 z-50">
    <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16 md:h-20">
            <!-- Logo -->
            <div class="flex-shrink-0">
                <?php if (has_custom_logo()) : ?>
                    <?php the_custom_logo(); ?>
                <?php else : ?>
                    <a href="<?php echo home_url('/'); ?>" class="text-xl font-bold text-primary">
                        <?php bloginfo('name'); ?>
                    </a>
                <?php endif; ?>
            </div>

            <!-- Desktop Navigation -->
            <nav class="hidden md:flex items-center space-x-8" aria-label="<?php esc_attr_e('Primary navigation', '{{PROJECT_NAME}}-theme'); ?>">
                <?php
                wp_nav_menu([
                    'theme_location' => 'primary',
                    'container'      => false,
                    'menu_class'     => 'flex items-center space-x-8',
                    'fallback_cb'    => false,
                    'depth'          => 2,
                ]);
                ?>
            </nav>

            <!-- CTA Button -->
            <div class="hidden md:block">
                <a href="<?php echo home_url('/contact'); ?>" class="inline-flex items-center px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors">
                    <?php _e('Contact Us', '{{PROJECT_NAME}}-theme'); ?>
                </a>
            </div>

            <!-- Mobile Menu Button -->
            <button type="button" class="md:hidden p-2 rounded-lg hover:bg-gray-100" id="mobile-menu-toggle" aria-expanded="false" aria-controls="mobile-menu">
                <span class="sr-only"><?php _e('Open menu', '{{PROJECT_NAME}}-theme'); ?></span>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
    </div>

    <!-- Mobile Navigation -->
    <nav id="mobile-menu" class="hidden md:hidden bg-white border-t" aria-label="<?php esc_attr_e('Mobile navigation', '{{PROJECT_NAME}}-theme'); ?>">
        <div class="container mx-auto px-4 py-4">
            <?php
            wp_nav_menu([
                'theme_location' => 'mobile',
                'container'      => false,
                'menu_class'     => 'space-y-4',
                'fallback_cb'    => false,
            ]);
            ?>
            <div class="pt-4 mt-4 border-t">
                <a href="<?php echo home_url('/contact'); ?>" class="block w-full text-center px-4 py-2 bg-primary text-white font-medium rounded-lg">
                    <?php _e('Contact Us', '{{PROJECT_NAME}}-theme'); ?>
                </a>
            </div>
        </div>
    </nav>
</header>
