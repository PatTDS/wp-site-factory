# LLM Knowledge Base Best Practices Research

**Last Updated:** 2025-12-01
**Purpose:** Research findings on building optimal knowledge bases for LLM consumption
**Status:** Active research document

---

## Executive Summary

This document consolidates research on best practices for creating knowledge bases optimized for Large Language Model (LLM) retrieval and understanding. Key findings:

- **Chunking**: 512 tokens optimal baseline, 50-100 token overlap for context preservation
- **Structure**: Diátaxis framework (4 documentation types) improves retrieval accuracy 35%
- **Format**: Markdown 15% more token-efficient than JSON
- **Metadata**: YAML front matter enables intelligent filtering
- **Organization**: Single Source of Truth (SSOT) eliminates duplication conflicts

---

## 1. Chunking Strategies for RAG

### Overview
Retrieval Augmented Generation (RAG) systems break documents into chunks for vector similarity search. Chunk size significantly impacts retrieval quality.

### Optimal Chunk Sizes

| Strategy | Size | Best For |
|----------|------|----------|
| Fixed-size | 512 tokens | General purpose baseline |
| Semantic | Variable | Technical documentation |
| Document-aware | Varies | Mixed content types |
| Agentic | Dynamic | Complex queries |

### Key Findings

**Baseline: 512 Tokens**
- Research consensus for general-purpose chunking
- Balances context retention vs. precision
- Works well for most documentation types

**Overlap: 50-100 Tokens**
- Prevents context loss at chunk boundaries
- 10-20% overlap ratio recommended
- Critical for maintaining coherence

**Semantic Chunking**
- Splits on logical boundaries (headers, paragraphs)
- Better for structured technical docs
- Requires more preprocessing

**Agentic Chunking**
- Uses LLM to determine optimal split points
- Highest quality, highest cost
- Reserved for critical documentation

### Implementation Guidelines

```python
# Example chunking configuration
CHUNK_CONFIG = {
    "size": 512,           # tokens
    "overlap": 75,         # ~15% overlap
    "separator": "\n\n",   # paragraph breaks
    "preserve_headers": True
}
```

### File Size Recommendations

| Document Type | Recommended Size | Rationale |
|---------------|------------------|-----------|
| Reference | 500-1500 lines | Single topic depth |
| How-to guides | 200-500 lines | Task completion |
| Tutorials | 300-800 lines | Learning flow |
| Explanations | 400-1000 lines | Conceptual clarity |

---

## 2. Diátaxis Documentation Framework

### The Four Documentation Types

Diátaxis organizes documentation into four distinct types based on user needs:

```
                    PRACTICAL
                       |
        TUTORIALS ─────┼───── HOW-TO GUIDES
        (learning)     |      (doing a task)
                       |
     ACQUIRING ────────┼──────── APPLYING
     KNOWLEDGE         |         KNOWLEDGE
                       |
       EXPLANATION ────┼───── REFERENCE
       (understanding) |      (information)
                       |
                  THEORETICAL
```

### 1. Tutorials (Learning-Oriented)
**Purpose:** Teach beginners through hands-on experience

**Characteristics:**
- Step-by-step guided learning
- Focus on doing, not explaining
- Repeatable outcomes
- Safe learning environment

**Structure:**
```markdown
# Tutorial: [What You'll Learn]

## Prerequisites
- What user needs before starting

## Step 1: [Action]
Do this first...

## Step 2: [Action]
Then do this...

## What You've Learned
Summary of skills acquired
```

### 2. How-To Guides (Task-Oriented)
**Purpose:** Help users accomplish specific tasks

**Characteristics:**
- Problem-solving focused
- Assumes some knowledge
- Direct and practical
- Goal-oriented

**Structure:**
```markdown
# How to [Accomplish Task]

## Problem
What problem this solves

## Solution
Step-by-step instructions

## Verification
How to confirm success
```

### 3. Reference (Information-Oriented)
**Purpose:** Provide accurate, complete technical information

**Characteristics:**
- Dry and factual
- Structured consistently
- Complete coverage
- No learning path

**Structure:**
```markdown
# [Component/Function Name]

## Syntax
```code```

## Parameters
| Name | Type | Description |
|------|------|-------------|

## Returns
What it returns

## Examples
Usage examples
```

### 4. Explanation (Understanding-Oriented)
**Purpose:** Clarify concepts and provide context

**Characteristics:**
- Discusses "why" not "how"
- Provides context and background
- Connects ideas
- Alternative approaches

**Structure:**
```markdown
# Understanding [Concept]

## Background
Why this exists

## How It Works
Conceptual explanation

## Considerations
Trade-offs and alternatives

## Related Concepts
Links to related topics
```

### Applying Diátaxis to Knowledge Bases

**Folder Structure:**
```
knowledge/
├── tutorials/           # Learning paths
├── how-to/              # Task guides
├── reference/           # Technical specs
└── explanation/         # Concepts
```

