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
 * List all patterns for a category in a template preset
 */
export async function listPatterns(industry, presetName, category) {
  const patternsDir = path.join(TEMPLATES_DIR, industry, presetName, 'patterns', category);

  try {
    const entries = await fs.readdir(patternsDir, { withFileTypes: true });
    const patterns = [];

    for (const entry of entries) {
      if (entry.isDirectory()) {
        try {
          const manifest = await loadPatternManifest(path.join(patternsDir, entry.name));
          patterns.push(manifest);
        } catch (error) {
          console.warn(`Skipping invalid pattern ${entry.name}: ${error.message}`);
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
 * Load all patterns for a template preset
 */
export async function loadPresetPatterns(industry, presetName) {
  const preset = await loadTemplatePreset(industry, presetName);
  const patterns = {};

  for (const [section, patternId] of Object.entries(preset.patterns)) {
    const patternPath = path.join(
      TEMPLATES_DIR,
      industry,
      presetName,
      'patterns',
      section,
      patternId
    );

    try {
      patterns[section] = {
        manifest: await loadPatternManifest(patternPath),
        template: await loadPatternTemplate(patternPath),
      };
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
  listTemplatePresets,
  listIndustries,
  loadPresetPatterns,
};
