<?php
/**
 * Hero Fullwidth Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'centered';
$show_tagline = $config['show_tagline'] ?? true;
$show_secondary_cta = $config['show_secondary_cta'] ?? true;
$overlay_opacity = $config['overlay_opacity'] ?? 0.6;
$height_class = match($config['height'] ?? 'tall') {
    'short' => 'min-h-[50vh]',
    'medium' => 'min-h-[70vh]',
    'full' => 'min-h-screen',
    default => 'min-h-[85vh]',
};

$content_alignment = $variant === 'left-aligned' ? 'text-left items-start' : 'text-center items-center';
$cta_alignment = $variant === 'left-aligned' ? 'justify-start' : 'justify-center';
?>

<!-- wp:group {"className":"hero-fullwidth <?php echo esc_attr($height_class); ?>","layout":{"type":"constrained"}} -->
<div class="wp-block-group hero-fullwidth <?php echo esc_attr($height_class); ?> relative flex items-center justify-center">

    <!-- Background Image -->
    <?php if (!empty($content['background_image'])): ?>
        <div class="absolute inset-0">
            <img src="<?php echo esc_url($content['background_image']); ?>"
                 alt="<?php echo esc_attr($content['headline']); ?>"
                 class="w-full h-full object-cover" />
        </div>
    <?php endif; ?>

    <!-- Overlay -->
    <div class="absolute inset-0 bg-primary" style="opacity: <?php echo esc_attr($overlay_opacity); ?>"></div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-20 relative z-10">
        <div class="max-w-4xl <?php echo $variant === 'left-aligned' ? '' : 'mx-auto'; ?> flex flex-col <?php echo esc_attr($content_alignment); ?> space-y-6">

            <?php if ($show_tagline && !empty($content['tagline'])): ?>
                <p class="text-sm font-semibold uppercase tracking-wider text-secondary">
                    <?php echo esc_html($content['tagline']); ?>
                </p>
            <?php endif; ?>

            <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                <?php echo esc_html($content['headline']); ?>
            </h1>

            <?php if (!empty($content['subheadline'])): ?>
                <p class="text-xl lg:text-2xl text-gray-200 max-w-2xl <?php echo $variant === 'left-aligned' ? '' : 'mx-auto'; ?>">
                    <?php echo esc_html($content['subheadline']); ?>
                </p>
            <?php endif; ?>

            <div class="flex flex-col sm:flex-row gap-4 <?php echo esc_attr($cta_alignment); ?> pt-4">
                <a href="<?php echo esc_url($content['cta_primary_url'] ?? '#contact'); ?>"
                   class="inline-flex items-center justify-center px-8 py-4 bg-secondary text-white font-semibold rounded-lg hover:bg-secondary/90 transition-colors">
                    <?php echo esc_html($content['cta_primary_text']); ?>
                </a>

                <?php if ($show_secondary_cta && !empty($content['cta_secondary_text'])): ?>
                    <a href="<?php echo esc_url($content['cta_secondary_url'] ?? '#services'); ?>"
                       class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-colors">
                        <?php echo esc_html($content['cta_secondary_text']); ?>
                    </a>
                <?php endif; ?>
            </div>

        </div>
    </div>

</div>
<!-- /wp:group -->
