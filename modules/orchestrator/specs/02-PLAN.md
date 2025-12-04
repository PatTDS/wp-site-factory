# WPF v2.0 - PLAN Phase

## Technical Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         WPF CLI                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ discover │  │  build   │  │ validate │  │  doctor  │        │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘        │
└───────┼─────────────┼─────────────┼─────────────┼───────────────┘
        │             │             │             │
        ▼             ▼             ▼             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Core Services                               │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │ ConfigLoader   │  │ TemplateEngine │  │ ComplianceChk  │     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │
│  │ DockerManager  │  │ WordPressSetup │  │ TestRunner     │     │
│  └────────────────┘  └────────────────┘  └────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Template Library                            │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐            │
│  │  Theme  │  │ Plugin  │  │ Docker  │  │  Tests  │            │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘            │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Generated Output                             │
│  projects/<name>/                                                │
│  ├── theme/              # WordPress theme                       │
│  ├── plugin/             # Companion plugin                      │
│  ├── docker-compose.yml  # Docker environment                    │
│  ├── tests/              # E2E tests                             │
│  └── wpf-config.yaml     # Project configuration                 │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| CLI Framework | Commander.js + Inquirer.js | Industry standard, TypeScript support |
| Template Engine | Hygen (EJS) | Lightweight, project-local templates |
| Build System | TypeScript + tsx | Type safety, fast execution |
| Docker | docker-compose v2 | Standard WordPress development |
| Testing | Playwright + Vitest | E2E and unit testing |
| WordPress | WP-CLI 2.12+ | Official CLI, comprehensive |

### Directory Structure (Improved)

```
/home/atric/wp-site-factory/
├── bin/
│   └── wpf                      # CLI entry point
│
├── src/                         # TypeScript source
│   ├── cli/
│   │   ├── index.ts            # CLI router
│   │   ├── commands/
│   │   │   ├── discover.ts     # Interactive discovery
│   │   │   ├── build.ts        # Main build command
│   │   │   ├── validate.ts     # Compliance check
│   │   │   └── doctor.ts       # Troubleshooting
│   │   └── prompts/
│   │       ├── company.ts      # Company info prompts
│   │       ├── branding.ts     # Colors, fonts
│   │       ├── pages.ts        # Page selection
│   │       └── sections.ts     # Section selection
│   │
│   ├── core/
│   │   ├── config-loader.ts    # YAML config parser
│   │   ├── template-engine.ts  # EJS template processor
│   │   ├── docker-manager.ts   # Docker lifecycle
│   │   ├── wordpress-setup.ts  # WP-CLI automation
│   │   ├── plugin-installer.ts # Plugin configuration
│   │   ├── content-creator.ts  # Pages, menus
│   │   └── test-runner.ts      # E2E, Lighthouse
│   │
│   ├── validators/
│   │   ├── compliance-checker.ts
│   │   ├── architecture.ts     # Theme+plugin check
│   │   ├── security.ts         # Security config check
│   │   ├── performance.ts      # Performance targets
│   │   └── seo.ts             # SEO setup check
│   │
│   └── types/
│       ├── config.ts           # Config schema (Zod)
│       ├── templates.ts        # Template types
│       └── compliance.ts       # Compliance types
│
├── _templates/                  # Hygen templates
│   ├── theme/
│   │   ├── base/               # Core theme files
│   │   │   ├── functions.php.ejs
│   │   │   ├── header.php.ejs
│   │   │   ├── footer.php.ejs
│   │   │   ├── style.css.ejs
│   │   │   └── index.php.ejs
│   │   ├── pages/              # Page templates
│   │   │   ├── front-page.php.ejs
│   │   │   ├── page.php.ejs
│   │   │   ├── page-about.php.ejs
│   │   │   ├── page-contact.php.ejs
│   │   │   ├── page-services.php.ejs
│   │   │   └── page-products.php.ejs
│   │   └── sections/           # Reusable sections
│   │       ├── hero-centered.php.ejs
│   │       ├── hero-split.php.ejs
│   │       ├── features-grid.php.ejs
│   │       ├── features-alternating.php.ejs
│   │       ├── cta-banner.php.ejs
│   │       ├── cta-split.php.ejs
│   │       ├── testimonials-carousel.php.ejs
│   │       ├── testimonials-grid.php.ejs
│   │       ├── contact-form.php.ejs
│   │       ├── contact-info.php.ejs
│   │       ├── team-grid.php.ejs
│   │       ├── pricing-table.php.ejs
│   │       ├── faq-accordion.php.ejs
│   │       └── gallery-grid.php.ejs
│   │
│   ├── plugin/
│   │   ├── base/
│   │   │   ├── plugin-main.php.ejs
│   │   │   └── class-loader.php.ejs
│   │   ├── includes/
│   │   │   ├── class-post-types.php.ejs
│   │   │   ├── class-taxonomies.php.ejs
│   │   │   ├── class-security.php.ejs
│   │   │   └── class-performance.php.ejs
│   │   └── admin/
│   │       └── class-admin.php.ejs
│   │
│   ├── docker/
│   │   ├── docker-compose.yml.ejs
│   │   ├── .env.ejs
│   │   └── uploads.ini.ejs
│   │
│   ├── scripts/
│   │   ├── setup-wordpress.sh.ejs
│   │   ├── configure-plugins.sh.ejs
│   │   ├── create-content.sh.ejs
│   │   └── security-hardening.sh.ejs
│   │
│   ├── tests/
│   │   ├── e2e/
│   │   │   ├── pages.spec.ts.ejs
│   │   │   ├── navigation.spec.ts.ejs
│   │   │   └── responsive.spec.ts.ejs
│   │   └── playwright.config.ts.ejs
│   │
│   └── config/
│       ├── wp-config-extra.php.ejs
│       ├── .htaccess.ejs
│       └── robots.txt.ejs
│
├── kb/                          # Codified KB requirements
│   ├── requirements.yaml        # All KB rules
│   ├── error-handlers.yaml      # Auto-recovery rules
│   └── section-library.yaml     # Available sections
│
├── projects/                    # Generated projects
│
└── package.json
```

