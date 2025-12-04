/**
 * WPF v2.0 Template Engine Tests
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fsExtra from 'fs-extra';
const { mkdir, rm, pathExists, readFile } = fsExtra;
import path from 'path';
import type { WPFConfig } from '../types/config.js';

// Mock config for testing
const mockConfig: WPFConfig = {
  project: {
    name: 'test-site',
    version: '1.0.0'
  },
  company: {
    name: 'Test Company',
    tagline: 'Building better websites',
    industry: 'technology'
  },
  contact: {
    email: 'info@testsite.com',
    phone: '+1-555-0100',
    address: {
      street: '123 Test St',
      city: 'Test City',
      state: 'TC',
      postal_code: '12345',
      country: 'US'
    }
  },
  branding: {
    primary_color: '#16a34a',
    secondary_color: '#15803d',
    font_family: 'Inter'
  },
  pages: [
    {
      slug: 'home',
      title: 'Home',
      template: 'front-page',
      sections: [
        {
          type: 'hero-centered',
          title: 'Welcome',
          subtitle: 'To our site',
          cta_text: 'Learn More',
          cta_url: '/about'
        }
      ]
    },
    {
      slug: 'about',
      title: 'About Us',
      template: 'about'
    }
  ],
  menu: {
    primary: [
      { title: 'Home', url: '/' },
      { title: 'About', url: '/about' }
    ]
  }
};

const TEST_DIR = '/tmp/wpf-test-templates';
const TEMPLATES_DIR = path.join(process.cwd(), '_templates');

describe('Template Engine', () => {
  beforeEach(async () => {
    await mkdir(TEST_DIR, { recursive: true });
  });

  afterEach(async () => {
    await rm(TEST_DIR, { recursive: true, force: true });
  });

  describe('Template Files', () => {
    it('should have base theme templates', async () => {
      const themeTemplates = [
        'theme/base/style.css.ejs',
        'theme/base/functions.php.ejs',
        'theme/base/header.php.ejs',
        'theme/base/footer.php.ejs',
        'theme/base/index.php.ejs',
        'theme/base/tailwind.config.js.ejs',
        'theme/base/package.json.ejs'
      ];

      for (const template of themeTemplates) {
        const exists = await pathExists(path.join(TEMPLATES_DIR, template));
        expect(exists, `Template ${template} should exist`).toBe(true);
      }
    });

    it('should have page templates', async () => {
      const pageTemplates = [
        'theme/pages/front-page.php.ejs',
        'theme/pages/page.php.ejs'
      ];

      for (const template of pageTemplates) {
        const exists = await pathExists(path.join(TEMPLATES_DIR, template));
        expect(exists, `Template ${template} should exist`).toBe(true);
      }
    });

    it('should have section templates', async () => {
      const sectionTemplates = [
        'theme/sections/hero-centered.php.ejs',
        'theme/sections/features-grid.php.ejs',
        'theme/sections/cta-banner.php.ejs'
      ];

      for (const template of sectionTemplates) {
        const exists = await pathExists(path.join(TEMPLATES_DIR, template));
        expect(exists, `Template ${template} should exist`).toBe(true);
      }
    });

    it('should have plugin templates', async () => {
      const pluginTemplates = [
        'plugin/plugin-main.php.ejs',
        'plugin/class-security.php.ejs'
      ];

      for (const template of pluginTemplates) {
        const exists = await pathExists(path.join(TEMPLATES_DIR, template));
        expect(exists, `Template ${template} should exist`).toBe(true);
      }
    });

    it('should have docker templates', async () => {
      const dockerTemplates = [
        'docker/docker-compose.yml.ejs',
        'docker/.env.ejs',
        'docker/uploads.ini.ejs'
      ];

      for (const template of dockerTemplates) {
        const exists = await pathExists(path.join(TEMPLATES_DIR, template));
        expect(exists, `Template ${template} should exist`).toBe(true);
      }
    });

    it('should have test templates', async () => {
      const testTemplates = [
        'tests/pages.spec.ts.ejs',
        'tests/playwright.config.ts.ejs'
      ];

      for (const template of testTemplates) {
        const exists = await pathExists(path.join(TEMPLATES_DIR, template));
        expect(exists, `Template ${template} should exist`).toBe(true);
      }
    });
  });

  describe('Template Content', () => {
    it('should have valid EJS syntax in style.css template', async () => {
      const templatePath = path.join(TEMPLATES_DIR, 'theme/base/style.css.ejs');
      const content = await readFile(templatePath, 'utf-8');

      // Check for EJS placeholders
      expect(content).toContain('<%=');
      expect(content).toContain('config.project.name');
      expect(content).toContain('config.company.name');
    });

    it('should have valid EJS syntax in functions.php template', async () => {
      const templatePath = path.join(TEMPLATES_DIR, 'theme/base/functions.php.ejs');
      const content = await readFile(templatePath, 'utf-8');

      // Check for PHP and EJS
      expect(content).toContain('<?php');
      expect(content).toContain('<%=');
      expect(content).toContain('wp_enqueue_');
    });

    it('should have proper WordPress theme headers in style.css', async () => {
      const templatePath = path.join(TEMPLATES_DIR, 'theme/base/style.css.ejs');
      const content = await readFile(templatePath, 'utf-8');

      expect(content).toContain('Theme Name:');
      expect(content).toContain('Version:');
      expect(content).toContain('Description:');
    });

    it('should have security functions in plugin template', async () => {
      const templatePath = path.join(TEMPLATES_DIR, 'plugin/class-security.php.ejs');
      const content = await readFile(templatePath, 'utf-8');

      expect(content).toContain('wp_nonce');
      expect(content).toContain('sanitize');
    });

    it('should have proper docker-compose structure', async () => {
      const templatePath = path.join(TEMPLATES_DIR, 'docker/docker-compose.yml.ejs');
      const content = await readFile(templatePath, 'utf-8');

      expect(content).toContain('services:');
      expect(content).toContain('wordpress:');
      expect(content).toContain('db:');
      expect(content).toContain('volumes:');
    });
  });

  describe('Template Rendering', () => {
    it('should not have any unclosed EJS tags', async () => {
      const { glob } = await import('glob');
      const templates = await glob('**/*.ejs', { cwd: TEMPLATES_DIR });

      for (const template of templates) {
        const content = await readFile(path.join(TEMPLATES_DIR, template), 'utf-8');

        // Count opening and closing tags
        const openTags = (content.match(/<%[^%]/g) || []).length;
        const closeTags = (content.match(/%>/g) || []).length;

        expect(openTags, `Unclosed EJS tags in ${template}`).toBe(closeTags);
      }
    });
  });
});
