import { describe, it, expect } from "vitest";
import { SiteGenerator, generateSite } from "../src/generators/site-generator.js";
import { ProjectConfig, INDUSTRY_PRESETS } from "../src/types/project.js";

describe("SiteGenerator", () => {
  const validConfig: ProjectConfig = {
    name: "Test Restaurant",
    slug: "test-restaurant",
    companyName: "Test Restaurant LLC",
    industry: "restaurant",
    primaryColor: "#16a34a",
    secondaryColor: "#0f766e",
    email: "test@restaurant.com",
    phone: "(555) 123-4567",
    address: "123 Main St",
    city: "Springfield",
    state: "IL",
  };

  describe("constructor", () => {
    it("should create instance with valid config", () => {
      const generator = new SiteGenerator(validConfig);
      expect(generator).toBeInstanceOf(SiteGenerator);
    });

    it("should throw error with invalid config - missing required fields", () => {
      const invalidConfig = {
        name: "",
        slug: "test",
      } as ProjectConfig;

      expect(() => new SiteGenerator(invalidConfig)).toThrow(/Invalid project config/);
    });

    it("should throw error with invalid color format", () => {
      const invalidConfig = {
        ...validConfig,
        primaryColor: "invalid-color",
      };

      expect(() => new SiteGenerator(invalidConfig)).toThrow(/Invalid project config/);
    });

    it("should throw error with invalid email", () => {
      const invalidConfig = {
        ...validConfig,
        email: "not-an-email",
      };

      expect(() => new SiteGenerator(invalidConfig)).toThrow(/Invalid project config/);
    });
  });

  describe("generate", () => {
    it("should generate all expected theme files", async () => {
      const generator = new SiteGenerator(validConfig);
      const result = await generator.generate();

      expect(result.success).toBe(true);
      expect(result.files.length).toBeGreaterThan(0);

      // Check for essential files
      const filePaths = result.files.map((f) => f.path);
      expect(filePaths).toContain("style.css");
      expect(filePaths).toContain("functions.php");
      expect(filePaths).toContain("index.php");
      expect(filePaths).toContain("header.php");
      expect(filePaths).toContain("footer.php");
      expect(filePaths).toContain("front-page.php");
      expect(filePaths).toContain("page.php");
      expect(filePaths).toContain("page-contact.php");
      expect(filePaths).toContain("page-about.php");
      expect(filePaths).toContain("tailwind.config.js");
      expect(filePaths).toContain("package.json");
      expect(filePaths).toContain("src/input.css");
      expect(filePaths).toContain("src/main.js");
    });

    it("should generate files with correct types", async () => {
      const generator = new SiteGenerator(validConfig);
      const result = await generator.generate();

      const styleFile = result.files.find((f) => f.path === "style.css");
      expect(styleFile?.type).toBe("css");

      const functionsFile = result.files.find((f) => f.path === "functions.php");
      expect(functionsFile?.type).toBe("php");

      const tailwindFile = result.files.find((f) => f.path === "tailwind.config.js");
      expect(tailwindFile?.type).toBe("js");

      const packageFile = result.files.find((f) => f.path === "package.json");
      expect(packageFile?.type).toBe("json");
    });

    it("should include company name in generated content", async () => {
      const generator = new SiteGenerator(validConfig);
      const result = await generator.generate();

      const styleFile = result.files.find((f) => f.path === "style.css");
      expect(styleFile?.content).toContain(validConfig.companyName);

      const jsFile = result.files.find((f) => f.path === "src/main.js");
      expect(jsFile?.content).toContain(validConfig.companyName);
    });

    it("should include metadata in result", async () => {
      const generator = new SiteGenerator(validConfig);
      const result = await generator.generate();

      expect(result.metadata).toBeDefined();
      expect(result.metadata.generatedAt).toBeDefined();
      expect(result.metadata.industry).toBe("restaurant");
      expect(result.metadata.pages).toBeDefined();
      expect(result.metadata.pages.length).toBeGreaterThan(0);
    });
  });

  describe("getPages", () => {
    it("should return restaurant pages for restaurant industry", () => {
      const generator = new SiteGenerator(validConfig);
      const pages = generator.getPages();

      expect(pages).toEqual(INDUSTRY_PRESETS.restaurant.pages);
      expect(pages).toContain("home");
      expect(pages).toContain("menu");
      expect(pages).toContain("about");
      expect(pages).toContain("contact");
    });

    it("should return healthcare pages for healthcare industry", () => {
      const healthcareConfig = {
        ...validConfig,
        industry: "healthcare",
      };
      const generator = new SiteGenerator(healthcareConfig);
      const pages = generator.getPages();

      expect(pages).toEqual(INDUSTRY_PRESETS.healthcare.pages);
      expect(pages).toContain("services");
      expect(pages).toContain("team");
    });

    it("should return default pages for unknown industry", () => {
      const unknownConfig = {
        ...validConfig,
        industry: "unknown-industry",
      };
      const generator = new SiteGenerator(unknownConfig);
      const pages = generator.getPages();

      expect(pages).toEqual(INDUSTRY_PRESETS.other.pages);
    });
  });

  describe("getFeatures", () => {
    it("should return restaurant features for restaurant industry", () => {
      const generator = new SiteGenerator(validConfig);
      const features = generator.getFeatures();

      expect(features).toEqual(INDUSTRY_PRESETS.restaurant.features);
      expect(features).toContain("online-menu");
      expect(features).toContain("reservations");
    });

    it("should return legal features for legal industry", () => {
      const legalConfig = {
        ...validConfig,
        industry: "legal",
      };
      const generator = new SiteGenerator(legalConfig);
      const features = generator.getFeatures();

      expect(features).toEqual(INDUSTRY_PRESETS.legal.features);
      expect(features).toContain("case-studies");
      expect(features).toContain("team-profiles");
    });
  });

  describe("generateSite function", () => {
    it("should generate site with valid config", async () => {
      const result = await generateSite(validConfig);

      expect(result.success).toBe(true);
      expect(result.files.length).toBeGreaterThan(0);
    });

    it("should throw error with invalid config", async () => {
      const invalidConfig = {
        name: "",
      } as ProjectConfig;

      await expect(generateSite(invalidConfig)).rejects.toThrow();
    });
  });

  describe("industry presets", () => {
    const industries = Object.keys(INDUSTRY_PRESETS);

    it.each(industries)("should generate valid site for %s industry", async (industry) => {
      const config: ProjectConfig = {
        ...validConfig,
        industry,
      };

      const generator = new SiteGenerator(config);
      const result = await generator.generate();

      expect(result.success).toBe(true);
      expect(result.files.length).toBeGreaterThan(0);
      expect(result.metadata.industry).toBe(industry);
    });
  });

  describe("file content validation", () => {
    it("should generate valid PHP files", async () => {
      const generator = new SiteGenerator(validConfig);
      const result = await generator.generate();

      const phpFiles = result.files.filter((f) => f.type === "php");
      phpFiles.forEach((file) => {
        expect(file.content).toContain("<?php");
        expect(file.content.length).toBeGreaterThan(0);
      });
    });

    it("should generate valid JSON files", async () => {
      const generator = new SiteGenerator(validConfig);
      const result = await generator.generate();

      const packageFile = result.files.find((f) => f.path === "package.json");
      expect(() => JSON.parse(packageFile!.content)).not.toThrow();
    });

    it("should include primary color in generated files", async () => {
      const generator = new SiteGenerator(validConfig);
      const result = await generator.generate();

      const tailwindFile = result.files.find((f) => f.path === "tailwind.config.js");
      expect(tailwindFile?.content).toContain(validConfig.primaryColor);
    });

    it("should include secondary color in generated files", async () => {
      const generator = new SiteGenerator(validConfig);
      const result = await generator.generate();

      const tailwindFile = result.files.find((f) => f.path === "tailwind.config.js");
      expect(tailwindFile?.content).toContain(validConfig.secondaryColor);
    });
  });

  describe("optional fields handling", () => {
    it("should handle config without optional fields", async () => {
      const minimalConfig: ProjectConfig = {
        name: "Minimal Site",
        slug: "minimal-site",
        companyName: "Minimal Company",
        industry: "other",
        primaryColor: "#000000",
        secondaryColor: "#ffffff",
      };

      const generator = new SiteGenerator(minimalConfig);
      const result = await generator.generate();

      expect(result.success).toBe(true);
      expect(result.files.length).toBeGreaterThan(0);
    });

    it("should include contact info when provided", async () => {
      const generator = new SiteGenerator(validConfig);
      const result = await generator.generate();

      const contactPage = result.files.find((f) => f.path === "page-contact.php");
      expect(contactPage?.content).toBeDefined();
      // Content includes phone and email if provided
      if (validConfig.phone) {
        expect(contactPage?.content).toContain(validConfig.phone);
      }
    });
  });
});
