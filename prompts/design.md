# Design Decision Prompts

Use these prompts when making design decisions for the website.

---

## Layout Decisions

### Homepage Layout

**Option A: Hero-First**
- Large hero image/video with CTA
- Best for: visual businesses, portfolios
- Example: Photography, hospitality

**Option B: Services-First**
- Services grid immediately visible
- Best for: service businesses
- Example: Consulting, professional services

**Option C: Story-First**
- About/mission content prominent
- Best for: purpose-driven organizations
- Example: Non-profits, eco-friendly businesses

**Question:** Which layout best suits the company's goals?

---

### Navigation Style

**Option A: Standard Top Bar**
- Logo left, menu right
- CTA button prominent
- Best for: most businesses

**Option B: Centered Logo**
- Menu split around center logo
- Best for: luxury, fashion, hospitality

**Option C: Minimal**
- Hamburger menu only
- Best for: portfolios, creative agencies

**Question:** What navigation style fits the brand?

---

## Color Application

### Primary Color Usage
- Headers
- CTA buttons
- Links
- Icons
- Accent elements

### Secondary Color Usage
- Hover states
- Secondary buttons
- Backgrounds
- Borders

### Neutral Colors
- Body text: Gray-900 (#111827)
- Subtle text: Gray-600 (#4B5563)
- Borders: Gray-200 (#E5E7EB)
- Background: Gray-50 (#F9FAFB)
- White: #FFFFFF

---

## Typography Scale

### Headings
```css
h1: text-4xl md:text-5xl lg:text-6xl (36px → 48px → 60px)
h2: text-3xl md:text-4xl (30px → 36px)
h3: text-2xl md:text-3xl (24px → 30px)
h4: text-xl md:text-2xl (20px → 24px)
```

### Body Text
```css
Large: text-lg (18px)
Normal: text-base (16px)
Small: text-sm (14px)
```

---

## Component Decisions

### Button Styles

**Primary Button**
```css
bg-primary text-white px-6 py-3 rounded-lg font-medium
hover:bg-primary-dark transition-colors
```

**Secondary Button**
```css
border-2 border-primary text-primary px-6 py-3 rounded-lg
hover:bg-primary hover:text-white
```

**Question:** Rounded corners or square? (rounded-lg vs rounded-none)

---

### Card Styles

**Option A: Minimal**
```css
bg-white rounded-lg shadow-sm
```

**Option B: Elevated**
```css
bg-white rounded-xl shadow-lg hover:shadow-xl
```

**Option C: Bordered**
```css
bg-white rounded-lg border border-gray-200
```

---

### Image Treatment

**Option A: Rounded**
```css
rounded-lg or rounded-xl
```

**Option B: Square**
```css
rounded-none
```

**Option C: Circular** (for team photos)
```css
rounded-full
```

---

## Section Spacing

### Standard Spacing
```css
Section padding: py-16 md:py-24 (64px → 96px)
Component gap: gap-6 or gap-8 (24px or 32px)
Text spacing: space-y-4 (16px)
```

### Hero Section
```css
Minimum height: min-h-[60vh] or min-h-[80vh]
Padding: py-20 md:py-32
```

---

## Responsive Breakpoints

### Tailwind Defaults
- **sm:** 640px (mobile landscape)
- **md:** 768px (tablet)
- **lg:** 1024px (small desktop)
- **xl:** 1280px (large desktop)

### Grid Patterns
```css
Mobile: grid-cols-1
Tablet: md:grid-cols-2
Desktop: lg:grid-cols-3 or lg:grid-cols-4
```

---

## Animation Decisions

### Hover Effects
- **Subtle:** opacity changes, color transitions
- **Medium:** scale transforms, shadows
- **Bold:** background slides, underlines

### Page Transitions
- **None:** instant page changes
- **Fade:** opacity transitions
- **Slide:** directional movement

### Scroll Animations
- **None:** static content
- **Subtle:** fade-in on scroll
- **Dynamic:** AOS library effects

**Question:** What level of animation suits the brand?

---

## Accessibility Checklist

Before finalizing design:

- [ ] Color contrast ratio ≥ 4.5:1 for text
- [ ] Touch targets ≥ 44×44px
- [ ] Focus states visible
- [ ] Text scalable to 200%
- [ ] Motion can be disabled

---

## Design System Summary

After decisions, document:

```yaml
Colors:
  primary: "#XXXXXX"
  secondary: "#XXXXXX"

Typography:
  heading: "Font Name"
  body: "Font Name"

Spacing:
  section: "py-16 md:py-24"
  component: "gap-6"

Corners:
  buttons: "rounded-lg"
  cards: "rounded-xl"
  images: "rounded-lg"

Shadows:
  cards: "shadow-lg"
  hover: "shadow-xl"
```

---

*Design decisions documented: [DATE]*
