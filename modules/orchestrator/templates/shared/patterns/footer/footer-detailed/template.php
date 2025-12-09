<?php
/**
 * Footer Detailed Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'default';
$show_newsletter = $config['show_newsletter'] ?? true;
$show_badges = $config['show_badges'] ?? true;
$show_map = $config['show_map'] ?? false;
$columns = min(max($config['columns'] ?? 5, 3), 6);

$grid_cols_main = "grid-cols-1 md:grid-cols-2 lg:grid-cols-{$columns}";
?>

<!-- wp:group {"className":"footer-detailed","layout":{"type":"constrained"}} -->
<footer class="bg-gray-900 text-white">
    <?php if ($show_newsletter): ?>
    <!-- Newsletter Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-16 relative z-10 pt-16">
        <div class="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 shadow-2xl">
            <div class="max-w-4xl mx-auto text-center">
                <h2 class="text-2xl md:text-3xl font-bold mb-3">
                    <?php echo esc_html($content['newsletter_title']); ?>
                </h2>
                <p class="text-primary-100 mb-8 text-lg">
                    <?php echo esc_html($content['newsletter_description']); ?>
                </p>
                <form class="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                    <input type="email"
                           placeholder="Enter your email address"
                           class="flex-1 px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/50">
                    <button type="submit"
                            class="px-8 py-4 bg-white text-primary-600 hover:bg-gray-100 font-semibold rounded-lg transition-colors shadow-lg">
                        Subscribe
                    </button>
                </form>
                <p class="text-xs text-primary-100 mt-4">
                    We respect your privacy. Unsubscribe at any time.
                </p>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- Main Footer Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 <?php echo $show_newsletter ? 'pt-32' : 'pt-16'; ?> pb-8">
        <div class="grid <?php echo esc_attr($grid_cols_main); ?> gap-8 md:gap-12 mb-12">
            <!-- Brand Column -->
            <div class="<?php echo $columns > 4 ? 'md:col-span-2' : ''; ?>">
                <a href="/" class="inline-block mb-6">
                    <?php if (!empty($content['logo_url'])): ?>
                    <img src="<?php echo esc_url($content['logo_url']); ?>"
                         alt="<?php echo esc_attr($content['logo_alt']); ?>"
                         class="h-10 w-auto brightness-0 invert">
                    <?php else: ?>
                    <span class="text-2xl font-bold"><?php echo esc_html($content['logo_alt']); ?></span>
                    <?php endif; ?>
                </a>
                <?php if (!empty($content['description'])): ?>
                <p class="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
                    <?php echo esc_html($content['description']); ?>
                </p>
                <?php endif; ?>

                <!-- Contact Information -->
                <?php if (!empty($content['contact_info'])): ?>
                <div class="space-y-3">
                    <?php if (!empty($content['contact_info']['phone'])): ?>
                    <div class="flex items-start gap-3 text-gray-400">
                        <svg class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        <a href="tel:<?php echo esc_attr(preg_replace('/[^0-9+]/', '', $content['contact_info']['phone'])); ?>"
                           class="hover:text-white transition-colors">
                            <?php echo esc_html($content['contact_info']['phone']); ?>
                        </a>
                    </div>
                    <?php endif; ?>

                    <?php if (!empty($content['contact_info']['email'])): ?>
                    <div class="flex items-start gap-3 text-gray-400">
                        <svg class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <a href="mailto:<?php echo esc_attr($content['contact_info']['email']); ?>"
                           class="hover:text-white transition-colors">
                            <?php echo esc_html($content['contact_info']['email']); ?>
                        </a>
                    </div>
                    <?php endif; ?>

                    <?php if (!empty($content['contact_info']['address'])): ?>
                    <div class="flex items-start gap-3 text-gray-400">
                        <svg class="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span><?php echo esc_html($content['contact_info']['address']); ?></span>
                    </div>
                    <?php endif; ?>
                </div>
                <?php endif; ?>

                <!-- Social Links -->
                <?php if (!empty($content['social_links'])): ?>
                <div class="flex gap-3 mt-6">
                    <?php foreach ($content['social_links'] as $social): ?>
                    <a href="<?php echo esc_url($social['url']); ?>"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="w-10 h-10 flex items-center justify-center bg-gray-800 hover:bg-primary-600 text-gray-400 hover:text-white rounded-full transition-all"
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
            $display_columns = array_slice($content['nav_columns'], 0, $columns - ($columns > 4 ? 2 : 1));
            foreach ($display_columns as $column):
            ?>
            <div>
                <h3 class="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
                    <?php echo esc_html($column['title']); ?>
                </h3>
                <ul class="space-y-3">
                    <?php foreach ($column['links'] as $link): ?>
                    <li>
                        <a href="<?php echo esc_url($link['url']); ?>"
                           class="text-gray-400 hover:text-white text-sm transition-colors">
                            <?php echo esc_html($link['label']); ?>
                        </a>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <?php endforeach; ?>
        </div>

        <?php if ($show_badges && !empty($content['trust_badges'])): ?>
        <!-- Trust Badges -->
        <div class="flex flex-wrap items-center justify-center gap-8 py-8 border-t border-b border-gray-800 mb-8">
            <?php foreach ($content['trust_badges'] as $badge): ?>
            <img src="<?php echo esc_url($badge['url']); ?>"
                 alt="<?php echo esc_attr($badge['alt'] ?? 'Trust badge'); ?>"
                 class="h-12 md:h-14 object-contain opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <!-- Copyright Bar -->
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-800">
            <p class="text-gray-400 text-sm">
                &copy; <?php echo date('Y'); ?> <?php echo esc_html($content['copyright']); ?>. All rights reserved.
            </p>
            <div class="flex flex-wrap justify-center gap-6">
                <a href="#privacy" class="text-gray-400 hover:text-white text-sm transition-colors">
                    Privacy Policy
                </a>
                <a href="#terms" class="text-gray-400 hover:text-white text-sm transition-colors">
                    Terms of Service
                </a>
                <a href="#cookies" class="text-gray-400 hover:text-white text-sm transition-colors">
                    Cookie Policy
                </a>
                <a href="#accessibility" class="text-gray-400 hover:text-white text-sm transition-colors">
                    Accessibility
                </a>
            </div>
        </div>
    </div>
</footer>
<!-- /wp:group -->
