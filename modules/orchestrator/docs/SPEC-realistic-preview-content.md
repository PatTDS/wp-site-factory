# Spec: Realistic Preview Content Enhancement

**Version:** 1.0
**Created:** 2024-12-05
**Status:** Approved for Implementation
**Branch:** 002-phase2-design-draft

## Overview

Enhance the WPF pipeline to generate realistic HTML previews with industry-specific stock photos, AI-generated testimonials based on real partners, and intelligent placeholder content that looks production-ready.

## Goals

1. Client sees 80%+ realistic preview immediately
2. Faster approval cycles (no "imagine this with real photos")
3. Better emotional impact in sales presentations
4. Reduce back-and-forth during content phase

## Decisions Summary

| Topic | Decision |
|-------|----------|
| Stock Photos | Unsplash API (primary) + Pexels API (fallback + videos) |
| Testimonials | AI-generated at Phase 1, based on real partner data |
| Placeholder Badges | Look real by default, toggle to show "[SAMPLE]" badges |
| Content Transition | HTML → WordPress with sample content → Client edits in Gutenberg |
| Media Library | Cache fetched images per industry for future clients |
| Stats | Client input preferred, AI estimates if missing |
| Video vs Image | Research-driven decision (defer until research complete) |
| Mobile Images | No separate assets; use responsive srcset |

---

## Phase 1A: Schema Updates

### Client Intake Schema Additions

#### New Section: `partners`

```json
{
  "partners": {
    "type": "array",
    "description": "Client's notable partners/customers for testimonial generation",
    "items": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Partner company name"
        },
        "industry": {
          "type": "string",
          "description": "Partner's industry"
        },
        "services_provided": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Services client provided to this partner"
        },
        "project_keywords": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Keywords describing projects (warehouse, residential, etc.)"
        },
        "relationship": {
          "type": "string",
          "enum": ["one-time", "recurring", "ongoing"],
          "description": "Nature of business relationship"
        },
        "can_use_as_reference": {
          "type": "boolean",
          "default": true,
          "description": "Permission to use in testimonials"
        }
      },
      "required": ["name"]
    }
  }
}
```

#### New Section: `stats`

```json
{
  "stats": {
    "type": "object",
    "description": "Company statistics for display on website",
    "properties": {
      "projects_completed": {
        "type": "integer",
        "description": "Number of projects completed"
      },
      "customer_satisfaction": {
        "type": "integer",
        "minimum": 0,
        "maximum": 100,
        "description": "Customer satisfaction percentage"
      },
      "team_size": {
        "type": "integer",
        "description": "Number of team members"
      },
      "service_area_coverage": {
        "type": "string",
        "description": "Geographic coverage description"
      },
      "certifications_count": {
        "type": "integer",
        "description": "Number of certifications/licenses"
      },
      "custom": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "value": { "type": "string" },
            "label": { "type": "string" }
          },
          "required": ["value", "label"]
        },
        "description": "Custom stats (e.g., '24/7' - 'Emergency Support')"
      }
    }
  }
}
```

#### Service Enhancement: `image_keywords`

```json
{
  "services": {
    "items": {
      "properties": {
        "image_keywords": {
          "type": "array",
          "items": { "type": "string" },
          "description": "Keywords for stock photo search"
        }
      }
    }
  }
}
```

---

## Phase 1B: Research Enhancements

### New Knowledge Base Topics

#### 1. Testimonial Best Practices

**File:** `knowledge/best-practices/content/testimonials.md`

**Research topics:**
- SEO optimization for testimonials
- Psychology of social proof
- Structure patterns that convert
- Industry-specific language
- Length recommendations
- Specificity and credibility factors

#### 2. Video vs Image Effectiveness

**File:** `knowledge/best-practices/media/video-vs-image-effectiveness.md`

**Research topics:**
- Hero section: video vs static image conversion rates
- Core Web Vitals impact (LCP with video)
- Industry-specific recommendations
- Autoplay vs click-to-play
- Mobile data/bandwidth considerations
- Peer-reviewed studies and data

#### 3. Partner Research (Runtime)

**Enhancement to research.js:**
- When partners are provided, research each company:
  - Company size/type
  - Notable projects
  - Industry context
- Used to enhance testimonial generation

---

## Phase 1C: Blueprint Generation Enhancements

### Generated Testimonials

**Input:** Partners + Services + Industry
**Output:** 3-5 realistic testimonials in blueprint

