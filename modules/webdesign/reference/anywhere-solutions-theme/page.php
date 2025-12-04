<?php
/**
 * The template for displaying all pages
 *
 * @package anywhere-solutions
 */

get_header();
?>

<main id="primary" class="site-main">

    <?php while (have_posts()) : the_post(); ?>

    <!-- Page Header -->
    <section class="bg-gradient-to-br from-primary-900 to-primary-800 text-white py-20">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl md:text-5xl font-bold mb-4"><?php the_title(); ?></h1>
                <?php if (has_excerpt()) : ?>
                    <p class="text-xl text-primary-100 max-w-2xl mx-auto"><?php echo get_the_excerpt(); ?></p>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <!-- Page Content -->
    <section class="py-16 bg-white">
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

            <?php
            // If comments are open or we have at least one comment, load up the comment template.
            if (comments_open() || get_comments_number()) :
                comments_template();
            endif;
            ?>
        </div>
    </section>

    <?php endwhile; ?>

</main>

<?php get_footer(); ?>
