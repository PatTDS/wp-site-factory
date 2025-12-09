<?php
/**
 * CTA Split Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'with-form';
$form_fields = $config['form_fields'] ?? ['name', 'email', 'phone'];
$image_position = $config['image_position'] ?? 'right';
$background = $config['background_color'] ?? 'gray';

$section_bg = match($background) {
    'white' => 'bg-white',
    'primary-light' => 'bg-primary-50',
    default => 'bg-gray-50',
};

$grid_order = ($variant === 'with-image' && $image_position === 'left') ? 'lg:flex-row-reverse' : '';
?>

<!-- wp:group {"className":"cta-split","layout":{"type":"constrained"}} -->
<section class="py-20 lg:py-28 <?php echo esc_attr($section_bg); ?>">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center <?php echo esc_attr($grid_order); ?>">
            <!-- Content Column -->
            <div class="lg:pr-8">
                <h2 class="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-6">
                    <?php echo esc_html($content['headline']); ?>
                </h2>

                <?php if (!empty($content['subtext'])): ?>
                <p class="text-lg text-gray-600 mb-8">
                    <?php echo esc_html($content['subtext']); ?>
                </p>
                <?php endif; ?>

                <?php if (!empty($content['features'])): ?>
                <ul class="space-y-4 mb-8">
                    <?php foreach ($content['features'] as $feature): ?>
                    <li class="flex items-start gap-3">
                        <svg class="h-6 w-6 text-primary-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span class="text-gray-700"><?php echo esc_html($feature); ?></span>
                    </li>
                    <?php endforeach; ?>
                </ul>
                <?php endif; ?>
            </div>

            <!-- Form/Image Column -->
            <div>
                <?php if ($variant === 'with-form'): ?>
                <!-- Contact Form -->
                <div class="bg-white rounded-2xl shadow-xl p-8 lg:p-10">
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">
                        <?php echo esc_html($content['form_title'] ?? 'Get Started Today'); ?>
                    </h3>

                    <form class="space-y-5">
                        <?php if (in_array('name', $form_fields)): ?>
                        <div>
                            <label for="cta-name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input type="text"
                                   id="cta-name"
                                   name="name"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                   required />
                        </div>
                        <?php endif; ?>

                        <?php if (in_array('email', $form_fields)): ?>
                        <div>
                            <label for="cta-email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input type="email"
                                   id="cta-email"
                                   name="email"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                   required />
                        </div>
                        <?php endif; ?>

                        <?php if (in_array('phone', $form_fields)): ?>
                        <div>
                            <label for="cta-phone" class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                            <input type="tel"
                                   id="cta-phone"
                                   name="phone"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
                        </div>
                        <?php endif; ?>

                        <?php if (in_array('message', $form_fields)): ?>
                        <div>
                            <label for="cta-message" class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea id="cta-message"
                                      name="message"
                                      rows="4"
                                      class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"></textarea>
                        </div>
                        <?php endif; ?>

                        <button type="submit"
                                class="w-full px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary-600/25">
                            <?php echo esc_html($content['submit_text'] ?? 'Send Message'); ?>
                        </button>
                    </form>
                </div>
                <?php else: ?>
                <!-- Image -->
                <?php if (!empty($content['image'])): ?>
                <div class="rounded-2xl overflow-hidden shadow-2xl">
                    <img src="<?php echo esc_url($content['image']); ?>"
                         alt="CTA"
                         class="w-full h-full object-cover"
                         loading="lazy" />
                </div>
                <?php endif; ?>
                <?php endif; ?>
            </div>
        </div>
    </div>
</section>
<!-- /wp:group -->
