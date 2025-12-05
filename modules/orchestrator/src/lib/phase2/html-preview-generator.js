/**
 * HTML Preview Generator
 * Generates static HTML preview from assembled theme data
 *
 * Best Practice: Generate visual HTML preview before WordPress conversion
 * - Fast iteration without WordPress
 * - Easy client sharing
 * - Design approval workflow
 */

/**
 * Generate complete HTML preview page
 */
export function generateHtmlPreview(assemblyResult, options = {}) {
  const {
    title = 'Theme Preview',
    includeNavigation = true,
    includePlaceholderImages = true,
  } = options;

  const { designTokens, patterns, preset } = assemblyResult;
  const colors = designTokens.input.colors;
  const typography = designTokens.input.typography;

  // Generate sections in order
  const sections = ['hero', 'services', 'about', 'testimonials', 'contact'];
  const renderedSections = sections
    .filter(section => patterns[section])
    .map(section => renderSection(section, patterns[section], colors, includePlaceholderImages))
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(typography.headings)}:wght@400;500;600;700&family=${encodeURIComponent(typography.body)}:wght@400;500;600&display=swap" rel="stylesheet">

    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            DEFAULT: '${colors.primary}',
                            50: '${lightenColor(colors.primary, 0.9)}',
                            100: '${lightenColor(colors.primary, 0.8)}',
                            500: '${colors.primary}',
                            600: '${darkenColor(colors.primary, 0.1)}',
                            700: '${darkenColor(colors.primary, 0.2)}',
                        },
                        secondary: {
                            DEFAULT: '${colors.secondary}',
                            500: '${colors.secondary}',
                        },
                        accent: {
                            DEFAULT: '${colors.accent || colors.secondary}',
                            500: '${colors.accent || colors.secondary}',
                        },
                    },
                    fontFamily: {
                        headings: ['${typography.headings}', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                        body: ['${typography.body}', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                    },
                }
            }
        }
    </script>

    <style>
        body {
            font-family: '${typography.body}', ui-sans-serif, system-ui, sans-serif;
        }
        h1, h2, h3, h4, h5, h6 {
            font-family: '${typography.headings}', ui-sans-serif, system-ui, sans-serif;
        }

        /* Preview metadata overlay */
        .preview-meta {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 12px;
            z-index: 1000;
        }
    </style>
</head>
<body class="font-body text-gray-900 bg-white">

${includeNavigation ? generateNavigation(patterns, colors) : ''}

${renderedSections}

${generateFooter(patterns, colors)}

<!-- Preview Metadata -->
<div class="preview-meta">
    <strong>WPF Preview</strong><br>
    Preset: ${preset?.name || 'Custom'}<br>
    Generated: ${new Date().toLocaleString()}
</div>

</body>
</html>`;
}

/**
 * Generate navigation header
 */
function generateNavigation(patterns, colors) {
  const heroContent = patterns.hero?.content || {};
  const contactContent = patterns.contact?.content || {};

  return `
<!-- Navigation -->
<header class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
    <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16 lg:h-20">
            <!-- Logo -->
            <a href="#" class="text-xl lg:text-2xl font-bold text-primary">
                ${escapeHtml(heroContent.company_name || 'Company Name')}
            </a>

            <!-- Navigation Links -->
            <nav class="hidden md:flex items-center space-x-8">
                <a href="#hero" class="text-gray-600 hover:text-primary transition-colors">Home</a>
                <a href="#services" class="text-gray-600 hover:text-primary transition-colors">Services</a>
                <a href="#about" class="text-gray-600 hover:text-primary transition-colors">About</a>
                <a href="#testimonials" class="text-gray-600 hover:text-primary transition-colors">Testimonials</a>
                <a href="#contact" class="text-gray-600 hover:text-primary transition-colors">Contact</a>
            </nav>

            <!-- CTA Button -->
            <a href="#contact" class="hidden lg:inline-flex items-center px-6 py-2.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors">
                ${escapeHtml(heroContent.cta_primary_text || 'Get Quote')}
            </a>

            <!-- Mobile Menu Button -->
            <button class="md:hidden p-2" onclick="document.getElementById('mobile-menu').classList.toggle('hidden')">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>

        <!-- Mobile Menu -->
        <div id="mobile-menu" class="hidden md:hidden pb-4">
            <nav class="flex flex-col space-y-2">
                <a href="#hero" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Home</a>
                <a href="#services" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Services</a>
                <a href="#about" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">About</a>
                <a href="#testimonials" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Testimonials</a>
                <a href="#contact" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">Contact</a>
            </nav>
        </div>
    </div>
</header>

