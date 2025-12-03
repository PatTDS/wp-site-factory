import { describe, it, expect, vi } from "vitest";
import { AIContentService, generateAIContent } from "../src/services/ai-content.js";
import { ProjectConfig } from "../src/types/project.js";

describe("AIContentService", () => {
  const validConfig: ProjectConfig = {
    name: "Test Restaurant",
    slug: "test-restaurant",
    companyName: "Test Restaurant LLC",
    industry: "restaurant",
    primaryColor: "#16a34a",
    secondaryColor: "#0f766e",
    email: "test@restaurant.com",
    phone: "(555) 123-4567",
    city: "Springfield",
    state: "IL",
  };

  describe("constructor", () => {
    it("should create instance without API key", () => {
      const service = new AIContentService();
      expect(service).toBeInstanceOf(AIContentService);
    });

    it("should create instance with API key", () => {
      const service = new AIContentService("test-api-key");
      expect(service).toBeInstanceOf(AIContentService);
    });
  });

  describe("getDefaultContent", () => {
    it("should generate default content for restaurant", () => {
      const service = new AIContentService();
      // Access private method via type assertion for testing
      const content = (service as any).getDefaultContent(validConfig);

      expect(content).toBeDefined();
      expect(content.homepage).toBeDefined();
      expect(content.about).toBeDefined();
      expect(content.services).toBeDefined();
      expect(content.contact).toBeDefined();
      expect(content.meta).toBeDefined();
    });

    it("should include company name in homepage headline", () => {
      const service = new AIContentService();
      const content = (service as any).getDefaultContent(validConfig);

      expect(content.homepage.headline).toContain(validConfig.companyName);
    });

    it("should include industry-specific content", () => {
      const service = new AIContentService();
      const content = (service as any).getDefaultContent(validConfig);

      expect(content.homepage.subheadline.toLowerCase()).toContain("restaurant");
    });

    it("should generate 3 homepage features", () => {
      const service = new AIContentService();
      const content = (service as any).getDefaultContent(validConfig);

      expect(content.homepage.features).toHaveLength(3);
      expect(content.homepage.features[0]).toHaveProperty("title");
      expect(content.homepage.features[0]).toHaveProperty("description");
      expect(content.homepage.features[0]).toHaveProperty("icon");
    });

    it("should generate valid CTA buttons", () => {
      const service = new AIContentService();
      const content = (service as any).getDefaultContent(validConfig);

      expect(content.homepage.cta.primary).toBeDefined();
      expect(content.homepage.cta.secondary).toBeDefined();
      expect(content.homepage.cta.primary.length).toBeGreaterThan(0);
    });

    it("should generate about section with values", () => {
      const service = new AIContentService();
      const content = (service as any).getDefaultContent(validConfig);

      expect(content.about.title).toContain(validConfig.companyName);
      expect(content.about.story).toBeDefined();
      expect(content.about.mission).toBeDefined();
      expect(content.about.values).toHaveLength(3);
    });

    it("should generate services array", () => {
      const service = new AIContentService();
      const content = (service as any).getDefaultContent(validConfig);

      expect(Array.isArray(content.services)).toBe(true);
      expect(content.services.length).toBeGreaterThan(0);
      content.services.forEach((service) => {
        expect(service).toHaveProperty("title");
        expect(service).toHaveProperty("description");
        expect(service).toHaveProperty("features");
        expect(Array.isArray(service.features)).toBe(true);
      });
    });

    it("should generate contact section", () => {
      const service = new AIContentService();
      const content = (service as any).getDefaultContent(validConfig);

      expect(content.contact.headline).toBeDefined();
      expect(content.contact.description).toBeDefined();
    });

    it("should generate SEO metadata", () => {
      const service = new AIContentService();
      const content = (service as any).getDefaultContent(validConfig);

      expect(content.meta.siteDescription).toBeDefined();
      expect(content.meta.siteDescription).toContain(validConfig.companyName);
      expect(content.meta.keywords).toBeInstanceOf(Array);
      expect(content.meta.keywords.length).toBeGreaterThan(0);
    });

    it("should include city in metadata when provided", () => {
      const service = new AIContentService();
      const content = (service as any).getDefaultContent(validConfig);

      expect(content.meta.siteDescription).toContain(validConfig.city!);
      expect(content.meta.keywords).toContain(validConfig.city!.toLowerCase());
    });

    it("should handle config without city", () => {
      const configWithoutCity = { ...validConfig };
      delete configWithoutCity.city;

      const service = new AIContentService();
      const content = (service as any).getDefaultContent(configWithoutCity);

      expect(content.meta.siteDescription).toBeDefined();
      expect(content.meta.keywords).toBeInstanceOf(Array);
    });
  });

  describe("generateContentSafe", () => {
    it("should return default content when API fails", async () => {
      const service = new AIContentService("invalid-key");
      const content = await service.generateContentSafe(validConfig);

      expect(content).toBeDefined();
      expect(content.homepage).toBeDefined();
      expect(content.about).toBeDefined();
      expect(content.services).toBeDefined();
    });

    it("should handle different industries", async () => {
      const industries = ["healthcare", "legal", "fitness", "technology", "other"];

      for (const industry of industries) {
        const config = { ...validConfig, industry };
        const service = new AIContentService();
        const content = await service.generateContentSafe(config);

        expect(content).toBeDefined();
        expect(content.homepage.headline).toBeDefined();
      }
    });
  });

  describe("industry-specific content", () => {
    it("should generate healthcare-specific content", () => {
      const healthcareConfig = { ...validConfig, industry: "healthcare" };
      const service = new AIContentService();
      const content = (service as any).getDefaultContent(healthcareConfig);

      expect(content.homepage.subheadline.toLowerCase()).toContain("healthcare");
    });

    it("should generate legal-specific content", () => {
      const legalConfig = { ...validConfig, industry: "legal" };
      const service = new AIContentService();
      const content = (service as any).getDefaultContent(legalConfig);

      expect(content.homepage.subheadline.toLowerCase()).toContain("legal");
    });

    it("should generate fitness-specific content", () => {
      const fitnessConfig = { ...validConfig, industry: "fitness" };
      const service = new AIContentService();
      const content = (service as any).getDefaultContent(fitnessConfig);

      expect(content.homepage.subheadline.toLowerCase()).toContain("fitness");
    });
  });

  describe("generateAIContent function", () => {
    it("should return content without API key", async () => {
      const content = await generateAIContent(validConfig);

      expect(content).toBeDefined();
      expect(content.homepage).toBeDefined();
    });

    it("should handle optional API key parameter", async () => {
      const content = await generateAIContent(validConfig, "test-key");

      expect(content).toBeDefined();
      expect(content.homepage).toBeDefined();
    });
  });

  describe("content structure validation", () => {
    it("should generate content matching GeneratedContent interface", () => {
      const service = new AIContentService();
      const content = (service as any).getDefaultContent(validConfig);

      // Homepage structure
      expect(content.homepage).toHaveProperty("headline");
      expect(content.homepage).toHaveProperty("subheadline");
      expect(content.homepage).toHaveProperty("features");
      expect(content.homepage).toHaveProperty("cta");

      // About structure
      expect(content.about).toHaveProperty("title");
      expect(content.about).toHaveProperty("story");
      expect(content.about).toHaveProperty("mission");
      expect(content.about).toHaveProperty("values");

      // Services structure
      expect(Array.isArray(content.services)).toBe(true);

      // Contact structure
      expect(content.contact).toHaveProperty("headline");
      expect(content.contact).toHaveProperty("description");

      // Meta structure
      expect(content.meta).toHaveProperty("siteDescription");
      expect(content.meta).toHaveProperty("keywords");
    });

    it("should generate non-empty content", () => {
      const service = new AIContentService();
      const content = (service as any).getDefaultContent(validConfig);

      expect(content.homepage.headline.length).toBeGreaterThan(0);
      expect(content.homepage.subheadline.length).toBeGreaterThan(0);
      expect(content.about.story.length).toBeGreaterThan(0);
      expect(content.contact.headline.length).toBeGreaterThan(0);
    });

    it("should generate valid icon names for features", () => {
      const service = new AIContentService();
      const content = (service as any).getDefaultContent(validConfig);

      content.homepage.features.forEach((feature) => {
        expect(feature.icon).toBeDefined();
        expect(typeof feature.icon).toBe("string");
        expect(feature.icon.length).toBeGreaterThan(0);
      });
    });
  });

  describe("error handling", () => {
    it("should not throw when generateContentSafe is called", async () => {
      const service = new AIContentService();
      await expect(service.generateContentSafe(validConfig)).resolves.toBeDefined();
    });

    it("should handle missing optional fields gracefully", async () => {
      const minimalConfig: ProjectConfig = {
        name: "Test",
        slug: "test",
        companyName: "Test Company",
        industry: "other",
        primaryColor: "#000000",
        secondaryColor: "#ffffff",
      };

      const service = new AIContentService();
      const content = await service.generateContentSafe(minimalConfig);

      expect(content).toBeDefined();
      expect(content.homepage).toBeDefined();
    });
  });
});
