# WPF Performance Module

**Branch:** `module/performance`
**Knowledge Base:** `@wordpress-knowledge-base/performance/`
**Status:** Planned

## Overview

The performance module handles optimization, caching, image processing, and Core Web Vitals monitoring.

## Features

- **Image Optimization** - WebP/AVIF conversion, compression
- **Critical CSS** - Above-the-fold CSS extraction
- **Caching** - Page, browser, and object caching
- **Core Web Vitals** - LCP, INP, CLS monitoring
- **CDN Integration** - Cloudflare, BunnyCDN

## Directory Structure

```
modules/performance/
├── src/
│   ├── images/         # Image optimization scripts
│   ├── css/            # Critical CSS generation
│   ├── cache/          # Caching configurations
│   └── monitoring/     # Performance monitoring
├── lib/
│   ├── imagemagick.sh  # Image processing
│   ├── cache.sh        # Cache helpers
│   └── vitals.sh       # Core Web Vitals
├── tests/
│   └── lighthouse/     # Lighthouse tests
├── README.md
├── RULES.md
└── CLAUDE.md
```

## Commands

```bash
wpf perf audit <project>     # Run performance audit
wpf perf images <project>    # Optimize images
wpf perf css <project>       # Generate critical CSS
wpf perf cache <project>     # Configure caching
wpf perf report <project>    # Generate performance report
```

## Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 70 |
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| CSS Size | < 20KB |

## Dependencies

- ImageMagick 7.1+
- Node.js 20+ (for Lighthouse)
- cwebp (WebP conversion)
- optipng/pngquant (PNG optimization)

## Related Modules

- **webdesign** - Design system optimization
- **tools** - Deployment pipeline integration
- **testing** - Performance testing
