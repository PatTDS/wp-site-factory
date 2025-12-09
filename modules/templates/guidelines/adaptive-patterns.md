# Adaptive Design Patterns

**Version:** 1.0.0
**Purpose:** How templates handle variable content gracefully

---

## Overview

Templates must adapt to variable content without breaking. This document defines patterns for handling:

- Variable item counts (3 services vs 9 services)
- Variable text lengths (short vs long headlines)
- Optional elements (may or may not exist)
- Responsive layouts (mobile to desktop)

---

## Item Count Adaptation

### Grid Auto-Fit Pattern

The primary pattern for variable item counts:

```css
.adaptive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--min-width), 1fr));
  gap: var(--gap);
}
```

**How it works:**
- Items fill available space
- When items don't fit, they wrap to next row
- Automatically adjusts columns based on container width

### Services Section

| Item Count | Mobile | Tablet | Desktop | Notes |
|------------|--------|--------|---------|-------|
| 3 | 1 col | 2 col | 3 col | Perfect grid |
| 4 | 1 col | 2 col | 2 col | Even grid |
| 5 | 1 col | 2 col | 3 col | One item wraps |
| 6 | 1 col | 2 col | 3 col | Perfect grid |
| 7-9 | 1 col | 2 col | 3 col | Consider show-more |
| 10+ | 1 col | 2 col | 3 col | Paginate or show-more |

**Implementation:**

