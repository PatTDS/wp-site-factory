# Performance Module Rules

## Core Web Vitals Targets

### Required Thresholds
| Metric | Good | Acceptable | Poor |
|--------|------|------------|------|
| LCP | ≤ 2.5s | 2.5-4.0s | > 4.0s |
| INP | ≤ 200ms | 200-500ms | > 500ms |
| CLS | ≤ 0.1 | 0.1-0.25 | > 0.25 |

### Lighthouse Scores
- Performance: > 70 (minimum), > 85 (target)
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90

## Image Optimization

### Size Targets
| Image Type | Max Size | Format |
|------------|----------|--------|
| Hero image | 150KB | WebP |
| Content image | 100KB | WebP |
| Thumbnail | 20KB | WebP |
| Logo | 10KB | SVG/PNG |

### Compression Settings
```bash
# JPEG Quality
Quality: 82-85%

# WebP Quality
Quality: 80%

# PNG
Use pngquant with quality 65-80
```

### ImageMagick Commands
```bash
# Optimize JPEG
convert input.jpg -strip -quality 85 output.jpg

# Convert to WebP
cwebp -q 80 input.jpg -o output.webp

# Resize large images (max 2048px)
convert input.jpg -resize 2048x2048\> output.jpg
```

## Critical CSS

### Requirements
- Critical CSS must be < 14KB (fits in first TCP packet)
- Above-the-fold content must render without external CSS
- Non-critical CSS must be loaded async

### Generation
```bash
# Use penthouse or critical npm packages
critical src/index.html --inline --minify > dist/index.html
```

## Caching

### Browser Cache Headers
| Resource | TTL |
|----------|-----|
| Static assets (CSS/JS) | 1 year (with versioning) |
| Images | 1 year |
| Fonts | 1 year |
| HTML | 0 (dynamic) |

### WordPress Caching
- Page cache: Enabled
- Object cache: Redis/Memcached
- Browser cache: Via headers
- CDN cache: Edge caching

## JavaScript

### Rules
- Defer all non-critical JavaScript
- Delay third-party scripts (analytics, chat)
- Total Blocking Time < 200ms
- No long tasks > 50ms

### Implementation
```html
<!-- Defer -->
<script defer src="script.js"></script>

<!-- Delay until interaction -->
<script>
document.addEventListener('scroll', loadScript, {once: true});
</script>
```

## Testing Requirements

### Before Deployment
- [ ] Lighthouse score > 70
- [ ] All images optimized
- [ ] Critical CSS generated
- [ ] Caching configured
- [ ] No render-blocking resources

### Monitoring
- Weekly Lighthouse CI runs
- Core Web Vitals in Search Console
- Real User Monitoring (RUM)

## Knowledge Base Reference

- `@wordpress-knowledge-base/performance/ref-performance-targets.md`
- `@wordpress-knowledge-base/performance/concept-core-web-vitals.md`
- `@wordpress-knowledge-base/performance/tutorial-lighthouse-optimization.md`