<!-- Spacer for fixed header -->
<div class="h-16 lg:h-20"></div>
`;
}

/**
 * Render a section based on pattern type
 */
function renderSection(sectionType, patternData, colors, includePlaceholderImages) {
  const { content, config, manifest } = patternData;

  switch (sectionType) {
    case 'hero':
      return renderHeroSection(content, config, colors, includePlaceholderImages);
    case 'services':
      return renderServicesSection(content, config, colors);
    case 'about':
      return renderAboutSection(content, config, colors, includePlaceholderImages);
    case 'testimonials':
      return renderTestimonialsSection(content, config, colors);
    case 'contact':
      return renderContactSection(content, config, colors);
    default:
      return `<!-- Unknown section: ${sectionType} -->`;
  }
}

/**
 * Hero Section HTML
 */
function renderHeroSection(content, config, colors, includePlaceholderImages) {
  const variant = config?.variant || 'image-right';
  const showTagline = config?.show_tagline !== false;
  const showSecondaryCta = config?.show_secondary_cta !== false;
  const imageOrder = variant === 'image-left' ? 'lg:order-first' : 'lg:order-last';

  const placeholderImage = includePlaceholderImages
    ? `https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop`
    : '';

  return `
<!-- HERO SECTION -->
<section id="hero" class="min-h-[70vh] flex items-center bg-gradient-to-br from-gray-50 to-white">
    <div class="container mx-auto px-4 py-16 lg:py-24">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            <!-- Content Side -->
            <div class="space-y-6 lg:space-y-8">
                ${showTagline && content.tagline ? `
                <p class="text-sm font-semibold uppercase tracking-wider text-secondary">
                    ${escapeHtml(content.tagline)}
                </p>
                ` : ''}

                <h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-primary leading-tight">
                    ${escapeHtml(content.headline || 'Your Compelling Headline Here')}
                </h1>

                ${content.subheadline ? `
                <p class="text-lg lg:text-xl text-gray-600 max-w-xl">
                    ${escapeHtml(content.subheadline)}
                </p>
                ` : ''}

                <div class="flex flex-col sm:flex-row gap-4 pt-4">
                    <a href="${escapeHtml(content.cta_primary_url || '#contact')}"
                       class="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors text-center shadow-lg shadow-primary/25">
                        ${escapeHtml(content.cta_primary_text || 'Get Started')}
                    </a>

                    ${showSecondaryCta && content.cta_secondary_text ? `
                    <a href="${escapeHtml(content.cta_secondary_url || '#services')}"
                       class="inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors text-center">
                        ${escapeHtml(content.cta_secondary_text)}
                    </a>
                    ` : ''}
                </div>
            </div>

            <!-- Image Side -->
            <div class="${imageOrder}">
                <div class="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl">
                    ${content.background_image || placeholderImage ? `
                    <img src="${escapeHtml(content.background_image || placeholderImage)}"
                         alt="${escapeHtml(content.headline || 'Hero image')}"
                         class="absolute inset-0 w-full h-full object-cover" />
                    ` : `
                    <div class="absolute inset-0 bg-gradient-to-br from-primary to-secondary"></div>
                    `}
                </div>
            </div>

        </div>
    </div>
</section>
`;
}

/**
 * Services Section HTML
 */
function renderServicesSection(content, config, colors) {
  const columns = config?.columns || '3';
  const showIcons = config?.show_icons !== false;
  const showDescriptions = config?.show_descriptions !== false;
  const showCta = config?.show_cta !== false;
  const cardStyle = config?.card_style || 'elevated';

  const services = content.services || [];
  const gridCols = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-2 lg:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'md:grid-cols-3';

  const cardClasses = cardStyle === 'elevated'
    ? 'bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow p-6 lg:p-8'
    : 'bg-gray-50 rounded-xl p-6 lg:p-8 hover:bg-gray-100 transition-colors';

  // Service icons (simple SVG placeholders)
  const icons = [
    '<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>',
    '<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
    '<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
    '<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg>',
  ];

  return `
