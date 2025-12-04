<?php
/**
 * Template Name: About Page
 *
 * About page template for Anywhere Solutions
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
                <h1 class="text-4xl md:text-5xl font-bold mb-4">About Anywhere Solutions</h1>
                <p class="text-xl text-primary-100 max-w-2xl mx-auto">Proudly Australian owned, providing comprehensive workforce management and industrial solutions across Western Australia and beyond.</p>
            </div>
        </div>
    </section>

    <!-- Our Story -->
    <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <span class="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">Our Story</span>
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Built on Experience, Driven by Service</h2>
                    <div class="prose prose-lg text-gray-600">
                        <p>Anywhere Solutions was founded on a simple belief: <strong>Because People Matter</strong>. We understand that your success depends on having the right people and the right equipment, exactly when you need them.</p>
                        <p>Based in Perth, we've built our reputation serving Western Australia's most demanding industries — from remote mining sites in the Pilbara to busy construction projects across the metropolitan area.</p>
                        <p>What sets us apart is our comprehensive approach. We don't just fill positions; we build engaged workforces that respect your company culture. Our 24/7 availability means we're always ready when you need us, and our extensive network ensures we have access to skilled professionals across all trades and industries.</p>
                    </div>
                </div>
                <div class="relative">
                    <div class="absolute -inset-4 bg-primary-100 rounded-2xl transform -rotate-3"></div>
                    <div class="relative bg-gradient-to-br from-primary-200 to-primary-300 rounded-2xl h-96 flex items-center justify-center">
                        <div class="text-center">
                            <svg class="w-24 h-24 text-primary-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                            </svg>
                            <p class="text-primary-500 font-medium">Company Image</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Values -->
    <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <span class="inline-block px-4 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-4">Our Values</span>
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What We Stand For</h2>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">The principles that guide everything we do.</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                    <div class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">Safety First</h3>
                    <p class="text-gray-600">Every worker, every product, every decision prioritizes workplace safety.</p>
                </div>

                <div class="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                    <div class="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg class="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">Reliability</h3>
                    <p class="text-gray-600">We deliver on our promises. When you need workers or supplies, we're there.</p>
                </div>

                <div class="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                    <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">Quality</h3>
                    <p class="text-gray-600">From our workers to our products, we never compromise on quality.</p>
                </div>

                <div class="bg-white rounded-2xl p-8 text-center shadow-sm hover:shadow-md transition-shadow">
                    <div class="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                    </div>
                    <h3 class="text-xl font-bold text-gray-900 mb-3">Partnership</h3>
                    <p class="text-gray-600">We build long-term relationships, not just transactions.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Industries We Serve -->
    <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <span class="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">Industries</span>
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Industries We Serve</h2>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">Providing workforce and supply solutions across diverse sectors.</p>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div class="group flex items-center gap-4 p-6 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors">
                    <div class="w-12 h-12 bg-primary-100 group-hover:bg-primary-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Construction</h3>
                        <p class="text-sm text-gray-600">Residential, commercial & civil projects</p>
                    </div>
                </div>

                <div class="group flex items-center gap-4 p-6 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors">
                    <div class="w-12 h-12 bg-primary-100 group-hover:bg-primary-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Manufacturing</h3>
                        <p class="text-sm text-gray-600">Production lines & industrial facilities</p>
                    </div>
                </div>

                <div class="group flex items-center gap-4 p-6 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors">
                    <div class="w-12 h-12 bg-primary-100 group-hover:bg-primary-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Warehousing</h3>
                        <p class="text-sm text-gray-600">Logistics, distribution & storage</p>
                    </div>
                </div>

                <div class="group flex items-center gap-4 p-6 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors">
                    <div class="w-12 h-12 bg-primary-100 group-hover:bg-primary-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Events</h3>
                        <p class="text-sm text-gray-600">Setup, operations & pack-down crews</p>
                    </div>
                </div>

                <div class="group flex items-center gap-4 p-6 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors">
                    <div class="w-12 h-12 bg-primary-100 group-hover:bg-primary-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Mining & Resources</h3>
                        <p class="text-sm text-gray-600">On-site support & equipment supply</p>
                    </div>
                </div>

                <div class="group flex items-center gap-4 p-6 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors">
                    <div class="w-12 h-12 bg-primary-100 group-hover:bg-primary-200 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                        <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">Agriculture</h3>
                        <p class="text-sm text-gray-600">Seasonal labour & farming supplies</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Team Section -->
    <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <span class="inline-block px-4 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-4">Our Team</span>
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The People Behind Anywhere Solutions</h2>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">Dedicated professionals committed to your success.</p>
            </div>

            <div class="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div class="h-48 bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                        <svg class="w-20 h-20 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    </div>
                    <div class="p-6 text-center">
                        <h3 class="text-lg font-bold text-gray-900 mb-1">Operations Team</h3>
                        <p class="text-primary-600 text-sm mb-3">Workforce Coordination</p>
                        <p class="text-gray-600 text-sm">Managing worker placement and ensuring project success.</p>
                    </div>
                </div>

                <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div class="h-48 bg-gradient-to-br from-secondary-100 to-secondary-200 flex items-center justify-center">
                        <svg class="w-20 h-20 text-secondary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    </div>
                    <div class="p-6 text-center">
                        <h3 class="text-lg font-bold text-gray-900 mb-1">Sales Team</h3>
                        <p class="text-secondary-600 text-sm mb-3">Client Solutions</p>
                        <p class="text-gray-600 text-sm">Connecting businesses with the right solutions.</p>
                    </div>
                </div>

                <div class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div class="h-48 bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                        <svg class="w-20 h-20 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    </div>
                    <div class="p-6 text-center">
                        <h3 class="text-lg font-bold text-gray-900 mb-1">Support Team</h3>
                        <p class="text-green-600 text-sm mb-3">Customer Service</p>
                        <p class="text-gray-600 text-sm">Here to help with any questions or concerns.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-gradient-to-r from-primary-800 to-primary-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Work With Us?</h2>
            <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">Join the many businesses that trust Anywhere Solutions for their workforce and supply needs.</p>
            <a href="<?php echo esc_url(home_url('/contact')); ?>" class="inline-flex items-center justify-center px-8 py-4 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-lg transition-colors shadow-lg">
                Get Started Today
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
            </a>
        </div>
    </section>

</main>

<?php get_footer(); ?>
