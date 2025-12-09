# Feature Specification: WPF Orchestrator Phase 2 Complete Implementation

**Feature ID**: phase2-complete
**Status**: Draft
**Created**: 2025-12-09
**Last Updated**: 2025-12-09
**Branch**: 002-phase2-design-draft

---

## Problem Statement

The WPF Orchestrator Phase 2 (Design Draft) is partially implemented with basic pattern loading, template selection, and HTML preview generation. However, it lacks critical features identified in deep research:

1. **Missing Page Sections**: No header/navigation or footer patterns - generated pages are incomplete
2. **No AI Workflow Integration**: Missing SKILL.md files for Claude Code integration
3. **Limited Component Access**: No MCP server configuration for shadcn/ui component library
4. **Incomplete Theme Export**: Cannot generate production-ready WordPress themes
5. **Manual Content**: No LLM integration for automated copywriting
6. **Placeholder Images**: No stock photo API integration for real imagery
7. **No Quality Assurance**: Missing Playwright E2E and Lighthouse CI testing

## Business Value

- **Complete Page Generation**: Full websites with header, content sections, and footer
- **Production-Ready Output**: Installable WordPress themes with functions.php, style.css
- **AI-First Workflow**: Claude Code skills for consistent, high-quality design generation
- **Component Library Access**: shadcn/ui MCP for 40+ pre-built accessible components
- **Automated Content**: LLM-generated copy reduces manual writing by 80%
- **Professional Imagery**: Stock photo integration eliminates placeholder graphics
- **Quality Assurance**: Automated testing ensures Lighthouse 70+ scores

## Target Users

### Primary: WordPress Agency Developer
- Creates 5-20 WordPress sites monthly
- Values speed and consistency
- Uses Claude Code for development
- Needs production-ready theme output

### Secondary: Solo Web Designer
- Limited development experience
- Needs guided workflow
- Values design quality over customization
- Uses visual tools (Figma) for design input

---

## User Scenarios & Testing

### Scenario 1: Complete Page Generation

**As a** WordPress developer
**I want to** generate a complete page with header, content, and footer
**So that** I have a full website preview, not just content sections

**Acceptance Criteria**:
- Generated HTML includes navigation header
- Generated HTML includes footer with contact info and links
- Header uses blueprint company name and navigation items
- Footer uses blueprint contact details and social links
- Mobile-responsive navigation (hamburger menu)

### Scenario 2: AI-Assisted Design Workflow

**As a** Claude Code user
**I want to** have WPF skills loaded automatically when working on design tasks
**So that** Claude follows WPF patterns and anti-patterns consistently

**Acceptance Criteria**:
- SKILL.md files in .claude/skills/ directory
- Skills load when user mentions "design", "component", "pattern"
- Anti-patterns enforced (banned fonts, color schemes)
- Design tokens applied consistently
- Component patterns match research best practices

### Scenario 3: shadcn/ui Component Access

**As a** developer building UI
**I want to** access shadcn/ui components via MCP
**So that** Claude can generate accessible, production-ready components

**Acceptance Criteria**:
- .mcp.json configured with shadcn-ui-mcp-server
- Claude can browse component registry
- Claude can search for components by name
- Generated code uses proper shadcn/ui patterns
- Components are accessible (ARIA attributes)

### Scenario 4: WordPress Theme Export

**As a** WordPress developer
**I want to** export a complete WordPress theme
**So that** I can install it directly on a WordPress site

**Acceptance Criteria**:
- Generates style.css with proper WordPress theme headers
- Generates functions.php with theme setup
- Generates block patterns PHP registration
- Includes Tailwind CSS production build
- Theme passes WordPress theme check plugin
- Theme activates without errors

### Scenario 5: Automated Content Generation

**As a** designer without copywriting skills
**I want to** generate professional copy from blueprint data
**So that** I don't need to write content manually

**Acceptance Criteria**:
- LLM generates hero headlines and subheadlines
- LLM generates service descriptions from names
- LLM generates about section copy from company info
- LLM generates CTA text optimized for conversion
- Content matches industry tone (construction = professional, saas = friendly)

### Scenario 6: Stock Photo Integration

**As a** developer generating previews
**I want to** have real images instead of placeholders
**So that** clients see realistic mockups

**Acceptance Criteria**:
- Unsplash API integration for hero images
- Pexels API as fallback
- Industry-specific image selection (construction = machinery, saas = laptops)
- Automatic image attribution in footer
- Images cached locally for offline use

### Scenario 7: Quality Assurance

**As a** developer delivering sites
**I want to** run automated tests on generated themes
**So that** I ensure quality before client delivery

**Acceptance Criteria**:
- Playwright E2E tests for navigation, forms, links
- Lighthouse CI configuration for performance testing
- Performance score target: 70+
- Accessibility score target: 90+
- Tests run via npm test command

