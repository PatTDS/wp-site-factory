# WPF v2.0 - TASKS Phase

## Implementation Breakdown

Tasks are organized by user story and ordered by dependency. Tasks marked with [P] can run in parallel.

---

## Phase 1: Foundation (Tasks 1-8)

### Task 1: Project Setup
**Depends on:** None
**Estimated files:** 5

Create new TypeScript project structure:
- [ ] Create `src/` directory structure
- [ ] Initialize `package.json` with dependencies
- [ ] Create `tsconfig.json` for TypeScript
- [ ] Create `bin/wpf` entry point
- [ ] Create `.gitignore`

### Task 2: Configuration Schema [P]
**Depends on:** Task 1
**Estimated files:** 3

Define Zod schema for wpf-config.yaml:
- [ ] Create `src/types/config.ts` with full schema
- [ ] Create `src/core/config-loader.ts` for YAML parsing
- [ ] Add validation error messages

### Task 3: KB Requirements Codification [P]
**Depends on:** Task 1
**Estimated files:** 2

Codify WordPress KB requirements:
- [ ] Create `kb/requirements.yaml` with all rules
- [ ] Create `src/types/compliance.ts` for types

### Task 4: Error Handler Definitions [P]
**Depends on:** Task 1
**Estimated files:** 2

Define error recovery rules:
- [ ] Create `kb/error-handlers.yaml`
- [ ] Create `src/core/error-recovery.ts`

---

## Phase 2: Template Library (Tasks 5-12)

### Task 5: Theme Base Templates
**Depends on:** Task 1
**Estimated files:** 8

Create EJS templates for core theme files:
- [ ] `_templates/theme/base/functions.php.ejs`
- [ ] `_templates/theme/base/header.php.ejs`
- [ ] `_templates/theme/base/footer.php.ejs`
- [ ] `_templates/theme/base/style.css.ejs`
- [ ] `_templates/theme/base/index.php.ejs`
- [ ] `_templates/theme/base/tailwind.config.js.ejs`
- [ ] `_templates/theme/base/package.json.ejs`
- [ ] `_templates/theme/base/input.css.ejs`

### Task 6: Page Templates [P]
**Depends on:** Task 5
**Estimated files:** 6

Create EJS templates for page types:
- [ ] `_templates/theme/pages/front-page.php.ejs`
- [ ] `_templates/theme/pages/page.php.ejs`
- [ ] `_templates/theme/pages/page-about.php.ejs`
- [ ] `_templates/theme/pages/page-contact.php.ejs`
- [ ] `_templates/theme/pages/page-services.php.ejs`
- [ ] `_templates/theme/pages/page-products.php.ejs`

### Task 7: Section Templates [P]
**Depends on:** Task 5
**Estimated files:** 14

Create EJS templates for reusable sections:
- [ ] `_templates/theme/sections/hero-centered.php.ejs`
- [ ] `_templates/theme/sections/hero-split.php.ejs`
- [ ] `_templates/theme/sections/features-grid.php.ejs`
- [ ] `_templates/theme/sections/features-alternating.php.ejs`
- [ ] `_templates/theme/sections/cta-banner.php.ejs`
- [ ] `_templates/theme/sections/cta-split.php.ejs`
- [ ] `_templates/theme/sections/testimonials-carousel.php.ejs`
- [ ] `_templates/theme/sections/testimonials-grid.php.ejs`
- [ ] `_templates/theme/sections/contact-form.php.ejs`
- [ ] `_templates/theme/sections/contact-info.php.ejs`
- [ ] `_templates/theme/sections/team-grid.php.ejs`
- [ ] `_templates/theme/sections/pricing-table.php.ejs`
- [ ] `_templates/theme/sections/faq-accordion.php.ejs`
- [ ] `_templates/theme/sections/gallery-grid.php.ejs`

### Task 8: Companion Plugin Templates
**Depends on:** Task 1
**Estimated files:** 8

