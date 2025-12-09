# Skill: WPF Frontend Development

Generate production-grade frontend code following WPF patterns for WordPress sites.

## When to Use

Use this skill when:
- Building WordPress block patterns
- Creating landing page HTML
- Developing theme templates
- Converting designs to code
- Optimizing frontend performance

## Core Principles

### 1. Mobile-First Responsive Design

Always start with mobile layout, then enhance for larger screens:

```html
<!-- Mobile: Stack vertically -->
<!-- Tablet: 2 columns -->
<!-- Desktop: 3 columns -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- Cards -->
</div>
```

**Breakpoints:**
- `sm`: 640px (mobile landscape)
- `md`: 768px (tablet)
- `lg`: 1024px (laptop)
- `xl`: 1280px (desktop)
- `2xl`: 1536px (large desktop)

### 2. Tailwind CSS v4 Usage

**@theme Directive (Preferred):**
```css
/* In theme CSS file */
@theme {
  --font-heading: 'DM Sans', sans-serif;
  --font-body: 'Source Sans 3', sans-serif;

  --color-primary-50: #f0f9ff;
  --color-primary-600: #0284c7;
  --color-primary-700: #0369a1;

  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
}
```

**Utility Classes (HTML):**
```html
<div class="bg-primary-600 text-white px-6 py-4 rounded-lg shadow-lg">
  Content
</div>
```

**Avoid Custom CSS:** Use Tailwind utilities for 95% of styling. Only write custom CSS for complex animations or unique effects.

### 3. Component Structure

**WordPress Block Pattern Format:**
```html
<!-- wp:group {"className":"hero-section bg-primary-50"} -->
<section class="hero-section bg-primary-50">
  <div class="max-w-7xl mx-auto px-4 py-24 lg:py-32">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <!-- Content -->
      <div>
        <h1 class="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Hero Headline
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Supporting text that explains the value proposition.
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <a href="#contact" class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg text-center transition-colors">
            Primary Action
          </a>
          <a href="#services" class="border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg text-center transition-colors">
            Secondary Action
          </a>
        </div>
      </div>

      <!-- Image -->
      <div>
        <img
          src="hero-image.jpg"
          alt="Descriptive alt text"
          class="rounded-xl shadow-2xl w-full h-auto"
          width="600"
          height="400"
        >
      </div>
    </div>
  </div>
</section>
<!-- /wp:group -->
```

## HTML Best Practices

### Semantic HTML

Always use proper semantic elements:

```html
<!-- Document structure -->
<header>
  <nav aria-label="Main navigation">...</nav>
</header>

<main>
  <section>
    <h2>Section Title</h2>
    <article>...</article>
  </section>
</main>

<aside>
  <h3>Related Content</h3>
  <!-- Sidebar -->
</aside>

<footer>
  <nav aria-label="Footer navigation">...</nav>
</footer>
```

### Heading Hierarchy

Never skip heading levels:

```html
<!-- CORRECT -->
<h1>Page Title</h1>
<section>
  <h2>Section Title</h2>
  <h3>Subsection</h3>
</section>

<!-- WRONG -->
<h1>Page Title</h1>
<h3>Skipped h2!</h3>
```

### Image Optimization

Always include width, height, and descriptive alt text:

```html
<img
  src="image.jpg"
  alt="Construction worker operating crane at commercial building site"
  width="1200"
  height="800"
  loading="lazy"
  class="w-full h-auto rounded-lg"
>
```

**Image Guidelines:**
- Use `loading="lazy"` for below-the-fold images
- Omit `loading` for hero images (LCP element)
- Add `fetchpriority="high"` to LCP image
- Use WebP format with JPEG fallback
- Target < 200KB for hero images

## CSS Patterns

### Layout Patterns

**Full-Width Section with Centered Content:**
```html
<section class="bg-gray-50 py-20 lg:py-28">
  <div class="max-w-7xl mx-auto px-4">
    <!-- Content constrained to max-width -->
  </div>
</section>
```

**Grid Layouts:**
```html
<!-- Auto-fit cards -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <div class="card">...</div>
</div>

<!-- Fixed columns with gap -->
<div class="grid grid-cols-12 gap-6">
  <div class="col-span-12 md:col-span-8">Main content</div>
  <div class="col-span-12 md:col-span-4">Sidebar</div>
</div>
```

