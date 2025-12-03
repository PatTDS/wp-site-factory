import type {
  ProjectConfig,
  GenerationResult,
  Project,
} from "../types/project";
import { fileService } from "./file-service";

// Import from orchestrator module (installed as local dependency)
import { generateEnhancedSite } from "@wpf/orchestrator";

/**
 * Project Service
 *
 * Orchestrates project generation using the orchestrator module
 */
export class ProjectService {
  /**
   * Generate a new WordPress project
   */
  async generateProject(config: ProjectConfig): Promise<GenerationResult> {
    const projectId = `proj_${Date.now()}`;

    try {
      // Check if project already exists
      const exists = await fileService.projectExists(config.slug);
      if (exists) {
        throw new Error(`Project with slug "${config.slug}" already exists`);
      }

      // Create project structure
      await fileService.createProjectStructure(config.slug);

      // Generate site using orchestrator
      const result = await generateEnhancedSite(config, {
        useAI: true, // Enable AI content generation
      });

      if (!result.success) {
        throw new Error(
          `Generation failed: ${result.errors?.join(", ") || "Unknown error"}`
        );
      }

      // Save generated files to disk
      await fileService.saveFiles(config.slug, result.files);

      // Save project metadata
      await fileService.writeProjectMetadata(config.slug, {
        id: projectId,
        ...config,
        status: "ready",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        generation: result.metadata,
      });

      return {
        success: true,
        projectId,
        slug: config.slug,
        files: result.files,
        metadata: result.metadata,
      };
    } catch (error) {
      // Clean up on error
      try {
        await fileService.deleteProject(config.slug);
      } catch {
        // Ignore cleanup errors
      }

      return {
        success: false,
        projectId,
        slug: config.slug,
        files: [],
        errors: [error instanceof Error ? error.message : "Unknown error"],
        metadata: {
          generatedAt: new Date().toISOString(),
          industry: config.industry,
          pages: [],
        },
      };
    }
  }

  /**
   * Get all projects
   */
  async listProjects(): Promise<Project[]> {
    const projectSlugs = await fileService.listProjects();
    const projects: Project[] = [];

    for (const slug of projectSlugs) {
      const metadata = await fileService.readProjectMetadata(slug);
      if (metadata) {
        projects.push({
          id: metadata.id as string,
          name: metadata.name as string,
          slug,
          companyName: metadata.companyName as string,
          industry: metadata.industry as string,
          status: (metadata.status as Project["status"]) || "ready",
          primaryColor: metadata.primaryColor as string,
          secondaryColor: metadata.secondaryColor as string,
          email: metadata.email as string | undefined,
          phone: metadata.phone as string | undefined,
          address: metadata.address as string | undefined,
          city: metadata.city as string | undefined,
          state: metadata.state as string | undefined,
          createdAt: metadata.createdAt as string,
          updatedAt: metadata.updatedAt as string,
        });
      }
    }

    return projects.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  /**
   * Get a single project by ID
   */
  async getProject(projectId: string): Promise<Project | null> {
    const projects = await this.listProjects();
    return projects.find((p) => p.id === projectId) || null;
  }

  /**
   * Delete a project
   */
  async deleteProject(projectId: string): Promise<void> {
    const projects = await this.listProjects();
    const project = projects.find((p) => p.id === projectId);

    if (!project) {
      throw new Error(`Project ${projectId} not found`);
    }

    await fileService.deleteProject(project.slug);
  }
}

// Singleton instance
export const projectService = new ProjectService();