```css
.services-grid {
  --min-width: 300px;
  --gap: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--min-width), 1fr));
  gap: var(--gap);
}

/* Force specific columns at breakpoints */
@media (min-width: 768px) {
  .services-grid--force-2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .services-grid--force-3 {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Handlebars logic for show-more:**

```handlebars
<div class="services-grid">
  {{#each (take services 6)}}
    {{> service-card this}}
  {{/each}}
</div>

{{#if (gt services.length 6)}}
  <div class="services-hidden" data-remaining="{{subtract services.length 6}}">
    {{#each (skip services 6)}}
      {{> service-card this}}
    {{/each}}
  </div>
  <button class="btn btn--secondary show-more-btn" data-target=".services-hidden">
    Show {{subtract services.length 6}} More Services
  </button>
{{/if}}
```

### Testimonials Section

| Item Count | Layout | Notes |
|------------|--------|-------|
| 1 | Full width | Centered, large quote |
| 2 | 2 columns | Side by side |
| 3 | 3 columns | Standard grid |
| 4 | 2x2 grid | Two rows |

**CSS Implementation:**

```css
.testimonials-grid {
  display: grid;
  gap: var(--spacing-6);
}

/* 1 item: full width */
.testimonials-grid--1 {
  grid-template-columns: 1fr;
  max-width: 800px;
  margin: 0 auto;
}

/* 2 items: 2 columns on tablet+ */
.testimonials-grid--2 {
  grid-template-columns: 1fr;
}

@media (min-width: 768px) {
  .testimonials-grid--2 {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 3+ items: responsive grid */
.testimonials-grid--3,
.testimonials-grid--4 {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}
```

**Handlebars:**

```handlebars
<div class="testimonials-grid testimonials-grid--{{testimonials.length}}">
  {{#each testimonials}}
    {{> testimonial-card this}}
  {{/each}}
</div>
```

### Stats Section

| Item Count | Layout | Notes |
|------------|--------|-------|
| 4 | 4 columns | Standard |
| 5 | 5 columns | Slightly narrower |
| 6 | 6 columns or 3x2 | Depends on screen |

**CSS Implementation:**

```css
.stats-grid {
  display: grid;
  gap: var(--spacing-6);
  text-align: center;
}

/* Mobile: 2 columns always */
.stats-grid {
  grid-template-columns: repeat(2, 1fr);
}

/* Tablet: adaptive */
@media (min-width: 768px) {
  .stats-grid--4 { grid-template-columns: repeat(4, 1fr); }
  .stats-grid--5 { grid-template-columns: repeat(5, 1fr); }
  .stats-grid--6 { grid-template-columns: repeat(3, 1fr); }
}

/* Desktop: all in one row if possible */
@media (min-width: 1024px) {
  .stats-grid--6 { grid-template-columns: repeat(6, 1fr); }
}
```

---

## Text Length Adaptation

### Headline Scaling

**Problem:** Headlines can be 20 characters or 100 characters.

**Solution:** Fluid typography with clamp()

```css
.hero-headline {
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 1.1;
  word-wrap: break-word;
  hyphens: auto;
}

.section-headline {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  line-height: 1.2;
}

.card-title {
  font-size: clamp(1.125rem, 2vw, 1.25rem);
  line-height: 1.3;
}
```

### Text Truncation

**When to truncate:**
- Card descriptions (prevent varying heights)
- Service descriptions (keep grid uniform)
- Testimonial quotes (if very long)

**CSS Line Clamp:**

```css
/* 2 lines */
.truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 3 lines */
.truncate-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 4 lines */
.truncate-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

**Application:**

```css
.service-card .description {
  /* Always 3 lines max */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: calc(1.6em * 3); /* Reserve space */
}

.testimonial-quote {
  /* 4 lines, with expand option */
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.testimonial-quote.is-expanded {
  -webkit-line-clamp: unset;
}
```

### Character Limits

| Field | Soft Limit | Hard Limit | Strategy |
|-------|------------|------------|----------|
| Hero headline | 60 | 80 | Scale font |
| Hero subheadline | 150 | 200 | Wrap |
| Section headline | 50 | 70 | Scale font |
| Service name | 30 | 40 | Truncate |
| Service description | 120 | 150 | Line clamp 3 |
| Testimonial quote | 250 | 300 | Line clamp 4 |
| Stat label | 20 | 25 | Truncate |
| Button text | 20 | 25 | Truncate |

---

## Optional Element Handling

### Conditional Rendering Pattern

Use Handlebars conditionals for all optional elements:

```handlebars
{{!-- Optional tagline --}}
{{#if tagline}}
  <p class="tagline">{{tagline}}</p>
{{/if}}

{{!-- Optional secondary CTA --}}
{{#if cta_secondary_text}}
  <a href="{{cta_secondary_url}}" class="btn btn--secondary">
    {{cta_secondary_text}}
  </a>
{{/if}}

{{!-- Optional section --}}
{{#if stats.length}}
  <section class="stats-section">
    {{!-- stats content --}}
  </section>
{{/if}}
```

### Layout Adjustment for Missing Elements

When optional elements are missing, layout should adjust:

**Hero without tagline:**

```css
/* With tagline */
.hero-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

/* Tagline adds top element */
.hero-tagline {
  order: -1;
  margin-bottom: var(--spacing-2);
}

/* Without tagline, headline is first - no adjustment needed */
```

**CTA section with one button vs two:**

```css
.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

/* Single button: centered on mobile */
.hero-cta:has(:only-child) {
  justify-content: center;
}

@media (min-width: 768px) {
  .hero-cta:has(:only-child) {
    justify-content: flex-start;
  }
}
```

### Default Values Pattern

For required visual elements, provide sensible defaults:

```handlebars
{{!-- Default CTA text if not provided --}}
<a href="{{default cta_url '#contact'}}" class="btn btn--primary">
  {{default cta_text 'Get in Touch'}}
</a>

{{!-- Default image alt text --}}
<img src="{{image_url}}" alt="{{default image_alt company_name}}" />
```

---

## Responsive Adaptation

### Breakpoint System

```css
/* Mobile first */
/* Default styles = mobile */

/* Tablet */
@media (min-width: 768px) { }

/* Desktop */
@media (min-width: 1024px) { }

/* Large desktop */
@media (min-width: 1280px) { }

/* Extra large */
@media (min-width: 1536px) { }
```

### Section Layout Patterns

**Split Layout (Hero, About):**

```css
.split-layout {
  display: grid;
  gap: var(--spacing-8);
}

/* Mobile: stacked */
.split-layout {
  grid-template-columns: 1fr;
}

/* Tablet: still stacked but tighter */
@media (min-width: 768px) {
  .split-layout {
    gap: var(--spacing-10);
  }
}

/* Desktop: side by side */
@media (min-width: 1024px) {
  .split-layout {
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-12);
    align-items: center;
  }
}
```

**Reverse on desktop:**

```css
/* Image on right (default) */
.split-layout--image-right .image-side {
  order: 2;
}

/* Image on left */
.split-layout--image-left .image-side {
  order: 1;
}

/* Mobile: always content first, image second */
@media (max-width: 1023px) {
  .split-layout .image-side {
    order: 2 !important;
  }
}
```

### Navigation Responsive Pattern

```css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Desktop nav links */
.nav-links {
  display: none;
}

@media (min-width: 1024px) {
  .nav-links {
    display: flex;
    gap: var(--spacing-6);
  }

  .nav-toggle {
    display: none;
  }
}

/* Mobile nav toggle */
.nav-toggle {
  display: flex;
  padding: var(--spacing-2);
}
```

---

## Image Adaptation

### Responsive Images with srcset

```handlebars
<img src="{{image.medium}}"
     srcset="{{image.small}} 400w,
             {{image.medium}} 800w,
             {{image.large}} 1200w,
             {{image.full}} 1920w"
     sizes="(max-width: 768px) 100vw,
            (max-width: 1024px) 50vw,
            600px"
     alt="{{image.alt}}"
     loading="{{#if is_hero}}eager{{else}}lazy{{/if}}"
     decoding="async" />
```

### Aspect Ratio Preservation

```css
/* Container maintains aspect ratio */
.image-container {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.image-container img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Different ratios */
.image-container--square { aspect-ratio: 1 / 1; }
.image-container--portrait { aspect-ratio: 3 / 4; }
.image-container--wide { aspect-ratio: 21 / 9; }
```

### Background Image Fallback

```css
.hero-bg {
  background-color: var(--color-primary); /* Fallback color */
  background-image: url('{{background_image}}');
  background-size: cover;
  background-position: center;
}

/* With overlay */
.hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    rgba(0,0,0,0.7) 0%,
    rgba(0,0,0,0.3) 100%
  );
}
```

---

## Testing Adaptive Behavior

### Test Cases to Cover

For each section, test with:

1. **Minimum content**
   - Shortest possible text
   - Minimum required items
   - No optional elements

2. **Typical content**
   - Average length text
   - Common item count
   - Some optional elements

3. **Maximum content**
   - Longest allowed text
   - Maximum item count
   - All optional elements

4. **Edge cases**
   - Single word headlines
   - Very long single words
   - Exactly at character limits
   - One item vs many items

### Test Data Structure

```json
{
  "services_test": {
    "min": {
      "services": [
        { "name": "Service", "description": "Brief." }
      ]
    },
    "typical": {
      "services": [
        { "name": "Service One", "description": "A medium length description for testing." },
        { "name": "Service Two", "description": "Another medium length description here." },
        { "name": "Service Three", "description": "Third service with typical content." }
      ]
    },
    "max": {
      "services": [
        /* 12 services with max length content */
      ]
    }
  }
}
```

---

## Quick Reference

### CSS Patterns

| Pattern | Use Case |
|---------|----------|
| `grid-template-columns: repeat(auto-fit, minmax(Xpx, 1fr))` | Variable item grids |
| `clamp(min, preferred, max)` | Fluid typography |
| `-webkit-line-clamp: N` | Text truncation |
| `aspect-ratio: W / H` | Image containers |
| `{{#if field}}` | Optional elements |

### Handlebars Helpers

| Helper | Purpose |
|--------|---------|
| `{{#if}}` | Conditional render |
| `{{#each}}` | Loop items |
| `{{default value fallback}}` | Default value |
| `{{truncate text limit}}` | Truncate text |
| `{{gt a b}}` | Greater than check |
| `{{take array n}}` | First N items |
| `{{skip array n}}` | Skip first N items |

---

**Remember:** Adaptive design is about graceful handling of variable content. Test thoroughly with min, typical, and max content.
