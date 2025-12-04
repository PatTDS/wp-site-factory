/**
 * WPF v2.0 Template Engine
 *
 * Processes EJS templates to generate WordPress files
 */
import fsExtra from 'fs-extra';
const { readFile, writeFile, ensureDir, copy, pathExists } = fsExtra;
import { render } from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { WPFConfig } from '../types/config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = path.join(__dirname, '../../_templates');

export interface TemplateResult {
  success: boolean;
  filesGenerated: number;
  errors: string[];
}

export interface GenerateOptions {
  outputDir: string;
  config: WPFConfig;
  verbose?: boolean;
}

/**
 * Render a single EJS template
 */
export async function renderTemplate(
  templatePath: string,
  data: WPFConfig
): Promise<string> {
  const template = await readFile(templatePath, 'utf-8');

  return render(template, data, {
    filename: templatePath,
    async: false,
    rmWhitespace: false
  });
}

/**
 * Generate file from template
 */
export async function generateFile(
  templatePath: string,
  outputPath: string,
  data: WPFConfig
): Promise<boolean> {
  try {
    const content = await renderTemplate(templatePath, data);

    // Ensure output directory exists
    await ensureDir(path.dirname(outputPath));

    // Write file
    await writeFile(outputPath, content, 'utf-8');

    // Make scripts executable
    if (outputPath.endsWith('.sh')) {
      const { chmod } = await import('fs/promises');
      await chmod(outputPath, 0o755);
    }

    return true;
  } catch (error) {
    console.error(`Error generating ${outputPath}:`, error);
    return false;
  }
}

/**
 * Generate theme files
 */
export async function generateTheme(
  options: GenerateOptions
): Promise<TemplateResult> {
  const { outputDir, config, verbose } = options;
  const themeDir = path.join(outputDir, 'theme');
  const templatesDir = path.join(TEMPLATES_DIR, 'theme');
  const errors: string[] = [];
  let filesGenerated = 0;

  // Base theme files
  const baseTemplates = [
    'base/functions.php.ejs',
    'base/header.php.ejs',
    'base/footer.php.ejs',
    'base/style.css.ejs',
    'base/index.php.ejs',
    'base/tailwind.config.js.ejs',
    'base/package.json.ejs',
    'base/input.css.ejs'
  ];

  for (const template of baseTemplates) {
    const templatePath = path.join(templatesDir, template);
    const outputPath = path.join(
      themeDir,
      template.replace('.ejs', '').replace('base/', '')
    );

    if (await pathExists(templatePath)) {
      if (verbose) console.log(`  Generating: ${outputPath}`);
      const success = await generateFile(templatePath, outputPath, config);
      if (success) {
        filesGenerated++;
      } else {
        errors.push(`Failed to generate: ${outputPath}`);
      }
    }
  }

  // Page templates
  const pageTemplates = [
    'pages/front-page.php.ejs',
    'pages/page.php.ejs'
  ];

  for (const template of pageTemplates) {
    const templatePath = path.join(templatesDir, template);
    const outputPath = path.join(
      themeDir,
      template.replace('.ejs', '').replace('pages/', '')
    );

    if (await pathExists(templatePath)) {
      if (verbose) console.log(`  Generating: ${outputPath}`);
      const success = await generateFile(templatePath, outputPath, config);
      if (success) {
        filesGenerated++;
      } else {
        errors.push(`Failed to generate: ${outputPath}`);
      }
    }
  }

  // Section templates -> template-parts/sections/
  // Dynamically discover all section templates (design-system integration)
  const sectionsTemplateDir = path.join(templatesDir, 'sections');
  const sectionsDir = path.join(themeDir, 'template-parts', 'sections');
  await ensureDir(sectionsDir);

  // Get all .php.ejs files in sections directory
  const { readdir } = await import('fs/promises');
  let sectionFiles: string[] = [];
  try {
    const files = await readdir(sectionsTemplateDir);
    sectionFiles = files.filter(f => f.endsWith('.php.ejs'));
  } catch {
    // Fallback to hardcoded list if directory doesn't exist
    sectionFiles = [
      'hero-centered.php.ejs',
      'features-grid.php.ejs',
      'cta-banner.php.ejs'
    ];
  }

  for (const sectionFile of sectionFiles) {
    const templatePath = path.join(sectionsTemplateDir, sectionFile);
    const outputPath = path.join(sectionsDir, sectionFile.replace('.ejs', ''));

    if (await pathExists(templatePath)) {
      if (verbose) console.log(`  Generating section: ${outputPath}`);
      const success = await generateFile(templatePath, outputPath, config);
      if (success) {
        filesGenerated++;
      } else {
        errors.push(`Failed to generate: ${outputPath}`);
      }
    }
  }

  // Create js directory and main.js
  const jsDir = path.join(themeDir, 'js');
  await ensureDir(jsDir);
  await writeFile(
    path.join(jsDir, 'main.js'),
    `// ${config.company.name} Theme JavaScript\n'use strict';\n\nconsole.log('Theme loaded');\n`
  );
  filesGenerated++;

  return {
    success: errors.length === 0,
    filesGenerated,
    errors
  };
}

