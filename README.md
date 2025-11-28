# WPF - WordPress Site Factory

**Version: 0.2.0-beta**

Rapidly create production-ready WordPress websites from development to deployment.

## Status: Beta

This project is in active development. All features are functional but being refined through real-world usage (tested on NatiGeo project). Report issues and contribute learnings to improve WPF.

## Features

- 🚀 **CLI-driven workflow** - Simple commands for complex tasks
- 🎯 **Full automation** - From discovery to deployment in one command
- 📚 **Built-in knowledge base** - WordPress, web design, deployment best practices
- 🎨 **Tailwind CSS templates** - Modern, responsive themes ready to customize
- ⚡ **Performance optimization** - Auto-configure Autoptimize, Redis, ShortPixel
- 🔍 **SEO ready** - Rank Math configuration with Local Business schema
- 🧪 **Testing included** - Playwright E2E + Lighthouse performance
- 🔐 **Security first** - Best practices baked in
- 📦 **Docker ready** - Consistent development environments
- 🗄️ **Project registry** - Track projects anywhere on your filesystem
- 📝 **Learning capture** - Record insights and improve knowledge base

## Quick Start

```bash
# Add to PATH
export PATH="$PATH:/home/atric/wp-site-factory/bin"

# Full automation - creates complete site
wpf auto

# Or step by step:
wpf create my-company    # Create project
wpf build all            # Build assets
wpf optimize all         # Configure plugins
wpf deploy staging       # Deploy to staging
wpf verify all           # Verify deployment
```

## Commands

### Project Management

| Command | Description |
|---------|-------------|
| `wpf` | Interactive menu (no arguments) |
| `wpf create <name>` | Create new project with interactive setup |
| `wpf continue <name>` | Resume work on existing project |
| `wpf discover` | Interactive discovery wizard for configuration |
| `wpf list` | List all registered projects |
| `wpf register <path>` | Register an existing project |

### Build & Development

| Command | Description |
|---------|-------------|
| `wpf build [target]` | Build assets (css, images, critical, watch, all) |
| `wpf optimize [target]` | Configure plugins (seo, cache, images, email, all) |
| `wpf content [cmd]` | Generate content (prompts, pages, services, generate) |

### Testing & Deployment

| Command | Description |
|---------|-------------|
| `wpf test [target]` | Run E2E and performance tests |
| `wpf deploy <env>` | Deploy to staging or production |
| `wpf verify [target]` | Verify deployment (smoke, files, performance, all) |
| `wpf backup` | Create full project backup |
| `wpf doctor` | Health check for current project |

### Automation

| Command | Description |
|---------|-------------|
| `wpf auto` | Full automation: discover → create → build → deploy |
| `wpf auto --quick` | Quick mode with defaults |
| `wpf auto --skip-deploy` | Skip deployment step |

### Knowledge System

| Command | Description |
|---------|-------------|
| `wpf knowledge` | Browse the knowledge base |
| `wpf learn` | Capture a new learning/insight |
| `wpf knowledge review` | Review pending learnings |

## New in v0.2.0

### Build Pipeline
```bash
wpf build css        # Compile Tailwind CSS
wpf build images     # Optimize images (ImageMagick + WebP)
wpf build critical   # Generate critical CSS
wpf build watch      # Watch mode for development
wpf build all        # Run all build steps
```

### Plugin Optimization
```bash
wpf optimize plugins  # Install performance plugins
wpf optimize seo      # Configure Rank Math (Local Business schema)
wpf optimize cache    # Configure Autoptimize + Redis
wpf optimize images   # Configure ShortPixel
wpf optimize email    # Configure WP Mail SMTP
wpf optimize all      # Run all optimizations
```

### Deployment Verification
```bash
wpf verify smoke       # HTTP status checks
wpf verify files       # Compare local vs remote files
wpf verify performance # Check TTFB, load time, page size
wpf verify security    # Check headers, HTTPS
wpf verify all         # Full verification suite
```

### Workflow Integration
```bash
wpf deploy staging --build    # Build before deploy
wpf deploy staging --verify   # Verify after deploy
wpf deploy staging --full     # Build + Deploy + Verify
wpf deploy staging --dry-run  # Preview without changes
```

### Discovery Wizard
```bash
wpf discover          # Full interactive questionnaire
wpf discover --quick  # Essential fields only
wpf discover --json   # Output JSON for AI content
```

### Content Generation
```bash
wpf content prompts   # Generate AI prompts for content
wpf content pages     # Create page structure
wpf content services  # Create service entries
wpf content generate  # All of the above
```

## Project Structure

