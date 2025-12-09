# Validate Design

Run anti-pattern validation checks on existing design files.

## Usage

When the user requests:
- "Validate this design"
- "Check for anti-patterns"
- "Review design quality"
- "Does this follow WPF standards?"

## Process

### 1. Identify Target

Ask the user what to validate:
- [ ] Specific pattern file
- [ ] Entire pattern library
- [ ] Generated theme
- [ ] HTML preview
- [ ] Blueprint design configuration

### 2. Load Anti-Patterns

Read validation rules from:
- `tokens/anti-patterns.json` - Design anti-patterns
- `tokens/variants.json` - Component standards
- `.claude/skills/wpf-design-system/SKILL.md` - Design guidelines

### 3. Run Validation Checks

#### Font Validation

**Check for banned fonts:**
```javascript
const bannedFonts = [
  'Inter', 'Roboto', 'Arial', 'Helvetica', 'Open Sans', 'Montserrat'
];

// Scan HTML/CSS for font-family declarations
// Flag any matches with banned fonts
```

**Severity:** ERROR
**Fix:** Replace with industry-appropriate font from anti-patterns.json

#### Color Validation

**Check for banned color patterns:**
```javascript
const bannedPatterns = [
  /gradient.*(purple|violet).*(pink|magenta)/i,  // Purple-pink gradient
  /gradient.*(blue).*(purple)/i,                 // Blue-purple gradient
];

const bannedColors = [
  '#ff00ff', '#00ffff', '#ff0000',  // Neon colors
];

// Scan CSS for gradient patterns and color values
// Flag violations
```

**Severity:** ERROR (gradients), WARNING (single neon colors)
**Fix:** Use industry-appropriate color palettes

#### Layout Validation

**Check for generic layouts:**
```javascript
const layoutIssues = [
  'symmetric-grid-no-variation',   // All cards same size
  'perfectly-centered-everything', // No asymmetry
  'excessive-rounded-corners',     // Everything rounded
];

// Analyze HTML structure for patterns
```

**Severity:** WARNING
**Fix:** Add intentional asymmetry, vary card sizes, mix rounded/sharp corners

#### Content Validation

**Check for banned phrases:**
```javascript
const bannedPhrases = [
  'Welcome to our website',
  'Lorem ipsum',
  'Click here',
  'Learn more',
  'Read more',
  'We are a leading',
  'State-of-the-art',
  'Cutting-edge',
  'Revolutionary',
  'Game-changing'
];

// Scan text content for phrases
// Flag generic content
```

**Severity:** WARNING
**Fix:** Replace with specific, actionable content

#### Accessibility Validation

**Check WCAG AA compliance:**
```javascript
const a11yChecks = {
  colorContrast: 4.5,        // Minimum ratio
  imagesHaveAlt: true,       // All images must have alt
  semanticHTML: true,        // Proper heading hierarchy
  keyboardNav: true,         // Focus states visible
  ariaLabels: true,          // Interactive elements labeled
};

// Run automated accessibility checks
```

**Severity:** ERROR (WCAG violations)
**Fix:** Adjust colors, add alt text, fix heading hierarchy

#### Performance Validation

**Check performance anti-patterns:**
```javascript
const perfIssues = [
  'inline-styles',              // Use Tailwind classes
  'unoptimized-images',         // Images > 200KB
  'missing-width-height',       // Layout shift risk
  'render-blocking-js',         // Non-deferred scripts
];

// Scan for performance issues
```

**Severity:** WARNING
**Fix:** Optimize images, add dimensions, defer JavaScript

### 4. Generate Report

Create validation report:

