/**
 * AI Content Generation Service
 *
 * Uses Claude to generate business-specific content for WordPress sites
 */

import Anthropic from "@anthropic-ai/sdk";
import { INDUSTRY_PRESETS, type ProjectConfig } from "../types/project.js";

export interface GeneratedContent {
  homepage: {
    headline: string;
    subheadline: string;
    features: Array<{ title: string; description: string; icon: string }>;
    cta: { primary: string; secondary: string };
  };
  about: {
    title: string;
    story: string;
    mission: string;
    values: Array<{ title: string; description: string }>;
  };
  services: Array<{
    title: string;
    description: string;
    features: string[];
  }>;
  contact: {
    headline: string;
    description: string;
  };
  meta: {
    siteDescription: string;
    keywords: string[];
  };
}

export class AIContentService {
  private client: Anthropic;
  private model = "claude-sonnet-4-20250514";

  constructor(apiKey?: string) {
    this.client = new Anthropic({
      apiKey: apiKey || process.env.ANTHROPIC_API_KEY,
    });
  }

  /**
   * Generate all content for a business website
   */
  async generateContent(config: ProjectConfig): Promise<GeneratedContent> {
    const preset =
      INDUSTRY_PRESETS[config.industry] || INDUSTRY_PRESETS.other;

    const prompt = this.buildPrompt(config, preset);

    const response = await this.client.messages.create({
      model: this.model,
      max_tokens: 4096,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract text content
    const textContent = response.content.find((c) => c.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from AI");
    }

    // Parse JSON from response
    const jsonMatch = textContent.text.match(/```json\n([\s\S]*?)\n```/);
    if (!jsonMatch) {
      throw new Error("Could not parse AI response as JSON");
    }

    return JSON.parse(jsonMatch[1]) as GeneratedContent;
  }

  private buildPrompt(
    config: ProjectConfig,
    preset: (typeof INDUSTRY_PRESETS)[string]
  ): string {
    const location =
      config.city && config.state ? `${config.city}, ${config.state}` : "";

    return `You are a professional copywriter creating website content for a ${preset.name.toLowerCase()} business.

## Business Information
- Company Name: ${config.companyName}
- Industry: ${preset.name}
- Location: ${location || "Not specified"}
- Tone: ${preset.tone}
- Services/Features: ${preset.features.join(", ")}

## Task
Generate compelling, professional website content in JSON format. The content should:
1. Be specific to the ${preset.name.toLowerCase()} industry
2. Use a ${preset.tone} tone
3. Include calls-to-action appropriate for the business
4. Be SEO-optimized with relevant keywords
5. Be ready for immediate use (no placeholder text)

## Output Format
Respond with ONLY a JSON code block containing:

\`\`\`json
{
  "homepage": {
    "headline": "Main headline (compelling, benefit-focused)",
    "subheadline": "Supporting text that expands on the headline",
    "features": [
      {
        "title": "Feature/Benefit 1",
        "description": "Brief description",
        "icon": "lucide-icon-name"
      },
      {
        "title": "Feature/Benefit 2",
        "description": "Brief description",
        "icon": "lucide-icon-name"
      },
      {
        "title": "Feature/Benefit 3",
        "description": "Brief description",
        "icon": "lucide-icon-name"
      }
    ],
    "cta": {
      "primary": "Primary button text",
      "secondary": "Secondary button text"
    }
  },
  "about": {
    "title": "About page title",
    "story": "Company story paragraph (2-3 sentences)",
    "mission": "Mission statement (1-2 sentences)",
    "values": [
      {
        "title": "Value 1",
        "description": "Description"
      },
      {
        "title": "Value 2",
        "description": "Description"
      },
      {
        "title": "Value 3",
        "description": "Description"
      }
    ]
  },
  "services": [
    {
      "title": "Service 1",
      "description": "Service description",
      "features": ["Feature 1", "Feature 2", "Feature 3"]
    },
    {
      "title": "Service 2",
      "description": "Service description",
      "features": ["Feature 1", "Feature 2", "Feature 3"]
    },
    {
      "title": "Service 3",
      "description": "Service description",
      "features": ["Feature 1", "Feature 2", "Feature 3"]
    }
  ],
  "contact": {
    "headline": "Contact section headline",
    "description": "Brief invitation to get in touch"
  },
  "meta": {
    "siteDescription": "SEO meta description (150-160 characters)",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
  }
}
\`\`\`

Generate content now for ${config.companyName}:`;
  }

  /**
   * Generate content with fallback to defaults if AI fails
   */
  async generateContentSafe(config: ProjectConfig): Promise<GeneratedContent> {
    try {
      return await this.generateContent(config);
    } catch (error) {
      console.error("AI content generation failed, using defaults:", error);
      return this.getDefaultContent(config);
    }
  }

  /**
   * Default content as fallback
   */
  private getDefaultContent(config: ProjectConfig): GeneratedContent {
    const preset =
      INDUSTRY_PRESETS[config.industry] || INDUSTRY_PRESETS.other;

    return {
      homepage: {
        headline: `Welcome to ${config.companyName}`,
        subheadline: `Your trusted ${preset.name.toLowerCase()} partner`,
        features: [
          {
            title: "Quality Service",
            description:
              "We deliver excellence in everything we do",
            icon: "star",
          },
          {
            title: "Expert Team",
            description:
              "Our professionals are dedicated to your success",
            icon: "users",
          },
          {
            title: "Customer Focus",
            description: "Your satisfaction is our top priority",
            icon: "heart",
          },
        ],
        cta: {
          primary: "Get Started",
          secondary: "Learn More",
        },
      },
      about: {
        title: `About ${config.companyName}`,
        story: `${config.companyName} was founded with a simple mission: to provide exceptional ${preset.name.toLowerCase()} services to our community.`,
        mission:
          "We are committed to delivering outstanding results for every client we serve.",
        values: [
          {
            title: "Excellence",
            description: "We strive for the highest quality in all we do",
          },
          {
            title: "Integrity",
            description: "Honesty and transparency guide our actions",
          },
          {
            title: "Innovation",
            description: "We continuously improve to serve you better",
          },
        ],
      },
      services: preset.features.slice(0, 3).map((feature) => ({
        title: feature
          .split("-")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" "),
        description: `Professional ${feature.replace(/-/g, " ")} services tailored to your needs.`,
        features: [
          "Customized solutions",
          "Expert guidance",
          "Quality results",
        ],
      })),
      contact: {
        headline: "Get in Touch",
        description:
          "We would love to hear from you. Contact us today to discuss how we can help.",
      },
      meta: {
        siteDescription: `${config.companyName} - Professional ${preset.name.toLowerCase()} services in ${config.city || "your area"}.`,
        keywords: [
          preset.name.toLowerCase(),
          config.companyName.toLowerCase(),
          ...(config.city ? [config.city.toLowerCase()] : []),
          "professional",
          "services",
        ],
      },
    };
  }
}

/**
 * Generate content for a project
 */
export async function generateAIContent(
  config: ProjectConfig,
  apiKey?: string
): Promise<GeneratedContent> {
  const service = new AIContentService(apiKey);
  return service.generateContentSafe(config);
}
