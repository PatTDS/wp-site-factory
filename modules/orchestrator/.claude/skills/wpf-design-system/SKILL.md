# Skill: WPF Design System

Apply WPF design tokens, anti-patterns, and component standards when building UI for WordPress sites.

## When to Use

Use this skill when:
- Building WordPress block patterns or themes
- Creating landing pages for client websites
- Designing UI components for any WPF project
- Validating design choices against anti-patterns

## Design Token System

### Naming Convention

**Format:** `component-category-role-state`

**Examples:**
- `button-background-primary-hover`
- `card-border-default-focus`
- `input-text-label-disabled`
- `alert-background-danger-default`

**Component Categories:**
- `button`, `input`, `card`, `badge`, `alert`, `nav`, `footer`, `hero`, `section`

**Roles:**
- `primary`, `secondary`, `success`, `warning`, `danger`, `neutral`, `info`

**States:**
- `default`, `hover`, `focus`, `active`, `disabled`, `error`, `success`

### Spacing Scale

Use these spacing values consistently:

| Name | Value | Tailwind Class | Usage |
|------|-------|----------------|-------|
| `xs` | 0.25rem (4px) | `space-1` | Icon gaps, tight spacing |
| `sm` | 0.5rem (8px) | `space-2` | Small padding, compact layouts |
| `md` | 1rem (16px) | `space-4` | Default component padding |
| `lg` | 1.5rem (24px) | `space-6` | Section padding, cards |
| `xl` | 2rem (32px) | `space-8` | Large section gaps |
| `2xl` | 3rem (48px) | `space-12` | Hero sections, major divisions |

**Section Spacing:**
- Small sections: `py-12 lg:py-16`
- Medium sections: `py-16 lg:py-20`
- Large sections: `py-20 lg:py-28`
- Hero sections: `py-24 lg:py-32`

## Typography Guidelines

### Font Selection Rules

**BANNED FONTS** (generic AI aesthetics):
- Inter
- Roboto
- Arial
- Helvetica
- Open Sans
- Montserrat

**Industry-Specific Alternatives:**

**Construction/Industrial:**
- Heading: DM Sans (bold, strong)
- Body: Source Sans 3 (readable, professional)

**Professional Services (Law, Consulting):**
- Heading: Playfair Display (elegant, authoritative)
- Body: Lato (clean, readable)

**Restaurant/Hospitality:**
- Heading: Cormorant Garamond (sophisticated)
- Body: Nunito (warm, inviting)

**Healthcare/Medical:**
- Heading: Poppins (modern, trustworthy)
- Body: IBM Plex Sans (accessible, clear)

**Technology/SaaS:**
- Heading: Geist (modern, technical)
- Body: Plus Jakarta Sans (clean, friendly)

**Retail/E-commerce:**
- Heading: Outfit (bold, trendy)
- Body: Work Sans (versatile, readable)

**Creative/Agency:**
- Heading: Sora (unique, artistic)
- Body: Plus Jakarta Sans (modern, flexible)

**Default/Fallback:**
- Heading: Bricolage Grotesque (distinctive, geometric)
- Body: Instrument Sans (balanced, professional)

### Typography Scale

```css
/* Base size: 16px (1rem) */
text-xs:    0.75rem (12px)
text-sm:    0.875rem (14px)
text-base:  1rem (16px)
text-lg:    1.125rem (18px)
text-xl:    1.25rem (20px)
text-2xl:   1.5rem (24px)
text-3xl:   1.875rem (30px)
text-4xl:   2.25rem (36px)
text-5xl:   3rem (48px)
text-6xl:   3.75rem (60px)
```

**Usage:**
- Body text: `text-base` or `text-lg`
- Headings: H1 = `text-5xl`, H2 = `text-4xl`, H3 = `text-3xl`
- Small text: `text-sm` or `text-xs`
- Hero headlines: `text-5xl lg:text-6xl`

### Font Loading Strategy

**Always include:**
```css
@import url('https://fonts.googleapis.com/css2?family=FontName:wght@400;600;700&display=swap');

/* Or use @theme directive (Tailwind v4) */
@theme {
  --font-heading: 'DM Sans', sans-serif;
  --font-body: 'Source Sans 3', sans-serif;
}
```

## Color System Requirements

### Anti-Pattern Rules

