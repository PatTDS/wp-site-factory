/**
 * Pattern Loader
 * Loads and validates pattern manifests and templates
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { validatePatternManifest, validateTemplatePreset } from './pattern-schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Templates directory is relative to orchestrator module
const TEMPLATES_DIR = path.resolve(__dirname, '../../../templates');
// Shared patterns directory - cross-industry reusable components
const SHARED_DIR = path.resolve(__dirname, '../../../templates/shared/patterns');

/**
 * Load a single pattern manifest
 */
export async function loadPatternManifest(patternPath) {
  const manifestPath = path.join(patternPath, 'manifest.json');

  try {
    const content = await fs.readFile(manifestPath, 'utf-8');
    const manifest = JSON.parse(content);

    const validation = validatePatternManifest(manifest);
    if (!validation.success) {
      throw new Error(`Invalid pattern manifest: ${validation.error.message}`);
    }

    return {
      ...validation.data,
      _path: patternPath,
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Pattern manifest not found: ${manifestPath}`);
    }
    throw error;
  }
}

/**
 * Load pattern template PHP file
 */
export async function loadPatternTemplate(patternPath, templateFile = 'template.php') {
  const templatePath = path.join(patternPath, templateFile);

  try {
    return await fs.readFile(templatePath, 'utf-8');
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Pattern template not found: ${templatePath}`);
    }
    throw error;
  }
}

/**
 * Load a template preset
 */
export async function loadTemplatePreset(industry, presetName) {
  const presetPath = path.join(TEMPLATES_DIR, industry, presetName, 'preset.json');

  try {
    const content = await fs.readFile(presetPath, 'utf-8');
    const preset = JSON.parse(content);

    const validation = validateTemplatePreset(preset);
    if (!validation.success) {
      throw new Error(`Invalid template preset: ${validation.error.message}`);
    }

    return {
      ...validation.data,
      _path: path.dirname(presetPath),
    };
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Template preset not found: ${presetPath}`);
    }
    throw error;
  }
}

/**
 * List shared patterns for a category (cross-industry)
 */
export async function listSharedPatterns(category) {
  const sharedCategoryDir = path.join(SHARED_DIR, category);

  try {
    const entries = await fs.readdir(sharedCategoryDir, { withFileTypes: true });
    const patterns = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        try {
          const manifest = await loadPatternManifest(path.join(sharedCategoryDir, entry.name));
          patterns.push({
            ...manifest,
            _source: 'shared',
          });
        } catch (error) {
          console.warn(`Skipping invalid shared pattern ${entry.name}: ${error.message}`);
        }
      }
    }

    return patterns;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * List all patterns for a category in a template preset
 * Merges industry-specific patterns with shared patterns
 * Industry-specific patterns take priority over shared patterns with same ID
 */
export async function listPatterns(industry, presetName, category) {
  const patternsDir = path.join(TEMPLATES_DIR, industry, presetName, 'patterns', category);

  // Load industry-specific patterns
  const industryPatterns = [];
  try {
    const entries = await fs.readdir(patternsDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        try {
          const manifest = await loadPatternManifest(path.join(patternsDir, entry.name));
          industryPatterns.push({
            ...manifest,
            _source: 'industry',
          });
        } catch (error) {
          console.warn(`Skipping invalid pattern ${entry.name}: ${error.message}`);
        }
      }
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
  }

  // Load shared patterns
  const sharedPatterns = await listSharedPatterns(category);

  // Merge: industry patterns take priority
  const industryPatternIds = new Set(industryPatterns.map(p => p.id));
  const filteredShared = sharedPatterns.filter(p => !industryPatternIds.has(p.id));

  return [...industryPatterns, ...filteredShared];
}

/**
 * List all template presets for an industry
 */
export async function listTemplatePresets(industry) {
  const industryDir = path.join(TEMPLATES_DIR, industry);

  try {
    const entries = await fs.readdir(industryDir, { withFileTypes: true });
    const presets = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        try {
          const preset = await loadTemplatePreset(industry, entry.name);
          presets.push(preset);
        } catch (error) {
          // Skip directories without valid preset.json
        }
      }
    }

    return presets;
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * List all available industries
 */
export async function listIndustries() {
  try {
    const entries = await fs.readdir(TEMPLATES_DIR, { withFileTypes: true });
    return entries
      .filter(entry => entry.isDirectory() && entry.name !== 'base')
      .map(entry => entry.name);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * Load a pattern from a specific path, with fallback to shared patterns
 */
async function loadPatternWithFallback(industry, presetName, section, patternId) {
  // First try industry-specific pattern
  const industryPatternPath = path.join(
    TEMPLATES_DIR,
    industry,
    presetName,
    'patterns',
    section,
    patternId
  );

  try {
    return {
      manifest: await loadPatternManifest(industryPatternPath),
      template: await loadPatternTemplate(industryPatternPath),
      _source: 'industry',
    };
  } catch (industryError) {
    // If not found, try shared patterns
    const sharedPatternPath = path.join(SHARED_DIR, section, patternId);
    try {
      return {
        manifest: await loadPatternManifest(sharedPatternPath),
        template: await loadPatternTemplate(sharedPatternPath),
        _source: 'shared',
      };
    } catch (sharedError) {
      // Neither found
      throw new Error(
        `Pattern ${section}/${patternId} not found in industry or shared patterns`
      );
    }
  }
}

/**
 * Load all patterns for a template preset
 * Checks industry-specific patterns first, then falls back to shared patterns
 */
export async function loadPresetPatterns(industry, presetName) {
  const preset = await loadTemplatePreset(industry, presetName);
  const patterns = {};

  for (const [section, patternId] of Object.entries(preset.patterns)) {
    try {
      patterns[section] = await loadPatternWithFallback(
        industry,
        presetName,
        section,
        patternId
      );
    } catch (error) {
      console.warn(`Failed to load pattern ${section}/${patternId}: ${error.message}`);
    }
  }

  return { preset, patterns };
}

export default {
  loadPatternManifest,
  loadPatternTemplate,
  loadTemplatePreset,
  listPatterns,
  listSharedPatterns,
  listTemplatePresets,
  listIndustries,
  loadPresetPatterns,
};
