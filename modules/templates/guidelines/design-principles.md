# Design Principles

**Version:** 1.0.0
**Purpose:** Visual design guidelines for template creation

---

## Core Design Philosophy

1. **Professional First** - Clean, trustworthy, business-appropriate
2. **Content-Focused** - Design serves content, not the other way around
3. **Consistent** - Unified visual language across all sections
4. **Accessible** - Inclusive design for all users
5. **Performant** - Lightweight, fast-loading

---

## Typography System

### Font Stack

**Primary (Headings):** Inter
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

**Secondary (Body):** Inter
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale (1.25 ratio)

| Name | Size | Line Height | Usage |
|------|------|-------------|-------|
| display | 4rem (64px) | 1.1 | Hero headlines |
| h1 | 3rem (48px) | 1.2 | Page titles |
| h2 | 2.25rem (36px) | 1.25 | Section headlines |
| h3 | 1.5rem (24px) | 1.3 | Card titles |
| h4 | 1.25rem (20px) | 1.4 | Subheadings |
| body | 1rem (16px) | 1.6 | Body text |
| small | 0.875rem (14px) | 1.5 | Captions, labels |
| xs | 0.75rem (12px) | 1.4 | Fine print |

### Responsive Typography

Use `clamp()` for fluid scaling:

```css
.hero-headline {
  font-size: clamp(2rem, 5vw, 4rem);
}

.section-headline {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
}
```

### Font Weights

| Weight | Usage |
|--------|-------|
| 400 | Body text |
| 500 | Emphasized body, labels |
| 600 | Subheadings, buttons |
| 700 | Headlines |

---

## Color System

### Base Palette Structure

```css
:root {
  /* Primary - Brand main color */
  --color-primary: #0F2942;
  --color-primary-light: #1a3a5c;
  --color-primary-dark: #0a1d2e;

  /* Secondary - Brand accent */
  --color-secondary: #4DA6FF;
  --color-secondary-light: #7dbfff;
  --color-secondary-dark: #2d8de6;

  /* Neutrals */
  --color-white: #ffffff;
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;
  --color-black: #000000;

  /* Semantic */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
}
```

### Color Usage Guidelines

| Element | Color |
|---------|-------|
| Headlines | `--color-primary` or `--color-gray-900` |
| Body text | `--color-gray-700` |
| Muted text | `--color-gray-500` |
| Primary buttons | `--color-primary` bg, white text |
| Secondary buttons | transparent bg, `--color-primary` border/text |
| Links | `--color-secondary` |
| Backgrounds | `--color-white` or `--color-gray-50` |
| Cards | `--color-white` with shadow |
| Dividers | `--color-gray-200` |

### Contrast Requirements

- Text on background: 4.5:1 minimum
- Large text (>18px bold): 3:1 minimum
- UI components: 3:1 minimum

---

## Spacing System

### Base Unit: 4px (0.25rem)

| Token | Value | Usage |
|-------|-------|-------|
| --spacing-0 | 0 | Reset |
| --spacing-1 | 0.25rem (4px) | Tight inline spacing |
| --spacing-2 | 0.5rem (8px) | Small gaps |
| --spacing-3 | 0.75rem (12px) | Icon gaps |
| --spacing-4 | 1rem (16px) | Standard spacing |
| --spacing-5 | 1.25rem (20px) | Medium spacing |
| --spacing-6 | 1.5rem (24px) | Card padding |
| --spacing-8 | 2rem (32px) | Section padding (mobile) |
| --spacing-10 | 2.5rem (40px) | Large gaps |
| --spacing-12 | 3rem (48px) | Section padding (tablet) |
| --spacing-16 | 4rem (64px) | Section padding (desktop) |
| --spacing-20 | 5rem (80px) | Large section padding |
| --spacing-24 | 6rem (96px) | Hero padding |

### Section Spacing

```css
section {
  padding: var(--spacing-12) 0; /* 3rem mobile */
}

@media (min-width: 768px) {
  section {
    padding: var(--spacing-16) 0; /* 4rem tablet */
  }
}

@media (min-width: 1024px) {
  section {
    padding: var(--spacing-20) 0; /* 5rem desktop */
  }
}
```

### Container Widths

```css
.container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

@media (min-width: 640px) {
  .container { padding: 0 var(--spacing-6); }
}

@media (min-width: 1024px) {
  .container { padding: 0 var(--spacing-8); }
}
```

---

## Layout Patterns

### Grid System

