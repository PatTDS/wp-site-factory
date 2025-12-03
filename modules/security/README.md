# WPF Security Module

**Branch:** `module/security`
**Knowledge Base:** `@wordpress-knowledge-base/security/`
**Status:** Planned

## Overview

The security module handles WordPress hardening, vulnerability scanning, SSL configuration, and backup automation.

## Features

- **Hardening** - wp-config.php, .htaccess security
- **Scanning** - Vulnerability detection
- **SSL/HTTPS** - Certificate management
- **Headers** - Security headers configuration
- **Backups** - Automated backup system

## Directory Structure

```
modules/security/
├── src/
│   ├── hardening/      # Hardening scripts
│   ├── scanning/       # Security scanners
│   ├── ssl/            # SSL configuration
│   └── backup/         # Backup automation
├── lib/
│   ├── harden.sh       # Hardening helpers
│   ├── scan.sh         # Scanning helpers
│   └── backup.sh       # Backup helpers
├── tests/
│   └── security/       # Security tests
├── README.md
├── RULES.md
└── CLAUDE.md
```

## Commands

```bash
wpf security audit <project>   # Security audit
wpf security harden <project>  # Apply hardening
wpf security scan <project>    # Vulnerability scan
wpf security backup <project>  # Create backup
```

## Security Checklist

- [ ] wp-config.php secured
- [ ] File permissions correct
- [ ] XML-RPC disabled
- [ ] Security headers enabled
- [ ] SSL/HTTPS configured
- [ ] Regular backups enabled

## Dependencies

- WP-CLI 2.9+
- OpenSSL
- Security scanning tools

## Related Modules

- **tools** - Deployment security
- **infrastructure** - Server hardening
- **platform** - User authentication
