<?php
/**
 * Footer Columns Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? '4-column';
$show_newsletter = $config['show_newsletter'] ?? true;
$show_social = $config['show_social'] ?? true;
$show_back_to_top = $config['show_back_to_top'] ?? true;
$background = $config['background'] ?? 'dark';

$section_class = match($background) {
    'light' => 'bg-gray-50 text-gray-900',
    'gradient' => 'bg-gradient-to-b from-gray-900 to-gray-800 text-white',
    default => 'bg-gray-900 text-white',
};

$grid_class = match($variant) {
    '3-column' => 'grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12',
    '2-column' => 'grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12',
    default => 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12',
};

$is_dark = $background !== 'light';
$text_muted = $is_dark ? 'text-gray-400' : 'text-gray-600';
$text_hover = $is_dark ? 'hover:text-white' : 'hover:text-gray-900';
$border_color = $is_dark ? 'border-gray-800' : 'border-gray-200';

$social_icons = [
    'facebook' => '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>',
    'twitter' => '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/></svg>',
    'linkedin' => '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>',
    'instagram' => '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><path d="M17.5 6.5h.01"/></svg>',
    'youtube' => '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>',
];
?>

<!-- wp:group {"className":"footer-columns","layout":{"type":"constrained"}} -->
<footer class="<?php echo esc_attr($section_class); ?>">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <!-- Main Footer Content -->
        <div class="<?php echo esc_attr($grid_class); ?>">
            <!-- Column 1: About / Company Info -->
            <div>
                <h3 class="text-lg font-heading font-semibold mb-4">
                    <?php echo esc_html($content['company_name']); ?>
                </h3>
                <?php if (!empty($content['company_description'])): ?>
                <p class="text-sm <?php echo esc_attr($text_muted); ?> mb-4 leading-relaxed">
                    <?php echo esc_html($content['company_description']); ?>
                </p>
                <?php endif; ?>

                <?php if ($show_social && !empty($content['social_links'])): ?>
                <div class="flex gap-4 mt-6">
                    <?php foreach ($content['social_links'] as $platform => $url): ?>
                        <?php if (isset($social_icons[$platform])): ?>
                        <a href="<?php echo esc_url($url); ?>"
                           class="<?php echo esc_attr($text_muted . ' ' . $text_hover); ?> transition-colors"
                           aria-label="<?php echo esc_attr(ucfirst($platform)); ?>"
                           target="_blank"
                           rel="noopener noreferrer">
                            <?php echo $social_icons[$platform]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                        </a>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </div>

            <!-- Column 2: Services (if 4-column or 3-column) -->
            <?php if (in_array($variant, ['4-column', '3-column']) && !empty($content['services_links'])): ?>
            <div>
                <h3 class="text-lg font-heading font-semibold mb-4">Services</h3>
                <ul class="space-y-2">
                    <?php foreach ($content['services_links'] as $link): ?>
                    <li>
                        <a href="<?php echo esc_url($link['url']); ?>"
                           class="block text-sm <?php echo esc_attr($text_muted . ' ' . $text_hover); ?> transition-colors">
                            <?php echo esc_html($link['text']); ?>
                        </a>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <?php endif; ?>

            <!-- Column 3: Quick Links (if 4-column) or combined with About (if 2/3-column) -->
            <?php if (!empty($content['about_links'])): ?>
            <div>
                <h3 class="text-lg font-heading font-semibold mb-4">Company</h3>
                <ul class="space-y-2">
                    <?php foreach ($content['about_links'] as $link): ?>
                    <li>
                        <a href="<?php echo esc_url($link['url']); ?>"
                           class="block text-sm <?php echo esc_attr($text_muted . ' ' . $text_hover); ?> transition-colors">
                            <?php echo esc_html($link['text']); ?>
                        </a>
                    </li>
                    <?php endforeach; ?>
                </ul>
            </div>
            <?php endif; ?>

            <!-- Column 4: Contact Info -->
            <div>
                <h3 class="text-lg font-heading font-semibold mb-4">Contact Us</h3>
                <ul class="space-y-3">
                    <?php if (!empty($content['contact_email'])): ?>
                    <li class="flex items-start gap-2">
                        <svg class="w-5 h-5 <?php echo esc_attr($text_muted); ?> mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <a href="mailto:<?php echo esc_attr($content['contact_email']); ?>"
                           class="text-sm <?php echo esc_attr($text_muted . ' ' . $text_hover); ?> transition-colors">
                            <?php echo esc_html($content['contact_email']); ?>
                        </a>
                    </li>
                    <?php endif; ?>

                    <?php if (!empty($content['contact_phone'])): ?>
                    <li class="flex items-start gap-2">
                        <svg class="w-5 h-5 <?php echo esc_attr($text_muted); ?> mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        <a href="tel:<?php echo esc_attr(preg_replace('/[^0-9+]/', '', $content['contact_phone'])); ?>"
                           class="text-sm <?php echo esc_attr($text_muted . ' ' . $text_hover); ?> transition-colors">
                            <?php echo esc_html($content['contact_phone']); ?>
                        </a>
                    </li>
                    <?php endif; ?>

                    <?php if (!empty($content['contact_address'])): ?>
                    <li class="flex items-start gap-2">
                        <svg class="w-5 h-5 <?php echo esc_attr($text_muted); ?> mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span class="text-sm <?php echo esc_attr($text_muted); ?>">
                            <?php echo esc_html($content['contact_address']); ?>
                        </span>
                    </li>
                    <?php endif; ?>
                </ul>

                <?php if ($show_newsletter): ?>
                <!-- Newsletter Signup -->
                <div class="mt-6">
                    <p class="text-sm <?php echo esc_attr($text_muted); ?> mb-3">Subscribe to our newsletter</p>
                    <form class="flex gap-2" action="#" method="post">
                        <input type="email"
                               placeholder="Your email"
                               class="flex-1 px-3 py-2 bg-white/10 border <?php echo esc_attr($border_color); ?> rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                               required>
                        <button type="submit"
                                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors">
                            Subscribe
                        </button>
                    </form>
                </div>
                <?php endif; ?>
            </div>
        </div>

        <!-- Bottom Bar -->
        <div class="border-t <?php echo esc_attr($border_color); ?> mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div class="text-sm <?php echo esc_attr($text_muted); ?>">
                &copy; <?php echo esc_html(date('Y')); ?> <?php echo esc_html($content['company_name']); ?>. All rights reserved.
            </div>

            <?php if (!empty($content['legal_links'])): ?>
            <div class="flex gap-6">
                <?php foreach ($content['legal_links'] as $link): ?>
                <a href="<?php echo esc_url($link['url']); ?>"
                   class="text-sm <?php echo esc_attr($text_muted . ' ' . $text_hover); ?> transition-colors">
                    <?php echo esc_html($link['text']); ?>
                </a>
                <?php endforeach; ?>
            </div>
            <?php endif; ?>
        </div>
    </div>

    <?php if ($show_back_to_top): ?>
    <!-- Back to Top Button -->
    <button onclick="window.scrollTo({top: 0, behavior: 'smooth'})"
            class="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all opacity-0 hover:opacity-100 focus:opacity-100"
            aria-label="Back to top"
            id="back-to-top">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>
        </svg>
    </button>
    <script>
        window.addEventListener('scroll', function() {
            var btn = document.getElementById('back-to-top');
            if (window.pageYOffset > 300) {
                btn.style.opacity = '1';
            } else {
                btn.style.opacity = '0';
            }
        });
    </script>
    <?php endif; ?>
</footer>
<!-- /wp:group -->
