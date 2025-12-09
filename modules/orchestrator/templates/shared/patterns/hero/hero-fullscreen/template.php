<?php
/**
 * Hero Fullscreen Image Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'left-align';
$show_scroll = $config['show_scroll_indicator'] ?? true;
$show_secondary_cta = $config['show_secondary_cta'] ?? true;
$overlay_class = match($config['overlay_darkness'] ?? 'medium') {
    'light' => 'from-black/50 via-black/30 to-transparent',
    'dark' => 'from-black/80 via-black/60 to-black/20',
    default => 'from-black/70 via-black/50 to-transparent',
};

$content_align = match($variant) {
    'bottom-align' => 'items-end pb-32',
    default => 'items-center',
};

$text_align = match($variant) {
    'bottom-align' => 'text-center mx-auto',
    default => '',
};
?>

<!-- wp:group {"className":"hero-fullscreen","layout":{"type":"constrained"}} -->
<section class="relative min-h-screen flex <?php echo esc_attr($content_align); ?> overflow-hidden">
    <!-- Background Image -->
    <div class="absolute inset-0">
        <?php if (!empty($content['background_image'])): ?>
        <img src="<?php echo esc_url($content['background_image']); ?>"
             alt="<?php echo esc_attr($content['image_alt'] ?? $content['headline']); ?>"
             class="w-full h-full object-cover">
        <?php else: ?>
        <div class="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900"></div>
        <?php endif; ?>
        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-r <?php echo esc_attr($overlay_class); ?>"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
    </div>

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div class="max-w-2xl <?php echo esc_attr($text_align); ?>">
            <!-- Accent Line -->
            <div class="w-20 h-1 bg-secondary-500 mb-8 animate-fade-in <?php echo $variant === 'bottom-align' ? 'mx-auto' : ''; ?>"></div>

            <!-- Headline -->
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white leading-[1.1] mb-6 animate-slide-up">
                <?php echo esc_html($content['headline']); ?>
            </h1>

            <?php if (!empty($content['subheadline'])): ?>
            <!-- Subheadline -->
            <p class="text-lg md:text-xl text-white/80 mb-10 leading-relaxed max-w-lg animate-slide-up <?php echo $variant === 'bottom-align' ? 'mx-auto' : ''; ?>" style="animation-delay: 0.1s;">
                <?php echo esc_html($content['subheadline']); ?>
            </p>
            <?php endif; ?>

            <!-- CTAs -->
            <div class="flex flex-col sm:flex-row gap-4 animate-slide-up <?php echo $variant === 'bottom-align' ? 'justify-center' : ''; ?>" style="animation-delay: 0.2s;">
                <a href="<?php echo esc_url($content['cta_primary_url'] ?? '#contact'); ?>"
                   class="group inline-flex items-center justify-center px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl">
                    <?php echo esc_html($content['cta_primary_text']); ?>
                    <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                </a>

                <?php if ($show_secondary_cta && !empty($content['cta_secondary_text'])): ?>
                <a href="<?php echo esc_url($content['cta_secondary_url'] ?? '#about'); ?>"
                   class="inline-flex items-center justify-center px-8 py-4 border-2 border-white/50 hover:border-white hover:bg-white/10 text-white font-semibold rounded-lg transition-all duration-300">
                    <?php echo esc_html($content['cta_secondary_text']); ?>
                </a>
                <?php endif; ?>
            </div>
        </div>
    </div>

    <?php if ($show_scroll): ?>
    <!-- Scroll Indicator -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div class="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div class="w-1 h-3 bg-white rounded-full animate-pulse"></div>
        </div>
    </div>
    <?php endif; ?>
</section>
<!-- /wp:group -->
