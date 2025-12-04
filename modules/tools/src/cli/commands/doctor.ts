/**
 * WPF v2.0 Doctor Command
 *
 * Health check and diagnostics for WPF environment
 */
import chalk from 'chalk';
import { execa } from 'execa';
import fsExtra from 'fs-extra';
const { pathExists } = fsExtra;
import path from 'path';

export interface DoctorOptions {
  fix?: boolean;
  verbose?: boolean;
}

interface CheckResult {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
  fixable?: boolean;
  fix?: () => Promise<void>;
}

/**
 * Check if a command exists
 */
async function commandExists(cmd: string): Promise<boolean> {
  try {
    await execa('which', [cmd]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get command version
 */
async function getVersion(cmd: string, args: string[] = ['--version']): Promise<string> {
  try {
    const { stdout } = await execa(cmd, args);
    return stdout.trim().split('\n')[0];
  } catch {
    return 'unknown';
  }
}

/**
 * Run all health checks
 */
async function runChecks(options: DoctorOptions): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  // Check 1: Node.js version
  const nodeVersion = process.version;
  const nodeMajor = parseInt(nodeVersion.slice(1).split('.')[0]);
  results.push({
    name: 'Node.js',
    status: nodeMajor >= 18 ? 'pass' : nodeMajor >= 16 ? 'warn' : 'fail',
    message: nodeMajor >= 18
      ? `${nodeVersion} (recommended)`
      : nodeMajor >= 16
        ? `${nodeVersion} (upgrade to 18+ recommended)`
        : `${nodeVersion} (requires 18+)`
  });

  // Check 2: npm
  const npmVersion = await getVersion('npm');
  results.push({
    name: 'npm',
    status: npmVersion !== 'unknown' ? 'pass' : 'fail',
    message: npmVersion !== 'unknown' ? npmVersion : 'Not found'
  });

  // Check 3: Docker
  const dockerExists = await commandExists('docker');
  if (dockerExists) {
    try {
      await execa('docker', ['info'], { stdio: 'pipe' });
      const dockerVersion = await getVersion('docker', ['--version']);
      results.push({
        name: 'Docker',
        status: 'pass',
        message: dockerVersion
      });
    } catch {
      results.push({
        name: 'Docker',
        status: 'warn',
        message: 'Installed but daemon not running',
        fixable: true,
        fix: async () => {
          console.log(chalk.yellow('  → Start Docker Desktop or run: sudo systemctl start docker'));
        }
      });
    }
  } else {
    results.push({
      name: 'Docker',
      status: 'fail',
      message: 'Not installed',
      fixable: false
    });
  }

  // Check 4: Docker Compose
  const composeExists = await commandExists('docker-compose');
  if (composeExists) {
    const composeVersion = await getVersion('docker-compose', ['--version']);
    results.push({
      name: 'Docker Compose',
      status: 'pass',
      message: composeVersion
    });
  } else {
    // Check for docker compose (V2 plugin)
    try {
      const { stdout } = await execa('docker', ['compose', 'version']);
      results.push({
        name: 'Docker Compose',
        status: 'pass',
        message: stdout.trim()
      });
    } catch {
      results.push({
        name: 'Docker Compose',
        status: 'fail',
        message: 'Not installed'
      });
    }
  }

  // Check 5: Git
  const gitExists = await commandExists('git');
  if (gitExists) {
    const gitVersion = await getVersion('git');
    results.push({
      name: 'Git',
      status: 'pass',
      message: gitVersion
    });
  } else {
    results.push({
      name: 'Git',
      status: 'warn',
      message: 'Not installed (optional but recommended)'
    });
  }

  // Check 6: Templates directory
  const templatesDir = path.join(process.cwd(), '_templates');
  const templatesExist = await pathExists(templatesDir);
  results.push({
    name: 'Templates',
    status: templatesExist ? 'pass' : 'fail',
    message: templatesExist
      ? 'Found at _templates/'
      : 'Missing _templates/ directory'
  });

  // Check 7: KB requirements
  const kbPath = path.join(process.cwd(), 'kb', 'requirements.yaml');
  const kbExists = await pathExists(kbPath);
  results.push({
    name: 'KB Requirements',
    status: kbExists ? 'pass' : 'warn',
    message: kbExists
      ? 'Found at kb/requirements.yaml'
      : 'Missing kb/requirements.yaml (compliance features disabled)'
  });

  // Check 8: Error handlers
  const errorsPath = path.join(process.cwd(), 'kb', 'error-handlers.yaml');
  const errorsExist = await pathExists(errorsPath);
  results.push({
    name: 'Error Handlers',
    status: errorsExist ? 'pass' : 'warn',
    message: errorsExist
      ? 'Found at kb/error-handlers.yaml'
      : 'Missing kb/error-handlers.yaml (auto-recovery disabled)'
  });

  // Check 9: TypeScript compiled
  const distDir = path.join(process.cwd(), 'dist');
  const distExists = await pathExists(distDir);
  results.push({
    name: 'Build Status',
    status: distExists ? 'pass' : 'warn',
    message: distExists
      ? 'Compiled (dist/ found)'
      : 'Not compiled (run npm run build)',
    fixable: true,
    fix: async () => {
      console.log(chalk.yellow('  → Running npm run build...'));
      await execa('npm', ['run', 'build'], { stdio: 'inherit' });
    }
  });

  // Check 10: Projects directory
  const projectsDir = path.join(process.cwd(), 'projects');
  const projectsExists = await pathExists(projectsDir);
  results.push({
    name: 'Projects Directory',
    status: projectsExists ? 'pass' : 'warn',
    message: projectsExists
      ? 'Found at projects/'
      : 'Missing projects/ directory',
    fixable: true,
    fix: async () => {
      const { mkdir } = await import('fs-extra');
      await mkdir(projectsDir, { recursive: true });
      console.log(chalk.green('  → Created projects/'));
    }
  });

  return results;
}

/**
 * Doctor command handler
 */
export async function doctor(options: DoctorOptions): Promise<void> {
  console.log(chalk.cyan('\n╔═══════════════════════════════════════════════════════════╗'));
  console.log(chalk.cyan('║          WPF Environment Doctor                            ║'));
  console.log(chalk.cyan('╚═══════════════════════════════════════════════════════════╝\n'));

  console.log(chalk.white('Running health checks...\n'));

  const results = await runChecks(options);

  let passed = 0;
  let warnings = 0;
  let failed = 0;
  const fixable: CheckResult[] = [];

  for (const result of results) {
    let icon: string;
    let color: typeof chalk;

    switch (result.status) {
      case 'pass':
        icon = '✓';
        color = chalk.green;
        passed++;
        break;
      case 'warn':
        icon = '⚠';
        color = chalk.yellow;
        warnings++;
        if (result.fixable) fixable.push(result);
        break;
      case 'fail':
        icon = '✗';
        color = chalk.red;
        failed++;
        if (result.fixable) fixable.push(result);
        break;
    }

    console.log(color(`  ${icon} ${result.name}: ${result.message}`));
  }

  // Summary
  console.log(chalk.cyan('\n' + '═'.repeat(60)));
  console.log('');
  console.log(chalk.white('  Summary:'));
  console.log(chalk.green(`    Passed:   ${passed}`));
  console.log(chalk.yellow(`    Warnings: ${warnings}`));
  console.log(chalk.red(`    Failed:   ${failed}`));
  console.log('');

  // Auto-fix
  if (options.fix && fixable.length > 0) {
    console.log(chalk.yellow('\nAttempting auto-fixes...\n'));

    for (const result of fixable) {
      if (result.fix) {
        console.log(chalk.yellow(`  Fixing: ${result.name}`));
        try {
          await result.fix();
        } catch (error) {
          console.log(chalk.red(`    Failed: ${(error as Error).message}`));
        }
      }
    }

    console.log('');
  } else if (fixable.length > 0 && !options.fix) {
    console.log(chalk.yellow(`\n  ${fixable.length} issues can be auto-fixed. Run with --fix to attempt repairs.\n`));
  }

  // Overall status
  if (failed === 0 && warnings === 0) {
    console.log(chalk.green.bold('✅ Environment is healthy!\n'));
  } else if (failed === 0) {
    console.log(chalk.yellow.bold('⚠️  Environment is functional with warnings.\n'));
  } else {
    console.log(chalk.red.bold('❌ Environment has issues that need attention.\n'));
  }

  // Exit code based on failures
  if (failed > 0) {
    process.exit(1);
  }
}
