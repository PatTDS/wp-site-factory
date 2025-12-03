import type { ProjectConfig } from "../types/project.js";
import { INDUSTRY_PRESETS } from "../types/project.js";

export const generateFrontPagePhp = (config: ProjectConfig): string => {
  const preset = INDUSTRY_PRESETS[config.industry] || INDUSTRY_PRESETS.other;

  return `<?php
/**
 * Template Name: Front Page
 *
 * @package ${config.slug}_theme
 */

get_header();
?>

<!-- Hero Section -->
<section class="relative bg-gradient-to-br from-gray-900 to-gray-800 text-white py-24 lg:py-32">
    <div class="container mx-auto px-4">
        <div class="max-w-3xl">
            <h1 class="text-4xl lg:text-6xl font-bold mb-6">
                <?php echo get_the_title(); ?>
            </h1>
            <p class="text-xl text-gray-300 mb-8">
                <?php echo get_the_excerpt(); ?>
            </p>
            <div class="flex flex-wrap gap-4">
                <a href="<?php echo esc_url(home_url('/contact')); ?>"
                   class="inline-flex items-center px-6 py-3 rounded-md text-white font-medium text-lg transition-colors"
                   style="background-color: ${config.primaryColor}">
                    <?php _e('Get Started', '${config.slug}-theme'); ?>
                </a>
                <a href="<?php echo esc_url(home_url('/about')); ?>"
                   class="inline-flex items-center px-6 py-3 rounded-md border-2 border-white text-white font-medium text-lg hover:bg-white hover:text-gray-900 transition-colors">
                    <?php _e('Learn More', '${config.slug}-theme'); ?>
                </a>
            </div>
        </div>
    </div>
</section>

<!-- Services/Features Section -->
<section class="py-20 bg-gray-50">
    <div class="container mx-auto px-4">
        <div class="text-center mb-12">
            <h2 class="text-3xl lg:text-4xl font-bold mb-4">
                <?php _e('What We Offer', '${config.slug}-theme'); ?>
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                <?php _e('Discover our comprehensive range of services designed to meet your needs.', '${config.slug}-theme'); ?>
            </p>
        </div>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <?php
            // Get services/features from custom field or default
            $services = array(
                array(
                    'icon' => '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>',
                    'title' => __('Fast & Reliable', '${config.slug}-theme'),
                    'description' => __('Quick turnaround times without compromising on quality.', '${config.slug}-theme'),
                ),
                array(
                    'icon' => '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>',
                    'title' => __('Trusted & Secure', '${config.slug}-theme'),
                    'description' => __('Your satisfaction and security are our top priorities.', '${config.slug}-theme'),
                ),
                array(
                    'icon' => '<svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>',
                    'title' => __('Expert Team', '${config.slug}-theme'),
                    'description' => __('Professionals dedicated to delivering excellence.', '${config.slug}-theme'),
                ),
            );

            foreach ($services as $service) :
            ?>
            <div class="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div class="w-14 h-14 rounded-lg flex items-center justify-center mb-6" style="background-color: ${config.primaryColor}20; color: ${config.primaryColor}">
                    <?php echo $service['icon']; ?>
                </div>
                <h3 class="text-xl font-semibold mb-3"><?php echo $service['title']; ?></h3>
                <p class="text-gray-600"><?php echo $service['description']; ?></p>
            </div>
            <?php endforeach; ?>
        </div>
    </div>
</section>

<!-- About/Why Us Section -->
<section class="py-20">
    <div class="container mx-auto px-4">
        <div class="grid gap-12 lg:grid-cols-2 items-center">
            <div>
                <h2 class="text-3xl lg:text-4xl font-bold mb-6">
                    <?php _e('Why Choose Us', '${config.slug}-theme'); ?>
                </h2>
                <p class="text-lg text-gray-600 mb-6">
                    <?php _e('We are committed to providing exceptional service and value to our clients. With years of experience and a dedicated team, we deliver results that exceed expectations.', '${config.slug}-theme'); ?>
                </p>
                <ul class="space-y-4">
                    <?php
                    $benefits = array(
                        __('Professional and experienced team', '${config.slug}-theme'),
                        __('Customized solutions for your needs', '${config.slug}-theme'),
                        __('Competitive and transparent pricing', '${config.slug}-theme'),
                        __('Excellent customer support', '${config.slug}-theme'),
                    );
                    foreach ($benefits as $benefit) :
                    ?>
                    <li class="flex items-center gap-3">
                        <svg class="w-6 h-6 flex-shrink-0" style="color: ${config.primaryColor}" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                        </svg>
                        <span><?php echo $benefit; ?></span>
                    </li>
                    <?php endforeach; ?>
                </ul>
                <a href="<?php echo esc_url(home_url('/about')); ?>"
                   class="inline-flex items-center mt-8 font-medium"
                   style="color: ${config.primaryColor}">
                    <?php _e('Learn more about us', '${config.slug}-theme'); ?> &rarr;
                </a>
            </div>
            <div class="relative">
                <div class="aspect-video bg-gray-200 rounded-xl overflow-hidden">
                    <?php if (has_post_thumbnail()) : ?>
                        <?php the_post_thumbnail('large', array('class' => 'w-full h-full object-cover')); ?>
                    <?php else : ?>
                        <div class="w-full h-full flex items-center justify-center text-gray-400">
                            <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section class="py-20" style="background-color: ${config.primaryColor}">
    <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl lg:text-4xl font-bold text-white mb-6">
            <?php _e('Ready to Get Started?', '${config.slug}-theme'); ?>
        </h2>
        <p class="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            <?php _e('Contact us today to discuss how we can help you achieve your goals.', '${config.slug}-theme'); ?>
        </p>
        <a href="<?php echo esc_url(home_url('/contact')); ?>"
           class="inline-flex items-center px-8 py-4 rounded-md bg-white font-medium text-lg transition-colors"
           style="color: ${config.primaryColor}">
            <?php _e('Contact Us Today', '${config.slug}-theme'); ?>
        </a>
    </div>
</section>

<?php
get_footer();
`;
};