**Flexbox Layouts:**
```html
<!-- Space between items -->
<div class="flex justify-between items-center">
  <div>Left</div>
  <div>Right</div>
</div>

<!-- Center content -->
<div class="flex justify-center items-center min-h-screen">
  <div>Centered content</div>
</div>
```

### Spacing Utilities

Use consistent spacing:

```html
<!-- Padding -->
<div class="p-4">All sides: 1rem</div>
<div class="px-4 py-2">Horizontal & Vertical</div>
<div class="pt-8 pb-4">Top & Bottom different</div>

<!-- Margin -->
<div class="mb-8">Bottom margin</div>
<div class="mx-auto">Center horizontally</div>

<!-- Gap (for flex/grid) -->
<div class="flex gap-4">Consistent gap between items</div>
<div class="grid grid-cols-3 gap-6">Grid with gaps</div>
```

### Color Utilities

```html
<!-- Background -->
<div class="bg-white">White background</div>
<div class="bg-primary-600">Primary color</div>
<div class="bg-gray-50">Light gray</div>

<!-- Text -->
<p class="text-gray-900">Dark text</p>
<p class="text-primary-600">Primary text</p>
<p class="text-gray-600">Muted text</p>

<!-- Border -->
<div class="border border-gray-200">Default border</div>
<div class="border-2 border-primary-600">Thick primary border</div>
```

### Typography Utilities

```html
<!-- Size -->
<h1 class="text-5xl lg:text-6xl">Hero headline</h1>
<h2 class="text-4xl">Section title</h2>
<p class="text-base">Body text</p>
<p class="text-sm text-gray-600">Small text</p>

<!-- Weight -->
<span class="font-normal">Regular</span>
<span class="font-semibold">Semibold</span>
<span class="font-bold">Bold</span>

<!-- Line height -->
<p class="leading-relaxed">More line spacing</p>
<p class="leading-tight">Less line spacing</p>
```

## Component Examples

### Button Component

```html
<!-- Primary button -->
<button class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg shadow-sm transition-colors duration-200 font-semibold">
  Click Me
</button>

<!-- Secondary button -->
<button class="border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg transition-colors duration-200 font-semibold">
  Secondary
</button>

<!-- Ghost button -->
<button class="text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg transition-colors duration-200 font-semibold">
  Tertiary
</button>

<!-- Button with icon -->
<button class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg shadow-sm transition-colors duration-200 font-semibold flex items-center gap-2">
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
  Send Message
</button>
```

### Card Component

```html
<!-- Basic card -->
<div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-200">
  <h3 class="text-xl font-bold mb-2">Card Title</h3>
  <p class="text-gray-600 mb-4">Card description goes here.</p>
  <a href="#" class="text-primary-600 hover:text-primary-700 font-semibold">
    Learn More →
  </a>
</div>

<!-- Card with image -->
<div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200">
  <img
    src="card-image.jpg"
    alt="Card image"
    class="w-full h-48 object-cover"
    width="400"
    height="192"
  >
  <div class="p-6">
    <h3 class="text-xl font-bold mb-2">Card Title</h3>
    <p class="text-gray-600">Description text.</p>
  </div>
</div>

<!-- Icon card -->
<div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200">
  <div class="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
    <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  </div>
  <h3 class="text-xl font-bold mb-2">Feature Title</h3>
  <p class="text-gray-600">Feature description.</p>
</div>
```

### Form Component

```html
<form class="space-y-6">
  <!-- Text input -->
  <div>
    <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
      Full Name
    </label>
    <input
      type="text"
      id="name"
      name="name"
      required
      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
      placeholder="John Doe"
    >
  </div>

  <!-- Email input -->
  <div>
    <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
      Email Address
    </label>
    <input
      type="email"
      id="email"
      name="email"
      required
      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
      placeholder="john@example.com"
    >
  </div>

  <!-- Textarea -->
  <div>
    <label for="message" class="block text-sm font-semibold text-gray-700 mb-2">
      Message
    </label>
    <textarea
      id="message"
      name="message"
      rows="4"
      required
      class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
      placeholder="Tell us about your project..."
    ></textarea>
  </div>

  <!-- Submit button -->
  <button
    type="submit"
    class="w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg shadow-sm transition-colors duration-200 font-semibold"
  >
    Send Message
  </button>
</form>
```

