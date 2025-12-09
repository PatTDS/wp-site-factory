<?php
/**
 * Header Split Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$sticky = $config['sticky'] ?? true;
$show_search = $config['show_search'] ?? true;
$show_contact_bar = $config['show_contact_bar'] ?? true;
$show_social = $config['show_social'] ?? false;
$enable_mega_menu = $config['enable_mega_menu'] ?? false;

$header_classes = ['w-full bg-white transition-all duration-300'];
if ($sticky) {
    $header_classes[] = 'sticky top-0 z-50';
}
?>

<!-- wp:group {"className":"header-split","layout":{"type":"constrained"}} -->
<header class="<?php echo esc_attr(implode(' ', $header_classes)); ?>" role="banner" x-data="{ mobileMenuOpen: false, searchOpen: false }">
    <?php if ($show_contact_bar && (!empty($content['phone']) || !empty($content['email']) || !empty($content['address']))): ?>
    <!-- Top Contact Bar -->
    <div class="bg-gray-900 text-white text-sm">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <!-- Contact Info -->
                <div class="flex flex-wrap items-center gap-4 md:gap-6">
                    <?php if (!empty($content['phone'])): ?>
                    <a href="tel:<?php echo esc_attr(preg_replace('/[^0-9+]/', '', $content['phone'])); ?>"
                       class="flex items-center gap-2 hover:text-primary-300 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                        </svg>
                        <span><?php echo esc_html($content['phone']); ?></span>
                    </a>
                    <?php endif; ?>

                    <?php if (!empty($content['email'])): ?>
                    <a href="mailto:<?php echo esc_attr($content['email']); ?>"
                       class="flex items-center gap-2 hover:text-primary-300 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        <span><?php echo esc_html($content['email']); ?></span>
                    </a>
                    <?php endif; ?>

                    <?php if (!empty($content['address'])): ?>
                    <div class="hidden lg:flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                        <span><?php echo esc_html($content['address']); ?></span>
                    </div>
                    <?php endif; ?>
                </div>

                <?php if ($show_social && !empty($content['social_links'])): ?>
                <!-- Social Links -->
                <div class="flex items-center gap-3">
                    <?php foreach ($content['social_links'] as $social): ?>
                    <a href="<?php echo esc_url($social['url']); ?>"
                       target="_blank"
                       rel="noopener noreferrer"
                       class="hover:text-primary-300 transition-colors"
                       aria-label="<?php echo esc_attr($social['platform']); ?>">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <?php if ($social['platform'] === 'facebook'): ?>
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            <?php elseif ($social['platform'] === 'instagram'): ?>
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                            <?php elseif ($social['platform'] === 'linkedin'): ?>
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                            <?php endif; ?>
                        </svg>
                    </a>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
    <?php endif; ?>

    <!-- Main Navigation -->
    <div class="border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav class="flex items-center justify-between py-4" role="navigation" aria-label="Main navigation">
                <!-- Logo -->
                <div class="flex-shrink-0">
                    <a href="<?php echo esc_url(home_url('/')); ?>" aria-label="<?php echo esc_attr($content['logo_alt']); ?>">
                        <img src="<?php echo esc_url($content['logo_url']); ?>"
                             alt="<?php echo esc_attr($content['logo_alt']); ?>"
                             class="h-12 md:h-14 w-auto">
                    </a>
                </div>

                <!-- Desktop Navigation -->
                <div class="hidden lg:flex items-center gap-6 xl:gap-8">
                    <?php foreach ($content['menu_items'] as $item): ?>
                        <?php $is_active = $item['active'] ?? false; ?>
                        <?php $has_submenu = $item['has_submenu'] ?? false; ?>

                        <?php if ($has_submenu && $enable_mega_menu): ?>
                        <div class="relative group" x-data="{ open: false }" @mouseenter="open = true" @mouseleave="open = false">
                            <button class="text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center gap-1"
                                    <?php echo $is_active ? 'aria-current="page"' : ''; ?>>
                                <?php echo esc_html($item['text']); ?>
                                <svg class="w-4 h-4 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>

                            <!-- Mega Menu Dropdown -->
                            <div x-show="open"
                                 x-cloak
                                 x-transition
                                 class="absolute left-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl py-2">
                                <?php if (!empty($item['submenu'])): ?>
                                    <?php foreach ($item['submenu'] as $subitem): ?>
                                    <a href="<?php echo esc_url($subitem['url']); ?>"
                                       class="block px-4 py-2 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors">
                                        <?php echo esc_html($subitem['text']); ?>
                                    </a>
                                    <?php endforeach; ?>
                                <?php endif; ?>
                            </div>
                        </div>
                        <?php else: ?>
                        <a href="<?php echo esc_url($item['url']); ?>"
                           class="text-gray-700 hover:text-primary-600 font-medium transition-colors <?php echo $is_active ? 'text-primary-600' : ''; ?>"
                           <?php echo $is_active ? 'aria-current="page"' : ''; ?>>
                            <?php echo esc_html($item['text']); ?>
                        </a>
                        <?php endif; ?>
                    <?php endforeach; ?>
                </div>

                <!-- Search & Mobile Toggle -->
                <div class="flex items-center gap-3">
                    <?php if ($show_search): ?>
                    <!-- Search Icon (Mobile) -->
                    <button @click="searchOpen = !searchOpen"
                            type="button"
                            class="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Toggle search">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </button>

                    <!-- Search Bar (Desktop) -->
                    <form action="<?php echo esc_url(home_url('/')); ?>" method="get" class="hidden md:flex items-center">
                        <input type="search"
                               name="s"
                               placeholder="Search..."
                               class="px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 w-48 xl:w-64 transition-all"
                               aria-label="Search">
                        <button type="submit"
                                class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg transition-colors"
                                aria-label="Submit search">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </button>
                    </form>
                    <?php endif; ?>

                    <!-- Mobile Menu Toggle -->
                    <button @click="mobileMenuOpen = !mobileMenuOpen"
                            type="button"
                            class="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Toggle navigation menu">
                        <svg x-show="!mobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                        <svg x-show="mobileMenuOpen" x-cloak class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
            </nav>

            <?php if ($show_search): ?>
            <!-- Mobile Search Bar -->
            <div x-show="searchOpen"
                 x-cloak
                 x-transition
                 class="md:hidden pb-4">
                <form action="<?php echo esc_url(home_url('/')); ?>" method="get" class="flex items-center">
                    <input type="search"
                           name="s"
                           placeholder="Search..."
                           class="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                           aria-label="Search">
                    <button type="submit"
                            class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-r-lg transition-colors"
                            aria-label="Submit search">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </button>
                </form>
            </div>
            <?php endif; ?>
        </div>
    </div>

    <!-- Mobile Menu Drawer -->
    <div x-show="mobileMenuOpen"
         x-cloak
         @click.away="mobileMenuOpen = false"
         x-transition:enter="transition ease-out duration-300"
         x-transition:enter-start="opacity-0 translate-x-full"
         x-transition:enter-end="opacity-100 translate-x-0"
         x-transition:leave="transition ease-in duration-200"
         x-transition:leave-start="opacity-100 translate-x-0"
         x-transition:leave-end="opacity-0 translate-x-full"
         class="lg:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-white shadow-2xl z-50 overflow-y-auto">
        <div class="p-6">
            <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-semibold text-gray-900">Menu</h2>
                <button @click="mobileMenuOpen = false"
                        class="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            </div>

            <nav class="flex flex-col gap-2">
                <?php foreach ($content['menu_items'] as $item): ?>
                    <?php $is_active = $item['active'] ?? false; ?>
                    <a href="<?php echo esc_url($item['url']); ?>"
                       class="block py-3 px-4 text-gray-700 hover:bg-gray-50 hover:text-primary-600 rounded-lg transition-colors <?php echo $is_active ? 'bg-primary-50 text-primary-600' : ''; ?>"
                       <?php echo $is_active ? 'aria-current="page"' : ''; ?>>
                        <?php echo esc_html($item['text']); ?>
                    </a>
                <?php endforeach; ?>
            </nav>
        </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div x-show="mobileMenuOpen"
         x-cloak
         @click="mobileMenuOpen = false"
         x-transition:enter="transition-opacity ease-out duration-300"
         x-transition:enter-start="opacity-0"
         x-transition:enter-end="opacity-100"
         x-transition:leave="transition-opacity ease-in duration-200"
         x-transition:leave-start="opacity-100"
         x-transition:leave-end="opacity-0"
         class="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"></div>
</header>
<!-- /wp:group -->

<?php if ($sticky): ?>
<script>
// Header scroll shadow
(function() {
    const header = document.querySelector('.header-split');
    if (!header) return;

    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > scrollThreshold) {
            header.classList.add('shadow-md');
        } else {
            header.classList.remove('shadow-md');
        }
    }, { passive: true });
})();
</script>
<?php endif; ?>
