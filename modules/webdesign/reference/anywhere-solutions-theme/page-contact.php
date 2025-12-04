<?php
/**
 * Template Name: Contact Page
 *
 * Contact page template for Anywhere Solutions
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
                <h1 class="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                <p class="text-xl text-primary-100 max-w-2xl mx-auto">Get in touch for a free quote on labour hire, industrial supplies, or safety equipment.</p>
            </div>
        </div>
    </section>

    <!-- Contact Content -->
    <section class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="grid lg:grid-cols-3 gap-12">

                <!-- Contact Information -->
                <div class="lg:col-span-1 space-y-8">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-900 mb-6">Get In Touch</h2>
                        <p class="text-gray-600 mb-8">We're here to help with all your workforce and supply needs. Contact us today for fast, friendly service.</p>
                    </div>

                    <!-- Contact Cards -->
                    <div class="space-y-4">
                        <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900 mb-1">Phone</h3>
                                    <a href="tel:+61299999999" class="text-primary-600 hover:text-primary-700 font-medium">+61 2 XXXX XXXX</a>
                                    <p class="text-sm text-gray-500 mt-1">Mon-Fri 7:00am - 5:00pm</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg class="w-6 h-6 text-secondary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900 mb-1">Email</h3>
                                    <a href="mailto:info@anywheresolutions.com.au" class="text-primary-600 hover:text-primary-700 font-medium break-all">info@anywheresolutions.com.au</a>
                                    <p class="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div class="flex items-start gap-4">
                                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                    </svg>
                                </div>
                                <div>
                                    <h3 class="font-semibold text-gray-900 mb-1">Location</h3>
                                    <p class="text-gray-600">Greater Sydney Area</p>
                                    <p class="text-gray-600">New South Wales, Australia</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Business Hours -->
                    <div class="bg-white rounded-xl p-6 shadow-sm">
                        <h3 class="font-semibold text-gray-900 mb-4">Business Hours</h3>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-gray-600">Monday - Friday</span>
                                <span class="text-gray-900 font-medium">7:00am - 5:00pm</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Saturday</span>
                                <span class="text-gray-900 font-medium">By Appointment</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-gray-600">Sunday</span>
                                <span class="text-gray-900 font-medium">Closed</span>
                            </div>
                        </div>
                        <div class="mt-4 pt-4 border-t border-gray-100">
                            <p class="text-sm text-gray-500">Emergency requests? Call us for urgent labour requirements.</p>
                        </div>
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="lg:col-span-2">
                    <div class="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                        <h2 class="text-2xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                        <p class="text-gray-600 mb-8">Fill out the form below and we'll get back to you as soon as possible.</p>

                        <?php
                        // Check if Contact Form 7 is active
                        if (function_exists('wpcf7_contact_form')) {
                            $contact_form = wpcf7_get_contact_form_by_title('Contact Form');
                            if ($contact_form) {
                                echo do_shortcode('[contact-form-7 id="' . $contact_form->id() . '" title="Contact Form"]');
                            } else {
                                // Fallback form
                                ?>
                                <form class="space-y-6" method="post" action="#">
                                    <div class="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                            <input type="text" id="name" name="name" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" placeholder="Your name">
                                        </div>
                                        <div>
                                            <label for="company" class="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                                            <input type="text" id="company" name="company" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" placeholder="Your company">
                                        </div>
                                    </div>

                                    <div class="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                                            <input type="email" id="email" name="email" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" placeholder="you@example.com">
                                        </div>
                                        <div>
                                            <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            <input type="tel" id="phone" name="phone" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" placeholder="+61 4XX XXX XXX">
                                        </div>
                                    </div>

                                    <div>
                                        <label for="service" class="block text-sm font-medium text-gray-700 mb-2">Service Required *</label>
                                        <select id="service" name="service" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors">
                                            <option value="">Select a service...</option>
                                            <option value="labour-hire">Labour Hire</option>
                                            <option value="industrial-supplies">Industrial Supplies</option>
                                            <option value="safety-equipment">Safety Equipment</option>
                                            <option value="multiple">Multiple Services</option>
                                            <option value="other">Other / General Enquiry</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Your Message *</label>
                                        <textarea id="message" name="message" rows="5" required class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none" placeholder="Tell us about your requirements..."></textarea>
                                    </div>

                                    <div class="flex items-start gap-3">
                                        <input type="checkbox" id="privacy" name="privacy" required class="mt-1 w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500">
                                        <label for="privacy" class="text-sm text-gray-600">
                                            I agree to the <a href="<?php echo esc_url(home_url('/privacy-policy')); ?>" class="text-primary-600 hover:text-primary-700 underline">Privacy Policy</a> and consent to being contacted regarding my enquiry.
                                        </label>
                                    </div>

                                    <button type="submit" class="w-full md:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center">
                                        Send Message
                                        <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                                        </svg>
                                    </button>
                                </form>
                                <?php
                            }
                        } else {
                            // Contact Form 7 not installed - show placeholder
                            ?>
                            <div class="bg-gray-50 rounded-xl p-8 text-center">
                                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                                <p class="text-gray-600 mb-4">Contact form will be available once Contact Form 7 is installed.</p>
                                <p class="text-sm text-gray-500">In the meantime, please email us directly at <a href="mailto:info@anywheresolutions.com.au" class="text-primary-600 hover:underline">info@anywheresolutions.com.au</a></p>
                            </div>
                            <?php
                        }
                        ?>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Map Section -->
    <section class="h-96 bg-gray-200 relative">
        <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
                <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
                <p class="text-gray-500">Map placeholder - Serving Greater Sydney Area</p>
                <p class="text-sm text-gray-400 mt-2">Embed Google Maps here</p>
            </div>
        </div>
    </section>

</main>

<?php get_footer(); ?>