### Navigation Component

```html
<header class="bg-white border-b border-gray-200 sticky top-0 z-50">
  <nav class="max-w-7xl mx-auto px-4" aria-label="Main navigation">
    <div class="flex justify-between items-center h-16">
      <!-- Logo -->
      <div class="flex-shrink-0">
        <a href="/" class="text-2xl font-bold text-primary-600">
          Company
        </a>
      </div>

      <!-- Desktop menu -->
      <div class="hidden md:flex space-x-8">
        <a href="/" class="text-gray-700 hover:text-primary-600 font-semibold transition-colors">
          Home
        </a>
        <a href="/about" class="text-gray-700 hover:text-primary-600 font-semibold transition-colors">
          About
        </a>
        <a href="/services" class="text-gray-700 hover:text-primary-600 font-semibold transition-colors">
          Services
        </a>
        <a href="/contact" class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
          Contact
        </a>
      </div>

      <!-- Mobile menu button -->
      <button
        type="button"
        class="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
        aria-label="Toggle menu"
        aria-expanded="false"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>

    <!-- Mobile menu (hidden by default) -->
    <div class="md:hidden hidden py-4 space-y-2">
      <a href="/" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
        Home
      </a>
      <a href="/about" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
        About
      </a>
      <a href="/services" class="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
        Services
      </a>
      <a href="/contact" class="block px-4 py-2 bg-primary-600 text-white rounded-lg text-center">
        Contact
      </a>
    </div>
  </nav>
</header>
```

### Footer Component

```html
<footer class="bg-gray-900 text-white">
  <div class="max-w-7xl mx-auto px-4 py-12">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
      <!-- Company info -->
      <div>
        <h3 class="text-xl font-bold mb-4">Company Name</h3>
        <p class="text-gray-400 mb-4">
          Building excellence since 1998.
        </p>
        <div class="flex space-x-4">
          <a href="#" class="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
            </svg>
          </a>
          <!-- More social icons -->
        </div>
      </div>

      <!-- Quick links -->
      <div>
        <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
        <ul class="space-y-2">
          <li><a href="/" class="text-gray-400 hover:text-white transition-colors">Home</a></li>
          <li><a href="/about" class="text-gray-400 hover:text-white transition-colors">About</a></li>
          <li><a href="/services" class="text-gray-400 hover:text-white transition-colors">Services</a></li>
          <li><a href="/contact" class="text-gray-400 hover:text-white transition-colors">Contact</a></li>
        </ul>
      </div>

      <!-- Services -->
      <div>
        <h4 class="text-lg font-semibold mb-4">Services</h4>
        <ul class="space-y-2">
          <li><a href="/services/residential" class="text-gray-400 hover:text-white transition-colors">Residential</a></li>
          <li><a href="/services/commercial" class="text-gray-400 hover:text-white transition-colors">Commercial</a></li>
          <li><a href="/services/industrial" class="text-gray-400 hover:text-white transition-colors">Industrial</a></li>
        </ul>
      </div>

      <!-- Contact info -->
      <div>
        <h4 class="text-lg font-semibold mb-4">Contact</h4>
        <ul class="space-y-2 text-gray-400">
          <li>123 Main Street</li>
          <li>City, State 12345</li>
          <li class="mt-4">(555) 123-4567</li>
          <li>info@company.com</li>
        </ul>
      </div>
    </div>

    <!-- Copyright bar -->
    <div class="border-t border-gray-800 pt-8 text-center text-gray-400">
      <p>&copy; 2025 Company Name. All rights reserved.</p>
    </div>
  </div>
</footer>
```

## Animation Patterns

### CSS Transitions (Preferred)

```html
<!-- Hover effects -->
<button class="bg-primary-600 hover:bg-primary-700 transition-colors duration-200">
  Button
</button>

<!-- Scale on hover -->
<div class="hover:scale-105 transition-transform duration-200">
  Card
</div>

<!-- Fade and slide -->
<div class="opacity-0 translate-y-4 animate-fade-in">
  Content
</div>
```

