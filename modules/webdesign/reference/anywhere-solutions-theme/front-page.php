<?php
/**
 * Front Page Template - Anywhere Solutions
 *
 * Modern homepage featuring labour hire, industrial supplies, and safety equipment services.
 *
 * @package anywhere-solutions
 */

get_header();
?>

<main id="primary" class="site-main">

    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        <!-- Animated Background Elements -->
        <div class="absolute inset-0">
            <!-- Gradient Orbs -->
            <div class="absolute top-20 left-10 w-72 h-72 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
            <div class="absolute bottom-20 right-10 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 1s;"></div>
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-secondary-600/10 rounded-full blur-3xl"></div>
            <!-- Subtle Pattern -->
            <div class="absolute inset-0 bg-hero-pattern opacity-30"></div>
            <!-- Grid Lines -->
            <div class="absolute inset-0 opacity-5" style="background-image: linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px); background-size: 50px 50px;"></div>
        </div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 lg:py-32">
            <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                <!-- Content -->
                <div class="space-y-8 animate-fade-in">
                    <!-- Badge -->
                    <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        <span class="w-2 h-2 bg-secondary-400 rounded-full animate-pulse"></span>
                        <span class="text-sm font-medium text-white/90">Proudly Australian Owned</span>
                    </div>

                    <h1 class="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold leading-[1.1] tracking-tight">
                        Your Complete<br>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 via-secondary-300 to-secondary-400">Workforce</span> &<br>
                        <span class="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 via-secondary-300 to-secondary-400">Industrial</span> Partner
                    </h1>

                    <p class="text-lg md:text-xl text-primary-100/90 max-w-xl leading-relaxed">
                        Delivering skilled labour hire, quality industrial supplies, and certified safety equipment to businesses across <strong class="text-white">Western Australia</strong>. Because your success is our priority.
                    </p>

                    <!-- CTA Buttons -->
                    <div class="flex flex-col sm:flex-row gap-4 pt-4">
                        <a href="<?php echo esc_url(home_url('/contact')); ?>" class="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-secondary-500 to-secondary-600 hover:from-secondary-600 hover:to-secondary-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-secondary-500/25 hover:shadow-xl hover:shadow-secondary-500/30 hover:-translate-y-0.5">
                            Get a Free Quote
                            <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                            </svg>
                        </a>
                        <a href="<?php echo esc_url(home_url('/services')); ?>" class="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 hover:border-white/50 text-white font-semibold rounded-xl transition-all duration-300">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                            </svg>
                            Our Services
                        </a>
                    </div>

                    <!-- Trust Badges -->
                    <div class="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
                        <div class="flex items-center gap-2">
                            <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                </svg>
                            </div>
                            <span class="text-sm text-white/80">Fully Insured</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <span class="text-sm text-white/80">24/7 Support</span>
                        </div>
                        <div class="flex items-center gap-2">
                            <div class="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                            </div>
                            <span class="text-sm text-white/80">All of WA</span>
                        </div>
                    </div>
                </div>

                <!-- Visual Element -->
                <div class="hidden lg:block animate-slide-in-right">
                    <div class="relative">
                        <!-- Decorative elements -->
                        <div class="absolute -top-6 -left-6 w-24 h-24 bg-secondary-500/30 rounded-2xl blur-xl"></div>
                        <div class="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-500/30 rounded-2xl blur-xl"></div>

                        <!-- Stats Cards floating -->
                        <div class="absolute -top-4 -left-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl animate-float z-10">
                            <div class="text-3xl font-bold text-secondary-400">500+</div>
                            <div class="text-sm text-white/80">Workers Deployed</div>
                        </div>

                        <div class="absolute -bottom-4 -right-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl animate-float z-10" style="animation-delay: 2s;">
                            <div class="text-3xl font-bold text-accent-400">15+</div>
                            <div class="text-sm text-white/80">Years Experience</div>
                        </div>

                        <!-- Main Card/Visual -->
                        <div class="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl border border-white/20 p-8 shadow-2xl">
                            <div class="grid grid-cols-2 gap-6">
                                <!-- Service Icons -->
                                <div class="bg-white/10 rounded-2xl p-6 text-center hover:bg-white/20 transition-colors cursor-pointer">
                                    <div class="w-14 h-14 bg-secondary-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <svg class="w-7 h-7 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                                        </svg>
                                    </div>
                                    <div class="text-sm font-medium text-white">Labour Hire</div>
                                </div>
                                <div class="bg-white/10 rounded-2xl p-6 text-center hover:bg-white/20 transition-colors cursor-pointer">
                                    <div class="w-14 h-14 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <svg class="w-7 h-7 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                                        </svg>
                                    </div>
                                    <div class="text-sm font-medium text-white">Supplies</div>
                                </div>
                                <div class="bg-white/10 rounded-2xl p-6 text-center hover:bg-white/20 transition-colors cursor-pointer">
                                    <div class="w-14 h-14 bg-accent-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <svg class="w-7 h-7 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                        </svg>
                                    </div>
                                    <div class="text-sm font-medium text-white">Safety PPE</div>
                                </div>
                                <div class="bg-white/10 rounded-2xl p-6 text-center hover:bg-white/20 transition-colors cursor-pointer">
                                    <div class="w-14 h-14 bg-secondary-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                                        <svg class="w-7 h-7 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                        </svg>
                                    </div>
                                    <div class="text-sm font-medium text-white">24/7 Support</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Wave Divider -->
        <div class="absolute bottom-0 left-0 right-0">
            <svg class="w-full h-20 md:h-32" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
                <path d="M0,60 C320,120 480,0 720,60 C960,120 1120,0 1440,60 L1440,120 L0,120 Z" fill="white"/>
            </svg>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="py-16 bg-white -mt-1 relative overflow-hidden">
        <!-- Subtle Background -->
        <div class="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent"></div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                <div class="group text-center p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-white border border-primary-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div class="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent">15+</div>
                    <div class="text-gray-600 font-medium mt-2">Years Experience</div>
                    <div class="w-12 h-1 bg-secondary-400 mx-auto mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div class="group text-center p-6 rounded-2xl bg-gradient-to-br from-secondary-50 to-white border border-secondary-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div class="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-secondary-600 to-secondary-500 bg-clip-text text-transparent">500+</div>
                    <div class="text-gray-600 font-medium mt-2">Workers Deployed</div>
                    <div class="w-12 h-1 bg-secondary-400 mx-auto mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div class="group text-center p-6 rounded-2xl bg-gradient-to-br from-accent-50 to-white border border-accent-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div class="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-accent-700 to-accent-600 bg-clip-text text-transparent">100+</div>
                    <div class="text-gray-600 font-medium mt-2">Business Clients</div>
                    <div class="w-12 h-1 bg-secondary-400 mx-auto mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div class="group text-center p-6 rounded-2xl bg-gradient-to-br from-primary-50 to-white border border-primary-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div class="text-4xl md:text-5xl font-heading font-bold bg-gradient-to-r from-primary-700 to-primary-900 bg-clip-text text-transparent">24/7</div>
                    <div class="text-gray-600 font-medium mt-2">Support Available</div>
                    <div class="w-12 h-1 bg-secondary-400 mx-auto mt-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section class="py-20 lg:py-28 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <!-- Background decoration -->
        <div class="absolute top-0 left-0 w-96 h-96 bg-primary-100/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-secondary-100/30 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <span class="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/></svg>
                    Our Services
                </span>
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-6">Complete Workforce & Supply Solutions</h2>
                <p class="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">From skilled labour to essential supplies, we provide everything your business needs to succeed across Western Australia.</p>
            </div>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <!-- Labour Hire -->
                <div class="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div class="h-48 bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center">
                        <svg class="w-20 h-20 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                        </svg>
                    </div>
                    <div class="p-8">
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Labour Hire</h3>
                        <p class="text-gray-600 mb-4">Reliable, skilled workers for construction, warehousing, manufacturing, and more. Flexible terms to match your project needs.</p>
                        <ul class="space-y-2 mb-6">
                            <li class="flex items-center text-sm text-gray-600">
                                <svg class="w-4 h-4 text-secondary-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                                General Labourers
                            </li>
                            <li class="flex items-center text-sm text-gray-600">
                                <svg class="w-4 h-4 text-secondary-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                                Warehouse Staff
                            </li>
                            <li class="flex items-center text-sm text-gray-600">
                                <svg class="w-4 h-4 text-secondary-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                                Machine Operators
                            </li>
                        </ul>
                        <a href="<?php echo esc_url(home_url('/services#labour-hire')); ?>" class="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 group-hover:translate-x-2 transition-transform">
                            Learn More
                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </div>
                </div>

                <!-- Industrial Supplies -->
                <div class="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div class="h-48 bg-gradient-to-br from-secondary-500 to-secondary-700 flex items-center justify-center">
                        <svg class="w-20 h-20 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                    </div>
                    <div class="p-8">
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Industrial Supplies</h3>
                        <p class="text-gray-600 mb-4">Quality products for construction, manufacturing, and industrial applications. Competitive prices with reliable delivery.</p>
                        <ul class="space-y-2 mb-6">
                            <li class="flex items-center text-sm text-gray-600">
                                <svg class="w-4 h-4 text-secondary-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                                Construction Materials
                            </li>
                            <li class="flex items-center text-sm text-gray-600">
                                <svg class="w-4 h-4 text-secondary-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                                Tools & Equipment
                            </li>
                            <li class="flex items-center text-sm text-gray-600">
                                <svg class="w-4 h-4 text-secondary-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                                Bulk Orders Available
                            </li>
                        </ul>
                        <a href="<?php echo esc_url(home_url('/services#industrial-supplies')); ?>" class="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 group-hover:translate-x-2 transition-transform">
                            Learn More
                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </div>
                </div>

                <!-- Safety Equipment -->
                <div class="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div class="h-48 bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                        <svg class="w-20 h-20 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                        </svg>
                    </div>
                    <div class="p-8">
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Safety Equipment</h3>
                        <p class="text-gray-600 mb-4">Australian certified PPE and safety gear. Protect your workers with high-quality, compliant safety equipment.</p>
                        <ul class="space-y-2 mb-6">
                            <li class="flex items-center text-sm text-gray-600">
                                <svg class="w-4 h-4 text-secondary-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                                Hard Hats & Helmets
                            </li>
                            <li class="flex items-center text-sm text-gray-600">
                                <svg class="w-4 h-4 text-secondary-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                                Hi-Vis Workwear
                            </li>
                            <li class="flex items-center text-sm text-gray-600">
                                <svg class="w-4 h-4 text-secondary-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
                                Safety Boots & Gloves
                            </li>
                        </ul>
                        <a href="<?php echo esc_url(home_url('/services#safety-equipment')); ?>" class="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 group-hover:translate-x-2 transition-transform">
                            Learn More
                            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Industries We Serve -->
    <section class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <span class="inline-block px-4 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4">Industries</span>
                <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Specialists Across Key Sectors</h2>
                <p class="text-xl text-gray-600 max-w-2xl mx-auto">From mining sites to manufacturing floors, we understand the unique requirements of each industry we serve.</p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                <div class="text-center p-6 bg-gray-50 rounded-xl hover:bg-primary-50 hover:shadow-lg transition-all">
                    <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/>
                        </svg>
                    </div>
                    <h3 class="font-semibold text-gray-900">Mining</h3>
                </div>

                <div class="text-center p-6 bg-gray-50 rounded-xl hover:bg-primary-50 hover:shadow-lg transition-all">
                    <div class="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                    </div>
                    <h3 class="font-semibold text-gray-900">Construction</h3>
                </div>

                <div class="text-center p-6 bg-gray-50 rounded-xl hover:bg-primary-50 hover:shadow-lg transition-all">
                    <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                    </div>
                    <h3 class="font-semibold text-gray-900">Manufacturing</h3>
                </div>

                <div class="text-center p-6 bg-gray-50 rounded-xl hover:bg-primary-50 hover:shadow-lg transition-all">
                    <div class="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                        </svg>
                    </div>
                    <h3 class="font-semibold text-gray-900">Transport</h3>
                </div>

                <div class="text-center p-6 bg-gray-50 rounded-xl hover:bg-primary-50 hover:shadow-lg transition-all">
                    <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <h3 class="font-semibold text-gray-900">Agriculture</h3>
                </div>

                <div class="text-center p-6 bg-gray-50 rounded-xl hover:bg-primary-50 hover:shadow-lg transition-all">
                    <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"/>
                        </svg>
                    </div>
                    <h3 class="font-semibold text-gray-900">Oil & Gas</h3>
                </div>
            </div>
        </div>
    </section>

    <!-- Why Choose Us -->
    <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <span class="inline-block px-4 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm font-semibold mb-4">Why Choose Us</span>
                    <h2 class="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Because People Matter</h2>
                    <p class="text-lg text-gray-600 mb-8">With specialists across mining, construction, manufacturing, and logistics, we build engaged workforces that respect your company culture. We're not just filling positions — we're delivering skilled professionals who contribute to your success from day one.</p>

                    <div class="space-y-6">
                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-1">Verified & Certified Workers</h3>
                                <p class="text-gray-600">All our workers are fully vetted, with verified qualifications and current certifications.</p>
                            </div>
                        </div>

                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
                                <svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-1">Fast Response Times</h3>
                                <p class="text-gray-600">Need workers urgently? We can deploy qualified staff within 24 hours.</p>
                            </div>
                        </div>

                        <div class="flex items-start gap-4">
                            <div class="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 mb-1">Safety First Approach</h3>
                                <p class="text-gray-600">All safety equipment is Australian certified and compliant with workplace standards.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="relative">
                    <div class="absolute -inset-4 bg-primary-100 rounded-2xl transform -rotate-3"></div>
                    <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/team.jpg'); ?>" alt="Our team" class="relative rounded-2xl shadow-xl w-full h-auto" onerror="this.parentElement.innerHTML='<div class=\'relative bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl h-96 flex items-center justify-center\'><span class=\'text-primary-400 text-lg\'>Team Image</span></div>'">
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-primary-800 to-primary-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p class="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">Contact us today for a free quote on labour hire, industrial supplies, or safety equipment.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="tel:+61893456789" class="inline-flex items-center justify-center px-8 py-4 bg-white text-primary-800 font-semibold rounded-lg hover:bg-primary-50 transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    (08) 9345 6789
                </a>
                <a href="<?php echo esc_url(home_url('/contact')); ?>" class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                    Request a Quote
                </a>
            </div>
        </div>
    </section>

</main>

<?php get_footer(); ?>
