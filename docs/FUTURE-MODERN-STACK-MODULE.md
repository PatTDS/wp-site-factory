# Future: Modern Stack Output Module

**Status:** Planned (Not Yet Implemented)
**Related Research:** `tools/ref-claude-code-web-design-best-practices.md`
**Created:** 2025-12-09

## Overview

This document outlines a potential future module for generating modern React/Next.js websites as an alternative output format to WordPress PHP themes.

## Key Decision: Separate Output Modes, Not Combined

Based on research analysis, combining Next.js frontend with WordPress backend (headless WordPress) is **not recommended** for WPF's target market (small businesses). Instead, WPF should offer distinct output modes:

| Output Mode | Use Case | Target |
|-------------|----------|--------|
| **WordPress (Current)** | Small business brochure sites | 90% of clients |
| **Next.js (Future)** | Modern web apps, tech companies | 10% of clients |

## Why Not Headless WordPress?

1. **Complexity**: Requires two separate deployments (WP + Vercel/Node)
2. **Cost**: More expensive hosting infrastructure
3. **Overkill**: Small business sites don't need SSR/ISR capabilities
4. **Maintenance**: Client needs technical knowledge for two systems

## Proposed Modern Stack Module

### Tech Stack

Based on 2025 research:

```
Next.js 15 + React 19
├── App Router (Server Components)
├── Tailwind CSS v4 (@theme syntax)
├── shadcn/ui (Radix primitives)
├── TypeScript 5.x
└── Vercel deployment
```

### Module Structure

```
modules/modern-stack/
├── src/
│   ├── generators/
│   │   ├── next-app.js      # Generate Next.js project
│   │   ├── components.js    # Generate React components
│   │   └── pages.js         # Generate App Router pages
│   └── templates/
│       ├── next.config.js
│       ├── tailwind.config.ts
│       └── components/
├── presets/                  # Industry-specific presets
└── README.md
```

### Blueprint Compatibility

The existing blueprint schema would work for both outputs:

```javascript
// Same blueprint structure
const blueprint = {
  client_profile: { company, contact },
  brand_profile: { colors, typography },
  services: [...],
  testimonials: [...]
};

// Different renderers
const wordpressOutput = await generateWordPressTheme(blueprint);
const nextjsOutput = await generateNextJsApp(blueprint);
```

### Tailwind v4 Integration

Modern stack would use Tailwind v4's CSS-native approach:

```css
/* CSS-first design tokens */
@theme {
  --color-primary: #16a34a;
  --color-secondary: #0f766e;
  --font-heading: 'Inter', sans-serif;
}
```

vs current WordPress output using v3:

```javascript
// JavaScript config
export default {
  theme: {
    extend: {
      colors: {
        primary: '#16a34a'
      }
    }
  }
}
```

## Implementation Priority

This module is **low priority** because:

1. WordPress output covers 90% of target clients
2. Modern stack requires different deployment infrastructure
3. Phase 2 WordPress features not yet complete
4. Client demand for Next.js output is minimal

## When to Implement

Consider implementing when:

- [ ] Phase 2 WordPress is production-ready
- [ ] SaaS platform (modules/platform) is launched
- [ ] Client demand for modern stack increases
- [ ] Agency clients need React output

## Related Files

- `modules/orchestrator/src/lib/phase2/design-tokens.js` - Could add v4 output option
- `wordpress-knowledge-base/tools/ref-claude-code-web-design-best-practices.md` - Full research
- `.claude/skills/wpf-design.md` - Design token skill documentation

## Research Sources

Key research informing this decision:

1. **Tailwind v4**: CSS-native @theme syntax, better tree-shaking
2. **Next.js 15**: PPR (Partial Pre-rendering), improved Server Components
3. **React 19**: use() hook, async components, improved hydration
4. **shadcn/ui**: Radix primitives, copy-paste components, full customization

---

*This document will be updated when implementation begins.*
