---
description: Generate standalone HTML preview of WordPress patterns
tags: [preview, html, patterns, visualization]
---

# Generate HTML Preview

Create standalone HTML preview files for WordPress block patterns to visualize design before WordPress installation.

## Usage

When the user requests:
- "Generate HTML preview"
- "Show me what this pattern looks like"
- "Create preview file"
- "Visualize this pattern"

## Process

### 1. Identify Pattern Source

Ask the user what to preview:
- [ ] Single pattern from library
- [ ] Multiple patterns combined (full page)
- [ ] Generated pattern (not yet saved)
- [ ] Complete site blueprint

**Example:**
```
User: "Generate preview for hero-fullwidth pattern"
You: "I'll create an HTML preview for the hero-fullwidth pattern."
```

### 2. Load Pattern Data

For saved patterns:
```javascript
import { PatternLoader } from './lib/phase2/pattern-loader.js';

const loader = new PatternLoader();
const pattern = loader.loadPattern('shared', 'hero', 'hero-fullwidth');

// Pattern contains:
// - manifest.json (configuration)
// - template.php (WordPress HTML)
// - tailwind classes
```

For generated patterns:
```javascript
// Use pattern data from memory
const patternHtml = generatedPattern.html;
const patternConfig = generatedPattern.manifest;
```

### 3. Create HTML Document Structure

Generate complete HTML document:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pattern Preview: {{PATTERN_NAME}}</title>

  <!-- Tailwind CSS CDN for quick preview -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Custom Theme Configuration -->
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            primary: {{PRIMARY_COLORS}},
            secondary: {{SECONDARY_COLORS}}
          },
          fontFamily: {
            heading: [{{HEADING_FONT}}, 'sans-serif'],
            body: [{{BODY_FONT}}, 'sans-serif']
          }
        }
      }
    }
  </script>

  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family={{FONTS}}&display=swap" rel="stylesheet">

  <!-- Custom Styles -->
  <style>
    body {
      font-family: {{BODY_FONT}}, sans-serif;
    }
    h1, h2, h3, h4, h5, h6 {
      font-family: {{HEADING_FONT}}, sans-serif;
    }
  </style>
</head>
<body class="antialiased">
  <!-- Pattern Preview Controls -->
  <div class="fixed top-0 left-0 right-0 bg-gray-900 text-white px-4 py-2 z-50 flex items-center justify-between">
    <div>
      <span class="font-bold">Preview Mode:</span>
      <span class="ml-2">{{PATTERN_NAME}}</span>
    </div>
    <div class="flex gap-2">
      <button onclick="setViewport('mobile')" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded">Mobile</button>
      <button onclick="setViewport('tablet')" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded">Tablet</button>
      <button onclick="setViewport('desktop')" class="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded">Desktop</button>
    </div>
  </div>

  <!-- Preview Container -->
  <div id="preview-container" class="mt-12">
    {{PATTERN_HTML}}
  </div>

  <!-- Preview JavaScript -->
  <script>
    function setViewport(size) {
      const container = document.getElementById('preview-container');
      const sizes = {
        mobile: 'max-w-sm mx-auto',
        tablet: 'max-w-3xl mx-auto',
        desktop: 'max-w-full'
      };
      container.className = 'mt-12 transition-all duration-300 ' + sizes[size];
    }

    // Initialize as desktop
    setViewport('desktop');
  </script>
</body>
</html>
```

### 4. Replace Placeholders

Replace pattern placeholders with actual content:

```javascript
// Design tokens
html = html.replace(/\{\{PRIMARY_COLORS\}\}/g, JSON.stringify(tokens.colors.primary));
html = html.replace(/\{\{SECONDARY_COLORS\}\}/g, JSON.stringify(tokens.colors.secondary));
html = html.replace(/\{\{HEADING_FONT\}\}/g, tokens.typography.heading.fontFamily);
html = html.replace(/\{\{BODY_FONT\}\}/g, tokens.typography.body.fontFamily);

// Content
html = html.replace(/\{\{COMPANY_NAME\}\}/g, blueprint.company.name);
html = html.replace(/\{\{TAGLINE\}\}/g, blueprint.company.tagline);

// Pattern HTML
html = html.replace(/\{\{PATTERN_HTML\}\}/g, pattern.html);
```

### 5. Write Preview File

Save to output directory:

```javascript
import fs from 'fs';
import path from 'path';

const outputDir = 'output/previews';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const filename = `${pattern.id}-preview.html`;
const filepath = path.join(outputDir, filename);

fs.writeFileSync(filepath, html);

console.log(`Preview created: ${filepath}`);
```

### 6. Open in Browser (Optional)

Automatically open preview:

```javascript
import { exec } from 'child_process';

// macOS
exec(`open ${filepath}`);

// Linux
exec(`xdg-open ${filepath}`);

// Windows
exec(`start ${filepath}`);
```

## Preview Types

### Single Pattern Preview

**Input:** Pattern ID
**Output:** Single HTML file with pattern

```javascript
generatePreview('hero-fullwidth', {
  industry: 'construction',
  company: 'ACME Construction',
  colors: { primary: '#ff6b35', secondary: '#2a2a2a' }
});
```

### Full Page Preview

**Input:** Array of pattern IDs
**Output:** Complete page with multiple patterns

```javascript
generateFullPagePreview([
  'header-centered',
  'hero-fullwidth',
  'services-grid',
  'testimonials-carousel',
  'cta-banner',
  'footer-columns'
], blueprintData);
```

### Multi-Variant Preview

**Input:** Pattern category
**Output:** Side-by-side comparison of all variants

```html
<!-- Show all hero variants in grid -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <div>
    <h3>Hero Fullwidth</h3>
    {{HERO_FULLWIDTH}}
  </div>
  <div>
    <h3>Hero Split</h3>
    {{HERO_SPLIT}}
  </div>
