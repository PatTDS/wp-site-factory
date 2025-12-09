# Phase 2: Complete Orchestrator Implementation
## Feature Specification

**Version:** 2.0.0
**Status:** Specification
**Created:** 2025-12-09
**Branch:** 002-phase2-design-draft

---

## Executive Summary

Transform WPF orchestrator from basic pattern system to production-ready website generator with Claude Code integration, MCP tooling, complete pattern library, WordPress theme export, and automated content generation.

**Current State:**
- ✅ Pattern loader with shared pattern support
- ✅ Anti-pattern validator (banned fonts, auto-fix)
- ✅ Design tokens with validation
- ✅ 11 patterns (8 industry + 3 shared)
- ✅ Blueprint generator (Phase 1)

**Target State:**
- 🎯 Claude Code Skills integration (SKILL.md files)
- 🎯 MCP servers (shadcn/ui, CSS, stock photos)
- 🎯 Complete pattern library (18+ patterns total)
- 🎯 WordPress theme export (.zip with functions.php, style.css, block patterns)
- 🎯 LLM content generation
- 🎯 Stock photo API integration
- 🎯 Testing infrastructure (Playwright, Lighthouse CI)

---

## Research Findings Summary

### 1. Skills System Requirements
**Source:** `claude-code-skills-mcp-design-research.md`

**What are Skills?**
- SKILL.md files containing procedural knowledge (how to do tasks)
- YAML frontmatter with metadata
- Progressive disclosure: ~100 tokens metadata, <5k tokens full content
- Loaded automatically by Claude Code when relevant

**Structure:**
```yaml
---
name: "WPF Design System"
description: "Generate production-ready WordPress sites with distinctive design"
tags: ["wordpress", "design-system", "tailwind", "web-design"]
version: "1.0.0"
---

# Instructions
[Markdown content with step-by-step procedures]
```

**Required Skills for WPF:**
1. **WPF Design System** (`.claude/skills/wpf-design-system/SKILL.md`)
   - Pattern selection logic
   - Anti-pattern validation
   - Design token generation
   - Industry-specific guidelines

2. **WPF Frontend Development** (`.claude/skills/wpf-frontend/SKILL.md`)
   - Tailwind CSS best practices
   - shadcn/ui component usage
   - WordPress block patterns
   - Responsive design patterns

### 2. MCP Integration Requirements
**Source:** `claude-code-skills-mcp-design-research.md`

**What is MCP?**
Model Context Protocol - standardized connections to external tools and data sources

**Required MCP Servers:**
1. **shadcn/ui MCP** (npm package: `@modelcontextprotocol/server-shadcn`)
   - Component registry access
   - Natural language installation: "add a button component"
   - Pattern browsing and search

2. **CSS MCP** (community: `css-mcp-server`)
   - MDN documentation access
   - CSS analysis (150+ metrics)
   - Pattern detection and optimization

3. **Stock Photos MCP** (custom implementation)
   - Unsplash API integration
   - Pexels API integration
   - Semantic search by industry/mood

**Configuration File:** `.mcp.json`
```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-shadcn"]
    },
    "css": {
      "command": "npx",
      "args": ["-y", "css-mcp-server"]
    },
    "photos": {
      "command": "node",
      "args": ["./mcp-servers/stock-photos.js"]
    }
  }
}
```

### 3. Design Philosophy
**Source:** `claude-code-webdesign-research.md`

**Core Principles:**
- **Avoid Generic AI Aesthetics**: No clichéd gradients, overused fonts, predictable layouts
- **Distinctive Design**: Bold choices, industry-appropriate personality
- **Purpose-Driven**: Every design decision tied to business goals

**Anti-Patterns (Enforced):**
- ❌ **Banned Fonts**: Inter, Roboto, Arial, Helvetica, Open Sans, Montserrat
- ❌ **Generic Layouts**: Standard hero → 3 cards → CTA
- ❌ **Clichéd Colors**: Blue gradients, purple accents without reason

**Design Process:**
1. **Purpose**: What problem does this website solve?
2. **Tone**: How should the brand feel? (Professional, Bold, Friendly, etc.)
3. **Constraints**: Technical limitations, existing brand guidelines
4. **Differentiation**: What makes this site stand out?

### 4. Tech Stack Recommendations
**Source:** `RESEARCH-tech-stack-recommendations.md`

