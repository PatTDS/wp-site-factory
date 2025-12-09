<?php
/**
 * Footer Centered Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'default';
$show_logo = $config['show_logo'] ?? true;
$show_social = $config['show_social'] ?? true;
$show_tagline = $config['show_tagline'] ?? true;
$background = $config['background'] ?? 'white';

$section_class = match($background) {
    'gray' => 'bg-gray-50 border-t border-gray-200',
    'dark' => 'bg-gray-900 text-white border-t border-gray-800',
    default => 'bg-white border-t border-gray-200',
};

$is_dark = $background === 'dark';
$text_base = $is_dark ? 'text-gray-300' : 'text-gray-600';
$text_hover = $is_dark ? 'hover:text-white' : 'hover:text-gray-900';
$text_muted = $is_dark ? 'text-gray-500' : 'text-gray-500';

$social_icons = [
    'facebook' => '<path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>',
    'twitter' => '<path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>',
    'linkedin' => '<path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>',
    'instagram' => '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><path d="M17.5 6.5h.01"/>',
    'youtube' => '<path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>',
];

$padding_class = match($variant) {
    'compact' => 'py-8',
    'extended' => 'py-16',
    default => 'py-12',
};
?>

<!-- wp:group {"className":"footer-centered","layout":{"type":"constrained"}} -->
<footer class="<?php echo esc_attr($section_class); ?>" role="contentinfo">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 <?php echo esc_attr($padding_class); ?> text-center">

        <?php if ($show_logo && !empty($content['logo_url'])): ?>
        <!-- Logo -->
        <div class="mb-6">
            <a href="<?php echo esc_url(home_url('/')); ?>" class="inline-block" aria-label="<?php echo esc_attr($content['company_name']); ?>">
                <img src="<?php echo esc_url($content['logo_url']); ?>"
                     alt="<?php echo esc_attr($content['company_name']); ?>"
                     class="h-10 mx-auto">
            </a>
        </div>
        <?php elseif ($show_logo): ?>
        <!-- Company Name as Text Logo -->
        <div class="mb-6">
            <a href="<?php echo esc_url(home_url('/')); ?>"
               class="inline-block text-2xl font-heading font-bold <?php echo $is_dark ? 'text-white' : 'text-gray-900'; ?>">
                <?php echo esc_html($content['company_name']); ?>
            </a>
        </div>
        <?php endif; ?>

        <?php if ($show_tagline && !empty($content['tagline'])): ?>
        <!-- Tagline -->
        <p class="text-sm <?php echo esc_attr($text_base); ?> mb-6 max-w-md mx-auto">
            <?php echo esc_html($content['tagline']); ?>
        </p>
        <?php endif; ?>

        <?php if (!empty($content['navigation_links'])): ?>
        <!-- Navigation Links -->
        <nav class="flex flex-wrap justify-center gap-6 mb-6" role="navigation" aria-label="Footer navigation">
            <?php foreach ($content['navigation_links'] as $link): ?>
            <a href="<?php echo esc_url($link['url']); ?>"
               class="text-sm <?php echo esc_attr($text_base . ' ' . $text_hover); ?> transition-colors font-medium">
                <?php echo esc_html($link['text']); ?>
            </a>
            <?php endforeach; ?>
        </nav>
        <?php endif; ?>

        <?php if ($show_social && !empty($content['social_links'])): ?>
        <!-- Social Media Icons -->
        <div class="flex justify-center gap-4 mb-6">
            <?php foreach ($content['social_links'] as $platform => $url): ?>
                <?php if (isset($social_icons[$platform])): ?>
                <a href="<?php echo esc_url($url); ?>"
                   class="<?php echo esc_attr($text_base . ' ' . $text_hover); ?> transition-colors"
                   aria-label="<?php echo esc_attr(ucfirst($platform)); ?>"
                   target="_blank"
                   rel="noopener noreferrer">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <?php echo $social_icons[$platform]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                    </svg>
                </a>
                <?php endif; ?>
            <?php endforeach; ?>
        </div>
        <?php endif; ?>

        <!-- Copyright & Legal Links -->
        <div class="space-y-3">
            <?php if (!empty($content['legal_links'])): ?>
            <div class="flex flex-wrap justify-center gap-4 text-sm <?php echo esc_attr($text_muted); ?>">
                <?php foreach ($content['legal_links'] as $link): ?>
                <a href="<?php echo esc_url($link['url']); ?>"
                   class="<?php echo esc_attr($text_hover); ?> transition-colors">
                    <?php echo esc_html($link['text']); ?>
                </a>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>

            <p class="text-sm <?php echo esc_attr($text_muted); ?>">
                &copy; <?php echo esc_html(date('Y')); ?> <?php echo esc_html($content['company_name']); ?>. All rights reserved.
            </p>
        </div>
    </div>
</footer>
<!-- /wp:group -->
