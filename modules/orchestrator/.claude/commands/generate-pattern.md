# Generate Pattern

Create a new WordPress block pattern following WPF design standards.

## Usage

When the user requests:
- "Create a new hero pattern"
- "Generate a services section"
- "Build a testimonials pattern"

## Process

### 1. Gather Requirements

Ask the user:
- **Pattern Type**: hero, services, about, contact, testimonials, features, cta, team, gallery, faq?
- **Industry**: construction, saas, restaurant, healthcare, retail, creative, professional?
- **Variant**: What style? (e.g., split-layout, centered, fullscreen, cards, grid)
- **Content**: What specific content should be included?

### 2. Load WPF Skills

Automatically activate:
- `wpf-design-system` - For design tokens and anti-patterns
- `wpf-frontend` - For HTML/CSS structure

### 3. Check Anti-Patterns

Validate against `tokens/anti-patterns.json`:
- ✅ No banned fonts (Inter, Roboto, Arial, Helvetica, Open Sans, Montserrat)
- ✅ No purple-pink gradients or neon colors
- ✅ No generic content ("Learn more", "Click here")
- ✅ Industry-appropriate fonts selected
- ✅ Intentional asymmetry in layout

### 4. Generate Pattern Structure

Create pattern directory:
```
templates/shared/patterns/{pattern-type}/{pattern-name}/
├── pattern.html          # WordPress block pattern HTML
├── manifest.json         # Pattern metadata
└── preview.png          # Screenshot (optional)
```

### 5. Write Pattern HTML

Use this template:

```html
<!-- wp:group {"className":"{pattern-type}-section"} -->
<section class="{pattern-type}-section bg-{background-color} py-20 lg:py-28">
  <div class="max-w-7xl mx-auto px-4">

    <!-- Section header (if applicable) -->
    <div class="text-center mb-12">
      <h2 class="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
        {section-title}
      </h2>
      <p class="text-xl text-gray-600 max-w-3xl mx-auto">
        {section-description}
      </p>
    </div>

    <!-- Pattern content -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Items -->
    </div>

  </div>
</section>
<!-- /wp:group -->
```

**Requirements:**
- Mobile-first responsive (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Semantic HTML (section, article, header, footer)
- Tailwind utility classes only (no custom CSS)
- Proper spacing (py-20 lg:py-28 for sections)
- WCAG AA color contrast (4.5:1 minimum)
- Descriptive alt text on all images
- WordPress block pattern comments

### 6. Write Manifest

Create `manifest.json`:

```json
{
  "name": "{pattern-name}",
  "title": "{Pattern Display Name}",
  "description": "{What this pattern does}",
  "category": "{pattern-type}",
  "keywords": ["keyword1", "keyword2"],
  "viewportWidth": 1440,
  "industries": ["construction", "saas"],
  "variants": {
    "background": ["white", "gray-50", "primary-50"],
    "layout": ["split", "centered", "fullscreen"],
    "columns": [2, 3, 4]
  },
  "blockTypes": ["core/group", "core/heading", "core/paragraph"],
  "inserter": true
}
```

### 7. Apply Design Tokens

Use tokens from `tokens/variants.json`:

**Spacing:**
- Section: `py-20 lg:py-28` (large) or `py-16 lg:py-20` (medium)
- Container: `max-w-7xl mx-auto px-4`
- Gap: `gap-8` (cards) or `gap-6` (tight grids)

**Colors:**
- Background: `bg-white`, `bg-gray-50`, `bg-primary-50`
- Text: `text-gray-900` (headings), `text-gray-600` (body)
- Accents: `text-primary-600`, `bg-primary-600`

**Typography:**
- H2: `text-4xl lg:text-5xl font-bold`
- H3: `text-2xl lg:text-3xl font-bold`
- Body: `text-base lg:text-lg`
- Small: `text-sm text-gray-600`

**Buttons:**
- Primary: `bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg`
- Secondary: `border-2 border-primary-600 text-primary-600 hover:bg-primary-50 px-6 py-3 rounded-lg`

### 8. Industry-Specific Fonts

Apply from `tokens/anti-patterns.json`:

```html
<!-- Construction -->
<style>
  .{pattern-type}-section {
    --font-heading: 'DM Sans', sans-serif;
    --font-body: 'Source Sans 3', sans-serif;
  }
</style>

<!-- Or use Tailwind classes -->
<h2 class="font-[DM_Sans] ...">Heading</h2>
<p class="font-[Source_Sans_3] ...">Body text</p>
```

### 9. Validate Pattern

Check against validation rules:
- [ ] No banned fonts used
- [ ] Industry-appropriate fonts applied
- [ ] No banned color patterns (purple-pink gradients)
- [ ] No generic content ("Learn more", "Click here")
- [ ] Mobile-first responsive design
- [ ] Semantic HTML throughout
- [ ] All images have width, height, alt attributes
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Focus states on interactive elements
- [ ] Animations respect prefers-reduced-motion

### 10. Generate Preview

Create pattern preview:
```bash
npm run generate-preview -- --pattern={pattern-name}
```

This creates `preview.png` screenshot of the pattern.

### 11. Register Pattern

Add to pattern registry in `src/lib/pattern-loader.js`:

```javascript
{
  id: '{pattern-type}-{pattern-name}',
  name: '{Pattern Display Name}',
  category: '{pattern-type}',
  path: 'templates/shared/patterns/{pattern-type}/{pattern-name}/pattern.html',
  manifest: 'templates/shared/patterns/{pattern-type}/{pattern-name}/manifest.json',
  industries: ['construction', 'saas'],
  tags: ['keyword1', 'keyword2']
}
```

## Output

Provide to user:
1. Pattern HTML file path
2. Manifest.json content
3. Design decisions explanation
4. How to use the pattern in WordPress
5. Customization options

## Example

**User Request:** "Create a hero pattern for a construction company"

**Your Response:**

```
I'll create a construction hero pattern with these design decisions:

**Fonts:**
- Heading: DM Sans (bold, strong)
- Body: Source Sans 3 (professional, readable)
(Avoiding Inter/Roboto - banned AI fonts)

**Colors:**
- Background: Subtle gray-50 (not pure white)
- Primary: Industrial blue (#0369a1)
- Accent: Safety orange (#f59e0b)

**Layout:**
- Split layout (content left, image right)
- Asymmetric for visual interest
- Mobile-first responsive

Creating pattern at:
templates/shared/patterns/hero/hero-construction-split/
```

Then generate the files and show the code.

## Tips

- Always explain font choices (industry-specific)
- Show before/after if replacing generic fonts
- Mention anti-patterns avoided
- Provide customization instructions
- Include accessibility notes