<!-- SERVICES SECTION -->
<section id="services" class="py-16 lg:py-24 bg-gray-50">
    <div class="container mx-auto px-4">

        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
            <h2 class="text-3xl lg:text-4xl font-bold text-primary mb-4">
                ${escapeHtml(content.headline || 'Our Services')}
            </h2>
            ${content.intro ? `
            <p class="text-lg text-gray-600">
                ${escapeHtml(content.intro)}
            </p>
            ` : ''}
        </div>

        <!-- Services Grid -->
        <div class="grid ${gridCols} gap-6 lg:gap-8">
            ${services.map((service, index) => `
            <div class="${cardClasses}">
                ${showIcons ? `
                <div class="text-primary mb-4">
                    ${icons[index % icons.length]}
                </div>
                ` : ''}

                <h3 class="text-xl font-bold text-gray-900 mb-3">
                    ${escapeHtml(service.name || `Service ${index + 1}`)}
                </h3>

                ${showDescriptions && service.description ? `
                <p class="text-gray-600 mb-4">
                    ${escapeHtml(service.description)}
                </p>
                ` : ''}

                ${service.features?.length > 0 ? `
                <ul class="space-y-2 mb-4">
                    ${service.features.slice(0, 3).map(feature => `
                    <li class="flex items-start text-sm text-gray-600">
                        <svg class="w-5 h-5 text-secondary mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                        </svg>
                        ${escapeHtml(feature)}
                    </li>
                    `).join('')}
                </ul>
                ` : ''}

                ${showCta ? `
                <a href="#contact" class="inline-flex items-center text-primary font-semibold hover:text-primary-600 transition-colors">
                    ${escapeHtml(service.cta || 'Learn More')}
                    <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                </a>
                ` : ''}
            </div>
            `).join('')}
        </div>

    </div>
</section>
`;
}

/**
 * About Section HTML
 */
function renderAboutSection(content, config, colors, includePlaceholderImages) {
  const variant = config?.variant || 'image-left';
  const showStats = config?.show_stats !== false;
  const showFeatures = config?.show_features !== false;
  const showCta = config?.show_cta !== false;
  const imageOrder = variant === 'image-right' ? 'lg:order-last' : '';

  const placeholderImage = includePlaceholderImages
    ? 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=800&fit=crop'
    : '';

  const stats = content.stats || [];
  const features = content.features || content.values || [];

  return `
<!-- ABOUT SECTION -->
<section id="about" class="py-16 lg:py-24 bg-white">
    <div class="container mx-auto px-4">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <!-- Image Side -->
            <div class="${imageOrder}">
                <div class="relative">
                    <div class="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl">
                        ${content.image || placeholderImage ? `
                        <img src="${escapeHtml(content.image || placeholderImage)}"
                             alt="About us"
                             class="w-full h-full object-cover" />
                        ` : `
                        <div class="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10"></div>
                        `}
                    </div>

                    ${showStats && stats.length > 0 ? `
                    <!-- Stats Overlay -->
                    <div class="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-xl shadow-xl">
                        <div class="text-4xl font-bold">${escapeHtml(stats[0]?.value || '10+')}</div>
                        <div class="text-sm opacity-90">${escapeHtml(stats[0]?.label || 'Years Experience')}</div>
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- Content Side -->
            <div class="space-y-6">
                <h2 class="text-3xl lg:text-4xl font-bold text-primary">
                    ${escapeHtml(content.headline || 'About Our Company')}
                </h2>

                ${content.story ? `
                <div class="prose prose-lg text-gray-600">
                    ${content.story.split('\n').map(p => `<p>${escapeHtml(p)}</p>`).join('')}
                </div>
                ` : ''}

                ${showFeatures && features.length > 0 ? `
                <div class="grid sm:grid-cols-2 gap-4 pt-4">
                    ${features.slice(0, 4).map(feature => `
                    <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0 w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                            <svg class="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                            </svg>
                        </div>
                        <span class="text-gray-700">${escapeHtml(typeof feature === 'string' ? feature : feature.name || feature.title)}</span>
                    </div>
                    `).join('')}
                </div>
                ` : ''}

                ${showCta ? `
                <div class="pt-4">
                    <a href="#contact" class="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors">
                        ${escapeHtml(content.cta_text || 'Learn More About Us')}
                        <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
                ` : ''}
            </div>

        </div>
    </div>
</section>
`;
}

/**
 * Testimonials Section HTML
 */
