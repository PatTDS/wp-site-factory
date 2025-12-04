/**
 * WPF v2.0 Build Orchestrator
 *
 * Main build pipeline that coordinates all generation steps
 */
import ora, { type Ora } from 'ora';
import chalk from 'chalk';
import { execa } from 'execa';
import path from 'path';
import fsExtra from 'fs-extra';
const { pathExists } = fsExtra;

import { loadConfig, type ConfigLoadResult } from './config-loader.js';
import { generateProject, type TemplateResult } from './template-engine.js';
import {
  startEnvironment,
  isHealthy,
  wpCli,
  fixPermissions,
  type DockerOptions
} from './docker-manager.js';
import type { WPFConfig } from '../types/config.js';

export interface BuildOptions {
  configPath: string;
  outputDir: string;
  skipDocker?: boolean;
  skipWordPress?: boolean;
  skipTests?: boolean;
  verbose?: boolean;
}

export interface BuildResult {
  success: boolean;
  duration: number;
  steps: StepResult[];
  config?: WPFConfig;
  errors: string[];
}

export interface StepResult {
  name: string;
  success: boolean;
  duration: number;
  message?: string;
}

type BuildStep = {
  name: string;
  action: () => Promise<void>;
  skip?: boolean;
};

/**
 * Format duration in human-readable format
 */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

/**
 * Main build orchestrator
 */
