# WPF (WordPress Site Factory) Constitution

## Mission Statement

WPF is an **Automated Web Agency** - a SaaS platform that replicates the web development agency experience through LLM-powered automation. Clients interact through a dashboard, provide company details, and receive production-ready WordPress websites following industry best practices.

## Core Principles

### I. Three-Phase Workflow (NON-NEGOTIABLE)

Every website project MUST pass through three sequential phases with client approval gates:

1. **Discovery Phase** (Automated API)
   - Client provides: company details, colors, industry, scope
   - LLM researches competitors in the industry
   - LLM drafts website structure: pages, sections, services
   - Output: Website Blueprint document
   - Gate: Client approval required before Phase 2

2. **Design Draft Phase** (Human + Claude Code)
   - Assemble templates from component library
   - Generate HTML preview with real content
   - Apply brand colors and typography
   - Output: Visual draft (HTML/CSS preview)
   - Gate: Client approval required before Phase 3

3. **Development Phase** (Human + Claude Code + WPF CLI)
   - Full WordPress implementation
   - All best practices from wordpress-knowledge-base
   - Performance, SEO, security, accessibility compliance
   - Output: Production-ready WordPress site
   - Gate: Final delivery and handoff

### II. Research-First Methodology (NON-NEGOTIABLE)

Before building ANYTHING, WPF researches best practices from peer-reviewed and professional sources:

**Two-Layer Research Model:**
1. **Best Practices Research**: How to write effective hero sections, about us, services, etc.
2. **Competitor Research**: What leading industry websites do well

**Knowledge Base Growth:**
- Research findings stored permanently in knowledge base
- Each project makes WPF smarter
- Knowledge organized by section type and industry
- Curation rules: add with sources, update don't delete, flag conflicts

**Implementation:**
- LLM web search (hybrid approach) over raw scraping
- Intelligent synthesis across sources
- Optional deep fetch for exceptional examples
- Store insights for reuse across projects

### III. Hybrid LLM Architecture

- **Phase 1**: Automated via API (Claude API) for research and drafting
- **Phase 2-3**: Human-operated Claude Code for quality and creativity
- **Rationale**: Research is repetitive (automate), design/build needs human oversight

### IV. Client-First Design

- All client interaction through **SaaS Dashboard**
- Clear approval gates with revision workflow
- Transparent progress tracking per phase
- Per-site pricing model

### V. Template-Driven Development

- Every component comes from the **design system** (module/webdesign)
- LLMs assemble templates, never generate from scratch
- Templates are production-tested and WordPress-optimized
- New templates require validation before addition to library

### VI. WordPress Knowledge Base Compliance (NON-NEGOTIABLE)

All WordPress development MUST follow `~/wordpress-knowledge-base/`:

- **Performance**: Lighthouse > 70, LCP < 2.5s, CLS < 0.1
- **SEO**: Schema markup, meta tags, sitemaps (Rank Math)
- **Security**: Sanitize input, escape output, nonces, hardening
- **Plugins**: Only approved plugins (Autoptimize, ShortPixel, etc.)
- **Testing**: E2E tests, Lighthouse CI before deployment

### VII. Module Separation

WPF is organized into independent modules:

| Module | Responsibility |
|--------|----------------|
| orchestrator | Phase management, LLM orchestration, research |
| webdesign | Template library, design tokens, components |
| tools | CLI framework, WordPress generation |
| platform | Client dashboard, forms, approval workflow |
| billing | Payment processing (per-site) |
| seo | Schema, meta, sitemap generation |
| security | Hardening, headers, wp-config |
| performance | Core Web Vitals, caching, optimization |
| testing | E2E, Lighthouse CI, accessibility |
| infrastructure | Deployment, hosting, CI/CD |

### VIII. Quality Gates

No phase advances without meeting quality criteria:

**Phase 1 → Phase 2:**
- [ ] Client details complete (intake form submitted)
- [ ] Best practices research documented in knowledge base
- [ ] Competitor research documented
- [ ] Blueprint with content drafts generated
- [ ] Operator review completed
- [ ] Client approves Blueprint

**Phase 2 → Phase 3:**
- [ ] HTML preview matches approved structure
- [ ] Brand colors and content applied
- [ ] Client approves visual design

**Phase 3 → Delivery:**
- [ ] Lighthouse Performance > 70
- [ ] All E2E tests passing
- [ ] Security scan clean
- [ ] Client final approval

## Technology Stack

- **Dashboard**: Next.js + Prisma (module/platform)
- **API**: Node.js or Python for LLM orchestration
- **LLMs**: Claude API / GPT-4 for research, Claude Code for build
- **WordPress**: PHP 8.0+, Tailwind CSS, WP-CLI
- **Testing**: Playwright, Lighthouse CI
- **Hosting**: Client's choice (support for major providers)

## Governance

- This constitution supersedes all other practices
- Amendments require documentation and approval
- All development must verify compliance with these principles
- Use `~/wordpress-knowledge-base/` as the authoritative reference

**Version**: 1.1.0 | **Ratified**: 2024-12-04 | **Last Amended**: 2024-12-04
