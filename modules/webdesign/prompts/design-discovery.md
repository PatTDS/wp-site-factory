# WPF Design Discovery Prompt

Use this prompt to gather all information needed to create a beautiful website design.

---

## Phase 1: Business Understanding

### Company Basics
1. **What is the company name?** (exactly as it should appear on the website)
2. **What industry/sector?** (industrial, professional services, healthcare, technology, ecommerce, hospitality)
3. **What is the primary business?** (one sentence description)
4. **What makes this company unique?** (key differentiators)

### Target Audience
5. **Who is the ideal customer?** (demographics, role, industry)
6. **What problem does the company solve for them?**
7. **What action should visitors take?** (call, fill form, book appointment, etc.)

---

## Phase 2: Brand Identity

### Visual Identity
8. **Do they have existing brand colors?** If yes, provide hex codes:
   - Primary color: #______
   - Secondary color: #______
   - Any colors to avoid?

9. **Do they have a logo?**
   - If yes: Get file (preferably SVG or high-res PNG)
   - If no: What letter/initial should represent the brand?

10. **What feeling should the site evoke?**
    - [ ] Professional & Trustworthy
    - [ ] Modern & Innovative
    - [ ] Warm & Approachable
    - [ ] Bold & Energetic
    - [ ] Elegant & Sophisticated

### Tone of Voice
11. **How should the content sound?**
    - [ ] Formal & Corporate
    - [ ] Professional but Friendly
    - [ ] Casual & Conversational
    - [ ] Technical & Expert

---

## Phase 3: Content Requirements

### Core Pages Needed
12. **Which pages are required?** (check all that apply)
    - [ ] Home
    - [ ] About Us
    - [ ] Services (list each: ____________)
    - [ ] Products/Portfolio
    - [ ] Team/About the Founder
    - [ ] Testimonials/Case Studies
    - [ ] Contact
    - [ ] Blog/News
    - [ ] FAQ
    - [ ] Other: ____________

### Hero Section
13. **What is the main headline message?** (primary value proposition)
14. **What is the supporting subheadline?**
15. **Primary CTA button text?** (e.g., "Get a Quote", "Contact Us", "Learn More")
16. **Secondary CTA button text?** (optional)

### Key Statistics
17. **What impressive numbers can be shown?** (provide 3-4)
    - Example: "15+ Years Experience"
    - Example: "500+ Projects Completed"
    - Example: "98% Customer Satisfaction"
    - 1. ____________
    - 2. ____________
    - 3. ____________
    - 4. ____________

### Services/Products
18. **List the main services/products** (up to 6)
    For each, provide:
    - Service name
    - Short description (1-2 sentences)
    - 3-4 key features/benefits

### Social Proof
19. **Do they have testimonials?** If yes, provide:
    - Quote text
    - Customer name
    - Company/Role
    - (Repeat for 3-6 testimonials)

20. **Any certifications, awards, or trust badges?**

---

## Phase 4: Contact Information

### Contact Details
21. **Phone number:** ____________
22. **Email address:** ____________
23. **Physical address:** ____________
24. **Business hours:**
    - Monday-Friday: ____________
    - Saturday: ____________
    - Sunday: ____________

### Social Media
25. **Social media profiles:**
    - Facebook: ____________
    - Instagram: ____________
    - LinkedIn: ____________
    - Other: ____________

---

## Phase 5: Technical Details

### Domain & Hosting
26. **Domain name?** (example.com)
27. **Hosting provider?** (if known)
28. **Email hosting?** (same as web hosting? separate?)

### Existing Assets
29. **Any existing content to migrate?**
30. **Photo assets available?** (product photos, team photos, office photos)
31. **Video content?** (YouTube links, promotional videos)

---

## Phase 6: Design Preferences

### Reference Websites
32. **Any websites they like?** (3-5 examples with what they like about each)

### Component Preferences
33. **Hero style preference:**
    - [ ] Split with floating cards (stats visible in hero)
    - [ ] Centered with gradient text (clean, minimal)
    - [ ] Full image background (visual impact)

34. **Overall layout preference:**
    - [ ] Modern with lots of white space
    - [ ] Information-dense, professional
    - [ ] Bold colors and graphics

---

## After Discovery: Design Selection

Based on responses, AI should:

1. **Select industry preset** from: industrial, professional-services, healthcare, technology, ecommerce, hospitality

2. **Choose components:**
   - Header: header-modern or header-transparent
   - Hero: hero-split-cards, hero-centered, or hero-image-bg
   - Stats: stats-cards or stats-inline
   - Services: services-cards
   - Features: features-grid or features-alternating
   - Testimonials: testimonials-cards or testimonials-carousel
   - CTA: cta-gradient or cta-split
   - Contact: contact-split or contact-centered
   - Footer: footer-comprehensive or footer-minimal

3. **Generate design.json** with all content filled in

4. **Preview and iterate** until approved

---

## Quick Discovery (15-minute version)

For faster projects, ask only:

1. Company name and industry?
2. One-sentence business description?
3. Brand colors (or let system choose)?
4. Phone and email?
5. Main services (names only)?
6. Key statistic/achievement?
7. Main CTA action?

Then use intelligent defaults for everything else.
