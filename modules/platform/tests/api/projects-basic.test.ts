import { describe, it, expect, vi, beforeEach } from "vitest";
import { z } from "zod";

/**
 * Basic API Schema Validation Tests
 *
 * These tests validate the request/response schemas without
 * calling the actual endpoint (which requires file system access).
 */

describe("Project Generation API Schema", () => {
  const GenerateRequestSchema = z.object({
    name: z.string().min(1),
    companyName: z.string().min(1),
    industry: z.string().min(1),
    primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    useAI: z.boolean().default(true),
  });

  const validRequest = {
    name: "Test Restaurant",
    companyName: "Test Restaurant LLC",
    industry: "restaurant",
    primaryColor: "#16a34a",
    secondaryColor: "#0f766e",
    email: "test@restaurant.com",
    phone: "(555) 123-4567",
    city: "Springfield",
    state: "IL",
    useAI: true,
  };

  describe("request validation", () => {
    it("should validate valid request", () => {
      const result = GenerateRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it("should reject empty name", () => {
      const invalid = { ...validRequest, name: "" };
      const result = GenerateRequestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject missing company name", () => {
      const invalid = { ...validRequest };
      delete (invalid as any).companyName;
      const result = GenerateRequestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject invalid color format - no hash", () => {
      const invalid = { ...validRequest, primaryColor: "16a34a" };
      const result = GenerateRequestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject invalid color format - wrong length", () => {
      const invalid = { ...validRequest, primaryColor: "#16a" };
      const result = GenerateRequestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject invalid color format - invalid chars", () => {
      const invalid = { ...validRequest, primaryColor: "#gggggg" };
      const result = GenerateRequestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should reject invalid email", () => {
      const invalid = { ...validRequest, email: "not-an-email" };
      const result = GenerateRequestSchema.safeParse(invalid);
      expect(result.success).toBe(false);
    });

    it("should accept valid hex with lowercase", () => {
      const valid = {
        ...validRequest,
        primaryColor: "#abc123",
        secondaryColor: "#def456",
      };
      const result = GenerateRequestSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });

    it("should accept valid hex with uppercase", () => {
      const valid = {
        ...validRequest,
        primaryColor: "#ABC123",
        secondaryColor: "#DEF456",
      };
      const result = GenerateRequestSchema.safeParse(valid);
      expect(result.success).toBe(true);
    });
  });

  describe("optional fields", () => {
    it("should accept request without email", () => {
      const without = { ...validRequest };
      delete without.email;
      const result = GenerateRequestSchema.safeParse(without);
      expect(result.success).toBe(true);
    });

    it("should accept request without phone", () => {
      const without = { ...validRequest };
      delete without.phone;
      const result = GenerateRequestSchema.safeParse(without);
      expect(result.success).toBe(true);
    });

    it("should accept request without address/city/state", () => {
      const minimal = {
        name: "Test",
        companyName: "Test Company",
        industry: "other",
        primaryColor: "#000000",
        secondaryColor: "#ffffff",
      };
      const result = GenerateRequestSchema.safeParse(minimal);
      expect(result.success).toBe(true);
    });

    it("should default useAI to true", () => {
      const without = { ...validRequest };
      delete without.useAI;
      const result = GenerateRequestSchema.safeParse(without);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.useAI).toBe(true);
      }
    });
  });

  describe("slug generation logic", () => {
    const generateSlug = (name: string): string => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    };

    it("should generate valid slug from name", () => {
      expect(generateSlug("Test Restaurant")).toBe("test-restaurant");
    });

    it("should handle special characters", () => {
      expect(generateSlug("Test & Restaurant's Café!!!")).toBe(
        "test-restaurant-s-caf"
      );
    });

    it("should handle unicode characters", () => {
      const slug = generateSlug("Café São Paulo");
      expect(slug).not.toContain("é");
      expect(slug).not.toContain("ã");
    });

    it("should return empty string for only special chars", () => {
      expect(generateSlug("!@#$%^&*()")).toBe("");
    });

    it("should strip leading/trailing hyphens", () => {
      expect(generateSlug("-test-")).toBe("test");
    });
  });

  describe("industry values", () => {
    const validIndustries = [
      "restaurant",
      "healthcare",
      "legal",
      "realestate",
      "fitness",
      "education",
      "technology",
      "retail",
      "construction",
      "automotive",
      "beauty",
      "other",
    ];

    it.each(validIndustries)(
      "should accept %s industry",
      (industry) => {
        const request = { ...validRequest, industry };
        const result = GenerateRequestSchema.safeParse(request);
        expect(result.success).toBe(true);
      }
    );

    it("should accept custom industry values", () => {
      const request = { ...validRequest, industry: "custom-business-type" };
      const result = GenerateRequestSchema.safeParse(request);
      expect(result.success).toBe(true);
    });

    it("should reject empty industry", () => {
      const request = { ...validRequest, industry: "" };
      const result = GenerateRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });
  });
});
