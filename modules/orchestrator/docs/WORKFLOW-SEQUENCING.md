# WPF SaaS Workflow Sequencing

**Date:** 2025-12-04
**Branch:** feature/design-first
**Status:** Analysis complete

## Overview

This document defines the complete workflow sequence for the WPF (WordPress Site Factory) SaaS, identifying where LLM intervention is required vs. where automation handles everything.

## Key Insight

From the design-first experiments, we learned:
- **Templates handle structure, not aesthetics**
- **LLM intervention is required at DESIGN stage, not CODE GENERATION stage**
- **Code should come 100% from templates (deterministic)**

## 6-Stage Workflow

```
USER INPUT
    │
    ▼
┌───────────────────────┐
│  STAGE 1: DISCOVER    │
│  wpf discover         │
├───────────────────────┤
│  Input: Questions     │
│  Output: wpf-config.yaml (basic)
│  Automation: 80%      │
└───────────────────────┘
    │
    ▼
┌───────────────────────┐
│  STAGE 2: DESIGN      │ ← LLM TOUCHPOINT 1
│  wpf design / Claude  │
├───────────────────────┤
│  Input: wpf-config.yaml
│  + industry patterns
│  + V1 design spec
│  Output: design.yaml (enhanced)
│  Automation: 20%      │
└───────────────────────┘
    │
    ▼
┌───────────────────────┐
│  STAGE 3: PREVIEW     │
│  wpf preview          │
├───────────────────────┤
│  Input: design.yaml   │
│  Output: HTML preview │
│  (Tailwind CDN)       │
│  Automation: 100%     │
└───────────────────────┘
    │
    ▼
┌───────────────────────┐
│  STAGE 4: APPROVE     │ ← LLM TOUCHPOINT 2 (if revisions)
│  Human decision       │
├───────────────────────┤
│  Approve → Stage 5    │
│  Revise → Stage 2     │
│  Automation: 0%       │
└───────────────────────┘
    │
    ▼
┌───────────────────────┐
│  STAGE 5: BUILD       │
│  wpf build            │
├───────────────────────┤
│  Input: design.yaml   │
│  Output:              │
│  - theme/             │
│  - plugin/            │
│  - docker-compose.yml │
│  - WordPress installed│
│  Automation: 100%     │
└───────────────────────┘
    │
    ▼
┌───────────────────────┐
│  STAGE 6: VALIDATE    │
│  wpf validate         │
├───────────────────────┤
│  Input: Running site  │
│  Output:              │
│  - E2E test results   │
│  - Lighthouse scores  │
│  - Compliance report  │
│  Automation: 100%     │
└───────────────────────┘
```

## LLM Touchpoints

The workflow has exactly **2 defined LLM touchpoints**, matching the 01-SPECIFY.md target of 2-3 max:

### Touchpoint 1: Design Enhancement (Stage 2)

**When:** After basic config is created
**What LLM does:**
1. Analyzes industry + brand
2. Selects appropriate sections from library (based on V1 patterns)
3. Orders sections for visual rhythm
4. Refines color palette (primary→secondary→accent harmony)
5. Chooses typography weights
6. Selects animation profiles

**Output:** Enhanced design.yaml with all creative decisions made

### Touchpoint 2: Revision Handling (Stage 4, if needed)

**When:** User requests changes to preview
**What LLM does:**
1. Interprets feedback ("make hero bigger", "different colors")
2. Modifies design.yaml appropriately
3. Triggers re-preview

**Output:** Revised design.yaml

## CLI Commands

| Stage | Command | Input | Output |
|-------|---------|-------|--------|
| 1 | `wpf discover <name>` | Questions | wpf-config.yaml |
| 2 | `wpf design <name>` | wpf-config.yaml | design.yaml |
| 3 | `wpf preview <name>` | design.yaml | HTML preview |
| 4 | `wpf approve <name>` | Preview | .approved marker |
| 5 | `wpf build <name>` | design.yaml | WordPress site |
| 6 | `wpf validate <name>` | Running site | Reports |

## Data Files

### wpf-config.yaml (Stage 1 output)
Basic configuration from user input:
- Company info
- Contact details
- Brand colors (basic)
- Page list
- Feature requests

### design.yaml (Stage 2 output)
Enhanced configuration with design decisions:
- Section selections with variants
- Section ordering
- Refined color palette
- Typography scale
- Animation profiles
- Spacing adjustments
- Component configurations

## Component Status

| Stage | Component | Status |
|-------|-----------|--------|
| 1 | Discovery prompts | EXISTS |
| 1 | CLI wizard | NEEDS |
| 2 | V1-DESIGN-SPEC.md | EXISTS |
| 2 | Industry presets | EXISTS |
| 2 | Design enhancement prompts | NEEDS |
| 2 | design.yaml schema | NEEDS |
| 3 | Component HTML templates | EXISTS |
| 3 | Preview generator | NEEDS |
| 3 | Preview server | NEEDS |
| 4 | Approval workflow | NEEDS |
| 5 | EJS templates | EXISTS |
| 5 | Docker templates | EXISTS |
| 5 | WP auto-configuration | NEEDS |
| 6 | Playwright tests | EXISTS |
| 6 | Compliance checker | NEEDS |
| 6 | Lighthouse integration | NEEDS |

**Overall Completion: ~35%**

## Implementation Priority

Based on analysis, recommended build sequence:

### Phase 1: Design Enhancement (Stage 2) - HIGHEST PRIORITY
- Create design.yaml schema
- Build LLM prompt templates referencing V1-DESIGN-SPEC.md
- Implement section selection logic
- **Why first:** Key differentiator that makes WPF output quality

### Phase 2: Preview System (Stage 3)
- Build HTML preview generator
- Implement Tailwind CDN injection
- Create local preview server
- **Why second:** Enables rapid iteration without full WordPress

### Phase 3: Build Automation (Stage 5)
- Complete template engine
- Implement WordPress auto-configuration
- Add WP-CLI automation
- **Why third:** Already 60% complete

### Phase 4: Validation (Stage 6)
- Implement compliance checker
- Add Lighthouse CI integration
- **Why fourth:** Quality assurance layer

### Phase 5: Discovery & Approval (Stages 1, 4)
- Polish wizard UX
- Add approval workflow
- **Why last:** Can work manually for now

## Design Principles

### LLM Intervention Scope
- LLM makes **creative decisions** (what, how much, what order)
- LLM **never writes code** (all code from templates)
- LLM uses **V1 patterns** as reference (documented in V1-DESIGN-SPEC.md)

### Automation Targets
- Stage 1: 80% (wizard handles most)
- Stage 2: 20% (LLM required for quality)
- Stage 3: 100% (deterministic preview)
- Stage 4: 0% (human approval)
- Stage 5: 100% (deterministic build)
- Stage 6: 100% (automated tests)

### Quality Gates
- Stage 2→3: Valid design.yaml schema
- Stage 4→5: Explicit user approval
- Stage 5→6: WordPress running
- Stage 6→Done: All tests pass, Lighthouse > 70, Compliance 100%

## References

- `docs/V1-DESIGN-SPEC.md` - Design patterns from handcrafted benchmark
- `docs/DESIGN-SYSTEM-FINDINGS.md` - Experiment results
- `openspec/wpf-v2/01-SPECIFY.md` - Vision document
- `examples/full.wpf-config.yaml` - Configuration format

---

*This document defines the complete workflow for WPF SaaS implementation.*
