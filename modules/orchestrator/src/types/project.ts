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

// Industry presets
export const INDUSTRY_PRESETS: Record<
  string,
  {
    name: string;
    pages: string[];
    features: string[];
    tone: string;
  }
> = {
  restaurant: {
    name: "Restaurant",
    pages: ["home", "menu", "about", "contact", "reservations"],
    features: ["online-menu", "reservations", "gallery", "reviews"],
    tone: "warm and inviting",
  },
  healthcare: {
    name: "Healthcare",
    pages: ["home", "services", "about", "team", "contact"],
    features: ["appointment-booking", "team-profiles", "services-list"],
    tone: "professional and caring",
  },
  legal: {
    name: "Legal",
    pages: ["home", "practice-areas", "attorneys", "about", "contact"],
    features: ["case-studies", "team-profiles", "testimonials"],
    tone: "authoritative and trustworthy",
  },
  realestate: {
    name: "Real Estate",
    pages: ["home", "listings", "about", "agents", "contact"],
    features: ["property-listings", "search", "agent-profiles"],
    tone: "professional and aspirational",
  },
  fitness: {
    name: "Fitness",
    pages: ["home", "classes", "trainers", "pricing", "contact"],
    features: ["class-schedule", "trainer-profiles", "pricing-table"],
    tone: "energetic and motivational",
  },
  education: {
    name: "Education",
    pages: ["home", "programs", "faculty", "admissions", "contact"],
    features: ["course-catalog", "faculty-profiles", "enrollment"],
    tone: "informative and encouraging",
  },
  technology: {
    name: "Technology",
    pages: ["home", "products", "solutions", "about", "contact"],
    features: ["product-showcase", "case-studies", "pricing"],
    tone: "innovative and clear",
  },
  retail: {
    name: "Retail",
    pages: ["home", "products", "about", "locations", "contact"],
    features: ["product-gallery", "store-locator", "promotions"],
    tone: "friendly and engaging",
  },
  construction: {
    name: "Construction",
    pages: ["home", "services", "projects", "about", "contact"],
    features: ["project-gallery", "services-list", "testimonials"],
    tone: "solid and reliable",
  },
  automotive: {
    name: "Automotive",
    pages: ["home", "inventory", "services", "about", "contact"],
    features: ["vehicle-inventory", "service-booking", "financing"],
    tone: "professional and dynamic",
  },
  beauty: {
    name: "Beauty & Spa",
    pages: ["home", "services", "team", "gallery", "contact"],
    features: ["service-menu", "online-booking", "gallery"],
    tone: "elegant and relaxing",
  },
  other: {
    name: "General Business",
    pages: ["home", "services", "about", "contact"],
    features: ["services-list", "testimonials", "contact-form"],
    tone: "professional and approachable",
  },
};

// Generated file structure
export interface GeneratedFile {
  path: string;
  content: string;
  type: "php" | "css" | "js" | "json" | "html";
}

export interface GenerationResult {
  success: boolean;
  files: GeneratedFile[];
  errors?: string[];
  metadata: {
    generatedAt: string;
    industry: string;
    pages: string[];
    aiContentGenerated?: boolean;
  };
}
