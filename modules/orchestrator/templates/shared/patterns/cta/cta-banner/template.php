<?php
/**
 * CTA Banner Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'gradient';
$background_type = $config['background_type'] ?? 'gradient-primary';
$show_secondary = $config['show_secondary_cta'] ?? true;
$overlay_opacity = $config['overlay_opacity'] ?? 60;
$background_image = $content['background_image'] ?? '';

$section_class = match($variant) {
    'image-bg' => 'relative py-20 lg:py-28 bg-gray-900 overflow-hidden',
    'solid' => 'relative py-20 lg:py-28 bg-primary-600 overflow-hidden',
    default => 'relative py-20 lg:py-28 bg-gradient-to-br from-primary-600 to-primary-800 overflow-hidden',
};
?>

<!-- wp:group {"className":"cta-banner","layout":{"type":"constrained"}} -->
<section class="<?php echo esc_attr($section_class); ?>">
    <?php if ($variant === 'image-bg' && !empty($background_image)): ?>
    <!-- Background Image -->
    <div class="absolute inset-0">
        <img src="<?php echo esc_url($background_image); ?>"
             alt=""
             class="w-full h-full object-cover"
             loading="lazy" />
        <div class="absolute inset-0 bg-black" style="opacity: <?php echo esc_attr($overlay_opacity / 100); ?>"></div>
    </div>
    <?php endif; ?>

    <!-- Decorative Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
    </div>

    <div class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-6">
            <?php echo esc_html($content['headline']); ?>
        </h2>

        <?php if (!empty($content['subtext'])): ?>
        <p class="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10">
            <?php echo esc_html($content['subtext']); ?>
        </p>
        <?php endif; ?>

        <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="<?php echo esc_url($content['primary_cta_url']); ?>"
               class="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-50 transition-colors shadow-xl">
                <?php echo esc_html($content['primary_cta_text']); ?>
                <svg class="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </a>

            <?php if ($show_secondary && !empty($content['secondary_cta_text'])): ?>
            <a href="<?php echo esc_url($content['secondary_cta_url']); ?>"
               class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
                <?php echo esc_html($content['secondary_cta_text']); ?>
            </a>
            <?php endif; ?>
        </div>
    </div>
</section>
<!-- /wp:group -->
