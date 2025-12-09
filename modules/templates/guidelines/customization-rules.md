# Customization Rules

**Version:** 1.0.0
**Purpose:** What can and cannot be customized, and how

---

## Customization Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│ NEVER CHANGE (Protected)                                     │
│ - Core template HTML structure                               │
│ - Section semantic markup                                    │
│ - Accessibility attributes                                   │
│ - Base responsive behavior                                   │
├─────────────────────────────────────────────────────────────┤
│ AUTOMATIC (Template Handles)                                 │
│ - Item count grid adaptation                                 │
│ - Text truncation                                            │
│ - Optional element visibility                                │
│ - Responsive breakpoints                                     │
├─────────────────────────────────────────────────────────────┤
│ CONTENT (From Blueprint)                                     │
│ - Headlines, descriptions                                    │
│ - Service/testimonial content                                │
│ - Contact information                                        │
│ - Brand colors                                               │
├─────────────────────────────────────────────────────────────┤
│ USER-REQUESTED (Explicit Request Only)                       │
│ - Font sizes                                                 │
│ - Element alignment                                          │
│ - Section order                                              │
│ - Show/hide elements                                         │
│ - Color overrides                                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Protected Elements (NEVER Change)

These elements are fixed and should never be modified:

### HTML Structure

```html
<!-- Section wrapper - DO NOT MODIFY -->
<section id="services" class="services-section" data-section="services">

<!-- Container - DO NOT MODIFY -->
<div class="container">

<!-- Grid structure - DO NOT MODIFY -->
<div class="services-grid">
```

### Semantic Markup

- `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>`
- ARIA attributes (`role`, `aria-label`, `aria-labelledby`)
- `id` attributes for navigation anchors
- `data-*` attributes for JavaScript hooks

### Accessibility Features

- Focus indicators (`:focus-visible` styles)
- Skip links
- Screen reader text (`.sr-only`)
- Reduced motion media queries

### Base Responsive Behavior

- Mobile-first breakpoint structure
- Container max-widths
- Touch target sizes (minimum 44x44px)

---

## Automatic Handling (No LLM Intervention)

Templates handle these automatically:

### Grid Adaptation

| Content | Template Action |
|---------|----------------|
| 3 services | 2-column grid |
| 6 services | 3-column grid |
| 9 services | 3-column + show more |
| No tagline | Hidden, layout adjusts |
| Long headline | Font scales down |
| Short description | Maintains card height |

### Responsive Changes

| Breakpoint | Automatic Changes |
|------------|-------------------|
| Mobile (<768px) | Single column, stacked layout |
| Tablet (768-1023px) | 2 columns, adjusted spacing |
| Desktop (1024px+) | Full layout, side-by-side |

### Text Handling

| Situation | Template Action |
|-----------|-----------------|
| Text too long | Truncate with ellipsis |
| Text very short | Maintain minimum height |
| Missing optional text | Hide element |
| Special characters | HTML escape |

---

## Content Injection (From Blueprint)

These come directly from blueprint:

### Always Inject

| Field | Source |
|-------|--------|
| Company name | `company.name` |
| Headlines | `content_drafts.{section}.headline` |
| Descriptions | `content_drafts.{section}.description` |
| CTA text | `content_drafts.{section}.cta_*` |
| Services list | `content_drafts.services.services` |
| Testimonials | `content_drafts.testimonials.testimonials` |
| Stats | `content_drafts.stats.stats` |
| Contact info | `contact.*` |

### Brand Colors (Override Defaults)

```javascript
// Always use blueprint brand colors
const colors = {
  primary: blueprint.brand.colors.primary,
  secondary: blueprint.brand.colors.secondary,
  accent: blueprint.brand.colors.accent
};
```

### Stock Photos

```javascript
// Use image_keywords from blueprint
const keywords = blueprint.content_drafts.hero.image_keywords;
const photo = await fetchStockPhoto(keywords);
```

---

## User-Requested Customizations

These changes require explicit user request.

### How to Identify User Requests

User must explicitly say something like:
- "Make the headline bigger"
- "Center the logo"
- "Move testimonials above services"
- "Hide the tagline"
- "Use a different font"
- "Change the button color to red"

### Common Customization Requests

#### Typography Changes

| Request | Action |
|---------|--------|
| "Make headline bigger" | Add larger font-size class or inline style |
| "Make text smaller" | Add smaller font-size class |
| "Use bold for subheadline" | Add `font-weight: 700` |
| "Change font to Roboto" | Override `--font-heading` variable |

**Implementation:**

```html
<!-- User requested: "Make headline bigger" -->
<h1 class="hero-headline" style="font-size: clamp(2.5rem, 6vw, 5rem);">
  {{headline}}
</h1>
```

#### Alignment Changes

