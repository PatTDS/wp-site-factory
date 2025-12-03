# AI Instructions: Tools Module

## Purpose

This module provides the core CLI framework and development tooling for WPF.

## When Working in This Module

1. **Always** test commands before committing
2. **Follow** Bash best practices (shellcheck)
3. **Document** all new commands in help text
4. **Maintain** backward compatibility

## Creating New Commands

1. Create script in `cli/<command>.sh`
2. Add to `bin/wpf` command router
3. Include help text
4. Add to README.md command table

### Command Template

```bash
#!/bin/bash
# WPF <Command> - Short description

set -e

WPF_ROOT="${WPF_ROOT:-/home/atric/wp-site-factory}"
source "$WPF_ROOT/lib/common.sh"

show_usage() {
    echo "Usage: wpf <command> [options]"
    echo ""
    echo "Options:"
    echo "  --help    Show this help"
}

cmd_action() {
    local arg=$1
    # Implementation
}

case "${1:-}" in
    --help|-h)
        show_usage
        ;;
    *)
        cmd_action "$@"
        ;;
esac
```

## Docker Patterns

### Starting Environment
```bash
docker-compose up -d
docker-compose logs -f wordpress  # Watch logs
```

### Running WP-CLI
```bash
docker exec -it <container> wp <command> --allow-root
```

### Database Operations
```bash
# Export
docker exec <db_container> mysqldump -u root -p<password> wordpress > backup.sql

# Import
docker exec -i <db_container> mysql -u root -p<password> wordpress < backup.sql
```

## Registry Operations

```bash
# Add project
source "$WPF_ROOT/lib/registry.sh"
registry_add "project-name" "/path/to/project"

# Get project path
registry_get_path "project-name"

# List all projects
registry_list
```

## Common Patterns

### Color Output
```bash
echo -e "${RED}Error${NC}"
echo -e "${GREEN}Success${NC}"
echo -e "${YELLOW}Warning${NC}"
echo -e "${CYAN}Info${NC}"
echo -e "${BOLD}Bold text${NC}"
```

### User Confirmation
```bash
read -p "Are you sure? (y/N): " confirm
if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
    echo "Aborted."
    exit 0
fi
```

### Check Dependencies
```bash
command -v docker >/dev/null 2>&1 || {
    echo -e "${RED}Error: Docker is required${NC}"
    exit 1
}
```

## Do Not

- Hardcode paths (use `$WPF_ROOT`)
- Store credentials in scripts
- Skip error handling
- Create commands without help text
- Deploy without backup
