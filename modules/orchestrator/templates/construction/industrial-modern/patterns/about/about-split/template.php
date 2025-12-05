<?php
/**
 * About Split Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'image-left';
$show_stats = $config['show_stats'] ?? true;
$show_features = $config['show_features'] ?? true;
$show_cta = $config['show_cta'] ?? true;
$background = $config['background'] ?? 'white';

$image_order = $variant === 'image-right' ? 'lg:order-last' : 'lg:order-first';
$bg_class = match($background) {
    'gray' => 'bg-gray-50',
    'primary' => 'bg-primary text-white',
    default => 'bg-white',
};

$features = $content['features'] ?? [];
$stats = $content['stats'] ?? [];
?>

<!-- wp:group {"className":"about-split","layout":{"type":"constrained"}} -->
<div class="wp-block-group about-split py-16 lg:py-24 <?php echo esc_attr($bg_class); ?>">
    <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            <!-- Image Side -->
            <div class="<?php echo esc_attr($image_order); ?>">
                <div class="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
                    <?php if (!empty($content['image'])): ?>
                        <img src="<?php echo esc_url($content['image']); ?>"
                             alt="<?php echo esc_attr($content['title']); ?>"
                             class="absolute inset-0 w-full h-full object-cover" />
                    <?php else: ?>
                        <div class="absolute inset-0 bg-gradient-to-br from-primary to-secondary"></div>
                    <?php endif; ?>
                </div>
            </div>

            <!-- Content Side -->
            <div class="space-y-6">
                <?php if (!empty($content['tagline'])): ?>
                    <p class="text-sm font-semibold uppercase tracking-wider text-secondary">
                        <?php echo esc_html($content['tagline']); ?>
                    </p>
                <?php endif; ?>

                <h2 class="text-3xl lg:text-4xl font-bold <?php echo $background === 'primary' ? 'text-white' : 'text-primary'; ?>">
                    <?php echo esc_html($content['title']); ?>
                </h2>

                <?php if (!empty($content['description'])): ?>
                    <p class="text-lg <?php echo $background === 'primary' ? 'text-white/90' : 'text-gray-600'; ?>">
                        <?php echo esc_html($content['description']); ?>
                    </p>
                <?php endif; ?>

                <?php if ($show_features && !empty($features)): ?>
                    <ul class="space-y-3">
                        <?php foreach ($features as $feature): ?>
                            <li class="flex items-start gap-3">
                                <svg class="w-5 h-5 text-secondary mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span class="<?php echo $background === 'primary' ? 'text-white/90' : 'text-gray-700'; ?>">
                                    <?php echo esc_html(is_array($feature) ? ($feature['text'] ?? $feature['name'] ?? '') : $feature); ?>
                                </span>
                            </li>
                        <?php endforeach; ?>
                    </ul>
                <?php endif; ?>

                <?php if ($show_cta && !empty($content['cta_text'])): ?>
                    <div class="pt-4">
                        <a href="<?php echo esc_url($content['cta_url'] ?? '#contact'); ?>"
                           class="inline-flex items-center justify-center px-6 py-3 <?php echo $background === 'primary' ? 'bg-white text-primary hover:bg-white/90' : 'bg-primary text-white hover:bg-primary/90'; ?> font-semibold rounded-lg transition-colors">
                            <?php echo esc_html($content['cta_text']); ?>
                        </a>
                    </div>
                <?php endif; ?>
            </div>

        </div>

        <?php if ($show_stats && !empty($stats)): ?>
            <!-- Stats Section -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 lg:mt-16 pt-12 lg:pt-16 border-t <?php echo $background === 'primary' ? 'border-white/20' : 'border-gray-200'; ?>">
                <?php foreach ($stats as $stat): ?>
                    <div class="text-center">
                        <div class="text-3xl lg:text-4xl font-bold <?php echo $background === 'primary' ? 'text-white' : 'text-primary'; ?>">
                            <?php echo esc_html($stat['value'] ?? $stat['number'] ?? '0'); ?>
                        </div>
                        <div class="text-sm <?php echo $background === 'primary' ? 'text-white/70' : 'text-gray-600'; ?>">
                            <?php echo esc_html($stat['label'] ?? $stat['text'] ?? ''); ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>

    </div>
</div>
<!-- /wp:group -->
