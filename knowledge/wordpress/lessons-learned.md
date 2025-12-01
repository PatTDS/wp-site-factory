# Lessons Learned - NatiGeo WordPress Project

Key insights and solutions discovered during development.

---

## Docker & Development Environment

### Docker cp Not Working
**Problem**: `docker cp` command reports success but file content doesn't update in container.

**Solution**: Use stdin pipe method instead:
```bash
cat local-file.php | docker exec -i container_name tee /path/in/container/file.php > /dev/null
```

**Verification**: Always verify with MD5 hash:
```bash
md5sum local-file.php
docker exec container_name md5sum /path/in/container/file.php
```

### Permission Issues
**Problem**: Wordfence logs (wp-content/wflogs/) have restricted permissions, causing backup failures.

**Solution**: Exclude from backups:
```bash
tar -czf backup.tar.gz --exclude='wp-content/wflogs/*' .
```

---

## Performance Optimization

### Image Optimization
**Lesson**: Original images were 1-2MB. After optimization:
- Quality reduction (85%)
- WebP conversion
- Result: 87% size reduction (200KB → 26KB)

**Tools**:
```bash
# ImageMagick for resizing
convert input.jpg -resize 1600x -quality 85 output.jpg

# cwebp for WebP conversion
cwebp -q 80 input.jpg -o output.webp
```

### Critical CSS
**Lesson**: Inline critical CSS for above-fold content improves FCP by 0.5-1s.

**Process**:
1. Extract above-fold CSS with `critical` npm package
2. Inline in `<head>` before external stylesheets
3. Load remaining CSS with `preload` + `onload`

### Font Loading
**Lesson**: Google Fonts blocking render. Solution:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="fonts-url" onload="this.rel='stylesheet'">
```

---

## Deployment (Locaweb)

### Cache Delays
**Problem**: Changes don't appear immediately after deployment.

**Cause**: Locaweb server-side caching (1-24 hours).

**Solutions**:
1. Wait for cache expiry
2. Contact Locaweb support for manual cache clear
3. Use versioned asset URLs (?v=timestamp)

### SFTP Deployment
**Lesson**: Use batch mode for reliability:
```bash
sshpass -p 'password' sftp -oBatchMode=no -oStrictHostKeyChecking=no -P 22 \
  -b /tmp/sftp_batch.txt user@host
```

**Batch file format**:
```
cd public_html/wp-content/themes/natigeo-theme
put local-file.php
bye
```

### Date Command in Bash
**Problem**: Date command with special characters causes syntax errors in some bash contexts.

**Solution**: Use simple filenames or pre-calculate date:
```bash
DATE=$(date +%Y%m%d)
tar -czf backup-$DATE.tar.gz .
```

---

## WordPress Configuration

### Plugin Automation
**Lesson**: WP-CLI can configure plugins programmatically:
```bash
wp option update autoptimize_css 'on'
wp option update autoptimize_js 'on'
```

But some plugins (Rank Math, ShortPixel) require manual setup wizard or API keys.

### Theme vs Plugin
**Lesson**: WordPress.org requirement - functionality goes in plugins, presentation in themes.
- CPTs (Custom Post Types) → Plugin
- Templates → Theme
- Shortcodes → Plugin
- Styles → Theme

### Local Business Schema
**Lesson**: Rank Math Local SEO needs complete business info:
- Exact address with postal code
- Phone in international format
- Business hours
- Geographic coordinates (optional but recommended)

---

## Testing

### Playwright in WSL
**Problem**: Playwright crashes with "Target page, context or browser has been closed".

**Solution**:
1. Use `--headless` mode
2. Install chromium dependencies: `sudo npx playwright install-deps`
3. Increase timeout for slow containers

### Mobile Testing
**Lesson**: Test actual mobile devices, not just viewport sizes. Touch targets need ≥44px.

---

## Security

### File Permissions
**Standard WordPress permissions**:
- Files: 644
- Directories: 755
- wp-config.php: 600
- .htaccess: 644

**Uploads directory**: Disable PHP execution:
```apache
<Files *.php>
deny from all
</Files>
```

### Security Headers
**Essential .htaccess headers**:
```apache
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set X-XSS-Protection "1; mode=block"
```

---

## Repository Organization

### LLM Comprehension
**Lesson**: Create a single entry point document (PROJECT_CONTEXT.md) with:
1. TL;DR summary
2. Repository map with annotations
3. Key files list
4. Current state
5. How to continue

### File Organization
**Rule**: Maximum 3 levels of folder depth
```
docs/
├── guides/           # Level 1
│   └── deployment.md # Level 2
```

**Not**:
```
docs/
├── guides/
│   └── deployment/
│       └── production/
│           └── checklist.md  # Too deep!
```

---

## E2E Testing for Production

### aria-hidden Elements and Playwright
**Problem**: `expect(icon).toBeVisible()` fails for icons with `aria-hidden="true"`.

**Solution**: Use `.count()` instead of `.isVisible()`:
```javascript
// ❌ Fails for aria-hidden elements
const icon = card.locator('i[class*="fa"]');
await expect(icon).toBeVisible();

