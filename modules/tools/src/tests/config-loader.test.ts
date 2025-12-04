/**
 * WPF v2.0 Config Loader Tests
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fsExtra from 'fs-extra';
const { writeFile, mkdir, rm } = fsExtra;
import path from 'path';
import { loadConfig } from '../core/config-loader.js';

const TEST_DIR = '/tmp/wpf-test-config';

describe('Config Loader', () => {
  beforeEach(async () => {
    await mkdir(TEST_DIR, { recursive: true });
  });

  afterEach(async () => {
    await rm(TEST_DIR, { recursive: true, force: true });
  });

  describe('loadConfig', () => {
    it('should load valid minimal config', async () => {
      const config = `
project:
  name: test-project
  version: "1.0.0"

company:
  name: Test Company
  tagline: Building the future
  industry: technology

contact:
  email: info@test.com
  phone: "+1-555-0100"
  address:
    city: Test City
    state: TS
    country: US

branding:
  primary_color: "#16a34a"
  secondary_color: "#15803d"
  font_family: Inter

pages:
  - slug: home
    title: Home
    template: front-page
`;

      const configPath = path.join(TEST_DIR, 'wpf-config.yaml');
      await writeFile(configPath, config);

      const result = await loadConfig(configPath);

      expect(result.success).toBe(true);
      expect(result.config).toBeDefined();
      expect(result.config?.project.name).toBe('test-project');
      expect(result.config?.company.name).toBe('Test Company');
      expect(result.config?.pages).toHaveLength(1);
    });

    it('should fail on missing required fields', async () => {
      const invalidConfig = `
project:
  name: test-project

company:
  name: Test Company
`;

      const configPath = path.join(TEST_DIR, 'invalid.yaml');
      await writeFile(configPath, invalidConfig);

      const result = await loadConfig(configPath);

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it('should validate hex color format', async () => {
      const config = `
project:
  name: test-project
  version: "1.0.0"

company:
  name: Test Company
  tagline: Building the future
  industry: technology

contact:
  email: info@test.com
  phone: "+1-555-0100"
  address:
    city: Test City
    state: TS
    country: US

branding:
  primary_color: "invalid-color"
  secondary_color: "#15803d"
  font_family: Inter

pages:
  - slug: home
    title: Home
    template: front-page
`;

      const configPath = path.join(TEST_DIR, 'bad-color.yaml');
      await writeFile(configPath, config);

      const result = await loadConfig(configPath);

      expect(result.success).toBe(false);
      expect(result.errors?.some(e => e.includes('color'))).toBe(true);
    });

    it('should validate email format', async () => {
      const config = `
project:
  name: test-project
  version: "1.0.0"

company:
  name: Test Company
  tagline: Building the future
  industry: technology

contact:
  email: not-an-email
  phone: "+1-555-0100"
  address:
    city: Test City
    state: TS
    country: US

branding:
  primary_color: "#16a34a"
  secondary_color: "#15803d"
  font_family: Inter

pages:
  - slug: home
    title: Home
    template: front-page
`;

      const configPath = path.join(TEST_DIR, 'bad-email.yaml');
      await writeFile(configPath, config);

      const result = await loadConfig(configPath);

      expect(result.success).toBe(false);
    });

    it('should require at least one page', async () => {
      const config = `
project:
  name: test-project
  version: "1.0.0"

company:
  name: Test Company
  tagline: Building the future
  industry: technology

contact:
  email: info@test.com
  phone: "+1-555-0100"
  address:
    city: Test City
    state: TS
    country: US

branding:
  primary_color: "#16a34a"
  secondary_color: "#15803d"
  font_family: Inter

pages: []
`;

      const configPath = path.join(TEST_DIR, 'no-pages.yaml');
      await writeFile(configPath, config);

      const result = await loadConfig(configPath);

      expect(result.success).toBe(false);
    });

    it('should handle file not found', async () => {
      const result = await loadConfig('/nonexistent/path.yaml');

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
    });

    it('should load full config with all options', async () => {
      const config = `
project:
  name: full-test
  version: "2.0.0"

company:
  name: Full Test Inc
  tagline: Complete configuration
  industry: consulting

contact:
  email: contact@fulltest.com
  phone: "+1-555-9999"
  address:
    street: 123 Main St
    city: Boston
    state: MA
    postal_code: "02101"
    country: US

branding:
  primary_color: "#0ea5e9"
  secondary_color: "#0284c7"
  accent_color: "#f59e0b"
  font_family: Roboto
  font_heading: Montserrat

pages:
  - slug: home
    title: Home
    template: front-page
    sections:
      - type: hero-centered
        title: Welcome
        subtitle: To our site
        cta_text: Learn More
        cta_url: /about
  - slug: about
    title: About Us
    template: about
  - slug: services
    title: Services
    template: services
  - slug: contact
    title: Contact
    template: contact

menu:
  primary:
    - title: Home
      url: /
    - title: About
      url: /about
    - title: Services
      url: /services
    - title: Contact
      url: /contact

plugins:
  preset: professional
  additional:
    - wordfence
    - wp-mail-smtp

compliance:
  level: strict
`;

      const configPath = path.join(TEST_DIR, 'full-config.yaml');
      await writeFile(configPath, config);

      const result = await loadConfig(configPath);

      expect(result.success).toBe(true);
      expect(result.config?.pages).toHaveLength(4);
      expect(result.config?.compliance?.level).toBe('strict');
      expect(result.config?.plugins?.preset).toBe('professional');
    });
  });
});
