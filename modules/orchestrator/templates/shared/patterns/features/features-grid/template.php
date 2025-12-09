<?php
/**
 * Features Grid Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'cards';
$columns = $config['columns'] ?? 3;
$show_icons = $config['show_icons'] ?? true;
$card_style = $config['card_style'] ?? 'shadow';
$icon_style = $config['icon_style'] ?? 'filled';

$grid_class = match($columns) {
    2 => 'grid md:grid-cols-2 gap-8',
    4 => 'grid md:grid-cols-2 lg:grid-cols-4 gap-8',
    default => 'grid md:grid-cols-2 lg:grid-cols-3 gap-8',
};

$card_class = match($card_style) {
    'bordered' => 'bg-white rounded-xl p-8 border-2 border-gray-200 hover:border-primary-500 transition-colors',
    'flat' => 'bg-white rounded-xl p-8',
    default => 'bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow',
};

if ($variant === 'minimal') {
    $card_class = 'p-6';
}

$icon_container_class = match($icon_style) {
    'gradient' => 'inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 text-white rounded-xl mb-5 text-2xl',
    'outlined' => 'inline-flex items-center justify-center w-14 h-14 border-2 border-primary-500 text-primary-600 rounded-xl mb-5 text-2xl',
    default => 'inline-flex items-center justify-center w-14 h-14 bg-primary-100 text-primary-600 rounded-xl mb-5 text-2xl',
};
?>

<!-- wp:group {"className":"features-grid","layout":{"type":"constrained"}} -->
<section class="py-20 lg:py-28 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-16">
            <?php if (!empty($content['section_title'])): ?>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
                <?php echo esc_html($content['section_title']); ?>
            </h2>
            <?php endif; ?>

            <?php if (!empty($content['section_subtitle'])): ?>
            <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                <?php echo esc_html($content['section_subtitle']); ?>
            </p>
            <?php endif; ?>
        </div>

        <!-- Features Grid -->
        <div class="<?php echo esc_attr($grid_class); ?>">
            <?php foreach ($content['features'] as $feature): ?>
            <div class="<?php echo esc_attr($card_class); ?>">
                <?php if ($show_icons && !empty($feature['icon'])): ?>
                <div class="<?php echo esc_attr($icon_container_class); ?>">
                    <?php echo esc_html($feature['icon']); ?>
                </div>
                <?php endif; ?>

                <?php if ($variant === 'with-images' && !empty($feature['image'])): ?>
                <div class="mb-5 rounded-lg overflow-hidden">
                    <img src="<?php echo esc_url($feature['image']); ?>"
                         alt="<?php echo esc_attr($feature['title']); ?>"
                         class="w-full h-48 object-cover"
                         loading="lazy" />
                </div>
                <?php endif; ?>

                <h3 class="text-xl font-bold text-gray-900 mb-3">
                    <?php echo esc_html($feature['title']); ?>
                </h3>

                <p class="text-gray-600 leading-relaxed">
                    <?php echo esc_html($feature['description']); ?>
                </p>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<!-- /wp:group -->
