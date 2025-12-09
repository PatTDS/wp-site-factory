# Shared Pattern Library

Complete, production-ready header and footer patterns for WPF Phase 2 Orchestrator.

## Overview

This library provides comprehensive, mobile-responsive, accessible header and footer patterns that integrate seamlessly with the Phase 2 orchestrator's blueprint system.

## What's Inside

### Header Patterns (2 variants)

#### 1. Header Centered
**Location:** `header/header-centered/`
- Centered logo with horizontal navigation
- CTA button on right side
- Mobile hamburger menu
- Sticky scroll behavior
- Optional transparent mode

**Best for:** Modern brands, SaaS, Technology, Startups

#### 2. Header Split
**Location:** `header/header-split/`
- Logo left, navigation right
- Top contact bar with phone/email/address
- Search bar (desktop + mobile)
- Mega menu support
- Social media icons
- Mobile drawer menu

**Best for:** Corporate, Healthcare, Finance, E-commerce

---

### Footer Patterns (2 variants)

#### 1. Footer Columns
**Location:** `footer/footer-columns/`
- 4-column layout (About, Services, Links, Contact)
- Social media icons
- Newsletter signup form
- Back-to-top button
- Responsive grid (1-2-4 columns)

**Best for:** Content-rich sites, multiple services

#### 2. Footer Centered
**Location:** `footer/footer-centered/`
- Centered logo and navigation
- Single-row horizontal menu
- Social icons (centered)
- Minimal, clean design

**Best for:** Simple sites, portfolios, small businesses

---

## File Structure

Each pattern directory contains 3 files:

```
pattern-name/
├── manifest.json      # Configuration, content slots, suitability scores
├── template.php       # WordPress block template with PHP
└── preview.html       # Standalone HTML preview with Tailwind CDN
```

## Quick Start

### 1. Preview Patterns
Open preview.html files directly in your browser:

```bash
# Navigate to pattern directory
cd templates/shared/patterns

# Open header previews
open header/header-centered/preview.html
open header/header-split/preview.html

# Open footer previews
open footer/footer-columns/preview.html
open footer/footer-centered/preview.html
```

### 2. Integration with Orchestrator
Patterns are automatically loaded by the pattern loader:

```javascript
const PatternLoader = require('./pattern-loader');
const loader = new PatternLoader();

// Select best header for client profile
const header = await loader.selectPattern('header', clientProfile);

// Select best footer for client profile
const footer = await loader.selectPattern('footer', clientProfile);
```

### 3. Manual Usage
To use a pattern directly in WordPress:

```php
// Include the pattern template
$content = [
    'logo_url' => '/path/to/logo.svg',
    'company_name' => 'Company Name',
    'menu_items' => [...]
];

$config = [
    'sticky' => true,
    'show_cta' => true
];

include 'header/header-centered/template.php';
```

---

## Features

### Mobile Responsiveness
- ✅ Hamburger/drawer menus for headers below 1024px
- ✅ Responsive footer grids (1-col mobile, 2-col tablet, 4-col desktop)
- ✅ Touch-friendly tap targets (44x44px minimum)
- ✅ Optimized for iOS Safari and Chrome Android

### Accessibility (WCAG 2.1 AA)
- ✅ ARIA labels on all interactive elements
- ✅ Semantic HTML5 (`<header>`, `<footer>`, `<nav>`)
- ✅ Keyboard navigation support
- ✅ Screen reader-friendly text
- ✅ Proper focus states

### Design System Integration
- ✅ Uses design tokens from `tokens/variants.json`
- ✅ Consistent button styles (solid, outline, ghost, soft)
- ✅ Standardized spacing (section, container)
- ✅ Color system (primary, secondary, text variants)
- ✅ Shadow and transition utilities

### JavaScript
- ✅ Alpine.js 3.x for state management (mobile menus)
- ✅ Vanilla JavaScript for scroll effects
- ✅ No jQuery dependency
- ✅ Progressive enhancement

---

## Pattern Selection

Patterns are scored based on:

