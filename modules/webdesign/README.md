# WPF Web Design Module

**Branch:** `module/webdesign`
**Knowledge Base:** `@wordpress-knowledge-base/webdesign/`
**Status:** Active Development

## Overview

The webdesign module provides pre-built components, design tokens, and visual design tools for rapid website creation.

## Features

- **Component Library** - 18+ pre-built HTML components
- **Design Tokens** - Colors, typography, spacing, animations
- **Industry Presets** - 6 pre-configured color palettes
- **Preview Generation** - Browser-based design preview
- **Design-to-Code** - Compile designs to WordPress themes

## Directory Structure

```
modules/webdesign/
├── src/
│   ├── components/     # HTML component templates
│   ├── tokens/         # Design token definitions
│   └── schema/         # JSON schemas
├── lib/
│   └── design.sh       # Shell library functions
├── tests/
│   └── components/     # Component tests
├── README.md
├── RULES.md
└── CLAUDE.md
```

## Commands

```bash
wpf design list              # List components
wpf design show <component>  # Show component details
wpf design industries        # List industry presets
wpf design init <project>    # Initialize design
wpf design preview <project> # Generate preview
wpf design approve <project> # Approve design
wpf design compile <project> # Compile to theme
```

## Dependencies

- Tailwind CSS 3.4+
- Node.js 20+ (for CSS compilation)
- jq (for JSON processing)

## Related Modules

- **tools** - CLI framework
- **performance** - CSS optimization
- **platform** - Visual design builder (SaaS)
