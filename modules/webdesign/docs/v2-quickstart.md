# WPF v2.0 Quick Start Guide

## Overview

WPF v2.0 is a complete rewrite of the WordPress Site Factory, featuring:

- **Config-Driven Generation**: YAML configuration instead of LLM decision-making
- **100% KB Compliance**: Codified WordPress best practices
- **Automated Error Recovery**: Pre-defined handlers for common issues
- **TypeScript CLI**: Modern, type-safe tooling
- **EJS Templates**: Deterministic file generation

## Installation

```bash
# Navigate to WPF directory
cd /home/atric/wp-site-factory

# Install dependencies
npm install

# Build TypeScript
npm run build

# Add to PATH (add to ~/.bashrc for permanent)
export PATH="$PATH:/home/atric/wp-site-factory/bin"
```

## Commands

### Create New Configuration

```bash
wpf-ts discover
```

Interactive wizard that generates `wpf-config.yaml` with:
- Company information
- Contact details
- Branding (colors, fonts)
- Page structure

### Build a Site

```bash
# Build from project directory
wpf-ts build

# Build specific project
wpf-ts build my-project

# Build with options
wpf-ts build --skip-docker --verbose
```

Build steps:
1. Load and validate configuration
2. Generate theme files (PHP, CSS, JS)
3. Generate plugin files
4. Create Docker environment
5. Install WordPress
6. Configure plugins
7. Create content
8. Run E2E tests

### Validate Compliance

```bash
# Check against strict requirements
wpf-ts validate

# Check specific level
wpf-ts validate --level minimal
wpf-ts validate --level standard
wpf-ts validate --level strict

# JSON output for CI/CD
wpf-ts validate --json
```

### Environment Check

```bash
# Check environment health
wpf-ts doctor

# Auto-fix issues
wpf-ts doctor --fix
```

## Configuration

### Minimal Configuration

```yaml
project:
  name: my-company
  version: "1.0.0"

company:
  name: My Company Inc
  tagline: Building amazing solutions
  industry: technology

contact:
  email: info@mycompany.com
  phone: "+1-555-0100"
  address:
    city: San Francisco
    state: CA
    country: US

branding:
  primary_color: "#16a34a"
  secondary_color: "#15803d"
  font_family: Inter

pages:
  - slug: home
    title: Home
    template: front-page
```

### Full Configuration

See `examples/full.wpf-config.yaml` for all available options.

## Project Structure After Build

```
projects/my-company/
├── wpf-config.yaml       # Site configuration
├── docker-compose.yml    # Docker environment
├── .env                  # Environment variables
├── theme/                # Generated WordPress theme
│   ├── style.css
│   ├── functions.php
│   ├── header.php
│   ├── footer.php
│   ├── index.php
│   ├── front-page.php
│   ├── sections/
│   ├── tailwind.config.js
│   └── package.json
├── plugin/               # Generated companion plugin
│   ├── my-company-plugin.php
│   └── includes/
├── scripts/              # Utility scripts
│   └── setup-wordpress.sh
└── tests/                # E2E tests
    ├── pages.spec.ts
    └── playwright.config.ts
```

## Compliance Levels

| Level | Score Threshold | Description |
|-------|-----------------|-------------|
| Minimal | 50% | Basic security and structure |
| Standard | 75% | Production-ready site |
| Strict | 100% | Full KB compliance |

### Requirement Categories

- **Architecture**: Theme/plugin separation, proper structure
- **Security**: Sanitization, escaping, nonces
- **Performance**: Caching, asset optimization
- **SEO**: Schema markup, meta tags
- **Testing**: E2E coverage, accessibility

## Error Recovery

The system automatically handles common errors:

| Error | Auto-Recovery |
|-------|--------------|
| Database connection | Wait and retry with exponential backoff |
| Permission denied | Fix permissions via Docker exec |
| Port in use | Kill conflicting process |
| Plugin install failed | Skip and continue |
| npm install failed | Clear cache and retry |

## Migration from v1

```bash
# Run migration script
./scripts/migrate-to-v2.sh
```

This will:
1. Install dependencies
2. Build TypeScript
3. Migrate existing project configs
4. Set up PATH

## Templates

Templates are located in `_templates/`:

```
_templates/
├── theme/
│   ├── base/           # Core theme files
│   ├── pages/          # Page templates
│   └── sections/       # Section components
├── plugin/             # Plugin files
├── docker/             # Docker configuration
├── scripts/            # Setup scripts
└── tests/              # E2E test templates
```

Templates use EJS syntax:
- `<%= value %>` - Output escaped value
- `<%- value %>` - Output raw value
- `<% code %>` - Execute JavaScript

## Knowledge Base

Compliance requirements are codified in:

- `kb/requirements.yaml` - All KB requirements
- `kb/error-handlers.yaml` - Error recovery rules

## Development

```bash
# Run tests
npm test

# Run specific test
npm test -- config-loader

# Watch mode
npm run test:watch

# Type check
npm run type-check

# Lint
npm run lint
```

## Troubleshooting

### Build Fails

```bash
# Check environment
wpf-ts doctor --fix

# Verbose output
wpf-ts build --verbose
```

### Docker Issues

```bash
# Check Docker status
docker info

# Reset containers
docker-compose down -v
docker-compose up -d
```

### Template Errors

Check template syntax in `_templates/`. Common issues:
- Unclosed EJS tags
- Missing config properties
- Incorrect file paths

## Next Steps

1. Review `examples/` for configuration patterns
2. Customize templates for your needs
3. Add industry-specific sections
4. Create custom compliance rules

## Related Files

- `CLAUDE.md` - AI assistant instructions
- `openspec/` - Change management specs
- `kb/` - Knowledge base files
