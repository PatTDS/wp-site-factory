# WPF Research Migration Plan

**Purpose:** Migrate all deep web research from WPF project to the centralized wordpress-knowledge-base
**Target:** `/home/atric/wordpress-knowledge-base/`
**Created:** 2025-12-09
**Status:** Ready for execution

---

## Executive Summary

This plan consolidates all web research conducted within the WPF (WordPress Site Factory) project into the centralized `wordpress-knowledge-base`. The research includes:

- **17 research documents** identified across branches and local folders
- **5 website sections** with general and industry-specific best practices
- **2 competitor research reports** (construction industry)
- **2 content/media guidelines** (testimonials, video vs image)
- **1 knowledge base maintenance guide**

Migration follows the **Diátaxis framework** (ref-, howto-, concept-, tutorial-) with **YAML front matter** for LLM-optimized retrieval.

---

## Source Inventory

### Branch: feature/phase1-mvp (Primary Research Source)

| File | Type | Content Summary |
|------|------|-----------------|
| `knowledge/_knowledge-rules.md` | Maintenance guide | KB contribution rules, YAML metadata format, versioning |
| `knowledge/best-practices/sections/hero/_general.md` | Best practices | General hero section patterns, headline formulas, CTAs |
| `knowledge/best-practices/sections/hero/by-industry/construction.md` | Industry research | Construction-specific hero patterns, B2B messaging |
| `knowledge/best-practices/sections/services/_general.md` | Best practices | Service presentation patterns, pricing approaches |
| `knowledge/best-practices/sections/services/by-industry/construction.md` | Industry research | B2B construction service formatting |
| `knowledge/best-practices/sections/about-us/_general.md` | Best practices | About us structure, story formulas |
| `knowledge/best-practices/sections/about-us/by-industry/construction.md` | Industry research | Construction credibility elements, trust signals |
| `knowledge/best-practices/sections/testimonials/_general.md` | Best practices | Testimonial collection, formatting |
| `knowledge/best-practices/sections/testimonials/by-industry/construction.md` | Industry research | B2B testimonial sources, alternative trust signals |
| `knowledge/best-practices/sections/contact/_general.md` | Best practices | Contact form design, response protocols |
| `knowledge/best-practices/sections/contact/by-industry/construction.md` | Industry research | B2B contact expectations, after-hours |
| `knowledge/industry-research/construction/patterns.md` | Competitor research | 10 Sydney construction company website analysis |
| `knowledge/industry-research/precast-concrete-services/patterns.md` | Niche research | Precast/rigging industry competitor analysis |

### Local Folders (Current Working Directory)

| File | Type | Content Summary |
|------|------|-----------------|
| `modules/orchestrator/knowledge/best-practices/media/video-vs-image-effectiveness.md` | Performance research | LCP impact, conversion data by industry |
| `modules/orchestrator/knowledge/best-practices/content/testimonials.md` | Content guide | Psychology, SEO, writing templates |
| `modules/orchestrator/examples/research-summary.json` | Data export | Compiled best practices JSON |
| `modules/orchestrator/examples/research-summary-anywhere-solutions.json` | Project data | Client-specific research output |

---

## Target Mapping (Diátaxis Framework)

### Category: webdesign/

| Source File | Target File | Type |
|-------------|-------------|------|
| hero/_general.md + by-industry/construction.md | `ref-hero-section-patterns.md` | Reference |
| services/_general.md + by-industry/construction.md | `ref-services-section-patterns.md` | Reference |
| about-us/_general.md + by-industry/construction.md | `ref-about-us-section-patterns.md` | Reference |
| testimonials/_general.md + by-industry/construction.md | `ref-testimonials-section-patterns.md` | Reference |
| contact/_general.md + by-industry/construction.md | `ref-contact-section-patterns.md` | Reference |
| construction/patterns.md | `ref-construction-website-research.md` | Reference |
| precast-concrete-services/patterns.md | `ref-precast-industry-patterns.md` | Reference |
| testimonials.md (content) | `howto-testimonial-content-writing.md` | How-to |

### Category: performance/

| Source File | Target File | Type |
|-------------|-------------|------|
| video-vs-image-effectiveness.md | `ref-video-vs-image-effectiveness.md` | Reference |

### Category: tools/

| Source File | Target File | Type |
|-------------|-------------|------|
| _knowledge-rules.md | `ref-knowledge-base-maintenance.md` | Reference |

---

## YAML Front Matter Template

All migrated files MUST include this front matter:

```yaml
---
title: [Descriptive Title]
category: webdesign | performance | tools | seo | testing | security
type: ref | howto | concept | tutorial
updated: 2025-12-09
version: 1.0.0
tags:
  - [relevant-tag-1]
  - [relevant-tag-2]
sources:
  - [original-source-url-1]
  - [original-source-url-2]
confidence: high | medium | low
industries:
  - general
  - construction (if applicable)
wpf_origin: feature/phase1-mvp | local | commit
---
```

### Example for Hero Section Patterns:

