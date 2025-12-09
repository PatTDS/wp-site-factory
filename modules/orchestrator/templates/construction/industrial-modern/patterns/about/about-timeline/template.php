<?php
/**
 * About Timeline Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'vertical';
$show_images = $config['show_images'] ?? true;
$show_stats = $config['show_stats'] ?? true;
$max_milestones = $config['max_milestones'] ?? 5;

$milestones = array_slice($content['milestones'] ?? [], 0, $max_milestones);
$stats = $content['stats'] ?? [];
?>

<!-- wp:group {"className":"about-timeline py-16 lg:py-24 bg-gray-50","layout":{"type":"constrained"}} -->
<div class="wp-block-group about-timeline py-16 lg:py-24 bg-gray-50">
    <div class="container mx-auto px-4">

        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-16">
            <?php if (!empty($content['section_tagline'])): ?>
                <p class="text-sm font-semibold uppercase tracking-wider text-secondary mb-4">
                    <?php echo esc_html($content['section_tagline']); ?>
                </p>
            <?php endif; ?>

            <h2 class="text-3xl lg:text-4xl xl:text-5xl font-bold text-primary mb-6">
                <?php echo esc_html($content['section_title']); ?>
            </h2>

            <?php if (!empty($content['section_description'])): ?>
                <p class="text-lg lg:text-xl text-gray-600">
                    <?php echo esc_html($content['section_description']); ?>
                </p>
            <?php endif; ?>
        </div>

        <!-- Timeline -->
        <?php if ($variant === 'vertical'): ?>
            <div class="relative max-w-4xl mx-auto">
                <!-- Timeline Line -->
                <div class="absolute left-1/2 transform -translate-x-1/2 w-1 bg-secondary/30 h-full hidden lg:block"></div>

                <?php foreach ($milestones as $index => $milestone):
                    $is_left = $index % 2 === 0;
                ?>
                    <div class="relative flex flex-col lg:flex-row items-center lg:justify-between mb-12 last:mb-0">
                        <!-- Content -->
                        <div class="w-full lg:w-5/12 <?php echo $is_left ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12 lg:order-last'; ?>">
                            <div class="p-6 bg-white rounded-xl shadow-lg">
                                <span class="text-3xl font-bold text-secondary">
                                    <?php echo esc_html($milestone['year'] ?? ''); ?>
                                </span>
                                <h3 class="text-xl font-bold text-primary mt-2 mb-2">
                                    <?php echo esc_html($milestone['title'] ?? ''); ?>
                                </h3>
                                <p class="text-gray-600">
                                    <?php echo esc_html($milestone['description'] ?? ''); ?>
                                </p>
                            </div>
                        </div>

                        <!-- Dot -->
                        <div class="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-secondary rounded-full border-4 border-white shadow hidden lg:block"></div>

                        <!-- Spacer for alternating layout -->
                        <div class="hidden lg:block w-5/12"></div>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php else: ?>
            <!-- Horizontal Timeline -->
            <div class="relative overflow-x-auto pb-8">
                <div class="flex space-x-8 min-w-max px-4">
                    <?php foreach ($milestones as $milestone): ?>
                        <div class="relative flex flex-col items-center w-64">
                            <!-- Year -->
                            <span class="text-3xl font-bold text-secondary mb-4">
                                <?php echo esc_html($milestone['year'] ?? ''); ?>
                            </span>

                            <!-- Dot and Line -->
                            <div class="relative">
                                <div class="w-4 h-4 bg-secondary rounded-full"></div>
                                <div class="absolute top-1/2 left-full w-8 h-0.5 bg-secondary/30"></div>
                            </div>

                            <!-- Content -->
                            <div class="mt-4 p-4 bg-white rounded-xl shadow-lg text-center">
                                <h3 class="text-lg font-bold text-primary mb-2">
                                    <?php echo esc_html($milestone['title'] ?? ''); ?>
                                </h3>
                                <p class="text-sm text-gray-600">
                                    <?php echo esc_html($milestone['description'] ?? ''); ?>
                                </p>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

        <!-- Stats Section -->
        <?php if ($show_stats && !empty($stats)): ?>
            <div class="mt-16 lg:mt-24 pt-16 border-t border-gray-200">
                <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    <?php foreach ($stats as $stat): ?>
                        <div class="text-center">
                            <div class="text-4xl lg:text-5xl font-bold text-primary mb-2">
                                <?php echo esc_html($stat['value'] ?? ''); ?>
                            </div>
                            <div class="text-gray-600">
                                <?php echo esc_html($stat['label'] ?? ''); ?>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        <?php endif; ?>

    </div>
</div>
<!-- /wp:group -->
