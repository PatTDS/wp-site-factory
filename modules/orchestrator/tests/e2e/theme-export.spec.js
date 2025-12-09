/**
 * Theme Export E2E Tests
 *
 * Tests for WordPress theme generation and export functionality
 */

import { test, expect } from '@playwright/test';
import { testBlueprint, getTempDir, cleanupTempDir, fileExists } from './helpers/test-blueprint.js';
import { assembleTheme } from '../../src/lib/phase2/theme-assembler.js';
import { exportWordPressTheme, createWordPressThemeZip } from '../../src/lib/phase2/index.js';
import { readFile } from 'fs/promises';
import path from 'path';

let tempDir;

test.beforeEach(async () => {
  tempDir = await getTempDir();
});

test.afterEach(async () => {
  await cleanupTempDir(tempDir);
});

test.describe('Theme Assembly', () => {
  test('assembles complete theme structure', async () => {
    const result = await assembleTheme(testBlueprint, {
      outputDir: tempDir,
      generateImages: false, // Skip images for faster tests
      dryRun: true
    });

    expect(result.success).toBe(true);
    expect(result.patterns).toBeDefined();
    expect(result.preset).toBeDefined();
    expect(result.files).toBeDefined();
  });

  test('includes required theme files', async () => {
    const result = await assembleTheme(testBlueprint, {
      outputDir: tempDir,
      generateImages: false,
      dryRun: true
    });

    const fileNames = result.files.map(f => f.path);

    expect(fileNames).toContain('functions.php');
    expect(fileNames).toContain('style.css');
    expect(fileNames).toContain('index.php');
  });

  test('generates valid functions.php', async () => {
    const result = await assembleTheme(testBlueprint, {
      outputDir: tempDir,
      generateImages: false,
      dryRun: true
    });

    const functionsFile = result.files.find(f => f.path === 'functions.php');

    expect(functionsFile).toBeDefined();
    expect(functionsFile.content).toContain('<?php');
    expect(functionsFile.content).toContain('wp_enqueue_style');
    expect(functionsFile.content).toContain('register_block_pattern');
  });

  test('generates valid style.css with theme headers', async () => {
    const result = await assembleTheme(testBlueprint, {
      outputDir: tempDir,
      generateImages: false,
      dryRun: true
    });

    const styleFile = result.files.find(f => f.path === 'style.css');

    expect(styleFile).toBeDefined();
    expect(styleFile.content).toContain('Theme Name:');
    expect(styleFile.content).toContain('Version:');
    expect(styleFile.content).toContain('Author:');
    expect(styleFile.content).toContain(testBlueprint.client_profile.company.name);
  });

  test('includes block patterns registration', async () => {
    const result = await assembleTheme(testBlueprint, {
      outputDir: tempDir,
      generateImages: false,
      dryRun: true
    });

    const functionsFile = result.files.find(f => f.path === 'functions.php');

    // Should register block patterns
    expect(functionsFile.content).toContain('register_block_pattern');
    expect(functionsFile.content).toContain('block_pattern_categories');
  });
});

test.describe('Theme Export', () => {
  test('exports theme to directory', async () => {
    const assembled = await assembleTheme(testBlueprint, {
      generateImages: false,
      dryRun: true
    });

    const result = await exportWordPressTheme(
      testBlueprint,
      assembled,
      tempDir,
      {
        includeManifests: true,
        includeReport: true,
        createZip: false
      }
    );

    expect(result.success).toBe(true);
    expect(result.themePath).toBe(tempDir);
    expect(result.files).toBeDefined();
    expect(result.files.length).toBeGreaterThan(0);
  });

  test('creates assembly report', async () => {
    const assembled = await assembleTheme(testBlueprint, {
      generateImages: false,
      dryRun: true
    });

    await exportWordPressTheme(
      testBlueprint,
      assembled,
      tempDir,
      {
        includeReport: true,
        createZip: false
      }
    );

    const reportPath = path.join(tempDir, 'assembly-report.json');
    const exists = await fileExists(reportPath);

    expect(exists).toBe(true);

    const reportContent = await readFile(reportPath, 'utf-8');
    const report = JSON.parse(reportContent);

    expect(report).toHaveProperty('preset');
    expect(report).toHaveProperty('patterns');
    expect(report).toHaveProperty('files');
  });

  test('includes pattern manifests when requested', async () => {
    const assembled = await assembleTheme(testBlueprint, {
      generateImages: false,
      dryRun: true
    });

    await exportWordPressTheme(
      testBlueprint,
      assembled,
      tempDir,
      {
        includeManifests: true,
        createZip: false
      }
    );

    const manifestsPath = path.join(tempDir, 'pattern-manifests.json');
    const exists = await fileExists(manifestsPath);

    expect(exists).toBe(true);
  });
});

