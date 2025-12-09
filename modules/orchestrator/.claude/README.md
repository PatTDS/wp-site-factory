# WPF Orchestrator Claude Configuration

This directory contains Claude Code Skills and MCP configuration for the WPF Orchestrator project.

## Overview

The WPF Orchestrator integrates with Claude Code through:
1. **Skills** - Specialized workflows for design and frontend development
2. **MCP Servers** - Access to external component libraries (shadcn/ui)
3. **Commands** - Reusable workflow templates

## Directory Structure

```
.claude/
├── skills/
│   ├── wpf-design-system/
│   │   └── SKILL.md          # Design tokens, anti-patterns, guidelines
│   └── wpf-frontend/
│       └── SKILL.md          # Frontend development patterns
└── commands/
    ├── generate-pattern.md   # Create new WordPress block patterns
    ├── validate-design.md    # Run anti-pattern validation
    └── export-theme.md       # Export production WordPress theme

.mcp.json                     # MCP server configuration (shadcn-ui)
```

## Skills

### wpf-design-system

**Purpose:** Enforce WPF design standards, anti-patterns, and component patterns when building UI.

**Key Features:**
- Design token naming convention (component-category-role-state)
- Banned fonts list with industry alternatives
- Color system requirements and anti-patterns
- Spacing scale and typography guidelines
- Component variants (buttons, cards, inputs)
- Accessibility requirements (WCAG AA)
- Animation guidelines

**When to Use:**
- Building WordPress block patterns or themes
- Creating landing pages for client websites
- Designing UI components for any WPF project
- Validating design choices against anti-patterns

### wpf-frontend

**Purpose:** Generate production-grade frontend code following WPF patterns for WordPress sites.

**Key Features:**
- Mobile-first responsive design patterns
- Tailwind CSS v4 usage (@theme directive)
- Component structure (WordPress block patterns)
- HTML best practices (semantic, accessibility)
- CSS patterns (layout, spacing, colors, typography)
- Component examples (buttons, cards, forms, navigation, footer)
- Animation patterns (CSS-only preferred)
- Performance optimization techniques

**When to Use:**
- Building WordPress block patterns
- Creating landing page HTML
- Developing theme templates
- Converting designs to code
- Optimizing frontend performance

## Commands

### generate-pattern.md

**Purpose:** Create new WordPress block patterns following WPF design standards.

**Process:**
1. Gather requirements (type, industry, variant, content)
2. Load WPF skills (design-system, frontend)
3. Check anti-patterns (fonts, colors, content, layout)
4. Generate pattern structure (HTML, manifest.json)
5. Apply design tokens (spacing, colors, typography)
6. Validate pattern (accessibility, performance)
7. Register pattern in library

**Usage:**
```
"Create a new hero pattern for a construction company"
"Generate a services section"
"Build a testimonials pattern"
```

### validate-design.md

**Purpose:** Run anti-pattern validation checks on existing design files.

**Checks:**
- Font validation (banned fonts: Inter, Roboto, Arial, Helvetica, Open Sans, Montserrat)
- Color validation (purple-pink gradients, neon colors)
- Layout validation (symmetric grids, perfect centering)
- Content validation (banned phrases: "Learn more", "Click here")
- Accessibility validation (WCAG AA compliance, color contrast)
- Performance validation (image optimization, render-blocking)

**Output:**
- Validation report (pass/fail/warning counts)
- Detailed issue list with line numbers
- Specific fix recommendations
- Commands to apply fixes automatically

**Usage:**
```
"Validate this design"
"Check for anti-patterns"
"Does this follow WPF standards?"
```

### export-theme.md

**Purpose:** Generate production-ready WordPress theme from WPF patterns and blueprint data.

**Process:**
1. Gather theme information (name, slug, author, description)
2. Create theme directory structure
3. Generate style.css (WordPress theme header)
4. Generate functions.php (theme setup, enqueue scripts)
5. Generate inc/block-patterns.php (pattern registration)
6. Convert patterns to PHP (register_block_pattern)
7. Generate theme.json (block editor configuration)
8. Build Tailwind CSS (compile and minify)
9. Generate screenshot (1200x900)
10. Create README.txt (WordPress format)
11. Package theme (ZIP archive)
12. Run WordPress Theme Check (validation)

