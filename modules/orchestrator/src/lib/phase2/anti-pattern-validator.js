/**
 * Anti-Pattern Validator
 * Validates design choices against known anti-patterns to ensure distinctive, non-generic websites
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load anti-patterns from JSON
let antiPatterns = null;

async function loadAntiPatterns() {
  if (antiPatterns) return antiPatterns;

  const antiPatternsPath = path.resolve(__dirname, '../../../tokens/anti-patterns.json');
  try {
    const content = await fs.readFile(antiPatternsPath, 'utf-8');
    antiPatterns = JSON.parse(content);
    return antiPatterns;
  } catch (error) {
    console.warn('Could not load anti-patterns.json, using defaults');
    antiPatterns = getDefaultAntiPatterns();
    return antiPatterns;
  }
}

function getDefaultAntiPatterns() {
  return {
    fonts: {
      banned: ['Inter', 'Roboto', 'Arial', 'Helvetica', 'Open Sans', 'Montserrat'],
      alternatives: {
        default: { heading: 'Bricolage Grotesque', body: 'Instrument Sans' }
      }
    },
    content: {
      banned_phrases: [
        'Welcome to our website',
        'Lorem ipsum',
        'Click here',
        'Learn more',
        'We are a leading'
      ]
    }
  };
}

/**
 * Validation result type
 */
class ValidationResult {
  constructor() {
    this.valid = true;
    this.errors = [];
    this.warnings = [];
    this.suggestions = [];
  }

  addError(message, field, suggestion) {
    this.valid = false;
    this.errors.push({ message, field, suggestion });
  }

  addWarning(message, field, suggestion) {
    this.warnings.push({ message, field, suggestion });
  }

  addSuggestion(message) {
    this.suggestions.push(message);
  }

  toJSON() {
    return {
      valid: this.valid,
      errorCount: this.errors.length,
      warningCount: this.warnings.length,
      errors: this.errors,
      warnings: this.warnings,
      suggestions: this.suggestions,
    };
  }
}

/**
 * Validate font choices against banned fonts
 */
export async function validateFonts(typography, industry = 'default') {
  const patterns = await loadAntiPatterns();
  const result = new ValidationResult();

  const bannedFonts = patterns.fonts?.banned || [];
  const alternatives = patterns.fonts?.alternatives || {};

  // Check heading font
  if (typography?.headings && bannedFonts.includes(typography.headings)) {
    const alt = alternatives[industry]?.heading || alternatives.default?.heading;
    result.addError(
      `Font "${typography.headings}" is overused in AI designs`,
      'typography.headings',
      `Consider using "${alt}" instead for a more distinctive look`
    );
  }

  // Check body font
  if (typography?.body && bannedFonts.includes(typography.body)) {
    const alt = alternatives[industry]?.body || alternatives.default?.body;
    result.addError(
      `Font "${typography.body}" is overused in AI designs`,
      'typography.body',
      `Consider using "${alt}" instead`
    );
  }

  // Add font pairing suggestion if industry-specific exists
  if (alternatives[industry]) {
    result.addSuggestion(
      `For ${industry} industry, recommended fonts: ${alternatives[industry].heading} (headings) + ${alternatives[industry].body} (body)`
    );
  }

  return result;
}

/**
 * Validate content against banned phrases
 */
export async function validateContent(content) {
  const patterns = await loadAntiPatterns();
  const result = new ValidationResult();

  const bannedPhrases = patterns.content?.banned_phrases || [];
  const alternatives = patterns.content?.alternatives || {};

  // Flatten content to search through
  const contentStr = JSON.stringify(content).toLowerCase();

  for (const phrase of bannedPhrases) {
    if (contentStr.includes(phrase.toLowerCase())) {
      const alt = alternatives[phrase];
      result.addWarning(
        `Generic phrase "${phrase}" detected`,
        'content',
        alt ? `Consider: "${alt}"` : 'Use more specific, authentic language'
      );
    }
  }

  return result;
}