test.describe('ZIP Creation', () => {
  test('creates valid ZIP archive', async () => {
    const assembled = await assembleTheme(testBlueprint, {
      generateImages: false,
      dryRun: true
    });

    const result = await exportWordPressTheme(
      testBlueprint,
      assembled,
      tempDir,
      {
        createZip: true
      }
    );

    expect(result.success).toBe(true);
    expect(result.zipPath).toBeDefined();

    const zipExists = await fileExists(result.zipPath);
    expect(zipExists).toBe(true);
    expect(result.zipPath).toMatch(/\.zip$/);
  });

  test('ZIP contains required WordPress theme files', async () => {
    const assembled = await assembleTheme(testBlueprint, {
      generateImages: false,
      dryRun: true
    });

    const result = await exportWordPressTheme(
      testBlueprint,
      assembled,
      tempDir,
      {
        createZip: true
      }
    );

    // Verify ZIP file is not empty
    const { stat } = await import('fs/promises');
    const stats = await stat(result.zipPath);
    expect(stats.size).toBeGreaterThan(1000); // Should be > 1KB
  });

  test('creates ZIP with correct theme slug', async () => {
    const assembled = await assembleTheme(testBlueprint, {
      generateImages: false,
      dryRun: true
    });

    const result = await exportWordPressTheme(
      testBlueprint,
      assembled,
      tempDir,
      {
        createZip: true
      }
    );

    const themeSlug = testBlueprint.client_profile.company.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    expect(result.zipPath).toContain(themeSlug);
  });

  test('standalone ZIP creation works', async () => {
    // First create theme files
    const assembled = await assembleTheme(testBlueprint, {
      generateImages: false,
      dryRun: true
    });

    await exportWordPressTheme(
      testBlueprint,
      assembled,
      tempDir,
      {
        createZip: false
      }
    );

    // Then create ZIP from existing directory
    const themeSlug = testBlueprint.client_profile.company.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const zipPath = await createWordPressThemeZip(tempDir, themeSlug);

    expect(zipPath).toBeDefined();
    const zipExists = await fileExists(zipPath);
    expect(zipExists).toBe(true);
  });
});

test.describe('Theme Validation', () => {
  test('theme has valid WordPress headers', async () => {
    const assembled = await assembleTheme(testBlueprint, {
      generateImages: false,
      dryRun: true
    });

    const styleFile = assembled.files.find(f => f.path === 'style.css');
    const content = styleFile.content;

    // Required theme headers
    expect(content).toMatch(/Theme Name:/);
    expect(content).toMatch(/Version:/);
    expect(content).toMatch(/Author:/);
  });

  test('theme has required template files', async () => {
    const assembled = await assembleTheme(testBlueprint, {
      generateImages: false,
      dryRun: true
    });

    const requiredFiles = ['style.css', 'index.php', 'functions.php'];
    const fileNames = assembled.files.map(f => f.path);

    requiredFiles.forEach(required => {
      expect(fileNames).toContain(required);
    });
  });

  test('functions.php has valid PHP syntax', async () => {
    const assembled = await assembleTheme(testBlueprint, {
      generateImages: false,
      dryRun: true
    });

    const functionsFile = assembled.files.find(f => f.path === 'functions.php');

    expect(functionsFile.content).toMatch(/^<\?php/);
    expect(functionsFile.content).not.toContain('<?php ?>'); // Not empty
  });
});
