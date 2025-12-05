<?php
/**
 * Hero Split Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'image-right';
$show_tagline = $config['show_tagline'] ?? true;
$show_secondary_cta = $config['show_secondary_cta'] ?? true;
$height_class = match($config['height'] ?? 'medium') {
    'short' => 'min-h-[50vh]',
    'tall' => 'min-h-[90vh]',
    default => 'min-h-[70vh]',
};

$image_order = $variant === 'image-left' ? 'lg:order-first' : 'lg:order-last';
?>

<!-- wp:group {"className":"hero-split <?php echo esc_attr($height_class); ?>","layout":{"type":"constrained"}} -->
<div class="wp-block-group hero-split <?php echo esc_attr($height_class); ?> flex items-center">
    <div class="container mx-auto px-4 py-16 lg:py-24">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            <!-- Content Side -->
            <div class="space-y-6 lg:space-y-8">
                <?php if ($show_tagline && !empty($content['tagline'])): ?>
                    <p class="text-sm font-semibold uppercase tracking-wider text-secondary">
                        <?php echo esc_html($content['tagline']); ?>
                    </p>
                <?php endif; ?>

                <h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-primary leading-tight">
                    <?php echo esc_html($content['headline']); ?>
                </h1>

                <?php if (!empty($content['subheadline'])): ?>
                    <p class="text-lg lg:text-xl text-gray-600 max-w-xl">
                        <?php echo esc_html($content['subheadline']); ?>
                    </p>
                <?php endif; ?>

                <div class="flex flex-col sm:flex-row gap-4 pt-4">
                    <a href="<?php echo esc_url($content['cta_primary_url'] ?? '#contact'); ?>"
                       class="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors text-center">
                        <?php echo esc_html($content['cta_primary_text']); ?>
                    </a>

                    <?php if ($show_secondary_cta && !empty($content['cta_secondary_text'])): ?>
                        <a href="<?php echo esc_url($content['cta_secondary_url'] ?? '#services'); ?>"
                           class="inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors text-center">
                            <?php echo esc_html($content['cta_secondary_text']); ?>
                        </a>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Image Side -->
            <div class="<?php echo esc_attr($image_order); ?>">
                <div class="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl">
                    <?php if (!empty($content['background_image'])): ?>
                        <img src="<?php echo esc_url($content['background_image']); ?>"
                             alt="<?php echo esc_attr($content['headline']); ?>"
                             class="absolute inset-0 w-full h-full object-cover" />
                    <?php else: ?>
                        <div class="absolute inset-0 bg-gradient-to-br from-primary to-secondary"></div>
                    <?php endif; ?>
                </div>
            </div>

        </div>
    </div>
</div>
<!-- /wp:group -->