**Optimal Stack (Confidence Levels):**
- **Framework**: Next.js 15 (95% confidence) - best ecosystem, V0 integration
- **Styling**: Tailwind CSS v4 (98% confidence) - 3.5x faster builds, @theme directive
- **Components**: shadcn/ui (95% confidence) - MCP integration, component ownership
- **Build Tool**: Vite (90% confidence) - fast HMR, optimal for development
- **Language**: TypeScript (95% confidence) - type safety, better DX

**Project Structure:**
```
project/
├── CLAUDE.md           # Project instructions (MANDATORY)
├── .mcp.json          # MCP server configuration
├── .claude/
│   ├── skills/        # SKILL.md files
│   └── commands/      # Slash commands
├── src/
│   ├── app/           # Next.js app directory
│   ├── components/    # shadcn/ui components
│   └── lib/           # Utilities
└── tailwind.config.ts # Tailwind v4 with @theme
```

### 5. Figma → Code Workflow
**Source:** `claude-code-webdesign-research.md`

**Figma MCP Server:**
- Extract design tokens (colors, typography, spacing)
- Export components as React code
- Validate design system consistency

**Workflow:**
1. Designer creates mockups in Figma
2. Claude Code extracts tokens via MCP
3. Generate Tailwind config from tokens
4. Create shadcn/ui components from Figma components
5. Validate against anti-patterns

---

## Implementation Scope

### Category A: Skills Integration (3 items)

#### A1. WPF Design System Skill
**File:** `.claude/skills/wpf-design-system/SKILL.md`

**Purpose:** Guide Claude Code through WPF design system usage

**Content Sections:**
1. Pattern Selection Logic
   - Industry → Preset → Pattern hierarchy
   - Shared vs industry-specific patterns
   - Fallback mechanism

2. Anti-Pattern Validation
   - Banned fonts list with reasoning
   - Industry-specific alternatives
   - Auto-fix procedures

3. Design Token Generation
   - Component-Category-Role-State naming
   - Tailwind v4 @theme directive
   - Token validation rules

4. Industry Guidelines
   - Construction: DM Sans, bold typography, high-contrast
   - Healthcare: Plus Jakarta Sans, trust signals, accessibility
   - Professional Services: Source Sans 3, clean hierarchy

**Acceptance Criteria:**
- [ ] SKILL.md file created with YAML frontmatter
- [ ] All 4 content sections complete
- [ ] File size <5KB (progressive disclosure)
- [ ] Tags include: wordpress, design-system, tailwind

#### A2. WPF Frontend Development Skill
**File:** `.claude/skills/wpf-frontend/SKILL.md`

**Purpose:** Best practices for WordPress frontend development

**Content Sections:**
1. Tailwind CSS Best Practices
   - Utility-first approach
   - Custom utilities vs @apply
   - Responsive design patterns
   - Dark mode implementation

2. shadcn/ui Component Usage
   - Installation procedures
   - Customization patterns
   - Composition examples
   - Accessibility considerations

3. WordPress Block Patterns
   - Block pattern registration
   - PHP template structure
   - Dynamic content integration
   - Preview generation

4. Performance Optimization
   - Critical CSS extraction
   - Tailwind purge configuration
   - Image optimization
   - Lazy loading patterns

**Acceptance Criteria:**
- [ ] SKILL.md file created with YAML frontmatter
- [ ] All 4 content sections complete
- [ ] Code examples included
- [ ] Tags include: wordpress, tailwind, shadcn-ui, frontend

#### A3. Slash Commands
**Directory:** `.claude/commands/`

**Commands to Create:**
1. `/wpf-design-validate` - Run anti-pattern validation
2. `/wpf-pattern-add` - Add new pattern to library
3. `/wpf-theme-export` - Export WordPress theme .zip
4. `/wpf-preview-generate` - Generate HTML preview

**Command Structure (example):**
```markdown
---
description: Validate design against anti-patterns
tags: [design, validation]
---

# Validate WPF Design

Run anti-pattern validation on current pattern:

1. Check for banned fonts
2. Validate color contrast
3. Check layout patterns
4. Generate validation report
```

**Acceptance Criteria:**
- [ ] 4 command files created
- [ ] Each has description and tags
- [ ] Clear step-by-step instructions
- [ ] Examples included

---

### Category B: MCP Configuration (1 item)

#### B1. MCP Server Configuration
**File:** `.mcp.json`