function renderTestimonialsSection(content, config, colors) {
  const variant = config?.variant || 'grid';
  const columns = config?.columns || '3';
  const showAvatar = config?.show_avatar !== false;
  const showCompany = config?.show_company !== false;
  const showRating = config?.show_rating !== false;

  const testimonials = content.testimonials || [];
  const gridCols = {
    '2': 'md:grid-cols-2',
    '3': 'md:grid-cols-2 lg:grid-cols-3',
    '4': 'md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'lg:grid-cols-3';

  // Generate initials for avatar placeholder
  const getInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??';
  };

  return `
<!-- TESTIMONIALS SECTION -->
<section id="testimonials" class="py-16 lg:py-24 bg-gray-50">
    <div class="container mx-auto px-4">

        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
            <h2 class="text-3xl lg:text-4xl font-bold text-primary mb-4">
                ${escapeHtml(content.headline || 'What Our Clients Say')}
            </h2>
            ${content.intro ? `
            <p class="text-lg text-gray-600">
                ${escapeHtml(content.intro)}
            </p>
            ` : ''}
        </div>

        <!-- Testimonials Grid -->
        <div class="grid ${gridCols} gap-6 lg:gap-8">
            ${testimonials.map((testimonial, index) => `
            <div class="bg-white rounded-xl shadow-lg p-6 lg:p-8">
                ${showRating ? `
                <div class="flex items-center mb-4">
                    ${Array(5).fill(0).map((_, i) => `
                    <svg class="w-5 h-5 ${i < (testimonial.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                    `).join('')}
                </div>
                ` : ''}

                <blockquote class="text-gray-600 mb-6">
                    <svg class="w-8 h-8 text-primary/20 mb-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"></path>
                    </svg>
                    "${escapeHtml(testimonial.quote || testimonial.text || 'Great service!')}"
                </blockquote>

                <div class="flex items-center">
                    ${showAvatar ? `
                    <div class="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold mr-4">
                        ${testimonial.avatar ? `
                        <img src="${escapeHtml(testimonial.avatar)}" alt="${escapeHtml(testimonial.name)}" class="w-full h-full rounded-full object-cover" />
                        ` : getInitials(testimonial.name)}
                    </div>
                    ` : ''}
                    <div>
                        <div class="font-semibold text-gray-900">${escapeHtml(testimonial.name || 'Happy Client')}</div>
                        ${showCompany && (testimonial.company || testimonial.role) ? `
                        <div class="text-sm text-gray-500">${escapeHtml(testimonial.role ? `${testimonial.role}, ${testimonial.company}` : testimonial.company)}</div>
                        ` : ''}
                    </div>
                </div>
            </div>
            `).join('')}
        </div>

    </div>
</section>
`;
}

/**
 * Contact Section HTML
 */
function renderContactSection(content, config, colors) {
  const variant = config?.variant || 'form-right';
  const showMap = config?.show_map !== false;
  const showHours = config?.show_hours !== false;
  const showSocial = config?.show_social !== false;
  const background = config?.background || 'white';

  const bgClass = background === 'dark' ? 'bg-primary text-white' : 'bg-white';
  const textClass = background === 'dark' ? 'text-gray-300' : 'text-gray-600';
  const headingClass = background === 'dark' ? 'text-white' : 'text-primary';

  const socialLinks = content.social_links || [];

  return `
