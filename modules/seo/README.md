# WPF SEO Module

**Branch:** `module/seo`
**Knowledge Base:** `@wordpress-knowledge-base/seo/`
**Status:** Planned

## Overview

The SEO module handles schema markup, meta tags, sitemaps, and search optimization.

## Features

- **Schema Markup** - JSON-LD structured data
- **Meta Tags** - Title, description, Open Graph
- **Sitemaps** - XML sitemap generation
- **Local SEO** - Local business schema
- **Analytics** - Google Analytics integration

## Directory Structure

```
modules/seo/
├── src/
│   ├── schema/         # JSON-LD templates
│   ├── meta/           # Meta tag generation
│   ├── sitemap/        # Sitemap generation
│   └── analytics/      # Analytics integration
├── lib/
│   ├── schema.sh       # Schema helpers
│   └── sitemap.sh      # Sitemap helpers
├── tests/
│   └── schema/         # Schema validation
├── README.md
├── RULES.md
└── CLAUDE.md
```

## Commands

```bash
wpf seo audit <project>      # SEO audit
wpf seo schema <project>     # Generate schema markup
wpf seo sitemap <project>    # Generate sitemap
wpf seo meta <project>       # Audit meta tags
```

## Schema Types

| Type | Use Case |
|------|----------|
| LocalBusiness | Local companies |
| Organization | General businesses |
| Product | E-commerce |
| Article | Blog posts |
| FAQPage | FAQ sections |
| BreadcrumbList | Navigation |

## Dependencies

- jq (JSON processing)
- xmllint (XML validation)
- Rank Math SEO plugin

## Related Modules

- **webdesign** - Meta tag integration
- **performance** - Page speed for SEO
- **tools** - Plugin configuration
