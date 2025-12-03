import * as fs from 'fs-extra';
import * as path from 'path';
import * as crypto from 'crypto';
import archiver from 'archiver';
import {
  StorageConfig,
  StoredProject,
  GeneratedFile,
  StoredFile
} from '../types/storage';

/**
 * File Storage Service
 * Handles saving, retrieving, and managing generated WordPress projects
 */
export class FileStorageService {
  private config: StorageConfig;
  private metadataDir: string;

  constructor(config: StorageConfig) {
    this.config = config;
    this.metadataDir = path.join(config.basePath, '.wpf-metadata');
    this.ensureStorageExists();
  }

  /**
   * Ensure storage directories exist
   */
  private async ensureStorageExists(): Promise<void> {
    await fs.ensureDir(this.config.basePath);
    await fs.ensureDir(this.metadataDir);
  }

  /**
   * Generate project storage path
   */
  private getProjectPath(projectId: string): string {
    return path.join(this.config.basePath, projectId);
  }

  /**
   * Generate metadata file path
   */
  private getMetadataPath(projectId: string): string {
    return path.join(this.metadataDir, `${projectId}.json`);
  }

  /**
   * Calculate file checksum
   */
  private calculateChecksum(content: string): string {
    return crypto.createHash('sha256').update(content).digest('hex');
  }

  /**
   * Save project files to disk
   * @param projectId Unique project identifier
   * @param files Array of generated files
   * @param metadata Project metadata
   * @returns Storage path
   */
  async saveProject(
    projectId: string,
    files: GeneratedFile[],
    metadata: StoredProject['metadata']
  ): Promise<string> {
    const projectPath = this.getProjectPath(projectId);

    // Ensure project directory exists
    await fs.ensureDir(projectPath);

    const storedFiles: StoredFile[] = [];

    // Save each file
    for (const file of files) {
      const absolutePath = path.join(projectPath, file.path);
      const relativePath = file.path;

      // Ensure parent directory exists
      await fs.ensureDir(path.dirname(absolutePath));

      // Write file content
      await fs.writeFile(absolutePath, file.content, {
        encoding: file.metadata?.encoding as BufferEncoding || 'utf-8',
      });

      // Set permissions if specified
      if (file.metadata?.permissions) {
        await fs.chmod(absolutePath, file.metadata.permissions);
      }

      // Calculate file size and checksum
      const stats = await fs.stat(absolutePath);
      const checksum = this.calculateChecksum(file.content);

      storedFiles.push({
        relativePath,
        absolutePath,
        size: stats.size,
        type: file.type,
        checksum,
      });
    }

    // Create project metadata
    const storedProject: StoredProject = {
      id: projectId,
      slug: (typeof metadata.slug === 'string' ? metadata.slug : projectId),
      files: storedFiles,
      createdAt: new Date(),
      updatedAt: new Date(),
      metadata,
      storagePath: projectPath,
    };

    // Save metadata
    await fs.writeJson(this.getMetadataPath(projectId), storedProject, {
      spaces: 2,
    });

    return projectPath;
  }

  /**
   * Get project from storage
   * @param projectId Project identifier
   * @returns Stored project or null if not found
   */
  async getProject(projectId: string): Promise<StoredProject | null> {
    const metadataPath = this.getMetadataPath(projectId);

    if (!(await fs.pathExists(metadataPath))) {
      return null;
    }

    const metadata = await fs.readJson(metadataPath);

    // Convert date strings back to Date objects
    return {
      ...metadata,
      createdAt: new Date(metadata.createdAt),
      updatedAt: new Date(metadata.updatedAt),
    };
  }

  /**
   * Delete project from storage
   * @param projectId Project identifier
   * @returns True if deleted, false if not found
   */
  async deleteProject(projectId: string): Promise<boolean> {
    const projectPath = this.getProjectPath(projectId);
    const metadataPath = this.getMetadataPath(projectId);

    const exists = await fs.pathExists(projectPath);

    if (!exists) {
      return false;
    }

    // Remove project directory
    await fs.remove(projectPath);

    // Remove metadata
    if (await fs.pathExists(metadataPath)) {
      await fs.remove(metadataPath);
    }

    return true;
  }

