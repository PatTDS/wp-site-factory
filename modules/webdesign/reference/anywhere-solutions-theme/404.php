<?php
/**
 * The template for displaying 404 pages (not found)
 *
 * @package anywhere-solutions
 */

get_header();
?>

<main id="primary" class="site-main">

    <section class="min-h-[60vh] flex items-center justify-center bg-gray-50 py-20">
        <div class="max-w-xl mx-auto px-4 text-center">
            <div class="mb-8">
                <span class="text-9xl font-bold text-primary-200">404</span>
            </div>
            <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
            <p class="text-xl text-gray-600 mb-8">Sorry, the page you're looking for doesn't exist or has been moved.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    Back to Home
                </a>
                <a href="<?php echo esc_url(home_url('/contact')); ?>" class="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 hover:bg-gray-100 transition-colors">
                    Contact Us
                </a>
            </div>
        </div>
    </section>

</main>

<?php get_footer(); ?>