/**
 * Generate plugin files
 */
export async function generatePlugin(
  options: GenerateOptions
): Promise<TemplateResult> {
  const { outputDir, config, verbose } = options;
  const pluginDir = path.join(outputDir, 'plugin');
  const templatesDir = path.join(TEMPLATES_DIR, 'plugin');
  const errors: string[] = [];
  let filesGenerated = 0;

  // Create plugin directory structure
  await ensureDir(path.join(pluginDir, 'includes'));
  await ensureDir(path.join(pluginDir, 'admin'));
  await ensureDir(path.join(pluginDir, 'languages'));

  // Plugin files to generate
  const pluginTemplates = [
    { src: 'base/plugin-main.php.ejs', dest: `${config.project.name}-plugin.php` },
    { src: 'includes/class-security.php.ejs', dest: 'includes/class-security.php' }
  ];

  for (const { src, dest } of pluginTemplates) {
    const templatePath = path.join(templatesDir, src);
    const outputPath = path.join(pluginDir, dest);

    if (await pathExists(templatePath)) {
      if (verbose) console.log(`  Generating: ${outputPath}`);
      const success = await generateFile(templatePath, outputPath, config);
      if (success) {
        filesGenerated++;
      } else {
        errors.push(`Failed to generate: ${outputPath}`);
      }
    }
  }

  // Create empty files for other classes
  const emptyClasses = [
    'includes/class-loader.php',
    'includes/class-performance.php',
    'admin/class-admin.php'
  ];

  for (const file of emptyClasses) {
    const filePath = path.join(pluginDir, file);
    const className = path.basename(file, '.php').replace('class-', '');
    const classContent = `<?php\n// ${className} class - TODO: Implement\nif (!defined('ABSPATH')) exit;\n\nclass ${config.project.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}_${className.charAt(0).toUpperCase() + className.slice(1)} {\n    private static $instance = null;\n    public static function get_instance() {\n        if (null === self::$instance) self::$instance = new self();\n        return self::$instance;\n    }\n    private function __construct() {}\n}\n`;

    await writeFile(filePath, classContent);
    filesGenerated++;
  }

  return {
    success: errors.length === 0,
    filesGenerated,
    errors
  };
}

/**
 * Generate Docker files
 */
export async function generateDocker(
  options: GenerateOptions
): Promise<TemplateResult> {
  const { outputDir, config, verbose } = options;
  const templatesDir = path.join(TEMPLATES_DIR, 'docker');
  const errors: string[] = [];
  let filesGenerated = 0;

  const dockerTemplates = [
    { src: 'docker-compose.yml.ejs', dest: 'docker-compose.yml' },
    { src: '.env.ejs', dest: '.env' },
    { src: 'uploads.ini.ejs', dest: 'uploads.ini' }
  ];

  for (const { src, dest } of dockerTemplates) {
    const templatePath = path.join(templatesDir, src);
    const outputPath = path.join(outputDir, dest);

    if (await pathExists(templatePath)) {
      if (verbose) console.log(`  Generating: ${outputPath}`);
      const success = await generateFile(templatePath, outputPath, config);
      if (success) {
        filesGenerated++;
      } else {
        errors.push(`Failed to generate: ${outputPath}`);
      }
    }
  }

  return {
    success: errors.length === 0,
    filesGenerated,
    errors
  };
}

