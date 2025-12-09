---
name: wpf-design
description: Design token generation for WordPress themes - colors, typography, spacing
triggers:
  - design tokens
  - brand colors
  - typography
  - color palette
  - theme.json
  - tailwind config
  - css variables
---

# WPF Design Token Generation

## Purpose
Generate consistent design tokens from blueprint data for WordPress theme output formats.

## Output Formats

### 1. WordPress theme.json
Standard WordPress block editor configuration with color palettes, font sizes, and spacing.

### 2. Tailwind CSS Config
`tailwind.config.js` with extended theme values for utility class generation.

### 3. CSS Variables
`:root` variables for runtime theming and fallback support.

## Blueprint Color Extraction

Colors come from `blueprint.brand_profile.colors`:

```javascript
{
  brand_profile: {
    colors: {
      primary: '#16a34a',      // Main brand color
      secondary: '#0f766e',    // Supporting color
      accent: '#f59e0b',       // Call-to-action highlights
      background: '#ffffff',   // Page background
      text: '#1f2937'          // Body text
    }
  }
}
```

## Color Derivation Rules

When only primary color is provided, derive others:
- **Secondary**: Analogous hue (±30°) or complementary
- **Accent**: Warm contrast for CTAs
- **Background**: White or very light neutral
- **Text**: Dark gray (#1f2937) for readability

## Typography Scale

Default scale (can be overridden in blueprint):

| Name | Size | Line Height | Use |
|------|------|-------------|-----|
| xs | 0.75rem | 1rem | Captions |
| sm | 0.875rem | 1.25rem | Small text |
| base | 1rem | 1.5rem | Body |
| lg | 1.125rem | 1.75rem | Lead text |
| xl | 1.25rem | 1.75rem | H4 |
| 2xl | 1.5rem | 2rem | H3 |
| 3xl | 1.875rem | 2.25rem | H2 |
| 4xl | 2.25rem | 2.5rem | H1 |

## Source File

Implementation: `modules/orchestrator/src/lib/phase2/design-tokens.js`

Key functions:
- `extractTokensFromBlueprint(blueprint)` - Parse blueprint colors/typography
- `generateThemeJson(tokens)` - WordPress theme.json output
- `generateTailwindConfig(tokens)` - Tailwind config string
- `generateCssVariables(tokens)` - CSS custom properties

## Usage Pattern

```javascript
import { extractTokensFromBlueprint, generateThemeJson } from './design-tokens.js';

const tokens = extractTokensFromBlueprint(blueprint);
const themeJson = generateThemeJson(tokens);
```

## CSS Variable Naming Convention

```css
:root {
  /* Colors */
  --color-primary: #16a34a;
  --color-secondary: #0f766e;
  --color-accent: #f59e0b;

  /* Typography */
  --font-heading: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;

  /* Spacing */
  --spacing-section: 4rem;
  --spacing-element: 1.5rem;
}
```

## Related Skills
- @wpf-patterns.md - Pattern selection uses design tokens
- @wpf-content.md - Content injection with token context
