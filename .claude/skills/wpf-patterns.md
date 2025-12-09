---
name: wpf-patterns
description: Pattern selection and configuration for WordPress theme sections
triggers:
  - pattern selection
  - hero section
  - services section
  - about section
  - testimonials
  - contact section
  - template preset
  - industry preset
---

# WPF Pattern Selection

## Purpose
Select and configure section patterns based on blueprint data and industry presets.

## Pattern Types

### Core Sections
1. **Hero** - Above-fold introduction with headline, subheadline, CTA
2. **Services** - Service/product offerings grid or list
3. **About** - Company story, values, team
4. **Testimonials** - Customer reviews and social proof
5. **Contact** - Contact form, map, business info
6. **Stats** - Key metrics and achievements

### Supporting Sections
- FAQ - Frequently asked questions
- Portfolio - Work samples/case studies
- Pricing - Service/product pricing tables
- CTA - Call-to-action banners

## Industry Presets

Located in: `modules/templates/presets/`

Each industry has optimized patterns:

| Industry | Hero Style | Services Style | Trust Elements |
|----------|------------|----------------|----------------|
| Construction | Bold, project imagery | Grid with icons | Certifications, years |
| Healthcare | Professional, clean | List with descriptions | Credentials, reviews |
| Restaurant | Visual, appetizing | Menu-style grid | Reviews, awards |
| Professional | Corporate, trustworthy | Feature list | Client logos |

## Preset Structure

```
presets/
├── construction/
│   ├── preset.json       # Metadata and defaults
│   └── patterns/
│       ├── hero.manifest.json
│       ├── hero.php
│       ├── services.manifest.json
│       └── services.php
```

## Pattern Manifest Schema

Each pattern has a manifest.json:

```json
{
  "id": "construction-hero-bold",
  "name": "Bold Construction Hero",
  "section": "hero",
  "description": "High-impact hero with project background",
  "content_slots": {
    "headline": { "type": "text", "required": true, "max_length": 80 },
    "subheadline": { "type": "text", "required": false, "max_length": 160 },
    "cta_text": { "type": "text", "required": true },
    "cta_url": { "type": "url", "required": true },
    "background_image": { "type": "image", "required": false }
  },
  "tailwind_classes": {
    "container": "relative min-h-[80vh] flex items-center",
    "headline": "text-4xl md:text-6xl font-bold text-white",
    "cta": "bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded"
  }
}
```

## Selection Algorithm

`template-selector.js` scores presets based on:

1. **Industry match** (40%) - Exact industry = high score
2. **Service count** (20%) - More services = grid layouts
3. **Content availability** (20%) - Has testimonials? team photos?
4. **Brand style** (20%) - Professional vs casual tone

## Source Files

- `modules/orchestrator/src/lib/phase2/pattern-loader.js` - Load patterns from disk
- `modules/orchestrator/src/lib/phase2/template-selector.js` - Selection algorithm
- `modules/orchestrator/src/lib/phase2/content-injector.js` - Fill content slots

## Usage Pattern

```javascript
import { selectBestPreset } from './template-selector.js';
import { loadPresetPatterns } from './pattern-loader.js';

const selection = await selectBestPreset(blueprint, { industry: 'construction' });
const { preset, patterns } = await loadPresetPatterns(selection.preset.industry, selection.preset.id);
```

## Content Slot Mapping

Blueprint data maps to pattern slots:

| Blueprint Path | Pattern Slot |
|----------------|--------------|
| `company.name` | `headline` (if no custom) |
| `company.tagline` | `subheadline` |
| `services[0].name` | `service_1_title` |
| `testimonials[0].quote` | `testimonial_1_text` |

## Related Skills
- @wpf-design.md - Design tokens apply to pattern classes
- @wpf-content.md - Content injection fills pattern slots
