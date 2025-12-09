<?php
/**
 * Header Simple Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'solid';
$logo_position = $config['logo_position'] ?? 'left';
$nav_position = $config['nav_position'] ?? 'right';
$show_cta = $config['show_cta'] ?? true;
$sticky_enabled = $config['sticky_enabled'] ?? true;

$header_bg = match($variant) {
    'transparent' => 'bg-transparent',
    'sticky' => 'bg-white/80 backdrop-blur-lg',
    default => 'bg-white',
};

$border_class = $variant === 'transparent' ? '' : 'border-b border-gray-100';
$sticky_class = $sticky_enabled ? 'sticky-header' : '';
?>

<!-- wp:group {"className":"header-simple","layout":{"type":"constrained"}} -->
<header class="fixed top-0 w-full z-50 <?php echo esc_attr("$header_bg $border_class $sticky_class"); ?> transition-all duration-300"
        data-header="simple"
        x-data="{ mobileMenuOpen: false }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 md:h-20">
            <!-- Logo -->
            <div class="flex-shrink-0 <?php echo $logo_position === 'center' ? 'md:flex-1' : ''; ?>">
                <a href="/" class="inline-block">
                    <?php if (!empty($content['logo_url'])): ?>
                    <img src="<?php echo esc_url($content['logo_url']); ?>"
                         alt="<?php echo esc_attr($content['logo_alt']); ?>"
                         class="h-8 md:h-10 w-auto">
                    <?php else: ?>
                    <span class="text-xl md:text-2xl font-bold text-gray-900"><?php echo esc_html($content['logo_alt']); ?></span>
                    <?php endif; ?>
                </a>
            </div>

            <!-- Desktop Navigation -->
            <nav class="hidden md:flex items-center gap-8 <?php echo $nav_position === 'center' ? 'flex-1 justify-center' : ''; ?>">
                <?php foreach ($content['nav_items'] as $item): ?>
                <a href="<?php echo esc_url($item['url']); ?>"
                   class="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">
                    <?php echo esc_html($item['label']); ?>
                </a>
                <?php endforeach; ?>
            </nav>

            <!-- CTA Button (Desktop) -->
            <?php if ($show_cta && !empty($content['cta_text'])): ?>
            <div class="hidden md:flex items-center">
                <a href="<?php echo esc_url($content['cta_url'] ?? '#contact'); ?>"
                   class="inline-flex items-center px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                    <?php echo esc_html($content['cta_text']); ?>
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </a>
            </div>
            <?php endif; ?>

            <!-- Mobile Menu Toggle -->
            <button @click="mobileMenuOpen = !mobileMenuOpen"
                    class="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
                    :aria-expanded="mobileMenuOpen"
                    aria-label="Toggle navigation menu">
                <svg x-show="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
                <svg x-show="mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style="display: none;">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
    </div>

    <!-- Mobile Menu -->
    <div x-show="mobileMenuOpen"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0 -translate-y-2"
         x-transition:enter-end="opacity-100 translate-y-0"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100 translate-y-0"
         x-transition:leave-end="opacity-0 -translate-y-2"
         class="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg"
         style="display: none;"
         @click.away="mobileMenuOpen = false">
        <div class="px-4 py-6 space-y-1">
            <?php foreach ($content['nav_items'] as $item): ?>
            <a href="<?php echo esc_url($item['url']); ?>"
               class="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors"
               @click="mobileMenuOpen = false">
                <?php echo esc_html($item['label']); ?>
            </a>
            <?php endforeach; ?>

            <?php if ($show_cta && !empty($content['cta_text'])): ?>
            <a href="<?php echo esc_url($content['cta_url'] ?? '#contact'); ?>"
               class="block mt-4 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white text-center font-semibold rounded-lg transition-colors"
               @click="mobileMenuOpen = false">
                <?php echo esc_html($content['cta_text']); ?>
            </a>
            <?php endif; ?>
        </div>
    </div>
</header>
<!-- /wp:group -->

<style>
/* Sticky header behavior */
.sticky-header {
    transition: background-color 0.3s, box-shadow 0.3s;
}

.sticky-header.scrolled {
    background-color: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(12px);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* CSS-only mobile menu fallback */
@media (max-width: 768px) {
    .mobile-menu-toggle:checked ~ .mobile-menu {
        display: block;
    }
}
</style>

<script>
// Sticky header scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('[data-header="simple"]');
    if (!header || !header.classList.contains('sticky-header')) return;

    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });
});
</script>
