<?php
/**
 * Pricing Grid Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'featured-center';
$columns = $config['columns'] ?? 3;
$show_toggle = $config['show_toggle'] ?? false;
$annual_discount = $config['annual_discount'] ?? 'Save 20%';

$grid_cols = match($columns) {
    2 => 'md:grid-cols-2 max-w-4xl',
    4 => 'md:grid-cols-2 lg:grid-cols-4 max-w-7xl',
    default => 'md:grid-cols-3 max-w-6xl',
};

$plans = $content['plans'] ?? [];
?>

<!-- wp:group {"className":"pricing-grid","layout":{"type":"constrained"}} -->
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

            <?php if ($show_toggle): ?>
            <!-- Billing Toggle -->
            <div class="mt-8 inline-flex items-center gap-4 p-1.5 bg-gray-100 rounded-xl">
                <button class="px-6 py-2.5 text-sm font-semibold rounded-lg transition-all bg-white text-gray-900 shadow-sm" data-period="monthly">
                    Monthly
                </button>
                <button class="px-6 py-2.5 text-sm font-medium rounded-lg transition-all text-gray-600 hover:text-gray-900" data-period="annual">
                    Annual
                    <span class="ml-1.5 text-xs text-green-600 font-semibold"><?php echo esc_html($annual_discount); ?></span>
                </button>
            </div>
            <?php endif; ?>
        </div>

        <!-- Pricing Grid -->
        <div class="grid <?php echo esc_attr($grid_cols); ?> gap-8 items-start mx-auto">
            <?php foreach ($plans as $index => $plan):
                $is_featured = $plan['is_featured'] ?? false;
                $card_class = $is_featured
                    ? 'relative bg-white rounded-2xl border-2 border-primary-600 p-8 shadow-xl'
                    : 'bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg transition-shadow';

                if ($variant === 'featured-center' && $is_featured) {
                    $card_class .= ' -mt-4 mb-4';
                }

                $cta_class = $is_featured
                    ? 'mt-8 block w-full text-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary-600/25'
                    : 'mt-8 block w-full text-center px-6 py-3 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-900 font-semibold rounded-xl transition-colors';
            ?>
            <div class="<?php echo esc_attr($card_class); ?>">
                <?php if ($is_featured): ?>
                <!-- Popular Badge -->
                <div class="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span class="inline-flex px-4 py-1.5 bg-primary-600 text-white text-xs font-semibold uppercase tracking-wider rounded-full">
                        Most Popular
                    </span>
                </div>
                <?php endif; ?>

                <h3 class="text-lg font-semibold text-gray-900 <?php echo $is_featured ? 'mt-2' : ''; ?>">
                    <?php echo esc_html($plan['name']); ?>
                </h3>

                <?php if (!empty($plan['description'])): ?>
                <p class="text-sm text-gray-500 mt-2">
                    <?php echo esc_html($plan['description']); ?>
                </p>
                <?php endif; ?>

                <div class="mt-6">
                    <span class="text-4xl font-bold text-gray-900"><?php echo esc_html($plan['price']); ?></span>
                    <?php if (!empty($plan['period'])): ?>
                    <span class="text-gray-500">/<?php echo esc_html($plan['period']); ?></span>
                    <?php endif; ?>
                </div>

                <?php if (!empty($plan['features'])): ?>
                <ul class="mt-8 space-y-4">
                    <?php foreach ($plan['features'] as $feature): ?>
                    <li class="flex items-start gap-3">
                        <svg class="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="text-gray-700"><?php echo esc_html($feature); ?></span>
                    </li>
                    <?php endforeach; ?>
                </ul>
                <?php endif; ?>

                <a href="<?php echo esc_url($plan['cta_url'] ?? '#contact'); ?>"
                   class="<?php echo esc_attr($cta_class); ?>">
                    <?php echo esc_html($plan['cta_text'] ?? 'Get Started'); ?>
                </a>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<!-- /wp:group -->
