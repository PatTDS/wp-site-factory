<?php
/**
 * Gallery Masonry Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'masonry';
$columns = $config['columns'] ?? 3;
$gap = $config['gap'] ?? 'medium';
$lightbox_enabled = $config['lightbox_enabled'] ?? true;
$show_captions = $config['show_captions'] ?? false;
$aspect_ratio = $config['aspect_ratio'] ?? 'auto';

$gap_class = match($gap) {
    'small' => 'gap-2',
    'large' => 'gap-6',
    default => 'gap-4',
};

if ($variant === 'masonry') {
    $gallery_class = match($columns) {
        2 => 'columns-2',
        4 => 'columns-2 md:columns-4',
        5 => 'columns-2 md:columns-3 lg:columns-5',
        default => 'columns-2 md:columns-3',
    };
    $gallery_class .= ' ' . $gap_class;
} else {
    $gallery_class = match($columns) {
        2 => 'grid grid-cols-2',
        4 => 'grid md:grid-cols-2 lg:grid-cols-4',
        5 => 'grid md:grid-cols-3 lg:grid-cols-5',
        default => 'grid md:grid-cols-2 lg:grid-cols-3',
    };
    $gallery_class .= ' ' . $gap_class;
}

$aspect_class = '';
if ($variant === 'grid' && $aspect_ratio !== 'auto') {
    $aspect_class = match($aspect_ratio) {
        'square' => 'aspect-square',
        'landscape' => 'aspect-video',
        'portrait' => 'aspect-[3/4]',
        default => '',
    };
}
?>

<!-- wp:group {"className":"gallery-masonry","layout":{"type":"constrained"}} -->
<section class="py-20 lg:py-28 bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <?php if (!empty($content['section_title']) || !empty($content['section_subtitle'])): ?>
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
        <?php endif; ?>

        <!-- Gallery -->
        <div class="<?php echo esc_attr($gallery_class); ?>">
            <?php foreach ($content['images'] as $index => $image):
                if (empty($image['url'])) {
                    $image['url'] = 'https://via.placeholder.com/800x600';
                }

                $lightbox_attrs = $lightbox_enabled
                    ? 'data-lightbox="gallery" data-caption="' . esc_attr($image['caption'] ?? '') . '"'
                    : '';
            ?>
            <div class="relative overflow-hidden rounded-lg group cursor-pointer <?php echo $variant === 'masonry' ? 'mb-4 break-inside-avoid' : ''; ?>">
                <a href="<?php echo esc_url($image['url']); ?>"
                   <?php echo $lightbox_attrs; ?>
                   class="block <?php echo esc_attr($aspect_class); ?>">
                    <img src="<?php echo esc_url($image['url']); ?>"
                         alt="<?php echo esc_attr($image['alt'] ?? 'Gallery image'); ?>"
                         class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                         loading="lazy" />

                    <?php if ($show_captions && !empty($image['caption'])): ?>
                    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                        <?php echo esc_html($image['caption']); ?>
                    </div>
                    <?php endif; ?>
                </a>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>
<!-- /wp:group -->

<?php if ($lightbox_enabled): ?>
<style>
/* Simple lightbox styles - integrate with your lightbox library */
[data-lightbox] {
    transition: transform 0.3s ease;
}
[data-lightbox]:hover {
    transform: scale(1.02);
}
</style>
<?php endif; ?>