---

## Technical Requirements

### A. Skills Integration

**Research Source**: claude-code-skills-mcp-design-research.md

#### A1. WPF Design System Skill
```
Location: .claude/skills/wpf-design-system/SKILL.md
Purpose: Enforce design tokens, anti-patterns, component patterns
```

**Required Content**:
- Design token naming convention (component-category-role-state)
- Banned fonts list (Inter, Roboto, Arial, Helvetica, Open Sans, Montserrat)
- Industry-specific font alternatives
- Color system requirements
- Spacing scale (xs, sm, md, lg, xl)
- Typography guidelines

#### A2. WPF Frontend Skill
```
Location: .claude/skills/wpf-frontend/SKILL.md
Purpose: Frontend development patterns and code generation
```

**Required Content**:
- Tailwind CSS v4 patterns (@theme directive)
- Component structure (Tailwind utility classes only)
- Responsive design approach (mobile-first)
- Animation patterns (CSS-only preferred)
- Accessibility requirements (WCAG AA)
- What to AVOID (generic AI aesthetics)

#### A3. Claude Commands
```
Location: .claude/commands/
Purpose: Reusable workflow templates
```

**Required Commands**:
- generate-pattern.md - Create new pattern from description
- validate-design.md - Run anti-pattern validation
- export-theme.md - Export WordPress theme
- preview-page.md - Generate HTML preview

### B. MCP Configuration

**Research Source**: claude-code-skills-mcp-design-research.md

#### B1. Project MCP Configuration
```
Location: .mcp.json
Purpose: Team-shareable MCP server configuration
```

**Required Servers**:
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

### C. Pattern Library Expansion

**Research Source**: Frontend Design Skill, claude-code-webdesign-research.md

#### C1. Header Patterns (Shared)

**Pattern: header-simple**
- Logo left, nav center/right
- Mobile hamburger menu
- Variants: transparent, solid, sticky

**Pattern: header-mega**
- Logo left, mega menu dropdowns
- Search icon, CTA button
- Mobile drawer navigation

#### C2. Footer Patterns (Shared)

**Pattern: footer-simple**
- 3-4 column layout
- Logo, nav links, contact info, social icons
- Copyright bar

**Pattern: footer-detailed**
- Multi-column with categories
- Newsletter signup
- Trust badges
- Sitemap links

#### C3. CTA Patterns (Shared)

**Pattern: cta-banner**
- Full-width background
- Headline, subtext, button
- Variants: gradient, image, solid

**Pattern: cta-split**
- Two-column layout
- Content left, form right
- Variants: image background, solid

#### C4. Features Patterns (Shared)

**Pattern: features-grid**
- 3-4 column grid
- Icon, title, description
- Variants: cards, minimal, with images

**Pattern: features-alternating**
- Alternating image/content rows
- Large feature images
- Detailed descriptions

#### C5. FAQ Pattern (Shared)

**Pattern: faq-accordion**
- Collapsible questions
- Smooth animations
- Variants: simple, with categories

#### C6. Team Pattern (Shared)

**Pattern: team-grid**
- Photo, name, title
- Social links
- Variants: 3-col, 4-col, with bio

#### C7. Gallery Pattern (Shared)

**Pattern: gallery-masonry**
- Masonry layout
- Lightbox on click
- Filter by category

### D. Theme Export

**Research Source**: WordPress Knowledge Base, howto-development-environment.md

#### D1. functions.php Template
```php
<?php
/**
 * Theme Functions
 * Generated by WPF Orchestrator
 */

// Theme setup
function {{theme_slug}}_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form', 'gallery', 'caption']);
    add_theme_support('editor-styles');
    add_theme_support('wp-block-styles');

    register_nav_menus([
        'primary' => __('Primary Menu', '{{theme_slug}}'),
        'footer' => __('Footer Menu', '{{theme_slug}}'),
    ]);
}
add_action('after_setup_theme', '{{theme_slug}}_setup');

// Enqueue styles
function {{theme_slug}}_scripts() {
    wp_enqueue_style('{{theme_slug}}-style', get_stylesheet_uri(), [], '1.0.0');
}
add_action('wp_enqueue_scripts', '{{theme_slug}}_scripts');

// Register block patterns
require get_template_directory() . '/inc/block-patterns.php';
```

#### D2. style.css Template
```css
/*
Theme Name: {{theme_name}}
Theme URI: {{theme_uri}}
Author: {{author}}
Author URI: {{author_uri}}
Description: {{description}}
Version: 1.0.0
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 8.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: {{theme_slug}}
*/

/* Tailwind CSS output goes here */
@import url('./assets/css/tailwind.css');
```

