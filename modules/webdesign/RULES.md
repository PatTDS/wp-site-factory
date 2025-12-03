# Web Design Module Rules

## Code Standards

### Tailwind CSS
- ALWAYS use Tailwind utility classes over custom CSS
- NEVER use inline styles unless absolutely necessary
- Follow mobile-first responsive design
- Use design tokens for colors, not hardcoded values

### Components
- Each component must have a header comment with:
  - Component name and description
  - Best-for industries
  - Features list
  - Variables used
- Use Mustache-style templating: `{{VARIABLE_NAME}}`
- Array loops: `{{#ITEMS}}...{{/ITEMS}}`
- Unescaped HTML: `{{{HTML_CONTENT}}}`

### Design Tokens
- Colors must include full palette (50-950 shades)
- Typography must specify font families and weights
- Spacing follows Tailwind scale (4, 8, 12, 16, 20, 24...)
- Animations must be subtle and purposeful

### File Naming
- Components: `category/component-name.html`
- Tokens: `category-tokens.json`
- Presets: `industry-presets.json`

## Component Categories

| Category | Description | Min Components |
|----------|-------------|----------------|
| heroes | Above-the-fold sections | 3 |
| stats | Number highlights | 2 |
| services | Service offerings | 2 |
| features | Feature highlights | 2 |
| testimonials | Social proof | 2 |
| cta | Call to action | 2 |
| headers | Navigation | 2 |
| footers | Site footers | 2 |
| contact | Contact sections | 2 |

## Quality Checklist

Before adding a new component:
- [ ] Responsive on mobile, tablet, desktop
- [ ] Accessible (proper headings, alt text, ARIA)
- [ ] Uses design tokens for colors
- [ ] Has hover/focus states
- [ ] Has loading/animation states
- [ ] Tested in Chrome, Firefox, Safari
- [ ] Follows Tailwind conventions
- [ ] Has header comment documentation

## Industry Presets

Each industry preset must include:
- Primary color palette (50-950)
- Secondary color palette
- Accent color palette
- Font pairings
- Recommended components

## Performance Requirements

- Components should not require JavaScript for basic display
- Animations must use CSS transforms (not layout properties)
- Images must have explicit width/height
- No render-blocking resources

## Testing

- Visual regression tests for each component
- Accessibility audit (axe-core)
- Responsive breakpoint tests
- Cross-browser compatibility

## Knowledge Base Reference

All design patterns should align with:
- `@wordpress-knowledge-base/webdesign/ref-tailwind-css.md`
- `@wordpress-knowledge-base/webdesign/ref-shadcn-ui.md`
- `@wordpress-knowledge-base/webdesign/ref-color-systems.md`
