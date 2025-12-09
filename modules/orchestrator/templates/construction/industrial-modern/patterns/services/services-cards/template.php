<?php
/**
 * Services Cards Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'alternating';
$show_numbering = $config['show_numbering'] ?? true;
$show_cta = $config['show_cta'] ?? true;
$image_aspect = match($config['image_aspect'] ?? 'landscape') {
    'square' => 'aspect-square',
    'portrait' => 'aspect-[3/4]',
    default => 'aspect-[4/3]',
};

$services = $content['services'] ?? [];
?>

<!-- wp:group {"className":"services-cards py-16 lg:py-24","layout":{"type":"constrained"}} -->
<div class="wp-block-group services-cards py-16 lg:py-24">
    <div class="container mx-auto px-4">

        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
            <?php if (!empty($content['section_tagline'])): ?>
                <p class="text-sm font-semibold uppercase tracking-wider text-secondary mb-4">
                    <?php echo esc_html($content['section_tagline']); ?>
                </p>
            <?php endif; ?>

            <h2 class="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary mb-6">
                <?php echo esc_html($content['section_title']); ?>
            </h2>

            <?php if (!empty($content['section_description'])): ?>
                <p class="text-lg lg:text-xl text-gray-600">
                    <?php echo esc_html($content['section_description']); ?>
                </p>
            <?php endif; ?>
        </div>

        <!-- Services -->
        <div class="space-y-16 lg:space-y-24">
            <?php foreach ($services as $index => $service):
                $is_reversed = ($variant === 'alternating' && $index % 2 === 1);
                $number = str_pad($index + 1, 2, '0', STR_PAD_LEFT);
            ?>
                <div class="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

                    <!-- Content -->
                    <div class="space-y-6 <?php echo $is_reversed ? 'lg:order-last' : ''; ?>">
                        <?php if ($show_numbering): ?>
                            <span class="text-6xl lg:text-7xl font-bold text-gray-100">
                                <?php echo esc_html($number); ?>
                            </span>
                        <?php endif; ?>

                        <h3 class="text-2xl lg:text-3xl font-bold text-primary">
                            <?php echo esc_html($service['name'] ?? $service['title'] ?? 'Service'); ?>
                        </h3>

                        <p class="text-lg text-gray-600 leading-relaxed">
                            <?php echo esc_html($service['description'] ?? ''); ?>
                        </p>

                        <?php if (!empty($service['features'])): ?>
                            <ul class="space-y-3">
                                <?php foreach ($service['features'] as $feature): ?>
                                    <li class="flex items-start gap-3">
                                        <svg class="w-5 h-5 text-secondary flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                        </svg>
                                        <span class="text-gray-700"><?php echo esc_html($feature); ?></span>
                                    </li>
                                <?php endforeach; ?>
                            </ul>
                        <?php endif; ?>

                        <?php if ($show_cta): ?>
                            <a href="<?php echo esc_url($service['url'] ?? '#contact'); ?>"
                               class="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                                Learn More
                                <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                </svg>
                            </a>
                        <?php endif; ?>
                    </div>

                    <!-- Image -->
                    <div class="relative rounded-2xl overflow-hidden shadow-xl <?php echo esc_attr($image_aspect); ?> <?php echo $is_reversed ? 'lg:order-first' : ''; ?>">
                        <?php if (!empty($service['image'])): ?>
                            <img src="<?php echo esc_url($service['image']); ?>"
                                 alt="<?php echo esc_attr($service['name'] ?? $service['title'] ?? 'Service'); ?>"
                                 class="absolute inset-0 w-full h-full object-cover" />
                        <?php else: ?>
                            <div class="absolute inset-0 bg-gradient-to-br from-primary to-secondary"></div>
                        <?php endif; ?>
                    </div>

                </div>
            <?php endforeach; ?>
        </div>

    </div>
</div>
<!-- /wp:group -->
