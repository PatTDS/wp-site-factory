# Header and Footer Patterns

Comprehensive header and footer patterns for Phase 2 orchestrator with full mobile responsiveness, accessibility, and design token integration.

## Header Patterns

### 1. Header Centered (`header-centered`)
**Location:** `templates/shared/patterns/header/header-centered/`

**Description:** Centered logo with horizontal navigation, CTA button, and mobile hamburger menu. Sticky on scroll option.

**Best For:** Modern, minimal brands; SaaS, Technology, Startups, Agencies

**Features:**
- Centered logo layout
- Horizontal navigation menu
- Optional CTA button (right side)
- Mobile hamburger menu with slide-down
- Sticky header with scroll effects
- Optional transparent-on-scroll mode
- Contact info bar (optional)
- ARIA labels for accessibility

**Files:**
- `manifest.json` - Configuration and content slots
- `template.php` - WordPress block template
- `preview.html` - Standalone preview with Alpine.js

**Configuration Options:**
- `sticky` (boolean) - Enable sticky header on scroll
- `transparent_on_scroll` (boolean) - Start transparent, become solid
- `show_cta` (boolean) - Show CTA button
- `show_contact_info` (boolean) - Show phone/email in header
- `menu_alignment` (center | spread)

---

### 2. Header Split (`header-split`)
**Location:** `templates/shared/patterns/header/header-split/`

**Description:** Logo left, navigation right with mega menu support, search bar, and contact info. Professional layout with mobile drawer.

**Best For:** Corporate, Healthcare, Finance, Real Estate, E-commerce

**Features:**
- Logo on left, navigation on right
- Top contact bar with phone/email/address
- Mega menu dropdown support
- Search bar (desktop + mobile)
- Social media icons in top bar
- Mobile drawer menu (slides from right)
- Sticky header with shadow effect
- Click-away close for mobile menu

**Files:**
- `manifest.json` - Configuration and content slots
- `template.php` - WordPress block template with mega menu
- `preview.html` - Standalone preview

**Configuration Options:**
- `sticky` (boolean) - Sticky header
- `show_search` (boolean) - Search bar
- `show_contact_bar` (boolean) - Top contact bar
- `show_social` (boolean) - Social icons
- `enable_mega_menu` (boolean) - Mega menu dropdowns

---

## Footer Patterns

### 1. Footer Columns (`footer-columns`)
**Location:** `templates/shared/patterns/footer/footer-columns/`

**Description:** Multi-column footer with About, Services, Quick Links, and Contact sections. Includes social media, newsletter signup, and back-to-top button.

**Best For:** All industries; Content-rich sites with multiple services

**Features:**
- 4-column layout (responsive: 1-col mobile, 2-col tablet, 4-col desktop)
- Company info with description
- Services list
- Quick links (About/Company)
- Contact information (email, phone, address)
- Social media icons
- Newsletter signup form
- Copyright + legal links
- Back-to-top button with scroll reveal
- 3-column and 2-column variants

**Files:**
- `manifest.json` - Configuration and content slots
- `template.php` - WordPress block template
- `preview.html` - Standalone preview

**Configuration Options:**
- `variant` (4-column | 3-column | 2-column)
- `show_newsletter` (boolean) - Newsletter form
- `show_social` (boolean) - Social icons
- `show_back_to_top` (boolean) - Back to top button
- `background` (dark | light | gradient)

---

### 2. Footer Centered (`footer-centered`)
**Location:** `templates/shared/patterns/footer/footer-centered/`

**Description:** Minimalist centered footer with logo, single-row navigation, social icons, and copyright. Perfect for simple, clean designs.

**Best For:** Minimal designs; Small businesses; Single-page sites; Portfolios

**Features:**
- Centered logo (or text logo)
- Company tagline
- Single-row horizontal navigation
- Social media icons (centered)
- Legal links
- Copyright notice
- Clean, minimal design
- Compact, default, and extended variants

**Files:**
- `manifest.json` - Configuration and content slots
- `template.php` - WordPress block template
- `preview.html` - Standalone preview

**Configuration Options:**
- `variant` (default | compact | extended) - Padding variations
- `show_logo` (boolean) - Display logo
- `show_social` (boolean) - Social icons
- `show_tagline` (boolean) - Company tagline
- `background` (white | gray | dark)

---

## Technical Implementation

