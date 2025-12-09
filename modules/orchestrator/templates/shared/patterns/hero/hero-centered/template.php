<?php
/**
 * Hero Centered Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$show_badge = $config['show_badge'] ?? true;
$show_logos = $config['show_logos'] ?? true;
$show_secondary_cta = $config['show_secondary_cta'] ?? true;
$gradient_headline = $config['gradient_headline'] ?? true;
$height_class = match($config['height'] ?? 'tall') {
    'short' => 'min-h-[60vh]',
    'medium' => 'min-h-[75vh]',
    default => 'min-h-[85vh]',
};
?>

<!-- wp:group {"className":"hero-centered <?php echo esc_attr($height_class); ?>","layout":{"type":"constrained"}} -->
<section class="relative <?php echo esc_attr($height_class); ?> flex items-center bg-gradient-to-b from-primary-50 via-white to-white overflow-hidden">
    <!-- Background Elements -->
    <div class="absolute inset-0">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary-200/40 rounded-full blur-3xl"></div>
        <div class="absolute top-20 right-1/4 w-80 h-80 bg-secondary-200/30 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-primary-100/50 to-transparent rounded-full blur-3xl"></div>
        <!-- Dot pattern -->
        <div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px); background-size: 24px 24px;"></div>
    </div>

    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <?php if ($show_badge && !empty($content['badge_text'])): ?>
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full mb-8 animate-fade-in">
            <span class="w-2 h-2 bg-primary-500 rounded-full"></span>
            <span class="text-sm font-medium text-primary-700"><?php echo esc_html($content['badge_text']); ?></span>
            <svg class="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
        </div>
        <?php endif; ?>

        <!-- Headline -->
        <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold text-gray-900 leading-[1.1] mb-8 animate-slide-up">
            <?php echo esc_html($content['headline_line1']); ?>
            <?php if ($gradient_headline && !empty($content['headline_highlight'])): ?>
            <br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-secondary-500 to-primary-600"><?php echo esc_html($content['headline_highlight']); ?></span>
            <?php endif; ?>
        </h1>

        <?php if (!empty($content['subheadline'])): ?>
        <!-- Subheadline -->
        <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up" style="animation-delay: 0.1s;">
            <?php echo esc_html($content['subheadline']); ?>
        </p>
        <?php endif; ?>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style="animation-delay: 0.2s;">
            <a href="<?php echo esc_url($content['cta_primary_url'] ?? '#contact'); ?>"
               class="group inline-flex items-center justify-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-primary-600/25 hover:shadow-xl hover:-translate-y-0.5">
                <?php echo esc_html($content['cta_primary_text']); ?>
                <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
            </a>

            <?php if ($show_secondary_cta && !empty($content['cta_secondary_text'])): ?>
            <a href="<?php echo esc_url($content['cta_secondary_url'] ?? '#demo'); ?>"
               class="inline-flex items-center justify-center px-8 py-4 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold rounded-xl transition-all duration-300 hover:shadow-md">
                <svg class="w-5 h-5 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                </svg>
                <?php echo esc_html($content['cta_secondary_text']); ?>
            </a>
            <?php endif; ?>
        </div>

        <?php if ($show_logos && !empty($content['trusted_logos'])): ?>
        <!-- Trusted By -->
        <div class="animate-fade-in" style="animation-delay: 0.3s;">
            <p class="text-sm text-gray-500 mb-6">Trusted by leading companies</p>
            <div class="flex flex-wrap items-center justify-center gap-8 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <?php foreach ($content['trusted_logos'] as $logo): ?>
                <img src="<?php echo esc_url($logo['url']); ?>"
                     alt="<?php echo esc_attr($logo['alt'] ?? 'Partner logo'); ?>"
                     class="h-8 md:h-10 object-contain">
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>
    </div>
</section>
<!-- /wp:group -->
