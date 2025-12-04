# WPF v2.0 - SPECIFY Phase

## Problem Statement

The current WPF (WordPress Site Factory) SaaS has critical gaps:

| Issue | Current State | Impact |
|-------|---------------|--------|
| Automation Level | 10-15% automated | 85-90% requires LLM intervention |
| KB Compliance | 30-40% | Missing security, companion plugin, critical CSS |
| Token Efficiency | ~4x waste | Trial-and-error approach burns tokens |
| Reproducibility | Low | Each build is different |

## Vision

**WPF v2.0** will be a deterministic, config-driven WordPress site factory that:
- Generates production-ready WordPress sites with ONE command
- Achieves 100% WordPress Knowledge Base compliance
- Requires minimal LLM interaction (2-3 defined touchpoints)
- Reduces token consumption by 75%+

## User Stories

### US-1: Site Generation
**As a** user of the WPF SaaS
**I want to** generate a complete WordPress site by providing a configuration file
**So that** I can create production-ready websites without manual intervention

**Acceptance Criteria:**
- [ ] Single command generates complete theme + companion plugin
- [ ] All files are generated from templates (no LLM writing code)
- [ ] Docker environment starts automatically
- [ ] WordPress installs and configures automatically
- [ ] All pages and menus are created
- [ ] All plugins are installed and configured
- [ ] E2E tests run and pass
- [ ] Compliance validation passes at 100%

### US-2: Discovery Wizard
**As a** user creating a new project
**I want to** answer guided questions to generate my configuration
**So that** I don't need to write YAML manually

**Acceptance Criteria:**
- [ ] Interactive CLI prompts for company info
- [ ] Color picker/suggestions based on industry
- [ ] Page selection from available templates
- [ ] Section selection for each page
- [ ] Outputs valid wpf-config.yaml

### US-3: Compliance Validation
**As a** user who needs WordPress best practices
**I want to** validate my generated site against the KB requirements
**So that** I know it meets professional standards

**Acceptance Criteria:**
- [ ] Validates architecture (theme + plugin separation)
- [ ] Validates security configurations
- [ ] Validates performance targets (TTFB, CSS size, etc.)
- [ ] Validates SEO setup
- [ ] Validates testing coverage
- [ ] Outputs detailed compliance report

### US-4: Template Library
**As a** developer extending WPF
**I want to** add new page sections and templates
**So that** I can expand the design options

**Acceptance Criteria:**
- [ ] Templates use EJS for variable replacement
- [ ] Sections are composable (hero, features, CTA, etc.)
- [ ] Templates follow WordPress Coding Standards
- [ ] Each template includes proper escaping/sanitization

## Non-Functional Requirements

### NFR-1: Performance
- Site generation completes in < 5 minutes
- Generated sites achieve Lighthouse > 70
- TTFB < 200ms on generated sites
- CSS output < 20KB

### NFR-2: Reliability
- Build process is deterministic (same config = same output)
- Automated error recovery for common issues
- Clear error messages when recovery fails

### NFR-3: Maintainability
- Templates are project-local (version controlled)
- KB requirements are codified in YAML
- No magic strings - all values from config

### NFR-4: WordPress KB Compliance (100%)
- [ ] Theme + companion plugin architecture
- [ ] CPTs in plugin, never in theme
- [ ] DISALLOW_FILE_EDIT in production
- [ ] XML-RPC disabled
- [ ] Security headers configured
- [ ] Critical CSS generated
- [ ] Image optimization configured
- [ ] Yoast SEO installed and configured
- [ ] Contact Form 7 with proper nonces
- [ ] All input sanitized, all output escaped

## Out of Scope (v2.0)

- Multi-tenant WordPress hosting
- Real-time collaborative editing
- Visual page builder
- E-commerce (WooCommerce) integration
- Multilingual support

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Automation Level | 10-15% | 95%+ |
| KB Compliance | 30-40% | 100% |
| LLM Touchpoints | Continuous | 2-3 max |
| Token Usage | Baseline | 75% reduction |
| Build Time | ~30 min manual | < 5 min automated |
| Test Coverage | Partial | 100% E2E + Lighthouse |

## Constraints

1. **Must use existing KB**: All practices from `~/wordpress-knowledge-base/`
2. **Node.js/TypeScript**: Build system in TypeScript
3. **WordPress 6.7+**: Target latest WordPress
4. **PHP 8.0+**: Modern PHP syntax
5. **Tailwind CSS 3.4+**: For styling
6. **Docker**: For local development environment