```
wp-site-factory/
├── bin/wpf              # CLI entry point
├── cli/                 # Command implementations
│   ├── create.sh        # Project creation
│   ├── build.sh         # Asset compilation
│   ├── optimize.sh      # Plugin configuration
│   ├── deploy.sh        # Deployment with workflow
│   ├── verify.sh        # Deployment verification
│   ├── discover.sh      # Discovery wizard
│   ├── content.sh       # Content generation
│   ├── auto.sh          # Full automation
│   └── ...
├── lib/                 # Shared libraries
│   ├── registry.sh      # Project registry management
│   ├── config.sh        # Configuration helpers
│   ├── hosting.sh       # Hosting abstraction layer
│   └── providers/       # SFTP, FTP, rsync providers
├── templates/           # Project templates
│   ├── docker/          # Docker configs
│   ├── theme/           # Tailwind CSS theme
│   ├── plugin/          # Custom post types plugin
│   ├── tests/           # Playwright tests
│   └── scripts/         # Plugin configuration scripts
├── knowledge/           # Best practices & guides
├── learnings/           # Captured learnings
├── prompts/             # AI guidance prompts
└── projects/            # WPF-created projects
```

## Workflow

### Manual Workflow
1. **Discover** - `wpf discover` to gather requirements
2. **Create** - `wpf create <name>` to scaffold project
3. **Build** - `wpf build all` to compile assets
4. **Develop** - Customize theme, add content
5. **Optimize** - `wpf optimize all` to configure plugins
6. **Test** - `wpf test` for quality assurance
7. **Deploy** - `wpf deploy staging --verify`
8. **Verify** - `wpf verify all` to confirm

### Automated Workflow
```bash
wpf auto --quick   # Everything in one command
```

## Configuration

Project configuration is stored in `.wpf-config`:

```bash
# Project basics
PROJECT_NAME="my-project"
COMPANY_NAME="My Company"
DOMAIN="example.com"

# Hosting (SFTP, FTP, or rsync)
HOSTING_PROVIDER="sftp"
HOSTING_HOST="ftp.example.com"
HOSTING_USER="deploy"
HOSTING_PATH="/public_html"

# Business info (for SEO/Schema)
BUSINESS_CITY="São Paulo"
BUSINESS_STATE="SP"
BUSINESS_PHONE="+55 11 1234-5678"
BUSINESS_EMAIL="contact@example.com"
BUSINESS_HOURS="Mo-Fr 08:00-18:00"

# API keys
SHORTPIXEL_API_KEY="your-key"
```

## Requirements

- Docker & Docker Compose
- Node.js 20+
- Bash shell
- npm (for Tailwind CSS)
- ImageMagick (for image optimization)
- sshpass (for SFTP deployment)

## Installation

```bash
git clone <repo-url> ~/wp-site-factory
chmod +x ~/wp-site-factory/bin/wpf
echo 'export PATH="$PATH:~/wp-site-factory/bin"' >> ~/.bashrc
source ~/.bashrc

# Verify installation
wpf version
```

## Performance Targets

| Metric | Target | Tool |
|--------|--------|------|
| Lighthouse Score | > 70 | `wpf verify performance` |
| Time to First Byte | < 1.0s | `wpf verify performance` |
| Total Load Time | < 2.0s | `wpf verify performance` |
| Page Size | < 500KB | `wpf verify performance` |

## Host-Agnostic Deployment

WPF supports multiple hosting providers:

| Provider | Use Case | Command |
|----------|----------|---------|
| SFTP | Shared hosting (Locaweb, HostGator) | Default |
| FTP | Legacy hosts | `HOSTING_PROVIDER="ftp"` |
| rsync | VPS, cloud servers | `HOSTING_PROVIDER="rsync"` |

## Documentation

- `CLAUDE.md` - AI instructions and full documentation
- `ENHANCEMENT_PLAN.md` - Development roadmap
- `CHANGELOG.md` - Version history
- `knowledge/` - Best practices guides

## Changelog

### v0.2.0-beta (2025-11-28)
- Added `wpf build` - Asset compilation pipeline
- Added `wpf optimize` - Plugin auto-configuration
- Added `wpf verify` - Deployment verification
- Added `wpf discover` - Interactive discovery wizard
- Added `wpf content` - Content generation
- Added `wpf auto` - Full automation mode
- Added workflow integration flags to deploy
- Added template scripts for plugins
- Enhanced configuration template

### v0.1.0-beta
- Initial release
- Project management commands
- Docker templates
- Theme and plugin templates
- Knowledge base system

## License

MIT

---

*Built from lessons learned on real WordPress projects (NatiGeo).*
*Version 0.2.0-beta - Under active development*
