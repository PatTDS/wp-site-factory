/**
 * HTML Preview Generator
 * Generates static HTML preview from assembled theme data
 *
 * Best Practice: Generate visual HTML preview before WordPress conversion
 * - Fast iteration without WordPress
 * - Easy client sharing
 * - Design approval workflow
 *
 * Research-based Design Philosophy:
 * - Avoid generic AI aesthetics (Inter, Roboto, purple gradients)
 * - Use distinctive, characterful fonts per industry
 * - Bold aesthetic directions with intentionality
 * - CSS-first animations for high-impact moments
 * - Staggered reveals create perceived quality
 */

import stockPhotos from './stock-photos.js';

/**
 * Industry-specific font pairings
 * Research: "Choose beautiful, unique, interesting fonts. AVOID generic fonts like Inter, Roboto."
 * Each pairing has: display (headings) + body fonts with Google Fonts URL
 */
const INDUSTRY_FONTS = {
  construction: {
    display: 'DM Sans',
    body: 'Source Sans 3',
    weights: '400;500;600;700',
    aesthetic: 'industrial',
    url: 'family=DM+Sans:wght@400;500;600;700&family=Source+Sans+3:wght@400;500;600',
  },
  professional: {
    display: 'Playfair Display',
    body: 'Lato',
    weights: '400;500;600;700',
    aesthetic: 'editorial',
    url: 'family=Playfair+Display:wght@400;500;600;700&family=Lato:wght@400;500;600',
  },
  restaurant: {
    display: 'Cormorant Garamond',
    body: 'Nunito',
    weights: '400;500;600;700',
    aesthetic: 'elegant',
    url: 'family=Cormorant+Garamond:wght@400;500;600;700&family=Nunito:wght@400;500;600',
  },
  healthcare: {
    display: 'Poppins',
    body: 'Open Sans',
    weights: '400;500;600;700',
    aesthetic: 'clean',
    url: 'family=Poppins:wght@400;500;600;700&family=Open+Sans:wght@400;500;600',
  },
  technology: {
    display: 'Space Grotesk',
    body: 'IBM Plex Sans',
    weights: '400;500;600;700',
    aesthetic: 'modern',
    url: 'family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600',
  },
  retail: {
    display: 'Outfit',
    body: 'Work Sans',
    weights: '400;500;600;700',
    aesthetic: 'contemporary',
    url: 'family=Outfit:wght@400;500;600;700&family=Work+Sans:wght@400;500;600',
  },
  creative: {
    display: 'Sora',
    body: 'Plus Jakarta Sans',
    weights: '400;500;600;700',
    aesthetic: 'bold',
    url: 'family=Sora:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600',
  },
  // Default fallback - still distinctive, not Inter
  default: {
    display: 'Bricolage Grotesque',
    body: 'Instrument Sans',
    weights: '400;500;600;700',
    aesthetic: 'distinctive',
    url: 'family=Bricolage+Grotesque:wght@400;500;600;700&family=Instrument+Sans:wght@400;500;600',
  },
};

/**
 * Get font pairing for industry
 * Falls back to default if industry not found
 */
function getFontPairing(industry, customTypography = null) {
  // If blueprint specifies fonts and they're not Inter/Roboto, use them
  if (customTypography?.headings && customTypography?.body) {
    const genericFonts = ['inter', 'roboto', 'arial', 'helvetica', 'system-ui', 'sans-serif'];
    const isGenericHeading = genericFonts.some(f => customTypography.headings.toLowerCase().includes(f));
    const isGenericBody = genericFonts.some(f => customTypography.body.toLowerCase().includes(f));

    if (!isGenericHeading && !isGenericBody) {
      return {
        display: customTypography.headings,
        body: customTypography.body,
        url: `family=${encodeURIComponent(customTypography.headings)}:wght@400;500;600;700&family=${encodeURIComponent(customTypography.body)}:wght@400;500;600`,
        aesthetic: 'custom',
      };
    }
  }

  // Map industry to font pairing
  const normalizedIndustry = (industry || '').toLowerCase().trim();
  return INDUSTRY_FONTS[normalizedIndustry] || INDUSTRY_FONTS.default;
}

