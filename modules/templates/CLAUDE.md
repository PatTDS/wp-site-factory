# Templates Module - LLM Integration Guidelines

**Version:** 1.0.0
**Last Updated:** 2025-12-05
**Purpose:** Master guidelines for Phase 2 LLM template consumption

---

## Overview

This module contains high-quality, adaptive HTML templates for website generation. Templates are the **contract** between blueprint content and final output.

**Key Principle:** Templates define structure and styling. LLM injects content. LLM does NOT modify template structure unless explicitly requested by user.

---

## Template Architecture

```
Blueprint (content) + Template (structure) + Rules (behavior) = Output
```

### What Templates Define (FIXED)
- Layout structure (grid, flexbox, positioning)
- Visual styling (colors, typography, spacing)
- Animations and interactions
- Responsive breakpoints
- Section order

### What LLM Provides (VARIABLE)
- Content from blueprint (headlines, descriptions, etc.)
- Stock photo selection based on image_keywords
- Conditional rendering based on available data

### What Templates Handle Automatically (ADAPTIVE)
- Variable item counts (3 vs 9 services)
- Variable text lengths (short vs long headlines)
- Missing optional elements (hide gracefully)
- Responsive behavior (mobile, tablet, desktop)

---

## How to Use Templates

### Step 1: Identify Industry and Preset

```javascript
// From blueprint
const industry = blueprint.client_profile.industry.category; // "construction"
const preset = selectPreset(blueprint); // "industrial-modern"
```

### Step 2: Load Preset Configuration

Read `industries/{industry}/presets/{preset}.json`:
```json
{
  "name": "Industrial Modern",
  "sections": {
    "hero": "hero-split-video",
    "services": "services-grid-3col",
    "stats": "stats-dark-animated",
    "about": "about-split-image",
    "testimonials": "testimonials-cards-3col",
    "contact": "contact-split-map"
  }
}
```

### Step 3: For Each Section, Load Template + Rules

```javascript
const templatePath = `industries/${industry}/sections/hero/${preset.sections.hero}.hbs`;
const rulesPath = `industries/${industry}/sections/hero/${preset.sections.hero}.rules.json`;

const template = loadTemplate(templatePath);
const rules = loadRules(rulesPath);
```

### Step 4: Extract Content Following Rules

Rules file specifies exactly what to extract from blueprint:

```json
{
  "blueprint_mapping": {
    "required": ["content_drafts.hero.headline"],
    "optional": ["content_drafts.hero.tagline", "content_drafts.hero.subheadline"]
  }
}
```

### Step 5: Inject Content into Template

Use Handlebars to compile template with content:

```javascript
const compiled = Handlebars.compile(template);
const html = compiled({
  headline: blueprint.content_drafts.hero.headline,
  subheadline: blueprint.content_drafts.hero.subheadline,
  tagline: blueprint.content_drafts.hero.tagline,
  // ... other fields from rules
});
```

---

## Critical Rules for LLM

### DO

1. **Follow blueprint_mapping exactly** - Extract only specified fields
2. **Respect adaptive_rules** - Use documented limits for text truncation
3. **Use image_keywords for stock photos** - Don't invent keywords
4. **Render optional fields conditionally** - Template handles missing data
5. **Preserve template structure** - Don't add/remove HTML elements
6. **Apply design tokens** - Use colors/fonts from tokens.json

### DO NOT

1. **Never modify template HTML structure** - Grid layouts, section order, etc.
2. **Never change CSS classes** - Styling is defined by template
3. **Never add elements not in template** - No extra divs, spans, etc.
4. **Never invent content** - Use only what's in blueprint
5. **Never change animations** - Defined by template CSS
6. **Never reorder sections** - Order defined by preset

### USER-REQUESTED CHANGES ONLY

These changes require explicit user request (e.g., "make the headline bigger"):

| User Request | LLM Action |
|--------------|------------|
| "Make headline bigger" | Add inline style or modify font-size class |
| "Center the logo" | Change alignment class |
| "Move testimonials above services" | Reorder section rendering |
| "Use different colors" | Override design tokens |
| "Remove the tagline" | Skip tagline rendering |
| "Add more space between sections" | Add margin/padding class |

**Important:** Document any user-requested changes in output metadata.

---

## Template File Reference

### File Types

| Extension | Purpose | Required |
|-----------|---------|----------|
| `.hbs` | Handlebars template | Yes |
| `.css` | Section-specific CSS | Yes |
| `.rules.json` | LLM instructions | Yes |
| `.test.json` | Sample data for preview | Optional |
| `.preview.html` | Standalone preview | Optional |

### Rules.json Structure

