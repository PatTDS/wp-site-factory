# WPF Tools Module

**Branch:** `module/tools`
**Knowledge Base:** `@wordpress-knowledge-base/tools/`
**Status:** Core Foundation

## Overview

The tools module provides the CLI framework, Docker environments, deployment automation, and development tooling.

## Features

- **CLI Framework** - `wpf` command-line interface
- **Project Registry** - Track and manage projects
- **Docker Environments** - Local WordPress development
- **Deployment** - Automated staging/production deployment
- **WP-CLI Integration** - WordPress command-line tools

## Directory Structure

```
modules/tools/
├── src/
│   ├── cli/            # CLI commands
│   ├── docker/         # Docker configurations
│   └── deploy/         # Deployment scripts
├── lib/
│   ├── registry.sh     # Project registry
│   ├── docker.sh       # Docker helpers
│   └── deploy.sh       # Deployment helpers
├── tests/
│   └── cli/            # CLI tests
├── README.md
├── RULES.md
└── CLAUDE.md
```

## Commands

```bash
# Project Management
wpf                      # Interactive menu
wpf create <name>        # Create new project
wpf continue <name>      # Resume project
wpf list                 # List all projects
wpf register <path>      # Register existing project

# Development
wpf doctor               # Health check
wpf backup               # Create backup

# Deployment
wpf deploy staging       # Deploy to staging
wpf deploy production    # Deploy to production
```

## Dependencies

- Bash 5.0+
- Docker & Docker Compose
- WP-CLI 2.9+
- jq (JSON processing)
- rsync (file sync)

## Related Modules

- **webdesign** - Design system integration
- **performance** - Optimization scripts
- **security** - Hardening scripts
- **infrastructure** - DevOps tooling
