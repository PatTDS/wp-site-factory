# LLM Integration Guide

**Version:** 1.0.0
**Purpose:** How Phase 2 LLM should consume and use templates

---

## Integration Overview

```
┌──────────────┐     ┌─────────────┐     ┌──────────────┐
│   Blueprint  │ ──▶ │  Phase 2    │ ──▶ │    HTML      │
│   (content)  │     │    LLM      │     │   Output     │
└──────────────┘     └─────────────┘     └──────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │  Templates  │
                     │  + Rules    │
                     └─────────────┘
```

The LLM's role is to:
1. Select appropriate templates
2. Extract content from blueprint
3. Inject content into templates
4. Handle edge cases gracefully

---

## Step-by-Step Integration

### Step 1: Identify Industry

```javascript
const industry = blueprint.client_profile.industry.category;
// "construction", "healthcare", "saas", etc.

const industryPath = `industries/${industry}`;
```

### Step 2: Load Industry Manifest

Read `industries/{industry}/manifest.json`:

```json
{
  "industry": "construction",
  "version": "1.0.0",
  "default_preset": "industrial-modern",
  "presets": ["industrial-modern", "corporate-clean", "bold-minimal"],
  "sections_available": ["hero", "services", "stats", "about", "testimonials", "contact"]
}
```

### Step 3: Select Preset

Use blueprint signals to select preset:

```javascript
function selectPreset(blueprint, manifest) {
  const tone = blueprint.brand.tone; // "professional", "friendly", "bold"
  const hasVideo = blueprint.content_drafts.hero.video_url;

  // Logic to select best preset
  if (tone === 'bold' || hasVideo) {
    return 'industrial-modern';
  } else if (tone === 'friendly') {
    return 'corporate-clean';
  }
  return manifest.default_preset;
}
```

### Step 4: Load Preset Configuration

Read `industries/{industry}/presets/{preset}.json`:

```json
{
  "name": "Industrial Modern",
  "sections": {
    "hero": "hero-split-video",
    "services": "services-grid-3col",
    "stats": "stats-dark-animated",
    "about": "about-split-image",
    "testimonials": "testimonials-cards",
    "contact": "contact-split-map"
  }
}
```

### Step 5: For Each Section

```javascript
for (const [sectionName, templateVariant] of Object.entries(preset.sections)) {
  // Load template
  const templatePath = `${industryPath}/sections/${sectionName}/${templateVariant}.hbs`;
  const template = await loadFile(templatePath);

  // Load rules
  const rulesPath = `${industryPath}/sections/${sectionName}/${templateVariant}.rules.json`;
  const rules = await loadJSON(rulesPath);

  // Extract content per rules
  const content = extractContent(blueprint, rules.blueprint_mapping);

  // Fetch stock photos if needed
  if (rules.stock_photos.enabled) {
    content.image = await fetchStockPhoto(rules.stock_photos, blueprint);
  }

  // Compile template
  const html = Handlebars.compile(template)(content);

  sections.push(html);
}
```

### Step 6: Assemble Page

```javascript
const pageLayout = await loadFile('shared/layouts/page.hbs');
const fullPage = Handlebars.compile(pageLayout)({
  title: blueprint.company.name,
  sections: sections.join('\n'),
  design_tokens: loadDesignTokens(industry, blueprint)
});
```

---

## Content Extraction Rules

### Reading Blueprint Mapping

Each template's `rules.json` specifies exactly what to extract:

```json
{
  "blueprint_mapping": {
    "required": [
      "content_drafts.hero.headline",
      "content_drafts.hero.cta_primary_text"
    ],
    "optional": [
      "content_drafts.hero.tagline",
      "content_drafts.hero.subheadline"
    ]
  }
}
```

### Extraction Implementation

```javascript
function extractContent(blueprint, mapping) {
  const content = {};

  // Extract required fields
  for (const path of mapping.required) {
    const value = getByPath(blueprint, path);
    if (!value) {
      console.warn(`Missing required field: ${path}`);
      content[getFieldName(path)] = `[Missing: ${getFieldName(path)}]`;
    } else {
      content[getFieldName(path)] = value;
    }
  }

  // Extract optional fields
  for (const path of mapping.optional) {
    const value = getByPath(blueprint, path);
    if (value) {
      content[getFieldName(path)] = value;
    }
    // If missing, don't add to content (template handles with {{#if}})
  }

  return content;
}

function getByPath(obj, path) {
  return path.split('.').reduce((o, k) => o?.[k], obj);
}

function getFieldName(path) {
  return path.split('.').pop();
}
```

### Field Name Mapping

Blueprint paths map to template variables:

| Blueprint Path | Template Variable |
|----------------|-------------------|
| `content_drafts.hero.headline` | `headline` |
| `content_drafts.hero.cta_primary_text` | `cta_primary_text` |
| `content_drafts.services.services` | `services` |
| `brand.colors.primary` | `color_primary` |

---

## Stock Photo Integration

### When to Fetch

Check `rules.stock_photos`:

```json
{
  "stock_photos": {
    "enabled": true,
    "fields": ["content_drafts.hero.image_keywords"],
    "fallback_keywords": ["construction", "professional"],
    "requirements": {
      "aspect_ratio": "16:9",
      "min_width": 1920,
      "orientation": "landscape"
    }
  }
}
```

### Fetching Process

```javascript
async function fetchStockPhoto(config, blueprint) {
  // Get keywords from blueprint
  let keywords = getByPath(blueprint, config.fields[0]) || [];

  // Use fallback if no keywords
  if (!keywords.length) {
    keywords = config.fallback_keywords;
  }

  // Fetch from Unsplash/Pexels
  const photo = await stockPhotos.findImageWithCache(
    keywords,
    blueprint.client_profile.industry.category,
    config.section_name
  );

  return {
    url: photo.photo.url,
    alt: photo.photo.alt,
    photographer: photo.photo.photographer,
    photographer_url: photo.photo.photographer_url,
    source: photo.photo.source
  };
}
```

