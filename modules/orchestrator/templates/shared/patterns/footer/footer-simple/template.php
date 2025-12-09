<?php
/**
 * Footer Simple Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? '4-column';
$show_newsletter = $config['show_newsletter'] ?? false;
$show_social = $config['show_social'] ?? true;
$dark_mode = $config['dark_mode'] ?? true;

$columns = $variant === '3-column' ? 3 : 4;
$grid_cols = "grid-cols-1 sm:grid-cols-2 lg:grid-cols-{$columns}";

$bg_class = $dark_mode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900';
$border_class = $dark_mode ? 'border-gray-800' : 'border-gray-200';
$link_color = $dark_mode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-primary-600';
$heading_color = $dark_mode ? 'text-gray-300' : 'text-gray-700';
?>

<!-- wp:group {"className":"footer-simple","layout":{"type":"constrained"}} -->
<footer class="<?php echo esc_attr($bg_class); ?>">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <!-- Main Footer Content -->
        <div class="grid <?php echo esc_attr($grid_cols); ?> gap-8 md:gap-12 mb-12">
            <!-- Brand Column -->
            <div class="<?php echo $columns === 4 ? 'lg:col-span-1' : 'sm:col-span-2'; ?>">
                <a href="/" class="inline-block mb-4">
                    <?php if (!empty($content['logo_url'])): ?>
                    <img src="<?php echo esc_url($content['logo_url']); ?>"
                         alt="<?php echo esc_attr($content['logo_alt']); ?>"
                         class="h-8 w-auto <?php echo $dark_mode ? 'brightness-0 invert' : ''; ?>">
                    <?php else: ?>
                    <span class="text-xl font-bold"><?php echo esc_html($content['logo_alt']); ?></span>
                    <?php endif; ?>
                </a>
                <?php if (!empty($content['tagline'])): ?>
                <p class="<?php echo esc_attr($link_color); ?> text-sm mb-6">
                    <?php echo esc_html($content['tagline']); ?>
                </p>
                <?php endif; ?>

                <?php if ($show_social && !empty($content['social_links'])): ?>
                <!-- Social Links -->
                <div class="flex gap-3">
                    <?php foreach ($content['social_links'] as $social): ?>
                    <a href="<?php echo esc_url($social['url']); ?>"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="w-10 h-10 flex items-center justify-center <?php echo $dark_mode ? 'bg-gray-800 hover:bg-primary-600' : 'bg-white border border-gray-200 hover:bg-primary-600 hover:text-white'; ?> rounded-full transition-colors"
                       aria-label="<?php echo esc_attr($social['platform'] ?? 'Social media'); ?>">
                        <?php
                        $icon_path = match(strtolower($social['platform'] ?? '')) {
                            'facebook' => 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z',
                            'twitter', 'x' => 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z',
                            'instagram' => 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 2h9A5.5 5.5 0 0122 7.5v9a5.5 5.5 0 01-5.5 5.5h-9A5.5 5.5 0 012 16.5v-9A5.5 5.5 0 017.5 2z',
                            'linkedin' => 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z',
                            'youtube' => 'M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z M9.75 15.02l5.75-3.27-5.75-3.27v6.54z',
                            default => 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
                        };
                        ?>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="<?php echo $icon_path; ?>"/>
                        </svg>
                    </a>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </div>

            <!-- Navigation Columns -->
            <?php
            $display_columns = array_slice($content['nav_columns'], 0, $columns - 1);
            foreach ($display_columns as $column):
            ?>
            <div>
                <h3 class="text-sm font-semibold uppercase tracking-wider <?php echo esc_attr($heading_color); ?> mb-4">
                    <?php echo esc_html($column['title']); ?>
                </h3>
                <ul class="space-y-3">
                    <?php foreach ($column['links'] as $link): ?>
                    <li>
                        <a href="<?php echo esc_url($link['url']); ?>"
                           class="<?php echo esc_attr($link_color); ?> text-sm transition-colors">
                            <?php echo esc_html($link['label']); ?>
                        </a>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <?php endforeach; ?>
        </div>

        <?php if ($show_newsletter): ?>
        <!-- Newsletter Signup -->
        <div class="border-t <?php echo esc_attr($border_class); ?> pt-8 mb-8">
            <div class="max-w-md">
                <h3 class="text-lg font-semibold mb-2">Stay Updated</h3>
                <p class="<?php echo esc_attr($link_color); ?> text-sm mb-4">
                    Subscribe to our newsletter for the latest updates and insights.
                </p>
                <form class="flex gap-2">
                    <input type="email"
                           placeholder="Enter your email"
                           class="flex-1 px-4 py-2 <?php echo $dark_mode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'; ?> border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <button type="submit"
                            class="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
                        Subscribe
                    </button>
                </form>
            </div>
        </div>
        <?php endif; ?>

        <!-- Copyright Bar -->
        <div class="border-t <?php echo esc_attr($border_class); ?> pt-8">
            <div class="flex flex-col md:flex-row justify-between items-center gap-4">
                <p class="<?php echo esc_attr($link_color); ?> text-sm">
                    &copy; <?php echo date('Y'); ?> <?php echo esc_html($content['copyright']); ?>. All rights reserved.
                </p>
                <div class="flex gap-6">
                    <a href="#privacy" class="<?php echo esc_attr($link_color); ?> text-sm transition-colors">
                        Privacy Policy
                    </a>
                    <a href="#terms" class="<?php echo esc_attr($link_color); ?> text-sm transition-colors">
                        Terms of Service
                    </a>
                </div>
            </div>
        </div>
    </div>
</footer>
<!-- /wp:group -->