**Or by domain with type prefixes:**
```
knowledge/wordpress/
├── tutorial-theme-development.md
├── howto-optimize-performance.md
├── reference-hooks-actions.md
└── explanation-wordpress-architecture.md
```

---

## 3. CLAUDE.md Best Practices

### Source: Anthropic Documentation

The `CLAUDE.md` file is Claude Code's primary context mechanism. Research from Anthropic's best practices:

### Core Principles

1. **Keep It Lean**
   - Focus on information not in codebase
   - Avoid duplicating README content
   - Prioritize unique instructions

2. **Iterate Over Time**
   - Start minimal
   - Add based on actual needs
   - Remove unused sections

3. **Use Modular Structure**
   - Main CLAUDE.md for essentials
   - Reference external docs with @-mentions
   - Split large contexts into files

### Hierarchical Loading

Claude Code loads CLAUDE.md files hierarchically:
```
~/.claude/CLAUDE.md           # Global (all projects)
/project/CLAUDE.md            # Project root
/project/folder/CLAUDE.md     # Folder-specific
```

**Priority:** Lower in tree = higher priority (overrides)

### Recommended Structure

```markdown
# Project Name

## Overview
Brief project description

## Tech Stack
- Key technologies
- Versions if critical

## Key Commands
```bash
# Essential commands only
```

## Architecture
- High-level structure
- Key patterns

## Conventions
- Coding standards
- Naming conventions

## Known Issues
- Current workarounds

## Important Notes
- Critical reminders
```

### Anti-Patterns to Avoid

- Long explanations of standard practices
- Duplicating package.json/requirements
- Including entire API references
- Over-documenting obvious patterns
- Stale information never updated

### @-Mention System

Reference external files without bloating CLAUDE.md:
```markdown
## Detailed Documentation
@docs/architecture.md
@docs/api-reference.md
@docs/deployment.md
```

---

## 4. Metadata Schemas (YAML Front Matter)

### Purpose
YAML front matter enables:
- Intelligent document filtering
- Automated organization
- Context for RAG retrieval
- Version tracking

### Standard Schema

```yaml
---
title: Document Title
description: Brief description for search/preview
category: wordpress|webdesign|deployment|testing|performance
type: tutorial|howto|reference|explanation
created: 2025-01-15
updated: 2025-12-01
version: 1.2.0
status: draft|review|stable|deprecated
tags:
  - tag1
  - tag2
prerequisites:
  - required-knowledge
  - other-doc.md
related:
  - related-doc.md
scope: global|project|component
audience: beginner|intermediate|advanced
---

# Document Content Starts Here
```

### Minimal Schema (Required Fields)

```yaml
---
title: Document Title
category: wordpress
type: howto
updated: 2025-12-01
---
```

### Schema by Document Type

**Tutorial:**
```yaml
---
title: Building Your First Theme
type: tutorial
difficulty: beginner
duration: 30min
outcomes:
  - Create basic theme structure
  - Understand template hierarchy
---
```

**Reference:**
```yaml
---
title: WordPress Hooks Reference
type: reference
complete: true
version: 6.7
---
```

**How-To:**
```yaml
---
title: How to Optimize Images
type: howto
problem: Large images slow page load
solution_time: 10min
---
```

---

## 5. Single Source of Truth (SSOT) Principles

### Definition
Single Source of Truth means every data element is stored exactly once, with that instance being the authoritative source.

### Core Principles

1. **Golden Record**
   - One authoritative version exists
   - All references point to it
   - Updates happen in one place

