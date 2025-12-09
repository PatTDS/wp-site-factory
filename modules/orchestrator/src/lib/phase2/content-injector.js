/**
 * Content Injector
 * Maps blueprint data to pattern content slots using JSONPath-like sources
 */

import { z } from 'zod';

/**
 * Parse a JSONPath-like source string and extract value from object
 * Source format: "blueprint.content_drafts.hero.headline"
 */
export function getValueFromPath(obj, path) {
  if (!path || !obj) return undefined;

  // Remove 'blueprint.' prefix if present (since we're already working with blueprint)
  const cleanPath = path.startsWith('blueprint.') ? path.slice(10) : path;

  const parts = cleanPath.split('.');
  let current = obj;

  for (const part of parts) {
    if (current === undefined || current === null) {
      return undefined;
    }

    // Handle array access like items[0]
    const arrayMatch = part.match(/^(\w+)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, key, index] = arrayMatch;
      current = current[key]?.[parseInt(index, 10)];
    } else {
      current = current[part];
    }
  }

  return current;
}

/**
 * Apply transform to a value
 */
export function applyTransform(value, transform) {
  if (value === undefined || value === null) return value;

  const strValue = String(value);

  switch (transform) {
    case 'uppercase':
      return strValue.toUpperCase();
    case 'lowercase':
      return strValue.toLowerCase();
    case 'capitalize':
      return strValue.charAt(0).toUpperCase() + strValue.slice(1).toLowerCase();
    case 'truncate':
      return strValue.length > 100 ? strValue.slice(0, 100) + '...' : strValue;
    default:
      return value;
  }
}

/**
 * Resolve a single content slot
 */
export function resolveContentSlot(slotDef, blueprint) {
  // Get value from source path
  let value = getValueFromPath(blueprint, slotDef.source);

  // Use fallback if value is undefined/null/empty
  if (value === undefined || value === null || value === '') {
    if (slotDef.fallback !== undefined) {
      value = slotDef.fallback;
    } else if (slotDef.required) {
      throw new Error(`Required content slot missing: ${slotDef.source}`);
    }
  }

  // Apply transform if specified
  if (slotDef.transform && value !== undefined) {
    value = applyTransform(value, slotDef.transform);
  }

  return value;
}

/**
 * Inject content into a pattern from blueprint data
 */
export function injectContent(patternManifest, blueprint) {
  const contentSlots = patternManifest.content_slots || {};
  const content = {};

  for (const [slotName, slotDef] of Object.entries(contentSlots)) {
    try {
      content[slotName] = resolveContentSlot(slotDef, blueprint);
    } catch (error) {
      console.warn(`Failed to resolve content slot ${slotName}: ${error.message}`);
      content[slotName] = slotDef.fallback;
    }
  }

  return content;
}

/**
 * Validate content completeness
 */