  /**
   * Create ZIP archive of project
   * @param projectId Project identifier
   * @returns Buffer containing ZIP file
   */
  async createZip(projectId: string): Promise<Buffer> {
    const project = await this.getProject(projectId);

    if (!project) {
      throw new Error(`Project not found: ${projectId}`);
    }

    return new Promise((resolve, reject) => {
      const archive = archiver('zip', {
        zlib: { level: 9 }, // Maximum compression
      });

      const buffers: Buffer[] = [];

      archive.on('data', (chunk: Buffer) => {
        buffers.push(chunk);
      });

      archive.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      archive.on('error', (err) => {
        reject(err);
      });

      // Add files to archive
      archive.directory(project.storagePath, project.slug);

      // Finalize archive
      archive.finalize();
    });
  }

  /**
   * List all stored projects
   * @returns Array of project IDs
   */
  async listProjects(): Promise<string[]> {
    const metadataFiles = await fs.readdir(this.metadataDir);

    return metadataFiles
      .filter((file) => file.endsWith('.json'))
      .map((file) => file.replace('.json', ''));
  }

  /**
   * Get project file content
   * @param projectId Project identifier
   * @param filePath Relative file path within project
   * @returns File content or null if not found
   */
  async getFile(projectId: string, filePath: string): Promise<string | null> {
    const project = await this.getProject(projectId);

    if (!project) {
      return null;
    }

    const absolutePath = path.join(project.storagePath, filePath);

    if (!(await fs.pathExists(absolutePath))) {
      return null;
    }

    return fs.readFile(absolutePath, 'utf-8');
  }

  /**
   * Update project file
   * @param projectId Project identifier
   * @param filePath Relative file path within project
   * @param content New file content
   * @returns True if updated successfully
   */
  async updateFile(
    projectId: string,
    filePath: string,
    content: string
  ): Promise<boolean> {
    const project = await this.getProject(projectId);

    if (!project) {
      return false;
    }

    const absolutePath = path.join(project.storagePath, filePath);

    // Ensure parent directory exists
    await fs.ensureDir(path.dirname(absolutePath));

    // Write updated content
    await fs.writeFile(absolutePath, content, 'utf-8');

    // Update file metadata
    const fileIndex = project.files.findIndex(
      (f) => f.relativePath === filePath
    );

    if (fileIndex !== -1) {
      const stats = await fs.stat(absolutePath);
      project.files[fileIndex].size = stats.size;
      project.files[fileIndex].checksum = this.calculateChecksum(content);
    } else {
      // New file - add to metadata
      const stats = await fs.stat(absolutePath);
      project.files.push({
        relativePath: filePath,
        absolutePath,
        size: stats.size,
        type: 'other',
        checksum: this.calculateChecksum(content),
      });
    }

    // Update project metadata
    project.updatedAt = new Date();
    await fs.writeJson(this.getMetadataPath(projectId), project, {
      spaces: 2,
    });

    return true;
  }

  /**
   * Verify project file integrity
   * @param projectId Project identifier
   * @returns Object with verification results
   */
  async verifyIntegrity(projectId: string): Promise<{
    valid: boolean;
    errors: string[];
  }> {
    const project = await this.getProject(projectId);

    if (!project) {
      return {
        valid: false,
        errors: ['Project not found'],
      };
    }

    const errors: string[] = [];

    for (const file of project.files) {
      // Check if file exists
      if (!(await fs.pathExists(file.absolutePath))) {
        errors.push(`Missing file: ${file.relativePath}`);
        continue;
      }

      // Verify checksum if available
      if (file.checksum) {
        const content = await fs.readFile(file.absolutePath, 'utf-8');
        const currentChecksum = this.calculateChecksum(content);

        if (currentChecksum !== file.checksum) {
          errors.push(`Checksum mismatch: ${file.relativePath}`);
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
