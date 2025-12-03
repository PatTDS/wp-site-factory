import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock Clerk auth
vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}));

import { POST } from "../../src/app/api/projects/generate/route";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

describe("POST /api/projects/generate", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validRequestBody = {
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

  const createMockRequest = (body: any): NextRequest => {
    return {
      json: async () => body,
    } as NextRequest;
  };

  describe("authentication", () => {
    it("should return 401 when user is not authenticated", async () => {
      vi.mocked(auth).mockResolvedValue({ userId: null } as any);

      const request = createMockRequest(validRequestBody);
      const response = await POST(request);

      expect(response.status).toBe(401);
      const data = await response.json();
      expect(data.error).toBe("Unauthorized");
    });

    it("should process request when user is authenticated", async () => {
      vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as any);

      const request = createMockRequest(validRequestBody);
      const response = await POST(request);

      expect(response.status).not.toBe(401);
    });
  });

  describe("request validation", () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as any);
    });

    it("should accept valid request body", async () => {
      const request = createMockRequest(validRequestBody);
      const response = await POST(request);

      expect(response.status).toBe(201);
    });

    it("should reject empty name", async () => {
      const invalidBody = { ...validRequestBody, name: "" };
      const request = createMockRequest(invalidBody);
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("Invalid request");
    });

    it("should reject missing companyName", async () => {
      const invalidBody = { ...validRequestBody };
      delete (invalidBody as any).companyName;

      const request = createMockRequest(invalidBody);
      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("should reject invalid primary color format", async () => {
      const invalidBody = { ...validRequestBody, primaryColor: "red" };
      const request = createMockRequest(invalidBody);
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("Invalid request");
    });

    it("should reject invalid secondary color format", async () => {
      const invalidBody = { ...validRequestBody, secondaryColor: "#gg0000" };
      const request = createMockRequest(invalidBody);
      const response = await POST(request);

      expect(response.status).toBe(400);
    });

    it("should reject invalid email format", async () => {
      const invalidBody = { ...validRequestBody, email: "not-an-email" };
      const request = createMockRequest(invalidBody);
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("Invalid request");
    });

    it("should accept valid hex colors with lowercase letters", async () => {
      const validBody = {
        ...validRequestBody,
        primaryColor: "#abc123",
        secondaryColor: "#def456",
      };
      const request = createMockRequest(validBody);
      const response = await POST(request);

      expect(response.status).toBe(201);
    });

    it("should accept valid hex colors with uppercase letters", async () => {
      const validBody = {
        ...validRequestBody,
        primaryColor: "#ABC123",
        secondaryColor: "#DEF456",
      };
      const request = createMockRequest(validBody);
      const response = await POST(request);

      expect(response.status).toBe(201);
    });
  });

  describe("optional fields", () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as any);
    });

    it("should accept request without email", async () => {
      const bodyWithoutEmail = { ...validRequestBody };
      delete bodyWithoutEmail.email;

      const request = createMockRequest(bodyWithoutEmail);
      const response = await POST(request);

      expect(response.status).toBe(201);
    });

    it("should accept request without phone", async () => {
      const bodyWithoutPhone = { ...validRequestBody };
      delete bodyWithoutPhone.phone;

      const request = createMockRequest(bodyWithoutPhone);
      const response = await POST(request);

      expect(response.status).toBe(201);
    });

    it("should accept request without address, city, state", async () => {
      const minimalBody = {
        name: "Test",
        companyName: "Test Company",
        industry: "other",
        primaryColor: "#000000",
        secondaryColor: "#ffffff",
      };

      const request = createMockRequest(minimalBody);
      const response = await POST(request);

      expect(response.status).toBe(201);
    });

    it("should default useAI to true when not provided", async () => {
      const bodyWithoutUseAI = { ...validRequestBody };
      delete bodyWithoutUseAI.useAI;

      const request = createMockRequest(bodyWithoutUseAI);
      const response = await POST(request);

      expect(response.status).toBe(201);
    });
  });

  describe("response structure", () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as any);
    });

    it("should return 201 Created status", async () => {
      const request = createMockRequest(validRequestBody);
      const response = await POST(request);

      expect(response.status).toBe(201);
    });

    it("should return generation result with required fields", async () => {
      const request = createMockRequest(validRequestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(data.success).toBe(true);
      expect(data.projectId).toBeDefined();
      expect(data.slug).toBeDefined();
      expect(data.status).toBe("ready");
      expect(data.message).toBeDefined();
      expect(data.filesGenerated).toBeGreaterThan(0);
    });

    it("should generate slug from name", async () => {
      const request = createMockRequest(validRequestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(data.slug).toBe("test-restaurant");
    });

    it("should handle special characters in name when generating slug", async () => {
      const bodyWithSpecialChars = {
        ...validRequestBody,
        name: "Test & Restaurant's Café!!!",
      };
      const request = createMockRequest(bodyWithSpecialChars);
      const response = await POST(request);
      const data = await response.json();

      expect(data.slug).toBe("test-restaurant-s-caf");
      expect(data.slug).not.toContain("&");
      expect(data.slug).not.toContain("!");
      expect(data.slug).not.toContain("'");
    });

    it("should include metadata in response", async () => {
      const request = createMockRequest(validRequestBody);
      const response = await POST(request);
      const data = await response.json();

      expect(data.metadata).toBeDefined();
      expect(data.metadata.industry).toBe(validRequestBody.industry);
    });
  });

  describe("industry validation", () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as any);
    });

    it("should accept known industries", async () => {
      const industries = [
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
      ];

      for (const industry of industries) {
        const body = { ...validRequestBody, industry };
        const request = createMockRequest(body);
        const response = await POST(request);

        expect(response.status).toBe(201);
      }
    });

    it("should accept custom industry", async () => {
      const body = { ...validRequestBody, industry: "custom-industry" };
      const request = createMockRequest(body);
      const response = await POST(request);

      expect(response.status).toBe(201);
    });

    it("should reject empty industry", async () => {
      const body = { ...validRequestBody, industry: "" };
      const request = createMockRequest(body);
      const response = await POST(request);

      expect(response.status).toBe(400);
    });
  });

  describe("error handling", () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as any);
    });

    it("should handle malformed JSON", async () => {
      const request = {
        json: async () => {
          throw new Error("Invalid JSON");
        },
      } as NextRequest;

      const response = await POST(request);

      expect(response.status).toBe(500);
      const data = await response.json();
      expect(data.error).toBe("Internal server error");
    });

    it("should return validation details for invalid requests", async () => {
      const invalidBody = {
        name: "",
        companyName: "",
        industry: "",
        primaryColor: "invalid",
        secondaryColor: "invalid",
      };

      const request = createMockRequest(invalidBody);
      const response = await POST(request);

      expect(response.status).toBe(400);
      const data = await response.json();
      expect(data.error).toBe("Invalid request");
      expect(data.details).toBeDefined();
    });
  });

  describe("edge cases", () => {
    beforeEach(() => {
      vi.mocked(auth).mockResolvedValue({ userId: "user_123" } as any);
    });

    it("should handle very long company name", async () => {
      const longName = "A".repeat(200);
      const body = { ...validRequestBody, companyName: longName };
      const request = createMockRequest(body);
      const response = await POST(request);

      expect(response.status).toBe(201);
    });

    it("should handle Unicode characters in name", async () => {
      const body = {
        ...validRequestBody,
        name: "Café São Paulo",
        companyName: "Restaurante Açaí",
      };
      const request = createMockRequest(body);
      const response = await POST(request);

      expect(response.status).toBe(201);
      const data = await response.json();
      expect(data.slug).toBeDefined();
    });

    it("should handle name with only special characters", async () => {
      const body = { ...validRequestBody, name: "!@#$%^&*()" };
      const request = createMockRequest(body);
      const response = await POST(request);

      // This case will fail validation (empty slug) - should return 500
      // since slug becomes empty after stripping special characters
      expect(response.status).toBe(500);
    });
  });
});