```yaml
---
title: Hero Section Design Patterns
category: webdesign
type: ref
updated: 2025-12-09
version: 1.0.0
tags:
  - hero-section
  - headlines
  - cta-design
  - above-the-fold
  - construction-industry
sources:
  - https://www.projectmark.com/blog/construction-website-design
  - https://www.create180design.com/12-web-design-best-practices-for-construction-company-websites/
  - https://clickysoft.com/best-practices-for-construction-company-web-design/
confidence: high
industries:
  - general
  - construction
wpf_origin: feature/phase1-mvp
---
```

---

## Migration Steps

### Phase 1: Prepare Target Folders (5 min)

```bash
# Verify target folders exist
ls -la /home/atric/wordpress-knowledge-base/webdesign/
ls -la /home/atric/wordpress-knowledge-base/performance/
ls -la /home/atric/wordpress-knowledge-base/tools/
```

### Phase 2: Extract from Branch (10 min)

```bash
# Extract all knowledge files from feature/phase1-mvp
cd /home/atric/wp-site-factory
git show feature/phase1-mvp:knowledge/_knowledge-rules.md > /tmp/knowledge-rules.md
git show feature/phase1-mvp:knowledge/best-practices/sections/hero/_general.md > /tmp/hero-general.md
git show feature/phase1-mvp:knowledge/best-practices/sections/hero/by-industry/construction.md > /tmp/hero-construction.md
# ... (repeat for all files)
```

### Phase 3: Merge and Transform (30 min)

For each section, merge general + industry-specific content:

1. **Create combined document** with YAML front matter
2. **Structure with sections:**
   - General Principles (from _general.md)
   - Industry-Specific: Construction (from by-industry/construction.md)
   - Templates and Examples
   - Sources
3. **Add cross-references** to related KB documents

### Phase 4: Copy Local Files (5 min)

```bash
# Copy local orchestrator knowledge
cp /home/atric/wp-site-factory/modules/orchestrator/knowledge/best-practices/media/video-vs-image-effectiveness.md \
   /home/atric/wordpress-knowledge-base/performance/ref-video-vs-image-effectiveness.md

cp /home/atric/wp-site-factory/modules/orchestrator/knowledge/best-practices/content/testimonials.md \
   /home/atric/wordpress-knowledge-base/webdesign/howto-testimonial-content-writing.md
```

### Phase 5: Add YAML Front Matter (20 min)

Edit each target file to add proper YAML front matter following the template above.

### Phase 6: Verify and Commit (10 min)

```bash
cd /home/atric/wordpress-knowledge-base
git status
git add .
git commit -m "feat(kb): add WPF web research - hero, services, about-us, testimonials, contact patterns"
```

---

## Target File List (Final)

After migration, the following new files will exist:

### webdesign/ (8 new files)
- `ref-hero-section-patterns.md` - Hero section best practices (general + construction)
- `ref-services-section-patterns.md` - Services section patterns (general + construction)
- `ref-about-us-section-patterns.md` - About us section patterns (general + construction)
- `ref-testimonials-section-patterns.md` - Testimonials patterns (general + construction)
- `ref-contact-section-patterns.md` - Contact section patterns (general + construction)
- `ref-construction-website-research.md` - 10 Sydney construction websites analyzed
- `ref-precast-industry-patterns.md` - Precast concrete services niche research
- `howto-testimonial-content-writing.md` - Testimonial psychology, SEO, templates

### performance/ (1 new file)
- `ref-video-vs-image-effectiveness.md` - Video vs static image performance data

### tools/ (1 new file)
- `ref-knowledge-base-maintenance.md` - KB contribution rules, YAML format, versioning

---

## Priority Order

Execute in this order for maximum value:

1. **High Priority (Essential for Phase 2)**
   - ref-hero-section-patterns.md
   - ref-services-section-patterns.md
   - ref-testimonials-section-patterns.md
   - ref-video-vs-image-effectiveness.md

2. **Medium Priority (Completes website sections)**
   - ref-about-us-section-patterns.md
   - ref-contact-section-patterns.md
   - howto-testimonial-content-writing.md

3. **Lower Priority (Industry-specific)**
   - ref-construction-website-research.md
   - ref-precast-industry-patterns.md
   - ref-knowledge-base-maintenance.md

---

## Verification Checklist

After migration, verify:

- [ ] All 10 target files exist in wordpress-knowledge-base
- [ ] Each file has proper YAML front matter
- [ ] Each file follows Diátaxis naming convention
- [ ] Sources are preserved from original research
- [ ] Cross-references to related KB documents added
- [ ] Git commit created in wordpress-knowledge-base repo
- [ ] No duplicate content (WPF originals can remain for reference)

---

## Notes

### Content Consolidation Strategy

When merging general + industry-specific files:

```markdown
# [Section] Design Patterns

## General Principles
[Content from _general.md]

## Industry-Specific: Construction
[Content from by-industry/construction.md]

## Templates
[Combined templates from both]

## Related Documents
- @ref-...
- @howto-...
```

### RAG Optimization

Based on llm-knowledge-base-guide research:
- Keep files 64-1024 tokens for optimal chunking
- Use clear H2/H3 headings for section retrieval
- Include actionable examples, not just theory
- Tag with specific industries for filtered queries

---

**Document Version:** 1.0
**Created By:** Claude Code (WPF Research Migration)
**Review Date:** 2025-12-09
