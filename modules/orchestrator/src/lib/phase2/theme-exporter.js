/**
 * WordPress Theme Exporter
 * Generates complete WordPress theme from assembled theme data
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';
import { createWriteStream } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Export a complete WordPress theme from assembled theme data
 *
 * @param {Object} blueprint - Project blueprint
 * @param {Object} assembledTheme - Result from theme-assembler.js
 * @param {string} outputDir - Output directory for theme
 * @param {Object} options - Export options
 * @returns {Promise<Object>} Export result with file paths and metadata
 */
export async function exportWordPressTheme(blueprint, assembledTheme, outputDir, options = {}) {
  const {
    includeManifests = true,
    includeReport = true,
    createZip = false,
  } = options;

  const result = {
    success: false,
    themePath: outputDir,
    files: [],
    warnings: [],
    errors: [],
  };

  try {
    console.log('📦 Exporting WordPress theme...');

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    // Generate theme configuration from blueprint
    const themeConfig = extractThemeConfig(blueprint);

    // Step 1: Generate core theme files
    console.log('   Generating core theme files...');
    const coreFiles = await generateThemeFiles(themeConfig, assembledTheme, outputDir);
    result.files.push(...coreFiles);

    // Step 2: Write design tokens and configuration
    console.log('   Writing design tokens...');
    const tokenFiles = await writeDesignTokens(assembledTheme.designTokens, outputDir);
    result.files.push(...tokenFiles);

    // Step 3: Export block patterns
    console.log('   Exporting block patterns...');
    const patternFiles = await exportPatterns(assembledTheme.patterns, outputDir, includeManifests);
    result.files.push(...patternFiles);

    // Step 4: Create directory structure
    console.log('   Creating directory structure...');
    await createThemeDirectories(outputDir);

    // Step 5: Copy assets (if available)
    console.log('   Copying assets...');
    const assetFiles = await copyAssets(assembledTheme, outputDir);
    result.files.push(...assetFiles);

    // Step 6: Generate theme report (optional)
    if (includeReport) {
      console.log('   Generating theme report...');
      const reportPath = await writeThemeReport(blueprint, assembledTheme, themeConfig, outputDir);
      result.files.push(reportPath);
    }

    // Step 7: Create README
    console.log('   Creating README...');
    const readmePath = await createThemeReadme(themeConfig, assembledTheme, outputDir);
    result.files.push(readmePath);

    // Step 8: Create .zip archive (optional)
    if (createZip) {
      console.log('   Creating .zip archive...');
      const zipPath = await createThemeZip(outputDir, themeConfig.theme_slug);
      result.zipPath = zipPath;
      result.files.push(zipPath);
      console.log(`   ✓ ZIP created: ${zipPath}`);
    }

    result.success = true;
    result.themeConfig = themeConfig;
    console.log(`✅ Theme exported to: ${outputDir}`);
    console.log(`   Total files: ${result.files.length}`);

    if (createZip && result.zipPath) {
      console.log(`   📦 ZIP archive: ${result.zipPath}`);
    }

  } catch (error) {
    result.errors.push(error.message);
    console.error('❌ Theme export failed:', error.message);
  }

  return result;
}

/**
 * Extract theme configuration from blueprint
 */
function extractThemeConfig(blueprint) {
  const company = blueprint.client_profile?.company || blueprint.company || {};
  const brand = blueprint.brand_profile || {};

  // Generate theme slug (sanitized)
  const themeName = company.name || 'Custom Theme';
  const themeSlug = themeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return {
    theme_name: themeName,
    theme_slug: themeSlug,
    text_domain: themeSlug,
    theme_uri: company.website || '',
    author: brand.author || 'WPF Theme Assembler',
    author_uri: 'https://github.com/your-org/wpf',
    description: brand.tagline || `Professional WordPress theme for ${themeName}`,
    tags: [
      'custom-colors',
      'custom-menu',
      'featured-images',
      'threaded-comments',
      'translation-ready',
      'block-patterns',
      'full-site-editing',
    ].join(', '),
    version: '1.0.0',
    requires_wp: '6.0',
    tested_wp: '6.7',
    requires_php: '8.0',
    license: 'GPL-2.0-or-later',
  };
}

/**
 * Generate core theme files from templates
 */
