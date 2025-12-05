#!/usr/bin/env node

/**
 * Phase 2 CLI: Design Draft
 * Generates WordPress theme from blueprint using template patterns
 *
 * Usage:
 *   node design.js generate <blueprint.json> [--output <dir>]
 *   node design.js preview <blueprint.json>
 *   node design.js compare <blueprint.json>
 *   node design.js list-presets [--industry <name>]
 *   node design.js list-patterns <industry> <preset>
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Import Phase 2 modules
import { assembleTheme, previewThemeAssembly, generateComparisonAssembly } from '../lib/phase2/theme-assembler.js';
import { listIndustries, listTemplatePresets, listPatterns } from '../lib/phase2/pattern-loader.js';
import { extractTokensFromBlueprint, generateAllTokens } from '../lib/phase2/design-tokens.js';
import { generateHtmlPreview } from '../lib/phase2/html-preview-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader(title) {
  console.log('\n' + '═'.repeat(60));
  log(`  ${title}`, 'bright');
  console.log('═'.repeat(60) + '\n');
}

function logSection(title) {
  log(`\n▸ ${title}`, 'cyan');
}

/**
 * Load blueprint from file
 */
async function loadBlueprint(blueprintPath) {
  try {
    const content = await fs.readFile(blueprintPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Blueprint file not found: ${blueprintPath}`);
    }
    throw new Error(`Failed to parse blueprint: ${error.message}`);
  }
}

/**
 * Command: generate
 * Generate complete theme from blueprint
 */
async function commandGenerate(args) {
  const blueprintPath = args[0];
  const outputDir = args.includes('--output')
    ? args[args.indexOf('--output') + 1]
    : path.join(process.cwd(), 'output', 'theme');

  if (!blueprintPath) {
    throw new Error('Blueprint path required. Usage: design.js generate <blueprint.json>');
  }

  logHeader('Phase 2: Design Draft Generation');

  // Load blueprint
  logSection('Loading blueprint');
  const blueprint = await loadBlueprint(blueprintPath);
  log(`  Company: ${blueprint.client_profile?.company?.name || 'Unknown'}`, 'dim');
  log(`  Industry: ${blueprint.client_profile?.company?.industry || 'Unknown'}`, 'dim');

  // Assemble theme
  logSection('Assembling theme');
  const result = await assembleTheme(blueprint, { outputDir });

  if (!result.success) {
    log('\n❌ Theme generation failed:', 'red');
    result.errors.forEach(err => log(`   ${err}`, 'red'));
    process.exit(1);
  }

  // Display results
  logSection('Results');
  log(`  Preset: ${result.preset.name}`, 'green');
  log(`  Score: ${Math.round(result.presetScore * 100)}%`, 'dim');

  logSection('Patterns');
  for (const [section, data] of Object.entries(result.patterns)) {
    const completeness = data.summary.completeness;
    const color = completeness === 100 ? 'green' : completeness >= 70 ? 'yellow' : 'red';
    log(`  ${section}: ${data.manifest.name} (${completeness}% complete)`, color);
  }

  if (result.warnings.length > 0) {
    logSection('Warnings');
    result.warnings.forEach(w => log(`  ⚠ ${w}`, 'yellow'));
  }

  logSection('Generated files');
  result.files.forEach(f => log(`  ${f}`, 'dim'));

  log('\n✅ Theme generation complete!', 'green');
}

/**
 * Command: preview
 * Preview theme assembly without writing files
 */
async function commandPreview(args) {
  const blueprintPath = args[0];

  if (!blueprintPath) {
    throw new Error('Blueprint path required. Usage: design.js preview <blueprint.json>');
  }

  logHeader('Phase 2: Design Preview');

  const blueprint = await loadBlueprint(blueprintPath);
  const result = await previewThemeAssembly(blueprint);

  logSection('Preview Results');
  log(`  Preset: ${result.preset.name}`, 'cyan');
  log(`  Industry: ${result.preset.industry}`, 'dim');
  log(`  Style: ${result.preset.style}`, 'dim');
  log(`  Match Score: ${Math.round(result.presetScore * 100)}%`, 'green');

  logSection('Blueprint Factors');
  const factors = result.blueprintFactors;
  log(`  B2B Focus: ${Math.round(factors.b2b_focus * 100)}%`, 'dim');
  log(`  Premium: ${Math.round(factors.premium_positioning * 100)}%`, 'dim');
  log(`  Services: ${factors.services_count}`, 'dim');
  log(`  Has Testimonials: ${factors.has_testimonials ? 'Yes' : 'No'}`, 'dim');

  logSection('Patterns');
  for (const [section, data] of Object.entries(result.patterns)) {
    log(`\n  ${section.toUpperCase()}:`, 'bright');
    log(`    Pattern: ${data.manifest.name}`, 'cyan');
    log(`    Completeness: ${data.summary.completeness}%`, 'dim');
    log(`    Config:`, 'dim');
    for (const [key, value] of Object.entries(data.config)) {
      log(`      ${key}: ${value}`, 'dim');
    }
  }

  logSection('Design Tokens');
  const tokens = result.designTokens.input;
  log(`  Primary: ${tokens.colors.primary}`, 'dim');
  log(`  Secondary: ${tokens.colors.secondary}`, 'dim');
  log(`  Font (Headings): ${tokens.typography.headings}`, 'dim');
  log(`  Font (Body): ${tokens.typography.body}`, 'dim');

  if (result.warnings.length > 0) {
    logSection('Warnings');
    result.warnings.forEach(w => log(`  ⚠ ${w}`, 'yellow'));
  }
}

/**
 * Command: compare
 * Generate A/B/C template comparison
 */
async function commandCompare(args) {
  const blueprintPath = args[0];

  if (!blueprintPath) {
    throw new Error('Blueprint path required. Usage: design.js compare <blueprint.json>');
  }

  logHeader('Phase 2: Template Comparison');

  const blueprint = await loadBlueprint(blueprintPath);
  const comparison = await generateComparisonAssembly(blueprint);

  log('Available options:\n', 'bright');

  for (const option of comparison.options) {
    const isRecommended = option.label === comparison.recommendation.label;
    const marker = isRecommended ? '★ RECOMMENDED' : '';

    log(`  [${option.label}] ${option.preset.name} ${marker}`, isRecommended ? 'green' : 'reset');
    log(`      Industry: ${option.preset.industry}`, 'dim');
    log(`      Style: ${option.preset.style}`, 'dim');
    log(`      Match: ${Math.round(option.score * 100)}%`, 'dim');
    log(`      Patterns: ${Object.keys(option.assembly.patterns).length}`, 'dim');
    console.log();
  }

  logSection('Recommendation');
  log(`  ${comparison.recommendation.reason}`, 'cyan');
}

/**
 * Command: list-presets
 * List available template presets
 */
async function commandListPresets(args) {
  const industryFilter = args.includes('--industry')
    ? args[args.indexOf('--industry') + 1]
    : null;

  logHeader('Available Template Presets');

  if (industryFilter) {
    const presets = await listTemplatePresets(industryFilter);
    log(`Industry: ${industryFilter}\n`, 'bright');

    for (const preset of presets) {
      log(`  ${preset.id}`, 'cyan');
      log(`    Name: ${preset.name}`, 'dim');
      log(`    Style: ${preset.style}`, 'dim');
      log(`    B2B: ${Math.round(preset.suitability.b2b * 100)}%`, 'dim');
      console.log();
    }
  } else {
    const industries = await listIndustries();

    for (const industry of industries) {
      log(`\n${industry.toUpperCase()}:`, 'bright');
      const presets = await listTemplatePresets(industry);

      for (const preset of presets) {
        log(`  • ${preset.id}: ${preset.name}`, 'cyan');
      }
    }
  }
}

/**
 * Command: list-patterns
 * List patterns for a preset
 */
async function commandListPatterns(args) {
  const [industry, presetName] = args;

  if (!industry || !presetName) {
    throw new Error('Usage: design.js list-patterns <industry> <preset>');
  }

  logHeader(`Patterns: ${presetName}`);

  const categories = ['hero', 'services', 'about', 'testimonials', 'contact'];

  for (const category of categories) {
    const patterns = await listPatterns(industry, presetName, category);

    if (patterns.length > 0) {
      log(`\n${category.toUpperCase()}:`, 'bright');

      for (const pattern of patterns) {
        log(`  ${pattern.id}`, 'cyan');
        log(`    ${pattern.name}`, 'dim');
        if (pattern.description) {
          log(`    ${pattern.description.slice(0, 60)}...`, 'dim');
        }
      }
    }
  }
}

/**
 * Command: tokens
 * Generate design tokens from blueprint
 */
async function commandTokens(args) {
  const blueprintPath = args[0];
  const outputPath = args.includes('--output')
    ? args[args.indexOf('--output') + 1]
    : null;

  if (!blueprintPath) {
    throw new Error('Blueprint path required. Usage: design.js tokens <blueprint.json>');
  }

  logHeader('Design Token Generation');

  const blueprint = await loadBlueprint(blueprintPath);
  const tokenInput = extractTokensFromBlueprint(blueprint);
  const tokens = generateAllTokens(tokenInput);

  logSection('Colors');
  log(`  Primary: ${tokenInput.colors.primary}`, 'cyan');
  log(`  Secondary: ${tokenInput.colors.secondary}`, 'cyan');
  log(`  Accent: ${tokenInput.colors.accent}`, 'cyan');

  logSection('Typography');
  log(`  Headings: ${tokenInput.typography.headings}`, 'dim');
  log(`  Body: ${tokenInput.typography.body}`, 'dim');

  if (outputPath) {
    await fs.mkdir(outputPath, { recursive: true });

    await fs.writeFile(
      path.join(outputPath, 'theme.json'),
      JSON.stringify(tokens.themeJson, null, 2)
    );
    await fs.writeFile(
      path.join(outputPath, 'tailwind.config.js'),
      tokens.tailwindConfig
    );
    await fs.writeFile(
      path.join(outputPath, 'variables.css'),
      tokens.cssVariables
    );

    logSection('Files written');
    log(`  ${path.join(outputPath, 'theme.json')}`, 'green');
    log(`  ${path.join(outputPath, 'tailwind.config.js')}`, 'green');
    log(`  ${path.join(outputPath, 'variables.css')}`, 'green');
  } else {
    logSection('theme.json (preview)');
    console.log(JSON.stringify(tokens.themeJson.settings.color.palette, null, 2));

    logSection('CSS Variables (preview)');
    console.log(tokens.cssVariables);
  }
}

/**
 * Command: preview-html
 * Generate standalone HTML preview for fast iteration
 */
async function commandPreviewHtml(args) {
  const blueprintPath = args[0];
  const outputPath = args.includes('--output')
    ? args[args.indexOf('--output') + 1]
    : path.join(process.cwd(), 'output', 'preview');

  if (!blueprintPath) {
    throw new Error('Blueprint path required. Usage: design.js preview-html <blueprint.json>');
  }

  logHeader('Phase 2: HTML Preview Generation');

  // Load blueprint
  logSection('Loading blueprint');
  const blueprint = await loadBlueprint(blueprintPath);
  const companyName = blueprint.client_profile?.company?.name ||
                      blueprint.company?.name ||
                      'Theme Preview';
  log(`  Company: ${companyName}`, 'dim');

  // Generate theme assembly (dry run - no files)
  logSection('Assembling theme data');
  const result = await previewThemeAssembly(blueprint);

  if (!result.success) {
    log('\n❌ Theme assembly failed:', 'red');
    result.errors.forEach(err => log(`   ${err}`, 'red'));
    process.exit(1);
  }

  log(`  Preset: ${result.preset.name}`, 'green');
  log(`  Score: ${Math.round(result.presetScore * 100)}%`, 'dim');

  // Generate HTML preview
  logSection('Generating HTML preview');
  const htmlContent = generateHtmlPreview(result, {
    title: `${companyName} - Website Preview`,
    includeNavigation: true,
    includePlaceholderImages: true,
  });

  // Write files
  await fs.mkdir(outputPath, { recursive: true });
  const previewPath = path.join(outputPath, 'index.html');
  await fs.writeFile(previewPath, htmlContent);

  // Display results
  logSection('Patterns included');
  for (const [section, data] of Object.entries(result.patterns)) {
    const completeness = data.summary.completeness;
    const color = completeness === 100 ? 'green' : completeness >= 70 ? 'yellow' : 'red';
    log(`  ${section}: ${data.manifest.name} (${completeness}% complete)`, color);
  }

  if (result.warnings.length > 0) {
    logSection('Warnings');
    result.warnings.forEach(w => log(`  ⚠ ${w}`, 'yellow'));
  }

  logSection('Output');
  log(`  ${previewPath}`, 'green');

  log('\n✅ HTML preview generated!', 'green');
  log(`\nOpen in browser: file://${previewPath}`, 'cyan');
}

/**
 * Display help
 */
function showHelp() {
  logHeader('WPF Phase 2: Design Draft CLI');

  console.log(`
Usage: design.js <command> [options]

Commands:
  generate <blueprint.json> [--output <dir>]
      Generate complete WordPress theme from blueprint

  preview <blueprint.json>
      Preview theme assembly without writing files

  preview-html <blueprint.json> [--output <dir>]
      Generate standalone HTML preview for fast iteration
      (No WordPress needed - uses Tailwind CDN)

  compare <blueprint.json>
      Show A/B/C template comparison with recommendations

  tokens <blueprint.json> [--output <dir>]
      Generate design tokens (theme.json, tailwind.config.js)

  list-presets [--industry <name>]
      List available template presets

  list-patterns <industry> <preset>
      List patterns available in a preset

  help
      Show this help message

Examples:
  design.js generate ./blueprints/anywhere-solutions.json --output ./output/theme
  design.js preview ./blueprints/anywhere-solutions.json
  design.js preview-html ./blueprints/anywhere-solutions.json --output ./output/preview
  design.js compare ./blueprints/anywhere-solutions.json
  design.js list-presets --industry construction
`);
}

/**
 * Main entry point
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    switch (command) {
      case 'generate':
        await commandGenerate(args.slice(1));
        break;

      case 'preview':
        await commandPreview(args.slice(1));
        break;

      case 'preview-html':
        await commandPreviewHtml(args.slice(1));
        break;

      case 'compare':
        await commandCompare(args.slice(1));
        break;

      case 'tokens':
        await commandTokens(args.slice(1));
        break;

      case 'list-presets':
        await commandListPresets(args.slice(1));
        break;

      case 'list-patterns':
        await commandListPatterns(args.slice(1));
        break;

      case 'help':
      case '--help':
      case '-h':
      case undefined:
        showHelp();
        break;

      default:
        log(`Unknown command: ${command}`, 'red');
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    if (process.env.DEBUG) {
      console.error(error);
    }
    process.exit(1);
  }
}

main();
