# WordPress Knowledge Base Architecture Blueprint

**Last Updated:** 2025-12-01
**Purpose:** Consolidation plan for WordPress knowledge into LLM-optimized structure
**Status:** Blueprint - Ready for implementation

---

## Overview

This document defines the target architecture for consolidating WordPress development knowledge from three scattered sources into a single, LLM-optimized knowledge base within the WPF repository.

### Current State

| Location | Content | Estimated Overlap |
|----------|---------|-------------------|
| Windows Desktop | Research docs, early materials | ~30% |
| WSL WordPress-Knowledge-Base | Structured docs (context, reference, workflows) | ~50% |
| WPF repo knowledge/ | Organized by category | Canonical |

### Target State

Single unified knowledge base in `/home/atric/wp-site-factory/knowledge/` following Diátaxis framework with YAML front matter.

---

## 1. Target Folder Structure

```
knowledge/
├── meta/                           # Meta-knowledge (this document)
│   ├── llm-knowledge-base-research.md
│   └── wordpress-kb-architecture.md
│
├── wordpress/                      # WordPress-specific knowledge
│   ├── tutorial-theme-development.md
│   ├── tutorial-plugin-development.md
│   ├── howto-performance-optimization.md
│   ├── howto-security-hardening.md
│   ├── howto-debugging.md
│   ├── ref-hooks-actions.md
│   ├── ref-coding-standards.md
│   ├── ref-plugin-configurations.md
│   ├── concept-architecture.md
│   ├── concept-theme-plugin-pattern.md
│   └── lessons-learned.md          # Project insights
│
├── webdesign/                      # Design knowledge
│   ├── howto-tailwind-wordpress.md
│   ├── howto-responsive-layouts.md
│   ├── ref-color-systems.md
│   ├── ref-typography.md
│   ├── concept-modern-backgrounds.md
│   └── concept-component-design.md
│
├── deployment/                     # Deployment workflows
│   ├── howto-staging-deployment.md
│   ├── howto-production-deployment.md
│   ├── howto-rollback.md
│   ├── ref-deployment-checklist.md
│   └── concept-blue-green.md
│
├── performance/                    # Performance optimization
│   ├── howto-lighthouse-optimization.md
│   ├── howto-image-optimization.md
│   ├── howto-caching.md
│   ├── ref-performance-targets.md
│   └── concept-core-web-vitals.md
│
└── testing/                        # Testing strategies
    ├── howto-e2e-testing.md
    ├── howto-performance-testing.md
    ├── howto-accessibility-testing.md
    ├── ref-test-patterns.md
    └── lessons-learned.md
```

---

## 2. File Naming Convention

```
[type]-[topic]-[subtopic].md
```

### Type Prefixes

| Prefix | Diátaxis Type | Purpose |
|--------|---------------|---------|
| `tutorial-` | Tutorial | Step-by-step learning |
| `howto-` | How-To | Task completion guides |
| `ref-` | Reference | Technical specifications |
| `concept-` | Explanation | Understanding concepts |

### Exceptions

- `lessons-learned.md` - Project insights (no prefix)
- `index.md` - Category overview if needed

### Examples

```
howto-wordpress-image-optimization.md
ref-wordpress-hooks-actions.md
tutorial-theme-development-basics.md
concept-rag-chunking-strategies.md
```

---

## 3. YAML Front Matter Schema

### Required Fields

```yaml
---
title: Human-readable document title
category: wordpress|webdesign|deployment|performance|testing|meta
type: tutorial|howto|reference|explanation
updated: YYYY-MM-DD
---
```

### Full Schema

```yaml
---
title: Document Title
description: Brief description for search/preview (optional)
category: wordpress
type: howto
created: 2025-01-15
updated: 2025-12-01
version: 1.0.0
status: stable
tags:
  - optimization
  - performance
  - lighthouse
prerequisites:
  - Basic WordPress knowledge
  - Docker environment setup
related:
  - howto-caching.md
  - ref-performance-targets.md
scope: wpf
audience: intermediate
---
```

### Status Values

- `draft` - Work in progress
- `review` - Ready for review
- `stable` - Production ready
- `deprecated` - Outdated, pending removal

---

## 4. Document Templates

### How-To Template

```markdown
---
title: How to [Task]
category: [category]
type: howto
updated: YYYY-MM-DD
---

# How to [Task]

## Problem

What problem this solves.

## Prerequisites

- Required knowledge or setup

## Solution

### Step 1: [Action]

Details...

### Step 2: [Action]

Details...

## Verification

How to confirm success.

## Troubleshooting

Common issues and fixes.

## Related

- Related documents
```

### Reference Template

```markdown
---
title: [Component] Reference
category: [category]
type: reference
updated: YYYY-MM-DD
---

# [Component] Reference

## Overview

Brief description.

## [Section]

### [Item]

| Property | Value | Description |
|----------|-------|-------------|
| name | value | description |

## Examples

```code
example
```

## See Also

- Related references
```

### Tutorial Template