async function generateThemeFiles(themeConfig, assembledTheme, outputDir) {
  const files = [];
  const templatesDir = path.resolve(__dirname, '../../../templates/theme');

  try {
    // Generate functions.php
    const functionsTemplate = await fs.readFile(
      path.join(templatesDir, 'functions.php.template'),
      'utf-8'
    );
    const functionsContent = replaceTemplatePlaceholders(functionsTemplate, themeConfig);
    const functionsPath = path.join(outputDir, 'functions.php');
    await fs.writeFile(functionsPath, functionsContent);
    files.push(functionsPath);

    // Generate style.css
    const styleTemplate = await fs.readFile(
      path.join(templatesDir, 'style.css.template'),
      'utf-8'
    );
    const styleContent = replaceTemplatePlaceholders(styleTemplate, themeConfig);
    const stylePath = path.join(outputDir, 'style.css');
    await fs.writeFile(stylePath, styleContent);
    files.push(stylePath);

    // Generate inc/block-patterns.php
    const incDir = path.join(outputDir, 'inc');
    await fs.mkdir(incDir, { recursive: true });

    const patternsTemplate = await fs.readFile(
      path.join(templatesDir, 'inc/block-patterns.php.template'),
      'utf-8'
    );
    const patternsContent = replaceTemplatePlaceholders(patternsTemplate, themeConfig);
    const patternsPath = path.join(incDir, 'block-patterns.php');
    await fs.writeFile(patternsPath, patternsContent);
    files.push(patternsPath);

    // Generate index.php (required by WordPress)
    const indexContent = `<?php
/**
 * Main template file
 * ${themeConfig.theme_name}
 *
 * @package ${themeConfig.theme_slug}
 */

get_header();

if ( have_posts() ) {
    while ( have_posts() ) {
        the_post();
        the_content();
    }
}

get_footer();
`;
    const indexPath = path.join(outputDir, 'index.php');
    await fs.writeFile(indexPath, indexContent);
    files.push(indexPath);

  } catch (error) {
    throw new Error(`Failed to generate theme files: ${error.message}`);
  }

  return files;
}

/**
 * Replace template placeholders with actual values
 */
function replaceTemplatePlaceholders(template, config) {
  let content = template;

  for (const [key, value] of Object.entries(config)) {
    const placeholder = `{{${key}}}`;
    const regex = new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
    content = content.replace(regex, value || '');
  }

  return content;
}

/**
 * Write design tokens to theme files
 */
async function writeDesignTokens(designTokens, outputDir) {
  const files = [];

  // Write theme.json
  const themeJsonPath = path.join(outputDir, 'theme.json');
  await fs.writeFile(
    themeJsonPath,
    JSON.stringify(designTokens.themeJson, null, 2)
  );
  files.push(themeJsonPath);

  // Write tailwind.config.js
  const tailwindPath = path.join(outputDir, 'tailwind.config.js');
  await fs.writeFile(tailwindPath, designTokens.tailwindConfig);
  files.push(tailwindPath);

  // Write CSS variables
  const cssDir = path.join(outputDir, 'assets', 'css');
  await fs.mkdir(cssDir, { recursive: true });

  const cssVarsPath = path.join(cssDir, 'variables.css');
  await fs.writeFile(cssVarsPath, designTokens.cssVariables);
  files.push(cssVarsPath);

  // Create empty tailwind.css (will be compiled by build process)
  const tailwindCssPath = path.join(cssDir, 'tailwind.css');
  const tailwindCssContent = `@import './variables.css';
@tailwind base;
@tailwind components;
@tailwind utilities;
`;
  await fs.writeFile(tailwindCssPath, tailwindCssContent);
  files.push(tailwindCssPath);

  return files;
}

/**
 * Export block patterns to theme
 */
async function exportPatterns(patterns, outputDir, includeManifests = true) {
  const files = [];
  const patternsDir = path.join(outputDir, 'patterns');
  await fs.mkdir(patternsDir, { recursive: true });

  for (const [section, patternData] of Object.entries(patterns)) {
    // Compile pattern to WordPress PHP format
    const patternContent = compilePatternToPhp(patternData, section);
    const patternPath = path.join(patternsDir, `${section}.php`);
    await fs.writeFile(patternPath, patternContent);
    files.push(patternPath);

    // Write manifest if requested
    if (includeManifests) {
      const manifestPath = path.join(patternsDir, `${section}.manifest.json`);
      await fs.writeFile(manifestPath, JSON.stringify({
        id: patternData.manifest.id,
        name: patternData.manifest.name,
        description: patternData.manifest.description || '',
        config: patternData.config,
        contentSummary: patternData.summary,
      }, null, 2));
      files.push(manifestPath);
    }
  }

  return files;
}

