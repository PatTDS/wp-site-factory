<?php
/**
 * The template for displaying all single posts
 *
 * @package anywhere-solutions
 */

get_header();
?>

<main id="primary" class="site-main">

    <?php while (have_posts()) : the_post(); ?>

    <!-- Post Header -->
    <section class="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-16">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <?php
                $categories = get_the_category();
                if (!empty($categories)) : ?>
                    <span class="inline-block px-3 py-1 bg-primary-700 text-primary-100 rounded-full text-sm font-medium mb-4">
                        <?php echo esc_html($categories[0]->name); ?>
                    </span>
                <?php endif; ?>
                <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"><?php the_title(); ?></h1>
                <div class="flex items-center justify-center gap-4 text-primary-200 text-sm">
                    <span><?php echo get_the_date(); ?></span>
                    <span class="w-1 h-1 rounded-full bg-primary-400"></span>
                    <span><?php echo esc_html(get_the_author()); ?></span>
                    <span class="w-1 h-1 rounded-full bg-primary-400"></span>
                    <span><?php echo reading_time(); ?> min read</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Image -->
    <?php if (has_post_thumbnail()) : ?>
    <section class="bg-white py-8">
        <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <figure class="aspect-video rounded-2xl overflow-hidden shadow-lg">
                <?php the_post_thumbnail('large', ['class' => 'w-full h-full object-cover']); ?>
            </figure>
        </div>
    </section>
    <?php endif; ?>

    <!-- Post Content -->
    <section class="py-12 bg-white">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <article id="post-<?php the_ID(); ?>" <?php post_class('prose prose-lg max-w-none'); ?>>
                <?php
                the_content();

                wp_link_pages(array(
                    'before' => '<div class="page-links">' . esc_html__('Pages:', 'anywhere-solutions'),
                    'after'  => '</div>',
                ));
                ?>
            </article>

            <!-- Tags -->
            <?php
            $tags = get_the_tags();
            if ($tags) : ?>
            <div class="mt-12 pt-8 border-t border-gray-200">
                <div class="flex flex-wrap items-center gap-2">
                    <span class="text-gray-500 text-sm">Tags:</span>
                    <?php foreach ($tags as $tag) : ?>
                        <a href="<?php echo esc_url(get_tag_link($tag->term_id)); ?>" class="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors">
                            <?php echo esc_html($tag->name); ?>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php endif; ?>

            <!-- Author Box -->
            <div class="mt-12 p-8 bg-gray-50 rounded-2xl">
                <div class="flex items-start gap-6">
                    <div class="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                        <?php echo get_avatar(get_the_author_meta('ID'), 64, '', '', ['class' => 'rounded-full']); ?>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900 mb-1">Written by <?php the_author(); ?></h3>
                        <p class="text-gray-600 text-sm"><?php echo get_the_author_meta('description') ?: 'A member of the Anywhere Solutions team.'; ?></p>
                    </div>
                </div>
            </div>

            <!-- Post Navigation -->
            <nav class="mt-12 pt-8 border-t border-gray-200">
                <div class="flex flex-col sm:flex-row justify-between gap-4">
                    <?php
                    $prev_post = get_previous_post();
                    $next_post = get_next_post();
                    ?>
                    <?php if ($prev_post) : ?>
                        <a href="<?php echo esc_url(get_permalink($prev_post)); ?>" class="group flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors">
                            <svg class="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                            </svg>
                            <div>
                                <span class="text-xs text-gray-500 uppercase tracking-wider">Previous</span>
                                <p class="text-gray-900 font-medium line-clamp-1"><?php echo esc_html($prev_post->post_title); ?></p>
                            </div>
                        </a>
                    <?php else : ?>
                        <div></div>
                    <?php endif; ?>

                    <?php if ($next_post) : ?>
                        <a href="<?php echo esc_url(get_permalink($next_post)); ?>" class="group flex items-center justify-end gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-right">
                            <div>
                                <span class="text-xs text-gray-500 uppercase tracking-wider">Next</span>
                                <p class="text-gray-900 font-medium line-clamp-1"><?php echo esc_html($next_post->post_title); ?></p>
                            </div>
                            <svg class="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                            </svg>
                        </a>
                    <?php endif; ?>
                </div>
            </nav>
        </div>
    </section>

    <?php
    // If comments are open or we have at least one comment, load up the comment template.
    if (comments_open() || get_comments_number()) :
    ?>
    <section class="py-12 bg-gray-50">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <?php comments_template(); ?>
        </div>
    </section>
    <?php endif; ?>

    <?php endwhile; ?>

    <!-- Related Posts CTA -->
    <section class="py-16 bg-gradient-to-r from-primary-800 to-primary-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 class="text-2xl md:text-3xl font-bold mb-4">Need Labour, Supplies, or Safety Equipment?</h2>
            <p class="text-primary-100 mb-6">Contact Anywhere Solutions for a free quote today.</p>
            <a href="<?php echo esc_url(home_url('/contact')); ?>" class="inline-flex items-center justify-center px-6 py-3 bg-secondary-500 hover:bg-secondary-600 text-white font-semibold rounded-lg transition-colors">
                Get in Touch
                <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
            </a>
        </div>
    </section>

</main>

<?php get_footer(); ?>
