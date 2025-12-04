# Pre-Launch Checklist

Complete all items before launching to production.

---

## Content Checklist

### Text Content
- [ ] No lorem ipsum anywhere
- [ ] All headings are meaningful
- [ ] No spelling or grammar errors
- [ ] Contact information is correct
- [ ] Business hours are accurate
- [ ] All links work (no 404s)
- [ ] Copyright year is current

### Images
- [ ] All images load correctly
- [ ] All images have alt text
- [ ] Images are optimized (< 200KB)
- [ ] WebP versions available
- [ ] No placeholder images remain
- [ ] Logo displays correctly at all sizes

### Legal
- [ ] Privacy policy page exists
- [ ] Terms of service (if needed)
- [ ] Cookie notice (if required by law)
- [ ] GDPR compliance (EU visitors)

---

## Technical Checklist

### Performance
- [ ] Lighthouse score > 70
- [ ] LCP < 2.5 seconds
- [ ] CLS < 0.1
- [ ] Critical CSS generated
- [ ] JavaScript deferred
- [ ] Images lazy loaded
- [ ] Gzip enabled

### SEO
- [ ] Page titles unique (< 60 chars)
- [ ] Meta descriptions (< 160 chars)
- [ ] H1 on every page
- [ ] Heading hierarchy correct
- [ ] XML sitemap generated
- [ ] robots.txt configured
- [ ] Canonical URLs set
- [ ] Open Graph tags
- [ ] Schema markup (LocalBusiness)

### Security
- [ ] SSL certificate installed
- [ ] HTTPS redirect enabled
- [ ] WordPress debug disabled
- [ ] Security headers configured
- [ ] Admin URL not default (optional)
- [ ] Strong admin password
- [ ] File permissions correct

### Functionality
- [ ] Contact form sends email
- [ ] Contact form shows success message
- [ ] Newsletter signup works (if present)
- [ ] All navigation links work
- [ ] Mobile menu works
- [ ] Search works (if present)
- [ ] 404 page exists

---

## Accessibility Checklist

### Visual
- [ ] Color contrast ≥ 4.5:1
- [ ] Text readable without zoom
- [ ] No text in images
- [ ] Focus states visible

### Navigation
- [ ] Skip to content link
- [ ] Keyboard navigation works
- [ ] Tab order is logical
- [ ] No keyboard traps

### Content
- [ ] Alt text on all images
- [ ] Form fields have labels
- [ ] Error messages are clear
- [ ] Links are descriptive

---

## Browser Testing

### Desktop Browsers
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Mobile Devices
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] Responsive at all breakpoints

### Screen Sizes
- [ ] 320px (small phone)
- [ ] 375px (iPhone)
- [ ] 768px (tablet)
- [ ] 1024px (laptop)
- [ ] 1440px (desktop)
- [ ] 1920px (large desktop)

---

## SEO Verification

### Google Tools
- [ ] Google Search Console verified
- [ ] Sitemap submitted
- [ ] No crawl errors

### Analytics
- [ ] Google Analytics installed
- [ ] Goals configured
- [ ] Filters for internal traffic

---

## Backup & Recovery

- [ ] Full backup created
- [ ] Database exported
- [ ] Backup tested (can restore)
- [ ] Backup location documented

---

## Documentation

- [ ] Login credentials documented
- [ ] Hosting information documented
- [ ] DNS settings documented
- [ ] Third-party services listed
- [ ] Client training completed (if needed)

---

## Final Steps

### Before Going Live
1. [ ] All above checklists complete
2. [ ] Client approval received
3. [ ] DNS pointing to production
4. [ ] SSL verified working
5. [ ] Cache cleared

### After Going Live
1. [ ] Verify all pages load
2. [ ] Test contact form
3. [ ] Check Google Search Console
4. [ ] Monitor for errors (24 hours)
5. [ ] Share launch with client

---

## Quick Command Reference

```bash
# Run all tests
wpf test

# Create backup
wpf backup

# Deploy to production
wpf deploy production

# Health check
wpf doctor
```

---

## Sign-Off

**Pre-launch verified by:** _______________

**Date:** _______________

**Client approved:** [ ] Yes

---

*Checklist completed with WPF*