export const generatePagePhp = (config: ProjectConfig): string => `<?php
/**
 * Default Page Template
 *
 * @package ${config.slug}_theme
 */

get_header();
?>

<main id="main" class="site-main">
    <?php while (have_posts()) : the_post(); ?>
        <!-- Page Header -->
        <section class="bg-gray-100 py-16">
            <div class="container mx-auto px-4">
                <h1 class="text-4xl lg:text-5xl font-bold"><?php the_title(); ?></h1>
            </div>
        </section>

        <!-- Page Content -->
        <section class="py-12">
            <div class="container mx-auto px-4">
                <div class="prose prose-lg max-w-none">
                    <?php the_content(); ?>
                </div>
            </div>
        </section>
    <?php endwhile; ?>
</main>

<?php
get_footer();
`;

export const generateContactPagePhp = (config: ProjectConfig): string => `<?php
/**
 * Template Name: Contact Page
 *
 * @package ${config.slug}_theme
 */

get_header();
?>

<main id="main" class="site-main">
    <!-- Page Header -->
    <section class="bg-gray-100 py-16">
        <div class="container mx-auto px-4">
            <h1 class="text-4xl lg:text-5xl font-bold"><?php the_title(); ?></h1>
            <p class="text-xl text-gray-600 mt-4">
                <?php _e('We\\'d love to hear from you. Get in touch with us today.', '${config.slug}-theme'); ?>
            </p>
        </div>
    </section>

    <!-- Contact Section -->
    <section class="py-16">
        <div class="container mx-auto px-4">
            <div class="grid gap-12 lg:grid-cols-2">
                <!-- Contact Info -->
                <div>
                    <h2 class="text-2xl font-bold mb-6"><?php _e('Contact Information', '${config.slug}-theme'); ?></h2>

                    <div class="space-y-6">
                        <?php if (!empty('${config.address}')) : ?>
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 rounded-lg flex items-center justify-center" style="background-color: ${config.primaryColor}20; color: ${config.primaryColor}">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold"><?php _e('Address', '${config.slug}-theme'); ?></h3>
                                <p class="text-gray-600">
                                    ${config.address || ""}<br>
                                    ${config.city || ""}, ${config.state || ""}
                                </p>
                            </div>
                        </div>
                        <?php endif; ?>

                        <?php if (!empty('${config.phone}')) : ?>
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 rounded-lg flex items-center justify-center" style="background-color: ${config.primaryColor}20; color: ${config.primaryColor}">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold"><?php _e('Phone', '${config.slug}-theme'); ?></h3>
                                <a href="tel:${config.phone || ""}" class="text-gray-600 hover:text-primary">
                                    ${config.phone || ""}
                                </a>
                            </div>
                        </div>
                        <?php endif; ?>

                        <?php if (!empty('${config.email}')) : ?>
                        <div class="flex items-start gap-4">
                            <div class="w-12 h-12 rounded-lg flex items-center justify-center" style="background-color: ${config.primaryColor}20; color: ${config.primaryColor}">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold"><?php _e('Email', '${config.slug}-theme'); ?></h3>
                                <a href="mailto:${config.email || ""}" class="text-gray-600 hover:text-primary">
                                    ${config.email || ""}
                                </a>
                            </div>
                        </div>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="bg-gray-50 rounded-xl p-8">
                    <h2 class="text-2xl font-bold mb-6"><?php _e('Send us a Message', '${config.slug}-theme'); ?></h2>
                    <?php
                    // Display Contact Form 7 if available
                    if (shortcode_exists('contact-form-7')) {
                        echo do_shortcode('[contact-form-7 title="Contact Form"]');
                    } else {
                        the_content();
                    }
                    ?>
                </div>
            </div>
        </div>
    </section>
</main>

<?php
get_footer();
`;

