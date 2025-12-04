<?php
/**
 * Template Name: Services Page
 *
 * Services page template for Anywhere Solutions
 *
 * @package anywhere-solutions
 */

get_header();
?>

<main id="primary" class="site-main">

    <!-- Page Header -->
    <section class="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
                <p class="text-xl text-primary-100 max-w-2xl mx-auto">Complete workforce and supply solutions for construction, manufacturing, warehousing, and industrial sectors.</p>
            </div>
        </div>
    </section>

    <!-- Labour Hire Section -->
    <section id="labour-hire" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <span class="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">Labour Hire</span>
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Skilled & Reliable Workers</h2>
                    <p class="text-lg text-gray-600 mb-8">We provide vetted, qualified workers across all skill levels. From general labourers to specialized tradespeople, our workforce is ready to support your projects.</p>

                    <div class="grid sm:grid-cols-2 gap-4 mb-8">
                        <div class="bg-gray-50 rounded-xl p-4">
                            <h4 class="font-semibold text-gray-900 mb-2">General Labourers</h4>
                            <p class="text-sm text-gray-600">Reliable workers for construction sites, warehouses, and factories</p>
                        </div>
                        <div class="bg-gray-50 rounded-xl p-4">
                            <h4 class="font-semibold text-gray-900 mb-2">Warehouse Staff</h4>
                            <p class="text-sm text-gray-600">Forklift operators, pickers, packers, and logistics personnel</p>
                        </div>
                        <div class="bg-gray-50 rounded-xl p-4">
                            <h4 class="font-semibold text-gray-900 mb-2">Machine Operators</h4>
                            <p class="text-sm text-gray-600">Certified operators for various industrial machinery</p>
                        </div>
                        <div class="bg-gray-50 rounded-xl p-4">
                            <h4 class="font-semibold text-gray-900 mb-2">Trade Assistants</h4>
                            <p class="text-sm text-gray-600">Support staff for electricians, plumbers, and builders</p>
                        </div>
                    </div>

                    <a href="<?php echo esc_url(home_url('/contact')); ?>" class="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                        Request Workers
                        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                    </a>
                </div>
                <div class="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-8 h-96 flex items-center justify-center">
                    <div class="text-center">
                        <svg class="w-24 h-24 text-primary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                        <p class="text-primary-600 font-medium">Labour Hire Image</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Industrial Supplies Section -->
    <section id="industrial-supplies" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-16 items-center">
                <div class="order-2 lg:order-1 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl p-8 h-96 flex items-center justify-center">
                    <div class="text-center">
                        <svg class="w-24 h-24 text-secondary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                        <p class="text-secondary-600 font-medium">Industrial Supplies Image</p>
                    </div>
                </div>
                <div class="order-1 lg:order-2">
                    <span class="inline-block px-4 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-4">Industrial Supplies</span>
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Quality Products & Materials</h2>
                    <p class="text-lg text-gray-600 mb-8">From construction materials to tools and equipment, we supply everything your project needs. Competitive pricing with reliable delivery across Perth metro and regional WA.</p>

                    <div class="space-y-4 mb-8">
                        <div class="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                            <div class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                                </svg>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">Construction Materials</h4>
                                <p class="text-sm text-gray-600">Timber, concrete products, steel, and building supplies</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                            <div class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">Tools & Equipment</h4>
                                <p class="text-sm text-gray-600">Power tools, hand tools, and specialized equipment</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
                            <div class="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                                </svg>
                            </div>
                            <div>
                                <h4 class="font-semibold text-gray-900">Bulk Orders</h4>
                                <p class="text-sm text-gray-600">Volume discounts for large projects and ongoing accounts</p>
                            </div>
                        </div>
                    </div>

                    <a href="<?php echo esc_url(home_url('/contact')); ?>" class="inline-flex items-center px-6 py-3 bg-secondary-500 text-white font-semibold rounded-lg hover:bg-secondary-600 transition-colors">
                        Request Quote
                        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- Safety Equipment Section -->
    <section id="safety-equipment" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <span class="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold mb-4">Safety Equipment</span>
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Australian Certified PPE</h2>
                    <p class="text-lg text-gray-600 mb-8">Protect your workers with quality, compliant safety equipment. All our PPE meets Australian safety standards and comes with full documentation.</p>

                    <div class="grid grid-cols-3 gap-4 mb-8">
                        <div class="text-center p-4 bg-green-50 rounded-xl">
                            <svg class="w-10 h-10 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                            </svg>
                            <span class="text-sm font-medium text-gray-700">Hard Hats</span>
                        </div>
                        <div class="text-center p-4 bg-green-50 rounded-xl">
                            <svg class="w-10 h-10 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            <span class="text-sm font-medium text-gray-700">Eye Protection</span>
                        </div>
                        <div class="text-center p-4 bg-green-50 rounded-xl">
                            <svg class="w-10 h-10 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
                            </svg>
                            <span class="text-sm font-medium text-gray-700">Gloves</span>
                        </div>
                        <div class="text-center p-4 bg-green-50 rounded-xl">
                            <svg class="w-10 h-10 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                            </svg>
                            <span class="text-sm font-medium text-gray-700">Hi-Vis Wear</span>
                        </div>
                        <div class="text-center p-4 bg-green-50 rounded-xl">
                            <svg class="w-10 h-10 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                            <span class="text-sm font-medium text-gray-700">First Aid</span>
                        </div>
                        <div class="text-center p-4 bg-green-50 rounded-xl">
                            <svg class="w-10 h-10 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                            </svg>
                            <span class="text-sm font-medium text-gray-700">Safety Boots</span>
                        </div>
                    </div>

                    <div class="bg-green-50 border border-green-200 rounded-xl p-4 mb-8">
                        <div class="flex items-start gap-3">
                            <svg class="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            <div>
                                <h4 class="font-semibold text-green-800">All Products Meet Australian Standards</h4>
                                <p class="text-sm text-green-700">AS/NZS certified equipment with full compliance documentation provided.</p>
                            </div>
                        </div>
                    </div>

                    <a href="<?php echo esc_url(home_url('/contact')); ?>" class="inline-flex items-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors">
                        Order Safety Equipment
                        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                        </svg>
                    </a>
                </div>
                <div class="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-8 h-96 flex items-center justify-center">
                    <div class="text-center">
                        <svg class="w-24 h-24 text-green-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                        <p class="text-green-600 font-medium">Safety Equipment Image</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary-800 to-primary-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">Need Multiple Services?</h2>
            <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">We offer bundled packages for clients who need labour, supplies, and safety equipment together. Save time and money with Anywhere Solutions.</p>
            <a href="<?php echo esc_url(home_url('/contact')); ?>" class="inline-flex items-center justify-center px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-lg transition-colors shadow-lg">
                Get a Custom Quote
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
            </a>
        </div>
    </section>

</main>

<?php get_footer(); ?>
