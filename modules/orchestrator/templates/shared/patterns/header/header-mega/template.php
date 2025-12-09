<?php
/**
 * Header Mega Menu Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$show_search = $config['show_search'] ?? false;
$dropdown_style = $config['dropdown_style'] ?? 'grid';
$max_columns = min(max($config['max_columns'] ?? 4, 2), 4);
$sticky_enabled = $config['sticky_enabled'] ?? true;

$sticky_class = $sticky_enabled ? 'sticky-header' : '';
$grid_cols = "grid-cols-1 md:grid-cols-{$max_columns}";
?>

<!-- wp:group {"className":"header-mega","layout":{"type":"constrained"}} -->
<header class="fixed top-0 w-full z-50 bg-white border-b border-gray-100 <?php echo esc_attr($sticky_class); ?> transition-all duration-300"
        data-header="mega"
        x-data="{ mobileMenuOpen: false, searchOpen: false, activeDropdown: null }">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16 md:h-20">
            <!-- Logo -->
            <div class="flex-shrink-0">
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

            <!-- Desktop Navigation with Mega Menus -->
            <nav class="hidden lg:flex items-center gap-1">
                <?php foreach ($content['nav_items'] as $index => $item): ?>
                <div class="relative group"
                     @mouseenter="activeDropdown = <?php echo $index; ?>"
                     @mouseleave="activeDropdown = null">
                    <a href="<?php echo esc_url($item['url']); ?>"
                       class="inline-flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200">
                        <?php echo esc_html($item['label']); ?>
                        <?php if (!empty($item['children'])): ?>
                        <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                        <?php endif; ?>
                    </a>

                    <?php if (!empty($item['children'])): ?>
                    <!-- Mega Menu Dropdown -->
                    <div x-show="activeDropdown === <?php echo $index; ?>"
                         x-transition:enter="transition ease-out duration-200"
                         x-transition:enter-start="opacity-0 scale-95"
                         x-transition:enter-end="opacity-100 scale-100"
                         x-transition:leave="transition ease-in duration-150"
                         x-transition:leave-start="opacity-100 scale-100"
                         x-transition:leave-end="opacity-0 scale-95"
                         class="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-screen max-w-4xl bg-white border border-gray-100 shadow-xl rounded-lg overflow-hidden"
                         style="display: none;">
                        <div class="grid <?php echo esc_attr($grid_cols); ?> gap-6 p-8">
                            <?php foreach ($item['children'] as $child): ?>
                            <a href="<?php echo esc_url($child['url']); ?>"
                               class="group/item p-4 rounded-lg hover:bg-primary-50 transition-colors">
                                <div class="font-semibold text-gray-900 group-hover/item:text-primary-600 transition-colors mb-1">
                                    <?php echo esc_html($child['label']); ?>
                                </div>
                                <?php if (!empty($child['description'])): ?>
                                <div class="text-sm text-gray-600">
                                    <?php echo esc_html($child['description']); ?>
                                </div>
                                <?php endif; ?>
                            </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <?php endif; ?>
                </div>
                <?php endforeach; ?>
            </nav>

            <!-- Right Side Actions -->
            <div class="flex items-center gap-3">
                <?php if ($show_search): ?>
                <!-- Search Button -->
                <button @click="searchOpen = !searchOpen"
                        class="p-2 text-gray-700 hover:text-primary-600 transition-colors"
                        aria-label="Search">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                    </svg>
                </button>
                <?php endif; ?>

                <!-- CTA Button -->
                <a href="<?php echo esc_url($content['cta_url'] ?? '#contact'); ?>"
                   class="hidden lg:inline-flex items-center px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md">
                    <?php echo esc_html($content['cta_text']); ?>
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                    </svg>
                </a>

                <!-- Mobile Menu Toggle -->
                <button @click="mobileMenuOpen = !mobileMenuOpen"
                        class="lg:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors"
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
    </div>

    <!-- Search Overlay -->
    <?php if ($show_search): ?>
    <div x-show="searchOpen"
         x-transition:enter="transition ease-out duration-200"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition ease-in duration-150"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         class="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg"
         style="display: none;"
         @click.away="searchOpen = false">
        <div class="max-w-3xl mx-auto px-4 py-6">
            <input type="search"
                   placeholder="<?php echo esc_attr($content['search_placeholder']); ?>"
                   class="w-full px-6 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                   x-ref="searchInput"
                   @keydown.escape="searchOpen = false">
        </div>
    </div>
    <?php endif; ?>

    <!-- Mobile Drawer Menu -->
    <div x-show="mobileMenuOpen"
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0 translate-x-full"
         x-transition:enter-end="opacity-100 translate-x-0"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100 translate-x-0"
         x-transition:leave-end="opacity-0 translate-x-full"
         class="lg:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl overflow-y-auto"
         style="display: none;"
         @click.away="mobileMenuOpen = false">
        <div class="p-6">
            <div class="flex justify-between items-center mb-8">
                <span class="text-xl font-bold text-gray-900"><?php echo esc_html($content['logo_alt']); ?></span>
                <button @click="mobileMenuOpen = false" class="p-2 text-gray-700 hover:text-primary-600">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <div class="space-y-2">
                <?php foreach ($content['nav_items'] as $item): ?>
                <div x-data="{ expanded: false }">
                    <?php if (!empty($item['children'])): ?>
                    <button @click="expanded = !expanded"
                            class="w-full flex items-center justify-between px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors">
                        <?php echo esc_html($item['label']); ?>
                        <svg :class="expanded ? 'rotate-180' : ''" class="w-5 h-5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                        </svg>
                    </button>
                    <div x-show="expanded" x-collapse class="pl-4 space-y-1 mt-1">
                        <?php foreach ($item['children'] as $child): ?>
                        <a href="<?php echo esc_url($child['url']); ?>"
                           class="block px-4 py-2 text-sm text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                           @click="mobileMenuOpen = false">
                            <?php echo esc_html($child['label']); ?>
                        </a>
                        <?php endforeach; ?>
                    </div>
                    <?php else: ?>
                    <a href="<?php echo esc_url($item['url']); ?>"
                       class="block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg font-medium transition-colors"
                       @click="mobileMenuOpen = false">
                        <?php echo esc_html($item['label']); ?>
                    </a>
                    <?php endif; ?>
                </div>
                <?php endforeach; ?>

                <a href="<?php echo esc_url($content['cta_url'] ?? '#contact'); ?>"
                   class="block mt-6 px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white text-center font-semibold rounded-lg transition-colors"
                   @click="mobileMenuOpen = false">
                    <?php echo esc_html($content['cta_text']); ?>
                </a>
            </div>
        </div>
    </div>
</header>
<!-- /wp:group -->

<style>
/* Sticky header behavior */
.sticky-header {
    transition: all 0.3s;
}

.sticky-header.scrolled {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

/* Mobile drawer overlay */
@media (max-width: 1024px) {
    [x-cloak] { display: none !important; }
}
</style>

<script>
// Sticky header scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('[data-header="mega"]');
    if (!header || !header.classList.contains('sticky-header')) return;

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
});
</script>
