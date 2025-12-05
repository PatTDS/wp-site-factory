<?php
/**
 * Testimonials Cards Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'grid';
$columns = $config['columns'] ?? '3';
$show_avatar = $config['show_avatar'] ?? true;
$show_company = $config['show_company'] ?? true;
$show_rating = $config['show_rating'] ?? true;
$card_style = $config['card_style'] ?? 'quoted';
$background = $config['background'] ?? 'gray';

$bg_class = match($background) {
    'white' => 'bg-white',
    'primary' => 'bg-primary',
    default => 'bg-gray-50',
};

$grid_cols = match($columns) {
    '2' => 'md:grid-cols-2',
    default => 'md:grid-cols-2 lg:grid-cols-3',
};

$testimonials = $content['testimonials'] ?? [];
?>

<!-- wp:group {"className":"testimonials-cards","layout":{"type":"constrained"}} -->
<div class="wp-block-group testimonials-cards py-16 lg:py-24 <?php echo esc_attr($bg_class); ?>">
    <div class="container mx-auto px-4">

        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
            <?php if (!empty($content['tagline'])): ?>
                <p class="text-sm font-semibold uppercase tracking-wider <?php echo $background === 'primary' ? 'text-white/70' : 'text-secondary'; ?> mb-4">
                    <?php echo esc_html($content['tagline']); ?>
                </p>
            <?php endif; ?>

            <h2 class="text-3xl lg:text-4xl font-bold <?php echo $background === 'primary' ? 'text-white' : 'text-primary'; ?> mb-4">
                <?php echo esc_html($content['title']); ?>
            </h2>

            <?php if (!empty($content['description'])): ?>
                <p class="text-lg <?php echo $background === 'primary' ? 'text-white/80' : 'text-gray-600'; ?>">
                    <?php echo esc_html($content['description']); ?>
                </p>
            <?php endif; ?>
        </div>

        <!-- Testimonials Grid -->
        <div class="grid gap-6 lg:gap-8 <?php echo esc_attr($grid_cols); ?>">
            <?php foreach ($testimonials as $testimonial): ?>
                <div class="p-6 lg:p-8 bg-white rounded-xl shadow-lg <?php echo $card_style === 'quoted' ? 'relative pt-10' : ''; ?> <?php echo $card_style === 'bordered' ? 'border-2 border-gray-200 shadow-none' : ''; ?>">

                    <?php if ($card_style === 'quoted'): ?>
                        <!-- Quote Icon -->
                        <div class="absolute -top-4 left-6">
                            <div class="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                                <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                            </div>
                        </div>
                    <?php endif; ?>

                    <?php if ($show_rating && !empty($testimonial['rating'])): ?>
                        <!-- Star Rating -->
                        <div class="flex gap-1 mb-4">
                            <?php for ($i = 1; $i <= 5; $i++): ?>
                                <svg class="w-5 h-5 <?php echo $i <= (int)$testimonial['rating'] ? 'text-yellow-400' : 'text-gray-300'; ?>" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            <?php endfor; ?>
                        </div>
                    <?php endif; ?>

                    <!-- Quote Text -->
                    <p class="text-gray-700 italic mb-6 leading-relaxed">
                        "<?php echo esc_html($testimonial['quote'] ?? $testimonial['text'] ?? ''); ?>"
                    </p>

                    <!-- Client Info -->
                    <div class="flex items-center gap-4">
                        <?php if ($show_avatar): ?>
                            <?php if (!empty($testimonial['avatar']) || !empty($testimonial['image'])): ?>
                                <img src="<?php echo esc_url($testimonial['avatar'] ?? $testimonial['image']); ?>"
                                     alt="<?php echo esc_attr($testimonial['name'] ?? 'Client'); ?>"
                                     class="w-12 h-12 rounded-full object-cover" />
                            <?php else: ?>
                                <!-- Default Avatar -->
                                <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span class="text-primary font-bold text-lg">
                                        <?php echo esc_html(substr($testimonial['name'] ?? 'C', 0, 1)); ?>
                                    </span>
                                </div>
                            <?php endif; ?>
                        <?php endif; ?>

                        <div>
                            <p class="font-semibold text-primary">
                                <?php echo esc_html($testimonial['name'] ?? 'Client'); ?>
                            </p>
                            <?php if ($show_company && !empty($testimonial['company'])): ?>
                                <p class="text-sm text-gray-500">
                                    <?php if (!empty($testimonial['position'])): ?>
                                        <?php echo esc_html($testimonial['position']); ?>,
                                    <?php endif; ?>
                                    <?php echo esc_html($testimonial['company']); ?>
                                </p>
                            <?php elseif (!empty($testimonial['position'])): ?>
                                <p class="text-sm text-gray-500">
                                    <?php echo esc_html($testimonial['position']); ?>
                                </p>
                            <?php endif; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>

    </div>
</div>
<!-- /wp:group -->
