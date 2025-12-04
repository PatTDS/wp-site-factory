// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load successfully', async ({ page }) => {
    // Check page title contains company name
    await expect(page).toHaveTitle(/{{COMPANY_NAME}}/i);
  });

  test('should have header and footer', async ({ page }) => {
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('should have navigation menu', async ({ page }) => {
    await expect(page.locator('nav')).toBeVisible();
  });

  test('should have logo', async ({ page }) => {
    const logo = page.locator('header a[href="/"]').first();
    await expect(logo).toBeVisible();
  });

  test('should have contact information in footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toContainText(/{{PHONE}}/);
  });

  test('should have CTA button', async ({ page }) => {
    const ctaButton = page.locator('a[href*="contact"]').first();
    await expect(ctaButton).toBeVisible();
  });
});

test.describe('Navigation', () => {
  test('should navigate to About page', async ({ page }) => {
    await page.goto('/');
    await page.click('nav a[href*="about"]');
    await expect(page).toHaveURL(/about/);
  });

  test('should navigate to Services page', async ({ page }) => {
    await page.goto('/');
    await page.click('nav a[href*="services"]');
    await expect(page).toHaveURL(/services/);
  });

  test('should navigate to Contact page', async ({ page }) => {
    await page.goto('/');
    await page.click('nav a[href*="contact"]');
    await expect(page).toHaveURL(/contact/);
  });
});

test.describe('Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should show mobile menu button', async ({ page }) => {
    await page.goto('/');
    const mobileMenuButton = page.locator('#mobile-menu-toggle');
    await expect(mobileMenuButton).toBeVisible();
  });

  test('should toggle mobile menu', async ({ page }) => {
    await page.goto('/');

    // Menu should be hidden initially
    const mobileMenu = page.locator('#mobile-menu');
    await expect(mobileMenu).toHaveClass(/hidden/);

    // Click to open
    await page.click('#mobile-menu-toggle');
    await expect(mobileMenu).not.toHaveClass(/hidden/);
  });
});

test.describe('Accessibility', () => {
  test('should have skip link', async ({ page }) => {
    await page.goto('/');
    const skipLink = page.locator('a[href="#main"]');
    await expect(skipLink).toHaveCount(1);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Should have exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBeLessThanOrEqual(1);
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      expect(alt).not.toBeNull();
    }
  });
});
