<?php
/**
 * Services Grid Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$columns = $config['columns'] ?? '3';
$show_icons = $config['show_icons'] ?? true;
$show_descriptions = $config['show_descriptions'] ?? true;
$card_style = $config['card_style'] ?? 'elevated';
$show_cta = $config['show_cta'] ?? true;

$grid_cols = match($columns) {
    '2' => 'md:grid-cols-2',
    '4' => 'md:grid-cols-2 lg:grid-cols-4',
    default => 'md:grid-cols-2 lg:grid-cols-3',
};

$card_class = match($card_style) {
    'flat' => 'p-6 lg:p-8 bg-white rounded-xl',
    'bordered' => 'p-6 lg:p-8 bg-white rounded-xl border-2 border-gray-200',
    default => 'p-6 lg:p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow',
};

$services = $content['services'] ?? [];
?>

<!-- wp:group {"className":"services-grid","layout":{"type":"constrained"}} -->
<div class="wp-block-group services-grid py-16 lg:py-24 bg-gray-50">
    <div class="container mx-auto px-4">

        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
            <?php if (!empty($content['section_tagline'])): ?>
                <p class="text-sm font-semibold uppercase tracking-wider text-secondary mb-4">
                    <?php echo esc_html($content['section_tagline']); ?>
                </p>
            <?php endif; ?>

            <h2 class="text-3xl lg:text-4xl font-bold text-primary mb-4">
                <?php echo esc_html($content['section_title']); ?>
            </h2>

            <?php if (!empty($content['section_description'])): ?>
                <p class="text-lg text-gray-600">
                    <?php echo esc_html($content['section_description']); ?>
                </p>
            <?php endif; ?>
        </div>

        <!-- Services Grid -->
        <div class="grid gap-6 lg:gap-8 <?php echo esc_attr($grid_cols); ?>">
            <?php foreach ($services as $service): ?>
                <div class="<?php echo esc_attr($card_class); ?>">
                    <?php if ($show_icons && !empty($service['icon'])): ?>
                        <div class="w-12 h-12 text-secondary mb-4">
                            <?php echo $service['icon']; ?>
                        </div>
                    <?php elseif ($show_icons): ?>
                        <!-- Default icon placeholder -->
                        <div class="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                            <svg class="w-6 h-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                    <?php endif; ?>

                    <h3 class="text-xl font-bold text-primary mb-2">
                        <?php echo esc_html($service['name'] ?? $service['title'] ?? 'Service'); ?>
                    </h3>

                    <?php if ($show_descriptions && !empty($service['description'])): ?>
                        <p class="text-gray-600 mb-4">
                            <?php echo esc_html($service['description']); ?>
                        </p>
                    <?php endif; ?>

                    <?php if ($show_cta): ?>
                        <a href="<?php echo esc_url($service['url'] ?? '#'); ?>"
                           class="text-secondary font-semibold hover:text-secondary/80 inline-flex items-center gap-2">
                            Learn More
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>

    </div>
</div>
<!-- /wp:group -->
