#!/usr/bin/env node
/**
 * WPF v2.0 - WordPress Site Factory CLI
 *
 * Config-driven, deterministic WordPress site generation
 * with 100% KB compliance and minimal LLM interaction.
 */
import { Command } from 'commander';
import chalk from 'chalk';

const program = new Command();

program
  .name('wpf')
  .description('WordPress Site Factory - Config-driven WordPress site generation')
  .version('2.0.0');

// Discover command - Interactive config generation
program
  .command('discover')
  .description('Interactive wizard to generate wpf-config.yaml')
  .option('-q, --quick', 'Quick mode with defaults')
  .option('-o, --output <file>', 'Output file path', 'wpf-config.yaml')
  .action(async (options) => {
    const { discover } = await import('./commands/discover.js');
    await discover(options);
  });

// Build command - Main site generation
program
  .command('build [project]')
  .description('Generate WordPress site from configuration')
  .option('-c, --config <file>', 'Configuration file', 'wpf-config.yaml')
  .option('--skip-docker', 'Skip Docker environment setup')
  .option('--skip-wp', 'Skip WordPress installation')
  .option('--skip-tests', 'Skip E2E tests')
  .option('-v, --verbose', 'Verbose output')
  .action(async (project, options) => {
    const { build } = await import('./commands/build.js');
    await build(project, options);
  });

// Validate command - Compliance check
program
  .command('validate [project]')
  .description('Validate site against KB compliance requirements')
  .option('-l, --level <level>', 'Compliance level: minimal, standard, strict', 'strict')
  .option('--json', 'Output as JSON')
  .action(async (project, options) => {
    const { validate } = await import('./commands/validate.js');
    await validate(project, options);
  });

// Doctor command - Troubleshooting
program
  .command('doctor')
  .description('Diagnose and fix common issues')
  .option('--fix', 'Automatically fix issues when possible')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options) => {
    const { doctor } = await import('./commands/doctor.js');
    await doctor(options);
  });

// Parse and execute
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  console.log(chalk.cyan(`
╔═══════════════════════════════════════════════════════════╗
║     WPF v2.0 - WordPress Site Factory                     ║
║     Config-driven, deterministic site generation          ║
╚═══════════════════════════════════════════════════════════╝
`));
  program.help();
}
