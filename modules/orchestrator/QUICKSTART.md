# Phase 2 Orchestrator - Quick Start Guide

**Version:** 2.0.0
**Date:** 2025-12-09
**Status:** ✅ Production Ready

---

## What's New in Phase 2

Phase 2 brings comprehensive improvements based on deep research into Claude Code, MCP, and web design best practices:

### 🎯 Key Features

1. **Claude Code Integration**
   - SKILL.md files for automated design guidance
   - Slash commands for common workflows
   - Progressive disclosure (loads only what's needed)

2. **MCP Servers**
   - shadcn/ui component registry
   - CSS documentation and analysis
   - Stock photo APIs (Unsplash + Pexels)

3. **Complete Pattern Library**
   - 18 patterns across 9 categories
   - Headers, footers, CTAs, features, FAQ, team, gallery
   - All mobile-responsive, WCAG AA compliant

4. **WordPress Theme Export**
   - Production-ready .zip files
   - Customizer integration (colors, social, contact)
   - Widget areas and helper functions

---

## Installation

### 1. Install MCP Dependencies

```bash
cd /home/atric/wp-site-factory/modules/orchestrator/mcp-servers
npm install
```

**✅ DONE** - Already installed with security fixes

### 2. Configure API Keys (Optional)

Edit `.env` file:

```bash
# Stock Photos APIs (optional - for image search)
UNSPLASH_API_KEY=your_unsplash_key_here
PEXELS_API_KEY=your_pexels_key_here
```

**To get API keys:**
- Unsplash: https://unsplash.com/developers (50 requests/hour free)
- Pexels: https://www.pexels.com/api/ (200 requests/hour free)

### 3. Verify Installation

Test that patterns load correctly:

```bash
cd /home/atric/wp-site-factory/modules/orchestrator

# Test pattern loader
node -e "
import { listPatterns } from './src/lib/phase2/pattern-loader.js';
const patterns = await listPatterns('construction', 'industrial-modern', 'hero');
console.log('✅ Patterns loaded:', patterns.length);
"
```

Expected output: `✅ Patterns loaded: 4`

---

## Usage

### Using Skills (Automatic)

Claude Code automatically loads skills when relevant. You don't need to do anything!

**Available Skills:**
- `wpf-design-system` - Pattern selection, anti-patterns, design tokens
- `wpf-frontend` - Tailwind CSS, shadcn/ui, WordPress patterns

**How it works:**
1. You ask a question about WordPress design
2. Claude Code sees the `.claude/skills/` directory
3. Skills auto-load with ~100 token metadata
4. Full content loads only if needed (<5KB)

### Using Slash Commands

Quick access to common workflows:

```bash
# Validate design against anti-patterns
/validate-design

# Generate new block pattern
/generate-pattern

# Export WordPress theme
/export-theme

# Generate HTML preview
/wpf-preview-generate
```

### Using MCP Servers

MCP servers provide tools that Claude Code can use:

**shadcn/ui MCP:**
- "Show me all shadcn/ui button variants"
- "Add a card component to my project"
- "Search shadcn/ui for form components"

**CSS MCP:**
- "Analyze this CSS for performance issues"
- "Show me CSS grid examples from MDN"
- "What's the browser support for container queries?"

**Stock Photos MCP:**
- "Search for construction photos"
- "Download hero image for healthcare website"
- "Get attribution for photo ID xyz"

### Pattern Library

**Available Categories:**
- `hero` - 4 variants (fullwidth, split, centered, fullscreen)
- `services` - 2 variants (grid, cards)
- `about` - 1 variant (timeline)
- `header` - 4 variants (centered, split, mega, simple)
- `footer` - 3 variants (columns, centered, simple)
- `cta` - 2 variants (banner, box)
- `features` - 2 variants (grid, alternating)
- `faq` - 1 variant (accordion)
- `team` - 1 variant (grid)
- `gallery` - 1 variant (masonry)

**List patterns programmatically:**

```javascript
import { listPatterns, listSharedPatterns } from './src/lib/phase2/pattern-loader.js';

// List all hero patterns for construction industry
const heroPatterns = await listPatterns('construction', 'industrial-modern', 'hero');

// List all shared header patterns
const headerPatterns = await listSharedPatterns('header');
```

### Theme Export

**Export complete WordPress theme:**

```javascript
import { exportWordPressTheme } from './src/lib/phase2/index.js';

const result = await exportWordPressTheme(
  blueprint,          // Blueprint object
  assembledTheme,     // Assembled theme data
  '/output/my-theme', // Output directory
  {
    includeManifests: true,
    includeReport: true,
    createZip: true,  // ✨ NEW - Creates .zip archive
  }
);

console.log('Theme exported:', result.themePath);
console.log('ZIP created:', result.zipPath); // ✨ NEW
```

**Standalone ZIP creation:**

```javascript
import { createWordPressThemeZip } from './src/lib/phase2/index.js';

const zipPath = await createWordPressThemeZip(
  '/path/to/theme',
  'my-theme-slug'
);
```

---

## Common Workflows

### 1. Create Website from Scratch

```bash
# 1. Generate blueprint
node src/cli/blueprint.js

# 2. Assemble theme (AUTOMATIC: downloads stock photos, generates patterns)
# Stock photos are downloaded automatically based on industry + patterns
# Check: output/my-theme/

# 3. Export with ZIP
# Uses: exportWordPressTheme({ createZip: true })

# 4. Upload to WordPress
# Upload: output/my-theme/my-theme.zip via WordPress admin
```

**What happens automatically:**
- ✅ Stock photos downloaded for hero, about, services, team, gallery
- ✅ Images cached locally with attribution
- ✅ Images assigned to pattern content
- ✅ No manual photo search required

### 2. Add New Pattern

```bash
# Use slash command
/generate-pattern

# Or manually create:
# - templates/shared/patterns/{category}/{pattern-id}/manifest.json
# - templates/shared/patterns/{category}/{pattern-id}/template.php
```

### 3. Validate Design

```bash
# Use slash command
/validate-design

# Checks:
# - Banned fonts (Inter, Roboto, Arial, Helvetica, etc.)
# - Color contrast (WCAG AA)
# - Layout patterns (generic vs distinctive)
```

### 4. Stock Photos (Automatic)

**Stock photos are generated automatically** during blueprint/theme assembly. No manual steps required!

**How it works:**
- Industry-specific keyword mapping (construction, healthcare, restaurant, etc.)
- Pattern-specific searches (hero, about, services, team, etc.)
- Combines keywords: e.g., "construction site hero image"
- Downloads and caches images automatically
- Adds images to pattern content with attribution

**Example:**
```javascript
import { assembleTheme } from './src/lib/phase2/index.js';

const result = await assembleTheme(blueprint, {
  generateImages: true  // Default: true (automatic)
});

// Access generated images
console.log(result.images);
// {
//   hero: [{ id: 'unsplash-xyz', downloads: {...}, attribution: {...} }],
//   about: [...],
//   services: [...]
// }
```

**Manual search (optional):**
```javascript
import { StockPhotoService } from './mcp-servers/stock-photos.js';

const service = new StockPhotoService(
  process.env.UNSPLASH_API_KEY,
  process.env.PEXELS_API_KEY
);

// Search by industry
const photos = await service.searchByIndustry('construction', 10);

// Download photo
const result = await service.downloadPhoto(photos[0], 'large');
console.log('Downloaded:', result.path);
console.log('Attribution:', result.attribution);
```

---

## Troubleshooting

### MCP Server Not Working

**Problem:** Stock photos MCP server not responding

**Solution:**
1. Check API keys in `.env`
2. Verify module loads: `node mcp-servers/stock-photos.js`
3. Check cache directory exists: `output/stock-photos-cache/`

### Pattern Not Found

**Problem:** Pattern listed but won't load

**Solution:**
1. Check manifest.json is valid JSON
2. Verify template.php exists
3. Run validation: `node src/cli/validate-patterns.js`

### Theme Export Fails

**Problem:** ZIP creation fails

**Solution:**
1. Check output directory exists
2. Verify write permissions
3. Check disk space
4. Review error in console

### Skills Not Loading

**Problem:** Claude Code doesn't use skills

**Solution:**
1. Verify `.claude/skills/` directory exists
2. Check YAML frontmatter is valid
3. Ensure description field is clear and concise
4. Skills load automatically - no action needed

---

## File Structure

```
modules/orchestrator/
├── .claude/
│   ├── skills/
│   │   ├── wpf-design-system/SKILL.md    # Design system guidance
│   │   └── wpf-frontend/SKILL.md         # Frontend best practices
│   └── commands/
│       ├── validate-design.md            # Anti-pattern validation
│       ├── generate-pattern.md           # Pattern generation
│       ├── export-theme.md               # Theme export
│       └── wpf-preview-generate.md       # HTML preview
├── .mcp.json                             # MCP server configuration
├── mcp-servers/
│   ├── stock-photos.js                   # Custom MCP server
│   └── package.json                      # MCP dependencies
├── src/lib/phase2/
│   ├── pattern-loader.js                 # Pattern loading
│   ├── anti-pattern-validator.js         # Design validation
│   ├── design-tokens.js                  # Token generation
│   └── theme-exporter.js                 # Theme export + ZIP
├── templates/
│   ├── shared/patterns/                  # Cross-industry patterns
│   │   ├── header/                       # 4 variants
│   │   ├── footer/                       # 3 variants
│   │   ├── cta/                          # 2 variants
│   │   ├── features/                     # 2 variants
│   │   ├── faq/                          # 1 variant
│   │   ├── team/                         # 1 variant
│   │   └── gallery/                      # 1 variant
│   └── theme/
│       ├── functions.php.template        # Enhanced with customizer
│       ├── style.css.template            # WP theme headers
│       └── inc/block-patterns.php.template
└── tokens/
    ├── variants.json                     # Component variants
    └── anti-patterns.json                # Banned patterns
```

---

## Performance Tips

### Optimize Pattern Loading

Patterns load on-demand. To preload commonly used patterns:

```javascript
import { preloadPatterns } from './src/lib/phase2/pattern-loader.js';

// Preload all hero patterns
await preloadPatterns('hero');
```

### Cache Stock Photos

Downloaded photos are automatically cached in `output/stock-photos-cache/`:

```javascript
// Clear cache if needed
await service.clearCache();
```

### Theme Export Speed

ZIP creation is fast (<5 seconds typically). To optimize:

1. Use `createZip: true` only when needed
2. Exclude unnecessary files in `.zipignore`
3. Keep theme directory clean

---

## Best Practices

### 1. Pattern Selection

✅ **DO:**
- Use industry-specific patterns when available
- Fall back to shared patterns for common elements
- Customize patterns via manifest.json configuration

❌ **DON'T:**
- Modify shared pattern files directly
- Create duplicate patterns with slight variations
- Ignore anti-pattern validation warnings

### 2. Design Validation

✅ **DO:**
- Run `/validate-design` before exporting themes
- Fix banned font warnings immediately
- Ensure WCAG AA contrast ratios

❌ **DON'T:**
- Ignore anti-pattern warnings
- Use banned fonts (Inter, Roboto, Arial, Helvetica, etc.)
- Skip accessibility checks

### 3. MCP Usage

✅ **DO:**
- Configure API keys for full functionality
- Use industry-specific search terms
- Cache frequently used images

❌ **DON'T:**
- Exceed API rate limits (50/hr Unsplash, 200/hr Pexels)
- Download high-resolution images unnecessarily
- Skip attribution requirements

---

## Next Steps

1. **Test the full workflow:**
   - Create a test blueprint
   - Generate patterns
   - Export theme
   - Upload to WordPress

2. **Explore the Skills:**
   - Ask Claude Code about design patterns
   - Try slash commands
   - Test MCP tools

3. **Customize patterns:**
   - Review existing patterns in `templates/shared/patterns/`
   - Create industry-specific variants
   - Add new pattern categories

4. **Read the documentation:**
   - `PHASE2-IMPLEMENTATION-COMPLETE.md` - Full implementation details
   - `specs/phase2-complete-implementation.md` - Complete specification
   - `SKILLS-MCP-SUMMARY.md` - Skills and MCP guide
   - `docs/phase2-theme-export.md` - Theme export guide

---

## Support

**Documentation:**
- Complete spec: `specs/phase2-complete-implementation.md`
- Implementation summary: `PHASE2-IMPLEMENTATION-COMPLETE.md`
- Skills guide: `SKILLS-MCP-SUMMARY.md`
- Theme export: `docs/phase2-theme-export.md`

**Issues:**
- Check git log for recent changes
- Review integration test results
- Consult pattern documentation

**Contributing:**
- Follow WordPress Coding Standards
- Add tests for new patterns
- Update documentation

---

**Happy building with WPF Phase 2! 🚀**
