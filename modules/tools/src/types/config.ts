/**
 * WPF v2.0 Configuration Schema
 *
 * Zod schema for wpf-config.yaml validation
 * All site configuration is defined here - no LLM decisions needed.
 */
import { z } from 'zod';

// Industry types for branding suggestions
export const IndustrySchema = z.enum([
  'technology',
  'healthcare',
  'legal',
  'restaurant',
  'retail',
  'education',
  'finance',
  'construction',
  'beauty',
  'automotive',
  'real-estate',
  'consulting',
  'manufacturing',
  'nonprofit',
  'other'
]);

// Section types available for pages (includes design-system variants)
export const SectionTypeSchema = z.enum([
  // Hero variants
  'hero-centered',
  'hero-split',
  'hero-split-cards',
  'hero-image-bg',
  // Features variants
  'features-grid',
  'features-alternating',
  // CTA variants
  'cta-banner',
  'cta-split',
  'cta-gradient',
  // Stats variants
  'stats-cards',
  'stats-inline',
  // Testimonials variants
  'testimonials-carousel',
  'testimonials-grid',
  'testimonials-cards',
  // Contact variants
  'contact-form',
  'contact-info',
  'contact-split',
  'contact-centered',
  // Services variants
  'services-cards',
  // Other
  'team-grid',
  'pricing-table',
  'faq-accordion',
  'gallery-grid'
]);

// Page template types
export const PageTemplateSchema = z.enum([
  'front-page',
  'about',
  'contact',
  'services',
  'products',
  'solutions',
  'blog',
  'portfolio',
  'custom'
]);

// Plugin presets
export const PluginPresetSchema = z.object({
  preset: z.enum(['minimal', 'standard', 'professional']).optional(),
  seo: z.string().default('wordpress-seo'),
  optimization: z.string().default('autoptimize'),
  images: z.string().default('shortpixel-image-optimiser'),
  forms: z.string().default('contact-form-7'),
  cache: z.string().optional(),
  additional: z.array(z.string()).optional(),
  remove: z.array(z.string()).optional()
});

// Compliance levels
export const ComplianceLevelSchema = z.enum(['minimal', 'standard', 'strict']);

// Hosting types
export const HostingTypeSchema = z.enum(['docker', 'sftp', 'rsync', 'cpanel']);

// Address schema
export const AddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  postal_code: z.string(),
  country: z.string().default('BR')
});

// Contact schema
export const ContactSchema = z.object({
  email: z.string().email(),
  phone: z.string(),
  whatsapp: z.string().optional(),
  address: AddressSchema
});

// Branding schema
export const BrandingSchema = z.object({
  primary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be hex color'),
  secondary_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be hex color'),
  accent_color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  font_family: z.string().default('Inter'),
  font_heading: z.string().optional(),
  logo_url: z.string().url().optional(),
  favicon_url: z.string().url().optional()
});

// Social media schema
export const SocialMediaSchema = z.object({
  facebook: z.string().url().optional(),
  instagram: z.string().url().optional(),
  linkedin: z.string().url().optional(),
  twitter: z.string().url().optional(),
  youtube: z.string().url().optional(),
  whatsapp: z.string().optional()
});

// Section configuration (varies by section type)
// Supports all design-system component variables
export const SectionConfigSchema = z.object({
  type: SectionTypeSchema,
  variant: z.string().optional(), // For explicit variant selection

  // Text content
  title: z.string().optional(),
  title_highlight: z.string().optional(), // Gradient-highlighted portion
  subtitle: z.string().optional(),
  content: z.string().optional(),
  badge_text: z.string().optional(),

  // CTAs
  cta_text: z.string().optional(),
  cta_url: z.string().optional(),
  cta_secondary_text: z.string().optional(),
  cta_secondary_url: z.string().optional(),

  // Visual options
  background: z.enum(['white', 'gray', 'primary', 'dark']).optional(),
  image_url: z.string().optional(),
  image_alt: z.string().optional(),

  // Layout options
  columns: z.number().min(2).max(4).optional(),

  // Array data for various components
  items: z.array(z.record(z.unknown())).optional(),
  stats: z.array(z.object({
    value: z.string(),
    label: z.string()
  })).optional(),
  service_cards: z.array(z.object({
    label: z.string(),
    color: z.string().optional(),
    icon: z.string().optional()
  })).optional(),
  trust_badges: z.array(z.object({
    label: z.string(),
    icon: z.string().optional()
  })).optional(),
  trusted_logos: z.array(z.object({
    url: z.string(),
    alt: z.string().optional()
  })).optional(),
  features: z.array(z.record(z.unknown())).optional()
});

// Page schema
export const PageSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/, 'Must be kebab-case'),
  title: z.string(),
  template: PageTemplateSchema,
  meta_title: z.string().optional(),
  meta_description: z.string().max(160).optional(),
  sections: z.array(SectionConfigSchema).optional()
});

// Menu item schema
export const MenuItemSchema = z.object({
  title: z.string(),
  url: z.string(),
  children: z.array(z.lazy(() => MenuItemSchema)).optional()
});

// Company schema
export const CompanySchema = z.object({
  name: z.string(),
  tagline: z.string(),
  description: z.string().optional(),
  industry: IndustrySchema,
  founded: z.string().optional(),
  employees: z.string().optional()
});

// Hosting configuration
export const HostingConfigSchema = z.object({
  type: HostingTypeSchema,
  host: z.string().optional(),
  user: z.string().optional(),
  path: z.string().optional(),
  port: z.number().optional()
});

// Project schema
export const ProjectSchema = z.object({
  name: z.string().regex(/^[a-z0-9-]+$/, 'Must be kebab-case'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Must be semver'),
  domain: z.string().optional()
});

// Main WPF Configuration Schema
export const WPFConfigSchema = z.object({
  project: ProjectSchema,
  company: CompanySchema,
  contact: ContactSchema,
  branding: BrandingSchema,
  social: SocialMediaSchema.optional(),
  pages: z.array(PageSchema).min(1),
  menu: z.object({
    primary: z.array(MenuItemSchema),
    footer: z.array(MenuItemSchema).optional()
  }),
  plugins: PluginPresetSchema.optional(),
  compliance: z.object({
    level: ComplianceLevelSchema.default('strict')
  }).optional(),
  hosting: HostingConfigSchema.optional()
});

// Type exports
export type Industry = z.infer<typeof IndustrySchema>;
export type SectionType = z.infer<typeof SectionTypeSchema>;
export type PageTemplate = z.infer<typeof PageTemplateSchema>;
export type ComplianceLevel = z.infer<typeof ComplianceLevelSchema>;
export type HostingType = z.infer<typeof HostingTypeSchema>;

export type Address = z.infer<typeof AddressSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type Branding = z.infer<typeof BrandingSchema>;
export type SocialMedia = z.infer<typeof SocialMediaSchema>;
export type SectionConfig = z.infer<typeof SectionConfigSchema>;
export type Page = z.infer<typeof PageSchema>;
export type MenuItem = z.infer<typeof MenuItemSchema>;
export type Company = z.infer<typeof CompanySchema>;
export type HostingConfig = z.infer<typeof HostingConfigSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type PluginPreset = z.infer<typeof PluginPresetSchema>;
export type WPFConfig = z.infer<typeof WPFConfigSchema>;
