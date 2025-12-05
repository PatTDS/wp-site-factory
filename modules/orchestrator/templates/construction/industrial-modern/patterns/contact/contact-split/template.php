<?php
/**
 * Contact Split Pattern
 *
 * @package Theme
 * @var array $content Content slots from blueprint
 * @var array $config Configuration options
 * @var array $classes Tailwind classes
 */

$variant = $config['variant'] ?? 'form-right';
$show_map = $config['show_map'] ?? false;
$show_hours = $config['show_hours'] ?? true;
$show_social = $config['show_social'] ?? true;
$background = $config['background'] ?? 'dark';
$form_style = $config['form_style'] ?? 'filled';

$form_order = $variant === 'form-left' ? 'lg:order-first' : 'lg:order-last';

$bg_class = match($background) {
    'white' => 'bg-white',
    'gray' => 'bg-gray-50',
    default => 'bg-primary',
};

$text_class = $background === 'dark' ? 'text-white' : 'text-gray-900';
$text_muted = $background === 'dark' ? 'text-white/80' : 'text-gray-600';

$social_links = $content['social_links'] ?? [];
?>

<!-- wp:group {"className":"contact-split","layout":{"type":"constrained"}} -->
<div class="wp-block-group contact-split py-16 lg:py-24 <?php echo esc_attr($bg_class); ?>">
    <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">

            <!-- Info Side -->
            <div class="space-y-8">
                <?php if (!empty($content['tagline'])): ?>
                    <p class="text-sm font-semibold uppercase tracking-wider <?php echo $background === 'dark' ? 'text-secondary' : 'text-secondary'; ?>">
                        <?php echo esc_html($content['tagline']); ?>
                    </p>
                <?php endif; ?>

                <h2 class="text-3xl lg:text-4xl font-bold <?php echo esc_attr($text_class); ?>">
                    <?php echo esc_html($content['title']); ?>
                </h2>

                <?php if (!empty($content['description'])): ?>
                    <p class="text-lg <?php echo esc_attr($text_muted); ?>">
                        <?php echo esc_html($content['description']); ?>
                    </p>
                <?php endif; ?>

                <!-- Contact Info -->
                <div class="space-y-4">
                    <?php if (!empty($content['phone'])): ?>
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 rounded-full <?php echo $background === 'dark' ? 'bg-white/10' : 'bg-primary/10'; ?> flex items-center justify-center flex-shrink-0">
                                <svg class="w-5 h-5 <?php echo $background === 'dark' ? 'text-secondary' : 'text-primary'; ?>" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <div>
                                <p class="font-semibold <?php echo esc_attr($text_class); ?>">Phone</p>
                                <a href="tel:<?php echo esc_attr(preg_replace('/[^0-9+]/', '', $content['phone'])); ?>"
                                   class="<?php echo esc_attr($text_muted); ?> hover:<?php echo $background === 'dark' ? 'text-white' : 'text-primary'; ?>">
                                    <?php echo esc_html($content['phone']); ?>
                                </a>
                            </div>
                        </div>
                    <?php endif; ?>

                    <?php if (!empty($content['email'])): ?>
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 rounded-full <?php echo $background === 'dark' ? 'bg-white/10' : 'bg-primary/10'; ?> flex items-center justify-center flex-shrink-0">
                                <svg class="w-5 h-5 <?php echo $background === 'dark' ? 'text-secondary' : 'text-primary'; ?>" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p class="font-semibold <?php echo esc_attr($text_class); ?>">Email</p>
                                <a href="mailto:<?php echo esc_attr($content['email']); ?>"
                                   class="<?php echo esc_attr($text_muted); ?> hover:<?php echo $background === 'dark' ? 'text-white' : 'text-primary'; ?>">
                                    <?php echo esc_html($content['email']); ?>
                                </a>
                            </div>
                        </div>
                    <?php endif; ?>

                    <?php if (!empty($content['address'])): ?>
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 rounded-full <?php echo $background === 'dark' ? 'bg-white/10' : 'bg-primary/10'; ?> flex items-center justify-center flex-shrink-0">
                                <svg class="w-5 h-5 <?php echo $background === 'dark' ? 'text-secondary' : 'text-primary'; ?>" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <p class="font-semibold <?php echo esc_attr($text_class); ?>">Address</p>
                                <p class="<?php echo esc_attr($text_muted); ?>">
                                    <?php echo nl2br(esc_html($content['address'])); ?>
                                </p>
                            </div>
                        </div>
                    <?php endif; ?>

                    <?php if ($show_hours && !empty($content['hours'])): ?>
                        <div class="flex items-start gap-4">
                            <div class="w-10 h-10 rounded-full <?php echo $background === 'dark' ? 'bg-white/10' : 'bg-primary/10'; ?> flex items-center justify-center flex-shrink-0">
                                <svg class="w-5 h-5 <?php echo $background === 'dark' ? 'text-secondary' : 'text-primary'; ?>" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p class="font-semibold <?php echo esc_attr($text_class); ?>">Business Hours</p>
                                <p class="<?php echo esc_attr($text_muted); ?>">
                                    <?php echo nl2br(esc_html($content['hours'])); ?>
                                </p>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>

                <?php if ($show_social && !empty($social_links)): ?>
                    <!-- Social Links -->
                    <div class="pt-4">
                        <p class="font-semibold <?php echo esc_attr($text_class); ?> mb-4">Follow Us</p>
                        <div class="flex gap-3">
                            <?php foreach ($social_links as $social): ?>
                                <a href="<?php echo esc_url($social['url']); ?>"
                                   target="_blank"
                                   rel="noopener noreferrer"
                                   class="w-10 h-10 rounded-full <?php echo $background === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-primary/10 hover:bg-primary/20'; ?> flex items-center justify-center transition-colors"
                                   aria-label="<?php echo esc_attr($social['platform'] ?? 'Social'); ?>">
                                    <span class="<?php echo $background === 'dark' ? 'text-white' : 'text-primary'; ?>">
                                        <?php echo $social['icon'] ?? $social['platform'] ?? ''; ?>
                                    </span>
                                </a>
                            <?php endforeach; ?>
                        </div>
                    </div>
                <?php endif; ?>
            </div>

            <!-- Form Side -->
            <div class="<?php echo esc_attr($form_order); ?> bg-white rounded-2xl p-6 lg:p-8 shadow-xl">
                <h3 class="text-xl font-bold text-primary mb-6">Send Us a Message</h3>

                <?php if (!empty($content['form_shortcode'])): ?>
                    <?php echo do_shortcode($content['form_shortcode']); ?>
                <?php else: ?>
                    <!-- Fallback form structure -->
                    <form class="space-y-4">
                        <div>
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input type="text" id="name" name="name" required
                                   class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors" />
                        </div>
                        <div>
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                            <input type="email" id="email" name="email" required
                                   class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors" />
                        </div>
                        <div>
                            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input type="tel" id="phone" name="phone"
                                   class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors" />
                        </div>
                        <div>
                            <label for="message" class="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                            <textarea id="message" name="message" rows="4" required
                                      class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors resize-none"></textarea>
                        </div>
                        <button type="submit"
                                class="w-full px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors">
                            Send Message
                        </button>
                    </form>
                <?php endif; ?>
            </div>

        </div>
    </div>
</div>
<!-- /wp:group -->
