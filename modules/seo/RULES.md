# SEO Module Rules

## Meta Tags

### Required Tags
```html
<title>Page Title | Site Name</title>
<meta name="description" content="150-160 characters">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://example.com/page">
```

### Open Graph
```html
<meta property="og:title" content="Page Title">
<meta property="og:description" content="Description">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">
```

### Twitter Cards
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page Title">
<meta name="twitter:description" content="Description">
<meta name="twitter:image" content="https://example.com/image.jpg">
```

## Schema Markup

### LocalBusiness Template
```json
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Company Name",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "City",
    "addressRegion": "State",
    "postalCode": "12345"
  },
  "telephone": "+1-555-555-5555",
  "openingHours": "Mo-Fr 09:00-17:00"
}
```

### Schema Validation
- All schema must validate at schema.org validator
- Test with Google Rich Results Test
- No errors or warnings allowed

## Sitemap

### Requirements
- XML sitemap at `/sitemap.xml`
- Include all public pages
- Exclude noindex pages
- Update on content changes
- Max 50,000 URLs per sitemap

### Priority Guidelines
| Page Type | Priority | Change Freq |
|-----------|----------|-------------|
| Homepage | 1.0 | weekly |
| Services | 0.8 | monthly |
| Blog posts | 0.6 | yearly |
| Legal pages | 0.3 | yearly |

## robots.txt

### Template
```
User-agent: *
Disallow: /wp-admin/
Disallow: /wp-includes/
Allow: /wp-admin/admin-ajax.php

Sitemap: https://example.com/sitemap.xml
```

## Content Guidelines

### Title Tags
- 50-60 characters
- Primary keyword near start
- Brand name at end

### Meta Descriptions
- 150-160 characters
- Include call to action
- Unique per page

### Headings
- One H1 per page
- Logical hierarchy (H1 → H2 → H3)
- Include keywords naturally

## Technical SEO

### URL Structure
- Use hyphens, not underscores
- Keep URLs short and descriptive
- Include primary keyword
- Lowercase only

### Performance Impact
- LCP < 2.5s (ranking factor)
- Mobile-friendly (required)
- HTTPS (required)

## Knowledge Base Reference

- `@wordpress-knowledge-base/seo/ref-schema-markup.md`
- `@wordpress-knowledge-base/seo/howto-local-seo.md`
- `@wordpress-knowledge-base/seo/ref-meta-tags.md`
