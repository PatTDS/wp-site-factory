import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration for WPF Orchestrator E2E Tests
 *
 * These tests verify the orchestrator's core functionality:
 * - Pattern loading and generation
 * - WordPress theme export
 * - LLM content generation
 *
 * Note: These are integration tests for Node.js modules,
 * not browser-based E2E tests.
 */
export default defineConfig({
  // Test directory
  testDir: './tests/e2e',

  // Maximum time one test can run
  timeout: 30000,

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Number of workers (use 1 worker for CI for stability)
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html'],
    ['list'],
    ...(process.env.CI ? [['github']] : [])
  ],

  // Shared settings for all tests
  use: {
    // Base URL (not used for Node.js tests, but required by Playwright)
    baseURL: 'http://localhost:8080',

    // Collect trace on first retry
    trace: 'on-first-retry',

    // Screenshot on failure
    screenshot: 'only-on-failure',
  },

  // Configure projects for different test types
  projects: [
    {
      name: 'orchestrator',
      testMatch: /.*\.spec\.js/,
    },
  ],

  // Output directory for test artifacts
  outputDir: 'test-results/',
});