```json
{
  "content_drafts": {
    "testimonials": {
      "headline": "What Our Partners Say",
      "testimonials": [
        {
          "quote": "Anywhere Solutions handled our 45-panel warehouse installation flawlessly. Their riggers coordinated perfectly with our timeline.",
          "author_name": "Project Manager",
          "author_role": "Senior Project Manager",
          "company": "Richard Crookes Constructions",
          "project_type": "Commercial Warehouse",
          "rating": 5,
          "is_placeholder": true,
          "generated_from": "partner_data"
        }
      ]
    }
  }
}
```

**LLM Prompt Guidelines:**
- Reference specific services performed
- Include believable project details
- Use industry-appropriate language
- Follow testimonial best practices:
  - Specific results/numbers when possible
  - Mention pain point solved
  - Include emotional benefit
  - Natural conversational tone

### Generated Stats

**Input:** Client intake stats (optional) + years_in_business + industry
**Output:** Stats with estimation flags

```json
{
  "content_drafts": {
    "stats": [
      {
        "value": "500+",
        "label": "Projects Completed",
        "is_estimated": true
      },
      {
        "value": "5",
        "label": "Years Experience",
        "is_estimated": false,
        "source": "intake.company.years_in_business"
      },
      {
        "value": "98%",
        "label": "Customer Satisfaction",
        "is_estimated": true
      }
    ]
  }
}
```

### Image Keywords Extraction

**Per section, generate search keywords:**

```json
{
  "content_drafts": {
    "hero": {
      "image_keywords": ["construction site", "crane lifting", "precast concrete", "industrial building"]
    },
    "services": {
      "services": [
        {
          "name": "Precast Panel Installation",
          "image_keywords": ["crane", "concrete panels", "construction workers", "rigging"]
        }
      ]
    }
  }
}
```

---

## Phase 2A: Stock Photo Integration

### New Module: `stock-photos.js`

**Location:** `src/lib/phase2/stock-photos.js`

**Features:**
1. Unsplash API integration
2. Pexels API integration (fallback + videos)
3. Hierarchical search cascade
4. Response caching
5. Industry media library caching

**API Configuration:**
```javascript
// .env additions
UNSPLASH_ACCESS_KEY=your-access-key
PEXELS_API_KEY=your-api-key
```

**Hierarchical Search Logic:**
```javascript
async function findImage(keywords, industry, fallbackKeywords) {
  const searches = [
    keywords.join(' '),                    // 1. Specific
    `${keywords[0]} ${industry}`,          // 2. Primary + industry
    industry,                              // 3. Industry only
    fallbackKeywords?.join(' ') || 'professional business'  // 4. Generic
  ];

  for (const query of searches) {
    const results = await searchUnsplash(query, { count: 5 });
    if (results.length >= 3) {
      return selectBestMatch(results, keywords);
    }
  }

  return getLocalFallback(industry);
}
```

**Response Format:**
```javascript
{
  id: "abc123",
  url: {
    small: "https://images.unsplash.com/...?w=400",
    medium: "https://images.unsplash.com/...?w=800",
    large: "https://images.unsplash.com/...?w=1200",
    full: "https://images.unsplash.com/...?w=1920"
  },
  alt: "Construction workers installing concrete panels",
  photographer: "John Doe",
  photographer_url: "https://unsplash.com/@johndoe",
  source: "unsplash"
}
```

### Industry Media Library

**Structure:**
```
templates/
├── construction/
│   ├── industrial-modern/
│   │   └── preset.json
│   └── media/
│       ├── hero/
│       │   ├── construction-hero-01.json  (metadata)
│       │   └── construction-hero-01.jpg   (cached image)
│       ├── services/
│       ├── about/
│       └── testimonials/
│           └── avatars/
```

**Caching Strategy:**
1. First client in industry → fetch from API, save to library
2. Future clients → use cached + optionally fetch new for variety
3. Keep 3-5 variations per slot per industry

---

## Phase 2B: Preview Enhancement

### HTML Preview Generator Updates

**New Features:**
1. Fetch real stock photos via stock-photos.js
2. Generate responsive srcset
3. Add placeholder toggle (CSS class)
4. Include photo attribution

