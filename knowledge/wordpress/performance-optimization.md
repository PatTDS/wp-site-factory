# WordPress Performance Optimization Guide

## Overview

This guide documents performance optimization strategies tested on production WordPress sites. Based on NatiGeo website optimization from Lighthouse score 56 → 70+ target.

---

## Diagnostic Process

### Step 1: Run Lighthouse Audit

```bash
# Using Playwright's Chromium
CHROME_PATH=~/.cache/ms-playwright/chromium-1194/chrome-linux/chrome \
npx lighthouse https://your-site.com --output=json --quiet \
| tee /tmp/lighthouse.json

# Extract scores
cat /tmp/lighthouse.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
for cat, info in data['categories'].items():
    score = int(info['score'] * 100)
    print(f'{info[\"title\"]}: {score}')
"
```

### Step 2: Identify Key Issues

```bash
# Extract render-blocking resources
cat /tmp/lighthouse.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
items = data['audits']['render-blocking-resources']['details']['items']
for item in items[:10]:
    print(f\"{item['url'][:60]}... ({item['wastedMs']:.0f}ms)\")
"

# Extract third-party impact
cat /tmp/lighthouse.json | python3 -c "
import json, sys
data = json.load(sys.stdin)
items = data['audits']['third-party-summary']['details']['items']
for item in items[:10]:
    print(f\"{item['entity']}: {item['blockingTime']:.0f}ms blocking\")
"
```

---

## Common Performance Issues

### Issue 1: WordPress Block Library CSS (100% Unused)
**Impact**: ~15KB wasted, ~580ms render blocking
**Symptoms**: `wp-includes/css/dist/block-library/style.min.css` in audit

**Fix** (functions.php):
```php
// Remove Block Library CSS if not using Gutenberg
add_action('wp_enqueue_scripts', function() {
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('wc-blocks-style');
    wp_dequeue_style('global-styles');
}, 100);
```

### Issue 2: Google Tag Manager Blocking
**Impact**: 700-900ms blocking, 140KB+, heavy JS execution
**Symptoms**: `googletagmanager.com/gtag/js` with high blocking time

**Fix** - Delay until user interaction:
```php
// Replace direct GTM script with delayed loading
add_action('wp_footer', function() {
?>
<script>
(function() {
    var loaded = false;
    function loadGTM() {
        if (loaded) return;
        loaded = true;
        var s = document.createElement('script');
        s.src = 'https://www.googletagmanager.com/gtag/js?id=YOUR-ID';
        s.async = true;
        document.head.appendChild(s);
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'YOUR-ID');
    }
    ['scroll', 'click', 'touchstart', 'mousemove'].forEach(function(e) {
        window.addEventListener(e, loadGTM, {once: true, passive: true});
    });
    setTimeout(loadGTM, 5000);
})();
</script>
<?php
}, 100);

// Remove original GTM from header
remove_action('wp_head', 'your_gtm_function');
```

### Issue 3: Font Awesome Full Library (98% Unused)
**Impact**: 18KB+ wasted CSS
**Symptoms**: `font-awesome/css/all.min.css` with high unused percentage

**Fix Options**:

**Option A: Create Icon Subset**
```bash
# 1. Audit which icons are used
grep -roh "fa-[a-z-]*" wp-content/themes/your-theme/ | sort | uniq

# 2. Generate custom subset at fontawesome.com/kits
# 3. Replace full library with subset
```

**Option B: Replace with SVG Sprite**
```php
// Load SVG sprite in header
add_action('wp_head', function() {
    include get_template_directory() . '/assets/icons/sprite.svg';
});

// Use in templates
<svg class="icon"><use href="#icon-name"></use></svg>
```

**Option C: Use Lighter Alternative**
- Phosphor Icons (lighter)
- Heroicons (Tailwind-native)
- Feather Icons

### Issue 4: Render-Blocking CSS
**Impact**: 700-800ms per CSS file
**Symptoms**: Multiple CSS files showing render-blocking

**Fix** - Critical CSS + Async Loading:

**Step 1: Generate Critical CSS**
```bash
#!/bin/bash
# scripts/generate-critical-css.sh
npx critical https://your-site.com \
  --base ./ \
  --inline \
  --minify \
  --width 1920 \
  --height 1080 \
  --ignore "@font-face" \
  --ignore ".aos-" \
  > wp-content/themes/your-theme/critical.css
```

**Step 2: Inline Critical CSS**
```php
// In header.php before </head>
<style id="critical-css">
<?php include get_template_directory() . '/critical.css'; ?>
</style>
```

**Step 3: Async Load Non-Critical CSS**
```php
// In functions.php
add_filter('style_loader_tag', function($html, $handle) {
    $async_handles = ['contact-form-7', 'newsletter', 'aos'];

    if (in_array($handle, $async_handles)) {
        $html = str_replace(
            "media='all'",
            "media='print' onload=\"this.media='all'\"",
            $html
        );
    }
    return $html;
}, 10, 2);
```

