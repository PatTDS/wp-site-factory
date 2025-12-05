# Video vs Image Effectiveness Research

**Category:** Media Best Practices
**Last Updated:** 2024-12-05
**Purpose:** Guide decision-making for hero sections and website media
**Status:** Research summary - requires ongoing updates

---

## Executive Summary

**Current Recommendation:** Default to optimized static images for most industries. Consider video for hospitality, fitness, food/beverage, and entertainment sectors where motion demonstrates value.

**Key Finding:** Static images with proper optimization outperform video on Core Web Vitals metrics, which directly impacts SEO ranking.

---

## Performance Impact (Core Web Vitals)

### Largest Contentful Paint (LCP)

| Media Type | Typical LCP Impact | SEO Risk |
|------------|-------------------|----------|
| Optimized image (WebP, <200KB) | +0.2-0.5s | Low |
| Unoptimized image (JPEG, >500KB) | +1-2s | Medium |
| Background video (autoplay) | +1.5-4s | High |
| Video poster + lazy video | +0.3-0.8s | Low-Medium |

**Google's LCP threshold:** <2.5s for "Good" rating

### Cumulative Layout Shift (CLS)

Video can cause CLS if:
- No aspect-ratio defined
- Poster image dimensions don't match video
- Controls appear/disappear unexpectedly

**Mitigation:** Always set `aspect-ratio` and use matching poster image.

### Total Blocking Time (TBT)

Video JavaScript (play/pause controls, analytics) can block main thread.

**Recommendation:** Defer video loading until after LCP.

---

## Conversion Impact by Industry

### Industries Where Video Shows Lift

| Industry | Video Lift vs Static | Notes |
|----------|---------------------|-------|
| Hospitality/Travel | +15-30% | Atmosphere matters |
| Food/Beverage | +10-25% | Motion shows freshness |
| Fitness | +20-35% | Demonstrates energy |
| Real Estate | +15-25% | Virtual tours |
| Entertainment | +25-40% | Content preview |

### Industries Where Static Performs Equal/Better

| Industry | Recommendation | Notes |
|----------|---------------|-------|
| B2B Services | Static | Professionalism over flash |
| Construction | Static | Quality/portfolio matters more |
| Healthcare | Static | Trust/credibility focus |
| Legal/Finance | Static | Conservative expectations |
| E-commerce | Static | Product clarity |

---

## When to Use Video

### Good Use Cases

1. **Demonstrating process** - How something works
2. **Showing atmosphere** - Hotel lobbies, restaurants
3. **Testimonial videos** - Real customers speaking
4. **Product in action** - Not just static product shots
5. **Entertainment preview** - Events, experiences

### Poor Use Cases

1. **Generic stock video** - Adds no value, slows page
2. **Text on video** - Accessibility issues, often skipped
3. **Autoplay with sound** - Immediate bounce
4. **Hero video on B2B** - Distracts from message

---

## Implementation Best Practices

### If Using Video

```html
<!-- Recommended pattern -->
<div class="hero" style="aspect-ratio: 16/9;">
  <img
    src="poster.webp"
    alt="Hero"
    class="hero-poster"
    fetchpriority="high"
  />
  <video
    class="hero-video"
    poster="poster.webp"
    muted
    playsinline
    preload="none"
    loading="lazy"
  >
    <source src="hero.webm" type="video/webm">
    <source src="hero.mp4" type="video/mp4">
  </video>
</div>

<script>
// Load video only after page is interactive
document.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector('.hero-video');
  video.load();
  video.play();
});
</script>
```

### Video Optimization

| Setting | Recommendation |
|---------|---------------|
| Duration | 10-30 seconds max |
| Resolution | 1080p max (720p for mobile) |
| Bitrate | 2-4 Mbps |
| Format | WebM (primary), MP4 (fallback) |
| Audio | Muted by default |
| Autoplay | Only if muted |
| Loop | Yes for ambient video |
| File size | <5MB for hero |

### If Using Static Images

```html
<img
  src="hero-800.webp"
  srcset="
    hero-400.webp 400w,
    hero-800.webp 800w,
    hero-1200.webp 1200w,
    hero-1920.webp 1920w
  "
  sizes="100vw"
  alt="Professional construction site"
  fetchpriority="high"
  decoding="async"
  width="1920"
  height="1080"
/>
```

---

## Mobile Considerations

### Data Usage

| Media Type | Typical Size | 4G Load Time |
|------------|--------------|--------------|
| Hero image (WebP) | 100-200KB | 0.1-0.3s |
| Hero video (WebM) | 3-8MB | 2-6s |

**Impact:** 40% of mobile users abandon sites that take >3s to load.

### Battery Drain

Video playback significantly increases battery usage. Users may perceive site as "heavy" or "slow" even if it loads quickly.

### Reduced Motion Preference

```css
@media (prefers-reduced-motion: reduce) {
  .hero-video {
    display: none;
  }
  .hero-poster {
    display: block;
  }
}
```

**Accessibility requirement:** Always respect `prefers-reduced-motion`.

---

## A/B Testing Recommendations

Before implementing video, test:

1. **Static image vs video** - Measure bounce rate, time on page
2. **Autoplay vs click-to-play** - Measure engagement
3. **With/without poster** - Measure LCP impact
4. **Mobile vs desktop** - May need different strategies

---

## WPF Recommendation by Industry

| Industry | Hero | Services | Testimonials |
|----------|------|----------|--------------|
| Construction | Image | Image | Image |
| Childcare | Image | Image | Image |
| Restaurant | Consider video | Image | Image |
| Fitness | Consider video | Image | Consider video |
| Hotel | Consider video | Image | Image |
| Professional Services | Image | Image | Image |
| Retail | Image | Image | Image |

---

## Implementation for WPF Phase 2

### Current Phase (MVP)
- **Default to static images** for all industries
- Fetch from Unsplash/Pexels (images only)
- Implement responsive srcset

### Future Phase
- Add industry-specific video option
- Implement lazy-loaded video with poster
- Add video to Pexels API integration
- A/B test framework for video vs static

---

## References

- Google Web.dev: Video best practices
- HTTP Archive: State of Images 2024
- Cloudinary: Image and Video Performance Report
- Core Web Vitals: LCP optimization guide
- Nielsen Norman Group: Video in UX Design