**Required MCP Servers:**
1. **shadcn/ui MCP**: Component registry access
2. **CSS MCP**: MDN docs and CSS analysis
3. **Stock Photos MCP**: Unsplash/Pexels integration (custom)

**Configuration:**
```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-shadcn"],
      "description": "shadcn/ui component registry"
    },
    "css": {
      "command": "npx",
      "args": ["-y", "css-mcp-server"],
      "description": "CSS documentation and analysis"
    },
    "photos": {
      "command": "node",
      "args": ["./mcp-servers/stock-photos.js"],
      "env": {
        "UNSPLASH_API_KEY": "${UNSPLASH_API_KEY}",
        "PEXELS_API_KEY": "${PEXELS_API_KEY}"
      },
      "description": "Stock photo APIs (Unsplash + Pexels)"
    }
  }
}
```

**Custom Stock Photos MCP Server:**
**File:** `mcp-servers/stock-photos.js`

**Functionality:**
- Search Unsplash by keyword/industry
- Search Pexels by keyword/industry
- Download and cache images
- Generate alt text suggestions
- Track attribution requirements

**API Methods:**
- `searchPhotos(query, industry, count)` - Search both APIs
- `downloadPhoto(photoId, size)` - Download specific size
- `getAttribution(photoId)` - Get photographer credit

**Acceptance Criteria:**
- [ ] .mcp.json created with 3 servers
- [ ] Stock photos MCP server implemented
- [ ] Environment variables documented
- [ ] Test with `mcp list` command

---

### Category C: Pattern Library Expansion (7 items)

**Priority:** Header and Footer are CRITICAL (appear on every page)

#### C1. Header Patterns (2 variants) - CRITICAL
**Directory:** `templates/shared/patterns/header/`

**Variant 1: header-centered**
- Centered logo
- Horizontal navigation
- CTA button (right side)
- Mobile hamburger menu
- Sticky on scroll

**Variant 2: header-split**
- Logo left, navigation right
- Mega menu support
- Search bar
- Contact info (phone/email)
- Mobile drawer

**Files per variant:**
- `manifest.json` - Configuration (logo position, menu style, sticky behavior)
- `template.php` - WordPress block template
- `preview.html` - Standalone preview

**Acceptance Criteria:**
- [ ] 2 header variants created
- [ ] Mobile-responsive
- [ ] Sticky header option
- [ ] Accessible navigation (ARIA labels)

#### C2. Footer Patterns (2 variants) - CRITICAL
**Directory:** `templates/shared/patterns/footer/`

**Variant 1: footer-columns**
- 4-column layout (About, Services, Quick Links, Contact)
- Social media icons
- Newsletter signup
- Copyright + legal links
- Back to top button

**Variant 2: footer-centered**
- Centered logo
- Single row navigation
- Social icons centered
- Minimalist design
- Copyright only

**Files per variant:**
- `manifest.json` - Column configuration, social links, newsletter
- `template.php` - WordPress block template
- `preview.html` - Standalone preview

**Acceptance Criteria:**
- [ ] 2 footer variants created
- [ ] Newsletter integration ready
- [ ] Social icons configurable
- [ ] Legal links section

#### C3. CTA Patterns (2 variants) - HIGH
**Directory:** `templates/shared/patterns/cta/`

**Variant 1: cta-banner**
- Full-width banner
- Background image with overlay
- Headline + subheadline
- Primary button
- Optional secondary button

**Variant 2: cta-box**
- Contained box with border
- Icon or image
- Headline + description
- Button centered
- Can be inline in content

**Configuration Options:**
- Background style (image, gradient, solid)
- Button style (primary, secondary, ghost)
- Alignment (left, center, right)
- Size (small, medium, large)

**Acceptance Criteria:**
- [ ] 2 CTA variants created
- [ ] Background options implemented
- [ ] Button variants supported
- [ ] Responsive scaling

#### C4. Features Grid Pattern - HIGH
**Directory:** `templates/shared/patterns/features/`

**Variant: features-grid**
- 3-column grid (responsive to 1 column mobile)
- Icon + heading + description per feature
- 6-9 features typical
- Optional "View All" CTA

**Configuration:**
- Grid columns (2, 3, 4)
- Icon style (outlined, filled, custom)
- Card style (bordered, shadowed, flat)
- Feature count

**Acceptance Criteria:**
- [ ] Features grid pattern created
- [ ] Flexible column count
- [ ] Icon options (local or CDN)
- [ ] Responsive grid

