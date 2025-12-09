/**
 * Theme Assembler
 * Orchestrates the full Phase 2 pipeline: preset selection, content injection, theme generation
 */

import fs from 'fs/promises';
import path from 'path';

import { loadPresetPatterns, loadPatternTemplate } from './pattern-loader.js';
import { selectBestPreset, getPatternConfigRecommendations, generateTemplateComparison } from './template-selector.js';
import { injectContentWithMapping, validateContent, generateContentSummary } from './content-injector.js';
import { extractTokensFromBlueprint, generateThemeJson, generateTailwindConfig, generateCssVariables } from './design-tokens.js';
import { generateHtmlPreview } from './html-preview-generator.js';
import { generateBlueprintContent } from './content-generator.js';

/**
 * Assemble complete theme data from blueprint
 */
export async function assembleTheme(blueprint, options = {}) {
  const {
    industry = null,
    forcePreset = null,
    outputDir = null,
    dryRun = false,
  } = options;

  const result = {
    success: false,
    preset: null,
    patterns: {},
    designTokens: null,
    images: null, // Generated stock photos
    files: [],
    warnings: [],
    errors: [],
    blueprint, // Include blueprint for downstream use (e.g., stats section)
  };

  try {
    // Step 1: Select best template preset
    console.log('🎨 Selecting template preset...');
    const presetSelection = await selectBestPreset(blueprint, {
      industry: industry || blueprint.client_profile?.company?.industry,
      forcePreset,
    });

    result.preset = presetSelection.preset;
    result.presetScore = presetSelection.score;
    result.blueprintFactors = presetSelection.factors;

    console.log(`   Selected: ${result.preset.name} (score: ${Math.round(presetSelection.score * 100)}%)`);

    // Step 2: Load all patterns for the preset
    console.log('📦 Loading patterns...');
    const { preset, patterns } = await loadPresetPatterns(
      result.preset.industry,
      result.preset.id
    );

    // Step 3: Process each pattern
    console.log('🔧 Processing patterns...');
    for (const [section, patternData] of Object.entries(patterns)) {
      const { manifest, template } = patternData;

      // Get recommended configuration
      const config = getPatternConfigRecommendations(manifest, blueprint);

      // Inject content from blueprint
      const content = injectContentWithMapping(manifest, blueprint);

      // Validate content
      const validation = validateContent(manifest, content);
      if (!validation.valid) {
        result.warnings.push(`Pattern ${section}: missing required content: ${validation.missing.join(', ')}`);
      }

      // Generate summary
      const summary = generateContentSummary(manifest, content);

      result.patterns[section] = {
        manifest,
        template,
        config,
        content,
        validation,
        summary,
      };

      console.log(`   ${section}: ${summary.completeness}% complete`);
    }

    // Step 3.5: Generate stock photos (if enabled)
    if (options.generateImages !== false) {
      console.log('🖼️  Generating stock photos...');

      try {
        const industry = blueprint.client_profile?.company?.industry ||
                        blueprint.industry ||
                        'professional';

        const patternCategories = Object.keys(result.patterns)
          .filter(section => ['hero', 'about', 'services', 'testimonials', 'team', 'gallery'].includes(section));

        if (patternCategories.length > 0) {
          const contentResult = await generateBlueprintContent(blueprint, {
            includeImages: true,
            imagePatterns: patternCategories
          });

          result.images = contentResult.images;

          // Add image URLs to pattern content
          for (const [category, photos] of Object.entries(result.images)) {
            if (result.patterns[category] && photos.length > 0) {
              result.patterns[category].content.images = photos.map(photo => ({
                url: photo.downloads.regular?.url || photo.downloads.small?.url,
                path: photo.downloads.regular?.path || photo.downloads.small?.path,
                description: photo.description,
                attribution: photo.attribution
              }));

              // Set primary image for patterns that use one main image
              if (['hero', 'about'].includes(category)) {
                result.patterns[category].content.image_url = photos[0].downloads.regular?.url;
                result.patterns[category].content.image_path = photos[0].downloads.regular?.path;
              }
            }
          }

          console.log(`   ✅ Generated photos for ${Object.keys(result.images).length} pattern(s)`);
        } else {
          console.log('   ⚠️  No compatible patterns found for image generation');
        }
      } catch (error) {
        result.warnings.push(`Stock photo generation failed: ${error.message}`);
        console.log(`   ⚠️  Stock photo generation failed: ${error.message}`);
      }
    }

    // Step 4: Generate design tokens
    console.log('🎯 Generating design tokens...');
    const tokenInput = extractTokensFromBlueprint(blueprint);

    // Merge preset colors if no brand colors specified
    if (!blueprint.brand_profile?.colors) {
      tokenInput.colors = {
        ...tokenInput.colors,
        ...result.preset.colors,
      };
    }

    // Merge preset typography if not specified
    if (!blueprint.brand_profile?.typography) {
      tokenInput.typography = {
        ...tokenInput.typography,
        ...result.preset.typography,
      };
    }

    result.designTokens = {
      input: tokenInput,
      themeJson: generateThemeJson(tokenInput),
      tailwindConfig: generateTailwindConfig(tokenInput),
      cssVariables: generateCssVariables(tokenInput),
    };

    // Step 5: Write files if outputDir specified
    if (outputDir && !dryRun) {
      console.log('📁 Writing theme files...');
      result.files = await writeThemeFiles(result, outputDir, blueprint);
    }

    result.success = true;
    console.log('✅ Theme assembly complete!');

  } catch (error) {
    result.errors.push(error.message);
    console.error('❌ Theme assembly failed:', error.message);
  }

  return result;
}

