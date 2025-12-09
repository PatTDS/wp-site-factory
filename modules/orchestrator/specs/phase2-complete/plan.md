# Implementation Plan: WPF Orchestrator Phase 2 Complete

**Feature ID**: phase2-complete
**Created**: 2025-12-09
**Approach**: Parallel execution with 4 independent agents

---

## Execution Strategy

The implementation is divided into 4 parallel workstreams that can execute independently:

```
┌─────────────────────────────────────────────────────────────┐
│                    PHASE 2 COMPLETE                          │
├─────────────┬─────────────┬─────────────┬─────────────────────┤
│  AGENT 1    │  AGENT 2    │  AGENT 3    │  AGENT 4            │
│  Skills/MCP │  Patterns A │  Patterns B │  Theme Export       │
├─────────────┼─────────────┼─────────────┼─────────────────────┤
│ SKILL.md x2 │ header x2   │ cta x2      │ functions.php       │
│ .mcp.json   │ footer x2   │ features x2 │ style.css           │
│ commands/   │             │ faq x1      │ block-patterns.php  │
│             │             │ team x1     │ build script        │
│             │             │ gallery x1  │                     │
├─────────────┼─────────────┼─────────────┼─────────────────────┤
│ ~30 min     │ ~45 min     │ ~60 min     │ ~30 min             │
└─────────────┴─────────────┴─────────────┴─────────────────────┘
```

---

## Agent 1: Skills & MCP Configuration

**Directory**: /home/atric/wp-site-factory/modules/orchestrator

### Tasks

1. **Create .claude/skills/wpf-design-system/SKILL.md**
   - Design token naming conventions
   - Banned fonts list with alternatives
   - Color system requirements
   - Spacing scale definitions
   - Typography guidelines

2. **Create .claude/skills/wpf-frontend/SKILL.md**
   - Tailwind CSS v4 patterns
   - Component structure guidelines
   - Responsive design approach
   - Accessibility requirements
   - Anti-patterns to avoid

3. **Create .mcp.json**
   - shadcn-ui-mcp-server configuration
   - Team-shareable format

4. **Create .claude/commands/**
   - generate-pattern.md
   - validate-design.md
   - export-theme.md

### Output Files
```
.claude/
├── skills/
│   ├── wpf-design-system/
│   │   └── SKILL.md
│   └── wpf-frontend/
│       └── SKILL.md
├── commands/
│   ├── generate-pattern.md
│   ├── validate-design.md
│   └── export-theme.md
.mcp.json
```

---

## Agent 2: Pattern Library A (Header & Footer)

**Directory**: /home/atric/wp-site-factory/modules/orchestrator/templates/shared/patterns

### Tasks

1. **Create header/header-simple/**
   - manifest.json with variants (transparent, solid, sticky)
   - template.php with logo, nav, mobile menu

2. **Create header/header-mega/**
   - manifest.json with mega menu configuration
   - template.php with dropdowns, search, CTA

3. **Create footer/footer-simple/**
   - manifest.json with column configuration
   - template.php with logo, links, contact, social

4. **Create footer/footer-detailed/**
   - manifest.json with multi-column setup
   - template.php with newsletter, trust badges

### Output Files
```
templates/shared/patterns/
├── header/
│   ├── header-simple/
│   │   ├── manifest.json
│   │   └── template.php
│   └── header-mega/
│       ├── manifest.json
│       └── template.php
└── footer/
    ├── footer-simple/
    │   ├── manifest.json
    │   └── template.php
    └── footer-detailed/
        ├── manifest.json
        └── template.php
```

---

## Agent 3: Pattern Library B (CTA, Features, FAQ, Team, Gallery)

**Directory**: /home/atric/wp-site-factory/modules/orchestrator/templates/shared/patterns

### Tasks

1. **Create cta/cta-banner/**
   - Full-width CTA with gradient/image variants

2. **Create cta/cta-split/**
   - Two-column CTA with form option

3. **Create features/features-grid/**
   - Icon grid with cards/minimal variants

4. **Create features/features-alternating/**
   - Alternating image/content rows

5. **Create faq/faq-accordion/**
   - Collapsible questions with animation

6. **Create team/team-grid/**
   - Team member cards with social links

7. **Create gallery/gallery-masonry/**
   - Masonry layout with lightbox

### Output Files
```
templates/shared/patterns/
├── cta/
│   ├── cta-banner/
│   └── cta-split/
├── features/
│   ├── features-grid/
│   └── features-alternating/
├── faq/
│   └── faq-accordion/
├── team/
│   └── team-grid/
└── gallery/
    └── gallery-masonry/
```

---

## Agent 4: Theme Export System

**Directory**: /home/atric/wp-site-factory/modules/orchestrator

### Tasks

1. **Create templates/theme/functions.php.template**
   - Theme setup with supports
   - Menu registration
   - Script/style enqueue
   - Block pattern includes

2. **Create templates/theme/style.css.template**
   - WordPress theme headers
   - Tailwind CSS import

3. **Create templates/theme/inc/block-patterns.php.template**
   - Pattern category registration
   - Pattern file includes

4. **Update src/lib/phase2/theme-assembler.js**
   - Add WordPress theme export function
   - Generate complete theme directory
   - Run Tailwind production build

5. **Create scripts/build-theme.js**
   - Tailwind CSS compilation
   - Asset copying
   - ZIP generation

### Output Files
```
templates/theme/
├── functions.php.template
├── style.css.template
└── inc/
    └── block-patterns.php.template

src/lib/phase2/
└── theme-exporter.js (new)

scripts/
└── build-theme.js
```

---

## Post-Implementation (Sequential)

After parallel agents complete:

1. **Integration Testing**
   - Run list-patterns to verify all patterns load
   - Run generate to test full pipeline
   - Verify HTML preview includes header/footer

2. **Content & Photos** (if time permits)
   - LLM content generation integration
   - Unsplash/Pexels API integration

3. **Testing Infrastructure** (if time permits)
   - Playwright E2E test templates
   - Lighthouse CI configuration

---

## Verification Commands

```bash
# After Agent 1 (Skills/MCP)
ls -la .claude/skills/
cat .mcp.json

# After Agent 2 (Header/Footer)
node src/commands/design.js list-patterns construction industrial-modern | grep -E "header|footer"

# After Agent 3 (CTA, Features, etc.)
node src/commands/design.js list-patterns construction industrial-modern | grep -E "cta|features|faq|team|gallery"

# After Agent 4 (Theme Export)
node scripts/build-theme.js examples/blueprint-v1.0.json ./output/theme-export
ls -la output/theme-export/
```

---

## Success Metrics

| Agent | Deliverable | Count |
|-------|-------------|-------|
| Agent 1 | SKILL.md files | 2 |
| Agent 1 | .mcp.json | 1 |
| Agent 1 | Command files | 3 |
| Agent 2 | Header patterns | 2 |
| Agent 2 | Footer patterns | 2 |
| Agent 3 | CTA patterns | 2 |
| Agent 3 | Features patterns | 2 |
| Agent 3 | FAQ patterns | 1 |
| Agent 3 | Team patterns | 1 |
| Agent 3 | Gallery patterns | 1 |
| Agent 4 | Theme templates | 3 |
| Agent 4 | Theme exporter | 1 |
| **Total** | **Files** | **21** |
