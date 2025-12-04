<?php
/**
 * The template for displaying search results pages
 *
 * @package anywhere-solutions
 */

get_header();
?>

<main id="primary" class="site-main">

    <!-- Search Header -->
    <section class="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-4">
                    <?php printf(esc_html__('Search Results for: %s', 'anywhere-solutions'), '<span class="text-secondary-400">' . get_search_query() . '</span>'); ?>
                </h1>
                <p class="text-xl text-primary-100">
                    <?php
                    global $wp_query;
                    printf(
                        esc_html(_n('%d result found', '%d results found', $wp_query->found_posts, 'anywhere-solutions')),
                        $wp_query->found_posts
                    );
                    ?>
                </p>
            </div>
        </div>
    </section>

    <!-- Search Results -->
    <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <!-- Search Form -->
            <div class="max-w-2xl mx-auto mb-12">
                <form role="search" method="get" action="<?php echo esc_url(home_url('/')); ?>" class="flex gap-4">
                    <div class="flex-1 relative">
                        <input type="search" name="s" value="<?php echo get_search_query(); ?>" placeholder="Search again..." class="w-full px-6 py-4 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-lg">
                        <svg class="w-6 h-6 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </div>
                    <button type="submit" class="px-6 py-4 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors">
                        Search
                    </button>
                </form>
            </div>

            <?php if (have_posts()) : ?>

            <div class="space-y-6">
                <?php while (have_posts()) : the_post(); ?>
                    <article id="post-<?php the_ID(); ?>" <?php post_class('bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden'); ?>>
                        <div class="flex flex-col md:flex-row">
                            <?php if (has_post_thumbnail()) : ?>
                                <a href="<?php the_permalink(); ?>" class="md:w-64 flex-shrink-0 block">
                                    <div class="aspect-video md:aspect-square overflow-hidden">
                                        <?php the_post_thumbnail('medium', ['class' => 'w-full h-full object-cover hover:scale-105 transition-transform duration-300']); ?>
                                    </div>
                                </a>
                            <?php endif; ?>

                            <div class="flex-1 p-6">
                                <div class="flex items-center gap-2 mb-2 text-sm">
                                    <span class="px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium">
                                        <?php echo get_post_type_object(get_post_type())->labels->singular_name; ?>
                                    </span>
                                    <span class="text-gray-400">&bull;</span>
                                    <span class="text-gray-500"><?php echo get_the_date(); ?></span>
                                </div>

                                <h2 class="text-xl font-bold text-gray-900 mb-3">
                                    <a href="<?php the_permalink(); ?>" class="hover:text-primary-600 transition-colors">
                                        <?php the_title(); ?>
                                    </a>
                                </h2>

                                <p class="text-gray-600 mb-4 line-clamp-2"><?php echo wp_trim_words(get_the_excerpt(), 30); ?></p>

                                <a href="<?php the_permalink(); ?>" class="text-primary-600 font-medium hover:text-primary-700 inline-flex items-center">
                                    Read More
                                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>

            <!-- Pagination -->
            <nav class="mt-12">
                <?php
                the_posts_pagination(array(
                    'mid_size'  => 2,
                    'prev_text' => '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>',
                    'next_text' => '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>',
                ));
                ?>
            </nav>

            <?php else : ?>

            <div class="text-center py-12 bg-white rounded-2xl">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
                <p class="text-gray-600 mb-6 max-w-md mx-auto">Sorry, we couldn't find anything matching your search. Try different keywords or browse our services.</p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <a href="<?php echo esc_url(home_url('/services')); ?>" class="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                        View Our Services
                    </a>
                    <a href="<?php echo esc_url(home_url('/contact')); ?>" class="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:border-gray-400 transition-colors">
                        Contact Us
                    </a>
                </div>
            </div>

            <?php endif; ?>

        </div>
    </section>

</main>

<?php get_footer(); ?>
