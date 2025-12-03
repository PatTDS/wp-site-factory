# Testing Module Rules

## E2E Testing Standards

### Playwright Configuration
```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
```

### Test Structure
```typescript
test.describe('Page Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toBeVisible();
  });
});
```

### Naming Conventions
- Test files: `<feature>.spec.ts`
- Test names: `should <expected behavior>`
- Page objects: `<PageName>.ts`

## Lighthouse CI

### Thresholds
```json
{
  "assertions": {
    "categories:performance": ["error", {"minScore": 0.7}],
    "categories:accessibility": ["error", {"minScore": 0.9}],
    "categories:best-practices": ["error", {"minScore": 0.9}],
    "categories:seo": ["error", {"minScore": 0.9}]
  }
}
```

### Budget
```json
{
  "resourceSizes": [
    {"resourceType": "script", "budget": 300},
    {"resourceType": "total", "budget": 1000}
  ]
}
```

## Accessibility Testing

### WCAG Requirements
- Level AA compliance minimum
- All images have alt text
- Color contrast ratio ≥ 4.5:1
- Keyboard navigation works
- ARIA labels present

### axe-core Integration
```typescript
import AxeBuilder from '@axe-core/playwright';

test('accessibility', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

## Visual Regression

### Screenshot Configuration
- Capture full page screenshots
- Compare against baseline
- Threshold: 0.1% difference allowed
- Update baseline only when intentional

### Commands
```bash
# Update baselines
npx playwright test --update-snapshots

# Run comparison
npx playwright test
```

## CI/CD Integration

### GitHub Actions Workflow
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
```

### Required Checks
- [ ] All E2E tests pass
- [ ] Lighthouse scores meet thresholds
- [ ] No accessibility violations
- [ ] Visual regression approved

## Test Coverage

### Required Tests
| Page | Tests Required |
|------|----------------|
| Homepage | Load, navigation, CTA clicks |
| Contact | Form submission, validation |
| Services | Content display, links |
| 404 | Error page displays |

### Edge Cases
- Mobile viewport
- Slow network (3G simulation)
- JavaScript disabled
- Large content volumes

## Knowledge Base Reference

- `@wordpress-knowledge-base/testing/howto-playwright-wordpress.md`
- `@wordpress-knowledge-base/testing/ref-lighthouse-ci.md`
- `@wordpress-knowledge-base/testing/howto-accessibility-testing.md`