### Design Tokens
All patterns use tokens from `tokens/variants.json`:
- Button styles (solid, outline, ghost, soft)
- Spacing (section, container)
- Colors (primary, secondary, text variants)
- Shadows and transitions
- Border radius

### Mobile Responsiveness
- **Breakpoints:** sm (640px), md (768px), lg (1024px), xl (1280px)
- Headers convert to hamburger/drawer menus below `lg` (1024px)
- Footers stack vertically below `md` (768px)
- Touch-friendly tap targets (minimum 44x44px)

### Accessibility Features
- ARIA labels on all interactive elements
- Semantic HTML5 elements (`<header>`, `<footer>`, `<nav>`)
- Keyboard navigation support
- Focus states on all interactive elements
- Screen reader-friendly text
- `role` attributes for navigation

### JavaScript Dependencies
- **Alpine.js 3.x** - Used for mobile menu state management
- Vanilla JavaScript for scroll effects
- No jQuery dependency

### WordPress Integration
- Uses WordPress block syntax (`<!-- wp:group -->`)
- Compatible with block editor
- Content slots map to blueprint data
- PHP 8.0+ match expressions
- WordPress escaping functions (`esc_html`, `esc_url`, `esc_attr`)

---

## Pattern Structure

Each pattern directory contains:

```
pattern-name/
├── manifest.json      # Pattern metadata and configuration
├── template.php       # WordPress block template (PHP)
└── preview.html       # Standalone preview (HTML + Tailwind CDN)
```

### manifest.json Schema
```json
{
  "id": "pattern-id",
  "name": "Pattern Name",
  "description": "Pattern description",
  "category": "header|footer",
  "variants": ["variant1", "variant2"],
  "configuration": {
    "option_name": {
      "type": "boolean|enum",
      "options": ["option1"],
      "default": "default_value",
      "description": "Option description"
    }
  },
  "content_slots": {
    "slot_name": {
      "required": true|false,
      "source": "blueprint.path.to.data",
      "fallback": "Default value"
    }
  },
  "tailwind_classes": {
    "element": "utility classes"
  },
  "suitability": {
    "industries": ["industry1"],
    "styles": ["style1"],
    "score_factors": {
      "factor": 0.5
    }
  },
  "template_file": "template.php"
}
```

---

## Usage in Phase 2 Orchestrator

### Pattern Selection
Patterns are selected by the orchestrator based on:
1. **Industry matching** - `suitability.industries`
2. **Style preferences** - `suitability.styles`
3. **Score factors** - Weighted scoring based on client profile

### Content Injection
Content slots are populated from blueprint data:
```javascript
content_slot.source = "client_profile.company.name"
→ injects client_profile.company.name into template
```

### Rendering
1. Orchestrator selects pattern based on scoring
2. Loads manifest.json configuration
3. Populates content slots from blueprint
4. Renders template.php with WordPress blocks
5. Injects into theme

---

## Testing

### Preview Files
Each pattern includes a `preview.html` file for visual testing:
- Open in browser directly
- Uses Tailwind CDN for styling
- Includes Alpine.js for interactivity
- Fully functional without WordPress

### Browser Testing
- **Chrome/Edge:** Full support
- **Firefox:** Full support
- **Safari:** Full support (iOS 12+)
- **Mobile:** Tested on iOS Safari, Chrome Android

### Accessibility Testing
- WCAG 2.1 Level AA compliant
- Tested with VoiceOver (macOS)
- Keyboard navigation verified
- Color contrast ratios checked

---

## Future Enhancements

### Planned Features
- [ ] Header with multi-level mega menu
- [ ] Footer with location map integration
- [ ] Header with language switcher
- [ ] Footer with Instagram feed
- [ ] Header with announcement bar
- [ ] Footer with payment icons

### Optimization Opportunities
- [ ] Generate critical CSS for above-fold headers
- [ ] Lazy-load footer content
- [ ] Reduce Alpine.js bundle size
- [ ] Add service worker for offline footer

---

## Related Documentation
- Pattern Loader: `src/lib/phase2/pattern-loader.js`
- Design Tokens: `tokens/variants.json`
- Anti-Patterns: `tokens/anti-patterns.json`
- Phase 2 Spec: `specs/phase2-complete-implementation.md`

---

**Created:** 2024-12-09
**Version:** 1.0.0
**Status:** Production Ready
