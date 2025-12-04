# WPF Design-First AI Instructions

When creating a new website using the WPF design-first workflow, follow these instructions.

---

## Overview

The design-first workflow separates design approval from implementation:

1. **Discovery** → Gather requirements
2. **Design** → Select components, create design.json
3. **Preview** → Generate visual preview for approval
4. **Approval Gate** → Client/user must approve before implementation
5. **Implementation** → Generate WordPress theme files

---

## Step 1: Discovery

Use `prompts/design-discovery.md` to gather information. For quick projects, use the "Quick Discovery" section.

**Minimum required information:**
- Company name
- Industry type
- Primary phone/email
- Main services (at least names)
- Primary CTA action

---

## Step 2: Design Selection

### Industry Preset Selection

Based on the business type, select an industry preset:

| Industry | Best For | Characteristics |
|----------|----------|-----------------|
| `industrial` | Construction, Manufacturing, Labour Hire | Bold blues, high-vis orange, safety green |
| `professional-services` | Legal, Accounting, Consulting | Navy blue, gold accents, trust-focused |
| `healthcare` | Medical, Dental, Wellness | Calming blue, healing green, clean |
| `technology` | SaaS, IT, Startups | Vibrant purple, electric blue, modern |
| `ecommerce` | Retail, Online stores | Coral/rose, warm, action-oriented |
| `hospitality` | Hotels, Restaurants, Tourism | Warm amber, earth tones, welcoming |

### Component Selection Logic

**Headers:**
- `header-modern` → Default for most sites (sticky, glassmorphism)
- `header-transparent` → Sites with hero images, hospitality, portfolios

**Heroes:**
- `hero-split-cards` → Industrial, B2B, stats-heavy businesses
- `hero-centered` → SaaS, technology, clean brands
- `hero-image-bg` → Hospitality, real estate, visual businesses

**Stats:**
- `stats-cards` → When stats are a key selling point (4+ metrics)
- `stats-inline` → Compact placement below hero (3-4 quick metrics)

**Services:**
- `services-cards` → Universal, works for all businesses

**Features:**
- `features-grid` → Multiple features to highlight (6+)
- `features-alternating` → Detailed explanations needed, 2-4 key features

**Testimonials:**
- `testimonials-cards` → Multiple short testimonials (3-6)
- `testimonials-carousel` → 1-2 strong featured testimonials

**CTAs:**
- `cta-gradient` → Strong conversion focus, urgency
- `cta-split` → Include form or additional info alongside CTA

**Contact:**
- `contact-split` → Full contact page with map, hours
- `contact-centered` → Simple contact form for landing pages

**Footers:**
- `footer-comprehensive` → Full site with multiple pages, newsletter
- `footer-minimal` → Landing pages, simple sites

---

## Step 3: Create design.json

Generate the design.json file with:

```json
{
  "version": "1.0",
  "project": "project-name",
  "industry": "selected-preset",
  "status": "draft",

  "colors": {
    "primary": "#hex-from-preset-or-brand",
    "secondary": "#hex",
    "accent": "#hex"
  },

  "typography": {
    "headingFont": "Poppins",
    "bodyFont": "Inter"
  },

  "sections": {
    "header": "header-modern",
    "hero": "hero-split-cards",
    "body": [
      "stats-cards",
      "services-cards",
      "testimonials-cards",
      "cta-gradient"
    ],
    "footer": "footer-comprehensive"
  },

  "content": {
    "company": {
      "name": "Company Name",
      "tagline": "Your tagline here",
      "description": "Full description..."
    },
    "contact": {
      "phone": "(11) 99999-9999",
      "email": "contact@example.com",
      "address": "123 Main St",
      "city": "City",
      "state": "ST"
    }
  }
}
```

---

## Step 4: Preview Generation

Run `wpf design preview <project>` to generate a visual preview.

The preview:
- Uses Tailwind CDN for instant styling
- Shows all selected components with placeholder content
- Displays a "Design Preview Mode" banner
- Can be viewed in any browser

**Ask user to review:**
- Overall color scheme
- Component choices
- Layout flow
- Content placement

---

## Step 5: Approval Gate

**IMPORTANT:** Do NOT proceed to implementation until design is approved.

Ask explicitly: "Does this design look good? Should I proceed with implementation?"