```markdown
---
title: Tutorial: [Learning Goal]
category: [category]
type: tutorial
updated: YYYY-MM-DD
difficulty: beginner|intermediate|advanced
duration: estimated time
---

# Tutorial: [Learning Goal]

## What You'll Learn

- Outcome 1
- Outcome 2

## Prerequisites

- Required knowledge

## Step 1: [Action]

Do this...

## Step 2: [Action]

Then this...

## Summary

What you've learned.

## Next Steps

Where to go from here.
```

### Explanation Template

```markdown
---
title: Understanding [Concept]
category: [category]
type: explanation
updated: YYYY-MM-DD
---

# Understanding [Concept]

## Background

Why this exists, history.

## How It Works

Conceptual explanation.

## Key Principles

1. Principle one
2. Principle two

## Trade-offs

Considerations and alternatives.

## Related Concepts

Links to related explanations.
```

---

## 5. CLAUDE.md Strategy

### Project CLAUDE.md Structure

```markdown
# WPF - WordPress Site Factory

## Overview
Brief description

## Quick Start
Essential commands only

## Knowledge Base
@knowledge/wordpress/
@knowledge/deployment/
@knowledge/performance/
@knowledge/testing/
@knowledge/webdesign/

## Key Files
- templates/
- prompts/
- cli/

## Conventions
Critical patterns only

## Important Notes
Project-specific reminders
```

### Avoid in CLAUDE.md

- Full documentation (use @-mentions)
- Standard practices (should be in knowledge base)
- Redundant explanations
- Stale information

---

## 6. Consolidation Plan

### Phase 1: Inventory (1 hour)

1. List all files in each source:
   - Windows Desktop folder
   - WSL WordPress-Knowledge-Base
   - WPF knowledge/

2. Create mapping spreadsheet:
   - Source file
   - Target category
   - Target filename
   - Content type (Diátaxis)
   - Overlap assessment

### Phase 2: Deduplication (2-3 hours)

1. Identify duplicate/overlapping content
2. Choose canonical version (most complete, recent)
3. Note unique content from each duplicate

### Phase 3: Migration (3-4 hours)

For each document:
1. Create new file with correct name
2. Add YAML front matter
3. Migrate content
4. Apply template structure
5. Update internal links/references

### Phase 4: Verification (1 hour)

1. Verify all content migrated
2. Check no duplicates remain
3. Test @-mentions work
4. Update CLAUDE.md references
5. Archive original sources

### Phase 5: Cleanup

1. Remove obsolete files from sources
2. Create redirects if needed
3. Update any external references
4. Document migration in changelog

---

## 7. Content Migration Mapping

### From: WordPress-Knowledge-Base/

| Source | Target | Action |
|--------|--------|--------|
| context/architecture.md | wordpress/concept-architecture.md | Migrate |
| reference/troubleshooting.md | wordpress/howto-debugging.md | Convert to howto |
| reference/best-practices.md | Split by topic | Decompose |
| workflows/deployment.md | deployment/howto-*.md | Split |
| workflows/plugin-setup.md | wordpress/ref-plugin-configurations.md | Migrate |

### From: WPF knowledge/ (Already in place)

| Current | Target | Action |
|---------|--------|--------|
| wordpress/best-practices.md | wordpress/ref-coding-standards.md | Rename |
| wordpress/lessons-learned.md | wordpress/lessons-learned.md | Keep |
| wordpress/performance-optimization.md | performance/howto-lighthouse-optimization.md | Move |
| testing/testing-guide.md | testing/howto-e2e-testing.md | Rename |
| deployment/deployment.md | deployment/howto-staging-deployment.md | Rename/split |

### From: Windows Desktop

| Source Pattern | Target | Action |
|----------------|--------|--------|
| Research docs | Assess individually | Merge or archive |
| Design references | webdesign/*.md | Migrate relevant |
| Notes | Extract valuable, discard rest | Selective |

---

## 8. Quality Criteria

### Per Document

- [ ] YAML front matter present and valid
- [ ] Follows appropriate template
- [ ] Self-contained (no "as mentioned above")
- [ ] Clear, descriptive headings
- [ ] Code examples complete and tested
- [ ] No duplicate content elsewhere
- [ ] Internal links verified

### Per Category

- [ ] Complete coverage of topic
- [ ] Consistent naming convention
- [ ] No more than 15-20 files
- [ ] Clear document relationships

### Overall

- [ ] Single source of truth achieved
- [ ] CLAUDE.md references all categories
- [ ] No orphaned documents
- [ ] Migration documented

---

## 9. Maintenance Guidelines

### Adding New Content

1. Determine Diátaxis type
2. Use appropriate template
3. Add complete front matter
4. Place in correct category
5. Update related docs if needed

### Updating Existing Content

1. Update `updated` date in front matter
2. Maintain template structure
3. Check for affected related docs
4. Consider version bump if major

### Periodic Review (Monthly)

- Check for stale content
- Verify links still work
- Look for duplication creep
- Update front matter dates

---

## 10. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Total files | < 50 | Count |
| Max folder depth | 2 levels | Structure |
| Duplicate content | 0% | Audit |
| Front matter compliance | 100% | Validation |
| Broken internal links | 0 | Link check |
| Avg doc length | 300-800 lines | Analysis |

---

*This blueprint guides the WordPress knowledge base consolidation. Execute phases sequentially, verify at each stage.*