/**
 * Generate complete HTML preview page
 * @param {object} assemblyResult - Theme assembly result
 * @param {object} options - Generation options
 * @returns {Promise<string>} - HTML content
 */
export async function generateHtmlPreview(assemblyResult, options = {}) {
  const {
    title = 'Theme Preview',
    includeNavigation = true,
    includePlaceholderImages = true,
    fetchStockPhotos = false,
    showPlaceholderBadges = false,
  } = options;

  const { designTokens, patterns, preset, blueprint } = assemblyResult;
  const colors = designTokens.input.colors;
  const typography = designTokens.input.typography;
  const industry = blueprint?.client_profile?.industry?.category || 'construction';

  // Get distinctive font pairing based on industry (research: avoid Inter, Roboto)
  const fonts = getFontPairing(industry, typography);

  // Fetch stock photos if enabled
  let stockImages = {};
  if (fetchStockPhotos && includePlaceholderImages) {
    console.log('\nFetching stock photos for preview...');
    stockImages = await fetchStockPhotosForSections(patterns, industry, blueprint);
  }

  // Generate sections in order (including stats)
  const sections = ['hero', 'stats', 'services', 'about', 'testimonials', 'contact'];
  const renderedSections = sections
    .filter(section => patterns[section] || (section === 'stats' && blueprint?.content_drafts?.stats))
    .map(section => {
      if (section === 'stats') {
        return renderStatsSection(blueprint?.content_drafts?.stats, colors);
      }
      return renderSection(section, patterns[section], colors, includePlaceholderImages, stockImages, showPlaceholderBadges);
    })
    .join('\n\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)}</title>

    <!-- Google Fonts - Industry-specific distinctive pairing (avoiding Inter/Roboto) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?${fonts.url}&display=swap" rel="stylesheet">

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
                        headings: ['${fonts.display}', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                        body: ['${fonts.body}', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                    },
                    animation: {
                        'fade-in': 'fadeIn 0.6s ease-out forwards',
                        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
                        'slide-in-left': 'slideInLeft 0.6s ease-out forwards',
                        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
                    },
                }
            }
        }
    </script>

    <style>
        /* Research-based typography: distinctive fonts, not generic AI aesthetics */
        body {
            font-family: '${fonts.body}', ui-sans-serif, system-ui, sans-serif;
        }
        h1, h2, h3, h4, h5, h6 {
            font-family: '${fonts.display}', ui-sans-serif, system-ui, sans-serif;
        }

        /* Animation keyframes - CSS-first approach for high-impact moments */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-30px); }
            to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(30px); }
            to { opacity: 1; transform: translateX(0); }
        }

        /* Staggered reveal utilities - one well-orchestrated page load creates more delight */
        .animate-on-scroll {
            opacity: 0;
            animation: fadeInUp 0.6s ease-out forwards;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-800 { animation-delay: 0.8s; }

        /* Background treatments - create atmosphere and depth */
        .gradient-overlay {
            position: relative;
        }
        .gradient-overlay::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.5) 100%);
            z-index: 1;
        }
        .gradient-overlay > * {
            position: relative;
            z-index: 2;
        }

        /* Subtle grain texture for depth */
        .grain-texture::after {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
            opacity: 0.03;
            pointer-events: none;
            z-index: 3;
        }

        /* Card hover effects - micro-interactions */
        .card-hover {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0,0,0,0.12);
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

        /* Placeholder image badges */
        .placeholder-container {
            position: relative;
        }
        .placeholder-badge {
            display: ${showPlaceholderBadges ? 'block' : 'none'};
            position: absolute;
            top: 8px;
            right: 8px;
            background: rgba(0,0,0,0.75);
            color: white;
            padding: 4px 8px;
            font-size: 10px;
            font-weight: 600;
            border-radius: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            z-index: 10;
        }
        body.show-placeholders .placeholder-badge {
            display: block;
        }

        /* Photo attribution */
        .photo-attribution {
            font-size: 10px;
            color: rgba(255,255,255,0.7);
            position: absolute;
            bottom: 8px;
            left: 8px;
            background: rgba(0,0,0,0.5);
            padding: 2px 6px;
            border-radius: 3px;
        }
        .photo-attribution a {
            color: rgba(255,255,255,0.9);
        }

        /* Placeholder toggle button */
        .placeholder-toggle {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: #3b82f6;
            color: white;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            z-index: 1001;
            border: none;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .placeholder-toggle:hover {
            background: #2563eb;
        }

        /* Stats section styles */
        .stat-item {
            text-align: center;
            padding: 1.5rem;
        }
        .stat-value {
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1;
        }
        .stat-label {
            font-size: 0.875rem;
            margin-top: 0.5rem;
            opacity: 0.9;
        }
        .stat-estimated {
            font-size: 0.625rem;
            opacity: 0.6;
            margin-top: 0.25rem;
        }
    </style>
</head>
<body class="font-body text-gray-900 bg-white">

${includeNavigation ? generateNavigation(patterns, colors, blueprint) : ''}

${renderedSections}

${generateFooter(patterns, colors, blueprint)}

<!-- Placeholder Toggle Button -->
<button class="placeholder-toggle" onclick="document.body.classList.toggle('show-placeholders'); this.textContent = document.body.classList.contains('show-placeholders') ? 'Hide Sample Badges' : 'Show Sample Badges';">
    Show Sample Badges
</button>

<!-- Preview Metadata -->
<div class="preview-meta">
    <strong>WPF Preview</strong><br>
    Preset: ${preset?.name || 'Custom'}<br>
    Industry: ${escapeHtml(industry)}<br>
    Stock Photos: ${fetchStockPhotos ? 'Enabled' : 'Placeholder'}<br>
    Generated: ${new Date().toLocaleString()}
</div>

</body>
</html>`;
}

/**
 * Generate navigation header
 */
function generateNavigation(patterns, colors, blueprint = {}) {
  const heroContent = patterns.hero?.content || {};
  const contactContent = patterns.contact?.content || {};

  // Get company name from multiple possible sources
  const companyName = blueprint?.client_profile?.company?.name ||
                      heroContent.company_name ||
                      'Company Name';

  return `
<!-- Navigation -->
<header class="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-sm z-50">
    <div class="container mx-auto px-4">
        <div class="flex items-center justify-between h-16 lg:h-20">
            <!-- Logo -->
            <a href="#" class="text-xl lg:text-2xl font-bold text-primary">
                ${escapeHtml(companyName)}
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
function renderSection(sectionType, patternData, colors, includePlaceholderImages, stockImages = {}, showPlaceholderBadges = false) {
  const { content, config, manifest } = patternData;
  const sectionStockImage = stockImages[sectionType];

  switch (sectionType) {
    case 'hero':
      return renderHeroSection(content, config, colors, includePlaceholderImages, sectionStockImage, showPlaceholderBadges);
    case 'services':
      return renderServicesSection(content, config, colors, stockImages.services, showPlaceholderBadges);
    case 'about':
      return renderAboutSection(content, config, colors, includePlaceholderImages, sectionStockImage, showPlaceholderBadges);
    case 'testimonials':
      return renderTestimonialsSection(content, config, colors, showPlaceholderBadges);
    case 'contact':
      return renderContactSection(content, config, colors);
    default:
      return `<!-- Unknown section: ${sectionType} -->`;
  }
}

/**
 * Hero Section HTML
 */
function renderHeroSection(content, config, colors, includePlaceholderImages, stockImage = null, showPlaceholderBadges = false) {
  const variant = config?.variant || 'image-right';
  const showTagline = config?.show_tagline !== false;
  const showSecondaryCta = config?.show_secondary_cta !== false;
  const imageOrder = variant === 'image-left' ? 'lg:order-first' : 'lg:order-last';

  // Use stock image if available, otherwise fallback
  const imageData = stockImage?.photo || null;
  // Stock image takes priority over placeholder paths (those starting with /wp-content)
  const hasRealImage = content.background_image && !content.background_image.startsWith('/wp-content');
  const imageSrc = imageData?.url?.large || (hasRealImage ? content.background_image : (includePlaceholderImages
    ? `https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop`
    : ''));
  const isPlaceholder = !hasRealImage && !imageData;

  // Generate responsive srcset if stock image available
  const srcset = imageData ? stockPhotos.generateSrcset(imageData) : '';

  return `
<!-- HERO SECTION - Research: bold aesthetic direction with staggered reveals -->
<section id="hero" class="min-h-[70vh] flex items-center bg-gradient-to-br from-gray-50 via-white to-primary-50/30 relative overflow-hidden">
    <!-- Subtle background pattern for depth -->
    <div class="absolute inset-0 opacity-[0.02]" style="background-image: radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0); background-size: 40px 40px;"></div>

    <div class="container mx-auto px-4 py-16 lg:py-24 relative">
        <div class="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            <!-- Content Side - Staggered reveal animation -->
            <div class="space-y-6 lg:space-y-8">
                ${showTagline && content.tagline ? `
                <p class="text-sm font-semibold uppercase tracking-wider text-secondary animate-on-scroll delay-100">
                    ${escapeHtml(content.tagline)}
                </p>
                ` : ''}

                <h1 class="text-4xl lg:text-5xl xl:text-6xl font-bold text-primary leading-tight animate-on-scroll delay-200">
                    ${escapeHtml(content.headline || 'Your Compelling Headline Here')}
                </h1>

                ${content.subheadline ? `
                <p class="text-lg lg:text-xl text-gray-600 max-w-xl animate-on-scroll delay-300">
                    ${escapeHtml(content.subheadline)}
                </p>
                ` : ''}

                <div class="flex flex-col sm:flex-row gap-4 pt-4 animate-on-scroll delay-400">
                    <a href="${escapeHtml(content.cta_primary_url || '#contact')}"
                       class="inline-flex items-center justify-center px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 transition-all duration-300 text-center shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5">
                        ${escapeHtml(content.cta_primary_text || 'Get Started')}
                    </a>

                    ${showSecondaryCta && content.cta_secondary_text ? `
                    <a href="${escapeHtml(content.cta_secondary_url || '#services')}"
                       class="inline-flex items-center justify-center px-8 py-4 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-all duration-300 text-center hover:-translate-y-0.5">
                        ${escapeHtml(content.cta_secondary_text)}
                    </a>
                    ` : ''}
                </div>
            </div>

            <!-- Image Side - with enhanced shadow and animation -->
            <div class="${imageOrder} animate-on-scroll delay-300">
                <div class="relative aspect-[4/3] lg:aspect-square rounded-2xl overflow-hidden shadow-2xl placeholder-container ring-1 ring-black/5">
                    ${imageSrc ? `
                    <img src="${escapeHtml(imageSrc)}"
                         ${srcset ? `srcset="${srcset}"` : ''}
                         sizes="(max-width: 768px) 100vw, 50vw"
                         alt="${escapeHtml(imageData?.alt || content.headline || 'Hero image')}"
                         class="absolute inset-0 w-full h-full object-cover${isPlaceholder ? ' placeholder-image' : ''}"
                         ${isPlaceholder ? 'data-placeholder="true"' : ''}
                         loading="eager"
                         fetchpriority="high" />
                    ${isPlaceholder ? '<span class="placeholder-badge">Sample Image</span>' : ''}
                    ${imageData && imageData.photographer ? `
                    <span class="photo-attribution">
                        Photo by <a href="${escapeHtml(imageData.photographer_url || '#')}" target="_blank" rel="noopener">${escapeHtml(imageData.photographer)}</a>
                        on <a href="${escapeHtml(imageData.source_url || '#')}" target="_blank" rel="noopener">${imageData.source === 'unsplash' ? 'Unsplash' : 'Pexels'}</a>
                    </span>
                    ` : ''}
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

  // Enhanced card classes with hover effects and animations
  const cardClasses = cardStyle === 'elevated'
    ? 'bg-white rounded-xl shadow-lg p-6 lg:p-8 card-hover'
    : 'bg-gray-50 rounded-xl p-6 lg:p-8 hover:bg-gray-100 transition-all duration-300 card-hover';

  // Service icons (simple SVG placeholders)
  const icons = [
    '<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>',
    '<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>',
    '<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>',
    '<svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg>',
  ];

  return `
<!-- SERVICES SECTION - Research: staggered reveals for visual interest -->
<section id="services" class="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white relative">
    <div class="container mx-auto px-4">

        <!-- Section Header with animation -->
        <div class="text-center max-w-3xl mx-auto mb-12 lg:mb-16 animate-on-scroll">
            <h2 class="text-3xl lg:text-4xl font-bold text-primary mb-4">
                ${escapeHtml(content.section_title || content.headline || 'Our Services')}
            </h2>
            ${(content.section_description || content.intro) ? `
            <p class="text-lg text-gray-600">
                ${escapeHtml(content.section_description || content.intro)}
            </p>
            ` : ''}
        </div>

        <!-- Services Grid with staggered card animations -->
        <div class="grid ${gridCols} gap-6 lg:gap-8">
            ${services.map((service, index) => `
            <div class="${cardClasses} animate-on-scroll delay-${Math.min((index + 1) * 100, 800)}">
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
function renderAboutSection(content, config, colors, includePlaceholderImages, stockImage = null, showPlaceholderBadges = false) {
  const variant = config?.variant || 'image-left';
  const showStats = config?.show_stats !== false;
  const showFeatures = config?.show_features !== false;
  const showCta = config?.show_cta !== false;
  const imageOrder = variant === 'image-right' ? 'lg:order-last' : '';

  // Use stock image if available
  const imageData = stockImage?.photo || null;
  const hasRealImage = content.image && !content.image.startsWith('/wp-content');
  const imageSrc = imageData?.url?.large || (hasRealImage ? content.image : (includePlaceholderImages
    ? 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=800&fit=crop'
    : ''));
  const isPlaceholder = !hasRealImage && !imageData;
  const srcset = imageData ? stockPhotos.generateSrcset(imageData) : '';

  const stats = content.stats || [];
  const features = content.features || content.values || [];

  return `
<!-- ABOUT SECTION - Research: asymmetric layouts with staggered reveals -->
<section id="about" class="py-16 lg:py-24 bg-gradient-to-br from-white via-gray-50/50 to-white relative overflow-hidden">
    <!-- Subtle decorative element for depth -->
    <div class="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/[0.02] to-transparent"></div>
    <div class="container mx-auto px-4 relative">
        <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            <!-- Image Side with slide-in animation -->
            <div class="${imageOrder} animate-on-scroll ${imageOrder ? 'delay-200' : 'delay-100'}" style="animation-name: ${imageOrder ? 'slideInRight' : 'slideInLeft'};">
                <div class="relative">
                    <div class="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl placeholder-container">
                        ${imageSrc ? `
                        <img src="${escapeHtml(imageSrc)}"
                             ${srcset ? `srcset="${srcset}"` : ''}
                             sizes="(max-width: 768px) 100vw, 50vw"
                             alt="${escapeHtml(imageData?.alt || 'About us')}"
                             class="w-full h-full object-cover${isPlaceholder ? ' placeholder-image' : ''}" />
                        ${isPlaceholder && showPlaceholderBadges ? '<span class="placeholder-badge">Sample Image</span>' : ''}
                        ${imageData && imageData.photographer ? `
                        <span class="photo-attribution">
                            Photo by <a href="${escapeHtml(imageData.photographer_url || '#')}" target="_blank" rel="noopener">${escapeHtml(imageData.photographer)}</a>
                        </span>
                        ` : ''}
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

            <!-- Content Side with staggered animations -->
            <div class="space-y-6">
                <h2 class="text-3xl lg:text-4xl font-bold text-primary animate-on-scroll delay-200">
                    ${escapeHtml(content.headline || 'About Our Company')}
                </h2>

                ${content.story ? `
                <div class="prose prose-lg text-gray-600 animate-on-scroll delay-300">
                    ${content.story.split('\n').map(p => `<p>${escapeHtml(p)}</p>`).join('')}
                </div>
                ` : ''}

                ${showFeatures && features.length > 0 ? `
                <div class="grid sm:grid-cols-2 gap-4 pt-4 animate-on-scroll delay-400">
                    ${features.slice(0, 4).map((feature, idx) => `
                    <div class="flex items-start space-x-3 transition-transform duration-300 hover:translate-x-1">
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
                <div class="pt-4 animate-on-scroll delay-500">
                    <a href="#contact" class="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:-translate-y-0.5">
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
<!-- TESTIMONIALS SECTION - Research: social proof with visual hierarchy -->
<section id="testimonials" class="py-16 lg:py-24 bg-gradient-to-b from-gray-50 via-gray-100/50 to-gray-50 relative">
    <!-- Decorative quote marks background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-10 left-10 text-[200px] font-serif text-primary/[0.03] leading-none">"</div>
        <div class="absolute bottom-10 right-10 text-[200px] font-serif text-primary/[0.03] leading-none rotate-180">"</div>
    </div>
    <div class="container mx-auto px-4 relative">

        <!-- Section Header with animation -->
        <div class="text-center max-w-3xl mx-auto mb-12 lg:mb-16 animate-on-scroll">
            <h2 class="text-3xl lg:text-4xl font-bold text-primary mb-4">
                ${escapeHtml(content.headline || 'What Our Clients Say')}
            </h2>
            ${content.intro ? `
            <p class="text-lg text-gray-600">
                ${escapeHtml(content.intro)}
            </p>
            ` : ''}
        </div>

        <!-- Testimonials Grid with staggered card animations -->
        <div class="grid ${gridCols} gap-6 lg:gap-8">
            ${testimonials.map((testimonial, index) => `
            <div class="bg-white rounded-xl shadow-lg p-6 lg:p-8 card-hover animate-on-scroll delay-${Math.min((index + 1) * 100, 600)}">
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
<!-- CONTACT SECTION - Research: clear call-to-action with visual hierarchy -->
<section id="contact" class="py-16 lg:py-24 ${bgClass} relative overflow-hidden">
    <!-- Decorative background elements -->
    ${background !== 'dark' ? `
    <div class="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary/[0.02] to-transparent"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-secondary/[0.03] rounded-full blur-3xl"></div>
    ` : `
    <div class="absolute top-0 right-0 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl"></div>
    `}
    <div class="container mx-auto px-4 relative">

        <!-- Section Header with animation -->
        <div class="text-center max-w-3xl mx-auto mb-12 lg:mb-16 animate-on-scroll">
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

            <!-- Contact Info with slide-in animation -->
            <div class="space-y-8 animate-on-scroll delay-100" style="animation-name: slideInLeft;">
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

            <!-- Contact Form with slide-in animation -->
            <div class="${background === 'dark' ? 'bg-white rounded-2xl p-8' : 'bg-gray-50 rounded-2xl p-8'} animate-on-scroll delay-200 card-hover" style="animation-name: slideInRight;">
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
                            class="w-full px-6 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-600 hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0">
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
function generateFooter(patterns, colors, blueprint = {}) {
  const heroContent = patterns.hero?.content || {};
  const contactContent = patterns.contact?.content || {};

  // Get company name from multiple sources
  const companyName = blueprint?.client_profile?.company?.name ||
                      heroContent.company_name ||
                      'Company Name';
  const tagline = blueprint?.client_profile?.company?.tagline ||
                  heroContent.subheadline ||
                  'Your trusted partner for quality services.';

  return `
<!-- FOOTER - Research: clean, professional close with subtle branding -->
<footer class="bg-gradient-to-b from-gray-900 to-gray-950 text-white py-12 relative overflow-hidden">
    <!-- Subtle decorative element -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
    <div class="container mx-auto px-4 relative">
        <div class="grid md:grid-cols-3 gap-8 mb-8">
            <div>
                <h3 class="text-xl font-bold mb-4">${escapeHtml(companyName)}</h3>
                <p class="text-gray-400">
                    ${escapeHtml(tagline)}
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
            <p>&copy; ${new Date().getFullYear()} ${escapeHtml(companyName)}. All rights reserved.</p>
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

/**
 * Fetch stock photos for all sections
 * @param {object} patterns - Section patterns
 * @param {string} industry - Industry category
 * @param {object} blueprint - Blueprint data
 * @returns {Promise<object>} - Stock images by section
 */
async function fetchStockPhotosForSections(patterns, industry, blueprint) {
  const stockImages = {};

  // Get image keywords from blueprint if available
  const heroKeywords = blueprint?.content_drafts?.hero?.image_keywords || [];
  const aboutKeywords = blueprint?.content_drafts?.about_us?.image_keywords || [];

  // Fetch hero image
  if (patterns.hero) {
    console.log('  Fetching hero image...');
    const keywords = heroKeywords.length > 0
      ? heroKeywords
      : [industry, 'professional', 'business'];
    stockImages.hero = await stockPhotos.findImageWithCache(keywords, industry, 'hero');
  }

  // Fetch about image
  if (patterns.about) {
    console.log('  Fetching about image...');
    const keywords = aboutKeywords.length > 0
      ? aboutKeywords
      : [industry, 'team', 'workplace'];
    stockImages.about = await stockPhotos.findImageWithCache(keywords, industry, 'about');
  }

  // Fetch service images (if services have image_keywords)
  if (patterns.services?.content?.services) {
    console.log('  Fetching service images...');
    stockImages.services = {};

    const services = patterns.services.content.services;
    for (let i = 0; i < Math.min(services.length, 12); i++) {
      const service = services[i];
      const keywords = service.image_keywords || [service.name, industry];
      const result = await stockPhotos.findImageWithCache(keywords, industry, `service-${i}`);
      stockImages.services[service.name] = result;
    }
  }

  return stockImages;
}

/**
 * Stats Section HTML
 */
function renderStatsSection(statsData, colors) {
  if (!statsData || !statsData.stats || statsData.stats.length === 0) {
    return '';
  }

  const stats = statsData.stats;
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
    5: 'md:grid-cols-3 lg:grid-cols-5',
    6: 'md:grid-cols-3 lg:grid-cols-6',
  }[stats.length] || 'md:grid-cols-4';

  return `
<!-- STATS SECTION -->
<section id="stats" class="py-12 lg:py-16 bg-primary text-white">
    <div class="container mx-auto px-4">
        <div class="grid ${gridCols} gap-8">
            ${stats.map(stat => `
            <div class="stat-item">
                <div class="stat-value">${escapeHtml(stat.value)}</div>
                <div class="stat-label">${escapeHtml(stat.label)}</div>
                ${stat.is_estimated ? '<div class="stat-estimated">(Estimated)</div>' : ''}
            </div>
            `).join('')}
        </div>
        ${statsData.has_estimated ? `
        <p class="text-center text-xs mt-6 opacity-60">
            * Some statistics are estimated. Please verify with the business owner.
        </p>
        ` : ''}
    </div>
</section>
`;
}

export default {
  generateHtmlPreview,
};