export const generateAboutPagePhp = (config: ProjectConfig): string => `<?php
/**
 * Template Name: About Page
 *
 * @package ${config.slug}_theme
 */

get_header();
?>

<main id="main" class="site-main">
    <!-- Page Header -->
    <section class="bg-gray-100 py-16">
        <div class="container mx-auto px-4">
            <h1 class="text-4xl lg:text-5xl font-bold"><?php the_title(); ?></h1>
        </div>
    </section>

    <!-- About Content -->
    <section class="py-16">
        <div class="container mx-auto px-4">
            <div class="grid gap-12 lg:grid-cols-2 items-center">
                <div class="prose prose-lg max-w-none">
                    <?php the_content(); ?>
                </div>
                <div class="relative">
                    <?php if (has_post_thumbnail()) : ?>
                        <?php the_post_thumbnail('large', array('class' => 'w-full rounded-xl shadow-lg')); ?>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </section>

    <!-- Values Section -->
    <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
            <h2 class="text-3xl font-bold text-center mb-12"><?php _e('Our Values', '${config.slug}-theme'); ?></h2>
            <div class="grid gap-8 md:grid-cols-3">
                <?php
                $values = array(
                    array(
                        'title' => __('Excellence', '${config.slug}-theme'),
                        'description' => __('We strive for excellence in everything we do, ensuring the highest quality in our work.', '${config.slug}-theme'),
                    ),
                    array(
                        'title' => __('Integrity', '${config.slug}-theme'),
                        'description' => __('We operate with honesty and transparency, building trust with our clients and partners.', '${config.slug}-theme'),
                    ),
                    array(
                        'title' => __('Innovation', '${config.slug}-theme'),
                        'description' => __('We embrace new ideas and technologies to deliver cutting-edge solutions.', '${config.slug}-theme'),
                    ),
                );

                foreach ($values as $value) :
                ?>
                <div class="bg-white rounded-xl p-8 shadow-sm text-center">
                    <h3 class="text-xl font-semibold mb-4" style="color: ${config.primaryColor}"><?php echo $value['title']; ?></h3>
                    <p class="text-gray-600"><?php echo $value['description']; ?></p>
                </div>
                <?php endforeach; ?>
            </div>
        </div>
    </section>
</main>

<?php
get_footer();
`;
