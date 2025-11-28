# WPF Enhancement Plan v0.2.0

## Current State Analysis

### What Works (DO NOT CHANGE)
| Component | Status | Notes |
|-----------|--------|-------|
| `wpf create` | ✅ Working | Project creation wizard |
| `wpf continue` | ✅ Working | Resume projects |
| `wpf list` | ✅ Working | Registry management |
| `wpf deploy` | ✅ Working | Host-agnostic deployment |
| `wpf test` | ✅ Working | Multi-target testing |
| `wpf backup` | ✅ Working | Backup creation |
| `wpf doctor` | ✅ Working | Health checks |
| `wpf knowledge` | ✅ Working | Knowledge base |
| `wpf learn` | ✅ Working | Learning capture |
| Docker templates | ✅ Working | WordPress + MySQL + Redis |
| Theme templates | ✅ Working | Tailwind CSS responsive |
| Plugin templates | ✅ Working | CPT + taxonomies |
| Test templates | ✅ Working | Playwright E2E |
| Hosting abstraction | ✅ Working | SFTP/FTP/rsync providers |

### What's Missing (NatiGeo Pain Points)

1. **Build Pipeline** - Manual npm/ImageMagick steps
2. **Plugin Optimization** - Manual PHP script execution
3. **Deployment Verification** - Manual file comparison

---

## Phase 1: Core Pipeline Commands (SAFE ADDITIONS)

### 1.1 `wpf build` - Asset Compilation

**Purpose:** Compile CSS, optimize images, generate critical CSS

**Usage:**
```bash
wpf build              # Build all assets
wpf build css          # Tailwind CSS only
wpf build images       # Optimize images only
wpf build critical     # Generate critical CSS
wpf build watch        # Watch mode for dev
```

**Implementation:**
```
/cli/build.sh                    # Main command
/templates/scripts/build/
├── build-css.sh                 # Tailwind compilation
├── build-images.sh              # Image optimization
├── build-critical.sh            # Critical CSS generation
└── build-all.sh                 # Orchestrator
```

**Dependencies:** npm, ImageMagick, cwebp (WebP), critical (npm)

---

### 1.2 `wpf optimize` - Plugin Configuration

**Purpose:** Auto-configure performance and SEO plugins

**Usage:**
```bash
wpf optimize           # Run all optimizations
wpf optimize plugins   # Install & configure plugins
wpf optimize seo       # Rank Math configuration
wpf optimize cache     # Autoptimize + Redis
wpf optimize images    # ShortPixel configuration
wpf optimize validate  # Verify all settings
```

**Implementation:**
```
/cli/optimize.sh                      # Main command
/templates/scripts/optimize/
├── install-plugins.sh                # Plugin installation
├── configure-rank-math.php           # SEO setup
├── configure-autoptimize.php         # CSS/JS optimization
├── configure-shortpixel.php          # Image optimization
├── configure-redis.php               # Object caching
├── configure-wp-mail-smtp.php        # Email delivery
└── validate-configuration.php        # Validation
```

**Reads from .wpf-config:**
- COMPANY_NAME → Rank Math LocalBusiness
- DOMAIN → SEO settings
- SHORTPIXEL_API_KEY → Image optimization

---

### 1.3 `wpf verify` - Deployment Verification

**Purpose:** Verify deployment success and performance

**Usage:**
```bash
wpf verify             # Run all verifications
wpf verify files       # Compare local vs remote
wpf verify smoke       # HTTP smoke tests
wpf verify performance # Quick Lighthouse audit
```

**Implementation:**
```
/cli/verify.sh                   # Main command
```

**Features:**
- MD5 hash comparison (local vs remote)
- HTTP status checks (homepage, admin, API)
- Response time measurement
- Optional Lighthouse audit

---

## Phase 2: Workflow Integration

### 2.1 Enhanced `wpf create`

After project creation, automatically run:
```bash
cd project-dir
npm install
wpf build
```

### 2.2 Enhanced `wpf deploy`

Add flags:
```bash
wpf deploy production --build      # Build before deploy
wpf deploy production --optimize   # Run optimizations after
wpf deploy production --verify     # Verify after deploy
wpf deploy production --full       # All of the above
```

### 2.3 Complete Workflow Command

```bash
wpf workflow production   # build → deploy → optimize → verify
```

---

## Phase 3: Future Enhancements (v0.3.0+)

### 3.1 `wpf discover` - Discovery Wizard

Interactive questionnaire to generate custom config:
- Business type and services
- Color scheme preferences
- Layout preferences
- Content structure

### 3.2 `wpf content` - Content Generation

AI-assisted content creation:
- Generate placeholder content
- Import from existing HTML site
- Service/product descriptions

### 3.3 `wpf auto` - Full Automation

Complete hands-off site creation:
```bash
wpf auto --business "NatiGeo environmental consulting"
# Creates project, generates content, builds, deploys, verifies
```

---

## Implementation Priority

| Priority | Command | Effort | Impact | Risk | Status |
|----------|---------|--------|--------|------|--------|
| 1 | `wpf build` | Medium | High | Low | ✅ DONE |
| 2 | `wpf optimize` | Medium | High | Low | ✅ DONE |
| 3 | `wpf verify` | Low | Medium | Low | ✅ DONE |
| 4 | Workflow flags | Low | Medium | Low | ✅ DONE |
| 5 | Template scripts | Medium | High | Low | ✅ DONE |
| 6 | `wpf discover` | High | High | Medium | ✅ DONE |
| 7 | `wpf content` | High | Medium | Medium | ✅ DONE |
| 8 | `wpf auto` | Medium | High | High | ✅ DONE |

**All Phase 1-3 enhancements completed on 2025-11-28**

---

## Files to Create

```
/home/atric/wp-site-factory/
├── cli/
│   ├── build.sh          # NEW
│   ├── optimize.sh       # NEW
│   └── verify.sh         # NEW
├── templates/
│   └── scripts/
│       ├── build/
│       │   ├── build-css.sh
│       │   ├── build-images.sh
│       │   └── build-critical.sh
│       └── optimize/
│           ├── install-plugins.sh
│           ├── configure-rank-math.php
│           ├── configure-autoptimize.php
│           ├── configure-shortpixel.php
│           ├── configure-redis.php
│           └── validate-configuration.php
└── bin/
    └── wpf               # UPDATE (add new commands)
```

---

## Risk Mitigation

1. **All changes are ADDITIVE** - No existing code modified
2. **Templates enhanced** - Not replaced
3. **Backward compatible** - Existing projects work unchanged
4. **NatiGeo testing** - Real project to validate changes
5. **Incremental rollout** - One command at a time

---

## Testing Strategy

1. Create new test project with `wpf create test-project`
2. Test each new command in isolation
3. Test full workflow on NatiGeo (already deployed)
4. Document any issues in learnings system

---

## Success Metrics

After implementation:
- Project creation to deployed site: **< 30 minutes** (vs 2-4 hours)
- Plugin configuration: **< 2 minutes** (vs 30+ minutes)
- Build process: **< 1 minute** (vs 5-10 minutes manual)
- Deployment verification: **< 30 seconds** (vs 5+ minutes)

---

## Next Steps

1. Review this plan
2. Approve Phase 1 implementation
3. Start with `wpf build` command
4. Test on NatiGeo project
5. Proceed to next command

---

*Generated: 2025-11-28*
*Based on: NatiGeo project experience*
*Version: WPF 0.1.0-beta → 0.2.0*
