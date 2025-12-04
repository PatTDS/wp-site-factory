<?php
/**
 * Main template file
 *
 * @package anywhere_solutions-theme
 */

get_header();
?>

<main id="main" class="min-h-screen">
    <?php if (have_posts()) : ?>
        <div class="container mx-auto px-4 py-8">
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <?php while (have_posts()) : the_post(); ?>
                    <article <?php post_class('bg-white rounded-lg shadow-md overflow-hidden'); ?>>
                        <?php if (has_post_thumbnail()) : ?>
                            <a href="<?php the_permalink(); ?>" class="block">
                                <?php the_post_thumbnail('card', ['class' => 'w-full h-48 object-cover']); ?>
                            </a>
                        <?php endif; ?>

                        <div class="p-6">
                            <h2 class="text-xl font-semibold mb-2">
                                <a href="<?php the_permalink(); ?>" class="hover:text-primary transition-colors">
                                    <?php the_title(); ?>
                                </a>
                            </h2>

                            <div class="text-gray-600 text-sm mb-4">
                                <?php the_excerpt(); ?>
                            </div>

                            <a href="<?php the_permalink(); ?>" class="text-primary font-medium hover:underline">
                                <?php _e('Read More', 'anywhere_solutions-theme'); ?> →
                            </a>
                        </div>
                    </article>
                <?php endwhile; ?>
            </div>

            <?php the_posts_pagination([
                'class' => 'mt-8 flex justify-center',
                'prev_text' => '← ' . __('Previous', 'anywhere_solutions-theme'),
                'next_text' => __('Next', 'anywhere_solutions-theme') . ' →',
            ]); ?>
        </div>
    <?php else : ?>
        <div class="container mx-auto px-4 py-16 text-center">
            <h2 class="text-2xl font-semibold mb-4"><?php _e('No content found', 'anywhere_solutions-theme'); ?></h2>
            <p class="text-gray-600"><?php _e('Please check back later.', 'anywhere_solutions-theme'); ?></p>
        </div>
    <?php endif; ?>
</main>

<?php
get_footer();
