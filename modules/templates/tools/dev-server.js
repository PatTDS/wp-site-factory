#!/usr/bin/env node

/**
 * Template Development Server
 *
 * Serves compiled Handlebars templates with test data for rapid preview.
 * Supports hot reload and multiple test case scenarios.
 *
 * Usage:
 *   node dev-server.js [--port 3000] [--watch]
 *
 * Routes:
 *   /                          - Template browser UI
 *   /preview/:industry/:section/:variant/:testCase
 *   /api/templates             - List all available templates
 *   /api/test-cases/:path      - Get test cases for a template
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const PORT = process.env.PORT || 3000;
const TEMPLATES_DIR = path.join(__dirname, '..', 'industries');
const WATCH_MODE = process.argv.includes('--watch');

// Simple Handlebars-like compiler (minimal implementation)
class TemplateCompiler {
  constructor() {
    this.helpers = {
      default: (value, defaultValue) => value || defaultValue,
      eq: (a, b) => a === b,
      truncate: (str, len) => str && str.length > len ? str.substring(0, len) + '...' : str,
      formatNumber: (num) => num ? num.toLocaleString() : '0'
    };
  }

  compile(template, data) {
    let result = template;

    // Strip Handlebars comments {{!-- ... --}} and {{! ... }}
    result = result.replace(/\{\{!--[\s\S]*?--\}\}/g, '');
    result = result.replace(/\{\{![^}]*\}\}/g, '');

    // Handle {{#if condition}}...{{/if}}
    result = this.processConditionals(result, data);

    // Handle {{#each items}}...{{/each}}
    result = this.processEach(result, data);

    // Handle {{#unless condition}}...{{/unless}}
    result = this.processUnless(result, data);

    // Handle {{default value "fallback"}}
    result = this.processDefault(result, data);

    // Handle {{#eq a b}}...{{/eq}}
    result = this.processEq(result, data);

    // Handle simple {{variable}}
    result = this.processVariables(result, data);

    // Handle {{{unescaped}}}
    result = this.processUnescaped(result, data);

    return result;
  }

  processConditionals(template, data) {
    const ifRegex = /\{\{#if\s+([^}]+)\}\}([\s\S]*?)\{\{\/if\}\}/g;
    return template.replace(ifRegex, (match, condition, content) => {
      const value = this.getValue(data, condition.trim());
      if (value && (!Array.isArray(value) || value.length > 0)) {
        return this.compile(content, data);
      }
      return '';
    });
  }

  processUnless(template, data) {
    const unlessRegex = /\{\{#unless\s+([^}]+)\}\}([\s\S]*?)\{\{\/unless\}\}/g;
    return template.replace(unlessRegex, (match, condition, content) => {
      const value = this.getValue(data, condition.trim());
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return this.compile(content, data);
      }
      return '';
    });
  }

  processEach(template, data) {
    const eachRegex = /\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g;
    return template.replace(eachRegex, (match, arrayPath, content) => {
      const array = this.getValue(data, arrayPath.trim());
      if (!Array.isArray(array)) return '';

      return array.map((item, index) => {
        const itemData = { ...data, this: item, '@index': index, '@first': index === 0, '@last': index === array.length - 1 };
        return this.compile(content, itemData);
      }).join('');
    });
  }

  processDefault(template, data) {
    const defaultRegex = /\{\{default\s+([^\s}]+)\s+['"]([^'"]+)['"]\}\}/g;
    return template.replace(defaultRegex, (match, valuePath, defaultValue) => {
      const value = this.getValue(data, valuePath.trim());
      return this.escapeHtml(value || defaultValue);
    });
  }

  processEq(template, data) {
    const eqRegex = /\{\{#eq\s+([^\s}]+)\s+['"]([^'"]+)['"]\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/eq\}\}/g;
    return template.replace(eqRegex, (match, valuePath, compareValue, ifContent, elseContent = '') => {
      const value = this.getValue(data, valuePath.trim());
      if (value === compareValue) {
        return this.compile(ifContent, data);
      }
      return this.compile(elseContent, data);
    });
  }

  processVariables(template, data) {
    const varRegex = /\{\{([^#\/!{][^}]*)\}\}/g;
    return template.replace(varRegex, (match, varPath) => {
      // Skip comments and helpers we already processed
      if (varPath.startsWith('!') || varPath.startsWith('default ') || varPath.startsWith('eq ')) {
        return match;
      }
      const value = this.getValue(data, varPath.trim());
      return this.escapeHtml(value !== undefined ? value : '');
    });
  }

  processUnescaped(template, data) {
    const unescapedRegex = /\{\{\{([^}]+)\}\}\}/g;
    return template.replace(unescapedRegex, (match, varPath) => {
      const value = this.getValue(data, varPath.trim());
      return value !== undefined ? value : '';
    });
  }

  getValue(data, path) {
    if (path === 'this') return data.this;
    if (path.startsWith('this.')) {
      path = path.substring(5);
      data = data.this || data;
    }

    const parts = path.split('.');
    let value = data;

    for (const part of parts) {
      if (value === null || value === undefined) return undefined;
      value = value[part];
    }

    return value;
  }

  escapeHtml(str) {
    if (typeof str !== 'string') return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

// Template discovery
function discoverTemplates() {
  const templates = [];

  if (!fs.existsSync(TEMPLATES_DIR)) {
    return templates;
  }

  const industries = fs.readdirSync(TEMPLATES_DIR)
    .filter(f => fs.statSync(path.join(TEMPLATES_DIR, f)).isDirectory());

  for (const industry of industries) {
    const sectionsDir = path.join(TEMPLATES_DIR, industry, 'sections');
    if (!fs.existsSync(sectionsDir)) continue;

    const sections = fs.readdirSync(sectionsDir)
      .filter(f => fs.statSync(path.join(sectionsDir, f)).isDirectory());

    for (const section of sections) {
      const sectionDir = path.join(sectionsDir, section);
      const hbsFiles = fs.readdirSync(sectionDir)
        .filter(f => f.endsWith('.hbs'));

      for (const hbsFile of hbsFiles) {
        const variant = hbsFile.replace('.hbs', '');
        const testFile = path.join(sectionDir, `${variant}.test.json`);
        const cssFile = path.join(sectionDir, `${variant}.css`);
        const rulesFile = path.join(sectionDir, `${variant}.rules.json`);

        templates.push({
          industry,
          section,
          variant,
          hbsPath: path.join(sectionDir, hbsFile),
          cssPath: fs.existsSync(cssFile) ? cssFile : null,
          rulesPath: fs.existsSync(rulesFile) ? rulesFile : null,
          testPath: fs.existsSync(testFile) ? testFile : null,
          testCases: fs.existsSync(testFile)
            ? Object.keys(JSON.parse(fs.readFileSync(testFile, 'utf-8')).test_cases || {})
            : ['default']
        });
      }
    }
  }

  return templates;
}

// Load design tokens
function loadTokens(industry) {
  const tokensPath = path.join(TEMPLATES_DIR, industry, 'tokens.json');
  if (fs.existsSync(tokensPath)) {
    return JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));
  }
  return {};
}

// Generate browser UI HTML
function generateBrowserUI(templates) {
  const grouped = {};
  templates.forEach(t => {
    if (!grouped[t.industry]) grouped[t.industry] = {};
    if (!grouped[t.industry][t.section]) grouped[t.industry][t.section] = [];
    grouped[t.industry][t.section].push(t);
  });

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WPF Template Browser</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      margin: 0;
      padding: 2rem;
      background: #f5f5f5;
      color: #333;
    }
    h1 {
      color: #0F2942;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: #666;
      margin-bottom: 2rem;
    }
    .industry-group {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .industry-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #0F2942;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #4DA6FF;
    }
    .section-group {
      margin-bottom: 1.5rem;
    }
    .section-title {
      font-size: 1rem;
      font-weight: 500;
      color: #555;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .template-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1rem;
    }
    .template-card {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
      border: 1px solid #e0e0e0;
      transition: all 0.2s ease;
    }
    .template-card:hover {
      border-color: #4DA6FF;
      box-shadow: 0 4px 12px rgba(77, 166, 255, 0.15);
    }
    .template-name {
      font-weight: 600;
      color: #0F2942;
      margin-bottom: 0.5rem;
    }
    .test-cases {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }
    .test-case-link {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      background: #0F2942;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-size: 0.85rem;
      transition: background 0.2s ease;
    }
    .test-case-link:hover {
      background: #4DA6FF;
    }
    .meta {
      font-size: 0.75rem;
      color: #888;
      margin-top: 0.5rem;
    }
    .badge {
      display: inline-block;
      padding: 0.2rem 0.5rem;
      background: #e8f4ff;
      color: #0F2942;
      border-radius: 3px;
      font-size: 0.7rem;
      margin-right: 0.25rem;
    }
    .empty-state {
      text-align: center;
      padding: 3rem;
      color: #666;
    }
    .refresh-btn {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      padding: 0.75rem 1.5rem;
      background: #0F2942;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .refresh-btn:hover {
      background: #4DA6FF;
    }
  </style>
</head>
<body>
  <h1>WPF Template Browser</h1>
  <p class="subtitle">Preview templates with test data scenarios</p>
`;

  if (Object.keys(grouped).length === 0) {
    html += `<div class="empty-state">
      <h2>No templates found</h2>
      <p>Create templates in modules/templates/industries/</p>
    </div>`;
  } else {
    for (const [industry, sections] of Object.entries(grouped)) {
      html += `<div class="industry-group">
        <div class="industry-title">${industry.charAt(0).toUpperCase() + industry.slice(1)}</div>`;

      for (const [section, templates] of Object.entries(sections)) {
        html += `<div class="section-group">
          <div class="section-title">${section}</div>
          <div class="template-cards">`;

        for (const t of templates) {
          html += `<div class="template-card">
            <div class="template-name">${t.variant}</div>
            <div class="meta">
              ${t.cssPath ? '<span class="badge">CSS</span>' : ''}
              ${t.rulesPath ? '<span class="badge">Rules</span>' : ''}
              ${t.testPath ? '<span class="badge">Test Data</span>' : ''}
            </div>
            <div class="test-cases">`;

          for (const testCase of t.testCases) {
            html += `<a class="test-case-link" href="/preview/${t.industry}/${t.section}/${t.variant}/${testCase}" target="_blank">${testCase}</a>`;
          }

          html += `</div></div>`;
        }

        html += `</div></div>`;
      }

      html += `</div>`;
    }
  }

  html += `
  <button class="refresh-btn" onclick="location.reload()">Refresh Templates</button>
</body>
</html>`;

  return html;
}

// Generate preview HTML
function generatePreview(template, testCase, tokens) {
  const compiler = new TemplateCompiler();

  // Load template
  const hbsContent = fs.readFileSync(template.hbsPath, 'utf-8');

  // Load CSS
  let cssContent = '';
  if (template.cssPath) {
    cssContent = fs.readFileSync(template.cssPath, 'utf-8');
  }

  // Load test data
  let testData = {};
  if (template.testPath) {
    const testFile = JSON.parse(fs.readFileSync(template.testPath, 'utf-8'));
    if (testFile.test_cases && testFile.test_cases[testCase]) {
      testData = testFile.test_cases[testCase].data || {};
    }
  }

  // Compile template
  const compiledSection = compiler.compile(hbsContent, testData);

  // Generate CSS variables from tokens
  let tokensCss = ':root {\n';
  if (tokens.colors) {
    for (const [key, value] of Object.entries(tokens.colors)) {
      if (typeof value === 'string') {
        tokensCss += `  --color-${key}: ${value};\n`;
      } else if (typeof value === 'object') {
        for (const [subKey, subValue] of Object.entries(value)) {
          tokensCss += `  --color-${key}-${subKey}: ${subValue};\n`;
        }
      }
    }
  }
  if (tokens.typography) {
    if (tokens.typography.fonts) {
      for (const [key, value] of Object.entries(tokens.typography.fonts)) {
        tokensCss += `  --font-${key}: ${value};\n`;
      }
    }
  }
  if (tokens.spacing) {
    for (const [key, value] of Object.entries(tokens.spacing)) {
      tokensCss += `  --spacing-${key}: ${value};\n`;
    }
  }
  if (tokens.borders?.radius) {
    for (const [key, value] of Object.entries(tokens.borders.radius)) {
      tokensCss += `  --radius-${key}: ${value};\n`;
    }
  }
  if (tokens.shadows) {
    for (const [key, value] of Object.entries(tokens.shadows)) {
      tokensCss += `  --shadow-${key}: ${value};\n`;
    }
  }
  tokensCss += '}\n';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${template.variant} - ${testCase} | WPF Preview</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* Reset */
    *, *::before, *::after { box-sizing: border-box; }
    * { margin: 0; }
    body { line-height: 1.5; -webkit-font-smoothing: antialiased; }
    img, picture, video, canvas, svg { display: block; max-width: 100%; }
    input, button, textarea, select { font: inherit; }
    p, h1, h2, h3, h4, h5, h6 { overflow-wrap: break-word; }

    /* Base */
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #1f2937;
      background: #ffffff;
    }

    /* Container */
    .container {
      width: 100%;
      max-width: var(--container-max, 1280px);
      margin: 0 auto;
      padding: 0 1rem;
    }

    /* Design Tokens */
    ${tokensCss}

    /* Template CSS */
    ${cssContent}

    /* Preview Controls */
    .preview-controls {
      position: fixed;
      top: 1rem;
      right: 1rem;
      z-index: 9999;
      display: flex;
      gap: 0.5rem;
      background: rgba(0,0,0,0.8);
      padding: 0.5rem;
      border-radius: 8px;
    }
    .preview-controls a, .preview-controls button {
      padding: 0.5rem 1rem;
      background: #4DA6FF;
      color: white;
      text-decoration: none;
      border: none;
      border-radius: 4px;
      font-size: 0.85rem;
      cursor: pointer;
    }
    .preview-controls a:hover, .preview-controls button:hover {
      background: #0F2942;
    }

    /* Debug Info */
    .preview-debug {
      position: fixed;
      bottom: 1rem;
      left: 1rem;
      z-index: 9999;
      background: rgba(0,0,0,0.9);
      color: white;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.75rem;
      font-family: monospace;
    }
    .preview-debug strong { color: #4DA6FF; }
  </style>
</head>
<body>
  <div class="preview-controls">
    <a href="/">← Browser</a>
    <button onclick="location.reload()">Refresh</button>
  </div>

  <main>
    ${compiledSection}
  </main>

  <div class="preview-debug">
    <strong>Template:</strong> ${template.industry}/${template.section}/${template.variant}<br>
    <strong>Test Case:</strong> ${testCase}<br>
    <strong>Viewport:</strong> <span id="viewport-size"></span>
  </div>

  <script>
    function updateViewport() {
      document.getElementById('viewport-size').textContent = window.innerWidth + 'x' + window.innerHeight;
    }
    updateViewport();
    window.addEventListener('resize', updateViewport);
  </script>
</body>
</html>`;
}

// HTTP Server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Discover templates on each request (for development)
  const templates = discoverTemplates();

  // Route: Browser UI
  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(generateBrowserUI(templates));
    return;
  }

  // Route: API - List templates
  if (pathname === '/api/templates') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(templates, null, 2));
    return;
  }

  // Route: Preview template
  const previewMatch = pathname.match(/^\/preview\/([^/]+)\/([^/]+)\/([^/]+)\/([^/]+)$/);
  if (previewMatch) {
    const [, industry, section, variant, testCase] = previewMatch;

    const template = templates.find(t =>
      t.industry === industry &&
      t.section === section &&
      t.variant === variant
    );

    if (!template) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end(`<h1>Template not found</h1><p>${industry}/${section}/${variant}</p><a href="/">Back to browser</a>`);
      return;
    }

    const tokens = loadTokens(industry);
    const html = generatePreview(template, testCase, tokens);

    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end('<h1>404 Not Found</h1><a href="/">Back to browser</a>');
});

// Start server
server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════╗
║     WPF Template Development Server           ║
╠═══════════════════════════════════════════════╣
║                                               ║
║  URL: http://localhost:${PORT}                   ║
║                                               ║
║  Templates: ${discoverTemplates().length} found                         ║
║  Watch Mode: ${WATCH_MODE ? 'ON' : 'OFF'}                            ║
║                                               ║
║  Press Ctrl+C to stop                         ║
║                                               ║
╚═══════════════════════════════════════════════╝
`);
});

// Watch mode (optional)
if (WATCH_MODE) {
  console.log('Watch mode enabled - templates will refresh on save');
  // Note: In a full implementation, we'd use chokidar for file watching
  // and implement WebSocket-based live reload
}