### Attribution Requirement

Always include photographer attribution:

```handlebars
{{#if image.photographer}}
  <span class="photo-attribution">
    Photo by <a href="{{image.photographer_url}}">{{image.photographer}}</a>
    on {{image.source}}
  </span>
{{/if}}
```

---

## Design Token Application

### Loading Tokens

```javascript
function loadDesignTokens(industry, blueprint) {
  // Load industry defaults
  const industryTokens = loadJSON(`industries/${industry}/tokens.json`);

  // Override with blueprint brand colors
  return {
    ...industryTokens,
    colors: {
      primary: blueprint.brand.colors.primary || industryTokens.colors.primary,
      secondary: blueprint.brand.colors.secondary || industryTokens.colors.secondary,
      accent: blueprint.brand.colors.accent || industryTokens.colors.accent
    }
  };
}
```

### Injecting into CSS

Generate CSS custom properties:

```javascript
function generateTokenCSS(tokens) {
  return `
    :root {
      --color-primary: ${tokens.colors.primary};
      --color-secondary: ${tokens.colors.secondary};
      --color-accent: ${tokens.colors.accent};
      --font-heading: ${tokens.typography.font_heading};
      --font-body: ${tokens.typography.font_body};
    }
  `;
}
```

---

## Error Handling

### Missing Required Content

```javascript
if (!content.headline) {
  // Log warning
  console.warn('Hero: Missing required headline');

  // Use placeholder
  content.headline = '[Headline Required]';

  // Mark as incomplete
  metadata.incomplete_sections.push('hero');
}
```

### Invalid Data Format

```javascript
// Services should be array
if (!Array.isArray(content.services)) {
  console.warn('Services: Expected array, got', typeof content.services);
  content.services = [];
}

// Truncate overlong text
if (content.headline.length > rules.adaptive_rules.headline.max_chars) {
  content.headline = content.headline.slice(0, rules.adaptive_rules.headline.max_chars - 3) + '...';
}
```

### Template Not Found

```javascript
try {
  template = await loadFile(templatePath);
} catch (err) {
  console.error(`Template not found: ${templatePath}`);

  // Fall back to default
  template = await loadFile(`${industryPath}/sections/${sectionName}/default.hbs`);
  metadata.fallbacks.push(sectionName);
}
```

---

## DO / DO NOT Reference

### LLM MUST DO

1. **Follow blueprint_mapping exactly**
   - Only extract specified fields
   - Use exact path structure

2. **Respect adaptive_rules**
   - Apply text limits
   - Handle item counts per rules

3. **Use stock photos correctly**
   - Use image_keywords from blueprint
   - Fall back to defaults if missing
   - Include attribution

4. **Apply design tokens**
   - Use brand colors from blueprint
   - Fall back to industry defaults

5. **Preserve template structure**
   - Don't add HTML elements
   - Don't modify CSS classes
   - Don't change section order

### LLM MUST NOT

1. **Modify template structure**
   - No adding divs, spans, etc.
   - No removing elements
   - No changing class names

2. **Invent content**
   - Only use what's in blueprint
   - Don't generate new text
   - Don't create placeholder content

3. **Override styling**
   - No inline styles (unless user-requested)
   - No CSS modifications
   - No animation changes

4. **Change section order**
   - Follow preset configuration
   - Don't reorder sections

5. **Skip error handling**
   - Always check for missing fields
   - Always log warnings
   - Always provide fallbacks

---

## Output Metadata

Include metadata for debugging:

```javascript
const metadata = {
  generated_at: new Date().toISOString(),
  industry: industry,
  preset: presetName,
  sections: Object.keys(preset.sections),
  incomplete_sections: [],
  fallbacks: [],
  warnings: [],
  user_customizations: []
};

// Include in HTML comment
const metadataComment = `
<!-- WPF Template Generation
${JSON.stringify(metadata, null, 2)}
-->
`;
```

---

## Handlebars Helpers Reference

Register these helpers for templates:

```javascript
Handlebars.registerHelper('default', (value, defaultValue) => {
  return value || defaultValue;
});

Handlebars.registerHelper('truncate', (text, limit) => {
  if (!text || text.length <= limit) return text;
  return text.slice(0, limit - 3) + '...';
});

Handlebars.registerHelper('gt', (a, b) => a > b);
Handlebars.registerHelper('lt', (a, b) => a < b);
Handlebars.registerHelper('eq', (a, b) => a === b);

Handlebars.registerHelper('take', (array, n) => {
  return array ? array.slice(0, n) : [];
});

Handlebars.registerHelper('skip', (array, n) => {
  return array ? array.slice(n) : [];
});

Handlebars.registerHelper('formatNumber', (num) => {
  return num.toLocaleString();
});
```

---

## Quick Integration Checklist

- [ ] Load industry manifest
- [ ] Select preset based on blueprint signals
- [ ] Load preset configuration
- [ ] For each section:
  - [ ] Load template (.hbs)
  - [ ] Load rules (.rules.json)
  - [ ] Extract content per blueprint_mapping
  - [ ] Fetch stock photos if enabled
  - [ ] Apply adaptive rules
  - [ ] Compile template
- [ ] Apply design tokens
- [ ] Assemble full page
- [ ] Include metadata comment
- [ ] Log any warnings

---

**Remember:** The LLM's job is to be a precise assembler, not a creative designer. Follow the templates exactly.
