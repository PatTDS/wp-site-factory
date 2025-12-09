<?php
/**
 * Header Centered Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$sticky = $config['sticky'] ?? true;
$show_cta = $config['show_cta'] ?? true;
$show_contact_info = $config['show_contact_info'] ?? false;
$transparent_on_scroll = $config['transparent_on_scroll'] ?? false;
$menu_alignment = $config['menu_alignment'] ?? 'center';

$header_classes = ['w-full bg-white border-b border-gray-200 transition-all duration-300'];
if ($sticky) {
    $header_classes[] = 'sticky top-0 z-50';
}
if ($transparent_on_scroll) {
    $header_classes[] = 'header-transparent-scroll';
}
?>

<!-- wp:group {"className":"header-centered","layout":{"type":"constrained"}} -->
<header class="<?php echo esc_attr(implode(' ', $header_classes)); ?>" role="banner" x-data="{ mobileMenuOpen: false }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <?php if ($show_contact_info && (!empty($content['phone']) || !empty($content['email']))): ?>
        <!-- Top Bar (Contact Info) -->
        <div class="hidden md:flex items-center justify-end gap-6 py-2 text-sm text-gray-600 border-b border-gray-100">
            <?php if (!empty($content['phone'])): ?>
            <a href="tel:<?php echo esc_attr(preg_replace('/[^0-9+]/', '', $content['phone'])); ?>"
               class="flex items-center gap-2 hover:text-primary-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <span><?php echo esc_html($content['phone']); ?></span>
            </a>
            <?php endif; ?>

            <?php if (!empty($content['email'])): ?>
            <a href="mailto:<?php echo esc_attr($content['email']); ?>"
               class="flex items-center gap-2 hover:text-primary-600 transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
                <span><?php echo esc_html($content['email']); ?></span>
            </a>
            <?php endif; ?>
        </div>
        <?php endif; ?>

        <!-- Main Navigation -->
        <nav class="flex items-center justify-between py-4" role="navigation" aria-label="Main navigation">
            <!-- Logo (Centered on mobile, left on desktop) -->
            <div class="flex-shrink-0 lg:flex-1">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="inline-block" aria-label="<?php echo esc_attr($content['logo_alt']); ?>">
                    <img src="<?php echo esc_url($content['logo_url']); ?>"
                         alt="<?php echo esc_attr($content['logo_alt']); ?>"
                         class="h-10 md:h-12 w-auto">
                </a>
            </div>

            <!-- Desktop Navigation -->
            <div class="hidden lg:flex items-center <?php echo $menu_alignment === 'spread' ? 'flex-1 justify-center' : 'gap-8'; ?>">
                <?php foreach ($content['menu_items'] as $item): ?>
                    <?php $is_active = $item['active'] ?? false; ?>
                    <a href="<?php echo esc_url($item['url']); ?>"
                       class="text-gray-700 hover:text-primary-600 font-medium transition-colors <?php echo $is_active ? 'text-primary-600' : ''; ?>"
                       <?php echo $is_active ? 'aria-current="page"' : ''; ?>>
                        <?php echo esc_html($item['text']); ?>
                    </a>
                <?php endforeach; ?>
            </div>

            <!-- CTA Button (Desktop) -->
            <?php if ($show_cta && !empty($content['cta_text'])): ?>
            <div class="hidden lg:flex lg:flex-1 lg:justify-end">
                <a href="<?php echo esc_url($content['cta_url']); ?>"
                   class="inline-flex items-center px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all shadow-sm hover:shadow-md">
                    <?php echo esc_html($content['cta_text']); ?>
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
            <?php endif; ?>

            <!-- Mobile Menu Toggle -->
            <button @click="mobileMenuOpen = !mobileMenuOpen"
                    type="button"
                    class="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    aria-expanded="false"
                    aria-label="Toggle navigation menu">
                <svg x-show="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
                <svg x-show="mobileMenuOpen" x-cloak class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </nav>

        <!-- Mobile Menu -->
        <div x-show="mobileMenuOpen"
             x-cloak
             x-transition:enter="transition ease-out duration-200"
             x-transition:enter-start="opacity-0 -translate-y-2"
             x-transition:enter-end="opacity-100 translate-y-0"
             x-transition:leave="transition ease-in duration-150"
             x-transition:leave-start="opacity-100 translate-y-0"
             x-transition:leave-end="opacity-0 -translate-y-2"
             class="lg:hidden border-t border-gray-200 py-4">
            <div class="flex flex-col gap-2">
                <?php foreach ($content['menu_items'] as $item): ?>
                    <?php $is_active = $item['active'] ?? false; ?>
                    <a href="<?php echo esc_url($item['url']); ?>"
                       class="block py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors <?php echo $is_active ? 'bg-primary-50 text-primary-600' : ''; ?>"
                       <?php echo $is_active ? 'aria-current="page"' : ''; ?>>
                        <?php echo esc_html($item['text']); ?>
                    </a>
                <?php endforeach; ?>

                <?php if ($show_cta && !empty($content['cta_text'])): ?>
                <a href="<?php echo esc_url($content['cta_url']); ?>"
                   class="mt-4 inline-flex items-center justify-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all">
                    <?php echo esc_html($content['cta_text']); ?>
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </a>
                <?php endif; ?>
            </div>
        </div>
    </div>
</header>
<!-- /wp:group -->

<?php if ($sticky || $transparent_on_scroll): ?>
<script>
// Header scroll effects
(function() {
    const header = document.querySelector('.header-centered');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add shadow on scroll
        if (currentScroll > scrollThreshold) {
            header.classList.add('shadow-md');
        } else {
            header.classList.remove('shadow-md');
        }

        <?php if ($transparent_on_scroll): ?>
        // Transparent to solid transition
        if (currentScroll > scrollThreshold) {
            header.classList.remove('bg-transparent', 'border-transparent');
            header.classList.add('bg-white', 'border-gray-200');
        } else {
            header.classList.add('bg-transparent', 'border-transparent');
            header.classList.remove('bg-white', 'border-gray-200');
        }
        <?php endif; ?>

        lastScroll = currentScroll;
    }, { passive: true });
})();
</script>
<?php endif; ?>
