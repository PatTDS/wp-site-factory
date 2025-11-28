# WPF - WordPress Site Factory

## Overview

WPF (WordPress Site Factory) is a CLI-driven framework for rapidly creating production-ready WordPress websites. It contains accumulated knowledge from real projects, validated best practices, and reusable templates.

**Goal:** Create professional websites from initial concept to production deployment in the shortest possible time.

## Quick Start

```bash
# Add to PATH (one time)
export PATH="$PATH:/home/atric/wp-site-factory/bin"

# Create new project
wpf create company-name

# Continue existing project
wpf continue company-name

# List all projects
wpf list
```

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

See `knowledge/wordpress/plugin-setup.md` for WP-CLI commands.

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
│   ├── deploy.sh          # Deploy to hosting
│   ├── test.sh            # Run tests
│   ├── backup.sh          # Create backups
│   ├── doctor.sh          # Health check
│   ├── list.sh            # List projects
│   └── knowledge.sh       # Browse knowledge
│
├── knowledge/              # Accumulated knowledge
│   ├── wordpress/         # WP best practices
│   ├── webdesign/         # UI/UX guidelines
│   ├── deployment/        # Hosting guides
│   ├── performance/       # Optimization
│   └── testing/           # Test strategies
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
└── projects/              # Created projects
```

## Key Knowledge Files

### WordPress Development
- `knowledge/wordpress/best-practices.md` - Code standards, security
- `knowledge/wordpress/plugin-setup.md` - Plugin configuration
- `knowledge/wordpress/troubleshooting.md` - Common issues
- `knowledge/wordpress/lessons-learned.md` - Real project insights

### Web Design
- `knowledge/webdesign/web-design-guide-for-llms.md` - Comprehensive guide (40k+ words)
- `knowledge/webdesign/beautiful-backgrounds-2025.md` - Modern backgrounds
- `knowledge/webdesign/shadcn-ui-integration.md` - Component library

### Deployment
- `knowledge/deployment/deployment.md` - Full deployment workflow

### Performance
- `knowledge/performance/optimization-guide.md` - Lighthouse optimization

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

## Creating New Projects - AI Instructions

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

4. **Before launch**:
   - Complete `prompts/pre-launch.md` checklist
   - Run full test suite
   - Create backup
   - Deploy to staging first

5. **After launch**:
   - Monitor for 24 hours
   - Verify analytics working
   - Document project completion

## Version

WPF v1.0.0
Based on NatiGeo project experience
Created: 2025-11-28

---

*This framework is designed for rapid WordPress development with AI assistance.*
