<?php
/**
 * The template for displaying archive pages
 *
 * @package anywhere-solutions
 */

get_header();
?>

<main id="primary" class="site-main">

    <!-- Archive Header -->
    <section class="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <?php
                the_archive_title('<h1 class="text-4xl md:text-5xl font-bold mb-4">', '</h1>');
                the_archive_description('<p class="text-xl text-primary-100 max-w-2xl mx-auto">', '</p>');
                ?>
            </div>
        </div>
    </section>

    <!-- Archive Content -->
    <section class="py-16 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <?php if (have_posts()) : ?>

            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <?php while (have_posts()) : the_post(); ?>
                    <article id="post-<?php the_ID(); ?>" <?php post_class('bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden'); ?>>
                        <?php if (has_post_thumbnail()) : ?>
                            <a href="<?php the_permalink(); ?>" class="block aspect-video overflow-hidden">
                                <?php the_post_thumbnail('medium_large', ['class' => 'w-full h-full object-cover hover:scale-105 transition-transform duration-300']); ?>
                            </a>
                        <?php else : ?>
                            <div class="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                                <svg class="w-12 h-12 text-primary-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                                </svg>
                            </div>
                        <?php endif; ?>

                        <div class="p-6">
                            <?php
                            $categories = get_the_category();
                            if (!empty($categories)) : ?>
                                <span class="inline-block px-2 py-1 bg-primary-100 text-primary-700 rounded text-xs font-medium mb-3">
                                    <?php echo esc_html($categories[0]->name); ?>
                                </span>
                            <?php endif; ?>

                            <h2 class="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                <a href="<?php the_permalink(); ?>" class="hover:text-primary-600 transition-colors">
                                    <?php the_title(); ?>
                                </a>
                            </h2>

                            <p class="text-gray-600 mb-4 line-clamp-3"><?php echo wp_trim_words(get_the_excerpt(), 20); ?></p>

                            <div class="flex items-center justify-between text-sm">
                                <span class="text-gray-500"><?php echo get_the_date(); ?></span>
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
                    'class'     => 'flex items-center justify-center gap-2',
                ));
                ?>
            </nav>

            <?php else : ?>

            <div class="text-center py-12">
                <svg class="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"/>
                </svg>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">No Posts Found</h2>
                <p class="text-gray-600 mb-6">There are no posts to display in this archive.</p>
                <a href="<?php echo esc_url(home_url('/')); ?>" class="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
                    Back to Home
                </a>
            </div>

            <?php endif; ?>

        </div>
    </section>

</main>

<?php get_footer(); ?>