#### C5. FAQ Accordion Pattern - MEDIUM
**Directory:** `templates/shared/patterns/faq/`

**Variant: faq-accordion**
- Collapsible questions
- Smooth expand/collapse animation
- Optional search/filter
- Category grouping option

**Configuration:**
- Open first item by default
- Allow multiple open
- Show category headers
- Custom colors

**Acceptance Criteria:**
- [ ] FAQ accordion pattern created
- [ ] Smooth animations
- [ ] Keyboard accessible
- [ ] Works without JavaScript (progressive enhancement)

#### C6. Team Grid Pattern - MEDIUM
**Directory:** `templates/shared/patterns/team/`

**Variant: team-grid**
- Photo + name + title + bio
- Social links per team member
- 2-4 column grid
- Hover effects

**Configuration:**
- Grid columns
- Photo shape (circle, square, rounded)
- Show/hide bio
- Social icons included

**Acceptance Criteria:**
- [ ] Team grid pattern created
- [ ] Photo placeholders
- [ ] Social links optional
- [ ] Hover state designed

#### C7. Gallery Pattern - MEDIUM
**Directory:** `templates/shared/patterns/gallery/`

**Variant: gallery-masonry**
- Masonry grid layout
- Lightbox on click
- Caption support
- Lazy loading

**Configuration:**
- Grid columns (2, 3, 4)
- Aspect ratio options
- Lightbox enabled
- Caption position

**Acceptance Criteria:**
- [ ] Gallery pattern created
- [ ] Masonry layout working
- [ ] Lightbox integration ready
- [ ] Lazy loading configured

---

### Category D: Theme Export (3 items)

#### D1. functions.php Template
**File:** `templates/theme/functions.php`

**Required Functions:**
1. Theme setup (`after_setup_theme` hook)
   - Add theme support (title-tag, post-thumbnails, html5, custom-logo)
   - Register navigation menus
   - Set content width

2. Enqueue scripts and styles
   - Tailwind CSS (production build)
   - Custom JavaScript (deferred)
   - Google Fonts (if not banned)

3. Widget areas registration
   - Footer columns
   - Sidebar (if applicable)

4. Block pattern registration
   - Register all WPF patterns
   - Set pattern categories

5. Customizer options
   - Primary color
   - Secondary color
   - Logo upload
   - Social links

**Acceptance Criteria:**
- [ ] functions.php template created
- [ ] All 5 function groups implemented
- [ ] Follows WordPress Coding Standards
- [ ] Comments explain each section

#### D2. style.css Template
**File:** `templates/theme/style.css`

**WordPress Theme Headers:**
```css
/*
Theme Name: {{COMPANY_NAME}} Theme
Theme URI: https://{{DOMAIN}}
Author: WPF
Author URI: https://wp-site-factory.com
Description: Custom WordPress theme generated by WPF
Version: 1.0.0
Requires at least: 6.0
Tested up to: 6.7
Requires PHP: 8.0
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: {{PROJECT_NAME}}
Tags: custom-background, custom-logo, custom-menu, featured-images, threaded-comments, translation-ready
*/

/* Tailwind CSS will be injected below this comment */
```

**Build Process:**
1. Start with header comment
2. Append production Tailwind build
3. Minify (optional)

**Acceptance Criteria:**
- [ ] style.css template with WP headers
- [ ] Placeholder replacement working
- [ ] Build script integrates Tailwind output
- [ ] Minification option available

#### D3. Block Patterns Registration
**File:** `templates/theme/inc/block-patterns.php`

**Purpose:** Register all WPF patterns as WordPress block patterns

**Structure:**
```php
<?php
/**
 * Register WPF Block Patterns
 */

function wpf_register_block_patterns() {
    // Register pattern categories
    register_block_pattern_category('wpf-hero', [
        'label' => __('WPF Hero Sections', 'textdomain')
    ]);

    // Register individual patterns
    register_block_pattern('wpf/hero-fullwidth', [
        'title'       => __('Hero Fullwidth', 'textdomain'),
        'description' => __('Full-width hero with overlay', 'textdomain'),
        'content'     => wpf_get_pattern_content('hero-fullwidth'),
        'categories'  => ['wpf-hero'],
        'keywords'    => ['hero', 'header', 'banner']
    ]);

    // ... repeat for all patterns
}
add_action('init', 'wpf_register_block_patterns');
```

