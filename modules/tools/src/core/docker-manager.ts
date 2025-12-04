/**
 * WPF v2.0 Docker Manager
 *
 * Manages Docker lifecycle for WordPress development environments
 */
import { execa, type ExecaError } from 'execa';
import { withRecovery, type RecoveryContext } from './error-recovery.js';

export interface DockerStatus {
  running: boolean;
  containers: ContainerInfo[];
  healthy: boolean;
}

export interface ContainerInfo {
  name: string;
  status: string;
  health: string;
  ports: string[];
}

export interface DockerOptions {
  projectPath: string;
  projectName: string;
  verbose?: boolean;
}

/**
 * Check if Docker daemon is running
 */
export async function isDockerRunning(): Promise<boolean> {
  try {
    await execa('docker', ['info'], { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Get container status
 */
export async function getContainerStatus(
  projectName: string
): Promise<ContainerInfo[]> {
  try {
    const { stdout } = await execa('docker', [
      'ps',
      '-a',
      '--filter', `name=${projectName}`,
      '--format', '{{.Names}}|{{.Status}}|{{.Ports}}'
    ]);

    if (!stdout.trim()) return [];

    return stdout.trim().split('\n').map(line => {
      const [name, status, ports] = line.split('|');
      const health = status.includes('healthy') ? 'healthy' :
                     status.includes('unhealthy') ? 'unhealthy' :
                     status.includes('starting') ? 'starting' : 'unknown';

      return {
        name,
        status,
        health,
        ports: ports ? ports.split(',').map(p => p.trim()) : []
      };
    });
  } catch {
    return [];
  }
}

/**
 * Check if project containers are healthy
 */
export async function isHealthy(
  projectName: string,
  timeoutMs: number = 60000
): Promise<boolean> {
  const startTime = Date.now();

  while (Date.now() - startTime < timeoutMs) {
    const containers = await getContainerStatus(projectName);

    // Check if WordPress and DB containers exist and are healthy
    const wpContainer = containers.find(c => c.name.includes('_wp'));
    const dbContainer = containers.find(c => c.name.includes('_db'));

    if (wpContainer?.health === 'healthy' && dbContainer?.health === 'healthy') {
      return true;
    }

    // Wait before next check
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  return false;
}

/**
 * Start Docker environment
 */
export async function startEnvironment(
  options: DockerOptions
): Promise<boolean> {
  const { projectPath, projectName, verbose } = options;
  const context: RecoveryContext = {
    projectPath,
    container: `${projectName}_wp`,
    port: '8080'
  };

  // Check Docker is running
  if (!await isDockerRunning()) {
    throw new Error('Docker daemon is not running');
  }

  // Start with recovery
  return withRecovery(
    async () => {
      if (verbose) console.log('Starting Docker containers...');

      await execa('docker-compose', ['up', '-d'], {
        cwd: projectPath,
        stdio: verbose ? 'inherit' : 'pipe'
      });

      if (verbose) console.log('Waiting for containers to be healthy...');

      const healthy = await isHealthy(projectName, 90000);

      if (!healthy) {
        throw new Error('Containers failed to become healthy');
      }

      return true;
    },
    context,
    3
  );
}

/**
 * Stop Docker environment
 */
export async function stopEnvironment(
  options: DockerOptions
): Promise<boolean> {
  const { projectPath, verbose } = options;

  try {
    if (verbose) console.log('Stopping Docker containers...');

    await execa('docker-compose', ['down'], {
      cwd: projectPath,
      stdio: verbose ? 'inherit' : 'pipe'
    });

    return true;
  } catch (error) {
    console.error('Failed to stop containers:', (error as Error).message);
    return false;
  }
}

/**
 * Restart Docker environment
 */
export async function restartEnvironment(
  options: DockerOptions
): Promise<boolean> {
  await stopEnvironment(options);
  await new Promise(resolve => setTimeout(resolve, 2000));
  return startEnvironment(options);
}

/**
 * Execute WP-CLI command in container
 */
export async function wpCli(
  options: DockerOptions,
  args: string[]
): Promise<string> {
  const { projectPath, projectName, verbose } = options;
  const containerName = `${projectName}_wp`;

  const context: RecoveryContext = {
    projectPath,
    container: containerName
  };

  return withRecovery(
    async () => {
      const { stdout } = await execa('docker', [
        'exec',
        containerName,
        'wp',
        ...args,
        '--allow-root'
      ], {
        cwd: projectPath,
        stdio: verbose ? 'inherit' : 'pipe'
      });

      return stdout || '';
    },
    context,
    2
  );
}

/**
 * Run shell command in WordPress container
 */
export async function execInContainer(
  options: DockerOptions,
  command: string
): Promise<string> {
  const { projectPath, projectName, verbose } = options;
  const containerName = `${projectName}_wp`;

  const { stdout } = await execa('docker', [
    'exec',
    containerName,
    'bash',
    '-c',
    command
  ], {
    cwd: projectPath,
    stdio: verbose ? 'inherit' : 'pipe'
  });

  return stdout || '';
}

/**
 * Copy files to container
 */
export async function copyToContainer(
  options: DockerOptions,
  localPath: string,
  containerPath: string
): Promise<boolean> {
  const { projectName, verbose } = options;
  const containerName = `${projectName}_wp`;

  try {
    await execa('docker', [
      'cp',
      localPath,
      `${containerName}:${containerPath}`
    ]);

    return true;
  } catch (error) {
    if (verbose) console.error('Copy failed:', (error as Error).message);
    return false;
  }
}

/**
 * Fix permissions in container
 */
export async function fixPermissions(
  options: DockerOptions
): Promise<boolean> {
  const { projectName, verbose } = options;
  const containerName = `${projectName}_wp`;

  try {
    await execa('docker', [
      'exec',
      containerName,
      'chown',
      '-R',
      'www-data:www-data',
      '/var/www/html/wp-content'
    ]);

    await execa('docker', [
      'exec',
      containerName,
      'chmod',
      '-R',
      '755',
      '/var/www/html/wp-content'
    ]);

    return true;
  } catch (error) {
    if (verbose) console.error('Permission fix failed:', (error as Error).message);
    return false;
  }
}

/**
 * Get Docker environment status
 */
export async function getStatus(
  options: DockerOptions
): Promise<DockerStatus> {
  const { projectName } = options;

  const dockerRunning = await isDockerRunning();
  if (!dockerRunning) {
    return {
      running: false,
      containers: [],
      healthy: false
    };
  }

  const containers = await getContainerStatus(projectName);
  const running = containers.some(c => c.status.includes('Up'));
  const healthy = containers.every(c => c.health === 'healthy' || c.health === 'unknown');

  return {
    running,
    containers,
    healthy: running && healthy
  };
}

/**
 * View container logs
 */
export async function getLogs(
  options: DockerOptions,
  container: 'wordpress' | 'db' = 'wordpress',
  lines: number = 100
): Promise<string> {
  const { projectPath, projectName } = options;
  const containerName = container === 'wordpress'
    ? `${projectName}_wp`
    : `${projectName}_db`;

  try {
    const { stdout } = await execa('docker', [
      'logs',
      '--tail', String(lines),
      containerName
    ]);

    return stdout || '';
  } catch {
    return '';
  }
}