If changes needed:
1. Update design.json
2. Regenerate preview
3. Repeat until approved

Once approved, run `wpf design approve <project>` to:
- Mark status as "approved"
- Record approval timestamp
- Enable implementation phase

---

## Step 6: Implementation

After approval:

1. Run `wpf design compile <project>` to generate theme files
2. Apply design tokens to tailwind.config.js
3. Generate page templates from components
4. Replace placeholders with real content
5. Build CSS: `npm run build`
6. Start Docker and test

---

## Component Placeholder Variables

When compiling components, replace these Mustache-style variables:

### Global Variables
- `{{COMPANY_NAME}}` - Company display name
- `{{PHONE}}` - Phone number
- `{{EMAIL}}` - Email address
- `{{ADDRESS}}`, `{{CITY}}`, `{{STATE}}` - Location
- `{{YEAR}}` - Current year

### Section-Specific Variables
- `{{SECTION_BADGE}}` - Category label (e.g., "Our Services")
- `{{SECTION_TITLE}}` - Section heading
- `{{SECTION_DESCRIPTION}}` - Section intro text

### Hero Variables
- `{{HEADLINE}}` - Main headline
- `{{SUBHEADLINE}}` - Supporting text
- `{{CTA_PRIMARY_TEXT}}`, `{{CTA_PRIMARY_URL}}` - Primary button
- `{{CTA_SECONDARY_TEXT}}`, `{{CTA_SECONDARY_URL}}` - Secondary button

### Stats Variables (arrays)
- `{{#STATS}}...{{/STATS}}` - Loop over stats
- `{{STAT_VALUE}}` - Number/metric
- `{{STAT_LABEL}}` - Description
- `{{STAT_COLOR}}` - Color variant

### Services Variables (arrays)
- `{{#SERVICES}}...{{/SERVICES}}` - Loop over services
- `{{SERVICE_TITLE}}`, `{{SERVICE_DESCRIPTION}}`
- `{{SERVICE_ICON}}` - SVG icon
- `{{SERVICE_COLOR}}` - Color variant
- `{{#SERVICE_FEATURES}}...{{/SERVICE_FEATURES}}` - Feature list

### Testimonials Variables (arrays)
- `{{#TESTIMONIALS}}...{{/TESTIMONIALS}}` - Loop
- `{{TESTIMONIAL_QUOTE}}` - Quote text
- `{{AUTHOR_NAME}}`, `{{AUTHOR_ROLE}}`, `{{AUTHOR_COMPANY}}`
- `{{AUTHOR_INITIAL}}` - First letter for avatar

---

## Design-First Workflow Benefits

1. **Faster iterations** - Preview changes without rebuilding theme
2. **Client approval** - Get sign-off before investing in implementation
3. **Consistent quality** - Pre-built components ensure professional results
4. **Reduced scope creep** - Approved design locks in requirements
5. **AI-optimized** - Components designed for easy AI manipulation

---

## Common Patterns by Industry

### Industrial/Construction
```
Header: header-modern
Hero: hero-split-cards (with floating stat cards)
Stats: stats-cards (years experience, projects, safety record)
Services: services-cards (3-6 core services)
CTA: cta-gradient (urgent action)
Footer: footer-comprehensive
```

### Professional Services
```
Header: header-modern
Hero: hero-centered (clean, trust-focused)
Features: features-alternating (explain expertise)
Testimonials: testimonials-carousel (featured client quotes)
CTA: cta-split (with consultation form)
Footer: footer-comprehensive
```

### Technology/SaaS
```
Header: header-transparent
Hero: hero-centered (gradient headline)
Stats: stats-inline (compact metrics)
Features: features-grid (product features)
Testimonials: testimonials-cards (multiple reviews)
CTA: cta-gradient (start trial)
Footer: footer-minimal
```

---

## Quick Reference

**Commands:**
```bash
wpf design list              # List all components
wpf design show <component>  # Show component details
wpf design industries        # List industry presets
wpf design init <project>    # Start design for project
wpf design preview <project> # Generate preview
wpf design approve <project> # Approve design
wpf design compile <project> # Generate theme files
```

**Files:**
- `design-system/components/` - Component HTML templates
- `design-system/tokens/` - Color and style tokens
- `design-system/schema/` - JSON schema for validation
- `<project>/design.json` - Project design configuration