### Issue 5: External Library Loading (AOS, etc.)
**Impact**: 150-400ms blocking from CDN
**Symptoms**: `unpkg.com`, `cdnjs.cloudflare.com` in blocking resources

**Fix** - Self-host with defer:
```php
// Download libraries to theme
// Then enqueue with defer
wp_enqueue_script(
    'aos',
    get_template_directory_uri() . '/assets/js/aos.min.js',
    [],
    '2.3.1',
    ['strategy' => 'defer', 'in_footer' => true]
);
```

### Issue 6: Plugin CSS Loading Globally
**Impact**: Unnecessary CSS on pages without forms/features
**Symptoms**: CF7, Newsletter CSS loading on all pages

**Fix** - Conditional Loading:
```php
// Dequeue globally
add_action('wp_enqueue_scripts', function() {
    wp_dequeue_style('contact-form-7');
    wp_dequeue_script('contact-form-7');
}, 20);

// Load only where needed
add_action('wp_footer', function() {
    // Only on pages with contact form
    if (is_front_page() || is_page('contact')) {
        wp_enqueue_style('contact-form-7');
        wp_enqueue_script('contact-form-7');
    }
});
```

---

## Performance Optimization Phases

### Phase 1: Quick Wins (30 min, +8-12 pts)

| Task | Impact | Effort |
|------|--------|--------|
| Remove Block Library CSS | +3-4 pts | 5 min |
| Defer GTM | +5-7 pts | 10 min |
| Self-host/defer AOS | +1-2 pts | 10 min |

### Phase 2: CSS Optimization (+5-8 pts)

| Task | Impact | Effort |
|------|--------|--------|
| Generate Critical CSS | +4-6 pts | 30 min |
| Async non-critical CSS | +2-3 pts | 20 min |
| Preload key resources | +1 pt | 10 min |

### Phase 3: Plugin Optimization (+3-5 pts)

| Task | Impact | Effort |
|------|--------|--------|
| Conditional CF7 loading | +1-2 pts | 15 min |
| Conditional Newsletter | +1 pt | 10 min |
| Configure Autoptimize | +2-3 pts | 20 min |

### Phase 4: Third-Party (+2-4 pts)

| Task | Impact | Effort |
|------|--------|--------|
| Font Awesome subset | +2-3 pts | 45 min |
| Google Fonts optimization | +1 pt | 15 min |
| Cache headers | +1 pt | 10 min |

---

## Complete Performance Functions.php