Create EJS templates for companion plugin:
- [ ] `_templates/plugin/base/plugin-main.php.ejs`
- [ ] `_templates/plugin/base/class-loader.php.ejs`
- [ ] `_templates/plugin/includes/class-post-types.php.ejs`
- [ ] `_templates/plugin/includes/class-taxonomies.php.ejs`
- [ ] `_templates/plugin/includes/class-security.php.ejs`
- [ ] `_templates/plugin/includes/class-performance.php.ejs`
- [ ] `_templates/plugin/admin/class-admin.php.ejs`
- [ ] `_templates/plugin/admin/views/settings.php.ejs`

### Task 9: Docker Templates [P]
**Depends on:** Task 1
**Estimated files:** 3

Create EJS templates for Docker environment:
- [ ] `_templates/docker/docker-compose.yml.ejs`
- [ ] `_templates/docker/.env.ejs`
- [ ] `_templates/docker/uploads.ini.ejs`

### Task 10: Script Templates [P]
**Depends on:** Task 1
**Estimated files:** 4

Create EJS templates for setup scripts:
- [ ] `_templates/scripts/setup-wordpress.sh.ejs`
- [ ] `_templates/scripts/configure-plugins.sh.ejs`
- [ ] `_templates/scripts/create-content.sh.ejs`
- [ ] `_templates/scripts/security-hardening.sh.ejs`

### Task 11: Test Templates [P]
**Depends on:** Task 1
**Estimated files:** 4

Create EJS templates for E2E tests:
- [ ] `_templates/tests/e2e/pages.spec.ts.ejs`
- [ ] `_templates/tests/e2e/navigation.spec.ts.ejs`
- [ ] `_templates/tests/e2e/responsive.spec.ts.ejs`
- [ ] `_templates/tests/playwright.config.ts.ejs`

### Task 12: Config Templates [P]
**Depends on:** Task 1
**Estimated files:** 3

Create EJS templates for WordPress config:
- [ ] `_templates/config/wp-config-extra.php.ejs`
- [ ] `_templates/config/.htaccess.ejs`
- [ ] `_templates/config/robots.txt.ejs`

---

## Phase 3: Core Services (Tasks 13-20)

### Task 13: Template Engine
**Depends on:** Task 5
**Estimated files:** 2

Create EJS template processor:
- [ ] `src/core/template-engine.ts`
- [ ] Unit tests for template engine

### Task 14: Docker Manager
**Depends on:** Task 9, Task 4
**Estimated files:** 2

Create Docker lifecycle management:
- [ ] `src/core/docker-manager.ts`
- [ ] Health check implementation
- [ ] Error recovery integration

### Task 15: WordPress Setup
**Depends on:** Task 10, Task 4
**Estimated files:** 2

Create WP-CLI automation:
- [ ] `src/core/wordpress-setup.ts`
- [ ] Installation, theme activation, config

### Task 16: Plugin Installer
**Depends on:** Task 15
**Estimated files:** 1

Create plugin installation service:
- [ ] `src/core/plugin-installer.ts`
- [ ] Install, activate, configure plugins

### Task 17: Content Creator
**Depends on:** Task 15
**Estimated files:** 1

Create content creation service:
- [ ] `src/core/content-creator.ts`
- [ ] Pages, menus, homepage setting

### Task 18: Test Runner
**Depends on:** Task 11
**Estimated files:** 2

Create test execution service:
- [ ] `src/core/test-runner.ts`
- [ ] Playwright execution, Lighthouse audit

### Task 19: Compliance Checker
**Depends on:** Task 3
**Estimated files:** 5

Create compliance validation:
- [ ] `src/validators/compliance-checker.ts`
- [ ] `src/validators/architecture.ts`
- [ ] `src/validators/security.ts`
- [ ] `src/validators/performance.ts`
- [ ] `src/validators/seo.ts`