### Keyframe Animations

```css
/* Add to CSS file */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 400ms ease-out forwards;
}

/* Staggered animation */
.stagger-1 { animation-delay: 0ms; }
.stagger-2 { animation-delay: 100ms; }
.stagger-3 { animation-delay: 200ms; }
```

### Scroll Animations

```html
<!-- Intersection Observer pattern -->
<div class="opacity-0 transition-opacity duration-500" data-animate>
  Content fades in when scrolled into view
</div>

<script>
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0');
      }
    });
  });

  document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
  });
</script>
```

## Performance Optimization

### Critical CSS

Generate critical CSS for above-the-fold content:

```html
<head>
  <!-- Inline critical CSS -->
  <style>
    /* Only styles for hero, nav, and immediately visible content */
    .hero { /* ... */ }
    nav { /* ... */ }
  </style>

  <!-- Defer non-critical CSS -->
  <link rel="preload" href="styles.css" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="styles.css"></noscript>
</head>
```

### Lazy Loading

```html
<!-- Lazy load images below the fold -->
<img src="image.jpg" alt="Description" loading="lazy" width="800" height="600">

<!-- Lazy load iframes -->
<iframe src="https://youtube.com/embed/..." loading="lazy" title="Video title"></iframe>
```

### Resource Hints

```html
<head>
  <!-- Preconnect to external domains -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://cdn.example.com">

  <!-- Preload critical assets -->
  <link rel="preload" href="hero-image.webp" as="image" type="image/webp">
  <link rel="preload" href="fonts/heading.woff2" as="font" type="font/woff2" crossorigin>
</head>
```

## What to AVOID

### Generic AI Aesthetics

- ❌ Purple-to-pink gradients
- ❌ Glassmorphism everywhere
- ❌ Excessive drop shadows
- ❌ Overused animations
- ❌ Generic stock photos
- ❌ Cookie-cutter layouts

### Performance Anti-Patterns

- ❌ Inline styles (use Tailwind classes)
- ❌ Multiple CSS files (bundle into one)
- ❌ Unoptimized images
- ❌ Render-blocking JavaScript
- ❌ Unused CSS (purge with PurgeCSS)

### Accessibility Anti-Patterns

- ❌ Missing alt text on images
- ❌ Low color contrast
- ❌ No keyboard focus states
- ❌ Non-semantic HTML (divs for everything)
- ❌ Missing ARIA labels

## Quality Checklist

Before considering code complete:

- [ ] Mobile-first responsive design implemented
- [ ] All images have width, height, and alt text
- [ ] Semantic HTML used throughout
- [ ] Tailwind utilities preferred over custom CSS
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Keyboard navigation works
- [ ] Focus states visible on all interactive elements
- [ ] Animations respect prefers-reduced-motion
- [ ] Images use loading="lazy" below the fold
- [ ] Hero image has fetchpriority="high"
- [ ] CSS is minified for production
- [ ] No console errors or warnings

## WordPress Integration

### Theme Functions

```php
<?php
// Enqueue theme styles
function theme_enqueue_styles() {
    wp_enqueue_style('theme-styles', get_stylesheet_uri(), [], '1.0.0');
}
add_action('wp_enqueue_scripts', 'theme_enqueue_styles');

// Register navigation menus
register_nav_menus([
    'primary' => __('Primary Menu'),
    'footer' => __('Footer Menu'),
]);
```

### Block Pattern Registration

```php
<?php
// Register custom block pattern
register_block_pattern(
    'wpf/hero-section',
    [
        'title' => __('Hero Section'),
        'description' => __('Full-width hero with image and CTA'),
        'content' => '<!-- Pattern HTML here -->',
        'categories' => ['hero'],
    ]
);
```

## Resources

**External Links:**
- Tailwind CSS: https://tailwindcss.com
- MDN Web Docs: https://developer.mozilla.org
- WordPress Block Patterns: https://developer.wordpress.org/block-editor/reference-guides/block-api/block-patterns/

**Internal References:**
- WPF Design System Skill: `.claude/skills/wpf-design-system/SKILL.md`
- Pattern Library: `templates/shared/patterns/`
- Anti-patterns: `tokens/anti-patterns.json`
