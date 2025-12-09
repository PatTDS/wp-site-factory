<?php
/**
 * Features Alternating Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'default';
$show_bullets = $config['show_bullets'] ?? true;
$image_aspect = $config['image_aspect'] ?? 'landscape';
$background_pattern = $config['background_pattern'] ?? 'none';

$image_height = match($image_aspect) {
    'square' => 'h-96',
    'portrait' => 'h-[32rem]',
    default => 'h-80',
};
?>

<!-- wp:group {"className":"features-alternating","layout":{"type":"constrained"}} -->
<section class="py-20 lg:py-28 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <?php if (!empty($content['section_title']) || !empty($content['section_subtitle'])): ?>
        <div class="text-center mb-20">
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
        <?php endif; ?>

        <!-- Features -->
        <?php foreach ($content['features'] as $index => $feature):
            $is_even = $index % 2 === 0;
            $row_class = $is_even
                ? 'grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 last:mb-0'
                : 'grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 last:mb-0';
        ?>
        <div class="<?php echo esc_attr($row_class); ?>">
            <!-- Content -->
            <div class="space-y-6 <?php echo !$is_even ? 'lg:order-2' : ''; ?>">
                <h3 class="text-2xl md:text-3xl font-bold text-gray-900">
                    <?php echo esc_html($feature['title']); ?>
                </h3>

                <p class="text-lg text-gray-600">
                    <?php echo esc_html($feature['description']); ?>
                </p>

                <?php if ($show_bullets && !empty($feature['bullets'])): ?>
                <ul class="space-y-3">
                    <?php foreach ($feature['bullets'] as $bullet): ?>
                    <li class="flex items-start gap-3">
                        <svg class="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="text-gray-700"><?php echo esc_html($bullet); ?></span>
                    </li>
                    <?php endforeach; ?>
                </ul>
                <?php endif; ?>
            </div>

            <!-- Image -->
            <div class="rounded-2xl overflow-hidden shadow-2xl <?php echo !$is_even ? 'lg:order-1' : ''; ?>">
                <?php if (!empty($feature['image'])): ?>
                <img src="<?php echo esc_url($feature['image']); ?>"
                     alt="<?php echo esc_attr($feature['image_alt'] ?? $feature['title']); ?>"
                     class="w-full <?php echo esc_attr($image_height); ?> object-cover"
                     loading="lazy" />
                <?php else: ?>
                <div class="w-full <?php echo esc_attr($image_height); ?> bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span class="text-6xl text-primary-600/20">📷</span>
                </div>
                <?php endif; ?>
            </div>
        </div>
        <?php endforeach; ?>
    </div>
</section>
<!-- /wp:group -->
