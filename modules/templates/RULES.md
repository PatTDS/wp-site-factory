# Template Development Rules & Standards

**Version:** 1.0.0
**Last Updated:** 2025-12-05
**Purpose:** Standards for creating and maintaining templates

---

## Core Principles

1. **Adaptive First** - Templates must handle variable content gracefully
2. **Mobile First** - Design for mobile, enhance for desktop
3. **Performance** - Minimal CSS, no unnecessary JavaScript
4. **Accessibility** - WCAG 2.1 AA compliance minimum
5. **Documentation** - Every template needs rules.json

---

## File Naming Conventions

### Sections
```
{section}-{variant}.hbs
{section}-{variant}.css
{section}-{variant}.rules.json
{section}-{variant}.test.json

Examples:
hero-split-video.hbs
hero-split-image.hbs
hero-fullwidth.hbs
services-grid-3col.hbs
services-accordion.hbs
```

### Components
```
{component}.hbs
{component}.css

Examples:
service-card.hbs
testimonial-card.hbs
stat-item.hbs
```

### Naming Rules
- Use kebab-case for all files
- Section name comes first, then variant
- Be descriptive: `hero-split-video` not `hero-v1`
- Max 30 characters for filename

---

## Template Structure

### Required Files per Section Variant

| File | Required | Purpose |
|------|----------|---------|
| `{name}.hbs` | Yes | Handlebars template |
| `{name}.css` | Yes | Section-specific styles |
| `{name}.rules.json` | Yes | LLM instructions |
| `{name}.test.json` | Recommended | Sample data for preview |
| `{name}.preview.html` | Optional | Standalone preview page |

### Handlebars Template Structure

```handlebars
{{!-- Section: Hero Split Video --}}
{{!-- Version: 1.0.0 --}}
{{!-- Last Updated: 2025-12-05 --}}

<section id="hero" class="hero hero--split-video" data-section="hero">
  <div class="container">
    {{!-- Content here --}}
  </div>
</section>
```

**Rules:**
- Always include section comment header
- Use semantic HTML5 elements
- Include `id` for navigation anchors
- Include `data-section` for JavaScript hooks
- Use BEM naming for CSS classes

---

## CSS Standards

### Architecture

```css
/* ==========================================================================
   Section: Hero Split Video
   Version: 1.0.0
   ========================================================================== */

/* Base styles */
.hero--split-video {
  /* Layout */
  /* Spacing */
  /* Typography */
}

/* Responsive */
@media (min-width: 768px) { }
@media (min-width: 1024px) { }
@media (min-width: 1280px) { }

/* Animations */
@keyframes fadeIn { }

/* States */
.hero--split-video.is-loading { }
.hero--split-video.is-visible { }
```

### CSS Custom Properties (Required)

All templates must use CSS custom properties for:

```css
:root {
  /* Colors - from design tokens */
  --color-primary: #0F2942;
  --color-secondary: #4DA6FF;
  --color-accent: #FFFFFF;
  --color-text: #1a1a1a;
  --color-text-muted: #6b7280;
  --color-bg: #ffffff;
  --color-bg-alt: #f9fafb;

  /* Typography */
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.6;

  /* Spacing */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 1.5rem;
  --spacing-lg: 2rem;
  --spacing-xl: 3rem;
  --spacing-2xl: 4rem;
  --section-padding: 4rem;

  /* Borders */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
  --shadow-xl: 0 20px 25px rgba(0,0,0,0.15);

  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 300ms ease;
  --transition-slow: 500ms ease;
}
```

### Adaptive CSS Patterns

**Auto-fit Grid (adapts to item count):**
```css
.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}
```

**Responsive Font Size:**
```css
.hero-headline {
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.1;
}
```