/**
 * Validate color choices
 */
export async function validateColors(colors) {
  const patterns = await loadAntiPatterns();
  const result = new ValidationResult();

  // Check for problematic color patterns
  const validationRules = patterns.colors?.validation_rules || [];

  for (const rule of validationRules) {
    if (rule.rule === 'no_purple_gradient') {
      // Check if primary/secondary creates purple gradient
      const primaryLower = colors.primary?.toLowerCase() || '';
      const secondaryLower = colors.secondary?.toLowerCase() || '';

      const purplePatterns = ['purple', 'violet', '#800080', '#8b00ff', '#9400d3'];
      const pinkPatterns = ['pink', 'magenta', '#ff00ff', '#ff1493', '#ff69b4'];

      const hasPurple = purplePatterns.some(p =>
        primaryLower.includes(p) || secondaryLower.includes(p)
      );
      const hasPink = pinkPatterns.some(p =>
        primaryLower.includes(p) || secondaryLower.includes(p)
      );

      if (hasPurple && hasPink) {
        result.addError(
          'Purple-pink gradient pattern detected',
          'colors',
          'This color combination is strongly associated with AI-generated designs. Consider using industry-appropriate colors.'
        );
      }
    }

    if (rule.rule === 'no_neon' && rule.colors) {
      for (const neonColor of rule.colors) {
        if (colors.primary?.toLowerCase() === neonColor.toLowerCase() ||
            colors.secondary?.toLowerCase() === neonColor.toLowerCase()) {
          result.addWarning(
            `Neon color ${neonColor} detected`,
            'colors',
            'Neon colors can appear unprofessional. Consider more muted alternatives.'
          );
        }
      }
    }
  }

  return result;
}

/**
 * Get recommended fonts for an industry
 */
export async function getRecommendedFonts(industry) {
  const patterns = await loadAntiPatterns();
  const alternatives = patterns.fonts?.alternatives || {};

  return alternatives[industry] || alternatives.default || {
    heading: 'Bricolage Grotesque',
    body: 'Instrument Sans'
  };
}

/**
 * Validate all design aspects
 */
export async function validateDesign(designInput) {
  const result = new ValidationResult();

  // Validate fonts
  const fontResult = await validateFonts(
    designInput.typography,
    designInput.industry
  );
  result.errors.push(...fontResult.errors);
  result.warnings.push(...fontResult.warnings);
  result.suggestions.push(...fontResult.suggestions);

  // Validate colors
  const colorResult = await validateColors(designInput.colors);
  result.errors.push(...colorResult.errors);
  result.warnings.push(...colorResult.warnings);

  // Update valid flag
  result.valid = result.errors.length === 0;

  return result;
}

/**
 * Auto-fix design issues by replacing banned elements with alternatives
 */
export async function autoFixDesign(designInput) {
  const patterns = await loadAntiPatterns();
  const fixed = { ...designInput };
  const changes = [];

  // Fix fonts
  const bannedFonts = patterns.fonts?.banned || [];
  const alternatives = patterns.fonts?.alternatives || {};
  const industry = designInput.industry || 'default';
  const fontAlts = alternatives[industry] || alternatives.default;

  if (fixed.typography?.headings && bannedFonts.includes(fixed.typography.headings)) {
    changes.push(`Changed heading font from "${fixed.typography.headings}" to "${fontAlts.heading}"`);
    fixed.typography = { ...fixed.typography, headings: fontAlts.heading };
  }

  if (fixed.typography?.body && bannedFonts.includes(fixed.typography.body)) {
    changes.push(`Changed body font from "${fixed.typography.body}" to "${fontAlts.body}"`);
    fixed.typography = { ...fixed.typography, body: fontAlts.body };
  }

  return { fixed, changes };
}

export default {
  validateFonts,
  validateContent,
  validateColors,
  validateDesign,
  autoFixDesign,
  getRecommendedFonts,
  ValidationResult,
};
