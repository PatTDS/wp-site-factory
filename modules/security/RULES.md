# Security Module Rules

## WordPress Hardening

### wp-config.php Settings
```php
// Required security constants
define('DISALLOW_FILE_EDIT', true);
define('FORCE_SSL_ADMIN', true);
define('WP_DEBUG', false);
define('WP_DEBUG_LOG', false);
define('WP_DEBUG_DISPLAY', false);
```

### File Permissions
| Path | Permission |
|------|------------|
| Directories | 755 |
| Files | 644 |
| wp-config.php | 600 |
| .htaccess | 644 |

### .htaccess Security
```apache
# Block access to sensitive files
<FilesMatch "\.(env|log|sql|ini)$">
    Order allow,deny
    Deny from all
</FilesMatch>

# Disable XML-RPC
<Files xmlrpc.php>
    Order deny,allow
    Deny from all
</Files>

# Disable directory browsing
Options -Indexes
```

## Security Headers

### Required Headers
```apache
Header set X-Content-Type-Options "nosniff"
Header set X-Frame-Options "SAMEORIGIN"
Header set X-XSS-Protection "1; mode=block"
Header set Referrer-Policy "strict-origin-when-cross-origin"
Header set Permissions-Policy "geolocation=(), microphone=(), camera=()"
```

### HTTPS Headers
```apache
Header set Strict-Transport-Security "max-age=31536000; includeSubDomains"
```

## SSL/HTTPS

### Requirements
- TLS 1.2 or higher
- Strong cipher suites
- Valid SSL certificate
- HTTP → HTTPS redirect
- HSTS enabled

### Certificate Renewal
- Monitor expiration dates
- Auto-renew with Let's Encrypt
- Test after renewal

## Backup Rules

### Frequency
| Type | Frequency | Retention |
|------|-----------|-----------|
| Database | Daily | 30 days |
| Files | Weekly | 4 weeks |
| Full site | Monthly | 12 months |

### Backup Requirements
- Store offsite (not on same server)
- Encrypt sensitive data
- Test restore process quarterly
- Document restoration steps

## Vulnerability Scanning

### Checks Required
- WordPress core integrity
- Plugin/theme vulnerabilities
- Malware detection
- File permission audit
- Database security

### Scan Frequency
- Daily: Core integrity check
- Weekly: Full vulnerability scan
- After updates: Immediate scan

## Prohibited Actions

### NEVER
- Store credentials in code
- Use weak passwords
- Skip security updates
- Disable security features in production
- Allow PHP execution in uploads
- Use FTP (use SFTP)

### ALWAYS
- Sanitize user input (`wp_sanitize_*`)
- Escape output (`esc_*`)
- Use nonces for forms
- Keep everything updated
- Use strong passwords
- Enable 2FA for admins

## Incident Response

### If Compromised
1. Take site offline
2. Create backup of current state (for analysis)
3. Restore from clean backup
4. Change all passwords
5. Update all components
6. Review access logs
7. Document incident

## Knowledge Base Reference

- `@wordpress-knowledge-base/security/howto-security-hardening.md`
- `@wordpress-knowledge-base/security/ref-security-checklist.md`
- `@wordpress-knowledge-base/security/howto-security-headers.md`
