# Tools Module Rules

## CLI Standards

### Command Structure
- Commands use subcommand pattern: `wpf <command> [subcommand] [args]`
- All commands must have `--help` option
- Exit codes: 0 (success), 1 (error), 2 (blocked by hook)
- Output colors: RED (error), GREEN (success), YELLOW (warning), CYAN (info)

### Script Requirements
```bash
#!/bin/bash
# Script description
# Usage: wpf command [args]

set -e  # Exit on error
WPF_ROOT="${WPF_ROOT:-/home/atric/wp-site-factory}"
source "$WPF_ROOT/lib/common.sh"

# Script logic...
```

### Function Naming
- CLI commands: `cmd_<action>` (e.g., `cmd_create`, `cmd_list`)
- Library functions: `<module>_<action>` (e.g., `registry_add`, `docker_start`)
- Helper functions: `_<name>` for private functions

## Docker Standards

### docker-compose.yml
- Use version 3.8+
- Define explicit networks
- Use named volumes for persistence
- Include healthchecks
- Environment variables via `.env` file

### Port Conventions
| Service | Default Port |
|---------|-------------|
| WordPress | 8080 |
| phpMyAdmin | 8081 |
| MySQL | 3306 |
| Redis | 6379 |

### Volume Mounts
- `./wp-content/themes` → `/var/www/html/wp-content/themes`
- `./wp-content/plugins` → `/var/www/html/wp-content/plugins`
- Named volume for database: `db_data`

## Deployment Standards

### Safety Rules
- NEVER deploy to production without staging validation
- ALWAYS create backup before deployment
- NEVER store credentials in scripts (use `.env` or secrets)
- ALWAYS verify deployment with health check

### Deployment Flow
1. Create backup
2. Sync files (rsync)
3. Run database migrations
4. Clear caches
5. Verify health check
6. Rollback on failure

## Registry Standards

### .wpf-registry.json Structure
```json
{
  "version": "1.0",
  "projects": {
    "project-name": {
      "path": "/absolute/path",
      "created": "2025-01-01T00:00:00Z",
      "status": "active",
      "type": "wordpress"
    }
  }
}
```

### Project States
- `draft` - Initial creation
- `active` - In development
- `staging` - Deployed to staging
- `production` - Deployed to production
- `archived` - No longer active

## Error Handling

```bash
# Standard error output
echo -e "${RED}Error: Description${NC}" >&2
exit 1

# Warning (continue execution)
echo -e "${YELLOW}Warning: Description${NC}"

# Success message
echo -e "${GREEN}✓ Action completed${NC}"
```

## Knowledge Base Reference

- `@wordpress-knowledge-base/tools/ref-wp-cli-commands.md`
- `@wordpress-knowledge-base/tools/howto-docker-wordpress.md`
- `@wordpress-knowledge-base/tools/howto-deployment-automation.md`