### Configuration Schema

```yaml
# wpf-config.yaml schema
project:
  name: string              # kebab-case identifier
  version: string           # semver

company:
  name: string              # Display name
  tagline: string           # Short description
  industry: enum            # technology, healthcare, legal, restaurant, etc.

contact:
  email: string
  phone: string
  address:
    street: string
    city: string
    state: string
    postal_code: string
    country: string

branding:
  primary_color: string     # hex color
  secondary_color: string   # hex color
  font_family: string       # Google Font name
  logo_url: string?         # optional logo

pages:
  - slug: string
    title: string
    template: enum          # front-page, about, contact, services, products
    sections:               # only for front-page
      - type: enum          # hero-centered, features-grid, cta-banner, etc.
        config: object      # section-specific config

plugins:
  seo: wordpress-seo
  optimization: autoptimize
  images: shortpixel-image-optimiser
  forms: contact-form-7
  cache: redis-cache?       # optional

compliance:
  level: enum               # minimal, standard, strict
  # strict = 100% KB compliance

hosting:
  type: enum                # docker, sftp, rsync
  config: object            # provider-specific
```

### Build Pipeline

```
wpf build <project> --config=wpf-config.yaml

[1/14] Loading configuration...
       ├── Parsing wpf-config.yaml
       └── Validating against schema

[2/14] Generating theme files...
       ├── Processing base templates (8 files)
       ├── Processing page templates (5 files)
       └── Processing section templates (12 files)

[3/14] Generating companion plugin...
       ├── Processing plugin base (3 files)
       ├── Processing includes (4 files)
       └── Processing admin (1 file)

[4/14] Generating Docker environment...
       ├── docker-compose.yml
       ├── .env
       └── uploads.ini

[5/14] Generating scripts...
       ├── setup-wordpress.sh
       ├── configure-plugins.sh
       ├── create-content.sh
       └── security-hardening.sh

[6/14] Generating tests...
       ├── E2E test specs (3 files)
       └── playwright.config.ts

[7/14] Building assets...
       ├── npm install
       └── npm run build (Tailwind CSS)

[8/14] Starting Docker environment...
       ├── docker-compose up -d
       └── Waiting for healthy (max 60s)

[9/14] Installing WordPress...
       └── wp core install

[10/14] Activating theme & plugin...
        ├── wp theme activate
        └── wp plugin activate

[11/14] Configuring security...
        ├── wp config set DISALLOW_FILE_EDIT
        ├── Disabling XML-RPC
        └── Setting security headers

[12/14] Installing & configuring plugins...
        ├── wordpress-seo
        ├── autoptimize
        ├── shortpixel-image-optimiser
        └── contact-form-7

[13/14] Creating content...
        ├── Creating pages (5)
        ├── Creating menus (1)
        └── Setting homepage

[14/14] Running validation...
        ├── E2E tests (8/8 passed)
        ├── Lighthouse audit (score: 78)
        └── Compliance check (100%)

✅ Build complete in 4m 23s
```