**Auto-generation:**
- Scan `templates/shared/patterns/` and industry patterns
- Generate registration code for each
- Include manifest metadata (title, description, keywords)

**Acceptance Criteria:**
- [ ] Block patterns registration file created
- [ ] Auto-generates from pattern manifests
- [ ] Pattern categories registered
- [ ] Patterns appear in Gutenberg inserter

---

### Category E: Content Generation (1 item)

#### E1. LLM Content Integration
**File:** `src/lib/phase2/content-generator.js`

**Purpose:** Generate website copy using LLM (Claude API)

**Functionality:**
1. **Page Content Generation**
   - Input: Industry, company info, page type (home, about, services)
   - Output: Headline, subheadline, body copy, CTA text

2. **SEO Meta Generation**
   - Input: Page content
   - Output: Meta title, meta description, keywords

3. **Alt Text Generation**
   - Input: Image context (pattern, industry)
   - Output: Descriptive alt text

**API Integration:**
```javascript
import Anthropic from '@anthropic-ai/sdk';

export async function generatePageContent(options) {
    const { industry, companyName, pageType, brandTone } = options;

    const prompt = `Generate ${pageType} page content for ${companyName},
    a ${industry} business. Tone: ${brandTone}.

    Return JSON with:
    - headline (max 10 words)
    - subheadline (max 20 words)
    - bodyCopy (3-4 paragraphs)
    - ctaText (max 5 words)`;

    const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }]
    });

    return JSON.parse(response.content[0].text);
}
```

**Caching Strategy:**
- Cache generated content by industry + pageType
- Allow regeneration on demand
- Store in `generated-content/` directory

**Acceptance Criteria:**
- [ ] content-generator.js implemented
- [ ] Claude API integration working
- [ ] Page content generation tested
- [ ] SEO meta generation tested
- [ ] Alt text generation tested
- [ ] Caching implemented

---

### Category F: Stock Photos (1 item)

#### F1. Stock Photo API Integration
**File:** `src/lib/phase2/stock-photos.js`

**Purpose:** Search and download stock photos from Unsplash and Pexels

**API Keys Required:**
- Unsplash API key (free tier: 50 requests/hour)
- Pexels API key (free tier: 200 requests/hour)

**Functionality:**
1. **Search by Industry**
   - Input: Industry (construction, healthcare, etc.)
   - Output: Array of photo objects with URLs, attribution

2. **Search by Keyword**
   - Input: Keyword (team, office, product, etc.)
   - Output: Array of photo objects

3. **Download Photo**
   - Input: Photo ID, size (thumbnail, small, medium, large)
   - Output: Local file path, attribution text

4. **Attribution Tracking**
   - Store photographer name and profile URL
   - Generate attribution HTML snippet

**Implementation:**
```javascript
export class StockPhotoService {
    constructor(unsplashKey, pexelsKey) {
        this.unsplash = new UnsplashAPI(unsplashKey);
        this.pexels = new PexelsAPI(pexelsKey);
    }

    async searchByIndustry(industry, count = 10) {
        const keywords = this.getIndustryKeywords(industry);
        const results = await Promise.all([
            this.unsplash.search(keywords, count),
            this.pexels.search(keywords, count)
        ]);
        return this.mergeResults(results);
    }

    async downloadPhoto(photo, size = 'large') {
        const filename = `${photo.id}-${size}.jpg`;
        const filepath = path.join(CACHE_DIR, filename);

        if (fs.existsSync(filepath)) {
            return { path: filepath, attribution: photo.attribution };
        }

        await this.download(photo.urls[size], filepath);
        return { path: filepath, attribution: photo.attribution };
    }
}
```

**MCP Server Integration:**
Create custom MCP server (`mcp-servers/stock-photos.js`) that exposes:
- `searchPhotos` tool
- `downloadPhoto` tool
- `getAttribution` tool

**Acceptance Criteria:**
- [ ] stock-photos.js implemented
- [ ] Unsplash API integration working
- [ ] Pexels API integration working
- [ ] Photo download and caching
- [ ] Attribution tracking
- [ ] MCP server created and tested

---

### Category G: Testing (2 items)

#### G1. Playwright E2E Tests
**Directory:** `tests/e2e/`

**Test Suites:**
1. **Pattern Generation** (`pattern-generation.spec.js`)
   - Test pattern loading (industry + shared)
   - Test anti-pattern validation
   - Test design token generation
   - Test HTML preview generation