```markdown
# Design Validation Report

**File:** {file-path}
**Date:** {timestamp}
**Status:** {PASS | FAIL | WARNING}

## Summary

- ✅ Passed: {count}
- ❌ Failed: {count}
- ⚠️  Warnings: {count}

## Errors (Must Fix)

### Font Usage
- ❌ Line 15: Using banned font "Inter"
  - **Fix:** Replace with industry-specific font
  - **Industry:** Construction → "DM Sans"
  - **Location:** `.hero-title { font-family: "Inter", sans-serif; }`

### Color Patterns
- ❌ Line 42: Purple-to-pink gradient detected
  - **Fix:** Use industry-appropriate colors
  - **Suggestion:** Construction → Industrial blue (#0369a1) to slate (#64748b)
  - **Location:** `.hero-bg { background: linear-gradient(to right, #a855f7, #ec4899); }`

### Accessibility
- ❌ Line 78: Color contrast too low (3.2:1, minimum 4.5:1)
  - **Fix:** Darken text or lighten background
  - **Current:** #9ca3af on #ffffff
  - **Suggestion:** #6b7280 on #ffffff (4.6:1)

## Warnings (Recommended)

### Content
- ⚠️  Line 102: Generic CTA text "Learn More"
  - **Suggestion:** "See Our Projects" | "Get Free Quote"
  - **Location:** `<button>Learn More</button>`

### Layout
- ⚠️  Line 34-58: Symmetric grid without variation
  - **Suggestion:** Vary card sizes (col-span-2 for first card)
  - **Location:** `.services-grid`

## Passed Checks

- ✅ Semantic HTML structure
- ✅ Mobile-first responsive design
- ✅ Images have alt text
- ✅ Proper heading hierarchy (H1 → H2 → H3)
- ✅ Focus states on interactive elements

## Recommendations

1. **Fonts:** Replace "Inter" with "DM Sans" for construction industry
2. **Colors:** Change gradient to solid industrial blue background
3. **Contrast:** Darken text color from #9ca3af to #6b7280
4. **CTA:** Replace "Learn More" with "Get Free Quote in 24 Hours"
5. **Layout:** Add col-span-2 to first service card for asymmetry

## Next Steps

1. Apply fixes for all errors (❌)
2. Review warnings and apply recommended changes
3. Re-run validation to confirm fixes
4. Generate updated preview
```

### 5. Provide Fix Commands

Generate commands to fix issues:

```bash
# Fix font usage
sed -i 's/font-family: "Inter"/font-family: "DM Sans"/g' pattern.html

# Update color values
sed -i 's/#a855f7/#0369a1/g' pattern.html
sed -i 's/#ec4899/#64748b/g' pattern.html

# Replace generic CTA text
sed -i 's/>Learn More</>Get Free Quote</g' pattern.html
```

### 6. Interactive Fix Mode

Offer to fix issues automatically:

**Prompt:**
```
Would you like me to fix these issues automatically?

1. [x] Replace banned fonts (3 instances)
2. [x] Update color scheme
3. [x] Fix accessibility issues (2 instances)
4. [ ] Update CTA text (requires manual review)
5. [ ] Adjust layout (requires design decision)

Apply fixes? (y/n)
```

If yes, apply fixes and show diff.

## Validation Rules Reference

### Font Rules

| Rule | Severity | Fix |
|------|----------|-----|
| Banned font used | ERROR | Replace with industry font |
| System font only | WARNING | Add distinctive font |
| Missing font-display | WARNING | Add `font-display: swap` |

### Color Rules

| Rule | Severity | Fix |
|------|----------|-----|
| Purple-pink gradient | ERROR | Use industry colors |
| Blue-purple gradient | ERROR | Use industry colors |
| Neon colors | WARNING | Use muted colors |
| Low contrast | ERROR | Adjust to 4.5:1 minimum |

### Layout Rules

| Rule | Severity | Fix |
|------|----------|-----|
| Symmetric grid | WARNING | Add variation |
| Perfect centering | WARNING | Add asymmetry |
| Excessive rounding | WARNING | Mix rounded/sharp |

### Content Rules

| Rule | Severity | Fix |
|------|----------|-----|
| Banned phrase | WARNING | Replace with specific text |
| Lorem ipsum | ERROR | Add real content |
| Generic CTA | WARNING | Make actionable |

### Accessibility Rules

| Rule | Severity | Fix |
|------|----------|-----|
| Low contrast | ERROR | Adjust colors |
| Missing alt text | ERROR | Add description |
| No heading hierarchy | ERROR | Fix heading levels |
| No focus states | ERROR | Add focus styles |
| Missing ARIA labels | WARNING | Add labels |

### Performance Rules

| Rule | Severity | Fix |
|------|----------|-----|
| Large images | WARNING | Optimize to < 200KB |
| Missing dimensions | WARNING | Add width/height |
| Inline styles | WARNING | Use Tailwind classes |
| Render-blocking JS | WARNING | Defer scripts |

## Output

Provide to user:
1. Validation report (pass/fail/warning counts)
2. Detailed issue list with locations
3. Specific fix recommendations
4. Commands to apply fixes
5. Offer to apply fixes automatically

## Tips

- Always provide file path and line numbers
- Show before/after for fixes
- Explain why each fix is necessary
- Link to design system documentation
- Prioritize errors over warnings
- Group related issues together
