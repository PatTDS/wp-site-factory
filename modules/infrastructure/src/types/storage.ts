/**
 * Storage Configuration
 */
export interface StorageConfig {
  /** Base path for storing project files */
  basePath: string;

  /** Storage provider (local, s3, etc.) */
  provider: 'local' | 's3' | 'gcs';

  /** Provider-specific options */
  options?: Record<string, unknown>;
}

/**
 * Generated file from generator module
 */
export interface GeneratedFile {
  path: string;
  content: string;
  type: 'php' | 'css' | 'js' | 'json' | 'md' | 'xml' | 'txt' | 'other';
  metadata?: {
    encoding?: string;
    permissions?: string;
    [key: string]: unknown;
  };
}

/**
 * Stored project information
 */
export interface StoredProject {
  /** Unique project identifier */
  id: string;

  /** Project slug (used in paths) */
  slug: string;

  /** List of stored files */
  files: StoredFile[];

  /** When project was stored */
  createdAt: Date;

  /** Last modification time */
  updatedAt: Date;

  /** Project metadata */
  metadata: {
    companyName: string;
    domain?: string;
    brandColors?: {
      primary: string;
      secondary: string;
    };
    [key: string]: unknown;
  };

  /** Storage path on disk */
  storagePath: string;
}

/**
 * Stored file information
 */
export interface StoredFile {
  /** Relative path within project */
  relativePath: string;

  /** Absolute path on disk */
  absolutePath: string;

  /** File size in bytes */
  size: number;

  /** File type */
  type: GeneratedFile['type'];

  /** File checksum (for integrity verification) */
  checksum?: string;
}

/**
 * Deployment Configuration
 */
export interface DeploymentConfig {
  /** Deployment provider (sftp, ftp, git, etc.) */
  provider: 'sftp' | 'ftp' | 'git' | 'local';

  /** Deployment environment */
  environment: 'staging' | 'production';

  /** Provider credentials */
  credentials: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    privateKey?: string;
    repository?: string;
    [key: string]: unknown;
  };

  /** Deployment path on target server */
  remotePath: string;

  /** Additional deployment options */
  options?: {
    backup?: boolean;
    runMigrations?: boolean;
    clearCache?: boolean;
    [key: string]: unknown;
  };
}

/**
 * Deployment status
 */
export type DeploymentStatus =
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'failed'
  | 'rolled-back';

/**
 * Deployment result
 */
export interface DeploymentResult {
  /** Whether deployment succeeded */
  success: boolean;

  /** Unique deployment identifier */
  deploymentId: string;

  /** Deployed URL (if applicable) */
  url?: string;

  /** Deployment logs */
  logs: string[];

  /** When deployment completed */
  deployedAt: Date;

  /** Deployment status */
  status: DeploymentStatus;

  /** Error information if failed */
  error?: {
    message: string;
    code?: string;
    details?: unknown;
  };

  /** Deployment metrics */
  metrics?: {
    duration: number; // milliseconds
    filesDeployed: number;
    totalSize: number; // bytes
  };
}

/**
 * Deployment record
 */
export interface DeploymentRecord {
  id: string;
  projectId: string;
  environment: DeploymentConfig['environment'];
  status: DeploymentStatus;
  startedAt: Date;
  completedAt?: Date;
  result?: DeploymentResult;
  config: DeploymentConfig;
}
