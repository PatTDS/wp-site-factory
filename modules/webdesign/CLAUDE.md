# AI Instructions: Web Design Module

## Purpose

This module handles all visual design aspects of WPF websites.

## When Working in This Module

1. **Always** reference `RULES.md` before making changes
2. **Follow** Tailwind CSS conventions strictly
3. **Use** design tokens, never hardcode colors
4. **Test** components across breakpoints

## Component Creation

When creating a new component:

```html
<!--
  Category: Component Name
  Best for: Industry 1, Industry 2
  Features: Feature 1, Feature 2
  Variables: {{VAR1}}, {{VAR2}}
-->

<section class="py-20 lg:py-28 bg-white">
    <!-- Component content -->
</section>
```

## Variable Conventions

| Pattern | Use Case | Example |
|---------|----------|---------|
| `{{UPPER_CASE}}` | Single value | `{{COMPANY_NAME}}` |
| `{{#ARRAY}}...{{/ARRAY}}` | Loop | `{{#SERVICES}}...{{/SERVICES}}` |
| `{{{HTML}}}` | Unescaped HTML | `{{{SERVICE_ICON}}}` |

## Color Usage

- Primary: Main brand color, CTAs, links
- Secondary: Accents, highlights, badges
- Accent: Success states, checkmarks
- Gray scale: Text, backgrounds, borders

## Common Patterns

### Section Header
```html
<div class="text-center mb-16">
    <span class="inline-flex px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
        {{SECTION_BADGE}}
    </span>
    <h2 class="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-gray-900 mb-6">
        {{SECTION_TITLE}}
    </h2>
    <p class="text-lg text-gray-600 max-w-3xl mx-auto">
        {{SECTION_DESCRIPTION}}
    </p>
</div>
```

### CTA Button
```html
<a href="{{URL}}" class="inline-flex items-center px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg">
    {{TEXT}}
    <svg class="w-5 h-5 ml-2" ...></svg>
</a>
```

## Do Not

- Add JavaScript unless absolutely necessary
- Use custom CSS classes (use Tailwind)
- Hardcode color values
- Create components without documentation
- Skip responsive testing
