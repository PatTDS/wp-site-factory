/**
 * Design Token Generator
 * Generates theme.json (WordPress) and tailwind.config.js from blueprint colors/typography
 */

import { z } from 'zod';

// Schema for color configuration
const ColorSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string().optional(),
  background: z.string().optional().default('#FFFFFF'),
  text: z.string().optional().default('#1F2937'),
  muted: z.string().optional(),
  border: z.string().optional(),
});

// Schema for typography configuration
const TypographySchema = z.object({
  headings: z.string().default('Inter'),
  body: z.string().default('Inter'),
  headingsWeight: z.string().optional().default('700'),
  bodyWeight: z.string().optional().default('400'),
});

// Schema for design token input
const DesignTokenInputSchema = z.object({
  colors: ColorSchema,
  typography: TypographySchema.optional(),
  borderRadius: z.string().optional().default('0.5rem'),
  spacing: z.object({
    unit: z.number().optional().default(4),
    scale: z.array(z.number()).optional(),
  }).optional(),
});

/**
 * Generate color variants (lighter/darker shades)
 */
function generateColorVariants(hex, name) {
  const variants = {};

  // Parse hex to RGB
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Generate variants
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  shades.forEach(shade => {
    const factor = (shade - 500) / 500;
    let newR, newG, newB;

    if (factor < 0) {
      // Lighter (mix with white)
      const lightFactor = 1 + factor;
      newR = Math.round(r + (255 - r) * (1 - lightFactor));
      newG = Math.round(g + (255 - g) * (1 - lightFactor));
      newB = Math.round(b + (255 - b) * (1 - lightFactor));
    } else {
      // Darker (mix with black)
      const darkFactor = 1 - factor;
      newR = Math.round(r * darkFactor);
      newG = Math.round(g * darkFactor);
      newB = Math.round(b * darkFactor);
    }

    variants[shade] = `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  });

  // Add DEFAULT for base color
  variants.DEFAULT = hex;

  return variants;
}

/**
 * Generate WordPress theme.json
 */
export function generateThemeJson(input, presetName = 'custom') {
  const validation = DesignTokenInputSchema.safeParse(input);
  if (!validation.success) {
    throw new Error(`Invalid design token input: ${validation.error.message}`);
  }

  const { colors, typography, borderRadius } = validation.data;

  const themeJson = {
    "$schema": "https://schemas.wp.org/trunk/theme.json",
    "version": 3,
    "settings": {
      "appearanceTools": true,
      "color": {
        "custom": true,
        "customDuotone": true,
        "customGradient": true,
        "defaultDuotone": false,
        "defaultGradients": false,
        "defaultPalette": false,
        "palette": [
          {
            "slug": "primary",
            "color": colors.primary,
            "name": "Primary"
          },
          {
            "slug": "secondary",
            "color": colors.secondary,
            "name": "Secondary"
          },
          {
            "slug": "accent",
            "color": colors.accent || colors.secondary,
            "name": "Accent"
          },
          {
            "slug": "background",
            "color": colors.background,
            "name": "Background"
          },
          {
            "slug": "foreground",
            "color": colors.text,
            "name": "Foreground"
          },
          {
            "slug": "muted",
            "color": colors.muted || "#6B7280",
            "name": "Muted"
          },
          {
            "slug": "border",
            "color": colors.border || "#E5E7EB",
            "name": "Border"
          },
          {
            "slug": "white",
            "color": "#FFFFFF",
            "name": "White"
          },
          {
            "slug": "black",
            "color": "#000000",
            "name": "Black"
          }
        ]
      },
      "typography": {
        "customFontSize": true,
        "dropCap": false,
        "fluid": true,
        "fontFamilies": [
          {
            "fontFamily": `"${typography?.headings || 'Inter'}", ui-sans-serif, system-ui, sans-serif`,
            "name": "Headings",
            "slug": "headings"
          },
          {
            "fontFamily": `"${typography?.body || 'Inter'}", ui-sans-serif, system-ui, sans-serif`,
            "name": "Body",
            "slug": "body"
          }
        ],
        "fontSizes": [
          { "slug": "xs", "size": "0.75rem", "name": "Extra Small" },
          { "slug": "sm", "size": "0.875rem", "name": "Small" },
          { "slug": "base", "size": "1rem", "name": "Base" },
          { "slug": "lg", "size": "1.125rem", "name": "Large" },
          { "slug": "xl", "size": "1.25rem", "name": "Extra Large" },
          { "slug": "2xl", "size": "1.5rem", "name": "2X Large" },
          { "slug": "3xl", "size": "1.875rem", "name": "3X Large" },
          { "slug": "4xl", "size": "2.25rem", "name": "4X Large" },
          { "slug": "5xl", "size": "3rem", "name": "5X Large" },
          { "slug": "6xl", "size": "3.75rem", "name": "6X Large" }
        ]
      },
      "spacing": {
        "customSpacingSize": true,
        "spacingScale": {
          "steps": 10
        },
        "units": ["px", "em", "rem", "%", "vw", "vh"]
      },
      "layout": {
        "contentSize": "1200px",
        "wideSize": "1400px"
      },
      "border": {
        "color": true,
        "radius": true,
        "style": true,
        "width": true
      }
    },
    "styles": {
      "color": {
        "background": "var(--wp--preset--color--background)",
        "text": "var(--wp--preset--color--foreground)"
      },
      "typography": {
        "fontFamily": "var(--wp--preset--font-family--body)",
        "fontSize": "var(--wp--preset--font-size--base)",
        "lineHeight": "1.6"
      },
      "elements": {
        "h1": {
          "typography": {
            "fontFamily": "var(--wp--preset--font-family--headings)",
            "fontSize": "var(--wp--preset--font-size--5xl)",
            "fontWeight": typography?.headingsWeight || "700",
            "lineHeight": "1.2"
          },
          "color": {
            "text": "var(--wp--preset--color--primary)"
          }
        },
        "h2": {
          "typography": {
            "fontFamily": "var(--wp--preset--font-family--headings)",
            "fontSize": "var(--wp--preset--font-size--4xl)",
            "fontWeight": typography?.headingsWeight || "700",
            "lineHeight": "1.25"
          },
          "color": {
            "text": "var(--wp--preset--color--primary)"
          }
        },
        "h3": {
          "typography": {
            "fontFamily": "var(--wp--preset--font-family--headings)",
            "fontSize": "var(--wp--preset--font-size--3xl)",
            "fontWeight": typography?.headingsWeight || "700",
            "lineHeight": "1.3"
          },
          "color": {
            "text": "var(--wp--preset--color--primary)"
          }
        },
        "h4": {
          "typography": {
            "fontFamily": "var(--wp--preset--font-family--headings)",
            "fontSize": "var(--wp--preset--font-size--2xl)",
            "fontWeight": "600",
            "lineHeight": "1.35"
          }
        },
        "h5": {
          "typography": {
            "fontFamily": "var(--wp--preset--font-family--headings)",
            "fontSize": "var(--wp--preset--font-size--xl)",
            "fontWeight": "600",
            "lineHeight": "1.4"
          }
        },
        "h6": {
          "typography": {
            "fontFamily": "var(--wp--preset--font-family--headings)",
            "fontSize": "var(--wp--preset--font-size--lg)",
            "fontWeight": "600",
            "lineHeight": "1.4"
          }
        },
        "link": {
          "color": {
            "text": "var(--wp--preset--color--secondary)"
          },
          ":hover": {
            "color": {
              "text": "var(--wp--preset--color--primary)"
            }
          }
        },
        "button": {
          "color": {
            "background": "var(--wp--preset--color--primary)",
            "text": "var(--wp--preset--color--white)"
          },
          "typography": {
            "fontWeight": "600"
          },
          "border": {
            "radius": borderRadius
          }
        }
      }
    },
    "customTemplates": [],
    "templateParts": []
  };

  return themeJson;
}

/**
 * Generate Tailwind CSS config
 */
export function generateTailwindConfig(input, presetName = 'custom') {
  const validation = DesignTokenInputSchema.safeParse(input);
  if (!validation.success) {
    throw new Error(`Invalid design token input: ${validation.error.message}`);
  }

  const { colors, typography, borderRadius } = validation.data;

  // Generate color variants
  const primaryVariants = generateColorVariants(colors.primary, 'primary');
  const secondaryVariants = generateColorVariants(colors.secondary, 'secondary');
  const accentVariants = colors.accent ? generateColorVariants(colors.accent, 'accent') : secondaryVariants;

  const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './**/*.php',
    './src/**/*.{js,jsx,ts,tsx}',
    './templates/**/*.php',
    './patterns/**/*.php',
  ],
  theme: {
    extend: {
      colors: {
        primary: ${JSON.stringify(primaryVariants, null, 8).replace(/"/g, "'")},
        secondary: ${JSON.stringify(secondaryVariants, null, 8).replace(/"/g, "'")},
        accent: ${JSON.stringify(accentVariants, null, 8).replace(/"/g, "'")},
        background: '${colors.background}',
        foreground: '${colors.text}',
        muted: {
          DEFAULT: '${colors.muted || '#6B7280'}',
          foreground: '${colors.muted || '#6B7280'}',
        },
        border: '${colors.border || '#E5E7EB'}',
      },
      fontFamily: {
        headings: ['${typography?.headings || 'Inter'}', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['${typography?.body || 'Inter'}', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['${typography?.body || 'Inter'}', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '${borderRadius}',
        lg: 'calc(${borderRadius} + 0.25rem)',
        xl: 'calc(${borderRadius} + 0.5rem)',
        '2xl': 'calc(${borderRadius} + 1rem)',
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1200px',
          '2xl': '1400px',
        },
      },
    },
  },
  plugins: [],
};
`;

  return tailwindConfig;
}

/**
 * Generate CSS variables for inline use
 */
export function generateCssVariables(input) {
  const validation = DesignTokenInputSchema.safeParse(input);
  if (!validation.success) {
    throw new Error(`Invalid design token input: ${validation.error.message}`);
  }

  const { colors, typography, borderRadius } = validation.data;

  const cssVariables = `:root {
  /* Colors */
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent || colors.secondary};
  --color-background: ${colors.background};
  --color-foreground: ${colors.text};
  --color-muted: ${colors.muted || '#6B7280'};
  --color-border: ${colors.border || '#E5E7EB'};

  /* Typography */
  --font-headings: '${typography?.headings || 'Inter'}', ui-sans-serif, system-ui, sans-serif;
  --font-body: '${typography?.body || 'Inter'}', ui-sans-serif, system-ui, sans-serif;
  --font-weight-headings: ${typography?.headingsWeight || '700'};
  --font-weight-body: ${typography?.bodyWeight || '400'};

  /* Border Radius */
  --radius: ${borderRadius};
  --radius-lg: calc(${borderRadius} + 0.25rem);
  --radius-xl: calc(${borderRadius} + 0.5rem);
  --radius-2xl: calc(${borderRadius} + 1rem);
}
`;

  return cssVariables;
}

/**
 * Extract design tokens from a blueprint
 */
export function extractTokensFromBlueprint(blueprint) {
  // Support both old format (brand_profile) and new format (client_profile.brand)
  const brandProfile = blueprint.brand_profile || {};
  const clientBrand = blueprint.client_profile?.brand || {};

  // Merge colors from both sources, preferring client_profile.brand
  const colors = clientBrand.colors || brandProfile.colors || {};
  const typography = brandProfile.typography || {};

  return {
    colors: {
      primary: colors.primary || '#0F2942',
      secondary: colors.secondary || '#4DA6FF',
      accent: colors.accent || colors.secondary || '#F59E0B',
      background: colors.background || '#FFFFFF',
      text: colors.text || '#1F2937',
      muted: colors.muted,
      border: colors.border,
    },
    typography: {
      headings: typography.headings || typography.heading_font || 'Inter',
      body: typography.body || typography.body_font || 'Inter',
      headingsWeight: typography.headings_weight || '700',
      bodyWeight: typography.body_weight || '400',
    },
    borderRadius: brandProfile.border_radius || '0.5rem',
  };
}

/**
 * Generate all design token files
 */
export function generateAllTokens(input) {
  return {
    themeJson: generateThemeJson(input),
    tailwindConfig: generateTailwindConfig(input),
    cssVariables: generateCssVariables(input),
  };
}

export default {
  generateThemeJson,
  generateTailwindConfig,
  generateCssVariables,
  extractTokensFromBlueprint,
  generateAllTokens,
  DesignTokenInputSchema,
};
