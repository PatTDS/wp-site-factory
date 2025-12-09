/**
 * Pattern Generation E2E Tests
 *
 * Tests for pattern loading, anti-pattern validation, and design token generation
 */

import { test, expect } from '@playwright/test';
import { testBlueprint, healthcareBlueprint } from './helpers/test-blueprint.js';
import { listPatterns, listSharedPatterns } from '../../src/lib/phase2/pattern-loader.js';
import { validateDesign } from '../../src/lib/phase2/anti-pattern-validator.js';
import { generateAllTokens } from '../../src/lib/phase2/design-tokens.js';

test.describe('Pattern Loading', () => {
  test('loads industry-specific patterns for construction', async () => {
    const patterns = await listPatterns('construction', 'industrial-modern', 'hero');

    expect(patterns).toBeDefined();
    expect(patterns.length).toBeGreaterThan(0);
    expect(patterns[0]).toHaveProperty('id');
    expect(patterns[0]).toHaveProperty('manifest');
  });

  test('loads industry-specific patterns for healthcare', async () => {
    const patterns = await listPatterns('healthcare', 'medical-professional', 'hero');

    expect(patterns).toBeDefined();
    expect(patterns.length).toBeGreaterThan(0);
  });

  test('loads shared header patterns', async () => {
    const patterns = await listSharedPatterns('header');

    expect(patterns).toBeDefined();
    expect(patterns.length).toBe(4); // 4 header variants
    expect(patterns[0].id).toContain('header-');
  });

  test('loads shared footer patterns', async () => {
    const patterns = await listSharedPatterns('footer');

    expect(patterns).toBeDefined();
    expect(patterns.length).toBe(3); // 3 footer variants
    expect(patterns[0].id).toContain('footer-');
  });

  test('loads shared CTA patterns', async () => {
    const patterns = await listSharedPatterns('cta');

    expect(patterns).toBeDefined();
    expect(patterns.length).toBe(2); // 2 CTA variants
  });

  test('loads shared features patterns', async () => {
    const patterns = await listSharedPatterns('features');

    expect(patterns).toBeDefined();
    expect(patterns.length).toBe(2); // 2 features variants
  });

  test('pattern manifests have required fields', async () => {
    const patterns = await listPatterns('construction', 'industrial-modern', 'hero');
    const pattern = patterns[0];

    expect(pattern.manifest).toHaveProperty('id');
    expect(pattern.manifest).toHaveProperty('category');
    expect(pattern.manifest).toHaveProperty('industry');
    expect(pattern.manifest).toHaveProperty('layout_type');
  });
});

test.describe('Anti-Pattern Validation', () => {
  test('detects banned fonts', async () => {
    const design = {
      colors: testBlueprint.design.colors,
      typography: {
        headings: 'Inter', // Banned font
        body: 'Open Sans'
      }
    };

    const result = await validateDesign(design);

    expect(result).toHaveProperty('isValid');
    expect(result.isValid).toBe(false);
    expect(result.violations).toBeDefined();
    expect(result.violations.length).toBeGreaterThan(0);

    const fontViolation = result.violations.find(v => v.type === 'banned_font');
    expect(fontViolation).toBeDefined();
    expect(fontViolation.font).toBe('Inter');
  });

  test('passes validation with allowed fonts', async () => {
    const design = {
      colors: testBlueprint.design.colors,
      typography: {
        headings: 'Poppins', // Allowed font
        body: 'Open Sans' // Allowed font
      }
    };

    const result = await validateDesign(design);

    expect(result.isValid).toBe(true);
    expect(result.violations.length).toBe(0);
  });

  test('provides suggested alternatives for banned fonts', async () => {
    const design = {
      colors: testBlueprint.design.colors,
      typography: {
        headings: 'Roboto', // Banned font
        body: 'Arial' // Banned font
      }
    };

    const result = await validateDesign(design);

    const violations = result.violations.filter(v => v.type === 'banned_font');
    expect(violations.length).toBe(2);

    violations.forEach(violation => {
      expect(violation).toHaveProperty('alternatives');
      expect(violation.alternatives.length).toBeGreaterThan(0);
    });
  });

  test('detects multiple violations', async () => {
    const design = {
      colors: testBlueprint.design.colors,
      typography: {
        headings: 'Inter',
        body: 'Roboto'
      }
    };

    const result = await validateDesign(design);

    expect(result.isValid).toBe(false);
    expect(result.violations.length).toBeGreaterThanOrEqual(2);
  });
});

test.describe('Design Token Generation', () => {
  test('generates complete design tokens', async () => {
    const input = {
      colors: testBlueprint.design.colors,
      typography: {
        headings: testBlueprint.design.typography.primaryFont,
        body: testBlueprint.design.typography.secondaryFont
      }
    };

    const tokens = await generateAllTokens(input);

    expect(tokens).toBeDefined();
    expect(tokens).toHaveProperty('theme');
    expect(tokens).toHaveProperty('tailwind');
    expect(tokens).toHaveProperty('css');
  });

  test('generates correct color tokens', async () => {
    const input = {
      colors: testBlueprint.design.colors,
      typography: {
        headings: testBlueprint.design.typography.primaryFont,
        body: testBlueprint.design.typography.secondaryFont
      }
    };

    const tokens = await generateAllTokens(input);

    expect(tokens.theme.colors).toBeDefined();
    expect(tokens.theme.colors.primary).toBe(testBlueprint.design.colors.primary);
  });

  test('generates typography tokens', async () => {
    const input = {
      colors: testBlueprint.design.colors,
      typography: {
        headings: testBlueprint.design.typography.primaryFont,
        body: testBlueprint.design.typography.secondaryFont
      }
    };

    const tokens = await generateAllTokens(input);

    expect(tokens.theme.typography).toBeDefined();
    expect(tokens.theme.typography.headings).toBe(testBlueprint.design.typography.primaryFont);
  });

  test('generates industry-specific tokens', async () => {
    const constructionInput = {
      colors: testBlueprint.design.colors,
      typography: {
        headings: testBlueprint.design.typography.primaryFont,
        body: testBlueprint.design.typography.secondaryFont
      }
    };

    const healthcareInput = {
      colors: healthcareBlueprint.design.colors,
      typography: {
        headings: healthcareBlueprint.design.typography.primaryFont,
        body: healthcareBlueprint.design.typography.secondaryFont
      }
    };

    const constructionTokens = await generateAllTokens(constructionInput);
    const healthcareTokens = await generateAllTokens(healthcareInput);

    // Tokens should be different for different industries/designs
    expect(constructionTokens.theme.colors.primary).not.toBe(healthcareTokens.theme.colors.primary);
  });

  test('generates valid Tailwind CSS config', async () => {
    const input = {
      colors: testBlueprint.design.colors,
      typography: {
        headings: testBlueprint.design.typography.primaryFont,
        body: testBlueprint.design.typography.secondaryFont
      }
    };

    const tokens = await generateAllTokens(input);

    expect(tokens.tailwind).toBeDefined();
    expect(tokens.tailwind).toHaveProperty('theme');
    expect(tokens.tailwind.theme).toHaveProperty('extend');
  });
});