### Error Recovery System

```yaml
# kb/error-handlers.yaml
handlers:
  database_connection:
    pattern: "Error establishing a database connection"
    severity: critical
    actions:
      - wait: 10
      - command: "docker-compose restart db"
      - wait: 15
      - retry: true
    max_retries: 3
    fallback: "Database failed to start. Check Docker logs."

  permission_denied:
    pattern: "Permission denied"
    severity: warning
    actions:
      - command: "docker exec {{container}} chown -R www-data:www-data /var/www/html/wp-content"
      - command: "docker exec {{container}} chmod -R 755 /var/www/html/wp-content"
      - retry: true

  port_in_use:
    pattern: "port is already allocated"
    severity: warning
    actions:
      - command: "docker stop $(docker ps -q --filter publish={{port}}) 2>/dev/null || true"
      - wait: 2
      - retry: true

  plugin_install_failed:
    pattern: "Plugin installation failed"
    severity: warning
    actions:
      - command: "docker exec {{container}} wp plugin install {{plugin}} --force --allow-root"
      - retry: true
    max_retries: 2

  npm_install_failed:
    pattern: "npm ERR!"
    severity: warning
    actions:
      - command: "rm -rf node_modules package-lock.json"
      - command: "npm install"
      - retry: true
```

### Compliance Checker

```typescript
// Compliance validation against KB requirements
interface ComplianceReport {
  score: number;           // 0-100
  passed: boolean;         // score >= threshold
  categories: {
    architecture: CategoryResult;
    security: CategoryResult;
    performance: CategoryResult;
    seo: CategoryResult;
    testing: CategoryResult;
  };
  recommendations: string[];
}

// KB requirements codified
const KB_REQUIREMENTS = {
  architecture: {
    theme_exists: { required: true, weight: 10 },
    plugin_exists: { required: true, weight: 10 },
    cpts_in_plugin: { required: true, weight: 10 },
    no_functionality_in_theme: { required: true, weight: 5 },
  },
  security: {
    disallow_file_edit: { required: true, weight: 10 },
    xmlrpc_disabled: { required: true, weight: 5 },
    security_headers: { required: true, weight: 10 },
    input_sanitization: { required: true, weight: 10 },
    output_escaping: { required: true, weight: 10 },
  },
  performance: {
    lighthouse_score: { threshold: 70, weight: 15 },
    ttfb_ms: { threshold: 200, weight: 10 },
    css_size_kb: { threshold: 20, weight: 5 },
    critical_css: { required: true, weight: 5 },
  },
  seo: {
    yoast_installed: { required: true, weight: 5 },
    sitemap_exists: { required: true, weight: 5 },
    schema_configured: { required: false, weight: 3 },
  },
  testing: {
    e2e_tests_exist: { required: true, weight: 5 },
    e2e_tests_passing: { required: true, weight: 10 },
  },
};
```

### LLM Touchpoints (Minimal)

| Touchpoint | When | Purpose |
|------------|------|---------|
| Discovery | `wpf discover` | Generate config from guided prompts |
| Content Enhancement | `wpf enhance --ai` | Optional: AI-generated copy |
| Troubleshooting | `wpf doctor --ai` | Only when automated recovery fails |

**Everything else is deterministic - no LLM needed.**

### Dependencies

```json
{
  "dependencies": {
    "commander": "^12.0.0",
    "inquirer": "^9.2.0",
    "chalk": "^5.3.0",
    "ora": "^8.0.0",
    "yaml": "^2.4.0",
    "zod": "^3.23.0",
    "ejs": "^3.1.10",
    "execa": "^8.0.0",
    "fs-extra": "^11.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/ejs": "^3.1.5",
    "@types/fs-extra": "^11.0.4",
    "@types/inquirer": "^9.0.7",
    "typescript": "^5.4.0",
    "tsx": "^4.7.0",
    "vitest": "^1.4.0",
    "@playwright/test": "^1.56.0"
  }
}
```

### Migration from v1

1. Keep existing `modules/` for SaaS platform (billing, auth)
2. Replace `modules/orchestrator/` with new `src/core/`
3. Move templates from TypeScript strings to `_templates/` EJS files
4. Add `kb/requirements.yaml` from WordPress KB
5. Update CLI from bash scripts to TypeScript Commander.js
