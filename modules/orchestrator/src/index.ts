/**
 * WPF Orchestrator Module
 *
 * Generates WordPress themes from project configuration with AI content
 */

// Types
export type {
  ProjectConfig,
  GeneratedFile,
  GenerationResult,
} from "./types/project.js";

export { ProjectConfigSchema, INDUSTRY_PRESETS } from "./types/project.js";

// AI Content Service
export type { GeneratedContent } from "./services/ai-content.js";
export { AIContentService, generateAIContent } from "./services/ai-content.js";

// Generators
export { SiteGenerator, generateSite } from "./generators/site-generator.js";
export {
  EnhancedSiteGenerator,
  generateEnhancedSite,
  type EnhancedGenerationOptions,
} from "./generators/enhanced-generator.js";

// Templates (for advanced customization)
export {
  generateStyleCss,
  generateFunctionsPhp,
  generateIndexPhp,
  generateHeaderPhp,
  generateFooterPhp,
  generateTailwindConfig,
  generatePackageJson,
  generateInputCss,
} from "./templates/theme-base.js";

export {
  generateFrontPagePhp,
  generatePagePhp,
  generateContactPagePhp,
  generateAboutPagePhp,
} from "./templates/page-templates.js";