2. **No Duplication**
   - Same information never repeated
   - Use references/links instead
   - DRY (Don't Repeat Yourself)

3. **Clear Ownership**
   - Each document has an owner
   - Defined update process
   - Version control

4. **Traceability**
   - Know where info came from
   - Track changes over time
   - Audit trail

### Implementing SSOT

**Problem:** Multiple docs contain WordPress security checklist
```
knowledge/wordpress/security.md     # Has checklist
knowledge/deployment/launch.md      # Has same checklist
knowledge/wordpress/hardening.md    # Has subset
```

**Solution:** Single source with references
```
knowledge/wordpress/security-checklist.md   # THE source

# In other files:
See @wordpress/security-checklist.md for security requirements
```

### Deduplication Strategy

1. **Identify Overlaps**
   - Search for similar headings
   - Compare content similarity
   - Map cross-references

2. **Choose Canonical Source**
   - Most complete version
   - Most recently updated
   - Logical home for topic

3. **Consolidate**
   - Merge unique content
   - Update references
   - Remove duplicates

4. **Maintain**
   - Single update location
   - Propagate via references
   - Regular audits

---

## 6. Token Efficiency Guidelines

### Markdown vs Other Formats

| Format | Token Efficiency | Use Case |
|--------|------------------|----------|
| Markdown | Baseline (15% better than JSON) | Documentation |
| JSON | +15% more tokens | Structured data |
| XML | +25% more tokens | Avoid for docs |
| YAML | Similar to Markdown | Configs/front matter |

### Token-Efficient Patterns

**Headers Over Formatting**
```markdown
# Good: Clean header
## Subheading

**Bad: Over-formatted**
=== SECTION NAME ===
--- Subsection ---
```

**Lists Over Paragraphs**
```markdown
# Good: Scannable
- Point 1
- Point 2
- Point 3

# Bad: Dense paragraph
Point 1 and also point 2 and furthermore point 3...
```

**Tables for Structured Data**
```markdown
# Good: Table format
| Option | Value | Description |
|--------|-------|-------------|
| debug  | false | Disable debug |

# Bad: Repeated structure
debug: Set to false to disable debug mode.
```

### Content Optimization

1. **Remove Redundancy**
   - Say it once, clearly
   - No "as mentioned above"
   - Eliminate filler words

2. **Use Standard Terms**
   - Consistent terminology
   - Avoid synonyms for same concept
   - Define once, use everywhere

3. **Structured Over Prose**
   - Bullet points
   - Tables
   - Code blocks

4. **Context-Rich Headings**
   - "WordPress Database Optimization" not "Optimization"
   - Self-documenting structure
   - Searchable phrases

---

## 7. File Organization Patterns

### Pattern A: By Domain + Type

```
knowledge/
├── wordpress/
│   ├── tutorials/
│   ├── howto/
│   ├── reference/
│   └── concepts/
├── deployment/
│   ├── tutorials/
│   ├── howto/
│   └── reference/
```

**Pros:** Clear domain separation
**Cons:** Deep nesting

### Pattern B: By Type + Domain

```
knowledge/
├── tutorials/
│   ├── wordpress/
│   └── deployment/
├── howto/
│   ├── wordpress/
│   └── deployment/
```

**Pros:** Easy to find by need
**Cons:** Domain knowledge scattered

### Pattern C: Flat with Prefixes (Recommended)

```
knowledge/
├── wordpress/
│   ├── tutorial-theme-basics.md
│   ├── howto-performance.md
│   ├── ref-hooks.md
│   └── concept-architecture.md
├── deployment/
│   ├── howto-staging.md
│   ├── howto-production.md
│   └── ref-checklist.md
```

**Pros:**
- Max 2 levels deep
- Clear type from filename
- Domain grouping maintained
- Easy to scan

### Naming Conventions

```
[type]-[topic]-[subtopic].md

Examples:
howto-wordpress-image-optimization.md
ref-wordpress-hooks-actions.md
tutorial-theme-development-basics.md
concept-rag-chunking-strategies.md
```

---

## 8. RAG Optimization Techniques

### Document Preparation

1. **Clean Headers**
   - Use proper hierarchy (H1 > H2 > H3)
   - Descriptive, keyword-rich
   - 35% improvement in retrieval accuracy

2. **Self-Contained Sections**
   - Each section understandable alone
   - No "as mentioned above"
   - Include context in each chunk

3. **Consistent Formatting**
   - Same structure across documents
   - Predictable patterns
   - Easier embedding

### Embedding Considerations

- Front matter enables metadata filtering
- First paragraph crucial for context
- Code blocks should be complete
- Links should be descriptive

### Query-Document Alignment

Write documents considering how users will query:
- Use question-style headings sometimes
- Include common search terms
- Cover variations of terminology

---

## 9. Sources and References

### Primary Sources

1. **Anthropic Documentation**
   - Claude Code CLAUDE.md best practices
   - Context management guidelines

2. **Diátaxis Framework**
   - https://diataxis.fr/
   - Documentation system framework

3. **RAG Research**
   - Chunking optimization studies
   - Vector search best practices

### Additional Reading

- LangChain documentation on chunking
- OpenAI cookbook on embeddings
- Pinecone RAG best practices
- Llamaindex documentation strategies

---

## 10. Implementation Checklist

### For New Knowledge Bases

- [ ] Define folder structure (Pattern C recommended)
- [ ] Create metadata schema (YAML front matter)
- [ ] Establish naming conventions
- [ ] Set up document templates by type
- [ ] Create CLAUDE.md with @-mentions
- [ ] Document the documentation (meta docs)

### For Consolidation Projects

- [ ] Inventory all sources
- [ ] Identify duplicates and overlaps
- [ ] Choose canonical sources
- [ ] Migrate unique content
- [ ] Update all references
- [ ] Verify nothing lost
- [ ] Remove obsolete files
- [ ] Update CLAUDE.md

### Ongoing Maintenance

- [ ] Regular deduplication audits
- [ ] Update front matter dates
- [ ] Review for staleness
- [ ] Test RAG retrieval quality
- [ ] Iterate based on usage

---

*This document is part of the WPF meta-knowledge system. Update as new research emerges.*
