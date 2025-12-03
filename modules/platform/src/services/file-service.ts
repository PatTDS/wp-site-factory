import fs from "fs/promises";
import path from "path";
import type { GeneratedFile } from "../types/project";

/**
 * File Service
 *
 * Handles file operations for generated WordPress projects
 */
export class FileService {
  private readonly projectsRoot: string;

  constructor(projectsRoot: string = "/home/atric/wp-site-factory/projects") {
    this.projectsRoot = projectsRoot;
  }

  /**
   * Get the full path for a project
   */
  getProjectPath(projectSlug: string): string {
    return path.join(this.projectsRoot, projectSlug);
  }

  /**
   * Get the theme directory path for a project
   */
  getThemePath(projectSlug: string): string {
    return path.join(this.getProjectPath(projectSlug), "theme");
  }

  /**
   * Check if a project exists
   */
  async projectExists(projectSlug: string): Promise<boolean> {
    try {
      const projectPath = this.getProjectPath(projectSlug);
      await fs.access(projectPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Create project directory structure
   */
  async createProjectStructure(projectSlug: string): Promise<void> {
    const projectPath = this.getProjectPath(projectSlug);
    const themePath = this.getThemePath(projectSlug);

    // Create directories
    await fs.mkdir(projectPath, { recursive: true });
    await fs.mkdir(themePath, { recursive: true });
  }

  /**
   * Save generated files to disk
   */
  async saveFiles(
    projectSlug: string,
    files: GeneratedFile[]
  ): Promise<string> {
    const themePath = this.getThemePath(projectSlug);

    // Ensure theme directory exists
    await fs.mkdir(themePath, { recursive: true });

    // Write all files
    for (const file of files) {
      const filePath = path.join(themePath, file.path);
      const fileDir = path.dirname(filePath);

      // Create directory if needed
      await fs.mkdir(fileDir, { recursive: true });

      // Write file
      await fs.writeFile(filePath, file.content, "utf-8");
    }

    return themePath;
  }

  /**
   * Read project metadata from disk
   */
  async readProjectMetadata(
    projectSlug: string
  ): Promise<Record<string, unknown> | null> {
    try {
      const metadataPath = path.join(
        this.getProjectPath(projectSlug),
        ".wpf-metadata.json"
      );
      const content = await fs.readFile(metadataPath, "utf-8");
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  /**
   * Write project metadata to disk
   */
  async writeProjectMetadata(
    projectSlug: string,
    metadata: Record<string, unknown>
  ): Promise<void> {
    const metadataPath = path.join(
      this.getProjectPath(projectSlug),
      ".wpf-metadata.json"
    );
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), "utf-8");
  }

  /**
   * List all projects in the projects directory
   */
  async listProjects(): Promise<string[]> {
    try {
      const entries = await fs.readdir(this.projectsRoot, {
        withFileTypes: true,
      });
      return entries.filter((entry) => entry.isDirectory()).map((dir) => dir.name);
    } catch {
      return [];
    }
  }

  /**
   * Delete a project directory
   */
  async deleteProject(projectSlug: string): Promise<void> {
    const projectPath = this.getProjectPath(projectSlug);
    await fs.rm(projectPath, { recursive: true, force: true });
  }
}

// Singleton instance
export const fileService = new FileService();