/**
 * Write assembled theme files to disk
 */
export async function writeThemeFiles(assemblyResult, outputDir, blueprint = {}) {
  const files = [];

  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Write theme.json
  const themeJsonPath = path.join(outputDir, 'theme.json');
  await fs.writeFile(
    themeJsonPath,
    JSON.stringify(assemblyResult.designTokens.themeJson, null, 2)
  );
  files.push(themeJsonPath);

  // Write tailwind.config.js
  const tailwindPath = path.join(outputDir, 'tailwind.config.js');
  await fs.writeFile(tailwindPath, assemblyResult.designTokens.tailwindConfig);
  files.push(tailwindPath);

  // Write CSS variables
  const cssVarsPath = path.join(outputDir, 'css', 'variables.css');
  await fs.mkdir(path.dirname(cssVarsPath), { recursive: true });
  await fs.writeFile(cssVarsPath, assemblyResult.designTokens.cssVariables);
  files.push(cssVarsPath);

  // Write pattern templates
  const patternsDir = path.join(outputDir, 'patterns');
  await fs.mkdir(patternsDir, { recursive: true });

  for (const [section, patternData] of Object.entries(assemblyResult.patterns)) {
    // Write pattern PHP file with injected variables
    const patternPath = path.join(patternsDir, `${section}.php`);
    const patternContent = generatePatternFile(section, patternData);
    await fs.writeFile(patternPath, patternContent);
    files.push(patternPath);

    // Write pattern manifest (for reference)
    const manifestPath = path.join(patternsDir, `${section}.manifest.json`);
    await fs.writeFile(manifestPath, JSON.stringify({
      id: patternData.manifest.id,
      name: patternData.manifest.name,
      config: patternData.config,
      contentSummary: patternData.summary,
    }, null, 2));
    files.push(manifestPath);
  }

  // Write assembly report
  const reportPath = path.join(outputDir, 'assembly-report.json');
  await fs.writeFile(reportPath, JSON.stringify({
    preset: {
      id: assemblyResult.preset.id,
      name: assemblyResult.preset.name,
      score: assemblyResult.presetScore,
    },
    patterns: Object.fromEntries(
      Object.entries(assemblyResult.patterns).map(([section, data]) => [
        section,
        {
          id: data.manifest.id,
          completeness: data.summary.completeness,
          config: data.config,
          images: data.content.images?.length || 0,
        },
      ])
    ),
    images: assemblyResult.images ? {
      categories: Object.keys(assemblyResult.images),
      totalPhotos: Object.values(assemblyResult.images).reduce((sum, photos) => sum + photos.length, 0),
      details: Object.fromEntries(
        Object.entries(assemblyResult.images).map(([category, photos]) => [
          category,
          photos.map(photo => ({
            id: photo.id,
            description: photo.description,
            attribution: photo.attribution.text
          }))
        ])
      )
    } : null,
    designTokens: assemblyResult.designTokens.input,
    warnings: assemblyResult.warnings,
    generatedAt: new Date().toISOString(),
  }, null, 2));
  files.push(reportPath);

  // Generate HTML preview
  console.log('🌐 Generating HTML preview...');
  const previewDir = path.join(outputDir, 'preview');
  await fs.mkdir(previewDir, { recursive: true });

  const companyName = blueprint.client_profile?.company?.name ||
                      blueprint.company?.name ||
                      'Theme Preview';

  const htmlPreview = await generateHtmlPreview(assemblyResult, {
    title: `${companyName} - Website Preview`,
    includeNavigation: true,
    includePlaceholderImages: true,
  });

  const previewPath = path.join(previewDir, 'index.html');
  await fs.writeFile(previewPath, htmlPreview);
  files.push(previewPath);

  console.log(`   Preview: ${previewPath}`);

  return files;
}