**Output:**
- Theme directory: `output/theme/{theme-slug}/`
- ZIP file: `output/theme/{theme-slug}-{version}.zip`
- Installation guide
- Theme Check results

**Usage:**
```
"Export WordPress theme"
"Generate theme files"
"Create installable theme"
```

## MCP Configuration

### shadcn-ui-mcp-server

**Purpose:** Access shadcn/ui component library (40+ pre-built accessible components).

**Configuration:** `.mcp.json`
```json
{
  "mcpServers": {
    "shadcn-ui": {
      "command": "npx",
      "args": ["-y", "shadcn-ui-mcp-server"]
    }
  }
}
```

**Available Tools:**
- `browse_registry` - List all available components
- `search_component` - Search for components by name
- `get_component` - Get component code and documentation

**Usage:**
```
"Browse shadcn/ui components"
"Search for button component"
"Get accordion component code"
```

## Design System Reference

### Banned Fonts

**Never use:**
- Inter
- Roboto
- Arial
- Helvetica
- Open Sans
- Montserrat

**Industry Alternatives:**

| Industry | Heading Font | Body Font |
|----------|-------------|-----------|
| Construction | DM Sans | Source Sans 3 |
| Professional Services | Playfair Display | Lato |
| Restaurant | Cormorant Garamond | Nunito |
| Healthcare | Poppins | IBM Plex Sans |
| Technology/SaaS | Geist | Plus Jakarta Sans |
| Retail | Outfit | Work Sans |
| Creative | Sora | Plus Jakarta Sans |
| Default | Bricolage Grotesque | Instrument Sans |

### Design Token Naming

**Format:** `component-category-role-state`

**Examples:**
- `button-background-primary-hover`
- `card-border-default-focus`
- `input-text-label-disabled`

### Spacing Scale

| Name | Value | Tailwind | Usage |
|------|-------|----------|-------|
| xs | 0.25rem | space-1 | Icon gaps |
| sm | 0.5rem | space-2 | Compact layouts |
| md | 1rem | space-4 | Default padding |
| lg | 1.5rem | space-6 | Section padding |
| xl | 2rem | space-8 | Large gaps |
| 2xl | 3rem | space-12 | Hero sections |

### Color Anti-Patterns