</div>
```

## Advanced Features

### Live Font Switcher

Add controls to test different font combinations:

```html
<div class="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4">
  <label class="block mb-2">
    <span class="text-sm font-semibold">Heading Font:</span>
    <select id="heading-font" onchange="updateHeadingFont(this.value)" class="w-full px-3 py-2 border rounded">
      <option value="DM Sans">DM Sans</option>
      <option value="Playfair Display">Playfair Display</option>
      <option value="Bricolage Grotesque">Bricolage Grotesque</option>
    </select>
  </label>
  <label class="block">
    <span class="text-sm font-semibold">Body Font:</span>
    <select id="body-font" onchange="updateBodyFont(this.value)" class="w-full px-3 py-2 border rounded">
      <option value="Source Sans 3">Source Sans 3</option>
      <option value="Lato">Lato</option>
      <option value="IBM Plex Sans">IBM Plex Sans</option>
    </select>
  </label>
</div>

<script>
  function updateHeadingFont(font) {
    document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(el => {
      el.style.fontFamily = font + ', sans-serif';
    });
  }

  function updateBodyFont(font) {
    document.body.style.fontFamily = font + ', sans-serif';
  }
</script>
```

### Color Theme Switcher

Test different color schemes:

```javascript
const themes = {
  construction: {
    primary: { 600: '#ff6b35', 700: '#e85a24' },
    secondary: { 600: '#2a2a2a', 700: '#1a1a1a' }
  },
  healthcare: {
    primary: { 600: '#0284c7', 700: '#0369a1' },
    secondary: { 600: '#16a34a', 700: '#15803d' }
  }
};

function switchTheme(themeName) {
  const theme = themes[themeName];
  document.documentElement.style.setProperty('--primary-600', theme.primary[600]);
  document.documentElement.style.setProperty('--primary-700', theme.primary[700]);
  // ... update all color variables
}
```

### Responsive Preview Toggle

Show mobile/tablet/desktop views:

```html
<div class="preview-controls">
  <button onclick="setBreakpoint('mobile')" class="px-4 py-2 bg-blue-500 text-white rounded">
    📱 Mobile (375px)
  </button>
  <button onclick="setBreakpoint('tablet')" class="px-4 py-2 bg-blue-500 text-white rounded">
    📱 Tablet (768px)
  </button>
  <button onclick="setBreakpoint('desktop')" class="px-4 py-2 bg-blue-500 text-white rounded">
    💻 Desktop (1280px)
  </button>
</div>

<script>
  function setBreakpoint(size) {
    const container = document.getElementById('preview-container');
    const widths = {
      mobile: '375px',
      tablet: '768px',
      desktop: '100%'
    };
    container.style.maxWidth = widths[size];
    container.style.margin = '0 auto';
  }
</script>
```

## Example Command Flow

**User:** "Generate preview for construction hero pattern"

**Assistant:**
1. Loads `templates/construction/patterns/hero/hero-fullwidth/`
2. Reads manifest.json for configuration
3. Loads design tokens (DM Sans, construction colors)
4. Generates HTML with Tailwind CDN
5. Saves to `output/previews/hero-fullwidth-construction-preview.html`
6. Opens in default browser

**Result:**
```
✅ Preview generated: output/previews/hero-fullwidth-construction-preview.html
📂 File size: 12KB
🌐 Opening in browser...
```

## File Naming Convention

```
{pattern-id}-{industry}-preview.html
```

Examples:
- `hero-fullwidth-construction-preview.html`
- `services-grid-healthcare-preview.html`
- `footer-columns-shared-preview.html`

## Output Directory Structure

```
output/
└── previews/
    ├── hero-fullwidth-construction-preview.html
    ├── hero-split-healthcare-preview.html
    ├── services-grid-shared-preview.html
    ├── full-page-acme-construction.html
    └── variant-comparison-hero.html
```

## Integration with Other Commands

### After Pattern Generation

```bash
/generate-pattern
# Creates new pattern
↓
/wpf-preview-generate
# Automatically generates preview
```

### Before Theme Export

```bash
/wpf-preview-generate
# Preview all patterns
↓
User reviews and approves
↓
/export-theme
# Generate WordPress theme
```

## Quality Checklist

Before delivering preview:

- [ ] All placeholders replaced
- [ ] Fonts loading correctly (Google Fonts CDN)
- [ ] Colors match design tokens
- [ ] Responsive breakpoints working
- [ ] No console errors
- [ ] Preview controls functional
- [ ] File saved to output/previews/
- [ ] File size reasonable (<50KB)

## Common Issues

**Issue:** Fonts not loading
**Fix:** Check Google Fonts URL format, ensure font names are URL-encoded

**Issue:** Tailwind classes not working
**Fix:** Verify Tailwind CDN script tag is present and loading

**Issue:** Colors not applied
**Fix:** Check that color tokens are properly injected into tailwind.config

**Issue:** Preview not responsive
**Fix:** Ensure viewport meta tag is present, test breakpoint JavaScript

## Resources

- Tailwind CDN: https://tailwindcss.com/docs/installation/play-cdn
- Google Fonts: https://fonts.google.com
- Pattern Library: `templates/shared/patterns/`
- Design Tokens: `tokens/variants.json`

---

**Version:** 1.0.0
**Last Updated:** 2025-12-09