/**
 * Generate setup scripts
 */
export async function generateScripts(
  options: GenerateOptions
): Promise<TemplateResult> {
  const { outputDir, config, verbose } = options;
  const scriptsDir = path.join(outputDir, 'scripts');
  const templatesDir = path.join(TEMPLATES_DIR, 'scripts');
  const errors: string[] = [];
  let filesGenerated = 0;

  await ensureDir(scriptsDir);

  const scriptTemplates = [
    { src: 'setup-wordpress.sh.ejs', dest: 'setup-wordpress.sh' }
  ];

  for (const { src, dest } of scriptTemplates) {
    const templatePath = path.join(templatesDir, src);
    const outputPath = path.join(scriptsDir, dest);

    if (await pathExists(templatePath)) {
      if (verbose) console.log(`  Generating: ${outputPath}`);
      const success = await generateFile(templatePath, outputPath, config);
      if (success) {
        filesGenerated++;
      } else {
        errors.push(`Failed to generate: ${outputPath}`);
      }
    }
  }

  return {
    success: errors.length === 0,
    filesGenerated,
    errors
  };
}

/**
 * Generate test files
 */
export async function generateTests(
  options: GenerateOptions
): Promise<TemplateResult> {
  const { outputDir, config, verbose } = options;
  const testsDir = path.join(outputDir, 'tests');
  const e2eDir = path.join(testsDir, 'e2e');
  const templatesDir = path.join(TEMPLATES_DIR, 'tests');
  const errors: string[] = [];
  let filesGenerated = 0;

  await ensureDir(e2eDir);

  const testTemplates = [
    { src: 'playwright.config.ts.ejs', dest: 'playwright.config.ts' },
    { src: 'e2e/pages.spec.ts.ejs', dest: 'e2e/' + config.project.name + '.spec.ts' }
  ];

  for (const { src, dest } of testTemplates) {
    const templatePath = path.join(templatesDir, src);
    const outputPath = path.join(testsDir, dest);

    if (await pathExists(templatePath)) {
      if (verbose) console.log(`  Generating: ${outputPath}`);
      const success = await generateFile(templatePath, outputPath, config);
      if (success) {
        filesGenerated++;
      } else {
        errors.push(`Failed to generate: ${outputPath}`);
      }
    }
  }

  return {
    success: errors.length === 0,
    filesGenerated,
    errors
  };
}

/**
 * Generate all project files
 */
export async function generateProject(
  options: GenerateOptions
): Promise<TemplateResult> {
  const { outputDir, config, verbose } = options;
  const allErrors: string[] = [];
  let totalFiles = 0;

  // Ensure output directory exists
  await ensureDir(outputDir);

  if (verbose) console.log('Generating theme files...');
  const themeResult = await generateTheme(options);
  totalFiles += themeResult.filesGenerated;
  allErrors.push(...themeResult.errors);

  if (verbose) console.log('Generating plugin files...');
  const pluginResult = await generatePlugin(options);
  totalFiles += pluginResult.filesGenerated;
  allErrors.push(...pluginResult.errors);

  if (verbose) console.log('Generating Docker files...');
  const dockerResult = await generateDocker(options);
  totalFiles += dockerResult.filesGenerated;
  allErrors.push(...dockerResult.errors);

  if (verbose) console.log('Generating scripts...');
  const scriptsResult = await generateScripts(options);
  totalFiles += scriptsResult.filesGenerated;
  allErrors.push(...scriptsResult.errors);

  if (verbose) console.log('Generating tests...');
  const testsResult = await generateTests(options);
  totalFiles += testsResult.filesGenerated;
  allErrors.push(...testsResult.errors);

  // Write config file
  const configPath = path.join(outputDir, 'wpf-config.yaml');
  const { stringify } = await import('yaml');
  await writeFile(configPath, stringify(config));
  totalFiles++;

  return {
    success: allErrors.length === 0,
    filesGenerated: totalFiles,
    errors: allErrors
  };
}