**Responsive Image Output:**
```html
<img
  src="https://images.unsplash.com/photo-xxx?w=800"
  srcset="
    https://images.unsplash.com/photo-xxx?w=400 400w,
    https://images.unsplash.com/photo-xxx?w=800 800w,
    https://images.unsplash.com/photo-xxx?w=1200 1200w,
    https://images.unsplash.com/photo-xxx?w=1920 1920w
  "
  sizes="(max-width: 768px) 100vw, 50vw"
  alt="Construction site with crane"
  loading="lazy"
  class="placeholder-image"
  data-placeholder="true"
/>
```

**Placeholder Toggle:**
```html
<!-- Toggle button in preview -->
<button onclick="togglePlaceholders()">Show/Hide Sample Badges</button>

<style>
  .placeholder-badge {
    display: none;
  }

  body.show-placeholders .placeholder-badge {
    display: block;
    position: absolute;
    top: 8px;
    right: 8px;
    background: rgba(0,0,0,0.7);
    color: white;
    padding: 4px 8px;
    font-size: 10px;
    border-radius: 4px;
  }
</style>
```

### Content Injector Updates

**New field mappings:**
- `blueprint.content_drafts.testimonials.testimonials` → testimonial cards
- `blueprint.content_drafts.stats` → stats section
- `blueprint.content_drafts.*.image_keywords` → stock photo search

---

## Phase 2C: Preset Enhancements

### Media Style in Preset

**Addition to preset.json:**
```json
{
  "id": "industrial-modern",
  "industry": "construction",
  "media_style": {
    "mood": "professional",
    "lighting": "dramatic",
    "color_tone": "cool",
    "subjects": ["machinery", "workers", "structures"],
    "avoid": ["cartoon", "clipart", "overly-staged"],
    "unsplash_collections": ["construction", "industrial"],
    "pexels_collections": ["construction"],
    "preferred_orientation": "landscape",
    "avatar_style": "professional-headshot"
  }
}
```

---

## Implementation Order

### Step 1: Schema & Documentation (This document)
- [x] Create this spec document
- [x] Update client-intake.schema.json (partial - partners, stats sections added)

### Step 2: Phase 1 Research
- [ ] Create testimonials.md knowledge file
- [ ] Create video-vs-image-effectiveness.md knowledge file
- [ ] Update research.js for partner research

### Step 3: Phase 1 Blueprint
- [ ] Update blueprint.js for testimonial generation
- [ ] Update blueprint.js for stats generation
- [ ] Update blueprint.js for image keywords extraction
- [ ] Update blueprint output schema

### Step 4: Phase 2 Stock Photos
- [x] Create stock-photos.js module (skeleton)
- [ ] Implement Unsplash API integration
- [ ] Implement Pexels API integration
- [ ] Implement hierarchical search
- [ ] Implement caching system

### Step 5: Phase 2 Preview
- [x] Create html-preview-generator.js module
- [x] Basic HTML preview with Tailwind CDN
- [ ] Update html-preview-generator.js for real images
- [ ] Add responsive srcset generation
- [ ] Add placeholder toggle
- [ ] Update content-injector.js

### Step 6: Testing
- [ ] Update Anywhere Solutions intake with partners/stats
- [ ] Run Phase 1 → Phase 2 end-to-end
- [ ] Verify HTML preview with real stock photos
- [ ] Test placeholder toggle

---

## API Keys Required

| Service | Key Name | Rate Limits |
|---------|----------|-------------|
| Unsplash | UNSPLASH_ACCESS_KEY | 50/hour (demo), 5000/hour (prod) |
| Pexels | PEXELS_API_KEY | 200/hour, 20K/month |

---

## Success Criteria

1. HTML preview shows real industry stock photos
2. Testimonials are AI-generated with real partner names
3. Stats show real or estimated values
4. Toggle shows/hides "[SAMPLE]" badges
5. Images are responsive (srcset)
6. Cached images reduce API calls for repeat industries
7. End-to-end test passes with Anywhere Solutions

---

## Future Enhancements (Out of Scope)

- Video hero backgrounds (pending research)
- Client image upload portal
- A/B testing different stock photos
- AI-powered image selection based on brand colors

---

## Related Files

- `schemas/client-intake.schema.json` - Intake schema
- `src/lib/research.js` - Research engine
- `src/lib/blueprint.js` - Blueprint generator
- `src/lib/phase2/stock-photos.js` - NEW: Stock photo API
- `src/lib/phase2/html-preview-generator.js` - Preview generator
- `src/lib/phase2/content-injector.js` - Content mapping
- `templates/*/preset.json` - Preset configurations