/**
 * Compile a pattern to WordPress PHP format
 */
export function compilePatternToPhp(patternData, sectionName) {
  const { manifest, template, config, content } = patternData;

  // Generate PHP header with variables
  const phpHeader = `<?php
/**
 * ${manifest.name} Pattern
 * Generated by WPF Theme Assembler
 *
 * Pattern ID: ${manifest.id}
 * Section: ${sectionName}
 * Generated: ${new Date().toISOString()}
 */

// Configuration
$config = array_merge([
${Object.entries(config).map(([key, value]) =>
  `    '${key}' => ${formatPhpValue(value)},`
).join('\n')}
], $config ?? []);

// Content (from blueprint)
$content = array_merge([
${Object.entries(content).map(([key, value]) =>
  `    '${key}' => ${formatPhpValue(value)},`
).join('\n')}
], $content ?? []);

// Tailwind classes
$classes = ${formatPhpArray(manifest.tailwind_classes || {})};

?>
`;

  // Extract template content (remove original PHP header if present)
  let templateContent = template;
  const phpHeaderEnd = template.indexOf('?>');
  if (phpHeaderEnd !== -1) {
    templateContent = template.slice(phpHeaderEnd + 2).trim();
  }

  return phpHeader + '\n' + templateContent;
}

/**
 * Format JavaScript value as PHP value
 */
function formatPhpValue(value) {
  if (value === null || value === undefined) {
    return 'null';
  }

  if (typeof value === 'boolean') {
    return value ? 'true' : 'false';
  }

  if (typeof value === 'number') {
    return String(value);
  }

  if (typeof value === 'string') {
    // Escape single quotes and newlines
    const escaped = value
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r");
    return `'${escaped}'`;
  }

  if (Array.isArray(value)) {
    const items = value.map(item => formatPhpValue(item)).join(', ');
    return `[${items}]`;
  }

  if (typeof value === 'object') {
    return formatPhpArray(value);
  }

  return 'null';
}

/**
 * Format JavaScript object as PHP associative array
 */
function formatPhpArray(obj, indent = 0) {
  const indentStr = '    '.repeat(indent);
  const innerIndentStr = '    '.repeat(indent + 1);

  const entries = Object.entries(obj).map(([key, value]) => {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return `${innerIndentStr}'${key}' => ${formatPhpArray(value, indent + 1)}`;
    }
    return `${innerIndentStr}'${key}' => ${formatPhpValue(value)}`;
  });

  if (entries.length === 0) {
    return '[]';
  }

  return `[\n${entries.join(',\n')}\n${indentStr}]`;
}

/**
 * Create theme directory structure
 */
async function createThemeDirectories(outputDir) {
  const directories = [
    'assets/css',
    'assets/js',
    'assets/images',
    'inc',
    'patterns',
    'templates',
    'parts',
  ];

  for (const dir of directories) {
    await fs.mkdir(path.join(outputDir, dir), { recursive: true });
  }

  // Create empty main.js
  const mainJsPath = path.join(outputDir, 'assets/js/main.js');
  const mainJsContent = `/**
 * Main JavaScript file
 */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Theme loaded');
});
`;
  await fs.writeFile(mainJsPath, mainJsContent);
}

/**
 * Copy assets from assembled theme
 */
async function copyAssets(assembledTheme, outputDir) {
  const files = [];

  // This is a placeholder for future asset copying
  // Could include:
  // - Generated images
  // - Compiled CSS
  // - Icons
  // - Fonts

  return files;
}

/**
 * Write theme export report
 */
async function writeThemeReport(blueprint, assembledTheme, themeConfig, outputDir) {
  const report = {
    theme: themeConfig,
    preset: {
      id: assembledTheme.preset.id,
      name: assembledTheme.preset.name,
      industry: assembledTheme.preset.industry,
      score: assembledTheme.presetScore,
    },
    patterns: Object.fromEntries(
      Object.entries(assembledTheme.patterns).map(([section, data]) => [
        section,
        {
          id: data.manifest.id,
          name: data.manifest.name,
          completeness: data.summary.completeness,
          missingContent: data.summary.missing,
          config: data.config,
        },
      ])
    ),
    designTokens: assembledTheme.designTokens.input,
    warnings: assembledTheme.warnings,
    exportedAt: new Date().toISOString(),
    wpfVersion: '0.2.0-beta',
  };

  const reportPath = path.join(outputDir, 'wpf-theme-report.json');
  await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

  return reportPath;
}

