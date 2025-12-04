/**
 * WPF v2.0 Build Command
 *
 * Generate WordPress site from configuration
 */
import path from 'path';
import chalk from 'chalk';
import fsExtra from 'fs-extra';
const { pathExists } = fsExtra;
import { build as runBuild, type BuildOptions } from '../../core/build-orchestrator.js';

export interface BuildCommandOptions {
  config?: string;
  skipDocker?: boolean;
  skipWp?: boolean;
  skipTests?: boolean;
  verbose?: boolean;
}

/**
 * Build command handler
 */
export async function build(
  project: string | undefined,
  options: BuildCommandOptions
): Promise<void> {
  const cwd = process.cwd();

  // Determine project directory
  let projectDir: string;
  let configPath: string;

  if (project) {
    // Project name provided
    projectDir = path.join(cwd, 'projects', project);
    configPath = options.config || path.join(projectDir, 'wpf-config.yaml');
  } else {
    // Use current directory
    projectDir = cwd;
    configPath = options.config || path.join(cwd, 'wpf-config.yaml');
  }

  // Check config exists
  if (!await pathExists(configPath)) {
    console.error(chalk.red(`Configuration file not found: ${configPath}`));
    console.log(chalk.yellow('\nTo create a new project configuration, run:'));
    console.log(chalk.cyan('  wpf discover'));
    process.exit(1);
  }

  // Build options
  const buildOptions: BuildOptions = {
    configPath,
    outputDir: projectDir,
    skipDocker: options.skipDocker,
    skipWordPress: options.skipWp,
    skipTests: options.skipTests,
    verbose: options.verbose
  };

  // Run build
  const result = await runBuild(buildOptions);

  // Exit with appropriate code
  process.exit(result.success ? 0 : 1);
}