**Text Truncation:**
```css
.service-description {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

**Aspect Ratio (for images/video):**
```css
.hero-media {
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
```

---

## Adaptive Design Requirements

### Item Count Handling

Templates must handle variable item counts:

| Section | Min | Max | Adaptation |
|---------|-----|-----|------------|
| Services | 3 | 12 | Auto-fit grid, show-more if >6 |
| Testimonials | 2 | 4 | 1-3 columns based on count |
| Stats | 4 | 6 | Flexible grid |
| Team | 2 | 8 | Auto-fit grid |

**Implementation:**
```handlebars
<div class="services-grid services-grid--{{services.length}}-items">
  {{#each services}}
    {{> service-card this}}
  {{/each}}
</div>
```

```css
/* 3-4 items: 2 columns */
.services-grid--3-items,
.services-grid--4-items {
  grid-template-columns: repeat(2, 1fr);
}

/* 5-6 items: 3 columns */
.services-grid--5-items,
.services-grid--6-items {
  grid-template-columns: repeat(3, 1fr);
}

/* 7+ items: 3 columns with pagination */
.services-grid--7-items { /* same as 6 */ }
```

### Text Length Handling

| Field | Max Chars | Overflow Strategy |
|-------|-----------|-------------------|
| Headline | 80 | Allow wrap, scale font |
| Subheadline | 200 | Allow wrap |
| Service name | 40 | Truncate with ... |
| Service description | 150 | Line clamp (3 lines) |
| Testimonial quote | 300 | Line clamp (4 lines) |
| CTA button text | 25 | Truncate |

### Optional Elements

All optional elements must be wrapped in conditionals:

```handlebars
{{#if tagline}}
  <p class="hero-tagline">{{tagline}}</p>
{{/if}}

{{#if cta_secondary_text}}
  <a href="{{cta_secondary_url}}" class="btn btn--secondary">
    {{cta_secondary_text}}
  </a>
{{/if}}
```

---

## Accessibility Requirements

### Minimum Standards (WCAG 2.1 AA)

1. **Color Contrast**
   - Text: 4.5:1 minimum
   - Large text: 3:1 minimum
   - UI components: 3:1 minimum

2. **Keyboard Navigation**
   - All interactive elements focusable
   - Visible focus indicators
   - Logical tab order

3. **Screen Readers**
   - Semantic HTML structure
   - ARIA labels where needed
   - Alt text for images

4. **Motion**
   - Respect `prefers-reduced-motion`
   - No auto-playing video with sound

### Implementation

```handlebars
{{!-- Accessible button --}}
<a href="{{cta_url}}"
   class="btn btn--primary"
   role="button"
   aria-label="{{cta_aria_label}}">
  {{cta_text}}
</a>

{{!-- Accessible image --}}
<img src="{{image_url}}"
     alt="{{image_alt}}"
     loading="lazy"
     decoding="async" />

{{!-- Skip link (in layout) --}}
<a href="#main-content" class="skip-link">Skip to main content</a>
```

```css
/* Focus indicator */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Performance Requirements

### CSS Budget

| Type | Budget |
|------|--------|
| Section CSS | < 5KB uncompressed |
| Total page CSS | < 50KB uncompressed |
| Critical CSS | < 14KB (first TCP packet) |

### Image Guidelines

- Use `loading="lazy"` for below-fold images
- Use `fetchpriority="high"` for hero image
- Provide srcset for responsive images
- Use WebP format with JPEG fallback

### No JavaScript (in templates)

Templates should be pure HTML/CSS. Any interactivity:
- Use CSS (hover, focus states)
- Defer to shared JS modules
- Document in rules.json

---

## Rules.json Specification

Every template variant needs a `rules.json` file:

```json
{
  "$schema": "../../schemas/template-rules.schema.json",
  "section": "hero",
  "variant": "split-video",
  "version": "1.0.0",
  "status": "approved",
  "purpose": "Hero section with video background and split layout",

  "blueprint_mapping": {
    "required": [
      "content_drafts.hero.headline",
      "content_drafts.hero.cta_primary_text"
    ],
    "optional": [
      "content_drafts.hero.tagline",
      "content_drafts.hero.subheadline",
      "content_drafts.hero.cta_secondary_text",
      "content_drafts.hero.cta_primary_url",
      "content_drafts.hero.cta_secondary_url"
    ]
  },

  "stock_photos": {
    "enabled": true,
    "fields": ["content_drafts.hero.image_keywords"],
    "fallback_keywords": ["construction", "industrial", "professional"],
    "requirements": {
      "aspect_ratio": "16:9",
      "min_width": 1920,
      "orientation": "landscape"
    }
  },

  "video": {
    "enabled": true,
    "source": "stock_video_url OR youtube_embed",
    "autoplay": true,
    "muted": true,
    "loop": true
  },

  "adaptive_rules": {
    "headline": {
      "max_chars": 80,
      "overflow": "wrap",
      "css_strategy": "clamp(2rem, 5vw, 4rem)"
    },
    "subheadline": {
      "max_chars": 200,
      "overflow": "wrap"
    },
    "cta_buttons": {
      "max_visible": 2,
      "min_visible": 1
    }
  },

  "design_tokens": {
    "uses": ["colors.primary", "colors.secondary", "typography.font_heading"],
    "overridable": ["colors.primary", "colors.secondary"]
  },

  "llm_instructions": {
    "DO": [
      "Extract headline from content_drafts.hero.headline",
      "Use cta_primary_text for main button",
      "Fetch hero image/video using image_keywords",
      "Apply brand colors from blueprint.brand.colors"
    ],
    "DO_NOT": [
      "Modify grid layout structure",
      "Change animation timings",
      "Add extra HTML elements",
      "Override font families"
    ],
    "USER_CUSTOMIZABLE": [
      "headline (text content)",
      "button_text",
      "background_overlay_opacity",
      "video_autoplay"
    ]
  },

  "dependencies": {
    "components": [],
    "shared_css": ["animations/fade-in.css"],
    "fonts": ["Inter:400,500,600,700"]
  }
}
```

---

## Testing Requirements

### Manual Testing Checklist

- [ ] Renders correctly with minimum content
- [ ] Renders correctly with maximum content
- [ ] All breakpoints (mobile, tablet, desktop)
- [ ] Optional elements hide correctly
- [ ] Text truncation works
- [ ] Images/video load and scale
- [ ] Keyboard navigation works
- [ ] Screen reader announces correctly
- [ ] Reduced motion respected

### Test Data File

Create `{name}.test.json` with sample data:

```json
{
  "minimal": {
    "headline": "Short Headline",
    "cta_primary_text": "Contact Us"
  },
  "typical": {
    "tagline": "Your Trusted Partner",
    "headline": "Expert Solutions for Your Business Needs",
    "subheadline": "We deliver quality services with precision and care.",
    "cta_primary_text": "Get a Free Quote",
    "cta_primary_url": "#contact",
    "cta_secondary_text": "Learn More",
    "cta_secondary_url": "#services"
  },
  "maximal": {
    "tagline": "Australia's Leading Provider",
    "headline": "Comprehensive Professional Services for Industrial and Commercial Projects Across Greater Sydney",
    "subheadline": "From initial consultation to final delivery, we provide end-to-end solutions that exceed expectations and deliver lasting value for your business.",
    "cta_primary_text": "Request Your Free Quote",
    "cta_primary_url": "#contact",
    "cta_secondary_text": "Explore Our Services",
    "cta_secondary_url": "#services"
  }
}
```

---

## Version Control

### Status Values

| Status | Meaning |
|--------|---------|
| `draft` | In development, not ready for use |
| `review` | Ready for review/approval |
| `approved` | Production ready |
| `deprecated` | Being phased out |

### Versioning

Follow semver for templates:
- MAJOR: Breaking changes to structure
- MINOR: New features, backward compatible
- PATCH: Bug fixes, style tweaks

---

## Quality Checklist

Before marking a template as `approved`:

- [ ] All required files exist (.hbs, .css, .rules.json)
- [ ] CSS uses custom properties
- [ ] Responsive at all breakpoints
- [ ] Handles min/max content
- [ ] Optional elements conditional
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Performance budget met
- [ ] Test data file created
- [ ] Rules.json complete
- [ ] Reviewed and tested

---

**Remember:** Templates are the foundation of the platform. Quality here multiplies across every site generated.