2. **Theme Export** (`theme-export.spec.js`)
   - Test functions.php generation
   - Test style.css generation
   - Test block patterns registration
   - Test .zip creation

3. **Content Generation** (`content-generation.spec.js`)
   - Test LLM API calls
   - Test content caching
   - Test SEO meta generation

**Configuration:**
```javascript
// playwright.config.js
export default defineConfig({
    testDir: './tests/e2e',
    timeout: 30000,
    use: {
        headless: true,
        viewport: { width: 1280, height: 720 }
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
    ]
});
```

**Acceptance Criteria:**
- [ ] 3 test suites created
- [ ] All critical paths covered
- [ ] Tests pass locally
- [ ] CI integration ready

#### G2. Lighthouse CI Configuration
**File:** `.lighthouserc.json`

**Purpose:** Automated performance testing for generated sites

**Configuration:**
```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:8080"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.7}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

**Targets:**
- Performance: > 70
- Accessibility: > 90
- SEO: > 90

**Acceptance Criteria:**
- [ ] .lighthouserc.json created
- [ ] Performance targets configured
- [ ] CI integration working
- [ ] Reports generated

---

## Parallel Execution Plan

**Strategy:** Split work across 5 tmux agents for maximum efficiency

### Agent 1: Skills & MCP Configuration
**Items:** A1, A2, A3, B1 (4 items)

**Tasks:**
1. Create `.claude/skills/wpf-design-system/SKILL.md`
2. Create `.claude/skills/wpf-frontend/SKILL.md`
3. Create 4 slash commands in `.claude/commands/`
4. Create `.mcp.json` with 3 servers
5. Implement `mcp-servers/stock-photos.js`

**Estimated Time:** 2-3 hours

### Agent 2: Pattern Library A (Header, Footer)
**Items:** C1, C2 (2 items - CRITICAL)

**Tasks:**
1. Create 2 header variants (centered, split)
2. Create 2 footer variants (columns, centered)
3. Generate manifest.json + template.php for each
4. Create HTML previews

**Estimated Time:** 2-3 hours

### Agent 3: Pattern Library B (CTA, Features, FAQ, Team, Gallery)
**Items:** C3, C4, C5, C6, C7 (5 items)

**Tasks:**
1. Create 2 CTA variants (banner, box)
2. Create features grid pattern
3. Create FAQ accordion pattern
4. Create team grid pattern
5. Create gallery masonry pattern

**Estimated Time:** 3-4 hours

### Agent 4: Theme Export System
**Items:** D1, D2, D3 (3 items)

**Tasks:**
1. Create `functions.php` template with 5 function groups
2. Create `style.css` template with WP headers
3. Create `inc/block-patterns.php` with auto-generation
4. Create theme .zip export script

**Estimated Time:** 2-3 hours

### Agent 5: Content & Stock Photos
**Items:** E1, F1 (2 items)

**Tasks:**
1. Implement `content-generator.js` with Claude API
2. Implement `stock-photos.js` with Unsplash + Pexels APIs
3. Create caching systems
4. Integrate with orchestrator

**Estimated Time:** 2-3 hours

### Agent 6: Testing Infrastructure (Optional - can run later)
**Items:** G1, G2 (2 items)

**Tasks:**
1. Create 3 Playwright test suites
2. Configure Lighthouse CI
3. Set up CI integration

**Estimated Time:** 1-2 hours

---

## Acceptance Criteria

### Functional Requirements
- [ ] All 18 items implemented across 7 categories
- [ ] Skills system working (SKILL.md files loaded by Claude Code)
- [ ] MCP servers configured and responding
- [ ] 18+ patterns available (11 existing + 7 new)
- [ ] WordPress theme export generates valid .zip
- [ ] LLM content generation working
- [ ] Stock photo integration functional
- [ ] E2E tests passing
- [ ] Lighthouse CI reporting

### Technical Requirements
- [ ] All code follows WPF coding standards
- [ ] No warnings in pattern validation
- [ ] Anti-pattern validation catches banned fonts
- [ ] Design tokens validate successfully
- [ ] File sizes optimized (<5KB for SKILL.md)
- [ ] API keys secured in .env files

### Documentation Requirements
- [ ] Each pattern has manifest.json + template.php
- [ ] Skills have clear step-by-step instructions
- [ ] MCP servers documented in .mcp.json comments
- [ ] README updated with new features
- [ ] CLAUDE.md updated with Phase 2 instructions

---

## Technical Architecture Changes

### Directory Structure After Implementation
```
modules/orchestrator/
├── .claude/
│   ├── skills/
│   │   ├── wpf-design-system/
│   │   │   └── SKILL.md
│   │   └── wpf-frontend/
│   │       └── SKILL.md
│   └── commands/
│       ├── wpf-design-validate.md
│       ├── wpf-pattern-add.md
│       ├── wpf-theme-export.md
│       └── wpf-preview-generate.md
├── .mcp.json
├── mcp-servers/
│   └── stock-photos.js
├── src/
│   └── lib/
│       └── phase2/
│           ├── pattern-loader.js (existing)
│           ├── anti-pattern-validator.js (existing)
│           ├── design-tokens.js (existing)
│           ├── content-generator.js (NEW)
│           ├── stock-photos.js (NEW)
│           └── theme-exporter.js (NEW)
├── templates/
│   ├── shared/
│   │   └── patterns/
│   │       ├── header/ (NEW - 2 variants)
│   │       ├── footer/ (NEW - 2 variants)
│   │       ├── cta/ (NEW - 2 variants)
│   │       ├── features/ (NEW - 1 variant)
│   │       ├── faq/ (NEW - 1 variant)
│   │       ├── team/ (NEW - 1 variant)
│   │       └── gallery/ (NEW - 1 variant)
│   └── theme/
│       ├── functions.php (NEW)
│       ├── style.css (NEW)
│       └── inc/
│           └── block-patterns.php (NEW)
├── tests/
│   └── e2e/
│       ├── pattern-generation.spec.js (NEW)
│       ├── theme-export.spec.js (NEW)
│       └── content-generation.spec.js (NEW)
├── .lighthouserc.json (NEW)
└── specs/
    └── phase2-complete-implementation.md (THIS FILE)