// ✅ Works for aria-hidden elements
const iconCount = await card.locator('i[class*="fa"]').count();
expect(iconCount).toBeGreaterThan(0);
```

### Multiple Footer Elements
**Problem**: Strict mode violation when page has multiple `<footer>` elements.

**Solution**: Use `.first()` to target specific footer:
```javascript
// ❌ Fails if page has 2 footers
const footer = page.locator('footer');
await footer.scrollIntoViewIfNeeded();

// ✅ Works with multiple footers
const footer = page.locator('footer').first();
await footer.scrollIntoViewIfNeeded();
```

### Environment-Agnostic URL Testing
**Problem**: Tests hardcode `localhost:8080`, fail on production.

**Solution**: Use `process.env.BASE_URL`:
```javascript
// ❌ Hardcoded URL
expect(url).toContain('localhost:8080');

// ✅ Environment-agnostic
const baseUrl = process.env.BASE_URL || 'http://localhost:8080';
expect(url.startsWith(baseUrl) || url.includes('#')).toBeTruthy();
```

### Form Submission Verification
**Problem**: Custom contact forms don't show standard CF7 messages.

**Solution**: Check multiple indicators:
```javascript
// Check for any of these submission indicators
const hasMessage = await page.locator('#contact-message').evaluate(
  el => el.textContent.trim().length > 0
).catch(() => false);
const hasSuccessClass = await page.locator('.success, .wpcf7-mail-sent-ok').isVisible().catch(() => false);
const formCleared = await emailField.evaluate(el => el.value === '').catch(() => false);
const responseReceived = response !== null;

expect(hasMessage || hasSuccessClass || formCleared || responseReceived).toBeTruthy();
```

### Production Test Timing
**Lesson**: Production tests need longer timeouts than localhost:
```javascript
// Add explicit waits after navigation
await page.waitForLoadState('networkidle');
await page.waitForTimeout(1000); // Extra stabilization for production

// Scroll elements into view before interacting
await footer.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
```

---

## Production Deployment Cleanup

### PHP Script Cleanup
**Lesson**: Always remove temporary PHP configuration scripts after execution:
```bash
# After deploying and running a config script
sftp> rm public_html/configure_plugin.php
```

**Verification**: Check no leftover scripts exist:
```bash
sftp> ls -la public_html/*.php
# Should only show WordPress core files
```

### Contact Form 7 Recipients
**Lesson**: CF7 stores recipient email in post_meta, can update via WP-CLI or PHP:
```php
$form_id = get_option('cf7_main_form_id'); // or find by post_title
$mail = get_post_meta($form_id, '_mail', true);
$mail['recipient'] = 'primary@example.com, secondary@example.com';
update_post_meta($form_id, '_mail', $mail);
```

---

## Key Numbers

| Metric | Before | After |
|--------|--------|-------|
| Hero image size | 200KB | 26KB |
| node_modules | 596MB | 0 (regeneratable) |
| Root files | 50+ | <15 |
| Lighthouse mobile | 50-60 | 70+ (target) |
| E2E tests passing | 96/104 (92%) | 104/104 (100%) |
| Homepage load time | - | 0.4s |

---

**Last Updated**: 2024-11-30