**BANNED COLOR PATTERNS:**
- Purple-to-pink gradients
- Blue-to-purple gradients
- Neon colors (#ff00ff, #00ffff, #ff0000)
- Oversaturated gradients

**Why:** These are associated with AI-generated "slop" aesthetics.

### Color Architecture

**Primary Colors:**
- Use industry-appropriate base colors
- Construction: earth tones, industrial blues, safety orange
- Healthcare: calming blues, medical greens
- Restaurant: warm reds, appetite yellows
- SaaS: tech blues, energetic greens

**Color Utilities:**
```css
/* Tailwind v4 @theme directive */
@theme {
  --color-primary-50: #f0f9ff;
  --color-primary-100: #e0f2fe;
  --color-primary-600: #0284c7;
  --color-primary-700: #0369a1;

  --color-secondary-600: #dc2626;
  --color-secondary-700: #b91c1c;

  --color-success: #16a34a;
  --color-warning: #f59e0b;
  --color-danger: #dc2626;
}
```

**Usage:**
- Backgrounds: `bg-primary-50`, `bg-gray-50`
- Text: `text-primary-700`, `text-gray-900`
- Borders: `border-primary-600`, `border-gray-300`

### Semantic Colors

| Purpose | Color | Tailwind Class |
|---------|-------|----------------|
| Success | Green | `text-success`, `bg-success-light` |
| Warning | Yellow/Orange | `text-warning`, `bg-warning-light` |
| Danger | Red | `text-danger`, `bg-danger-light` |
| Info | Blue | `text-info`, `bg-info-light` |
| Neutral | Gray | `text-gray-600`, `bg-gray-100` |

## Component Variants

### Button Styles

**Solid (Primary Action):**
```html
<button class="bg-primary-600 hover:bg-primary-700 text-white px-5 py-3 rounded-lg shadow-sm transition-colors">
  Primary Action
</button>
```

**Outline (Secondary Action):**
```html
<button class="border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-5 py-3 rounded-lg transition-colors">
  Secondary Action
</button>
```

**Ghost (Tertiary Action):**
```html
<button class="text-primary-600 hover:bg-primary-50 px-5 py-3 rounded-lg transition-colors">
  Tertiary Action
</button>
```

**Sizes:**
- `xs`: `px-2 py-1 text-xs`
- `sm`: `px-3 py-1.5 text-sm`
- `md`: `px-4 py-2.5 text-sm` (default)
- `lg`: `px-5 py-3 text-base`
- `xl`: `px-6 py-4 text-lg`

### Card Styles

**Default:**
```html
<div class="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all">
  <!-- Content -->
</div>
```

**Elevated:**
```html
<div class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
  <!-- Content -->
</div>
```

**Interactive:**
```html
<div class="bg-white border border-gray-200 rounded-xl p-6 cursor-pointer hover:shadow-lg hover:border-primary-300 hover:-translate-y-1 transition-all">
  <!-- Content -->
</div>
```

### Input Styles

**Default State:**
```html
<input
  type="text"
  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
  placeholder="Enter text..."
>
```

**Error State:**
```html
<input
  type="text"
  class="w-full px-4 py-2.5 border-2 border-danger rounded-lg focus:ring-2 focus:ring-danger/20 focus:border-danger bg-danger-light/10"
  placeholder="Enter text..."
>
```

**Success State:**
```html
<input
  type="text"
  class="w-full px-4 py-2.5 border-2 border-success rounded-lg focus:ring-2 focus:ring-success/20 focus:border-success bg-success-light/10"
  placeholder="Enter text..."
>
```

## Layout Anti-Patterns

### AVOID These Patterns

**1. Symmetric Card Grids Without Variation**
```html
<!-- BAD: All cards identical size, perfectly centered -->
<div class="grid grid-cols-3 gap-4">
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
</div>
```

**BETTER: Vary card sizes, add asymmetry**
```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
  <div class="card col-span-2">...</div>
  <div class="card">...</div>
  <div class="card">...</div>
  <div class="card col-span-2">...</div>
</div>
```

**2. Perfectly Centered Everything**
- Add intentional asymmetry
- Left-align text blocks for readability
- Use offset grids for visual interest

**3. Floating Elements Without Purpose**
- Every floating element should serve a purpose
- Avoid decorative blobs/shapes unless they enhance the design

**4. Excessive Rounded Corners**
- Mix rounded and sharp corners intentionally
- `rounded-lg` for cards, `rounded-full` for avatars
- Leave some elements sharp for contrast

### Layout Best Practices

**Visual Hierarchy:**
```html
<!-- Clear hierarchy with spacing -->
<section class="py-20 lg:py-28">
  <div class="max-w-5xl mx-auto px-4">
    <h2 class="text-4xl font-bold mb-4">Section Title</h2>
    <p class="text-lg text-gray-600 mb-12">Subtitle or description</p>

    <!-- Content with intentional spacing -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Items -->
    </div>
  </div>
</section>
```

**Container Widths:**
- Small content: `max-w-3xl` (768px)
- Medium content: `max-w-5xl` (1024px)
- Large content: `max-w-6xl` (1152px)
- Extra large: `max-w-7xl` (1280px)

## Content Anti-Patterns

### BANNED PHRASES

**Generic CTA Text:**
- ❌ "Learn more"
- ✅ "See how it works" | "Get your quote" | "Start your project"

**Generic Intros:**
- ❌ "Welcome to our website"
- ✅ "Your trusted partner for [service]" | "Serving [location] since [year]"

**Generic Links:**
- ❌ "Click here"
- ✅ Descriptive link text that explains where it goes

**Buzzwords to Avoid:**
- ❌ "State-of-the-art" | "Cutting-edge" | "Revolutionary" | "Game-changing" | "We are a leading"
- ✅ Specific, concrete benefits and real differentiators

### Content Best Practices

**Specificity Over Generics:**
```html
<!-- BAD -->
<p>We are a leading construction company with state-of-the-art equipment.</p>

<!-- GOOD -->
<p>Serving Austin since 1998 with 40+ commercial projects completed on time.</p>
```

**Actionable CTAs:**
```html
<!-- BAD -->
<button>Learn More</button>

<!-- GOOD -->
<button>Get Free Quote in 24 Hours</button>
```

## Accessibility Requirements

### WCAG AA Compliance

**Color Contrast:**
- Text on background: minimum 4.5:1 ratio
- Large text (18pt+): minimum 3:1 ratio
- Interactive elements: minimum 3:1 ratio

**Keyboard Navigation:**
```html
<!-- All interactive elements must be keyboard accessible -->
<button class="focus:ring-2 focus:ring-primary-500 focus:outline-none">
  Button
</button>
```

**Semantic HTML:**
```html
<!-- Use proper heading hierarchy -->
<h1>Page Title</h1>
<section>
  <h2>Section Title</h2>
  <h3>Subsection</h3>
</section>

<!-- Use semantic tags -->
<nav>...</nav>
<main>...</main>
<aside>...</aside>
<footer>...</footer>
```

**Alt Text:**
```html
<!-- All images must have descriptive alt text -->
<img src="team.jpg" alt="Construction team working on commercial building project">
```

**ARIA Labels:**
```html
<!-- When needed for screen readers -->
<button aria-label="Close dialog">×</button>
<nav aria-label="Main navigation">...</nav>
```

## Animation Guidelines

### CSS-Only Animations (Preferred)

**Fade In:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn 300ms ease-out;
}
```

**Slide Up:**
```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 400ms ease-out;
}
```

**Staggered Reveals:**
```html
<div class="card animate-slide-up" style="animation-delay: 0ms">Card 1</div>
<div class="card animate-slide-up" style="animation-delay: 100ms">Card 2</div>
<div class="card animate-slide-up" style="animation-delay: 200ms">Card 3</div>
```

### Animation Constraints

**Respect User Preferences:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Limits:**
- Animation duration: max 300ms
- No auto-playing videos with sound
- No parallax on mobile (performance)
- Limit animations to key elements only

### Banned Animation Patterns

- ❌ Excessive bounce effects
- ❌ Animations on every element
- ❌ Parallax on mobile
- ❌ Auto-playing videos with sound

## Integration with WordPress

### Block Pattern Structure

```html
<!-- wp:group {"className":"hero-section"} -->
<div class="wp-block-group hero-section">
  <div class="max-w-7xl mx-auto px-4 py-24 lg:py-32">
    <!-- Content -->
  </div>