export async function build(options: BuildOptions): Promise<BuildResult> {
  const startTime = Date.now();
  const steps: StepResult[] = [];
  const errors: string[] = [];
  let config: WPFConfig | undefined;
  let spinner: Ora | undefined;

  const { configPath, outputDir, skipDocker, skipWordPress, skipTests, verbose } = options;

  console.log(chalk.cyan('\n╔═══════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('║           WPF v2.0 Build Pipeline                          ║'));
  console.log(chalk.cyan('╚═══════════════════════════════════════════════════════════╝\n'));

  /**
   * Execute a build step with timing and error handling
   */
  async function executeStep(
    name: string,
    stepNumber: number,
    totalSteps: number,
    action: () => Promise<void>
  ): Promise<boolean> {
    const stepStart = Date.now();
    spinner = ora(`[${stepNumber}/${totalSteps}] ${name}`).start();

    try {
      await action();
      const duration = Date.now() - stepStart;
      spinner.succeed(chalk.green(`[${stepNumber}/${totalSteps}] ${name} (${formatDuration(duration)})`));
      steps.push({ name, success: true, duration });
      return true;
    } catch (error) {
      const duration = Date.now() - stepStart;
      const message = (error as Error).message;
      spinner.fail(chalk.red(`[${stepNumber}/${totalSteps}] ${name} - ${message}`));
      steps.push({ name, success: false, duration, message });
      errors.push(`${name}: ${message}`);
      return false;
    }
  }

  // Define build steps
  const buildSteps: BuildStep[] = [
    // Step 1: Load Configuration
    {
      name: 'Loading configuration',
      action: async () => {
        const result = await loadConfig(configPath);
        if (!result.success || !result.config) {
          throw new Error(result.errors?.join(', ') || 'Failed to load configuration');
        }
        config = result.config;

        if (result.warnings) {
          result.warnings.forEach(w => console.log(chalk.yellow(`  ⚠ ${w}`)));
        }
      }
    },

    // Step 2: Generate Theme
    {
      name: 'Generating theme files',
      action: async () => {
        if (!config) throw new Error('Configuration not loaded');

        const result = await generateProject({
          outputDir,
          config,
          verbose
        });

        if (!result.success) {
          throw new Error(result.errors.join(', '));
        }

        console.log(chalk.gray(`       └─ ${result.filesGenerated} files generated`));
      }
    },

    // Step 3: Build CSS
    {
      name: 'Building assets (Tailwind CSS)',
      action: async () => {
        const themeDir = path.join(outputDir, 'theme');

        // Install npm dependencies
        await execa('npm', ['install'], {
          cwd: themeDir,
          stdio: verbose ? 'inherit' : 'pipe'
        });

        // Build CSS
        await execa('npm', ['run', 'build'], {
          cwd: themeDir,
          stdio: verbose ? 'inherit' : 'pipe'
        });
      }
    },

    // Step 4: Start Docker
    {
      name: 'Starting Docker environment',
      skip: skipDocker,
      action: async () => {
        if (!config) throw new Error('Configuration not loaded');

        const dockerOptions: DockerOptions = {
          projectPath: outputDir,
          projectName: config.project.name,
          verbose
        };

        await startEnvironment(dockerOptions);

        // Wait for healthy state
        const healthy = await isHealthy(config.project.name, 90000);
        if (!healthy) {
          throw new Error('Containers failed health check');
        }
      }
    },

    // Step 5: Install WordPress
    {
      name: 'Installing WordPress',
      skip: skipDocker || skipWordPress,
      action: async () => {
        if (!config) throw new Error('Configuration not loaded');

        const dockerOptions: DockerOptions = {
          projectPath: outputDir,
          projectName: config.project.name,
          verbose
        };

        // Check if already installed
        try {
          await wpCli(dockerOptions, ['core', 'is-installed']);
          console.log(chalk.gray('       └─ WordPress already installed, skipping'));
          return;
        } catch {
          // Not installed, proceed
        }

        // Install WordPress
        await wpCli(dockerOptions, [
          'core', 'install',
          '--url=http://localhost:8080',
          `--title=${config.company.name}`,
          '--admin_user=admin',
          '--admin_password=admin123',
          `--admin_email=${config.contact.email}`,
          '--skip-email'
        ]);
      }
    },

    // Step 6: Activate Theme & Plugin
    {
      name: 'Activating theme and plugin',
      skip: skipDocker || skipWordPress,
      action: async () => {
        if (!config) throw new Error('Configuration not loaded');

        const dockerOptions: DockerOptions = {
          projectPath: outputDir,
          projectName: config.project.name,
          verbose
        };

        // Fix permissions first
        await fixPermissions(dockerOptions);

        // Activate theme
        await wpCli(dockerOptions, [
          'theme', 'activate',
          `${config.project.name}-theme`
        ]);

        // Activate plugin
        try {
          await wpCli(dockerOptions, [
            'plugin', 'activate',
            `${config.project.name}-plugin`
          ]);
        } catch {
          console.log(chalk.gray('       └─ Plugin activation skipped'));
        }
      }
    },

    // Step 7: Install Plugins
    {
      name: 'Installing and configuring plugins',
      skip: skipDocker || skipWordPress,
      action: async () => {
        if (!config) throw new Error('Configuration not loaded');

        const dockerOptions: DockerOptions = {
          projectPath: outputDir,
          projectName: config.project.name,
          verbose
        };

        const plugins = [
          'wordpress-seo',
          'autoptimize',
          'shortpixel-image-optimiser',
          'contact-form-7'
        ];

        for (const plugin of plugins) {
          try {
            await wpCli(dockerOptions, [
              'plugin', 'install', plugin, '--activate'
            ]);
          } catch {
            console.log(chalk.gray(`       └─ ${plugin} install skipped`));
          }
        }
      }
    },

    // Step 8: Create Content
    {
      name: 'Creating pages and menus',
      skip: skipDocker || skipWordPress,
      action: async () => {
        if (!config) throw new Error('Configuration not loaded');

        const dockerOptions: DockerOptions = {
          projectPath: outputDir,
          projectName: config.project.name,
          verbose
        };

        // Create pages
        for (const page of config.pages) {
          try {
            await wpCli(dockerOptions, [
              'post', 'create',
              '--post_type=page',
              `--post_title=${page.title}`,
              `--post_name=${page.slug}`,
              '--post_status=publish'
            ]);
          } catch {
            // Page may already exist
          }
        }

        // Set permalink structure
        await wpCli(dockerOptions, [
          'rewrite', 'structure', '/%postname%/'
        ]);

        // Set homepage
        const homePageId = await wpCli(dockerOptions, [
          'post', 'list',
          '--post_type=page',
          '--name=home',
          '--format=ids'
        ]);

        if (homePageId.trim()) {
          await wpCli(dockerOptions, [
            'option', 'update', 'show_on_front', 'page'
          ]);
          await wpCli(dockerOptions, [
            'option', 'update', 'page_on_front', homePageId.trim()
          ]);
        }
      }
    },

    // Step 9: Run Tests
    {
      name: 'Running E2E tests',
      skip: skipDocker || skipTests,
      action: async () => {
        const testsDir = path.join(outputDir, 'tests');

        if (!await pathExists(testsDir)) {
          console.log(chalk.gray('       └─ Tests directory not found, skipping'));
          return;
        }

        // Install test dependencies
        await execa('npm', ['install'], {
          cwd: testsDir,
          stdio: verbose ? 'inherit' : 'pipe'
        });

        // Install Playwright browsers
        await execa('npx', ['playwright', 'install', 'chromium'], {
          cwd: testsDir,
          stdio: verbose ? 'inherit' : 'pipe'
        });

        // Run tests
        const { stdout } = await execa('npx', ['playwright', 'test'], {
          cwd: testsDir,
          stdio: 'pipe',
          reject: false
        });

        // Parse results
        const passMatch = stdout.match(/(\d+) passed/);
        const failMatch = stdout.match(/(\d+) failed/);

        const passed = passMatch ? parseInt(passMatch[1]) : 0;
        const failed = failMatch ? parseInt(failMatch[1]) : 0;

        if (failed > 0) {
          throw new Error(`${failed} tests failed`);
        }

        console.log(chalk.gray(`       └─ ${passed} tests passed`));
      }
    }
  ];

  // Execute build steps
  const totalSteps = buildSteps.filter(s => !s.skip).length;
  let stepNumber = 0;

  for (const step of buildSteps) {
    if (step.skip) continue;

    stepNumber++;
    const success = await executeStep(step.name, stepNumber, totalSteps, step.action);

    // Stop on critical failures (config, generation, docker start)
    if (!success && stepNumber <= 4) {
      break;
    }
  }

  // Calculate totals
  const duration = Date.now() - startTime;
  const allStepsSucceeded = steps.every(s => s.success);

  // Print summary
  console.log('\n' + chalk.cyan('═'.repeat(60)));

  if (allStepsSucceeded) {
    console.log(chalk.green.bold(`\n✅ Build complete in ${formatDuration(duration)}\n`));

    if (config && !skipDocker) {
      console.log(chalk.white('  Site URL:    ') + chalk.cyan('http://localhost:8080'));
      console.log(chalk.white('  Admin URL:   ') + chalk.cyan('http://localhost:8080/wp-admin'));
      console.log(chalk.white('  Username:    ') + chalk.cyan('admin'));
      console.log(chalk.white('  Password:    ') + chalk.cyan('admin123'));
    }
  } else {
    console.log(chalk.red.bold(`\n❌ Build failed after ${formatDuration(duration)}\n`));
    console.log(chalk.red('Errors:'));
    errors.forEach(e => console.log(chalk.red(`  • ${e}`)));
  }

  console.log('');

  return {
    success: allStepsSucceeded,
    duration,
    steps,
    config,
    errors
  };
}