/**
 * Generate a pattern PHP file with injected content and config
 */
function generatePatternFile(section, patternData) {
  const { manifest, template, config, content } = patternData;

  // Generate PHP header with injected variables
  const header = `<?php
/**
 * ${manifest.name} Pattern
 * Generated by WPF Theme Assembler
 *
 * Pattern ID: ${manifest.id}
 * Section: ${section}
 * Generated: ${new Date().toISOString()}
 */

// Configuration (can be overridden)
$config = array_merge([
${Object.entries(config).map(([key, value]) => `    '${key}' => ${JSON.stringify(value)},`).join('\n')}
], $config ?? []);

// Content (injected from blueprint)
$content = array_merge([
${Object.entries(content).map(([key, value]) => {
  if (value === undefined || value === null) {
    return `    '${key}' => null,`;
  }
  return `    '${key}' => ${typeof value === 'string' ? `'${value.replace(/'/g, "\\'").replace(/\n/g, "\\n")}'` : JSON.stringify(value)},`;
}).join('\n')}
], $content ?? []);

// Tailwind classes
$classes = ${JSON.stringify(manifest.tailwind_classes || {}, null, 4)};

?>
`;

  // Extract the template content (everything after the PHP header in original template)
  let templateContent = template;

  // Remove original PHP header if present
  const phpHeaderEnd = template.indexOf('?>');
  if (phpHeaderEnd !== -1) {
    templateContent = template.slice(phpHeaderEnd + 2).trim();
  }

  return header + '\n' + templateContent;
}

/**
 * Preview theme assembly without writing files
 */
export async function previewThemeAssembly(blueprint, options = {}) {
  return assembleTheme(blueprint, { ...options, dryRun: true });
}

/**
 * Generate A/B/C comparison with full assembly
 */
export async function generateComparisonAssembly(blueprint, options = {}) {
  const comparison = await generateTemplateComparison(blueprint, options);

  const results = [];

  for (const option of comparison.options) {
    const assembly = await assembleTheme(blueprint, {
      ...options,
      forcePreset: option.preset.id,
      dryRun: true,
    });

    results.push({
      label: option.label,
      preset: option.preset,
      score: option.score,
      assembly,
    });
  }

  return {
    options: results,
    recommendation: comparison.recommendation,
    factors: comparison.factors,
  };
}

/**
 * Generate homepage HTML preview
 */
export function generateHomepagePreview(assemblyResult) {
  const sections = ['hero', 'services', 'about', 'testimonials', 'contact'];

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Theme Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
${assemblyResult.designTokens.cssVariables}
    </style>
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: 'var(--color-primary)',
                        secondary: 'var(--color-secondary)',
                        accent: 'var(--color-accent)',
                    }
                }
            }
        }
    </script>
</head>
<body class="font-body">
`;

  for (const section of sections) {
    if (assemblyResult.patterns[section]) {
      html += `
    <!-- ${section.toUpperCase()} SECTION -->
    <section id="${section}" class="pattern-${section}">
        <!-- Pattern: ${assemblyResult.patterns[section].manifest.name} -->
        <!-- Completeness: ${assemblyResult.patterns[section].summary.completeness}% -->
        <div class="p-8 border-b border-gray-200">
            <p class="text-sm text-gray-500 mb-2">Section: ${section}</p>
            <p class="text-lg font-semibold">${assemblyResult.patterns[section].manifest.name}</p>
            <p class="text-sm text-gray-600">Content slots: ${Object.keys(assemblyResult.patterns[section].content).length}</p>
        </div>
    </section>
`;
    }
  }

  html += `
</body>
</html>
`;

  return html;
}

export default {
  assembleTheme,
  writeThemeFiles,
  previewThemeAssembly,
  generateComparisonAssembly,
  generateHomepagePreview,
};
