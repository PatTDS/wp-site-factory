<?php
/**
 * CTA Box Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$show_icon = $config['show_icon'] ?? true;
$icon_style = $config['icon_style'] ?? 'circle';
$button_style = $config['button_style'] ?? 'solid';
$button_size = $config['button_size'] ?? 'md';
$variant = $config['variant'] ?? 'bordered';

$max_width_class = match($config['max_width'] ?? 'md') {
    'sm' => 'max-w-xl',
    'md' => 'max-w-2xl',
    'lg' => 'max-w-4xl',
    'full' => 'max-w-full',
    default => 'max-w-2xl',
};

$box_class = match($variant) {
    'default' => 'bg-gradient-to-br from-primary-50 to-white rounded-2xl p-8 text-center',
    'bordered' => 'bg-white border-2 border-primary-200 rounded-2xl p-8 text-center hover:border-primary-300 transition-colors',
    'elevated' => 'bg-white rounded-2xl p-8 text-center shadow-xl',
    default => 'bg-white border-2 border-primary-200 rounded-2xl p-8 text-center',
};

$icon_container_class = match($icon_style) {
    'circle' => 'w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary-100 text-primary-600',
    'square' => 'w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-lg bg-primary-100 text-primary-600',
    default => '',
};

$button_classes = match($button_style) {
    'solid' => 'inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors shadow-sm',
    'outline' => 'inline-flex items-center justify-center px-6 py-3 border-2 border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold rounded-lg transition-colors',
    'ghost' => 'inline-flex items-center justify-center px-6 py-3 text-primary-600 hover:bg-primary-50 font-semibold rounded-lg transition-colors',
    default => 'inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors',
};

if ($button_size === 'lg') {
    $button_classes = str_replace('px-6 py-3', 'px-8 py-4', $button_classes);
}

// Icon SVG map
$icons = [
    'rocket' => '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
    'star' => '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
    'heart' => '<svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>',
    'check' => '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>',
];

$icon_svg = $icons[$content['icon'] ?? 'rocket'] ?? $icons['rocket'];
?>

<!-- wp:group {"className":"cta-box","layout":{"type":"constrained"}} -->
<div class="mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div class="<?php echo esc_attr($max_width_class); ?> mx-auto">
        <div class="<?php echo esc_attr($box_class); ?>">
            <?php if ($show_icon && $icon_style !== 'none'): ?>
            <!-- Icon -->
            <div class="<?php echo esc_attr($icon_container_class); ?>">
                <?php echo $icon_svg; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
            </div>
            <?php endif; ?>

            <!-- Headline -->
            <h2 class="text-2xl md:text-3xl font-heading font-bold text-gray-900 mb-4">
                <?php echo esc_html($content['headline']); ?>
            </h2>

            <!-- Description -->
            <p class="text-base md:text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
                <?php echo esc_html($content['description']); ?>
            </p>

            <!-- Button -->
            <div class="flex justify-center">
                <a href="<?php echo esc_url($content['button_url'] ?? '#contact'); ?>"
                   class="group <?php echo esc_attr($button_classes); ?>">
                    <?php echo esc_html($content['button_text']); ?>
                    <svg class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                </a>
            </div>
        </div>
    </div>
</div>
<!-- /wp:group -->
