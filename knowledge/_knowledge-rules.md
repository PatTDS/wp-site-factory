# WPF Knowledge Base Maintenance Rules

**Purpose:** Guidelines for Claude to maintain and grow the knowledge base across projects.

## Core Principles

1. **Research-First**: Always research best practices before generating content
2. **Permanent Growth**: Knowledge compounds - each project makes WPF smarter
3. **Quality Over Quantity**: Store insights, not raw data
4. **Source Attribution**: Always document where knowledge came from

## Adding New Content

### Required Metadata

Every knowledge file MUST include this header:

```markdown
---
section: hero | about-us | services | testimonials | contact
industry: general | roofers | schools | automotive | ...
sources:
  - url: https://example.com/source
    title: Source Title
    date_accessed: 2024-12-04
confidence: high | medium | low
last_updated: 2024-12-04
version: 1.0
---
```

### Content Structure

```markdown
# [Section Type] Best Practices for [Industry]

## Key Principles
- Bullet points of core principles

## What Works
- Patterns observed in successful examples

## What to Avoid
- Common mistakes and anti-patterns

## Examples
- Concrete examples with context

## Sources
- List of references used
```

## Updating Content

### Rules

1. **Never delete** - Mark outdated content as "superseded by X"
2. **Add update date** - Always note when and why updated
3. **Preserve history** - Keep previous versions for context
4. **Increment version** - Update version number on changes

### Update Format

```markdown
---
... existing metadata ...
last_updated: 2024-12-05
version: 1.1
update_notes: |
  - Added new pattern from competitor research
  - Updated headline formula based on A/B test data
supersedes: null | path/to/previous/version
---
```

## Quality Control

### Confidence Levels

| Level | Criteria |
|-------|----------|
| **High** | Peer-reviewed source, multiple corroborating sources, proven in practice |
| **Medium** | Reputable source, some corroboration, likely accurate |
| **Low** | Single source, anecdotal, needs verification |

### Flagging Conflicts

When research conflicts with existing knowledge:

```markdown
## Conflicts

> **CONFLICT**: This contradicts [existing file path]
> **Existing**: [summary of existing advice]
> **New Finding**: [summary of conflicting advice]
> **Recommendation**: [which to prefer and why]
> **Status**: pending_review | resolved
```

### Consolidation

Quarterly, review knowledge base for:
- Duplicate insights → merge into single authoritative source
- Outdated content (>2 years without update) → flag for review
- Low-confidence items → research for verification or removal

## Organization

### File Naming

```
best-practices/sections/{section-type}/_general.md      # Universal principles
best-practices/sections/{section-type}/by-industry/{industry}.md  # Industry-specific
industry-research/{industry}/top-competitors.md         # Competitor analysis
industry-research/{industry}/patterns.md                # Common patterns
```

### Tagging

Use consistent tags for cross-referencing:

```markdown
tags:
  - section:hero
  - industry:roofers
  - topic:headlines
  - topic:cta
  - quality:verified
```

## Growth Pattern

### After Each Project

1. **Extract insights** - What worked? What didn't?
2. **Generalize patterns** - Can this apply to other industries?
3. **Update knowledge** - Add to relevant files
4. **Cross-reference** - Link related insights

### Industry Coverage

Track coverage with this matrix:

| Industry | Hero | About | Services | Contact | Competitors |
|----------|------|-------|----------|---------|-------------|
| Roofers | | | | | |
| Schools | | | | | |
| Automotive | | | | | |
| ... | | | | | |

Goal: After 50 projects, have comprehensive coverage of 20+ industries.

## Claude Instructions

When researching for a new project:

1. **Check existing knowledge first** - Don't duplicate research
2. **Note gaps** - What's missing for this industry/section?
3. **Research to fill gaps** - Use LLM web search
4. **Store new insights** - Follow the format above
5. **Update existing** - If new info improves existing knowledge
6. **Flag conflicts** - Don't silently override existing knowledge

When generating content:

1. **Use knowledge base** - Apply stored best practices
2. **Cite sources** - Note which knowledge informed the content
3. **Note confidence** - Indicate if using high/medium/low confidence knowledge
4. **Learn from feedback** - When client revises, capture why

---

**Version**: 1.0.0
**Created**: 2024-12-04
**Maintained By**: WPF Orchestrator Module
