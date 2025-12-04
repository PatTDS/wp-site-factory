# V1 Golden Template Design Specification

**Source:** `projects/anywhere-solutions/` (port 8082)
**Status:** Production benchmark - "by far the best one"
**Created:** 2025-12-03

This document captures the design decisions that make v1 visually superior to auto-generated alternatives. Use this as a reference for future site generation.

---

## Table of Contents

1. [Color System](#color-system)
2. [Typography](#typography)
3. [Spacing System](#spacing-system)
4. [Section Architecture](#section-architecture)
5. [Animation System](#animation-system)
6. [Visual Effects](#visual-effects)
7. [Component Patterns](#component-patterns)
8. [Responsive Breakpoints](#responsive-breakpoints)

---

## Color System

### Primary Palette (Industrial Navy)

Professional, trustworthy feel for B2B services.

```javascript
primary: {
  50:  '#f0f4ff',   // Backgrounds, subtle tints
  100: '#e0e9ff',   // Section backgrounds
  200: '#c7d6fe',   // Borders, dividers
  300: '#a4b8fc',   // Disabled states
  400: '#8093f8',   // Hover states
  500: '#5a67d8',   // Interactive elements
  600: '#4c51bf',   // Buttons, links
  700: '#1e3a5f',   // DEFAULT - Main brand color
  800: '#1a365d',   // Dark sections
  900: '#0f172a',   // Hero backgrounds
  950: '#0a0f1a',   // Darkest (footer)
}
```

### Secondary Palette (High-Vis Orange)

Energy, action, visibility - industrial context.

```javascript
secondary: {
  50:  '#fff7ed',   // Light backgrounds
  100: '#ffedd5',   // Badges, tags
  200: '#fed7aa',   // Borders
  300: '#fdba74',   // Gradient midpoints
  400: '#fb923c',   // Highlights, accents
  500: '#f97316',   // DEFAULT - CTAs, action buttons
  600: '#ea580c',   // Hover states
  700: '#c2410c',   // Dark orange
  800: '#9a3412',   // Shadows
  900: '#7c2d12',   // Dark shadows
}
```

### Accent Palette (Safety Green)

Trust, safety compliance, certification.

```javascript
accent: {
  50:  '#ecfdf5',   // Light backgrounds
  100: '#d1fae5',   // Success backgrounds
  200: '#a7f3d0',   // Borders
  300: '#6ee7b7',   // Light accents
  400: '#34d399',   // Interactive
  500: '#10b981',   // DEFAULT - Safety indicators
  600: '#059669',   // Hover
  700: '#047857',   // Dark green
}
```

### Color Usage Rules

| Context | Color |
|---------|-------|
| Hero background | `from-primary-900 via-primary-800 to-primary-700` |
| Primary buttons | `from-secondary-500 to-secondary-600` |
| Ghost buttons | `bg-white/10 border-white/30` |
| Section backgrounds | Alternating: `white` → `gray-50` → `white` |
| Text on dark | `text-white`, `text-primary-100/90` |
| Text on light | `text-gray-900`, `text-gray-600` |
| Accent elements | `text-secondary-400` (on dark), `text-secondary-500` (on light) |

---

## Typography

### Font Stack

```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
  heading: ['Poppins', 'system-ui', 'sans-serif'],
}
```

### Type Scale

| Element | Desktop | Mobile | Classes |
|---------|---------|--------|---------|
| Hero H1 | 7xl (72px) | 4xl (36px) | `text-4xl md:text-5xl lg:text-6xl xl:text-7xl` |
| Section H2 | 5xl (48px) | 3xl (30px) | `text-3xl md:text-4xl lg:text-5xl` |
| Card H3 | xl (20px) | xl (20px) | `text-xl font-bold` |
| Body | lg (18px) | base (16px) | `text-lg md:text-xl` |
| Small | sm (14px) | sm (14px) | `text-sm` |

### Line Heights

- Headings: `leading-[1.1]` or `leading-tight`
- Body: `leading-relaxed`
- Stats: No line height override (default)

### Font Weights

- Headings: `font-bold` (700)
- Subheadings: `font-semibold` (600)
- Body: `font-medium` (500) or default (400)
- Stats numbers: `font-bold` (700)

---

## Spacing System

### Section Padding

| Section Type | Desktop | Mobile |
|--------------|---------|--------|
| Hero | `py-20 md:py-28 lg:py-32` | 80px → 128px |
| Standard | `py-20 lg:py-28` | 80px → 112px |
| Stats | `py-16` | 64px |
| CTA | `py-20` | 80px |

### Container Width

```javascript
max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
// 1280px max, with responsive padding
```

### Grid Gaps

| Context | Gap |
|---------|-----|
| Hero grid | `gap-12 lg:gap-16` |
| Card grid | `gap-8` |
| Stats grid | `gap-6 md:gap-8` |
| Industry icons | `gap-6` |
| Feature list | `space-y-6` |

### Internal Spacing

| Element | Margin/Padding |
|---------|----------------|
| Section header to content | `mb-16` |
| Badge to heading | `mb-6` |
| Heading to description | `mb-6` |
| Description to CTA | `pt-4` |
| Card padding | `p-8` |
| Card image height | `h-48` |
| Icon containers | `w-14 h-14` (large), `w-10 h-10` (small) |

---

## Section Architecture

### 1. Hero Section

**Height:** `min-h-[90vh]`

**Structure:**
```
<section> (gradient bg)
  ├── Background Elements
  │   ├── Gradient Orbs (3x, blur-3xl, animate-pulse-slow)
  │   ├── Pattern overlay (bg-hero-pattern, opacity-30)
  │   └── Grid lines (50px grid, opacity-5)
  │
  ├── Content (grid lg:grid-cols-2)
  │   ├── Left Column
  │   │   ├── Badge (bg-white/10, backdrop-blur)
  │   │   ├── H1 (with gradient text spans)
  │   │   ├── Description
  │   │   ├── CTA Buttons (gradient + ghost)
  │   │   └── Trust badges (3 icons)
  │   │
  │   └── Right Column (visual element)
  │       ├── Floating stat cards (animate-float)
  │       └── Service icon grid (2x2)
  │
  └── Wave divider (SVG, white fill)
```

**Key Patterns:**
- Gradient text: `text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 via-secondary-300 to-secondary-400`
- Glassmorphism: `bg-white/10 backdrop-blur-sm border border-white/20`
- Float animation: `animate-float` with `animation-delay: 2s` for variation

### 2. Stats Section

**Structure:**
```
<section> (py-16, bg-white, -mt-1)
  └── Grid (grid-cols-2 lg:grid-cols-4)
      └── Stat Card (each)
          ├── Number (gradient text, text-4xl md:text-5xl)
          ├── Label (text-gray-600, mt-2)
          └── Hover indicator (w-12 h-1, opacity on hover)
```

**Stat Card Pattern:**
```html
<div class="group text-center p-6 rounded-2xl
            bg-gradient-to-br from-{color}-50 to-white
            border border-{color}-100
            hover:shadow-lg hover:-translate-y-1
            transition-all duration-300">
```

**Color rotation:** primary → secondary → accent → primary

### 3. Services Section

**Structure:**
```
<section> (py-20 lg:py-28, gradient bg)
  ├── Background blobs (blur-3xl, positioned corners)
  ├── Section header (badge + h2 + description)
  └── Grid (md:grid-cols-2 lg:grid-cols-3)
      └── Service Card (each)
          ├── Image area (h-48, gradient bg, centered icon)
          ├── Content area (p-8)
          │   ├── H3
          │   ├── Description
          │   ├── Feature list (checkmark icons)
          │   └── Learn More link (with arrow)
```

**Service Card Colors:**
- Labour Hire: `from-primary-600 to-primary-800`
- Industrial Supplies: `from-secondary-500 to-secondary-700`
- Safety Equipment: `from-green-600 to-green-800`

### 4. Industries Section

**Structure:**
```
<section> (py-20, bg-white)
  ├── Section header
  └── Grid (grid-cols-2 md:grid-cols-3 lg:grid-cols-6)
      └── Industry Card (each)
          ├── Icon circle (w-16 h-16, colored bg)
          └── Label (font-semibold)
```

**Hover effect:** `hover:bg-primary-50 hover:shadow-lg transition-all`

### 5. Why Choose Us Section

**Structure:**
```
<section> (py-20, bg-gray-50)
  └── Grid (lg:grid-cols-2, gap-16)
      ├── Left Column (content)
      │   ├── Badge
      │   ├── H2
      │   ├── Description
      │   └── Feature list (space-y-6)
      │       └── Feature (each)
      │           ├── Icon box (w-12 h-12, colored bg)
      │           └── Text (h3 + p)
      │
      └── Right Column (image)
          ├── Background shape (-inset-4, -rotate-3)
          └── Image (rounded-2xl, shadow-xl)
```

### 6. CTA Section

**Structure:**
```
<section> (py-20, gradient from-primary-800 to-primary-900)
  └── Content (text-center)
      ├── H2
      ├── Description
      └── Button group (phone + quote)
```

---

## Animation System

### Keyframes

```javascript
keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideUp: {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  slideInRight: {
    '0%': { opacity: '0', transform: 'translateX(20px)' },
    '100%': { opacity: '1', transform: 'translateX(0)' },
  },
  float: {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' },
  },
}
```

### Animation Classes

| Animation | Duration | Timing | Use Case |
|-----------|----------|--------|----------|
| `animate-fade-in` | 0.5s | ease-out | Page load content |
| `animate-slide-up` | 0.5s | ease-out | Scroll reveal |
| `animate-slide-in-right` | 0.5s | ease-out | Visual elements |
| `animate-pulse-slow` | 3s | cubic-bezier | Background orbs |
| `animate-float` | 6s | ease-in-out | Floating cards |

### Animation Delays

Use inline styles for staggered animations:
```html
style="animation-delay: 1s;"
style="animation-delay: 2s;"
```

---

## Visual Effects

### Glassmorphism

```css
/* Card on dark background */
bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl

/* Stronger blur */
bg-white/10 backdrop-blur-md border border-white/20
```

### Gradient Backgrounds

```css
/* Hero */
bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700

/* CTA */
bg-gradient-to-r from-primary-800 to-primary-900

/* Section subtle */
bg-gradient-to-b from-gray-50 to-white
```

### Background Orbs

```html
<div class="absolute top-20 left-10 w-72 h-72 bg-secondary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
```

Key properties:
- Size: `w-72 h-72` to `w-96 h-96`
- Opacity: `/20` suffix (20%)
- Blur: `blur-3xl`
- Animation: `animate-pulse-slow`

### Shadows

```javascript
boxShadow: {
  'glow': '0 0 20px rgba(249, 115, 22, 0.3)',      // Orange glow
  'glow-lg': '0 0 40px rgba(249, 115, 22, 0.4)',   // Larger glow
}
```

Standard shadows: `shadow-lg`, `shadow-xl`, `shadow-2xl`

### Wave Divider

```html
<div class="absolute bottom-0 left-0 right-0">
  <svg class="w-full h-20 md:h-32" viewBox="0 0 1440 120" fill="none" preserveAspectRatio="none">
    <path d="M0,60 C320,120 480,0 720,60 C960,120 1120,0 1440,60 L1440,120 L0,120 Z" fill="white"/>
  </svg>
</div>
```

---

## Component Patterns

### Badges

```html
<!-- On dark background -->
<div class="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
  <span class="w-2 h-2 bg-secondary-400 rounded-full animate-pulse"></span>
  <span class="text-sm font-medium text-white/90">Badge Text</span>
</div>

<!-- On light background -->
<span class="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold">
  <svg>...</svg>
  Badge Text
</span>
```

### Buttons

```html
<!-- Primary CTA -->
<a class="group inline-flex items-center justify-center px-8 py-4
          bg-gradient-to-r from-secondary-500 to-secondary-600
          hover:from-secondary-600 hover:to-secondary-700
          text-white font-semibold rounded-xl
          transition-all duration-300
          shadow-lg shadow-secondary-500/25
          hover:shadow-xl hover:shadow-secondary-500/30
          hover:-translate-y-0.5">
  Button Text
  <svg class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform">...</svg>
</a>

<!-- Ghost Button -->
<a class="group inline-flex items-center justify-center px-8 py-4
          bg-white/10 backdrop-blur-sm
          border border-white/30 hover:bg-white/20 hover:border-white/50
          text-white font-semibold rounded-xl
          transition-all duration-300">
```

### Cards

```html
<!-- Service Card -->
<div class="group bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
  <div class="h-48 bg-gradient-to-br from-{color}-600 to-{color}-800 flex items-center justify-center">
    <svg class="w-20 h-20 text-white/90">...</svg>
  </div>
  <div class="p-8">
    <h3 class="text-xl font-bold text-gray-900 mb-3">Title</h3>
    <p class="text-gray-600 mb-4">Description</p>
    <ul class="space-y-2 mb-6">...</ul>
    <a class="inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 group-hover:translate-x-2 transition-transform">
      Learn More
      <svg>...</svg>
    </a>
  </div>
</div>
```

### Feature List Items

```html
<div class="flex items-start gap-4">
  <div class="flex-shrink-0 w-12 h-12 bg-{color}-100 rounded-xl flex items-center justify-center">
    <svg class="w-6 h-6 text-{color}-600">...</svg>
  </div>
  <div>
    <h3 class="text-lg font-semibold text-gray-900 mb-1">Feature Title</h3>
    <p class="text-gray-600">Feature description.</p>
  </div>
</div>
```

---

## Responsive Breakpoints

### Tailwind Defaults Used

```javascript
screens: {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Large desktop
}
```

### Key Responsive Patterns

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Hero grid | 1 col | 1 col | 2 cols |
| Stats grid | 2 cols | 2 cols | 4 cols |
| Service cards | 1 col | 2 cols | 3 cols |
| Industry icons | 2 cols | 3 cols | 6 cols |
| Why Choose Us | 1 col | 1 col | 2 cols |

### Mobile-First Patterns

```html
<!-- Typography -->
text-4xl md:text-5xl lg:text-6xl xl:text-7xl

<!-- Padding -->
px-4 sm:px-6 lg:px-8
py-20 md:py-28 lg:py-32

<!-- Grid -->
grid-cols-2 md:grid-cols-3 lg:grid-cols-6

<!-- Hide/Show -->
hidden lg:block
flex md:hidden
```

---

## Design Principles Summary

### What Makes V1 Superior

1. **Layered Depth** - Multiple background elements (orbs, patterns, grids) create visual richness
2. **Consistent Rhythm** - Section padding follows predictable pattern (py-16, py-20, py-28)
3. **Color Harmony** - Primary/secondary/accent used consistently with clear purpose
4. **Micro-interactions** - Hover states include translate, shadow changes, and color shifts
5. **Glassmorphism** - Backdrop blur + transparency creates modern, premium feel
6. **Staggered Animations** - Animation delays create choreographed reveal
7. **Visual Balance** - Two-column layouts use asymmetric content weights

### Design Tokens to Extract

For future automation, these values should become configurable:

```yaml
tokens:
  colors:
    primary: '#1e3a5f'
    secondary: '#f97316'
    accent: '#10b981'
  spacing:
    section_sm: '4rem'    # py-16
    section_md: '5rem'    # py-20
    section_lg: '7rem'    # py-28
  animation:
    duration_fast: '0.2s'
    duration_normal: '0.3s'
    duration_slow: '0.5s'
    float_duration: '6s'
  effects:
    blur_strength: '3xl'
    glass_opacity: '10%'
    shadow_color_opacity: '25%'
```

---

## Usage Instructions

### For New Projects (Clone Workflow)

1. Copy `projects/anywhere-solutions/` as starting point
2. Update `tailwind.config.js` colors for new brand
3. Replace content in `front-page.php`
4. Rebuild CSS: `npm run build`

### For LLM Polish Prompts

When asking an LLM to refine a rough layout, reference specific patterns from this spec:

> "Apply the hero section pattern from V1-DESIGN-SPEC.md: use gradient background from-primary-900 via-primary-800 to-primary-700, add background orbs with blur-3xl and animate-pulse-slow, include wave divider at bottom..."

---

*This specification is the authoritative reference for v1's design decisions.*
*Last updated: 2025-12-03*