<!-- CONTACT SECTION -->
<section id="contact" class="py-16 lg:py-24 ${bgClass}">
    <div class="container mx-auto px-4">

        <!-- Section Header -->
        <div class="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
            <h2 class="text-3xl lg:text-4xl font-bold ${headingClass} mb-4">
                ${escapeHtml(content.headline || 'Get In Touch')}
            </h2>
            ${content.intro ? `
            <p class="text-lg ${textClass}">
                ${escapeHtml(content.intro)}
            </p>
            ` : ''}
        </div>

        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16">

            <!-- Contact Info -->
            <div class="space-y-8">
                <div>
                    <h3 class="text-xl font-bold ${headingClass} mb-4">Contact Information</h3>
                    <div class="space-y-4">
                        ${content.phone ? `
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0 w-10 h-10 rounded-lg ${background === 'dark' ? 'bg-white/10' : 'bg-primary/10'} flex items-center justify-center">
                                <svg class="w-5 h-5 ${background === 'dark' ? 'text-white' : 'text-primary'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                                </svg>
                            </div>
                            <div>
                                <div class="font-semibold ${headingClass}">Phone</div>
                                <a href="tel:${escapeHtml(content.phone)}" class="${textClass} hover:underline">${escapeHtml(content.phone)}</a>
                            </div>
                        </div>
                        ` : ''}

                        ${content.email ? `
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0 w-10 h-10 rounded-lg ${background === 'dark' ? 'bg-white/10' : 'bg-primary/10'} flex items-center justify-center">
                                <svg class="w-5 h-5 ${background === 'dark' ? 'text-white' : 'text-primary'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                            </div>
                            <div>
                                <div class="font-semibold ${headingClass}">Email</div>
                                <a href="mailto:${escapeHtml(content.email)}" class="${textClass} hover:underline">${escapeHtml(content.email)}</a>
                            </div>
                        </div>
                        ` : ''}

                        ${content.address ? `
                        <div class="flex items-start space-x-4">
                            <div class="flex-shrink-0 w-10 h-10 rounded-lg ${background === 'dark' ? 'bg-white/10' : 'bg-primary/10'} flex items-center justify-center">
                                <svg class="w-5 h-5 ${background === 'dark' ? 'text-white' : 'text-primary'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                </svg>
                            </div>
                            <div>
                                <div class="font-semibold ${headingClass}">Address</div>
                                <div class="${textClass}">${escapeHtml(content.address)}</div>
                            </div>
                        </div>
                        ` : ''}
                    </div>
                </div>

                ${showHours && content.hours ? `
                <div>
                    <h3 class="text-xl font-bold ${headingClass} mb-4">Business Hours</h3>
                    <div class="${textClass}">
                        ${escapeHtml(content.hours)}
                    </div>
                </div>
                ` : ''}

                ${showSocial && socialLinks.length > 0 ? `
                <div>
                    <h3 class="text-xl font-bold ${headingClass} mb-4">Follow Us</h3>
                    <div class="flex space-x-4">
                        ${socialLinks.map(social => `
                        <a href="${escapeHtml(social.url || '#')}" class="w-10 h-10 rounded-lg ${background === 'dark' ? 'bg-white/10 hover:bg-white/20' : 'bg-primary/10 hover:bg-primary/20'} flex items-center justify-center transition-colors">
                            <span class="${background === 'dark' ? 'text-white' : 'text-primary'}">${escapeHtml(social.platform?.[0] || 'S')}</span>
                        </a>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
            </div>

            <!-- Contact Form -->
            <div class="${background === 'dark' ? 'bg-white rounded-2xl p-8' : 'bg-gray-50 rounded-2xl p-8'}">
                <h3 class="text-xl font-bold text-primary mb-6">Send Us a Message</h3>
                <form class="space-y-4">
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input type="text" name="name" required
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input type="tel" name="phone"
                                   class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" name="email" required
                               class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                        <textarea name="message" rows="4" required
                                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"></textarea>
                    </div>
                    <button type="submit"
                            class="w-full px-6 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors">
                        Send Message
                    </button>
                </form>
            </div>

        </div>
    </div>
</section>
`;
}

/**
 * Generate footer
 */
function generateFooter(patterns, colors) {
  const heroContent = patterns.hero?.content || {};
  const contactContent = patterns.contact?.content || {};

  return `
<!-- FOOTER -->
<footer class="bg-gray-900 text-white py-12">
    <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8 mb-8">
            <div>
                <h3 class="text-xl font-bold mb-4">${escapeHtml(heroContent.company_name || 'Company Name')}</h3>
                <p class="text-gray-400">
                    ${escapeHtml(heroContent.subheadline || 'Your trusted partner for quality services.')}
                </p>
            </div>
            <div>
                <h3 class="text-xl font-bold mb-4">Quick Links</h3>
                <ul class="space-y-2">
                    <li><a href="#hero" class="text-gray-400 hover:text-white transition-colors">Home</a></li>
                    <li><a href="#services" class="text-gray-400 hover:text-white transition-colors">Services</a></li>
                    <li><a href="#about" class="text-gray-400 hover:text-white transition-colors">About</a></li>
                    <li><a href="#contact" class="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                </ul>
            </div>
            <div>
                <h3 class="text-xl font-bold mb-4">Contact</h3>
                <div class="space-y-2 text-gray-400">
                    ${contactContent.phone ? `<p>${escapeHtml(contactContent.phone)}</p>` : ''}
                    ${contactContent.email ? `<p>${escapeHtml(contactContent.email)}</p>` : ''}
                    ${contactContent.address ? `<p>${escapeHtml(contactContent.address)}</p>` : ''}
                </div>
            </div>
        </div>
        <div class="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>&copy; ${new Date().getFullYear()} ${escapeHtml(heroContent.company_name || 'Company')}. All rights reserved.</p>
            <p class="text-sm mt-2">Preview generated by WPF Site Factory</p>
        </div>
    </div>
</footer>
`;
}

/**
 * Utility: Escape HTML entities
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Utility: Lighten a color
 */
function lightenColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, Math.floor((num >> 16) + (255 - (num >> 16)) * amount));
  const g = Math.min(255, Math.floor(((num >> 8) & 0x00FF) + (255 - ((num >> 8) & 0x00FF)) * amount));
  const b = Math.min(255, Math.floor((num & 0x0000FF) + (255 - (num & 0x0000FF)) * amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * Utility: Darken a color
 */
function darkenColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.floor((num >> 16) * (1 - amount)));
  const g = Math.max(0, Math.floor(((num >> 8) & 0x00FF) * (1 - amount)));
  const b = Math.max(0, Math.floor((num & 0x0000FF) * (1 - amount)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export default {
  generateHtmlPreview,
};
