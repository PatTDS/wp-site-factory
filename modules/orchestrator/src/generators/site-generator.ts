import type {
  ProjectConfig,
  GeneratedFile,
  GenerationResult,
} from "../types/project.js";
import { ProjectConfigSchema, INDUSTRY_PRESETS } from "../types/project.js";
import {
  generateStyleCss,
  generateFunctionsPhp,
  generateIndexPhp,
  generateHeaderPhp,
  generateFooterPhp,
  generateTailwindConfig,
  generatePackageJson,
  generateInputCss,
} from "../templates/theme-base.js";
import {
  generateFrontPagePhp,
  generatePagePhp,
  generateContactPagePhp,
  generateAboutPagePhp,
} from "../templates/page-templates.js";

export class SiteGenerator {
  private config: ProjectConfig;

  constructor(config: ProjectConfig) {
    // Validate config
    const result = ProjectConfigSchema.safeParse(config);
    if (!result.success) {
      throw new Error(`Invalid project config: ${result.error.message}`);
    }
    this.config = result.data;
  }

  /**
   * Generate all WordPress theme files
   */
  async generate(): Promise<GenerationResult> {
    const files: GeneratedFile[] = [];
    const errors: string[] = [];

    try {
      // Base theme files
      files.push({
        path: "style.css",
        content: generateStyleCss(this.config),
        type: "css",
      });

      files.push({
        path: "functions.php",
        content: generateFunctionsPhp(this.config),
        type: "php",
      });

      files.push({
        path: "index.php",
        content: generateIndexPhp(this.config),
        type: "php",
      });

      files.push({
        path: "header.php",
        content: generateHeaderPhp(this.config),
        type: "php",
      });

      files.push({
        path: "footer.php",
        content: generateFooterPhp(this.config),
        type: "php",
      });

      // Page templates
      files.push({
        path: "front-page.php",
        content: generateFrontPagePhp(this.config),
        type: "php",
      });

      files.push({
        path: "page.php",
        content: generatePagePhp(this.config),
        type: "php",
      });

      files.push({
        path: "page-contact.php",
        content: generateContactPagePhp(this.config),
        type: "php",
      });

      files.push({
        path: "page-about.php",
        content: generateAboutPagePhp(this.config),
        type: "php",
      });

      // Build configuration
      files.push({
        path: "tailwind.config.js",
        content: generateTailwindConfig(this.config),
        type: "js",
      });

      files.push({
        path: "package.json",
        content: generatePackageJson(this.config),
        type: "json",
      });

      files.push({
        path: "src/input.css",
        content: generateInputCss(),
        type: "css",
      });

      // JavaScript file for mobile menu
      files.push({
        path: "src/main.js",
        content: this.generateMainJs(),
        type: "js",
      });

      // Screenshot placeholder
      files.push({
        path: "screenshot.png",
        content: "", // Will be generated separately
        type: "html", // Placeholder
      });

    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Unknown error");
    }

    const preset = INDUSTRY_PRESETS[this.config.industry] || INDUSTRY_PRESETS.other;

    return {
      success: errors.length === 0,
      files,
      errors: errors.length > 0 ? errors : undefined,
      metadata: {
        generatedAt: new Date().toISOString(),
        industry: this.config.industry,
        pages: preset.pages,
      },
    };
  }

  /**
   * Generate main JavaScript file
   */
  private generateMainJs(): string {
    return `/**
 * ${this.config.companyName} Theme JavaScript
 */

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
  const menuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function() {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Close mobile menu when clicking outside
  document.addEventListener('click', function(event) {
    if (mobileMenu && !mobileMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      mobileMenu.classList.add('hidden');
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
`;
  }

  /**
   * Get list of pages to create
   */
  getPages(): string[] {
    const preset = INDUSTRY_PRESETS[this.config.industry] || INDUSTRY_PRESETS.other;
    return preset.pages;
  }

  /**
   * Get industry features
   */
  getFeatures(): string[] {
    const preset = INDUSTRY_PRESETS[this.config.industry] || INDUSTRY_PRESETS.other;
    return preset.features;
  }
}

/**
 * Generate a WordPress theme from project configuration
 */
export async function generateSite(
  config: ProjectConfig
): Promise<GenerationResult> {
  const generator = new SiteGenerator(config);
  return generator.generate();
}
