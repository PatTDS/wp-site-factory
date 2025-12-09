<?php
/**
 * FAQ Accordion Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'simple';
$default_open = $config['default_open'] ?? 0;
$show_numbers = $config['show_numbers'] ?? false;
$style = $config['style'] ?? 'bordered';

$item_class = match($style) {
    'cards' => 'bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden mb-4',
    'bordered' => 'border border-gray-200 rounded-xl overflow-hidden mb-4',
    default => 'border-b border-gray-200 last:border-0',
};

// Group FAQs by category if variant is with-categories
$grouped_faqs = [];
if ($variant === 'with-categories') {
    foreach ($content['faqs'] as $faq) {
        $category = $faq['category'] ?? 'General';
        $grouped_faqs[$category][] = $faq;
    }
} else {
    $grouped_faqs['all'] = $content['faqs'];
}
?>

<!-- wp:group {"className":"faq-accordion","layout":{"type":"constrained"}} -->
<section class="py-20 lg:py-28 bg-white">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-16">
            <?php if (!empty($content['section_title'])): ?>
            <h2 class="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-4">
                <?php echo esc_html($content['section_title']); ?>
            </h2>
            <?php endif; ?>

            <?php if (!empty($content['section_subtitle'])): ?>
            <p class="text-lg text-gray-600">
                <?php echo esc_html($content['section_subtitle']); ?>
            </p>
            <?php endif; ?>
        </div>

        <!-- FAQ Accordion -->
        <?php
        $global_index = 0;
        foreach ($grouped_faqs as $category => $faqs):
        ?>
            <?php if ($variant === 'with-categories' && $category !== 'all'): ?>
            <h3 class="text-xl font-bold text-gray-900 mb-6 mt-12 first:mt-0">
                <?php echo esc_html($category); ?>
            </h3>
            <?php endif; ?>

            <div class="space-y-4">
                <?php foreach ($faqs as $faq_index => $faq):
                    $global_index++;
                    $is_open = ($global_index === $default_open);
                    $unique_id = 'faq-' . $global_index;
                ?>
                <details class="group <?php echo esc_attr($item_class); ?>" <?php echo $is_open ? 'open' : ''; ?>>
                    <summary class="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors cursor-pointer list-none">
                        <span class="text-lg font-semibold text-gray-900 pr-8">
                            <?php if ($show_numbers): ?>
                            <span class="text-primary-600 mr-3"><?php echo str_pad($global_index, 2, '0', STR_PAD_LEFT); ?>.</span>
                            <?php endif; ?>
                            <?php echo esc_html($faq['question']); ?>
                        </span>
                        <svg class="w-5 h-5 text-gray-400 transition-transform duration-300 group-open:rotate-180 flex-shrink-0"
                             fill="none"
                             stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </summary>
                    <div class="px-6 pb-5 text-gray-600 leading-relaxed">
                        <?php echo esc_html($faq['answer']); ?>
                    </div>
                </details>
                <?php endforeach; ?>
            </div>
        <?php endforeach; ?>
    </div>
</section>
<!-- /wp:group -->

<style>
/* Smooth accordion animation */
details summary::-webkit-details-marker {
    display: none;
}
</style>