Use CSS Grid with auto-fit for adaptive layouts:

```css
/* 2-column default */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-6);
}

/* 3-column default */
.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-6);
}

/* 4-column default */
.grid-4 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-6);
}
```

### Split Layouts

For hero and about sections:

```css
.split-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-8);
}

@media (min-width: 1024px) {
  .split-layout {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-12);
    align-items: center;
  }
}
```

---

## Component Patterns

### Buttons

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3) var(--spacing-6);
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: var(--radius-md);
  transition: all var(--transition-base);
  cursor: pointer;
}

.btn--primary {
  background: var(--color-primary);
  color: white;
  border: 2px solid var(--color-primary);
}

.btn--primary:hover {
  background: var(--color-primary-dark);
  border-color: var(--color-primary-dark);
}

.btn--secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn--secondary:hover {
  background: var(--color-primary);
  color: white;
}

.btn--large {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: 1.125rem;
}
```

### Cards

```css
.card {
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  transition: all var(--transition-base);
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.card-body {
  padding: var(--spacing-6);
}

.card-image {
  aspect-ratio: 16 / 9;
  object-fit: cover;
  width: 100%;
}
```

### Section Headers

```css
.section-header {
  text-align: center;
  max-width: 700px;
  margin: 0 auto var(--spacing-12);
}

.section-tagline {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-secondary);
  margin-bottom: var(--spacing-2);
}

.section-headline {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  color: var(--color-primary);
  margin-bottom: var(--spacing-4);
}

.section-description {
  font-size: 1.125rem;
  color: var(--color-gray-600);
  line-height: 1.7;
}
```

---

## Image Guidelines

### Aspect Ratios

| Usage | Ratio | Example |
|-------|-------|---------|
| Hero | 16:9 | 1920x1080 |
| Card | 16:9 | 640x360 |
| About | 3:4 | 600x800 |
| Thumbnail | 1:1 | 400x400 |
| Team | 1:1 | 400x400 |

### Image Treatment

```css
/* Standard image */
.img-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Rounded corners */
.img-rounded {
  border-radius: var(--radius-lg);
}

/* With overlay */
.img-overlay {
  position: relative;
}

.img-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.7));
}
```

---

## Animation Guidelines

### Timing

| Duration | Usage |
|----------|-------|
| 150ms | Micro-interactions (buttons, icons) |
| 300ms | Standard transitions |
| 500ms | Page transitions, reveals |
| 1000ms | Hero animations |

### Easing

```css
--ease-out: cubic-bezier(0.33, 1, 0.68, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Standard Animations

```css
/* Fade in up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s var(--ease-out) forwards;
}

/* Scale in */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Counter */
@keyframes countUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Reduced Motion

Always respect user preference:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Shadows & Elevation

### Shadow Scale

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

### Elevation Usage

| Level | Shadow | Usage |
|-------|--------|-------|
| 0 | none | Base elements |
| 1 | sm | Subtle depth |
| 2 | md | Cards, dropdowns |
| 3 | lg | Modals, popovers |
| 4 | xl | Hover states |
| 5 | 2xl | Hero images |

---

## Border Radius

```css
--radius-none: 0;
--radius-sm: 0.25rem;    /* 4px */
--radius-md: 0.5rem;     /* 8px */
--radius-lg: 0.75rem;    /* 12px */
--radius-xl: 1rem;       /* 16px */
--radius-2xl: 1.5rem;    /* 24px */
--radius-full: 9999px;   /* Pill/circle */
```

### Usage

| Element | Radius |
|---------|--------|
| Buttons | md |
| Cards | lg or xl |
| Input fields | md |
| Badges | full |
| Images | lg or xl |
| Avatars | full |

---

## Industry-Specific Considerations

### Construction Industry

- **Colors:** Dark blues, grays, safety orange accents
- **Imagery:** Industrial, equipment, workers with PPE
- **Tone:** Professional, trustworthy, safety-focused
- **Typography:** Bold, strong headlines

### Healthcare Industry

- **Colors:** Blues, greens, white
- **Imagery:** Clean, clinical, caring
- **Tone:** Compassionate, professional, trustworthy
- **Typography:** Clean, readable

### SaaS / Technology

- **Colors:** Modern blues, purples, gradients
- **Imagery:** Abstract, digital, clean
- **Tone:** Innovative, efficient, modern
- **Typography:** Modern, clean

---

**Remember:** These are guidelines, not strict rules. Adapt based on brand requirements while maintaining consistency.