| Request | Action |
|---------|--------|
| "Center the headline" | Add `text-align: center` |
| "Align buttons to right" | Add `justify-content: flex-end` |
| "Center the logo" | Add alignment class |

**Implementation:**

```html
<!-- User requested: "Center the section headline" -->
<div class="section-header" style="text-align: center;">
```

#### Visibility Changes

| Request | Action |
|---------|--------|
| "Hide the tagline" | Don't render the element |
| "Remove secondary button" | Don't render the button |
| "Hide stats section" | Skip entire section |

**Implementation:**

```handlebars
{{!-- User requested: "Hide the tagline" --}}
{{!-- Normally: {{#if tagline}}<p>{{tagline}}</p>{{/if}} --}}
{{!-- Now: completely removed --}}
```

#### Order Changes

| Request | Action |
|---------|--------|
| "Move services above about" | Reorder section rendering |
| "Put image on left" | Use `--image-left` variant |
| "Stats at the bottom" | Move stats section |

**Implementation:**

```javascript
// User requested: "Move testimonials before services"
const sectionOrder = ['hero', 'testimonials', 'services', 'about', 'contact'];
// Instead of default: ['hero', 'services', 'about', 'testimonials', 'contact']
```

#### Color Overrides

| Request | Action |
|---------|--------|
| "Make buttons blue" | Override button background |
| "Use green for accents" | Override secondary color |
| "Darker background" | Adjust section background |

**Implementation:**

```css
/* User requested: "Make CTA buttons green" */
.btn--primary {
  background-color: #10b981;
  border-color: #10b981;
}
```

---

## Customization Documentation

When applying user customizations:

### 1. Document in Output Metadata

```javascript
metadata.user_customizations.push({
  request: "Make headline bigger",
  action: "Added inline style font-size: clamp(2.5rem, 6vw, 5rem)",
  element: "hero-headline",
  timestamp: new Date().toISOString()
});
```

### 2. Add HTML Comments

```html
<!-- USER CUSTOMIZATION: Headline size increased per user request -->
<h1 class="hero-headline" style="font-size: clamp(2.5rem, 6vw, 5rem);">
```

### 3. Use Inline Styles (Not Class Modifications)

**Good:**
```html
<h1 style="font-size: 3rem;">
```

**Bad:**
```html
<h1 class="hero-headline hero-headline--large custom-size">
```

Why: Inline styles clearly show customizations. Class modifications can conflict with base template updates.

---

## Request Validation

### Valid Customization Requests

- Specific element + specific change
- Clear instruction

**Examples:**
- "Make the hero headline 20% larger"
- "Center all section headers"
- "Hide the secondary CTA button"
- "Use Inter font for headings"

### Invalid / Ambiguous Requests

Need clarification before proceeding:

- "Make it look better" → What specifically?
- "Change the layout" → Which section? How?
- "More modern" → What does that mean?
- "Fix the design" → What's wrong?

**Response:**
```
I'd be happy to make changes. Could you clarify:
- Which section should I modify?
- What specific change would you like?
```

---

## Customization Limits

### What LLM CAN Do (With User Request)

- Change font sizes (within reasonable range)
- Change text alignment
- Change element visibility
- Reorder sections
- Override colors
- Adjust spacing
- Add/remove optional elements

### What LLM CANNOT Do (Even With Request)

- Remove semantic structure
- Break accessibility
- Remove responsive behavior
- Delete required sections (hero, contact)
- Add external scripts
- Modify JavaScript functionality
- Create completely new layouts

### When to Refuse

If user requests something that would:
1. Break accessibility (contrast, focus, etc.)
2. Remove critical functionality
3. Violate web standards
4. Create security issues

**Response:**
```
I can't make that change because it would [reason].
Instead, I could [alternative suggestion].
Would that work for you?
```

---

## Customization Workflow

```
1. User makes request
   ↓
2. LLM identifies:
   - Which element?
   - What change?
   - Is it valid?
   ↓
3. If valid:
   - Apply change
   - Document in metadata
   - Add HTML comment
   ↓
4. If invalid/ambiguous:
   - Ask for clarification
   - Suggest alternatives
   ↓
5. Output includes:
   - Modified HTML
   - Documentation of changes
   - Any warnings
```

---

## Quick Reference Table

| Change Type | Needs User Request? | Method |
|-------------|---------------------|--------|
| Content from blueprint | No | Template injection |
| Brand colors | No | Design tokens |
| Grid adaptation | No | Automatic CSS |
| Text truncation | No | Automatic CSS |
| Font size change | Yes | Inline style |
| Alignment change | Yes | Inline style |
| Hide element | Yes | Remove from output |
| Reorder sections | Yes | Change render order |
| New layout | No (use different preset) | Preset selection |

---

**Remember:** Customizations should be minimal, documented, and reversible. The template's base design is tested and optimized - changes should be additive, not destructive.