```

### API Dependencies
- **Anthropic Claude API**: Content generation (claude-3-5-sonnet-20241022)
- **Unsplash API**: Stock photos (free tier: 50 req/hour)
- **Pexels API**: Stock photos (free tier: 200 req/hour)

### Environment Variables Required
```bash
# .env
ANTHROPIC_API_KEY=sk-ant-...
UNSPLASH_API_KEY=...
PEXELS_API_KEY=...
```

---

## Success Metrics

### Quantitative
- **Pattern Library**: 18+ patterns (current: 11) → +64% growth
- **Theme Export**: Generate valid WordPress .zip in <30 seconds
- **Content Generation**: Generate page content in <10 seconds
- **Stock Photos**: Search and download in <5 seconds
- **Test Coverage**: >80% code coverage
- **Performance**: Lighthouse >70 for generated sites

### Qualitative
- **Developer Experience**: Claude Code Skills reduce manual work by 50%
- **Design Quality**: Anti-pattern validation prevents generic designs
- **Maintainability**: MCP architecture makes tools composable
- **Documentation**: All features documented in SKILL.md files

---

## Risk Assessment

### High Risk
1. **API Rate Limits**: Unsplash (50/hr), Pexels (200/hr)
   - **Mitigation**: Implement caching, rotate API keys, fallback to local images

2. **LLM Costs**: Claude API charges per token
   - **Mitigation**: Cache generated content, use smaller models for simple tasks

### Medium Risk
1. **MCP Server Stability**: Community MCP servers may have bugs
   - **Mitigation**: Pin versions, implement fallbacks, test extensively

2. **Pattern Complexity**: 18+ patterns increases maintenance burden
   - **Mitigation**: Strict validation, comprehensive tests, clear documentation

### Low Risk
1. **Browser Compatibility**: Tailwind CSS works across all modern browsers
2. **WordPress Compatibility**: Target WP 6.0+ (96% market share)

---

## Timeline Estimate

**Parallel Execution (5 agents):** 3-4 hours total

**Sequential Execution (1 agent):** 12-15 hours total

**Recommended:** Parallel execution with 5 tmux agents for fastest completion

---

## Next Steps

1. **Review Specification**: Ensure all requirements captured
2. **Launch Parallel Agents**: Start 5 tmux sessions
3. **Monitor Progress**: Check agent outputs every 30 minutes
4. **Integration Testing**: Test all components together
5. **Documentation**: Update README and CLAUDE.md
6. **Deployment**: Merge to main branch after validation

---

**Specification Status:** ✅ COMPLETE - Ready for parallel implementation