### Task 20: Build Orchestrator
**Depends on:** Tasks 13-19
**Estimated files:** 1

Create main build pipeline:
- [ ] `src/core/build-orchestrator.ts`
- [ ] Step sequencing, progress display, error handling

---

## Phase 4: CLI Commands (Tasks 21-25)

### Task 21: CLI Router
**Depends on:** Task 1
**Estimated files:** 1

Create Commander.js CLI entry:
- [ ] `src/cli/index.ts`
- [ ] Command registration, version, help

### Task 22: Discovery Command
**Depends on:** Task 21, Task 2
**Estimated files:** 5

Create interactive discovery:
- [ ] `src/cli/commands/discover.ts`
- [ ] `src/cli/prompts/company.ts`
- [ ] `src/cli/prompts/branding.ts`
- [ ] `src/cli/prompts/pages.ts`
- [ ] `src/cli/prompts/sections.ts`

### Task 23: Build Command
**Depends on:** Task 20, Task 21
**Estimated files:** 1

Create build command:
- [ ] `src/cli/commands/build.ts`
- [ ] Progress display with ora
- [ ] Final summary

### Task 24: Validate Command
**Depends on:** Task 19, Task 21
**Estimated files:** 1

Create validation command:
- [ ] `src/cli/commands/validate.ts`
- [ ] Compliance report output

### Task 25: Doctor Command
**Depends on:** Task 4, Task 21
**Estimated files:** 1

Create troubleshooting command:
- [ ] `src/cli/commands/doctor.ts`
- [ ] Environment checks, common fixes

---

## Phase 5: Integration & Testing (Tasks 26-30)

### Task 26: Integration Tests
**Depends on:** Tasks 21-25
**Estimated files:** 5

Create integration tests:
- [ ] Test full build pipeline
- [ ] Test error recovery
- [ ] Test compliance validation
- [ ] Test discovery flow
- [ ] Test config validation

### Task 27: Sample Configuration
**Depends on:** Task 2
**Estimated files:** 3

Create sample configs for testing:
- [ ] `samples/technology-company.yaml`
- [ ] `samples/restaurant.yaml`
- [ ] `samples/healthcare.yaml`

### Task 28: Documentation
**Depends on:** All previous
**Estimated files:** 4

Create documentation:
- [ ] Update `README.md`
- [ ] Create `docs/CONFIG.md`
- [ ] Create `docs/TEMPLATES.md`
- [ ] Create `docs/COMPLIANCE.md`

### Task 29: Migration Script
**Depends on:** Task 1
**Estimated files:** 1

Create migration from v1:
- [ ] `scripts/migrate-v1.sh`
- [ ] Preserve existing projects

### Task 30: Final Validation
**Depends on:** All previous
**Estimated files:** 0

End-to-end validation:
- [ ] Generate "anywhere" site with new system
- [ ] Verify 100% KB compliance
- [ ] Verify < 5 min build time
- [ ] Verify all E2E tests pass
- [ ] Verify Lighthouse > 70

---

## Summary

| Phase | Tasks | Files | Parallel? |
|-------|-------|-------|-----------|
| 1. Foundation | 4 | 12 | Partial |
| 2. Template Library | 8 | 50 | Yes |
| 3. Core Services | 8 | 17 | Partial |
| 4. CLI Commands | 5 | 10 | Partial |
| 5. Integration | 5 | 13 | No |
| **Total** | **30** | **102** | |

## Execution Order

```
Phase 1: [1] → [2,3,4 parallel]
Phase 2: [5] → [6,7,8,9,10,11,12 parallel]
Phase 3: [13,14] → [15] → [16,17] → [18,19] → [20]
Phase 4: [21] → [22,23,24,25 partial parallel]
Phase 5: [26] → [27,28,29] → [30]
```

## Critical Path

```
Task 1 → Task 5 → Task 13 → Task 20 → Task 23 → Task 30
```

Estimated time with parallel execution: ~8-12 hours development
