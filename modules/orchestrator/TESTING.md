# Stock Photo Automation - Testing Guide

## Quick Start

```bash
# Basic test (dry run)
node test-automation.js basic

# Full test with file output
node test-automation.js full

# Test different industries
node test-automation.js industry
```

## Test Results (Expected)

### ✅ Basic Test
```
Success: true
Images generated: Yes
Categories: hero, services, about, testimonials
Total photos: 12
```

### ✅ Industry Test
Each industry generates unique photos based on keywords:

- **Construction**: "construction site", "building construction", "workers"
- **Healthcare**: "medical team", "hospital", "doctor", "nurse"
- **Restaurant**: "restaurant interior", "food plating", "chef cooking"
- **Technology**: "technology office", "software development", "coding"

### ✅ Cache Verification
```bash
ls -lh output/stock-photos-cache/

# Expected:
# - Files like: unsplash-<id>-regular.png, pexels-<id>-large.jpg
# - 2 sizes per photo: regular (~50-200KB), large (~500KB-2MB)
# - Cache persists between runs (no re-download)
```

## Integration Test

Test the full workflow with blueprint:

```javascript
import { assembleTheme } from './src/lib/phase2/theme-assembler.js';
import fs from 'fs/promises';

const blueprint = JSON.parse(
  await fs.readFile('./examples/blueprint-v1.0.json', 'utf-8')
);

const result = await assembleTheme(blueprint, {
  outputDir: './output/my-test-theme',
  generateImages: true
});

// Check results
console.log('Success:', result.success);
console.log('Images:', Object.keys(result.images));
console.log('Files:', result.files.length);

// Check assembly report
const report = JSON.parse(
  await fs.readFile('./output/my-test-theme/assembly-report.json', 'utf-8')
);

console.log('Total photos:', report.images.totalPhotos);
```

## Verify Image Assignment

Images are automatically assigned to pattern content:

```javascript
// Check hero pattern got images
console.log(result.patterns.hero.content.image_url);
console.log(result.patterns.hero.content.images);

// Each pattern with images will have:
// - content.images: Array of image objects
// - content.image_url: Primary image URL (for hero/about)
// - content.image_path: Primary image local path
```

## API Rate Limits

- **Unsplash**: 50 requests/hour (Demo)
- **Pexels**: 200 requests/hour

If you hit rate limits:
1. Use cached images (cache is persistent)
2. Wait an hour
3. Or test with fewer patterns/industries

## Troubleshooting

### No images generated
```bash
# Check API keys
cat .env | grep API_KEY

# Should see:
# UNSPLASH_API_KEY=WA2m...
# PEXELS_API_KEY=eUfv...
```

### Photos not downloading
```bash
# Test API directly
node -e "
import { StockPhotoIntegration } from './src/lib/phase2/content-generator.js';
const api = new StockPhotoIntegration();
const photos = await api.searchUnsplash('hero image', 3);
console.log(photos.length, 'photos found');
"
```

### Clear cache
```bash
rm -rf output/stock-photos-cache/*
```

## Test Options Reference

| Test | Command | Description |
|------|---------|-------------|
| Basic | `node test-automation.js basic` | Dry run with images |
| Disabled | `node test-automation.js disabled` | Test without images |
| Full | `node test-automation.js full` | Write files to disk |
| Industry | `node test-automation.js industry` | Test all industries |
| Direct | `node test-automation.js direct` | Test ContentGenerator |

## CI/CD Integration

Add to your test pipeline:

```yaml
# .github/workflows/test.yml
- name: Test Stock Photo Automation
  run: |
    node test-automation.js basic
    node test-automation.js disabled
  env:
    UNSPLASH_API_KEY: ${{ secrets.UNSPLASH_API_KEY }}
    PEXELS_API_KEY: ${{ secrets.PEXELS_API_KEY }}
```

## Performance Expectations

| Operation | Time | Notes |
|-----------|------|-------|
| First run (download) | 10-20s | 3 photos × 4 categories |
| Cached run | 1-2s | Reads from cache |
| Per photo download | 500ms-2s | Depends on size |

## Success Criteria

✅ **All tests passing:**
- Basic test generates 12+ photos
- Industry test generates unique photos per industry
- Images cached correctly
- Attribution included
- No errors in assembly

✅ **Assembly report includes:**
- `images.totalPhotos` > 0
- `images.categories` array populated
- Each pattern shows `images` count

✅ **Pattern content updated:**
- Hero pattern has `image_url` field
- About pattern has `image_url` field
- All patterns have `images` array (if applicable)
