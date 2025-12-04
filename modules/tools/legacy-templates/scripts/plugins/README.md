# Plugin Configuration Templates

These PHP scripts configure WordPress plugins automatically based on your `.wpf-config` settings.

## Available Scripts

| Script | Plugin | Purpose |
|--------|--------|---------|
| `configure-rank-math.php` | Rank Math SEO | Local Business schema, SEO settings |
| `configure-autoptimize.php` | Autoptimize | CSS/JS optimization, defer loading |
| `configure-shortpixel.php` | ShortPixel | Image optimization, WebP generation |
| `configure-redis.php` | Redis Cache | Object caching for performance |
| `configure-wp-mail-smtp.php` | WP Mail SMTP | Email delivery configuration |

## Usage

### Method 1: WP-CLI (Recommended)
```bash
# From project directory
wp eval-file wp-content/configure-rank-math.php
wp eval-file wp-content/configure-autoptimize.php
wp eval-file wp-content/configure-shortpixel.php
wp eval-file wp-content/configure-redis.php
wp eval-file wp-content/configure-wp-mail-smtp.php
```

### Method 2: Via Browser
```
http://localhost:8080/wp-content/configure-rank-math.php
```
(Requires admin login)

### Method 3: Via WPF CLI
```bash
wpf optimize all
```

## Configuration Variables

These scripts read variables from `.wpf-config`. Add these to your config:

### For Rank Math (Local SEO)
```bash
BUSINESS_STREET="123 Main St"
BUSINESS_CITY="São Paulo"
BUSINESS_STATE="SP"
BUSINESS_POSTAL_CODE="01234-567"
BUSINESS_COUNTRY="BR"
BUSINESS_PHONE="+55 11 1234-5678"
BUSINESS_EMAIL="contato@example.com"
BUSINESS_LATITUDE="-23.5505"
BUSINESS_LONGITUDE="-46.6333"
BUSINESS_HOURS="Mo-Fr 08:00-18:00"
BUSINESS_TYPE="ProfessionalService"
```

### For ShortPixel
```bash
SHORTPIXEL_API_KEY="your-api-key"
```

### For SMTP
```bash
SMTP_FROM_EMAIL="noreply@example.com"
SMTP_MAILER="smtp"
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="user@example.com"
SMTP_PASS="password"
SMTP_ENCRYPTION="tls"
```

## Template Variables

Scripts use `{{VARIABLE_NAME}}` placeholders that are replaced during project setup:

- `{{PROJECT_NAME}}` - Project identifier
- `{{COMPANY_NAME}}` - Business name
- `{{DOMAIN}}` - Primary domain
- `{{BUSINESS_*}}` - Business information
- `{{SHORTPIXEL_API_KEY}}` - ShortPixel API key
- `{{SMTP_*}}` - SMTP settings

## Security Notes

1. Scripts require admin privileges when run via browser
2. API keys should be stored in environment variables or credentials file
3. Never commit passwords to version control
