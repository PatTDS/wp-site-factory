# WordPress Performance Optimization Guide

## Target Metrics

| Metric | Target | Tools |
|--------|--------|-------|
| Lighthouse Score | 70-85 | Lighthouse CLI |
| Largest Contentful Paint | < 2.5s | Chrome DevTools |
| First Contentful Paint | < 1.8s | WebPageTest |
| Cumulative Layout Shift | < 0.1 | Chrome UX Report |
| Time to Interactive | < 3.8s | Lighthouse |

## The Free Performance Stack

### 1. Autoptimize (CSS/JS Optimization)
```bash
# Configure via WP-CLI
wp option update autoptimize_html 'on'
wp option update autoptimize_css 'on'
wp option update autoptimize_css_defer 'on'
wp option update autoptimize_js 'on'
wp option update autoptimize_js_defer 'on'
```

### 2. ShortPixel (Image Optimization)
- Free tier: 100 images/month
- Lossy compression recommended (smaller files, imperceptible quality loss)
- Auto-generates WebP versions
- Removes EXIF data

### 3. Critical CSS Generation
```bash
# Install critical tool
npm install -g critical

# Generate for homepage
critical https://localhost:8080 \
  --base . \
  --inline \
  --minify \
  --width 1920 \
  --height 1080 \
  > critical-home.css
```

### 4. Rank Math SEO (Performance Features)
- Remove unnecessary metadata
- Enable lazy loading
- Optimize robots.txt

## Image Optimization Best Practices

### Before Upload
1. Resize to max dimensions needed (rarely need > 2000px)
2. Compress with ImageMagick:
   ```bash
   convert input.jpg -strip -quality 85 output.jpg
   ```
3. Convert to WebP:
   ```bash
   cwebp -q 80 input.jpg -o output.webp
   ```

### Target Sizes
- Hero images: < 200KB
- Thumbnails: < 50KB
- Icons: < 10KB (prefer SVG)

## Database Optimization

### Regular Maintenance
```bash
# Delete old revisions
wp post delete $(wp post list --post_type='revision' --format=ids) --force

# Clean transients
wp transient delete --expired

# Optimize tables
wp db optimize
```

### Query Optimization
```php
// Use transient caching
$data = get_transient('expensive_query');
if (false === $data) {
    $data = expensive_database_query();
    set_transient('expensive_query', $data, HOUR_IN_SECONDS);
}
```

## Caching Strategy

### Browser Caching (.htaccess)
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/webp "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### Page Caching
- Use Redis object cache when available
- Consider WP Super Cache for static sites

## JavaScript Optimization

### Defer Non-Critical JS
```php
function defer_js($tag, $handle) {
    if (is_admin()) return $tag;
    $defer = ['jquery', 'theme-js'];
    if (in_array($handle, $defer)) {
        return str_replace(' src', ' defer src', $tag);
    }
    return $tag;
}
add_filter('script_loader_tag', 'defer_js', 10, 2);
```

### Remove Unused Scripts
```php
function remove_unused_scripts() {
    // Remove block library CSS if not using blocks
    wp_dequeue_style('wp-block-library');

    // Remove emoji scripts
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('wp_print_styles', 'print_emoji_styles');
}
add_action('wp_enqueue_scripts', 'remove_unused_scripts', 100);
```

## Monitoring Tools

### Lighthouse CLI
```bash
# Install
npm install -g lighthouse

# Run audit
lighthouse https://example.com --output=json --output-path=report.json
```

### WebPageTest
- Online: webpagetest.org
- Test from multiple locations
- Compare before/after optimization

## Quick Wins Checklist

- [ ] Enable Gzip compression
- [ ] Optimize images before upload
- [ ] Lazy load below-fold images
- [ ] Defer non-critical JavaScript
- [ ] Minify CSS and JavaScript
- [ ] Use CDN for static assets
- [ ] Enable browser caching
- [ ] Remove unused plugins
- [ ] Use latest PHP version (8.0+)
- [ ] Enable object caching (Redis/Memcached)

## Real-World Example: NatiGeo Site

**Before optimization:**
- Lighthouse: 50-60
- Load time: 3-5s
- CSS files: 5-10

**After optimization:**
- Lighthouse: 70-85
- Load time: 1.5-2.5s
- CSS files: 1 (concatenated)
- Images: 87% smaller

---

*Reference: Validated against Netflix case study (6.5KB Tailwind CSS in production)*
