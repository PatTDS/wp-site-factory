import { z } from "zod";

// Project configuration schema
export const ProjectConfigSchema = z.object({
  // Basic info
  name: z.string().min(1),
  slug: z.string().min(1),
  companyName: z.string().min(1),
  industry: z.string().min(1),

  // Design
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),

  // Contact (optional)
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),

  // Features
  features: z.array(z.string()).optional(),
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;

// Generated file structure
export interface GeneratedFile {
  path: string;
  content: string;
  type: "php" | "css" | "js" | "json" | "html";
}

export interface GenerationResult {
  success: boolean;
  projectId: string;
  slug: string;
  files: GeneratedFile[];
  errors?: string[];
  metadata: {
    generatedAt: string;
    industry: string;
    pages: string[];
    aiContentGenerated?: boolean;
  };
}

// Project with deployment info
export interface Project {
  id: string;
  name: string;
  slug: string;
  companyName: string;
  industry: string;
  status: "generating" | "ready" | "deployed" | "error";
  primaryColor: string;
  secondaryColor: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  createdAt: string;
  updatedAt: string;
  deployments?: Deployment[];
  generatedContent?: Record<string, unknown>;
}

export interface Deployment {
  id: string;
  environment: "development" | "staging" | "production";
  url?: string;
  status: "pending" | "active" | "failed";
  deployedAt: string;
}
