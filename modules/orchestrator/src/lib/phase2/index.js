/**
 * Phase 2: Design Draft
 * Main entry point for all Phase 2 modules
 */

export * from './pattern-schema.js';
export * from './pattern-loader.js';
export * from './design-tokens.js';
export * from './template-selector.js';
export * from './content-injector.js';
export * from './theme-assembler.js';
export * from './html-preview-generator.js';
export * from './stock-photos.js';

// Convenience re-exports
import { assembleTheme, previewThemeAssembly, generateComparisonAssembly } from './theme-assembler.js';
import { selectBestPreset, generateTemplateComparison } from './template-selector.js';
import { extractTokensFromBlueprint, generateAllTokens } from './design-tokens.js';
import { generateHtmlPreview } from './html-preview-generator.js';
import stockPhotos from './stock-photos.js';

export default {
  // Main workflow functions
  assembleTheme,
  previewThemeAssembly,
  generateComparisonAssembly,

  // Template selection
  selectBestPreset,
  generateTemplateComparison,

  // Design tokens
  extractTokensFromBlueprint,
  generateAllTokens,

  // HTML Preview
  generateHtmlPreview,

  // Stock Photos
  stockPhotos,
};
