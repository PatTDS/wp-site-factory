# Project Context

## Purpose

WPF (WordPress Site Factory) is a CLI-driven framework for rapidly creating production-ready WordPress websites. It systematizes the entire WordPress website creation lifecycle - from client discovery through production deployment.

**Goal:** Create professional websites from initial concept to production deployment in the shortest possible time.

**Target Users:** Solo developers, freelancers, small agencies building WordPress sites for clients.

## Tech Stack

- **Shell:** Bash scripts (CLI framework)
- **Containerization:** Docker/Docker Compose
- **CMS:** WordPress 6.7+ (PHP 8.0+)
- **CSS:** Tailwind CSS 3.4.0
- **Database:** MySQL 8.0
- **Testing:** Playwright (E2E), Lighthouse (performance)
- **CLI Tools:** WP-CLI, ImageMagick, npm/Node.js 20+
- **Deployment:** SFTP, FTP, rsync (host-agnostic)

## Project Conventions

### Code Style

**Shell Scripts:**
- Use `set -e` for fail-fast
- Source shared libraries from `lib/`
- Use color variables for output (RED, GREEN, YELLOW, CYAN, NC)
- Functions should be prefixed with module name (e.g., `registry_add`, `learnings_capture`)

**PHP (WordPress):**
- WordPress Coding Standards (WPCS)
- PHP 8.0+ syntax with type hints
- Always sanitize input (`wp_sanitize_*`)
- Always escape output (`esc_*`)
- Use nonces for forms

**CSS:**
- Tailwind CSS utility classes over custom CSS
- Mobile-first approach
- Build before deployment (`npm run build`)

### Architecture Patterns

**CLI Structure:**
```
bin/wpf           # Entry point, routes to commands
cli/*.sh          # Individual command implementations
lib/*.sh          # Shared libraries (registry, learnings, config)
lib/providers/*.sh # Deployment providers (sftp, ftp, rsync)
```

**Template System:**
- Templates use `{{PLACEHOLDER}}` syntax
- Placeholders replaced during project creation
- Industry templates in `templates/industries/`

**Project Registry:**
- JSON-based registry at `.wpf-registry.json`
- Projects tracked by name, path, company, domain
- Supports projects anywhere on filesystem

**Knowledge System:**
- External KB at `\\wsl.localhost\Ubuntu\home\atric\wordpress-knowledge-base\`
- Local learnings captured in `learnings/` directory
- Learnings merged to KB via `wpf knowledge merge`

### Testing Strategy

- E2E tests with Playwright for critical user flows
- Lighthouse performance audits (target: 70+)
- Manual verification via `wpf verify` command
- Test on staging before production

### Git Workflow

- Trunk-based development
- Feature branches live max 1-3 days
- Conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
- Never commit directly to main

## Domain Context

**WordPress Development:**
- Theme + companion plugin pattern (WordPress.org requirement)
- Custom Post Types in plugins, never in themes
- Performance: LCP < 2.5s, CLS < 0.1
- SEO: Local Business schema, structured data

**Client Workflow:**
1. Discovery - Gather requirements via questionnaire
2. Create - Scaffold project from templates
3. Build - Compile assets, configure plugins
4. Deploy - Push to staging/production
5. Verify - Run tests, check performance

## Important Constraints

- **No API keys in repo** - Use `.wpf-config` for credentials
- **Docker required** - Development environment runs in containers
- **WP-CLI needed** - Automation depends on WP-CLI
- **Performance targets** - Lighthouse 70+ is minimum acceptable
- **Security** - OWASP best practices, input sanitization, output escaping

## External Dependencies

- **Docker Hub:** WordPress, MySQL, phpMyAdmin images
- **npm:** Tailwind CSS, Playwright
- **WordPress.org:** Plugin repository
- **External KB:** `\\wsl.localhost\Ubuntu\home\atric\wordpress-knowledge-base\`
- **Hosting providers:** Locaweb (Brazil), generic SFTP/FTP hosts