/**
 * Create theme README file
 */
async function createThemeReadme(themeConfig, assembledTheme, outputDir) {
  const readme = `# ${themeConfig.theme_name}

${themeConfig.description}

## Theme Information

- **Version:** ${themeConfig.version}
- **Author:** ${themeConfig.author}
- **License:** ${themeConfig.license}
- **Requires WordPress:** ${themeConfig.requires_wp}+
- **Requires PHP:** ${themeConfig.requires_php}+
- **Tested up to:** ${themeConfig.tested_wp}

## Installation

1. Upload the theme folder to \`/wp-content/themes/\`
2. Activate the theme through the WordPress admin
3. Navigate to Appearance > Customize to configure

## Features

- Block patterns for common sections
- Tailwind CSS integration
- Responsive design
- Performance optimized
- Accessibility ready

## Development

### Build CSS

\`\`\`bash
npm install
npm run build
\`\`\`

### Watch for changes

\`\`\`bash
npm run watch
\`\`\`

## Block Patterns

This theme includes ${Object.keys(assembledTheme.patterns).length} block patterns:

${Object.entries(assembledTheme.patterns).map(([section, data]) =>
  `- **${data.manifest.name}** (${section})`
).join('\n')}

## Support

For support and documentation, visit: ${themeConfig.author_uri}

## Credits

Generated by WPF Theme Assembler
`;

  const readmePath = path.join(outputDir, 'README.md');
  await fs.writeFile(readmePath, readme);

  return readmePath;
}

/**
 * Create .zip archive of theme directory
 */
async function createThemeZip(themeDir, themeSlug) {
  return new Promise((resolve, reject) => {
    const parentDir = path.dirname(themeDir);
    const zipPath = path.join(parentDir, `${themeSlug}.zip`);

    // Create write stream
    const output = createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Event handlers
    output.on('close', () => {
      console.log(`   ✓ ZIP archive created: ${archive.pointer()} bytes`);
      resolve(zipPath);
    });

    output.on('error', (err) => {
      reject(new Error(`Output stream error: ${err.message}`));
    });

    archive.on('error', (err) => {
      reject(new Error(`Archive error: ${err.message}`));
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('   ⚠ Archive warning:', err.message);
      } else {
        reject(err);
      }
    });

    // Pipe archive data to output file
    archive.pipe(output);

    // Add theme directory to archive
    // This will create theme-slug/ directory inside the zip
    archive.directory(themeDir, themeSlug);

    // Finalize the archive
    archive.finalize();
  });
}

/**
 * Create standalone .zip for WordPress theme upload
 *
 * @param {string} themeDir - Path to theme directory
 * @param {string} themeSlug - Theme slug for naming
 * @param {string} outputPath - Optional custom output path
 * @returns {Promise<string>} Path to created .zip file
 */
export async function createWordPressThemeZip(themeDir, themeSlug, outputPath = null) {
  try {
    // Validate theme directory exists
    const stats = await fs.stat(themeDir);
    if (!stats.isDirectory()) {
      throw new Error(`${themeDir} is not a directory`);
    }

    // Determine output path
    const zipPath = outputPath || path.join(path.dirname(themeDir), `${themeSlug}.zip`);

    // Validate required theme files exist
    const requiredFiles = ['style.css', 'functions.php', 'index.php'];
    for (const file of requiredFiles) {
      const filePath = path.join(themeDir, file);
      try {
        await fs.access(filePath);
      } catch (err) {
        throw new Error(`Required theme file missing: ${file}`);
      }
    }

    console.log('📦 Creating WordPress theme .zip...');
    console.log(`   Source: ${themeDir}`);
    console.log(`   Output: ${zipPath}`);

    // Create the zip
    await createThemeZip(themeDir, themeSlug);

    console.log('✅ WordPress theme .zip created successfully');
    return zipPath;

  } catch (error) {
    throw new Error(`Failed to create theme .zip: ${error.message}`);
  }
}

export default {
  exportWordPressTheme,
  compilePatternToPhp,
  createWordPressThemeZip,
};
