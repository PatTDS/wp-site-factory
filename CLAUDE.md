<!-- BRANCH-RULES:START -->
# ⚠️ CRITICAL: Branch & Git Rules

**These rules are MANDATORY. Violating them can corrupt project history.**

## Protected Branches (NEVER commit directly)
- `main`, `master`, `develop`, `production`, `staging`
- If on protected branch → STOP and switch to feature branch first

## Module Branches (require explicit permission)
WPF uses a **module-per-branch** architecture:
- `module/webdesign` - Design tokens, components, v1 reference
- `module/orchestrator` - AI workflows, site generator, LLM integration
- `module/tools` - CLI framework, templates, Docker
- `module/platform` - Next.js SaaS dashboard
- `module/billing` - Stripe integration
- `module/infrastructure` - Deployment, file storage
- `module/seo`, `module/security`, `module/testing`, `module/performance`

**Rules:**
1. **NEVER switch to module/* branch without user explicitly requesting it**
2. **NEVER create new branches without user saying "create branch X"**
3. **NEVER merge branches without user approval**
4. **Always verify current branch before ANY git operation**

## Before ANY Git Operation
```bash
# ALWAYS run this first
git branch --show-current

# If wrong branch, ASK user before switching
# If on protected branch, STOP and ask user
```

## Commit Rules
- Only commit to current branch after verifying it's correct
- Never use `git checkout -b` without explicit permission
- Never use `git merge` without explicit permission
- Never use `--force` on any git command

**If uncertain about branch operations → ASK USER FIRST**
<!-- BRANCH-RULES:END -->

# WPF - WordPress Site Factory

**Version: 0.1.0-beta**

## Overview

WPF (WordPress Site Factory) is a CLI-driven framework for rapidly creating production-ready WordPress websites. It contains accumulated knowledge from real projects, validated best practices, and reusable templates.

**Goal:** Create professional websites from initial concept to production deployment in the shortest possible time.

**Status:** Beta - Under active development and testing.

## Quick Start

```bash
# Add to PATH (one time)
export PATH="$PATH:/home/atric/wp-site-factory/bin"

# Run interactive menu
wpf

# Or use direct commands:
wpf create company-name    # Create new project
wpf continue company-name  # Continue existing
wpf list                   # List all projects
wpf register /path/to/site # Register existing project
```

## Core Concepts

### Project Registry

WPF tracks all projects in `.wpf-registry.json`:
- Projects can live anywhere on your filesystem
- Use `wpf register` to add existing WordPress projects
- Use `wpf list` to see all registered projects
- Use `wpf continue <name>` to quickly switch between projects

### Learning System

Capture knowledge as you work:
- `wpf learn` - Record insights, fixes, discoveries
- `wpf knowledge review` - Review pending learnings
- `wpf knowledge merge` - Add learnings to knowledge base

Categories: wordpress, webdesign, deployment, performance, testing

## Module Architecture

WPF is organized into 10 independent modules, each with its own branch, rules, and resources. This architecture supports both CLI tool development and the eventual SaaS platform.

### Module Overview

| Module | Branch | Purpose | Status |
|--------|--------|---------|--------|
| **webdesign** | `module/webdesign` | Component library, design tokens, industry presets | Active |
| **tools** | `module/tools` | CLI framework, project registry, Docker, deployment | Core |
| **performance** | `module/performance` | Core Web Vitals, caching, image optimization | Planned |
| **seo** | `module/seo` | Schema markup, meta tags, sitemaps | Planned |
| **testing** | `module/testing` | Playwright E2E, Lighthouse CI, accessibility | Planned |
| **security** | `module/security` | Hardening scripts, headers, wp-config | Planned |
| **orchestrator** | `module/orchestrator` | AI workflows, learning capture, multi-agent | Planned |
| **platform** | `module/platform` | SaaS dashboard (Next.js, Prisma) | Planned |
| **billing** | `module/billing` | Stripe integration, subscriptions | Planned |
| **infrastructure** | `module/infrastructure` | Docker, CI/CD, Kubernetes | Planned |

### Module Structure

Each module follows a consistent structure:

```
modules/<name>/
├── src/            # Source code
├── lib/            # Shared utilities
├── tests/          # Module tests
├── README.md       # Module overview
├── RULES.md        # Coding standards
└── CLAUDE.md       # AI instructions (optional)
```

### Working with Modules

```bash
# Switch to module branch
git checkout module/webdesign

# View module rules
cat modules/webdesign/RULES.md

# Run module-specific commands
wpf design list          # webdesign module
wpf test lighthouse      # testing module
wpf seo schema          # seo module
```

### SaaS Roadmap

The modules build toward a full SaaS platform:

1. **Phase 1 (Current):** CLI tools for local development
   - tools, webdesign, performance, testing

2. **Phase 2:** API layer and orchestration
   - orchestrator, seo, security

3. **Phase 3:** SaaS platform
   - platform, billing, infrastructure

## Project Creation Workflow

### Step 1: Discovery (15-30 minutes)

Use `prompts/discovery.md` to gather:
- Company basics (name, location, contact)
- Brand identity (colors, logo, tone)
- Services/products list
- Required features
- Technical details (hosting, domain)

**Run:** `wpf create <project-name>` - interactive wizard

### Step 2: Setup (5-10 minutes)

After `wpf create`:
1. `cd /home/atric/wp-site-factory/projects/<project-name>`
2. `docker-compose up -d`
3. Open http://localhost:8080
4. Complete WordPress installation

### Step 3: Theme Development

1. Navigate to theme: `wp-content/themes/<project-name>-theme/`
2. Install dependencies: `npm install`
3. Start watching: `npm run watch`
4. Customize Tailwind config with brand colors
5. Build templates following the patterns

### Step 4: Content Creation

1. Create pages (Home, About, Services, Contact)
2. Set up navigation menus
3. Configure Contact Form 7
4. Add real content (no lorem ipsum!)

### Step 5: Plugin Configuration

Essential plugins to configure:
- **Rank Math SEO** - Local business schema, sitemap
- **Autoptimize** - CSS/JS optimization
- **ShortPixel** - Image optimization
- **Contact Form 7** - Forms

See `@\\wsl.localhost\Ubuntu\home\atric\wordpress-knowledge-base\tools\howto-development-environment.md` for WP-CLI commands.

### Step 6: Testing

```bash
wpf test  # Runs E2E + Lighthouse
```

Target: Lighthouse > 70

### Step 7: Deployment

```bash
wpf deploy staging     # Test deployment
wpf deploy production  # Final deployment
```

## Directory Structure

```
/home/atric/wp-site-factory/
├── bin/wpf                 # Main CLI entry point
├── cli/                    # CLI command scripts
│   ├── create.sh          # Create new project
│   ├── continue.sh        # Continue existing
│   ├── register.sh        # Register existing project
│   ├── unregister.sh      # Remove from registry
│   ├── list.sh            # List projects
│   ├── deploy.sh          # Deploy to hosting
│   ├── test.sh            # Run tests
│   ├── backup.sh          # Create backups
│   ├── doctor.sh          # Health check
│   ├── knowledge.sh       # Browse knowledge
│   ├── learn.sh           # Capture learning
│   ├── knowledge-review.sh  # Review learnings
│   └── knowledge-merge.sh   # Merge learnings
│
├── lib/                    # Shared libraries
│   ├── registry.sh        # Project registry functions
│   └── learnings.sh       # Learning capture functions
│
├── modules/                # Modular architecture (see Module Architecture)
│   ├── webdesign/         # Design system, components
│   ├── tools/             # CLI framework, Docker
│   ├── performance/       # Core Web Vitals, caching
│   ├── seo/               # Schema, meta tags
│   ├── testing/           # Playwright, Lighthouse
│   ├── security/          # Hardening, headers
│   ├── orchestrator/      # AI workflows
│   ├── platform/          # SaaS dashboard
│   ├── billing/           # Stripe, subscriptions
│   └── infrastructure/    # DevOps, CI/CD
│
├── knowledge/              # Local design knowledge
│   └── webdesign/         # UI/UX guidelines (general)
│
│   # WordPress knowledge is in external repo:
│   # @\\wsl.localhost\Ubuntu\home\atric\wordpress-knowledge-base\
│
├── learnings/              # Captured learnings (pending merge)
│   ├── wordpress/
│   ├── webdesign/
│   ├── deployment/
│   ├── performance/
│   └── testing/
│
├── templates/              # Project templates
│   ├── docker/            # Docker configs
│   ├── theme/             # Base theme
│   ├── plugin/            # Base plugin
│   ├── scripts/           # Utility scripts
│   └── tests/             # Test templates
│
├── prompts/               # AI prompts
│   ├── discovery.md       # Project questions
│   ├── design.md          # Design decisions
│   └── pre-launch.md      # Launch checklist
│
├── projects/              # WPF-created projects
└── .wpf-registry.json     # Project registry
```

## Commands Reference

### Project Management

| Command | Description |
|---------|-------------|
| `wpf` | Interactive menu |
| `wpf create <name>` | Create new project |
| `wpf continue <name>` | Resume project |
| `wpf list` | List all projects |
| `wpf register <path>` | Register existing project |
| `wpf unregister <name>` | Remove from registry |

### Development

| Command | Description |
|---------|-------------|
| `wpf deploy staging` | Deploy to staging |
| `wpf deploy production` | Deploy to production |
| `wpf test` | Run all tests |
| `wpf backup` | Create backup |
| `wpf doctor` | Health check |

### Knowledge

| Command | Description |
|---------|-------------|
| `wpf knowledge` | Browse knowledge base |
| `wpf learn` | Capture new learning |
| `wpf knowledge review` | Review learnings |
| `wpf knowledge merge` | Merge to knowledge base |

## Key Knowledge Files

### WordPress Knowledge Base (External Repo)
@\\wsl.localhost\Ubuntu\home\atric\wordpress-knowledge-base\

**Structure:** Diataxis-based with category folders (webdesign, seo, testing, security, performance, tools)

Key files:
- `tools/howto-development-environment.md` - Plugin setup, WP-CLI
- `tools/howto-deployment-automation.md` - Full deployment workflow
- `performance/howto-caching-setup.md` - Performance optimization
- `performance/ref-performance-targets.md` - Lighthouse targets
- `security/howto-security-hardening.md` - Security best practices
- `testing/howto-playwright-wordpress.md` - E2E testing

### Web Design
Now in external KB at `\\wsl.localhost\Ubuntu\home\atric\wordpress-knowledge-base\webdesign\`:
- `ref-tailwind-css.md` - Tailwind CSS reference
- `ref-shadcn-ui.md` - shadcn/ui components
- `ref-color-systems.md` - Color system design
- `ref-layout-patterns.md` - Layout patterns
- `howto-typography-system.md` - Typography setup
- `howto-css-performance.md` - CSS optimization

## Template Placeholders

When using templates, replace these placeholders:

| Placeholder | Description | Example |
|-------------|-------------|---------|
| `{{PROJECT_NAME}}` | Snake case project name | acme_corp |
| `{{PROJECT_NAME_UPPER}}` | Uppercase constant | ACME_CORP |
| `{{PROJECT_NAME_CLASS}}` | PascalCase class name | AcmeCorp |
| `{{COMPANY_NAME}}` | Display name | ACME Corporation |
| `{{DOMAIN}}` | Website domain | acme.com |
| `{{PRIMARY_COLOR}}` | Main brand color | #16a34a |
| `{{SECONDARY_COLOR}}` | Secondary color | #0f766e |
| `{{PHONE}}` | Phone number | (11) 99999-9999 |
| `{{EMAIL}}` | Email address | contact@acme.com |
| `{{ADDRESS}}` | Street address | 123 Main St |
| `{{CITY}}` | City name | São Paulo |
| `{{STATE}}` | State/province | SP |
| `{{HOURS}}` | Business hours | Mon-Fri 08:00-18:00 |

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | > 70 |
| Lighthouse Accessibility | > 90 |
| Lighthouse SEO | > 90 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| CSS Size (production) | < 20KB |

## Security Requirements

- [ ] Always sanitize input (`wp_sanitize_*`)
- [ ] Always escape output (`esc_*`)
- [ ] Use nonces for forms
- [ ] Disable file editing in production
- [ ] Keep WordPress updated
- [ ] Strong admin passwords

## Development Standards

### PHP
- PHP 8.0+ syntax
- WordPress Coding Standards
- Type hints where possible
- Clear function documentation

### CSS
- Tailwind CSS utility classes
- Build CSS before deployment
- Critical CSS for above-fold
- Mobile-first approach

### JavaScript
- Modern ES6+ syntax
- Defer non-critical scripts
- Minimize dependencies
- No inline JavaScript

## Common Commands

```bash
# Docker
docker-compose up -d      # Start environment
docker-compose down       # Stop environment
docker-compose logs -f    # View logs

# WordPress
wp core update            # Update WordPress
wp plugin list            # List plugins
wp cache flush            # Clear cache
wp search-replace         # URL replacement

# Theme
npm install               # Install dependencies
npm run build             # Build production CSS
npm run watch             # Watch for changes

# Testing
npx playwright test       # Run E2E tests
lighthouse http://...     # Performance audit
```

## Hosting Providers

### Locaweb (Brazil)
- SFTP: Use sshpass for automated deployment
- Path: `/public_html/`
- Note: 60s cache delay on changes

### Other Providers
- Update `cli/deploy.sh` with provider-specific paths
- Document FTP credentials in `.wpf-config`

## Troubleshooting

### Docker Issues
```bash
docker-compose down && docker-compose up -d
docker-compose logs wordpress
```

### Theme Not Updating
```bash
cd wp-content/themes/<theme>/
npm run build
```

### Database Connection
```bash
docker-compose restart db
```

### File Permissions
```bash
find . -type f -exec chmod 644 {} \;
find . -type d -exec chmod 755 {} \;
```

## AI Instructions

When asked to create a new website:

1. **First**, ask discovery questions from `prompts/discovery.md`
2. **Then**, run `wpf create <project-name>` or create manually:
   - Copy templates to projects folder
   - Replace all placeholders
   - Initialize git
   - Start Docker environment

3. **During development**:
   - Follow patterns in templates
   - Reference knowledge base for best practices
   - Test frequently with `wpf test`
   - **Capture learnings with `wpf learn`**

4. **Before launch**:
   - Complete `prompts/pre-launch.md` checklist
   - Run full test suite
   - Create backup
   - Deploy to staging first

5. **After launch**:
   - Monitor for 24 hours
   - Verify analytics working
   - Document project completion
   - **Merge any learnings with `wpf knowledge merge`**

## Registering Existing Projects

To add a WordPress project that wasn't created with WPF:

```bash
wpf register /path/to/my-wordpress-project

# Or with a custom name
wpf register /path/to/project custom-name
```

The registration wizard will:
- Auto-detect project info from existing files
- Create `.wpf-config` if missing
- Add to central registry

## Version

WPF v0.2.0-beta
Based on NatiGeo project experience
Created: 2025-11-28
Updated: 2025-12-03
Status: Modular architecture implemented

---

*This framework is designed for rapid WordPress development with AI assistance.*
*Version 0.1.0-beta - Being refined through real-world usage.*
- always use tmux orchestrator when tasks can safely and effectivally be done in parallel