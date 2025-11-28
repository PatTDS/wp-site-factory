# WPF - WordPress Site Factory

Rapidly create production-ready WordPress websites from development to deployment.

## Features

- 🚀 **CLI-driven workflow** - Simple commands for complex tasks
- 📚 **Built-in knowledge base** - WordPress, web design, deployment best practices
- 🎨 **Tailwind CSS templates** - Modern, responsive themes ready to customize
- 🧪 **Testing included** - Playwright E2E + Lighthouse performance
- 🔐 **Security first** - Best practices baked in
- 📦 **Docker ready** - Consistent development environments

## Quick Start

```bash
# Add to PATH
export PATH="$PATH:/home/atric/wp-site-factory/bin"

# Create a new project
wpf create my-company

# Follow the interactive prompts to configure your project
```

## Commands

| Command | Description |
|---------|-------------|
| `wpf create <name>` | Create new project with interactive setup |
| `wpf continue <name>` | Resume work on existing project |
| `wpf list` | List all projects |
| `wpf deploy <env>` | Deploy to staging or production |
| `wpf test` | Run E2E and performance tests |
| `wpf backup` | Create full project backup |
| `wpf doctor` | Health check for current project |
| `wpf knowledge` | Browse the knowledge base |

## Project Structure

```
wp-site-factory/
├── bin/wpf              # CLI entry point
├── cli/                 # Command implementations
├── knowledge/           # Best practices & guides
│   ├── wordpress/       # WP development
│   ├── webdesign/       # UI/UX guidelines
│   ├── deployment/      # Hosting & deployment
│   ├── performance/     # Optimization
│   └── testing/         # Test strategies
├── templates/           # Project templates
│   ├── docker/          # Docker configs
│   ├── theme/           # Base WordPress theme
│   ├── plugin/          # Base plugin structure
│   └── tests/           # Playwright tests
├── prompts/             # AI guidance prompts
│   ├── discovery.md     # Project questions
│   ├── design.md        # Design decisions
│   └── pre-launch.md    # Launch checklist
└── projects/            # Your created projects
```

## Workflow

1. **Discovery** - Gather client requirements
2. **Create** - Run `wpf create` to scaffold project
3. **Develop** - Customize theme, add content
4. **Test** - Run `wpf test` for quality assurance
5. **Deploy** - Use `wpf deploy` for staging/production

## Requirements

- Docker & Docker Compose
- Node.js 20+
- Bash shell
- sshpass (for SFTP deployment)

## Installation

```bash
git clone <repo-url> /home/atric/wp-site-factory
chmod +x /home/atric/wp-site-factory/bin/wpf
echo 'export PATH="$PATH:/home/atric/wp-site-factory/bin"' >> ~/.bashrc
source ~/.bashrc
```

## Knowledge Base

The `knowledge/` directory contains validated best practices:

- **WordPress**: Security, performance, plugin configuration
- **Web Design**: Tailwind CSS, accessibility, responsive design
- **Deployment**: Staging, production, rollback procedures
- **Performance**: Lighthouse optimization, Core Web Vitals
- **Testing**: E2E testing, accessibility audits

## Templates

Pre-built templates for rapid development:

- **Theme**: Tailwind CSS, responsive, accessible
- **Plugin**: Custom post types, taxonomies
- **Docker**: WordPress + MySQL + Redis + PHPMyAdmin
- **Tests**: Playwright E2E test suite

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Score | > 70 |
| LCP | < 2.5s |
| CLS | < 0.1 |
| Accessibility | > 90 |

## Security

All templates follow WordPress security best practices:
- Input sanitization
- Output escaping
- Nonce verification
- Secure file permissions
- Debug mode disabled in production

## Documentation

See `CLAUDE.md` for detailed AI instructions and full documentation.

## License

MIT

---

*Built from lessons learned on real WordPress projects.*