</div>
<!-- /wp:group -->
```

### Theme JSON Integration

```json
{
  "version": 2,
  "settings": {
    "color": {
      "palette": [
        {
          "slug": "primary",
          "color": "#0284c7",
          "name": "Primary"
        }
      ]
    },
    "typography": {
      "fontFamilies": [
        {
          "fontFamily": "'DM Sans', sans-serif",
          "slug": "heading",
          "name": "Heading"
        }
      ]
    }
  }
}
```

## Validation Checklist

Before finalizing any design:

- [ ] No banned fonts used (Inter, Roboto, Arial, Helvetica, Open Sans, Montserrat)
- [ ] Industry-appropriate font pairing selected
- [ ] No purple-pink gradients or neon colors
- [ ] Layout has intentional asymmetry (not perfectly centered)
- [ ] Content avoids banned phrases ("Learn more", "Click here", etc.)
- [ ] Color contrast meets WCAG AA standards (4.5:1 minimum)
- [ ] All images have descriptive alt text
- [ ] Keyboard navigation works on all interactive elements
- [ ] Animations respect prefers-reduced-motion
- [ ] Design tokens follow component-category-role-state naming
- [ ] Spacing uses defined scale (xs, sm, md, lg, xl)

## Resources

**External Links:**
- Tailwind CSS Documentation: https://tailwindcss.com/docs
- Google Fonts: https://fonts.google.com
- Color Contrast Checker: https://webaim.org/resources/contrastchecker/

**Internal References:**
- Anti-patterns JSON: `tokens/anti-patterns.json`
- Variants system: `tokens/variants.json`
- Pattern library: `templates/shared/patterns/`
