# WPF Testing Module

**Branch:** `module/testing`
**Knowledge Base:** `@wordpress-knowledge-base/testing/`
**Status:** Planned

## Overview

The testing module provides E2E testing, Lighthouse CI, accessibility audits, and visual regression testing.

## Features

- **E2E Testing** - Playwright end-to-end tests
- **Lighthouse CI** - Automated performance testing
- **Accessibility** - axe-core accessibility audits
- **Visual Regression** - Screenshot comparison
- **CI/CD Integration** - GitHub Actions workflows

## Directory Structure

```
modules/testing/
├── src/
│   ├── e2e/            # Playwright tests
│   ├── lighthouse/     # Lighthouse configurations
│   ├── a11y/           # Accessibility tests
│   └── visual/         # Visual regression
├── lib/
│   ├── playwright.sh   # Playwright helpers
│   └── lighthouse.sh   # Lighthouse helpers
├── tests/
│   └── integration/    # Integration tests
├── README.md
├── RULES.md
└── CLAUDE.md
```

## Commands

```bash
wpf test <project>           # Run all tests
wpf test e2e <project>       # E2E tests only
wpf test lighthouse <project> # Lighthouse audit
wpf test a11y <project>      # Accessibility audit
wpf test visual <project>    # Visual regression
```

## Test Types

| Type | Tool | Purpose |
|------|------|---------|
| E2E | Playwright | User journey testing |
| Performance | Lighthouse CI | Core Web Vitals |
| Accessibility | axe-core | WCAG compliance |
| Visual | Playwright | Screenshot comparison |

## Dependencies

- Node.js 20+
- Playwright 1.56+
- Lighthouse CI
- axe-core

## Related Modules

- **performance** - Performance testing integration
- **tools** - CI/CD pipeline
- **platform** - Test result dashboard
