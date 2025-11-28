# WordPress Testing Guide

## Testing Strategy

### Test Types

1. **E2E Testing** (Playwright)
   - User journey validation
   - Form submissions
   - Navigation flows

2. **Performance Testing** (Lighthouse)
   - Core Web Vitals
   - Accessibility scores
   - SEO audits

3. **Accessibility Testing** (axe-core)
   - WCAG compliance
   - Color contrast
   - Keyboard navigation

4. **Visual Regression** (optional)
   - Screenshot comparisons
   - Layout validation

## Playwright Setup

### Installation
```bash
npm init -y
npm install -D @playwright/test
npx playwright install chromium
```

### Basic Configuration (playwright.config.js)
```javascript
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  use: {
    baseURL: 'http://localhost:8080',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } },
    { name: 'mobile', use: { ...devices['iPhone 12'] } },
  ],
});
```

### Example Tests

#### Homepage Test
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Company Name/);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('navigation works', async ({ page }) => {
    await page.goto('/');
    await page.click('nav a[href="/about"]');
    await expect(page).toHaveURL('/about');
  });
});
```

#### Contact Form Test
```javascript
test('contact form submits', async ({ page }) => {
  await page.goto('/contact');

  await page.fill('input[name="your-name"]', 'Test User');
  await page.fill('input[name="your-email"]', 'test@example.com');
  await page.fill('textarea[name="your-message"]', 'Test message');

  await page.click('input[type="submit"]');

  // Wait for success message
  await expect(page.locator('.wpcf7-mail-sent-ok')).toBeVisible({
    timeout: 10000
  });
});
```

#### Mobile Responsiveness Test
```javascript
test('mobile menu works', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 });
  await page.goto('/');

  // Check hamburger menu exists
  await expect(page.locator('.mobile-menu-toggle')).toBeVisible();

  // Open menu
  await page.click('.mobile-menu-toggle');
  await expect(page.locator('.mobile-nav')).toBeVisible();
});
```

### Running Tests
```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/homepage.spec.js

# Run with UI
npx playwright test --ui

# Generate report
npx playwright show-report
```

## Lighthouse Testing

### CLI Installation
```bash
npm install -g lighthouse
```

### Basic Audit
```bash
# Run audit
lighthouse http://localhost:8080 \
  --output=json \
  --output-path=./lighthouse-report.json \
  --chrome-flags="--headless"

# Run with HTML report
lighthouse http://localhost:8080 \
  --output=html \
  --output-path=./lighthouse-report.html
```

### CI Integration
```javascript
// lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:8080/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.7 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
  },
};
```

## Accessibility Testing

### axe-core with Playwright
```javascript
const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test('should pass accessibility checks', async ({ page }) => {
  await page.goto('/');

  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
```

### Manual Checklist

- [ ] All images have alt text
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Forms have associated labels
- [ ] Keyboard navigation works
- [ ] Focus states are visible
- [ ] Skip navigation link exists
- [ ] Heading hierarchy is correct
- [ ] ARIA labels used correctly

## Pre-Deployment Testing Checklist

### Functional Tests
- [ ] Homepage loads
- [ ] All navigation links work
- [ ] Contact form submits
- [ ] Search works (if applicable)
- [ ] Login/logout works
- [ ] Mobile menu functions

### Performance Tests
- [ ] Lighthouse score > 70
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] No render-blocking resources

### Cross-Browser Tests
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Mobile Safari
- [ ] Mobile Chrome

### Content Tests
- [ ] No lorem ipsum
- [ ] Images load correctly
- [ ] No broken links
- [ ] Correct contact info

## Automated Test Script
```bash
#!/bin/bash
# run-all-tests.sh

echo "Starting test suite..."

# E2E tests
echo "Running E2E tests..."
npx playwright test || exit 1

# Lighthouse
echo "Running Lighthouse..."
lighthouse http://localhost:8080 \
  --output=json \
  --quiet \
  --chrome-flags="--headless" | \
  node -e "const r=JSON.parse(require('fs').readFileSync(0,'utf8'));
    if(r.categories.performance.score<0.7){
      console.error('Performance score below 70%');
      process.exit(1);
    }"

echo "All tests passed!"
```

## Test Environment Setup

### Docker Test Environment
```yaml
# docker-compose.test.yml
version: '3.8'
services:
  wordpress-test:
    image: wordpress:6.7-php8.2-apache
    environment:
      WORDPRESS_DB_HOST: db-test
      WORDPRESS_DB_NAME: wordpress_test
    ports:
      - "8888:80"

  db-test:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: wordpress_test
      MYSQL_ROOT_PASSWORD: test
```

### CI/CD Integration (GitHub Actions)
```yaml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Start WordPress
        run: docker-compose up -d

      - name: Wait for WordPress
        run: sleep 30

      - name: Run Playwright tests
        run: npx playwright test

      - name: Run Lighthouse
        run: lighthouse http://localhost:8080 --chrome-flags="--headless"
```

---

*Based on production testing experience with NatiGeo website deployment*