```json
{
  "section": "hero",
  "version": "1.0.0",
  "purpose": "Main hero section with headline, CTA, and background image/video",

  "blueprint_mapping": {
    "required": ["content_drafts.hero.headline", "content_drafts.hero.cta_primary_text"],
    "optional": ["content_drafts.hero.tagline", "content_drafts.hero.subheadline", "content_drafts.hero.cta_secondary_text"]
  },

  "stock_photos": {
    "fields": ["content_drafts.hero.image_keywords"],
    "fallback_keywords": ["construction", "professional", "industrial"],
    "aspect_ratio": "16:9",
    "min_width": 1920
  },

  "adaptive_rules": {
    "headline": {
      "max_chars": 80,
      "overflow": "allow-wrap",
      "font_scaling": "clamp(2rem, 5vw, 4rem)"
    },
    "subheadline": {
      "max_chars": 200,
      "overflow": "allow-wrap"
    },
    "cta_buttons": {
      "max_visible": 2,
      "min_visible": 1
    }
  },

  "llm_instructions": {
    "DO": [
      "Extract headline from content_drafts.hero.headline",
      "Use cta_primary_text and cta_primary_url for main button",
      "Fetch hero image using image_keywords from blueprint",
      "Apply brand colors from design_tokens"
    ],
    "DO_NOT": [
      "Change hero layout structure",
      "Modify button styling",
      "Add animations not defined in CSS",
      "Change background overlay opacity"
    ],
    "USER_CUSTOMIZABLE": [
      "headline_size",
      "button_colors",
      "background_overlay_opacity",
      "cta_button_text"
    ]
  }
}
```

---

## Handlebars Syntax Reference

### Conditionals

```handlebars
{{#if tagline}}
  <p class="tagline">{{tagline}}</p>
{{/if}}

{{#unless hide_cta}}
  <a href="{{cta_url}}" class="btn">{{cta_text}}</a>
{{/unless}}
```

### Loops

```handlebars
{{#each services}}
  <div class="service-card">
    <h3>{{this.name}}</h3>
    <p>{{this.description}}</p>
  </div>
{{/each}}
```

### Helpers (Custom)

```handlebars
{{!-- Truncate text --}}
{{truncate description 150}}

{{!-- Format number --}}
{{formatNumber stats.value}}

{{!-- Conditional class --}}
<div class="grid {{gridClass items.length}}">
```

### Escaping

```handlebars
{{!-- Escaped (safe) --}}
{{headline}}

{{!-- Unescaped (for HTML content) --}}
{{{rich_content}}}
```

---

## Design Tokens Integration

Templates use design tokens from `tokens.json`:

```json
{
  "colors": {
    "primary": "{{brand.colors.primary}}",
    "secondary": "{{brand.colors.secondary}}",
    "accent": "{{brand.colors.accent}}"
  },
  "typography": {
    "font_heading": "Inter",
    "font_body": "Inter",
    "scale": 1.25
  },
  "spacing": {
    "section_padding": "4rem",
    "container_max": "1280px"
  },
  "borders": {
    "radius_sm": "0.375rem",
    "radius_md": "0.5rem",
    "radius_lg": "1rem"
  }
}
```

Apply tokens via CSS custom properties:

```css
:root {
  --color-primary: {{colors.primary}};
  --color-secondary: {{colors.secondary}};
  --font-heading: {{typography.font_heading}};
}

.hero-headline {
  color: var(--color-primary);
  font-family: var(--font-heading);
}
```

---

## Error Handling

### Missing Required Fields

If required blueprint field is missing:
1. Log warning with field name
2. Use placeholder text: "[Missing: field_name]"
3. Add `data-missing="field_name"` attribute for debugging

### Invalid Data

If data doesn't match expected format:
1. Log warning with details
2. Apply adaptive rules (truncate, hide, etc.)
3. Continue rendering with available data

### Template Not Found

If specified template doesn't exist:
1. Log error
2. Fall back to default template for that section
3. Document fallback in output metadata

---

## Output Metadata

Include metadata in generated output for debugging:

```html
<!-- WPF Template Metadata
  Industry: construction
  Preset: industrial-modern
  Sections: hero-split-video, services-grid-3col, ...
  Generated: 2025-12-05T12:00:00Z
  User Customizations: none
  Warnings: []
-->
```

---

## Quick Reference

```
Template Usage Flow:
1. Load preset → industries/{industry}/presets/{preset}.json
2. For each section:
   a. Load template → sections/{section}/{variant}.hbs
   b. Load rules → sections/{section}/{variant}.rules.json
   c. Extract content per blueprint_mapping
   d. Apply adaptive_rules for limits
   e. Compile with Handlebars
   f. Inject into page layout
3. Apply design tokens
4. Output final HTML with metadata
```

---

**Remember:** Templates are the foundation. Respect their structure. Inject content. Don't reinvent.
