---
name: wpf-content
description: Content injection and validation for WordPress theme generation
triggers:
  - content injection
  - blueprint content
  - validation
  - content mapping
  - blueprint schema
---

# WPF Content Injection

## Purpose
Map blueprint content to pattern slots and validate completeness.

## Blueprint Schema

The blueprint is the single source of truth for site content:

```javascript
{
  // Company Information
  client_profile: {
    company: {
      name: "ACME Construction",
      tagline: "Building Excellence Since 1995",
      industry: "construction",
      description: "Full paragraph about the company..."
    },
    contact: {
      phone: "(02) 9999-0000",
      email: "info@acme.com.au",
      address: "123 Builder St, Sydney NSW 2000"
    }
  },

  // Brand Identity
  brand_profile: {
    colors: {
      primary: "#16a34a",
      secondary: "#0f766e"
    },
    tone: "professional",  // professional | friendly | bold
    typography: {
      heading: "Inter",
      body: "Inter"
    }
  },

  // Services
  services: [
    {
      name: "Commercial Construction",
      description: "Office buildings, retail spaces...",
      icon: "building"
    }
  ],

  // Social Proof
  testimonials: [
    {
      quote: "Excellent work on our project...",
      author: "John Smith",
      company: "Smith Industries",
      role: "CEO"
    }
  ],

  // Team (optional)
  team: [
    {
      name: "Jane Doe",
      role: "Director",
      bio: "20 years experience...",
      image: "team/jane.jpg"
    }
  ],

  // Stats (optional)
  stats: [
    { value: "25+", label: "Years Experience" },
    { value: "500+", label: "Projects Completed" }
  ]
}
```

## Content Mapping Rules

`content-injector.js` maps blueprint to pattern slots:

### Direct Mapping
```javascript
const mapping = {
  'headline': 'client_profile.company.name',
  'subheadline': 'client_profile.company.tagline',
  'phone': 'client_profile.contact.phone',
  'email': 'client_profile.contact.email'
};
```

### Array Mapping
For services, testimonials, team:
```javascript
// services[0] -> service_1_title, service_1_description
// services[1] -> service_2_title, service_2_description
```

### Computed Values
Some slots are computed:
```javascript
'cta_text': 'Get Free Quote',  // Default if not in blueprint
'copyright_year': new Date().getFullYear(),
'full_address': `${address}, ${city} ${state} ${postcode}`
```

## Validation

Each pattern defines required vs optional slots:

```javascript
const validation = validateContent(manifest, content);
// Returns:
{
  valid: true/false,
  missing: ['headline'],  // Required slots without values
  warnings: ['testimonial_image']  // Optional slots without values
}
```

## Completeness Score

`generateContentSummary()` calculates percentage:

```javascript
{
  completeness: 85,  // Percentage of slots filled
  filledSlots: 17,
  totalSlots: 20,
  missingRequired: [],
  missingOptional: ['team_photo_1', 'team_photo_2', 'video_url']
}
```

## Source Files

- `modules/orchestrator/src/lib/phase2/content-injector.js` - Core injection logic
- `modules/orchestrator/src/lib/phase2/theme-assembler.js` - Orchestrates full pipeline

## Usage Pattern

```javascript
import { injectContentWithMapping, validateContent } from './content-injector.js';

const content = injectContentWithMapping(manifest, blueprint);
const validation = validateContent(manifest, content);

if (!validation.valid) {
  console.warn('Missing required:', validation.missing);
}
```

## Fallback Strategy

When content is missing:

1. **Required slots**: Use placeholder or warn
2. **Optional slots**: Leave empty or use default
3. **Images**: Use stock photo placeholder (Unsplash/Pexels query)

## Stock Photo Integration

For missing images, generate Unsplash query:

```javascript
const stockQuery = generateStockPhotoQuery({
  industry: 'construction',
  section: 'hero',
  slot: 'background_image'
});
// Returns: "construction site building modern professional"
```

## Related Skills
- @wpf-design.md - Design tokens from same blueprint
- @wpf-patterns.md - Patterns define content slots