export function validateContent(patternManifest, content) {
  const contentSlots = patternManifest.content_slots || {};
  const missing = [];
  const warnings = [];

  for (const [slotName, slotDef] of Object.entries(contentSlots)) {
    const value = content[slotName];

    if (slotDef.required && (value === undefined || value === null || value === '')) {
      missing.push(slotName);
    } else if (value === undefined || value === null) {
      warnings.push(slotName);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
    warnings,
  };
}

/**
 * Generate content summary for preview
 */
export function generateContentSummary(patternManifest, content) {
  const summary = {
    pattern: patternManifest.id,
    name: patternManifest.name,
    slots: {},
    completeness: 0,
  };

  const contentSlots = patternManifest.content_slots || {};
  let filled = 0;
  let total = 0;

  for (const [slotName, slotDef] of Object.entries(contentSlots)) {
    total++;
    const value = content[slotName];
    const hasValue = value !== undefined && value !== null && value !== '';

    summary.slots[slotName] = {
      required: slotDef.required,
      filled: hasValue,
      preview: hasValue
        ? (typeof value === 'string' ? value.slice(0, 50) : JSON.stringify(value).slice(0, 50))
        : (slotDef.fallback ? `[fallback: ${String(slotDef.fallback).slice(0, 30)}]` : '[empty]'),
    };

    if (hasValue) filled++;
  }

  summary.completeness = total > 0 ? Math.round((filled / total) * 100) : 100;

  return summary;
}

/**
 * Map services from blueprint to pattern format
 */
export function mapServices(services, options = {}) {
  const {
    maxItems = 12,  // Increased to support larger service lists (e.g., 9 services)
    includeDescription = true,
    includeUrl = true,
  } = options;

  if (!Array.isArray(services)) return [];

  return services.slice(0, maxItems).map(service => ({
    name: service.name || service.title || 'Service',
    title: service.name || service.title || 'Service',
    description: includeDescription ? (service.description || '') : undefined,
    icon: service.icon || null,
    url: includeUrl ? (service.url || service.slug ? `#${service.slug || service.name?.toLowerCase().replace(/\s+/g, '-')}` : '#') : undefined,
  }));
}

/**
 * Map testimonials from blueprint to pattern format
 */
export function mapTestimonials(testimonials, options = {}) {
  const {
    maxItems = 6,
  } = options;

  if (!Array.isArray(testimonials)) return [];

  return testimonials.slice(0, maxItems).map(testimonial => ({
    quote: testimonial.quote || testimonial.text || testimonial.content || '',
    text: testimonial.quote || testimonial.text || testimonial.content || '',
    name: testimonial.name || testimonial.author_name || testimonial.author || 'Client',
    company: testimonial.company || testimonial.business || '',
    position: testimonial.position || testimonial.author_role || testimonial.title || '',
    avatar: testimonial.avatar || testimonial.image || testimonial.photo || null,
    rating: testimonial.rating || 5,
    project_type: testimonial.project_type || '',
    is_generated: testimonial.is_generated || false,
  }));
}

/**
 * Map stats/features from blueprint to pattern format
 */
export function mapStats(stats, options = {}) {
  if (!Array.isArray(stats)) return [];

  return stats.map(stat => ({
    value: stat.value || stat.number || stat.stat || '0',
    number: stat.value || stat.number || stat.stat || '0',
    label: stat.label || stat.text || stat.description || '',
    text: stat.label || stat.text || stat.description || '',
  }));
}

/**
 * Map features/values from blueprint to pattern format
 */
export function mapFeatures(features, options = {}) {
  if (!Array.isArray(features)) return [];

  return features.map(feature => {
    if (typeof feature === 'string') {
      return { text: feature, name: feature };
    }
    return {
      text: feature.text || feature.name || feature.title || '',
      name: feature.name || feature.text || feature.title || '',
      description: feature.description || '',
      icon: feature.icon || null,
    };
  });
}

/**
 * Full content injection with data mapping
 */
export function injectContentWithMapping(patternManifest, blueprint) {
  // First, inject raw content
  const content = injectContent(patternManifest, blueprint);

  // Apply specialized mapping for complex data types
  if (content.services && Array.isArray(content.services)) {
    content.services = mapServices(content.services);
  }

  if (content.testimonials && Array.isArray(content.testimonials)) {
    content.testimonials = mapTestimonials(content.testimonials);
  }

  if (content.stats && Array.isArray(content.stats)) {
    content.stats = mapStats(content.stats);
  }

  if (content.features && Array.isArray(content.features)) {
    content.features = mapFeatures(content.features);
  }

  return content;
}

/**
 * Generate placeholder content for preview
 */
export function generatePlaceholderContent(patternManifest) {
  const contentSlots = patternManifest.content_slots || {};
  const content = {};

  for (const [slotName, slotDef] of Object.entries(contentSlots)) {
    if (slotDef.fallback !== undefined) {
      content[slotName] = slotDef.fallback;
    } else if (slotName.includes('headline') || slotName.includes('title')) {
      content[slotName] = 'Your Headline Here';
    } else if (slotName.includes('description') || slotName.includes('subheadline')) {
      content[slotName] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
    } else if (slotName.includes('services')) {
      content[slotName] = [
        { name: 'Service One', description: 'Description of service one.' },
        { name: 'Service Two', description: 'Description of service two.' },
        { name: 'Service Three', description: 'Description of service three.' },
      ];
    } else if (slotName.includes('testimonials')) {
      content[slotName] = [
        { quote: 'Great service!', name: 'John Doe', company: 'Acme Corp', rating: 5 },
        { quote: 'Highly recommended.', name: 'Jane Smith', company: 'Tech Inc', rating: 5 },
      ];
    } else if (slotName.includes('stats')) {
      content[slotName] = [
        { value: '100+', label: 'Projects' },
        { value: '50+', label: 'Clients' },
        { value: '10+', label: 'Years' },
      ];
    } else {
      content[slotName] = `[${slotName}]`;
    }
  }

  return content;
}

export default {
  getValueFromPath,
  applyTransform,
  resolveContentSlot,
  injectContent,
  injectContentWithMapping,
  validateContent,
  generateContentSummary,
  generatePlaceholderContent,
  mapServices,
  mapTestimonials,
  mapStats,
  mapFeatures,
};