**BANNED:**
- Purple-to-pink gradients
- Blue-to-purple gradients
- Neon colors (#ff00ff, #00ffff, #ff0000)
- Oversaturated gradients

**Why:** Associated with AI-generated "slop" aesthetics

### Content Anti-Patterns

**BANNED PHRASES:**
- "Welcome to our website"
- "Lorem ipsum"
- "Click here"
- "Learn more"
- "Read more"
- "We are a leading"
- "State-of-the-art"
- "Cutting-edge"
- "Revolutionary"
- "Game-changing"

**Alternatives:**
- "Learn more" → "See how it works" | "Get your quote"
- "Click here" → Descriptive link text
- "Welcome" → "Your trusted partner for [service]"
- "Leading" → "Serving [location] since [year]"

## Integration with Orchestrator

### Pattern Generation Workflow

1. User provides client intake data (blueprint)
2. Orchestrator calls `generate-pattern.md` command
3. Skills loaded automatically (wpf-design-system, wpf-frontend)
4. Pattern generated with:
   - Industry-specific fonts
   - Brand colors from blueprint
   - Anti-pattern validation
   - Accessibility compliance
5. Pattern registered in library
6. HTML preview generated

### Theme Export Workflow

1. User requests theme export
2. Orchestrator calls `export-theme.md` command
3. Theme structure generated from patterns
4. Tailwind CSS compiled
5. WordPress theme files created (style.css, functions.php, theme.json)
6. Theme Check validation run
7. ZIP archive created
8. Installation guide generated

### Design Validation Workflow

1. User requests design validation
2. Orchestrator calls `validate-design.md` command
3. Anti-patterns checked (fonts, colors, layout, content)
4. Accessibility validation (WCAG AA)
5. Performance validation (images, CSS, JS)
6. Validation report generated
7. Fixes suggested with commands
8. User can apply fixes automatically

## Usage Examples

### Example 1: Generate Construction Hero Pattern

**User:** "Create a hero pattern for a construction company"

**Claude:**
```
I'll create a construction hero pattern with these design decisions:

**Fonts:**
- Heading: DM Sans (bold, strong)
- Body: Source Sans 3 (professional, readable)
(Avoiding Inter/Roboto - banned AI fonts)

**Colors:**
- Background: Subtle gray-50
- Primary: Industrial blue (#0369a1)
- Accent: Safety orange (#f59e0b)

**Layout:**
- Split layout (content left, image right)
- Asymmetric for visual interest
- Mobile-first responsive

Creating pattern at:
templates/shared/patterns/hero/hero-construction-split/
```

### Example 2: Validate Design

**User:** "Validate this design for anti-patterns"

**Claude:**
```
# Design Validation Report

**Status:** FAIL (3 errors, 2 warnings)

## Errors
❌ Line 15: Using banned font "Inter"
   Fix: Replace with "DM Sans" for construction industry

❌ Line 42: Purple-to-pink gradient detected
   Fix: Use industrial blue (#0369a1) to slate (#64748b)

❌ Line 78: Color contrast too low (3.2:1, minimum 4.5:1)
   Fix: Darken text from #9ca3af to #6b7280

## Warnings
⚠️  Line 102: Generic CTA text "Learn More"
   Suggestion: "Get Free Quote in 24 Hours"

Would you like me to fix these issues automatically? (y/n)
```

### Example 3: Export Theme

**User:** "Export WordPress theme for ACME Construction"

**Claude:**
```
Generating WordPress theme:

Theme Name: ACME Construction
Theme Slug: acme-construction
Version: 1.0.0

Creating structure...
✓ style.css (theme header)
✓ functions.php (theme setup)
✓ inc/block-patterns.php (7 patterns registered)
✓ theme.json (block editor config)
✓ Tailwind CSS compiled (42KB minified)
✓ Screenshot generated (1200x900)

Running WordPress Theme Check...
✓ All checks passed

Theme exported to:
output/theme/acme-construction/
output/theme/acme-construction-1.0.0.zip (2.3MB)

Ready to install on WordPress 6.0+
```

## Best Practices

### When Creating Patterns

1. Always load wpf-design-system and wpf-frontend skills
2. Check anti-patterns before finalizing
3. Use industry-specific fonts
4. Apply design tokens consistently
5. Validate accessibility (WCAG AA)
6. Test responsive design (mobile-first)
7. Generate preview for user review

### When Validating Designs

1. Run full validation report
2. Prioritize errors over warnings
3. Provide specific line numbers and fixes
4. Show before/after examples
5. Offer to apply fixes automatically
6. Re-validate after fixes applied

### When Exporting Themes

1. Extract theme info from blueprint
2. Validate all patterns before export
3. Compile Tailwind CSS for production
4. Run WordPress Theme Check
5. Generate screenshot and README
6. Create ZIP archive
7. Test in fresh WordPress install

## Resources

**External:**
- Tailwind CSS: https://tailwindcss.com
- WordPress Block Patterns: https://developer.wordpress.org/block-editor/reference-guides/block-api/block-patterns/
- shadcn/ui: https://ui.shadcn.com
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/

**Internal:**
- Anti-patterns: `tokens/anti-patterns.json`
- Variants system: `tokens/variants.json`
- Pattern library: `templates/shared/patterns/`
- WordPress knowledge base: `~/wordpress-knowledge-base/`

## Version

- **Created:** 2025-12-09
- **Skills Version:** 1.0.0
- **MCP Config Version:** 1.0.0
- **Compatible with:** Claude Code 1.x, WPF Orchestrator Phase 2

---

**Generated by WPF Orchestrator Phase 2**