#### D3. Block Patterns Registration
```php
<?php
// inc/block-patterns.php
function {{theme_slug}}_register_block_patterns() {
    register_block_pattern_category('{{theme_slug}}', [
        'label' => __('{{theme_name}}', '{{theme_slug}}'),
    ]);

    // Register each pattern
    foreach (glob(get_template_directory() . '/patterns/*.php') as $pattern) {
        require $pattern;
    }
}
add_action('init', '{{theme_slug}}_register_block_patterns');
```

### E. Content Generation

**Research Source**: claude-code-webdesign-research.md

#### E1. LLM Integration
- Use Claude API for content generation
- Industry-specific tone mapping
- SEO-optimized headlines
- Conversion-focused CTAs

#### E2. Content Types
- Hero headlines and subheadlines
- Service descriptions (from names)
- About section narrative
- Testimonial enhancement
- CTA copy variations

### F. Stock Photo Integration

**Research Source**: RESEARCH-tech-stack-recommendations.md

#### F1. Unsplash API
- API key configuration in .env
- Industry keyword mapping
- Orientation preference (landscape for hero)
- Attribution tracking

#### F2. Pexels API (Fallback)
- Secondary source when Unsplash fails
- Same keyword mapping
- Rate limit handling

#### F3. Image Selection Logic
```javascript
const industryKeywords = {
  construction: ['construction site', 'crane', 'workers', 'building'],
  saas: ['laptop', 'team meeting', 'office', 'technology'],
  restaurant: ['food', 'dining', 'chef', 'restaurant interior'],
  healthcare: ['doctor', 'medical', 'hospital', 'care'],
};
```

### G. Testing Infrastructure

**Research Source**: howto-playwright-wordpress.md, ref-performance-targets.md

#### G1. Playwright E2E Tests
```javascript
// tests/e2e/theme.spec.js
test('navigation works', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('nav')).toBeVisible();
  await page.click('nav a:first-child');
  await expect(page).not.toHaveURL('/');
});

test('contact form displays', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.locator('form')).toBeVisible();
});
```

#### G2. Lighthouse CI Configuration
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:8080/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.7 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
  },
};
```

---

## Implementation Phases

### Phase A: Skills & MCP (Foundation)
- Create SKILL.md files
- Configure .mcp.json
- Create Claude commands
- **Parallel Agent**: skills-agent

### Phase B: Pattern Library (Critical Path)
- Create header patterns (2)
- Create footer patterns (2)
- Create CTA patterns (2)
- Create features patterns (2)
- Create FAQ pattern
- Create team pattern
- Create gallery pattern
- **Parallel Agent**: patterns-agent

### Phase C: Theme Export (Output)
- Create functions.php template
- Create style.css template
- Create block patterns registration
- Create Tailwind build script
- **Parallel Agent**: theme-agent

### Phase D: Content & Media (Enhancement)
- Integrate LLM content generation
- Integrate Unsplash API
- Integrate Pexels API
- **Parallel Agent**: content-agent

### Phase E: Testing (Quality)
- Create Playwright test templates
- Create Lighthouse CI config
- **Parallel Agent**: testing-agent

---

## Success Criteria

| Metric | Target |
|--------|--------|
| Pattern count (shared) | 15+ |
| Pattern categories | 10+ (hero, services, about, contact, testimonials, header, footer, cta, features, faq, team, gallery) |
| Theme export success | 100% |
| Lighthouse performance | 70+ |
| Lighthouse accessibility | 90+ |
| SKILL.md files | 2+ |
| MCP servers configured | 1+ |
| Playwright tests | 5+ |

---

## Dependencies

### External APIs
- Unsplash API (requires API key)
- Pexels API (requires API key)
- Claude API (for content generation)

### NPM Packages
- shadcn-ui-mcp-server
- @playwright/test
- lighthouse

### Existing Code
- pattern-loader.js (extend)
- template-selector.js (extend)
- theme-assembler.js (extend)
- html-preview-generator.js (extend)

---

## Out of Scope

- Figma MCP integration (requires user Figma account)
- Multi-language content generation
- E-commerce patterns (WooCommerce)
- Custom plugin generation
- Hosting deployment automation

---

## Appendix: Research Documents

1. **claude-code-skills-mcp-design-research.md** - Skills system, MCP configuration, workflow patterns
2. **claude-code-webdesign-research.md** - Claude Code capabilities, frontend design skill
3. **RESEARCH-tech-stack-recommendations.md** - Optimal tech stack (Tailwind, shadcn/ui, Vite)
4. **howto-playwright-wordpress.md** - E2E testing setup
5. **ref-performance-targets.md** - Lighthouse score targets
6. **howto-security-hardening.md** - WordPress security requirements
