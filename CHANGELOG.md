# Changelog

All notable changes to WPF (WordPress Site Factory) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0-beta] - 2025-11-28

### Added

#### Core Features
- Interactive CLI menu when running `wpf` without arguments
- Project creation wizard (`wpf create`) with comprehensive discovery phase
- Project continuation (`wpf continue`) with Docker status check
- Project listing (`wpf list`) showing all registered projects

#### Project Registry System
- Central registry file (`.wpf-registry.json`) for tracking all projects
- Register existing projects from any location (`wpf register`)
- Unregister projects (`wpf unregister`)
- Projects tracked with metadata: name, path, company, domain, status
- Support for both jq and fallback parsing

#### Knowledge Learning System
- Capture learnings during development (`wpf learn`)
- Review pending learnings (`wpf knowledge review`)
- Merge learnings into knowledge base (`wpf knowledge merge`)
- Five categories: wordpress, webdesign, deployment, performance, testing
- Priority levels: low, medium, high
- Timestamped learning files with safe filenames

#### Library Functions
- `lib/registry.sh` - Registry management functions
  - `registry_init`, `registry_add`, `registry_remove`
  - `registry_exists`, `registry_get_path`, `registry_get`
  - `registry_list`, `registry_count`, `registry_update`
  - `registry_archive`, `registry_list_active`, `registry_validate`
- `lib/learnings.sh` - Learning capture functions
  - `learnings_init`, `learnings_add`, `learnings_list`
  - `learnings_count`, `learnings_get`, `learnings_mark_merged`
  - `learnings_delete`, `learnings_summary`, `learnings_append_to_knowledge`

#### CLI Commands
- `wpf` - Interactive menu (12 options)
- `wpf create <name>` - Create new project
- `wpf continue <name>` - Continue existing project
- `wpf list` - List all projects
- `wpf register <path> [name]` - Register existing project
- `wpf unregister <name>` - Remove from registry
- `wpf deploy <staging|production>` - Deploy project
- `wpf test` - Run tests
- `wpf backup` - Create backup
- `wpf doctor` - Health check
- `wpf knowledge` - Browse knowledge base
- `wpf knowledge review` - Review learnings
- `wpf knowledge merge` - Merge learnings
- `wpf learn [category] [title]` - Capture learning
- `wpf help` - Show help
- `wpf version` - Show version

#### Knowledge Base
- WordPress best practices and troubleshooting
- Web design guidelines
- Deployment workflows
- Performance optimization guides
- Testing strategies

#### Templates
- Docker configuration for WordPress development
- Base theme with Tailwind CSS
- Base plugin structure
- Playwright test suite template

#### Documentation
- README.md with full feature documentation
- CLAUDE.md with AI instructions
- CHANGELOG.md for version tracking

### Technical Details
- Bash-based CLI framework
- Docker/Docker Compose for development environments
- JSON registry with jq support (optional)
- Markdown-based learning capture
- Auto-registration on project creation

### Notes
- Beta release - under active development
- Based on lessons learned from NatiGeo project
- Requires Docker, Node.js 20+, and Bash shell
- jq recommended but not required for registry

---

## Roadmap

### Planned for v0.2.0
- [ ] Automated testing integration improvements
- [ ] Enhanced deployment scripts for more hosting providers
- [ ] Project archival and cleanup commands
- [ ] Learning search and filtering
- [ ] Statistics and reporting

### Future Considerations
- [ ] SaaS version with cloud features
- [ ] Web-based dashboard
- [ ] Team collaboration features
- [ ] Automated backup scheduling
- [ ] Plugin update monitoring
