/**
 * Enhanced Site Generator
 *
 * Combines template generation with AI content
 */

import type {
  ProjectConfig,
  GeneratedFile,
  GenerationResult,
} from "../types/project.js";
import { INDUSTRY_PRESETS } from "../types/project.js";
import { SiteGenerator } from "./site-generator.js";
import {
  AIContentService,
  type GeneratedContent,
} from "../services/ai-content.js";

export interface EnhancedGenerationOptions {
  useAI?: boolean;
  apiKey?: string;
}

export class EnhancedSiteGenerator {
  private config: ProjectConfig;
  private baseGenerator: SiteGenerator;
  private aiService: AIContentService;

  constructor(config: ProjectConfig, apiKey?: string) {
    this.config = config;
    this.baseGenerator = new SiteGenerator(config);
    this.aiService = new AIContentService(apiKey);
  }

  /**
   * Generate complete WordPress site with AI content
   */
  async generate(
    options: EnhancedGenerationOptions = {}
  ): Promise<GenerationResult> {
    const { useAI = true } = options;

    // Get base theme files
    const baseResult = await this.baseGenerator.generate();

    if (!baseResult.success) {
      return baseResult;
    }

    // Generate AI content if enabled
    let content: GeneratedContent | null = null;
    if (useAI) {
      try {
        content = await this.aiService.generateContentSafe(this.config);
      } catch (error) {
        console.warn("AI content generation failed:", error);
      }
    }

    // Enhance templates with AI content
    const enhancedFiles = this.enhanceWithContent(baseResult.files, content);

    // Add additional files
    enhancedFiles.push(this.generateContentJson(content));
    enhancedFiles.push(this.generateReadme());

    return {
      success: true,
      files: enhancedFiles,
      metadata: {
        ...baseResult.metadata,
        aiContentGenerated: content !== null,
      },
    };
  }

  /**
   * Enhance template files with AI-generated content
   */
  private enhanceWithContent(
    files: GeneratedFile[],
    content: GeneratedContent | null
  ): GeneratedFile[] {
    if (!content) return files;

    return files.map((file) => {
      if (file.path === "front-page.php") {
        return {
          ...file,
          content: this.enhanceFrontPage(file.content, content),
        };
      }
      if (file.path === "page-about.php") {
        return {
          ...file,
          content: this.enhanceAboutPage(file.content, content),
        };
      }
      if (file.path === "page-contact.php") {
        return {
          ...file,
          content: this.enhanceContactPage(file.content, content),
        };
      }
      return file;
    });
  }

  private enhanceFrontPage(
    template: string,
    content: GeneratedContent
  ): string {
    // Replace placeholder text with AI content
    let enhanced = template;

    // Replace hero headline
    enhanced = enhanced.replace(
      /Welcome to.*?<\/h1>/s,
      `${this.escapePhp(content.homepage.headline)}</h1>`
    );

    // Replace subheadline
    enhanced = enhanced.replace(
      /Your trusted partner.*?<\/p>/s,
      `${this.escapePhp(content.homepage.subheadline)}</p>`
    );

    return enhanced;
  }

  private enhanceAboutPage(
    template: string,
    content: GeneratedContent
  ): string {
    let enhanced = template;

    // Replace about title
    enhanced = enhanced.replace(
      /About Us<\/h1>/,
      `${this.escapePhp(content.about.title)}</h1>`
    );

    return enhanced;
  }

  private enhanceContactPage(
    template: string,
    content: GeneratedContent
  ): string {
    let enhanced = template;

    // Replace contact headline
    enhanced = enhanced.replace(
      /Get in Touch<\/h1>/,
      `${this.escapePhp(content.contact.headline)}</h1>`
    );

    return enhanced;
  }

  private escapePhp(text: string): string {
    return text
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\$/g, "\\$");
  }

  /**
   * Generate content.json for use by the theme
   */
  private generateContentJson(
    content: GeneratedContent | null
  ): GeneratedFile {
    const preset =
      INDUSTRY_PRESETS[this.config.industry] || INDUSTRY_PRESETS.other;

    const data = content || {
      homepage: {
        headline: `Welcome to ${this.config.companyName}`,
        subheadline: `Your trusted ${preset.name.toLowerCase()} partner`,
        features: [],
        cta: { primary: "Contact Us", secondary: "Learn More" },
      },
      about: {
        title: `About ${this.config.companyName}`,
        story: "",
        mission: "",
        values: [],
      },
      services: [],
      contact: {
        headline: "Get in Touch",
        description: "Contact us today",
      },
      meta: {
        siteDescription: `${this.config.companyName} - Professional services`,
        keywords: [],
      },
    };

    return {
      path: "content.json",
      content: JSON.stringify(data, null, 2),
      type: "json",
    };
  }

  /**
   * Generate README for the generated theme
   */
  private generateReadme(): GeneratedFile {
    const preset =
      INDUSTRY_PRESETS[this.config.industry] || INDUSTRY_PRESETS.other;

    return {
      path: "README.md",
      content: `# ${this.config.companyName} Theme

Custom WordPress theme generated by WPF (WordPress Site Factory).

## Quick Start

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Build CSS:
   \`\`\`bash
   npm run build
   \`\`\`

3. For development:
   \`\`\`bash
   npm run watch
   \`\`\`

## Theme Details

- **Company:** ${this.config.companyName}
- **Industry:** ${preset.name}
- **Primary Color:** ${this.config.primaryColor}
- **Secondary Color:** ${this.config.secondaryColor}

## Pages

${preset.pages.map((p) => `- ${p.charAt(0).toUpperCase() + p.slice(1)}`).join("\n")}

## Features

${preset.features.map((f) => `- ${f.replace(/-/g, " ")}`).join("\n")}

## Generated Files

- \`style.css\` - Theme header
- \`functions.php\` - Theme setup and configuration
- \`header.php\` - Site header with navigation
- \`footer.php\` - Site footer
- \`front-page.php\` - Homepage template
- \`page.php\` - Default page template
- \`page-contact.php\` - Contact page template
- \`page-about.php\` - About page template
- \`index.php\` - Blog/posts template
- \`tailwind.config.js\` - Tailwind CSS configuration
- \`content.json\` - AI-generated content

## Development

Edit PHP templates in the root directory. Styles are managed via Tailwind CSS in \`src/input.css\`.

### CSS Commands

- \`npm run build\` - Build production CSS (minified)
- \`npm run watch\` - Watch for changes during development

## Support

Generated by WPF v0.1.0
`,
      type: "html", // markdown treated as html for type
    };
  }
}

/**
 * Generate enhanced WordPress site
 */
export async function generateEnhancedSite(
  config: ProjectConfig,
  options: EnhancedGenerationOptions = {}
): Promise<GenerationResult> {
  const generator = new EnhancedSiteGenerator(config, options.apiKey);
  return generator.generate(options);
}