```php
<?php
/**
 * Performance Optimizations
 * Include in theme functions.php or create inc/performance.php
 */

// ============================================
// PHASE 1: QUICK WINS
// ============================================

/**
 * Remove WordPress Block Library CSS
 * Impact: -15KB, -580ms render blocking
 */
add_action('wp_enqueue_scripts', function() {
    // Only if not using Gutenberg editor on frontend
    wp_dequeue_style('wp-block-library');
    wp_dequeue_style('wp-block-library-theme');
    wp_dequeue_style('wc-blocks-style');
    wp_dequeue_style('global-styles');
}, 100);

/**
 * Remove WordPress Emoji Scripts
 * Impact: -10KB
 */
remove_action('wp_head', 'print_emoji_detection_script', 7);
remove_action('wp_print_styles', 'print_emoji_styles');

/**
 * Remove jQuery Migrate (if not needed)
 */
add_action('wp_default_scripts', function($scripts) {
    if (!is_admin() && isset($scripts->registered['jquery'])) {
        $script = $scripts->registered['jquery'];
        if ($script->deps) {
            $script->deps = array_diff($script->deps, ['jquery-migrate']);
        }
    }
});

// ============================================
// PHASE 2: CSS OPTIMIZATION
// ============================================

/**
 * Preconnect to External Resources
 */
add_action('wp_head', function() {
    echo '<link rel="preconnect" href="https://fonts.googleapis.com">';
    echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
}, 1);

/**
 * Async Load Non-Critical CSS
 */
add_filter('style_loader_tag', function($html, $handle) {
    // CSS files that can load async
    $async_handles = [
        'contact-form-7',
        'newsletter',
        'aos',
        'wp-block-library' // if not removed
    ];

    if (in_array($handle, $async_handles) && !is_admin()) {
        // Use media="print" trick
        $html = str_replace(
            "media='all'",
            "media='print' onload=\"this.media='all'\"",
            $html
        );
        // Add noscript fallback
        $noscript = str_replace(
            "media='print' onload=\"this.media='all'\"",
            "media='all'",
            $html
        );
        $html .= '<noscript>' . $noscript . '</noscript>';
    }

    return $html;
}, 10, 2);

// ============================================
// PHASE 3: PLUGIN OPTIMIZATION
// ============================================

/**
 * Conditional Contact Form 7 Loading
 */
add_action('wp_enqueue_scripts', function() {
    // Pages that DON'T need CF7
    $no_cf7_pages = ['privacy-policy', 'terms'];

    if (is_page($no_cf7_pages)) {
        wp_dequeue_style('contact-form-7');
        wp_dequeue_script('contact-form-7');
        wp_dequeue_script('wpcf7-recaptcha');
    }
}, 20);

/**
 * Defer JavaScript Loading
 */
add_filter('script_loader_tag', function($tag, $handle) {
    $defer_handles = [
        'aos',
        'contact-form-7',
        'newsletter'
    ];

    if (in_array($handle, $defer_handles) && !is_admin()) {
        $tag = str_replace(' src', ' defer src', $tag);
    }

    return $tag;
}, 10, 2);

// ============================================
// PHASE 4: THIRD-PARTY OPTIMIZATION
// ============================================

/**
 * Delayed Google Tag Manager
 * Only loads after user interaction or 5s timeout
 */
add_action('wp_footer', function() {
    $gtm_id = 'G-YOUR-ID'; // Replace with actual ID
    ?>
    <script>
    (function() {
        var loaded = false;
        function loadGTM() {
            if (loaded) return;
            loaded = true;
            var s = document.createElement('script');
            s.src = 'https://www.googletagmanager.com/gtag/js?id=<?php echo $gtm_id; ?>';
            s.async = true;
            document.head.appendChild(s);
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '<?php echo $gtm_id; ?>');
        }
        ['scroll', 'click', 'touchstart'].forEach(function(e) {
            window.addEventListener(e, loadGTM, {once: true, passive: true});
        });
        setTimeout(loadGTM, 5000);
    })();
    </script>
    <?php
}, 100);

/**
 * Add Resource Hints
 */
add_action('wp_head', function() {
    // Preload hero image (replace with actual path)
    $hero_image = get_template_directory_uri() . '/assets/images/hero-bg.webp';
    echo '<link rel="preload" as="image" href="' . esc_url($hero_image) . '" fetchpriority="high">';

    // DNS prefetch for third-party domains
    echo '<link rel="dns-prefetch" href="//www.googletagmanager.com">';
    echo '<link rel="dns-prefetch" href="//www.google-analytics.com">';
}, 1);
```

---

## Verification Scripts

### Quick Score Check
```bash
#!/bin/bash
# scripts/quick-lighthouse.sh
CHROME_PATH=~/.cache/ms-playwright/chromium-1194/chrome-linux/chrome \
npx lighthouse "$1" --output=json --quiet 2>/dev/null | \
python3 -c "
import json, sys
data = json.load(sys.stdin)
print('=' * 50)
for cat, info in data['categories'].items():
    score = int(info['score'] * 100)
    emoji = '🟢' if score >= 90 else '🟡' if score >= 70 else '🔴'
    print(f'{emoji} {info[\"title\"]}: {score}')
print('=' * 50)
"
```

### Before/After Comparison
```bash
# Run before changes
./scripts/quick-lighthouse.sh https://your-site.com > before.txt

# Make changes...

# Run after changes
./scripts/quick-lighthouse.sh https://your-site.com > after.txt

# Compare
diff before.txt after.txt
```

---

## Performance Targets

| Metric | Good | Needs Work | Poor |
|--------|------|------------|------|
| Performance Score | 90+ | 70-89 | <70 |
| LCP | <2.5s | 2.5-4s | >4s |
| FCP | <1.8s | 1.8-3s | >3s |
| TBT | <200ms | 200-600ms | >600ms |
| CLS | <0.1 | 0.1-0.25 | >0.25 |

---

## Troubleshooting

### Score Dropped After Changes
1. Check for JavaScript errors in console
2. Verify CSS is loading (no broken styles)
3. Test form submissions still work
4. Check animations still trigger

### GTM Events Not Firing
- Increase timeout from 5000ms to 3000ms
- Add page scroll trigger earlier
- Check dataLayer is initialized

### Visual Glitches After CSS Changes
- Critical CSS may be missing some styles
- Regenerate critical.css with larger viewport
- Add specific selectors to critical CSS manually

---

## Case Study: NatiGeo Website

**Before Optimization:**
- Performance: 56
- LCP: 3.5s
- TBT: 2,460ms
- Main issues: GTM (765ms), Block Library (579ms), AOS from CDN (162ms)

**After Optimization Target:**
- Performance: 70-82
- LCP: <2.5s
- TBT: <500ms

**Key Changes:**
1. Removed Block Library CSS (100% unused)
2. Deferred GTM until user interaction
3. Self-hosted AOS library
4. Implemented Critical CSS
5. Async loaded plugin CSS

---

*Last Updated: 2024-11-30*
*Based on: NatiGeo production optimization*
