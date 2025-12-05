/**
 * Pattern Schema Definitions
 * Zod schemas for pattern manifests and configurations
 */

import { z } from 'zod';

// Content slot schema - maps blueprint data to pattern placeholders
export const ContentSlotSchema = z.object({
  required: z.boolean().default(false),
  source: z.string(), // JSONPath-like: "content_drafts.hero.headline"
  fallback: z.union([z.string(), z.array(z.any())]).optional(), // Can be string or array
  transform: z.enum(['uppercase', 'lowercase', 'capitalize', 'truncate']).optional(),
});

// Configuration option schema
export const ConfigOptionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('boolean'),
    default: z.boolean(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('number'),
    min: z.number().optional(),
    max: z.number().optional(),
    default: z.number(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('enum'),
    options: z.array(z.string()),
    default: z.string(),
    description: z.string().optional(),
  }),
  z.object({
    type: z.literal('string'),
    default: z.string(),
    description: z.string().optional(),
  }),
]);

// Suitability scoring for AI template selection
export const SuitabilitySchema = z.object({
  industries: z.array(z.string()), // Which industries this pattern fits
  styles: z.array(z.string()), // modern, classic, bold, minimal, etc.
  score_factors: z.record(z.string(), z.number()), // Conditional scoring
});

// Tailwind class configuration
export const TailwindClassesSchema = z.record(z.string(), z.string());

// Main pattern manifest schema
export const PatternManifestSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  category: z.enum(['hero', 'services', 'about', 'testimonials', 'contact', 'cta', 'features', 'team', 'portfolio', 'faq']),
  variants: z.array(z.string()).default(['default']),

  // Configuration options that AI/user can set
  configuration: z.record(z.string(), ConfigOptionSchema).default({}),

  // Content slots that map to blueprint data
  content_slots: z.record(z.string(), ContentSlotSchema),

  // Base Tailwind classes (can be overridden by theme)
  tailwind_classes: TailwindClassesSchema.optional(),

  // Suitability for AI selection
  suitability: SuitabilitySchema,

  // Template file reference
  template_file: z.string().default('template.php'),

  // Preview image
  preview: z.string().optional(),
});

// Template preset schema (e.g., "industrial-modern")
export const TemplatePresetSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  industry: z.string(),
  style: z.string(),

  // Default pattern selections for each section
  patterns: z.object({
    hero: z.string(),
    services: z.string(),
    about: z.string(),
    testimonials: z.string(),
    contact: z.string(),
  }),

  // Default configuration overrides
  configuration_overrides: z.record(z.string(), z.record(z.string(), z.any())).default({}),

  // Color scheme suggestion
  colors: z.object({
    primary: z.string(),
    secondary: z.string(),
    accent: z.string().optional(),
    background: z.string().optional(),
    text: z.string().optional(),
  }),

  // Typography suggestion
  typography: z.object({
    headings: z.string(),
    body: z.string(),
  }),

  // Suitability scores
  suitability: z.object({
    b2b: z.number().min(0).max(1),
    b2c: z.number().min(0).max(1),
    premium: z.number().min(0).max(1),
    budget: z.number().min(0).max(1),
  }),

  preview: z.string().optional(),
});

// Validate a pattern manifest
export function validatePatternManifest(manifest) {
  return PatternManifestSchema.safeParse(manifest);
}

// Validate a template preset
export function validateTemplatePreset(preset) {
  return TemplatePresetSchema.safeParse(preset);
}

export default {
  PatternManifestSchema,
  TemplatePresetSchema,
  ContentSlotSchema,
  ConfigOptionSchema,
  SuitabilitySchema,
  validatePatternManifest,
  validateTemplatePreset,
};