1. **Industry Match (40%)** - Does the pattern suit the industry?
2. **Style Match (30%)** - Does it match design preferences?
3. **Feature Requirements (20%)** - Does it have needed features?
4. **Complexity Match (10%)** - Appropriate complexity level?

Example:
- **Header Split** for construction company: Score 0.9 (high match)
- **Header Centered** for tech startup: Score 0.85 (high match)
- **Footer Columns** for service business: Score 0.8 (high match)

---

## Customization

### Configuration Options

Each pattern supports multiple configuration options via `manifest.json`:

**Header Centered:**
- `sticky` - Enable sticky header on scroll
- `transparent_on_scroll` - Start transparent, become solid
- `show_cta` - Show CTA button
- `show_contact_info` - Show phone/email
- `menu_alignment` - center | spread

**Header Split:**
- `sticky` - Sticky header
- `show_search` - Search bar
- `show_contact_bar` - Top contact bar
- `show_social` - Social icons
- `enable_mega_menu` - Mega menu dropdowns

**Footer Columns:**
- `variant` - 4-column | 3-column | 2-column
- `show_newsletter` - Newsletter form
- `show_social` - Social icons
- `show_back_to_top` - Back to top button
- `background` - dark | light | gradient

**Footer Centered:**
- `variant` - default | compact | extended
- `show_logo` - Display logo
- `show_social` - Social icons
- `show_tagline` - Company tagline
- `background` - white | gray | dark

### Content Slots

Content is injected from blueprint data:

```json
{
  "logo_url": {
    "source": "assets.logo.primary",
    "fallback": "/path/to/default-logo.svg"
  },
  "menu_items": {
    "source": "navigation.primary",
    "fallback": [...]
  }
}
```

---

## Browser Support

- **Chrome/Edge:** ✅ Full support (latest 2 versions)
- **Firefox:** ✅ Full support (latest 2 versions)
- **Safari:** ✅ Full support (iOS 12+, macOS 10.14+)
- **Mobile:** ✅ iOS Safari 12+, Chrome Android 8+

---

## Documentation

- **Comprehensive Guide:** `HEADER_FOOTER_PATTERNS.md`
- **Quick Reference:** `PATTERNS-SUMMARY.md`
- **Pattern Loader:** `../../src/lib/phase2/pattern-loader.js`
- **Design Tokens:** `../../tokens/variants.json`
- **Phase 2 Spec:** `../../specs/phase2-complete-implementation.md`

---

## Development

### Testing Patterns
```bash
# Run pattern tests
npm test -- patterns

# Lint PHP templates
npm run lint:php

# Validate JSON schemas
npm run validate:manifests
```

### Creating New Patterns
1. Create pattern directory: `mkdir header/header-new`
2. Create `manifest.json` (use existing as template)
3. Create `template.php` (WordPress block template)
4. Create `preview.html` (standalone preview)
5. Add to pattern loader registry

---

## Stats

- **Total Patterns:** 4 new patterns (2 headers, 2 footers)
- **Total Files:** 12 files (4 manifests, 4 templates, 4 previews)
- **Total Lines:** ~1,800 lines of production code
- **Template Sizes:** 6KB - 17KB per pattern
- **Dependencies:** Alpine.js 3.x, Tailwind CSS 3.4+

---

## Next Steps

### Phase 2.1 - Enhanced Features
- [ ] Multi-level mega menu navigation
- [ ] Language switcher for headers
- [ ] Instagram feed integration for footers
- [ ] Payment method icons for e-commerce

### Phase 2.2 - Performance
- [ ] Critical CSS extraction
- [ ] Lazy-load footer content
- [ ] Reduce Alpine.js bundle size
- [ ] Service worker for offline support

### Phase 2.3 - Advanced
- [ ] A/B testing variants
- [ ] Dynamic theming
- [ ] Animation presets
- [ ] Advanced search functionality

---

**Created:** 2024-12-09  
**Version:** 1.0.0  
**Status:** Production Ready  
**License:** MIT

For questions or contributions, see `CONTRIBUTING.md` in the root directory.
